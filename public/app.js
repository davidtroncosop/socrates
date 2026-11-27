import { curriculumLessons } from "./curriculum.js";
const independentLessons = new Set(curriculumLessons.map((l) => l.id));
import {
  lessons as defaultLessons,
  answersQuestion,
  parseNumber,
  solveLinear,
  freshState,
  loadState,
  getSubject,
  compressImage,
  GRADES,
  inferGrade,
  displayTitle,
  mergeStates,
  withoutPhotos,
  shuffleAlternatives,
  forStudent,
  saveState,
  compactAttempts,
  photosKey,
} from "./learning.js";
import { readSession, endSession, progressKey } from "./auth.js";
import { api } from "./api.js";
import { renderFamilyPage } from "./family-view.js";
import { hydrateReminderCard } from "./notify.js";
import { readCatalog, seedCatalog, writeCatalog, withNewCurriculum } from "./content.js";
import { createAdmin } from "./admin.js";
import { freshQuestions, generateQuestions } from "./generators.js";
import { videoFacade, videoPlayer, withLessonVideos } from "./video.js";
import { ACTIVE_SUBJECTS } from "./subjects.js";
import { WORK_PHOTO } from "./work-photo.js";
import { autoRead, autoReadButton, setAutoRead, speak, speakButton, stopSpeaking } from "./speak.js";
import { track } from "./metrics.js";
import { hasGame, createGame, gameAction, gameView, enableDrag } from "./minigames.js";
import { diagnoseMistake } from "./mistakes.js";
import { hookFor, HOOK_PROMISE, localDay, localEncouragement, progressSummary, MAX_SUMMARY, MAX_QUESTION } from "./coach.js";
import {
  buildDailyPlan,
  canConfirm,
  xpToday,
  GOALS,
  DEFAULT_GOAL,
  XP_PER_CORRECT,
} from "./daily.js";
import {
  SHEET_SIZE,
  MAX_MICRO_LEVEL,
  unitLevel,
  lessonLevel,
  formatDuration,
  buildSheet,
  createSheetItems,
  gradeSheetRound,
  evaluateSheet,
  comfortableStart,
  pickDailySheet,
} from "./sheets.js";
import { $, escape, button, heading } from "./ui.js";
import { getUnitsForLessons, routeOrder, PREREQUISITES, UNIT_DEFINITIONS, ALL_GRADES_LESSONS } from "./units.js";
import { getStreakInfo, getXpAndFichas, getBeltInfo, FICHAS_RULE } from "./stats.js";
import { showUnitGuide, showParentReport, showRewardsModal } from "./dialogs.js";
export { UNIT_DEFINITIONS } from "./units.js";
export { getStreakInfo, getXpAndFichas, getBeltInfo } from "./stats.js";
let account = null;
try {
  account = readSession(localStorage);
} catch {}
// El mantenedor es de la administración; el servidor valida cada publicación.
const isAdmin = account?.mode === "account" && account.isAdmin === true;
const synced = account?.mode === "account";
const stateKey = progressKey(account);
const CATALOG_VERSION_KEY = "socatres.catalog.updatedAt";
let catalog,
  catalogWarning = "";
try {
  // Sin catálogo central (nunca se publicó uno), lo guardado es solo una copia
  // del contenido incluido en la app: se usa la versión actual, así las
  // mejoras de las lecciones llegan a todos.
  // Con catálogo central guardado, se le suman las lecciones nuevas de la app
  // que llegaron después de esa publicación (también sin conexión).
  const published = localStorage.getItem(CATALOG_VERSION_KEY);
  catalog = published ? withNewCurriculum(readCatalog(localStorage), published) : seedCatalog();
} catch {
  catalog = seedCatalog();
  catalogWarning =
    "No se pudo leer el catálogo guardado. Se muestra el contenido inicial; exporta un respaldo antes de guardar cambios.";
}
// Lecciones publicadas de las materias activas, con su video propio cuando lo
// tienen.
const publishedLessons = (c) =>
  withLessonVideos(
    c.lessons.filter((l) => l.status === "published" && ACTIVE_SUBJECTS.includes(getSubject(l))),
  );
// Con una sola materia no se muestran el filtro ni el progreso por materia.
const bothSubjects = ACTIVE_SUBJECTS.length > 1;
let lessons = publishedLessons(catalog);
function useCatalog(next, updatedAt) {
  try {
    catalog = writeCatalog(localStorage, next);
    localStorage.setItem(CATALOG_VERSION_KEY, String(updatedAt));
  } catch {
    catalog = next;
  }
  lessons = publishedLessons(catalog);
  updateBadge();
}
// El catálogo central llega a todos (también a la demo). Sin conexión o sin
// servidor se usa la última copia guardada o el contenido inicial.
async function refreshCatalog() {
  let latest;
  try {
    latest = await api.catalog();
  } catch {
    return;
  }
  let known = null;
  try {
    known = localStorage.getItem(CATALOG_VERSION_KEY);
  } catch {}
  if (!latest.catalog || String(latest.updatedAt) === known) return;
  try {
    useCatalog(withNewCurriculum(latest.catalog, latest.updatedAt), latest.updatedAt);
  } catch {
    return;
  }
  if (!session) navigate();
}
let admin;
function contentManager() {
  admin ??= createAdmin({
    app,
    getCatalog: () => catalog,
    warning: () => catalogWarning,
    // Publica para todos y guarda la copia local solo si el servidor aceptó.
    commit: async (next) => {
      const { catalog: published, updatedAt } = await api.publishCatalog(next);
      useCatalog(published, updatedAt);
      catalogWarning = "";
    },
  });
  admin.render();
}
// Las lecciones se desbloquean en el orden de la ruta, dentro de su curso y
// materia; la primera de cada curso queda abierta para que el diagnóstico
// pueda ubicar ahí. Las del currículo ampliado son libres, salvo que necesiten
// otra antes (PREREQUISITES). Lo ya completado nunca se bloquea.
function lockedBy(l) {
  if (state.completed.includes(l.id)) return null;
  const missing = (PREREQUISITES[l.id] ?? [])
    .map((id) => lessons.find((x) => x.id === id))
    .find((x) => x && !state.completed.includes(x.id));
  if (missing) return missing;
  if (independentLessons.has(l.id)) return null;
  const route = routeOrder(lessons);
  const prev = route
    .slice(0, route.findIndex((x) => x.id === l.id))
    .findLast(
      (x) =>
        !independentLessons.has(x.id) &&
        inferGrade(x) === inferGrade(l) &&
        getSubject(x) === getSubject(l),
    );
  return prev && !state.completed.includes(prev.id) ? prev : null;
}
const isLocked = (l) => Boolean(lockedBy(l));
// Modo sencillo por defecto: puntos, fichas y cinturones quedan ocultos para no
// distraer. El apoderado que los use en casa los muestra con un botón.
const REWARDS_KEY = "socatres.rewards";
const fullRewards = () => {
  try {
    return localStorage.getItem(REWARDS_KEY) === "full";
  } catch {
    return false;
  }
};
// Siguiente paso sugerido: primero el curso del estudiante.
function nextLesson() {
  const open = (l) => !state.completed.includes(l.id) && !isLocked(l);
  // Donde el diagnóstico sugirió empezar, mientras no esté completa.
  const focus = lessons.find((l) => l.id === state.focus && open(l));
  if (focus) return focus;
  const route = routeOrder(lessons);
  const last = lessons.find((l) => l.id === state.completed.at(-1));
  // Primero, seguir en la unidad que está haciendo, en el mismo curso: las
  // unidades mezclan cursos y no hay que retroceder sin motivo.
  const unit = last && getUnitsForLessons(lessons).find((u) => u.lessons.some((l) => l.id === last.id));
  const inUnit = unit?.lessons.find((l) => open(l) && inferGrade(l) === inferGrade(last));
  if (inUnit) return inUnit;
  // Sin diagnóstico, el curso de lo último que completó.
  const grade = state.grade ?? (last && inferGrade(last));
  return (
    (grade && route.find((l) => inferGrade(l) === grade && open(l))) ||
    route.find(open) ||
    route[0]
  );
}
// Lecciones que se resuelven con el principio de la balanza; las demás de
// matemática muestran la regla de su unidad.
const BALANCE_LESSONS = new Set(["equations", "both", "racionales", "combinadas", "problemas"]);
const unitRule = (l) =>
  UNIT_DEFINITIONS.find((u) => u.lessonIds.includes(l.id))?.rule ??
  "🧠 Paso a paso: escribe cada operación en una línea y revisa tu resultado al final.";
// Mezcla las alternativas de lectura en cada sesión.
const prepare = (questions) => questions.map((q) => shuffleAlternatives(q));
const activeReviews = () =>
  state.reviews.filter((r) => lessons.some((l) => l.id === r.lesson));
const activeCompleted = () =>
  state.completed.filter((id) => lessons.some((l) => l.id === id));
const activeMastered = () =>
  state.mastered.filter((id) => lessons.some((l) => l.id === id));
const app = $("#app");
let state;
try {
  state = loadState(localStorage, catalog.lessons, stateKey);
} catch {
  state = freshState();
}
let session = null,
  storageFailed = false,
  photosFailed = false,
  // La ruta se abre en el curso del estudiante; puede cambiarlo con el filtro.
  currentLevel = state.grade ?? "all",
  currentKumonLevel = "all",
  currentSubject = "all";
function save() {
  Object.assign(state, compactAttempts(state));
  try {
    if (!saveState(localStorage, stateKey, state)) photosFailed = true;
  } catch {
    storageFailed = true;
  }
  scheduleSync();
  updateBadge();
  if ((storageFailed || photosFailed) && !$(".storage-warning")) {
    const n = document.createElement("div");
    n.className = "storage-warning";
    n.textContent = storageFailed
      ? "El navegador no permite guardar. Tu progreso se conservará solo mientras esta página esté abierta."
      : "No queda espacio para más fotos en este dispositivo: las nuevas no se guardarán. Tu progreso sí se guarda.";
    $(".topbar").after(n);
  }
}
// Sincronización: el dispositivo es la fuente inmediata y el servidor se
// actualiza en segundo plano. Sin conexión se reintenta al volver.
let syncTimer;
function syncStatus(text) {
  const el = $("#sync-status");
  if (el) el.textContent = text;
}
function scheduleSync() {
  if (!synced) return;
  clearTimeout(syncTimer);
  syncStatus("Guardando…");
  syncTimer = setTimeout(pushProgress, 1500);
}
async function pushProgress() {
  clearTimeout(syncTimer);
  try {
    await api.putProgress(withoutPhotos(state));
    syncStatus("✓ Progreso sincronizado");
  } catch (err) {
    syncStatus(
      err.status === 401
        ? "Tu sesión terminó · vuelve a entrar para sincronizar"
        : err.status
          ? `No se pudo sincronizar: ${err.message}`
          : "Sin conexión · se sincronizará al volver",
    );
  }
}
async function pullProgress() {
  syncStatus("Sincronizando…");
  try {
    const { state: remote } = await api.getProgress();
    if (remote) {
      // loadState valida y limpia lo recibido igual que lo guardado localmente.
      const clean = loadState(
        { getItem: () => JSON.stringify(remote) },
        catalog.lessons,
      );
      state = compactAttempts(mergeStates(state, clean));
      try {
        saveState(localStorage, stateKey, state);
      } catch {}
      // No se interrumpe un ejercicio en curso.
      if (!session) navigate();
    }
    await pushProgress();
  } catch {
    syncStatus("Sin conexión · tu progreso se guarda en este dispositivo");
  }
}
function updateBadge() {
  $("#review-count").textContent = activeReviews().filter(
    (r) => r.due <= Date.now(),
  ).length;
}
function navigate() {
  stopSpeaking();
  session = null;
  let page = location.hash.slice(1) || "ruta";
  if (page === "contenido" && !isAdmin) page = "ruta";
  if (app.dataset) app.dataset.view = page;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const active = a.dataset.nav === page;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  (
    ({
      ruta: route,
      hoja: dailySheetEntry,
      repaso: reviews,
      cuaderno: notebook,
      tarea: task,
      familia: () => renderFamilyPage({ app, session: account, lessons }),
      contenido: contentManager,
    })[page] || route
  )();
  updateBadge();
}




