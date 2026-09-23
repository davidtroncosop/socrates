import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handle, summarize } from "../functions/_lib/router.js";
import { hashPassword, verifyPassword } from "../functions/_lib/crypto.js";

// Adaptador mínimo con la interfaz de D1 sobre SQLite real, con el esquema de migrations/.
function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
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
    return { status: res.status, body: await res.json(), setCookie: set };
  };
  return { call, get cookie() { return cookie; } };
}

const register = (c, name, email, role = "student") =>
  c.call("POST", "/api/auth/register", { name, email, role, password: "clave-segura" });
const state = (extra = {}) => ({
  version: 1, diagnosed: true, completed: [], mastered: [], attempts: [], notes: [], reviews: [], ...extra,
});

test("passwords are salted PBKDF2 hashes and verify only the right password", async () => {
  const a = await hashPassword("secreto123");
  assert.notEqual(a, await hashPassword("secreto123"));
  assert.match(a, /^pbkdf2\$100000\$/);
  assert.equal(await verifyPassword("secreto123", a), true);
  assert.equal(await verifyPassword("secreto124", a), false);
  assert.equal(await verifyPassword("x", "basura"), false);
});

test("register, session cookie, me, logout and login", async () => {
  const env = { DB: d1() };
  const c = client(env);
  const r = await register(c, "  Ana   Pérez ", "ANA@correo.cl");
  assert.equal(r.status, 200);
  assert.deepEqual({ ...r.body.user, id: undefined }, { id: undefined, name: "Ana Pérez", email: "ana@correo.cl", role: "student" });
  assert.match(r.setCookie, /HttpOnly; SameSite=Lax; Max-Age=\d+; Secure/);
  const token = c.cookie.split("=")[1];
  const stored = env.DB.raw.prepare("SELECT token_hash FROM sessions").get().token_hash;
  assert.notEqual(stored, token, "only the token hash is stored");
  assert.equal((await c.call("GET", "/api/me")).body.user.name, "Ana Pérez");
  assert.equal((await register(c, "Otra", "ana@correo.cl")).status, 409);
  await c.call("POST", "/api/auth/logout", {});
  assert.equal((await c.call("GET", "/api/me")).status, 401);
  const bad = await c.call("POST", "/api/auth/login", { email: "ana@correo.cl", password: "incorrecta" });
  const unknown = await c.call("POST", "/api/auth/login", { email: "nadie@correo.cl", password: "incorrecta" });
  assert.equal(bad.status, 401);
  assert.deepEqual(bad.body, unknown.body, "same message whether the account exists or not");
  const ok = await c.call("POST", "/api/auth/login", { email: "Ana@Correo.cl", password: "clave-segura" });
  assert.equal(ok.status, 200);
  assert.equal((await c.call("GET", "/api/me")).status, 200);
});

test("registration validates input and never trusts unknown roles", async () => {
  const c = client({ DB: d1() });
  assert.equal((await c.call("POST", "/api/auth/register", { name: "A", email: "no-es-correo", password: "12345678" })).status, 400);
  assert.equal((await c.call("POST", "/api/auth/register", { name: "A", email: "a@b.cl", password: "corta" })).status, 400);
  assert.equal((await c.call("POST", "/api/auth/register", { name: "", email: "a@b.cl", password: "12345678" })).status, 400);
  const admin = await c.call("POST", "/api/auth/register", { name: "A", email: "a@b.cl", password: "12345678", role: "admin" });
  assert.equal(admin.body.user.role, "student");
});

test("mutations require JSON and expired sessions are rejected", async () => {
  const env = { DB: d1() };
  const c = client(env);
  await register(c, "Ana", "ana@correo.cl");
  const form = await c.call("PUT", "/api/progress", undefined, { "content-type": "application/x-www-form-urlencoded" });
  assert.equal(form.status, 415);
  env.DB.raw.exec("UPDATE sessions SET expires_at = 0");
  assert.equal((await c.call("GET", "/api/me")).status, 401);
  assert.equal((await c.call("GET", "/api/nada")).status, 404);
});

