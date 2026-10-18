// Métricas de motivación derivadas del progreso; no afectan el dominio.
export function getStreakInfo(state) {
  const datesSet = new Set();
  if (Array.isArray(state?.attempts)) {
    for (const a of state.attempts) {
      if (a && typeof a.at === "number") {
        datesSet.add(new Date(a.at).toISOString().slice(0, 10));
      }
    }
  }
  if (Array.isArray(state?.notes)) {
    for (const n of state.notes) {
      if (n && typeof n.at === "number") {
        datesSet.add(new Date(n.at).toISOString().slice(0, 10));
      }
    }
  }
  // Días de práctica de los intentos ya resumidos.
  for (const day of state?.archive?.days ?? []) datesSet.add(day);

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (datesSet.size === 0) {
    return { streak: 1, practicedToday: false, hasFreeze: true, freezeUsed: false };
  }

  const practicedToday = datesSet.has(todayStr);
  let streak = 0;
  let freezeUsed = false;

  let checkTime = practicedToday ? Date.now() : Date.now() - 86400000;
  while (true) {
    const dStr = new Date(checkTime).toISOString().slice(0, 10);
    if (datesSet.has(dStr)) {
      streak++;
      checkTime -= 86400000;
    } else if (!freezeUsed && streak > 0) {
      // 1-day streak freeze (protector de racha)
      freezeUsed = true;
      checkTime -= 86400000;
    } else {
      break;
    }
  }

  return {
    streak: Math.max(1, streak),
    practicedToday,
    hasFreeze: !freezeUsed,
    freezeUsed,
  };
}

export function getXpAndFichas(state) {
  const completedXP = (state?.completed ? state.completed.length : 0) * 20;
  const masteredXP = (state?.mastered ? state.mastered.length : 0) * 25;
  const correctXP =
    ((state?.attempts ? state.attempts.filter((a) => a.correct).length : 0) +
      (state?.archive?.correct ?? 0)) *
    10;
  const notesXP = (state?.notes ? state.notes.length : 0) * 15;
  const totalXP = completedXP + masteredXP + correctXP + notesXP;

  const fichas = earnedFichas(state).total;

  return {
    totalXP,
    completedXP,
    masteredXP,
    correctXP,
    notesXP,
    fichas,
    fichasHabitribu: fichas,
  };
}

export function getBeltInfo(lessonId, state) {
  if (state?.mastered?.includes(lessonId)) {
    return { level: "oro", name: "Cinturón Oro", icon: "👑", badgeClass: "belt-oro", desc: "Dominio confirmado en repaso" };
  }
  if (state?.completed?.includes(lessonId)) {
    return { level: "plata", name: "Cinturón Plata", icon: "🥈", badgeClass: "belt-plata", desc: "Completada · lista para consolidar" };
  }
  if (state?.attempts?.some((a) => a.lesson === lessonId) || state?.archive?.last?.[lessonId]) {
    return { level: "bronce", name: "Cinturón Bronce", icon: "🥉", badgeClass: "belt-bronce", desc: "En entrenamiento activo" };
  }
  return { level: "blanco", name: "Cinturón Blanco", icon: "⚪", badgeClass: "belt-blanco", desc: "Por iniciar" };
}

// Fichas para premios en casa: premian la constancia, no los aciertos, para
// que el estudiante al que más le cuesta gane lo mismo por el mismo esfuerzo.
export const FICHAS_PER_DAY = 1;
export const FICHAS_PER_LESSON = 2;
export const MIN_DAY_EXERCISES = 5;
export const FICHAS_RULE = `Ganas ${FICHAS_PER_DAY} ficha por cada día que haces al menos ${MIN_DAY_EXERCISES} ejercicios y ${FICHAS_PER_LESSON} por cada lección que terminas, aciertes o no.`;
export const FICHAS_RULE_FAMILY = `Gana ${FICHAS_PER_DAY} ficha por cada día que hace al menos ${MIN_DAY_EXERCISES} ejercicios y ${FICHAS_PER_LESSON} por cada lección que termina, acierte o no.`;
const utcDay = (ms) => new Date(ms).toISOString().slice(0, 10);
export function earnedFichas(state) {
  const perDay = new Map();
  for (const a of Array.isArray(state?.attempts) ? state.attempts : [])
    if (a && Number.isFinite(a.at)) perDay.set(utcDay(a.at), (perDay.get(utcDay(a.at)) ?? 0) + 1);
  const days = new Set([...perDay].filter(([, n]) => n >= MIN_DAY_EXERCISES).map(([d]) => d));
  // Los días ya resumidos no guardan cuántos ejercicios hubo: cuentan todos.
  for (const d of Array.isArray(state?.archive?.days) ? state.archive.days : []) days.add(d);
  const lessons = Array.isArray(state?.completed) ? new Set(state.completed).size : 0;
  return {
    days: days.size,
    lessons,
    total: days.size * FICHAS_PER_DAY + lessons * FICHAS_PER_LESSON,
  };
}
