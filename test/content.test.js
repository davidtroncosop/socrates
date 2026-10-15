import test from "node:test";
import assert from "node:assert/strict";
import {
  CONTENT_KEY,
  seedCatalog,
  validateCatalog,
  mergeCatalog,
  readCatalog,
  writeCatalog,
  formQuestion,
} from "../public/content.js";
import { loadState } from "../public/learning.js";
test("initial catalog supplies complete independent reviews", () => {
  const catalog = validateCatalog(seedCatalog());
  assert.equal(catalog.lessons.length, 63);
  for (const l of catalog.lessons) {
    assert.equal(l.questions.length, 4);
    assert.notEqual(l.review[0], l.questions[3][0]);
  }
});
test("imports merge as drafts without overwriting current lessons", () => {
  const current = seedCatalog(),
    incoming = seedCatalog();
  incoming.lessons = incoming.lessons.slice(0, 1);
  incoming.lessons[0].id = "new-lesson";
  const merged = mergeCatalog(current, incoming);
  assert.equal(merged.lessons.length, current.lessons.length + 1);
  assert.equal(merged.lessons.at(-1).status, "draft");
  assert.equal(current.lessons.length, seedCatalog().lessons.length);
  assert.throws(() => mergeCatalog(current, seedCatalog()), /Ya existe/);
});
test("invalid import data is rejected before writing storage", () => {
  for (const mutate of [
    (c) => c.lessons[0].questions.pop(),
    (c) => (c.lessons[0].review = null),
    (c) => (c.lessons[0].questions[0][1] = Infinity),
    (c) => (c.lessons[0].questions[0][1] = "7"),
    (c) => (c.lessons[0].id = 'bad"id'),
    (c) => (c.lessons[0].title = " "),
    (c) => (c.lessons[0].status = "invalid"),
    (c) => c.lessons.push(c.lessons[0]),
  ]) {
    let wrote = false;
    const c = seedCatalog();
    mutate(c);
    assert.throws(() =>
      writeCatalog(
        {
          setItem() {
            wrote = true;
          },
        },
        c,
      ),
    );
    assert.equal(wrote, false);
  }
});
test("catalog round trips, including intentionally empty catalogs", () => {
  const memory = new Map();
  const storage = {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => memory.set(k, v),
  };
  const c = seedCatalog();
  c.lessons[0].title = "Nuevo título";
  writeCatalog(storage, c);
  assert.deepEqual(readCatalog(storage), c);
  writeCatalog(storage, { version: 1, lessons: [] });
  assert.deepEqual(readCatalog(storage).lessons, []);
  assert.ok(memory.has(CONTENT_KEY));
});
test("failed persistence reports failure and corrupt catalogs are not silently replaced", () => {
  assert.throws(
    () =>
      writeCatalog(
        {
          setItem() {
            throw Error("Quota");
          },
        },
        seedCatalog(),
      ),
    /Quota/,
  );
  assert.throws(() => readCatalog({ getItem: () => "{bad" }));
});
test("numeric authoring accepts fractions and rejects malformed answers", () => {
  const data = new Map([
    ["q-0", "x + 1 = 1.5"],
    ["q-1", "1/2"],
    ["q-2", "Encuentra x"],
    ["q-3", "Resta 1"],
    ["q-4", "x = 0.5"],
  ]);
  assert.equal(formQuestion(data, "q")[1], 0.5);
  data.set("q-1", "");
  assert.throws(() => formQuestion(data, "q"), /numérica/);
});
test("progress for custom and withdrawn lessons survives reload", () => {
  const c = seedCatalog();
  c.lessons.push({ ...c.lessons[0], id: "custom", status: "draft" });
  const saved = {
    version: 1,
    completed: ["custom"],
    mastered: ["custom"],
    reviews: [{ lesson: "custom", due: 1 }],
    attempts: [],
    notes: [],
  };
  const state = loadState({ getItem: () => JSON.stringify(saved) }, c.lessons);
  assert.deepEqual(state.completed, ["custom"]);
  assert.equal(state.reviews[0].lesson, "custom");
});

