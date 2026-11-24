import test from "node:test";
import assert from "node:assert/strict";
import { solveLinear, getSubject, inferGrade } from "../public/learning.js";
import { seedCatalog } from "../public/content.js";
import { escape } from "../public/ui.js";
import { ACTIVE_SUBJECTS } from "../public/subjects.js";
import { WORK_PHOTO } from "../public/work-photo.js";
const catalogLessons = seedCatalog().lessons;
// Lo que se publica hoy; las pruebas activan ambas materias salvo que pidan otra cosa.
const PUBLISHED_SUBJECTS = [...ACTIVE_SUBJECTS];
// Texto de la alternativa correcta en el contenido original.
const correctText = (q) =>
  q[0].split("\n").find((line) => line.startsWith(q[1] + ". ")).slice(3);
const lessonById = (id) => catalogLessons.find((l) => l.id === id);
// Lightweight DOM adapter for exercising real app handlers; visual QA remains separate.
async function harness(saved, { session, key = "socatres.v1", fetch, catalog, subjects = ["matematica", "lenguaje"], photoRequired = false } = {}) {
  ACTIVE_SUBJECTS.splice(0, ACTIVE_SUBJECTS.length, ...subjects);
  // La foto obligatoria tiene sus propias pruebas; el resto responde sin ella.
  WORK_PHOTO.required = photoRequired;
  const nodes = new Map();
  const node = (key) => {
    if (!nodes.has(key))
      nodes.set(key, {
        value: "",
        innerHTML: "",
        textContent: "",
        disabled: false,
        dataset: {},
        querySelector: (s) => node(s),
        querySelectorAll: () => [],
        removeAttribute() {},
        addEventListener(type, fn) {
          this[type] = fn;
        },
        insertAdjacentHTML(_, html) {
          this.innerHTML += html;
        },
        after() {},
        showModal() {},
        close() {},
      });
    return nodes.get(key);
  };
  const storage = new Map(saved ? [[key, JSON.stringify(saved)]] : []);
  // Un catálogo propio en las pruebas es uno publicado por la administración.
  if (catalog) {
    storage.set("socatres.content.v1", JSON.stringify(catalog));
    storage.set("socatres.catalog.updatedAt", "1");
  }
  if (session) storage.set("socatres.demo-session.v1", JSON.stringify(session));
  globalThis.localStorage = {
    getItem: (k) => storage.get(k) || null,
    setItem: (k, v) => storage.set(k, v),
    removeItem: (k) => storage.delete(k),
  };
  globalThis.fetch = fetch;
  globalThis.location = { hash: "#ruta" };
  globalThis.window = { addEventListener() {} };
  globalThis.document = {
    querySelector: (s) => (s === ".storage-warning" ? null : node(s)),
    querySelectorAll: () => [],
    createElement: () => node("created"),
    addEventListener() {},
  };
  const mod = await import(`../public/app.js?test=${Math.random()}`);
  return {
    node,
    mod,
    storage,
    read: () => JSON.parse(storage.get(key) ?? storage.get("tutorai.v1")),
    click(action) {
      node("#app").click({
        target: { closest: () => ({ dataset: { action }, disabled: false }) },
      });
    },
    // Las alternativas se mezclan en cada sesión: se busca su número en pantalla.
    optionNumber(text) {
      const shown = node("#app").innerHTML.match(/class="equation[^"]*">([^<]+)</)[1];
      const line = shown.split("\n").find((l) => l.slice(3) === escape(text));
      return line[0];
    },
    // Los repasos son generados: se lee la ecuación en pantalla y se resuelve.
    shownAnswer() {
      const expr = node("#app").innerHTML.match(/class="equation[^"]*">([^<]+)</)[1];
      return String(solveLinear(expr).answer);
    },
    answer(value, work = "") {
      node("#answer").value = value;
      node("#work").value = work;
      node("#answer-form").submit({ preventDefault() {} });
    },
  };
}
// La lección inicial va por pasos: avanza hasta que aparezca `pattern`.
function stepTo(h, pattern) {
  for (let i = 0; i < 5 && !pattern.test(h.node("#app").innerHTML); i++) h.click("intro-next");
  return h.node("#app").innerHTML;
}

test("guided completion persists work, unlocks next lesson, schedules review without mastery", async () => {
  const h = await harness();
  h.click("lesson:equations");
  h.click("begin-exercises");
  h.answer("0", "Resto cinco a ambos lados.");
  assert.match(h.node("#feedback").textContent, /Todavía/);
  h.click("hint");
  h.answer("7");
  h.click("next");
  h.answer("6");
  h.click("next");
  h.answer("6");
  h.click("next");
  h.answer("7");
  h.click("next");
  const s = h.read();
  assert.deepEqual(s.completed, ["equations"]);
  assert.deepEqual(s.mastered, []);
  assert.equal(s.notes.length, 1);
  assert.equal(s.reviews.length, 1);
  assert.ok(s.reviews[0].due > Date.now());
  h.click("lesson:signs");
  assert.match(h.node("#app").innerHTML, /Haz las paces/);
});
test("diagnostic skipping never unlocks unearned lessons", async () => {
  const h = await harness();
  h.click("diagnostic");
  assert.match(h.node("#app").innerHTML, /¿En qué curso estás\?/);
  h.click("diagnostic-grade:7b");
  for (let i = 0; i < 8; i++) h.click("skip");
  assert.equal(h.read().diagnosed, true);
  assert.deepEqual(h.read().completed, []);
});
test("custom task validates actual user equation without completing a lesson", async () => {
  const h = await harness();
  globalThis.location.hash = "#tarea";
  h.click("go:tarea");
  h.node("#equation").value = "2x + 3 = 15";
  h.node("#task-form").onsubmit({ preventDefault() {} });
  h.answer("6");
  h.click("next");
  assert.deepEqual(h.read().completed, []);
  assert.match(h.node("#app").innerHTML, /Tu ejercicio está resuelto/);
});
test("later independent review confirms mastery and moves next review forward", async () => {
  const now = Date.now();
  const h = await harness({
    version: 1,
    diagnosed: true,
    completed: ["equations"],
    mastered: [],
    notes: [],
    attempts: [{ lesson: "equations", at: now - 2 * 86400000, correct: true }],
    reviews: [{ lesson: "equations", due: now - 1000 }],
  });
  h.click("review:equations");
  h.answer(h.shownAnswer());
  h.click("next");
  assert.deepEqual(h.read().mastered, ["equations"]);
  assert.ok(h.read().reviews[0].due > now + 6 * 86400000);
});
test("same-day corrective practice does not certify mastery", async () => {
  const now = Date.now();
  const h = await harness({
    version: 1,
    diagnosed: true,
    completed: ["equations"],
    mastered: [],
    notes: [],
    attempts: [{ lesson: "equations", at: now, correct: false }],
    reviews: [{ lesson: "equations", due: now }],
  });
  h.click("review:equations");
  h.answer(h.shownAnswer());
  h.click("next");
  assert.deepEqual(h.read().mastered, []);
});

