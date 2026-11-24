import { importCSV, exportCSV } from "./csv.js";
import {
  validateCatalog,
  mergeCatalog,
  newLesson,
  formQuestion,
  seedCatalog,
} from "./content.js";
import { getSubject, GRADES } from "./learning.js";
import { formatMistakes } from "./mistakes.js";
import { videoFromFields, videoPlayer, watchUrl, formatTime } from "./video.js";
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const stages = [
  "Calentamiento",
  "Práctica guiada",
  "Aplicación",
  "Desafío de autonomía",
  "Repaso posterior",
];
export function createAdmin({ app, getCatalog, commit, warning = () => "" }) {
  let editing = null,
    pending = null,
    replaceImport = false,
    dirty = false;
  const $ = (s) => app.querySelector(s);
  function message(text, error = false) {
    const target = $("#admin-message");
    target.textContent = text;
    target.className = "feedback" + (error ? "" : " good");
  }
  function download(data, name, csv = false) {
    const url = URL.createObjectURL(
      new Blob([csv ? exportCSV(data) : JSON.stringify(data, null, 2)], {
        type: csv ? "text/csv;charset=utf-8" : "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function render(notice = "") {
    editing = null;
    pending = null;
    dirty = false;
    const catalog = getCatalog();
    app.innerHTML = `<div class="eyebrow">ESTUDIO DE CONTENIDO</div><h1>Lo que enseñas empieza aquí.</h1><p class="intro">Crea lecciones, prepara las pistas y decide cuándo están listas para tu ruta.</p><div class="callout">Catálogo central · Cada cambio que guardas se publica para todos los estudiantes. Las lecciones en borrador no se muestran. Exporta un respaldo JSON antes de cambios grandes.</div><div class="admin-toolbar"><button class="primary" data-admin="new">＋ Nueva lección</button><button data-admin="import">Subir CSV o JSON</button><button data-admin="export">Respaldo JSON</button><button data-admin="export-csv">Exportar CSV</button><button data-admin="template">Plantilla para Excel (CSV)</button><button data-admin="metrics">📊 Dónde se traban</button><input id="content-file" type="file" accept=".csv,.json,text/csv,application/json" hidden></div><div id="admin-message" role="status" class="feedback ${warning() ? "" : "good"}">${esc(warning() || notice)}</div><label for="import-mode">Al importar</label><select id="import-mode"><option value="add">Añadir lecciones nuevas como borradores</option><option value="replace">Restaurar catálogo: reemplazar el contenido actual</option></select><p class="muted">En Excel, guarda la plantilla como CSV UTF-8. Usa cuatro filas de tipo ejercicio (orden 1–4) y una de tipo repaso por lección. No se admiten archivos .xlsx directamente.</p><div id="import-preview"></div><div class="section-title"><h2>Biblioteca de lecciones</h2><span class="muted">${catalog.lessons.length} lecciones · ${catalog.lessons.filter((l) => l.status === "published").length} publicadas</span></div><label for="content-search">Buscar por título</label><input id="content-search" type="search" placeholder="Busca una lección…"><div id="content-list"></div>`;
    list("");
    $("#content-search").oninput = (e) => list(e.target.value);
    $("#content-file").onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (file.size > 2 * 1024 * 1024)
          throw Error("El archivo supera el máximo de 2 MB.");
        const raw = await file.text();
        pending = file.name.toLowerCase().endsWith(".csv")
          ? importCSV(raw)
          : validateCatalog(JSON.parse(raw));
        replaceImport = $("#import-mode").value === "replace";
        if (!pending.lessons.length)
          throw Error("El archivo no contiene lecciones.");
        if (!replaceImport) mergeCatalog(getCatalog(), pending);
        $("#import-preview").innerHTML =
          `<section class="card import-preview"><h2>Revisar importación</h2><p>${replaceImport ? `Se reemplazará el catálogo actual (${getCatalog().lessons.length} lecciones) por las ${pending.lessons.length} del archivo. Los estados del respaldo JSON se conservan; el CSV entra como borrador.` : `Se añadirán ${pending.lessons.length} lecciones como borradores. El contenido existente se conserva.`}</p><ul>${pending.lessons.map((l) => `<li>${esc(l.title)} · 4 ejercicios + repaso</li>`).join("")}</ul><div class="actions"><button class="primary" data-admin="confirm-import">${replaceImport ? "Reemplazar catálogo" : "Importar borradores"}</button><button data-admin="cancel-import">Cancelar</button></div></section>`;
        message("Archivo validado. Revisa la lista antes de importar.");
      } catch (err) {
        pending = null;
        $("#import-preview").innerHTML = "";
        message(err.message, true);
      } finally {
        e.target.value = "";
      }
    };
  }
  function list(query) {
    const all = getCatalog().lessons;
    const filtered = all.filter((l) =>
      l.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    $("#content-list").innerHTML = filtered.length
      ? filtered
          .map((l) => {
            const i = all.findIndex((x) => x.id === l.id);
            const sub = getSubject(l);
            const isLang = sub === "lenguaje";
            const subjectTag = `<span class="subject-tag ${isLang ? "subject-lang" : "subject-math"}">${isLang ? "📖 Lenguaje" : "📐 Matemática"}</span>`;
            return `<article class="lesson admin-lesson ${isLang ? "lesson-lang" : "lesson-math"}"><span class="node">${String(i + 1).padStart(2, "0")}</span><div class="lesson-info"><div class="lesson-tags"><span class="status-tag ${l.status}">${l.status === "published" ? "Publicada" : "Borrador"}</span><span class="oa-badge">${esc(GRADES[l.grade])}</span>${subjectTag}</div><h3>${esc(l.title)}</h3><p>${esc(l.description)}</p><small>4 ejercicios + repaso</small></div><div class="actions"><button data-admin="edit" data-id="${esc(l.id)}">Editar</button><button data-admin="toggle" data-id="${esc(l.id)}">${l.status === "published" ? "Retirar de ruta" : "Publicar"}</button><button data-admin="up" data-id="${esc(l.id)}" ${i === 0 ? "disabled" : ""} aria-label="Subir ${esc(l.title)}">↑</button><button data-admin="down" data-id="${esc(l.id)}" ${i === all.length - 1 ? "disabled" : ""} aria-label="Bajar ${esc(l.title)}">↓</button></div></article>`;
          })
          .join("")
      : '<section class="card empty">No hay lecciones para mostrar. Crea una o importa un archivo.</section>';
  }
  function field(name, label, value, large = false) {
    return `<label for="${name}">${label}</label>${large ? `<textarea id="${name}" name="${name}" required maxlength="3000">${esc(value)}</textarea>` : `<input id="${name}" name="${name}" required maxlength="${name === "title" ? 150 : name === "description" ? 300 : 3000}" value="${esc(value)}">`}`;
  }
  function select(name, label, value, options) {
    return `<label for="${name}">${label}</label><select id="${name}" name="${name}">${Object.entries(
      options,
    )
      .map(
        ([key, text]) =>
          `<option value="${key}"${key === value ? " selected" : ""}>${esc(text)}</option>`,
      )
      .join("")}</select>`;
  }
  function videoFields(video) {
    const input = (name, label, value, attrs = "") =>
      `<label for="${name}">${label}</label><input id="${name}" name="${name}" value="${esc(value ?? "")}" ${attrs}>`;
    return `<section class="card"><h2>Video explicativo <span class="muted">(opcional)</span></h2><p class="muted">Aparece en la lección inicial y como ayuda en la segunda pista, nunca en el desafío final ni en los repasos. Elige un tramo de 2 a 5 minutos. Revisa de vez en cuando que el video siga disponible.</p>${input("video-url", "Enlace de YouTube", video ? watchUrl({ id: video.id }) : "", 'type="url" inputmode="url" placeholder="https://www.youtube.com/watch?v=…"')}${input("video-title", "Título que verá el estudiante", video?.title, 'maxlength="150" placeholder="Resolver ecuaciones con la balanza"')}<div class="editor-grid"><div>${input("video-start", "Desde (opcional)", video?.start ? formatTime(video.start) : "", 'placeholder="1:30"')}</div><div>${input("video-end", "Hasta (opcional)", video?.end !== undefined ? formatTime(video.end) : "", 'placeholder="4:00"')}</div></div></section>`;
  }
  function editor(lesson) {
    editing = structuredClone(lesson);
    dirty = false;
    app.innerHTML = `<button class="back" data-admin="back">← Biblioteca de contenido</button><div class="eyebrow">EDITOR DE LECCIONES</div><h1>${lesson.title ? "Editar lección" : "Una nueva oportunidad de aprender."}</h1><p class="intro">Completa cuatro ejercicios y un repaso diferente. Esta versión admite respuestas numéricas. Guardar conserva el estado actual de publicación.</p><div id="admin-message" class="feedback" role="status"></div><form id="lesson-editor"><section class="card">${field("title", "Título", lesson.title)}${field("description", "Descripción breve", lesson.description)}<div class="editor-grid"><div>${select("subject", "Materia", lesson.subject, { matematica: "📐 Matemática", lenguaje: "📖 Lenguaje" })}</div><div>${select("grade", "Curso", lesson.grade, GRADES)}</div></div>${field("concept", "Concepto que aprenderá el alumno", lesson.concept, true)}${field("examples", "Ejemplo resuelto para la segunda pista", lesson.examples, true)}<p class="muted">Identificador: ${esc(lesson.id)} · ${lesson.status === "published" ? "Publicada" : "Borrador"}</p></section>${videoFields(lesson.video)}<div class="section-title"><h2>Diseña la práctica</h2><span class="muted">4 ejercicios + 1 repaso</span></div>${[...lesson.questions, lesson.review].map((q, i) => `<fieldset class="card question-editor"><legend>${i + 1}. ${stages[i]}</legend>${field("q" + i + "-0", "Expresión o problema", q[0])}${field("q" + i + "-2", "Instrucción para el alumno", q[2], true)}<div class="editor-grid"><div>${field("q" + i + "-1", "Respuesta numérica correcta", q[1])}</div><div>${field("q" + i + "-3", "Primera pista", q[3])}</div></div>${field("q" + i + "-4", "Explicación de la solución", q[4], true)}<label for="q${i}-5">Errores frecuentes (opcional)</label><textarea id="q${i}-5" name="q${i}-5" maxlength="2000" placeholder="Una línea por error, por ejemplo:&#10;−7: Revisa el signo al cambiar de lado.&#10;9: Restaste 3 pero falta dividir entre 2.">${esc(formatMistakes(q[5]))}</textarea><p class="muted">Si el estudiante responde uno de estos valores, verá tu mensaje. Los errores de signo y de despeje en ecuaciones lineales se detectan solos.</p></fieldset>`).join("")}<div class="editor-save actions"><button type="submit" class="primary">Guardar ${lesson.status === "published" ? "cambios" : "borrador"}</button><button type="button" data-admin="preview">Vista previa</button><button type="button" data-admin="back">Cancelar</button></div></form><div id="lesson-preview"></div>`;
    $("#lesson-editor").oninput = () => {
      dirty = true;
    };
    $("#lesson-editor").onsubmit = async (e) => {
      e.preventDefault();
      try {
        const lesson = collect();
        const next = structuredClone(getCatalog());
        const i = next.lessons.findIndex((l) => l.id === lesson.id);
        if (i < 0) next.lessons.push(lesson);
        else next.lessons[i] = lesson;
        await commit(next);
        dirty = false;
        render(
          "Lección guardada. " +
            (lesson.status === "draft"
              ? "Puedes publicarla cuando esté lista."
              : "Los cambios ya están en la ruta."),
        );
      } catch (err) {
        message(err.message, true);
      }
    };
  }
  function collect() {
    const data = new FormData($("#lesson-editor"));
    const lesson = {
      ...editing,
      ...Object.fromEntries(
        ["title", "description", "subject", "grade", "concept", "examples"].map((key) => [
          key,
          data.get(key),
        ]),
      ),
      questions: Array.from({ length: 4 }, (_, i) =>
        formQuestion(data, "q" + i),
      ),
      review: formQuestion(data, "q4"),
      video: videoFromFields({
        url: data.get("video-url"),
        title: data.get("video-title"),
        start: data.get("video-start"),
        end: data.get("video-end"),
      }),
    };
    return validateCatalog({ version: 1, lessons: [lesson] }).lessons[0];
  }
  // Medición anónima: lecciones ordenadas de la que más cuesta a la que menos.
  async function metricsView() {
    app.innerHTML = `<button class="back" data-admin="back">← Biblioteca de contenido</button><div class="eyebrow">MEDICIÓN ANÓNIMA</div><h1>Dónde se traban</h1><p class="intro">Contadores de los últimos 90 días, sin datos de quién respondió. Una lección con muchos errores o muchas soluciones vistas necesita una mejor explicación o ejercicios más graduales.</p><div id="metrics-body" class="muted">Cargando…</div>`;
    let data;
    try {
      const res = await fetch("/api/metrics", { credentials: "same-origin" });
      data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudieron cargar las métricas.");
    } catch (err) {
      const target = app.querySelector("#metrics-body");
      if (target) target.textContent = err.message;
      return;
    }
    const target = app.querySelector("#metrics-body");
    if (!target) return;
    const titles = new Map(getCatalog().lessons.map((l) => [l.id, l.title]));
    const byLesson = new Map();
    for (const m of data.metrics) {
      const row = byLesson.get(m.lesson) ?? { correct: 0, wrong: 0, hint: 0, revealed: 0, photo: 0, game: 0, sheet: 0, steps: {} };
      row[m.kind] = (row[m.kind] ?? 0) + m.count;
      if (m.step <= 3) {
        const st = (row.steps[m.step] ??= { correct: 0, wrong: 0 });
        if (m.kind in st) st[m.kind] += m.count;
      }
      byLesson.set(m.lesson, row);
    }
    const rows = [...byLesson]
      .map(([id, r]) => {
        const tries = r.correct + r.wrong;
        const hardest = Object.entries(r.steps)
          .filter(([, st]) => st.correct + st.wrong >= 3)
          .sort(([, a], [, b]) => b.wrong / (b.correct + b.wrong) - a.wrong / (a.correct + a.wrong))[0];
        return { id, tries, rate: tries ? r.wrong / tries : 0, ...r, hardest: hardest ? Number(hardest[0]) + 1 : null };
      })
      .filter((r) => r.tries > 0 || r.game > 0 || r.photo > 0 || r.sheet > 0)
      .sort((a, b) => b.rate - a.rate || b.tries - a.tries);
    target.outerHTML = rows.length
      ? `<div class="table-scroll"><table class="metrics-table"><thead><tr><th>Lección</th><th>Respuestas</th><th>Errores</th><th>Pistas</th><th>Soluciones vistas</th><th>Fotos pendientes</th><th>Minijuegos</th><th>Hojas 100 %</th><th>Ejercicio más difícil</th></tr></thead><tbody>${rows
          .map((r) => `<tr><td>${esc(titles.get(r.id) ?? r.id)}</td><td>${r.tries}</td><td>${r.tries ? `${Math.round(r.rate * 100)} %` : "—"}</td><td>${r.hint}</td><td>${r.revealed}</td><td>${r.photo}</td><td>${r.game}</td><td>${r.sheet}</td><td>${r.hardest ?? "—"}</td></tr>`)
          .join("")}</tbody></table></div>`
      : `<p class="muted">Todavía no hay respuestas registradas.</p>`;
  }
  async function handle(e) {
    const b = e.target.closest("[data-admin]");
    if (!b || b.disabled) return;
    const action = b.dataset.admin,
      id = b.dataset.id;
    try {
      if (action === "new") editor(newLesson());
      else if (action === "metrics") await metricsView();
      else if (action === "edit")
        editor(getCatalog().lessons.find((l) => l.id === id));
      else if (action === "back") {
        if (!dirty || window.confirm("¿Descartar los cambios sin guardar?"))
          render();
      } else if (action === "export")
        download(getCatalog(), "socatres-contenido.json");
      else if (action === "export-csv")
        download(getCatalog(), "socatres-contenido.csv", true);
      else if (action === "template") {
        const l = seedCatalog().lessons[0];
        l.id = "mi-primera-leccion";
        l.status = "draft";
        download({ version: 1, lessons: [l] }, "socatres-plantilla.csv", true);
      } else if (action === "import") $("#content-file").click();
      else if (action === "cancel-import") {
        pending = null;
        $("#import-preview").innerHTML = "";
        message("Importación cancelada.");
      } else if (action === "confirm-import" && pending) {
        await commit(replaceImport ? pending : mergeCatalog(getCatalog(), pending));
        render(
          "Importación completada. Revisa las lecciones y su estado antes de continuar.",
        );
      } else if (action === "preview") {
        const l = collect();
        const sub = getSubject(l);
        const isLang = sub === "lenguaje";
        $("#lesson-preview").innerHTML =
          `<section class="card import-preview"><div class="eyebrow">VISTA PREVIA · SIN GUARDAR</div><div class="lesson-tags" style="margin:8px 0;"><span class="subject-tag ${isLang ? "subject-lang" : "subject-math"}">${isLang ? "📖 Lenguaje" : "📐 Matemática"}</span></div><h2>${esc(l.title)}</h2><p>${esc(l.concept)}</p>${l.video ? `<h3>${esc(l.video.title)}</h3>${videoPlayer(l.video, false)}` : ""}${[...l.questions, l.review].map((q, i) => `<article class="note"><h3>${stages[i]}</h3><p>${esc(q[2])}</p><div class="equation">${esc(q[0])}</div><details><summary>Revisar respuesta y ayudas</summary><p>Respuesta: ${esc(q[1])}</p><p>Pista: ${esc(q[3])}</p><p>Ejemplo: ${esc(l.examples)}</p><p>${esc(q[4])}</p></details></article>`).join("")}</section>`;
        $("#lesson-preview").scrollIntoView({ behavior: "smooth" });
      } else if (["toggle", "up", "down"].includes(action)) {
        const next = structuredClone(getCatalog());
        const i = next.lessons.findIndex((l) => l.id === id);
        if (i < 0) return;
        if (action === "toggle")
          next.lessons[i].status =
            next.lessons[i].status === "published" ? "draft" : "published";
        else {
          const j = i + (action === "up" ? -1 : 1);
          if (j < 0 || j >= next.lessons.length) return;
          [next.lessons[i], next.lessons[j]] = [
            next.lessons[j],
            next.lessons[i],
          ];
        }
        await commit(next);
        render("Contenido actualizado.");
      }
    } catch (err) {
      message(err.message, true);
    }
  }
  app.addEventListener("click", handle);
  window.addEventListener("beforeunload", (e) => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (a && dirty) {
        if (!window.confirm("¿Salir y descartar los cambios sin guardar?"))
          e.preventDefault();
        else dirty = false;
      }
    },
    true,
  );
  return { render };
}
