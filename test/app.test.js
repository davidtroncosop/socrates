import test from "node:test";
import assert from "node:assert/strict";
import { solveLinear } from "../public/learning.js";
// Lightweight DOM adapter for exercising real app handlers; visual QA remains separate.
async function harness(saved, { session, key = "socatres.v1", fetch, catalog } = {}) {
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
  if (catalog) storage.set("socatres.content.v1", JSON.stringify(catalog));
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
  for (let i = 0; i < 26; i++) h.click("skip");
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
  h.answer("1");
  assert.match(h.node("#feedback").textContent, /Todavía/);
  for (const answer of ["2", "1", "3", "2"]) {
    h.answer(answer);
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
  assert.match(h.node("#app").innerHTML, /Resuelve a mano/);
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
  assert.match(h.node("#app").innerHTML, /ENFOQUE PEDAGÓGICO/);
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
  assert.match(h.node("#app").innerHTML, /ENFOQUE PEDAGÓGICO/);
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
  // fichas = Math.floor(80 / 100) = 0, xpToNextFicha = 20
  const xpInfo = h.mod.getXpAndFichas(h.read());
  assert.equal(xpInfo.totalXP, 80);
  assert.equal(xpInfo.fichas, 0);
  assert.equal(xpInfo.xpToNextFicha, 20);

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
  assert.equal(richXp.fichas, 1);
  assert.equal(richXp.xpToNextFicha, 70);

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

  // 4. Verify Route UI:
  const appHtml = h.node("#app").innerHTML;
  // Stats bar chips:
  assert.match(appHtml, /duo-stat-chip duo-chip-rewards/);
  assert.match(appHtml, /duo-stat-chip duo-chip-parent/);
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
  assert.match(rewardsModalHtml, /PREMIOS Y RECOMPENSAS FAMILIARES/);
  assert.match(rewardsModalHtml, /Tus Premios Familiares/);
  assert.match(rewardsModalHtml, /Fichas de premio/);
  assert.match(rewardsModalHtml, /videojuegos \/ pantalla/);
  assert.match(rewardsModalHtml, /Elegir la cena/);
  assert.match(rewardsModalHtml, /api\.whatsapp\.com/);
  assert.match(rewardsModalHtml, /Canje%20de%20Fichas/);

  // 7. Verify Triumphant session closure (finish):
  h.click("lesson:equations");
  h.click("begin-exercises");
  for (let i = 0; i < 4; i++) {
    h.answer(h.shownAnswer());
    h.click("next"); // the fourth triggers finish()
  }

  const finishHtml = h.node("#app").innerHTML;
  assert.match(finishHtml, /triumphant-summary/);
  assert.match(finishHtml, /MISIÓN CUMPLIDA/);
  assert.match(finishHtml, /t-card-streak/);
  assert.match(finishHtml, /t-card-xp/);
  assert.match(finishHtml, /t-card-habitribu/);
  assert.match(finishHtml, /pedagogical-coach-box/);
  assert.match(finishHtml, /Mensaje de tu tutor pedagógico/);
  assert.match(finishHtml, /balanza en equilibrio/);
  assert.match(finishHtml, /btn-whatsapp-hero/);
  assert.match(finishHtml, /Volver a mi ruta/);
  assert.match(finishHtml, /Ver mi cuaderno/);
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
  assert.match(h.node("#app").innerHTML, /ejercicios nuevos/);
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
  assert.match(h.node("#app").innerHTML, /data-action="filter:5b">5° Básico \(1\)/);
  h.click("filter:1m");
  const html = h.node("#app").innerHTML;
  assert.match(html, /data-action="lesson:notables"/);
  assert.match(html, /data-action="lesson:lectura-critica-1m"/);
  assert.doesNotMatch(html, /data-action="lesson:equations"/);
  h.click("filter:7b");
  assert.match(h.node("#app").innerHTML, /data-action="lesson:equations"/);
});

const later = Date.now() + 86400000;
test("content manager is only reachable for teachers", async () => {
  const student = await harness();
  globalThis.location.hash = "#contenido";
  student.click("go:contenido");
  assert.doesNotMatch(student.node("#app").innerHTML, /ESTUDIO DE CONTENIDO/);
  assert.equal(student.node('[data-nav="contenido"]').hidden, true);

  const teacher = await harness(null, {
    session: { mode: "demo", role: "teacher", name: "Profesor demo", expiresAt: later },
  });
  globalThis.location.hash = "#contenido";
  teacher.click("go:contenido");
  assert.match(teacher.node("#app").innerHTML, /ESTUDIO DE CONTENIDO/);
  assert.equal(teacher.node('[data-nav="contenido"]').hidden, false);
});

test("demo users see why classes need an account", async () => {
  const h = await harness();
  globalThis.location.hash = "#clase";
  h.click("go:clase");
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
  assert.equal(h.read().notes[0].image.startsWith("data:"), true, "photo kept locally");
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
  catalog.lessons[0].video = { id: "dQw4w9WgXcQ", title: "La balanza en video", start: 30, end: 180 };
  const h = await harness(null, { catalog });
  assert.match(h.node("#app").innerHTML, /🎬 Video/);
  h.click("lesson:equations");
  let html = h.node("#app").innerHTML;
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
