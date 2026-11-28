// Cliente mínimo de la API de Flow (https://developers.flow.cl/en/api).
// Cada petición lleva `apiKey` y la firma `s`: HMAC-SHA256 en hexadecimal, con
// la secretKey, de todos los parámetros (menos `s`) ordenados por nombre y
// pegados como nombre+valor, sin separadores.
//
// Variables (secretos en producción; en local, .dev.vars):
//   FLOW_API_URL    https://sandbox.flow.cl/api (pruebas) o https://www.flow.cl/api
//   FLOW_API_KEY, FLOW_SECRET_KEY
// Sin las tres, el cobro no está disponible (nunca se asume producción).

const TIMEOUT_MS = 20_000;

export class FlowError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const flowConfigured = (env) =>
  Boolean(env.FLOW_API_KEY && env.FLOW_SECRET_KEY && /^https:\/\/[a-z0-9.-]+\.flow\.cl\/api$/i.test(env.FLOW_API_URL || ""));

// Texto que se firma: parámetros ordenados, «nombrevalor» uno tras otro.
export const signingString = (params) =>
  Object.keys(params)
    .filter((k) => k !== "s" && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => k + String(params[k]))
    .join("");

export async function sign(params, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingString(params)));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Llama a un servicio de Flow. GET va en la URL; POST como formulario.
export async function flow(env, method, service, params = {}, fetchImpl = fetch) {
  if (!flowConfigured(env)) throw new FlowError(503, "El pago con tarjeta todavía no está disponible.");
  const clean = Object.fromEntries(Object.entries({ ...params, apiKey: env.FLOW_API_KEY }).filter(([, v]) => v !== undefined && v !== null));
  const body = new URLSearchParams({ ...clean, s: await sign(clean, env.FLOW_SECRET_KEY) });
  const url = `${env.FLOW_API_URL}/${service}`;
  let res;
  try {
    res = await fetchImpl(method === "GET" ? `${url}?${body}` : url, {
      method,
      ...(method === "GET" ? {} : { headers: { "content-type": "application/x-www-form-urlencoded" }, body: body.toString() }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new FlowError(504, "Flow no respondió a tiempo. Inténtalo de nuevo en un rato.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Nunca se registra la apiKey ni la firma: solo el servicio y el error.
    console.error(JSON.stringify({ event: "flow_error", service, status: res.status, code: data?.code, message: String(data?.message ?? "").slice(0, 200) }));
    throw new FlowError(502, "No pudimos hablar con Flow. Inténtalo de nuevo en un rato.", data?.code);
  }
  return data ?? {};
}

// Flow informa fechas «AAAA-MM-DD hh:mm:ss» en hora de Chile.
export function flowDate(value) {
  const m = String(value ?? "").match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/);
  if (!m) return null;
  const ms = Date.parse(`${m[1]}T${m[2] ?? "23:59:59"}${m[2]?.length === 5 ? ":00" : ""}-03:00`);
  return Number.isFinite(ms) ? ms : null;
}
