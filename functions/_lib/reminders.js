import { sendEmptyPush } from "./push.js";
import { getStreakInfo } from "../../public/stats.js";

// Fecha y hora locales de cada dispositivo según su zona horaria.
export function localParts(ms, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}
export function isTimeZone(value) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: String(value) });
    return typeof value === "string" && value.length <= 64;
  } catch {
    return false;
  }
}

const practicedOn = (state, date, timeZone) =>
  (state?.attempts ?? []).some((a) => localParts(a.at, timeZone).date === date);

// Texto del recordatorio, calculado con el progreso del propio usuario.
export function reminderText(state, now = Date.now()) {
  const due = (state?.reviews ?? []).filter((r) => r.due <= now).length;
  const { streak, practicedToday } = getStreakInfo(state ?? {}, now);
  const hasHistory = (state?.attempts ?? []).length > 0 || (state?.archive?.days ?? []).length > 0;
  if (practicedToday)
    return { title: "¡Bien hecho hoy!", body: "Ya practicaste. Si quieres, sigue con la siguiente lección." };
  if (hasHistory && streak > 1)
    return {
      title: `🔥 Tu racha de ${streak} días te espera`,
      body: due
        ? `Tienes ${due} ${due === 1 ? "repaso listo" : "repasos listos"}. Son solo unos minutos.`
        : "Tu práctica del día toma unos minutos. ¡No la pierdas!",
    };
  return {
    title: "Tu práctica del día te espera",
    body: due ? `Tienes ${due} ${due === 1 ? "repaso listo" : "repasos listos"}.` : "Un poco cada día hace la diferencia.",
  };
}

// Se ejecuta cada hora (cron). Avisa a quien llegó a su hora elegida, no ha
// practicado hoy y aún no recibió el aviso del día.
export async function sendDueReminders(env, now = Date.now(), fetchImpl = fetch) {
  const { results } = await env.DB.prepare(
    `SELECT s.endpoint, s.remind_hour, s.time_zone, s.last_sent, p.state
     FROM push_subscriptions s LEFT JOIN progress p ON p.user_id = s.user_id`,
  ).all();
  const summary = { sent: 0, skipped: 0, removed: 0, failed: 0 };
  for (const sub of results) {
    let date, hour;
    try {
      ({ date, hour } = localParts(now, sub.time_zone));
    } catch {
      summary.failed++;
      continue;
    }
    if (hour !== sub.remind_hour || sub.last_sent === date) continue;
    const mark = () =>
      env.DB.prepare("UPDATE push_subscriptions SET last_sent = ? WHERE endpoint = ?").bind(date, sub.endpoint).run();
    let progress = null;
    if (sub.state) {
      try {
        progress = JSON.parse(sub.state);
      } catch {
        progress = null;
      }
    }
    if (practicedOn(progress, date, sub.time_zone)) {
      await mark();
      summary.skipped++;
      continue;
    }
    try {
      const res = await sendEmptyPush(sub.endpoint, env, fetchImpl);
      if (res.status === 404 || res.status === 410) {
        // La suscripción ya no existe en el navegador.
        await env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(sub.endpoint).run();
        summary.removed++;
      } else if (res.ok) {
        await mark();
        summary.sent++;
      } else summary.failed++;
    } catch {
      summary.failed++;
    }
  }
  return summary;
}
