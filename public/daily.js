// «Práctica del día»: una sesión corta que mezcla lo que toca repasar, lo que
// más cuesta y un recuerdo de lo ya aprendido. Solo lecciones completadas: lo
// nuevo se aprende en su lección, con la explicación inicial.
import { getSubject } from "./learning.js";
import { generateQuestions } from "./generators.js";

const DAY = 86400000;
export const XP_PER_CORRECT = 10;
export const GOALS = [
  { xp: 30, label: "Relajada", minutes: 5 },
  { xp: 50, label: "Regular", minutes: 10 },
  { xp: 80, label: "Intensa", minutes: 15 },
];
export const DEFAULT_GOAL = 50;
const MIN_SIZE = 3;

const dayKey = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

// XP de hoy según la hora local del dispositivo.
export function xpToday(state, now = Date.now()) {
  const today = dayKey(now);
  return (
    state.attempts.filter((a) => a.correct && dayKey(a.at) === today).length *
    XP_PER_CORRECT
  );
}

// Confirmar dominio exige que la última práctica de la lección tenga 24 h.
export const canConfirm = (state, lessonId, now = Date.now()) =>
  state.completed.includes(lessonId) &&
  state.attempts
    .filter((a) => a.lesson === lessonId)
    .every((a) => a.at <= now - DAY);

function reviewQuestions(lesson, rng) {
  return (
    generateQuestions(lesson.id, [3], rng) ??
    (getSubject(lesson) === "lenguaje"
      ? [lesson.review, lesson.questions[3]]
      : [lesson.review])
  );
}
const practiceQuestion = (lesson, level, rng) =>
  generateQuestions(lesson.id, [level], rng)?.[0] ?? lesson.questions[level];

export function buildDailyPlan({ lessons, state, now = Date.now(), rng = Math.random, size = 6 }) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const done = state.completed.filter((id) => byId.has(id));
  const items = [];
  const used = new Set();
  const add = (lesson, question, origin) => items.push({ lesson, question, origin });

  // 1. Repasos vencidos (máximo dos lecciones); pueden confirmar dominio.
  for (const r of state.reviews
    .filter((r) => r.due <= now && byId.has(r.lesson))
    .sort((a, b) => a.due - b.due)
    .slice(0, 2)) {
    const lesson = byId.get(r.lesson);
    used.add(lesson.id);
    for (const q of reviewQuestions(lesson, rng)) add(lesson, q, "review");
  }

  // 2. Lo que más cuesta: más errores en los últimos 14 días.
  const recent = state.attempts.filter((a) => a.at >= now - 14 * DAY);
  const errorRate = (id) => {
    const tries = recent.filter((a) => a.lesson === id);
    return tries.length >= 2 ? tries.filter((a) => !a.correct).length / tries.length : 0;
  };
  for (const id of done
    .filter((id) => !used.has(id) && errorRate(id) > 0)
    .sort((a, b) => errorRate(b) - errorRate(a))
    .slice(0, 2)) {
    used.add(id);
    add(byId.get(id), practiceQuestion(byId.get(id), 2, rng), "weak");
  }

  // 3. Recuerdo: lo practicado hace más tiempo.
  const lastSeen = (id) =>
    Math.max(
      state.archive?.last?.[id] ?? 0,
      ...state.attempts.filter((a) => a.lesson === id).map((a) => a.at),
    );
  const pool = done.filter((id) => !used.has(id)).sort((a, b) => lastSeen(a) - lastSeen(b));
  for (const level of [1, 2, 0])
    for (const id of pool)
      if (items.length < size) add(byId.get(id), practiceQuestion(byId.get(id), level, rng), "recall");
  // Con pocas lecciones, al menos 3 ejercicios aunque se repita una lección.
  for (const level of [1, 2])
    for (const id of done)
      if (items.length < MIN_SIZE) add(byId.get(id), practiceQuestion(byId.get(id), level, rng), "recall");

  return items;
}
