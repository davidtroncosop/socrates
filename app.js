import { curriculumLessons } from "./curriculum.js";
const independentLessons = new Set(curriculumLessons.map((l) => l.id));
import {
  lessons as defaultLessons,
  isCorrect,
  parseNumber,
  solveLinear,
  freshState,
  loadState,
  getSubject,
  compressImage,
} from "./learning.js";
import { readCatalog, seedCatalog, writeCatalog } from "./content.js";
import { createAdmin } from "./admin.js";
let catalog,
  catalogWarning = "";
try {
  catalog = readCatalog(localStorage);
} catch {
  catalog = seedCatalog();
  catalogWarning =
    "No se pudo leer el catálogo guardado. Se muestra el contenido inicial; exporta un respaldo antes de guardar cambios.";
}
let lessons = catalog.lessons.filter((l) => l.status === "published");
let admin;
function contentManager() {
  admin ??= createAdmin({
    app,
    getCatalog: () => catalog,
    warning: () => catalogWarning,
    commit: (next) => {
      const saved = writeCatalog(localStorage, next);
      catalog = saved;
      lessons = catalog.lessons.filter((l) => l.status === "published");
      catalogWarning = "";
      updateBadge();
    },
  });
  admin.render();
}
const activeReviews = () =>
  state.reviews.filter((r) => lessons.some((l) => l.id === r.lesson));
const activeCompleted = () =>
  state.completed.filter((id) => lessons.some((l) => l.id === id));
const activeMastered = () =>
  state.mastered.filter((id) => lessons.some((l) => l.id === id));
const $ = (s) => document.querySelector(s),
  app = $("#app");
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state;
try {
  state = loadState(localStorage, catalog.lessons);
} catch {
  state = freshState();
}
let session = null,
  storageFailed = false,
  currentLevel = "all",
  currentSubject = "all";
function save() {
  try {
    localStorage.setItem("socatres.v1", JSON.stringify(state));
  } catch {
    storageFailed = true;
  }
  updateBadge();
  if (storageFailed && !$(".storage-warning")) {
    const n = document.createElement("div");
    n.className = "storage-warning";
    n.textContent =
      "El navegador no permite guardar. Tu progreso se conservará solo mientras esta página esté abierta.";
    $(".topbar").after(n);
  }
}
function updateBadge() {
  $("#review-count").textContent = activeReviews().filter(
    (r) => r.due <= Date.now(),
  ).length;
}
function button(text, action, cls = "") {
  return `<button class="${cls}" data-action="${action}">${text}</button>`;
}
function heading(eye, title, desc) {
  return `<div class="eyebrow">${escape(eye)}</div><h1>${escape(title)}</h1><p class="intro">${escape(desc)}</p>`;
}
function navigate() {
  session = null;
  const page = location.hash.slice(1) || "ruta";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const active = a.dataset.nav === page;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  (
    ({
      ruta: route,
      repaso: reviews,
      cuaderno: notebook,
      tarea: task,
      contenido: contentManager,
    })[page] || route
  )();
  updateBadge();
}
export const UNIT_DEFINITIONS = [
  {
    id: "unit-math-1",
    unitNumber: 1,
    subject: "matematica",
    theme: "theme-emerald",
    subtitle: "Unidad 1 · 7° Básico",
    title: "Álgebra y el Principio de la Balanza",
    description: "Despeje de incógnitas manteniendo la igualdad, suma de enteros en Z y términos semejantes.",
    concepts: "Una ecuación es una balanza en equilibrio perfecto: el signo igual (=) expresa que ambos platillos pesan lo mismo. Para despejar la incógnita x, se aplican operaciones inversas a ambos lados.",
    rule: "⚖️ Regla de oro de la balanza: Cualquier operación (sumar, restar, multiplicar o dividir) que apliques al lado izquierdo, debes aplicarla exactamente igual al lado derecho para conservar la igualdad.",
    notebookTip: "Escribe cada paso en una línea nueva de tu cuaderno, alineando verticalmente los signos igual (=). Así comprobarás que la balanza nunca se desequilibra.",
    lessonIds: ["equations", "enteros", "semejantes", "proporciones", "porcentajes"],
  },
  {
    id: "unit-math-2",
    unitNumber: 2,
    subject: "matematica",
    theme: "theme-blue",
    subtitle: "Unidad 2 · 8° Básico",
    title: "Distribución, Signos y Racionales",
    description: "Paréntesis, regla de los signos, incógnitas en ambos miembros y ecuaciones fraccionarias.",
    concepts: "Al distribuir factores con paréntesis, el término exterior multiplica a cada término interior: a(b + c) = ab + ac. Recuerda que (-) × (-) = (+) y (-) × (+) = (-).",
    rule: "🎯 Método de distribución: Elimina primero los paréntesis multiplicando signo por signo, reduce términos semejantes en cada lado y luego traslada las incógnitas.",
    notebookTip: "Encierra en un círculo las incógnitas y en un cuadrado los números libres antes de moverlos para no confundir signos en tu hoja.",
    lessonIds: ["signs", "both", "racionales", "combinadas"],
  },
  {
    id: "unit-math-3",
    unitNumber: 3,
    subject: "matematica",
    theme: "theme-purple",
    subtitle: "Unidad 3 · 7° y 8° Básico",
    title: "Geometría, Círculos y Probabilidad",
    description: "Perímetros, áreas de círculos con π, Teorema de Pitágoras y frecuencias relativas.",
    concepts: "La circunferencia es el contorno (longitud 2πr) y el círculo es la superficie interior (área πr²). En triángulos rectángulos, el Teorema de Pitágoras (a² + b² = c²) relaciona catetos con hipotenusa.",
    rule: "📐 Identifica la hipotenusa: Es el lado opuesto al ángulo recto de 90° y el más extenso. Va sola en un miembro de la igualdad: a² + b² = c².",
    notebookTip: "Dibuja siempre la figura en tu cuaderno anotando las medidas conocidas en cada lado antes de calcular fórmulas.",
    lessonIds: ["circulos", "pitagoras", "probabilidad-experimental"],
  },
  {
    id: "unit-math-4",
    unitNumber: 4,
    subject: "matematica",
    theme: "theme-rose",
    subtitle: "Unidad 4 · 8° y 1° Medio",
    title: "Potencias, Funciones y Modelamiento",
    description: "Propiedades de exponentes, pendiente y función afín, productos notables y problemas reales.",
    concepts: "Las potencias representan multiplicaciones reiteradas de una base. La función afín f(x) = mx + n modela fenómenos con tasa de cambio constante (m) y punto de partida (n).",
    rule: "📈 Modelamiento algebraico: Define con precisión la variable independiente (x) y la dependiente (y) antes de plantear la ecuación.",
    notebookTip: "Crea una pequeña tabla de valores (x versus y) en tu cuaderno para comprobar la tasa de variación antes de responder.",
    lessonIds: ["potencias", "funcion", "notables", "problemas"],
  },
  {
    id: "unit-lang-1",
    unitNumber: 1,
    subject: "lenguaje",
    theme: "theme-emerald",
    subtitle: "Unidad 1 · 5° a 7° Básico",
    title: "Estrategias de Lectura y Narraciones",
    description: "Resumir ideas principales, evaluar fuentes no literarias y analizar la estructura narrativa.",
    concepts: "Comprender un texto requiere distinguir lo esencial de lo accesorio: extraer la idea central de cada párrafo y evaluar la confiabilidad de las fuentes. En relatos, los personajes enfrentan conflictos que impulsan la trama.",
    rule: "💡 Estrategia de comprensión: Antes de responder, busca la evidencia directa en el texto o deduce las intenciones implícitas de los personajes.",
    notebookTip: "Anota en tu cuaderno una lista breve de personajes y resume el conflicto principal en una sola frase sintética.",
    lessonIds: ["lectura-estrategias-5b", "lectura-noliterarios-6b", "lectura-narraciones"],
  },
  {
    id: "unit-lang-2",
    unitNumber: 2,
    subject: "lenguaje",
    theme: "theme-amber",
    subtitle: "Unidad 2 · 7° y 8° Básico",
    title: "Dilemas Literarios y Figuras Poéticas",
    description: "Interpretar dilemas morales, figuras retóricas en poesía y motivaciones de personajes.",
    concepts: "La literatura nos sitúa ante dilemas humanos complejos donde los valores entran en tensión. En poesía, figuras como la metáfora, la personificación y la comparación dotan al lenguaje de sentidos figurados.",
    rule: "🎭 Sentido figurado: No leas la poesía solo literalmente; pregúntate qué emoción o imagen busca evocar el hablante lírico.",
    notebookTip: "Escribe en tu cuaderno la figura literaria detectada y explica con tus propias palabras qué significado transmite.",
    lessonIds: ["lectura-interpretacion", "lectura-figuras-8b", "lectura-conflictos-8b"],
  },
  {
    id: "unit-lang-3",
    unitNumber: 3,
    subject: "lenguaje",
    theme: "theme-cyan",
    subtitle: "Unidad 3 · 7° a 1° Medio",
    title: "Argumentación, Medios y Lectura Crítica",
    description: "Reconocer posturas y argumentos, evaluar medios masivos, símbolos y falacias argumentativas.",
    concepts: "Un texto argumentativo sostiene una tesis mediante razones y evidencias. En noticias y publicidad, es fundamental diferenciar entre hechos comprobables y opiniones subjetivas o falacias persuasivas.",
    rule: "🔍 Pensamiento crítico: Ante cualquier afirmación, pregúntate: ¿Qué evidencia comprobable la respalda? ¿Es un hecho o una opinión?",
    notebookTip: "Dibuja un esquema de dos columnas en tu cuaderno: a la izquierda la tesis y a la derecha los argumentos y evidencias aportadas.",
    lessonIds: ["lectura-argumentos", "lectura-medios", "lectura-simbolos-1m", "lectura-critica-1m"],
  },
];

