import {
  randomToken,
  sha256,
  hashPassword,
  verifyPassword,
  classCode,
} from "./crypto.js";

export const COOKIE = "socatres_session";
const SESSION_DAYS = 30;
const DAY = 86400000;
const MAX_BODY = 256 * 1024;
const MAX_CLASSES = 30;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const fail = (status, message) => {
  throw new HttpError(status, message);
};
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });

function sessionCookie(request, token, maxAge) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
function readCookie(request) {
  const header = request.headers.get("cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

// Un formulario de otro sitio no puede enviar JSON sin preflight CORS; junto con
// SameSite=Lax evita peticiones forjadas.
async function readJson(request) {
  if (!(request.headers.get("content-type") || "").startsWith("application/json"))
    fail(415, "Se espera JSON.");
  const text = await request.text();
  if (text.length > MAX_BODY) fail(413, "La información enviada es demasiado grande.");
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object") throw Error();
    return value;
  } catch {
    fail(400, "JSON inválido.");
  }
}

const cleanEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fail(400, "Escribe un correo válido.");
  return email;
};
const cleanName = (value, label = "tu nombre", max = 60) => {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  if (!name || name.length > max) fail(400, `Escribe ${label} (máximo ${max} caracteres).`);
  return name;
};
let dummyHash;
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

async function startSession(request, env, user) {
  const token = randomToken();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?")
    .bind(Date.now())
    .run();
  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
  )
    .bind(await sha256(token), user.id, Date.now() + SESSION_DAYS * DAY)
    .run();
  return json({ user: publicUser(user) }, 200, {
    "set-cookie": sessionCookie(request, token, SESSION_DAYS * 86400),
  });
}

async function currentUser(request, env) {
  const token = readCookie(request);
  if (!token) return null;
  return env.DB.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256(token), Date.now())
    .first();
}

// Resumen para el profesor: solo cifras, no notas ni fotos del estudiante.
export function summarize(state) {
  const attempts = Array.isArray(state?.attempts) ? state.attempts : [];
  const weekAgo = Date.now() - 7 * DAY;
  const recent = attempts.filter((a) => a.at >= weekAgo);
  return {
    completed: Array.isArray(state?.completed) ? state.completed : [],
    mastered: Array.isArray(state?.mastered) ? state.mastered : [],
    attemptsWeek: recent.length,
    accuracyWeek: recent.length
      ? Math.round((recent.filter((a) => a.correct).length / recent.length) * 100)
      : null,
    lastActivity: attempts.reduce((max, a) => Math.max(max, a.at || 0), 0) || null,
  };
}

// Las fotos quedan en el dispositivo: el servidor no las acepta.
function validateState(state) {
  if (!state || state.version !== 1) fail(400, "Formato de progreso inválido.");
  for (const key of ["completed", "mastered", "attempts", "notes", "reviews"])
    if (!Array.isArray(state[key])) fail(400, `Falta la lista ${key}.`);
  if (state.notes.some((n) => n && "image" in n))
    fail(400, "Las fotos no se sincronizan; quítalas antes de enviar.");
  return state;
}

