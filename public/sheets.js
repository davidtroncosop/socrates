// Modo de fluidez estilo Kumon (adaptado para estudiantes con dificultades):
// 1) Hojas cortas de 8 ejercicios por micro-nivel (0 → 3), pensadas para 5–10 min.
// 2) Autocorrección obligatoria hasta dejar toda la hoja en 100 %.
// 3) Fluidez medida en silencio (sin reloj visible ni ansiedad): decide si sube
//    de micro-nivel o repite una hoja fresca del mismo paso.
// 4) Niveles neutros (Nivel A, B, C…) sin estigma de curso escolar y punto de
//    partida cómodo (un peldaño antes del primer tropiezo).
// 5) Compatible con impresión en papel (@media print) y revisión de foto.
import { answersQuestion, parseNumber, getSubject } from "./learning.js";
import { generateQuestions, hasGenerator } from "./generators.js";
import { diagnoseMistake } from "./mistakes.js";
import { UNIT_DEFINITIONS, routeOrder } from "./units.js";

export const SHEET_SIZE = 8;
export const MAX_MICRO_LEVEL = 4; // 0..3 en práctica, 4 = fluidez completa
export const PASS_ACCURACY = 85; // 7/8 (88 %) o 8/8 (100 %) al primer intento
const MAX_ACTIVE_MS = 60 * 60 * 1000;

const LEVEL_LETTERS = "ABCDEFGHIJKLMNO";

// Niveles neutros (A–O) para las unidades de matemática, sin remarcar el curso.
export function unitLevel(unit) {
  if (!unit) return { code: "A", label: "Nivel A", order: 1 };
  if (unit.subject === "lenguaje") {
    const n = unit.unitNumber || 1;
    return { code: `L${n}`, label: `Lectura ${n}`, order: 100 + n };
  }
  const idx = (unit.unitNumber || 1) - 1;
  const code = LEVEL_LETTERS[idx] ?? `N${idx + 1}`;
  return { code, label: `Nivel ${code}`, order: idx + 1 };
}

const LESSON_LEVELS = new Map();
for (const unit of UNIT_DEFINITIONS) {
  const lvl = unitLevel(unit);
  for (const id of unit.lessonIds) LESSON_LEVELS.set(id, lvl);
}

export function lessonLevel(lessonId) {
  return LESSON_LEVELS.get(lessonId) ?? { code: "A", label: "Nivel A", order: 1 };
}

// Tiempo objetivo cómodo (SCT) por hoja: nunca se muestra como cronómetro.
// Permite detectar en silencio si todavía cuesta demasiado esfuerzo cognitivo.
export function targetTimeMs(lessonId, microLevel = 0, count = SHEET_SIZE) {
  const lvl = Math.max(0, Math.min(3, microLevel));
  const isBase = String(lessonId || "").startsWith("base-") || String(lessonId || "").startsWith("jerarquia-");
  const perExerciseSec = isBase ? 35 + lvl * 5 : 50 + lvl * 10;
  return perExerciseSec * 1000 * Math.max(1, count);
}

