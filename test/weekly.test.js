import { test } from "node:test";
import assert from "node:assert/strict";
import { weeklySummary, compareText } from "../public/weekly.js";

const titles = { eq: "Ecuaciones", fr: "Fracciones", pot: "Potencias" };
const titleOf = (id) => titles[id] ?? null;
const now = new Date(2026, 9, 18, 20, 0).getTime();
const at = (daysAgo, hour = 17) => new Date(2026, 9, 18 - daysAgo, hour, 0).getTime();
const tries = (lesson, daysAgo, results, hints = 0) =>
  results.map((correct, i) => ({ lesson, correct, hints, at: at(daysAgo) + i * 1000 }));

test("resumen semanal: días, comparación, fortalezas y apoyo", () => {
  const w = weeklySummary(
    [
      ...tries("eq", 0, [true, true, true, true]),
      ...tries("fr", 2, [false, false, true, false], 2),
      ...tries("pot", 2, [true, false]),
      ...tries("eq", 9, [true, false]),
      { lesson: "borrada", correct: true, hints: 0, at: at(1) },
    ],
    titleOf,
    now,
  );
  assert.equal(w.days.length, 7);
  assert.deepEqual(w.days.map((d) => d.count), [0, 0, 0, 0, 6, 1, 4]);
  assert.equal(w.practiceDays, 3);
  assert.equal(w.attempts, 11);
  assert.equal(w.prevAttempts, 2);
  assert.equal(w.prevAccuracy, 50);
  assert.equal(w.lessonsPracticed, 3, "lessons outside the catalog are not listed");
  assert.deepEqual(w.strong.map((l) => l.title), ["Ecuaciones"]);
  assert.deepEqual(w.support.map((l) => l.title), ["Fracciones"]);
  assert.match(w.tip, /Fracciones/);
});

test("resumen semanal: sin práctica y con pocos días", () => {
  const empty = weeklySummary([], titleOf, now);
  assert.equal(empty.attempts, 0);
  assert.equal(empty.accuracy, null);
  assert.match(empty.tip, /no practicó/);
  const few = weeklySummary(tries("eq", 1, [true, true, true]), titleOf, now);
  assert.match(few.tip, /Practicó 1 día\./);
  const good = weeklySummary([0, 1, 3].flatMap((d) => tries("eq", d, [true, true])), titleOf, now);
  assert.match(good.tip, /Buena semana/);
  assert.equal(weeklySummary(undefined, titleOf, now).attempts, 0);
});

test("comparación con la semana anterior", () => {
  assert.equal(compareText(10, 4, ""), " (6 más que la semana anterior)");
  assert.equal(compareText(60, 75, " puntos"), " (15 puntos menos que la semana anterior)");
  assert.equal(compareText(5, 5, ""), " (igual que la semana anterior)");
  assert.equal(compareText(70, null, " puntos"), "");
});
