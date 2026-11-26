import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handle } from "../functions/_lib/router.js";
import { sendDueTelegram, escapeHtml, localDateTime } from "../functions/_lib/telegram.js";

function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  for (const f of readdirSync(new URL("../migrations/", import.meta.url)).filter((f) => f.endsWith(".sql")).sort())
    db.exec(readFileSync(new URL(`../migrations/${f}`, import.meta.url), "utf8"));
  const statement = (sql, params = []) => ({
    bind: (...next) => statement(sql, next),
    first: async () => {
      const row = db.prepare(sql).get(...params);
      return row ? { ...row } : null;
    },
    all: async () => ({ results: db.prepare(sql).all(...params).map((r) => ({ ...r })) }),
    run: async () => db.prepare(sql).run(...params),
  });
  return { prepare: (sql) => statement(sql), raw: db };
}

function makeEnv(extra = {}) {
  const sent = [];
  const fetchMock = async (url, init) => {
    const payload = JSON.parse(init.body);
    sent.push({ url, payload });
    if (extra.blockChats?.includes(String(payload.chat_id))) {
      return { ok: false, status: 403, json: async () => ({ ok: false, description: "Forbidden: bot was blocked by the user" }) };
    }
    return { ok: true, status: 200, json: async () => ({ ok: true, result: { message_id: sent.length } }) };
  };
  return {
    env: {
      DB: d1(),
      TELEGRAM_BOT_TOKEN: "123456:TEST-TOKEN",
      TELEGRAM_BOT_USERNAME: "@SocatresBot",
      TELEGRAM_WEBHOOK_SECRET: "mi-secreto-telegram-super-seguro",
      APP_URL: "https://socatres.pages.dev",
      fetch: fetchMock,
      ...extra,
    },
    sent,
  };
}

function client(env) {
  let cookie = "";
  const call = async (method, path, body, headers = {}) => {
    const res = await handle(
      new Request("https://socatres.test" + path, {
        method,
        headers: {
          ...(body !== undefined ? { "content-type": "application/json" } : {}),
          ...(cookie ? { cookie } : {}),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
      env,
    );
    const set = res.headers.get("set-cookie");
    if (set) cookie = set.split(";")[0].endsWith("=") ? "" : set.split(";")[0];
    return { status: res.status, body: await res.json() };
  };
  return { call };
}

const webhook = (env, update, secret = env.TELEGRAM_WEBHOOK_SECRET) =>
  handle(
    new Request("https://socatres.test/api/telegram/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(secret !== null ? { "x-telegram-bot-api-secret-token": secret } : {}),
      },
      body: JSON.stringify(update),
    }),
    env,
  );

test("Telegram linking: 1-click code, webhook auth, commands, under-14 block and account cascade delete", async () => {
  const { env, sent } = makeEnv();
  const parent = client(env);
  const minor = client(env);

  await parent.call("POST", "/api/auth/register", {
    name: "María <Apoderada>",
    email: "maria@familia.cl",
    password: "clave-segura",
    role: "parent",
  });
  await parent.call("POST", "/api/family/children", {
    name: "Tomás",
    username: "tomas.m",
    password: "clave-segura",
  });
  await minor.call("POST", "/api/auth/login", { login: "tomas.m", password: "clave-segura" });

  // Menores de 14 años no pueden vincular Telegram directamente (Ley 21.719).
  const minorStatus = await minor.call("GET", "/api/telegram");
  assert.equal(minorStatus.status, 200);
  assert.equal(minorStatus.body.allowed, false);
  const minorTry = await minor.call("POST", "/api/telegram/link", { hour: 18, timeZone: "America/Santiago" });
  assert.equal(minorTry.status, 403);

  // Validaciones de hora y zona horaria.
  assert.equal((await parent.call("POST", "/api/telegram/link", { hour: 99, timeZone: "America/Santiago" })).status, 400);
  assert.equal((await parent.call("POST", "/api/telegram/link", { hour: 18, timeZone: "Marte/Base" })).status, 400);

  // Genera enlace de un solo uso.
  const link = await parent.call("POST", "/api/telegram/link", { hour: 19, timeZone: "America/Santiago" });
  assert.equal(link.status, 201);
  assert.match(link.body.url, /^https:\/\/t\.me\/SocatresBot\?start=/);
  const code = link.body.code;

  // Webhook rechaza secreto inválido o ausente.
  const badSecret = await webhook(env, { message: { chat: { id: 777, type: "private" }, text: `/start ${code}` } }, "mal-secreto");
  assert.equal(badSecret.status, 401);

  // Ignora chats grupales para no filtrar datos de estudiantes.
  const groupRes = await webhook(env, { message: { chat: { id: -999, type: "group" }, text: `/start ${code}` } });
  assert.equal(groupRes.status, 200);
  assert.equal(sent.length, 0);

  // Vinculación exitosa por /start <código> (escapando HTML en el nombre).
  const okRes = await webhook(env, { message: { chat: { id: 777, type: "private" }, text: `/start ${code}` } });
  assert.equal(okRes.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0].payload.text, /María &lt;Apoderada&gt;/);
  assert.match(sent[0].payload.text, /19:00/);

  // Reutilizar el código ya consumido falla limpiamente.
  await webhook(env, { message: { chat: { id: 888, type: "private" }, text: `/start ${code}` } });
  assert.match(sent[1].payload.text, /venció o ya fue usado/);

  // Estado refleja vínculo y permite actualizar preferencias.
  const st = await parent.call("GET", "/api/telegram");
  assert.equal(st.body.linked, true);
  assert.equal(st.body.settings.hour, 19);
  assert.equal(st.body.settings.weeklyEnabled, true);
  const upd = await parent.call("PUT", "/api/telegram", { hour: 20, dailyEnabled: false, weeklyEnabled: true });
  assert.equal(upd.status, 200);
  assert.equal(upd.body.settings.hour, 20);
  assert.equal(upd.body.settings.dailyEnabled, false);

  // Comandos /pausar, /reanudar, /avance y /desvincular.
  await webhook(env, { message: { chat: { id: 777, type: "private" }, text: "/pausar" } });
  assert.equal((await parent.call("GET", "/api/telegram")).body.settings.paused, true);
  await webhook(env, { message: { chat: { id: 777, type: "private" }, text: "/reanudar" } });
  assert.equal((await parent.call("GET", "/api/telegram")).body.settings.paused, false);
  await webhook(env, { message: { chat: { id: 777, type: "private" }, text: "/avance@SocatresBot" } });
  assert.match(sent.at(-1).payload.text, /Resumen semanal/);
  assert.match(sent.at(-1).payload.text, /Tomás/);

  // Al borrar la cuenta, ON DELETE CASCADE elimina el chat_id de Telegram.
  await parent.call("DELETE", "/api/me");
  assert.equal(env.DB.raw.prepare("SELECT COUNT(*) AS n FROM telegram_links").get().n, 0);
});

