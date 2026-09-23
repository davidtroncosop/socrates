import { readSession, startSession } from "./auth.js";
const dialog = document.querySelector("#login-dialog");
const error = document.querySelector("#login-error");
const getSession = () => {
  try {
    return readSession(localStorage);
  } catch {
    return null;
  }
};
const destinations = ["#ruta", "#repaso", "#cuaderno", "#tarea", "#contenido"];
const destination = () =>
  "./aprender.html" +
  (destinations.includes(location.hash) ? location.hash : "#ruta");
document.querySelectorAll("[data-login]").forEach((button) => {
  if (getSession()) button.textContent = "Volver a mi ruta ↗";
  button.onclick = () => {
    if (getSession()) location.assign(destination());
    else {
      error.textContent = "";
      dialog.showModal();
    }
  };
});
document.querySelector("#close-login").onclick = () => dialog.close();
document.querySelector("#cancel-login").onclick = () => dialog.close();
document.querySelector("#demo-login").onclick = () => {
  try {
    startSession(localStorage);
    location.assign(destination());
  } catch {
    error.textContent =
      "No pudimos guardar la sesión. Permite el almacenamiento del navegador e inténtalo de nuevo.";
  }
};
if (new URLSearchParams(location.search).has("login")) dialog.showModal();
if (destinations.includes(location.hash)) {
  if (getSession()) location.replace(destination());
  else if (!dialog.open) dialog.showModal();
}
