// Demo local: no verifica identidad ni establece una barrera de seguridad.
export const SESSION_KEY = "socatres.demo-session.v1";
export function readSession(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(SESSION_KEY));
    return value?.mode === "demo" &&
      value.name === "Estudiante demo" &&
      Number.isFinite(value.expiresAt) &&
      value.expiresAt > now
      ? value
      : null;
  } catch {
    return null;
  }
}
export function startSession(storage, now = Date.now()) {
  const session = {
    mode: "demo",
    name: "Estudiante demo",
    expiresAt: now + 86400000,
  };
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
export function endSession(storage) {
  storage.removeItem(SESSION_KEY);
}
