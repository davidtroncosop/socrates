import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SHEET_SIZE,
  MAX_MICRO_LEVEL,
  unitLevel,
  lessonLevel,
  targetTimeMs,
  formatDuration,
  buildSheet,
  createSheetItems,
  gradeSheetRound,
  evaluateSheet,
  comfortableStart,
  pickDailySheet,
} from "../public/sheets.js";
import { seedCatalog } from "../public/content.js";
import { loadState, mergeStates, getSubject } from "../public/learning.js";
import { UNIT_DEFINITIONS, routeOrder } from "../public/units.js";

const lessons = seedCatalog().lessons;
const lessonById = (id) => lessons.find((l) => l.id === id);

test("neutral Kumon levels map math units A..O without school-grade stigma", () => {
  const mathUnits = UNIT_DEFINITIONS.filter((u) => u.subject === "matematica");
  assert.equal(unitLevel(mathUnits[0]).label, "Nivel A");
  assert.equal(unitLevel(mathUnits[1]).label, "Nivel B");
  assert.equal(unitLevel(mathUnits[3]).label, "Nivel D");
  assert.equal(lessonLevel("base-suma-resta").code, "A");
  assert.equal(lessonLevel("equations").code, "D");
  assert.equal(lessonLevel("derivadas").label, "Nivel N");
});

test("buildSheet generates 8 exercises per micro-level for generated lessons and falls back cleanly for curated ones", () => {
  const eq = lessonById("equations");
  const sheet = buildSheet(eq, 0, { sheetNumber: 3 });
  assert.equal(sheet.questions.length, SHEET_SIZE);
  assert.equal(sheet.code, "D1-03");
  assert.equal(sheet.microLevel, 0);
  assert.ok(sheet.targetMs >= 8 * 40_000);
  assert.ok(new Set(sheet.questions.map((q) => q[0])).size >= 4, "varied exercises");

  // Lección sin generador usa sus ejercicios curados sin fallar.
  const curated = {
    id: "sin-generador",
    title: "Curada",
    subject: "matematica",
    questions: [
      ["1 + 1", 2, "e", "p", "x"],
      ["2 + 2", 4, "e", "p", "x"],
      ["3 + 3", 6, "e", "p", "x"],
      ["4 + 4", 8, "e", "p", "x"],
    ],
    review: ["5 + 5", 10, "e", "p", "x"],
  };
  const fallback = buildSheet(curated, 2);
  assert.equal(fallback.questions.length, 5);
});

test("gradeSheetRound enforces 100% self-correction before closing the sheet", () => {
  const sheet = buildSheet(lessonById("equations"), 0);
  const items = createSheetItems(sheet.questions);

  // Ronda 1: acierta 6, falla 2 (índices 1 y 4).
  const round1Answers = sheet.questions.map((q, i) =>
    i === 1 || i === 4 ? String(q[1] + 99) : String(q[1]),
  );
  const r1 = gradeSheetRound(sheet, round1Answers, items);
  assert.equal(r1.allResolved, false, "sheet stays open until 100% corrected");
  assert.deepEqual(r1.unresolvedIndices, [1, 4]);
  assert.equal(r1.items[0].firstPassCorrect, true);
  assert.equal(r1.items[1].firstPassCorrect, false);
  assert.match(r1.items[1].feedback, /Corrígelo|pista/);

  // Ronda 2: corrige los 2 pendientes -> 100% resuelto, conservando firstPassCorrect original.
  const round2Answers = sheet.questions.map((q) => String(q[1]));
  const r2 = gradeSheetRound(sheet, round2Answers, r1.items);
  assert.equal(r2.allResolved, true);
  assert.deepEqual(r2.unresolvedIndices, []);
  assert.equal(r2.items[1].resolved, true);
  assert.equal(r2.items[1].firstPassCorrect, false, "correction does not rewrite first-pass accuracy");
  assert.equal(r2.newlyChecked.length, 2, "already-correct items are not re-graded");
});

test("evaluateSheet uses first-pass accuracy + silent SCT fluency to advance or repeat", () => {
  const sheet = buildSheet(lessonById("equations"), 0);
  const perfect = createSheetItems(sheet.questions).map((it) => ({
    ...it,
    resolved: true,
    firstPassCorrect: true,
  }));

  // 1) Alta precisión y tiempo fluido -> sube a micro-nivel 1.
  const fast = evaluateSheet(sheet, perfect, 120_000, { level: 0, count: 1, bestMs: 150_000 });
  assert.equal(fast.advance, true);
  assert.equal(fast.nextLevel, 1);
  assert.equal(fast.reason, "advance");
  assert.equal(fast.improvedMs, 30_000);
  assert.match(fast.message, /más fluido/);

  // 2) Alta precisión pero sobre el tiempo cómodo (SCT) -> repite hoja por fluidez sin castigo.
  const slow = evaluateSheet(sheet, perfect, sheet.targetMs + 120_000, null);
  assert.equal(slow.advance, false);
  assert.equal(slow.accurate, true);
  assert.equal(slow.fluent, false);
  assert.equal(slow.reason, "fluency");
  assert.equal(slow.nextLevel, 0);

  // 3) Baja precisión al primer intento (<85 %, ej. 6/8 = 75 %) aunque corregida al 100 % -> repite.
  const corrected = perfect.map((it, i) => (i < 2 ? { ...it, firstPassCorrect: false } : it));
  const retry = evaluateSheet(sheet, corrected, 90_000, null);
  assert.equal(retry.advance, false);
  assert.equal(retry.reason, "accuracy");
  assert.equal(retry.firstPassAccuracy, 75);
  assert.equal(retry.correctedCount, 2);

  // 4) Micro-nivel 3 completado con precisión y fluidez -> dominio completo (level 4).
  const finalSheet = buildSheet(lessonById("equations"), 3);
  const mastered = evaluateSheet(finalSheet, perfect, 150_000, { level: 3, count: 3, bestMs: 200_000 });
  assert.equal(mastered.masteredLesson, true);
  assert.equal(mastered.nextLevel, MAX_MICRO_LEVEL);
  assert.equal(mastered.reason, "mastered");

  assert.equal(formatDuration(45_000), "45 s");
  assert.equal(formatDuration(135_000), "2 min 15 s");
  assert.ok(targetTimeMs("base-suma-resta", 0) < targetTimeMs("equations", 0));
});

