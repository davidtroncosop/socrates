import { randomToken, constantTimeEqual } from "./crypto.js";
import { localParts, isTimeZone, reminderText } from "./reminders.js";
import { curriculumLessons } from "../../public/curriculum.js";
import { lessons as defaultLessons, displayTitle } from "../../public/learning.js";
import { getStreakInfo } from "../../public/stats.js";
import { weeklySummary, compareText } from "../../public/weekly.js";

const DAY = 86400000;
const CODE_TTL_MS = 10 * 60_000;
const DEFAULT_APP_URL = "https://socatres.pages.dev";

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export function cleanBotUsername(raw) {
  const name = String(raw || "").trim().replace(/^@+/, "");
  return /^[a-zA-Z0-9_]{3,64}$/.test(name) ? name : null;
}

export function telegramConfigured(env) {
  return Boolean(env?.TELEGRAM_BOT_TOKEN && cleanBotUsername(env?.TELEGRAM_BOT_USERNAME));
}

export function appBaseUrl(env) {
  return String(env?.APP_URL || env?.VAPID_SUBJECT || DEFAULT_APP_URL).replace(/\/+$/, "");
}

export function canUseTelegram(user) {
  return Boolean(user) && !(user.role === "student" && user.consent_by);
}

// Fecha, hora y día de semana locales según zona horaria IANA.
export function localDateTime(ms, timeZone) {
  const { date, hour } = localParts(ms, timeZone);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(new Date(ms));
  return { date, hour, isSunday: weekday === "Sun" };
}

const practicedOn = (state, date, timeZone) =>
  (state?.attempts ?? []).some((a) => Number.isFinite(a?.at) && localParts(a.at, timeZone).date === date);

