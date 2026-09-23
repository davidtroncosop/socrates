import {
  readSession,
  startSession,
  startAccountSession,
  progressKey,
  DEMO_PROGRESS_KEY,
} from "./auth.js";
import { api } from "./api.js";
const dialog = document.querySelector("#login-dialog");
const error = document.querySelector("#login-error");
const tabs = [...document.querySelectorAll("[data-tab]")];
const getSession = () => {
  try {
    return readSession(localStorage);
  } catch {
    return null;
  }
};
const destinations = ["#ruta", "#repaso", "#cuaderno", "#tarea", "#clase", "#contenido"];
const destination = () =>
  "./aprender.html" +
  (destinations.includes(location.hash) ? location.hash : "#ruta");
const storageError =
  "No pudimos guardar la sesión. Permite el almacenamiento del navegador e inténtalo de nuevo.";

function selectTab(name, focus = false) {
  for (const tab of tabs) {
    const selected = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", selected);
    tab.tabIndex = selected ? 0 : -1;
    document.querySelector("#" + tab.getAttribute("aria-controls")).hidden = !selected;
    if (selected && focus) tab.focus();
  }
  error.textContent = "";
}
tabs.forEach((tab, i) => {
  tab.onclick = () => selectTab(tab.dataset.tab);
  tab.onkeydown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step) selectTab(tabs[(i + step + tabs.length) % tabs.length].dataset.tab, true);
  };
});

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

for (const button of document.querySelectorAll("#panel-demo [data-role]"))
  button.onclick = () => {
    try {
      startSession(localStorage, Date.now(), button.dataset.role);
      location.assign(destination());
    } catch {
      error.textContent = storageError;
    }
  };

async function submit(form, action) {
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  error.textContent = "";
  button.disabled = true;
  try {
    const { user } = await (action === "register" ? api.register(data) : api.login(data));
    const session = startAccountSession(localStorage, user);
    // Quien probó la demo y crea su cuenta conserva lo que ya practicó.
    const demo = localStorage.getItem(DEMO_PROGRESS_KEY);
    if (action === "register" && demo && !localStorage.getItem(progressKey(session)))
      localStorage.setItem(progressKey(session), demo);
    location.assign(destination());
  } catch (err) {
    error.textContent = err.status === undefined ? storageError : err.message;
    button.disabled = false;
  }
}
for (const [id, action] of [
  ["#panel-login", "login"],
  ["#panel-register", "register"],
]) {
  const form = document.querySelector(id);
  form.onsubmit = (e) => {
    e.preventDefault();
    submit(form, action);
  };
}

if (new URLSearchParams(location.search).has("login")) dialog.showModal();
if (destinations.includes(location.hash)) {
  if (getSession()) location.replace(destination());
  else if (!dialog.open) dialog.showModal();
}