function dailyHero(next) {
  const goal = dailyGoal();
  const today = xpToday(state);
  const pending = buildDailyPlan({ lessons, state }).length;
  const sheetPick = pickDailySheet({ lessons, state, next });
  const met = today >= goal;
  return `<section class="hero daily-hero">
    <span class="eyebrow">TU META DE HOY</span>
    <div class="goal-row">
      <div class="goal-ring${met ? " met" : ""}" style="--p:${Math.min(100, Math.round((today / goal) * 100))}" role="img" aria-label="${today} de ${goal} XP hoy">
        <strong>${met ? "🔥" : today}</strong><small>${met ? "¡Cumplida!" : `de ${goal} XP`}</small>
      </div>
      <div>
        <h2>${met ? "¡Meta cumplida! Puedes seguir si quieres." : "Práctica del día"}</h2>
        <p>${
          pending
            ? `${pending} ejercicios de unos minutos: lo que toca repasar, lo que más te cuesta y lo que no quieres olvidar.`
            : "Completa tu primera lección y desde mañana tendrás una práctica diaria a tu medida."
        }</p>
      </div>
    </div>
    ${
      sheetPick
        ? `<div class="kumon-daily-strip">
      <div>
        <span class="kumon-pill">${escape(sheetPick.level.label)} · Paso ${sheetPick.microLevel + 1}/${MAX_MICRO_LEVEL}</span>
        <strong>Hoja del día: ${escape(displayTitle(sheetPick.lesson))}</strong>
        <p class="muted">${SHEET_SIZE} ejercicios cortos (5–10 min), autocorrección hasta el 100 % y opción imprimible en papel.${sheetPick.comfortable ? " Punto de partida cómodo para entrar en ritmo." : ""}</p>
      </div>
      ${button("📄 Hacer hoja del día →", "sheet:" + sheetPick.lesson.id, "primary")}
    </div>`
        : ""
    }
    <div class="actions">
      ${pending ? button("Empezar práctica del día →", "daily", sheetPick ? "" : "primary") : ""}
      ${button(`Siguiente lección: ${escape(displayTitle(next))}`, "lesson:" + next.id, pending || sheetPick ? "" : "primary")}
    </div>
    <div class="goal-picker" role="group" aria-label="Meta diaria">
      <span class="muted">Meta diaria:</span>
      ${GOALS.map((g) =>
        `<button class="filter-btn ${g.xp === goal ? "active" : ""}" data-action="goal:${g.xp}" aria-pressed="${g.xp === goal}">${g.label} · ${g.minutes} min</button>`,
      ).join("")}
    </div>
  </section>`;
}
// La demo no tiene cuenta: avisa cuándo vence y cómo conservar lo practicado.
function demoNotice() {
  if (account?.mode !== "demo" || !Number.isFinite(account.expiresAt)) return "";
  const end = new Date(account.expiresAt);
  const hour = end.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  const when = end.toDateString() === new Date().toDateString() ? `hoy a las ${hour}` : `mañana a las ${hour}`;
  return `<section class="callout demo-notice" role="note"><strong>🕒 Estás probando socatres sin cuenta.</strong> La sesión termina ${when} y tu avance queda solo en este navegador. Si creas tu cuenta, conservas lo que ya practicaste (si tienes menos de 14 años, pídele a tu apoderado que la cree). ${button("Crear mi cuenta", "demo-signup", "secondary")}</section>`;
}
function route() {
  if (!lessons.length) {
    app.innerHTML =
      heading(
        "TU RUTA",
        "Todavía no hay lecciones publicadas.",
        isAdmin
          ? "Publica contenido desde el mantenedor para comenzar."
          : "Vuelve pronto: estamos preparando las lecciones.",
      ) + (isAdmin ? button("Administrar contenido", "go:contenido", "primary") : "");
    return;
  }
  const next = nextLesson();
  const countMath = lessons.filter((l) => getSubject(l) === "matematica").length;
  const countLang = lessons.filter((l) => getSubject(l) === "lenguaje").length;
  const gradeCount = (grade) =>
    lessons.filter((l) => inferGrade(l) === grade).length;

  const visibleLessons = lessons.filter((l) => {
    if (currentSubject !== "all" && getSubject(l) !== currentSubject)
      return false;
    if (currentKumonLevel !== "all" && lessonLevel(l.id).code !== currentKumonLevel)
      return false;
    return currentLevel === "all" || inferGrade(l) === currentLevel || ALL_GRADES_LESSONS.has(l.id);
  });

  const mathCompleted = activeCompleted().filter((id) => {
    const l = lessons.find((x) => x.id === id);
    return l && getSubject(l) === "matematica";
  }).length;
  const langCompleted = activeCompleted().filter((id) => {
    const l = lessons.find((x) => x.id === id);
    return l && getSubject(l) === "lenguaje";
  }).length;

  const streakInfo = getStreakInfo(state);
  const xpInfo = getXpAndFichas(state);
  const streakDays = streakInfo.streak;
  const xp = xpInfo.totalXP;
  const fichas = xpInfo.fichasHabitribu;
  const dueCount = activeReviews().filter((r) => r.due <= Date.now()).length;
  const notesCount = state.notes ? state.notes.length : 0;

  // Render Duolingo units & winding paths
  const S_OFFSETS = [0, -45, -75, -45, 0, 45, 75, 45];
  const activeUnits = getUnitsForLessons(visibleLessons).filter(
    (u) => u.lessons.length > 0,
  );

  let unitsHTML = "";
  if (activeUnits.length) {
    unitsHTML = activeUnits
      .map((unit) => {
        const unitCompleted = unit.lessons.filter((l) =>
          state.completed.includes(l.id),
        ).length;
        const unitTotal = unit.lessons.length;
        const unitPercent = Math.round((unitCompleted / unitTotal) * 100);

        const nodesHTML = unit.lessons
          .map((l, nodeIndex) => {
            const done = state.completed.includes(l.id);
            const mastered = state.mastered.includes(l.id);
            const blocker = lockedBy(l);
            const locked = Boolean(blocker);
            const isNext = next.id === l.id;
            const offset = S_OFFSETS[nodeIndex % S_OFFSETS.length];
            const belt = getBeltInfo(l.id, state);

            let stoneClass = "duo-stone-ready";
            let icon = "★";
            if (mastered) {
              stoneClass = "duo-stone-mastered";
              icon = "👑";
            } else if (done) {
              stoneClass = "duo-stone-done";
              icon = "✓";
            } else if (isNext) {
              stoneClass = "duo-stone-active";
              icon = "▶";
            } else if (locked) {
              stoneClass = "duo-stone-locked";
              icon = "🔒";
            }

            const sub = getSubject(l);
            const isLang = sub === "lenguaje";
            const lvl = lessonLevel(l.id);
            const sheetRec = state.sheets?.[l.id];
            const badge = `<span class="oa-badge">${escape(lvl.label)}</span>`;
            const sheetBadge = !isLang && sheetRec
              ? sheetRec.level >= MAX_MICRO_LEVEL
                ? `<span class="sheet-badge sheet-badge-done">📄 Fluidez 100 %</span>`
                : `<span class="sheet-badge">📄 Hoja ${sheetRec.level + 1}/${MAX_MICRO_LEVEL}</span>`
              : "";
            const subjectBadge = `<span class="subject-tag ${isLang ? "subject-lang" : "subject-math"}">${isLang ? "📖 Lenguaje" : "📐 Matemática"}</span>`;
            const beltBadge = fullRewards() ? `<span class="belt-tag ${belt.badgeClass}" title="${belt.desc}">${belt.icon} ${belt.name}</span>` : "";
            const statusText = mastered
              ? "Dominio confirmado en un repaso"
              : done
                ? "Completada · por consolidar"
                : locked
                  ? `🔒 Se abre al completar «${escape(displayTitle(blocker))}»`
                  : escape(forStudent(l.description));

            return `
              <div class="duo-node-wrapper" style="--x-offset: ${offset}px;">
                ${
                  isNext
                    ? `<div class="duo-bubble"><span>¡EMPEZAR!</span><div class="duo-bubble-arrow"></div></div>`
                    : ""
                }
                <div class="duo-node-row">
                  <button class="duo-stone ${stoneClass}" data-action="lesson:${l.id}" ${locked ? "disabled" : ""} aria-label="${escape(l.title)}">
                    <span class="duo-stone-icon">${icon}</span>
                  </button>
                  <div class="duo-node-card ${isLang ? "duo-card-lang" : "duo-card-math"} ${isNext ? "duo-card-current" : ""}">
                    <div class="duo-node-meta">
                      ${badge}
                      ${sheetBadge}
                      ${subjectBadge}
                      ${beltBadge}
                      ${l.video ? `<span class="video-tag" title="Incluye un video explicativo">🎬 Video</span>` : ""}
                    </div>
                    <h3 class="duo-node-title">${escape(displayTitle(l))}</h3>
                    <p class="duo-node-desc">${statusText}</p>
                    <div class="duo-node-actions">
                      <button class="duo-card-btn ${isNext ? "primary" : ""}" data-action="lesson:${l.id}" ${locked ? "disabled" : ""}>${locked ? "Bloqueada" : done ? "Practicar" : "Empezar →"}</button>
                      ${!locked && !isLang ? `<button class="duo-card-btn sheet-card-btn" data-action="sheet:${l.id}" title="Hoja de fluidez estilo Kumon (${SHEET_SIZE} ejercicios)">📄 Hoja (${SHEET_SIZE})</button>` : ""}
                    </div>
                  </div>
                </div>
                ${
                  nodeIndex < unit.lessons.length - 1
                    ? `<div class="duo-trail"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`
                    : ""
                }
              </div>`;
          })
          .join("");

        const uLevel = unitLevel(unit);
        return `
          <section class="duo-unit ${unit.theme}">
            <header class="duo-unit-banner">
              <div class="duo-banner-left">
                <span class="duo-banner-tag">${escape(uLevel.label.toUpperCase())} · SECCIÓN ${unit.unitNumber}</span>
                <h3 class="duo-banner-title">${escape(unit.title)}</h3>
                <p class="duo-banner-desc">${escape(unit.description)}</p>
              </div>
              <div class="duo-banner-right">
                <div class="duo-banner-progress">
                  <span class="duo-banner-badge">${unitCompleted} / ${unitTotal} lecciones</span>
                  <div class="bar mini-bar"><span style="width: ${unitPercent}%"></span></div>
                </div>
                <button class="duo-guide-btn" data-action="unit-guide:${unit.id}">📖 Guía de unidad</button>
              </div>
            </header>
            <div class="duo-winding-path">
              ${nodesHTML}
            </div>
          </section>`;
      })
      .join("");
  } else {
    unitsHTML = `<section class="card empty" style="text-align:center;padding:32px 20px;"><p class="muted">No hay lecciones para los filtros seleccionados.</p><button class="filter-btn" data-action="reset-filters" style="margin-top:10px;">Restablecer filtros</button></section>`;
  }

  app.innerHTML = `
    <div class="duo-stats-bar">
      <div class="duo-stats-left">
        <div class="duo-course-badge">
          <span class="duo-flag">${currentSubject === "lenguaje" ? "📖" : currentSubject === "matematica" || !bothSubjects ? "📐" : "✦"}</span>
          <strong>${currentSubject === "lenguaje" ? "Lenguaje y Comunicación" : currentSubject === "matematica" || !bothSubjects ? "Matemática" : "Rutas Mineduc"}</strong>
        </div>
      </div>
      <div class="duo-stats-right">
        <div class="duo-stat-chip" title="Racha de práctica diaria">
          <span class="duo-chip-icon">🔥</span>
          <span class="duo-chip-value">${streakDays}</span>
          <span class="duo-chip-label">día${streakDays !== 1 ? "s" : ""}</span>
          ${streakInfo.hasFreeze ? `<span class="duo-freeze-badge" title="Protector de racha activo">🛡️</span>` : ""}
        </div>
        ${fullRewards() ? `<div class="duo-stat-chip duo-chip-xp" title="Puntos de Experiencia ganados practicando">
          <span class="duo-chip-icon">⭐</span>
          <span class="duo-chip-value">${xp}</span>
          <span class="duo-chip-label">XP</span>
        </div>` : ""}
        ${dueCount > 0 ? `<button class="duo-stat-chip duo-chip-clickable duo-chip-alert" data-action="go:repaso" title="Repasos listos">
          <span class="duo-chip-icon">↺</span>
          <span class="duo-chip-value">${dueCount}</span>
          <span class="duo-chip-label">repaso${dueCount > 1 ? "s" : ""}</span>
        </button>` : ""}
      </div>
    </div>

    ${demoNotice()}
    <div class="dashboard">
      <div>
        ${coachCard()}
        ${
          state.diagnosed || state.completed.length
            ? dailyHero(next)
            : !state.attempts.length
              ? `<section class="hero">
          <span class="eyebrow">TU PRIMER PASO</span>
          <h2>Empecemos con algo fácil.</h2>
          <p>Dos preguntas cortas para entrar en calor. Sin notas y sin apuro.</p>
          <div class="hero-meta">
            <span>◷ 1 minuto</span>
            <span>◇ Sin calificación</span>
          </div>
          ${button("Empezar →", "warmup", "primary")}
        </section>`
              : `<section class="hero">
          <span class="eyebrow">ENCONTREMOS TU PUNTO DE PARTIDA</span>
          <h2>¿Por dónde te conviene seguir?</h2>
          <p>${DIAGNOSTIC_BASE.length + MAX_PER_SUBJECT * ACTIVE_SUBJECTS.length} preguntas cortas, primero de base y después de tu curso. No es una prueba: puedes saltar las que no sepas y pedir ayuda.</p>
          <div class="hero-meta">
            <span>◷ 5 minutos aprox.</span>
            <span>◇ Sin calificación</span>
          </div>
          ${button("Buscar mi punto de partida →", "diagnostic", "primary")}
        </section>`
        }

        <div class="section-title">
          <h2>Tu ruta</h2>
          <span class="muted">${activeCompleted().length} de ${lessons.length} lecciones</span>
        </div>

        <div class="route-filter-container">
          ${bothSubjects ? `<div class="route-filter-row">
            <span class="filter-label">Materia:</span>
            <div class="route-filters">
              <button class="filter-btn ${currentSubject === "all" ? "active" : ""}" data-action="subject:all">Todas (${lessons.length})</button>
              <button class="filter-btn subject-math-btn ${currentSubject === "matematica" ? "active" : ""}" data-action="subject:matematica">📐 Matemática (${countMath})</button>
              <button class="filter-btn subject-lang-btn ${currentSubject === "lenguaje" ? "active" : ""}" data-action="subject:lenguaje">📖 Lenguaje (${countLang})</button>
            </div>
          </div>` : ""}
          <div class="route-filter-row">
            <span class="filter-label">Nivel:</span>
            <div class="route-filters">
              <button class="filter-btn ${currentKumonLevel === "all" ? "active" : ""}" data-action="kumon-level:all">Todos</button>
              ${getUnitsForLessons(lessons)
                .filter((u) => u.lessons.length > 0 && (currentSubject === "all" || u.subject === currentSubject || u.subject === "all"))
                .map((u) => {
                  const lvl = unitLevel(u);
                  return `<button class="filter-btn ${currentKumonLevel === lvl.code ? "active" : ""}" data-action="kumon-level:${escape(lvl.code)}" title="${escape(u.title)}">${escape(lvl.label)}</button>`;
                })
                .join("")}
            </div>
          </div>
          <details class="grade-filter-details"${currentLevel !== "all" ? " open" : ""}>
            <summary class="grade-filter-summary">Referencia por curso escolar (opcional)</summary>
            <div class="route-filter-row">
              <span class="filter-label">Curso:</span>
              <div class="route-filters">
                <button class="filter-btn ${currentLevel === "all" ? "active" : ""}" data-action="filter:all">Todos</button>
                ${Object.entries(GRADES)
                  .filter(([grade]) => gradeCount(grade))
                  .map(
                    ([grade, label]) =>
                      `<button class="filter-btn ${currentLevel === grade ? "active" : ""}" data-action="filter:${grade}">${label} (${gradeCount(grade)})</button>`,
                  )
                  .join("")}
              </div>
            </div>
          </details>
        </div>

        <div class="duo-units-container">
          ${unitsHTML}
        </div>
      </div>

      <aside class="stack">
        <section class="card reminder-card">
          <div class="mini-label">RECORDATORIO DIARIO</div>
          <div id="reminder-body"><p class="muted">Cargando…</p></div>
        </section>
        <section class="card duo-side-progress">
          <div class="mini-label">ASÍ VAS AVANZANDO</div>
          <div class="stat">${activeCompleted().length}<span class="muted"> / ${lessons.length}</span></div>
          <p class="muted">Lecciones completadas</p>
          <div class="bar"><span style="width:${lessons.length ? (activeCompleted().length / lessons.length) * 100 : 0}%"></span></div>
${bothSubjects ? `<div class="subject-progress-grid">
            <div class="subject-progress-item math">
              <div class="subject-progress-header">
                <span>📐 Matemática</span>
                <strong>${mathCompleted} / ${countMath}</strong>
              </div>
              <div class="bar mini-bar"><span style="width:${countMath ? (mathCompleted / countMath) * 100 : 0}%"></span></div>
            </div>
            <div class="subject-progress-item lang">
              <div class="subject-progress-header">
                <span>📖 Lenguaje</span>
                <strong>${langCompleted} / ${countLang}</strong>
              </div>
              <div class="bar mini-bar"><span style="width:${countLang ? (langCompleted / countLang) * 100 : 0}%"></span></div>
            </div>
          </div>` : ""}
          <div class="duo-mastered-stat">
            <span class="crown-icon">👑</span>
            <span><strong>${activeMastered().length}</strong> habilidades con dominio confirmado</span>
          </div>
        </section>

        ${fullRewards() ? `<section class="card duo-side-rewards duo-side-habitribu">
          <div class="mini-label">PREMIOS EN CASA · FICHAS</div>
          <div class="ht-side-row">
            <span class="ht-side-coin">🪙</span>
            <div>
              <div class="stat ht-side-stat">${fichas} <span class="muted">fichas ganadas</span></div>
            </div>
          </div>
          <small class="muted" style="display:block;margin-top:6px;font-size:12px;">${escape(FICHAS_RULE)}</small>
          <button class="secondary ht-side-btn" data-action="rewards-modal" style="width:100%;margin-top:10px;">Ver premios en casa →</button>
          <button class="link-button" data-action="toggle-rewards" style="margin-top:8px;">Ocultar puntos y premios</button>
        </section>` : `<section class="card duo-side-rewards duo-side-simple">
          <div class="mini-label">PREMIOS EN CASA</div>
          <p class="muted">Los puntos, fichas y cinturones están ocultos para que te concentres en aprender.</p>
          <button class="secondary" data-action="rewards-modal" style="width:100%;">Ver premios en casa</button>
          <button class="link-button" data-action="toggle-rewards" style="margin-top:8px;">Mostrar puntos y premios</button>
        </section>`}

        <section class="card duo-side-parents">
          <div class="mini-label">TRANQUILIDAD PARA PAPÁS</div>
          <div class="parent-side-row">
            <span class="parent-side-icon">👨‍👩‍👦</span>
            <div>
              <strong>Informe de autonomía semanal</strong>
              <p class="muted">Mira cuánto practica sin supervisión ni peleas.</p>
            </div>
          </div>
          <button class="secondary" data-action="parent-report" style="width:100%;margin-top:10px;">Ver reporte para papás →</button>
        </section>

        <section class="card duo-side-quest">
          <div class="mini-label">MISIÓN DEL DÍA</div>
          <div class="duo-quest-row">
            <span class="quest-icon">✍️</span>
            <div>
              <strong>Resuelve a mano en tu cuaderno</strong>
              <p class="muted">Sube una foto de tu procedimiento para afianzar el aprendizaje.</p>
            </div>
          </div>
          <button class="secondary" data-action="go:cuaderno" style="width:100%;margin-top:10px;">Ver mi cuaderno (${notesCount}) →</button>
        </section>

        <section class="card">
          <div class="mini-icon">↺</div>
          <h3>Recordar también es aprender.</h3>
          <p class="muted">Tus repasos espaciados recuperan lo que necesitas practicar. Sin empezar de cero.</p>
          ${button("Ver mis repasos →", "go:repaso")}
        </section>

        <div class="callout">
          ✧ <strong>Aquí las pistas cuentan como ayuda, no como errores.</strong> El dominio se confirma cuando resuelves sin ellas en un repaso posterior.
        </div>
      </aside>
    </div>`;
  hydrateReminderCard($("#reminder-body"), account);
  hydrateCoach();
}

