// Gestión de cursos y grupos PIE para docentes (B2B):
// - Un profesor crea cursos o grupos PIE con código de 6 caracteres para pizarra.
// - Se vinculan cuentas existentes con el código, o se carga una nómina sin correo
//   (menores de 14 años bajo gestión escolar, consent_by = teacher.id) entregando
//   tarjetas de acceso por única vez.
// - Privacidad estricta: el docente recibe métricas grupales e individuales de
//   práctica y hojas, nunca notas del cuaderno ni fotos del desarrollo.
import { classCode, hashPassword } from "./crypto.js";

const DAY = 86400000;
export const MAX_CLASSES = 20;
export const MAX_CLASS_STUDENTS = 50;
export const MAX_ROSTER_BATCH = 45;
const ALLOWED_GRADES = new Set(["all", "base", "pie", "5b", "6b", "7b", "8b", "1m", "2m", "3m", "4m"]);
const LESSON_ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

export class ClassError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const fail = (status, message) => {
  throw new ClassError(status, message);
};

const cleanText = (value, max) => String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);

function cleanCourseName(value) {
  const name = cleanText(value, 80);
  if (!name) fail(400, "Escribe el nombre del curso o grupo PIE (máximo 80 caracteres).");
  return name;
}

function cleanGrade(value) {
  const g = String(value || "all").trim().toLowerCase();
  return ALLOWED_GRADES.has(g) ? g : "all";
}

function cleanFocusLesson(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const id = String(value).trim();
  if (!LESSON_ID_RE.test(id)) fail(400, "La lección elegida no es válida.");
  return id;
}

const normalizeCode = (code) => String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export function baseUsernameFromName(fullName) {
  const ascii = String(fullName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
  const parts = ascii.split(/\s+/).filter(Boolean);
  let base = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0] || "estudiante";
  base = base.slice(0, 24).replace(/^\.+|\.+$/g, "");
  if (base.length < 3) base = (base + ".alumno").slice(0, 24);
  return base;
}

async function uniqueUsername(env, preferred, reserved) {
  const base = preferred.slice(0, 24);
  for (let n = 1; n <= 40; n++) {
    const candidate = n === 1 ? base : `${base.slice(0, 24 - String(n).length)}${n}`;
    if (reserved.has(candidate)) continue;
    const exists = await env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(candidate).first();
    if (!exists) {
      reserved.add(candidate);
      return candidate;
    }
  }
  const fallback = `${base.slice(0, 19)}.${classCode(4).toLowerCase()}`;
  reserved.add(fallback);
  return fallback;
}

async function uniqueClassCode(env) {
  for (let i = 0; i < 8; i++) {
    const code = classCode(6);
    const exists = await env.DB.prepare("SELECT 1 FROM classes WHERE code = ?").bind(code).first();
    if (!exists) return code;
  }
  fail(500, "No pudimos generar un código único. Inténtalo de nuevo.");
}

const readablePassword = () => `${classCode(4)}-${classCode(4)}`;

async function ownedClass(env, teacherId, classId) {
  const row = await env.DB.prepare("SELECT * FROM classes WHERE id = ? AND teacher_id = ?")
    .bind(classId, teacherId)
    .first();
  if (!row) fail(404, "No encontramos ese curso en tu cuenta.");
  return row;
}

function publicCourse(row, extra = {}) {
  return {
    id: row.id,
    name: row.name,
    school: row.school || "",
    grade: row.grade || "all",
    code: row.code,
    focusLesson: row.focus_lesson ?? null,
    focusNote: row.focus_note || "",
    focusUpdatedAt: row.focus_updated_at ?? null,
    createdAt: row.created_at,
    ...extra,
  };
}

// Extrae solo indicadores pedagógicos para el docente; jamás notas ni fotos.
export function summarizeStudentForTeacher(state, now = Date.now()) {
  const attempts = Array.isArray(state?.attempts) ? state.attempts : [];
  const weekAgo = now - 7 * DAY;
  const twoWeeksAgo = now - 14 * DAY;
  const weekAttempts = attempts.filter((a) => a.at >= weekAgo);
  const rawSheets = state?.sheets && typeof state.sheets === "object" ? state.sheets : {};
  let sheetsCompleted = 0;
  const sheetLessons = {};
  for (const [lessonId, info] of Object.entries(rawSheets)) {
    const count = Number(info?.count) || 0;
    const level = Number(info?.level) || 0;
    if (count > 0 || level > 0) {
      sheetsCompleted += count;
      sheetLessons[lessonId] = { level, count };
    }
  }
  return {
    completed: Array.isArray(state?.completed) ? state.completed : [],
    mastered: Array.isArray(state?.mastered) ? state.mastered : [],
    kumonStart: typeof state?.kumonStart === "string" ? state.kumonStart : null,
    sheetsCompleted,
    sheetLessons,
    attemptsWeek: weekAttempts.length,
    accuracyWeek: weekAttempts.length
      ? Math.round((weekAttempts.filter((a) => a.correct).length / weekAttempts.length) * 100)
      : null,
    recent: attempts
      .filter((a) => a.at >= twoWeeksAgo && typeof a.lesson === "string")
      .slice(-600)
      .map((a) => ({
        lesson: a.lesson,
        correct: a.correct === true,
        hints: Number(a.hints) || 0,
        at: a.at,
      })),
    lastActivity:
      Math.max(
        attempts.reduce((max, a) => Math.max(max, a.at || 0), 0),
        ...Object.values(state?.archive?.last ?? {}).filter(Number.isFinite),
      ) || null,
  };
}

