// Suscripciones con Flow: el apoderado (o el estudiante de 14 o más) elige un
// plan, registra su tarjeta en la página de Flow y Flow cobra cada período.
//
// 1. POST /api/billing/checkout: crea el cliente en Flow (una vez) y pide el
//    registro de tarjeta; el navegador va a Flow.
// 2. Flow devuelve el navegador a /api/billing/card-return con un token. Esa
//    petición viene desde Flow, sin la cookie de sesión: el usuario se
//    identifica preguntándole a Flow de quién es ese registro.
// 3. Con la tarjeta registrada se crea la suscripción.
// 4. Lo pagado se lee siempre desde Flow (subscription/get): las facturas
//    pagadas definen hasta cuándo hay acceso (users.paid_until). Se consulta
//    cuando el acceso está por vencer, como máximo una vez por hora, y cuando
//    Flow avisa un pago. No se confía en lo que llega en el aviso.
import { flow, flowConfigured, flowDate, FlowError } from "./flow.js";

const HOUR = 3600_000;
const DAY = 86400_000;
// Días de gracia tras el fin del período pagado, mientras Flow reintenta.
export const GRACE_DAYS = 3;

// Mismos precios que la portada y public/access.js (PLANS).
export const PLANS = {
  "estudiante-mes": { plan: "estudiante", amount: 9990, interval: 3, name: "socatres · Plan Estudiante mensual" },
  "estudiante-anual": { plan: "estudiante", amount: 99900, interval: 4, name: "socatres · Plan Estudiante anual" },
  "familia-mes": { plan: "familia", amount: 18990, interval: 3, name: "socatres · Plan Familia mensual" },
  "familia-anual": { plan: "familia", amount: 149900, interval: 4, name: "socatres · Plan Familia anual" },
};
export const flowPlanId = (key) => `socatres-${key}`;
// Cuántos estudiantes de un apoderado cubre cada plan (los más antiguos).
export const SEATS = { estudiante: 1, familia: 3 };

const fail = (status, message) => {
  throw new FlowError(status, message);
};

// Quién paga: apoderados y estudiantes con cuenta propia (14 años o más).
// Los docentes van por un piloto con el colegio, no por tarjeta.
function assertPayer(user) {
  if (user.role === "teacher") fail(403, "Para cursos y equipos PIE conversamos un piloto con el colegio.");
  if (user.consent_by) fail(403, "Tu apoderado es quien activa el plan.");
}

export async function checkout(env, user, body, origin) {
  if (!flowConfigured(env)) fail(503, "El pago con tarjeta todavía no está disponible.");
  assertPayer(user);
  const key = String(body?.plan ?? "");
  if (!PLANS[key]) fail(400, "Elige un plan.");
  if (!user.email) fail(400, "Para pagar necesitas una cuenta con correo.");
  if (user.flow_subscription_id && Number(user.paid_until) > Date.now())
    fail(409, "Ya tienes un plan activo. Para cambiarlo, cancela el actual al final del período.");
  let customerId = user.flow_customer_id;
  if (!customerId) {
    const created = await flow(env, "POST", "customer/create", { name: user.name, email: user.email, externalId: user.id });
    customerId = String(created.customerId ?? "");
    if (!customerId) fail(502, "No pudimos hablar con Flow. Inténtalo de nuevo en un rato.");
    await env.DB.prepare("UPDATE users SET flow_customer_id = ? WHERE id = ?").bind(customerId, user.id).run();
  }
  await env.DB.prepare("UPDATE users SET plan_pending = ? WHERE id = ?").bind(key, user.id).run();
  const reg = await flow(env, "POST", "customer/register", { customerId, url_return: `${origin}/api/billing/card-return` });
  if (!reg.url || !reg.token) fail(502, "No pudimos hablar con Flow. Inténtalo de nuevo en un rato.");
  return { redirect: `${reg.url}?token=${encodeURIComponent(reg.token)}` };
}

// Vuelta desde Flow tras registrar la tarjeta. Devuelve a dónde mandar al
// navegador: la página de planes con el resultado.
export async function cardReturn(env, token) {
  const back = (result) => `/aprender?pago=${result}#planes`;
  if (!flowConfigured(env) || !token || String(token).length > 200) return back("error");
  const reg = await flow(env, "GET", "customer/getRegisterStatus", { token: String(token) });
  const user = reg.customerId
    ? await env.DB.prepare("SELECT * FROM users WHERE flow_customer_id = ?").bind(String(reg.customerId)).first()
    : null;
  if (!user) return back("error");
  if (String(reg.status) !== "1") return back("tarjeta");
  const key = user.plan_pending;
  if (!PLANS[key]) return back("error");
  // Volver a cargar esta página no crea otra suscripción.
  if (!(user.flow_subscription_id && Number(user.paid_until) > Date.now())) {
    const sub = await flow(env, "POST", "subscription/create", { planId: flowPlanId(key), customerId: user.flow_customer_id });
    if (!sub.subscriptionId) return back("error");
    await env.DB.prepare("UPDATE users SET flow_subscription_id = ?, plan = ?, plan_pending = NULL WHERE id = ?")
      .bind(String(sub.subscriptionId), PLANS[key].plan, user.id)
      .run();
    user.flow_subscription_id = String(sub.subscriptionId);
  }
  // El primer cobro puede tardar unos segundos: si aún no está, la página de
  // planes lo vuelve a consultar.
  await refreshSubscription(env, user, { force: true }).catch(() => {});
  return back("ok");
}