export function formatDuration(ms) {
  const totalSec = Math.max(1, Math.round(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (!min) return `${sec} s`;
  return sec ? `${min} min ${sec} s` : `${min} min`;
}

// Genera una hoja corta (8 ejercicios por defecto) para un micro-nivel 0–3.
export function buildSheet(lesson, microLevel = 0, { size = SHEET_SIZE, rng = Math.random, sheetNumber = 1 } = {}) {
  const levelIdx = Math.max(0, Math.min(3, Number(microLevel) || 0));
  const level = lessonLevel(lesson.id);
  const questions = [];

  if (hasGenerator(lesson.id)) {
    const seen = new Set();
    for (let i = 0; i < size; i++) {
      let picked = null;
      for (let attempt = 0; attempt < 6; attempt++) {
        const candidate = generateQuestions(lesson.id, [levelIdx], rng)?.[0];
        if (!candidate) break;
        picked = candidate;
        if (!seen.has(candidate[0])) break;
      }
      if (picked) {
        seen.add(picked[0]);
        questions.push(picked);
      }
    }
  } else {
    const pool = [...(lesson.questions ?? []), ...(lesson.review ? [lesson.review] : [])];
    for (const q of pool.slice(0, size)) questions.push(q);
  }

  const code = `${level.code}${levelIdx + 1}-${String(Math.max(1, sheetNumber)).padStart(2, "0")}`;
  return {
    lesson,
    microLevel: levelIdx,
    level,
    code,
    questions,
    targetMs: targetTimeMs(lesson.id, levelIdx, questions.length),
  };
}

export function createSheetItems(questions) {
  return questions.map(() => ({
    raw: "",
    resolved: false,
    revealed: false,
    attempts: 0,
    hints: 0,
    firstPassCorrect: null,
    feedback: "",
    invalid: false,
  }));
}

// Corrige una ronda completa (o una ronda de autocorrección solo de los pendientes).
// No cierra la hoja mientras quede algún ejercicio sin resolver.
export function gradeSheetRound(sheet, answers, items) {
  const nextItems = items.map((it) => ({ ...it, invalid: false }));
  const invalidIndices = [];
  const newlyChecked = [];

  for (let i = 0; i < sheet.questions.length; i++) {
    const item = nextItems[i];
    if (item.resolved) continue;
    const raw = String(answers[i] ?? "").trim();
    item.raw = raw;
    if (!raw || parseNumber(raw) === null) {
      item.invalid = true;
      item.feedback = "Escribe un número, decimal o fracción (ej.: 7, 0,5 o 1/2).";
      invalidIndices.push(i);
      continue;
    }
    const q = sheet.questions[i];
    const ok = answersQuestion(raw, q);
    const isFirstTry = item.attempts === 0;
    item.attempts++;
    newlyChecked.push({ index: i, correct: ok, hints: item.hints });
    if (ok) {
      item.resolved = true;
      if (item.firstPassCorrect === null) item.firstPassCorrect = isFirstTry && item.hints === 0;
      item.feedback = isFirstTry && item.hints === 0 ? "✓ Correcto a la primera." : "✓ ¡Corregido!";
    } else {
      if (item.firstPassCorrect === null) item.firstPassCorrect = false;
      const why = diagnoseMistake(q, raw);
      item.feedback = why
        ? `${why} Corrígelo y vuelve a comprobar.`
        : "Todavía no coincide. Revisa tus pasos o pide una pista para corregirlo.";
    }
  }

  const unresolvedIndices = [];
  for (let i = 0; i < nextItems.length; i++) if (!nextItems[i].resolved) unresolvedIndices.push(i);

  return {
    items: nextItems,
    invalidIndices,
    unresolvedIndices,
    newlyChecked,
    allResolved: unresolvedIndices.length === 0,
  };
}

// Evalúa precisión al primer intento + fluidez silenciosa (SCT) para decidir si
// sube de micro-nivel o practica otra hoja fresca del mismo paso.
export function evaluateSheet(sheet, items, elapsedMs, prevRecord = null, now = Date.now()) {
  const total = Math.max(1, sheet.questions.length);
  const safeMs = Math.max(1000, Math.min(MAX_ACTIVE_MS, Math.round(elapsedMs || 1000)));
  const firstPassCorrect = items.filter((it) => it.firstPassCorrect === true).length;
  const revealedCount = items.filter((it) => it.revealed).length;
  const correctedCount = items.filter((it) => it.resolved && !it.revealed && it.firstPassCorrect === false).length;
  const firstPassAccuracy = Math.round((firstPassCorrect / total) * 100);
  const accurate = firstPassAccuracy >= PASS_ACCURACY && revealedCount === 0;
  const fluent = safeMs <= sheet.targetMs;
  const advance = accurate && fluent;
  const prevLevel = prevRecord?.level ?? 0;
  const nextLevel = advance
    ? Math.min(MAX_MICRO_LEVEL, Math.max(prevLevel, sheet.microLevel + 1))
    : Math.max(prevLevel, sheet.microLevel);
  const masteredLesson = nextLevel >= MAX_MICRO_LEVEL;

  const prevBest = Number.isFinite(prevRecord?.bestMs) ? prevRecord.bestMs : null;
  const improvedMs = accurate && prevBest && safeMs < prevBest ? prevBest - safeMs : 0;

  let reason = "accuracy";
  if (advance && masteredLesson) reason = "mastered";
  else if (advance) reason = "advance";
  else if (accurate && !fluent) reason = "fluency";

  const record = {
    level: nextLevel,
    count: (prevRecord?.count ?? 0) + 1,
    bestMs: accurate ? Math.min(prevBest ?? safeMs, safeMs) : (prevBest ?? safeMs),
    lastMs: safeMs,
    lastAccuracy: firstPassAccuracy,
    lastAt: now,
  };

  let headline, message;
  if (reason === "mastered") {
    headline = `👑 ¡Fluidez completa en ${sheet.level.label}!`;
    message = `Terminaste los ${MAX_MICRO_LEVEL} micro-niveles de esta habilidad con precisión y soltura. Ya puedes avanzar al siguiente tema.`;
  } else if (reason === "advance") {
    headline = `✨ ¡Hoja al 100 %! Subes al paso ${nextLevel + 1} de ${MAX_MICRO_LEVEL}`;
    message =
      improvedMs >= 5000
        ? `La resolviste con ${firstPassAccuracy} % a la primera y ${formatDuration(improvedMs)} más fluido que tu mejor marca.`
        : `La resolviste con ${firstPassAccuracy} % a la primera y buen ritmo. Ya estás listo para el siguiente paso.`;
  } else if (reason === "fluency") {
    headline = "💪 ¡Hoja al 100 %! Ahora vamos por más soltura";
    message = `Tu precisión fue excelente (${firstPassAccuracy} % a la primera). Haremos una hoja fresca más de este mismo paso para que te salga cada vez más automático.`;
  } else {
    headline = "✓ ¡Hoja corregida al 100 %!";
    message =
      correctedCount > 0
        ? `Corregiste ${correctedCount === 1 ? "tu error" : `tus ${correctedCount} errores`} hasta dejar toda la hoja perfecta. Mañana haremos otra hoja nueva de este paso para que salga aún más seguro.`
        : "Dejaste toda la hoja lista. Mañana haremos otra hoja fresca de este mismo paso para afianzarlo.";
  }

  return {
    total,
    firstPassCorrect,
    firstPassAccuracy,
    correctedCount,
    revealedCount,
    elapsedMs: safeMs,
    fluent,
    accurate,
    advance,
    masteredLesson,
    nextLevel,
    improvedMs,
    reason,
    headline,
    message,
    record,
  };
}

// Punto de partida cómodo (estilo Kumon): un peldaño por debajo del primer
// tropiezo para arrancar con hojas fáciles al 100 % y construir confianza.
export function comfortableStart(planned, solved, route) {
  if (!planned?.length) return null;
  const gap = planned.findIndex((l) => !solved.has(l.id));
  if (gap > 0) return planned[gap - 1];
  if (gap === -1) return planned.at(-1);
  // Tropiezo en la primera pregunta del diagnóstico: buscar una lección previa
  // en la ruta (p. ej. valor posicional antes de suma y resta).
  const mathRoute = (route ?? []).filter((l) => getSubject(l) === "matematica");
  const idx = mathRoute.findIndex((l) => l.id === planned[0].id);
  return idx > 0 ? mathRoute[idx - 1] : planned[0];
}

// Elige la mejor «Hoja del día» estilo Kumon para el estudiante.
export function pickDailySheet({ lessons, state, next }) {
  const mathLessons = routeOrder(lessons).filter((l) => getSubject(l) === "matematica");
  if (!mathLessons.length) return null;
  const byId = new Map(mathLessons.map((l) => [l.id, l]));
  const sheets = state?.sheets ?? {};

  // 1. Si hay una hoja en curso (micro-nivel < 4), continuar la practicada más recientemente.
  const active = Object.entries(sheets)
    .filter(([id, rec]) => byId.has(id) && (rec?.level ?? 0) < MAX_MICRO_LEVEL)
    .sort(([, a], [, b]) => (b.lastAt ?? 0) - (a.lastAt ?? 0))[0];
  if (active) {
    const [id, rec] = active;
    return {
      lesson: byId.get(id),
      microLevel: rec.level ?? 0,
      sheetNumber: (rec.count ?? 0) + 1,
      level: lessonLevel(id),
      inProgress: true,
    };
  }

  // 2. Si el diagnóstico sugirió un punto de partida cómodo todavía sin completar en fluidez.
  if (state?.kumonStart && byId.has(state.kumonStart) && (sheets[state.kumonStart]?.level ?? 0) < MAX_MICRO_LEVEL) {
    const rec = sheets[state.kumonStart];
    return {
      lesson: byId.get(state.kumonStart),
      microLevel: rec?.level ?? 0,
      sheetNumber: (rec?.count ?? 0) + 1,
      level: lessonLevel(state.kumonStart),
      inProgress: false,
      comfortable: true,
    };
  }

  // 3. Primera lección completada cuya fluidez aún no llega al nivel 4.
  const pendingCompleted = mathLessons.find(
    (l) => state?.completed?.includes(l.id) && (sheets[l.id]?.level ?? 0) < MAX_MICRO_LEVEL,
  );
  if (pendingCompleted) {
    const rec = sheets[pendingCompleted.id];
    return {
      lesson: pendingCompleted,
      microLevel: rec?.level ?? 0,
      sheetNumber: (rec?.count ?? 0) + 1,
      level: lessonLevel(pendingCompleted.id),
      inProgress: false,
    };
  }

  // 4. Si no, la siguiente lección sugerida de matemática (o la primera base).
  const fallback = (next && byId.get(next.id)) || mathLessons[0];
  const rec = sheets[fallback.id];
  return {
    lesson: fallback,
    microLevel: Math.min(3, rec?.level ?? 0),
    sheetNumber: (rec?.count ?? 0) + 1,
    level: lessonLevel(fallback.id),
    inProgress: false,
  };
}
