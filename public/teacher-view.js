// Vista docente y PIE (B2B):
// - Selector rápido de cursos y grupos PIE, código de pizarra y carga de nómina
//   sin correo con tarjetas de acceso recortables (@media print) y CSV.
// - Mapa grupal de tropiezos por objetivo MINEDUC (OA) y distribución real en
//   Niveles neutros (A–O) sin etiquetas de curso para estudiantes con rezago.
// - Foco sugerido para el grupo (lección + nota breve) conectado con la ruta y
//   las hojas imprimibles estilo Kumon.
// - Seguimiento nominal por estudiante respetando privacidad (sin notas ni fotos).
import { api } from "./api.js";
import { escape } from "./ui.js";
import { displayTitle, getSubject } from "./learning.js";
import { lessonLevel } from "./sheets.js";
import {
  COURSE_GRADES,
  extractObjective,
  analyzeCohort,
  createDemoTeacherApi,
} from "./teacher-analytics.js";

const ICONS = {
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  refresh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
  print: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  sheet: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>`,
  play: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  target: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  settings: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  shield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

const shortDate = (ms) =>
  ms
    ? new Date(ms).toLocaleDateString("es-CL", { day: "numeric", month: "short" })
    : "Sin actividad";

function gradeOptionsHtml(selected = "7b") {
  return Object.entries(COURSE_GRADES)
    .map(
      ([key, label]) =>
        `<option value="${escape(key)}"${key === selected ? " selected" : ""}>${escape(label)}</option>`,
    )
    .join("");
}

function downloadCredentialsCsv(courseName, credentials) {
  const header = "Nombre,Usuario,Clave inicial,Acceso\n";
  const origin = globalThis.location?.origin || "https://socatres.pages.dev";
  const rows = credentials
    .map((c) => {
      const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      return [q(c.name), q(c.username), q(c.password), q(origin)].join(",");
    })
    .join("\n");
  const blob = new Blob(["\uFEFF" + header + rows + "\n"], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  const slug = String(courseName || "curso")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  a.href = URL.createObjectURL(blob);
  a.download = `accesos-${slug || "socatres"}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function printAccessCards() {
  if (typeof window === "undefined" || typeof window.print !== "function") return;
  document.body?.setAttribute("data-print-mode", "cards");
  const cleanup = () => document.body?.removeAttribute("data-print-mode");
  window.addEventListener?.("afterprint", cleanup, { once: true });
  try {
    window.print();
  } finally {
    setTimeout(cleanup, 600);
  }
}

let renderSeq = 0;

// ── Bloque reutilizable para estudiantes (unirse a un curso y ver foco) ─────
export function hydrateStudentClassesBox(container, { session, lessons, onOpenLesson, onOpenSheet }) {
  if (!container) return;
  if (session?.mode !== "account" || session?.role !== "student") {
    container.innerHTML = "";
    return;
  }

  const lessonById = (id) => lessons.find((l) => l.id === id);

  async function refresh(notice = "", good = false) {
    let classes = [];
    try {
      ({ classes } = await api.classes());
    } catch {
      container.innerHTML = "";
      return;
    }
    const listHtml = classes.length
      ? `<div class="student-class-list">${classes
          .map((c) => {
            const focus = c.focusLesson ? lessonById(c.focusLesson) : null;
            const lvl = focus ? lessonLevel(focus.id) : null;
            return `<article class="student-class-item">
              <div class="student-class-head">
                <div>
                  <strong>${escape(c.name)}</strong>
                  <span class="muted">${c.school ? `${escape(c.school)} · ` : ""}Prof. ${escape(c.teacherName)}</span>
                </div>
                ${c.canLeave ? `<button type="button" class="link-button" data-leave-class="${escape(c.id)}" data-class-name="${escape(c.name)}">Salir del curso</button>` : ""}
              </div>
              ${
                focus
                  ? `<div class="student-class-focus">
                      <div>
                        <span class="oa-pill">${escape(lvl.label)}</span>
                        <strong>Foco sugerido: ${escape(displayTitle(focus))}</strong>
                        ${c.focusNote ? `<p class="muted">${escape(c.focusNote)}</p>` : ""}
                      </div>
                      <div class="inline-row">
                        <button type="button" class="primary" data-class-lesson="${escape(focus.id)}">Practicar lección</button>
                        <button type="button" data-class-sheet="${escape(focus.id)}">Abrir hoja</button>
                      </div>
                    </div>`
                  : `<p class="muted small">Sin foco grupal asignado por ahora.</p>`
              }
            </article>`;
          })
          .join("")}</div>`
      : "";

    container.innerHTML = `<section class="card student-classes-card">
      <h3>Mi curso o grupo PIE</h3>
      <p class="muted">Si tu profesor o educador PIE escribió un código de 6 letras en la pizarra, ingrésalo aquí. Tu docente verá tu avance en los ejercicios, nunca tus notas ni tus fotos.</p>
      <form id="join-class-form" class="inline-form">
        <label for="join-class-code">Código de la pizarra</label>
        <div class="inline-row">
          <input id="join-class-code" name="code" maxlength="10" autocomplete="off" autocapitalize="characters" placeholder="K7M2QX" required />
          <button class="primary" type="submit">Unirme al curso</button>
        </div>
      </form>
      <p id="join-class-feedback" role="status" class="feedback${good ? " good" : ""}">${escape(notice)}</p>
      ${listHtml}
    </section>`;

    const form = container.querySelector("#join-class-form");
    form.onsubmit = async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const code = form.elements.code.value;
      btn.disabled = true;
      try {
        const { course } = await api.joinClass(code);
        await refresh(`Te uniste a «${course.name}».`, true);
      } catch (err) {
        const fb = container.querySelector("#join-class-feedback");
        if (fb) {
          fb.className = "feedback";
          fb.textContent = err.message;
        }
      } finally {
        btn.disabled = false;
      }
    };

    for (const b of container.querySelectorAll("[data-leave-class]")) {
      b.onclick = async () => {
        if (!window.confirm(`¿Salir del curso «${b.dataset.className}»? Tu progreso personal se conserva.`)) return;
        b.disabled = true;
        try {
          await api.leaveClass(b.dataset.leaveClass);
          await refresh("Saliste del curso.", true);
        } catch (err) {
          const fb = container.querySelector("#join-class-feedback");
          if (fb) fb.textContent = err.message;
          b.disabled = false;
        }
      };
    }
    for (const b of container.querySelectorAll("[data-class-lesson]")) {
      b.onclick = () => onOpenLesson?.(b.dataset.classLesson);
    }
    for (const b of container.querySelectorAll("[data-class-sheet]")) {
      b.onclick = () => onOpenSheet?.(b.dataset.classSheet);
    }
  }

  refresh();
}

