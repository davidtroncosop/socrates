// Videos de las lecciones guardados en R2 (binding MEDIA), servidos desde el
// mismo dominio: no dependen de YouTube ni cargan nada de terceros.
// Admite peticiones por rango, que Safari exige para reproducir video, y
// caché permanente: cada archivo lleva su huella en el nombre.
const KEY = /^lessons\/[a-z0-9-]+\.mp4$/;

const notFound = () => new Response("No encontrado", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });

export async function serveMedia(request, env, path) {
  const key = [].concat(path ?? []).join("/");
  if (!KEY.test(key) || !env.MEDIA) return notFound();
  const isHead = request.method === "HEAD";
  const hasRange = request.headers.has("range");
  const object =
    isHead && !hasRange && typeof env.MEDIA.head === "function"
      ? await env.MEDIA.head(key)
      : await env.MEDIA.get(key, { range: request.headers, onlyIf: request.headers });
  if (!object) return notFound();

  const headers = new Headers({
    "content-type": "video/mp4",
    "cache-control": "public, max-age=31536000, immutable",
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
    etag: object.httpEtag,
  });
  // onlyIf no se cumplió (p. ej. If-None-Match con la misma huella).
  if (!isHead && !("body" in object)) return new Response(null, { status: 304, headers });
  if (isHead && request.headers.get("if-none-match") === object.httpEtag) {
    await object.body?.cancel?.().catch(() => {});
    return new Response(null, { status: 304, headers });
  }

  const range = object.range;
  if (range && hasRange && object.size > 0) {
    const suffix = "suffix" in range ? Math.min(range.suffix, object.size) : null;
    const offset = suffix !== null ? object.size - suffix : (range.offset ?? 0);
    const length = suffix !== null ? suffix : Math.min(range.length ?? object.size - offset, object.size - offset);
    headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set("content-length", String(length));
    if (isHead) {
      await object.body?.cancel?.().catch(() => {});
      return new Response(null, { status: 206, headers });
    }
    return new Response(object.body, { status: 206, headers });
  }
  headers.set("content-length", String(object.size));
  if (isHead) {
    await object.body?.cancel?.().catch(() => {});
    return new Response(null, { status: 200, headers });
  }
  return new Response(object.body, { status: 200, headers });
}
