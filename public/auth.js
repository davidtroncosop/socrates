// Sesión local. El modo demo no verifica identidad; en el modo cuenta la
// identidad la valida el servidor (cookie HttpOnly) y esto solo la recuerda.
export const SESSION_KEY = "socatres.demo-session.v1";
export const DEMO_NAMES = { student: "Estudiante demo", teacher: "Profesor demo" };
const ROLES = ["student", "teacher"];
const DAY = 86400000;
export function readSession(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(SESSION_KEY));
    if (!Number.isFinite(value?.expiresAt) || value.expiresAt <= now) return null;
    if (value.mode === "demo") {
      const role = value.role ?? "student";
      return ROLES.includes(role) && value.name === DEMO_NAMES[role]
        ? { ...value, role }
        : null;
    }
    return value.mode === "account" &&
      typeof value.userId === "string" &&
      typeof value.name === "string" &&
      ROLES.includes(value.role)
      ? value
      : null;
  } catch {
    return null;
  }
}
export function startSession(storage, now = Date.now(), role = "student") {
  const session = {
    mode: "demo",
    role,
    name: DEMO_NAMES[role],
    expiresAt: now + DAY,
  };
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
export function startAccountSession(storage, user, now = Date.now()) {
  const session = {
    mode: "account",
    userId: user.id,
    name: user.name,
    role: user.role,
    expiresAt: now + 30 * DAY,
  };
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
export function endSession(storage) {
  storage.removeItem(SESSION_KEY);
}
// Cada cuenta guarda su progreso aparte, aunque compartan el navegador.
export const DEMO_PROGRESS_KEY = "socatres.v1";
export const progressKey = (session) =>
  session?.mode === "account"
    ? `${DEMO_PROGRESS_KEY}.${session.userId}`
    : DEMO_PROGRESS_KEY;
