import {
  randomToken,
  sha256,
  hashPassword,
  verifyPassword,
  classCode,
} from "./crypto.js";
import { validateCatalog } from "../../public/content.js";
import { earnedFichas } from "../../public/stats.js";
import { isPushEndpoint } from "./push.js";
import { reminderText, isTimeZone } from "./reminders.js";
import { readReviewRequest, reviewWork, ReviewError, MAX_IMAGE } from "./work-review.js";

export const COOKIE = "socatres_session";
const SESSION_DAYS = 30;
const DAY = 86400000;
const MAX_BODY = 256 * 1024;
const MAX_CATALOG = 2 * 1024 * 1024;
const MAX_CHILDREN = 10;
const LINK_CODE_HOURS = 24;
const MAX_REWARDS = 12;
const MAX_PENDING_CLAIMS = 5;

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
// ADMIN_IDS (IDs de usuario) es lo más seguro: no depende de quién registre
// un correo. ADMIN_EMAILS queda para compatibilidad.
const adminIds = (env) =>
  String(env.ADMIN_IDS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
const isAdmin = (env, user) =>
  adminIds(env).includes(String(user.id)) || (Boolean(user.email) && adminEmails(env).includes(user.email));
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
    fichasEarned: earnedFichas(state).total,
    // Intentos de las últimas dos semanas para el resumen semanal (lo arma el
    // navegador con la zona horaria de la familia).
    recent: attempts
      .filter((a) => a.at >= Date.now() - 14 * DAY && typeof a.lesson === "string")
      .slice(-1000)
      .map((a) => ({ lesson: a.lesson, correct: a.correct === true, hints: Number(a.hints) || 0, at: a.at })),
    lastActivity:
      Math.max(
        attempts.reduce((max, a) => Math.max(max, a.at || 0), 0),
        ...Object.values(state?.archive?.last ?? {}).filter(Number.isFinite),
      ) || null,
  };
}

// Fichas: las ganadas salen del progreso; las pedidas (pendientes o
// aprobadas) se descuentan, para no pedir dos premios con las mismas fichas.
async function fichasOf(env, childId, earned) {
  if (earned === undefined) {
    const row = await env.DB.prepare("SELECT state FROM progress WHERE user_id = ?").bind(childId).first();
    earned = earnedFichas(row ? JSON.parse(row.state) : null).total;
  }
  const { spent } = await env.DB.prepare(
    "SELECT COALESCE(SUM(cost), 0) AS spent FROM reward_claims WHERE child_id = ? AND status IN ('pending', 'approved')",
  )
    .bind(childId)
    .first();
  return { earned, spent, balance: Math.max(0, earned - spent) };
}
// Canjes pendientes y los decididos en las últimas dos semanas.
async function claimsOf(env, childId) {
  const { results } = await env.DB.prepare(
    `SELECT id, title, cost, status, created_at AS createdAt, decided_at AS decidedAt
     FROM reward_claims WHERE child_id = ? AND (status = 'pending' OR decided_at > ?)
     ORDER BY created_at DESC LIMIT 20`,
  )
    .bind(childId, Date.now() - 14 * DAY)
    .all();
  return results;
}
const cleanCost = (value) => {
  const cost = Number(value);
  if (!Number.isInteger(cost) || cost < 1 || cost > 200)
    fail(400, "El costo debe ser un número entero de fichas, entre 1 y 200.");
  return cost;
};
async function rewardsOfParent(env, parentId) {
  const { results } = await env.DB.prepare(
    "SELECT id, title, cost FROM family_rewards WHERE parent_id = ? ORDER BY cost, title",
  )
    .bind(parentId)
    .all();
  return results;
}

