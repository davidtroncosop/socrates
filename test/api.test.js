import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handle, summarize } from "../functions/_lib/router.js";
import { hashPassword, verifyPassword, constantTimeEqual, classCode } from "../functions/_lib/crypto.js";
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
  assert.deepEqual(family[0].recent.map((a) => a.correct), [true, false]);
  assert.deepEqual(Object.keys(family[0].recent[0]).sort(), ["at", "correct", "hints", "lesson"]);
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
    completed: [], mastered: [], videosWatched: 0, attemptsWeek: 0, accuracyWeek: null, fichasEarned: 0, recent: [], lastActivity: null,
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

test("premios en casa: el apoderado define, el estudiante pide y el apoderado aprueba", async () => {
  const e = env();
  const mom = client(e);
  const other = client(e);
  await parent(mom, "Carla", "carla@premios.cl");
  await parent(other, "Otro", "otro@premios.cl");
  await mom.call("POST", "/api/family/children", { name: "Tomás", username: "tomas.p", password: "clave-tomas" });
  const kid = client(e);
  await kid.call("POST", "/api/auth/login", { login: "tomas.p", password: "clave-tomas" });

  assert.equal((await kid.call("POST", "/api/rewards", { title: "X", cost: 1 })).status, 403);
  assert.equal((await mom.call("POST", "/api/rewards", { title: "Película", cost: 0 })).status, 400);
  const movie = (await mom.call("POST", "/api/rewards", { title: "Elegir la película", cost: 5 })).body.reward;
  const park = (await mom.call("POST", "/api/rewards", { title: "Tarde de parque", cost: 10 })).body.reward;
  const foreign = (await other.call("POST", "/api/rewards", { title: "Ajeno", cost: 1 })).body.reward;

  // 2 lecciones (4 fichas) + 1 día con 5 ejercicios (1 ficha) = 5 fichas.
  const now = Date.now();
  const attempts = Array.from({ length: 5 }, (_, i) => ({ lesson: "equations", correct: i % 2 === 0, hints: 0, at: now - i * 1000 }));
  await kid.call("PUT", "/api/progress", { state: state({ completed: ["equations", "signs"], attempts }) });

  let mine = (await kid.call("GET", "/api/rewards")).body;
  assert.deepEqual(mine.rewards.map((r) => r.title), ["Elegir la película", "Tarde de parque"]);
  assert.equal(mine.linked, true);
  assert.deepEqual(mine.fichas, { earned: 5, spent: 0, balance: 5 });
  assert.equal((await kid.call("POST", `/api/rewards/${foreign.id}/claim`)).status, 404, "only linked parents' rewards");
  assert.match((await kid.call("POST", `/api/rewards/${park.id}/claim`)).body.error, /Te faltan 5 fichas/);
  const claimed = await kid.call("POST", `/api/rewards/${movie.id}/claim`);
  assert.equal(claimed.status, 201);
  assert.equal(claimed.body.fichas.balance, 0, "pending claims reserve fichas");
  assert.equal((await kid.call("POST", `/api/rewards/${movie.id}/claim`)).status, 400);

  const family = (await mom.call("GET", "/api/family")).body;
  assert.deepEqual(family.rewards.map((r) => r.cost), [5, 10]);
  const [child] = family.children;
  assert.equal(child.fichasEarned, 5);
  assert.equal(child.claims[0].status, "pending");
  const claimId = child.claims[0].id;

  assert.equal((await other.call("POST", `/api/claims/${claimId}`, { approve: true })).status, 404);
  assert.equal((await mom.call("POST", `/api/claims/${claimId}`, { approve: "sí" })).status, 400);
  assert.equal((await mom.call("POST", `/api/claims/${claimId}`, { approve: false })).status, 200);
  assert.equal((await kid.call("GET", "/api/rewards")).body.fichas.balance, 5, "«ahora no» returns the fichas");
  assert.equal((await mom.call("POST", `/api/claims/${claimId}`, { approve: true })).status, 404, "decided once");

  await kid.call("POST", `/api/rewards/${movie.id}/claim`);
  const second = (await mom.call("GET", "/api/family")).body.children[0].claims.find((c) => c.status === "pending");
  await mom.call("POST", `/api/claims/${second.id}`, { approve: true });
  mine = (await kid.call("GET", "/api/rewards")).body;
  assert.deepEqual(mine.fichas, { earned: 5, spent: 5, balance: 0 });

  // Borrar el premio mantiene el historial y las fichas gastadas.
  assert.equal((await other.call("DELETE", `/api/rewards/${movie.id}`)).status, 404);
  assert.equal((await mom.call("DELETE", `/api/rewards/${movie.id}`)).status, 200);
  mine = (await kid.call("GET", "/api/rewards")).body;
  assert.deepEqual(mine.rewards.map((r) => r.title), ["Tarde de parque"]);
  assert.equal(mine.fichas.spent, 5);
  assert.equal(mine.claims.filter((c) => c.status === "approved").length, 1);
  assert.equal((await mom.call("GET", "/api/rewards")).status, 403);
});

