// Analítica grupal e individual para docentes y equipos PIE (sin DOM), más
// almacén interactivo de demostración B2B para reuniones con colegios.
import { GRADES, displayTitle, getSubject } from "./learning.js";
import { UNIT_DEFINITIONS, routeOrder } from "./units.js";
import { unitLevel, lessonLevel } from "./sheets.js";

const DAY = 86400000;
export const DEMO_TEACHER_KEY = "socatres.teacher-demo.v1";

export const COURSE_GRADES = {
  all: "Multigrado / Varios cursos",
  pie: "Grupo PIE · Nivelación",
  base: "3° y 4° Básico (Bases)",
  ...GRADES,
};

const UNIT_BY_LESSON = new Map();
for (const unit of UNIT_DEFINITIONS) {
  if (unit.subject !== "matematica") continue;
  const level = unitLevel(unit);
  for (const id of unit.lessonIds) {
    UNIT_BY_LESSON.set(id, { ...level, unitTitle: unit.title, unitId: unit.id });
  }
}

const startOfDay = (ms) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

// Extrae el código curricular MINEDUC (ej. «MA07 OA 09») de la descripción.
export function extractObjective(lesson) {
  const raw = String(lesson?.description || "").trim();
  const sep = raw.indexOf(" · ");
  if (sep > 0) {
    return {
      code: raw.slice(0, sep).trim(),
      detail: raw.slice(sep + 3).trim(),
    };
  }
  return {
    code: GRADES[lesson?.grade] || "Currículum",
    detail: raw,
  };
}

// Determina el Nivel neutro (A–O) donde está trabajando el estudiante hoy.
export function studentCurrentLevel(student, lessons) {
  const completed = new Set(student?.completed ?? []);
  const sheets = student?.sheetLessons ?? {};
  const recentLessons = (student?.recent ?? []).map((a) => a.lesson);
  const mathLessons = lessons.filter((l) => getSubject(l) === "matematica");
  const ordered = routeOrder(mathLessons);

  const hasActivity =
    completed.size > 0 ||
    Object.keys(sheets).length > 0 ||
    recentLessons.length > 0 ||
    Boolean(student?.kumonStart);

  if (!hasActivity) {
    return {
      code: "—",
      label: "Sin diagnóstico",
      unitTitle: "Aún no inicia práctica",
      order: 0,
    };
  }

  // Si tiene intentos recientes en los últimos 14 días, el último tema trabajado
  // refleja con precisión dónde está hoy; si no, su siguiente paso tras lo completado.
  for (let i = recentLessons.length - 1; i >= 0; i--) {
    const info = UNIT_BY_LESSON.get(recentLessons[i]);
    if (info) return info;
  }

  if (student?.kumonStart && !completed.has(student.kumonStart)) {
    const info = UNIT_BY_LESSON.get(student.kumonStart);
    if (info) return info;
  }

  let lastCompletedIdx = -1;
  for (let i = 0; i < ordered.length; i++) {
    if (completed.has(ordered[i].id)) lastCompletedIdx = i;
  }
  if (lastCompletedIdx >= 0) {
    const next = ordered[Math.min(ordered.length - 1, lastCompletedIdx + 1)];
    const info = UNIT_BY_LESSON.get(next.id);
    if (info) return info;
  }

  const fallbackId = student?.kumonStart || ordered[0]?.id;
  return (
    UNIT_BY_LESSON.get(fallbackId) ?? {
      ...lessonLevel(fallbackId),
      unitTitle: "Bases para avanzar",
    }
  );
}