async function cleanupOrphanSchoolStudent(env, teacherId, studentId) {
  const student = await env.DB.prepare("SELECT id, consent_by FROM users WHERE id = ?").bind(studentId).first();
  if (!student || student.consent_by !== teacherId) return false;
  const { inClasses } = await env.DB.prepare("SELECT COUNT(*) AS inClasses FROM class_members WHERE student_id = ?")
    .bind(studentId)
    .first();
  const { inFamilies } = await env.DB.prepare("SELECT COUNT(*) AS inFamilies FROM family_links WHERE child_id = ?")
    .bind(studentId)
    .first();
  if (inClasses === 0 && inFamilies === 0) {
    await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(studentId).run();
    return true;
  }
  return false;
}

export async function listClasses(env, user) {
  if (user.role === "teacher") {
    const { results: rows } = await env.DB.prepare(
      "SELECT * FROM classes WHERE teacher_id = ? ORDER BY created_at DESC",
    )
      .bind(user.id)
      .all();
    const weekAgo = Date.now() - 7 * DAY;
    const classes = [];
    for (const row of rows) {
      const { results: members } = await env.DB.prepare(
        `SELECT p.state FROM class_members m
         LEFT JOIN progress p ON p.user_id = m.student_id
         WHERE m.class_id = ?`,
      )
        .bind(row.id)
        .all();
      let activeWeekCount = 0;
      for (const m of members) {
        if (!m.state) continue;
        try {
          const parsed = JSON.parse(m.state);
          if (Array.isArray(parsed?.attempts) && parsed.attempts.some((a) => a.at >= weekAgo)) activeWeekCount++;
        } catch {}
      }
      classes.push(
        publicCourse(row, {
          studentCount: members.length,
          activeWeekCount,
        }),
      );
    }
    return { classes };
  }

  if (user.role === "student") {
    const { results } = await env.DB.prepare(
      `SELECT c.id, c.name, c.school, c.grade, c.focus_lesson, c.focus_note, c.focus_updated_at,
              m.joined_at, u.name AS teacher_name, u.consent_by IS NOT NULL AS dummy
       FROM class_members m
       JOIN classes c ON c.id = m.class_id
       JOIN users u ON u.id = c.teacher_id
       WHERE m.student_id = ?
       ORDER BY m.joined_at DESC`,
    )
      .bind(user.id)
      .all();
    return {
      classes: results.map((r) => ({
        id: r.id,
        name: r.name,
        school: r.school || "",
        grade: r.grade || "all",
        teacherName: r.teacher_name,
        focusLesson: r.focus_lesson ?? null,
        focusNote: r.focus_note || "",
        focusUpdatedAt: r.focus_updated_at ?? null,
        joinedAt: r.joined_at,
        canLeave: !user.consent_by,
      })),
    };
  }

  return { classes: [] };
}

export async function createClass(env, user, body) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede crear cursos o grupos PIE.");
  const name = cleanCourseName(body?.name);
  const school = cleanText(body?.school, 120);
  const grade = cleanGrade(body?.grade);
  const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM classes WHERE teacher_id = ?")
    .bind(user.id)
    .first();
  if (count >= MAX_CLASSES) fail(400, `Puedes tener hasta ${MAX_CLASSES} cursos activos.`);
  const code = await uniqueClassCode(env);
  const now = Date.now();
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO classes (id, teacher_id, name, school, grade, code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(id, user.id, name, school, grade, code, now)
    .run();
  const row = await env.DB.prepare("SELECT * FROM classes WHERE id = ?").bind(id).first();
  return { course: publicCourse(row, { studentCount: 0, activeWeekCount: 0 }) };
}