// Hasta cuándo cubre lo pagado, según las facturas pagadas de la suscripción.
// Formato de Flow (verificar en el ambiente de pruebas): status 1 activa,
// invoices[].status 1 pagada, fechas «AAAA-MM-DD hh:mm:ss».
export function paidUntilFrom(sub) {
  const invoices = Array.isArray(sub?.invoices) ? sub.invoices : [];
  const ends = invoices
    .filter((i) => Number(i?.status) === 1)
    .map((i) => flowDate(i.period_end))
    .filter(Number.isFinite);
  if (ends.length) return Math.max(...ends) + GRACE_DAYS * DAY;
  // Sin detalle de facturas: una suscripción activa cubre su período actual.
  if (!invoices.length && Number(sub?.status) === 1) {
    const end = flowDate(sub.period_end);
    return end ? end + GRACE_DAYS * DAY : null;
  }
  return null;
}

// Lee la suscripción en Flow y actualiza paid_until. Sin `force`, como
// máximo una vez por hora.
export async function refreshSubscription(env, user, { force = false, now = Date.now() } = {}) {
  if (!user.flow_subscription_id || !flowConfigured(env)) return null;
  if (!force && Number(user.billing_checked_at) > now - HOUR) return null;
  await env.DB.prepare("UPDATE users SET billing_checked_at = ? WHERE id = ?").bind(now, user.id).run();
  const sub = await flow(env, "GET", "subscription/get", { subscriptionId: user.flow_subscription_id });
  const paidUntil = paidUntilFrom(sub);
  // Nunca se acorta lo ya pagado por una respuesta incompleta.
  const next = Math.max(Number(user.paid_until) || 0, paidUntil ?? 0) || null;
  if (next !== (user.paid_until ?? null)) {
    await env.DB.prepare("UPDATE users SET paid_until = ? WHERE id = ?").bind(next, user.id).run();
    user.paid_until = next;
  }
  return sub;
}

// ¿Conviene consultar a Flow? Solo si hay suscripción y lo pagado está por
// vencer (o no se sabe todavía).
export const needsRefresh = (u, now = Date.now()) =>
  Boolean(u.flow_subscription_id) &&
  !(Number(u.paid_until) > now + DAY) &&
  !(Number(u.billing_checked_at) > now - HOUR);

export async function billingStatus(env, user) {
  const sub = user.flow_subscription_id ? await refreshSubscription(env, user, { force: true }).catch(() => null) : null;
  return {
    available: flowConfigured(env),
    canPay: user.role !== "teacher" && !user.consent_by,
    plan: user.plan ?? null,
    paidUntil: Number(user.paid_until) || null,
    active: Number(user.paid_until) > Date.now(),
    cancelAtPeriodEnd: sub ? Number(sub.cancel_at_period_end) === 1 : false,
  };
}

export async function cancelSubscription(env, user) {
  if (!user.flow_subscription_id) fail(404, "No tienes un plan activo.");
  // Se cancela al final del período: lo ya pagado se usa completo.
  await flow(env, "POST", "subscription/cancel", { subscriptionId: user.flow_subscription_id, at_period_end: 1 });
  return billingStatus(env, user);
}

// Aviso de Flow tras un cobro (urlCallback del plan): solo trae un token. Se
// pregunta a Flow por ese pago y se vuelve a leer la suscripción del cliente.
export async function paymentCallback(env, token) {
  if (!flowConfigured(env) || !token || String(token).length > 200) return;
  const payment = await flow(env, "GET", "payment/getStatus", { token: String(token) });
  const subscriptionId = payment.subscriptionId ?? payment.optional?.subscriptionId ?? null;
  const user = subscriptionId
    ? await env.DB.prepare("SELECT * FROM users WHERE flow_subscription_id = ?").bind(String(subscriptionId)).first()
    : payment.payer
      ? await env.DB.prepare("SELECT * FROM users WHERE email = ? AND flow_subscription_id IS NOT NULL").bind(String(payment.payer).toLowerCase()).first()
      : null;
  if (user) await refreshSubscription(env, user, { force: true });
  else console.error(JSON.stringify({ event: "flow_callback_unmatched", status: payment.status }));
}
