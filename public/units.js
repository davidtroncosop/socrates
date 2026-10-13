export const UNIT_DEFINITIONS = [
  {
    id: "unit-math-base",
    unitNumber: 1,
    subject: "matematica",
    theme: "theme-cyan",
    subtitle: "Unidad 1 · Para todos los cursos",
    title: "Bases para avanzar",
    description: "Valor posicional, sumar y restar con canje, multiplicar, dividir, fracciones y decimales.",
    concepts: "Todo lo que viene después se apoya en estas bases. Si alguna te cuesta, no pasa nada: aquí se practica sin apuro, con dinero, medidas y repartos.",
    rule: "🧱 Paso a paso: haz una cosa a la vez y revisa con la operación contraria (la resta revisa la suma; la multiplicación revisa la división).",
    notebookTip: "Dibuja las monedas, los grupos o las partes en tu cuaderno antes de hacer la cuenta.",
    lessonIds: ["base-valor-posicional", "base-suma-resta", "base-multiplicar", "base-dividir", "base-fracciones", "base-decimales"],
    // Se ve en cualquier curso: los vacíos de base no dependen del curso.
    forAllGrades: true,
  },
  {
    id: "unit-math-jerarquia",
    unitNumber: 2,
    subject: "matematica",
    theme: "theme-amber",
    subtitle: "Unidad 2 · 5° a 8° Básico",
    title: "Jerarquía de Operaciones (PAPOMUDAS)",
    description: "Multiplicar y dividir antes de sumar y restar, paréntesis, enteros y potencias en expresiones combinadas.",
    concepts: "Cuando hay varias operaciones, no se calcula de izquierda a derecha sin más: hay un orden de prioridad. Se recuerda con PAPOMUDAS (en inglés, PEMDAS): Paréntesis, Potencias, Multiplicación y División, Adición y Sustracción.",
    rule: "🪜 Orden PAPOMUDAS: primero Paréntesis, luego Potencias, después Multiplicación y División (de izquierda a derecha) y al final Adición y Sustracción (de izquierda a derecha).",
    notebookTip: "Resuelve una operación por línea y subraya la que vas a calcular antes de escribir el resultado: así no te saltas la jerarquía.",
    lessonIds: ["jerarquia-mult", "jerarquia-parentesis", "jerarquia-enteros", "jerarquia-potencias"],
  },
  {
    id: "unit-math-1",
    unitNumber: 3,
    subject: "matematica",
    theme: "theme-emerald",
    subtitle: "Unidad 3 · 7° Básico",
    title: "Álgebra y el Principio de la Balanza",
    description: "Despeje de incógnitas manteniendo la igualdad, suma de enteros en Z y términos semejantes.",
    concepts: "Una ecuación es una balanza en equilibrio perfecto: el signo igual (=) expresa que ambos platillos pesan lo mismo. Para despejar la incógnita x, se aplican operaciones inversas a ambos lados.",
    rule: "⚖️ Regla de oro de la balanza: Cualquier operación (sumar, restar, multiplicar o dividir) que apliques al lado izquierdo, debes aplicarla exactamente igual al lado derecho para conservar la igualdad.",
    notebookTip: "Escribe cada paso en una línea nueva de tu cuaderno, alineando verticalmente los signos igual (=). Así comprobarás que la balanza nunca se desequilibra.",
    lessonIds: ["equations", "enteros", "semejantes", "proporciones", "porcentajes"],
  },
  {
    id: "unit-math-2",
    unitNumber: 4,
    subject: "matematica",
    theme: "theme-blue",
    subtitle: "Unidad 4 · 8° Básico",
    title: "Distribución, Signos y Racionales",
    description: "Paréntesis, regla de los signos, incógnitas en ambos miembros y ecuaciones fraccionarias.",
    concepts: "Al distribuir factores con paréntesis, el término exterior multiplica a cada término interior: a(b + c) = ab + ac. Recuerda que (-) × (-) = (+) y (-) × (+) = (-).",
    rule: "🎯 Método de distribución: Elimina primero los paréntesis multiplicando signo por signo, reduce términos semejantes en cada lado y luego traslada las incógnitas.",
    notebookTip: "Encierra en un círculo las incógnitas y en un cuadrado los números libres antes de moverlos para no confundir signos en tu hoja.",
    lessonIds: ["signs", "both", "racionales", "combinadas"],
  },
  {
    id: "unit-math-3",
    unitNumber: 5,
    subject: "matematica",
    theme: "theme-purple",
    subtitle: "Unidad 5 · 7° y 8° Básico",
    title: "Geometría, Círculos y Probabilidad",
    description: "Perímetros, áreas de círculos con π, Teorema de Pitágoras y frecuencias relativas.",
    concepts: "La circunferencia es el contorno (longitud 2πr) y el círculo es la superficie interior (área πr²). En triángulos rectángulos, el Teorema de Pitágoras (a² + b² = c²) relaciona catetos con hipotenusa.",
    rule: "📐 Identifica la hipotenusa: Es el lado opuesto al ángulo recto de 90° y el más extenso. Va sola en un miembro de la igualdad: a² + b² = c².",
    notebookTip: "Dibuja siempre la figura en tu cuaderno anotando las medidas conocidas en cada lado antes de calcular fórmulas.",
    lessonIds: ["circulos", "pitagoras", "probabilidad-experimental"],
  },
  {
    id: "unit-math-4",
    unitNumber: 6,
    subject: "matematica",
    theme: "theme-rose",
    subtitle: "Unidad 6 · 8° y 1° Medio",
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

// Lecciones que se ven en cualquier curso (unidades de base).
export const ALL_GRADES_LESSONS = new Set(
  UNIT_DEFINITIONS.filter((u) => u.forAllGrades).flatMap((u) => u.lessonIds),
);

// Lecciones que necesitan otra antes, aunque estén en otra unidad.
export const PREREQUISITES = {
  // Usa sumas y restas con negativos.
  "jerarquia-enteros": ["enteros"],
};

// Orden de la ruta, el mismo que ve el estudiante: unidad por unidad. Es el
// orden en que se desbloquean y se sugieren las lecciones.
export const routeOrder = (lessonsList) =>
  getUnitsForLessons(lessonsList).flatMap((u) => u.lessons);

export function getUnitsForLessons(lessonsList) {
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