export async function getClassDetail(env, user, classId) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede ver el panel del curso.");
  const row = await ownedClass(env, user.id, classId);
  const { results } = await env.DB.prepare(
    `SELECT u.id, u.name, u.username, u.consent_by, m.joined_at, p.state
     FROM class_members m
     JOIN users u ON u.id = m.student_id
     LEFT JOIN progress p ON p.user_id = u.id
     WHERE m.class_id = ?
     ORDER BY u.name COLLATE NOCASE`,
  )
    .bind(row.id)
    .all();
  const now = Date.now();
  const students = results.map((r) => {
    let parsed = null;
    if (r.state) {
      try {
        parsed = JSON.parse(r.state);
      } catch {}
    }
    return {
      id: r.id,
      name: r.name,
      username: r.username ?? null,
      managedByTeacher: r.consent_by === user.id,
      joinedAt: r.joined_at,
      ...summarizeStudentForTeacher(parsed, now),
    };
  });
  return { course: publicCourse(row), students };
}

export async function updateClass(env, user, classId, body) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede editar el curso.");
  const current = await ownedClass(env, user.id, classId);
  const name = body.name !== undefined ? cleanCourseName(body.name) : current.name;
  const school = body.school !== undefined ? cleanText(body.school, 120) : current.school;
  const grade = body.grade !== undefined ? cleanGrade(body.grade) : current.grade;
  const focusChanged = "focusLesson" in body || "focusNote" in body;
  const focusLesson = "focusLesson" in body ? cleanFocusLesson(body.focusLesson) : current.focus_lesson;
  const focusNote =
    focusLesson === null
      ? ""
      : "focusNote" in body
        ? cleanText(body.focusNote, 200)
        : current.focus_note;
  const focusUpdatedAt = focusLesson
    ? focusChanged
      ? Date.now()
      : current.focus_updated_at
    : null;
  await env.DB.prepare(
    `UPDATE classes
     SET name = ?, school = ?, grade = ?, focus_lesson = ?, focus_note = ?, focus_updated_at = ?
     WHERE id = ? AND teacher_id = ?`,
  )
    .bind(name, school, grade, focusLesson, focusNote, focusUpdatedAt, current.id, user.id)
    .run();
  const updated = await ownedClass(env, user.id, current.id);
  return { course: publicCourse(updated) };
}

export async function rotateClassCode(env, user, classId) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede cambiar el código.");
  const current = await ownedClass(env, user.id, classId);
  const code = await uniqueClassCode(env);
  await env.DB.prepare("UPDATE classes SET code = ? WHERE id = ? AND teacher_id = ?")
    .bind(code, current.id, user.id)
    .run();
  return { code };
}

export async function deleteClass(env, user, classId) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede eliminar el curso.");
  const current = await ownedClass(env, user.id, classId);
  const { results: members } = await env.DB.prepare(
    "SELECT student_id FROM class_members WHERE class_id = ?",
  )
    .bind(current.id)
    .all();
  await env.DB.prepare("DELETE FROM classes WHERE id = ? AND teacher_id = ?")
    .bind(current.id, user.id)
    .run();
  for (const m of members) {
    await cleanupOrphanSchoolStudent(env, user.id, m.student_id);
  }
  return { ok: true };
}

export async function addClassRoster(env, user, classId, body, helpers) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede cargar nóminas.");
  const current = await ownedClass(env, user.id, classId);
  const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM class_members WHERE class_id = ?")
    .bind(current.id)
    .first();

  let rawEntries = [];
  if (Array.isArray(body?.names)) {
    rawEntries = body.names.map((n) => ({ name: n }));
  } else if (typeof body?.namesText === "string") {
    rawEntries = body.namesText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ name }));
  } else if (body?.name) {
    rawEntries = [{ name: body.name, username: body.username, password: body.password }];
  }

  if (!rawEntries.length) fail(400, "Escribe al menos un nombre de estudiante.");
  if (rawEntries.length > MAX_ROSTER_BATCH)
    fail(400, `Puedes crear hasta ${MAX_ROSTER_BATCH} cuentas por tanda.`);
  if (count + rawEntries.length > MAX_CLASS_STUDENTS)
    fail(400, `Cada curso admite hasta ${MAX_CLASS_STUDENTS} estudiantes (quedan ${MAX_CLASS_STUDENTS - count} cupos).`);

  const reserved = new Set();
  const prepared = [];
  for (const item of rawEntries) {
    const name = cleanText(item.name, 60);
    if (!name) fail(400, "Cada estudiante necesita un nombre válido (máximo 60 caracteres).");
    let username;
    if (item.username) {
      username = helpers.cleanUsername(item.username);
      if (reserved.has(username) || (await env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(username).first()))
        fail(409, `El usuario «${username}» ya está ocupado.`);
      reserved.add(username);
    } else {
      username = await uniqueUsername(env, baseUsernameFromName(name), reserved);
    }
    const password = item.password ? helpers.cleanPassword(item.password) : readablePassword();
    prepared.push({ id: crypto.randomUUID(), name, username, password });
  }

  const now = Date.now();
  for (const st of prepared) {
    await env.DB.prepare(
      "INSERT INTO users (id, username, name, role, password_hash, consent_by, created_at) VALUES (?, ?, ?, 'student', ?, ?, ?)",
    )
      .bind(st.id, st.username, st.name, await hashPassword(st.password), user.id, now)
      .run();
    await env.DB.prepare("INSERT INTO class_members (class_id, student_id, joined_at) VALUES (?, ?, ?)")
      .bind(current.id, st.id, now)
      .run();
  }

  return {
    created: prepared.map(({ id, name, username, password }) => ({ id, name, username, password })),
  };
}