// Revisión del desarrollo a mano con Gemini ----------------------------------
const PHOTO = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
const reviewBody = (extra = {}) => ({
  image: PHOTO, problem: "x + 5 = 12", statement: "Encuentra x", expected: "7", answer: "17", correct: false, ...extra,
});
function withGemini(reply, fn) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    return typeof reply === "function" ? reply() : new Response(JSON.stringify(reply), { status: 200 });
  };
  return fn(calls).finally(() => (globalThis.fetch = original));
}
const geminiSays = (review) => ({ choices: [{ message: { role: "assistant", content: JSON.stringify(review) } }] });

test("work review needs an account and a configured key", async () => {
  const anonymous = client(env({ OPENROUTER_API_KEY: "k" }));
  assert.equal((await anonymous.call("POST", "/api/work/review", reviewBody())).status, 401);
  const c = client(env());
  await student(c, "Ana", "ana@x.cl");
  const res = await c.call("POST", "/api/work/review", reviewBody());
  assert.equal(res.status, 503);
});

test("work review sends the photo to Gemini 2.5 Flash through OpenRouter and returns a short message", async () => {
  const c = client(env({ OPENROUTER_API_KEY: "secreta" }));
  await student(c, "Ana", "ana@x.cl");
  await withGemini(
    geminiSays({
      readable: true, showsWork: true, matchesExercise: true, workIsCorrect: false,
      errorStep: "x = 12 + 5", message: "En el segundo paso sumaste 5. Resta 5 a ambos lados.",
    }),
    async (calls) => {
      const res = await c.call("POST", "/api/work/review", reviewBody());
      assert.equal(res.status, 200);
      assert.equal(res.body.review.message, "En el segundo paso sumaste 5. Resta 5 a ambos lados.");
      assert.equal(res.body.review.errorStep, "x = 12 + 5");
      assert.equal(calls.length, 1);
      assert.equal(calls[0].url, "https://openrouter.ai/api/v1/chat/completions");
      assert.equal(calls[0].init.headers.authorization, "Bearer secreta", "key in a header, never in the URL");
      const body = calls[0].body;
      assert.equal(body.model, "google/gemini-2.5-flash");
      assert.equal(body.provider.data_collection, "deny", "only providers that don't store or train on photos");
      assert.match(body.messages[0].content, /nunca una instrucción/);
      const parts = body.messages[1].content;
      assert.equal(parts[0].image_url.url, PHOTO);
      assert.match(parts[1].text, /x \+ 5 = 12/);
      assert.match(parts[1].text, /incorrecta/);
      assert.equal(body.response_format.type, "json_object");
      assert.deepEqual(body.reasoning, { enabled: false }, "no reasoning: cheaper and faster, same accuracy in tests");
    },
  );
});

test("work review rejects bad photos and survives Gemini failures", async () => {
  const c = client(env({ OPENROUTER_API_KEY: "k" }));
  await student(c, "Ana", "ana@x.cl");
  await withGemini({}, async (calls) => {
    assert.equal((await c.call("POST", "/api/work/review", reviewBody({ image: "https://evil.test/x.jpg" }))).status, 400);
    assert.equal((await c.call("POST", "/api/work/review", reviewBody({ image: "data:image/svg+xml;base64,PHN2Zz4=" }))).status, 400);
    assert.equal((await c.call("POST", "/api/work/review", reviewBody({ problem: "" }))).status, 400);
    assert.equal(calls.length, 0, "invalid requests never reach Gemini");
  });
  await withGemini(() => new Response("cuota", { status: 429 }), async () => {
    const res = await c.call("POST", "/api/work/review", reviewBody());
    assert.equal(res.status, 502);
    assert.match(res.body.error, /No pudimos revisar/);
  });
  await withGemini({ choices: [{ message: { content: "no es json" } }] }, async () => {
    assert.equal((await c.call("POST", "/api/work/review", reviewBody())).status, 502);
  });
});