// Frase de ánimo del día: el búho mira el avance (solo números y títulos) y
// sugiere un paso pequeño. Se pide una vez al día; mientras tanto, o sin
// cuenta o sin conexión, se muestra una frase local.
const coachKey = `${stateKey}.coach`;
function coachSummary() {
  return progressSummary({
    state,
    lessons,
    streak: getStreakInfo(state).streak,
    dueReviews: activeReviews().filter((r) => r.due <= Date.now()).length,
    next: nextLesson(),
    title: displayTitle,
  });
}
function cachedCoach() {
  try {
    const c = JSON.parse(localStorage.getItem(coachKey));
    return c?.day === localDay() ? c : null;
  } catch {
    return null;
  }
}
function coachCard() {
  const message = cachedCoach()?.message || localEncouragement(coachSummary());
  return `<section class="coach-card" aria-labelledby="coach-title">
    <img class="coach-owl-img" src="buho-saluda.webp" alt="" width="78" height="96" />
    <div>
      <h2 id="coach-title" class="mini-label">EL BÚHO TE DICE</h2>
      <p id="coach-message">${escape(message)}</p>
      ${speakButton("coach", "Escuchar")}
    </div>
  </section>`;
}
let coachAsking = false;
async function hydrateCoach() {
  // Una sola petición al día, aunque falle: la frase local ya está en pantalla.
  if (!synced || coachAsking || cachedCoach() || globalThis.navigator?.onLine === false) return;
  coachAsking = true;
  const remember = (message) => {
    try {
      localStorage.setItem(coachKey, JSON.stringify({ day: localDay(), message }));
    } catch {}
  };
  try {
    const { message } = await api.encourage(coachSummary());
    remember(message);
    const el = $("#coach-message");
    if (el) el.textContent = message;
  } catch (err) {
    if (err.status !== 0) remember("");
  } finally {
    coachAsking = false;
  }
}
const phases = [
  "Calentamiento",
  "Práctica guiada",
  "Aplicación",
  "Desafío de autonomía",
];
const MAX_PER_SUBJECT = 3;
// El diagnóstico revisa primero la base: muchos vacíos vienen de cursos
// anteriores. Va de lo más simple a lo más difícil y se detiene al tropezar.
const DIAGNOSTIC_BASE = ["base-suma-resta", "base-multiplicar", "base-fracciones"];
function diagnosticPicker() {
  const grades = Object.entries(GRADES).filter(([g]) =>
    lessons.some((l) => inferGrade(l) === g),
  );
  app.innerHTML =
    button("← Volver a mi ruta", "exit", "back") +
    heading(
      "PUNTO DE PARTIDA",
      "¿En qué curso estás?",
      bothSubjects
        ? `Te haremos hasta ${MAX_PER_SUBJECT} preguntas de matemática y ${MAX_PER_SUBJECT} de lectura de tu curso. Cuando algo cueste, pasamos a la otra materia: no es una prueba.`
        : `Primero ${DIAGNOSTIC_BASE.length} preguntas de base y después hasta ${MAX_PER_SUBJECT} de tu curso. Cuando algo cueste, nos detenemos: no es una prueba.`,
    ) +
    `<section class="card"><div class="grade-picker">${grades
      .map(([g, label]) =>
        button(label, "diagnostic-grade:" + g, g === state.grade ? "primary" : ""),
      )
      .join("")}</div></section>`;
}
function startDiagnostic(grade) {
  if (!(grade in GRADES)) return;
  const plan = ACTIVE_SUBJECTS.flatMap((subject) => [
    ...DIAGNOSTIC_BASE.map((id) => lessons.find((l) => l.id === id && getSubject(l) === subject)).filter(Boolean),
    ...routeOrder(lessons)
      // Las lecciones que dependen de otra no ubican a nadie: se llega a ellas.
      .filter(
        (l) =>
          inferGrade(l) === grade &&
          getSubject(l) === subject &&
          !PREREQUISITES[l.id] &&
          !ALL_GRADES_LESSONS.has(l.id),
      )
      .slice(0, MAX_PER_SUBJECT),
  ]);
  if (!plan.length) return;
  session = {
    mode: "diagnostic",
    grade,
    plan,
    stopped: new Set(),
    lesson: plan[0],
    questions: prepare(plan.map((l) => l.questions[1])),
    index: 0,
    hints: 0,
    wrong: 0,
    results: [],
    answered: false,
    workPhoto: null,
    lastPhoto: null,
    lastWork: null,
  };
  renderExercise();
}
// Sesiones con varias lecciones (diagnóstico, práctica del día) llevan un plan.
const lessonAt = (s) => (s.plan ? s.plan[s.index] : s.lesson);
// Ejercicio 0–3 de una lección; 9 para repasos, práctica diaria y diagnóstico.
const metricStep = (s) => (s.mode === "lesson" ? s.index : 9);
const dailyGoal = () => state.dailyGoal ?? DEFAULT_GOAL;
function startDaily() {
  const items = buildDailyPlan({ lessons, state });
  if (!items.length) return;
  const plan = items.map((i) => i.lesson);
  session = {
    mode: "daily",
    plan,
    origins: items.map((i) => i.origin),
    // Se decide al inicio, antes de registrar los intentos de esta sesión.
    confirmable: new Set(plan.filter((l) => canConfirm(state, l.id)).map((l) => l.id)),
    lesson: plan[0],
    questions: prepare(items.map((i) => i.question)),
    index: 0,
    hints: 0,
    wrong: 0,
    results: [],
    answered: false,
    workPhoto: null,
    lastPhoto: null,
    lastWork: null,
  };
  renderExercise();
}
function start(id, mode = "lesson") {
  if (!lessons.length) return;
  const l = lessons.find((l) => l.id === id) || lessons[0];
  let questions = l.questions;
  // La primera vez se usan los ejercicios curados; al volver a practicar y en
  // los repasos se generan variantes nuevas cuando la lección lo permite.
  let generated = null;
  if (mode === "lesson" && state.completed.includes(l.id))
    generated = generateQuestions(l.id, [0, 1, 2, 3]);
  if (mode === "review") generated = generateQuestions(l.id, [3]);
  if (generated) questions = generated;
  // En lectura una sola pregunta de 3 alternativas se acierta al azar 1 de 3
  // veces: el repaso pide también el desafío final, con alternativas mezcladas.
  else if (mode === "review")
    questions =
      getSubject(l) === "lenguaje" ? [l.review, l.questions[3]] : [l.review];
  // Nada de ejercicios que la idea clave o el ejemplo ya resolvieron, ni
  // repetidos en la misma sesión.
  questions = prepare(freshQuestions(l, questions, mode === "review" ? [3, 3] : [0, 1, 2, 3]));
  session = {
    canConfirm:
      mode === "review" &&
      state.completed.includes(l.id) &&
      state.attempts
        .filter((a) => a.lesson === l.id)
        .every((a) => a.at <= Date.now() - 86400000),
    lesson: l,
    mode,
    questions,
    generated: Boolean(generated),
    index: 0,
    hints: 0,
    wrong: 0,
    results: [],
    answered: false,
    workPhoto: null,
    lastPhoto: null,
    lastWork: null,
    showingIntro: mode === "lesson",
  };
  if (mode === "lesson") {
    renderIntroLesson();
  } else {
    renderExercise();
  }
}

const STEP_NAMES = { idea: "La idea", video: "El video", game: "Juega", example: "Un ejemplo", practice: "A practicar" };
// El minijuego de la lección: se toca, se arrastra o se aprieta un botón.
function playGame(action) {
  const s = session,
    box = $("#minigame");
  if (!s?.game || !box) return;
  const wasDone = s.game.done;
  gameAction(s.game, action);
  box.innerHTML = gameView(s.game);
  if (s.game.done && !wasDone) track(s.lesson.id, 9, "game");
}
function renderIntroLesson(fromExercise = false) {
  const s = session,
    l = s.lesson;
  const isMath = getSubject(l) === "matematica";
  const grade = ALL_GRADES_LESSONS.has(l.id) ? "Base" : GRADES[inferGrade(l)];
  // Una idea por pantalla: la idea, el video, el ejemplo y a practicar. Al
  // volver desde un ejercicio para repasar, se muestra todo junto.
  const playable = hasGame(l.id);
  const steps = ["idea", ...(l.video ? ["video"] : []), ...(playable ? ["game"] : []), "example", "practice"];
  if (playable && !s.game) s.game = createGame(l.id);
  const stepped = !fromExercise;
  const step = stepped ? Math.min(s.introStep ?? 0, steps.length - 1) : 0;
  const show = (name) => !stepped || steps[step] === name;
  const stepTargets = { idea: "concept", video: "hook", game: "game", example: "example", practice: "practice" };
  s.introSpeakTarget = stepped ? stepTargets[steps[step]] : "concept";
  const readNow = stepped && autoRead() ? { idea: "concept", video: "hook", example: "example", practice: "practice" }[steps[step]] : null;

  app.innerHTML = `
    ${button(
      fromExercise
        ? s.mode === "sheet"
          ? "← Volver a mi hoja"
          : "← Volver al ejercicio"
        : "← Volver a mi ruta",
      fromExercise ? "return-exercise" : "exit",
      "back",
    )}
    ${heading(
      "LECCIÓN INICIAL · CONCEPTO CLAVE",
      l.title,
      forStudent(l.description),
    )}
    <div class="intro-lesson-layout">
      <article class="card intro-lesson-main">
        <div class="intro-lesson-header">
          <div class="intro-badge-row">
            ${grade ? `<span class="oa-badge">${escape(grade)}</span>` : ""}
            <span class="subject-tag ${isMath ? "subject-math" : "subject-lang"}">
              ${isMath ? "📐 Matemática" : "📖 Lenguaje"}
            </span>
            <span class="intro-phase-badge">📖 Antes de practicar</span>
          </div>
          <h2>El concepto que necesitas comprender</h2>
        </div>

        ${
          stepped
            ? `<ol class="intro-steps" aria-label="Paso ${step + 1} de ${steps.length}">${steps
                .map((st, i) => `<li class="${i === step ? "current" : i < step ? "done" : ""}">${i + 1}. ${STEP_NAMES[st]}</li>`)
                .join("")}</ol>`
            : ""
        }
        ${show("idea") ? `
        <div class="pedagogical-banner ${isMath ? "math-balance" : "lang-strategy"}">
          <div class="pedagogical-banner-icon">${BALANCE_LESSONS.has(l.id) ? "⚖️" : isMath ? "🧠" : "💡"}</div>
          <div class="pedagogical-banner-body">
            <h3>${BALANCE_LESSONS.has(l.id) ? "El Principio de la Balanza en Equilibrio" : isMath ? "La idea clave" : "Estrategia de Comprensión Lectora"}</h3>
            <p class="pedagogical-banner-text">${escape(forStudent(l.concept))}</p>
            ${speakButton("concept", "Escuchar la explicación")} ${autoReadButton()}
            ${
              BALANCE_LESSONS.has(l.id)
                ? `<div class="balance-rule-highlight">
                    <strong>⚖️ Regla de oro del equilibrio:</strong>
                    <span>Una ecuación es una balanza. Cualquier operación que apliques al lado izquierdo, debes aplicarla <em>exactamente igual al lado derecho</em> para mantener el equilibrio y no alterar la igualdad.</span>
                  </div>`
                : isMath
                  ? `<div class="balance-rule-highlight">
                    <strong>Regla de la unidad:</strong>
                    <span>${escape(unitRule(l))}</span>
                  </div>`
                  : `<div class="balance-rule-highlight">
                    <strong>🎯 Clave de comprensión:</strong>
                    <span>Lee con calma, identifica las pistas explícitas e implícitas en el texto y fundamenta tu respuesta antes de elegir una opción.</span>
                  </div>`
            }
          </div>
        </div>

        ` : ""}
        ${show("video") ? `
        ${
          l.video
            ? `<section class="intro-video" aria-label="Video explicativo"><div class="lesson-hook" role="note"><img class="lesson-hook-owl" src="buho-duda.webp" alt="" width="76" height="69" /><p class="lesson-hook-text"><strong>${escape(hookFor(l, displayTitle(l)))}</strong> ${HOOK_PROMISE}</p>${speakButton("hook", "Escuchar")}</div>${videoFacade(l.video, l.id)}</section>`
            : ""
        }

        ` : ""}
        ${stepped && playable && show("game") ? `<section class="minigame" id="minigame" aria-label="Juego de la lección">${gameView(s.game)}</section>${speakButton("game", "Escuchar qué hay que hacer")}

        ` : ""}
        ${show("example") ? `
        <div class="intro-example-card">
          <div class="intro-example-header">
            <span class="example-pill">Ejemplo modelo guiado</span>
            <h3>¿Cómo se resuelve paso a paso?</h3>
          </div>
          <div class="intro-example-content">
            <p class="intro-example-text">${escape(l.examples)}</p>
            ${speakButton("example", "Escuchar el ejemplo")}
            ${
              BALANCE_LESSONS.has(l.id)
                ? `<div class="intro-balance-demo">
                    <span class="demo-box">Lado izquierdo (=)</span>
                    <span class="demo-scale">⚖️ Balanza en equilibrio</span>
                    <span class="demo-box">Lado derecho</span>
                  </div>`
                : ""
            }
          </div>
        </div>

        ` : ""}
        ${show("practice") ? `
        <div class="handwritten-reminder-box">
          <img class="owl-inline-sm" src="buho-lee.webp" alt="" width="62" height="64" />
          <div>
            <strong>¡Ten listo tu cuaderno y lápiz!</strong>
            <p>Ten papel y lápiz a mano. ${isMath && WORK_PHOTO.required === "challenge" ? "En el desafío final te pediremos una foto de tu desarrollo; en los demás es opcional." : "Podrás tomar una foto de tu desarrollo para guardarla en tu cuaderno."}${s.generated ? " Esta vez son ejercicios nuevos, distintos de los que ya resolviste." : ""}</p>
          </div>
        </div>

        ` : ""}
        <div class="intro-lesson-actions">
          ${
            stepped && step > 0 ? button("← Anterior", "intro-prev") : ""
          }
          ${
            stepped && step < steps.length - 1
              ? button("Siguiente →", "intro-next", "primary btn-start-exercises") + button("Saltar a los ejercicios", "begin-exercises")
              : button(
                  fromExercise
                    ? s.mode === "sheet"
                      ? "Volver a mi hoja →"
                      : `Continuar con el ejercicio (${s.index + 1} de ${s.questions.length}) →`
                    : `Comenzar ejercicios (1 de ${s.questions.length}) →`,
                  fromExercise ? "return-exercise" : "begin-exercises",
                  "primary btn-start-exercises",
                )
          }
          ${fromExercise ? "" : button("Volver a mi ruta", "exit")}
        </div>
      </article>

      <aside class="stack">
        <section class="card intro-summary-card">
          <div class="mini-label">TU SESIÓN DE APRENDIZAJE</div>
          <h3>4 fases de práctica</h3>
          <ol class="intro-phases-list">
            <li><span class="phase-num">1</span> <div><strong>Calentamiento</strong><small>Un primer paso guiado</small></div></li>
            <li><span class="phase-num">2</span> <div><strong>Práctica guiada</strong><small>Con pistas escalonadas</small></div></li>
            <li><span class="phase-num">3</span> <div><strong>Aplicación</strong><small>Consolida lo aprendido</small></div></li>
            <li><span class="phase-num">4</span> <div><strong>Desafío de autonomía</strong><small>Ponte a prueba por tu cuenta</small></div></li>
          </ol>
          <div class="intro-help-promise">
            <span>✧</span> ${BALANCE_LESSONS.has(l.id) ? "Las pistas explican el porqué pedagógico y te enseñan a mantener el equilibrio." : "Las pistas explican el porqué y te guían paso a paso."}
          </div>
        </section>
      </aside>
    </div>
  `;
  if (readNow) speakTarget(readNow);
}