test("reading lessons can be practiced directly and save progress", async () => {
  const h = await harness();
  assert.match(h.node("#app").innerHTML, /data-action="lesson:lectura-narraciones" >Empezar/);
  h.click("lesson:lectura-narraciones");
  h.click("begin-exercises");
  assert.match(h.node("#app").innerHTML, /reading-passage/);
  assert.match(h.node("#app").innerHTML, /Alternativa: 1, 2 o 3/);
  const questions = lessonById("lectura-narraciones").questions;
  const right = h.optionNumber(correctText(questions[0]));
  h.answer(right === "1" ? "2" : "1");
  assert.match(h.node("#feedback").textContent, /Todavía/);
  for (const q of questions) {
    h.answer(h.optionNumber(correctText(q)));
    h.click("next");
  }
  assert.deepEqual(h.read().completed, ["lectura-narraciones"]);
  assert.equal(h.read().reviews[0].lesson, "lectura-narraciones");
});

test("subject and level filters isolate math and language lessons with badges", async () => {
  const h = await harness();
  assert.match(h.node("#app").innerHTML, /subject-math/);
  assert.match(h.node("#app").innerHTML, /subject-lang/);
  assert.match(h.node("#app").innerHTML, /data-action="subject:lenguaje"/);
  assert.match(h.node("#app").innerHTML, /data-action="subject:matematica"/);

  // Filter by language
  h.click("subject:lenguaje");
  assert.match(h.node("#app").innerHTML, /lectura-narraciones/);
  assert.doesNotMatch(h.node("#app").innerHTML, /data-action="lesson:equations"/);

  // Filter by math
  h.click("subject:matematica");
  assert.match(h.node("#app").innerHTML, /data-action="lesson:equations"/);
  assert.doesNotMatch(h.node("#app").innerHTML, /data-action="lesson:lectura-narraciones"/);
});

test("handwritten exercise solving UI renders and displays uploaded photos in notebook", async () => {
  const photoUrl = "data:image/jpeg;base64,/9j/handwritten-mock";
  const h = await harness({
    version: 1,
    diagnosed: true,
    completed: [],
    mastered: [],
    notes: [
      {
        title: "x + 5 = 12",
        text: "Desarrollo a mano en cuaderno",
        image: photoUrl,
        at: Date.now(),
      },
    ],
    attempts: [],
    reviews: [],
  });

  // Check initial lesson appears first
  h.click("lesson:equations");
  assert.match(h.node("#app").innerHTML, /LECCIÓN INICIAL/);
  assert.match(h.node("#app").innerHTML, /Principio de la Balanza/);

  // Begin exercises and check handwritten section
  h.click("begin-exercises");
  assert.match(h.node("#app").innerHTML, /Mostrar cómo lo resolví/);
  // La respuesta va antes que el desarrollo opcional, y las pistas junto a ella.
  const exercise = h.node("#app").innerHTML;
  assert.ok(exercise.indexOf('id="answer"') < exercise.indexOf("Mostrar cómo lo resolví"), "answer comes first");
  assert.ok(exercise.indexOf('id="hints"') < exercise.indexOf("<aside"), "hints sit next to the answer, not in the sidebar");
  assert.match(h.node("#app").innerHTML, /work-photo-input/);
  assert.match(h.node("#app").innerHTML, /Subir foto de tu desarrollo a mano/);

  // Check notebook renders the handwritten photo
  globalThis.location.hash = "#cuaderno";
  h.click("go:cuaderno");
  assert.match(h.node("#app").innerHTML, /Desarrollo a mano/);
  assert.match(h.node("#app").innerHTML, /note-image/);
  assert.match(h.node("#app").innerHTML, /Ver foto completa/);
  assert.match(h.node("#app").innerHTML, /Adjuntar foto de mi cuaderno/);

  // Check Trae tu ejercicio has photo option
  globalThis.location.hash = "#tarea";
  h.click("go:tarea");
  assert.match(h.node("#app").innerHTML, /task-photo-input/);
  assert.match(h.node("#app").innerHTML, /Subir foto de tu ejercicio en el cuaderno/);
});

test("initial lesson presents pedagogical concept and balance principle before exercises, and hints teach maintaining balance", async () => {
  const h = await harness();
  h.click("lesson:equations");

  // Step 1: Initial lesson renders before exercises
  assert.match(h.node("#app").innerHTML, /LECCIÓN INICIAL/);
  assert.match(h.node("#app").innerHTML, /El Principio de la Balanza en Equilibrio/);
  assert.match(h.node("#app").innerHTML, /mantener el equilibrio/i);
  assert.match(h.node("#app").innerHTML, /data-action="begin-exercises"/);

  // Step 2: Transition to exercises
  h.click("begin-exercises");
  assert.match(h.node("#app").innerHTML, /SI TE PIERDES/);
  assert.match(h.node("#app").innerHTML, /Mantener el equilibrio/);

  // Step 3: Pedagogical hints teach maintaining the balance
  h.click("hint");
  assert.match(h.node("#hints").innerHTML, /Mantén el equilibrio/);
  assert.match(h.node("#hints").innerHTML, /balanza/i);

  // Step 4: Can revisit the initial lesson during practice
  h.click("view-intro");
  assert.match(h.node("#app").innerHTML, /LECCIÓN INICIAL/);
  assert.match(h.node("#app").innerHTML, /data-action="return-exercise"/);
  h.click("return-exercise");
  assert.match(h.node("#app").innerHTML, /SI TE PIERDES/);
});

test("Duolingo-style learning path renders thematic units, winding path, stats bar and guidebook", async () => {
  const h = await harness({
    version: 1,
    diagnosed: true,
    completed: ["equations"],
    mastered: [],
    notes: [],
    attempts: [{ lesson: "equations", at: Date.now(), correct: true }],
    reviews: [],
  });

  const appHtml = h.node("#app").innerHTML;

  // 1. Stats bar with streak, XP, notebook and reviews
  assert.match(appHtml, /duo-stats-bar/);
  assert.match(appHtml, /duo-stat-chip/);
  assert.match(appHtml, /XP/);

  // 2. Thematic Units with banners
  assert.match(appHtml, /duo-unit/);
  assert.match(appHtml, /SECCIÓN 1/);
  assert.match(appHtml, /Álgebra y el Principio de la Balanza/);
  assert.match(appHtml, /Guía de unidad/);

  // 3. Serpentine winding path with 3D stepping stones
  assert.match(appHtml, /duo-winding-path/);
  assert.match(appHtml, /duo-stone/);
  assert.match(appHtml, /duo-stone-done/); // equations is completed
  assert.match(appHtml, /duo-bubble/); // next lesson has floating bubble
  assert.match(appHtml, /¡EMPEZAR!/);

  // 4. Opening unit guidebook displays pedagogical principles
  h.click("unit-guide:unit-math-1");
  const modalHtml = h.node("#unit-guide-content").innerHTML;
  assert.match(modalHtml, /Álgebra y el Principio de la Balanza/);
  assert.match(modalHtml, /Regla de oro de la balanza/);
  assert.match(modalHtml, /balanza nunca se desequilibra/);
});