test("existing catalogs receive new lessons once, preserving edits and withdrawals", () => {
  const old = seedCatalog();
  old.lessons = old.lessons.slice(0, 12);
  old.lessons[0].title = "Mi título editado";
  const memory = new Map([[CONTENT_KEY, JSON.stringify(old)]]);
  const storage = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) };
  const upgraded = readCatalog(storage);
  assert.equal(upgraded.lessons.length, seedCatalog().lessons.length);
  assert.equal(upgraded.lessons[0].title, "Mi título editado");
  upgraded.lessons = upgraded.lessons.filter(l => l.id !== "circulos");
  upgraded.lessons.find(l => l.id === "lectura-medios").status = "draft";
  writeCatalog(storage, upgraded);
  assert.deepEqual(readCatalog(storage), upgraded);
});

test("legacy catalogs gain subject and grade from titles without duplicating them", () => {
  const legacy = seedCatalog();
  for (const l of legacy.lessons) {
    delete l.subject;
    delete l.grade;
  }
  legacy.lessons[0].title = "8° Básico / 1° Medio · Modelamiento";
  legacy.lessons[1].title = "5° Básico · Resumen";
  const migrated = validateCatalog(legacy).lessons;
  assert.equal(migrated[0].grade, "1m");
  assert.equal(migrated[0].title, "Modelamiento");
  assert.equal(migrated[1].grade, "5b");
  assert.equal(migrated[1].title, "Resumen");
  assert.ok(migrated.every((l) => ["matematica", "lenguaje"].includes(l.subject)));
  assert.equal(migrated.find((l) => l.id === "lectura-narraciones").subject, "lenguaje");
  const bad = seedCatalog();
  bad.lessons[0].grade = "9b";
  assert.throws(() => validateCatalog(bad), /curso/);
});

test("lesson videos are validated and optional", () => {
  const c = seedCatalog();
  c.lessons[0].video = { id: "dQw4w9WgXcQ", title: "La balanza", start: 0 };
  assert.deepEqual(validateCatalog(c).lessons[0].video, { id: "dQw4w9WgXcQ", title: "La balanza" });
  assert.equal("video" in validateCatalog(c).lessons[1], false);
  c.lessons[0].video = { id: "x", title: "t" };
  assert.throws(() => validateCatalog(c), /Lección 1: el enlace/);
});

test("catalogs saved before the order-of-operations unit receive it once", () => {
  const before = seedCatalog();
  before.lessons = before.lessons.filter((l) => !l.id.startsWith("jerarquia-"));
  const memory = new Map([
    [CONTENT_KEY, JSON.stringify(before)],
    ["socatres.curriculum.2026-09", "1"],
  ]);
  const storage = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) };
  const upgraded = readCatalog(storage);
  assert.deepEqual(
    upgraded.lessons.filter((l) => l.id.startsWith("jerarquia-")).map((l) => l.id),
    ["jerarquia-mult", "jerarquia-parentesis", "jerarquia-enteros", "jerarquia-potencias"],
  );
  // Si el administrador retira una, no vuelve a aparecer.
  upgraded.lessons = upgraded.lessons.filter((l) => l.id !== "jerarquia-enteros");
  writeCatalog(storage, upgraded);
  assert.equal(readCatalog(storage).lessons.some((l) => l.id === "jerarquia-enteros"), false);
});

test("central catalogs published before new curriculum lessons receive them", async () => {
  const { withNewCurriculum } = await import("../public/content.js");
  const old = seedCatalog();
  old.lessons = old.lessons.filter((l) => !l.id.startsWith("jerarquia-"));
  const before = Date.parse("2026-10-01");
  const ids = (c) => c.lessons.map((l) => l.id).filter((id) => id.startsWith("jerarquia-"));
  assert.equal(ids(withNewCurriculum(old, before)).length, 4, "published before: added");
  const after = Date.parse("2026-11-01");
  assert.equal(ids(withNewCurriculum(old, after)).length, 0, "published after without them: the admin removed them");
  const full = seedCatalog();
  assert.equal(withNewCurriculum(full, before).lessons.length, full.lessons.length, "never duplicates");
});