function attachPhotoListeners() {
  const photoInput = $("#work-photo-input");
  if (photoInput) {
    photoInput.onchange = async (e) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const compressed = await compressImage(file);
      if (compressed && session) {
        session.workPhoto = compressed;
        updatePhotoContainer();
      }
    };
  }
  const dropzone = $("#photo-dropzone");
  if (dropzone) {
    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.classList?.add("dragover");
    };
    dropzone.ondragleave = () => {
      dropzone.classList?.remove("dragover");
    };
    dropzone.ondrop = async (e) => {
      e.preventDefault();
      dropzone.classList?.remove("dragover");
      const file = e.dataTransfer?.files?.[0];
      if (!file || !file.type?.startsWith("image/")) return;
      const compressed = await compressImage(file);
      if (compressed && session) {
        session.workPhoto = compressed;
        updatePhotoContainer();
      }
    };
  }
}

// En matemática la foto del desarrollo se exige según work-photo.js: siempre,
// solo en el desafío final de cada lección o nunca.
const isMathExercise = (s) => getSubject(lessonAt(s)) === "matematica";
const photoRequired = (s) =>
  isMathExercise(s) &&
  (WORK_PHOTO.required === true ||
    (WORK_PHOTO.required === "challenge" && s.mode === "lesson" && s.index === s.questions.length - 1));
function photoBox(s) {
  const required = photoRequired(s);
  if (s.workPhoto)
    return `<div class="work-photo-preview"><div class="work-photo-thumb-wrap"><img src="${escape(s.workPhoto)}" alt="Foto de tu desarrollo a mano" class="work-photo-thumb" /></div><div class="work-photo-details"><span class="photo-badge-success">✓ Foto de tu desarrollo lista</span><p class="muted" style="margin:4px 0 8px 0; font-size:12px;">${
      synced && isMathExercise(s) ? "El búho la revisará al comprobar." : "Se guardará en tu cuaderno al comprobar."
    }</p><button type="button" data-action="remove-photo" class="btn-remove-photo">✕ Cambiar foto</button></div></div>`;
  return `<label for="work-photo-input" class="photo-upload-box" id="photo-dropzone"><span class="photo-icon">📷</span><div class="photo-upload-text"><strong>${
    required ? "Sacar foto de mi desarrollo" : "Subir foto de tu desarrollo a mano"
  }</strong><span>${required ? "Se abre la cámara. Que se vean todos tus pasos. Solo la hoja: sin tu cara ni tu nombre." : "Solo la hoja: que no salgan tu cara ni tu nombre."}</span></div><span class="photo-tag-pill">${
    required ? "Sacar foto" : "Sube tu foto"
  }</span></label><input type="file" id="work-photo-input" accept="image/*" capture="environment" class="visually-hidden">`;
}
function updatePhotoContainer() {
  const container = $("#work-photo-container");
  if (!container || !session) return;
  container.innerHTML = photoBox(session);
  if (!session.workPhoto) attachPhotoListeners();
}

function renderExercise() {
  const s = session,
    q = s.questions[s.index],
    l = lessonAt(s),
    isMath = getSubject(l) === "matematica",
    needsPhoto = photoRequired(s);
  app.innerHTML = `${button("← Volver a mi ruta", "exit", "back")}${heading(
    s.mode === "warmup"
      ? "TU PRIMER PASO"
      : s.mode === "diagnostic"
      ? "PUNTO DE PARTIDA"
      : s.mode === "daily"
        ? "PRÁCTICA DEL DÍA"
        : s.mode === "review"
        ? "REPASO ESPACIADO"
        : "TU SESIÓN DE HOY",
    s.mode === "warmup"
      ? "Para entrar en calor"
      : s.mode === "diagnostic"
      ? "Veamos desde dónde partimos."
      : s.mode === "daily"
        ? displayTitle(l)
        : s.lesson.title,
    s.mode === "diagnostic"
      ? "Prueba lo que sabes. Si aún no lo ves, puedes continuar sin responder."
      : "Tómate tu tiempo.",
  )}<div class="lesson-layout"><section class="card exercise-card"><div class="mini-label">${
    s.mode === "lesson"
      ? phases[s.index]
      : s.mode === "warmup"
        ? "CALENTAMIENTO"
      : s.mode === "review"
        ? "RECUPERA LO APRENDIDO"
        : s.mode === "daily"
          ? { review: "REPASO", weak: "LO QUE MÁS CUESTA", recall: "PARA NO OLVIDAR" }[s.origins[s.index]]
          : "EXPLORACIÓN"
  } · ${s.mode === "diagnostic" ? `PREGUNTA ${s.results.length + 1} · HASTA ${s.questions.length}` : `${s.index + 1} DE ${s.questions.length}`}</div><div class="steps">${s.questions
    .map((_, i) => `<span class="${i <= s.index ? "on" : ""}"></span>`)
    .join("")}</div><div class="statement-row"><p class="exercise-statement">${escape(q[2])}</p>${speakButton("question")}${autoReadButton()}</div><div class="equation ${
    q[0].includes("\n") ? "reading-passage" : ""
  }">${escape(q[0])}</div><form id="answer-form">${
    needsPhoto
      ? `<div class="work-photo-required"><p class="work-photo-step"><span class="step-num">1</span> Resuélvelo en una servilleta o en tu cuaderno y sácale una foto.</p><div id="work-photo-container" class="work-photo-container">${photoBox(s)}</div><p class="work-photo-step"><span class="step-num">2</span> Escribe tu respuesta.</p></div>`
      : ""
  }<div class="answer-section"><label for="answer">${
    q[0] === "5x − 2x" ? "Coeficiente" : "Tu respuesta"
  }</label><input id="answer" autocomplete="off" placeholder="${
    q[0].includes("\n") ? "Alternativa: 1, 2 o 3" : touchKeypad() ? "Toca los números de abajo" : "Ej.: 7, x = 7 o 14/2"
  }" required${touchKeypad() ? ' inputmode="none"' : ""}>${keypad(q)}</div><div id="feedback" aria-live="polite" class="feedback"></div><div id="work-review" aria-live="polite" class="work-review" hidden></div><div class="actions"><button class="primary" id="check" type="submit">Comprobar respuesta →</button><button type="button" data-action="hint" id="hint-button">Necesito una pista</button>${
    s.mode === "diagnostic"
      ? '<button type="button" data-action="skip">Todavía no lo sé</button>'
      : ""
  }</div><div id="hints" class="hints-inline" aria-live="polite"></div></form><div id="next-area"></div><details class="handwritten-section"${!needsPhoto && (s.workPhoto || s.lastWork) ? " open" : ""}><summary class="handwritten-toggle">✍️ ${
    needsPhoto ? "Escribir también mis pasos" : "Mostrar cómo lo resolví"
  } <span class="muted">(opcional)</span></summary>${
    needsPhoto
      ? ""
      : `<p class="handwritten-instruction">Si lo hiciste en tu cuaderno, sácale una foto o escribe tus pasos. Queda guardado en Mi cuaderno.</p><div id="work-photo-container" class="work-photo-container">${photoBox(s)}</div>`
  }<details class="work-text-details"${s.lastWork ? " open" : ""}><summary class="work-text-toggle">O escribe tus pasos en texto (opcional)</summary><div style="margin-top:8px;"><label for="work" class="visually-hidden">Tu procedimiento</label><textarea id="work" placeholder="¿Qué harías primero? Escribe tus pasos aquí…">${escape(s.lastWork || "")}</textarea></div></details><div class="muted note-save-expl">Tu desarrollo y foto se guardan automáticamente en tu cuaderno al comprobar.</div></details></section><aside class="stack"><section class="card pedagogical-aside-card"><div class="mini-label">💡 SI TE PIERDES</div><h3>${
    BALANCE_LESSONS.has(l.id) ? "⚖️ Mantener el equilibrio" : isMath ? "💡 Idea clave" : "📖 Estrategia clave"
  }</h3><p class="muted" style="line-height:1.55;margin:8px 0 10px 0;">${escape(
    forStudent(l.concept),
  )}</p><button type="button" class="btn-link-help" data-action="view-intro">📖 Volver a ver la explicación</button></section><section class="callout">${
    s.mode === "diagnostic"
      ? "Esto no es una prueba: solo busca dónde te conviene empezar."
      : "Primero entiende. Después intenta hacerlo sin ayuda."
  }</section></aside></div>`;
  $("#answer-form").addEventListener("submit", check);
  attachPhotoListeners();
  if (autoRead()) speakTarget("question");
}

