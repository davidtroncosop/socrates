import { readSession, endSession, startAccountSession } from "./auth.js";
import { api } from "./api.js";
const getSession = () => {
  try {
    return readSession(localStorage);
  } catch {
    return null;
  }
};
const session = getSession();
if (!session) location.replace("./?login=1");
else {
  document.querySelector("#session-name").textContent = session.name;
  document.querySelector(".avatar").textContent = session.name[0].toUpperCase();
  document.querySelector("#logout").onclick = async () => {
    // La cookie se invalida en el servidor; sin conexión, vence sola.
    if (session.mode === "account") await api.logout().catch(() => {});
    try {
      endSession(localStorage);
      location.replace("./");
    } catch {
      alert(
        "No se pudo cerrar la sesión. Permite el almacenamiento del navegador e inténtalo de nuevo.",
      );
    }
  };
  const check = () => {
    if (!getSession()) location.replace("./?login=1");
  };
  window.addEventListener("storage", check);
  window.addEventListener("pageshow", check);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) check();
  });
  setTimeout(check, Math.max(0, session.expiresAt - Date.now()));
  // Sin conexión se sigue practicando; solo una sesión rechazada obliga a entrar.
  // También refresca nombre, rol y permisos guardados en el dispositivo.
  if (session.mode === "account")
    api.me().then(
      ({ user }) => {
        const changed =
          user.isAdmin !== session.isAdmin || user.role !== session.role;
        startAccountSession(localStorage, user);
        if (changed) location.reload();
      },
      (err) => {
        if (err.status === 401) {
          endSession(localStorage);
          location.replace("./?login=1");
        }
      },
    );
  await import("./app.js");
}
