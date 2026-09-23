import { readSession, endSession } from "./auth.js";
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
  document.querySelector("#logout").onclick = () => {
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
  await import("./app.js");
}
