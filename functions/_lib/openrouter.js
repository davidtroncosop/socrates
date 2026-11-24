// Llamada compartida a OpenRouter: la usan la revisión de fotos y el búho tutor.
// La clave va como secreto: npx wrangler pages secret put OPENROUTER_API_KEY

export const DEFAULT_MODEL = "google/gemini-2.5-flash";
export const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const TIMEOUT_MS = 25_000;

export class AiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const text = (value, max) => String(value ?? "").trim().slice(0, max);

export const modelOf = (env) =>
  /^[a-z0-9._-]+\/[a-z0-9._:-]+$/i.test(env.REVIEW_MODEL || "") ? env.REVIEW_MODEL : DEFAULT_MODEL;

// Opciones comunes: respuestas cortas en JSON, sin razonamiento y solo con
// proveedores que no guardan ni entrenan con lo enviado (son datos de niños).
export const chatOptions = (model, maxTokens = 400) => ({
  model,
  temperature: 0.2,
  // Sin razonamiento: en las pruebas acertó igual, ~10 veces más barato y en
  // ~1,5 s. El JSON estricto (json_schema) de Gemini 2.5 Flash a veces se
  // queda repitiendo "\n" hasta el límite; json_object con el formato en el
  // prompt no falló, y el tope corto acota el costo si algo sale mal.
  max_tokens: maxTokens,
  reasoning: { enabled: false },
  response_format: { type: "json_object" },
  provider: { data_collection: "deny" },
});

// Saca el objeto JSON de la respuesta del modelo, o null si no viene uno.
export function readJsonContent(data) {
  let raw = data?.choices?.[0]?.message?.content ?? "";
  if (Array.isArray(raw)) raw = raw.map((p) => p?.text ?? "").join("");
  // Algunos modelos envuelven el JSON en ```json … ```.
  raw = String(raw).trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  try {
    const out = JSON.parse(raw);
    return out && typeof out === "object" ? out : null;
  } catch {
    return null;
  }
}

// `messages` dice qué responder en cada caso de error.
export async function chat(env, body, messages, fetchImpl = fetch) {
  if (!env.OPENROUTER_API_KEY) throw new AiError(503, messages.unavailable);
  let res;
  try {
    res = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "x-title": "socatres",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new AiError(504, messages.timeout);
  }
  if (!res.ok) {
    console.error("OpenRouter", res.status, (await res.text().catch(() => "")).slice(0, 500));
    throw new AiError(502, messages.failed);
  }
  return res.json();
}
