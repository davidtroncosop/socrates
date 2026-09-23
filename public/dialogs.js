import { $, escape } from "./ui.js";
import { getUnitsForLessons } from "./units.js";
import { getStreakInfo, getXpAndFichas } from "./stats.js";

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

  const whatsappMsg = `*Reporte de Progreso en socatres 🚀*\n` +
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

export function showRewardsModal(state) {
  const dialog = $("#rewards-dialog") || $("#habitribu-dialog");
  const content = $("#rewards-content") || $("#habitribu-content") || dialog;
  if (!content) return;

  const xpInfo = getXpAndFichas(state);
  const claimMsg = `*¡Canje de Fichas de Premio en Casa! 🪙*\n` +
    `Hola Papá/Mamá, he ganado ${xpInfo.fichas} fichas en socatres practicando (${xpInfo.totalXP} XP totales) 🚀\n` +
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