test("Engagement mechanics: effort XP, reward tokens, streak shield, belts, triumphant closure and parent report", async () => {
  const now = Date.now();
  const dayMs = 86400000;

  const h = await harness({
    version: 1,
    diagnosed: true,
    completed: ["equations"],
    mastered: [],
    notes: [
      { title: "Nota 1", text: "Desarrollo", at: now },
      { title: "Nota 2", text: "Desarrollo 2", at: now },
    ],
    attempts: [
      { lesson: "equations", at: now, correct: true },
      { lesson: "signs", at: now - dayMs, correct: true },
      { lesson: "fractions", at: now - 3 * dayMs, correct: true }, // gap of 1 day at now - 2*dayMs covered by streak shield
    ],
    reviews: [],
  });

  // 1. Verify getXpAndFichas calculation:
  // 1 completed (20 XP) + 0 mastered + 3 correct attempts (30 XP) + 2 notes (30 XP) = 80 XP
  // fichas premian constancia: 1 lección terminada = 2; ningún día con 5 ejercicios.
  const xpInfo = h.mod.getXpAndFichas(h.read());
  assert.equal(xpInfo.totalXP, 80);
  assert.equal(xpInfo.fichas, 2);

  // When state reaches 100+ XP:
  const richState = {
    ...h.read(),
    completed: ["equations", "signs", "fractions"], // 60 XP
    mastered: ["equations"], // 25 XP
    attempts: [
      { lesson: "equations", at: now, correct: true },
      { lesson: "signs", at: now, correct: true },
      { lesson: "fractions", at: now, correct: true },
    ], // 30 XP
    notes: [{ title: "Nota", text: "Desarrollo", at: now }], // 15 XP
  };
  const richXp = h.mod.getXpAndFichas(richState);
  assert.equal(richXp.totalXP, 130);
  assert.equal(richXp.fichas, 6);

  // 2. Verify Belt system (getBeltInfo):
  // equations is mastered in richState -> Cinturón Oro
  const goldBelt = h.mod.getBeltInfo("equations", richState);
  assert.equal(goldBelt.level, "oro");
  assert.match(goldBelt.name, /Cinturón Oro/);
  assert.equal(goldBelt.icon, "👑");

  // signs is completed in richState -> Cinturón Plata
  const silverBelt = h.mod.getBeltInfo("signs", richState);
  assert.equal(silverBelt.level, "plata");
  assert.match(silverBelt.name, /Cinturón Plata/);
  assert.equal(silverBelt.icon, "🥈");

  // A lesson only with attempts -> Cinturón Bronce
  const bronzeState = { ...richState, completed: [], mastered: [] };
  const bronzeBelt = h.mod.getBeltInfo("signs", bronzeState);
  assert.equal(bronzeBelt.level, "bronce");
  assert.match(bronzeBelt.name, /Cinturón Bronce/);

  // A lesson unattempted -> Cinturón Blanco
  const whiteBelt = h.mod.getBeltInfo("unseen-lesson", bronzeState);
  assert.equal(whiteBelt.level, "blanco");
  assert.match(whiteBelt.name, /Cinturón Blanco/);

  // 3. Verify streak calculation with 1-day protector freeze:
  // Activity today (now), yesterday (now - 1 day), missed day 2, activity day 3
  const streakInfo = h.mod.getStreakInfo(h.read());
  assert.ok(streakInfo.streak >= 2);

  // 4. Verify Route UI. Por defecto, modo sencillo: sin XP, fichas ni cinturones.
  const simpleHtml = h.node("#app").innerHTML;
  assert.doesNotMatch(simpleHtml, /duo-chip-xp|belt-tag|PREMIOS EN CASA · FICHAS/);
  assert.match(simpleHtml, /data-action="toggle-rewards"/);
  h.click("toggle-rewards");
  const appHtml = h.node("#app").innerHTML;
  // Stats bar chips:
  // La barra superior solo muestra racha y XP; premios y papás van al costado.
  assert.doesNotMatch(appHtml, /duo-stat-chip duo-chip-rewards/);
  assert.doesNotMatch(appHtml, /duo-stat-chip duo-chip-parent/);
  assert.match(appHtml, /data-action="rewards-modal"/);
  assert.match(appHtml, /data-action="parent-report"/);

  // Sidebar cards:
  assert.match(appHtml, /duo-side-rewards/);
  assert.match(appHtml, /PREMIOS EN CASA · FICHAS/);
  assert.match(appHtml, /duo-side-parents/);
  assert.match(appHtml, /TRANQUILIDAD PARA PAPÁS/);

  // Belt tags rendered on lesson cards:
  assert.match(appHtml, /belt-tag/);

  // 5. Verify Parent Report modal:
  h.click("parent-report");
  const parentModalHtml = h.node("#parent-report-content").innerHTML;
  assert.match(parentModalHtml, /INFORME SEMANAL PARA PAPÁS/);
  assert.match(parentModalHtml, /Tiempo semanal invertido/);
  assert.match(parentModalHtml, /Desarrollos a mano en cuaderno/);
  assert.match(parentModalHtml, /Principio de la Balanza en Equilibrio/);
  assert.match(parentModalHtml, /Bases Curriculares del MINEDUC/);
  assert.match(parentModalHtml, /api\.whatsapp\.com/);
  assert.match(parentModalHtml, /Reporte%20de%20Progreso/);

  // 6. Verify Rewards modal:
  h.click("rewards-modal");
  const rewardsModalHtml = (h.node("#rewards-content") || h.node("#habitribu-content")).innerHTML;
  // Sin cuenta (demo): fichas ganadas, la regla y la invitación a crear cuenta.
  assert.match(rewardsModalHtml, /PREMIOS EN CASA/);
  assert.match(rewardsModalHtml, /fichas disponibles/);
  assert.match(rewardsModalHtml, /aciertes o no/);
  assert.match(rewardsModalHtml, /Con una cuenta, tu apoderado/);
  assert.doesNotMatch(rewardsModalHtml, /whatsapp|Papá/i, "no fixed catalog nor gendered claim message");

  // 7. Verify Triumphant session closure (finish):
  h.click("lesson:equations");
  h.click("begin-exercises");
  for (let i = 0; i < 4; i++) {
    h.answer(h.shownAnswer());
    h.click("next"); // the fourth triggers finish()
  }

  const finishHtml = h.node("#app").innerHTML;
  // Resumen simple: celebración, cuánto resolvió solo, XP y racha, y seguir.
  assert.match(finishHtml, /simple-summary/);
  assert.match(finishHtml, /🎉 ¡Lección terminada!/);
  assert.match(finishHtml, /Resolviste los 4 sin ayuda/);
  assert.match(finishHtml, /⭐ \+40 XP/);
  assert.match(finishHtml, /🔥 \d+ días? seguidos?/);
  assert.match(finishHtml, /data-action="lesson:enteros"[^>]*>Seguir: /, "one clear next step");
  assert.match(finishHtml, /Volver a mi ruta/);
  assert.doesNotMatch(finishHtml, /whatsapp|Cinturón|fichas|tutor pedagógico/i, "no extra systems at the end");
});