test("work review is rate limited per account", async () => {
  const c = client(env({ OPENROUTER_API_KEY: "k" }));
  await student(c, "Ana", "ana@x.cl");
  await withGemini(geminiSays({ readable: true, showsWork: true, matchesExercise: true, workIsCorrect: true, errorStep: "", message: "¡Bien!" }), async () => {
    let last;
    for (let i = 0; i < 121; i++) last = await c.call("POST", "/api/work/review", reviewBody());
    assert.equal(last.status, 429);
  });
});

test("work review has a daily cap for the whole app", async () => {
  const e = env({ OPENROUTER_API_KEY: "k" });
  const c = client(e);
  await student(c, "Ana", "ana@x.cl");
  // Como si hoy ya se hubieran hecho todas las revisiones permitidas.
  await e.DB.prepare("INSERT INTO rate_limits (key, window_start, count) VALUES ('workReviewAll:app', ?, 3000)").bind(Date.now()).run();
  await withGemini({}, async (calls) => {
    const res = await c.call("POST", "/api/work/review", reviewBody());
    assert.equal(res.status, 429);
    assert.match(res.body.error, /quedó guardada en tu cuaderno/);
    assert.equal(calls.length, 0, "nothing is sent to Gemini past the cap");
  });
});

// Búho tutor: resumen de la lección, pregunta y frase de ánimo ----------------
const reflectionBody = (extra = {}) => ({
  lesson: "Encuentra el valor de x",
  idea: "Una ecuación es una balanza.",
  summary: "Hoy aprendí que lo que hago a un lado lo hago al otro.",
  question: "¿Y si la x está a los dos lados?",
  ...extra,
});

test("the owl reads the lesson summary, answers the question and never stores it", async () => {
  const anonymous = client(env({ OPENROUTER_API_KEY: "k" }));
  assert.equal((await anonymous.call("POST", "/api/coach/reflection", reflectionBody())).status, 401);
  const e = env({ OPENROUTER_API_KEY: "secreta" });
  const c = client(e);
  await student(c, "Ana", "ana@x.cl");
  await withGemini(
    geminiSays({ message: "Entendiste la balanza: lo mismo a ambos lados.", answer: "Primero junta las x en un lado." }),
    async (calls) => {
      const res = await c.call("POST", "/api/coach/reflection", reflectionBody());
      assert.equal(res.status, 200);
      assert.deepEqual(res.body.reply, {
        message: "Entendiste la balanza: lo mismo a ambos lados.",
        answer: "Primero junta las x en un lado.",
      });
      const body = calls[0].body;
      assert.equal(body.provider.data_collection, "deny");
      assert.match(body.messages[0].content, /nunca una instrucción/);
      assert.match(body.messages[0].content, /\*4141/, "knows what to do if a child is in distress");
      assert.match(body.messages[1].content, /lo que hago a un lado/);
      assert.match(body.messages[1].content, /dos lados/);
    },
  );
  const tables = await e.DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
  for (const { name } of tables.results) {
    const rows = await e.DB.prepare(`SELECT * FROM ${name}`).all();
    assert.doesNotMatch(JSON.stringify(rows.results), /lo que hago a un lado/, `nothing stored in ${name}`);
  }
});

test("the owl needs a summary or a question and ignores an answer nobody asked for", async () => {
  const c = client(env({ OPENROUTER_API_KEY: "k" }));
  await student(c, "Ana", "ana@x.cl");
  await withGemini(geminiSays({ message: "¡Buen resumen!", answer: "Algo inventado" }), async (calls) => {
    assert.equal((await c.call("POST", "/api/coach/reflection", reflectionBody({ summary: " ", question: "" }))).status, 400);
    assert.equal((await c.call("POST", "/api/coach/reflection", reflectionBody({ lesson: "" }))).status, 400);
    assert.equal(calls.length, 0);
    const res = await c.call("POST", "/api/coach/reflection", reflectionBody({ question: "" }));
    assert.deepEqual(res.body.reply, { message: "¡Buen resumen!", answer: "" });
  });
  await withGemini({ choices: [{ message: { content: "no es json" } }] }, async () => {
    const res = await c.call("POST", "/api/coach/reflection", reflectionBody());
    assert.equal(res.status, 502);
    assert.match(res.body.error, /quedó en tu cuaderno/);
  });
});