// Calcula el pulso semanal, el mapa grupal de tropiezos por OA, la distribución
// en Niveles A–O y el estado de acompañamiento de cada estudiante.
export function analyzeCohort({ course, students = [], lessons = [], now = Date.now() }) {
  const lessonMap = new Map(lessons.map((l) => [l.id, l]));
  const today = startOfDay(now);
  const daySlots = Array.from({ length: 7 }, (_, i) => {
    const start = startOfDay(today - (6 - i) * DAY + DAY / 2);
    const label = new Date(start)
      .toLocaleDateString("es-CL", { weekday: "short" })
      .replace(".", "");
    return { start, label: label.slice(0, 2).toUpperCase() };
  });
  const weekStart = daySlots[0].start;
  const focusId = course?.focusLesson ?? null;

  // Agregación por lección (14 días) para el mapa de tropiezos del grupo.
  const byLesson = new Map();
  let cohortWeekAttempts = 0;
  let cohortWeekCorrect = 0;
  let totalSheets = 0;
  let activeWeek = 0;
  let supportCount = 0;
  let inactiveCount = 0;
  let focusCompletedCount = 0;

  const levelCounts = new Map();

  const enrichedStudents = students.map((s) => {
    const recent = Array.isArray(s.recent) ? s.recent : [];
    const weekAttempts = recent.filter((a) => a.at >= weekStart && a.at <= now);
    const days = daySlots.map((slot, idx) => {
      const nextStart = idx < 6 ? daySlots[idx + 1].start : now + DAY;
      const count = weekAttempts.filter((a) => a.at >= slot.start && a.at < nextStart).length;
      return { label: slot.label, count };
    });
    const practiceDays = days.filter((d) => d.count > 0).length;
    const attemptsWeek = weekAttempts.length;
    const correctWeek = weekAttempts.filter((a) => a.correct).length;
    const accuracyWeek = attemptsWeek ? Math.round((correctWeek / attemptsWeek) * 100) : null;

    cohortWeekAttempts += attemptsWeek;
    cohortWeekCorrect += correctWeek;
    totalSheets += Number(s.sheetsCompleted) || 0;
    if (attemptsWeek > 0) activeWeek++;

    // Lecciones que más le costaron a este estudiante en los últimos 14 días.
    const studentLessons = new Map();
    for (const a of recent) {
      if (!lessonMap.has(a.lesson)) continue;
      const list = studentLessons.get(a.lesson) ?? [];
      list.push(a);
      studentLessons.set(a.lesson, list);

      let group = byLesson.get(a.lesson);
      if (!group) {
        group = { attempts: 0, wrong: 0, hinted: 0, autonomous: 0, studentIds: new Set(), strugglingIds: new Set() };
        byLesson.set(a.lesson, group);
      }
      group.attempts++;
      group.studentIds.add(s.id);
      if (!a.correct) group.wrong++;
      else if ((a.hints || 0) > 0) group.hinted++;
      else group.autonomous++;
    }

    const supportTopics = [];
    for (const [lessonId, list] of studentLessons) {
      if (list.length < 2) continue;
      const acc = Math.round((list.filter((x) => x.correct).length / list.length) * 100);
      const avgHints = list.reduce((sum, x) => sum + (x.hints || 0), 0) / list.length;
      if (acc < 65 || avgHints >= 1.4) {
        const lesson = lessonMap.get(lessonId);
        supportTopics.push({
          id: lessonId,
          title: displayTitle(lesson),
          oa: extractObjective(lesson).code,
          accuracy: acc,
          attempts: list.length,
        });
        byLesson.get(lessonId)?.strugglingIds.add(s.id);
      }
    }
    supportTopics.sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

    const completedSet = new Set(s.completed ?? []);
    const masteredSet = new Set(s.mastered ?? []);
    const focusDone = Boolean(
      focusId &&
        (completedSet.has(focusId) ||
          masteredSet.has(focusId) ||
          (s.sheetLessons?.[focusId]?.count ?? 0) > 0),
    );
    if (focusDone) focusCompletedCount++;

    const currentLevel = studentCurrentLevel(s, lessons);
    if (currentLevel.order > 0) {
      const prev = levelCounts.get(currentLevel.code) ?? {
        code: currentLevel.code,
        label: currentLevel.label,
        unitTitle: currentLevel.unitTitle,
        order: currentLevel.order,
        count: 0,
      };
      prev.count++;
      levelCounts.set(currentLevel.code, prev);
    }

    let status = "steady";
    if (supportTopics.length > 0 || (accuracyWeek !== null && attemptsWeek >= 4 && accuracyWeek < 60)) {
      status = "support";
      supportCount++;
    } else if (attemptsWeek === 0) {
      status = "inactive";
      inactiveCount++;
    }

    return {
      ...s,
      currentLevel,
      days,
      practiceDays,
      attemptsWeek,
      accuracyWeek,
      sheetsCompleted: Number(s.sheetsCompleted) || 0,
      completedCount: completedSet.size,
      masteredCount: masteredSet.size,
      focusDone,
      status,
      supportTopics: supportTopics.slice(0, 2),
    };
  });

  // Ordenar tropiezos grupales por impacto real (alumnos afectados + tasa de error/pistas).
  const stumbles = [];
  for (const [lessonId, g] of byLesson) {
    if (g.attempts < 3) continue;
    const lesson = lessonMap.get(lessonId);
    if (!lesson) continue;
    const errorRate = Math.round((g.wrong / g.attempts) * 100);
    const hintRate = Math.round((g.hinted / g.attempts) * 100);
    const autonomousRate = Math.max(0, 100 - errorRate - hintRate);
    if (errorRate < 20 && hintRate < 25) continue;
    const obj = extractObjective(lesson);
    const lvl = lessonLevel(lessonId);
    const severity = g.studentIds.size * 18 + errorRate * 1.3 + hintRate * 0.6;
    stumbles.push({
      lessonId,
      title: displayTitle(lesson),
      oa: obj.code,
      detail: obj.detail,
      level: lvl,
      studentsCount: g.studentIds.size,
      strugglingCount: g.strugglingIds.size,
      attempts: g.attempts,
      errorRate,
      hintRate,
      autonomousRate,
      severity,
    });
  }
  stumbles.sort((a, b) => b.severity - a.severity || b.errorRate - a.errorRate);

  // Distribución completa de niveles A–O presentes o contiguos en el grupo.
  const mathUnits = UNIT_DEFINITIONS.filter((u) => u.subject === "matematica");
  const levelDistribution = mathUnits.map((u) => {
    const lvl = unitLevel(u);
    const hit = levelCounts.get(lvl.code);
    return {
      code: lvl.code,
      label: lvl.label,
      unitTitle: u.title,
      order: lvl.order,
      count: hit ? hit.count : 0,
    };
  });

  const totalStudents = students.length;
  return {
    dayLabels: daySlots.map((d) => d.label),
    pulse: {
      totalStudents,
      activeWeek,
      activePct: totalStudents ? Math.round((activeWeek / totalStudents) * 100) : 0,
      attemptsWeek: cohortWeekAttempts,
      accuracyWeek: cohortWeekAttempts ? Math.round((cohortWeekCorrect / cohortWeekAttempts) * 100) : null,
      sheetsTotal: totalSheets,
      supportCount,
      inactiveCount,
      focusCompletedCount,
    },
    stumbles: stumbles.slice(0, 6),
    levelDistribution,
    students: enrichedStudents,
  };
}

