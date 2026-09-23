import test from "node:test";
import assert from "node:assert/strict";
import { buildDailyPlan, xpToday, canConfirm } from "../public/daily.js";
import { seedCatalog } from "../public/content.js";

const lessons = seedCatalog().lessons;
const now = Date.UTC(2026, 8, 23, 15);
const DAY = 86400000;
const base = { version: 1, diagnosed: true, completed: [], mastered: [], attempts: [], notes: [], reviews: [] };

test("nothing to practice until a lesson is completed", () => {
  assert.deepEqual(buildDailyPlan({ lessons, state: base, now }), []);
});

test("due reviews come first, then the weakest skills, then recall", () => {
  const state = {
    ...base,
    completed: ["equations", "signs", "enteros", "semejantes", "lectura-narraciones"],
    reviews: [
      { lesson: "lectura-narraciones", due: now - 1000 },
      { lesson: "semejantes", due: now + DAY },
    ],
    attempts: [
      { lesson: "signs", correct: false, at: now - DAY },
      { lesson: "signs", correct: false, at: now - DAY },
      { lesson: "enteros", correct: false, at: now - DAY },
      { lesson: "enteros", correct: true, at: now - DAY },
      { lesson: "equations", correct: true, at: now - 5 * DAY },
      { lesson: "equations", correct: true, at: now - 5 * DAY },
    ],
  };
  const plan = buildDailyPlan({ lessons, state, now });
  assert.equal(plan.length, 6);
  assert.deepEqual(plan.slice(0, 2).map((i) => [i.lesson.id, i.origin]), [
    ["lectura-narraciones", "review"],
    ["lectura-narraciones", "review"],
  ], "reading reviews ask two questions");
  assert.deepEqual(plan.slice(2, 4).map((i) => [i.lesson.id, i.origin]), [
    ["signs", "weak"],
    ["enteros", "weak"],
  ]);
  assert.ok(plan.slice(4).every((i) => i.origin === "recall"));
  assert.ok(!plan.some((i) => i.lesson.id === "semejantes" && i.origin === "review"), "future reviews wait");
  for (const { question } of plan) assert.ok(question.length >= 5 && Number.isFinite(question[1]));
});

test("a single completed lesson still gives a short varied session", () => {
  const plan = buildDailyPlan({ lessons, state: { ...base, completed: ["equations"] }, now });
  assert.equal(plan.length, 3);
  assert.equal(new Set(plan.map((i) => i.question[0])).size, 3);
});

test("today's XP and mastery eligibility", () => {
  const state = {
    ...base,
    completed: ["equations"],
    attempts: [
      { lesson: "equations", correct: true, at: now - 60000 },
      { lesson: "equations", correct: false, at: now - 30000 },
      { lesson: "equations", correct: true, at: now - 3 * DAY },
    ],
  };
  assert.equal(xpToday(state, now), 10);
  assert.equal(canConfirm(state, "equations", now), false);
  assert.equal(canConfirm({ ...state, attempts: state.attempts.slice(2) }, "equations", now), true);
  assert.equal(canConfirm(state, "signs", now), false);
});