test("the daily encouragement only sends numbers and lesson titles, a few times a day", async () => {
  const c = client(env({ OPENROUTER_API_KEY: "k" }));
  await student(c, "Ana", "ana@x.cl");
  await withGemini(geminiSays({ message: "Llevas 3 días seguidos. Hoy sigue con Razones." }), async (calls) => {
    const res = await c.call("POST", "/api/coach/encouragement", {
      streak: 3, completed: 5, mastered: 2, daysThisWeek: 3, correctThisWeek: 12, wrongThisWeek: 4,
      dueReviews: 1, practicedToday: false, nextLesson: "Razones", secret: "Me llamo Ana",
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, "Llevas 3 días seguidos. Hoy sigue con Razones.");
    const sent = calls[0].body.messages[1].content;
    assert.match(sent, /Días seguidos practicando: 3/);
    assert.match(sent, /Su próxima lección: Razones/);
    assert.doesNotMatch(sent, /Me llamo Ana/, "unknown fields are dropped");
    let last;
    for (let i = 0; i < 4; i++) last = await c.call("POST", "/api/coach/encouragement", {});
    assert.equal(last.status, 429);
  });
});

test("router hardening: constant-time equality, content-type parsing, malformed URL params, atomic metrics and waitUntil", async () => {
  assert.equal(await constantTimeEqual("abc", "abc"), true);
  assert.equal(await constantTimeEqual("abc", "abd"), false);
  assert.equal(await constantTimeEqual("abc", "abcd"), false);

  const e = env();
  const c = client(e);
  await student(c, "Ana", "ana@hardening.cl");

  // Content-Type sin distinción de mayúsculas, pero sin aceptar tipos distintos.
  const upper = await c.call("PUT", "/api/progress", { state: state() }, { "content-type": "Application/JSON; charset=utf-8" });
  assert.equal(upper.status, 200);
  const bogus = await c.call("PUT", "/api/progress", { state: state() }, { "content-type": "application/json-evil" });
  assert.equal(bogus.status, 415);

  // Parámetro con codificación URL rota devuelve 400, no 500.
  const badUrl = await c.call("DELETE", "/api/rewards/%E0%A4%A");
  assert.equal(badUrl.status, 400);

  // Lote de métricas con un evento inválido no escribe ninguno (validación atómica).
  const badBatch = await c.call("POST", "/api/metrics", {
    events: [
      { lesson: "equations", step: 0, kind: "correct" },
      { lesson: "equations", step: 99, kind: "correct" },
    ],
  });
  assert.equal(badBatch.status, 400);
  assert.equal(e.DB.raw.prepare("SELECT COUNT(*) AS n FROM lesson_metrics").get().n, 0);

  // Lote válido con eventos duplicados agrupa correctamente los contadores.
  const okBatch = await c.call("POST", "/api/metrics", {
    events: [
      { lesson: "equations", step: 1, kind: "wrong" },
      { lesson: "equations", step: 1, kind: "wrong" },
      { lesson: "equations", step: 9, kind: "game" },
    ],
  });
  assert.equal(okBatch.status, 200);
  assert.equal(
    e.DB.raw.prepare("SELECT count FROM lesson_metrics WHERE lesson = 'equations' AND step = 1 AND kind = 'wrong'").get().count,
    2,
  );

  // waitUntil recibe tareas de limpieza en segundo plano sin bloquear la respuesta.
  const pending = [];
  const res = await handle(
    new Request("https://socatres.test/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ login: "ana@hardening.cl", password: "clave-segura" }),
    }),
    e,
    (p) => pending.push(p),
  );
  assert.equal(res.status, 200);
  assert.ok(pending.length >= 1, "expired session cleanup is scheduled via waitUntil");
  await Promise.all(pending);
});

