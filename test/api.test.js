import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handle, summarize } from "../functions/_lib/router.js";
import { hashPassword, verifyPassword } from "../functions/_lib/crypto.js";
import { seedCatalog } from "../public/content.js";

const migrations = readdirSync(new URL("../migrations/", import.meta.url)).filter((f) => f.endsWith(".sql")).sort();
const migration = (name) => readFileSync(new URL(`../migrations/${name}`, import.meta.url), "utf8");

// Adaptador mínimo con la interfaz de D1 sobre SQLite real, con las migraciones reales.
function d1(upTo = migrations.length) {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  for (const name of migrations.slice(0, upTo)) db.exec(migration(name));
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
const env = (extra = {}) => ({ DB: d1(), ADMIN_EMAILS: "admin@socatres.cl", ...extra });

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

const student = (c, name, email) =>
  c.call("POST", "/api/auth/register", { name, email, role: "student", age14: true, password: "clave-segura" });
const parent = (c, name, email) =>
  c.call("POST", "/api/auth/register", { name, email, role: "parent", password: "clave-segura" });
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
  const e = env();
  const c = client(e);
  const r = await student(c, "  Ana   Pérez ", "ANA@correo.cl");
  assert.equal(r.status, 200);
  assert.equal(r.body.user.name, "Ana Pérez");
  assert.equal(r.body.user.email, "ana@correo.cl");
  assert.equal(r.body.user.role, "student");
  assert.equal(r.body.user.isAdmin, false);
  assert.match(r.body.recoveryCode, /^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
  assert.match(r.setCookie, /HttpOnly; SameSite=Lax; Max-Age=\d+; Secure/);
  const token = c.cookie.split("=")[1];
  const row = e.DB.raw.prepare("SELECT s.token_hash, u.recovery_hash FROM sessions s JOIN users u ON u.id = s.user_id").get();
  assert.notEqual(row.token_hash, token, "only the token hash is stored");
  assert.ok(!row.recovery_hash.includes(r.body.recoveryCode.slice(0, 4)), "only the recovery hash is stored");
  assert.equal((await c.call("GET", "/api/me")).body.user.name, "Ana Pérez");
  assert.equal((await student(c, "Otra", "ana@correo.cl")).status, 409);
  await c.call("POST", "/api/auth/logout", {});
  assert.equal((await c.call("GET", "/api/me")).status, 401);
  const bad = await c.call("POST", "/api/auth/login", { login: "ana@correo.cl", password: "incorrecta" });
  const unknown = await c.call("POST", "/api/auth/login", { login: "nadie@correo.cl", password: "incorrecta" });
  assert.equal(bad.status, 401);
  assert.deepEqual(bad.body, unknown.body, "same message whether the account exists or not");
  assert.equal((await c.call("POST", "/api/auth/login", { login: "Ana@Correo.cl", password: "clave-segura" })).status, 200);
  assert.equal((await c.call("GET", "/api/me")).status, 200);
});

test("students under 14 cannot register themselves; roles are never trusted", async () => {
  const c = client(env());
  const young = await c.call("POST", "/api/auth/register", { name: "A", email: "a@b.cl", password: "12345678", role: "student" });
  assert.equal(young.status, 400);
  assert.match(young.body.error, /apoderado/);
  assert.equal((await c.call("POST", "/api/auth/register", { name: "A", email: "no-es-correo", password: "12345678", role: "parent" })).status, 400);
  assert.equal((await c.call("POST", "/api/auth/register", { name: "A", email: "a@b.cl", password: "corta", role: "parent" })).status, 400);
  const admin = await c.call("POST", "/api/auth/register", { name: "A", email: "a@b.cl", password: "12345678", role: "admin", age14: true });
  assert.equal(admin.body.user.role, "student");
});