function getUnitsForLessons(lessonsList) {
  const assignedLessonIds = new Set();
  const units = UNIT_DEFINITIONS.map((def) => {
    const unitLessons = def.lessonIds
      .map((id) => lessonsList.find((l) => l.id === id))
      .filter(Boolean);
    unitLessons.forEach((l) => assignedLessonIds.add(l.id));
    return {
      ...def,
      lessons: unitLessons,
    };
  });

  const unassigned = lessonsList.filter((l) => !assignedLessonIds.has(l.id));
  if (unassigned.length > 0) {
    units.push({
      id: "unit-custom",
      unitNumber: units.length + 1,
      subject: "all",
      theme: "theme-slate",
      subtitle: "Unidad Adicional · Lecciones Complementarias",
      title: "Actividades Complementarias",
      description: "Lecciones y contenidos adicionales disponibles en tu catálogo.",
      concepts: "Estas actividades complementan tu recorrido de aprendizaje y práctica.",
      rule: "🌟 Continúa practicando paso a paso para afianzar cada concepto en tu cuaderno.",
      notebookTip: "Lleva registro ordenado de tus ejercicios en tu cuaderno de apuntes.",
      lessonIds: unassigned.map((l) => l.id),
      lessons: unassigned,
    });
  }
  return units;
}

function showUnitGuide(unitId) {
  const allUnits = getUnitsForLessons(lessons);
  const unit = allUnits.find((u) => u.id === unitId);
  if (!unit) return;
  const dialog = $("#unit-guide-dialog");
  const content = $("#unit-guide-content") || dialog;
  if (!content) return;
  const isLang = unit.subject === "lenguaje";
  content.innerHTML = `
    <div class="unit-guide-modal ${unit.theme}">
      <div class="unit-guide-header">
        <span class="unit-guide-badge">${escape(unit.subtitle)}</span>
        <h2>${escape(unit.title)}</h2>
        <p>${escape(unit.description)}</p>
      </div>
      <div class="unit-guide-body">
        <section class="unit-guide-section">
          <h3>💡 Conceptos clave de la unidad</h3>
          <p>${escape(unit.concepts)}</p>
        </section>
        <section class="unit-guide-section rule-box">
          <h3>${isLang ? "🎯 Clave pedagógica" : "⚖️ Regla pedagógica fundamental"}</h3>
          <div class="unit-guide-rule">
            ${escape(unit.rule)}
          </div>
        </section>
        <section class="unit-guide-section notebook-box">
          <h3>✍️ Cómo trabajar en tu cuaderno</h3>
          <p>${escape(unit.notebookTip)}</p>
        </section>
        <section class="unit-guide-section">
          <h3>📚 Lecciones de esta unidad</h3>
          <ul class="unit-guide-lesson-list">
            ${unit.lessons
              .map((l) => {
                const done = state.completed.includes(l.id);
                const mastered = state.mastered.includes(l.id);
                return `<li>
                  <span class="ug-status-icon">${mastered ? "👑" : done ? "✓" : "○"}</span>
                  <div>
                    <strong>${escape(l.title)}</strong>
                    <small>${mastered ? "Dominio confirmado en repaso" : done ? "Completada" : "Pendiente"}</small>
                  </div>
                </li>`;
              })
              .join("")}
          </ul>
        </section>
      </div>
      <div class="unit-guide-footer">
        <button id="close-unit-guide" class="primary" data-action="close-unit-guide">¡Entendido! Continuar aprendiendo</button>
      </div>
    </div>
  `;
  if (dialog && typeof dialog.showModal === "function") {
    dialog.showModal();
    const closeBtn = $("#close-unit-guide");
    if (closeBtn) closeBtn.onclick = () => dialog.close();
  }
}

