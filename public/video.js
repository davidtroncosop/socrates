// Videos de YouTube como complemento de la lección conceptual.
// Privacidad: hasta que el estudiante pulsa ▶ no se hace ninguna petición a
// Google (ni miniatura); luego se usa youtube-nocookie.com.
import { escape } from "./ui.js";

const ID = /^[A-Za-z0-9_-]{11}$/;
const HOSTS = /^(?:www\.|m\.|music\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)$/;

// «90», «1:30», «1:02:03», «1m30s», «90s» → segundos. Vacío → null.
export function parseTime(raw) {
  const s = String(raw ?? "").trim().toLowerCase();
  if (!s) return null;
  if (/^\d+$/.test(s)) return Number(s);
  if (/^\d+(?::\d{1,2}){1,2}$/.test(s))
    return s.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  const m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (m && m[0]) return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
  return NaN;
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60),
    s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Acepta enlaces de watch, youtu.be, shorts, embed y live, o el ID directo.
export function parseYouTube(raw) {
  const text = String(raw ?? "").trim();
  if (ID.test(text)) return { id: text, start: null };
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : "https://" + text);
  } catch {
    return null;
  }
  if (!HOSTS.test(url.hostname)) return null;
  let id = null;
  if (url.hostname.endsWith("youtu.be")) id = url.pathname.slice(1).split("/")[0];
  else if (url.pathname === "/watch") id = url.searchParams.get("v");
  else id = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/)?.[1];
  if (!id || !ID.test(id)) return null;
  const start = parseTime(url.searchParams.get("t") ?? url.searchParams.get("start"));
  return { id, start: Number.isFinite(start) ? start : null };
}

export function validateVideo(video, prefix = "Video") {
  if (video === undefined || video === null) return undefined;
  if (typeof video !== "object" || !ID.test(video.id ?? ""))
    throw Error(`${prefix}: el enlace de YouTube no es válido.`);
  const title = String(video.title ?? "").trim();
  if (!title || title.length > 150)
    throw Error(`${prefix}: escribe un título para el video (máximo 150 caracteres).`);
  const time = (value, label) => {
    if (value === undefined || value === null) return undefined;
    if (!Number.isInteger(value) || value < 0 || value > 36000)
      throw Error(`${prefix}: el ${label} debe ser un tiempo válido (por ejemplo 1:30).`);
    return value;
  };
  const start = time(video.start, "inicio");
  const end = time(video.end, "fin");
  if (end !== undefined && end <= (start ?? 0))
    throw Error(`${prefix}: el fin debe ser posterior al inicio.`);
  return {
    id: video.id,
    title,
    ...(start ? { start } : {}),
    ...(end !== undefined ? { end } : {}),
  };
}

// Construye un video desde los campos que escribe quien edita la lección.
export function videoFromFields({ url, title, start, end }, prefix = "Video") {
  if (!String(url ?? "").trim()) return undefined;
  const parsed = parseYouTube(url);
  if (!parsed) throw Error(`${prefix}: pega un enlace de YouTube válido.`);
  const read = (value, label) => {
    const n = parseTime(value);
    if (Number.isNaN(n))
      throw Error(`${prefix}: el ${label} debe escribirse como 90 o 1:30.`);
    return n ?? undefined;
  };
  return validateVideo(
    {
      id: parsed.id,
      title,
      start: read(start, "inicio") ?? parsed.start ?? undefined,
      end: read(end, "fin"),
    },
    prefix,
  );
}

export function watchUrl(video) {
  return `https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}s` : ""}`;
}

export function embedUrl(video, autoplay = true) {
  const params = new URLSearchParams({ rel: "0", playsinline: "1" });
  if (autoplay) params.set("autoplay", "1");
  if (video.start) params.set("start", video.start);
  if (video.end) params.set("end", video.end);
  return `https://www.youtube-nocookie.com/embed/${video.id}?${params}`;
}

const span = (video) =>
  video.end
    ? `${formatTime(video.start || 0)}–${formatTime(video.end)} · ${formatTime(video.end - (video.start || 0))} min`
    : video.start
      ? `desde ${formatTime(video.start)}`
      : "";

// Tarjeta inicial: no carga nada externo.
export function videoFacade(video, lessonId) {
  const range = span(video);
  return `<div class="video-slot" id="video-slot"><button type="button" class="video-facade" data-action="play-video:${escape(lessonId)}" aria-label="Reproducir video: ${escape(video.title)}"><span class="video-play" aria-hidden="true">▶</span><span class="video-meta"><strong>${escape(video.title)}</strong><small>Video de YouTube${range ? " · " + range : ""}</small></span></button><p class="video-note">Al reproducirlo se conecta con YouTube. Si no carga en tu red, sigue con la explicación escrita o <a href="${watchUrl(video)}" target="_blank" rel="noopener noreferrer">ábrelo en YouTube</a>.</p></div>`;
}

export function videoPlayer(video, autoplay = true) {
  return `<div class="video-frame"><iframe src="${embedUrl(video, autoplay)}" title="${escape(video.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p class="video-note">¿No carga? <a href="${watchUrl(video)}" target="_blank" rel="noopener noreferrer">Ábrelo en YouTube</a> o sigue con la explicación escrita.</p>`;
}