// Las fotos quedan en el dispositivo: el servidor no las acepta.
function validateState(state) {
  if (!state || state.version !== 1) fail(400, "Formato de progreso inválido.");
  for (const key of ["completed", "mastered", "attempts", "notes", "reviews"])
    if (!Array.isArray(state[key])) fail(400, `Falta la lista ${key}.`);
  if (state.notes.some((n) => !n || typeof n !== "object")) fail(400, "Formato de progreso inválido.");
  if (state.notes.some((n) => "image" in n))
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

// Límite de intentos: cuenta por clave dentro de una ventana fija. Frena a
// quien intenta adivinar contraseñas, códigos de recuperación o de vínculo.
const LIMITS = {
  loginIp: [30, 15 * 60_000],
  loginAccount: [10, 15 * 60_000],
  register: [10, 60 * 60_000],
  recover: [5, 60 * 60_000],
  link: [10, 15 * 60_000],
  metrics: [200, 15 * 60_000],
  // Cada revisión de foto tiene costo: un tope generoso por cuenta.
  workReview: [120, 60 * 60_000],
};
const clientIp = (request) => request.headers.get("cf-connecting-ip") || "local";
async function limit(env, kind, who) {
  const [max, windowMs] = LIMITS[kind];
  const now = Date.now();
  const key = `${kind}:${String(who).toLowerCase().slice(0, 200)}`;
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN window_start <= ? THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start <= ? THEN ? ELSE window_start END
     RETURNING count`,
  )
    .bind(key, now, now - windowMs, now - windowMs, now)
    .first();
  if (row && row.count > max) fail(429, "Demasiados intentos. Espera unos minutos y vuelve a probar.");
  // Limpieza ocasional de ventanas viejas.
  if (Math.random() < 0.02) await env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(now - 24 * 60 * 60_000).run();
}

const routes = {
  // Registro propio: apoderados y estudiantes de 14 años o más (Ley 21.719).
  async "POST /api/auth/register"({ request, env }) {
    await limit(env, "register", clientIp(request));
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
    await limit(env, "loginIp", clientIp(request));
    await limit(env, "loginAccount", String(body.login ?? body.email ?? ""));
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
    await limit(env, "recover", String(body.login ?? ""));
    await limit(env, "recover", clientIp(request));
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
      const children = [];
      for (const { state, createdByMe, ...child } of results) {
        const summary = summarize(state ? JSON.parse(state) : null);
        children.push({
          ...child,
          createdByMe: Boolean(createdByMe),
          ...summary,
          fichas: await fichasOf(env, child.id, summary.fichasEarned),
          claims: await claimsOf(env, child.id),
        });
      }
      return json({ children, rewards: await rewardsOfParent(env, user.id) });
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
    await limit(env, "link", user.id);
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

  // Solo para cuentas que el apoderado creó: un estudiante con cuenta propia
  // la recupera con su código, y vincularse no da acceso a ella.
  async "POST /api/family/children/:id/password"({ request, env, user, params }) {
    requireRole(user, "parent", "Solo un apoderado puede cambiar esta contraseña.");
    const child = await childOf(env, user, params.id);
    if (child.consent_by !== user.id)
      fail(403, "Este estudiante tiene cuenta propia: recupera su contraseña con su código de recuperación.");
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

  // Premios en casa ----------------------------------------------------------
  // El estudiante ve los premios de todos sus apoderados vinculados.
  async "GET /api/rewards"({ env, user }) {
    requireRole(user, "student", "Los premios se ven desde la cuenta del estudiante.");
    const { results: rewards } = await env.DB.prepare(
      `SELECT r.id, r.title, r.cost, u.name AS parentName
       FROM family_rewards r JOIN family_links f ON f.parent_id = r.parent_id
       JOIN users u ON u.id = r.parent_id
       WHERE f.child_id = ? ORDER BY r.cost, r.title`,
    )
      .bind(user.id)
      .all();
    const { linked } = await env.DB.prepare("SELECT COUNT(*) AS linked FROM family_links WHERE child_id = ?")
      .bind(user.id)
      .first();
    return json({
      rewards,
      linked: linked > 0,
      claims: await claimsOf(env, user.id),
      fichas: await fichasOf(env, user.id),
    });
  },

  async "POST /api/rewards"({ request, env, user }) {
    requireRole(user, "parent", "Solo un apoderado puede agregar premios.");
    const body = await readJson(request);
    const title = cleanName(body.title, "el premio", 60);
    const cost = cleanCost(body.cost);
    const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM family_rewards WHERE parent_id = ?")
      .bind(user.id)
      .first();
    if (count >= MAX_REWARDS) fail(400, `Puedes tener hasta ${MAX_REWARDS} premios. Borra uno para agregar otro.`);
    const reward = { id: crypto.randomUUID(), title, cost };
    await env.DB.prepare("INSERT INTO family_rewards (id, parent_id, title, cost, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(reward.id, user.id, title, cost, Date.now())
      .run();
    return json({ reward }, 201);
  },

  async "DELETE /api/rewards/:id"({ env, user, params }) {
    requireRole(user, "parent", "Solo un apoderado puede borrar premios.");
    const found = await env.DB.prepare("SELECT 1 FROM family_rewards WHERE id = ? AND parent_id = ?")
      .bind(params.id, user.id)
      .first();
    if (!found) fail(404, "No encontramos ese premio.");
    // Los canjes pendientes de este premio se rechazan y devuelven las fichas.
    await env.DB.prepare(
      "UPDATE reward_claims SET status = 'rejected', decided_at = ? WHERE reward_id = ? AND status = 'pending'",
    )
      .bind(Date.now(), params.id)
      .run();
    await env.DB.prepare("DELETE FROM family_rewards WHERE id = ?").bind(params.id).run();
    return json({ ok: true });
  },

  async "POST /api/rewards/:id/claim"({ env, user, params }) {
    requireRole(user, "student", "Solo el estudiante puede pedir un premio.");
    const reward = await env.DB.prepare(
      `SELECT r.* FROM family_rewards r JOIN family_links f ON f.parent_id = r.parent_id
       WHERE r.id = ? AND f.child_id = ?`,
    )
      .bind(params.id, user.id)
      .first();
    if (!reward) fail(404, "Ese premio ya no está disponible.");
    const { pending } = await env.DB.prepare(
      "SELECT COUNT(*) AS pending FROM reward_claims WHERE child_id = ? AND status = 'pending'",
    )
      .bind(user.id)
      .first();
    if (pending >= MAX_PENDING_CLAIMS) fail(400, "Ya tienes varios premios esperando respuesta. Espera a que tu apoderado los revise.");
    const { balance } = await fichasOf(env, user.id);
    if (balance < reward.cost)
      fail(400, `Te faltan ${reward.cost - balance} fichas para este premio. ¡Sigue practicando!`);
    const claim = { id: crypto.randomUUID(), title: reward.title, cost: reward.cost, status: "pending", createdAt: Date.now() };
    await env.DB.prepare(
      `INSERT INTO reward_claims (id, child_id, parent_id, reward_id, title, cost, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
      .bind(claim.id, user.id, reward.parent_id, reward.id, reward.title, reward.cost, claim.createdAt)
      .run();
    return json({ claim, fichas: await fichasOf(env, user.id) }, 201);
  },

  // Aprobar descuenta las fichas; «ahora no» las devuelve.
  async "POST /api/claims/:id"({ request, env, user, params }) {
    requireRole(user, "parent", "Solo un apoderado puede responder un canje.");
    const { approve } = await readJson(request);
    if (typeof approve !== "boolean") fail(400, "Indica si apruebas el canje.");
    const claim = await env.DB.prepare(
      "SELECT id FROM reward_claims WHERE id = ? AND parent_id = ? AND status = 'pending'",
    )
      .bind(params.id, user.id)
      .first();
    if (!claim) fail(404, "Ese canje ya fue respondido o no existe.");
    await env.DB.prepare("UPDATE reward_claims SET status = ?, decided_at = ? WHERE id = ?")
      .bind(approve ? "approved" : "rejected", Date.now(), claim.id)
      .run();
    return json({ ok: true, status: approve ? "approved" : "rejected" });
  },

  // Recordatorio diario ----------------------------------------------------------
  async "GET /api/push/key"({ env }) {
    return json({ key: env.VAPID_PUBLIC_KEY || null });
  },

  async "PUT /api/push"({ request, env, user }) {
    const body = await readJson(request);
    if (!isPushEndpoint(body.endpoint)) fail(400, "Este navegador no es compatible con los recordatorios.");
    const hour = Number(body.hour);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) fail(400, "Elige una hora válida.");
    if (!isTimeZone(body.timeZone)) fail(400, "Zona horaria inválida.");
    await env.DB.prepare(
      `INSERT INTO push_subscriptions (endpoint, user_id, remind_hour, time_zone, created_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, remind_hour = excluded.remind_hour, time_zone = excluded.time_zone`,
    )
      .bind(body.endpoint, user.id, hour, body.timeZone, Date.now())
      .run();
    return json({ ok: true });
  },

  async "DELETE /api/push"({ request, env, user }) {
    const { endpoint } = await readJson(request);
    await env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ? AND user_id = ?")
      .bind(String(endpoint || ""), user.id)
      .run();
    return json({ ok: true });
  },

  // Texto que muestra el service worker al recibir el aviso.
  async "GET /api/reminder"({ env, user }) {
    const row = await env.DB.prepare("SELECT state FROM progress WHERE user_id = ?").bind(user.id).first();
    return json(reminderText(row ? JSON.parse(row.state) : null));
  },

  // Medición anónima ----------------------------------------------------------------
  // Contadores por lección y ejercicio: dónde se traban los estudiantes. No se
  // guarda quién, ni la IP, ni la respuesta.
  async "POST /api/metrics"({ request, env }) {
    await limit(env, "metrics", clientIp(request));
    const events = (await readJson(request)).events;
    if (!Array.isArray(events) || events.length > 20) fail(400, "Eventos inválidos.");
    const day = new Date().toISOString().slice(0, 10);
    for (const e of events) {
      if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(String(e?.lesson)) || !Number.isInteger(e.step) || e.step < 0 || e.step > 9 || !METRIC_KINDS.includes(e.kind))
        fail(400, "Eventos inválidos.");
      await env.DB.prepare(
        `INSERT INTO lesson_metrics (lesson, step, kind, day, count) VALUES (?, ?, ?, ?, 1)
         ON CONFLICT(lesson, step, kind, day) DO UPDATE SET count = count + 1`,
      )
        .bind(e.lesson, e.step, e.kind, day)
        .run();
    }
    return json({ ok: true });
  },

  async "GET /api/metrics"({ env, user }) {
    if (!isAdmin(env, user)) fail(403, "Solo la administración puede ver las métricas.");
    const since = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
    const { results } = await env.DB.prepare(
      "SELECT lesson, step, kind, SUM(count) AS count FROM lesson_metrics WHERE day >= ? GROUP BY lesson, step, kind",
    )
      .bind(since)
      .all();
    return json({ since, metrics: results });
  },

  // Revisión con IA del desarrollo a mano ----------------------------------------
  async "POST /api/work/review"({ request, env, user }) {
    await limit(env, "workReview", user.id);
    try {
      const review = await reviewWork(env, readReviewRequest(await readJson(request, MAX_IMAGE + 4096)));
      return json({ review });
    } catch (err) {
      if (err instanceof ReviewError) fail(err.status, err.message);
      throw err;
    }
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

const METRIC_KINDS = ["correct", "wrong", "hint", "revealed"];

const PUBLIC = new Set([
  "POST /api/metrics",
  "POST /api/auth/register",
  "POST /api/auth/login",
  "POST /api/auth/recover",
  "POST /api/auth/logout",
  "GET /api/catalog",
  "GET /api/push/key",
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