test("school pilot inquiries validate, block spam honeypot, notify linked admin on Telegram and require admin to list", async () => {
  const sentMessages = [];
  const mockFetch = async (_url, opts) => {
    sentMessages.push(JSON.parse(opts.body));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const e = env({ TELEGRAM_BOT_TOKEN: "test-bot-token", fetch: mockFetch });
  const anon = client(e);
  const regular = client(e);
  const admin = client(e);

  await parent(regular, "Apoderado", "apoderado@socatres.cl");
  const adminReg = await parent(admin, "David Admin", "admin@socatres.cl");
  // Vincula Telegram del admin en D1 para verificar el aviso instantáneo.
  e.DB.raw
    .prepare(
      "INSERT INTO telegram_links (user_id, chat_id, remind_hour, time_zone, daily_enabled, weekly_enabled, created_at) VALUES (?, ?, 18, 'America/Santiago', 1, 1, ?)",
    )
    .run(adminReg.body.user.id, "999000111", Date.now());

  // Validaciones básicas.
  assert.equal(
    (await anon.call("POST", "/api/inquiries", { name: "", organization: "Escuela Sur", email: "utp@colegio.cl" })).status,
    400,
  );
  assert.equal(
    (await anon.call("POST", "/api/inquiries", { name: "Camila", organization: "", email: "utp@colegio.cl" })).status,
    400,
  );
  assert.equal(
    (await anon.call("POST", "/api/inquiries", { name: "Camila", organization: "Escuela Sur", email: "malo" })).status,
    400,
  );
  assert.equal(
    (await anon.call("POST", "/api/inquiries", { name: "Camila", organization: "Escuela Sur", email: "utp@colegio.cl", message: "x".repeat(801) })).status,
    400,
  );

  // Honeypot lleno responde 201 pero no guarda ni avisa.
  const bot = await anon.call(
    "POST",
    "/api/inquiries",
    { name: "Bot", organization: "Spam", email: "bot@spam.cl", website: "https://spam.example" },
    { "cf-connecting-ip": "10.0.0.1" },
  );
  assert.equal(bot.status, 201);
  assert.equal(e.DB.raw.prepare("SELECT COUNT(*) AS n FROM school_inquiries").get().n, 0);
  assert.equal(sentMessages.length, 0);

  // Envío real se guarda y notifica al admin vinculado en Telegram.
  const ok = await anon.call(
    "POST",
    "/api/inquiries",
    {
      name: "Camila Rojas · Coord. PIE",
      organization: "Escuela Gabriela Mistral, Temuco",
      email: "CROJAS@colegio.cl",
      message: "Queremos pilotear con 45 estudiantes de 5° y 6° básico.",
    },
    { "cf-connecting-ip": "10.0.0.2" },
  );
  assert.equal(ok.status, 201);
  assert.equal(ok.body.ok, true);
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].chat_id, "999000111");
  assert.match(sentMessages[0].text, /Escuela Gabriela Mistral, Temuco/);
  assert.match(sentMessages[0].text, /crojas@colegio\.cl/);

  // Listar solicitudes exige sesión de administrador.
  assert.equal((await anon.call("GET", "/api/inquiries")).status, 401);
  assert.equal((await regular.call("GET", "/api/inquiries")).status, 403);
  const list = await admin.call("GET", "/api/inquiries");
  assert.equal(list.status, 200);
  assert.equal(list.body.inquiries.length, 1);
  assert.equal(list.body.inquiries[0].email, "crojas@colegio.cl");
  assert.equal(list.body.inquiries[0].organization, "Escuela Gabriela Mistral, Temuco");

  // Límite de tasa por IP (5 por hora -> 6to intento da 429).
  for (let i = 0; i < 4; i++) {
    const r = await anon.call(
      "POST",
      "/api/inquiries",
      { name: `Docente ${i}`, organization: "Liceo Norte", email: `d${i}@liceo.cl` },
      { "cf-connecting-ip": "10.0.0.2" },
    );
    assert.equal(r.status, 201);
  }
  const throttled = await anon.call(
    "POST",
    "/api/inquiries",
    { name: "Extra", organization: "Liceo Norte", email: "extra@liceo.cl" },
    { "cf-connecting-ip": "10.0.0.2" },
  );
  assert.equal(throttled.status, 429);
});

