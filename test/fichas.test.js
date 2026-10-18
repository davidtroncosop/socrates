import { test } from "node:test";
import assert from "node:assert/strict";
import { earnedFichas } from "../public/stats.js";

test("fichas premian constancia, no aciertos", () => {
  const day = (iso, n, correct) =>
    Array.from({ length: n }, (_, i) => ({ lesson: "equations", correct, at: Date.parse(iso) + i * 1000 }));
  const state = {
    completed: ["equations", "signs", "signs"],
    attempts: [...day("2026-10-12T15:00:00Z", 5, false), ...day("2026-10-13T15:00:00Z", 4, true)],
    archive: { days: ["2026-09-01", "2026-09-02"] },
  };
  // 1 día con 5 ejercicios (aunque todos errados) + 2 días resumidos; 2 lecciones distintas.
  assert.deepEqual(earnedFichas(state), { days: 3, lessons: 2, total: 7 });
  assert.deepEqual(earnedFichas(null), { days: 0, lessons: 0, total: 0 });
});