// Teclado numérico propio en pantallas táctiles: el del teléfono tapa media
// pantalla y esconde «−», «/» y la coma.
const touchKeypad = () => typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
const KEY_LABELS = { "−": "menos", ",": "coma", "/": "fracción", borrar: "borrar" };
function keypad(q) {
  if (!touchKeypad()) return "";
  const keys = q[0].includes("\n")
    ? ["1", "2", "3"]
    : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "−", "0", ",", "/", "borrar"];
  return `<div class="keypad" role="group" aria-label="Teclado numérico">${keys
    .map(
      (k) =>
        `<button type="button" class="key${k === "borrar" ? " key-wide" : ""}" data-action="key:${k}" aria-label="${KEY_LABELS[k] ?? k}">${k === "borrar" ? "⌫ Borrar" : k}</button>`,
    )
    .join("")}</div>`;
}
function typeKey(key) {
  const input =
    session?.mode === "sheet"
      ? $(`#sheet-answer-${session.activeInput ?? Math.max(0, session.items.findIndex((it) => !it.resolved))}`)
      : $("#answer");
  if (!input || input.disabled) return;
  input.value = key === "borrar" ? input.value.slice(0, -1) : input.value + key;
}
// Qué se lee en voz alta con cada botón 🔊.
const SPEAK_TARGETS = {
  concept: [".pedagogical-banner-text"],
  example: [".intro-example-text"],
  practice: [".handwritten-reminder-box"],
  question: [".exercise-statement", ".equation"],
  hint: ["#hints > .hint:last-child"],
  game: [".minigame-prompt"],
  review: ["#work-review p"],
  hook: [".lesson-hook-text"],
  reply: ["#reflection-reply .coach-says"],
  coach: ["#coach-message"],
};
function speakTarget(target) {
  const text = (SPEAK_TARGETS[target] ?? [])
    .map((sel) => document.querySelector(sel)?.textContent?.replace("🔊 Escuchar", "") ?? "")
    .filter(Boolean)
    .map((part) => part.trim().replace(/[.:]$/, ""))
    .join(". ");
  if (text) speak(text);
}
function playVideo(lessonId) {
  const lesson =
    session?.lesson?.id === lessonId
      ? session.lesson
      : lessons.find((l) => l.id === lessonId);
  const slot = $("#video-slot");
  if (!lesson?.video || !slot) return;
  slot.innerHTML = videoPlayer(lesson.video);
  if (!state.watched.includes(lessonId)) {
    state.watched.push(lessonId);
    save();
  }
}
// Muestra la solución de un ejercicio trabado y deja seguir.
function reveal() {
  const s = session;
  if (!s || s.answered) return;
  const q = s.questions[s.index];
  s.answered = true;
  s.results.push({ lesson: lessonAt(s).id, origin: s.origins?.[s.index], independent: false, revealed: true });
  track(lessonAt(s).id, metricStep(s), "revealed");
  const f = $("#feedback");
  f.className = "feedback";
  f.textContent = `Así se resuelve: ${q[4]} La respuesta es ${String(q[1]).replace(".", ",")}.`;
  for (const sel of ["#check", "#hint-button", "#answer", "#work", "#work-photo-input", ".btn-remove-photo", '[data-action="skip"]'])
    if ($(sel)) $(sel).disabled = true;
  $("#next-area").innerHTML =
    `<div class="actions">${button(s.index === s.questions.length - 1 ? "Ver mi resumen →" : "Siguiente ejercicio →", "next", "primary")}</div>`;
  save();
}
function hint() {
  const s = session;
  if (!s || s.answered) return;
  const q = s.questions[s.index],
    l = lessonAt(s);
  const isMath = getSubject(l) === "matematica";

  let title = "";
  let body = "";

  if (s.hints === 0) {
    const balance = BALANCE_LESSONS.has(l.id);
    title = balance
      ? "Pista 1 · La balanza"
      : isMath
        ? "Pista 1 · Una ayuda"
        : "Pista 1 · Clave de lectura";
    const balanceAdvice = balance
      ? `<div class="hint-pedagogy-tip"><strong>⚖️ Mantén el equilibrio:</strong> Recuerda que una ecuación es una balanza. La operación que apliques a un lado debes aplicarla exactamente igual al otro para no romper la igualdad.</div>`
      : isMath
        ? `<div class="hint-pedagogy-tip">${escape(unitRule(l))}</div>`
        : `<div class="hint-pedagogy-tip"><strong>📖 Clave de lectura:</strong> Localiza las palabras clave o ideas principales en el texto antes de deducir tu respuesta.</div>`;
    body = `<p>${escape(q[3])}</p>${balanceAdvice}`;
  } else if (s.hints === 1) {
    title = "Pista 2 · Un ejemplo";
    body = `<p>Mira cómo se resuelve uno parecido:</p><div class="hint-example-box">${escape(l.examples)}</div>`;
    // El video ayuda en la práctica guiada, no en el desafío de autonomía.
    if (l.video && s.mode === "lesson" && s.index < 3)
      body += `<p>¿Prefieres verlo explicado?</p>${videoFacade(l.video, l.id)}`;
  } else if (s.hints === 2) {
    title = "Pista 3 · La solución explicada";
    const balanceCheck = BALANCE_LESSONS.has(l.id)
      ? `<div class="hint-pedagogy-tip"><strong>✓ Comprobación de la balanza:</strong> Al sustituir el valor obtenido en la ecuación original, ambos lados dan exactamente lo mismo y la igualdad se mantiene en equilibrio.</div>`
      : "";
    body = `<p>${escape(q[4])}</p>${balanceCheck}`;
  }

  if (s.hints < 3) {
    $("#hints").insertAdjacentHTML(
      "beforeend",
      `<div class="hint"><strong>${title}</strong><div style="margin-top:6px;">${body}</div>${speakButton("hint")}</div>`,
    );
    s.hints++;
    track(lessonAt(s).id, metricStep(s), "hint");
    if (autoRead()) speakTarget("hint");
  }
  if (s.hints === 3) $("#hint-button").disabled = true;
}
// Gemini revisa la foto del desarrollo (solo con cuenta: cada revisión tiene
// costo). La respuesta ya se corrigió en el dispositivo; esto se suma después
// y nunca bloquea avanzar.
async function reviewPhoto(s, q, raw, correct) {
  const box = $("#work-review");
  if (!box || !isMathExercise(s) || !s.workPhoto || s.reviewedPhoto === s.workPhoto) return;
  const show = (className, html) => {
    box.hidden = false;
    box.className = "work-review" + (className ? " " + className : "");
    box.innerHTML = html;
  };
  if (!synced) {
    show("muted", "<p>Tu foto quedó guardada en tu cuaderno. Con una cuenta, el búho también revisa tus pasos.</p>");
    return;
  }
  const photo = s.workPhoto,
    index = s.index;
  s.reviewedPhoto = photo;
  show("loading", "<p>🦉 Mirando tu desarrollo…</p>");
  try {
    const { review } = await api.reviewWork({
      image: photo,
      problem: q[0],
      statement: q[2],
      expected: String(q[1]),
      answer: raw,
      correct,
    });
    if (session !== s || s.index !== index || s.workPhoto !== photo) return;
    const good = review.readable && review.showsWork && review.matchesExercise && review.workIsCorrect;
    show(good ? "good" : "", `<strong>🦉 Sobre tu desarrollo</strong><p>${escape(review.message)}</p>${speakButton("review")}`);
    if (autoRead()) speakTarget("review");
  } catch (err) {
    if (session !== s || s.index !== index) return;
    s.reviewedPhoto = null; // con la misma foto se puede volver a intentar
    show("muted", `<p>${escape(err.status === 0 ? "Sin conexión: no pude revisar tu foto, pero quedó guardada en tu cuaderno." : err.message)}</p>`);
  }
}
function check(e) {
  e.preventDefault();
  const s = session;
  if (!s || s.answered) return;
  const raw = $("#answer").value,
    q = s.questions[s.index],
    f = $("#feedback");
  if (parseNumber(raw) === null) {
    f.className = "feedback";
    f.textContent =
      "Escribe un número, decimal o fracción, por ejemplo −2, 0,5 o 1/2.";
    return;
  }
  if (photoRequired(s) && !s.workPhoto) {
    f.className = "feedback";
    f.textContent = "Antes de comprobar, resuélvelo en papel y sácale una foto 📷.";
    // Cuántas veces la foto frena al estudiante (una vez por ejercicio).
    if (!s.photoBlocked) track(lessonAt(s).id, metricStep(s), "photo");
    s.photoBlocked = true;
    return;
  }
  const correct = answersQuestion(raw, q),
    lesson = lessonAt(s).id;
  state.attempts.push({ lesson, correct, hints: s.hints, at: Date.now() });
  track(lesson, metricStep(s), correct ? "correct" : "wrong");
  const work = $("#work") ? $("#work").value.trim() : "";
  const photo = s.workPhoto || null;
  const hasWork = Boolean(work || photo);
  const isChanged = work !== s.lastWork || photo !== s.lastPhoto;
  if (hasWork && isChanged) {
    state.notes.unshift({
      title: q[0],
      text: work || "Desarrollo a mano en cuaderno",
      at: Date.now(),
      ...(photo ? { image: photo } : {}),
    });
    s.lastWork = work;
    s.lastPhoto = photo;
  }
  f.className = "feedback" + (correct ? " good" : "");
  if (!correct) {
    s.wrong++;
    // Sin profesor al lado, se explica el error cuando se reconoce.
    const why = diagnoseMistake(q, raw);
    f.textContent = why
      ? `Todavía no. ${why} Inténtalo otra vez.`
      : "Todavía no coincide. Revisa el enunciado y tu respuesta; puedes probar otra vez o pedir una pista.";
    reviewPhoto(s, q, raw, false);
    // El calentamiento no agenda repasos: esas lecciones aún no se ven.
    if (s.mode !== "warmup" && !state.reviews.some((r) => r.lesson === lesson))
      state.reviews.push({ lesson, due: Date.now() });
    // Trabarse no debe ser un callejón sin salida: tras dos intentos se puede
    // ver la solución y seguir (queda registrado como «con ayuda»).
    if (s.wrong >= 2 && s.mode !== "diagnostic")
      $("#next-area").innerHTML =
        `<div class="stuck-help"><img class="owl-inline-sm" src="buho-duda.webp" alt="" width="64" height="58" /><div><p>¿Te trabaste? No pasa nada: mira cómo se resuelve y seguimos. Lo volveremos a practicar.</p>${button("Ver cómo se resuelve y seguir", "reveal")}</div></div>`;
    save();
    return;
  }
  s.answered = true;
  s.results.push({
    lesson,
    origin: s.origins?.[s.index],
    independent: s.hints === 0 && s.wrong === 0,
  });
  f.textContent =
    s.hints === 0 && s.wrong === 0
      ? "¡Lo resolviste sin ayuda! " + q[4]
      : "¡Llegaste al resultado! " +
        q[4] +
        " Volveremos a practicarlo para afianzarlo.";
  reviewPhoto(s, q, raw, true);
  $("#check").disabled = true;
  $("#hint-button").disabled = true;
  $("#answer").disabled = true;
  if ($("#work")) $("#work").disabled = true;
  if ($("#work-photo-input")) $("#work-photo-input").disabled = true;
  const removePhotoBtn = $(".btn-remove-photo");
  if (removePhotoBtn) removePhotoBtn.disabled = true;
  const skip = $('[data-action="skip"]');
  if (skip) skip.disabled = true;
  $("#next-area").innerHTML =
    `<div class="actions">${button(s.index === s.questions.length - 1 ? "Ver mi resumen →" : "Siguiente ejercicio →", "next", "primary")}</div>`;
  save();
}
function next() {
  const s = session;
  if (!s?.answered) return;
  if (s.mode === "diagnostic" && !s.results.at(-1).independent)
    s.stopped.add(getSubject(s.plan[s.index]));
  s.index++;
  // Diagnóstico adaptativo: una materia se detiene en su primer tropiezo.
  if (s.mode === "diagnostic")
    while (
      s.index < s.questions.length &&
      s.stopped.has(getSubject(s.plan[s.index]))
    )
      s.index++;
  if (s.index === s.questions.length) {
    finish();
    return;
  }
  s.hints = 0;
  s.wrong = 0;
  s.answered = false;
  s.lastWork = null;
  s.workPhoto = null;
  s.lastPhoto = null;
  s.reviewedPhoto = null;
  s.photoBlocked = false;
  renderExercise();
}
// Primera vez: dos preguntas fáciles y concretas antes de cualquier
// diagnóstico, para empezar con algo que sale bien.
const WARMUP = [
  ["base-suma-resta", ["500 + 300", 800, "Tienes $500 y te regalan $300. ¿Cuánto dinero tienes ahora?", "Suma los cientos: 5 + 3 = 8. Son 8 monedas de $100.", "500 + 300 = 800. ¡Tienes $800!"]],
  ["base-multiplicar", ["4 · 10", 40, "Compras 4 sobres con 10 láminas cada uno. ¿Cuántas láminas tienes?", "Cuenta de 10 en 10: 10, 20, 30, 40.", "4 · 10 = 40 láminas."]],
];
function startWarmup() {
  const items = WARMUP.map(([id, q]) => [lessons.find((l) => l.id === id), q]).filter(([l]) => l);
  if (!items.length) return diagnosticPicker();
  const plan = items.map(([l]) => l);
  session = {
    mode: "warmup",
    plan,
    lesson: plan[0],
    questions: items.map(([, q]) => q),
    index: 0,
    hints: 0,
    wrong: 0,
    results: [],
    answered: false,
    workPhoto: null,
    lastPhoto: null,
    lastWork: null,
  };
  renderExercise();
}
function finishWarmup() {
  const s = session;
  const alone = s.results.filter((r) => r.independent).length;
  save();
  session = null;
  app.innerHTML = `<section class="card summary warmup-done">
    <div class="eyebrow">TU PRIMER PASO</div>
    <h1>${alone === s.questions.length ? "¡Lo lograste! 🎉" : "¡Buen comienzo! 💪"}</h1>
    <p class="intro">${
      alone === s.questions.length
        ? "Resolviste las dos sin ayuda. Ganaste tus primeros XP."
        : "Llegaste al final, y eso es lo que cuenta. Ganaste tus primeros XP."
    }</p>
    <p>Ahora veamos por dónde te conviene seguir: son ${DIAGNOSTIC_BASE.length + MAX_PER_SUBJECT * ACTIVE_SUBJECTS.length} preguntas cortas y puedes saltar las que no sepas.</p>
    <div class="actions">${button("Buscar mi punto de partida →", "diagnostic", "primary")}${button("Prefiero ir a mi ruta", "exit")}</div>
  </section>`;
}
function finish() {
  if (session?.mode === "task") {
    finishTask();
    return;
  }
  if (session?.mode === "warmup") {
    finishWarmup();
    return;
  }
  const s = session,
    independent = s.results.filter((r) => r.independent).length;
  let title = "Cada paso cuenta.",
    desc = "";
  if (s.mode === "diagnostic") {
    state.diagnosed = true;
    state.grade = s.grade;
    currentLevel = s.grade;
    const solved = new Set(
      s.results.filter((r) => r.independent).map((r) => r.lesson),
    );
    const proposals = [];
    for (const [subject, label] of [
      ["matematica", "Matemática"],
      ["lenguaje", "Lenguaje"],
    ]) {
      const planned = s.plan.filter((l) => getSubject(l) === subject);
      if (!planned.length) continue;
      const gap = planned.findIndex((l) => !solved.has(l.id));
      // Lo resuelto antes del primer tropiezo se da por completado, pendiente
      // de confirmar en un repaso; nunca se certifica dominio aquí.
      for (const l of gap === -1 ? planned : planned.slice(0, gap))
        if (!state.completed.includes(l.id)) {
          state.completed.push(l.id);
          state.reviews.push({ lesson: l.id, due: Date.now() + 86400000 });
        }
      const start =
        gap === -1
          ? lessons.find(
              (l) =>
                inferGrade(l) === s.grade &&
                getSubject(l) === subject &&
                !state.completed.includes(l.id),
            )
          : planned[gap];
      if (subject === "matematica") {
        state.focus = start?.id;
        const comfy = comfortableStart(planned, solved, routeOrder(lessons));
        state.kumonStart = comfy?.id;
      }
      proposals.push(
        start
          ? `En ${label}, empieza por «${displayTitle(start)}».`
          : `En ${label} respondiste todo: prueba lecciones del curso siguiente.`,
      );
    }
    title = "Ya tienes un punto de partida.";
    desc = `${proposals.join(" ")} Lo que resolviste queda pendiente de confirmar en un repaso.`;
  } else if (s.mode === "daily") {
    // Los repasos dentro de la práctica siguen la misma regla de dominio.
    const confirmed = [];
    for (const id of new Set(
      s.results.filter((r) => r.origin === "review").map((r) => r.lesson),
    )) {
      const mine = s.results.filter((r) => r.lesson === id && r.origin === "review");
      const mastered = s.confirmable.has(id) && mine.every((r) => r.independent);
      state.mastered = state.mastered.filter((x) => x !== id);
      if (mastered) {
        state.mastered.push(id);
        confirmed.push(id);
      }
      state.reviews = state.reviews.filter((r) => r.lesson !== id);
      state.reviews.push({ lesson: id, due: Date.now() + (mastered ? 7 : 1) * 86400000 });
    }
    const today = xpToday(state);
    title = today >= dailyGoal() ? "¡Meta del día cumplida!" : "Práctica del día lista.";
    desc =
      `Llevas ${today} de ${dailyGoal()} XP hoy.` +
      (confirmed.length
        ? ` Confirmaste el dominio de ${confirmed.length === 1 ? "una habilidad" : confirmed.length + " habilidades"}.`
        : "") +
      ` Siguiente paso: «${displayTitle(nextLesson())}».`;
  } else {
    if (s.mode === "lesson" && !state.completed.includes(s.lesson.id))
      state.completed.push(s.lesson.id);
    state.reviews = state.reviews.filter((r) => r.lesson !== s.lesson.id);
    const mastered =
      s.mode === "review" && s.canConfirm && independent === s.questions.length;
    state.mastered = state.mastered.filter((id) => id !== s.lesson.id);
    if (mastered) state.mastered.push(s.lesson.id);
    state.reviews.push({
      lesson: s.lesson.id,
      due: Date.now() + (mastered ? 7 : 1) * 86400000,
    });
    title = mastered ? "¡Dominio confirmado!" : "Una lección más cerca.";
    desc = mastered
      ? "Resolviste un nuevo ejercicio sin pistas ni errores. Volveremos a repasarlo en siete días."
      : "Guardamos tu avance. Mañana tendrás un ejercicio diferente para comprobar lo aprendido.";
  }
  save();

  // Resumen simple: qué logró, cuánto avanzó y un solo botón para seguir.
  const streak = getStreakInfo(state).streak;
  const gained = s.results.filter((r) => !r.revealed).length * XP_PER_CORRECT;
  const reviewMastered = title === "¡Dominio confirmado!";
  const heading =
    s.mode === "diagnostic"
      ? "🧭 ¡Ya tienes un punto de partida!"
      : s.mode === "daily"
        ? xpToday(state) >= dailyGoal() ? "🔥 ¡Meta del día cumplida!" : "✅ Práctica del día lista"
        : reviewMastered
          ? "👑 ¡Ya lo dominas!"
          : s.mode === "review"
            ? "💪 Buen repaso"
            : "🎉 ¡Lección terminada!";
  const alone =
    independent === s.questions.length
      ? `Resolviste los ${s.questions.length} sin ayuda.`
      : independent
        ? `Resolviste ${independent} de ${s.questions.length} sin ayuda. Lo demás lo volveremos a practicar.`
        : "Llegaste al final, y eso es lo que cuenta. Lo volveremos a practicar.";
  const upcoming = (s.mode === "diagnostic" && lessons.find((l) => l.id === state.focus)) || nextLesson();
  const comfy =
    s.mode === "diagnostic" && state.kumonStart && state.kumonStart !== upcoming?.id
      ? lessons.find((l) => l.id === state.kumonStart)
      : null;
  const offerSheet = s.mode === "lesson" && getSubject(s.lesson) === "matematica";
  app.innerHTML = `
    <section class="card summary simple-summary">
      <img class="summary-owl-img" src="buho-saluda.webp" alt="" width="102" height="126" />
      <h1>${heading}</h1>
      <p class="intro">${escape(s.mode === "diagnostic" ? desc : alone)}</p>
      ${s.mode === "diagnostic" ? "" : `<p class="muted">${escape(desc)}</p>`}
      ${
        comfy
          ? `<div class="callout kumon-comfy-callout"><strong>📄 Punto de partida cómodo (estilo Kumon):</strong> si quieres arrancar al 100 % y agarrar ritmo, empieza con una hoja corta de «${escape(displayTitle(comfy))}» (${escape(lessonLevel(comfy.id).label)}) antes de pasar a «${escape(displayTitle(upcoming))}».</div>`
          : ""
      }
      <p class="summary-stats"><span>⭐ +${gained} XP</span><span>🔥 ${streak} día${streak !== 1 ? "s" : ""} seguido${streak !== 1 ? "s" : ""}</span></p>
      ${s.mode === "lesson" ? reflectionForm() : ""}
      <div class="actions">
        ${upcoming ? button(`${s.mode === "diagnostic" ? "Empezar" : "Seguir"}: ${escape(displayTitle(upcoming))} →`, "lesson:" + upcoming.id, "primary") : ""}
        ${comfy ? button(`📄 Hoja cómoda: ${escape(displayTitle(comfy))}`, "sheet:" + comfy.id) : ""}
        ${offerSheet ? button(`📄 Hoja de fluidez (${SHEET_SIZE} ejercicios)`, "sheet:" + s.lesson.id) : ""}
        ${button("Volver a mi ruta", "exit")}
      </div>
    </section>
  `;
  if (s.mode === "lesson") attachReflection(s.lesson);
  session = null;
}