test("practicing a completed lesson again uses new generated exercises", async () => {
  const h = await harness({
    version: 1,
    diagnosed: true,
    completed: ["equations"],
    mastered: [],
    notes: [],
    attempts: [],
    reviews: [],
  });
  h.click("lesson:equations");
  assert.match(stepTo(h, /ejercicios nuevos/), /ejercicios nuevos/);
  h.click("begin-exercises");
  for (let i = 0; i < 4; i++) {
    h.answer(h.shownAnswer());
    h.click("next");
  }
  assert.deepEqual(h.read().completed, ["equations"]);
  assert.equal(h.read().attempts.filter((a) => a.correct).length, 4);
});

test("grade filters use lesson metadata, not titles", async () => {
  const h = await harness();
  assert.match(h.node("#app").innerHTML, /data-action="filter:5b">5° Básico \(2\)/);
  h.click("filter:1m");
  const html = h.node("#app").innerHTML;
  assert.match(html, /data-action="lesson:notables"/);
  assert.match(html, /data-action="lesson:lectura-critica-1m"/);
  assert.doesNotMatch(html, /data-action="lesson:equations"/);
  h.click("filter:7b");
  assert.match(h.node("#app").innerHTML, /data-action="lesson:equations"/);
});

const later = Date.now() + 86400000;
test("content manager is only reachable for admins", async () => {
  const student = await harness();
  globalThis.location.hash = "#contenido";
  student.click("go:contenido");
  assert.doesNotMatch(student.node("#app").innerHTML, /ESTUDIO DE CONTENIDO/);
  assert.equal(student.node('[data-nav="contenido"]').hidden, true);

  const admin = await harness(null, {
    key: "socatres.v1.a1",
    session: { mode: "account", userId: "a1", name: "Admin", role: "parent", isAdmin: true, expiresAt: later },
  });
  globalThis.location.hash = "#contenido";
  admin.click("go:contenido");
  assert.match(admin.node("#app").innerHTML, /ESTUDIO DE CONTENIDO/);
  assert.match(admin.node("#app").innerHTML, /Catálogo central/);
  assert.equal(admin.node('[data-nav="contenido"]').hidden, false);
});

test("demo users see why a family needs an account", async () => {
  const h = await harness();
  globalThis.location.hash = "#familia";
  h.click("go:familia");
  assert.match(h.node("#app").innerHTML, /Necesitas una cuenta/);
});

test("accounts merge server progress on load and upload it without photos", async () => {
  const calls = [];
  const remote = {
    version: 1, diagnosed: true, completed: ["signs"], mastered: [],
    attempts: [{ lesson: "signs", correct: true, hints: 0, at: 50 }],
    notes: [], reviews: [],
  };
  const fetch = async (path, init = {}) => {
    calls.push({ path, method: init.method, body: init.body && JSON.parse(init.body) });
    const body = init.method === "GET" ? { state: remote, updatedAt: 1 } : { updatedAt: 2 };
    return { ok: true, status: 200, json: async () => body };
  };
  const h = await harness(
    {
      version: 1, diagnosed: true, completed: ["equations"], mastered: [],
      attempts: [{ lesson: "equations", correct: true, hints: 0, at: 100 }],
      notes: [{ title: "Mi nota", text: "foto", at: 100, image: "data:image/jpeg;base64,AA" }],
      reviews: [],
    },
    {
      key: "socatres.v1.u1",
      session: { mode: "account", userId: "u1", name: "Ana", role: "student", expiresAt: later },
      fetch,
    },
  );
  await new Promise((r) => setTimeout(r, 20));
  assert.deepEqual(h.read().completed.sort(), ["equations", "signs"]);
  assert.equal("image" in h.read().notes[0], false, "progress is stored without photos");
  const photos = JSON.parse(h.storage.get("socatres.v1.u1.photos"));
  assert.equal(photos["100|Mi nota"], "data:image/jpeg;base64,AA", "photo kept locally, in its own key");
  const put = calls.find((c) => c.method === "PUT");
  assert.equal(put.path, "/api/progress");
  assert.deepEqual(put.body.state.completed.sort(), ["equations", "signs"]);
  assert.equal("image" in put.body.state.notes[0], false, "photo never uploaded");
  assert.equal(h.storage.has("socatres.v1"), false, "demo progress untouched");
  assert.match(h.node("#sync-status").textContent, /sincronizado/);
});

