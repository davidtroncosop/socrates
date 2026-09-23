import { api } from "./api.js";
import { escape, heading } from "./ui.js";
import { displayTitle } from "./learning.js";

const dateTime = (ms) =>
  ms
    ? new Date(ms).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
    : "Sin actividad";

// Cada render invalida los anteriores para que una respuesta lenta no pise la vista actual.
let renderId = 0;

export function renderClassPage({ app, session, lessons }) {
  const id = ++renderId;
  const current = () => id === renderId && app.dataset.view === "clase";
  app.dataset.view = "clase";

  if (session?.mode !== "account") {
    app.innerHTML =
      heading(
        "APRENDER EN COMUNIDAD",
        "Mi clase",
        "Las clases conectan a estudiantes y profesores para seguir el avance juntos.",
      ) +
      `<section class="card"><h3>Necesitas una cuenta</h3><p class="muted">${
        session?.role === "teacher"
          ? "Con una cuenta de profesor creas clases, compartes un código con tus estudiantes y ves cuánto practican y qué habilidades dominan."
          : "Con una cuenta de estudiante te unes a la clase de tu profesor con un código y tu progreso te acompaña en cualquier dispositivo."
      } Sal de la demo con el botón «Salir» y elige «Crear cuenta».</p></section>`;
    return;
  }

  const message = (text, good = false) => {
    const el = app.querySelector("#class-message");
    if (el) {
      el.textContent = text;
      el.className = "feedback" + (good ? " good" : "");
    }
  };
  const lessonTitle = (lessonId) => {
    const l = lessons.find((x) => x.id === lessonId);
    return l ? displayTitle(l) : null;
  };

  async function teacherHome(notice = "") {
    app.innerHTML =
      heading(
        "TUS CLASES",
        "Mi clase",
        "Crea una clase, comparte su código y sigue cuánto practica cada estudiante.",
      ) +
      `<section class="card"><form id="class-form" class="inline-form"><label for="class-name">Nombre de la nueva clase</label><div class="inline-row"><input id="class-name" maxlength="80" placeholder="7° Básico A · Matemática" required><button class="primary" type="submit">Crear clase</button></div></form><div id="class-message" role="status" class="feedback good">${escape(notice)}</div></section><div id="class-list" aria-busy="true"><p class="muted">Cargando tus clases…</p></div>`;
    app.querySelector("#class-form").onsubmit = async (e) => {
      e.preventDefault();
      const input = app.querySelector("#class-name");
      try {
        const { class: created } = await api.createClass(input.value);
        if (current())
          teacherHome(`Clase creada. Comparte el código ${created.code} con tus estudiantes.`);
      } catch (err) {
        if (current()) message(err.message);
      }
    };
    try {
      const { classes } = await api.classes();
      if (!current()) return;
      const list = app.querySelector("#class-list");
      list.removeAttribute("aria-busy");
      list.innerHTML = classes.length
        ? classes
            .map(
              (c) =>
                `<section class="lesson class-card"><span class="node">◎</span><div class="lesson-info"><h3>${escape(c.name)}</h3><p>${c.students} estudiante${c.students === 1 ? "" : "s"} · Código <strong class="class-code">${escape(c.code)}</strong></p></div><button class="primary" data-class-open="${escape(c.id)}">Ver avance →</button></section>`,
            )
            .join("")
        : '<section class="card empty"><p class="muted">Todavía no tienes clases. Crea la primera arriba.</p></section>';
      for (const b of list.querySelectorAll("[data-class-open]"))
        b.onclick = () => teacherClass(b.dataset.classOpen);
    } catch (err) {
      if (current()) app.querySelector("#class-list").innerHTML = `<p class="feedback">${escape(err.message)}</p>`;
    }
  }

  async function teacherClass(classId) {
    app.innerHTML = '<p class="muted" aria-busy="true">Cargando la clase…</p>';
    let data;
    try {
      data = await api.classDetail(classId);
    } catch (err) {
      if (current()) teacherHome(err.message);
      return;
    }
    if (!current()) return;
    const { class: c, students } = data;
    const rows = students
      .map((s) => {
        const mastered = s.mastered.map(lessonTitle).filter(Boolean);
        const completed = s.completed.map(lessonTitle).filter(Boolean);
        return `<tr><th scope="row">${escape(s.name)}</th><td>${completed.length} / ${lessons.length}</td><td>${mastered.length}</td><td>${s.videosWatched ?? 0}</td><td>${s.attemptsWeek}</td><td>${s.accuracyWeek === null ? "—" : s.accuracyWeek + " %"}</td><td>${dateTime(s.lastActivity)}</td><td><details><summary>Detalle</summary><p><strong>Dominadas:</strong> ${mastered.length ? mastered.map(escape).join(", ") : "ninguna todavía"}</p><p><strong>Completadas:</strong> ${completed.length ? completed.map(escape).join(", ") : "ninguna todavía"}</p><button class="danger" data-remove="${escape(s.id)}" data-name="${escape(s.name)}">Retirar de la clase</button></details></td></tr>`;
      })
      .join("");
    app.innerHTML =
      `<button class="back" data-class-back>← Mis clases</button>` +
      heading("AVANCE DE LA CLASE", c.name, "Resultados de práctica en la plataforma. Complementan, no reemplazan, tu evaluación en aula.") +
      `<section class="card"><p>Código para unirse: <strong class="class-code">${escape(c.code)}</strong></p><p class="muted">Tus estudiantes lo ingresan en «Mi clase» después de crear su cuenta. Solo ves cifras de avance; sus notas y fotos quedan privadas.</p><div id="class-message" role="status" class="feedback"></div></section>` +
      (students.length
        ? `<div class="table-wrap"><table class="class-table"><caption class="visually-hidden">Avance por estudiante</caption><thead><tr><th scope="col">Estudiante</th><th scope="col">Completadas</th><th scope="col">Dominadas</th><th scope="col">Videos vistos</th><th scope="col">Intentos (7 días)</th><th scope="col">Aciertos (7 días)</th><th scope="col">Última actividad</th><th scope="col"></th></tr></thead><tbody>${rows}</tbody></table></div>`
        : '<section class="card empty"><p class="muted">Aún no se une ningún estudiante. Comparte el código de arriba.</p></section>');
    app.querySelector("[data-class-back]").onclick = () => teacherHome();
    for (const b of app.querySelectorAll("[data-remove]"))
      b.onclick = async () => {
        if (!window.confirm(`¿Retirar a ${b.dataset.name} de la clase? Su progreso no se borra.`)) return;
        try {
          await api.removeStudent(c.id, b.dataset.remove);
          if (current()) teacherClass(c.id);
        } catch (err) {
          if (current()) message(err.message);
        }
      };
  }

  async function studentHome(notice = "") {
    app.innerHTML =
      heading("APRENDER EN COMUNIDAD", "Mi clase", "Únete a la clase de tu profesor para que pueda acompañar tu avance.") +
      `<section class="card"><form id="join-form" class="inline-form"><label for="join-code">Código de la clase</label><div class="inline-row"><input id="join-code" maxlength="12" autocomplete="off" autocapitalize="characters" placeholder="Ej.: K7M2QX" required><button class="primary" type="submit">Unirme</button></div></form><div id="class-message" role="status" class="feedback good">${escape(notice)}</div><p class="muted">Tu profesor verá cuántas lecciones completas y dominas, cuántos videos viste y cuándo practicaste. Tus notas y fotos no se comparten.</p></section><div id="class-list" aria-busy="true"><p class="muted">Cargando…</p></div>`;
    app.querySelector("#join-form").onsubmit = async (e) => {
      e.preventDefault();
      try {
        const { class: joined } = await api.joinClass(app.querySelector("#join-code").value);
        if (current()) studentHome(`Te uniste a «${joined.name}».`);
      } catch (err) {
        if (current()) message(err.message);
      }
    };
    try {
      const { classes } = await api.classes();
      if (!current()) return;
      const list = app.querySelector("#class-list");
      list.removeAttribute("aria-busy");
      list.innerHTML = classes
        .map(
          (c) =>
            `<section class="lesson"><span class="node">◎</span><div class="lesson-info"><h3>${escape(c.name)}</h3><p>Profesor/a: ${escape(c.teacher)} · desde ${new Date(c.joinedAt).toLocaleDateString("es-CL")}</p></div></section>`,
        )
        .join("");
    } catch (err) {
      if (current()) app.querySelector("#class-list").innerHTML = `<p class="feedback">${escape(err.message)}</p>`;
    }
  }

  (session.role === "teacher" ? teacherHome : studentHome)();
}