test("security hardening: HSTS headers, same-origin enforcement, unbiased classCode and authenticated password change", async () => {
  // 1) _headers incluye HSTS y directivas CSP estrictas.
  const headersFile = readFileSync(new URL("../public/_headers", import.meta.url), "utf8");
  assert.match(headersFile, /Strict-Transport-Security:\s*max-age=31536000;\s*includeSubDomains/);

  // 2) classCode sin sesgo módulo genera solo caracteres permitidos del alfabeto.
  for (let i = 0; i < 40; i++) {
    const code = classCode(12);
    assert.match(code, /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/);
  }

  const e = env();
  const phone = client(e);
  const laptop = client(e);
  await parent(phone, "Mamá", "mama@seguridad.cl");
  await laptop.call("POST", "/api/auth/login", { login: "mama@seguridad.cl", password: "clave-segura" });

  // 3) Respuestas API incluyen cabeceras defensivas (HSTS, X-Frame-Options, Referrer-Policy).
  const rawRes = await handle(new Request("https://socatres.test/api/catalog"), e);
  assert.equal(rawRes.headers.get("x-frame-options"), "DENY");
  assert.equal(rawRes.headers.get("referrer-policy"), "no-referrer");
  assert.match(rawRes.headers.get("strict-transport-security") || "", /max-age=31536000/);

  // 4) Mutaciones rechazan Origin distinto, Origin: null o Sec-Fetch-Site: cross-site.
  assert.equal(
    (await phone.call("PUT", "/api/progress", { state: state() }, { origin: "https://atacante.test" })).status,
    403,
  );
  assert.equal(
    (await phone.call("PUT", "/api/progress", { state: state() }, { origin: "null" })).status,
    403,
  );
  assert.equal(
    (await phone.call("PUT", "/api/progress", { state: state() }, { "sec-fetch-site": "cross-site" })).status,
    403,
  );
  assert.equal(
    (
      await phone.call(
        "PUT",
        "/api/progress",
        { state: state() },
        { origin: "https://socatres.test", "sec-fetch-site": "same-origin" },
      )
    ).status,
    200,
  );

  // 5) Cambio de contraseña autenticado exige clave actual, rota cookie y cierra otras sesiones.
  assert.equal(
    (await client(e).call("POST", "/api/auth/password", { currentPassword: "clave-segura", newPassword: "nueva-clave-123" })).status,
    401,
  );
  assert.equal(
    (await phone.call("POST", "/api/auth/password", { currentPassword: "incorrecta", newPassword: "nueva-clave-123" })).status,
    401,
  );
  assert.equal(
    (await phone.call("POST", "/api/auth/password", { currentPassword: "clave-segura", newPassword: "clave-segura" })).status,
    400,
  );
  assert.equal(
    (await phone.call("POST", "/api/auth/password", { currentPassword: "clave-segura", newPassword: "corta" })).status,
    400,
  );
  const oldCookie = phone.cookie;
  const changed = await phone.call("POST", "/api/auth/password", {
    currentPassword: "clave-segura",
    newPassword: "nueva-clave-segura",
  });
  assert.equal(changed.status, 200);
  assert.equal(changed.body.ok, true);
  assert.notEqual(phone.cookie, oldCookie, "session cookie rotates on password change");
  assert.equal((await phone.call("GET", "/api/me")).status, 200, "current session stays active");
  assert.equal((await laptop.call("GET", "/api/me")).status, 401, "other sessions are revoked");
  assert.equal(
    (await laptop.call("POST", "/api/auth/login", { login: "mama@seguridad.cl", password: "clave-segura" })).status,
    401,
  );
  assert.equal(
    (await laptop.call("POST", "/api/auth/login", { login: "mama@seguridad.cl", password: "nueva-clave-segura" })).status,
    200,
  );

  // 6) Menores creados por apoderado no cambian su propia contraseña (la gestiona el apoderado).
  await phone.call("POST", "/api/family/children", {
    name: "Leo",
    username: "leo.seguro",
    password: "clave-inicial",
  });
  const child = client(e);
  const childLogin = await child.call("POST", "/api/auth/login", {
    login: "leo.seguro",
    password: "clave-inicial",
  });
  assert.equal(childLogin.status, 200);
  assert.equal(childLogin.body.user.managedByParent, true);
  const blocked = await child.call("POST", "/api/auth/password", {
    currentPassword: "clave-inicial",
    newPassword: "otra-clave-123",
  });
  assert.equal(blocked.status, 403);
});
