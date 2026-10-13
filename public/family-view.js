import { api } from "./api.js";
import { escape, heading } from "./ui.js";
import { displayTitle } from "./learning.js";

const dateTime = (ms) =>
  ms
    ? new Date(ms).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
    : "Sin actividad";

// Cada render invalida los anteriores para que una respuesta lenta no pise la vista actual.
let renderId = 0;

export function renderFamilyPage({ app, session, lessons }) {
  const id = ++renderId;
  const current = () => id === renderId && app.dataset.view === "familia";
  app.dataset.view = "familia";

  if (session?.mode !== "account") {
    app.innerHTML =
      heading("APRENDER ACOMPAÑADO", "Mi familia", "Con una cuenta, tu apoderado puede ver tu avance y ayudarte si olvidas tu contraseña.") +
      `<section class="card"><h3>Necesitas una cuenta</h3><p class="muted">Sal de la demo con el botón «Salir» y elige «Crear cuenta». Si tienes menos de 14 años, tu apoderado crea primero su cuenta y desde aquí crea la tuya.</p></section>`;
    return;
  }

  const message = (text, good = false) => {
    const el = app.querySelector("#family-message");
    if (el) {
      el.textContent = text;
      el.className = "feedback" + (good ? " good" : "");
    }
  };
  const lessonTitle = (lessonId) => {
    const l = lessons.find((x) => x.id === lessonId);
    return l ? displayTitle(l) : null;
  };
  const guard = (fn) => async (e) => {
    e?.preventDefault?.();
    try {
      await fn(e);
    } catch (err) {
      if (current()) message(err.message);
    }
  };

  async function parentHome(notice = "") {
    app.innerHTML =
      heading("TU FAMILIA", "Mi familia", "Crea la cuenta de tus hijos menores de 14 años o vincula la de un estudiante mayor, y acompaña su avance.") +
      `<div id="family-message" role="status" class="feedback good">${escape(notice)}</div>
      <div class="family-forms">
        <section class="card"><h3>Crear la cuenta de un estudiante</h3><p class="muted">Para menores de 14 años. Al crearla das tu consentimiento como apoderado. Entrará con su usuario y contraseña, sin correo.</p>
          <form id="child-form" class="auth-grid">
            <label for="child-name">Nombre</label><input id="child-name" name="name" maxlength="60" required>
            <label for="child-username">Usuario</label><input id="child-username" name="username" maxlength="30" autocapitalize="none" autocomplete="off" placeholder="tomas.r" required>
            <label for="child-password">Contraseña (mínimo 8 caracteres)</label><input id="child-password" name="password" type="password" minlength="8" autocomplete="new-password" required>
            <button class="primary" type="submit">Crear cuenta</button>
          </form>
        </section>
        <section class="card"><h3>Vincular a un estudiante de 14 años o más</h3><p class="muted">Pídele que abra «Mi familia» en su cuenta y te entregue su código. Vence en 24 horas.</p>
          <form id="link-form" class="inline-form"><label for="link-code">Código</label><div class="inline-row"><input id="link-code" maxlength="12" autocomplete="off" autocapitalize="characters" placeholder="K7M2QX" required><button class="primary" type="submit">Vincular</button></div></form>
        </section>
      </div>
      <div id="children" aria-busy="true"><p class="muted">Cargando…</p></div>`;
    app.querySelector("#child-form").onsubmit = guard(async (e) => {
      const data = Object.fromEntries(new FormData(e.target));
      const { child } = await api.createChild(data);
      if (current()) parentHome(`Cuenta creada. ${child.name} entra con el usuario «${child.username}» y la contraseña que elegiste.`);
    });
    app.querySelector("#link-form").onsubmit = guard(async () => {
      const { child } = await api.linkChild(app.querySelector("#link-code").value);
      if (current()) parentHome(`Vinculaste a ${child.name}.`);
    });
    let children;
    try {
      ({ children } = await api.family());
    } catch (err) {
      if (current()) app.querySelector("#children").innerHTML = `<p class="feedback">${escape(err.message)}</p>`;
      return;
    }
    if (!current()) return;
    const list = app.querySelector("#children");
    list.removeAttribute("aria-busy");
    list.innerHTML = children.length
      ? `<div class="section-title"><h2>Su avance</h2><span class="muted">Solo cifras: sus notas y fotos son privadas.</span></div>` +
        children
          .map((c) => {
            const mastered = c.mastered.map(lessonTitle).filter(Boolean);
            const completed = c.completed.map(lessonTitle).filter(Boolean);
            return `<section class="card child-card">
              <div class="child-head"><h3>${escape(c.name)}</h3>${c.username ? `<span class="muted">Usuario: ${escape(c.username)}</span>` : ""}</div>
              <dl class="child-stats">
                <div><dt>Completadas</dt><dd>${completed.length} / ${lessons.length}</dd></div>
                <div><dt>Dominadas</dt><dd>${mastered.length}</dd></div>
                <div><dt>Ejercicios (7 días)</dt><dd>${c.attemptsWeek}</dd></div>
                <div><dt>Aciertos (7 días)</dt><dd>${c.accuracyWeek === null ? "—" : c.accuracyWeek + " %"}</dd></div>
                <div><dt>Videos vistos</dt><dd>${c.videosWatched}</dd></div>
                <div><dt>Última actividad</dt><dd>${dateTime(c.lastActivity)}</dd></div>
              </dl>
              <details><summary>Detalle y ajustes</summary>
                <p><strong>Dominadas:</strong> ${mastered.length ? mastered.map(escape).join(", ") : "ninguna todavía"}</p>
                <p><strong>Completadas:</strong> ${completed.length ? completed.map(escape).join(", ") : "ninguna todavía"}</p>
                ${c.createdByMe ? `<form class="inline-form" data-reset="${escape(c.id)}"><label for="reset-${escape(c.id)}">Nueva contraseña para ${escape(c.name)}</label><div class="inline-row"><input id="reset-${escape(c.id)}" type="password" minlength="8" autocomplete="new-password" required><button type="submit">Cambiar</button></div></form>` : ""}
                <button class="danger" data-remove="${escape(c.id)}" data-name="${escape(c.name)}" data-created="${c.createdByMe}">${c.createdByMe ? "Eliminar su cuenta" : "Desvincular"}</button>
              </details>
            </section>`;
          })
          .join("")
      : '<section class="card empty"><p class="muted">Todavía no hay estudiantes en tu familia.</p></section>';
    for (const form of list.querySelectorAll("[data-reset]"))
      form.onsubmit = guard(async () => {
        await api.resetChildPassword(form.dataset.reset, form.querySelector("input").value);
        if (current()) message("Contraseña cambiada. Sus sesiones abiertas se cerraron.", true);
        form.reset();
      });
    for (const b of list.querySelectorAll("[data-remove]"))
      b.onclick = guard(async () => {
        const created = b.dataset.created === "true";
        const question = created
          ? `¿Eliminar la cuenta de ${b.dataset.name}? Se borra su progreso y no se puede deshacer.`
          : `¿Desvincular a ${b.dataset.name}? Su cuenta y progreso se conservan.`;
        if (!window.confirm(question)) return;
        await api.removeChild(b.dataset.remove);
        if (current()) parentHome(created ? "Cuenta eliminada." : "Estudiante desvinculado.");
      });
  }

  async function studentHome() {
    app.innerHTML =
      heading("APRENDER ACOMPAÑADO", "Mi familia", "Vincula a tu apoderado para que pueda ver tu avance.") +
      `<section class="card"><p>Tu apoderado verá cuántas lecciones completas y dominas, cuánto practicas y cuántos videos viste. Tus notas y fotos no se comparten.</p><button class="primary" id="make-code">Generar código para mi apoderado</button><div id="family-message" role="status" class="feedback"></div><div id="code-box"></div></section><div id="parents" aria-busy="true"></div>`;
    app.querySelector("#make-code").onclick = guard(async () => {
      const { code, expiresAt } = await api.linkCode();
      if (!current()) return;
      app.querySelector("#code-box").innerHTML = `<p>Entrégale este código. Vence el ${escape(dateTime(expiresAt))}.</p><p class="class-code big-code">${escape(code)}</p>`;
    });
    try {
      const { parents } = await api.family();
      if (!current()) return;
      const box = app.querySelector("#parents");
      box.removeAttribute("aria-busy");
      box.innerHTML = parents.length
        ? `<section class="card"><h3>Apoderados vinculados</h3><p>${parents.map(escape).join(", ")}</p></section>`
        : "";
    } catch (err) {
      if (current()) message(err.message);
    }
  }

  (session.role === "parent" ? parentHome : studentHome)();
}
