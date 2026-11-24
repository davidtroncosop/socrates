import { $, escape } from "./ui.js";
import { getUnitsForLessons } from "./units.js";
import { getStreakInfo, getXpAndFichas, earnedFichas, FICHAS_RULE } from "./stats.js";
import { api } from "./api.js";
import { ACTIVE_SUBJECTS } from "./subjects.js";

export function showUnitGuide(unitId, { lessons, state }) {
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

export function showParentReport({ state, completedCount, masteredCount }) {
  const dialog = $("#parent-report-dialog");
  const content = $("#parent-report-content") || dialog;
  if (!content) return;

  const streakInfo = getStreakInfo(state);
  const xpInfo = getXpAndFichas(state);
  const notes = Array.isArray(state?.notes) ? state.notes : [];
  const photoCount = notes.filter((n) => n?.image).length;
  const notebookLabel =
    photoCount > 0
      ? `${photoCount} ${photoCount === 1 ? "foto" : "fotos"}`
      : `${notes.length} ${notes.length === 1 ? "nota" : "notas"}`;

  // Días distintos con actividad en los últimos 7 días (hora local).
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const localDayKey = (ms) => {
    const d = new Date(ms);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };
  const recentDates = new Set();
  if (Array.isArray(state?.attempts)) {
    state.attempts
      .filter((a) => a.at >= sevenDaysAgo)
      .forEach((a) => recentDates.add(localDayKey(a.at)));
  }
  notes
    .filter((n) => n.at >= sevenDaysAgo)
    .forEach((n) => recentDates.add(localDayKey(n.at)));
  const weeklyDays = recentDates.size;
  const estimatedMins = weeklyDays * 11;

  const whatsappMsg = `*Reporte de Progreso en socatres 🚀*\n` +
    `• Días de práctica esta semana: ${weeklyDays} de 7 días (~${estimatedMins} min totales)\n` +
    `• Racha activa: ${streakInfo.streak} ${streakInfo.streak === 1 ? "día seguido" : "días seguidos"} 🔥\n` +
    `• Lecciones completadas: ${completedCount} lecciones\n` +
    `• Habilidades dominadas: ${masteredCount} con Cinturón de Oro 👑\n` +
    `• Trabajo en cuaderno: ${notebookLabel} ✍️\n` +
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
            <div class="pm-val">${streakInfo.streak} día${streakInfo.streak !== 1 ? "s" : ""}</div>
            <div class="pm-lbl">Racha activa ${streakInfo.hasFreeze ? "🛡️ (Protector activo)" : ""}</div>
          </div>
          <div class="parent-metric-card">
            <span class="pm-icon">⏱️</span>
            <div class="pm-val">~${estimatedMins} min</div>
            <div class="pm-lbl">Tiempo semanal invertido</div>
          </div>
          <div class="parent-metric-card">
            <span class="pm-icon">✍️</span>
            <div class="pm-val">${notebookLabel}</div>
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
          <p>Tu hijo practica resolviendo a mano en su cuaderno y subiendo fotos de su desarrollo. En matemática aplica el <strong>Principio de la Balanza en Equilibrio</strong>${ACTIVE_SUBJECTS.includes("lenguaje") ? " y en lenguaje estrategias de inferencia y comprensión" : ""}, según las <strong>Bases Curriculares del MINEDUC</strong>.</p>
        </div>

        <div class="parent-report-box habitribu-box rewards-box">
          <div class="pr-ht-header">
            <span class="pr-ht-coin">🪙</span>
            <div>
              <strong>${xpInfo.fichas} Fichas ganadas para premios en casa</strong>
              <p>${escape(FICHAS_RULE)} Se canjean por los premios que acuerden en familia.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="parent-report-footer">
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-share">
          <span>📲 Enviar reporte por WhatsApp a mi familia</span>
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

const CLAIM_STATUS = { pending: "⏳ Esperando respuesta", approved: "✅ Aprobado", rejected: "Ahora no" };

// Premios en casa: los define el apoderado en «Mi familia»; el estudiante los
// pide con sus fichas y el apoderado aprueba. Sin cuenta, solo se explica.
export async function showRewardsModal(state, session) {
  const dialog = $("#rewards-dialog");
  const content = $("#rewards-content") || dialog;
  if (!content) return;
  const local = earnedFichas(state).total;

  const render = (data, notice = "") => {
    const balance = data ? data.fichas.balance : local;
    const rewards = data?.rewards ?? [];
    let body;
    if (!data)
      body = `<p class="muted">${
        session?.role === "parent"
          ? "Los premios se agregan y se aprueban en «Mi familia»."
          : session?.mode === "account"
            ? "Cargando tus premios…"
            : "Con una cuenta, tu apoderado puede acordar premios contigo y aprobarlos desde su teléfono."
      }</p>`;
    else if (!data.linked)
      body = `<p class="muted">Vincula a tu apoderado en «Mi familia» para acordar premios juntos.</p>`;
    else if (!rewards.length)
      body = `<p class="muted">Todavía no hay premios. Conversa con tu apoderado y pídele que los agregue en «Mi familia».</p>`;
    else
      body = `<div class="ht-rewards-grid">${rewards
        .map((r) => {
          const missing = r.cost - balance;
          return `<div class="ht-reward-item">
            <span class="ht-r-icon">🎁</span>
            <div><strong>${escape(r.title)}</strong>${missing > 0 ? `<small class="muted">Te faltan ${missing} fichas</small>` : ""}</div>
            <span class="ht-r-cost">${r.cost} fichas</span>
            <button class="secondary" data-claim="${escape(r.id)}" ${missing > 0 ? "disabled" : ""}>Pedir</button>
          </div>`;
        })
        .join("")}</div>`;
    const claims = data?.claims ?? [];
    content.innerHTML = `
    <div class="rewards-modal">
      <div class="rewards-modal-header">
        <span class="habitribu-badge rewards-badge">🪙 PREMIOS EN CASA</span>
        <h2>Tus premios</h2>
        <p>Los premios los acuerdas con tu familia. Cuando juntes las fichas, pídelo aquí y tu apoderado lo aprueba.</p>
      </div>
      <div class="rewards-modal-body">
        <div class="ht-balance-card">
          <div class="ht-coin-large">🪙</div>
          <div class="ht-balance-details">
            <span class="ht-balance-number">${balance} ${balance === 1 ? "ficha disponible" : "fichas disponibles"}</span>
            <span class="ht-balance-sub">${escape(FICHAS_RULE)}</span>
          </div>
        </div>
        <div role="status" class="feedback good">${escape(notice)}</div>
        <div class="ht-rewards-section"><h3>🎁 Premios acordados</h3>${body}</div>
        ${claims.length ? `<div class="ht-rewards-section"><h3>Lo que has pedido</h3><ul class="claims-list">${claims
          .map((c) => `<li><span>${escape(c.title)} · ${c.cost} fichas</span><span class="claim-${c.status}">${CLAIM_STATUS[c.status]}</span></li>`)
          .join("")}</ul></div>` : ""}
      </div>
      <div class="rewards-modal-footer">
        <button id="close-rewards" class="secondary" data-action="close-rewards">Cerrar</button>
      </div>
    </div>`;
    for (const b of content.querySelectorAll("[data-claim]"))
      b.onclick = async () => {
        b.disabled = true;
        try {
          await api.claimReward(b.dataset.claim);
          render(await api.rewards(), "Listo. Tu apoderado verá tu pedido en «Mi familia».");
        } catch (err) {
          render(data, err.message);
        }
      };
    const closeBtn = $("#close-rewards");
    if (closeBtn) closeBtn.onclick = () => dialog.close();
  };

  render(null);
  if (dialog && typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
  if (session?.mode === "account" && session.role !== "parent") {
    try {
      render(await api.rewards());
    } catch (err) {
      render(null, err.message);
    }
  }
}
