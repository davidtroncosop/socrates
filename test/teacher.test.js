import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handle } from "../functions/_lib/router.js";
import { seedCatalog } from "../public/content.js";
import {
  extractObjective,
  studentCurrentLevel,
  analyzeCohort,
  createDemoTeacherApi,
} from "../public/teacher-analytics.js";

const migrations = readdirSync(new URL("../migrations/", import.meta.url))
  .filter((f) => f.endsWith(".sql"))
  .sort();
const migration = (name) => readFileSync(new URL(`../migrations/${name}`, import.meta.url), "utf8");

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

function client(env) {
  let cookie = "";
  const call = async (method, path, body) => {
    const res = await handle(
      new Request("https://socatres.test" + path, {
        method,
        headers: {
          ...(body !== undefined ? { "content-type": "application/json" } : {}),
          ...(cookie ? { cookie } : {}),
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

const registerTeacher = (c, name, email) =>
  c.call("POST", "/api/auth/register", { name, email, role: "teacher", password: "clave-segura" });
const registerStudent = (c, name, email) =>
  c.call("POST", "/api/auth/register", { name, email, role: "student", age14: true, password: "clave-segura" });
const registerParent = (c, name, email) =>
  c.call("POST", "/api/auth/register", { name, email, role: "parent", password: "clave-segura" });

test("migration 0009 preserves all existing records, FKs and cascades while enabling teacher role", () => {
  const idx0008 = migrations.findIndex((m) => m.startsWith("0008_"));
  assert.ok(idx0008 >= 0);
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  for (const name of migrations.slice(0, idx0008 + 1)) db.exec(migration(name));

  db.exec(`
    INSERT INTO users VALUES ('p1', 'mama@a.cl', NULL, 'Mamá', 'parent', 'h', 'r', NULL, 1);
    INSERT INTO users VALUES ('c1', NULL, 'tomas.r', 'Tomás', 'student', 'h', NULL, 'p1', 2);
    INSERT INTO sessions VALUES ('tok1', 'p1', 9999999999999);
    INSERT INTO progress VALUES ('c1', '{"version":1}', 10);
    INSERT INTO family_links VALUES ('p1', 'c1', 10);
    INSERT INTO family_rewards VALUES ('rew1', 'p1', 'Cine', 5, 10);
    INSERT INTO reward_claims VALUES ('clm1', 'c1', 'p1', 'rew1', 'Cine', 5, 'pending', 10, NULL);
    INSERT INTO telegram_links VALUES ('p1', 'chat123', 18, 'America/Santiago', 1, 1, 0, NULL, NULL, 10);
  `);

  db.exec(migration("0009_clases.sql"));

  assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM users").get().n, 2);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM reward_claims").get().n, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM telegram_links").get().n, 1);

  db.exec("INSERT INTO users VALUES ('t1', 'profe@colegio.cl', NULL, 'Profe', 'teacher', 'h', 'r', NULL, 3);");
  assert.equal(db.prepare("SELECT role FROM users WHERE id = 't1'").get().role, "teacher");
});

test("teachers create classes, batch-import roster without email, set focus, and never see private notes", async () => {
  const env = { DB: d1() };
  const teacher = client(env);
  const otherTeacher = client(env);
  const teen = client(env);
  const mom = client(env);

  const reg = await registerTeacher(teacher, "Camila Rojas", "camila@colegio.cl");
  assert.equal(reg.status, 200);
  assert.equal(reg.body.user.role, "teacher");

  await registerTeacher(otherTeacher, "Otro Profe", "otro@colegio.cl");
  await registerStudent(teen, "Sofía Mayor", "sofia@liceo.cl");
  await registerParent(mom, "Papá", "papa@casa.cl");

  // Solo docentes pueden crear cursos.
  assert.equal((await teen.call("POST", "/api/classes", { name: "7B" })).status, 403);
  assert.equal((await mom.call("POST", "/api/classes", { name: "7B" })).status, 403);

  const createdClass = await teacher.call("POST", "/api/classes", {
    name: "7° Básico B · Matemática",
    school: "Escuela Gabriela Mistral",
    grade: "7b",
  });
  assert.equal(createdClass.status, 201);
  const courseId = createdClass.body.course.id;
  const boardCode = createdClass.body.course.code;
  assert.match(boardCode, /^[A-HJKMNP-Z2-9]{6}$/);

  // Otro docente recibe 404 al intentar leer o editar un curso ajeno (sin filtrar existencia).
  assert.equal((await otherTeacher.call("GET", `/api/classes/${courseId}`)).status, 404);
  assert.equal((await otherTeacher.call("PUT", `/api/classes/${courseId}`, { name: "Hack" })).status, 404);

  // Carga rápida de nómina sin correo: desambigua usuarios repetidos y entrega claves legibles.
  const roster = await teacher.call("POST", `/api/classes/${courseId}/roster`, {
    namesText: "Martín Muñoz\nMartín Muñoz\nValentina Ávila\n",
  });
  assert.equal(roster.status, 201);
  assert.equal(roster.body.created.length, 3);
  assert.equal(roster.body.created[0].username, "martin.munoz");
  assert.equal(roster.body.created[1].username, "martin.munoz2");
  assert.equal(roster.body.created[2].username, "valentina.avila");
  assert.match(roster.body.created[0].password, /^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);

  // El estudiante escolar entra con usuario y clave, guarda avance con nota privada y hoja Kumon.
  const schoolKid = client(env);
  const kidLogin = await schoolKid.call("POST", "/api/auth/login", {
    login: roster.body.created[0].username,
    password: roster.body.created[0].password,
  });
  assert.equal(kidLogin.status, 200);
  assert.equal(kidLogin.body.user.managedByParent, true);

  const now = Date.now();
  await schoolKid.call("PUT", "/api/progress", {
    state: {
      version: 1,
      diagnosed: true,
      completed: ["equations"],
      mastered: [],
      kumonStart: "jerarquia-mult",
      sheets: { equations: { level: 2, count: 3, bestMs: 120000, lastMs: 120000, lastAccuracy: 100, lastAt: now } },
      attempts: [
        { lesson: "enteros", correct: false, hints: 2, at: now - 2000 },
        { lesson: "enteros", correct: false, hints: 1, at: now - 1000 },
        { lesson: "enteros", correct: true, hints: 1, at: now - 500 },
      ],
      notes: [{ title: "Secreto", text: "Mi reflexión privada del cuaderno", at: now }],
      reviews: [],
    },
  });

  // Estudiante mayor con cuenta propia se une mediante el código de pizarra.
  const joined = await teen.call("POST", "/api/classes/join", { code: boardCode.toLowerCase() });
  assert.equal(joined.status, 200);
  assert.equal(joined.body.course.name, "7° Básico B · Matemática");

  // El docente asigna una lección foco al grupo y el estudiante la recibe en GET /api/classes.
  const focused = await teacher.call("PUT", `/api/classes/${courseId}`, {
    focusLesson: "enteros",
    focusNote: "Resuelvan el ascensor y la Hoja 1 en su cuaderno.",
  });
  assert.equal(focused.status, 200);
  assert.equal(focused.body.course.focusLesson, "enteros");

  const studentClasses = await teen.call("GET", "/api/classes");
  assert.equal(studentClasses.status, 200);
  assert.equal(studentClasses.body.classes[0].focusLesson, "enteros");
  assert.equal(studentClasses.body.classes[0].canLeave, true);
  assert.equal((await schoolKid.call("GET", "/api/classes")).body.classes[0].canLeave, false);

  // El detalle del curso entrega cifras y tropiezos, pero JAMÁS las notas privadas.
  const detail = await teacher.call("GET", `/api/classes/${courseId}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.students.length, 4);
  assert.doesNotMatch(JSON.stringify(detail.body), /reflexión privada|Secreto/);

  const martin = detail.body.students.find((s) => s.username === "martin.munoz");
  assert.equal(martin.managedByTeacher, true);
  assert.equal(martin.sheetsCompleted, 3);
  const sofia = detail.body.students.find((s) => s.name === "Sofía Mayor");
  assert.equal(sofia.managedByTeacher, false);

  // El docente puede restablecer la clave de una cuenta escolar creada por él, NUNCA la de Sofía.
  assert.equal(
    (await teacher.call("POST", `/api/classes/${courseId}/students/${sofia.id}/password`, {})).status,
    403,
  );
  const reset = await teacher.call("POST", `/api/classes/${courseId}/students/${martin.id}/password`, {});
  assert.equal(reset.status, 200);
  assert.match(reset.body.credential.password, /^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
  assert.equal((await schoolKid.call("GET", "/api/me")).status, 401, "old school session revoked");

  // Rotar código invalida el código anterior en la pizarra sin expulsar a los ya inscritos.
  const rotated = await teacher.call("POST", `/api/classes/${courseId}/rotate-code`, {});
  assert.equal(rotated.status, 200);
  assert.notEqual(rotated.body.code, boardCode);
  assert.equal((await teen.call("POST", "/api/classes/join", { code: boardCode })).status, 404);

  // Eliminar el curso borra cuentas escolares huérfanas pero conserva cuentas propias (Sofía).
  assert.equal((await teacher.call("DELETE", `/api/classes/${courseId}`)).status, 200);
  assert.equal((await teen.call("GET", "/api/me")).status, 200);
  assert.equal(
    env.DB.raw.prepare("SELECT COUNT(*) AS n FROM users WHERE username = 'martin.munoz'").get().n,
    0,
  );
});

test("analyzeCohort ranks MINEDUC OA stumbles, maps neutral A-O levels, and demo store is interactive", async () => {
  const lessons = seedCatalog().lessons;
  const eq = lessons.find((l) => l.id === "equations");
  assert.deepEqual(extractObjective(eq), {
    code: "MA07 OA 09",
    detail: "La balanza: haz lo mismo en los dos lados",
  });

  const storeMap = new Map();
  const storage = {
    getItem: (k) => storeMap.get(k) ?? null,
    setItem: (k, v) => storeMap.set(k, v),
  };
  const demoApi = createDemoTeacherApi(storage);
  const { classes } = await demoApi.classes();
  assert.equal(classes.length, 2);

  const detail = await demoApi.classDetail(classes[0].id);
  const cohort = analyzeCohort({
    course: detail.course,
    students: detail.students,
    lessons,
  });

  assert.equal(cohort.pulse.totalStudents, 8);
  assert.ok(cohort.pulse.activeWeek >= 6);
  assert.ok(cohort.stumbles.length >= 2);
  assert.match(cohort.stumbles[0].oa, /^MA0[678] OA/);
  assert.ok(cohort.levelDistribution.some((l) => l.count > 0 && /^Nivel [A-O]$/.test(l.label)));
  assert.ok(cohort.students.some((s) => s.status === "support" && s.supportTopics.length > 0));
  assert.ok(cohort.students.some((s) => s.status === "inactive"));

  // En modo demo también se pueden crear nóminas y fijar foco grupal.
  const added = await demoApi.addRoster(classes[0].id, { namesText: "Javiera Pino\nCristóbal Vega" });
  assert.equal(added.created.length, 2);
  await demoApi.updateClass(classes[0].id, { focusLesson: "equations", focusNote: "Practicar balanza" });
  const updated = await demoApi.classDetail(classes[0].id);
  assert.equal(updated.students.length, 10);
  assert.equal(updated.course.focusLesson, "equations");
  assert.equal(studentCurrentLevel(updated.students.at(-1), lessons).code, "—");
});

test("teacher UI renders #sala, hides student-only nav, and unlocks any lesson or Kumon sheet for projection/print", async () => {
  const nodes = new Map();
  const makeNode = () => ({
    value: "",
    innerHTML: "",
    textContent: "",
    disabled: false,
    hidden: false,
    dataset: {},
    classList: { toggle() {} },
    setAttribute() {},
    removeAttribute() {},
    querySelector: (s) => getNode(s),
    querySelectorAll: () => [],
    addEventListener(type, fn) {
      this[type] = fn;
    },
    after() {},
    showModal() {},
    close() {},
  });
  const getNode = (k) => {
    if (!nodes.has(k)) nodes.set(k, makeNode());
    return nodes.get(k);
  };

  const store = new Map([
    [
      "socatres.demo-session.v1",
      JSON.stringify({
        mode: "demo",
        role: "teacher",
        name: "Docente PIE demo",
        expiresAt: Date.now() + 86400000,
      }),
    ],
  ]);
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  globalThis.location = { hash: "" };
  globalThis.window = { addEventListener() {} };
  globalThis.document = {
    querySelector: (s) => (s === ".storage-warning" ? null : getNode(s)),
    querySelectorAll: () => [],
    createElement: () => makeNode(),
    addEventListener() {},
  };

  await import(`../public/app.js?teacher_ui=${Math.random()}`);
  await new Promise((r) => setTimeout(r, 30));

  assert.equal(getNode('[data-nav="sala"]').hidden, false, "Mis cursos nav is visible for teachers");
  assert.equal(getNode('[data-nav="cuaderno"]').hidden, true, "student notebook nav is hidden for teachers");
  assert.match(getNode("#app").innerHTML, /7° Básico A · Matemática/);
  assert.match(getNode("#app").innerHTML, /Dónde se traba el grupo/);
  assert.match(getNode("#app").innerHTML, /Ubicación en Niveles A–O/);

  // Un docente puede abrir directamente una hoja avanzada (ej. 4° Medio / derivadas) sin bloqueo de prerrequisitos.
  getNode("#app").click({
    target: { closest: () => ({ dataset: { action: "sheet:derivadas" }, disabled: false }) },
  });
  assert.match(getNode("#app").innerHTML, /HOJA .* PASO 1 DE 4/);
});