function parseJsonSafe(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function loadLessonTitles(db) {
  const map = new Map();
  for (const l of [...defaultLessons, ...curriculumLessons]) {
    if (l?.id) map.set(l.id, displayTitle(l));
  }
  try {
    const row = await db.prepare("SELECT data FROM catalog WHERE id = 1").first();
    const cat = parseJsonSafe(row?.data);
    if (Array.isArray(cat?.lessons)) {
      for (const l of cat.lessons) {
        if (l?.id) map.set(l.id, displayTitle(l));
      }
    }
  } catch {}
  return (id) => map.get(id) ?? null;
}

export async function sendTelegramMessage(env, chatId, text, options = {}, fetchImpl = env?.fetch ?? fetch) {
  if (!env?.TELEGRAM_BOT_TOKEN) return { ok: false, blocked: false, status: 0 };
  const payload = {
    chat_id: String(chatId),
    text: String(text),
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
  };
  if (options.buttonText && options.buttonUrl) {
    payload.reply_markup = {
      inline_keyboard: [[{ text: options.buttonText, url: options.buttonUrl }]],
    };
  }
  try {
    const res = await fetchImpl(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    let body = null;
    try {
      body = await res.json();
    } catch {}
    const desc = String(body?.description || "").toLowerCase();
    const blocked =
      res.status === 403 ||
      (res.status === 400 && (desc.includes("chat not found") || desc.includes("user is deactivated")));
    return { ok: Boolean(res.ok && body?.ok !== false), blocked, status: res.status };
  } catch {
    return { ok: false, blocked: false, status: 0 };
  }
}

export function formatStudentDailyReminder(state, name, now = Date.now()) {
  const { title, body } = reminderText(state, now);
  return `🦉 <b>${escapeHtml(title)}</b>\n\nHola ${escapeHtml(name)}: ${escapeHtml(body)}`;
}

export function formatParentDailyReminder(parentName, pendingNames) {
  const who = pendingNames.map(escapeHtml).join(", ");
  const verb = pendingNames.length === 1 ? "aún no ha practicado hoy" : "aún no han practicado hoy";
  return (
    `🦉 <b>Recordatorio diario · socatres</b>\n\n` +
    `Hola ${escapeHtml(parentName)}, ${who} ${verb}.\n` +
    `10 minutos hoy bastan para mantener el hábito sin presión.`
  );
}

export function formatStudentProgress(name, state, titleOf, now = Date.now()) {
  const { streak, practicedToday } = getStreakInfo(state ?? {}, now);
  const completed = Array.isArray(state?.completed) ? state.completed.length : 0;
  const mastered = Array.isArray(state?.mastered) ? state.mastered.length : 0;
  const due = (state?.reviews ?? []).filter((r) => r.due <= now).length;
  const recent = Array.isArray(state?.attempts)
    ? state.attempts.filter((a) => a?.at >= now - 14 * DAY && typeof a.lesson === "string")
    : [];
  const w = weeklySummary(recent, titleOf, now);
  const lines = [
    `🦉 <b>Tu avance en socatres, ${escapeHtml(name)}</b>`,
    "",
    `• Racha actual: <b>${streak} ${streak === 1 ? "día" : "días"}</b>${practicedToday ? " (ya practicaste hoy ✓)" : ""}`,
    `• Esta semana: <b>${w.practiceDays} de 7 días</b> · ${w.attempts} ejercicios${w.accuracy !== null ? ` (${w.accuracy} % de aciertos)` : ""}`,
    `• Lecciones: <b>${completed} completadas</b> · ${mastered} dominadas`,
  ];
  if (due > 0) lines.push(`• Repasos pendientes: <b>${due}</b>`);
  return lines.join("\n");
}

function formatChildWeeklyBlock(childName, state, titleOf, now) {
  const recent = Array.isArray(state?.attempts)
    ? state.attempts.filter((a) => a?.at >= now - 14 * DAY && typeof a.lesson === "string")
    : [];
  const w = weeklySummary(recent, titleOf, now);
  const lines = [`📘 <b>${escapeHtml(childName)}</b>`];
  lines.push(`• Practicó <b>${w.practiceDays === 1 ? "1 día" : `${w.practiceDays} días`} de 7</b>.`);
  if (w.attempts > 0) {
    lines.push(
      `• <b>${w.attempts} ejercicios</b>${escapeHtml(compareText(w.attempts, w.prevAttempts, ""))}` +
        ` con <b>${w.accuracy} % de aciertos</b>${escapeHtml(compareText(w.accuracy, w.prevAccuracy, " puntos"))}.`,
    );
  }
  if (w.strong.length) {
    lines.push(`• 👍 Le va bien en: ${w.strong.map((l) => escapeHtml(l.title)).join(", ")}.`);
  }
  if (w.support.length) {
    lines.push(`• 🤝 Necesita apoyo en: ${w.support.map((l) => escapeHtml(l.title)).join(", ")}.`);
  }
  lines.push(`• 💡 ${escapeHtml(w.tip)}`);
  return lines.join("\n");
}

export function formatParentWeeklyDigest(parentName, childrenWithState, titleOf, now = Date.now()) {
  if (!childrenWithState.length) {
    return (
      `🦉 <b>Resumen semanal · socatres</b>\n\n` +
      `Hola ${escapeHtml(parentName)}: todavía no tienes estudiantes vinculados en «Mi familia».`
    );
  }
  const blocks = childrenWithState.map((c) => formatChildWeeklyBlock(c.name, c.state, titleOf, now));
  return (
    `🦉 <b>Resumen semanal · socatres</b>\n` +
    `Hola ${escapeHtml(parentName)}, así estuvo esta semana:\n\n` +
    blocks.join("\n\n") +
    `\n\n<i>Solo cifras de avance: notas y fotos del cuaderno son privadas.</i>`
  );
}

export function formatRewardClaimAlert(childName, rewardTitle, cost) {
  return (
    `🎁 <b>Pedido de premio · socatres</b>\n\n` +
    `<b>${escapeHtml(childName)}</b> pidió <b>«${escapeHtml(rewardTitle)}»</b> (${Number(cost)} fichas).\n` +
    `Entra a «Mi familia» para aprobarlo o responder «ahora no».`
  );
}

async function fetchLinkedChildren(db, parentId) {
  const { results } = await db
    .prepare(
      `SELECT u.id, u.name, p.state
       FROM family_links f JOIN users u ON u.id = f.child_id
       LEFT JOIN progress p ON p.user_id = u.id
       WHERE f.parent_id = ? ORDER BY u.name`,
    )
    .bind(parentId)
    .all();
  return results.map((r) => ({ id: r.id, name: r.name, state: parseJsonSafe(r.state) }));
}

export async function createTelegramLinkCode(env, user, { hour = 18, timeZone = "America/Santiago" } = {}) {
  const bot = cleanBotUsername(env?.TELEGRAM_BOT_USERNAME);
  if (!env?.TELEGRAM_BOT_TOKEN || !bot) {
    return { error: "Los avisos por Telegram todavía no están activados.", status: 503 };
  }
  if (!canUseTelegram(user)) {
    return {
      error: "Las cuentas de menores de 14 años no se vinculan a Telegram. Tu apoderado puede conectar su Telegram desde «Mi familia».",
      status: 403,
    };
  }
  const h = Number(hour);
  if (!Number.isInteger(h) || h < 0 || h > 23) return { error: "Elige una hora válida.", status: 400 };
  if (!isTimeZone(timeZone)) return { error: "Zona horaria inválida.", status: 400 };
  const now = Date.now();
  await env.DB.prepare("DELETE FROM telegram_link_codes WHERE user_id = ? OR expires_at < ?")
    .bind(user.id, now)
    .run();
  const code = randomToken(12);
  const expiresAt = now + CODE_TTL_MS;
  await env.DB.prepare(
    "INSERT INTO telegram_link_codes (code, user_id, remind_hour, time_zone, expires_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(code, user.id, h, timeZone, expiresAt)
    .run();
  return {
    code,
    url: `https://t.me/${bot}?start=${encodeURIComponent(code)}`,
    expiresAt,
  };
}

export async function getTelegramStatus(env, user) {
  const botUsername = cleanBotUsername(env?.TELEGRAM_BOT_USERNAME);
  const available = Boolean(env?.TELEGRAM_BOT_TOKEN && botUsername);
  const allowed = canUseTelegram(user);
  const row = await env.DB.prepare(
    `SELECT remind_hour, time_zone, daily_enabled, weekly_enabled, paused
     FROM telegram_links WHERE user_id = ?`,
  )
    .bind(user.id)
    .first();
  return {
    available,
    botUsername,
    allowed,
    linked: Boolean(row),
    settings: row
      ? {
          hour: row.remind_hour,
          timeZone: row.time_zone,
          dailyEnabled: Boolean(row.daily_enabled),
          weeklyEnabled: Boolean(row.weekly_enabled),
          paused: Boolean(row.paused),
        }
      : null,
  };
}

export async function updateTelegramSettings(env, user, body) {
  const existing = await env.DB.prepare("SELECT * FROM telegram_links WHERE user_id = ?").bind(user.id).first();
  if (!existing) return { error: "Primero conecta tu cuenta de Telegram.", status: 404 };
  const hour = body.hour === undefined ? existing.remind_hour : Number(body.hour);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return { error: "Elige una hora válida.", status: 400 };
  const timeZone = body.timeZone === undefined ? existing.time_zone : body.timeZone;
  if (!isTimeZone(timeZone)) return { error: "Zona horaria inválida.", status: 400 };
  const daily = body.dailyEnabled === undefined ? existing.daily_enabled : body.dailyEnabled ? 1 : 0;
  const weekly = body.weeklyEnabled === undefined ? existing.weekly_enabled : body.weeklyEnabled ? 1 : 0;
  const paused = body.paused === undefined ? existing.paused : body.paused ? 1 : 0;
  await env.DB.prepare(
    `UPDATE telegram_links
     SET remind_hour = ?, time_zone = ?, daily_enabled = ?, weekly_enabled = ?, paused = ?
     WHERE user_id = ?`,
  )
    .bind(hour, timeZone, daily, weekly, paused, user.id)
    .run();
  return {
    ok: true,
    settings: {
      hour,
      timeZone,
      dailyEnabled: Boolean(daily),
      weeklyEnabled: Boolean(weekly),
      paused: Boolean(paused),
    },
  };
}

export async function unlinkTelegram(env, userId) {
  await env.DB.prepare("DELETE FROM telegram_links WHERE user_id = ?").bind(userId).run();
  await env.DB.prepare("DELETE FROM telegram_link_codes WHERE user_id = ?").bind(userId).run();
}

export async function notifyParentRewardClaim(env, parentId, childName, rewardTitle, cost, fetchImpl = env?.fetch ?? fetch) {
  if (!env?.TELEGRAM_BOT_TOKEN) return false;
  const row = await env.DB.prepare("SELECT chat_id FROM telegram_links WHERE user_id = ? AND paused = 0")
    .bind(parentId)
    .first();
  if (!row) return false;
  const res = await sendTelegramMessage(
    env,
    row.chat_id,
    formatRewardClaimAlert(childName, rewardTitle, cost),
    { buttonText: "Revisar en Mi familia ↗", buttonUrl: `${appBaseUrl(env)}/aprender#familia` },
    fetchImpl,
  );
  if (res.blocked) {
    await env.DB.prepare("DELETE FROM telegram_links WHERE chat_id = ?").bind(row.chat_id).run();
  }
  return res.ok;
}

const HELP_TEXT =
  `🦉 <b>Comandos de socatres</b>\n\n` +
  `• /avance — Ver resumen de avance al instante\n` +
  `• /pausar — Pausar avisos temporalmente\n` +
  `• /reanudar — Volver a recibir avisos\n` +
  `• /desvincular — Desconectar este Telegram de socatres`;

export async function handleTelegramWebhook(request, env, body, fetchImpl = env?.fetch ?? fetch) {
  if (!env?.TELEGRAM_WEBHOOK_SECRET || !env?.TELEGRAM_BOT_TOKEN) {
    return { status: 503, body: { error: "Telegram no configurado." } };
  }
  const secret = request.headers.get("x-telegram-bot-api-secret-token") || "";
  if (!(await constantTimeEqual(secret, env.TELEGRAM_WEBHOOK_SECRET))) {
    return { status: 401, body: { error: "No autorizado." } };
  }
  const msg = body?.message;
  const chatId = msg?.chat?.id !== undefined ? String(msg.chat.id) : null;
  if (!msg || !chatId) return { status: 200, body: { ok: true } };
  // Solo chats privados: nunca enviamos avance estudiantil a grupos.
  if (msg.chat.type && msg.chat.type !== "private") return { status: 200, body: { ok: true } };

  const rawText = String(msg.text || "").trim();
  if (!rawText) return { status: 200, body: { ok: true } };
  const [rawCmd, ...rest] = rawText.split(/\s+/);
  const cmd = rawCmd.toLowerCase().replace(/@[a-z0-9_]+$/i, "");
  const arg = rest[0] || "";
  const appUrl = appBaseUrl(env);

  if (cmd === "/start" && arg) {
    const found = await env.DB.prepare(
      "DELETE FROM telegram_link_codes WHERE code = ? AND expires_at > ? RETURNING user_id, remind_hour, time_zone",
    )
      .bind(arg, Date.now())
      .first();
    if (!found) {
      await sendTelegramMessage(
        env,
        chatId,
        "Ese enlace ya venció o ya fue usado. Genera uno nuevo en <b>socatres</b> y vuelve a intentarlo.",
        { buttonText: "Abrir socatres ↗", buttonUrl: `${appUrl}/aprender` },
        fetchImpl,
      );
      return { status: 200, body: { ok: true } };
    }
    const user = await env.DB.prepare("SELECT id, name, role, consent_by FROM users WHERE id = ?")
      .bind(found.user_id)
      .first();
    if (!user || !canUseTelegram(user)) {
      await sendTelegramMessage(
        env,
        chatId,
        "Esta cuenta no puede vincularse directamente a Telegram.",
        {},
        fetchImpl,
      );
      return { status: 200, body: { ok: true } };
    }
    await env.DB.prepare("DELETE FROM telegram_links WHERE chat_id = ?").bind(chatId).run();
    const hourStr = `${String(found.remind_hour).padStart(2, "0")}:00`;
    await env.DB.prepare(
      `INSERT INTO telegram_links (user_id, chat_id, remind_hour, time_zone, daily_enabled, weekly_enabled, paused, created_at)
       VALUES (?, ?, ?, ?, 1, ?, 0, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         chat_id = excluded.chat_id,
         remind_hour = excluded.remind_hour,
         time_zone = excluded.time_zone,
         paused = 0`,
    )
      .bind(user.id, chatId, found.remind_hour, found.time_zone, user.role === "parent" ? 1 : 0, Date.now())
      .run();

    const detail =
      user.role === "parent"
        ? `Recibirás recordatorios diarios a las <b>${hourStr}</b> si falta practicar, el <b>resumen semanal los domingos</b> y avisos cuando pidan un premio.`
        : `Te avisaré a las <b>${hourStr}</b> solo si ese día aún no has practicado.`;
    await sendTelegramMessage(
      env,
      chatId,
      `🦉 <b>¡Listo, ${escapeHtml(user.name)}!</b> Tu Telegram quedó conectado a <b>socatres</b>.\n\n${detail}\n\n${HELP_TEXT}`,
      {
        buttonText: user.role === "parent" ? "Ir a Mi familia ↗" : "Ir a mi ruta ↗",
        buttonUrl: `${appUrl}/aprender${user.role === "parent" ? "#familia" : "#ruta"}`,
      },
      fetchImpl,
    );
    return { status: 200, body: { ok: true } };
  }

  const linked = await env.DB.prepare(
    `SELECT t.user_id, t.paused, u.name, u.role
     FROM telegram_links t JOIN users u ON u.id = t.user_id
     WHERE t.chat_id = ?`,
  )
    .bind(chatId)
    .first();

  if (cmd === "/start") {
    if (linked) {
      await sendTelegramMessage(
        env,
        chatId,
        `🦉 Hola ${escapeHtml(linked.name)}, tu cuenta ya está conectada a <b>socatres</b>.\n\n${HELP_TEXT}`,
        {},
        fetchImpl,
      );
    } else {
      await sendTelegramMessage(
        env,
        chatId,
        `🦉 Hola. Para conectar tu cuenta entra a <b>socatres</b> y toca <b>«Conectar Telegram»</b> en Mi ruta o Mi familia.`,
        { buttonText: "Abrir socatres ↗", buttonUrl: `${appUrl}/aprender` },
        fetchImpl,
      );
    }
    return { status: 200, body: { ok: true } };
  }

  if (!linked) {
    await sendTelegramMessage(
      env,
      chatId,
      `Este chat todavía no está vinculado a una cuenta de <b>socatres</b>. Entra a la app y toca <b>«Conectar Telegram»</b>.`,
      { buttonText: "Abrir socatres ↗", buttonUrl: `${appUrl}/aprender` },
      fetchImpl,
    );
    return { status: 200, body: { ok: true } };
  }

  if (cmd === "/avance" || cmd === "/resumen") {
    const titleOf = await loadLessonTitles(env.DB);
    if (linked.role === "parent") {
      const children = await fetchLinkedChildren(env.DB, linked.user_id);
      await sendTelegramMessage(
        env,
        chatId,
        formatParentWeeklyDigest(linked.name, children, titleOf, Date.now()),
        { buttonText: "Ver en Mi familia ↗", buttonUrl: `${appUrl}/aprender#familia` },
        fetchImpl,
      );
    } else {
      const row = await env.DB.prepare("SELECT state FROM progress WHERE user_id = ?")
        .bind(linked.user_id)
        .first();
      await sendTelegramMessage(
        env,
        chatId,
        formatStudentProgress(linked.name, parseJsonSafe(row?.state), titleOf, Date.now()),
        { buttonText: "Practicar ahora ↗", buttonUrl: `${appUrl}/aprender#hoja` },
        fetchImpl,
      );
    }
    return { status: 200, body: { ok: true } };
  }

  if (cmd === "/pausar") {
    await env.DB.prepare("UPDATE telegram_links SET paused = 1 WHERE chat_id = ?").bind(chatId).run();
    await sendTelegramMessage(
      env,
      chatId,
      "⏸️ Avisos pausados. Cuando quieras volver a recibirlos escribe /reanudar.",
      {},
      fetchImpl,
    );
    return { status: 200, body: { ok: true } };
  }

  if (cmd === "/reanudar") {
    await env.DB.prepare("UPDATE telegram_links SET paused = 0 WHERE chat_id = ?").bind(chatId).run();
    await sendTelegramMessage(
      env,
      chatId,
      "▶️ Avisos reanudados. Te escribiré en el horario elegido.",
      {},
      fetchImpl,
    );
    return { status: 200, body: { ok: true } };
  }

  if (cmd === "/desvincular") {
    await env.DB.prepare("DELETE FROM telegram_links WHERE chat_id = ?").bind(chatId).run();
    await sendTelegramMessage(
      env,
      chatId,
      "✓ Listo: desvinculé este chat y borré tu identificador de Telegram de socatres.",
      {},
      fetchImpl,
    );
    return { status: 200, body: { ok: true } };
  }

  await sendTelegramMessage(env, chatId, HELP_TEXT, {}, fetchImpl);
  return { status: 200, body: { ok: true } };
}

// Cron horario: envía recordatorios diarios y resúmenes semanales de domingo por Telegram.
export async function sendDueTelegram(env, now = Date.now(), fetchImpl = env?.fetch ?? fetch) {
  const summary = { dailySent: 0, weeklySent: 0, skipped: 0, removed: 0, failed: 0 };
  if (!env?.TELEGRAM_BOT_TOKEN) return summary;

  const { results } = await env.DB.prepare(
    `SELECT t.user_id, t.chat_id, t.remind_hour, t.time_zone, t.daily_enabled, t.weekly_enabled,
            t.last_daily_sent, t.last_weekly_sent, u.name, u.role, p.state
     FROM telegram_links t
     JOIN users u ON u.id = t.user_id
     LEFT JOIN progress p ON p.user_id = t.user_id
     WHERE t.paused = 0`,
  ).all();

  let titleOf = null;
  const getTitleOf = async () => (titleOf ??= await loadLessonTitles(env.DB));
  const appUrl = appBaseUrl(env);

  for (const row of results) {
    let date, hour, isSunday;
    try {
      ({ date, hour, isSunday } = localDateTime(now, row.time_zone));
    } catch {
      summary.failed++;
      continue;
    }
    if (hour !== row.remind_hour) continue;

    // 1. Resumen semanal los domingos para apoderados (evita enviar doble mensaje el mismo domingo).
    const shouldWeekly =
      row.role === "parent" &&
      row.weekly_enabled === 1 &&
      isSunday &&
      row.last_weekly_sent !== date;

    if (shouldWeekly) {
      const children = await fetchLinkedChildren(env.DB, row.user_id);
      if (!children.length) {
        await env.DB.prepare(
          "UPDATE telegram_links SET last_weekly_sent = ?, last_daily_sent = ? WHERE user_id = ?",
        )
          .bind(date, date, row.user_id)
          .run();
        summary.skipped++;
        continue;
      }
      const res = await sendTelegramMessage(
        env,
        row.chat_id,
        formatParentWeeklyDigest(row.name, children, await getTitleOf(), now),
        { buttonText: "Ver en Mi familia ↗", buttonUrl: `${appUrl}/aprender#familia` },
        fetchImpl,
      );
      if (res.blocked) {
        await env.DB.prepare("DELETE FROM telegram_links WHERE user_id = ?").bind(row.user_id).run();
        summary.removed++;
      } else if (res.ok) {
        await env.DB.prepare(
          "UPDATE telegram_links SET last_weekly_sent = ?, last_daily_sent = ? WHERE user_id = ?",
        )
          .bind(date, date, row.user_id)
          .run();
        summary.weeklySent++;
      } else {
        summary.failed++;
      }
      continue;
    }

    // 2. Recordatorio diario (solo si aún no practicó hoy).
    if (row.daily_enabled !== 1 || row.last_daily_sent === date) continue;
    const markDaily = () =>
      env.DB.prepare("UPDATE telegram_links SET last_daily_sent = ? WHERE user_id = ?")
        .bind(date, row.user_id)
        .run();

    if (row.role === "student") {
      const progress = parseJsonSafe(row.state);
      if (practicedOn(progress, date, row.time_zone)) {
        await markDaily();
        summary.skipped++;
        continue;
      }
      const res = await sendTelegramMessage(
        env,
        row.chat_id,
        formatStudentDailyReminder(progress, row.name, now),
        { buttonText: "Practicar 10 min ↗", buttonUrl: `${appUrl}/aprender#hoja` },
        fetchImpl,
      );
      if (res.blocked) {
        await env.DB.prepare("DELETE FROM telegram_links WHERE user_id = ?").bind(row.user_id).run();
        summary.removed++;
      } else if (res.ok) {
        await markDaily();
        summary.dailySent++;
      } else {
        summary.failed++;
      }
    } else if (row.role === "parent") {
      const children = await fetchLinkedChildren(env.DB, row.user_id);
      const pending = children.filter((c) => !practicedOn(c.state, date, row.time_zone));
      if (!pending.length) {
        await markDaily();
        summary.skipped++;
        continue;
      }
      const res = await sendTelegramMessage(
        env,
        row.chat_id,
        formatParentDailyReminder(row.name, pending.map((c) => c.name)),
        { buttonText: "Ver Mi familia ↗", buttonUrl: `${appUrl}/aprender#familia` },
        fetchImpl,
      );
      if (res.blocked) {
        await env.DB.prepare("DELETE FROM telegram_links WHERE user_id = ?").bind(row.user_id).run();
        summary.removed++;
      } else if (res.ok) {
        await markDaily();
        summary.dailySent++;
      } else {
        summary.failed++;
      }
    }
  }

  return summary;
}