// ── Datos sintéticos e interactivos para el modo «Docente PIE demo» ──────────
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const randomCode = (len = 6) =>
  Array.from({ length: len }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

function makeAttempts(now, specs) {
  const out = [];
  for (const [lesson, daysAgo, okList, hints = 0] of specs) {
    const base = now - daysAgo * DAY - 3600_000;
    okList.forEach((correct, idx) => {
      out.push({
        lesson,
        correct: Boolean(correct),
        hints: correct ? hints : Math.max(1, hints),
        at: base + idx * 90_000,
      });
    });
  }
  return out;
}

export function createDemoSeed(now = Date.now()) {
  const c1Students = [
    {
      id: "demo-s1",
      name: "Valentina Muñoz",
      username: "valentina.munoz",
      managedByTeacher: true,
      completed: ["jerarquia-mult", "jerarquia-parentesis", "equations", "enteros", "semejantes"],
      mastered: ["jerarquia-mult", "equations"],
      kumonStart: "jerarquia-mult",
      sheetsCompleted: 9,
      sheetLessons: { equations: { level: 3, count: 4 }, enteros: { level: 2, count: 3 } },
      recent: makeAttempts(now, [
        ["equations", 5, [1, 1, 1, 1]],
        ["enteros", 3, [1, 1, 0, 1]],
        ["semejantes", 1, [1, 1, 1, 1]],
        ["signs", 0, [1, 0, 1, 1], 1],
      ]),
    },
    {
      id: "demo-s2",
      name: "Mateo Riquelme",
      username: "mateo.riquelme",
      managedByTeacher: true,
      completed: ["jerarquia-mult", "equations"],
      mastered: ["jerarquia-mult"],
      kumonStart: "jerarquia-mult",
      sheetsCompleted: 4,
      sheetLessons: { "jerarquia-mult": { level: 2, count: 4 } },
      recent: makeAttempts(now, [
        ["enteros", 4, [0, 0, 1, 0], 2],
        ["enteros", 2, [0, 1, 0, 0], 2],
        ["equations", 1, [1, 0, 0, 1], 1],
      ]),
    },
    {
      id: "demo-s3",
      name: "Sofía Contreras",
      username: "sofia.contreras",
      managedByTeacher: true,
      completed: ["base-multiplicar", "base-fracciones", "jerarquia-mult", "equations", "enteros"],
      mastered: ["base-multiplicar", "jerarquia-mult", "enteros"],
      kumonStart: "base-multiplicar",
      sheetsCompleted: 11,
      sheetLessons: { enteros: { level: 4, count: 5 }, equations: { level: 3, count: 6 } },
      recent: makeAttempts(now, [
        ["enteros", 6, [1, 1, 1, 1]],
        ["semejantes", 4, [1, 1, 1, 0]],
        ["proporciones", 2, [1, 1, 1, 1]],
        ["porcentajes", 0, [1, 1, 1, 1]],
      ]),
    },
    {
      id: "demo-s4",
      name: "Benjamín Tapia",
      username: "benjamin.tapia",
      managedByTeacher: true,
      completed: ["base-suma-resta", "base-multiplicar", "fracciones-suma"],
      mastered: ["base-suma-resta"],
      kumonStart: "base-multiplicar",
      sheetsCompleted: 3,
      sheetLessons: { "base-multiplicar": { level: 2, count: 3 } },
      recent: makeAttempts(now, [
        ["fracciones-suma", 5, [0, 0, 1, 0], 2],
        ["enteros", 2, [0, 0, 0, 1], 2],
        ["equations", 0, [0, 1, 0, 0], 2],
      ]),
    },
    {
      id: "demo-s5",
      name: "Isidora Sepúlveda",
      username: null,
      managedByTeacher: false,
      completed: ["jerarquia-mult", "jerarquia-parentesis", "equations", "enteros"],
      mastered: ["jerarquia-mult", "jerarquia-parentesis"],
      kumonStart: "jerarquia-mult",
      sheetsCompleted: 7,
      sheetLessons: { equations: { level: 2, count: 4 }, enteros: { level: 2, count: 3 } },
      recent: makeAttempts(now, [
        ["equations", 3, [1, 1, 0, 1]],
        ["signs", 1, [0, 0, 1, 0], 1],
      ]),
    },
    {
      id: "demo-s6",
      name: "Lucas Poblete",
      username: "lucas.poblete",
      managedByTeacher: true,
      completed: ["base-multiplicar", "jerarquia-mult"],
      mastered: [],
      kumonStart: "base-multiplicar",
      sheetsCompleted: 2,
      sheetLessons: { "base-multiplicar": { level: 1, count: 2 } },
      recent: makeAttempts(now, [["jerarquia-mult", 10, [1, 0, 1]]]),
    },
    {
      id: "demo-s7",
      name: "Martina Cáceres",
      username: "martina.caceres",
      managedByTeacher: true,
      completed: ["jerarquia-mult", "equations", "enteros", "proporciones"],
      mastered: ["jerarquia-mult", "equations"],
      kumonStart: "jerarquia-mult",
      sheetsCompleted: 8,
      sheetLessons: { enteros: { level: 3, count: 4 }, proporciones: { level: 2, count: 4 } },
      recent: makeAttempts(now, [
        ["enteros", 5, [1, 1, 1, 0]],
        ["proporciones", 3, [1, 1, 1, 1]],
        ["signs", 1, [0, 1, 0, 1], 1],
        ["porcentajes", 0, [1, 1, 1]],
      ]),
    },
    {
      id: "demo-s8",
      name: "Diego Araya",
      username: "diego.araya",
      managedByTeacher: true,
      completed: ["base-suma-resta", "base-multiplicar", "base-dividir"],
      mastered: ["base-suma-resta"],
      kumonStart: "base-suma-resta",
      sheetsCompleted: 5,
      sheetLessons: { "base-suma-resta": { level: 3, count: 5 } },
      recent: makeAttempts(now, [
        ["fracciones-suma", 4, [0, 1, 0, 0], 2],
        ["enteros", 1, [0, 0, 1, 0], 2],
      ]),
    },
  ].map((s) => ({
    ...s,
    lastActivity: s.recent.reduce((max, a) => Math.max(max, a.at), 0) || null,
  }));

  const pieStudents = [
    {
      id: "pie-s1",
      name: "Tomás Garrido",
      username: "tomas.garrido",
      managedByTeacher: true,
      completed: ["base-valor-posicional", "base-suma-resta", "base-multiplicar"],
      mastered: ["base-valor-posicional", "base-suma-resta"],
      kumonStart: "base-valor-posicional",
      sheetsCompleted: 8,
      sheetLessons: { "base-suma-resta": { level: 4, count: 5 }, "base-multiplicar": { level: 2, count: 3 } },
      recent: makeAttempts(now, [
        ["base-multiplicar", 4, [1, 1, 1, 0]],
        ["base-dividir", 2, [0, 1, 0, 0], 2],
        ["base-dividir", 0, [1, 0, 1, 1], 1],
      ]),
    },
    {
      id: "pie-s2",
      name: "Catalina Vera",
      username: "catalina.vera",
      managedByTeacher: true,
      completed: ["base-suma-resta", "base-multiplicar", "base-fracciones"],
      mastered: ["base-suma-resta"],
      kumonStart: "base-suma-resta",
      sheetsCompleted: 6,
      sheetLessons: { "base-fracciones": { level: 2, count: 4 }, "base-multiplicar": { level: 2, count: 2 } },
      recent: makeAttempts(now, [
        ["base-fracciones", 5, [1, 1, 0, 1]],
        ["base-fracciones-equivalentes", 2, [0, 0, 1, 0], 2],
        ["base-fracciones-equivalentes", 0, [1, 0, 0, 1], 2],
      ]),
    },
    {
      id: "pie-s3",
      name: "Agustín Morales",
      username: "agustin.morales",
      managedByTeacher: true,
      completed: ["base-multiplicar", "jerarquia-mult", "fracciones-suma"],
      mastered: ["base-multiplicar"],
      kumonStart: "base-multiplicar",
      sheetsCompleted: 7,
      sheetLessons: { "jerarquia-mult": { level: 3, count: 4 }, "fracciones-suma": { level: 1, count: 3 } },
      recent: makeAttempts(now, [
        ["jerarquia-mult", 3, [1, 1, 1, 1]],
        ["fracciones-suma", 1, [0, 1, 0, 1], 1],
      ]),
    },
    {
      id: "pie-s4",
      name: "Emilia Fuentes",
      username: "emilia.fuentes",
      managedByTeacher: true,
      completed: ["base-valor-posicional", "base-suma-resta"],
      mastered: ["base-valor-posicional"],
      kumonStart: "base-valor-posicional",
      sheetsCompleted: 4,
      sheetLessons: { "base-valor-posicional": { level: 3, count: 4 } },
      recent: makeAttempts(now, [
        ["base-multiplicar", 3, [0, 0, 1, 0], 2],
        ["base-dividir", 1, [0, 0, 0, 1], 2],
      ]),
    },
    {
      id: "pie-s5",
      name: "Joaquín Navarro",
      username: "joaquin.navarro",
      managedByTeacher: true,
      completed: ["base-valor-posicional"],
      mastered: [],
      kumonStart: "base-valor-posicional",
      sheetsCompleted: 1,
      sheetLessons: { "base-valor-posicional": { level: 1, count: 1 } },
      recent: makeAttempts(now, [["base-valor-posicional", 9, [1, 1, 0]]]),
    },
  ].map((s) => ({
    ...s,
    lastActivity: s.recent.reduce((max, a) => Math.max(max, a.at), 0) || null,
  }));

  return {
    version: 1,
    classes: [
      {
        id: "demo-7b",
        name: "7° Básico A · Matemática",
        school: "Escuela Gabriela Mistral (datos de ejemplo)",
        grade: "7b",
        code: "K7M2QX",
        focusLesson: "enteros",
        focusNote: "Completen el ascensor de los enteros y luego la primera hoja en su cuaderno.",
        focusUpdatedAt: now - 2 * DAY,
        createdAt: now - 20 * DAY,
        students: c1Students,
      },
      {
        id: "demo-pie",
        name: "Grupo PIE · Nivelación 6° a 8°",
        school: "Programa de Integración Escolar (datos de ejemplo)",
        grade: "pie",
        code: "P4R8NB",
        focusLesson: "base-multiplicar",
        focusNote: "Avanzar sin reloj en Nivel A antes de pasar a división y fracciones.",
        focusUpdatedAt: now - 3 * DAY,
        createdAt: now - 18 * DAY,
        students: pieStudents,
      },
    ],
  };
}

export function readDemoTeacherStore(storage, now = Date.now()) {
  try {
    const raw = storage?.getItem?.(DEMO_TEACHER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.classes)) return parsed;
    }
  } catch {}
  const fresh = createDemoSeed(now);
  writeDemoTeacherStore(storage, fresh);
  return fresh;
}