export async function resetClassStudentPassword(env, user, classId, studentId, body, helpers) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede restablecer esta clave.");
  const current = await ownedClass(env, user.id, classId);
  const student = await env.DB.prepare(
    `SELECT u.* FROM class_members m JOIN users u ON u.id = m.student_id
     WHERE m.class_id = ? AND m.student_id = ?`,
  )
    .bind(current.id, studentId)
    .first();
  if (!student) fail(404, "No encontramos a ese estudiante en este curso.");
  if (student.consent_by !== user.id)
    fail(403, "Este estudiante entró con cuenta propia o familiar: recupera su contraseña con su código o apoderado.");
  const password = body?.password ? helpers.cleanPassword(body.password) : readablePassword();
  await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .bind(await hashPassword(password), student.id)
    .run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(student.id).run();
  return {
    ok: true,
    credential: {
      id: student.id,
      name: student.name,
      username: student.username,
      password,
    },
  };
}

export async function removeClassStudent(env, user, classId, studentId) {
  if (user.role !== "teacher") fail(403, "Solo una cuenta docente puede quitar estudiantes del curso.");
  const current = await ownedClass(env, user.id, classId);
  const student = await env.DB.prepare(
    `SELECT u.* FROM class_members m JOIN users u ON u.id = m.student_id
     WHERE m.class_id = ? AND m.student_id = ?`,
  )
    .bind(current.id, studentId)
    .first();
  if (!student) fail(404, "No encontramos a ese estudiante en este curso.");
  await env.DB.prepare("DELETE FROM class_members WHERE class_id = ? AND student_id = ?")
    .bind(current.id, student.id)
    .run();
  const deleted = await cleanupOrphanSchoolStudent(env, user.id, student.id);
  return { ok: true, deleted };
}

export async function joinClassByCode(env, user, body) {
  if (user.role !== "student") fail(403, "Solo una cuenta de estudiante puede unirse a un curso.");
  const code = normalizeCode(body?.code);
  if (code.length < 4 || code.length > 10) fail(400, "Escribe el código de 6 caracteres que te dio tu profesor.");
  const course = await env.DB.prepare(
    `SELECT c.*, u.name AS teacher_name
     FROM classes c JOIN users u ON u.id = c.teacher_id
     WHERE c.code = ?`,
  )
    .bind(code)
    .first();
  if (!course) fail(404, "No encontramos un curso con ese código. Revisa las letras en la pizarra.");
  const already = await env.DB.prepare(
    "SELECT 1 FROM class_members WHERE class_id = ? AND student_id = ?",
  )
    .bind(course.id, user.id)
    .first();
  if (!already) {
    const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM class_members WHERE class_id = ?")
      .bind(course.id)
      .first();
    if (count >= MAX_CLASS_STUDENTS) fail(400, "Este curso alcanzó su cupo máximo de estudiantes.");
    await env.DB.prepare("INSERT INTO class_members (class_id, student_id, joined_at) VALUES (?, ?, ?)")
      .bind(course.id, user.id, Date.now())
      .run();
  }
  return {
    course: {
      id: course.id,
      name: course.name,
      school: course.school || "",
      grade: course.grade || "all",
      teacherName: course.teacher_name,
      focusLesson: course.focus_lesson ?? null,
      focusNote: course.focus_note || "",
    },
  };
}

export async function leaveClass(env, user, classId) {
  if (user.role !== "student") fail(403, "Solo un estudiante puede salir de un curso.");
  if (user.consent_by)
    fail(403, "Tu cuenta es gestionada por tu establecimiento o apoderado.");
  await env.DB.prepare("DELETE FROM class_members WHERE class_id = ? AND student_id = ?")
    .bind(classId, user.id)
    .run();
  return { ok: true };
}