test("Telegram cron sends weekday daily reminders, Sunday parent weekly digest, and removes blocked chats", async () => {
  const { env, sent } = makeEnv({ blockChats: ["300"] });
  // Miércoles 23 sep 2026, 21:05 UTC = 18:05 en Santiago (UTC-3).
  const wednesday = Date.UTC(2026, 8, 23, 21, 5);
  assert.deepEqual(localDateTime(wednesday, "America/Santiago"), {
    date: "2026-09-23",
    hour: 18,
    isSunday: false,
  });

  env.DB.raw.exec(`
    INSERT INTO users (id, email, username, name, role, password_hash, consent_by, created_at) VALUES
      ('s1', 's1@x.cl', NULL, 'Sofía', 'student', 'h', NULL, 1),
      ('s2', 's2@x.cl', NULL, 'Mateo', 'student', 'h', NULL, 1),
      ('s3', 's3@x.cl', NULL, 'Bloq', 'student', 'h', NULL, 1),
      ('p1', 'p1@x.cl', NULL, 'Carla', 'parent', 'h', NULL, 1),
      ('c1', NULL, 'lucas.c', 'Lucas', 'student', 'h', 'p1', 1);
    INSERT INTO family_links (parent_id, child_id, created_at) VALUES ('p1', 'c1', 1);
  `);
  // Mateo ya practicó hoy; Lucas practicó hace 2 días (4 ejercicios en equations).
  env.DB.raw.prepare("INSERT INTO progress VALUES ('s2', ?, 1)").run(
    JSON.stringify({ attempts: [{ lesson: "equations", correct: true, at: wednesday - 3600_000 }] }),
  );
  env.DB.raw.prepare("INSERT INTO progress VALUES ('c1', ?, 1)").run(
    JSON.stringify({
      attempts: [1, 2, 3, 4].map((i) => ({
        lesson: "equations",
        correct: i <= 3,
        hints: 0,
        at: wednesday - 2 * 86400_000 + i * 1000,
      })),
    }),
  );
  const addLink = (uid, chat, hour, tz = "America/Santiago", weekly = 0) =>
    env.DB.raw
      .prepare(
        "INSERT INTO telegram_links (user_id, chat_id, remind_hour, time_zone, daily_enabled, weekly_enabled, paused, created_at) VALUES (?, ?, ?, ?, 1, ?, 0, 1)",
      )
      .run(uid, chat, hour, tz, weekly);
  addLink("s1", "100", 18);
  addLink("s2", "200", 18);
  addLink("s3", "300", 18);
  addLink("p1", "400", 18, "America/Santiago", 1);

  const wedSummary = await sendDueTelegram(env, wednesday);
  assert.deepEqual(wedSummary, { dailySent: 2, weeklySent: 0, skipped: 1, removed: 1, failed: 0 });
  assert.ok(sent.some((m) => m.payload.chat_id === "100" && /Sofía/.test(m.payload.text)));
  assert.ok(sent.some((m) => m.payload.chat_id === "400" && /Lucas/.test(m.payload.text)));
  // Chat 300 bloqueó al bot: se elimina automáticamente.
  assert.equal(env.DB.raw.prepare("SELECT 1 FROM telegram_links WHERE chat_id = '300'").get(), undefined);

  // Ejecutar de nuevo el mismo miércoles no duplica avisos.
  const wedAgain = await sendDueTelegram(env, wednesday + 15 * 60_000);
  assert.deepEqual(wedAgain, { dailySent: 0, weeklySent: 0, skipped: 0, removed: 0, failed: 0 });

  // Domingo 27 sep 2026, 21:05 UTC = domingo 18:05 en Santiago -> apoderado recibe resumen semanal (sin duplicar con diario).
  const sunday = Date.UTC(2026, 8, 27, 21, 5);
  assert.equal(localDateTime(sunday, "America/Santiago").isSunday, true);
  sent.length = 0;
  const sunSummary = await sendDueTelegram(env, sunday);
  assert.deepEqual(sunSummary, { dailySent: 2, weeklySent: 1, skipped: 0, removed: 0, failed: 0 });
  const parentMsgs = sent.filter((m) => m.payload.chat_id === "400");
  assert.equal(parentMsgs.length, 1, "solo un mensaje el domingo (el resumen semanal)");
  assert.match(parentMsgs[0].payload.text, /Resumen semanal/);
  assert.match(parentMsgs[0].payload.text, /Lucas/);
  assert.match(parentMsgs[0].payload.text, /4 ejercicios/);
});