test("progress round trips, rejects photos and malformed state", async () => {
  const c = client({ DB: d1() });
  await register(c, "Ana", "ana@correo.cl");
  assert.deepEqual((await c.call("GET", "/api/progress")).body, { state: null, updatedAt: null });
  const saved = state({ completed: ["equations"] });
  const put = await c.call("PUT", "/api/progress", { state: saved });
  assert.equal(put.status, 200);
  const got = (await c.call("GET", "/api/progress")).body;
  assert.deepEqual(got.state, saved);
  assert.equal(got.updatedAt, put.body.updatedAt);
  const photo = state({ notes: [{ title: "t", text: "x", at: 1, image: "data:image/jpeg;base64,AAAA" }] });
  assert.equal((await c.call("PUT", "/api/progress", { state: photo })).status, 400);
  assert.equal((await c.call("PUT", "/api/progress", { state: { version: 2 } })).status, 400);
  const huge = state({ notes: [{ title: "t", text: "x".repeat(300000), at: 1 }] });
  assert.equal((await c.call("PUT", "/api/progress", { state: huge })).status, 413);
});

test("teachers create classes, students join by code, teachers see only summaries", async () => {
  const env = { DB: d1() };
  const teacher = client(env), student = client(env), other = client(env), outsider = client(env);
  await register(teacher, "Profe", "profe@colegio.cl", "teacher");
  await register(student, "Ana", "ana@correo.cl");
  await register(other, "Otro profe", "otro@colegio.cl", "teacher");
  await register(outsider, "Beto", "beto@correo.cl");

  assert.equal((await student.call("POST", "/api/classes", { name: "7°A" })).status, 403);
  const created = await teacher.call("POST", "/api/classes", { name: "7° Básico A" });
  assert.equal(created.status, 201);
  const { id, code } = created.body.class;
  assert.match(code, /^[A-HJKMNP-Z2-9]{6}$/);

  assert.equal((await student.call("POST", "/api/classes/join", { code: "ZZZZZZ" })).status, 404);
  assert.equal((await teacher.call("POST", "/api/classes/join", { code })).status, 403);
  const joined = await student.call("POST", "/api/classes/join", { code: code.toLowerCase() });
  assert.equal(joined.body.class.name, "7° Básico A");
  await student.call("POST", "/api/classes/join", { code }); // idempotente

  const now = Date.now();
  await student.call("PUT", "/api/progress", {
    state: state({
      completed: ["equations", "signs"],
      mastered: ["equations"],
      attempts: [
        { lesson: "equations", correct: true, hints: 0, at: now - 1000 },
        { lesson: "signs", correct: false, hints: 1, at: now - 500 },
        { lesson: "signs", correct: true, hints: 0, at: now - 10 * 86400000 },
      ],
      notes: [{ title: "privada", text: "mis ideas", at: now }],
    }),
  });

  const detail = await teacher.call("GET", `/api/classes/${id}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.students.length, 1);
  const ana = detail.body.students[0];
  assert.equal(ana.name, "Ana");
  assert.deepEqual(ana.completed, ["equations", "signs"]);
  assert.equal(ana.attemptsWeek, 2);
  assert.equal(ana.accuracyWeek, 50);
  assert.equal(ana.lastActivity, now - 500);
  assert.doesNotMatch(JSON.stringify(detail.body), /mis ideas|email|correo/, "no notes or emails leak");

  assert.equal((await other.call("GET", `/api/classes/${id}`)).status, 404);
  assert.equal((await student.call("GET", `/api/classes/${id}`)).status, 404);
  assert.equal((await teacher.call("GET", "/api/classes")).body.classes[0].students, 1);
  assert.equal((await student.call("GET", "/api/classes")).body.classes[0].teacher, "Profe");
  assert.deepEqual((await outsider.call("GET", "/api/classes")).body.classes, []);

  const ids = (await teacher.call("GET", `/api/classes/${id}`)).body.students.map((s) => s.id);
  assert.equal((await other.call("DELETE", `/api/classes/${id}/students/${ids[0]}`)).status, 404);
  await teacher.call("DELETE", `/api/classes/${id}/students/${ids[0]}`);
  assert.equal((await teacher.call("GET", `/api/classes/${id}`)).body.students.length, 0);
});

test("deleting an account removes its sessions, progress and memberships", async () => {
  const env = { DB: d1() };
  const c = client(env);
  await register(c, "Ana", "ana@correo.cl");
  await c.call("PUT", "/api/progress", { state: state() });
  const del = await c.call("DELETE", "/api/me");
  assert.equal(del.status, 200);
  for (const table of ["users", "sessions", "progress"])
    assert.equal(env.DB.raw.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n, 0, table);
  assert.equal((await c.call("GET", "/api/me")).status, 401);
});

test("summaries tolerate missing progress", () => {
  assert.deepEqual(summarize(null), {
    completed: [], mastered: [], attemptsWeek: 0, accuracyWeek: null, lastActivity: null,
  });
});