export function getStreakInfo(state) {
  const datesSet = new Set();
  if (Array.isArray(state?.attempts)) {
    for (const a of state.attempts) {
      if (a && typeof a.at === "number") {
        datesSet.add(new Date(a.at).toISOString().slice(0, 10));
      }
    }
  }
  if (Array.isArray(state?.notes)) {
    for (const n of state.notes) {
      if (n && typeof n.at === "number") {
        datesSet.add(new Date(n.at).toISOString().slice(0, 10));
      }
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (datesSet.size === 0) {
    return { streak: 1, practicedToday: false, hasFreeze: true, freezeUsed: false };
  }

  const practicedToday = datesSet.has(todayStr);
  let streak = 0;
  let freezeUsed = false;

  let checkTime = practicedToday ? Date.now() : Date.now() - 86400000;
  while (true) {
    const dStr = new Date(checkTime).toISOString().slice(0, 10);
    if (datesSet.has(dStr)) {
      streak++;
      checkTime -= 86400000;
    } else if (!freezeUsed && streak > 0) {
      // 1-day streak freeze (protector de racha)
      freezeUsed = true;
      checkTime -= 86400000;
    } else {
      break;
    }
  }

  return {
    streak: Math.max(1, streak),
    practicedToday,
    hasFreeze: !freezeUsed,
    freezeUsed,
  };
}

export function getXpAndFichas(state) {
  const completedXP = (state?.completed ? state.completed.length : 0) * 20;
  const masteredXP = (state?.mastered ? state.mastered.length : 0) * 25;
  const correctXP = (state?.attempts ? state.attempts.filter((a) => a.correct).length : 0) * 10;
  const notesXP = (state?.notes ? state.notes.length : 0) * 15;
  const totalXP = completedXP + masteredXP + correctXP + notesXP;

  const fichas = Math.floor(totalXP / 100);
  const xpToNextFicha = 100 - (totalXP % 100);

  return {
    totalXP,
    completedXP,
    masteredXP,
    correctXP,
    notesXP,
    fichas,
    fichasHabitribu: fichas,
    xpToNextFicha,
  };
}

export function getBeltInfo(lessonId, state) {
  if (state?.mastered?.includes(lessonId)) {
    return { level: "oro", name: "Cinturón Oro", icon: "👑", badgeClass: "belt-oro", desc: "Dominio confirmado en repaso" };
  }
  if (state?.completed?.includes(lessonId)) {
    return { level: "plata", name: "Cinturón Plata", icon: "🥈", badgeClass: "belt-plata", desc: "Completada · lista para consolidar" };
  }
  if (state?.attempts?.some((a) => a.lesson === lessonId)) {
    return { level: "bronce", name: "Cinturón Bronce", icon: "🥉", badgeClass: "belt-bronce", desc: "En entrenamiento activo" };
  }
  return { level: "blanco", name: "Cinturón Blanco", icon: "⚪", badgeClass: "belt-blanco", desc: "Por iniciar" };
}

function showParentReport() {
  const dialog = $("#parent-report-dialog");
  const content = $("#parent-report-content") || dialog;
  if (!content) return;

  const streakInfo = getStreakInfo(state);
  const xpInfo = getXpAndFichas(state);
  const completedCount = activeCompleted().length;
  const masteredCount = activeMastered().length;
  const notesCount = state?.notes ? state.notes.length : 0;

  // Calculate unique days in last 7 days
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentDates = new Set();
  if (Array.isArray(state?.attempts)) {
    state.attempts
      .filter((a) => a.at >= sevenDaysAgo)
      .forEach((a) => recentDates.add(new Date(a.at).toISOString().slice(0, 10)));
  }
  if (Array.isArray(state?.notes)) {
    state.notes
      .filter((n) => n.at >= sevenDaysAgo)
      .forEach((n) => recentDates.add(new Date(n.at).toISOString().slice(0, 10)));
  }
  const weeklyDays = Math.max(1, recentDates.size);
  const estimatedMins = weeklyDays * 11;

  const whatsappMsg = `*Reporte de Progreso en Tutorai 🚀*\n` +
    `• Días de práctica esta semana: ${weeklyDays} de 7 días (~${estimatedMins} min totales)\n` +
    `• Racha activa: ${streakInfo.streak} días seguidos 🔥\n` +
    `• Lecciones completadas: ${completedCount} lecciones\n` +
    `• Habilidades dominadas: ${masteredCount} con Cinturón de Oro 👑\n` +
    `• Ejercicios a mano en cuaderno: ${notesCount} fotos de desarrollo ✍️\n` +
    `• Fichas de premio ganadas: ${xpInfo.fichas} fichas 🪙 (${xpInfo.totalXP} XP)\n\n` +
    `_¡Completado de forma autónoma sin peleas por las tareas!_`;

  content.innerHTML = `
    <div class="parent-report-modal">
      <div class="parent-report-header">
        <div class="parent-report-badge">👨‍👩‍👦 INFORME SEMANAL PARA PAPÁS</div>
        <h2>Así va el aprendizaje de tu hijo</h2>
        <p>Visibilidad clara y tranquilidad: mira cómo avanza de forma autónoma, sin supervisión agotadora ni discusiones por las tareas.</p>
      </div>
      <div class="parent-report-body">
        <div class="parent-metrics-grid">
          <div class="parent-metric-card">
            <span class="pm-icon">🔥</span>
            <div class="pm-val">${streakInfo.streak} día${streakInfo.streak > 1 ? "s" : ""}</div>
            <div class="pm-lbl">Racha activa ${streakInfo.hasFreeze ? "🛡️ (Protector activo)" : ""}</div>
          </div>
          <div class="parent-metric-card">
            <span class="pm-icon">⏱️</span>
            <div class="pm-val">~${estimatedMins} min</div>
            <div class="pm-lbl">Tiempo semanal invertido</div>
          </div>
          <div class="parent-metric-card">
            <span class="pm-icon">✍️</span>
            <div class="pm-val">${notesCount} fotos</div>
            <div class="pm-lbl">Desarrollos a mano en cuaderno</div>
          </div>
          <div class="parent-metric-card">
            <span class="pm-icon">👑</span>
            <div class="pm-val">${masteredCount} Oro</div>
            <div class="pm-lbl">Cinturones de dominio confirmados</div>
          </div>
        </div>

        <div class="parent-report-box pedagogical-box">
          <h3>⚖️ Enfoque pedagógico y hábito de estudio en papel</h3>
          <p>Tu hijo practica resolviendo a mano en su cuaderno y subiendo fotos de su desarrollo. En matemática aplica el <strong>Principio de la Balanza en Equilibrio</strong> y en lenguaje estrategias de inferencia y comprensión basadas en las <strong>Bases Curriculares del MINEDUC</strong>.</p>
        </div>

        <div class="parent-report-box habitribu-box rewards-box">
          <div class="pr-ht-header">
            <span class="pr-ht-coin">🪙</span>
            <div>
              <strong>${xpInfo.fichas} Fichas ganadas para premios en casa</strong>
              <p>Cada 100 XP acumulados reflejan constancia y esfuerzo que pueden canjear en familia por privilegios acordados (videojuegos, elegir la cena, salidas).</p>
            </div>
          </div>
        </div>
      </div>
      <div class="parent-report-footer">
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-share">
          <span>📲 Enviar reporte por WhatsApp a Papá / Mamá</span>
        </a>
        <button id="close-parent-report" class="secondary" data-action="close-parent-report">Cerrar</button>
      </div>
    </div>
  `;

  if (dialog && typeof dialog.showModal === "function") {
    dialog.showModal();
    const closeBtn = $("#close-parent-report");
    if (closeBtn) closeBtn.onclick = () => dialog.close();
  }
}

function showRewardsModal() {
  const dialog = $("#rewards-dialog") || $("#habitribu-dialog");
  const content = $("#rewards-content") || $("#habitribu-content") || dialog;
  if (!content) return;

  const xpInfo = getXpAndFichas(state);
  const claimMsg = `*¡Canje de Fichas de Premio en Casa! 🪙*\n` +
    `Hola Papá/Mamá, he ganado ${xpInfo.fichas} fichas en Tutorai practicando (${xpInfo.totalXP} XP totales) 🚀\n` +
    `¿Podemos canjear mis fichas por un premio acordado de la semana? 🎮🍕🎬`;

  content.innerHTML = `
    <div class="habitribu-modal rewards-modal">
      <div class="habitribu-modal-header rewards-modal-header">
        <span class="habitribu-badge rewards-badge">🪙 PREMIOS Y RECOMPENSAS FAMILIARES</span>
        <h2>Tus Premios Familiares</h2>
        <p>Tu esfuerzo estudiando se convierte en fichas reales para canjear en casa por privilegios acordados con tu familia.</p>
      </div>
      <div class="habitribu-modal-body rewards-modal-body">
        <div class="ht-balance-card">
          <div class="ht-coin-large">🪙</div>
          <div class="ht-balance-details">
            <span class="ht-balance-number">${xpInfo.fichas} Fichas de premio</span>
            <span class="ht-balance-sub">Equivalentes a ${xpInfo.totalXP} XP de esfuerzo y práctica acumulada</span>
            <div class="bar mini-bar" style="margin-top:8px;" title="Progreso a tu próxima ficha: ${xpInfo.totalXP % 100}/100 XP">
              <span style="width:${xpInfo.totalXP % 100}%"></span>
            </div>
            <small style="color:#64748b;font-size:11px;display:block;margin-top:4px;">
              Te faltan <strong>${xpInfo.xpToNextFicha} XP</strong> para tu siguiente ficha
            </small>
          </div>
        </div>

        <div class="ht-rewards-section">
          <h3>🎁 Catálogo sugerido de premios en casa</h3>
          <div class="ht-rewards-grid">
            <div class="ht-reward-item">
              <span class="ht-r-icon">🎮</span>
              <div>
                <strong>30 min extra de videojuegos / pantalla</strong>
                <small class="muted">Recompensa diaria por constancia</small>
              </div>
              <span class="ht-r-cost">2 fichas</span>
            </div>
            <div class="ht-reward-item">
              <span class="ht-r-icon">🍕</span>
              <div>
                <strong>Elegir la cena o comida del viernes</strong>
                <small class="muted">Para celebrar una semana de estudio</small>
              </div>
              <span class="ht-r-cost">3 fichas</span>
            </div>
            <div class="ht-reward-item">
              <span class="ht-r-icon">🎬</span>
              <div>
                <strong>Elegir la película en la noche de cine</strong>
                <small class="muted">Momento compartido en familia</small>
              </div>
              <span class="ht-r-cost">2 fichas</span>
            </div>
            <div class="ht-reward-item">
              <span class="ht-r-icon">🛹</span>
              <div>
                <strong>Tarde de parque o paseo al aire libre</strong>
                <small class="muted">Actividad de fin de semana</small>
              </div>
              <span class="ht-r-cost">4 fichas</span>
            </div>
            <div class="ht-reward-item">
              <span class="ht-r-icon">💵</span>
              <div>
                <strong>Mesada o premio semanal acordado</strong>
                <small class="muted">Premio económico por metas cumplidas</small>
              </div>
              <span class="ht-r-cost">5 fichas</span>
            </div>
          </div>
        </div>

        <div class="ht-how-it-works">
          <h4>💡 ¿Cómo funciona el canje?</h4>
          <p>Ponte de acuerdo con tus papás sobre el valor de cada ficha en casa. Cada vez que resuelves lecciones, subes fotos de tu cuaderno o confirmas coronas, sumas XP automáticamente.</p>
        </div>
      </div>
      <div class="habitribu-modal-footer rewards-modal-footer">
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(claimMsg)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-claim">
          <span>📲 Pedir canje a mis papás por WhatsApp</span>
        </a>
        <button id="close-rewards" class="secondary" data-action="close-rewards">Cerrar</button>
      </div>
    </div>
  `;

  if (dialog && typeof dialog.showModal === "function") {
    dialog.showModal();
    const closeBtn = $("#close-rewards") || $("#close-habitribu");
    if (closeBtn) closeBtn.onclick = () => dialog.close();
  }
}
const showHabitribuModal = showRewardsModal;

function route() {
  if (!lessons.length) {
    app.innerHTML =
      heading(
        "TU RUTA",
        "Todavía no hay lecciones publicadas.",
        "Publica contenido desde el mantenedor para comenzar.",
      ) + button("Administrar contenido", "go:contenido", "primary");
    return;
  }
  const next =
    lessons.find((l) => !state.completed.includes(l.id)) || lessons[0];
  const countMath = lessons.filter((l) => getSubject(l) === "matematica").length;
  const countLang = lessons.filter((l) => getSubject(l) === "lenguaje").length;
  const count5b = lessons.filter((l) => l.title.includes("5° Básico")).length;
  const count6b = lessons.filter((l) => l.title.includes("6° Básico")).length;
  const count7b = lessons.filter((l) => l.title.includes("7° Básico")).length;
  const count8b = lessons.filter((l) => l.title.includes("8° Básico")).length;
  const count1m = lessons.filter((l) => l.title.includes("1° Medio")).length;

  const visibleLessons = lessons.filter((l) => {
    const sub = getSubject(l);
    if (currentSubject !== "all" && sub !== currentSubject) return false;
    if (currentLevel === "5b" && !l.title.includes("5° Básico")) return false;
    if (currentLevel === "6b" && !l.title.includes("6° Básico")) return false;
    if (currentLevel === "7b" && !l.title.includes("7° Básico")) return false;
    if (currentLevel === "8b" && !l.title.includes("8° Básico")) return false;
    if (currentLevel === "1m" && !l.title.includes("1° Medio")) return false;
    return true;
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
            const originalIndex = lessons.findIndex((x) => x.id === l.id);
            const done = state.completed.includes(l.id);
            const mastered = state.mastered.includes(l.id);
            const locked =
              !independentLessons.has(l.id) &&
              originalIndex > 0 &&
              !state.completed.includes(lessons[originalIndex - 1].id);
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

            const parts = l.title.split(" · ");
            const badge =
              parts.length > 1
                ? `<span class="oa-badge">${escape(parts[0])}</span>`
                : "";
            const sub = getSubject(l);
            const isLang = sub === "lenguaje";
            const subjectBadge = `<span class="subject-tag ${isLang ? "subject-lang" : "subject-math"}">${isLang ? "📖 Lenguaje" : "📐 Matemática"}</span>`;
            const beltBadge = `<span class="belt-tag ${belt.badgeClass}" title="${belt.desc}">${belt.icon} ${belt.name}</span>`;
            const displayTitle =
              parts.length > 1 ? parts.slice(1).join(" · ") : l.title;
            const statusText = mastered
              ? "Dominio confirmado en un repaso"
              : done
                ? "Completada · por consolidar"
                : escape(l.description);

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
                      ${subjectBadge}
                      ${beltBadge}
                    </div>
                    <h3 class="duo-node-title">${escape(displayTitle)}</h3>
                    <p class="duo-node-desc">${statusText}</p>
                    <div class="duo-node-actions">
                      <button class="duo-card-btn ${isNext ? "primary" : ""}" data-action="lesson:${l.id}" ${locked ? "disabled" : ""}>${locked ? "Bloqueada" : done ? "Practicar" : "Empezar →"}</button>
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

        return `
          <section class="duo-unit ${unit.theme}">
            <header class="duo-unit-banner">
              <div class="duo-banner-left">
                <span class="duo-banner-tag">SECCIÓN ${unit.unitNumber} · ${escape(unit.subtitle)}</span>
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
          <span class="duo-flag">${currentSubject === "lenguaje" ? "📖" : currentSubject === "matematica" ? "📐" : "✦"}</span>
          <strong>${currentSubject === "lenguaje" ? "Lenguaje y Comunicación" : currentSubject === "matematica" ? "Matemática" : "Rutas Mineduc"}</strong>
        </div>
      </div>
      <div class="duo-stats-right">
        <div class="duo-stat-chip" title="Racha de práctica diaria">
          <span class="duo-chip-icon">🔥</span>
          <span class="duo-chip-value">${streakDays}</span>
          <span class="duo-chip-label">día${streakDays > 1 ? "s" : ""}</span>
          ${streakInfo.hasFreeze ? `<span class="duo-freeze-badge" title="Protector de racha activo">🛡️</span>` : ""}
        </div>
        <div class="duo-stat-chip duo-chip-xp" title="Puntos de Experiencia ganados practicando">
          <span class="duo-chip-icon">⭐</span>
          <span class="duo-chip-value">${xp}</span>
          <span class="duo-chip-label">XP</span>
        </div>
        <button class="duo-stat-chip duo-chip-rewards duo-chip-habitribu duo-chip-clickable" data-action="rewards-modal" title="Fichas para premios en casa">
          <span class="duo-chip-icon">🪙</span>
          <span class="duo-chip-value">${fichas}</span>
          <span class="duo-chip-label">fichas</span>
        </button>
        <button class="duo-stat-chip duo-chip-clickable" data-action="go:cuaderno" title="Desarrollos a mano en tu cuaderno">
          <span class="duo-chip-icon">▤</span>
          <span class="duo-chip-value">${notesCount}</span>
          <span class="duo-chip-label">cuaderno</span>
        </button>
        <button class="duo-stat-chip duo-chip-clickable ${dueCount > 0 ? "duo-chip-alert" : ""}" data-action="go:repaso" title="Repasos espaciados listos para consolidar">
          <span class="duo-chip-icon">↺</span>
          <span class="duo-chip-value">${dueCount}</span>
          <span class="duo-chip-label">repasos</span>
        </button>
        <button class="duo-stat-chip duo-chip-parent duo-chip-clickable" data-action="parent-report" title="Informe semanal de progreso para papás">
          <span class="duo-chip-icon">👨‍👩‍👦</span>
          <span class="duo-chip-label">Papás</span>
        </button>
      </div>
    </div>

    <div class="welcome-row">
      <div>${heading("UN POCO CADA DÍA", "Aprender empieza con un paso.", "Este es tu espacio para preguntar, equivocarte y volver a intentarlo.")}</div>
      <span class="pill">✦ Bases Curriculares</span>
    </div>

    <div class="dashboard">
      <div>
        <section class="hero">
          <span class="eyebrow">${state.diagnosed ? "TU SIGUIENTE PASO" : "ENCONTREMOS TU PUNTO DE PARTIDA"}</span>
          <h2>${state.diagnosed ? escape(next.title) : "¿Qué sabes ya de matemáticas y lectura?"}</h2>
          <p>${state.diagnosed ? "Practica, explica tu procedimiento en papel y termina con un desafío para resolver por tu cuenta." : `${lessons.length} preguntas breves para orientar tu recorrido según las Bases Curriculares del MINEDUC (5° Básico a 1° Medio). No es una prueba: puedes pedir ayuda.`}</p>
          <div class="hero-meta">
            <span>◷ ${state.diagnosed ? "10" : String(lessons.length)} minutos aprox.</span>
            <span>◇ ${state.diagnosed ? "4 ejercicios" : "Sin calificación"}</span>
          </div>
          ${button(state.diagnosed ? "Continuar mi ruta →" : "Descubrir mi punto de partida →", state.diagnosed ? "lesson:" + next.id : "diagnostic", "primary")}
        </section>

        <div class="section-title">
          <h2>Rutas de Aprendizaje · Bases Curriculares</h2>
          <span class="muted">${activeCompleted().length} de ${lessons.length} lecciones</span>
        </div>

        <div class="route-filter-container">
          <div class="route-filter-row">
            <span class="filter-label">Materia:</span>
            <div class="route-filters">
              <button class="filter-btn ${currentSubject === "all" ? "active" : ""}" data-action="subject:all">Todas (${lessons.length})</button>
              <button class="filter-btn subject-math-btn ${currentSubject === "matematica" ? "active" : ""}" data-action="subject:matematica">📐 Matemática (${countMath})</button>
              <button class="filter-btn subject-lang-btn ${currentSubject === "lenguaje" ? "active" : ""}" data-action="subject:lenguaje">📖 Lenguaje (${countLang})</button>
            </div>
          </div>
          <div class="route-filter-row">
            <span class="filter-label">Curso:</span>
            <div class="route-filters">
              <button class="filter-btn ${currentLevel === "all" ? "active" : ""}" data-action="filter:all">Todos</button>
              <button class="filter-btn ${currentLevel === "5b" ? "active" : ""}" data-action="filter:5b">5° Básico (${count5b})</button>
              <button class="filter-btn ${currentLevel === "6b" ? "active" : ""}" data-action="filter:6b">6° Básico (${count6b})</button>
              <button class="filter-btn ${currentLevel === "7b" ? "active" : ""}" data-action="filter:7b">7° Básico (${count7b})</button>
              <button class="filter-btn ${currentLevel === "8b" ? "active" : ""}" data-action="filter:8b">8° Básico (${count8b})</button>
              <button class="filter-btn ${currentLevel === "1m" ? "active" : ""}" data-action="filter:1m">1° Medio (${count1m})</button>
            </div>
          </div>
        </div>

        <div class="duo-units-container">
          ${unitsHTML}
        </div>
      </div>

      <aside class="stack">
        <section class="card duo-side-progress">
          <div class="mini-label">ASÍ VAS AVANZANDO</div>
          <div class="stat">${activeCompleted().length}<span class="muted"> / ${lessons.length}</span></div>
          <p class="muted">Lecciones completadas</p>
          <div class="bar"><span style="width:${lessons.length ? (activeCompleted().length / lessons.length) * 100 : 0}%"></span></div>
          <div class="subject-progress-grid">
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
          </div>
          <div class="duo-mastered-stat">
            <span class="crown-icon">👑</span>
            <span><strong>${activeMastered().length}</strong> habilidades con dominio confirmado</span>
          </div>
        </section>

        <section class="card duo-side-rewards duo-side-habitribu">
          <div class="mini-label">PREMIOS EN CASA · FICHAS</div>
          <div class="ht-side-row">
            <span class="ht-side-coin">🪙</span>
            <div>
              <div class="stat ht-side-stat">${fichas} <span class="muted">fichas</span></div>
              <p class="muted">${xp} XP acumulados por esfuerzo</p>
            </div>
          </div>
          <div class="bar mini-bar" style="margin-top:8px;" title="Progreso hacia tu siguiente ficha: ${xp % 100}/100 XP">
            <span style="width:${xp % 100}%"></span>
          </div>
          <small class="muted" style="display:block;margin-top:4px;font-size:12px;">
            Faltan <strong>${xpInfo.xpToNextFicha} XP</strong> para tu próxima ficha
          </small>
          <button class="secondary ht-side-btn" data-action="rewards-modal" style="width:100%;margin-top:10px;">Ver catálogo de premios →</button>
        </section>

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
}
const phases = [
  "Calentamiento",
  "Práctica guiada",
  "Aplicación",
  "Desafío de autonomía",
];
function start(id, mode = "lesson") {
  if (!lessons.length) return;
  const l = lessons.find((l) => l.id === id) || lessons[0];
  let questions = l.questions;
  if (mode === "diagnostic") questions = lessons.map((x) => x.questions[1]);
  if (mode === "review") questions = [l.review];
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

function renderIntroLesson(fromExercise = false) {
  const s = session,
    l = s.lesson;
  const isMath = getSubject(l) === "matematica";
  const parts = l.title.split(" · ");
  const grade = parts.length > 1 ? parts[0] : "";

  app.innerHTML = `
    ${button(
      fromExercise ? "← Volver al ejercicio" : "← Volver a mi ruta",
      fromExercise ? "return-exercise" : "exit",
      "back",
    )}
    ${heading(
      "LECCIÓN INICIAL · CONCEPTO CLAVE",
      l.title,
      l.description,
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

        <div class="pedagogical-banner ${isMath ? "math-balance" : "lang-strategy"}">
          <div class="pedagogical-banner-icon">${isMath ? "⚖️" : "💡"}</div>
          <div class="pedagogical-banner-body">
            <h3>${isMath ? "El Principio de la Balanza en Equilibrio" : "Estrategia de Comprensión Lectora"}</h3>
            <p class="pedagogical-banner-text">${escape(l.concept)}</p>
            ${
              isMath
                ? `<div class="balance-rule-highlight">
                    <strong>⚖️ Regla de oro del equilibrio:</strong>
                    <span>Una ecuación es una balanza. Cualquier operación que apliques al lado izquierdo, debes aplicarla <em>exactamente igual al lado derecho</em> para mantener el equilibrio y no alterar la igualdad.</span>
                  </div>`
                : `<div class="balance-rule-highlight">
                    <strong>🎯 Clave de comprensión:</strong>
                    <span>Lee con calma, identifica las pistas explícitas e implícitas en el texto y fundamenta tu respuesta antes de elegir una opción.</span>
                  </div>`
            }
          </div>
        </div>

        <div class="intro-example-card">
          <div class="intro-example-header">
            <span class="example-pill">Ejemplo modelo guiado</span>
            <h3>¿Cómo se resuelve paso a paso?</h3>
          </div>
          <div class="intro-example-content">
            <p class="intro-example-text">${escape(l.examples)}</p>
            ${
              isMath
                ? `<div class="intro-balance-demo">
                    <span class="demo-box">Lado izquierdo (=)</span>
                    <span class="demo-scale">⚖️ Balanza en equilibrio</span>
                    <span class="demo-box">Lado derecho</span>
                  </div>`
                : ""
            }
          </div>
        </div>

        <div class="handwritten-reminder-box">
          <span class="reminder-icon">✍️</span>
          <div>
            <strong>¡Ten listo tu cuaderno y lápiz!</strong>
            <p>Los siguientes 4 ejercicios se resuelven a mano en papel. Podrás tomar una foto de tu desarrollo para guardarla en tu cuaderno.</p>
          </div>
        </div>

        <div class="intro-lesson-actions">
          ${button(
            fromExercise
              ? `Continuar con el ejercicio (${s.index + 1} de ${s.questions.length}) →`
              : `Comenzar ejercicios (1 de ${s.questions.length}) →`,
            fromExercise ? "return-exercise" : "begin-exercises",
            "primary btn-start-exercises",
          )}
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
            <span>✧</span> Las pistas explican el porqué pedagógico y te enseñan a mantener el equilibrio.
          </div>
        </section>
      </aside>
    </div>
  `;
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

function updatePhotoContainer() {
  const container = $("#work-photo-container");
  if (!container || !session) return;
  if (session.workPhoto) {
    container.innerHTML = `<div class="work-photo-preview"><div class="work-photo-thumb-wrap"><img src="${session.workPhoto}" alt="Foto de tu desarrollo a mano" class="work-photo-thumb" /></div><div class="work-photo-details"><span class="photo-badge-success">✓ Foto de tu desarrollo adjunta</span><p class="muted" style="margin:4px 0 8px 0; font-size:12px;">Se guardará en tu cuaderno al comprobar.</p><button type="button" data-action="remove-photo" class="btn-remove-photo">✕ Eliminar o cambiar foto</button></div></div>`;
  } else {
    container.innerHTML = `<label for="work-photo-input" class="photo-upload-box" id="photo-dropzone"><span class="photo-icon">📷</span><div class="photo-upload-text"><strong>Subir foto de tu desarrollo a mano</strong><span>Toma una foto con tu cámara o elige una imagen</span></div><span class="photo-tag-pill">Sube tu foto</span></label><input type="file" id="work-photo-input" accept="image/*" capture="environment" class="visually-hidden">`;
    attachPhotoListeners();
  }
}

function renderExercise() {
  const s = session,
    q = s.questions[s.index],
    l = s.mode === "diagnostic" ? lessons[s.index] : s.lesson,
    isMath = getSubject(l) === "matematica";
  app.innerHTML = `${button("← Volver a mi ruta", "exit", "back")}${heading(
    s.mode === "diagnostic"
      ? "PUNTO DE PARTIDA"
      : s.mode === "review"
        ? "REPASO ESPACIADO"
        : "TU SESIÓN DE HOY",
    s.mode === "diagnostic"
      ? "Veamos desde dónde partimos."
      : s.lesson.title,
    s.mode === "diagnostic"
      ? "Prueba lo que sabes. Si aún no lo ves, puedes continuar sin responder."
      : "Tómate tu tiempo. Lo importante es comprender el siguiente paso.",
  )}<div class="lesson-layout"><section class="card exercise-card"><div class="mini-label">${
    s.mode === "lesson"
      ? phases[s.index]
      : s.mode === "review"
        ? "RECUPERA LO APRENDIDO"
        : "EXPLORACIÓN"
  } · ${s.index + 1} DE ${s.questions.length}</div><div class="steps">${s.questions
    .map((_, i) => `<span class="${i <= s.index ? "on" : ""}"></span>`)
    .join("")}</div><p>${escape(q[2])}</p><div class="equation ${
    q[0].includes("\n") ? "reading-passage" : ""
  }">${escape(q[0])}</div><form id="answer-form"><div class="handwritten-section"><div class="handwritten-title-row"><span class="handwritten-badge">✍️ Paso 1: Resuelve a mano</span><span class="muted">En tu cuaderno o papel</span></div><p class="handwritten-instruction">Haz el desarrollo con lápiz y papel. Sube la foto de tu cuaderno o escribe tus pasos:</p><div id="work-photo-container" class="work-photo-container">${
    s.workPhoto
      ? `<div class="work-photo-preview"><div class="work-photo-thumb-wrap"><img src="${s.workPhoto}" alt="Foto de tu desarrollo a mano" class="work-photo-thumb" /></div><div class="work-photo-details"><span class="photo-badge-success">✓ Foto de tu desarrollo adjunta</span><p class="muted" style="margin:4px 0 8px 0; font-size:12px;">Se guardará en tu cuaderno al comprobar.</p><button type="button" data-action="remove-photo" class="btn-remove-photo">✕ Eliminar o cambiar foto</button></div></div>`
      : `<label for="work-photo-input" class="photo-upload-box" id="photo-dropzone"><span class="photo-icon">📷</span><div class="photo-upload-text"><strong>Subir foto de tu desarrollo a mano</strong><span>Toma una foto con tu cámara o elige una imagen</span></div><span class="photo-tag-pill">Sube tu foto</span></label><input type="file" id="work-photo-input" accept="image/*" capture="environment" class="visually-hidden">`
  }</div><details class="work-text-details"${s.lastWork ? " open" : ""}><summary class="work-text-toggle">O escribe tus pasos en texto (opcional)</summary><div style="margin-top:8px;"><label for="work" class="visually-hidden">Tu procedimiento</label><textarea id="work" placeholder="¿Qué harías primero? Escribe tus pasos aquí…">${escape(s.lastWork || "")}</textarea></div></details><div class="muted note-save-expl">Tu desarrollo y foto se guardan automáticamente en tu cuaderno al comprobar.</div></div><div class="answer-section"><div class="handwritten-title-row"><span class="handwritten-badge answer-badge">🎯 Paso 2: Tu respuesta final</span></div><label for="answer">${
    q[0] === "5x − 2x" ? "Coeficiente" : "Tu respuesta"
  }</label><input id="answer" autocomplete="off" placeholder="${
    q[0].includes("\n") ? "Alternativa: 1, 2 o 3" : "Ej.: 7, x = 7 o 14/2"
  }" required></div><div id="feedback" aria-live="polite" class="feedback"></div><div class="actions"><button class="primary" id="check" type="submit">Comprobar respuesta →</button><button type="button" data-action="hint" id="hint-button">Necesito una pista</button>${
    s.mode === "diagnostic"
      ? '<button type="button" data-action="skip">Todavía no lo sé</button>'
      : ""
  }</div></form><div id="next-area"></div></section><aside class="stack"><section class="card pedagogical-aside-card"><div class="mini-label">💡 ENFOQUE PEDAGÓGICO</div><h3>${
    isMath ? "⚖️ Mantener el equilibrio" : "📖 Estrategia clave"
  }</h3><p class="muted" style="line-height:1.55;margin:8px 0 10px 0;">${escape(
    l.concept,
  )}</p><button type="button" class="btn-link-help" data-action="view-intro">📖 Ver lección inicial completa</button></section><section class="card"><div class="mini-icon">✧</div><h3>Tu espacio de ayuda</h3><p class="muted">Las pistas explican el porqué pedagógico de cada paso.</p><div id="hints" aria-live="polite"></div></section><section class="callout">${
    s.mode === "diagnostic"
      ? "El diagnóstico orienta tu ruta. No certifica dominio ni bloquea tu aprendizaje."
      : "Primero comprende. Después comprueba si puedes hacerlo sin ayuda."
  }</section></aside></div>`;
  $("#answer-form").addEventListener("submit", check);
  attachPhotoListeners();
}

function hint() {
  const s = session;
  if (!s || s.answered) return;
  const q = s.questions[s.index],
    l = s.mode === "diagnostic" ? lessons[s.index] : s.lesson;
  const isMath = getSubject(l) === "matematica";

  let title = "";
  let body = "";

  if (s.hints === 0) {
    title = isMath
      ? "Pista 1 · Enfoque pedagógico y equilibrio"
      : "Pista 1 · Clave de lectura";
    const balanceAdvice = isMath
      ? `<div class="hint-pedagogy-tip"><strong>⚖️ Mantén el equilibrio:</strong> Recuerda que una ecuación es una balanza. La operación que apliques a un lado debes aplicarla exactamente igual al otro para no romper la igualdad.</div>`
      : `<div class="hint-pedagogy-tip"><strong>📖 Clave de lectura:</strong> Localiza las palabras clave o ideas principales en el texto antes de deducir tu respuesta.</div>`;
    body = `<p>${escape(q[3])}</p>${balanceAdvice}`;
  } else if (s.hints === 1) {
    title = "Pista 2 · Ejemplo modelo guiado";
    body = `<p>Fíjate en cómo se resuelve este modelo paso a paso:</p><div class="hint-example-box">${escape(l.examples)}</div>`;
  } else if (s.hints === 2) {
    title = "Pista 3 · Explicación completa y comprobación";
    const balanceCheck = isMath
      ? `<div class="hint-pedagogy-tip"><strong>✓ Comprobación de la balanza:</strong> Al sustituir el valor obtenido en la ecuación original, ambos lados dan exactamente lo mismo y la igualdad se mantiene en equilibrio.</div>`
      : "";
    body = `<p>${escape(q[4])}</p>${balanceCheck}`;
  }

  if (s.hints < 3) {
    $("#hints").insertAdjacentHTML(
      "beforeend",
      `<div class="hint"><strong>${title}</strong><div style="margin-top:6px;">${body}</div></div>`,
    );
    s.hints++;
  }
  if (s.hints === 3) $("#hint-button").disabled = true;
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
  const correct = isCorrect(raw, q[1]),
    lesson = s.mode === "diagnostic" ? lessons[s.index].id : s.lesson.id;
  state.attempts.push({ lesson, correct, hints: s.hints, at: Date.now() });
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
    f.textContent =
      "Todavía no coincide. Revisa el enunciado y tu respuesta; puedes probar otra vez o pedir una pista.";
    if (!state.reviews.some((r) => r.lesson === lesson))
      state.reviews.push({ lesson, due: Date.now() });
    save();
    return;
  }
  s.answered = true;
  s.results.push({ independent: s.hints === 0 && s.wrong === 0 });
  f.textContent =
    s.hints === 0 && s.wrong === 0
      ? "¡Lo resolviste sin ayuda! " + q[4]
      : "¡Llegaste al resultado! " +
        q[4] +
        " Volveremos a practicarlo para afianzarlo.";
  $("#check").disabled = true;
  $("#hint-button").disabled = true;
  $("#answer").disabled = true;
  if ($("#work")) $("#work").disabled = true;
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
  renderExercise();
}
function finish() {
  if (session?.mode === "task") {
    finishTask();
    return;
  }
  const s = session,
    independent = s.results.filter((r) => r.independent).length;
  let title = "Cada paso cuenta.",
    desc = "";
  if (s.mode === "diagnostic") {
    state.diagnosed = true;
    const firstGap = s.results.findIndex((r) => !r.independent);
    const startIndex = firstGap === -1 ? lessons.length - 1 : firstGap;
    for (let i = 0; i < startIndex; i++)
      if (!state.completed.includes(lessons[i].id)) {
        state.completed.push(lessons[i].id);
        state.reviews.push({
          lesson: lessons[i].id,
          due: Date.now() + 86400000,
        });
      }
    title = "Ya tienes un punto de partida.";
    desc = `Te proponemos empezar por «${lessons[startIndex].title}». Las habilidades anteriores quedan pendientes de confirmar en un repaso.`;
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

  const streakInfo = getStreakInfo(state);
  const xpInfo = getXpAndFichas(state);
  const beltInfo = s.lesson ? getBeltInfo(s.lesson.id, state) : null;
  const isMath = s.lesson ? getSubject(s.lesson) === "matematica" : false;
  const sessionXpGained = (s.mode === "diagnostic" ? 30 : 20) + (independent * 10);
  const celebrationTitle = s.mode === "diagnostic" 
    ? "¡Punto de partida completado!" 
    : (title === "¡Dominio confirmado!" ? "👑 ¡Dominio de Oro Confirmado!" : "🎉 ¡Misión de Hoy Cumplida!");

  const whatsappAchieveMsg = `*¡Completé mi sesión de hoy en Tutorai! 🚀*\n` +
    `• Habilidad practicada: ${s.lesson ? s.lesson.title : "Diagnóstico inicial"}\n` +
    `• Racha activa: ${streakInfo.streak} días consecutivos 🔥\n` +
    `• Fichas ganadas: ${xpInfo.fichasHabitribu} fichas acumuladas 🪙 (${xpInfo.totalXP} XP)\n` +
    `¡Todo resuelto por mi cuenta sin discusiones! 🙌`;

  app.innerHTML = `
    <section class="card summary triumphant-summary">
      <div class="triumphant-header">
        <div class="eyebrow">TU SESIÓN, EN PERSPECTIVA · MISIÓN CUMPLIDA</div>
        <h1>${celebrationTitle}</h1>
        <p class="triumphant-subtitle">${escape(desc || title)}</p>
      </div>

      <div class="triumphant-stats-grid">
        <div class="triumphant-stat-card t-card-streak">
          <span class="t-stat-icon">🔥</span>
          <div class="t-stat-val">${streakInfo.streak} día${streakInfo.streak > 1 ? "s" : ""}</div>
          <div class="t-stat-lbl">Racha activa ${streakInfo.hasFreeze ? "🛡️" : ""}</div>
        </div>
        <div class="triumphant-stat-card t-card-xp">
          <span class="t-stat-icon">⭐</span>
          <div class="t-stat-val">+${sessionXpGained} XP</div>
          <div class="t-stat-lbl">${xpInfo.totalXP} XP totales</div>
        </div>
        <div class="triumphant-stat-card t-card-habitribu">
          <span class="t-stat-icon">🪙</span>
          <div class="t-stat-val">${xpInfo.fichasHabitribu} fichas</div>
          <div class="t-stat-lbl">Premios en casa</div>
        </div>
        ${beltInfo ? `
        <div class="triumphant-stat-card t-card-belt">
          <span class="t-stat-icon">${beltInfo.icon}</span>
          <div class="t-stat-val">${beltInfo.name.replace("Cinturón ", "")}</div>
          <div class="t-stat-lbl">${beltInfo.desc}</div>
        </div>
        ` : ""}
      </div>

      <div class="stat">${independent} / ${s.questions.length}</div>
      <p class="muted">Ejercicios resueltos al primer intento y sin pistas</p>

      <div class="pedagogical-coach-box">
        <span class="coach-avatar">${isMath ? "⚖️" : "💡"}</span>
        <div class="coach-text">
          <strong>Mensaje de tu tutor pedagógico:</strong>
          <p>${
            s.mode === "diagnostic"
              ? "Cada error nos da el mapa exacto de lo que necesitas practicar. Lo valioso es tu persistencia."
              : (isMath
                  ? "Recuerda: en una ecuación mantenemos la balanza en equilibrio realizando la misma operación a ambos lados. ¡Gran trabajo pensando el procedimiento!"
                  : "Recuerda: en comprensión lectora, volver al texto y localizar las pistas te da la certeza absoluta.")
          }</p>
        </div>
      </div>

      <div class="callout">
        ${s.mode === "diagnostic" ? "Puedes volver a practicar cualquier lección desbloqueada." : escape(s.lesson.concept)}
      </div>

      <div class="triumphant-share-box">
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappAchieveMsg)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-hero">
          <span>📲 Compartir logro con mis papás por WhatsApp</span>
        </a>
      </div>

      <div class="actions">
        ${button("Volver a mi ruta →", "exit", "primary")}
        ${button("Ver mi cuaderno", "go:cuaderno")}
      </div>
    </section>
  `;
  session = null;
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
      : `<section class="card empty"><div class="mini-icon">✓</div><h2>Por ahora, estás al día.</h2><p class="intro" style="margin:12px auto">Tus próximos repasos aparecerán aquí. Mientras tanto, puedes continuar tu ruta.</p>${button("Ir a mi ruta", "exit", "primary")}</section>`) +
    future
      .map(
        (r) =>
          `<div class="lesson"><div class="lesson-info"><h3>${escape(lessons.find((l) => l.id === r.lesson).title)}</h3><p>Disponible el ${new Date(r.due).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })}</p></div><span class="pill">Programado</span></div>`,
      )
      .join("");
}
let pendingNotePhoto = null;
function notebook() {
  app.innerHTML =
    heading(
      "TUS IDEAS TAMBIÉN ENSEÑAN",
      "Mi cuaderno",
      "Aquí quedan tus procedimientos, desarrollos a mano y las ideas que quieras recordar.",
    ) +
    `<section class="card"><form id="note-form"><label for="note">Una idea o desarrollo para tu próximo intento</label><textarea id="note" maxlength="4000" placeholder="Hoy entendí que…"></textarea><div class="note-photo-uploader"><div id="new-note-photo-area">${
      pendingNotePhoto
        ? `<div class="work-photo-preview" style="margin-top:10px;"><div class="work-photo-thumb-wrap"><img src="${pendingNotePhoto}" alt="Foto de cuaderno" class="work-photo-thumb" /></div><div class="work-photo-details"><span class="photo-badge-success">✓ Foto adjunta</span><button type="button" data-action="remove-new-note-photo" class="btn-remove-photo">✕ Eliminar foto</button></div></div>`
        : `<label for="new-note-photo-input" class="photo-btn-secondary"><span>📷</span> Adjuntar foto de mi cuaderno (opcional)</label><input type="file" id="new-note-photo-input" accept="image/*" capture="environment" class="visually-hidden">`
    }</div></div><div class="actions"><button class="primary" type="submit">Guardar nota</button><span id="note-status" role="status"></span></div></form></section><div id="notes">${
      state.notes.length
        ? state.notes
            .map(
              (n) =>
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
                }${
                  n.image
                    ? `<div class="note-image-wrap"><img src="${n.image}" alt="Desarrollo a mano de ${escape(
                        n.title,
                      )}" class="note-image" loading="lazy" /><a href="${
                        n.image
                      }" target="_blank" rel="noopener" class="note-image-zoom">🔍 Ver foto completa</a></div>`
                    : ""
                }</article>`,
            )
            .join("")
        : '<div class="empty muted">Tu cuaderno está listo para tu primera idea o desarrollo a mano.</div>'
    }</div>`;

  const newPhotoInput = $("#new-note-photo-input");
  if (newPhotoInput) {
    newPhotoInput.onchange = async (e) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const compressed = await compressImage(file);
      if (compressed) {
        pendingNotePhoto = compressed;
        notebook();
      }
    };
  }

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
function task() {
  app.innerHTML =
    heading(
      "DEL CUADERNO A LA PRÁCTICA",
      "Trae tu ejercicio.",
      "Practica una ecuación lineal y conecta lo aprendido con tu ruta.",
    ) +
    `<section class="card"><div class="callout">Esta versión admite ecuaciones lineales de la forma ax + b = cx + d. Puedes resolver a mano en tu cuaderno y subir una foto de tu desarrollo.</div><form id="task-form"><label for="equation">Tu ecuación</label><input id="equation" placeholder="2x + 3 = 15" required maxlength="150"><p class="task-examples">También puedes probar: 4x + 2 = 2x + 18, o −3x + 6 = 12.</p><div class="task-photo-option"><label for="task-photo-input" class="photo-btn-secondary"><span>📷</span> ${
      pendingTaskPhoto
        ? "✓ Foto de tu cuaderno seleccionada"
        : "Subir foto de tu ejercicio en el cuaderno (opcional)"
    }</label><input type="file" id="task-photo-input" accept="image/*" capture="environment" class="visually-hidden">${
      pendingTaskPhoto
        ? '<button type="button" data-action="remove-task-photo" class="btn-remove-photo" style="display:inline-block;margin-left:10px;">✕ Quitar</button>'
        : ""
    }</div><div class="actions" style="margin-top:16px;"><button class="primary" type="submit">Preparar mi práctica →</button></div></form><div id="task-result" class="task-result" aria-live="polite"></div></section>`;

  const taskPhotoInput = $("#task-photo-input");
  if (taskPhotoInput) {
    taskPhotoInput.onchange = async (e) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const compressed = await compressImage(file);
      if (compressed) {
        pendingTaskPhoto = compressed;
        task();
      }
    };
  }

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
app.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const [action, id] = b.dataset.action.split(":");
  if (action === "lesson") {
    const i = lessons.findIndex((l) => l.id === id);
    if (!independentLessons.has(id) && i > 0 && !state.completed.includes(lessons[i - 1].id)) return;
    start(id);
  } else if (action === "diagnostic") start("equations", "diagnostic");
  else if (action === "review") {
    if (state.reviews.some((r) => r.lesson === id && r.due <= Date.now()))
      start(id, "review");
  } else if (action === "hint") hint();
  else if (action === "next") next();
  else if (action === "skip" && session && !session.answered) {
    session.results.push({ independent: false });
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
  } else if (action === "subject") {
    currentSubject = id;
    route();
  } else if (action === "reset-filters") {
    currentLevel = "all";
    currentSubject = "all";
    route();
  } else if (action === "begin-exercises") {
    if (session) {
      session.showingIntro = false;
      renderExercise();
    }
  } else if (action === "view-intro") {
    if (session) renderIntroLesson(true);
  } else if (action === "return-exercise") {
    if (session) renderExercise();
  } else if (action === "remove-photo") {
    if (session) {
      session.workPhoto = null;
      session.lastPhoto = null;
    }
    updatePhotoContainer();
  } else if (action === "remove-new-note-photo") {
    pendingNotePhoto = null;
    notebook();
  } else if (action === "remove-task-photo") {
    pendingTaskPhoto = null;
    task();
  } else if (action === "unit-guide") {
    showUnitGuide(id);
  } else if (action === "close-unit-guide") {
    const dlg = $("#unit-guide-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  } else if (action === "parent-report") {
    showParentReport();
  } else if (action === "close-parent-report") {
    const dlg = $("#parent-report-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  } else if (action === "rewards-modal" || action === "habitribu-modal") {
    showRewardsModal();
  } else if (action === "close-rewards" || action === "close-habitribu") {
    const dlg = $("#rewards-dialog") || $("#habitribu-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  }
});
$("#privacy").onclick = () => $("#privacy-dialog").showModal();
$("#close-privacy").onclick = () => $("#privacy-dialog").close();
$("#delete-data").onclick = () => {
  state = freshState();
  save();
  session = null;
  currentLevel = "all";
  currentSubject = "all";
  $("#privacy-dialog").close();
  location.hash = "ruta";
  navigate();
};
window.addEventListener("hashchange", navigate);
navigate();