// ── Vista principal #sala ───────────────────────────────────────────────────
export function renderTeacherPage({
  app,
  session,
  lessons,
  storage = globalThis.localStorage,
  onOpenLesson,
  onOpenSheet,
  onDemoRegister,
}) {
  const seq = ++renderSeq;
  const isCurrent = () => seq === renderSeq && app.dataset.view === "sala";
  app.dataset.view = "sala";

  // Si entra un estudiante a #sala, le mostramos su conexión con el colegio.
  if (session?.role === "student") {
    if (session.mode !== "account") {
      app.innerHTML = `<section class="teacher-shell">
        <header class="teacher-page-head">
          <div>
            <h1>Mi curso o colegio</h1>
            <p class="intro">Con una cuenta puedes unirte al curso de tu profesor usando el código de la pizarra.</p>
          </div>
        </header>
        <section class="card family-empty-card">
          <img class="empty-owl-img" src="buho-rama.webp" alt="" width="116" height="123" />
          <div>
            <h3>¿Eres docente o coordinador PIE?</h3>
            <p class="muted">Cierra la sesión de prueba de estudiante con «Salir» y entra en «Probar demo → Docente / Equipo PIE» o crea tu cuenta docente gratis.</p>
          </div>
        </section>
      </section>`;
      return;
    }
    app.innerHTML = `<section class="teacher-shell">
      <header class="teacher-page-head">
        <div>
          <h1>Mi curso en el colegio</h1>
          <p class="intro">Conéctate con tu sala o equipo PIE y revisa la práctica sugerida por tu profesor.</p>
        </div>
      </header>
      <div id="student-classroom-slot"></div>
    </section>`;
    hydrateStudentClassesBox(app.querySelector("#student-classroom-slot"), {
      session,
      lessons,
      onOpenLesson,
      onOpenSheet,
    });
    return;
  }

  if (session?.role === "parent") {
    app.innerHTML = `<section class="teacher-shell">
      <header class="teacher-page-head">
        <div>
          <h1>Panel docente y PIE</h1>
          <p class="intro">Esta vista es para cuentas docentes. Para acompañar a tus hijos, usa la sección «Mi familia».</p>
        </div>
      </header>
    </section>`;
    return;
  }

  const isDemo = session?.mode === "demo";
  const backend = isDemo ? createDemoTeacherApi(storage) : api;
  const mathLessons = lessons.filter((l) => getSubject(l) === "matematica");

  const ui = {
    classes: [],
    selectedId: null,
    detail: null,
    openPanel: null, // "new-class" | "roster" | "focus" | "settings" | null
    studentFilter: "all", // "all" | "support" | "inactive" | "focus" | "level:<CODE>"
    search: "",
    credentialsByClass: new Map(),
    notice: "",
    noticeError: false,
  };

  function setNotice(text, isError = false) {
    ui.notice = text;
    ui.noticeError = isError;
    const bar = app.querySelector("#teacher-feedback");
    if (bar) {
      bar.textContent = text;
      bar.className = "feedback" + (text && !isError ? " good" : "");
      bar.hidden = !text;
    }
  }

  async function loadInitial() {
    app.innerHTML = `<section class="teacher-shell" aria-busy="true">
      <div class="teacher-skeleton-bar"></div>
      <div class="teacher-skeleton-grid">
        <div class="teacher-skeleton-card"></div>
        <div class="teacher-skeleton-card"></div>
      </div>
    </section>`;
    try {
      const { classes } = await backend.classes();
      if (!isCurrent()) return;
      ui.classes = classes;
      if (classes.length) {
        ui.selectedId = classes[0].id;
        ui.detail = await backend.classDetail(ui.selectedId);
      } else {
        ui.openPanel = "new-class";
      }
      if (!isCurrent()) return;
      paint();
    } catch (err) {
      if (!isCurrent()) return;
      app.innerHTML = `<section class="teacher-shell">
        <h1>Mis cursos y grupos PIE</h1>
        <p class="feedback" role="alert">${escape(err.message)}</p>
      </section>`;
    }
  }

  async function reloadSelected(preferredId = ui.selectedId) {
    const { classes } = await backend.classes();
    if (!isCurrent()) return;
    ui.classes = classes;
    const nextId = classes.find((c) => c.id === preferredId)?.id ?? classes[0]?.id ?? null;
    ui.selectedId = nextId;
    ui.detail = nextId ? await backend.classDetail(nextId) : null;
    if (!isCurrent()) return;
    paint();
  }

  function demoBannerHtml() {
    if (!isDemo) return "";
    return `<section class="teacher-demo-banner no-print" role="note">
      <div class="teacher-demo-copy">
        <strong>Modo demostración para establecimientos y equipos PIE (datos de ejemplo)</strong>
        <p>Prueba cambiar entre aula regular y grupo PIE, fijar un objetivo como foco semanal o generar tarjetas de acceso recortables sin correo.</p>
      </div>
      <button type="button" class="primary" data-teacher-action="demo-register">Crear cuenta docente gratis</button>
    </section>`;
  }

  function courseSwitcherHtml() {
    const tabs = ui.classes
      .map((c) => {
        const active = c.id === ui.selectedId && ui.openPanel !== "new-class";
        return `<button type="button" class="course-pill${active ? " active" : ""}" data-select-course="${escape(c.id)}" aria-pressed="${active}">
          <span class="course-pill-name">${escape(c.name)}</span>
          <span class="course-pill-count tabular">${c.studentCount}</span>
        </button>`;
      })
      .join("");
    const creating = ui.openPanel === "new-class";
    return `<div class="course-switcher no-print" role="toolbar" aria-label="Cursos y grupos PIE">
      <div class="course-pill-list">${tabs}</div>
      <button type="button" class="course-add-btn${creating ? " active" : ""}" data-toggle-panel="new-class">
        ${ICONS.plus}<span>Nuevo curso o grupo PIE</span>
      </button>
    </div>`;
  }

  function newClassDrawerHtml() {
    if (ui.openPanel !== "new-class" && ui.classes.length > 0) return "";
    return `<section class="card teacher-drawer no-print" aria-labelledby="new-course-heading">
      <div class="teacher-drawer-head">
        <div>
          <h2 id="new-course-heading">${ui.classes.length ? "Crear nuevo curso o grupo PIE" : "Crea tu primer curso o grupo PIE"}</h2>
          <p class="muted">Obtendrás al instante un código de 6 letras para la pizarra y podrás pegar tu nómina sin pedir correo a menores de 14 años.</p>
        </div>
        ${ui.classes.length ? `<button type="button" data-toggle-panel="new-class">Cerrar</button>` : ""}
      </div>
      <form id="create-course-form" class="teacher-form-grid">
        <div>
          <label for="course-name">Nombre del curso o grupo</label>
          <input id="course-name" name="name" maxlength="80" placeholder="Ej. 7° Básico B · Matemática o Grupo PIE 6°–8°" required />
        </div>
        <div>
          <label for="course-grade">Nivel de referencia</label>
          <select id="course-grade" name="grade">${gradeOptionsHtml("7b")}</select>
        </div>
        <div>
          <label for="course-school">Establecimiento <span class="muted">(opcional)</span></label>
          <input id="course-school" name="school" maxlength="120" placeholder="Ej. Escuela Gabriela Mistral, Temuco" />
        </div>
        <div class="teacher-form-actions">
          <button type="submit" class="primary">Crear curso</button>
        </div>
      </form>
    </section>`;
  }

  function credentialsCardHtml(course) {
    const creds = ui.credentialsByClass.get(course.id);
    if (!creds?.length) return "";
    const origin = globalThis.location?.origin || "https://socatres.pages.dev";
    return `<section class="card teacher-credentials-box" aria-labelledby="creds-heading">
      <div class="teacher-credentials-head no-print">
        <div>
          <h2 id="creds-heading">Tarjetas de acceso listas (${creds.length} ${creds.length === 1 ? "estudiante" : "estudiantes"})</h2>
          <p class="muted">Por seguridad las contraseñas no se vuelven a mostrar después de cerrar esta sesión. Imprime las tarjetas recortables o descarga el respaldo CSV ahora.</p>
        </div>
        <div class="inline-row">
          <button type="button" class="primary" data-teacher-action="print-cards">${ICONS.print}<span>Imprimir tarjetas recortables</span></button>
          <button type="button" data-teacher-action="download-csv">${ICONS.download}<span>Descargar CSV</span></button>
          <button type="button" data-teacher-action="dismiss-cards">Ocultar</button>
        </div>
      </div>
      <div class="print-cards-sheet">
        <div class="print-cards-sheet-header">
          <strong>socatres · Tarjetas de acceso escolar</strong>
          <span>${escape(course.name)}${course.school ? ` · ${escape(course.school)}` : ""}</span>
        </div>
        <div class="access-cards-grid">
          ${creds
            .map(
              (c) => `<article class="access-card">
                <div class="access-card-top">
                  <strong>socatres</strong>
                  <span>${escape(course.name)}</span>
                </div>
                <div class="access-card-student">${escape(c.name)}</div>
                <dl class="access-card-dl tabular">
                  <div><dt>Entra en</dt><dd>${escape(origin.replace(/^https?:\/\//, ""))}</dd></div>
                  <div><dt>Usuario</dt><dd>${escape(c.username)}</dd></div>
                  <div><dt>Clave</dt><dd>${escape(c.password)}</dd></div>
                </dl>
              </article>`,
            )
            .join("")}
        </div>
      </div>
    </section>`;
  }

  function rosterDrawerHtml(course, forceOpen = false) {
    if (!forceOpen && ui.openPanel !== "roster") return "";
    return `<section class="card teacher-drawer no-print" aria-labelledby="roster-heading">
      <div class="teacher-drawer-head">
        <div>
          <h2 id="roster-heading">Incorporar estudiantes a «${escape(course.name)}»</h2>
          <p class="muted">Elige la vía según la edad del grupo o si trabajan en sala de computación.</p>
        </div>
        ${!forceOpen ? `<button type="button" data-toggle-panel="roster">Cerrar</button>` : ""}
      </div>
      <div class="roster-split">
        <form id="roster-batch-form" class="roster-pane">
          <h3>1. Nómina rápida sin correo (menores de 14 años y PIE)</h3>
          <p class="muted">Pega un nombre por línea desde el libro de clases o SIGE. Se generan usuarios y claves legibles para entregar en papel.</p>
          <label for="roster-names">Nombres de los estudiantes (uno por línea)</label>
          <textarea id="roster-names" name="namesText" rows="5" placeholder="Camila Rojas&#10;Mateo Riquelme&#10;Sofía Contreras&#10;Tomás Garrido" required></textarea>
          <div class="inline-row">
            <button type="submit" class="primary">Generar cuentas y tarjetas</button>
          </div>
        </form>
        <div class="roster-pane roster-code-pane">
          <h3>2. Código en la pizarra (cuentas ya creadas)</h3>
          <p class="muted">Para estudiantes de 14+ años con cuenta propia, o menores cuya cuenta ya creó su apoderado en casa.</p>
          <div class="board-code-display">
            <span class="board-code-value tabular">${escape(course.code)}</span>
            <button type="button" data-teacher-action="copy-code">${ICONS.copy}<span>Copiar</span></button>
          </div>
          <ol class="roster-steps muted">
            <li>Entran a su cuenta de socatres.</li>
            <li>Abren <strong>Mi familia</strong> (o <strong>#sala</strong>) → sección <strong>Mi curso o grupo PIE</strong>.</li>
            <li>Escriben el código <strong>${escape(course.code)}</strong> y quedan vinculados al instante.</li>
          </ol>
        </div>
      </div>
    </section>`;
  }

  function focusDrawerHtml(course) {
    if (ui.openPanel !== "focus") return "";
    const options = mathLessons
      .map((l) => {
        const lvl = lessonLevel(l.id);
        const obj = extractObjective(l);
        const sel = l.id === course.focusLesson ? " selected" : "";
        return `<option value="${escape(l.id)}"${sel}>[${escape(lvl.label)} · ${escape(obj.code)}] ${escape(displayTitle(l))}</option>`;
      })
      .join("");
    return `<section class="card teacher-drawer no-print" aria-labelledby="focus-drawer-heading">
      <div class="teacher-drawer-head">
        <div>
          <h2 id="focus-drawer-heading">Sugerir lección o foco de la semana</h2>
          <p class="muted">Aparecerá destacada al inicio de «Mi ruta» para todos los estudiantes de este curso, sin bloquear el avance autónomo en su nivel.</p>
        </div>
        <button type="button" data-toggle-panel="focus">Cerrar</button>
      </div>
      <form id="focus-form" class="teacher-form-grid">
        <div>
          <label for="focus-lesson-select">Objetivo y lección</label>
          <select id="focus-lesson-select" name="focusLesson">
            <option value="">Sin foco grupal asignado</option>
            ${options}
          </select>
        </div>
        <div>
          <label for="focus-note-input">Indicación breve para tus estudiantes <span class="muted">(opcional)</span></label>
          <input id="focus-note-input" name="focusNote" maxlength="200" value="${escape(course.focusNote || "")}" placeholder="Ej. Vean el video, jueguen la balanza y completen la Hoja 1 en su cuaderno." />
        </div>
        <div class="teacher-form-actions">
          <button type="submit" class="primary">Guardar foco del grupo</button>
          ${course.focusLesson ? `<button type="button" data-teacher-action="clear-focus">Quitar foco actual</button>` : ""}
        </div>
      </form>
    </section>`;
  }

  function settingsDrawerHtml(course) {
    if (ui.openPanel !== "settings") return "";
    return `<section class="card teacher-drawer no-print" aria-labelledby="settings-heading">
      <div class="teacher-drawer-head">
        <div>
          <h2 id="settings-heading">Ajustes de «${escape(course.name)}»</h2>
          <p class="muted">Actualiza los datos del curso, renueva el código de pizarra o elimina el grupo.</p>
        </div>
        <button type="button" data-toggle-panel="settings">Cerrar</button>
      </div>
      <form id="edit-course-form" class="teacher-form-grid">
        <div>
          <label for="edit-course-name">Nombre del curso o grupo PIE</label>
          <input id="edit-course-name" name="name" maxlength="80" value="${escape(course.name)}" required />
        </div>
        <div>
          <label for="edit-course-grade">Nivel de referencia</label>
          <select id="edit-course-grade" name="grade">${gradeOptionsHtml(course.grade)}</select>
        </div>
        <div>
          <label for="edit-course-school">Establecimiento</label>
          <input id="edit-course-school" name="school" maxlength="120" value="${escape(course.school)}" />
        </div>
        <div class="teacher-form-actions">
          <button type="submit" class="primary">Guardar cambios</button>
          <button type="button" data-teacher-action="rotate-code">${ICONS.refresh}<span>Generar nuevo código de pizarra</span></button>
          <button type="button" class="danger" data-teacher-action="delete-course">Eliminar curso</button>
        </div>
      </form>
    </section>`;
  }

  function focusBarHtml(course, pulse) {
    const focus = course.focusLesson ? mathLessons.find((l) => l.id === course.focusLesson) : null;
    if (!focus) {
      return `<section class="teacher-focus-strip is-empty no-print" aria-label="Foco grupal">
        <div class="teacher-focus-body">
          <span class="teacher-focus-icon">${ICONS.target}</span>
          <div>
            <strong>Sin lección foco esta semana</strong>
            <span class="muted">Puedes fijar una desde el mapa de tropiezos o elegir cualquier objetivo MINEDUC.</span>
          </div>
        </div>
        <button type="button" data-toggle-panel="focus">Elegir lección foco</button>
      </section>`;
    }
    const obj = extractObjective(focus);
    const lvl = lessonLevel(focus.id);
    return `<section class="teacher-focus-strip no-print" aria-label="Foco grupal activo">
      <div class="teacher-focus-body">
        <span class="teacher-focus-icon">${ICONS.target}</span>
        <div>
          <div class="teacher-focus-title-row">
            <strong>Foco del grupo: ${escape(displayTitle(focus))}</strong>
            <span class="oa-pill">${escape(obj.code)}</span>
            <span class="level-pill">${escape(lvl.label)}</span>
            <span class="focus-progress-pill tabular">${pulse.focusCompletedCount} / ${pulse.totalStudents} al día</span>
          </div>
          ${course.focusNote ? `<p class="muted">${escape(course.focusNote)}</p>` : ""}
        </div>
      </div>
      <div class="inline-row">
        <button type="button" data-open-lesson="${escape(focus.id)}" title="Abrir video y minijuego para proyectar en sala">${ICONS.play}<span>Proyectar</span></button>
        <button type="button" data-open-sheet="${escape(focus.id)}" title="Abrir hoja de 8 ejercicios lista para imprimir">${ICONS.sheet}<span>Hoja imprimible</span></button>
        <button type="button" data-toggle-panel="focus">Cambiar</button>
      </div>
    </section>`;
  }

  function stumblesPanelHtml(course, stumbles) {
    if (!stumbles.length) {
      return `<section class="card teacher-panel">
        <div class="teacher-panel-head">
          <h2>Dónde se traba el grupo</h2>
          <span class="muted">Últimos 14 días</span>
        </div>
        <p class="muted">Aún no hay suficientes intentos con tropiezo en los últimos 14 días. Cuando el grupo practique, verás aquí los Objetivos de Aprendizaje (OA) con más errores o uso de pistas.</p>
      </section>`;
    }
    return `<section class="card teacher-panel">
      <div class="teacher-panel-head">
        <div>
          <h2>Dónde se traba el grupo</h2>
          <p class="muted">Objetivos MINEDUC con mayor tasa de error o ayuda en los últimos 14 días.</p>
        </div>
        <div class="stumble-legend" aria-hidden="true">
          <span><i class="dot-err"></i>Error</span>
          <span><i class="dot-hint"></i>Con pista</span>
          <span><i class="dot-ok"></i>Autónomo</span>
        </div>
      </div>
      <div class="stumble-list">
        ${stumbles
          .map((s) => {
            const isFocus = course.focusLesson === s.lessonId;
            return `<article class="stumble-row">
              <div class="stumble-main">
                <div class="stumble-meta">
                  <span class="oa-pill">${escape(s.oa)}</span>
                  <span class="level-pill">${escape(s.level.label)}</span>
                  <span class="muted tabular">${s.studentsCount} ${s.studentsCount === 1 ? "alumno" : "alumnos"} · ${s.attempts} intentos</span>
                </div>
                <h3>${escape(s.title)}</h3>
                <div class="stumble-bar" role="img" aria-label="${s.errorRate} % con error, ${s.hintRate} % con pistas, ${s.autonomousRate} % autónomo">
                  <span class="seg-err" style="width:${s.errorRate}%"></span>
                  <span class="seg-hint" style="width:${s.hintRate}%"></span>
                  <span class="seg-ok" style="width:${s.autonomousRate}%"></span>
                </div>
                <div class="stumble-numbers tabular">
                  <strong class="txt-err">${s.errorRate} % error</strong>
                  <span>${s.hintRate} % con pista</span>
                  <span>${s.autonomousRate} % sin ayuda</span>
                </div>
              </div>
              <div class="stumble-actions">
                <button type="button" class="${isFocus ? "active-focus-btn" : ""}" data-quick-focus="${escape(s.lessonId)}" ${isFocus ? "disabled" : ""}>
                  ${isFocus ? "Foco actual" : "Fijar foco"}
                </button>
                <button type="button" data-open-lesson="${escape(s.lessonId)}" title="Proyectar video y minijuego">${ICONS.play}<span>Lección</span></button>
                <button type="button" data-open-sheet="${escape(s.lessonId)}" title="Abrir hoja Kumon imprimible">${ICONS.sheet}<span>Hoja</span></button>
              </div>
            </article>`;
          })
          .join("")}
      </div>
    </section>`;
  }

  function levelsPanelHtml(levelDistribution, totalStudents) {
    const activeLevels = levelDistribution.filter((l) => l.count > 0);
    // Mostrar los niveles con estudiantes y un rango contiguo compacto para contexto A–O.
    const visible = activeLevels.length
      ? levelDistribution.filter((l) => {
          const minOrder = Math.max(1, Math.min(...activeLevels.map((x) => x.order)) - 1);
          const maxOrder = Math.min(15, Math.max(...activeLevels.map((x) => x.order)) + 1);
          return l.order >= minOrder && l.order <= maxOrder;
        })
      : levelDistribution.slice(0, 6);
    const maxCount = Math.max(1, ...visible.map((l) => l.count));

    return `<section class="card teacher-panel">
      <div class="teacher-panel-head">
        <div>
          <h2>Ubicación en Niveles A–O</h2>
          <p class="muted">Punto real de trabajo sin estigma de curso escolar. Toca un nivel para filtrar la nómina.</p>
        </div>
      </div>
      <ul class="level-dist-list">
        ${visible
          .map((l) => {
            const filterKey = `level:${l.code}`;
            const selected = ui.studentFilter === filterKey;
            const pct = l.count ? Math.max(10, Math.round((l.count / maxCount) * 100)) : 0;
            return `<li>
              <button type="button" class="level-dist-row${selected ? " selected" : ""}${l.count === 0 ? " is-zero" : ""}" data-filter-students="${escape(filterKey)}" aria-pressed="${selected}">
                <span class="level-code tabular">${escape(l.label)}</span>
                <span class="level-unit-name">${escape(l.unitTitle)}</span>
                <span class="level-bar-track"><span class="level-bar-fill" style="width:${pct}%"></span></span>
                <span class="level-count tabular">${l.count}</span>
              </button>
            </li>`;
          })
          .join("")}
      </ul>
      ${
        totalStudents > 0 && !activeLevels.length
          ? `<p class="muted small">Los estudiantes aparecerán ubicados apenas realicen su diagnóstico inicial o su primera práctica.</p>`
          : ""
      }
    </section>`;
  }

  function studentsTableHtml(course, cohort) {
    const { students, pulse } = cohort;
    const query = ui.search.trim().toLocaleLowerCase("es-CL");
    const filtered = students.filter((s) => {
      if (query) {
        const hay = `${s.name} ${s.username || ""}`.toLocaleLowerCase("es-CL");
        if (!hay.includes(query)) return false;
      }
      if (ui.studentFilter === "support") return s.status === "support";
      if (ui.studentFilter === "inactive") return s.status === "inactive";
      if (ui.studentFilter === "focus") return Boolean(course.focusLesson) && !s.focusDone;
      if (ui.studentFilter.startsWith("level:")) {
        return s.currentLevel.code === ui.studentFilter.slice(6);
      }
      return true;
    });

    const filterBtn = (key, label, count) => {
      const active = ui.studentFilter === key;
      return `<button type="button" class="filter-chip${active ? " active" : ""}" data-filter-students="${escape(key)}" aria-pressed="${active}">
        <span>${escape(label)}</span>${count !== undefined ? `<span class="tabular">${count}</span>` : ""}
      </button>`;
    };

    const levelFilterBadge = ui.studentFilter.startsWith("level:")
      ? `<button type="button" class="filter-chip active" data-filter-students="all">Nivel ${escape(ui.studentFilter.slice(6))} ×</button>`
      : "";

    return `<section class="card teacher-roster-section no-print" aria-labelledby="roster-table-heading">
      <div class="teacher-roster-top">
        <div>
          <h2 id="roster-table-heading">Seguimiento por estudiante</h2>
          <p class="muted privacy-line">${ICONS.shield}<span>Privacidad protegida: se muestran avances, hojas y tropiezos; las notas del cuaderno y las fotos quedan privadas en su dispositivo.</span></p>
        </div>
        <div class="roster-search-box">
          <label for="student-search" class="sr-only">Buscar estudiante</label>
          <input id="student-search" type="search" value="${escape(ui.search)}" placeholder="Buscar nombre o usuario…" />
        </div>
      </div>

      <div class="roster-filters" role="toolbar" aria-label="Filtrar nómina">
        ${filterBtn("all", "Todos", students.length)}
        ${filterBtn("support", "Requieren apoyo", pulse.supportCount)}
        ${filterBtn("inactive", "Sin práctica (7d)", pulse.inactiveCount)}
        ${course.focusLesson ? filterBtn("focus", "Foco pendiente", pulse.totalStudents - pulse.focusCompletedCount) : ""}
        ${levelFilterBadge}
      </div>

      ${
        filtered.length
          ? `<div class="table-scroll">
              <table class="teacher-table">
                <thead>
                  <tr>
                    <th scope="col">Estudiante</th>
                    <th scope="col">Nivel neutro</th>
                    <th scope="col">Constancia (7d)</th>
                    <th scope="col" class="num-col">Precisión · Hojas</th>
                    ${course.focusLesson ? `<th scope="col">Foco</th>` : ""}
                    <th scope="col">Dónde apoyar y cuenta</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered
                    .map((s) => {
                      const statusClass =
                        s.status === "support"
                          ? "st-support"
                          : s.status === "inactive"
                            ? "st-inactive"
                            : "st-steady";
                      const daysDots = s.days
                        .map(
                          (d) =>
                            `<span class="day-dot${d.count ? " on" : ""}" title="${escape(d.label)}: ${d.count} ejercicios">${escape(d.label[0])}</span>`,
                        )
                        .join("");
                      const supportText = s.supportTopics.length
                        ? s.supportTopics
                            .map(
                              (t) =>
                                `<button type="button" class="topic-link" data-open-sheet="${escape(t.id)}" title="Abrir hoja imprimible de ${escape(t.title)}">${escape(t.oa)} · ${escape(t.title)} (${t.accuracy} %)</button>`,
                            )
                            .join(" ")
                        : s.status === "inactive"
                          ? `<span class="muted">Última vez: ${escape(shortDate(s.lastActivity))}</span>`
                          : `<span class="steady-note">Avanza con autonomía (${s.masteredCount} dominadas)</span>`;

                      return `<tr class="student-row ${statusClass}">
                        <td>
                          <div class="student-cell-name">
                            <span class="status-indicator ${statusClass}" aria-hidden="true"></span>
                            <div>
                              <strong>${escape(s.name)}</strong>
                              <span class="student-sub">${s.username ? `@${escape(s.username)} · cuenta escolar` : "cuenta personal / familiar"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="level-pill">${escape(s.currentLevel.label)}</span>
                          <span class="student-sub">${escape(s.currentLevel.unitTitle)}</span>
                        </td>
                        <td>
                          <div class="days-strip" aria-label="Practicó ${s.practiceDays} de 7 días">${daysDots}</div>
                          <span class="student-sub tabular">${s.practiceDays}/7 días · ${s.attemptsWeek} ej.</span>
                        </td>
                        <td class="num-col tabular">
                          <strong>${s.accuracyWeek !== null ? `${s.accuracyWeek} %` : "—"}</strong>
                          <span class="student-sub">${s.sheetsCompleted} ${s.sheetsCompleted === 1 ? "hoja" : "hojas"} · ${s.completedCount} lecc.</span>
                        </td>
                        ${
                          course.focusLesson
                            ? `<td>${
                                s.focusDone
                                  ? `<span class="focus-tag done">${ICONS.check} Al día</span>`
                                  : `<span class="focus-tag pending">Pendiente</span>`
                              }</td>`
                            : ""
                        }
                        <td>
                          <div class="support-cell">
                            <div class="support-topics">${supportText}</div>
                            <details class="student-manage">
                              <summary>Gestionar</summary>
                              <div class="student-manage-menu">
                                ${
                                  s.managedByTeacher
                                    ? `<button type="button" data-reset-student="${escape(s.id)}" data-student-name="${escape(s.name)}">Generar nueva clave y tarjeta</button>`
                                    : `<span class="muted small">Clave administrada por su familia o cuenta propia.</span>`
                                }
                                <button type="button" class="danger-link" data-remove-student="${escape(s.id)}" data-student-name="${escape(s.name)}" data-managed="${s.managedByTeacher}">
                                  ${s.managedByTeacher ? "Quitar y borrar cuenta escolar" : "Desvincular del curso"}
                                </button>
                              </div>
                            </details>
                          </div>
                        </td>
                      </tr>`;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>`
          : `<p class="muted empty-filter-msg">Ningún estudiante coincide con este filtro.</p>`
      }
    </section>`;
  }

  function paint() {
    if (!ui.classes.length || !ui.detail) {
      app.innerHTML = `<section class="teacher-shell">
        ${demoBannerHtml()}
        <header class="teacher-page-head">
          <div>
            <h1>Mis cursos y grupos PIE</h1>
            <p class="intro">Acompaña el avance real por Objetivo de Aprendizaje MINEDUC y Nivel neutro (A–O), sin sumar corrección manual.</p>
          </div>
        </header>
        <p id="teacher-feedback" role="status" class="feedback${ui.notice && !ui.noticeError ? " good" : ""}" ${ui.notice ? "" : "hidden"}>${escape(ui.notice)}</p>
        ${newClassDrawerHtml()}
      </section>`;
      bindEvents();
      return;
    }

    const { course, students } = ui.detail;
    const cohort = analyzeCohort({ course, students, lessons });
    const { pulse, stumbles, levelDistribution } = cohort;
    const hasSavedCreds = ui.credentialsByClass.get(course.id)?.length > 0;

    app.innerHTML = `<section class="teacher-shell">
      ${demoBannerHtml()}
      ${courseSwitcherHtml()}
      <p id="teacher-feedback" role="status" class="feedback${ui.notice && !ui.noticeError ? " good" : ""}" ${ui.notice ? "" : "hidden"}>${escape(ui.notice)}</p>
      ${newClassDrawerHtml()}

      <header class="teacher-course-header no-print">
        <div class="teacher-course-titles">
          <h1>${escape(course.name)}</h1>
          <p class="teacher-course-sub">
            <span>${escape(COURSE_GRADES[course.grade] || "Curso")}</span>
            ${course.school ? `<span>· ${escape(course.school)}</span>` : ""}
          </p>
        </div>
        <div class="teacher-course-actions">
          <div class="code-badge" title="Código para que estudiantes con cuenta propia se unan">
            <span class="code-badge-label">Pizarra</span>
            <strong class="code-badge-val tabular">${escape(course.code)}</strong>
            <button type="button" class="icon-btn" data-teacher-action="copy-code" aria-label="Copiar código ${escape(course.code)}">${ICONS.copy}</button>
          </div>
          <button type="button" class="primary" data-toggle-panel="roster">${ICONS.users}<span>Agregar estudiantes</span></button>
          ${hasSavedCreds ? `<button type="button" data-teacher-action="print-cards">${ICONS.print}<span>Imprimir tarjetas</span></button>` : ""}
          <button type="button" data-toggle-panel="settings" aria-label="Ajustes del curso">${ICONS.settings}<span>Ajustes</span></button>
        </div>
      </header>

      ${credentialsCardHtml(course)}
      ${rosterDrawerHtml(course, students.length === 0)}
      ${focusDrawerHtml(course)}
      ${settingsDrawerHtml(course)}

      <section class="cohort-pulse-strip tabular no-print" aria-label="Resumen semanal del grupo">
        <div class="pulse-cell">
          <span class="pulse-label">Practicaron (7 días)</span>
          <strong class="pulse-val">${pulse.activeWeek} <small>/ ${pulse.totalStudents}</small></strong>
          <span class="pulse-meta">${pulse.activePct} % del grupo activo</span>
        </div>
        <div class="pulse-cell">
          <span class="pulse-label">Precisión semanal</span>
          <strong class="pulse-val">${pulse.accuracyWeek !== null ? `${pulse.accuracyWeek} %` : "—"}</strong>
          <span class="pulse-meta">${pulse.attemptsWeek} ejercicios resueltos</span>
        </div>
        <div class="pulse-cell">
          <span class="pulse-label">Hojas al 100 %</span>
          <strong class="pulse-val">${pulse.sheetsTotal}</strong>
          <span class="pulse-meta">Fluidez acumulada</span>
        </div>
        <div class="pulse-cell${pulse.supportCount > 0 ? " is-alert" : ""}">
          <span class="pulse-label">Requieren apoyo</span>
          <strong class="pulse-val">${pulse.supportCount}</strong>
          <span class="pulse-meta">${pulse.inactiveCount} sin práctica esta semana</span>
        </div>
      </section>

      ${focusBarHtml(course, pulse)}

      ${
        students.length > 0
          ? `<div class="teacher-diagnostic-grid no-print">
              ${stumblesPanelHtml(course, stumbles)}
              ${levelsPanelHtml(levelDistribution, pulse.totalStudents)}
            </div>
            ${studentsTableHtml(course, cohort)}`
          : ""
      }
    </section>`;

    bindEvents();
  }

  function bindEvents() {
    const course = ui.detail?.course;

    for (const b of app.querySelectorAll("[data-select-course]")) {
      b.onclick = async () => {
        const id = b.dataset.selectCourse;
        if (id === ui.selectedId && ui.openPanel !== "new-class") return;
        ui.openPanel = null;
        ui.studentFilter = "all";
        ui.search = "";
        ui.notice = "";
        b.disabled = true;
        try {
          ui.selectedId = id;
          ui.detail = await backend.classDetail(id);
          if (isCurrent()) paint();
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
          b.disabled = false;
        }
      };
    }

    for (const b of app.querySelectorAll("[data-toggle-panel]")) {
      b.onclick = () => {
        const target = b.dataset.togglePanel;
        ui.openPanel = ui.openPanel === target ? null : target;
        ui.notice = "";
        paint();
      };
    }

    const createForm = app.querySelector("#create-course-form");
    if (createForm) {
      createForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = createForm.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(createForm));
        btn.disabled = true;
        try {
          const { course: created } = await backend.createClass(data);
          ui.openPanel = "roster";
          ui.studentFilter = "all";
          ui.notice = `Curso «${created.name}» creado. Código de pizarra: ${created.code}.`;
          ui.noticeError = false;
          await reloadSelected(created.id);
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
        } finally {
          btn.disabled = false;
        }
      };
    }

    const rosterForm = app.querySelector("#roster-batch-form");
    if (rosterForm && course) {
      rosterForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = rosterForm.querySelector('button[type="submit"]');
        const namesText = rosterForm.elements.namesText.value;
        btn.disabled = true;
        try {
          const { created } = await backend.addRoster(course.id, { namesText });
          const existing = ui.credentialsByClass.get(course.id) ?? [];
          ui.credentialsByClass.set(course.id, [...created, ...existing]);
          ui.openPanel = null;
          ui.notice = `Se crearon ${created.length} ${created.length === 1 ? "cuenta escolar" : "cuentas escolares"}. Imprime o descarga sus tarjetas de acceso.`;
          ui.noticeError = false;
          await reloadSelected(course.id);
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
        } finally {
          btn.disabled = false;
        }
      };
    }

    const focusForm = app.querySelector("#focus-form");
    if (focusForm && course) {
      focusForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = focusForm.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(focusForm));
        btn.disabled = true;
        try {
          await backend.updateClass(course.id, {
            focusLesson: data.focusLesson || null,
            focusNote: data.focusNote || "",
          });
          ui.openPanel = null;
          ui.notice = data.focusLesson
            ? "Foco del grupo actualizado. Tus estudiantes lo verán al entrar a su ruta."
            : "Se quitó el foco grupal.";
          ui.noticeError = false;
          await reloadSelected(course.id);
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
        } finally {
          btn.disabled = false;
        }
      };
    }

    const editForm = app.querySelector("#edit-course-form");
    if (editForm && course) {
      editForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = editForm.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(editForm));
        btn.disabled = true;
        try {
          await backend.updateClass(course.id, data);
          ui.openPanel = null;
          ui.notice = "Datos del curso actualizados.";
          ui.noticeError = false;
          await reloadSelected(course.id);
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
        } finally {
          btn.disabled = false;
        }
      };
    }

    for (const b of app.querySelectorAll("[data-quick-focus]")) {
      b.onclick = async () => {
        if (!course) return;
        const lessonId = b.dataset.quickFocus;
        const lesson = mathLessons.find((l) => l.id === lessonId);
        b.disabled = true;
        try {
          await backend.updateClass(course.id, {
            focusLesson: lessonId,
            focusNote: course.focusNote || "",
          });
          ui.notice = `«${lesson ? displayTitle(lesson) : lessonId}» quedó fijada como foco del grupo.`;
          ui.noticeError = false;
          await reloadSelected(course.id);
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
          b.disabled = false;
        }
      };
    }

    for (const b of app.querySelectorAll("[data-teacher-action]")) {
      b.onclick = async () => {
        const act = b.dataset.teacherAction;
        if (act === "demo-register") {
          onDemoRegister?.();
        } else if (act === "copy-code" && course) {
          try {
            await navigator.clipboard.writeText(course.code);
            setNotice(`Código ${course.code} copiado al portapapeles.`);
          } catch {
            setNotice(`Código de la pizarra: ${course.code}`);
          }
        } else if (act === "print-cards") {
          printAccessCards();
        } else if (act === "download-csv" && course) {
          const creds = ui.credentialsByClass.get(course.id) ?? [];
          if (creds.length) downloadCredentialsCsv(course.name, creds);
        } else if (act === "dismiss-cards" && course) {
          ui.credentialsByClass.delete(course.id);
          paint();
        } else if (act === "clear-focus" && course) {
          b.disabled = true;
          try {
            await backend.updateClass(course.id, { focusLesson: null, focusNote: "" });
            ui.openPanel = null;
            ui.notice = "Se quitó el foco del grupo.";
            ui.noticeError = false;
            await reloadSelected(course.id);
          } catch (err) {
            if (isCurrent()) setNotice(err.message, true);
            b.disabled = false;
          }
        } else if (act === "rotate-code" && course) {
          b.disabled = true;
          try {
            const { code } = await backend.rotateClassCode(course.id);
            ui.notice = `Nuevo código de pizarra generado: ${code}.`;
            ui.noticeError = false;
            await reloadSelected(course.id);
          } catch (err) {
            if (isCurrent()) setNotice(err.message, true);
            b.disabled = false;
          }
        } else if (act === "delete-course" && course) {
          if (
            !window.confirm(
              `¿Eliminar «${course.name}»? Las cuentas escolares creadas solo para este curso también se eliminarán; las cuentas personales o familiares conservan su avance.`,
            )
          )
            return;
          b.disabled = true;
          try {
            await backend.deleteClass(course.id);
            ui.credentialsByClass.delete(course.id);
            ui.openPanel = null;
            ui.notice = "Curso eliminado.";
            ui.noticeError = false;
            await reloadSelected(null);
          } catch (err) {
            if (isCurrent()) setNotice(err.message, true);
            b.disabled = false;
          }
        }
      };
    }

    for (const b of app.querySelectorAll("[data-filter-students]")) {
      b.onclick = () => {
        const next = b.dataset.filterStudents;
        ui.studentFilter = ui.studentFilter === next && next !== "all" ? "all" : next;
        paint();
      };
    }

    const searchInput = app.querySelector("#student-search");
    if (searchInput) {
      searchInput.oninput = (e) => {
        const pos = e.target.selectionStart ?? e.target.value.length;
        ui.search = e.target.value;
        paint();
        const nextInput = app.querySelector("#student-search");
        if (nextInput) {
          nextInput.focus?.();
          nextInput.setSelectionRange?.(pos, pos);
        }
      };
    }

    for (const b of app.querySelectorAll("[data-open-lesson]")) {
      b.onclick = () => onOpenLesson?.(b.dataset.openLesson);
    }
    for (const b of app.querySelectorAll("[data-open-sheet]")) {
      b.onclick = () => onOpenSheet?.(b.dataset.openSheet);
    }

    for (const b of app.querySelectorAll("[data-reset-student]")) {
      b.onclick = async () => {
        if (!course) return;
        b.disabled = true;
        try {
          const { credential } = await backend.resetClassStudentPassword(
            course.id,
            b.dataset.resetStudent,
          );
          const prev = (ui.credentialsByClass.get(course.id) ?? []).filter((c) => c.id !== credential.id);
          ui.credentialsByClass.set(course.id, [credential, ...prev]);
          ui.notice = `Nueva clave generada para ${credential.name}: ${credential.password} (usuario @${credential.username}).`;
          ui.noticeError = false;
          paint();
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
          b.disabled = false;
        }
      };
    }

    for (const b of app.querySelectorAll("[data-remove-student]")) {
      b.onclick = async () => {
        if (!course) return;
        const managed = b.dataset.managed === "true";
        const msg = managed
          ? `¿Quitar a ${b.dataset.studentName} y borrar su cuenta escolar? Si no pertenece a otro curso, su avance se eliminará.`
          : `¿Desvincular a ${b.dataset.studentName} de este curso? Su cuenta y avance personal se conservan.`;
        if (!window.confirm(msg)) return;
        b.disabled = true;
        try {
          await backend.removeClassStudent(course.id, b.dataset.removeStudent);
          ui.notice = managed ? "Estudiante retirado del curso." : "Estudiante desvinculado.";
          ui.noticeError = false;
          await reloadSelected(course.id);
        } catch (err) {
          if (isCurrent()) setNotice(err.message, true);
          b.disabled = false;
        }
      };
    }
  }

  loadInitial();
}
