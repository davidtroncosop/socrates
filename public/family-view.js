import { api } from "./api.js";
import { escape, heading } from "./ui.js";
import { displayTitle } from "./learning.js";
import { weeklySummary, compareText } from "./weekly.js";
import { FICHAS_RULE_FAMILY } from "./stats.js";
import { hydrateTelegramCard } from "./notify.js";
import { hydrateStudentClassesBox } from "./teacher-view.js";

const dateTime = (ms) =>
  ms
    ? new Date(ms).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
    : "Sin actividad";

const lessonList = (list) =>
  list.map((l) => `<li>${escape(l.title)} <span class="muted">· ${l.accuracy} % de aciertos en ${l.attempts} ejercicios</span></li>`).join("");

// Ideas para empezar: premios compartidos o de elección, mejor que pantalla.
const REWARD_IDEAS = [
  ["Elegir la película de la noche de cine", 5],
  ["Elegir la comida del viernes", 6],
  ["Tarde de parque o paseo", 10],
  ["Invitar a un amigo a la casa", 10],
  ["Elegir el panorama del fin de semana", 12],
];
const WEEK = 7 * 86400000;

function rewardsCard(rewards) {
  return `<section class="card rewards-card">
    <h3>🎁 Premios en casa</h3>
    <p class="muted">Acuerden juntos 3 a 5 premios y cuántas fichas cuesta cada uno. ${escape(FICHAS_RULE_FAMILY)} Cuando pida un premio, lo apruebas aquí.</p>
    ${rewards.length
      ? `<ul class="reward-list">${rewards
          .map((r) => `<li><span>${escape(r.title)}</span><span class="ht-r-cost">${r.cost} fichas</span><button class="link-button" data-remove-reward="${escape(r.id)}" aria-label="Borrar ${escape(r.title)}">Borrar</button></li>`)
          .join("")}</ul>`
      : '<p class="muted">Todavía no hay premios.</p>'}
    <form id="reward-form" class="reward-form">
      <label for="reward-title">Premio</label>
      <input id="reward-title" name="title" maxlength="60" required placeholder="Elegir la película">
      <label for="reward-cost">Fichas</label>
      <input id="reward-cost" name="cost" type="number" min="1" max="200" required inputmode="numeric" placeholder="5">
      <button class="primary" type="submit">Agregar premio</button>
    </form>
    <p class="muted reward-ideas-label">Ideas (tócala para usarla):</p>
    <div class="reward-ideas">${REWARD_IDEAS.map(([t, c]) => `<button type="button" class="chip" data-idea="${escape(t)}" data-cost="${c}">${escape(t)} · ${c}</button>`).join("")}</div>
    <p class="muted small">Consejo: premien la constancia, cumplan siempre lo acordado y, cuando el hábito ya esté, espacien los premios.</p>
  </section>`;
}

function claimsBlock(c) {
  const pending = c.claims.filter((x) => x.status === "pending");
  if (!pending.length) return "";
  return `<div class="claim-requests">${pending
    .map((x) => `<div class="claim-request" role="group" aria-label="Pedido de premio">
      <p>🎁 <strong>${escape(c.name)}</strong> pide <strong>«${escape(x.title)}»</strong> (${x.cost} fichas).</p>
      <div class="inline-row"><button class="primary" data-claim="${escape(x.id)}" data-approve="true">Aprobar</button><button class="secondary" data-claim="${escape(x.id)}" data-approve="false">Ahora no</button></div>
    </div>`)
    .join("")}</div>`;
}

function weeklyCard(w, claims = []) {
  const got = claims.filter((x) => x.status === "approved" && x.decidedAt >= Date.now() - WEEK);
  const max = Math.max(1, ...w.days.map((d) => d.count));
  const days = w.days
    .map(
      (d) => `<li class="${d.count ? "practiced" : ""}" title="${d.count} ejercicios">
        <span class="weekly-bar" style="--h:${d.count ? Math.max(12, Math.round((d.count / max) * 100)) : 0}%"></span>
        <span class="weekly-day">${escape(d.label)}</span></li>`,
    )
    .join("");
  const summary = w.attempts
    ? `<p><strong>${w.attempts} ejercicios</strong>${compareText(w.attempts, w.prevAttempts, "")} en ${w.lessonsPracticed === 1 ? "1 lección" : `${w.lessonsPracticed} lecciones`}, con <strong>${w.accuracy} % de aciertos</strong>${compareText(w.accuracy, w.prevAccuracy, " puntos")}.</p>`
    : "";
  return `<section class="weekly" aria-label="Resumen de los últimos 7 días">
    <h4>Resumen de la semana</h4>
    <p class="muted">Practicó ${w.practiceDays === 1 ? "1 día" : `${w.practiceDays} días`} de 7.</p>
    <ol class="weekly-days">${days}</ol>
    ${summary}
    ${w.strong.length ? `<h5>👍 Le va bien en</h5><ul>${lessonList(w.strong)}</ul>` : ""}
    ${w.support.length ? `<h5>🤝 Necesita apoyo en</h5><ul>${lessonList(w.support)}</ul>` : ""}
    ${got.length ? `<p>🎁 Canjeó: ${got.map((x) => `«${escape(x.title)}»`).join(", ")}.</p>` : ""}
    <p class="weekly-tip"><strong>Sugerencia:</strong> ${escape(w.tip)}</p>
  </section>`;
}

// Cada render invalida los anteriores para que una respuesta lenta no pise la vista actual.
let renderId = 0;