// Hojas de fluidez estilo Kumon -----------------------------------------------
function pauseSheetTimer(s = session) {
  if (s?.mode === "sheet" && s.resumedAt) {
    s.activeMs += Math.max(0, Date.now() - s.resumedAt);
    s.resumedAt = null;
  }
}
function resumeSheetTimer(s = session) {
  if (s?.mode === "sheet" && !s.resumedAt) s.resumedAt = Date.now();
}
function elapsedSheetMs(s) {
  return (s?.activeMs ?? 0) + (s?.resumedAt ? Math.max(0, Date.now() - s.resumedAt) : 0);
}

function dailySheetEntry() {
  const pick = pickDailySheet({ lessons, state, next: nextLesson() });
  if (!pick) {
    app.innerHTML =
      heading("HOJA DEL DÍA", "Todavía no hay hojas disponibles.", "Publica al menos una lección de matemática para practicar.") +
      button("Volver a mi ruta", "exit", "primary");
    return;
  }
  startSheet(pick.lesson.id);
}

function startSheet(lessonId, explicitMicroLevel) {
  const l = lessons.find((x) => x.id === lessonId && getSubject(x) === "matematica");
  if (!l) return;
  const rec = state.sheets?.[l.id];
  const microLevel =
    explicitMicroLevel !== undefined
      ? Math.max(0, Math.min(3, explicitMicroLevel))
      : Math.min(3, rec?.level ?? 0);
  const sheet = buildSheet(l, microLevel, { sheetNumber: (rec?.count ?? 0) + 1 });
  session = {
    mode: "sheet",
    lesson: l,
    sheet,
    items: createSheetItems(sheet.questions),
    round: 0,
    activeMs: 0,
    resumedAt: Date.now(),
    activeInput: 0,
    workPhoto: null,
    reviewedPhoto: null,
    photoSaved: false,
    photoFeedback: "",
    photoFeedbackGood: false,
    showingIntro: false,
  };
  renderSheet();
}

function sheetPhotoHtml(s) {
  if (s.workPhoto)
    return `<div class="work-photo-preview"><div class="work-photo-thumb-wrap"><img src="${escape(s.workPhoto)}" alt="Foto de tu hoja en papel" class="work-photo-thumb" /></div><div class="work-photo-details"><span class="photo-badge-success">✓ Foto de tu hoja lista</span><p class="muted" style="margin:4px 0 8px 0;font-size:12px;">Se guarda solo en tu cuaderno de este dispositivo.</p><div class="inline-row">${
      synced ? '<button type="button" data-action="sheet-review-photo" class="secondary">🦉 Revisar mis pasos con el búho</button>' : ""
    }<button type="button" data-action="sheet-remove-photo" class="btn-remove-photo">✕ Quitar foto</button></div></div></div>${
      s.photoFeedback
        ? `<div id="sheet-work-review" class="work-review${s.photoFeedbackGood ? " good" : ""}" aria-live="polite"><p>${escape(s.photoFeedback)}</p></div>`
        : '<div id="sheet-work-review" class="work-review" aria-live="polite" hidden></div>'
    }`;
  return `<label for="sheet-photo-input" class="photo-upload-box"><span class="photo-icon">📷</span><div class="photo-upload-text"><strong>¿La hiciste en papel? Sube una foto de tu hoja (opcional)</strong><span>Solo la hoja, sin tu cara ni tu nombre. Queda en tu cuaderno${synced ? " y el búho puede revisar tus pasos" : ""}.</span></div><span class="photo-tag-pill">Sacar foto</span></label><input type="file" id="sheet-photo-input" accept="image/*" capture="environment" class="visually-hidden">`;
}

function attachSheetPhotoListener() {
  const input = $("#sheet-photo-input");
  if (!input) return;
  input.onchange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    if (compressed && session?.mode === "sheet") {
      session.workPhoto = compressed;
      session.reviewedPhoto = null;
      session.photoFeedback = "";
      session.photoSaved = false;
      updateSheetPhotoArea();
    }
  };
}

function updateSheetPhotoArea() {
  const area = $("#sheet-photo-area");
  if (!area || session?.mode !== "sheet") return;
  area.innerHTML = sheetPhotoHtml(session);
  if (!session.workPhoto) attachSheetPhotoListener();
}

async function reviewSheetPhoto() {
  const s = session;
  if (!s || s.mode !== "sheet" || !s.workPhoto) return;
  const box = $("#sheet-work-review");
  if (!synced) {
    s.photoFeedback = "Tu foto quedó guardada en tu cuaderno. Con una cuenta, el búho también revisa tus pasos.";
    updateSheetPhotoArea();
    return;
  }
  const idx = s.items.findIndex((it) => !it.resolved);
  const targetIdx = idx >= 0 ? idx : s.sheet.questions.length - 1;
  const q = s.sheet.questions[targetIdx];
  const item = s.items[targetIdx];
  if (box) {
    box.hidden = false;
    box.className = "work-review loading";
    box.innerHTML = "<p>🦉 Mirando tu hoja en papel…</p>";
  }
  try {
    const { review } = await api.reviewWork({
      image: s.workPhoto,
      problem: q[0],
      statement: `Ejercicio ${targetIdx + 1} de la hoja ${s.sheet.code}: ${q[2]}`,
      expected: String(q[1]),
      answer: item.raw || "",
      correct: item.resolved && !item.revealed,
    });
    if (session !== s) return;
    const good = review.readable && review.showsWork && review.matchesExercise && review.workIsCorrect;
    s.photoFeedback = `🦉 Sobre el ejercicio ${targetIdx + 1}: ${review.message}`;
    s.photoFeedbackGood = good;
    updateSheetPhotoArea();
  } catch (err) {
    if (session !== s) return;
    s.photoFeedback = err.status === 0
      ? "Sin conexión: no pude revisar tu foto, pero quedó guardada en tu cuaderno."
      : err.message;
    s.photoFeedbackGood = false;
    updateSheetPhotoArea();
  }
}

function renderSheet() {
  const s = session;
  if (!s || s.mode !== "sheet") return;
  resumeSheetTimer(s);
  const { sheet, items, round } = s;
  const total = sheet.questions.length;
  const resolvedCount = items.filter((it) => it.resolved).length;
  const pendingCount = total - resolvedCount;
  const inCorrection = round > 0 && pendingCount > 0;
  const firstPending = items.findIndex((it) => !it.resolved);
  if (firstPending >= 0 && items[s.activeInput]?.resolved) s.activeInput = firstPending;

  const rowsHtml = sheet.questions
    .map((q, i) => {
      const it = items[i];
      const statusCls = it.resolved ? "sheet-row-ok" : it.attempts > 0 || it.invalid ? "sheet-row-retry" : "";
      const showHintText = it.hints > 0 ? `<p class="sheet-hint-text">💡 ${escape(it.hints > 1 ? q[4] : q[3])}</p>` : "";
      const canReveal = !it.resolved && it.attempts >= 2;
      return `<div class="sheet-row ${statusCls}" data-sheet-row="${i}">
        <div class="sheet-row-num">${i + 1}</div>
        <div class="sheet-row-body">
          <div class="sheet-row-problem">
            <div class="sheet-expr">${escape(q[0])}</div>
            <p class="sheet-stmt">${escape(q[2])}</p>
          </div>
          <div class="sheet-work-space" aria-hidden="true"><span>Desarrollo en papel:</span></div>
          <div class="sheet-row-input">
            <label for="sheet-answer-${i}" class="visually-hidden">Respuesta ejercicio ${i + 1}</label>
            <input id="sheet-answer-${i}" class="sheet-answer-input" data-sheet-index="${i}" value="${escape(it.raw)}" autocomplete="off" placeholder="Respuesta"${touchKeypad() ? ' inputmode="none"' : ""}${it.resolved ? " disabled" : ""}>
            ${it.resolved ? `<span class="sheet-check" aria-label="Correcto">${it.revealed ? "👁️" : "✓"}</span>` : ""}
          </div>
          ${it.feedback ? `<p class="sheet-feedback${it.resolved ? " good" : ""}">${escape(it.feedback)}</p>` : ""}
          ${showHintText}
          ${
            !it.resolved && (inCorrection || it.attempts > 0)
              ? `<div class="sheet-row-helps">
                  <button type="button" class="link-button" data-action="sheet-hint:${i}">💡 ${it.hints ? "Ver explicación" : "Pista"}</button>
                  ${canReveal ? `<button type="button" class="link-button" data-action="sheet-reveal:${i}">Ver cómo se resuelve</button>` : ""}
                </div>`
              : ""
          }
        </div>
      </div>`;
    })
    .join("");

  app.innerHTML = `
    <div class="sheet-print-header" aria-hidden="true">
      <div class="sheet-print-brand"><strong>socatres</strong> · Hoja de práctica (${escape(sheet.level.label)} · Código ${escape(sheet.code)})</div>
      <h1>${escape(displayTitle(s.lesson))} · Paso ${sheet.microLevel + 1} de ${MAX_MICRO_LEVEL}</h1>
      <div class="sheet-print-meta"><span>Nombre: ____________________________</span><span>Fecha: __________________</span></div>
      <p>Resuelve cada ejercicio en papel con lápiz. Luego ingresa tus respuestas en socatres para corregir hasta el 100 %.</p>
    </div>
    <div class="no-print">
      ${button("← Volver a mi ruta", "exit", "back")}
      ${heading(
        `${sheet.level.label.toUpperCase()} · HOJA ${sheet.code} · PASO ${sheet.microLevel + 1} DE ${MAX_MICRO_LEVEL}`,
        displayTitle(s.lesson),
        inCorrection
          ? `Te ${pendingCount === 1 ? "queda 1 ejercicio" : `quedan ${pendingCount} ejercicios`} por corregir para dejar esta hoja en 100 %. Revisa con calma.`
          : `Resuelve los ${total} ejercicios a tu ritmo, en papel o aquí. Sin reloj a la vista: al final corregimos hasta llegar al 100 %.`,
      )}
      <div class="sheet-toolbar">
        <div class="sheet-progress-pill">
          <strong>${resolvedCount} / ${total}</strong> ${inCorrection ? "al 100 %" : "ejercicios"}
          <div class="bar mini-bar"><span style="width:${Math.round((resolvedCount / total) * 100)}%"></span></div>
        </div>
        <div class="sheet-toolbar-actions">
          <button type="button" class="secondary" data-action="print-sheet">🖨️ Imprimir hoja en papel</button>
          <button type="button" class="secondary" data-action="sheet-concept">📖 Ver explicación</button>
        </div>
      </div>
      ${
        inCorrection
          ? `<div class="callout sheet-correction-banner" role="status"><strong>🔁 Ronda de autocorrección:</strong> corrige solo los ejercicios marcados para cerrar tu hoja en 100 %.</div>`
          : ""
      }
    </div>
    <section class="card sheet-card">
      <form id="sheet-form">
        <div class="sheet-list">${rowsHtml}</div>
        ${touchKeypad() ? `<div class="no-print">${keypad(["1 + 1"])}</div>` : ""}
        <div class="actions no-print sheet-submit-row">
          <button class="primary" type="submit">${
            inCorrection
              ? `Comprobar correcciones (${pendingCount}) →`
              : "Corregir mi hoja →"
          }</button>
        </div>
      </form>
      <div id="sheet-photo-area" class="sheet-photo-area no-print">${sheetPhotoHtml(s)}</div>
    </section>`;

  $("#sheet-form").addEventListener("submit", submitSheet);
  for (let i = 0; i < total; i++) {
    const inp = $(`#sheet-answer-${i}`);
    if (inp) {
      inp.onfocus = () => {
        if (session?.mode === "sheet") session.activeInput = i;
      };
      inp.oninput = () => {
        if (session?.mode === "sheet") session.items[i].raw = inp.value;
      };
    }
  }
  attachSheetPhotoListener();
}