test("recovery codes reset the password once and sign out other sessions", async () => {
  const e = env();
  const phone = client(e), laptop = client(e);
  const { recoveryCode } = (await student(phone, "Ana", "ana@correo.cl")).body;
  await laptop.call("POST", "/api/auth/login", { login: "ana@correo.cl", password: "clave-segura" });
  assert.equal((await laptop.call("POST", "/api/auth/recover", { login: "ana@correo.cl", code: "AAAA-BBBB-CCCC", password: "nueva-clave" })).status, 401);
  const ok = await laptop.call("POST", "/api/auth/recover", { login: "ana@correo.cl", code: recoveryCode.toLowerCase().replace(/-/g, " "), password: "nueva-clave" });
  assert.equal(ok.status, 200);
  assert.notEqual(ok.body.recoveryCode, recoveryCode, "a fresh code replaces the used one");
  assert.equal((await phone.call("GET", "/api/me")).status, 401, "other sessions are closed");
  assert.equal((await laptop.call("GET", "/api/me")).status, 200);
  assert.equal((await laptop.call("POST", "/api/auth/recover", { login: "ana@correo.cl", code: recoveryCode, password: "otra-clave" })).status, 401, "used code is gone");
  assert.equal((await phone.call("POST", "/api/auth/login", { login: "ana@correo.cl", password: "nueva-clave" })).status, 200);
});

test("mutations require JSON and expired sessions are rejected", async () => {
  const e = env();
  const c = client(e);
  await student(c, "Ana", "ana@correo.cl");
  const form = await c.call("PUT", "/api/progress", undefined, { "content-type": "application/x-www-form-urlencoded" });
  assert.equal(form.status, 415);
  e.DB.raw.exec("UPDATE sessions SET expires_at = 0");
  assert.equal((await c.call("GET", "/api/me")).status, 401);
  assert.equal((await c.call("GET", "/api/nada")).status, 404);
});

test("progress round trips, rejects photos and malformed state", async () => {
  const c = client(env());
  await student(c, "Ana", "ana@correo.cl");
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
  for (const note of [5, "texto", null])
    assert.equal((await c.call("PUT", "/api/progress", { state: state({ notes: [note] }) })).status, 400);
  const huge = state({ notes: [{ title: "t", text: "x".repeat(300000), at: 1 }] });
  assert.equal((await c.call("PUT", "/api/progress", { state: huge })).status, 413);
});

test("parents create child accounts, see summaries and reset passwords", async () => {
  const e = env();
  const mom = client(e), kid = client(e), other = client(e);
  await parent(mom, "Carla", "carla@correo.cl");
  await parent(other, "Otro", "otro@correo.cl");
  const created = await mom.call("POST", "/api/family/children", { name: "Tomás", username: "Tomas.R", password: "clave-tomas" });
  assert.equal(created.status, 201);
  assert.equal(created.body.child.username, "tomas.r");
  assert.equal((await mom.call("POST", "/api/family/children", { name: "X", username: "tomas.r", password: "clave-tomas" })).status, 409);
  assert.equal((await mom.call("POST", "/api/family/children", { name: "X", username: "con espacio", password: "clave-tomas" })).status, 400);

  const login = await kid.call("POST", "/api/auth/login", { login: "TOMAS.R", password: "clave-tomas" });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.email, null);
  assert.equal((await kid.call("POST", "/api/family/children", { name: "Y", username: "yy1", password: "clave-yyyy" })).status, 403);
  const now = Date.now();
  await kid.call("PUT", "/api/progress", {
    state: state({
      completed: ["equations"], watched: ["equations"],
      attempts: [
        { lesson: "equations", correct: true, hints: 0, at: now - 1000 },
        { lesson: "equations", correct: false, hints: 1, at: now - 500 },
      ],
      notes: [{ title: "privada", text: "mis ideas", at: now }],
    }),
  });
  assert.deepEqual((await kid.call("GET", "/api/family")).body, { parents: ["Carla"] });

  const family = (await mom.call("GET", "/api/family")).body.children;
  assert.equal(family.length, 1);
  assert.equal(family[0].name, "Tomás");
  assert.equal(family[0].createdByMe, true);
  assert.equal(family[0].accuracyWeek, 50);
  assert.equal(family[0].videosWatched, 1);
  assert.doesNotMatch(JSON.stringify(family), /mis ideas/, "notes stay private");
  assert.deepEqual((await other.call("GET", "/api/family")).body.children, []);

  const id = family[0].id;
  assert.equal((await other.call("POST", `/api/family/children/${id}/password`, { password: "hackeado1" })).status, 404);
  assert.equal((await mom.call("POST", `/api/family/children/${id}/password`, { password: "nueva-tomas" })).status, 200);
  assert.equal((await kid.call("GET", "/api/me")).status, 401, "the child's sessions are closed");
  assert.equal((await kid.call("POST", "/api/auth/login", { login: "tomas.r", password: "nueva-tomas" })).status, 200);
  assert.equal((await kid.call("POST", "/api/auth/recover", { login: "tomas.r", code: "", password: "x".repeat(9) })).status, 401, "child accounts recover through the parent");

  assert.equal((await other.call("DELETE", `/api/family/children/${id}`)).status, 404);
  const removed = await mom.call("DELETE", `/api/family/children/${id}`);
  assert.equal(removed.body.deleted, true, "accounts created by the parent are deleted with the link");
  assert.equal(e.DB.raw.prepare("SELECT COUNT(*) AS n FROM users WHERE username = 'tomas.r'").get().n, 0);
});