test("comfortableStart places the student one step before their first stumble and pickDailySheet prioritizes it", () => {
  const route = routeOrder(lessons);
  const planned = ["base-suma-resta", "base-multiplicar", "base-fracciones"].map(lessonById);
  const solved = new Set(["base-suma-resta", "base-multiplicar"]);

  const comfy = comfortableStart(planned, solved, route);
  assert.equal(comfy.id, "base-multiplicar", "one step below the first stumble");

  // Si tropieza en la primera del diagnóstico, busca la lección previa en la ruta.
  const veryFirst = comfortableStart(planned, new Set(), route);
  assert.equal(veryFirst.id, "base-redondeo");

  const pick = pickDailySheet({
    lessons,
    state: { version: 1, completed: ["base-suma-resta", "base-multiplicar"], kumonStart: comfy.id },
    next: lessonById("base-fracciones"),
  });
  assert.equal(pick.lesson.id, "base-multiplicar");
  assert.equal(pick.comfortable, true);

  // Si hay una hoja ya empezada (level < 4), retoma esa primero.
  const resume = pickDailySheet({
    lessons,
    state: {
      version: 1,
      completed: ["equations"],
      kumonStart: "base-multiplicar",
      sheets: { equations: { level: 1, count: 2, bestMs: 110_000, lastAt: 500 } },
    },
    next: lessonById("enteros"),
  });
  assert.equal(resume.lesson.id, "equations");
  assert.equal(resume.microLevel, 1);
  assert.equal(resume.sheetNumber, 3);
});

test("sheets progress and kumonStart survive loadState and merge cleanly across devices", () => {
  const store = {
    getItem: () =>
      JSON.stringify({
        version: 1,
        completed: ["equations"],
        mastered: [],
        attempts: [],
        notes: [],
        reviews: [],
        kumonStart: "base-multiplicar",
        sheets: {
          equations: { level: 2, count: 3, bestMs: 120_000, lastMs: 130_000, lastAccuracy: 100, lastAt: 200 },
          inexistente: { level: 3, count: 5, lastAt: 999 },
        },
      }),
  };
  const loaded = loadState(store, lessons);
  assert.equal(loaded.kumonStart, "base-multiplicar");
  assert.equal(loaded.sheets.equations.level, 2);
  assert.equal(loaded.sheets.inexistente, undefined);

  const remote = {
    version: 1,
    diagnosed: true,
    completed: ["equations"],
    mastered: [],
    attempts: [],
    notes: [],
    reviews: [],
    sheets: {
      equations: { level: 3, count: 4, bestMs: 115_000, lastMs: 115_000, lastAccuracy: 100, lastAt: 400 },
      enteros: { level: 1, count: 1, bestMs: 180_000, lastMs: 180_000, lastAccuracy: 88, lastAt: 300 },
    },
  };
  const merged = mergeStates(loaded, remote);
  assert.equal(merged.sheets.equations.level, 3);
  assert.equal(merged.sheets.equations.bestMs, 115_000);
  assert.equal(merged.sheets.enteros.level, 1);
  assert.equal(merged.kumonStart, "base-multiplicar");
  assert.ok(lessons.filter((l) => getSubject(l) === "matematica").length >= 120);
});

test("landing page reflects current Kumon + tutor value proposition, CLP pricing and strict CSP", () => {
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/i, "no inline scripts (CSP script-src 'self')");
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i, "no inline event handlers");
  for (const id of ["login-dialog", "panel-login", "panel-register", "panel-demo", "panel-recover", "panel-code"])
    assert.match(html, new RegExp(`id="${id}"`), `keeps #${id}`);
  assert.match(html, /14 días gratis sin tarjeta/i);
  assert.match(html, /\$9\.990/);
  assert.match(html, /\$18\.990/);
  assert.match(html, /Kumon/i);
  assert.match(html, /Niveles neutros \(A–O\)/);
  assert.match(html, /125 minijuegos/);
  assert.match(html, /id="colegios"/);
  assert.match(html, /id="school-form"/);
  assert.match(html, /buho-saluda\.webp/);
  assert.match(html, /Quién hace socatres/);
});
