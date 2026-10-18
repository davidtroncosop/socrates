// Resumen semanal para el apoderado: qué días practicó, cómo le fue comparado
// con la semana anterior, dónde le va bien, dónde necesita apoyo y una
// sugerencia concreta. Se calcula con los intentos de los últimos 14 días.
const DAY = 86400000;
const MIN_ATTEMPTS = 3;

const startOfDay = (ms) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const accuracy = (list) =>
  list.length ? Math.round((list.filter((a) => a.correct).length / list.length) * 100) : null;

// `titleOf` devuelve el nombre de la lección, o null si ya no está en el catálogo.
export function weeklySummary(recent, titleOf, now = Date.now()) {
  const attempts = Array.isArray(recent) ? recent.filter((a) => a && Number.isFinite(a.at)) : [];
  const today = startOfDay(now);
  // Siete días calendario, terminando hoy.
  const days = Array.from({ length: 7 }, (_, i) => {
    const start = startOfDay(today - (6 - i) * DAY + DAY / 2);
    return {
      start,
      label: new Date(start).toLocaleDateString("es-CL", { weekday: "short" }).replace(".", ""),
      count: 0,
    };
  });
  const weekStart = days[0].start;
  const prevStart = startOfDay(weekStart - 7 * DAY + DAY / 2);
  const week = attempts.filter((a) => a.at >= weekStart && a.at <= now);
  const prev = attempts.filter((a) => a.at >= prevStart && a.at < weekStart);
  for (const a of week) {
    const day = days.findLast((d) => a.at >= d.start);
    if (day) day.count++;
  }

  const title = (id) => titleOf(id) ?? null;
  const byLesson = new Map();
  for (const a of week) byLesson.set(a.lesson, [...(byLesson.get(a.lesson) ?? []), a]);
  const lessonStats = [...byLesson]
    .map(([id, list]) => ({
      id,
      title: title(id),
      attempts: list.length,
      accuracy: accuracy(list),
      hints: list.reduce((sum, a) => sum + (a.hints || 0), 0) / list.length,
    }))
    .filter((l) => l.title && l.attempts >= MIN_ATTEMPTS);
  const support = lessonStats
    .filter((l) => l.accuracy < 60 || l.hints >= 1.5)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
    .slice(0, 3);
  const strong = lessonStats
    .filter((l) => l.accuracy >= 80 && !support.includes(l))
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)
    .slice(0, 3);
  const practiceDays = days.filter((d) => d.count > 0).length;

  return {
    days: days.map(({ label, count }) => ({ label, count })),
    practiceDays,
    attempts: week.length,
    accuracy: accuracy(week),
    prevAttempts: prev.length,
    prevAccuracy: accuracy(prev),
    lessonsPracticed: [...byLesson.keys()].filter(title).length,
    strong,
    support,
    tip: tipFor({ attempts: week.length, practiceDays, support }),
  };
}

function tipFor({ attempts, practiceDays, support }) {
  if (!attempts)
    return "Esta semana no practicó. Propónganse 10 minutos al día, siempre a la misma hora: la constancia ayuda más que una sesión larga.";
  if (support.length)
    return `Le está costando «${support[0].title}». Miren juntos el video de esa lección y pídele que te explique el primer paso con sus palabras: explicar en voz alta ayuda a fijar el procedimiento.`;
  if (practiceDays < 3)
    return `Practicó ${practiceDays === 1 ? "1 día" : `${practiceDays} días`}. Intenten llegar a 3 o más días por semana: practicar seguido, aunque sea poco, ayuda más que una sesión larga.`;
  return "Buena semana. Reconoce su esfuerzo y su constancia, no solo los aciertos: eso es lo que mantiene la motivación.";
}

export function compareText(now, before, unit) {
  if (before === null || before === undefined) return "";
  const diff = now - before;
  if (!diff) return " (igual que la semana anterior)";
  return ` (${Math.abs(diff)}${unit} ${diff > 0 ? "más" : "menos"} que la semana anterior)`;
}
