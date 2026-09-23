import {
  randomToken,
  sha256,
  hashPassword,
  verifyPassword,
  classCode,
} from "./crypto.js";
import { validateCatalog } from "../../public/content.js";

export const COOKIE = "socatres_session";
const SESSION_DAYS = 30;
const DAY = 86400000;
const MAX_BODY = 256 * 1024;
const MAX_CATALOG = 2 * 1024 * 1024;
const MAX_CHILDREN = 10;
const LINK_CODE_HOURS = 24;

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
      "x-content-type-options": "nosniff",
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
async function readJson(request, max = MAX_BODY) {
  if (!(request.headers.get("content-type") || "").startsWith("application/json"))
    fail(415, "Se espera JSON.");
  const text = await request.text();
  if (text.length > max) fail(413, "La información enviada es demasiado grande.");
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
const cleanUsername = (value) => {
  const username = String(value || "").trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(username))
    fail(400, "El usuario debe tener entre 3 y 30 letras, números, puntos o guiones, sin espacios ni tildes.");
  return username;
};
const cleanName = (value, label = "tu nombre", max = 60) => {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  if (!name || name.length > max) fail(400, `Escribe ${label} (máximo ${max} caracteres).`);
  return name;
};
const cleanPassword = (value) => {
  const password = String(value || "");
  if (password.length < 8 || password.length > 200)
    fail(400, "La contraseña debe tener al menos 8 caracteres.");
  return password;
};
// Código de recuperación legible: XXXX-XXXX-XXXX (sin 0/O ni 1/I/L).
const recoveryCode = () => [classCode(4), classCode(4), classCode(4)].join("-");
const normalizeCode = (code) => String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

