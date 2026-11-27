import {
  readSession,
  startSession,
  startAccountSession,
  progressKey,
  DEMO_PROGRESS_KEY,
} from "./auth.js";
import { api } from "./api.js";
import { registerServiceWorker } from "./notify.js";
const $ = (s) => document.querySelector(s);
const dialog = $("#login-dialog");
const error = $("#login-error");
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = ["panel-login", "panel-register", "panel-demo", "panel-recover", "panel-code"];
const getSession = () => {
  try {
    return readSession(localStorage);
  } catch {
    return null;
  }
};
const destinations = ["#ruta", "#hoja", "#repaso", "#cuaderno", "#tarea", "#familia", "#contenido"];
const destination = () =>
  "./aprender" +
  (destinations.includes(location.hash) ? location.hash : "#ruta");
const storageError =
  "No pudimos guardar la sesión. Permite el almacenamiento del navegador e inténtalo de nuevo.";

function show(panel, focus = false) {
  for (const id of panels) $("#" + id).hidden = id !== panel;
  for (const tab of tabs) {
    const selected = tab.getAttribute("aria-controls") === panel;
    tab.setAttribute("aria-selected", selected);
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  }
  // Recuperación y código no son pestañas: se ocultan las pestañas.
  $(".auth-tabs").hidden = panel === "panel-code";
  error.textContent = "";
}
tabs.forEach((tab, i) => {
  tab.onclick = () => show(tab.getAttribute("aria-controls"));
  tab.onkeydown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step)
      show(tabs[(i + step + tabs.length) % tabs.length].getAttribute("aria-controls"), true);
  };
});
for (const link of document.querySelectorAll("[data-show]"))
  link.onclick = () => show(link.dataset.show);

// Estudiantes: solo desde los 14 años (Ley 21.719). Menores: su apoderado.
const register = $("#panel-register");
function syncRole() {
  const student = register.elements.role.value === "student";
  $("#age-row").hidden = !student;
  $("#under14-note").hidden = !student;
}
for (const radio of register.elements.role) radio.onchange = syncRole;
syncRole();

document.querySelectorAll("[data-login], [data-signup]").forEach((button) => {
  const isSignup = button.hasAttribute("data-signup");
  if (getSession()) button.textContent = "Volver a mi ruta ↗";
  button.onclick = () => {
    if (getSession()) location.assign(destination());
    else {
      show(isSignup ? "panel-register" : "panel-login");
      dialog.showModal();
    }
  };
});
// Cierre de la portada: el correo pasa directo al formulario de registro.
const closingForm = $("#closing-form");
if (getSession()) {
  closingForm.querySelector('button[type="submit"]').textContent = "Volver a mi ruta ↗";
  for (const el of closingForm.querySelectorAll("label, input")) el.hidden = true;
}
closingForm.onsubmit = (e) => {
  e.preventDefault();
  if (getSession()) return location.assign(destination());
  const email = $("#closing-email");
  if (!email.checkValidity()) {
    $("#closing-error").textContent = "Escribe un correo válido, por ejemplo nombre@correo.cl.";
    email.focus();
    return;
  }
  $("#closing-error").textContent = "";
  show("panel-register");
  $("#register-email").value = email.value.trim();
  dialog.showModal();
  $("#register-name").focus();
};

// Solicitudes de piloto para colegios, sostenedores y equipos PIE.
const schoolForm = $("#school-form");
if (schoolForm) {
  schoolForm.onsubmit = async (e) => {
    e.preventDefault();
    const status = $("#school-status");
    const button = schoolForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(schoolForm));
    status.className = "school-status err";
    if (!String(data.name || "").trim()) {
      status.textContent = "Escribe tu nombre y cargo para saber a quién responder.";
      $("#school-name").focus();
      return;
    }
    if (!String(data.organization || "").trim()) {
      status.textContent = "Indica el nombre del establecimiento o comuna.";
      $("#school-org").focus();
      return;
    }
    if (!$("#school-email").checkValidity()) {
      status.textContent = "Escribe un correo válido, por ejemplo nombre@colegio.cl.";
      $("#school-email").focus();
      return;
    }
    status.textContent = "";
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Enviando…";
    try {
      await api.submitInquiry(data);
      schoolForm.reset();
      status.className = "school-status ok";
      status.textContent =
        "¡Recibimos tu solicitud! Te responderemos a tu correo dentro de 48 horas hábiles.";
    } catch (err) {
      status.className = "school-status err";
      status.textContent =
        err.status === 0
          ? "No pudimos enviar el formulario ahora. Escríbenos directo a davidtroncosop@gmail.com."
          : err.message;
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  };
}

$("#close-login").onclick = () => dialog.close();
$("#cancel-login").onclick = () => dialog.close();

$("#demo-login").onclick = () => {
  try {
    startSession(localStorage, Date.now(), "student");
    location.assign(destination());
  } catch {
    error.textContent = storageError;
  }
};

// Tras registrarse o recuperar, se muestra el código antes de entrar.
function showRecoveryCode(code) {
  $("#recovery-code").textContent = code;
  $("#code-saved").checked = false;
  $("#code-continue").disabled = true;
  show("panel-code");
}
$("#code-saved").onchange = (e) => ($("#code-continue").disabled = !e.target.checked);
$("#code-continue").onclick = () => location.assign(destination());
$("#copy-code").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("#recovery-code").textContent);
    $("#copy-code").textContent = "¡Copiado!";
  } catch {
    $("#copy-code").textContent = "Cópialo a mano";
  }
};
$("#download-code").onclick = () => {
  const text = `Código de recuperación de socatres: ${$("#recovery-code").textContent}\nÚsalo en «¿Olvidaste tu contraseña?» si no recuerdas tu contraseña.\n`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.download = "socatres-codigo-de-recuperacion.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

async function submit(form, action) {
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  if (action === "register") {
    data.age14 = data.role === "student" ? $("#register-age14").checked : undefined;
    if (data.role === "student" && !data.age14) {
      error.textContent =
        "Si tienes menos de 14 años, tu apoderado debe crear tu cuenta desde la suya.";
      return;
    }
  }
  error.textContent = "";
  button.disabled = true;
  try {
    const { user, recoveryCode } = await api[action](data);
    const session = startAccountSession(localStorage, user);
    // Quien probó la demo y crea su cuenta conserva lo que ya practicó.
    const demo = localStorage.getItem(DEMO_PROGRESS_KEY);
    if (action === "register" && user.role === "student" && demo && !localStorage.getItem(progressKey(session)))
      localStorage.setItem(progressKey(session), demo);
    if (recoveryCode) showRecoveryCode(recoveryCode);
    else location.assign(destination());
  } catch (err) {
    error.textContent = err.status === undefined ? storageError : err.message;
  } finally {
    button.disabled = false;
  }
}
for (const [id, action] of [
  ["#panel-login", "login"],
  ["#panel-register", "register"],
  ["#panel-recover", "recover"],
]) {
  const form = $(id);
  form.onsubmit = (e) => {
    e.preventDefault();
    submit(form, action);
  };
}

registerServiceWorker();
if (new URLSearchParams(location.search).has("login")) {
  show("panel-login");
  dialog.showModal();
}
// Desde el aviso de la demo: abre directamente el registro.
if (new URLSearchParams(location.search).has("registro") && !getSession()) {
  show("panel-register");
  dialog.showModal();
}
if (destinations.includes(location.hash)) {
  if (getSession()) location.replace(destination());
  else if (!dialog.open) {
    show("panel-login");
    dialog.showModal();
  }
}