test("teens link their own account to a parent with a one-time code", async () => {
  const e = env();
  const teen = client(e), dad = client(e);
  await student(teen, "Sofía", "sofia@correo.cl");
  await parent(dad, "Pedro", "pedro@correo.cl");
  assert.equal((await dad.call("POST", "/api/family/link-code")).status, 403);
  const { code, expiresAt } = (await teen.call("POST", "/api/family/link-code")).body;
  assert.match(code, /^[A-HJKMNP-Z2-9]{6}$/);
  assert.ok(expiresAt > Date.now() + 23 * 3600000);
  assert.equal((await teen.call("POST", "/api/family/link", { code })).status, 403);
  assert.equal((await dad.call("POST", "/api/family/link", { code: "ZZZZZZ" })).status, 404);
  const linked = await dad.call("POST", "/api/family/link", { code: code.toLowerCase() });
  assert.equal(linked.body.child.name, "Sofía");
  assert.equal((await dad.call("POST", "/api/family/link", { code })).status, 404, "codes are single use");
  const [child] = (await dad.call("GET", "/api/family")).body.children;
  assert.equal(child.createdByMe, false);
  assert.equal(
    (await dad.call("POST", `/api/family/children/${child.id}/password`, { password: "tomada-1234" })).status,
    403,
    "linking never gives access to a teen's own account",
  );
  assert.equal((await teen.call("GET", "/api/me")).status, 200, "teen sessions stay open");
  const removed = await dad.call("DELETE", `/api/family/children/${child.id}`);
  assert.equal(removed.body.deleted, false, "unlinking never deletes a teen's own account");
  assert.equal((await teen.call("GET", "/api/me")).status, 200);
});

test("deleting a parent removes the accounts they created, not linked teens", async () => {
  const e = env();
  const mom = client(e), teen = client(e);
  await parent(mom, "Carla", "carla@correo.cl");
  await mom.call("POST", "/api/family/children", { name: "Tomás", username: "tomas", password: "clave-tomas" });
  await student(teen, "Sofía", "sofia@correo.cl");
  const { code } = (await teen.call("POST", "/api/family/link-code")).body;
  await mom.call("POST", "/api/family/link", { code });
  await teen.call("PUT", "/api/progress", { state: state() });
  assert.equal((await mom.call("DELETE", "/api/me")).status, 200);
  const names = e.DB.raw.prepare("SELECT name FROM users ORDER BY name").all().map((r) => r.name);
  assert.deepEqual(names, ["Sofía"]);
  assert.equal(e.DB.raw.prepare("SELECT COUNT(*) AS n FROM family_links").get().n, 0);
  assert.equal(e.DB.raw.prepare("SELECT COUNT(*) AS n FROM progress").get().n, 1);
});

test("only admins publish the shared catalog, which everyone can read", async () => {
  const e = env();
  const admin = client(e), user = client(e), anon = client(e);
  const me = await parent(admin, "Admin", "admin@socatres.cl");
  assert.equal(me.body.user.isAdmin, true);
  await student(user, "Ana", "ana@correo.cl");
  assert.deepEqual((await anon.call("GET", "/api/catalog")).body, { catalog: null, updatedAt: null });
  const catalog = seedCatalog();
  catalog.lessons[0].title = "Título publicado";
  assert.equal((await user.call("PUT", "/api/catalog", { catalog })).status, 403);
  assert.equal((await admin.call("PUT", "/api/catalog", { catalog: { version: 1, lessons: [{ id: "x" }] } })).status, 400);
  const put = await admin.call("PUT", "/api/catalog", { catalog });
  assert.equal(put.status, 200);
  const got = (await anon.call("GET", "/api/catalog")).body;
  assert.equal(got.catalog.lessons[0].title, "Título publicado");
  assert.equal(got.updatedAt, put.body.updatedAt);
});

