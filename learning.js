export const lessons = [
  {
    id: "equations",
    title: "7° Básico · Encuentra el valor de x",
    description: "MA07 OA 09 · Operaciones inversas y principio de la balanza",
    concept:
      "Una ecuación es como una balanza en equilibrio (Mineduc MA07 OA 09): el signo igual (=) significa que ambos lados pesan lo mismo. Para despejar la incógnita x, aplicamos operaciones inversas. Principio fundamental: la misma operación que aplicas a un lado de la balanza, debes aplicarla exactamente igual al otro lado para mantener el equilibrio.",
    examples:
      "Si x + 4 = 9, la operación que acompaña a x es sumar 4. Para mantener el equilibrio, restamos 4 en ambos lados: (x + 4) − 4 = 9 − 4 → x = 5. Comprobamos: 5 + 4 = 9 ✓.",
    questions: [
      [
        "x + 5 = 12",
        7,
        "¿Qué número sumado a 5 da 12? Resuelve en tu cuaderno aplicando el principio de la balanza.",
        "⚖️ Mantén el equilibrio: Para despejar x, aplica la operación inversa de sumar 5, restando 5 en ambos lados de la balanza.",
        "x = 12 − 5 = 7. Comprobación de la balanza: 7 + 5 = 12 (ambos lados quedan en perfecto equilibrio).",
      ],
      [
        "3x = 18",
        6,
        "Ahora x está multiplicada por 3 (3x = 18). Encuentra su valor.",
        "⚖️ Mantén el equilibrio: La operación inversa de multiplicar por 3 es dividir entre 3. Divide ambos lados entre 3 para mantener la igualdad.",
        "x = 18 ÷ 3 = 6. Comprobación: 3 × 6 = 18 (el equilibrio se mantiene).",
      ],
      [
        "2x + 3 = 15",
        6,
        "Dos entradas iguales y un cargo de 3 suman 15 (2x + 3 = 15). ¿Cuánto cuesta cada entrada?",
        "⚖️ Mantén el equilibrio en dos pasos: Primero resta 3 en ambos lados de la balanza para aislar 2x (2x = 12); luego divide ambos lados entre 2.",
        "2x = 12; luego x = 12 ÷ 2 = 6. Comprobación: 2(6) + 3 = 12 + 3 = 15.",
      ],
      [
        "4x − 5 = 23",
        7,
        "Resuelve en tu cuaderno: 4x − 5 = 23 aplicando operaciones inversas.",
        "⚖️ Mantén el equilibrio: Suma 5 en ambos lados de la balanza (4x = 28) y después divide ambos lados entre 4.",
        "4x = 28; por lo tanto, x = 7. Comprobación: 4(7) − 5 = 28 − 5 = 23 (la balanza permanece equilibrada).",
      ],
    ],
  },
  {
    id: "signs",
    title: "8° Básico · Haz las paces con los signos",
    description: "MA08 OA 08 · Paréntesis, distribución y números enteros en Z",
    concept:
      "El factor fuera del paréntesis multiplica a cada término. Al operar con números enteros (Z), recuerda que (-) × (-) = (+) y (-) × (+) = (-) (Mineduc MA08 OA 08).",
    examples: "−2(x − 3) = −2x + 6: el −2 multiplica tanto a x como a −3.",
    questions: [
      [
        "−3 × (−4)",
        12,
        "Calcula el producto.",
        "Dos factores negativos dan un producto positivo.",
        "−3 × (−4) = 12.",
      ],
      [
        "−2 × (3 − 7)",
        8,
        "Resuelve primero el paréntesis.",
        "3 − 7 = −4. Luego multiplica por −2.",
        "−2 × (−4) = 8.",
      ],
      [
        "3(x − 2) = 15",
        7,
        "Distribuye o divide primero: elige tu estrategia y encuentra x.",
        "Divide entre 3: x − 2 = 5.",
        "x − 2 = 5; entonces x = 7.",
      ],
      [
        "−2(x − 3) = 10",
        -2,
        "Un alumno escribió −2x − 6 = 10. Corrige mentalmente el signo y encuentra x.",
        "El término constante es +6. Queda −2x + 6 = 10.",
        "−2x = 4; por lo tanto, x = −2.",
      ],
    ],
  },
  {
    id: "both",
    title: "8° Básico · Conecta las dos partes",
    description: "MA08 OA 08 · Ecuaciones con incógnita en ambos lados (ax + b = cx + d)",
    concept:
      "Agrupa las incógnitas en un lado y los números en el otro, aplicando siempre la misma operación a ambos lados (Mineduc MA08 OA 08).",
    examples: "3x + 1 = x + 9 → 2x + 1 = 9 → 2x = 8 → x = 4.",
    questions: [
      [
        "5x − 2x",
        3,
        "Simplifica: ¿qué coeficiente queda delante de x? Escribe solo el número.",
        "Resta los coeficientes: 5 − 2.",
        "5x − 2x = 3x. El coeficiente es 3.",
      ],
      [
        "3x = x + 10",
        5,
        "Encuentra x.",
        "Resta x de ambos lados.",
        "2x = 10; x = 5.",
      ],
      [
        "4x + 2 = 2x + 18",
        8,
        "Dos planes cuestan lo mismo cuando 4x + 2 = 2x + 18. ¿Cuál es x?",
        "Resta 2x y después resta 2 en ambos lados.",
        "2x = 16; x = 8.",
      ],
      [
        "3(x + 2) = x + 20",
        7,
        "Combina distribución y operaciones inversas.",
        "Distribuye: 3x + 6 = x + 20.",
        "2x = 14; x = 7.",
      ],
    ],
  },
  {
    id: "racionales",
    title: "8° Básico · Ecuaciones con racionales y decimales",
    description: "MA08 OA 08 · Coeficientes racionales en Q y valores decimales",
    concept:
      "En los números racionales (Q), una ecuación con decimales se resuelve aislando los términos en x o amplificando para operar con enteros (Mineduc MA08 OA 08).",
    examples: "0.5x + 3 = 7 → 0.5x = 4 → x = 4 ÷ 0.5 = 8.",
    questions: [
      [
        "0.5x + 2 = 6",
        8,
        "Encuentra el valor de x con coeficiente decimal.",
        "Resta 2 a ambos lados: 0.5x = 4. Luego divide entre 0.5.",
        "0.5x = 4; por lo tanto, x = 8.",
      ],
      [
        "0.2x − 1 = 3",
        20,
        "Despeja x sumando el término constante y dividiendo por el decimal.",
        "Suma 1 a ambos lados: 0.2x = 4. Luego divide entre 0.2.",
        "0.2x = 4; por lo tanto, x = 20.",
      ],
      [
        "1.5x + 4 = 10",
        4,
        "Encuentra x resolviendo paso a paso.",
        "Resta 4 en ambos lados: 1.5x = 6. Luego divide 6 entre 1.5.",
        "1.5x = 6; por lo tanto, x = 4.",
      ],
      [
        "0.5x + 1 = 0.25x + 3",
        8,
        "Incógnita decimal en ambos lados: agrupa las x en la izquierda.",
        "Resta 0.25x a 0.5x: queda 0.25x = 2. Luego divide 2 entre 0.25.",
        "0.25x = 2; por lo tanto, x = 8.",
      ],
    ],
  },
  {
    id: "combinadas",
    title: "8° Básico · Distribución y reducción combinada",
    description: "MA08 OA 08 · Ecuaciones complejas con varios pasos de simplificación",
    concept:
      "Para resolver ecuaciones complejas: primero elimina paréntesis distribuyendo, luego reduce términos semejantes y finalmente despeja la incógnita (Mineduc MA08 OA 08).",
    examples: "2(3x − 1) = 4x + 6 → 6x − 2 = 4x + 6 → 2x = 8 → x = 4.",
    questions: [
      [
        "2(x + 4) = 18",
        5,
        "Aplica propiedad distributiva o divide entre 2 primero.",
        "Distribuye: 2x + 8 = 18. Resta 8 y divide entre 2.",
        "2x = 10; por lo tanto, x = 5.",
      ],
      [
        "5(x − 1) = 2x + 10",
        5,
        "Distribuye el 5 y agrupa las incógnitas a la izquierda.",
        "5x − 5 = 2x + 10. Suma 5 y resta 2x: 3x = 15.",
        "3x = 15; por lo tanto, x = 5.",
      ],
      [
        "3(2x + 1) = 4x + 11",
        4,
        "Multiplica los términos dentro del paréntesis y resuelve.",
        "6x + 3 = 4x + 11. Resta 4x y resta 3: 2x = 8.",
        "2x = 8; por lo tanto, x = 4.",
      ],
      [
        "4(x − 2) = 2(x + 3)",
        7,
        "Distribuye en ambos miembros antes de transponer términos.",
        "4x − 8 = 2x + 6. Resta 2x y suma 8: 2x = 14.",
        "2x = 14; por lo tanto, x = 7.",
      ],
    ],
  },
  {
    id: "problemas",
    title: "8° Básico / 1° Medio · Modelamiento y problemas reales",
    description: "MA08 OA 08 / MA01 OA 04 · Planteamiento y resolución de situaciones cotidianas",
    concept:
      "Modelar es traducir un problema real a lenguaje matemático (Mineduc MA08 OA 08 / MA01 OA 04): define la incógnita x, escribe la relación como ecuación y comprueba la solución en el contexto.",
    examples: "El doble de un número más 5 es 21: 2x + 5 = 21 → 2x = 16 → x = 8.",
    questions: [
      [
        "2x + 5 = 21",
        8,
        "El doble de un número aumentado en 5 es igual a 21. ¿Cuál es el número x?",
        "Resta 5 a 21: 2x = 16. Luego divide entre 2.",
        "2x = 16; por lo tanto, el número es x = 8.",
      ],
      [
        "3x − 7 = 14",
        7,
        "El triple de un número disminuido en 7 resulta 14. Encuentra x.",
        "Suma 7 a 14: 3x = 21. Luego divide entre 3.",
        "3x = 21; por lo tanto, x = 7.",
      ],
      [
        "5x + 10 = 3x + 26",
        8,
        "Dos servicios cobran lo mismo: Plan A ($5x + $10) y Plan B ($3x + $26). ¿Cuántas horas x igualan el costo?",
        "Resta 3x y resta 10: 2x = 16.",
        "2x = 16; por lo tanto, a las x = 8 horas cuestan lo mismo.",
      ],
      [
        "4x − 8 = 2x + 16",
        12,
        "En una balanza, 4 paquetes iguales menos 8 gramos equilibran a 2 paquetes más 16 gramos. ¿Cuánto pesa cada paquete x?",
        "Agrupa los paquetes: 4x − 2x = 16 + 8.",
        "2x = 24; por lo tanto, cada paquete pesa x = 12 gramos.",
      ],
    ],
  },
  {
    id: "enteros",
    title: "7° Básico · Suma y resta de enteros en Z",
    description: "MA07 OA 01 · Reglas de signos, valor absoluto y recta numérica",
    concept:
      "En los números enteros (Z), sumar valores con signos iguales mantiene el signo; sumar con signos opuestos resta sus valores y mantiene el signo del mayor en valor absoluto (Mineduc MA07 OA 01).",
    examples: "−8 + 15 = 7; y −4 − 9 = −13.",
    questions: [
      [
        "−7 + 12",
        5,
        "Calcula la suma de enteros con distinto signo.",
        "Como 12 es positivo y mayor que 7: 12 − 7.",
        "−7 + 12 = 5.",
      ],
      [
        "−15 − 8",
        -23,
        "Resta de enteros negativos: avanza más a la izquierda en la recta.",
        "Suma los valores absolutos 15 + 8 y conserva el signo menos.",
        "−15 − 8 = −23.",
      ],
      [
        "18 + (−25)",
        -7,
        "Calcula el resultado teniendo en cuenta el valor absoluto.",
        "Resta 25 − 18 y aplica el signo de −25.",
        "18 + (−25) = −7.",
      ],
      [
        "−6 − (−14)",
        8,
        "Restar un negativo equivale a sumar su inverso aditivo.",
        "−6 − (−14) = −6 + 14 = 14 − 6.",
        "−6 + 14 = 8.",
      ],
    ],
  },
  {
    id: "semejantes",
    title: "7° Básico · Reducción de términos semejantes",
    description: "MA07 OA 07 · Expresiones algebraicas y coeficientes numéricos",
    concept:
      "Para reducir términos semejantes se suman o restan únicamente sus coeficientes numéricos, conservando intacta la parte literal (Mineduc MA07 OA 07).",
    examples: "4x + 7x = 11x; y 9x − 12x = −3x.",
    questions: [
      [
        "3x + 8x",
        11,
        "¿Qué coeficiente numérico resulta al reducir 3x + 8x? Escribe solo el número.",
        "Suma los coeficientes: 3 + 8.",
        "3x + 8x = 11x. El coeficiente es 11.",
      ],
      [
        "14x − 6x",
        8,
        "¿Cuál es el coeficiente final de x tras la resta?",
        "Resta 14 − 6.",
        "14x − 6x = 8x. El coeficiente es 8.",
      ],
      [
        "5x + 7x − 4x",
        8,
        "Reduce de izquierda a derecha y halla el coeficiente resultante.",
        "5 + 7 = 12; luego 12 − 4 = 8.",
        "(5 + 7 − 4)x = 8x. El coeficiente es 8.",
      ],
      [
        "6x − 15x",
        -9,
        "Calcula el coeficiente resultante considerando los signos.",
        "6 − 15 da un número negativo.",
        "6x − 15x = −9x. El coeficiente es −9.",
      ],
    ],
  },
  {
    id: "proporciones",
    title: "7° Básico · Proporcionalidad directa y regla de tres",
    description: "MA07 OA 08 · Constante de proporcionalidad k y cálculo de incógnitas",
    concept:
      "Dos variables son directamente proporcionales cuando su cociente es constante (y = k · x). Si a/b = c/x, entonces x = (b · c) / a (Mineduc MA07 OA 08).",
    examples: "Si 2 cuadernos cuestan $6, cada uno cuesta $3 (k = 3). 5 cuadernos costarán 5 · 3 = $15.",
    questions: [
      [
        "x / 4 = 6",
        24,
        "En la proporción x/4 = 6, encuentra el valor de x.",
        "Multiplica ambos lados por 4: x = 6 · 4.",
        "x = 24.",
      ],
      [
        "3x = 45",
        15,
        "Si 3 fotocopias cuestan $45, ¿cuánto cuesta una fotocopia x?",
        "Divide 45 entre 3: x = 45 ÷ 3.",
        "3x = 45; por lo tanto, x = 15.",
      ],
      [
        "2x = 36",
        18,
        "Si 2 kilogramos de pan valen $36, ¿cuál es el precio de 1 kg x?",
        "Divide 36 por 2.",
        "2x = 36; por lo tanto, x = 18.",
      ],
      [
        "5x = 60",
        12,
        "En una proporción donde 5 unidades valen 60, despeja x.",
        "x = 60 ÷ 5.",
        "5x = 60; por lo tanto, x = 12.",
      ],
    ],
  },
  {
    id: "potencias",
    title: "8° Básico · Potencias y propiedades de exponentes",
    description: "MA08 OA 02 · Multiplicación y división de potencias de igual base en Z",
    concept:
      "Al multiplicar potencias de igual base se suman los exponentes: a^n · a^m = a^(n+m). Al dividir se restan: a^n ÷ a^m = a^(n-m) (Mineduc MA08 OA 02).",
    examples: "2^3 · 2^2 = 2^(3+2) = 2^5 = 32. Y 3^4 ÷ 3^2 = 3^2 = 9.",
    questions: [
      [
        "2^2 × 2^3",
        32,
        "Calcula el valor numérico final: 2² × 2³.",
        "Suma exponentes: 2 + 3 = 5. Luego calcula 2⁵ = 32.",
        "2² × 2³ = 2⁵ = 32.",
      ],
      [
        "3^4 ÷ 3^2",
        9,
        "Calcula el cociente de potencias de igual base.",
        "Resta los exponentes: 4 − 2 = 2. Luego 3² = 9.",
        "3⁴ ÷ 3² = 3² = 9.",
      ],
      [
        "5^3 ÷ 5",
        25,
        "Recuerda que 5 equivale a 5¹. ¿Cuál es el valor numérico?",
        "Resta exponentes: 3 − 1 = 2. Luego 5² = 25.",
        "5³ ÷ 5¹ = 5² = 25.",
      ],
      [
        "(−2)^3",
        -8,
        "Calcula la potencia de base negativa y exponente impar.",
        "(−2) × (−2) × (−2) = 4 × (−2) = −8.",
        "(−2)³ = −8.",
      ],
    ],
  },
  {
    id: "funcion",
    title: "8° Básico · Función afín y pendiente",
    description: "MA08 OA 07 · Evaluación de f(x) = mx + n, pendiente m e intercepto",
    concept:
      "Una función afín tiene la forma f(x) = mx + n, donde m es la pendiente (tasa de cambio) y n es el valor inicial cuando x = 0 (Mineduc MA08 OA 07).",
    examples: "Si f(x) = 2x + 5, para x = 3 la imagen es f(3) = 2(3) + 5 = 11.",
    questions: [
      [
        "f(4) con f(x) = 3x + 2",
        14,
        "Calcula la imagen f(4) para la función f(x) = 3x + 2.",
        "Reemplaza x por 4: 3(4) + 2 = 12 + 2.",
        "f(4) = 14.",
      ],
      [
        "f(5) con f(x) = 2x − 3",
        7,
        "Evalúa la función en x = 5.",
        "Calcula 2(5) − 3 = 10 − 3.",
        "f(5) = 7.",
      ],
      [
        "f(0) con f(x) = 4x + 9",
        9,
        "¿Cuál es el valor inicial (intercepto con eje Y) en x = 0?",
        "4(0) + 9 = 9.",
        "f(0) = 9.",
      ],
      [
        "f(3) con f(x) = −2x + 15",
        9,
        "Evalúa la función con pendiente negativa para x = 3.",
        "−2(3) + 15 = −6 + 15 = 9.",
        "f(3) = 9.",
      ],
    ],
  },
  {
    id: "notables",
    title: "1° Medio · Productos notables y binomios",
    description: "MA01 OA 03 · Cuadrado de binomio (a+b)² y suma por su diferencia",
    concept:
      "Los productos notables permiten multiplicar expresiones algebraicas de forma directa (Mineduc MA01 OA 03): (a + b)² = a² + 2ab + b²; (a + b)(a − b) = a² − b².",
    examples: "(x + 4)² = x² + 8x + 16 (el término central es el doble producto: 2 · x · 4 = 8x).",
    questions: [
      [
        "En (x + 5)^2, ¿cuál es el coeficiente de x?",
        10,
        "Desarrolla el doble producto en (x + 5)²: ¿qué número acompaña a x?",
        "El término central es 2 · x · 5 = 10x.",
        "El coeficiente es 10.",
      ],
      [
        "En (x + 3)^2, ¿cuál es el término independiente?",
        9,
        "Eleva al cuadrado el segundo término: 3².",
        "3² = 9.",
        "El término independiente es 9.",
      ],
      [
        "En (x + 7)(x − 7) = x^2 − k, ¿cuál es k?",
        49,
        "Suma por su diferencia: a² − b². ¿Cuánto vale 7²?",
        "7² = 49.",
        "(x + 7)(x − 7) = x² − 49, por lo tanto k = 49.",
      ],
      [
        "En (2x + 1)^2, ¿cuál es el coeficiente central?",
        4,
        "Calcula el doble producto: 2 · (2x) · 1.",
        "2 · 2x · 1 = 4x. El coeficiente es 4.",
        "El coeficiente es 4.",
      ],
    ],
  },
];
export function parseNumber(raw) {
  const s = String(raw)
    .trim()
    .replace(/^x\s*=\s*/i, "")
    .replace(",", ".")
    .replace(/−/g, "-");
  if (
    !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(
      s,
    )
  )
    return null;
  const parts = s.split("/").map(Number);
  const n = parts.length === 2 ? parts[0] / parts[1] : parts[0];
  return Number.isFinite(n) ? n : null;
}
export function isCorrect(raw, answer) {
  const n = parseNumber(raw);
  return n !== null && Math.abs(n - answer) < 1e-8;
}
// Restricted, explicit grammar: ax + b = cx + d. No eval or arbitrary expression execution.
export function solveLinear(raw) {
  const s = raw
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/−/g, "-")
    .replace(/,/g, ".");
  const sides = s.split("=");
  if (sides.length !== 2) return null;
  const parse = (side) => {
    if (!side) return null;
    const tokens = side.match(
      /[+-]?(?:(?:\d+(?:\.\d+)?|\.\d+)\*?x|x|(?:\d+(?:\.\d+)?|\.\d+))/g,
    );
    if (
      !tokens ||
      tokens.join("") !== side ||
      tokens.slice(1).some((t) => !/^[-+]/.test(t))
    )
      return null;
    let a = 0,
      b = 0;
    for (const t of tokens) {
      if (t.endsWith("x")) {
        const v = t.slice(0, -1).replace("*", "");
        a += v === "" || v === "+" ? 1 : v === "-" ? -1 : Number(v);
      } else b += Number(t);
    }
    return { a, b };
  };
  const l = parse(sides[0]),
    r = parse(sides[1]);
  if (!l || !r) return null;
  const a = l.a - r.a,
    b = r.b - l.b;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.abs(a) < 1e-12
    ? { kind: Math.abs(b) < 1e-12 ? "infinite" : "none" }
    : { kind: "unique", answer: b / a, a, b };
}
export function freshState() {
  return {
    version: 1,
    diagnosed: false,
    completed: [],
    mastered: [],
    attempts: [],
    notes: [],
    reviews: [],
  };
}
export function loadState(storage, availableLessons = lessons) {
  try {
    const s = JSON.parse(
      storage.getItem("socatres.v1") ?? storage.getItem("tutorai.v1"),
    );
    if (s?.version !== 1) return freshState();
    const ids = new Set(availableLessons.map((l) => l.id));
    return {
      version: 1,
      diagnosed: s.diagnosed === true,
      completed: Array.isArray(s.completed)
        ? s.completed.filter((id) => ids.has(id))
        : [],
      mastered: Array.isArray(s.mastered)
        ? s.mastered.filter((id) => ids.has(id))
        : [],
      attempts: Array.isArray(s.attempts)
        ? s.attempts.filter(
            (a) =>
              a &&
              ids.has(a.lesson) &&
              typeof a.correct === "boolean" &&
              typeof a.at === "number",
          )
        : [],
      notes: Array.isArray(s.notes)
        ? s.notes
            .filter(
              (n) =>
                n &&
                typeof n.text === "string" &&
                typeof n.title === "string" &&
                typeof n.at === "number",
            )
            .map((n) => ({
              title: n.title,
              text: n.text,
              at: n.at,
              ...(typeof n.image === "string" ? { image: n.image } : {}),
            }))
        : [],
      reviews: Array.isArray(s.reviews)
        ? s.reviews.filter(
            (r) => r && ids.has(r.lesson) && typeof r.due === "number",
          )
        : [],
    };
  } catch {
    return freshState();
  }
}

export function getSubject(lesson) {
  if (!lesson) return "matematica";
  if (lesson.subject === "lenguaje" || lesson.subject === "lengua") return "lenguaje";
  if (lesson.subject === "matematica" || lesson.subject === "matematicas") return "matematica";
  const text = `${lesson.id || ""} ${lesson.title || ""} ${lesson.description || ""}`.toLowerCase();
  if (
    /\ble\d{2}\b/.test(text) ||
    text.includes("lectura") ||
    text.includes("lenguaje") ||
    text.includes("lengua") ||
    text.includes("comprensión lectora")
  ) {
    return "lenguaje";
  }
  return "matematica";
}

export function compressImage(file, maxDimension = 800, quality = 0.72) {
  return new Promise((resolve) => {
    if (
      typeof window === "undefined" ||
      typeof FileReader === "undefined" ||
      typeof Image === "undefined" ||
      !file
    ) {
      return resolve(null);
    }
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext ? canvas.getContext("2d") : null;
          if (!ctx) {
            return resolve(e.target.result);
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

