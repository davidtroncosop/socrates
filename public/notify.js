// App instalable y recordatorio diario (Web Push).
import { api } from "./api.js";
import { escape } from "./ui.js";

const HOUR_KEY = "socatres.reminder.hour";
const DEFAULT_HOUR = 18;
const hasWindow = typeof window !== "undefined";
const hasNavigator = typeof navigator !== "undefined";

export function registerServiceWorker() {
  if (hasNavigator && "serviceWorker" in navigator)
    navigator.serviceWorker.register("/sw.js").catch(() => {});
}

const pushSupported = () =>
  hasNavigator && "serviceWorker" in navigator && hasWindow && "PushManager" in window && "Notification" in window;
const isIos = () => hasNavigator && /iphone|ipad|ipod/i.test(navigator.userAgent || "");
const installed = () =>
  (hasWindow && window.matchMedia?.("(display-mode: standalone)").matches) ||
  (hasNavigator && navigator.standalone === true);

// Chrome y Android ofrecen instalar; iPhone requiere «Agregar a inicio».
let installEvent = null;
const listeners = new Set();
if (hasWindow && typeof window.addEventListener === "function") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent = e;
    listeners.forEach((fn) => fn());
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    listeners.forEach((fn) => fn());
  });
}

const savedHour = () => {
  try {
    const h = Number(localStorage.getItem(HOUR_KEY));
    return Number.isInteger(h) && h >= 0 && h <= 23 && localStorage.getItem(HOUR_KEY) !== null ? h : DEFAULT_HOUR;
  } catch {
    return DEFAULT_HOUR;
  }
};
const toKey = (base64url) => {
  const raw = atob(base64url.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};
async function currentSubscription() {
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

async function enable(hour) {
  if ((await Notification.requestPermission()) !== "granted")
    throw Error("Permite las notificaciones de socatres en los ajustes del navegador para recibir el recordatorio.");
  const { key } = await api.pushKey();
  if (!key) throw Error("Los recordatorios todavía no están disponibles.");
  const reg = await navigator.serviceWorker.ready;
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(key) }));
  await api.savePush({
    endpoint: sub.endpoint,
    hour,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  try {
    localStorage.setItem(HOUR_KEY, String(hour));
  } catch {}
}
async function disable() {
  const sub = await currentSubscription();
  if (!sub) return;
  await api.deletePush(sub.endpoint).catch(() => {});
  await sub.unsubscribe();
}

const hourOptions = (selected) =>
  Array.from({ length: 17 }, (_, i) => i + 6)
    .map((h) => `<option value="${h}"${h === selected ? " selected" : ""}>${String(h).padStart(2, "0")}:00</option>`)
    .join("");

// Tarjeta de la ruta: instalar la app y activar el recordatorio.
export async function hydrateReminderCard(container, session) {
  if (!container) return;
  const render = async (notice = "") => {
    const install =
      installEvent && !installed()
        ? `<button class="secondary" data-notify="install" style="width:100%;margin-bottom:10px;">📲 Instalar socatres</button>`
        : "";
    let body;
    if (session?.mode !== "account")
      body = `<p class="muted">Crea una cuenta para recibir un aviso diario a la hora que elijas.</p>`;
    else if (!pushSupported())
      body =
        isIos() && !installed()
          ? `<p class="muted">En iPhone, toca Compartir y luego «Agregar a inicio». Abre socatres desde ese ícono para activar el recordatorio.</p>`
          : `<p class="muted">Este navegador no permite recordatorios.</p>`;
    else {
      let enabled = false;
      try {
        enabled = Boolean(await currentSubscription()) && Notification.permission === "granted";
      } catch {}
      body = `<p class="muted">${
        enabled
          ? "Te avisaremos si a esa hora aún no has practicado."
          : "Un aviso al día si aún no has practicado. Sin publicidad."
      }</p><label for="reminder-hour" class="visually-hidden">Hora del recordatorio</label><div class="inline-row"><select id="reminder-hour">${hourOptions(savedHour())}</select><button class="${enabled ? "" : "primary"}" data-notify="${enabled ? "update" : "enable"}">${enabled ? "Cambiar hora" : "Activar"}</button></div>${
        enabled ? `<button class="link-button" data-notify="disable">Desactivar recordatorio</button>` : ""
      }`;
    }
    container.innerHTML = install + body + `<p class="feedback${notice.startsWith("✓") ? " good" : ""}" role="status">${escape(notice)}</p>`;
  };
  container.onclick = async (e) => {
    const action = e.target.closest?.("[data-notify]")?.dataset.notify;
    if (!action) return;
    try {
      if (action === "install") {
        installEvent?.prompt();
        await installEvent?.userChoice;
        installEvent = null;
        return render();
      }
      if (action === "disable") {
        await disable();
        return render("Recordatorio desactivado.");
      }
      const hour = Number(container.querySelector("#reminder-hour").value);
      await enable(hour);
      render(`✓ Te recordaremos a las ${String(hour).padStart(2, "0")}:00.`);
    } catch (err) {
      render(err.message);
    }
  };
  listeners.clear();
  listeners.add(() => render());
  await render();
}