test("migration 0002 keeps existing users, sessions and progress", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(migration(migrations[0]));
  db.exec(`INSERT INTO users VALUES ('u1','a@b.cl','Ana','student','h',1), ('u2','p@b.cl','Profe','teacher','h',1);
           INSERT INTO sessions VALUES ('t1','u1',9999999999999);
           INSERT INTO progress VALUES ('u1','{}',1);
           INSERT INTO classes VALUES ('c1','u2','Clase','ABCDEF',1);
           INSERT INTO class_members VALUES ('c1','u1',1);`);
  db.exec(migration(migrations[1]));
  assert.deepEqual(db.prepare("SELECT id, role FROM users ORDER BY id").all().map((r) => ({ ...r })), [
    { id: "u1", role: "student" },
    { id: "u2", role: "parent" },
  ]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sessions").get().n, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM progress").get().n, 1);
  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
});

test("summaries tolerate missing progress", () => {
  assert.deepEqual(summarize(null), {
    completed: [], mastered: [], videosWatched: 0, attemptsWeek: 0, accuracyWeek: null, lastActivity: null,
  });
});

test("ADMIN_IDS makes an account admin by user id, regardless of its email", async () => {
  const e = env({ ADMIN_EMAILS: "" });
  const first = client(e);
  const me = await parent(first, "Dueño", "dueno@correo.cl");
  assert.equal(me.body.user.isAdmin, false);
  e.ADMIN_IDS = ` ${me.body.user.id} , otro`;
  assert.equal((await first.call("GET", "/api/me")).body.user.isAdmin, true);
  const other = client(e);
  assert.equal((await parent(other, "Otra", "otra@correo.cl")).body.user.isAdmin, false);
});

test("login, recovery and family links are rate limited", async () => {
  const e = env();
  const c = client(e);
  await parent(c, "Ana", "ana@correo.cl");
  const statuses = [];
  for (let i = 0; i < 11; i++) statuses.push((await c.call("POST", "/api/auth/login", { login: "ana@correo.cl", password: "malamala1" })).status);
  assert.deepEqual(statuses.slice(0, 10), Array(10).fill(401));
  assert.equal(statuses[10], 429, "11th attempt on the same account is blocked");
  // La ventana vence: se puede volver a intentar.
  e.DB.raw.prepare("UPDATE rate_limits SET window_start = window_start - 16 * 60 * 1000").run();
  assert.equal((await c.call("POST", "/api/auth/login", { login: "ana@correo.cl", password: "malamala1" })).status, 401);
  const recover = [];
  for (let i = 0; i < 6; i++) recover.push((await c.call("POST", "/api/auth/recover", { login: "ana@correo.cl", code: "AAAA-AAAA-AAAA", password: "nuevaclave1" })).status);
  assert.equal(recover[5], 429);
  const links = [];
  for (let i = 0; i < 11; i++) links.push((await c.call("POST", "/api/family/link", { code: "ZZZZ-ZZZZ-ZZZZ" })).status);
  assert.equal(links[9], 404);
  assert.equal(links[10], 429);
});

test("anonymous metrics count events per lesson and exercise; only admins read them", async () => {
  const e = env();
  const anon = client(e), admin = client(e), user = client(e);
  const send = (events) => anon.call("POST", "/api/metrics", { events });
  assert.equal((await send([{ lesson: "equations", step: 0, kind: "wrong" }, { lesson: "equations", step: 0, kind: "wrong" }, { lesson: "equations", step: 0, kind: "correct" }])).status, 200);
  assert.equal((await send([{ lesson: "equations", step: 0, kind: "nombre: Ana" }])).status, 400);
  assert.equal((await send([{ lesson: "<script>", step: 0, kind: "wrong" }])).status, 400);
  assert.equal((await send(Array(21).fill({ lesson: "equations", step: 1, kind: "hint" }))).status, 400);
  const columns = e.DB.raw.prepare("PRAGMA table_info(lesson_metrics)").all().map((c) => c.name);
  assert.deepEqual(columns.sort(), ["count", "day", "kind", "lesson", "step"], "no user, ip or answer is stored");
  await parent(admin, "Admin", "admin@socatres.cl");
  await student(user, "Ana", "ana@correo.cl");
  assert.equal((await user.call("GET", "/api/metrics")).status, 403);
  const { metrics } = (await admin.call("GET", "/api/metrics")).body;
  assert.deepEqual(
    metrics.map((m) => [m.lesson, m.step, m.kind, m.count]).sort(),
    [["equations", 0, "correct", 1], ["equations", 0, "wrong", 2]],
  );
});