export function renderFamilyPage({ app, session, lessons, onOpenLesson, onOpenSheet }) {
  const id = ++renderId;
  const current = () => id === renderId && app.dataset.view === "familia";
  app.dataset.view = "familia";

  if (session?.mode !== "account") {
    app.innerHTML =
      heading("APRENDER ACOMPAÑADO", "Mi familia", "Con una cuenta, tu apoderado puede ver tu avance y ayudarte si olvidas tu contraseña.") +
      `<section class="card family-empty-card"><img class="empty-owl-img" src="buho-rama.webp" alt="" width="116" height="123" /><div><h3>Necesitas una cuenta</h3><p class="muted">Sal de la demo con el botón «Salir» y elige «Crear cuenta». Si tienes menos de 14 años, tu apoderado crea primero su cuenta y desde aquí crea la tuya.</p></div></section>`;
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
    const trigger = e?.target?.matches?.("form")
      ? e.target.querySelector('button[type="submit"]')
      : e?.currentTarget;
    if (trigger?.disabled) return;
    if (trigger && "disabled" in trigger) trigger.disabled = true;
    try {
      await fn(e);
    } catch (err) {
      if (current()) message(err.message);
    } finally {
      if (trigger && "disabled" in trigger) trigger.disabled = false;
    }
  };

  async function parentHome(notice = "") {
    app.innerHTML =
      heading("TU FAMILIA", "Mi familia", "Crea la cuenta de tus hijos menores de 14 años o vincula la de un estudiante mayor, y acompaña su avance.") +
      `<div id="family-message" role="status" class="feedback good">${escape(notice)}</div>
      <div class="family-forms">
        <section class="card"><h3>Crear la cuenta de un estudiante</h3><p class="muted">Para menores de 14 años. Al crearla das tu consentimiento como apoderado, también para que una IA revise las fotos de su desarrollo en papel (solo la hoja; no se guardan). Entrará con su usuario y contraseña, sin correo.</p>
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
      <div id="children" aria-busy="true"><p class="muted">Cargando…</p></div>
      <div id="telegram-box"></div>
      <div id="rewards-box"></div>`;
    hydrateTelegramCard(app.querySelector("#telegram-box"), session);
    app.querySelector("#child-form").onsubmit = guard(async (e) => {
      const data = Object.fromEntries(new FormData(e.target));
      const { child } = await api.createChild(data);
      if (current()) parentHome(`Cuenta creada. ${child.name} entra con el usuario «${child.username}» y la contraseña que elegiste.`);
    });
    app.querySelector("#link-form").onsubmit = guard(async () => {
      const { child } = await api.linkChild(app.querySelector("#link-code").value);
      if (current()) parentHome(`Vinculaste a ${child.name}.`);
    });
    let children, rewards;
    try {
      ({ children, rewards } = await api.family());
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
              ${claimsBlock(c)}
              <dl class="child-stats">
                <div><dt>Completadas</dt><dd>${completed.length} / ${lessons.length}</dd></div>
                <div><dt>Dominadas</dt><dd>${mastered.length}</dd></div>
                <div><dt>Videos vistos</dt><dd>${c.videosWatched}</dd></div>
                <div><dt>Fichas disponibles</dt><dd>🪙 ${c.fichas.balance}</dd></div>
                <div><dt>Última actividad</dt><dd>${dateTime(c.lastActivity)}</dd></div>
              </dl>
              ${weeklyCard(weeklySummary(c.recent, lessonTitle), c.claims)}
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
    const box = app.querySelector("#rewards-box");
    box.innerHTML = rewardsCard(rewards);
    const rewardForm = box.querySelector("#reward-form");
    rewardForm.onsubmit = guard(async () => {
      const data = Object.fromEntries(new FormData(rewardForm));
      await api.addReward({ title: data.title, cost: Number(data.cost) });
      if (current()) parentHome(`Premio agregado: «${data.title.trim()}».`);
    });
    for (const b of box.querySelectorAll("[data-idea]"))
      b.onclick = () => {
        rewardForm.title.value = b.dataset.idea;
        rewardForm.cost.value = b.dataset.cost;
        rewardForm.title.focus();
      };
    for (const b of box.querySelectorAll("[data-remove-reward]"))
      b.onclick = guard(async () => {
        await api.removeReward(b.dataset.removeReward);
        if (current()) parentHome("Premio borrado. Si había un pedido pendiente de ese premio, se devolvieron las fichas.");
      });
    for (const b of list.querySelectorAll("[data-claim]"))
      b.onclick = guard(async () => {
        const approve = b.dataset.approve === "true";
        await api.decideClaim(b.dataset.claim, approve);
        if (current()) parentHome(approve ? "Premio aprobado. ¡A disfrutarlo!" : "Respondiste «ahora no». Las fichas vuelven a su saldo.");
      });
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
      heading("APRENDER ACOMPAÑADO", "Mi familia", "Vincula a tu apoderado o a tu curso del colegio para compartir tu avance.") +
      `<section class="card"><p>Tu apoderado verá cuántas lecciones completas y dominas, qué días practicas, cómo te va en cada lección y cuántos videos viste. Tus notas y fotos no se comparten.</p><button class="primary" id="make-code">Generar código para mi apoderado</button><div id="family-message" role="status" class="feedback"></div><div id="code-box"></div></section><div id="parents" aria-busy="true"></div><div id="student-classes-box"></div>`;
    hydrateStudentClassesBox(app.querySelector("#student-classes-box"), {
      session,
      lessons,
      onOpenLesson,
      onOpenSheet,
    });
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
