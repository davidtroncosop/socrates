import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { generateVapidKeys, vapidAuthorization, isPushEndpoint } from "../functions/_lib/push.js";
import { sendDueReminders, reminderText, localParts } from "../functions/_lib/reminders.js";
import { handle } from "../functions/_lib/router.js";

function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  for (const f of readdirSync(new URL("../migrations/", import.meta.url)).filter((f) => f.endsWith(".sql")).sort())
    db.exec(readFileSync(new URL(`../migrations/${f}`, import.meta.url), "utf8"));
  const statement = (sql, params = []) => ({
    bind: (...next) => statement(sql, next),
    first: async () => (db.prepare(sql).get(...params) ? { ...db.prepare(sql).get(...params) } : null),
    all: async () => ({ results: db.prepare(sql).all(...params).map((r) => ({ ...r })) }),
    run: async () => db.prepare(sql).run(...params),
  });
  return { prepare: (sql) => statement(sql), raw: db };
}
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
const keys = await generateVapidKeys();
const vapidEnv = { VAPID_PUBLIC_KEY: keys.publicKey, VAPID_PRIVATE_KEY: keys.privateKey, VAPID_SUBJECT: "https://socatres.pages.dev" };

test("VAPID tokens are valid ES256 JWTs for the push service", async () => {
  const endpoint = "https://fcm.googleapis.com/fcm/send/abc";
  const auth = await vapidAuthorization(endpoint, vapidEnv, Date.UTC(2026, 8, 23));
  const [, jwt, k] = auth.match(/^vapid t=([^,]+), k=(.+)$/);
  assert.equal(k, keys.publicKey);
  const [h, p, sig] = jwt.split(".");
  const payload = JSON.parse(new TextDecoder().decode(fromB64url(p)));
  assert.equal(payload.aud, "https://fcm.googleapis.com");
  assert.equal(payload.sub, "https://socatres.pages.dev");
  assert.equal(payload.exp, Date.UTC(2026, 8, 23) / 1000 + 12 * 3600);
  const pub = await crypto.subtle.importKey("raw", fromB64url(keys.publicKey), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pub, fromB64url(sig), new TextEncoder().encode(`${h}.${p}`));
  assert.equal(ok, true);
});

test("only known push services are accepted", () => {
  for (const ok of [
    "https://fcm.googleapis.com/fcm/send/x",
    "https://updates.push.services.mozilla.com/wpush/v2/x",
    "https://web.push.apple.com/x",
    "https://wns2-bl2p.notify.windows.com/w/?token=x",
  ])
    assert.equal(isPushEndpoint(ok), true, ok);
  for (const bad of [
    "http://fcm.googleapis.com/x",
    "https://evil.com/x",
    "https://fcm.googleapis.com.evil.com/x",
    "https://169.254.169.254/latest",
    "no es url",
  ])
    assert.equal(isPushEndpoint(bad), false, bad);
});