const adminEmails = (env) =>
  String(env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
const isAdmin = (env, user) => Boolean(user.email) && adminEmails(env).includes(user.email);
const publicUser = (env, u) => ({
  id: u.id,
  name: u.name,
  email: u.email ?? null,
  username: u.username ?? null,
  role: u.role,
  isAdmin: isAdmin(env, u),
});
let dummyHash;

async function startSession(request, env, user, extra = {}) {
  const token = randomToken();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(Date.now()).run();
  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
  )
    .bind(await sha256(token), user.id, Date.now() + SESSION_DAYS * DAY)
    .run();
  return json({ user: publicUser(env, user), ...extra }, 200, {
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

const findByLogin = (env, login) => {
  const value = String(login || "").trim().toLowerCase();
  return env.DB.prepare("SELECT * FROM users WHERE email = ? OR username = ?")
    .bind(value, value)
    .first();
};

// Resumen para el apoderado: solo cifras, no notas ni fotos.
export function summarize(state) {
  const attempts = Array.isArray(state?.attempts) ? state.attempts : [];
  const weekAgo = Date.now() - 7 * DAY;
  const recent = attempts.filter((a) => a.at >= weekAgo);
  return {
    completed: Array.isArray(state?.completed) ? state.completed : [],
    mastered: Array.isArray(state?.mastered) ? state.mastered : [],
    videosWatched: Array.isArray(state?.watched) ? state.watched.length : 0,
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

async function childOf(env, parent, childId) {
  const child = await env.DB.prepare(
    `SELECT u.* FROM family_links f JOIN users u ON u.id = f.child_id
     WHERE f.parent_id = ? AND f.child_id = ?`,
  )
    .bind(parent.id, childId)
    .first();
  // 404 también si no es su hijo: no se revela que la cuenta existe.
  if (!child) fail(404, "No encontramos a ese estudiante en tu familia.");
  return child;
}
const requireRole = (user, role, message) => {
  if (user.role !== role) fail(403, message);
};

const routes = {
  // Registro propio: apoderados y estudiantes de 14 años o más (Ley 21.719).
  async "POST /api/auth/register"({ request, env }) {
    const body = await readJson(request);
    const role = body.role === "parent" ? "parent" : "student";
    if (role === "student" && body.age14 !== true)
      fail(400, "Si tienes menos de 14 años, tu apoderado debe crear tu cuenta.");
    const email = cleanEmail(body.email);
    const name = cleanName(body.name);
    const password = cleanPassword(body.password);
    if (await env.DB.prepare("SELECT 1 FROM users WHERE email = ?").bind(email).first())
      fail(409, "Ya existe una cuenta con ese correo. Entra con tu contraseña.");
    const code = recoveryCode();
    const user = { id: crypto.randomUUID(), email, name, role };
    await env.DB.prepare(
      "INSERT INTO users (id, email, name, role, password_hash, recovery_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(user.id, email, name, role, await hashPassword(password), await sha256(normalizeCode(code)), Date.now())
      .run();
    return startSession(request, env, user, { recoveryCode: code });
  },

  async "POST /api/auth/login"({ request, env }) {
    const body = await readJson(request);
    const user = await findByLogin(env, body.login ?? body.email);
    // Mismo mensaje y mismo trabajo exista o no la cuenta.
    dummyHash ??= await hashPassword(randomToken());
    const valid = await verifyPassword(String(body.password || ""), user ? user.password_hash : dummyHash);
    if (!user || !valid) fail(401, "Usuario o contraseña incorrectos.");
    return startSession(request, env, user);
  },

  // Recuperación sin correo: el código entregado al registrarse. Cambia la
  // contraseña, cierra las demás sesiones y entrega un código nuevo.
  async "POST /api/auth/recover"({ request, env }) {
    const body = await readJson(request);
    const user = await findByLogin(env, body.login);
    const hash = await sha256(normalizeCode(body.code));
    if (!user || !user.recovery_hash || user.recovery_hash !== hash)
      fail(401, "El código de recuperación no coincide.");
    const password = cleanPassword(body.password);
    const code = recoveryCode();
    await env.DB.prepare("UPDATE users SET password_hash = ?, recovery_hash = ? WHERE id = ?")
      .bind(await hashPassword(password), await sha256(normalizeCode(code)), user.id)
      .run();
    await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
    return startSession(request, env, user, { recoveryCode: code });
  },

  async "POST /api/auth/logout"({ request, env }) {
    const token = readCookie(request);
    if (token)
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, "", 0) });
  },

  async "GET /api/me"({ env, user }) {
    return json({ user: publicUser(env, user) });
  },

  async "DELETE /api/me"({ request, env, user }) {
    // ON DELETE CASCADE elimina sesiones, progreso, vínculos y las cuentas de
    // menores que este apoderado creó.
    await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();
    return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, "", 0) });
  },

  async "GET /api/progress"({ env, user }) {
    const row = await env.DB.prepare("SELECT state, updated_at FROM progress WHERE user_id = ?")
      .bind(user.id)
      .first();
    return json(row ? { state: JSON.parse(row.state), updatedAt: row.updated_at } : { state: null, updatedAt: null });
  },

  async "PUT /api/progress"({ request, env, user }) {
    const state = validateState((await readJson(request)).state);
    const updatedAt = Date.now();
    await env.DB.prepare(
      `INSERT INTO progress (user_id, state, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`,
    )
      .bind(user.id, JSON.stringify(state), updatedAt)
      .run();
    return json({ updatedAt });
  },

  // Familia ------------------------------------------------------------------
  async "GET /api/family"({ env, user }) {
    if (user.role === "parent") {
      const { results } = await env.DB.prepare(
        `SELECT u.id, u.name, u.username, u.consent_by = ? AS createdByMe, p.state
         FROM family_links f JOIN users u ON u.id = f.child_id
         LEFT JOIN progress p ON p.user_id = u.id
         WHERE f.parent_id = ? ORDER BY u.name`,
      )
        .bind(user.id, user.id)
        .all();
      return json({
        children: results.map(({ state, createdByMe, ...child }) => ({
          ...child,
          createdByMe: Boolean(createdByMe),
          ...summarize(state ? JSON.parse(state) : null),
        })),
      });
    }
    const { results } = await env.DB.prepare(
      `SELECT u.name FROM family_links f JOIN users u ON u.id = f.parent_id
       WHERE f.child_id = ? ORDER BY u.name`,
    )
      .bind(user.id)
      .all();
    return json({ parents: results.map((r) => r.name) });
  },

  // El apoderado crea la cuenta de un menor: su consentimiento queda registrado.
  async "POST /api/family/children"({ request, env, user }) {
    requireRole(user, "parent", "Solo un apoderado puede crear cuentas de estudiantes.");
    const body = await readJson(request);
    const name = cleanName(body.name, "el nombre del estudiante");
    const username = cleanUsername(body.username);
    const password = cleanPassword(body.password);
    const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM family_links WHERE parent_id = ?")
      .bind(user.id)
      .first();
    if (count >= MAX_CHILDREN) fail(400, `Puedes tener hasta ${MAX_CHILDREN} estudiantes.`);
    if (await env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(username).first())
      fail(409, "Ese usuario ya existe. Prueba con otro.");
    const child = { id: crypto.randomUUID(), name, username };
    const now = Date.now();
    await env.DB.prepare(
      "INSERT INTO users (id, username, name, role, password_hash, consent_by, created_at) VALUES (?, ?, ?, 'student', ?, ?, ?)",
    )
      .bind(child.id, username, name, await hashPassword(password), user.id, now)
      .run();
    await env.DB.prepare("INSERT INTO family_links (parent_id, child_id, created_at) VALUES (?, ?, ?)")
      .bind(user.id, child.id, now)
      .run();
    return json({ child }, 201);
  },

  // Un estudiante con cuenta propia genera un código para su apoderado.
  async "POST /api/family/link-code"({ env, user }) {
    requireRole(user, "student", "Solo un estudiante puede generar un código de vinculación.");
    await env.DB.prepare("DELETE FROM link_codes WHERE child_id = ? OR expires_at < ?")
      .bind(user.id, Date.now())
      .run();
    const code = classCode(6);
    const expiresAt = Date.now() + LINK_CODE_HOURS * 3600000;
    await env.DB.prepare("INSERT INTO link_codes (code, child_id, expires_at) VALUES (?, ?, ?)")
      .bind(code, user.id, expiresAt)
      .run();
    return json({ code, expiresAt });
  },

  async "POST /api/family/link"({ request, env, user }) {
    requireRole(user, "parent", "Solo un apoderado puede vincular estudiantes.");
    const code = normalizeCode((await readJson(request)).code);
    const found = await env.DB.prepare("SELECT child_id FROM link_codes WHERE code = ? AND expires_at > ?")
      .bind(code, Date.now())
      .first();
    if (!found) fail(404, "El código no existe o ya venció. Pide uno nuevo.");
    await env.DB.prepare("INSERT OR IGNORE INTO family_links (parent_id, child_id, created_at) VALUES (?, ?, ?)")
      .bind(user.id, found.child_id, Date.now())
      .run();
    await env.DB.prepare("DELETE FROM link_codes WHERE code = ?").bind(code).run();
    const child = await env.DB.prepare("SELECT id, name FROM users WHERE id = ?").bind(found.child_id).first();
    return json({ child });
  },

  async "POST /api/family/children/:id/password"({ request, env, user, params }) {
    requireRole(user, "parent", "Solo un apoderado puede cambiar esta contraseña.");
    const child = await childOf(env, user, params.id);
    const password = cleanPassword((await readJson(request)).password);
    await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .bind(await hashPassword(password), child.id)
      .run();
    await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(child.id).run();
    return json({ ok: true });
  },

  // Quita el vínculo; si el apoderado creó la cuenta, la elimina.
  async "DELETE /api/family/children/:id"({ env, user, params }) {
    requireRole(user, "parent", "Solo un apoderado puede hacer esto.");
    const child = await childOf(env, user, params.id);
    if (child.consent_by === user.id)
      await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(child.id).run();
    else
      await env.DB.prepare("DELETE FROM family_links WHERE parent_id = ? AND child_id = ?")
        .bind(user.id, child.id)
        .run();
    return json({ ok: true, deleted: child.consent_by === user.id });
  },

  // Catálogo central ------------------------------------------------------------
  async "GET /api/catalog"({ env }) {
    const row = await env.DB.prepare("SELECT data, updated_at FROM catalog WHERE id = 1").first();
    return json(row ? { catalog: JSON.parse(row.data), updatedAt: row.updated_at } : { catalog: null, updatedAt: null });
  },

  async "PUT /api/catalog"({ request, env, user }) {
    if (!isAdmin(env, user)) fail(403, "Solo la administración puede publicar contenido.");
    let catalog;
    try {
      catalog = validateCatalog((await readJson(request, MAX_CATALOG)).catalog);
    } catch (err) {
      if (err instanceof HttpError) throw err;
      fail(400, err.message);
    }
    const updatedAt = Date.now();
    await env.DB.prepare(
      `INSERT INTO catalog (id, data, updated_at) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
      .bind(JSON.stringify(catalog), updatedAt)
      .run();
    return json({ catalog, updatedAt });
  },
};

const PUBLIC = new Set([
  "POST /api/auth/register",
  "POST /api/auth/login",
  "POST /api/auth/recover",
  "POST /api/auth/logout",
  "GET /api/catalog",
]);

function match(method, pathname) {
  for (const key of Object.keys(routes)) {
    const [m, pattern] = key.split(" ");
    if (m !== method) continue;
    const names = [];
    const re = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, n) => (names.push(n), "([^/]+)")) + "$");
    const found = pathname.match(re);
    if (found)
      return { key, params: Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(found[i + 1])])) };
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
