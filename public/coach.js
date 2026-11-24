// El búho tutor en el cliente: la pregunta gancho antes del video, el resumen
// de avance que se manda para la frase de ánimo (solo números y títulos) y las
// frases locales que se usan sin cuenta, sin conexión o si la IA falla.

export const MAX_SUMMARY = 600;
export const MAX_QUESTION = 300;

// Pregunta gancho antes de la animación: despierta la curiosidad por la lógica
// de la idea. Las lecciones sin una propia usan su título.
const HOOKS = {
  equations: "¿Sabes la lógica que hay detrás de una ecuación?",
  signs: "¿Sabes por qué menos por menos da más?",
  both: "¿Sabes qué hacer cuando la x aparece a los dos lados?",
  racionales: "¿Sabes por qué una ecuación con fracciones se puede volver una sin fracciones?",
  combinadas: "¿Sabes qué pasa cuando un número multiplica a un paréntesis?",
  problemas: "¿Sabes cómo convertir un problema en una ecuación?",
  enteros: "¿Sabes por qué los números negativos se parecen a un ascensor?",
  semejantes: "¿Sabes por qué 2x + 3x da 5x, pero 2x + 3 no se puede juntar?",
  proporciones: "¿Sabes la lógica que hay detrás de la regla de tres?",
  potencias: "¿Sabes por qué al multiplicar potencias se suman los exponentes?",
  funcion: "¿Sabes qué te dice la pendiente de una recta?",
  notables: "¿Sabes por qué (a + b)² no es a² + b²?",
  porcentajes: "¿Sabes qué significa de verdad un porcentaje?",
  circulos: "¿Sabes de dónde sale el número pi?",
  pitagoras: "¿Sabes por qué en un triángulo rectángulo a² + b² = c²?",
  "jerarquia-mult": "¿Sabes por qué se multiplica antes de sumar?",
  "jerarquia-parentesis": "¿Sabes por qué los paréntesis mandan?",
  "jerarquia-potencias": "¿Sabes por qué las potencias van antes que todo lo demás?",
  "base-valor-posicional": "¿Sabes por qué el mismo 3 vale distinto según dónde está?",
  "base-suma-resta": "¿Sabes qué pasa de verdad cuando «pides prestado» al restar?",
  "base-dividir": "¿Sabes la lógica que hay detrás de dividir?",
  "base-fracciones": "¿Sabes qué significa de verdad una fracción?",
  "fracciones-suma": "¿Sabes por qué para sumar fracciones hay que igualar el denominador?",
  "fracciones-mult": "¿Sabes por qué dividir por una fracción es multiplicar por su inverso?",
  promedio: "¿Sabes qué significa de verdad el promedio?",
  "area-triangulos": "¿Sabes por qué el área del triángulo se divide por 2?",
  "potencias-negativas": "¿Sabes por qué cualquier número elevado a 0 da 1?",
  sistemas: "¿Sabes cómo encontrar dos valores que cumplen dos reglas a la vez?",
  expresiones: "¿Sabes por qué en matemática usamos letras?",
  inecuaciones: "¿Sabes por qué una desigualdad se da vuelta al multiplicar por un negativo?",
  "plano-cartesiano": "¿Sabes cómo dos números pueden señalar un lugar exacto?",
  "probabilidad-teorica": "¿Sabes cómo se mide qué tan posible es algo?",
  "enteros-mult": "¿Sabes por qué menos por menos da más?",
  "variacion-porcentual": "¿Sabes por qué subir 10 % y bajar 10 % no te deja igual?",
  "crecimiento-exponencial": "¿Sabes por qué algo que se duplica crece tan rápido?",
  logaritmos: "¿Sabes la lógica que hay detrás de un logaritmo?",
  "funcion-cuadratica": "¿Sabes por qué la parábola tiene esa forma?",
  "ecuacion-cuadratica": "¿Sabes por qué una ecuación cuadrática puede tener dos respuestas?",
  trigonometria: "¿Sabes cómo medir una altura sin subirte a ella?",
  "interes-compuesto": "¿Sabes por qué el interés compuesto hace crecer tanto el dinero?",
  limites: "¿Sabes qué significa acercarse a un número sin llegar nunca?",
  derivadas: "¿Sabes cómo se mide qué tan rápido cambia algo?",
  integrales: "¿Sabes cómo se suman infinitos pedacitos?",
};
export const HOOK_PROMISE = "¡Enseguida te voy a mostrar!";
export function hookFor(lesson, title = lesson?.title) {
  return HOOKS[lesson?.id] ?? `¿Sabes la lógica que hay detrás de «${title}»?`;
}

const DAY = 86400000;
// Día local en AAAA-MM-DD: la frase cambia a medianoche del estudiante.
export const localDay = (ms = Date.now()) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Resumen del avance para la frase de ánimo. Solo números y títulos.
export function progressSummary({ state, lessons, streak, dueReviews, next, title = (l) => l.title, now = Date.now() }) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const week = state.attempts.filter((a) => a.at > now - 7 * DAY);
  const wrong = new Map();
  for (const a of state.attempts)
    if (!a.correct && a.at > now - 14 * DAY) wrong.set(a.lesson, (wrong.get(a.lesson) ?? 0) + 1);
  const [hardId, hardCount] = [...wrong].sort((a, b) => b[1] - a[1])[0] ?? [];
  const last = [...state.attempts].sort((a, b) => b.at - a.at)[0];
  const name = (id) => (byId.has(id) ? title(byId.get(id)) : "");
  return {
    streak,
    completed: state.completed.length,
    mastered: state.mastered.length,
    daysThisWeek: new Set(week.map((a) => localDay(a.at))).size,
    correctThisWeek: week.filter((a) => a.correct).length,
    wrongThisWeek: week.filter((a) => !a.correct).length,
    dueReviews,
    practicedToday: state.attempts.some((a) => localDay(a.at) === localDay(now)),
    lastLesson: last ? name(last.lesson) : "",
    nextLesson: next ? title(next) : "",
    hardLesson: hardCount >= 2 ? name(hardId) : "",
  };
}

// Frase local, en positivo y con un paso concreto. Cambia de un día a otro.
export function localEncouragement(p, day = localDay()) {
  const pick = (list) => list[[...day].reduce((n, c) => n + c.charCodeAt(0), 0) % list.length];
  const step = p.dueReviews
    ? "Hoy te espera un repaso corto."
    : p.nextLesson
      ? `Hoy puedes seguir con «${p.nextLesson}».`
      : "Hoy basta con un ejercicio.";
  if (!p.completed && !p.correctThisWeek)
    return pick([
      "Qué bueno que estás aquí. Aprender va de a un paso, y el primero es el más valiente.",
      "Te damos la bienvenida. Aquí no hay apuro ni notas: vamos a entender cada idea con calma.",
    ]);
  if (p.practicedToday)
    return pick([
      "Ya practicaste hoy: tu cerebro está guardando lo que aprendiste. Si quieres, puedes seguir un poquito más.",
      "Hoy ya diste tu paso. Cada día que practicas, las ideas se te quedan más firmes.",
    ]);
  if (p.hardLesson)
    return `Equivocarse en «${p.hardLesson}» es parte de aprender: cada error te muestra qué mirar. ${step}`;
  if (p.streak > 1) return `Llevas ${p.streak} días seguidos practicando, ¡eso es constancia! ${step}`;
  return pick([
    `Ya terminaste ${p.completed} ${p.completed === 1 ? "lección" : "lecciones"}, y eso lo lograste tú. ${step}`,
    `Lo que aprendiste sigue contigo. ${step}`,
  ]);
}
