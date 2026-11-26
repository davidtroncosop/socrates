// App instalable, recordatorio diario (Web Push) y avisos opcionales por Telegram.
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
const localTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Santiago";
  } catch {
    return "America/Santiago";
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
    timeZone: localTimeZone(),
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

// Bloque reutilizable de Telegram (en «Mi familia» para apoderados y en «Mi ruta» para estudiantes ≥14).
export async function hydrateTelegramCard(container, session, { compact = false } = {}) {
  if (!container || session?.mode !== "account") {
    if (container) container.innerHTML = "";
    return;
  }
  const isParent = session.role === "parent";
  let pendingUrl = null;

  const render = async (notice = "") => {
    let status;
    try {
      status = await api.telegramStatus();
    } catch {
      container.innerHTML = "";
      return;
    }

    if (!status.allowed) {
      container.innerHTML = compact
        ? `<div class="telegram-divider"><p class="muted small">✈️ Para menores de 14 años, tu apoderado puede recibir recordatorios por Telegram desde «Mi familia».</p></div>`
        : "";
      return;
    }

    if (!status.available) {
      container.innerHTML = compact
        ? ""
        : `<section class="card telegram-card"><h3>✈️ Recordatorios y resumen por Telegram</h3><p class="muted">Los avisos por Telegram todavía no están activados en este servidor.</p></section>`;
      return;
    }

    let inner;
    if (status.linked && status.settings) {
      pendingUrl = null;
      const s = status.settings;
      const stateLabel = s.paused ? "⏸️ Avisos en pausa" : "✓ Telegram conectado";
      const toggles = isParent
        ? `<div class="telegram-checks">
            <label class="check-row"><input type="checkbox" data-tg-field="daily" ${s.dailyEnabled ? "checked" : ""}> Recordatorio diario si falta practicar</label>
            <label class="check-row"><input type="checkbox" data-tg-field="weekly" ${s.weeklyEnabled ? "checked" : ""}> Resumen semanal cada domingo</label>
          </div>`
        : "";
      inner = `<p class="telegram-status${s.paused ? " is-paused" : ""}">${stateLabel}</p>
        <p class="muted">${
          isParent
            ? "Recibes avisos en tu horario elegido, resumen semanal y pedidos de premios. También puedes escribir /avance al bot."
            : "Te avisamos solo si a esa hora aún no has practicado. Puedes escribir /avance al bot cuando quieras."
        }</p>
        ${toggles}
        <label for="tg-hour-${compact ? "c" : "f"}" class="visually-hidden">Hora de aviso en Telegram</label>
        <div class="inline-row">
          <select id="tg-hour-${compact ? "c" : "f"}" data-tg-hour>${hourOptions(s.hour)}</select>
          <button class="primary" data-tg="save">Guardar</button>
        </div>
        <div class="telegram-actions">
          <button class="link-button" data-tg="${s.paused ? "resume" : "pause"}">${s.paused ? "Reanudar avisos" : "Pausar"}</button>
          <button class="link-button" data-tg="unlink">Desvincular Telegram</button>
        </div>`;
    } else if (pendingUrl) {
      inner = `<p class="muted">Abre Telegram y toca <strong>Iniciar</strong> en el bot para completar la conexión (el enlace vence en 10 minutos).</p>
        <div class="inline-row">
          <a class="primary telegram-open" href="${escape(pendingUrl)}" target="_blank" rel="noopener">Abrir bot en Telegram ↗</a>
          <button class="secondary" data-tg="refresh">Ya lo conecté</button>
        </div>
        <button class="link-button" data-tg="cancel-link">Generar otro enlace</button>`;
    } else {
      const hour = savedHour();
      inner = `<p class="muted">${
        isParent
          ? "Recibe en Telegram el recordatorio diario, el resumen semanal cada domingo y avisos cuando pidan un premio. Sin pedir tu teléfono."
          : "Recibe tu recordatorio diario y consulta tu racha por Telegram, incluso en iPhone."
      }</p>
        <label for="tg-hour-${compact ? "c" : "f"}" class="visually-hidden">Hora de aviso en Telegram</label>
        <div class="inline-row">
          <select id="tg-hour-${compact ? "c" : "f"}" data-tg-hour>${hourOptions(hour)}</select>
          <button class="${compact ? "secondary" : "primary"}" data-tg="connect">✈️ Conectar Telegram</button>
        </div>`;
    }

    const fb = `<p class="feedback${notice.startsWith("✓") ? " good" : ""}" role="status">${escape(notice)}</p>`;
    container.innerHTML = compact
      ? `<div class="telegram-divider"><div class="mini-label">TELEGRAM</div>${inner}${fb}</div>`
      : `<section class="card telegram-card"><h3>✈️ Recordatorios y avances por Telegram</h3>${inner}${fb}</section>`;
  };

  container.onclick = async (e) => {
    const btn = e.target.closest?.("[data-tg]");
    const action = btn?.dataset.tg;
    if (!action || btn.disabled) return;
    btn.disabled = true;
    try {
      const hourEl = container.querySelector("[data-tg-hour]");
      const hour = hourEl ? Number(hourEl.value) : savedHour();
      if (action === "connect") {
        const res = await api.telegramLink({ hour, timeZone: localTimeZone() });
        pendingUrl = res.url;
        return render();
      }
      if (action === "cancel-link") {
        pendingUrl = null;
        return render();
      }
      if (action === "refresh") {
        return render("✓ Estado actualizado.");
      }
      if (action === "save") {
        const daily = container.querySelector('[data-tg-field="daily"]');
        const weekly = container.querySelector('[data-tg-field="weekly"]');
        await api.updateTelegram({
          hour,
          timeZone: localTimeZone(),
          ...(daily ? { dailyEnabled: daily.checked } : {}),
          ...(weekly ? { weeklyEnabled: weekly.checked } : {}),
        });
        return render(`✓ Preferencias de Telegram guardadas (${String(hour).padStart(2, "0")}:00).`);
      }
      if (action === "pause" || action === "resume") {
        await api.updateTelegram({ paused: action === "pause" });
        return render(action === "pause" ? "✓ Avisos por Telegram pausados." : "✓ Avisos por Telegram reanudados.");
      }
      if (action === "unlink") {
        await api.unlinkTelegram();
        pendingUrl = null;
        return render("✓ Telegram desvinculado.");
      }
    } catch (err) {
      btn.disabled = false;
      render(err.message);
    }
  };

  await render();
}

// Tarjeta de la ruta: instalar la app, activar el recordatorio Push y conectar Telegram.
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
          ? `<p class="muted">En iPhone, toca Compartir y luego «Agregar a inicio». Abre socatres desde ese ícono para activar el aviso del navegador.</p>`
          : `<p class="muted">Este navegador no permite avisos push.</p>`;
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
    container.innerHTML =
      `<div class="push-box">${install}${body}<p class="feedback${notice.startsWith("✓") ? " good" : ""}" role="status">${escape(notice)}</p></div>` +
      `<div class="telegram-slot"></div>`;
    const slot = container.querySelector(".telegram-slot");
    if (slot && session?.mode === "account") hydrateTelegramCard(slot, session, { compact: true });
  };
  container.onclick = async (e) => {
    const btn = e.target.closest?.("[data-notify]");
    const action = btn?.dataset.notify;
    if (!action || btn.disabled) return;
    btn.disabled = true;
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
      btn.disabled = false;
      render(err.message);
    }
  };
  listeners.clear();
  listeners.add(() => render());
  await render();
}
