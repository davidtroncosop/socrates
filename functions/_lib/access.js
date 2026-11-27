// Acceso a la práctica: 14 días gratis sin tarjeta y después un plan pagado.
//
// - Mientras BILLING_START no esté configurado, todo es gratis (así se puede
//   publicar esto antes de tener el cobro con Flow listo).
// - Desde BILLING_START, cada cuenta que paga (apoderado, estudiante de 14 o
//   más, docente) tiene 14 días desde que se creó; las cuentas creadas antes
//   de esa fecha los cuentan desde BILLING_START.
// - Un estudiante practica si tiene acceso él, alguno de sus apoderados
//   vinculados o el docente de alguno de sus cursos. Las cuentas que crea un
//   apoderado o un docente no tienen prueba propia: dependen de quien las creó.
// - `paid_until` lo llenará el cobro con Flow; para un piloto con un colegio
//   se puede poner a mano en la cuenta del docente.
// - Al vencer no se pierde nada: el progreso se sigue guardando y
//   sincronizando; solo se pausa la práctica nueva y lo que usa IA.

export const TRIAL_DAYS = 14;
const DAY = 86400000;

// «2026-12-15» = medianoche de ese día en Chile continental.
export function billingStart(env) {
  const raw = String(env.BILLING_START || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const ms = Date.parse(`${raw}T00:00:00-03:00`);
  return Number.isFinite(ms) ? ms : null;
}

// Quién puede cubrir a este usuario: él mismo, sus apoderados y sus docentes.
async function holdersOf(env, user) {
  const { results } = await env.DB.prepare(
    `SELECT id, role, created_at, consent_by, paid_until, 'self' AS via FROM users WHERE id = ?
     UNION SELECT u.id, u.role, u.created_at, u.consent_by, u.paid_until, 'parent'
       FROM family_links f JOIN users u ON u.id = f.parent_id WHERE f.child_id = ?
     UNION SELECT u.id, u.role, u.created_at, u.consent_by, u.paid_until, 'school'
       FROM class_members m JOIN classes c ON c.id = m.class_id JOIN users u ON u.id = c.teacher_id
       WHERE m.student_id = ?`,
  )
    .bind(user.id, user.id, user.id)
    .all();
  return results;
}

// { status: "free" | "trial" | "paid" | "expired", endsAt, via }
export async function accessFor(env, user, { admin = false, now = Date.now() } = {}) {
  const start = billingStart(env);
  if (admin || start === null) return { status: "free", endsAt: null, via: null };
  let paid = null,
    trial = null,
    lastTrial = null;
  for (const h of await holdersOf(env, user)) {
    if (Number.isFinite(h.paid_until) && h.paid_until > now && (!paid || h.paid_until > paid.endsAt))
      paid = { endsAt: h.paid_until, via: h.via };
    // Las cuentas que creó otra persona no tienen prueba propia.
    if (h.consent_by) continue;
    const ends = Math.max(h.created_at, start) + TRIAL_DAYS * DAY;
    if (ends > now && (!trial || ends > trial.endsAt)) trial = { endsAt: ends, via: h.via };
    if (!lastTrial || ends > lastTrial) lastTrial = ends;
  }
  if (paid) return { status: "paid", ...paid };
  if (trial) return { status: "trial", ...trial };
  return { status: "expired", endsAt: lastTrial, via: null };
}

export const hasAccess = (access) => access.status !== "expired";
