// Service worker: la app funciona sin conexión y recibe el recordatorio diario.
// - Páginas: primero la red y, sin conexión, la última copia guardada.
// - Archivos del sitio: también primero la red, para que cada visita use la
//   versión publicada (con «copia primero» la primera visita tras publicar
//   mezclaba código viejo y nuevo); sin conexión, la copia guardada.
// - /api/*: siempre la red (el progreso se sincroniza desde la app).
// - /media/*: siempre la red; los videos se piden por rangos y no se guardan.
const CACHE = "socatres-v1";
const SHELL = [
  "/",
  "/aprender",
  "/styles.css",
  "/landing.css",
  "/manifest.webmanifest",
  "/favicon-32x32.png",
  "/logo-buho.png",
  "/icon-192.png",
  ...[
    "admin", "api", "app", "auth", "content", "csv", "curriculum", "daily",
    "dialogs", "family-view", "generators", "landing", "learning", "lesson-videos", "mistakes", "subjects",
    "metrics", "minigames", "notify", "session", "speak", "stats", "ui", "units", "video", "weekly", "work-photo",
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
  if (request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname.startsWith("/media/")) return;

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
    caches.open(CACHE).then((cache) =>
      fetch(request)
        .then((response) => {
          if (response.ok && response.status === 200) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cache.match(request, { ignoreSearch: true }).then((hit) => hit || Response.error())),
    ),
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
          badge: "/badge-96.png",
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
