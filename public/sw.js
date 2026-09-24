// Service worker: la app funciona sin conexión y recibe el recordatorio diario.
// - Páginas: primero la red y, sin conexión, la última copia guardada.
// - Archivos del sitio: la copia guardada al instante y se actualiza detrás.
// - /api/*: siempre la red (el progreso se sincroniza desde la app).
const CACHE = "socatres-v1";
const SHELL = [
  "/",
  "/aprender",
  "/styles.css",
  "/landing.css",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.png",
  ...[
    "admin", "api", "app", "auth", "content", "csv", "curriculum", "daily",
    "dialogs", "family-view", "generators", "landing", "learning", "mistakes",
    "notify", "session", "stats", "ui", "units", "video",
  ].map((name) => `/${name}.js`),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// /aprender.html y /aprender son la misma página.
const pageKey = (url) => (url.pathname.endsWith(".html") ? url.pathname.slice(0, -5) : url.pathname).replace(/\/index$/, "/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !response.redirected) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(pageKey(url), copy));
          }
          return response;
        })
        .catch(() => caches.match(pageKey(url)).then((hit) => hit || caches.match("/aprender"))),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(request, { ignoreSearch: true });
      const update = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => hit);
      if (hit) {
        event.waitUntil(update);
        return hit;
      }
      return update;
    }),
  );
});

// El aviso llega sin contenido: el texto se pide al servidor con la sesión,
// así el servicio de notificaciones nunca ve datos del estudiante.
self.addEventListener("push", (event) => {
  const fallback = { title: "socatres", body: "Tu práctica del día te espera. Son solo unos minutos." };
  event.waitUntil(
    fetch("/api/reminder", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : fallback))
      .catch(() => fallback)
      .then(({ title, body }) =>
        self.registration.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "daily-reminder",
          lang: "es-CL",
          data: { url: "/aprender#ruta" },
        }),
      ),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/aprender#ruta", location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).pathname.startsWith("/aprender"));
      return open ? open.focus().then((w) => w.navigate(target)) : self.clients.openWindow(target);
    }),
  );
});