test("Claiming a family reward notifies the parent's linked Telegram without blocking the request", async () => {
  const { env, sent } = makeEnv();
  const parent = client(env);
  const child = client(env);

  await parent.call("POST", "/api/auth/register", {
    name: "Papá",
    email: "papa@casa.cl",
    password: "clave-segura",
    role: "parent",
  });
  await parent.call("POST", "/api/family/children", {
    name: "Ema",
    username: "ema.c",
    password: "clave-segura",
  });
  const link = await parent.call("POST", "/api/telegram/link", { hour: 18, timeZone: "America/Santiago" });
  await webhook(env, { message: { chat: { id: 555, type: "private" }, text: `/start ${link.body.code}` } });
  sent.length = 0;

  const reward = await parent.call("POST", "/api/rewards", { title: "Noche de cine & pizza", cost: 1 });
  await child.call("POST", "/api/auth/login", { login: "ema.c", password: "clave-segura" });
  // Da al estudiante 1 ficha por practicar hoy.
  const now = Date.now();
  await child.call("PUT", "/api/progress", {
    state: {
      version: 1,
      diagnosed: true,
      completed: ["equations"],
      mastered: [],
      attempts: [1, 2, 3].map((i) => ({ lesson: "equations", correct: true, at: now - i * 1000 })),
      notes: [],
      reviews: [],
    },
  });

  const claim = await child.call("POST", `/api/rewards/${reward.body.reward.id}/claim`, {});
  assert.equal(claim.status, 201);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].payload.chat_id, "555");
  assert.match(sent[0].payload.text, /Ema/);
  assert.match(sent[0].payload.text, /Noche de cine &amp; pizza/);
  assert.equal(escapeHtml("<script>&"), "&lt;script&gt;&amp;");
});