test("lesson videos stay offline until played, are recorded, and never help in the final challenge", async () => {
  const { seedCatalog } = await import("../public/content.js");
  const catalog = seedCatalog();
  // Sin video propio, se usa el de YouTube del catálogo (los propios tienen prioridad).
  const { lessonVideos } = await import("../public/lesson-videos.js");
  const own = lessonVideos.equations;
  delete lessonVideos.equations;
  catalog.lessons[0].video = { id: "dQw4w9WgXcQ", title: "La balanza en video", start: 30, end: 180 };
  const h = await harness(null, { catalog });
  if (own) lessonVideos.equations = own;
  assert.match(h.node("#app").innerHTML, /🎬 Video/);
  h.click("lesson:equations");
  let html = stepTo(h, /La balanza en video/);
  assert.match(html, /La balanza en video/);
  assert.doesNotMatch(html, /<iframe/, "nothing loads before ▶");
  h.click("play-video:equations");
  assert.match(h.node("#video-slot").innerHTML, /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
  assert.deepEqual(h.read().watched, ["equations"]);
  h.click("begin-exercises");
  h.click("hint");
  h.click("hint");
  assert.match(h.node("#hints").innerHTML, /video-facade/, "second hint offers the video");
  for (const answer of ["7", "6", "6"]) {
    h.answer(answer);
    h.click("next");
  }
  h.node("#hints").innerHTML = "";
  h.click("hint");
  h.click("hint");
  assert.doesNotMatch(h.node("#hints").innerHTML, /video-facade/, "no video in the autonomy challenge");
});

test("only the published subjects reach students", async () => {
  const h = await harness(null, { subjects: PUBLISHED_SUBJECTS });
  const html = h.node("#app").innerHTML;
  const shown = (l) => html.includes(`lesson:${l.id}"`);
  const hidden = catalogLessons.filter((l) => !PUBLISHED_SUBJECTS.includes(getSubject(l)));
  if (hidden.length) {
    assert.ok(!hidden.some(shown), "hidden subjects never appear in the route");
    assert.doesNotMatch(html, /data-action="subject:/, "no subject filter with a single subject");
  }
  assert.ok(catalogLessons.filter((l) => PUBLISHED_SUBJECTS.includes(getSubject(l))).every(shown));
  h.click("diagnostic");
  if (!PUBLISHED_SUBJECTS.includes("lenguaje"))
    assert.doesNotMatch(h.node("#app").innerHTML, /lectura/i, "the diagnostic only promises math");
});

const { lessonVideos } = await import("../public/lesson-videos.js");
test("lessons play their own animated video from our domain", { skip: !lessonVideos.equations && "sin videos subidos" }, async () => {
  const h = await harness();
  h.click("lesson:equations");
  const html = stepTo(h, /Video animado de socatres/);
  assert.match(html, /Video animado de socatres/);
  assert.doesNotMatch(html, /<video|youtube/i, "nothing loads before ▶");
  h.click("play-video:equations");
  assert.match(h.node("#video-slot").innerHTML, /<video src="\/media\/lessons\/equations-[0-9a-f]+\.mp4"/);
  assert.deepEqual(h.read().watched, ["equations"]);
});

test("diagnostic asks only the student's grade and stops a subject at its first stumble", async () => {
  const h = await harness();
  h.click("diagnostic");
  h.click("diagnostic-grade:7b");
  // Primero tres preguntas de base, después las del curso.
  const base = ["base-suma-resta", "base-multiplicar", "base-fracciones"].map(lessonById);
  const math = [
    ...base,
    ...catalogLessons.filter((l) => inferGrade(l) === "7b" && getSubject(l) === "matematica" && !l.id.startsWith("base-") && l.id !== "jerarquia-enteros").slice(0, 3),
  ];
  const reading = catalogLessons.filter((l) => inferGrade(l) === "7b" && getSubject(l) === "lenguaje").slice(0, 3);
  assert.match(h.node("#app").innerHTML, /PREGUNTA 1 · HASTA 9/);
  // Matemática: dos correctas y un tropiezo; la cuarta ya no se pregunta.
  h.answer(String(math[0].questions[1][1]));
  h.click("next");
  h.answer(String(math[1].questions[1][1]));
  h.click("next");
  h.click("skip");
  // Lectura: todo correcto.
  for (const l of reading) {
    assert.match(h.node("#app").innerHTML, /reading-passage/, "math stopped after the stumble");
    h.answer(h.optionNumber(correctText(l.questions[1])));
    h.click("next");
  }
  const s = h.read();
  assert.equal(s.grade, "7b");
  assert.equal(s.attempts.length, 5, "only 5 questions were needed");
  assert.deepEqual(s.completed, [math[0].id, math[1].id, ...reading.map((l) => l.id)]);
  assert.deepEqual(s.mastered, [], "the diagnostic never certifies mastery");
  assert.equal(s.focus, math[2].id, "remembers where to start, even below the student's grade");
  assert.match(h.node("#app").innerHTML, new RegExp(`empieza por «${math[2].title}»`));
  h.click("exit");
  const html = h.node("#app").innerHTML;
  assert.match(html, /data-action="filter:7b">/);
  assert.match(html, /class="filter-btn active" data-action="filter:7b"/, "route opens on the student's grade");
  assert.doesNotMatch(html, /data-action="lesson:signs"/);
});

test("the first lesson of each grade is open; later ones unlock within grade and subject", async () => {
  const h = await harness();
  h.click("filter:8b");
  const html = h.node("#app").innerHTML;
  assert.match(html, /data-action="lesson:signs" >Empezar/, "8° starts open without 7° lessons");
  assert.match(html, /data-action="lesson:both" disabled>Bloqueada/);
  h.click("lesson:both");
  assert.doesNotMatch(h.node("#app").innerHTML, /LECCIÓN INICIAL/, "locked lessons cannot be opened");
});

test("reading reviews need two correct answers with reshuffled alternatives", async () => {
  const now = Date.now();
  const h = await harness({
    version: 1, diagnosed: true, completed: ["lectura-narraciones"], mastered: [], notes: [],
    attempts: [{ lesson: "lectura-narraciones", at: now - 2 * 86400000, correct: true }],
    reviews: [{ lesson: "lectura-narraciones", due: now - 1000 }],
  });
  h.click("review:lectura-narraciones");
  assert.match(h.node("#app").innerHTML, /1 DE 2/);
  const l = lessonById("lectura-narraciones");
  h.answer(h.optionNumber(correctText(l.review)));
  h.click("next");
  assert.deepEqual(h.read().mastered, [], "one lucky answer is not enough");
  h.answer(h.optionNumber(correctText(l.questions[3])));
  h.click("next");
  assert.deepEqual(h.read().mastered, ["lectura-narraciones"]);
});

test("wrong answers explain the likely mistake", async () => {
  const h = await harness();
  h.click("lesson:equations");
  h.click("begin-exercises");
  h.answer("−7");
  assert.match(h.node("#feedback").textContent, /signo contrario/);
  h.answer("7");
  h.click("next");
  h.answer("54");
  assert.match(h.node("#feedback").textContent, /Multiplicaste por 3/);
});

test("daily practice mixes skills, can confirm mastery and tracks the daily goal", async () => {
  const now = Date.now();
  const h = await harness({
    version: 1, diagnosed: true, completed: ["equations"], mastered: [], notes: [],
    attempts: [{ lesson: "equations", correct: true, hints: 0, at: now - 2 * 86400000 }],
    reviews: [{ lesson: "equations", due: now - 1000 }],
  });
  let html = h.node("#app").innerHTML;
  assert.match(html, /TU META DE HOY/);
  assert.match(html, /aria-label="0 de 50 XP hoy"/);
  assert.match(html, /data-action="daily"/);
  h.click("goal:30");
  assert.equal(h.read().dailyGoal, 30);
  assert.match(h.node("#app").innerHTML, /aria-label="0 de 30 XP hoy"/);
  h.click("daily");
  assert.match(h.node("#app").innerHTML, /PRÁCTICA DEL DÍA/);
  assert.match(h.node("#app").innerHTML, /REPASO · 1 DE 3/);
  for (let i = 0; i < 3; i++) {
    h.answer(h.shownAnswer());
    h.click("next");
  }
  html = h.node("#app").innerHTML;
  assert.match(html, /Meta del día cumplida/);
  assert.match(html, /data-action="lesson:enteros"/, "offers the next lesson of the same grade");
  const s = h.read();
  assert.deepEqual(s.mastered, ["equations"], "the review inside daily practice confirms mastery");
  assert.ok(s.reviews.find((r) => r.lesson === "equations").due > now + 6 * 86400000);
  assert.deepEqual(s.completed, ["equations"], "daily practice never completes new lessons");
});

test("the published catalog reaches every student, including the demo", async () => {
  const published = seedCatalog();
  published.lessons[0].title = "Lección publicada por la administración";
  const fetch = async (path) => ({
    ok: true,
    status: 200,
    json: async () => (path === "/api/catalog" ? { catalog: published, updatedAt: 42 } : {}),
  });
  const h = await harness(null, { fetch });
  await new Promise((r) => setTimeout(r, 20));
  assert.match(h.node("#app").innerHTML, /Lección publicada por la administración/);
  assert.equal(h.storage.get("socatres.catalog.updatedAt"), "42");
});

test("the route unlocks in the order students see, with prerequisites and no relocking", async () => {
  const fresh = (completed = []) => ({ version: 1, diagnosed: true, completed, mastered: [], attempts: [], notes: [], reviews: [] });
  // Jerarquía con enteros necesita la suma y resta de enteros.
  let h = await harness(fresh());
  let html = h.node("#app").innerHTML;
  assert.match(html, /🔒 Se abre al completar «Suma y resta de enteros en Z»/);
  h.click("lesson:jerarquia-enteros");
  assert.match(h.node("#app").innerHTML, /<h2>Tu ruta<\/h2>/, "locked lessons don't open: the route stays");
  // En 1° Medio la ruta muestra Productos notables antes que Modelamiento: se
  // desbloquean en ese mismo orden (antes mandaba el orden del catálogo).
  h.click("filter:1m");
  html = h.node("#app").innerHTML;
  assert.match(html, /🔒 Se abre al completar «Productos notables y binomios»/);
  assert.doesNotMatch(html, /Se abre al completar «Modelamiento/);
  // Lo completado nunca vuelve a bloquearse, aunque falte la anterior.
  h = await harness(fresh(["enteros"]));
  html = h.node("#app").innerHTML;
  assert.doesNotMatch(html, /🔒 Se abre al completar «Suma y resta/);
  h.click("lesson:enteros");
  assert.match(h.node("#app").innerHTML, /Suma y resta de enteros/);
  h = await harness(fresh(["enteros"]));
  h.click("lesson:jerarquia-enteros");
  assert.match(h.node("#app").innerHTML, /Jerarquía con números enteros/, "opens once its prerequisite is done");
});

test("only equation lessons talk about the balance; others show their unit's rule", async () => {
  const h = await harness();
  h.click("lesson:jerarquia-mult");
  let html = h.node("#app").innerHTML;
  assert.match(html, /La idea clave/);
  assert.match(html, /Orden PAPOMUDAS/);
  assert.doesNotMatch(html, /Balanza|balanza|equilibrio/);
  h.click("begin-exercises");
  h.click("hint");
  assert.match(h.node("#hints").innerHTML, /PAPOMUDAS/);
  assert.doesNotMatch(h.node("#hints").innerHTML, /balanza/);
  const eq = await harness();
  eq.click("lesson:equations");
  assert.match(eq.node("#app").innerHTML, /El Principio de la Balanza en Equilibrio/);
});

test("a saved central catalog also receives lessons added to the app later", async () => {
  const { seedCatalog } = await import("../public/content.js");
  const old = seedCatalog();
  old.lessons = old.lessons.filter((l) => !l.id.startsWith("base-"));
  const h = await harness(null, { catalog: old });
  assert.match(h.node("#app").innerHTML, /data-action="lesson:base-suma-resta"/);
});

test("after two misses a stuck student can see the solution and move on", async () => {
  const h = await harness();
  h.click("lesson:equations");
  h.click("begin-exercises");
  h.answer("3");
  assert.doesNotMatch(h.node("#next-area").innerHTML, /Ver cómo se resuelve/, "not after a single miss");
  h.answer("4");
  assert.match(h.node("#next-area").innerHTML, /data-action="reveal"/);
  h.click("reveal");
  assert.match(h.node("#feedback").textContent, /Así se resuelve: .* La respuesta es 7\./);
  assert.match(h.node("#next-area").innerHTML, /Siguiente ejercicio/);
  h.click("next");
  assert.match(h.node("#app").innerHTML, /2 DE 4/);
  const s = h.read();
  assert.equal(s.attempts.filter((a) => !a.correct).length, 2);
  assert.ok(s.reviews.some((r) => r.lesson === "equations"), "it comes back in a review");
  assert.deepEqual(s.mastered, [], "seeing the solution never counts as mastery");
});

test("touch screens get a number keypad instead of the phone keyboard", async () => {
  globalThis.matchMedia = (q) => ({ matches: q === "(pointer: coarse)" });
  try {
    const h = await harness();
    h.click("lesson:base-suma-resta");
    h.click("begin-exercises");
    const html = h.node("#app").innerHTML;
    assert.match(html, /class="keypad"/);
    assert.match(html, /inputmode="none"/, "the system keyboard stays closed");
    for (const k of ["8", "5", "−", "borrar"]) h.click("key:" + k);
    assert.equal(h.node("#answer").value, "85");
    h.click("key:,");
    h.click("key:5");
    assert.equal(h.node("#answer").value, "85,5");
  } finally {
    delete globalThis.matchMedia;
  }
  const desktop = await harness();
  desktop.click("lesson:base-suma-resta");
  desktop.click("begin-exercises");
  assert.doesNotMatch(desktop.node("#app").innerHTML, /class="keypad"/, "computers keep the normal input");
});

test("a brand-new student starts with two easy wins, then is invited to the diagnostic", async () => {
  const h = await harness();
  let html = h.node("#app").innerHTML;
  assert.match(html, /Empecemos con algo fácil/);
  assert.doesNotMatch(html, /data-action="diagnostic"/, "no test before a first win");
  h.click("warmup");
  assert.match(h.node("#app").innerHTML, /CALENTAMIENTO · 1 DE 2/);
  h.answer("800");
  assert.match(h.node("#feedback").textContent, /sin ayuda/);
  h.click("next");
  h.answer("40");
  h.click("next");
  html = h.node("#app").innerHTML;
  assert.match(html, /¡Lo lograste! 🎉/);
  assert.match(html, /data-action="diagnostic"/);
  assert.match(html, /data-action="exit"/, "the diagnostic is optional");
  const s = h.read();
  assert.equal(s.attempts.filter((a) => a.correct).length, 2, "the first wins count as XP");
  assert.deepEqual(s.completed, [], "warming up doesn't complete lessons");
  assert.deepEqual(s.reviews, [], "nor schedules reviews");
  h.click("exit");
  assert.match(h.node("#app").innerHTML, /¿Por dónde te conviene seguir\?/, "next time, the diagnostic is the next step");
});

test("the initial lesson shows one idea per screen, with back, next and skip", async () => {
  const h = await harness();
  h.click("lesson:equations");
  let html = h.node("#app").innerHTML;
  assert.match(html, /1\. La idea/);
  assert.match(html, /pedagogical-banner/);
  assert.doesNotMatch(html, /intro-example-card/, "the example waits for its own screen");
  assert.match(html, /data-action="begin-exercises"/, "students who already know can skip");
  h.click("intro-next");
  html = h.node("#app").innerHTML;
  assert.doesNotMatch(html, /pedagogical-banner/);
  h.click("intro-prev");
  assert.match(h.node("#app").innerHTML, /pedagogical-banner/);
  html = stepTo(h, /handwritten-reminder-box/);
  assert.doesNotMatch(html, /data-action="intro-next"/, "the last step starts the exercises");
  assert.match(html, /Comenzar ejercicios/);
  h.click("begin-exercises");
  h.click("view-intro");
  html = h.node("#app").innerHTML;
  assert.match(html, /pedagogical-banner/);
  assert.match(html, /intro-example-card/, "reviewing from an exercise shows everything");
});

test("the demo warns when its session ends and offers to create an account", async () => {
  const later = Date.now() + 3 * 3600000;
  const h = await harness(null, { session: { mode: "demo", role: "student", name: "Estudiante demo", expiresAt: later } });
  const html = h.node("#app").innerHTML;
  assert.match(html, /Estás probando socatres sin cuenta/);
  assert.match(html, /conservas lo que ya practicaste/);
  assert.match(html, /data-action="demo-signup"/);
  const account = await harness(null, { session: { mode: "account", userId: "u1", name: "Ana", role: "student", expiresAt: later } });
  assert.doesNotMatch(account.node("#app").innerHTML, /sin cuenta/, "accounts see no demo notice");
});

// Simula sacar una foto con la cámara: compressImage usa FileReader, Image y canvas.
async function takePhoto(h, dataUrl = "data:image/jpeg;base64,/9j/servilleta") {
  globalThis.FileReader = class {
    readAsDataURL() {
      this.onload({ target: { result: "data:image/jpeg;base64,original" } });
    }
  };
  globalThis.Image = class {
    set src(_) {
      this.width = 1600;
      this.height = 1200;
      this.onload();
    }
  };
  Object.assign(h.node("created"), { getContext: () => ({ drawImage() {} }), toDataURL: () => dataUrl });
  await h.node("#work-photo-input").onchange({ target: { files: [{ type: "image/jpeg" }] } });
}

test("math exercises ask for a photo of the work on paper before checking", async () => {
  const h = await harness(undefined, { photoRequired: true });
  h.click("lesson:equations");
  h.click("begin-exercises");
  const screen = h.node("#app").innerHTML;
  assert.match(screen, /servilleta/);
  assert.match(screen, /Sacar foto de mi desarrollo/);
  assert.match(screen, /capture="environment"/, "opens the back camera on phones");
  assert.ok(screen.indexOf("work-photo-input") < screen.indexOf('id="answer"'), "the photo comes before the answer");

  h.answer("7");
  assert.match(h.node("#feedback").textContent, /sácale una foto/);
  const saved = h.storage.get("socatres.v1");
  assert.equal(saved ? JSON.parse(saved).attempts.length : 0, 0, "no attempt without the photo");

  await takePhoto(h);
  h.answer("7");
  assert.match(h.node("#feedback").textContent, /Lo resolviste/);
  const photos = Object.values(JSON.parse(h.storage.get("socatres.v1.photos")));
  assert.deepEqual(photos, ["data:image/jpeg;base64,/9j/servilleta"], "photo saved in the notebook, on this device");
  // Sin cuenta no se llama a la IA (cada revisión tiene costo).
  assert.match(h.node("#work-review").innerHTML, /Con una cuenta/);
});

test("with an account, Gemini reviews the photo and explains the step", async () => {
  const reviews = [];
  const fetch = async (path, init = {}) => {
    const body = init.body && JSON.parse(init.body);
    if (path === "/api/work/review") {
      reviews.push(body);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          review: {
            readable: true, showsWork: true, matchesExercise: true, workIsCorrect: false,
            errorStep: "x = 12 + 5", message: "En el segundo paso sumaste 5. Para dejar sola la x, resta 5 a ambos lados.",
          },
        }),
      };
    }
    return { ok: true, status: 200, json: async () => (init.method === "GET" ? { state: null, updatedAt: 0 } : { updatedAt: 1 }) };
  };
  const h = await harness(undefined, {
    photoRequired: true,
    key: "socatres.v1.u1",
    session: { mode: "account", userId: "u1", name: "Ana", role: "student", expiresAt: later },
    fetch,
  });
  await new Promise((r) => setTimeout(r, 20));
  h.click("lesson:equations");
  h.click("begin-exercises");
  await takePhoto(h);
  assert.match(h.node("#app").innerHTML + h.node("#work-photo-container").innerHTML, /El búho la revisará/);
  h.answer("17");
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].image, "data:image/jpeg;base64,/9j/servilleta");
  assert.equal(reviews[0].answer, "17");
  assert.equal(reviews[0].correct, false);
  assert.ok(reviews[0].problem.includes("x"), "sends the exercise shown");
  assert.match(h.node("#work-review").innerHTML, /resta 5 a ambos lados/);

  // Volver a comprobar con la misma foto no gasta otra revisión.
  h.answer("16");
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(reviews.length, 1);
});

