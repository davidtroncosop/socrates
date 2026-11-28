// Qué se muestra según el acceso que informa el servidor (ver
// functions/_lib/access.js): el aviso de los últimos días de prueba, la
// pantalla al vencer y los planes. Solo decide la pantalla: lo que tiene costo
// (la IA) lo protege el servidor.
import { escape, button } from "./ui.js";

const DAY = 86400000;
// Avisar solo en los últimos días, para no presionar antes de tiempo.
export const WARN_DAYS = 5;

// Los mismos planes y precios de la portada (public/index.html, #planes).
export const PLANS = [
  { id: "estudiante", name: "Plan Estudiante", month: "$9.990", year: "$99.900", detail: "Un estudiante, todo incluido." },
  { id: "familia", name: "Plan Familia", month: "$18.990", year: "$149.900", detail: "Hasta 3 estudiantes de la misma familia." },
];

export const daysLeft = (access, now = Date.now()) =>
  Number.isFinite(access?.endsAt) ? Math.max(0, Math.ceil((access.endsAt - now) / DAY)) : null;

// El estudiante no practica si vence la prueba; apoderados y docentes siguen
// viendo sus paneles. La demo y lo gratis nunca se bloquean.
export const practiceBlocked = (account) =>
  account?.mode === "account" && account.role === "student" && account.access?.status === "expired";

// Quién decide el pago: el estudiante de 14 o más que usa su propia prueba,
// o el apoderado o docente. Un menor no ve cuentas regresivas ni precios.
const pays = (account) => account.role !== "student" || (!account.managedByParent && account.access?.via === "self");

export function trialBanner(account, now = Date.now()) {
  const a = account?.access;
  if (account?.mode !== "account" || a?.status !== "trial" || !pays(account)) return "";
  const days = daysLeft(a, now);
  if (days === null || days > WARN_DAYS) return "";
  const when = days <= 1 ? "Hoy es tu último día" : `Te quedan ${days} días`;
  const action =
    account.role === "teacher"
      ? `<a class="secondary" href="/#colegios">Conversemos un piloto</a>`
      : button("Ver planes", "go:planes", "secondary");
  return `<section class="callout trial-notice" role="note"><strong>🎁 ${when} de prueba gratis.</strong> Después, tu avance se mantiene guardado y eliges si seguir con un plan. ${action}</section>`;
}

export function paywallView(account) {
  const self = pays(account);
  return `<section class="card summary simple-summary paywall">
    <h1>🦉 Tu avance está guardado</h1>
    <p class="intro">Terminaron los 14 días de prueba gratis.</p>
    <p>${
      self
        ? "Para seguir practicando, elige un plan. Todo lo que aprendiste te está esperando."
        : "Para seguir practicando, pídele a tu apoderado que active el plan. Todo lo que aprendiste te está esperando."
    }</p>
    <p class="muted">Mientras tanto puedes mirar tu ruta y tu cuaderno.</p>
    <div class="actions">
      ${self ? button("Ver planes", "go:planes", "primary") : ""}
      ${button("Ver mi cuaderno", "go:cuaderno")}
      ${button("Volver a mi ruta", "exit")}
    </div>
  </section>`;
}

// Qué pasó al volver de Flow (?pago=…).
const RESULTS = {
  ok: "¡Listo! Tu tarjeta quedó registrada y tu plan se activa en cuanto Flow confirme el primer cobro (suele tardar unos segundos).",
  tarjeta: "Flow no pudo registrar tu tarjeta. Puedes intentarlo de nuevo, también con otra tarjeta.",
  error: "No pudimos terminar de activar tu plan. Inténtalo de nuevo; si ves un cobro en tu tarjeta, escríbenos y lo resolvemos.",
};
const fmtDate = (ms) => new Date(ms).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
const planName = (plan) => PLANS.find((p) => p.id === plan)?.name ?? "Tu plan";

// Planes dentro de la app. `billing` viene de GET /api/billing/status (null
// mientras carga o sin conexión); `result`, del regreso desde Flow.
export function plansView(account, billing = null, { now = Date.now(), result = "", confirmCancel = false } = {}) {
  const a = account?.access;
  const active = billing?.active === true;
  const status = active
    ? `${planName(billing.plan)} activo${billing.cancelAtPeriodEnd ? `: lo cancelaste y sigue vigente hasta el ${fmtDate(billing.paidUntil)}` : ` hasta el ${fmtDate(billing.paidUntil)}; se renueva solo`}.`
    : a?.status === "paid"
      ? "Tienes acceso pagado."
      : a?.status === "trial"
        ? `Estás en la prueba gratis: ${daysLeft(a, now) <= 1 ? "hoy es el último día" : `quedan ${daysLeft(a, now)} días`}.`
        : a?.status === "expired"
          ? "Tu prueba gratis terminó. Tu avance sigue guardado."
          : "";
  const canBuy = billing?.available && billing?.canPay && !active;
  const cards = PLANS.map(
    (p) => `<article class="plan-card${active && billing.plan === p.id ? " plan-current" : ""}">
        <h2>${escape(p.name)}</h2>
        <p class="plan-price"><strong>${p.month}</strong> / mes</p>
        <p class="muted">o ${p.year} al año · IVA incluido</p>
        <p>${escape(p.detail)}</p>
        ${canBuy ? `<div class="actions">${button("Pagar mensual", `subscribe:${p.id}-mes`, "primary")}${button("Pagar anual", `subscribe:${p.id}-anual`)}</div>` : ""}
      </article>`,
  ).join("");
  const footer = active
    ? billing.cancelAtPeriodEnd
      ? ""
      : confirmCancel
        ? `<div class="callout">¿Cancelar tu plan? No se hacen más cobros y sigues usando todo hasta el ${fmtDate(billing.paidUntil)}. Tu avance queda guardado. ${button("Sí, cancelar", "cancel-plan-yes", "secondary")} ${button("No, mantener", "go:planes")}</div>`
        : `<p>${button("Cancelar mi plan", "cancel-plan", "link-button")}</p>`
    : billing === null
      ? `<p class="muted">Cargando…</p>`
      : !billing.available
        ? `<p class="callout">💳 Muy pronto vas a poder activar tu plan aquí con tarjeta de crédito o débito. Te avisaremos apenas esté listo.</p>`
        : !billing.canPay
          ? `<p class="callout">${account?.role === "teacher" ? 'Para cursos y equipos PIE conversamos un piloto con el colegio: <a href="/#colegios">escríbenos</a>.' : "Tu apoderado es quien activa el plan desde su cuenta."}</p>`
          : `<p class="muted">💳 Pagas con tarjeta de crédito o débito en la página segura de Flow: socatres nunca ve los datos de tu tarjeta. Puedes cancelar cuando quieras y sigues usando lo que ya pagaste.</p>`;
  return `<section class="card plans-page">
    <h1>Planes</h1>
    ${RESULTS[result] ? `<p class="callout" role="status">${escape(RESULTS[result])}</p>` : ""}
    ${status ? `<p class="intro">${escape(status)}</p>` : ""}
    <div class="plans-grid">${cards}</div>
    ${footer}
    <div class="actions">${button("Volver a mi ruta", "exit")}</div>
  </section>`;
}

// Quién ve «Planes» en el menú: quien paga (no los menores ni los docentes).
export const showsPlans = (account) =>
  account?.mode === "account" && (account.role === "parent" || (account.role === "student" && !account.managedByParent));
