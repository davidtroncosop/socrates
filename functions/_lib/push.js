// Web Push sin contenido (RFC 8030) con identificación VAPID (RFC 8292).
// Sin carga útil no hace falta cifrar: el service worker pide el texto a
// /api/reminder con la sesión del usuario.
const encoder = new TextEncoder();
const b64url = (data) =>
  btoa(typeof data === "string" ? data : String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

// Solo servicios de push conocidos: el servidor no hace peticiones a URLs
// arbitrarias entregadas por un cliente.
const PUSH_HOSTS =
  /^(?:fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9-]+\.push\.apple\.com|[a-z0-9-]+\.notify\.windows\.com)$/;
export function isPushEndpoint(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PUSH_HOSTS.test(url.hostname) && value.length <= 1000;
  } catch {
    return false;
  }
}

export async function vapidAuthorization(endpoint, env, now = Date.now()) {
  const header = b64url(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const payload = b64url(
    JSON.stringify({
      aud: new URL(endpoint).origin,
      exp: Math.floor(now / 1000) + 12 * 3600,
      sub: env.VAPID_SUBJECT,
    }),
  );
  const key = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(env.VAPID_PRIVATE_KEY),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  // WebCrypto entrega la firma como r‖s, el formato que exige JWT.
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    encoder.encode(`${header}.${payload}`),
  );
  return `vapid t=${header}.${payload}.${b64url(signature)}, k=${env.VAPID_PUBLIC_KEY}`;
}

export async function sendEmptyPush(endpoint, env, fetchImpl = fetch) {
  return fetchImpl(endpoint, {
    method: "POST",
    headers: {
      Authorization: await vapidAuthorization(endpoint, env),
      TTL: String(12 * 3600),
      Urgency: "normal",
      "Content-Length": "0",
    },
  });
}

// Genera un par de claves VAPID: pública (punto sin comprimir) y privada (JWK).
export async function generateVapidKeys() {
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return {
    publicKey: b64url(await crypto.subtle.exportKey("raw", pair.publicKey)),
    privateKey: JSON.stringify(await crypto.subtle.exportKey("jwk", pair.privateKey)),
  };
}