function saveSheetPhotoIfNeeded(s) {
  if (!s.workPhoto || s.photoSaved) return;
  state.notes.unshift({
    title: `Hoja ${s.sheet.code} · ${displayTitle(s.lesson)}`,
    text: `Desarrollo a mano en papel (${s.sheet.level.label}, paso ${s.sheet.microLevel + 1}/${MAX_MICRO_LEVEL})`,
    at: Date.now(),
    image: s.workPhoto,
  });
  s.photoSaved = true;
}

function submitSheet(e) {
  e.preventDefault();
  const s = session;
  if (!s || s.mode !== "sheet") return;
  const answers = s.sheet.questions.map((_, i) => {
    const inp = $(`#sheet-answer-${i}`);
    return inp ? inp.value : s.items[i].raw;
  });
  const graded = gradeSheetRound(s.sheet, answers, s.items);
  s.items = graded.items;
  s.round++;

  const now = Date.now();
  for (const checkItem of graded.newlyChecked) {
    state.attempts.push({
      lesson: s.lesson.id,
      correct: checkItem.correct,
      hints: checkItem.hints,
      at: now,
    });
    track(s.lesson.id, s.sheet.microLevel, checkItem.correct ? "correct" : "wrong");
  }
  saveSheetPhotoIfNeeded(s);
  save();

  if (graded.allResolved) {
    finishSheet();
  } else {
    renderSheet();
  }
}

function sheetHint(index) {
  const s = session;
  if (!s || s.mode !== "sheet" || !s.items[index] || s.items[index].resolved) return;
  const inp = $(`#sheet-answer-${index}`);
  if (inp) s.items[index].raw = inp.value;
  s.items[index].hints = Math.min(2, s.items[index].hints + 1);
  track(s.lesson.id, s.sheet.microLevel, "hint");
  renderSheet();
}

function sheetReveal(index) {
  const s = session;
  if (!s || s.mode !== "sheet" || !s.items[index] || s.items[index].resolved) return;
  const q = s.sheet.questions[index];
  s.items[index].resolved = true;
  s.items[index].revealed = true;
  if (s.items[index].firstPassCorrect === null) s.items[index].firstPassCorrect = false;
  s.items[index].raw = String(q[1]).replace(".", ",");
  s.items[index].feedback = `Así se resuelve: ${q[4]} La respuesta es ${String(q[1]).replace(".", ",")}.`;
  track(s.lesson.id, s.sheet.microLevel, "revealed");
  save();
  if (s.items.every((it) => it.resolved)) finishSheet();
  else renderSheet();
}

function finishSheet() {
  const s = session;
  if (!s || s.mode !== "sheet") return;
  pauseSheetTimer(s);
  const elapsed = elapsedSheetMs(s);
  const prevRec = state.sheets?.[s.lesson.id] ?? null;
  const res = evaluateSheet(s.sheet, s.items, elapsed, prevRec);

  state.sheets = { ...(state.sheets ?? {}), [s.lesson.id]: res.record };
  if (res.masteredLesson) {
    if (!state.completed.includes(s.lesson.id)) state.completed.push(s.lesson.id);
    if (!state.mastered.includes(s.lesson.id)) state.mastered.push(s.lesson.id);
    state.reviews = state.reviews.filter((r) => r.lesson !== s.lesson.id);
    state.reviews.push({ lesson: s.lesson.id, due: Date.now() + 7 * 86400000 });
  } else if (res.advance && !state.completed.includes(s.lesson.id)) {
    state.completed.push(s.lesson.id);
    if (!state.reviews.some((r) => r.lesson === s.lesson.id))
      state.reviews.push({ lesson: s.lesson.id, due: Date.now() + 86400000 });
  }
  saveSheetPhotoIfNeeded(s);
  track(s.lesson.id, 9, "sheet");
  save();

  const upcoming = nextLesson();
  const streak = getStreakInfo(state).streak;
  app.innerHTML = `
    <section class="card summary simple-summary sheet-summary">
      <img class="summary-owl-img" src="buho-saluda.webp" alt="" width="102" height="126" />
      <div class="eyebrow">${escape(s.sheet.level.label.toUpperCase())} · HOJA ${escape(s.sheet.code)} COMPLETADA</div>
      <h1>${escape(res.headline)}</h1>
      <p class="intro">${escape(res.message)}</p>
      <div class="sheet-summary-metrics">
        <div class="sheet-metric"><strong>100 %</strong><span>Hoja corregida</span></div>
        <div class="sheet-metric"><strong>${res.firstPassAccuracy} %</strong><span>A la primera</span></div>
        <div class="sheet-metric"><strong>${escape(formatDuration(res.elapsedMs))}</strong><span>Tu ritmo hoy</span></div>
        <div class="sheet-metric"><strong>${Math.min(MAX_MICRO_LEVEL, res.nextLevel)}/${MAX_MICRO_LEVEL}</strong><span>Pasos fluidos</span></div>
      </div>
      ${
        res.improvedMs >= 5000
          ? `<p class="callout sheet-fluency-win">⚡ ¡Más fluido que tu mejor marca anterior! Bajaste ${escape(formatDuration(res.improvedMs))} sin apurarte.</p>`
          : ""
      }
      <p class="summary-stats"><span>🔥 ${streak} día${streak !== 1 ? "s" : ""} seguido${streak !== 1 ? "s" : ""}</span><span>📄 ${res.record.count} ${res.record.count === 1 ? "hoja hecha" : "hojas hechas"} en este tema</span></p>
      <div class="actions">
        ${
          res.masteredLesson && upcoming && upcoming.id !== s.lesson.id
            ? button(`Seguir con ${escape(displayTitle(upcoming))} →`, "lesson:" + upcoming.id, "primary")
            : res.advance
              ? button(`📄 Seguir con paso ${res.nextLevel + 1}/${MAX_MICRO_LEVEL} →`, "sheet:" + s.lesson.id, "primary")
              : button("📄 Hacer otra hoja fresca de este paso →", "sheet:" + s.lesson.id, "primary")
        }
        ${button("Volver a mi ruta", "exit")}
      </div>
    </section>
  `;
  session = null;
}

