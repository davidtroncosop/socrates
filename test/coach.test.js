import test from "node:test";
import assert from "node:assert/strict";
import { hookFor, localDay, localEncouragement, progressSummary } from "../public/coach.js";

const DAY = 86400000;
const lessons = [
  { id: "equations", title: "Encuentra el valor de x" },
  { id: "signs", title: "Haz las paces con los signos" },
  { id: "promedio", title: "Promedio, mediana y moda" },
];

test("the hook asks about the logic behind the idea, with a fallback from the title", () => {
  assert.equal(hookFor(lessons[0]), "¿Sabes la lógica que hay detrás de una ecuación?");
  assert.equal(hookFor({ id: "nueva", title: "Teselados" }), "¿Sabes la lógica que hay detrás de «Teselados»?");
});

test("the progress summary only carries numbers and lesson titles", () => {
  const now = Date.UTC(2026, 10, 23, 15);
  const state = {
    completed: ["equations", "signs"],
    mastered: ["equations"],
    attempts: [
      { lesson: "equations", correct: true, at: now - 3 * DAY },
      { lesson: "signs", correct: false, at: now - 2 * DAY },
      { lesson: "signs", correct: false, at: now - 2 * DAY + 1000 },
      { lesson: "signs", correct: true, at: now - 1 * DAY },
      { lesson: "equations", correct: true, at: now - 20 * DAY },
    ],
    notes: [{ title: "Mi nota", text: "Me llamo Ana y vivo en…", at: now }],
  };
  const p = progressSummary({ state, lessons, streak: 2, dueReviews: 1, next: lessons[2], now });
  assert.deepEqual(p, {
    streak: 2,
    completed: 2,
    mastered: 1,
    daysThisWeek: 3,
    correctThisWeek: 2,
    wrongThisWeek: 2,
    dueReviews: 1,
    practicedToday: false,
    lastLesson: "Haz las paces con los signos",
    nextLesson: "Promedio, mediana y moda",
    hardLesson: "Haz las paces con los signos",
  });
  assert.doesNotMatch(JSON.stringify(p), /Ana/, "notes never leave the device for this");
});

test("local encouragement is positive and suggests a concrete step", () => {
  const base = { streak: 0, completed: 0, mastered: 0, correctThisWeek: 0, dueReviews: 0, practicedToday: false, nextLesson: "", hardLesson: "" };
  assert.match(localEncouragement(base), /paso|calma/);
  assert.match(localEncouragement({ ...base, completed: 3, streak: 4, nextLesson: "Razones" }), /4 días seguidos.*«Razones»/);
  assert.match(localEncouragement({ ...base, completed: 3, hardLesson: "Potencias", dueReviews: 2 }), /Equivocarse en «Potencias» es parte de aprender.*repaso/);
  assert.match(localEncouragement({ ...base, completed: 1, practicedToday: true }), /hoy/i);
  assert.match(localDay(Date.now()), /^\d{4}-\d{2}-\d{2}$/);
});