test("lessons with a minigame add a play step that never blocks the lesson", async () => {
  const h = await harness();
  h.click("lesson:equations");
  assert.match(h.node("#app").innerHTML, /Juega<\/li>/, "the steps announce the game");
  const html = stepTo(h, /id="minigame"/);
  assert.match(html, /Cada bolsa esconde/);
  assert.match(html, /data-action="intro-next"/, "the game can be skipped");
  // x + 3 = 8: quitar 3 de cada lado deja la bolsa sola.
  for (let i = 0; i < 3; i++) h.click("game:take");
  assert.match(h.node("#minigame").innerHTML, /x = 5/);
  h.click("game:next");
  assert.match(h.node("#minigame").innerHTML, /2 de 3/);
  h.click("intro-next");
  assert.match(h.node("#app").innerHTML, /intro-example-card/, "the example follows the game");
  h.click("intro-prev");
  assert.match(h.node("#app").innerHTML, /2 de 3/, "coming back keeps the game where it was");

  h.click("exit");
  h.click("lesson:signs");
  h.click("exit");
  const reading = catalogLessons.find((l) => getSubject(l) === "lenguaje");
  const plain = await harness({ completed: catalogLessons.map((l) => l.id), attempts: [], reviews: [], notes: [], mastered: [], watched: [] });
  plain.click(`lesson:${reading.id}`);
  assert.match(plain.node("#app").innerHTML, /1\. La idea/);
  assert.doesNotMatch(plain.node("#app").innerHTML, /Juega<\/li>/, "lessons without a game keep their steps");
});