// Al terminar una lección, el estudiante la resume con sus palabras y anota la
// pregunta que le quedó. Queda en su cuaderno; con cuenta, el búho le responde.
const STARTERS = ["Hoy aprendí que…", "Lo más importante es…", "Me ayudó pensar en…"];
function reflectionForm() {
  return `<section class="reflection" id="reflection" aria-labelledby="reflection-title">
    <h2 id="reflection-title">✍️ Cuéntalo con tus palabras</h2>
    <p class="muted">Explicar lo que aprendiste ayuda a que se te quede. No hay respuestas malas.</p>
    <form id="reflection-form">
      <label for="reflection-summary">¿Qué aprendiste hoy?</label>
      <div class="starter-row" role="group" aria-label="Ideas para empezar">${STARTERS.map(
        (t, i) => `<button type="button" class="filter-btn" data-action="starter:${i}">${escape(t)}</button>`,
      ).join("")}</div>
      <textarea id="reflection-summary" maxlength="${MAX_SUMMARY}" rows="3" placeholder="Hoy aprendí que…"></textarea>
      <label for="reflection-question">¿Qué pregunta te quedó? <span class="muted">(opcional)</span></label>
      <textarea id="reflection-question" maxlength="${MAX_QUESTION}" rows="2" placeholder="Me pregunto…"></textarea>
      <p class="muted reflection-privacy">No escribas tu nombre ni datos personales.</p>
      <div class="actions"><button class="primary" type="submit">${synced ? "Guardar y preguntarle al búho" : "Guardar en mi cuaderno"}</button><span id="reflection-status" role="status"></span></div>
    </form>
    <div id="reflection-reply" class="coach-reply" aria-live="polite" hidden></div>
  </section>`;
}
function replyView(note) {
  return [
    note.reply && `<p class="coach-says">🦉 ${escape(note.reply)}</p>`,
    note.answer && `<p class="coach-says"><strong>Sobre tu pregunta:</strong> ${escape(note.answer)}</p>`,
  ]
    .filter(Boolean)
    .join("");
}
function attachReflection(lesson) {
  const form = $("#reflection-form");
  if (!form) return;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const summary = $("#reflection-summary").value.trim();
    const question = $("#reflection-question").value.trim();
    const status = $("#reflection-status");
    if (!summary && !question) {
      status.textContent = "Escribe lo que aprendiste o una pregunta.";
      $("#reflection-summary").focus();
      return;
    }
    for (const el of form.querySelectorAll("textarea, button")) el.disabled = true;
    const note = {
      title: `Mi resumen · ${displayTitle(lesson)}`,
      text: summary,
      at: Date.now(),
      lesson: lesson.id,
      ...(question ? { question } : {}),
    };
    state.notes.unshift(note);
    save();
    status.textContent = "✓ Guardado en tu cuaderno.";
    const box = $("#reflection-reply");
    if (!synced) {
      box.hidden = false;
      box.className = "coach-reply muted";
      box.innerHTML = "<p>Con una cuenta, el búho también lee tu resumen y responde tus preguntas.</p>";
      return;
    }
    box.hidden = false;
    box.className = "coach-reply loading";
    box.innerHTML = "<p>🦉 Leyendo lo que escribiste…</p>";
    try {
      const { reply } = await api.reflect({
        lesson: displayTitle(lesson),
        idea: forStudent(lesson.concept),
        summary,
        question,
      });
      if (reply.message) note.reply = reply.message;
      if (reply.answer) note.answer = reply.answer;
      save();
      if ($("#reflection-reply") !== box) return; // ya cambió de pantalla
      box.className = "coach-reply";
      box.innerHTML = replyView(note) + speakButton("reply", "Escuchar al búho");
      if (autoRead()) speakTarget("reply");
    } catch (err) {
      if ($("#reflection-reply") !== box) return; // ya cambió de pantalla
      box.className = "coach-reply muted";
      box.innerHTML = `<p>${escape(err.status === 0 ? "Sin conexión: lo que escribiste quedó en tu cuaderno." : err.message)}</p>`;
    }
  };
}
function reviews() {
  const due = activeReviews().filter((r) => r.due <= Date.now()),
    future = activeReviews().filter((r) => r.due > Date.now());
  app.innerHTML =
    heading(
      "RECUPERAR Y AFIANZAR",
      "Un poco de repaso, mucho avance.",
      "Un error es una señal de qué practicar. Aquí también confirmas lo aprendido en una sesión posterior.",
    ) +
    (due.length
      ? due
          .map((r) => {
            const l = lessons.find((l) => l.id === r.lesson);
            return `<section class="lesson"><span class="node">↺</span><div class="lesson-info"><h3>${escape(l.title)}</h3><p>Un ejercicio diferente · intenta resolverlo sin pistas</p></div>${button("Repasar →", "review:" + l.id, "primary")}</section>`;
          })
          .join("")
      : `<section class="card empty"><img class="empty-owl-img" src="buho-rama.webp" alt="" width="128" height="136" /><h2>Por ahora, estás al día.</h2><p class="intro" style="margin:12px auto">Tus próximos repasos aparecerán aquí. Mientras tanto, puedes continuar tu ruta.</p>${button("Ir a mi ruta", "exit", "primary")}</section>`) +
    future
      .map(
        (r) =>
          `<div class="lesson"><div class="lesson-info"><h3>${escape(lessons.find((l) => l.id === r.lesson).title)}</h3><p>Disponible el ${new Date(r.due).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })}</p></div><span class="pill">Programado</span></div>`,
      )
      .join("");
}
let pendingNotePhoto = null;
function newNotePhotoHtml() {
  return pendingNotePhoto
    ? `<div class="work-photo-preview" style="margin-top:10px;"><div class="work-photo-thumb-wrap"><img src="${escape(pendingNotePhoto)}" alt="Foto de cuaderno" class="work-photo-thumb" /></div><div class="work-photo-details"><span class="photo-badge-success">✓ Foto adjunta</span><button type="button" data-action="remove-new-note-photo" class="btn-remove-photo">✕ Eliminar foto</button></div></div>`
    : `<label for="new-note-photo-input" class="photo-btn-secondary"><span>📷</span> Adjuntar foto de mi cuaderno (opcional)</label><input type="file" id="new-note-photo-input" accept="image/*" capture="environment" class="visually-hidden">`;
}
function attachNewNotePhotoListener() {
  const newPhotoInput = $("#new-note-photo-input");
  if (newPhotoInput) {
    newPhotoInput.onchange = async (e) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const compressed = await compressImage(file);
      if (compressed) {
        pendingNotePhoto = compressed;
        updateNewNotePhotoArea();
      }
    };
  }
}
function updateNewNotePhotoArea() {
  const area = $("#new-note-photo-area");
  if (!area) return;
  area.innerHTML = newNotePhotoHtml();
  if (!pendingNotePhoto) attachNewNotePhotoListener();
}
function showPhotoModal(noteIndex) {
  const note = state.notes[noteIndex];
  if (!note?.image) return;
  const dialog = $("#photo-dialog");
  const content = $("#photo-dialog-content") || dialog;
  if (!content) return;
  content.innerHTML = `<div class="photo-dialog-head"><h3>${escape(note.title)}</h3><button type="button" id="close-photo-dialog" class="secondary">Cerrar</button></div><img src="${escape(note.image)}" alt="Desarrollo a mano de ${escape(note.title)}" class="photo-dialog-img" />`;
  if (dialog && typeof dialog.showModal === "function") {
    dialog.showModal();
    const closeBtn = $("#close-photo-dialog");
    if (closeBtn) closeBtn.onclick = () => dialog.close();
  }
}
function notebook() {
  app.innerHTML =
    heading(
      "TUS IDEAS TAMBIÉN ENSEÑAN",
      "Mi cuaderno",
      "Aquí quedan tus procedimientos, desarrollos a mano y las ideas que quieras recordar.",
    ) +
    `<section class="card"><form id="note-form"><label for="note">Una idea o desarrollo para tu próximo intento</label><textarea id="note" maxlength="4000" placeholder="Hoy entendí que…"></textarea><div class="note-photo-uploader"><div id="new-note-photo-area">${newNotePhotoHtml()}</div></div><div class="actions"><button class="primary" type="submit">Guardar nota</button><span id="note-status" role="status"></span></div></form></section><div id="notes">${
      state.notes.length
        ? state.notes
            .map(
              (n, i) =>
                `<article class="note"><div class="note-header-row"><span class="muted">${new Date(
                  n.at,
                ).toLocaleDateString("es-CL", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}</span>${
                  n.image
                    ? '<span class="note-photo-tag">📷 Desarrollo a mano</span>'
                    : ""
                }</div><h3>${escape(n.title)}</h3>${
                  n.text ? `<p>${escape(n.text)}</p>` : ""
                }${n.question ? `<p class="note-question"><strong>Mi pregunta:</strong> ${escape(n.question)}</p>` : ""}${
                  n.reply || n.answer ? `<div class="coach-reply">${replyView(n)}</div>` : ""
                }${
                  n.image
                    ? `<div class="note-image-wrap"><img src="${escape(n.image)}" alt="Desarrollo a mano de ${escape(
                        n.title,
                      )}" class="note-image" loading="lazy" /><button type="button" data-action="zoom-photo:${i}" class="note-image-zoom">🔍 Ver foto completa</button></div>`
                    : ""
                }</article>`,
            )
            .join("")
        : '<div class="empty muted"><img class="empty-owl-img" src="buho-lee.webp" alt="" width="120" height="123" /><p>Tu cuaderno está listo para tu primera idea o desarrollo a mano.</p></div>'
    }</div>`;

  attachNewNotePhotoListener();

  $("#note-form").onsubmit = (e) => {
    e.preventDefault();
    const text = $("#note") ? $("#note").value.trim() : "";
    if (!text && !pendingNotePhoto) return;
    state.notes.unshift({
      title: "Mi nota",
      text: text || "Foto de cuaderno",
      at: Date.now(),
      ...(pendingNotePhoto ? { image: pendingNotePhoto } : {}),
    });
    pendingNotePhoto = null;
    save();
    notebook();
    const status = $("#note-status");
    if (status) {
      status.textContent = storageFailed
        ? "Nota añadida a esta sesión."
        : "Nota guardada.";
    }
  };
}

let pendingTaskPhoto = null;
function taskPhotoHtml() {
  return `<label for="task-photo-input" class="photo-btn-secondary"><span>📷</span> ${
    pendingTaskPhoto
      ? "✓ Foto de tu cuaderno seleccionada"
      : "Subir foto de tu ejercicio en el cuaderno (opcional)"
  }</label><input type="file" id="task-photo-input" accept="image/*" capture="environment" class="visually-hidden">${
    pendingTaskPhoto
      ? '<button type="button" data-action="remove-task-photo" class="btn-remove-photo" style="display:inline-block;margin-left:10px;">✕ Quitar</button>'
      : ""
  }`;
}
function attachTaskPhotoListener() {
  const taskPhotoInput = $("#task-photo-input");
  if (taskPhotoInput) {
    taskPhotoInput.onchange = async (e) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const compressed = await compressImage(file);
      if (compressed) {
        pendingTaskPhoto = compressed;
        updateTaskPhotoArea();
      }
    };
  }
}
function updateTaskPhotoArea() {
  const area = $("#task-photo-area");
  if (!area) return;
  area.innerHTML = taskPhotoHtml();
  attachTaskPhotoListener();
}
function task() {
  app.innerHTML =
    heading(
      "DEL CUADERNO A LA PRÁCTICA",
      "Trae tu ejercicio.",
      "Practica una ecuación lineal y conecta lo aprendido con tu ruta.",
    ) +
    `<section class="card"><div class="callout callout-owl"><img class="owl-inline-sm" src="buho-duda.webp" alt="" width="66" height="60" /><div>Esta versión admite ecuaciones lineales de la forma ax + b = cx + d. Puedes resolver a mano en tu cuaderno y subir una foto de tu desarrollo.</div></div><form id="task-form"><label for="equation">Tu ecuación</label><input id="equation" placeholder="2x + 3 = 15" required maxlength="150"><p class="task-examples">También puedes probar: 4x + 2 = 2x + 18, o −3x + 6 = 12.</p><div id="task-photo-area" class="task-photo-option">${taskPhotoHtml()}</div><div class="actions" style="margin-top:16px;"><button class="primary" type="submit">Preparar mi práctica →</button></div></form><div id="task-result" class="task-result" aria-live="polite"></div></section>`;

  attachTaskPhotoListener();

  $("#task-form").onsubmit = (e) => {
    e.preventDefault();
    const equation = $("#equation").value.trim(),
      result = solveLinear(equation);
    if (!result) {
      $("#task-result").textContent =
        "No puedo interpretar esa expresión. Usa una ecuación lineal como 2x + 3 = 15, sin paréntesis ni fracciones.";
      return;
    }
    if (result.kind !== "unique") {
      $("#task-result").textContent =
        result.kind === "infinite"
          ? "Ambos lados son equivalentes: cualquier valor de x satisface esta ecuación."
          : "Esta ecuación no tiene solución: al cancelar x, los números de ambos lados no coinciden.";
      return;
    }
    const photoToPass = pendingTaskPhoto;
    pendingTaskPhoto = null;
    session = {
      lesson: defaultLessons[0],
      mode: "task",
      questions: [
        [
          equation,
          result.answer,
          "Encuentra x y registra tu procedimiento a mano o en texto.",
          `Agrupa las x en un lado y las constantes en el otro: ${result.a}x = ${result.b}.`,
          `Divide ambos lados entre ${result.a}: x = ${result.answer}.`,
        ],
      ],
      index: 0,
      hints: 0,
      wrong: 0,
      results: [],
      answered: false,
      workPhoto: photoToPass,
      lastPhoto: null,
      lastWork: null,
    };
    renderExercise();
  };
}
// Custom tasks record practice but never complete a curated lesson or certify mastery.
function finishTask() {
  const s = session;
  if (
    s.results.some((r) => !r.independent) &&
    !state.reviews.some((r) => r.lesson === "equations")
  )
    state.reviews.push({ lesson: "equations", due: Date.now() });
  save();
  app.innerHTML = `<section class="card summary">${heading("PRÁCTICA PERSONAL", "Tu ejercicio está resuelto.", "Este intento se guardó como práctica. Continúa con la ruta para afianzar el método.")}<div class="callout">${escape(s.questions[0][4])}</div><div class="actions">${button("Volver a mi ruta", "exit", "primary")}${button("Otro ejercicio", "go:tarea")}</div></section>`;
  session = null;
}
enableDrag(app, (from, to) => playGame(`drop:${from}:${to}`));
app.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const [action, id] = b.dataset.action.split(":");
  if (action === "lesson") {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson || isLocked(lesson)) return;
    start(id);
  } else if (action === "sheet") {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson || isLocked(lesson)) return;
    startSheet(id);
  } else if (action === "sheet-hint") {
    sheetHint(Number(id));
  } else if (action === "sheet-reveal") {
    sheetReveal(Number(id));
  } else if (action === "sheet-concept") {
    if (session?.mode === "sheet") {
      pauseSheetTimer(session);
      renderIntroLesson(true);
    }
  } else if (action === "sheet-remove-photo") {
    if (session?.mode === "sheet") {
      session.workPhoto = null;
      session.photoFeedback = "";
      updateSheetPhotoArea();
    }
  } else if (action === "sheet-review-photo") {
    reviewSheetPhoto();
  } else if (action === "print-sheet") {
    window.print?.();
  } else if (action === "daily") startDaily();
  else if (action === "starter") {
    const box = $("#reflection-summary");
    if (box && !box.disabled && STARTERS[id]) {
      box.value = box.value.trim() ? `${box.value.trim()} ${STARTERS[id]}` : STARTERS[id];
      box.focus?.();
    }
  }
  else if (action === "goal") {
    state.dailyGoal = Number(id);
    save();
    route();
  } else if (action === "diagnostic") diagnosticPicker();
  else if (action === "diagnostic-grade") startDiagnostic(id);
  else if (action === "review") {
    if (state.reviews.some((r) => r.lesson === id && r.due <= Date.now()))
      start(id, "review");
  } else if (action === "hint") hint();
  else if (action === "game") playGame(b.dataset.action.slice(5));
  else if (action === "next") next();
  else if (action === "skip" && session && !session.answered) {
    session.results.push({
      lesson: (session.plan?.[session.index] ?? session.lesson).id,
      independent: false,
    });
    session.answered = true;
    next();
  } else if (action === "exit") {
    session = null;
    location.hash = "ruta";
    route();
  } else if (action === "go") {
    if (location.hash === "#" + id) navigate();
    else location.hash = id;
  } else if (action === "filter") {
    currentLevel = id;
    route();
  } else if (action === "kumon-level") {
    currentKumonLevel = id;
    route();
  } else if (action === "subject") {
    currentSubject = id;
    route();
  } else if (action === "reset-filters") {
    currentLevel = "all";
    currentKumonLevel = "all";
    currentSubject = "all";
    route();
  } else if (action === "begin-exercises") {
    if (session) {
      session.showingIntro = false;
      renderExercise();
    }
  } else if (action === "demo-signup") {
    try {
      endSession(localStorage);
    } catch {}
    location.assign("./?registro");
  } else if (action === "toggle-rewards") {
    try {
      localStorage.setItem(REWARDS_KEY, fullRewards() ? "simple" : "full");
    } catch {}
    route();
  } else if (action === "toggle-auto-read") {
    setAutoRead(!autoRead());
    for (const b of document.querySelectorAll(".auto-read-btn")) {
      b.textContent = autoRead() ? "🔁 Leer siempre: sí" : "🔁 Leer siempre: no";
      b.setAttribute("aria-pressed", String(autoRead()));
    }
    if (autoRead()) speakTarget(session?.showingIntro ? (session.introSpeakTarget ?? "concept") : "question");
    else stopSpeaking();
  } else if (action === "intro-next" || action === "intro-prev") {
    if (session) {
      session.introStep = Math.max(0, (session.introStep ?? 0) + (action === "intro-next" ? 1 : -1));
      renderIntroLesson();
      window.scrollTo?.(0, 0);
    }
  } else if (action === "view-intro") {
    if (session) renderIntroLesson(true);
  } else if (action === "return-exercise") {
    if (session?.mode === "sheet") renderSheet();
    else if (session) renderExercise();
  } else if (action === "remove-photo") {
    if (session) {
      session.workPhoto = null;
      session.lastPhoto = null;
    }
    updatePhotoContainer();
  } else if (action === "remove-new-note-photo") {
    pendingNotePhoto = null;
    updateNewNotePhotoArea();
  } else if (action === "remove-task-photo") {
    pendingTaskPhoto = null;
    updateTaskPhotoArea();
  } else if (action === "zoom-photo") {
    showPhotoModal(Number(id));
  } else if (action === "warmup") {
    startWarmup();
  } else if (action === "reveal") {
    reveal();
  } else if (action === "key") {
    typeKey(id);
  } else if (action === "speak") {
    speakTarget(id);
  } else if (action === "play-video") {
    playVideo(id);
  } else if (action === "unit-guide") {
    showUnitGuide(id, { lessons, state });
  } else if (action === "close-unit-guide") {
    const dlg = $("#unit-guide-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  } else if (action === "parent-report") {
    showParentReport({
      state,
      completedCount: activeCompleted().length,
      masteredCount: activeMastered().length,
    });
  } else if (action === "close-parent-report") {
    const dlg = $("#parent-report-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  } else if (action === "rewards-modal" || action === "habitribu-modal") {
    showRewardsModal(state, account);
  } else if (action === "close-rewards" || action === "close-habitribu") {
    const dlg = $("#rewards-dialog") || $("#habitribu-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  }
});
const contentLink = document.querySelector('[data-nav="contenido"]');
if (contentLink) contentLink.hidden = !isAdmin;
if (synced) {
  $("#privacy-summary").textContent =
    "Tu progreso se guarda en este navegador y en tu cuenta, para continuar en otros dispositivos. Tus fotos quedan solo en este dispositivo. Si vinculaste a tu apoderado, ve cuántas lecciones completas y dominas, cuánto practicas y cuántos videos viste, no tus notas ni fotos. Para mejorar las lecciones se cuentan, sin tu nombre ni tu cuenta, los aciertos, errores y pistas de cada ejercicio.";
  $("#privacy-delete-note").textContent =
    "Borrar el progreso lo elimina aquí y en tu cuenta. Eliminar la cuenta borra además tus datos personales y tus vínculos familiares. Si eres apoderado, también se eliminan las cuentas de estudiantes que creaste.";
  $("#delete-account").hidden = false;
  const pwSection = $("#password-section");
  if (pwSection) pwSection.hidden = Boolean(account.managedByParent);
  // Identificador de la cuenta, para configurar administradores (ADMIN_IDS).
  const id = document.createElement("p");
  id.className = "muted";
  id.textContent = `Identificador de tu cuenta: ${account.userId}`;
  $("#privacy-delete-note").after(id);
}
const pwForm = $("#change-password-form");
if (pwForm) {
  pwForm.onsubmit = async (e) => {
    e.preventDefault();
    const status = $("#password-status");
    const button = pwForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(pwForm));
    status.className = "feedback";
    if (String(data.newPassword || "").length < 8) {
      status.textContent = "La nueva contraseña debe tener al menos 8 caracteres.";
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      status.textContent = "Las contraseñas nuevas no coinciden.";
      return;
    }
    status.textContent = "";
    button.disabled = true;
    try {
      await api.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      pwForm.reset();
      status.className = "feedback good";
      status.textContent = "Contraseña actualizada. Se cerraron tus otras sesiones.";
    } catch (err) {
      status.textContent = err.message;
    } finally {
      button.disabled = false;
    }
  };
}
$("#delete-account").onclick = async () => {
  if (
    !window.confirm(
      "¿Eliminar tu cuenta? Se borran tu nombre, correo, progreso y vínculos familiares (y las cuentas de estudiantes que creaste). No se puede deshacer.",
    )
  )
    return;
  try {
    await api.deleteAccount();
    try {
      localStorage.removeItem(stateKey);
      localStorage.removeItem(photosKey(stateKey));
      localStorage.removeItem(coachKey);
      endSession(localStorage);
    } catch {}
    location.replace("./");
  } catch (err) {
    $("#privacy-error").textContent = err.message;
  }
};
$("#privacy").onclick = () => $("#privacy-dialog").showModal();
$("#close-privacy").onclick = () => $("#privacy-dialog").close();
$("#delete-data").onclick = () => {
  state = freshState();
  try {
    localStorage.removeItem(coachKey);
  } catch {}
  save();
  session = null;
  currentLevel = "all";
  currentKumonLevel = "all";
  currentSubject = "all";
  $("#privacy-dialog").close();
  location.hash = "ruta";
  navigate();
};
window.addEventListener("hashchange", navigate);
navigate();
refreshCatalog();
// Quien deja la app abierta recibe el contenido nuevo al volver a ella.
if (typeof document.addEventListener === "function")
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseSheetTimer();
    else {
      resumeSheetTimer();
      refreshCatalog();
    }
  });
if (synced) {
  pullProgress();
  window.addEventListener("online", pushProgress);
}
