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

// Planes dentro de la app. El pago con tarjeta (Flow) todavía no está: se
// avisa en vez de mostrar un botón que no funciona.
export function plansView(account, now = Date.now()) {
  const a = account?.access;
  const status =
    a?.status === "paid"
      ? "Tu plan está activo."
      : a?.status === "trial"
        ? `Estás en la prueba gratis: ${daysLeft(a, now) <= 1 ? "hoy es el último día" : `quedan ${daysLeft(a, now)} días`}.`
        : a?.status === "expired"
          ? "Tu prueba gratis terminó. Tu avance sigue guardado."
          : "";
  return `<section class="card plans-page">
    <h1>Planes</h1>
    ${status ? `<p class="intro">${escape(status)}</p>` : ""}
    <div class="plans-grid">${PLANS.map(
      (p) => `<article class="plan-card">
        <h2>${escape(p.name)}</h2>
        <p class="plan-price"><strong>${p.month}</strong> / mes</p>
        <p class="muted">o ${p.year} al año · IVA incluido</p>
        <p>${escape(p.detail)}</p>
      </article>`,
    ).join("")}</div>
    <p class="callout">💳 Muy pronto vas a poder activar tu plan aquí con tarjeta de crédito o débito. Te avisaremos apenas esté listo.</p>
    <div class="actions">${button("Volver a mi ruta", "exit")}</div>
  </section>`;
}