test("by default the photo is only required in the final challenge of a lesson", async () => {
  assert.equal((await import("../public/work-photo.js?default")).WORK_PHOTO.required, "challenge");
  const h = await harness(undefined, { photoRequired: "challenge" });
  h.click("lesson:equations");
  assert.match(stepTo(h, /handwritten-reminder-box/), /En el desafío final te pediremos una foto/);
  h.click("begin-exercises");
  for (let i = 0; i < 3; i++) {
    assert.doesNotMatch(h.node("#app").innerHTML, /work-photo-required/, `exercise ${i + 1} doesn't demand a photo`);
    h.answer(String(lessonById("equations").questions[i][1]));
    assert.match(h.node("#feedback").textContent, /Lo resolviste/);
    h.click("next");
  }
  assert.match(h.node("#app").innerHTML, /work-photo-required/, "the challenge asks for it");
  assert.match(h.node("#app").innerHTML, /sin tu cara ni tu nombre/, "and reminds to photograph only the sheet");
  h.answer(String(lessonById("equations").questions[3][1]));
  assert.match(h.node("#feedback").textContent, /sácale una foto/);
  await takePhoto(h);
  h.answer(String(lessonById("equations").questions[3][1]));
  assert.match(h.node("#feedback").textContent, /Lo resolviste/);
});

