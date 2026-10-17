// Medición anónima: cuenta aciertos, errores, pistas y soluciones vistas por
// lección y ejercicio, para saber dónde se traban los estudiantes. Solo se
// envían esos contadores: ni nombre, ni cuenta, ni respuestas.
const queue = [];
let timer = null;

function flush() {
  clearTimeout(timer);
  timer = null;
  if (!queue.length || typeof fetch !== "function") return;
  const events = queue.splice(0, 20);
  fetch("/api/metrics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ events }),
    keepalive: true,
  }).catch(() => {});
  if (queue.length) flush();
}

export function track(lesson, step, kind) {
  if (!lesson) return;
  queue.push({ lesson, step: Number.isInteger(step) && step >= 0 && step <= 9 ? step : 9, kind });
  if (queue.length >= 10) flush();
  else if (!timer) {
    timer = setTimeout(flush, 15000);
    timer.unref?.();
  }
}

if (typeof document !== "undefined")
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