test("reminders go out once, at the chosen local hour, only if the student hasn't practiced", async () => {
  const DB = d1();
  const env = { DB, ...vapidEnv };
  DB.raw.exec(`INSERT INTO users (id, email, name, role, password_hash, created_at) VALUES
    ('a','a@x.cl','Ana','student','h',1), ('b','b@x.cl','Beto','student','h',1), ('c','c@x.cl','Caro','student','h',1)`);
  // 23 sep 2026, 21:00 UTC = 18:00 en Santiago (UTC−3).
  const now = Date.UTC(2026, 8, 23, 21, 5);
  assert.deepEqual(localParts(now, "America/Santiago"), { date: "2026-09-23", hour: 18 });
  const sub = (endpoint, user, hour, tz = "America/Santiago") =>
    DB.raw.prepare("INSERT INTO push_subscriptions (endpoint, user_id, remind_hour, time_zone, created_at) VALUES (?, ?, ?, ?, 1)").run(endpoint, user, hour, tz);
  sub("https://fcm.googleapis.com/fcm/send/ana", "a", 18);
  sub("https://fcm.googleapis.com/fcm/send/beto", "b", 18);
  sub("https://fcm.googleapis.com/fcm/send/gone", "c", 18);
  sub("https://fcm.googleapis.com/fcm/send/later", "c", 20);
  DB.raw.prepare("INSERT INTO progress VALUES ('b', ?, 1)").run(
    JSON.stringify({ attempts: [{ lesson: "x", correct: true, at: now - 3600000 }] }),
  );
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return { ok: !url.endsWith("gone"), status: url.endsWith("gone") ? 410 : 201 };
  };
  const first = await sendDueReminders(env, now, fetchImpl);
  assert.deepEqual(first, { sent: 1, skipped: 1, removed: 1, failed: 0 });
  assert.deepEqual(calls.map((c) => c.url.split("/").pop()).sort(), ["ana", "gone"]);
  const sent = calls.find((c) => c.url.endsWith("ana")).init;
  assert.equal(sent.method, "POST");
  assert.equal(sent.headers["Content-Length"], "0", "no payload: nothing personal reaches the push service");
  assert.match(sent.headers.Authorization, /^vapid t=/);
  const second = await sendDueReminders(env, now + 20 * 60000, fetchImpl);
  assert.deepEqual(second, { sent: 0, skipped: 0, removed: 0, failed: 0 }, "once per day");
  assert.equal(DB.raw.prepare("SELECT COUNT(*) AS n FROM push_subscriptions").get().n, 3, "expired subscriptions are removed");
});

test("reminder text uses the student's own streak and reviews", () => {
  const day = 86400000;
  const now = Date.now();
  const streak = { attempts: [1, 2, 3].map((d) => ({ at: now - d * day, correct: true })), reviews: [{ due: now - 1 }] };
  assert.match(reminderText(streak, now).title, /racha de 3 días/);
  assert.match(reminderText(streak, now).body, /1 repaso listo/);
  assert.match(reminderText({ attempts: [{ at: now, correct: true }] }, now).title, /Bien hecho/);
  assert.equal(reminderText(null, now).title, "Tu práctica del día te espera");
});

test("devices subscribe with an hour and time zone and can unsubscribe", async () => {
  const env = { DB: d1(), ...vapidEnv };
  let cookie = "";
  const call = async (method, path, body) => {
    const res = await handle(new Request("https://socatres.test" + path, {
      method,
      headers: { ...(body ? { "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    }), env);
    const set = res.headers.get("set-cookie");
    if (set) cookie = set.split(";")[0];
    return { status: res.status, body: await res.json() };
  };
  assert.equal((await call("GET", "/api/push/key")).body.key, keys.publicKey);
  await call("POST", "/api/auth/register", { name: "Ana", email: "a@x.cl", password: "clave-segura", role: "student", age14: true });
  const endpoint = "https://fcm.googleapis.com/fcm/send/device";
  assert.equal((await call("PUT", "/api/push", { endpoint: "https://evil.com/x", hour: 18, timeZone: "America/Santiago" })).status, 400);
  assert.equal((await call("PUT", "/api/push", { endpoint, hour: 25, timeZone: "America/Santiago" })).status, 400);
  assert.equal((await call("PUT", "/api/push", { endpoint, hour: 18, timeZone: "Marte/Base" })).status, 400);
  assert.equal((await call("PUT", "/api/push", { endpoint, hour: 18, timeZone: "America/Santiago" })).status, 200);
  assert.equal((await call("PUT", "/api/push", { endpoint, hour: 19, timeZone: "America/Santiago" })).status, 200);
  assert.equal(env.DB.raw.prepare("SELECT remind_hour FROM push_subscriptions").get().remind_hour, 19);
  assert.match((await call("GET", "/api/reminder")).body.title, /práctica del día/);
  await call("DELETE", "/api/push", { endpoint });
  assert.equal(env.DB.raw.prepare("SELECT COUNT(*) AS n FROM push_subscriptions").get().n, 0);
});