// Termina la lección de ecuaciones respondiendo bien los cuatro ejercicios.
function finishEquations(h) {
  h.click("lesson:equations");
  h.click("begin-exercises");
  for (const answer of ["7", "6", "6", "7"]) {
    h.answer(answer);
    h.click("next");
  }
}

test("before the video the owl asks about the logic behind the idea", async () => {
  const catalog = seedCatalog();
  catalog.lessons[0].video = { id: "dQw4w9WgXcQ", title: "La balanza en video", start: 0, end: 60 };
  const h = await harness(null, { catalog });
  h.click("lesson:equations");
  const html = stepTo(h, /lesson-hook/);
  assert.match(html, /¿Sabes la lógica que hay detrás de una ecuación\?<\/strong> ¡Enseguida te voy a mostrar!/);
  assert.ok(html.indexOf("lesson-hook") < html.indexOf("video-facade"), "the question comes before the animation");
});

test("after a lesson the student summarizes it and writes a question; without an account it stays in the notebook", async () => {
  const calls = [];
  const h = await harness(undefined, { fetch: async (path) => (calls.push(path), { ok: true, status: 200, json: async () => ({}) }) });
  finishEquations(h);
  assert.match(h.node("#app").innerHTML, /Cuéntalo con tus palabras/);
  assert.match(h.node("#app").innerHTML, /No escribas tu nombre/);
  h.click("starter:0");
  assert.equal(h.node("#reflection-summary").value, "Hoy aprendí que…");
  h.node("#reflection-summary").value = "Hoy aprendí que la ecuación es una balanza.";
  h.node("#reflection-question").value = "¿Sirve con fracciones?";
  await h.node("#reflection-form").onsubmit({ preventDefault() {} });
  const note = h.read().notes.find((n) => n.lesson === "equations");
  assert.equal(note.text, "Hoy aprendí que la ecuación es una balanza.");
  assert.equal(note.question, "¿Sirve con fracciones?");
  assert.match(note.title, /Mi resumen · Encuentra el valor de x/);
  assert.match(h.node("#reflection-reply").innerHTML, /Con una cuenta/);
  assert.ok(!calls.some((p) => String(p).includes("/api/coach")), "nothing is sent without an account");
  globalThis.location.hash = "#cuaderno";
  h.click("go:cuaderno");
  assert.match(h.node("#app").innerHTML, /Mi pregunta:<\/strong> ¿Sirve con fracciones\?/);
});

test("with an account the owl answers the summary and question, and both stay in the notebook", async () => {
  const sent = [];
  const fetch = async (path, init = {}) => {
    const body = init.body && JSON.parse(init.body);
    if (path === "/api/coach/reflection") {
      sent.push(body);
      return { ok: true, status: 200, json: async () => ({ reply: { message: "¡Entendiste la balanza!", answer: "Sí: primero multiplica para quitar la fracción." } }) };
    }
    if (path === "/api/coach/encouragement") return { ok: true, status: 200, json: async () => ({ message: "Vas muy bien." }) };
    return { ok: true, status: 200, json: async () => (init.method === "GET" ? { state: null, updatedAt: 0 } : { updatedAt: 1 }) };
  };
  const h = await harness(undefined, {
    key: "socatres.v1.u1",
    session: { mode: "account", userId: "u1", name: "Ana", role: "student", expiresAt: later },
    fetch,
  });
  await new Promise((r) => setTimeout(r, 20));
  finishEquations(h);
  assert.match(h.node("#app").innerHTML, /Guardar y preguntarle al búho/);
  h.node("#reflection-summary").value = "Lo mismo a los dos lados.";
  h.node("#reflection-question").value = "¿Sirve con fracciones?";
  await h.node("#reflection-form").onsubmit({ preventDefault() {} });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].lesson, "Encuentra el valor de x");
  assert.equal(sent[0].summary, "Lo mismo a los dos lados.");
  assert.equal(sent[0].question, "¿Sirve con fracciones?");
  assert.match(h.node("#reflection-reply").innerHTML, /¡Entendiste la balanza!/);
  assert.match(h.node("#reflection-reply").innerHTML, /Sobre tu pregunta:.*quitar la fracción/);
  const note = h.read().notes.find((n) => n.lesson === "equations");
  assert.equal(note.reply, "¡Entendiste la balanza!");
  assert.equal(note.answer, "Sí: primero multiplica para quitar la fracción.");
  globalThis.location.hash = "#cuaderno";
  h.click("go:cuaderno");
  assert.match(h.node("#app").innerHTML, /🦉 ¡Entendiste la balanza!/, "the owl's answer stays in the notebook");
});

test("the home page has the owl's encouragement: local without an account, from the AI once a day with one", async () => {
  const local = await harness({ version: 1, diagnosed: true, completed: ["equations"], mastered: [], attempts: [], notes: [], reviews: [] });
  assert.match(local.node("#app").innerHTML, /EL BÚHO TE DICE/);

  let asked = 0;
  const fetch = async (path, init = {}) => {
    if (path === "/api/coach/encouragement") {
      asked++;
      const body = JSON.parse(init.body);
      assert.equal(body.completed, 1);
      assert.ok(!("notes" in body), "only numbers and titles");
      return { ok: true, status: 200, json: async () => ({ message: "Llevas una lección: ¡sigue así!" }) };
    }
    return { ok: true, status: 200, json: async () => (init.method === "GET" ? { state: null, updatedAt: 0 } : { updatedAt: 1 }) };
  };
  const h = await harness(
    { version: 1, diagnosed: true, completed: ["equations"], mastered: [], attempts: [], notes: [{ title: "Mi nota", text: "secreto", at: 1 }], reviews: [] },
    { key: "socatres.v1.u1", session: { mode: "account", userId: "u1", name: "Ana", role: "student", expiresAt: later }, fetch },
  );
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(asked, 1);
  assert.equal(h.node("#coach-message").textContent, "Llevas una lección: ¡sigue así!");
  h.click("exit");
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(asked, 1, "one phrase per day");
  assert.match(h.node("#app").innerHTML, /Llevas una lección: ¡sigue así!/);
});