const routes = {
  async "POST /api/auth/register"({ request, env }) {
    const body = await readJson(request);
    const email = cleanEmail(body.email);
    const name = cleanName(body.name);
    const role = body.role === "teacher" ? "teacher" : "student";
    const password = String(body.password || "");
    if (password.length < 8 || password.length > 200)
      fail(400, "La contraseña debe tener al menos 8 caracteres.");
    const exists = await env.DB.prepare("SELECT 1 FROM users WHERE email = ?")
      .bind(email)
      .first();
    if (exists) fail(409, "Ya existe una cuenta con ese correo. Entra con tu contraseña.");
    const user = { id: crypto.randomUUID(), email, name, role };
    await env.DB.prepare(
      "INSERT INTO users (id, email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(user.id, email, name, role, await hashPassword(password), Date.now())
      .run();
    return startSession(request, env, user);
  },

  async "POST /api/auth/login"({ request, env }) {
    const body = await readJson(request);
    const email = cleanEmail(body.email);
    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first();
    // Mismo mensaje y mismo trabajo exista o no la cuenta, para no revelar
    // qué correos están registrados.
    dummyHash ??= await hashPassword(randomToken());
    const valid = await verifyPassword(
      String(body.password || ""),
      user ? user.password_hash : dummyHash,
    );
    if (!user || !valid) fail(401, "Correo o contraseña incorrectos.");
    return startSession(request, env, user);
  },

  async "POST /api/auth/logout"({ request, env }) {
    const token = readCookie(request);
    if (token)
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?")
        .bind(await sha256(token))
        .run();
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, "", 0) });
  },

  async "GET /api/me"({ user }) {
    return json({ user: publicUser(user) });
  },

  async "DELETE /api/me"({ request, env, user }) {
    // ON DELETE CASCADE elimina sesiones, progreso, clases y membresías.
    await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, "", 0) });
  },

  async "GET /api/progress"({ env, user }) {
    const row = await env.DB.prepare(
      "SELECT state, updated_at FROM progress WHERE user_id = ?",
    )
      .bind(user.id)
      .first();
    return json(
      row
        ? { state: JSON.parse(row.state), updatedAt: row.updated_at }
        : { state: null, updatedAt: null },
    );
  },

  async "PUT /api/progress"({ request, env, user }) {
    const body = await readJson(request);
    const state = validateState(body.state);
    const updatedAt = Date.now();
    await env.DB.prepare(
      `INSERT INTO progress (user_id, state, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`,
    )
      .bind(user.id, JSON.stringify(state), updatedAt)
      .run();
    return json({ updatedAt });
  },

  async "GET /api/classes"({ env, user }) {
    const { results } =
      user.role === "teacher"
        ? await env.DB.prepare(
            `SELECT c.id, c.name, c.code, c.created_at AS createdAt,
               (SELECT COUNT(*) FROM class_members m WHERE m.class_id = c.id) AS students
             FROM classes c WHERE c.teacher_id = ? ORDER BY c.created_at DESC`,
          )
            .bind(user.id)
            .all()
        : await env.DB.prepare(
            `SELECT c.id, c.name, u.name AS teacher, m.joined_at AS joinedAt
             FROM class_members m JOIN classes c ON c.id = m.class_id
             JOIN users u ON u.id = c.teacher_id
             WHERE m.student_id = ? ORDER BY m.joined_at DESC`,
          )
            .bind(user.id)
            .all();
    return json({ classes: results });
  },

  async "POST /api/classes"({ request, env, user }) {
    if (user.role !== "teacher") fail(403, "Solo un profesor puede crear clases.");
    const name = cleanName((await readJson(request)).name, "el nombre de la clase", 80);
    const { count } = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM classes WHERE teacher_id = ?",
    )
      .bind(user.id)
      .first();
    if (count >= MAX_CLASSES) fail(400, `Puedes tener hasta ${MAX_CLASSES} clases.`);
    for (let attempt = 0; attempt < 5; attempt++) {
      const created = { id: crypto.randomUUID(), name, code: classCode() };
      try {
        await env.DB.prepare(
          "INSERT INTO classes (id, teacher_id, name, code, created_at) VALUES (?, ?, ?, ?, ?)",
        )
          .bind(created.id, user.id, name, created.code, Date.now())
          .run();
        return json({ class: { ...created, students: 0 } }, 201);
      } catch (err) {
        if (!/UNIQUE/i.test(String(err?.message))) throw err;
      }
    }
    fail(503, "No se pudo generar un código. Inténtalo de nuevo.");
  },

  async "POST /api/classes/join"({ request, env, user }) {
    if (user.role !== "student") fail(403, "Solo un estudiante puede unirse a una clase.");
    const code = String((await readJson(request)).code || "")
      .trim()
      .toUpperCase();
    const found = await env.DB.prepare("SELECT id, name FROM classes WHERE code = ?")
      .bind(code)
      .first();
    if (!found) fail(404, "No encontramos una clase con ese código.");
    await env.DB.prepare(
      "INSERT OR IGNORE INTO class_members (class_id, student_id, joined_at) VALUES (?, ?, ?)",
    )
      .bind(found.id, user.id, Date.now())
      .run();
    return json({ class: found });
  },

  async "GET /api/classes/:id"({ env, user, params }) {
    const found = await env.DB.prepare(
      "SELECT id, name, code FROM classes WHERE id = ? AND teacher_id = ?",
    )
      .bind(params.id, user.id)
      .first();
    // 404 también si la clase es de otro profesor: no se revela que existe.
    if (!found) fail(404, "Clase no encontrada.");
    const { results } = await env.DB.prepare(
      `SELECT u.id, u.name, m.joined_at AS joinedAt, p.state
       FROM class_members m JOIN users u ON u.id = m.student_id
       LEFT JOIN progress p ON p.user_id = u.id
       WHERE m.class_id = ? ORDER BY u.name`,
    )
      .bind(found.id)
      .all();
    const students = results.map(({ state, ...student }) => ({
      ...student,
      ...summarize(state ? JSON.parse(state) : null),
    }));
    return json({ class: found, students });
  },

  async "DELETE /api/classes/:id/students/:studentId"({ env, user, params }) {
    const owned = await env.DB.prepare(
      "SELECT 1 FROM classes WHERE id = ? AND teacher_id = ?",
    )
      .bind(params.id, user.id)
      .first();
    if (!owned) fail(404, "Clase no encontrada.");
    await env.DB.prepare(
      "DELETE FROM class_members WHERE class_id = ? AND student_id = ?",
    )
      .bind(params.id, params.studentId)
      .run();
    return json({ ok: true });
  },
};

const PUBLIC = new Set(["POST /api/auth/register", "POST /api/auth/login", "POST /api/auth/logout"]);

function match(method, pathname) {
  for (const key of Object.keys(routes)) {
    const [m, pattern] = key.split(" ");
    if (m !== method) continue;
    const names = [];
    const re = new RegExp(
      "^" + pattern.replace(/:(\w+)/g, (_, n) => (names.push(n), "([^/]+)")) + "$",
    );
    const found = pathname.match(re);
    if (found)
      return {
        key,
        params: Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(found[i + 1])])),
      };
  }
  return null;
}

export async function handle(request, env) {
  try {
    const { pathname } = new URL(request.url);
    const route = match(request.method, pathname);
    if (!route) fail(404, "Ruta no encontrada.");
    const user = PUBLIC.has(route.key) ? null : await currentUser(request, env);
    if (!PUBLIC.has(route.key) && !user) fail(401, "Tu sesión terminó. Vuelve a entrar.");
    return await routes[route.key]({ request, env, user, params: route.params });
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error(err);
    return json({ error: "Ocurrió un error en el servidor." }, 500);
  }
}