export function writeDemoTeacherStore(storage, store) {
  try {
    storage?.setItem?.(DEMO_TEACHER_KEY, JSON.stringify(store));
  } catch {}
}

export function createDemoTeacherApi(storage) {
  const load = () => readDemoTeacherStore(storage);
  const save = (next) => {
    writeDemoTeacherStore(storage, next);
    return next;
  };
  const weekAgo = () => Date.now() - 7 * DAY;
  const toCourseSummary = (c) => ({
    id: c.id,
    name: c.name,
    school: c.school,
    grade: c.grade,
    code: c.code,
    focusLesson: c.focusLesson ?? null,
    focusNote: c.focusNote || "",
    focusUpdatedAt: c.focusUpdatedAt ?? null,
    createdAt: c.createdAt,
    studentCount: c.students.length,
    activeWeekCount: c.students.filter((s) => (s.recent ?? []).some((a) => a.at >= weekAgo())).length,
  });

  const slugify = (name, existing) => {
    const parts = String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    let base = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0] || "estudiante";
    if (base.length < 3) base += ".alumno";
    base = base.slice(0, 22);
    for (let n = 1; n < 99; n++) {
      const cand = n === 1 ? base : `${base}${n}`;
      if (!existing.has(cand)) {
        existing.add(cand);
        return cand;
      }
    }
    return `${base}.${randomCode(3).toLowerCase()}`;
  };

  return {
    async classes() {
      const store = load();
      return { classes: store.classes.map(toCourseSummary) };
    },
    async classDetail(id) {
      const store = load();
      const found = store.classes.find((c) => c.id === id);
      if (!found) throw new Error("No encontramos ese curso.");
      return {
        course: toCourseSummary(found),
        students: found.students,
      };
    },
    async createClass(data) {
      const store = load();
      const name = String(data?.name || "").trim().slice(0, 80);
      if (!name) throw new Error("Escribe el nombre del curso o grupo PIE.");
      const course = {
        id: `demo-${Date.now()}`,
        name,
        school: String(data?.school || "").trim().slice(0, 120),
        grade: data?.grade in COURSE_GRADES ? data.grade : "all",
        code: randomCode(6),
        focusLesson: null,
        focusNote: "",
        focusUpdatedAt: null,
        createdAt: Date.now(),
        students: [],
      };
      store.classes.unshift(course);
      save(store);
      return { course: toCourseSummary(course) };
    },
    async updateClass(id, data) {
      const store = load();
      const c = store.classes.find((x) => x.id === id);
      if (!c) throw new Error("No encontramos ese curso.");
      if (data.name !== undefined) c.name = String(data.name).trim().slice(0, 80) || c.name;
      if (data.school !== undefined) c.school = String(data.school).trim().slice(0, 120);
      if (data.grade !== undefined && data.grade in COURSE_GRADES) c.grade = data.grade;
      if ("focusLesson" in data) {
        c.focusLesson = data.focusLesson ? String(data.focusLesson).trim() : null;
        c.focusNote = c.focusLesson ? String(data.focusNote ?? c.focusNote ?? "").trim().slice(0, 200) : "";
        c.focusUpdatedAt = c.focusLesson ? Date.now() : null;
      } else if ("focusNote" in data && c.focusLesson) {
        c.focusNote = String(data.focusNote || "").trim().slice(0, 200);
        c.focusUpdatedAt = Date.now();
      }
      save(store);
      return { course: toCourseSummary(c) };
    },
    async rotateClassCode(id) {
      const store = load();
      const c = store.classes.find((x) => x.id === id);
      if (!c) throw new Error("No encontramos ese curso.");
      c.code = randomCode(6);
      save(store);
      return { code: c.code };
    },
    async deleteClass(id) {
      const store = load();
      store.classes = store.classes.filter((x) => x.id !== id);
      save(store);
      return { ok: true };
    },
    async addRoster(id, data) {
      const store = load();
      const c = store.classes.find((x) => x.id === id);
      if (!c) throw new Error("No encontramos ese curso.");
      const lines = String(data?.namesText || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!lines.length) throw new Error("Escribe al menos un nombre de estudiante.");
      const existing = new Set(
        store.classes.flatMap((cl) => cl.students.map((s) => s.username).filter(Boolean)),
      );
      const created = lines.slice(0, 45).map((rawName, idx) => {
        const name = rawName.slice(0, 60);
        const username = slugify(name, existing);
        const password = `${randomCode(4)}-${randomCode(4)}`;
        const st = {
          id: `demo-st-${Date.now()}-${idx}`,
          name,
          username,
          managedByTeacher: true,
          completed: [],
          mastered: [],
          kumonStart: null,
          sheetsCompleted: 0,
          sheetLessons: {},
          recent: [],
          lastActivity: null,
        };
        c.students.push(st);
        return { id: st.id, name, username, password };
      });
      save(store);
      return { created };
    },
    async resetClassStudentPassword(classId, studentId) {
      const store = load();
      const c = store.classes.find((x) => x.id === classId);
      const s = c?.students.find((x) => x.id === studentId);
      if (!s || !s.managedByTeacher) throw new Error("No se puede restablecer esta cuenta.");
      const password = `${randomCode(4)}-${randomCode(4)}`;
      return { ok: true, credential: { id: s.id, name: s.name, username: s.username, password } };
    },
    async removeClassStudent(classId, studentId) {
      const store = load();
      const c = store.classes.find((x) => x.id === classId);
      if (!c) throw new Error("No encontramos ese curso.");
      c.students = c.students.filter((x) => x.id !== studentId);
      save(store);
      return { ok: true, deleted: true };
    },
  };
}
