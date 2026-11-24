export const lessons = [
  {
    id: "equations",
    title: "Encuentra el valor de x",
    subject: "matematica",
    grade: "7b",
    description: "MA07 OA 09 · La balanza: haz lo mismo en los dos lados",
    concept:
      "Una ecuación es como una balanza en equilibrio. El signo = dice que los dos lados pesan lo mismo. La x es un número escondido. Para encontrarlo, haz lo mismo en los dos lados. Así la balanza no se cae.",
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
    title: "Haz las paces con los signos",
    subject: "matematica",
    grade: "8b",
    description: "MA08 OA 08 · Paréntesis y signos menos",
    concept:
      "El número de afuera del paréntesis multiplica a cada número de adentro. Cada signo menos es una media vuelta. Dos medias vueltas te dejan mirando al frente: menos por menos da más. Con un solo menos, el resultado es negativo.",
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
    title: "Conecta las dos partes",
    subject: "matematica",
    grade: "8b",
    description: "MA08 OA 08 · Cuando hay x en los dos lados",
    concept:
      "A veces hay x en los dos lados de la balanza. Primero junta todas las x en un lado. Después junta los números en el otro lado. Haz siempre lo mismo en los dos lados.",
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
    title: "Ecuaciones con racionales y decimales",
    subject: "matematica",
    grade: "8b",
    description: "MA08 OA 08 · Ecuaciones con números con coma",
    concept:
      "0,5x es la mitad de x: media bolsa. Si la coma te complica, multiplica todo por 10. Así 0,5 se convierte en 5. Multiplica todos los números, no solo uno.",
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
    title: "Distribución y reducción combinada",
    subject: "matematica",
    grade: "8b",
    description: "MA08 OA 08 · Ecuaciones con paréntesis, en tres pasos",
    concept:
      "Con paréntesis, sigue tres pasos. Uno: desarma el paréntesis multiplicando cada número de adentro. Dos: junta las x en un lado y los números en el otro. Tres: despeja la x.",
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
    title: "Modelamiento y problemas reales",
    subject: "matematica",
    grade: "1m",
    description: "MA08 OA 08 · De un problema en palabras a una ecuación",
    concept:
      "Un problema es un mensaje en palabras. Primero decide qué es x: lo que no sabes. Después traduce cada frase a números. Resuelve la ecuación. Al final, revisa si tu respuesta tiene sentido.",
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
    title: "Suma y resta de enteros en Z",
    subject: "matematica",
    grade: "7b",
    description: "MA07 OA 01 · Números negativos con el ascensor",
    concept:
      "Piensa en un ascensor con subterráneos. Los números negativos son los pisos bajo la calle. Sumar es subir. Restar es bajar. Restar un negativo es quitar una deuda: también es subir.",
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
    title: "Reducción de términos semejantes",
    subject: "matematica",
    grade: "7b",
    description: "MA07 OA 07 · Juntar términos con la misma letra",
    concept:
      "Solo se juntan los términos con la misma letra, como frutas iguales. 3x + 8x = 11x, igual que 3 manzanas + 8 manzanas. 3x + 2y no se juntan: son frutas distintas. Se suman los números y la letra queda igual.",
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
    title: "Proporcionalidad directa y regla de tres",
    subject: "matematica",
    grade: "7b",
    description: "MA07 OA 08 · Buscar el valor de uno",
    concept:
      "Dos cantidades son proporcionales si crecen al mismo ritmo. El truco es buscar el valor de uno. Si 2 cuadernos cuestan $6 000, uno cuesta $3 000. Para 5 cuadernos: 5 · 3 000 = 15 000.",
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
    title: "Potencias y propiedades de exponentes",
    subject: "matematica",
    grade: "8b",
    description: "MA08 OA 03 · Multiplicaciones repetidas",
    concept:
      "Una potencia es una multiplicación repetida. 2³ = 2 · 2 · 2 = 8. El número pequeño de arriba dice cuántas veces se multiplica. Con la misma base: al multiplicar, se suman los de arriba; al dividir, se restan.",
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
        "(2^2)^3",
        64,
        "Calcula la potencia de una potencia.",
        "Potencia de potencia: multiplica los exponentes, 2 · 3 = 6. Luego calcula 2⁶.",
        "(2²)³ = 2⁶ = 64.",
        [[32, "Sumaste los exponentes (2 + 3). En una potencia de potencia se multiplican: 2 · 3 = 6, y 2⁶ = 64."]],
      ],
    ],
  },
  {
    id: "funcion",
    title: "Función afín y pendiente",
    subject: "matematica",
    grade: "8b",
    description: "MA08 OA 07 · La entrada y lo que sube en cada paso",
    concept:
      "Una función es como pagar en un parque de diversiones. n es la entrada: lo que pagas al empezar. m es lo que sube por cada juego. Para calcular f(3), cambia la x por 3 y haz la cuenta.",
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
    title: "Productos notables y binomios",
    subject: "matematica",
    grade: "1m",
    description: "MA1M OA 03 · El cuadrado que se agranda",
    concept:
      "(x + 4)² es un cuadrado de lado x + 4. Tiene cuatro partes: x², dos franjas de 4x y un cuadradito de 16. Por eso (x + 4)² = x² + 8x + 16. No olvides las dos franjas del medio.",
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
// En Chile los miles se separan con punto o espacio («2.900», «2 900») y a
// veces se escribe el signo $. Una respuesta es correcta si alguna de sus
// lecturas coincide: «2.900» puede ser 2900 o 2,9.
export function readings(raw) {
  // También se aceptan grados y unidades al final: «40°», «54 cm²».
  const s = String(raw)
    .trim()
    .replace(/^\$\s*/, "")
    .replace(/\s*(?:°|grados?|[cm]?m[²³23]?|litros?)$/i, "");
  const out = [parseNumber(s)];
  const grouped = s.replace(/(\d)[ .](?=\d{3}(?:[ .]\d{3})*(?:,\d+)?$)/g, "$1");
  if (grouped !== s) out.push(parseNumber(grouped));
  return out.filter((n) => n !== null);
}
export function isCorrect(raw, answer) {
  return readings(raw).some((n) => Math.abs(n - answer) < 1e-8);
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
    : { kind: "unique", answer: b / a, a, b, left: l, right: r };
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
    watched: [],
  };
}
export function loadState(
  storage,
  availableLessons = lessons,
  key = "socatres.v1",
) {
  try {
    const s = JSON.parse(
      storage.getItem(key) ??
        (key === "socatres.v1" ? storage.getItem("tutorai.v1") : null),
    );
    if (s?.version !== 1) return freshState();
    const ids = new Set(availableLessons.map((l) => l.id));
    const state = {
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
              // Resumen al terminar una lección: su pregunta y lo que respondió el búho.
              ...Object.fromEntries(
                ["lesson", "question", "reply", "answer"]
                  .filter((k) => typeof n[k] === "string" && n[k])
                  .map((k) => [k, n[k].slice(0, 1000)]),
              ),
            }))
        : [],
      reviews: Array.isArray(s.reviews)
        ? s.reviews.filter(
            (r) => r && ids.has(r.lesson) && typeof r.due === "number",
          )
        : [],
      grade: s.grade in GRADES ? s.grade : undefined,
      dailyGoal: [30, 50, 80].includes(s.dailyGoal) ? s.dailyGoal : undefined,
      // Lección por la que el diagnóstico sugirió empezar.
      focus: typeof s.focus === "string" && ids.has(s.focus) ? s.focus : undefined,
      // Lecciones cuyo video se reprodujo; informativo, no cuenta para el dominio.
      watched: Array.isArray(s.watched)
        ? [...new Set(s.watched.filter((id) => ids.has(id)))]
        : [],
      ...(cleanArchive(s.archive, ids) ? { archive: cleanArchive(s.archive, ids) } : {}),
    };
    return withStoredPhotos(state, storage, key);
  } catch {
    return freshState();
  }
}

// Las fotos se guardan en una clave aparte: si el navegador se queda sin
// espacio, se pierde la foto nueva, nunca el progreso.
export const photosKey = (key) => `${key}.photos`;
const noteKey = (n) => `${n.at}|${n.title}`;
function withStoredPhotos(state, storage, key) {
  let photos;
  try {
    photos = JSON.parse(storage.getItem(photosKey(key)));
  } catch {
    return state;
  }
  if (!photos || typeof photos !== "object") return state;
  return {
    ...state,
    notes: state.notes.map((n) => {
      const image = photos[noteKey(n)];
      return n.image || typeof image !== "string" || !image.startsWith("data:image/")
        ? n
        : { ...n, image };
    }),
  };
}
// Devuelve false si el progreso se guardó pero las fotos no cupieron. Si no
// se puede guardar el progreso, lanza el error.
export function saveState(storage, key, state) {
  storage.setItem(key, JSON.stringify(withoutPhotos(state)));
  const photos = Object.fromEntries(
    state.notes.filter((n) => n.image).map((n) => [noteKey(n), n.image]),
  );
  try {
    if (Object.keys(photos).length)
      storage.setItem(photosKey(key), JSON.stringify(photos));
    else storage.removeItem(photosKey(key));
    return true;
  } catch {
    return false;
  }
}

// Intentos: se guardan uno a uno los de los últimos 30 días (máximo 2000),
// que es lo que usan la práctica del día, la meta y el resumen familiar. Los
// anteriores se resumen en `archive` con lo que se sigue mostrando: días de
// práctica (racha), aciertos (XP) y última práctica de cada lección. Así el
// progreso no crece sin límite y siempre cabe en el servidor.
const ARCHIVE_AFTER = 30 * 86400000;
const MAX_ATTEMPTS = 2000;
const utcDay = (ms) => new Date(ms).toISOString().slice(0, 10);
function cleanArchive(a, ids) {
  if (!a || typeof a !== "object" || !Number.isFinite(a.until)) return null;
  return {
    until: a.until,
    correct: Number.isInteger(a.correct) && a.correct >= 0 ? a.correct : 0,
    days: Array.isArray(a.days)
      ? [...new Set(a.days.filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort()
      : [],
    last: Object.fromEntries(
      Object.entries(a.last && typeof a.last === "object" ? a.last : {}).filter(
        ([id, at]) => ids.has(id) && Number.isFinite(at),
      ),
    ),
  };
}
export function compactAttempts(state, now = Date.now()) {
  const archive = state.archive;
  // Lo anterior a `until` ya está resumido (p. ej. llegó de otro dispositivo).
  const live = archive ? state.attempts.filter((a) => a.at > archive.until) : state.attempts;
  let cutoff = now - ARCHIVE_AFTER;
  if (live.length > MAX_ATTEMPTS)
    cutoff = Math.max(cutoff, [...live].sort((a, b) => a.at - b.at)[live.length - MAX_ATTEMPTS - 1].at);
  const old = live.filter((a) => a.at <= cutoff);
  if (!old.length) return live.length === state.attempts.length ? state : { ...state, attempts: live };
  const last = { ...(archive?.last ?? {}) };
  for (const a of old) last[a.lesson] = Math.max(last[a.lesson] ?? 0, a.at);
  return {
    ...state,
    attempts: live.filter((a) => a.at > cutoff),
    archive: {
      until: Math.max(archive?.until ?? 0, cutoff),
      correct: (archive?.correct ?? 0) + old.filter((a) => a.correct).length,
      days: [...new Set([...(archive?.days ?? []), ...old.map((a) => utcDay(a.at))])].sort(),
      last,
    },
  };
}
// Se queda con el resumen más avanzado (ya incluye lo que el otro resumió)
// y suma los días y las últimas prácticas, que no se duplican.
function mergeArchives(a, b) {
  if (!a || !b) return a ?? b;
  const [main, other] = a.until >= b.until ? [a, b] : [b, a];
  const last = { ...other.last };
  for (const [id, at] of Object.entries(main.last)) last[id] = Math.max(last[id] ?? 0, at);
  return {
    ...main,
    days: [...new Set([...main.days, ...other.days])].sort(),
    last,
  };
}

const lastActivity = (s) =>
  Math.max(
    0,
    ...s.attempts.map((a) => a.at),
    ...s.notes.map((n) => n.at),
    ...Object.values(s.archive?.last ?? {}),
  );
const unique = (list, key) => {
  const seen = new Map();
  for (const item of list) if (!seen.has(key(item))) seen.set(key(item), item);
  return [...seen.values()];
};
// Une el progreso de dos dispositivos. Lo acumulativo (lecciones completadas,
// intentos, notas) se suma; el dominio y los repasos vienen del estado con la
// actividad más reciente, porque un repaso fallido puede retirar un dominio.
export function mergeStates(local, remote) {
  if (!remote) return local;
  const [newer, older] =
    lastActivity(remote) > lastActivity(local) ? [remote, local] : [local, remote];
  const reviewed = new Set(newer.reviews.map((r) => r.lesson));
  const merged = {
    version: 1,
    diagnosed: local.diagnosed || remote.diagnosed,
    grade: newer.grade ?? older.grade,
    dailyGoal: newer.dailyGoal ?? older.dailyGoal,
    focus: newer.focus ?? older.focus,
    completed: unique([...local.completed, ...remote.completed], (id) => id),
    mastered: [...newer.mastered],
    attempts: unique(
      [...local.attempts, ...remote.attempts],
      (a) => `${a.lesson}|${a.at}|${a.correct}`,
    ).sort((a, b) => a.at - b.at),
    // Las notas locales van primero para conservar sus fotos.
    notes: unique(
      [...local.notes, ...remote.notes],
      (n) => `${n.at}|${n.title}`,
    ).sort((a, b) => b.at - a.at),
    reviews: [
      ...newer.reviews,
      ...older.reviews.filter((r) => !reviewed.has(r.lesson)),
    ],
    watched: unique([...(local.watched ?? []), ...(remote.watched ?? [])], (id) => id),
  };
  const archive = mergeArchives(local.archive, remote.archive);
  return archive
    ? { ...merged, archive, attempts: merged.attempts.filter((a) => a.at > archive.until) }
    : merged;
}
// Las fotos se quedan en el dispositivo; al servidor solo va el texto.
export const withoutPhotos = (state) => ({
  ...state,
  notes: state.notes.map(({ image, ...note }) => note),
});

// Preguntas de alternativas: texto, línea en blanco y opciones «1. …», «2. …».
const OPTION = /^(\d+)\.\s+(.*)$/;
function splitAlternatives(text) {
  const lines = String(text).split("\n");
  let first = lines.length;
  while (first > 0 && OPTION.test(lines[first - 1])) first--;
  const options = lines.slice(first).map((line) => line.match(OPTION)[2]);
  const numbered = lines
    .slice(first)
    .every((line, i) => Number(line.match(OPTION)[1]) === i + 1);
  return options.length >= 2 && numbered
    ? { stem: lines.slice(0, first).join("\n"), options }
    : null;
}
export const isMultipleChoice = (q) =>
  Boolean(splitAlternatives(q[0])) && Number.isInteger(q[1]);

// Cambia el orden de las alternativas para que el número correcto no se pueda
// recordar ni adivinar por costumbre. Las pistas no mencionan números.
export function shuffleAlternatives(q, rng = Math.random) {
  const parsed = splitAlternatives(q[0]);
  if (!parsed || !Number.isInteger(q[1]) || !parsed.options[q[1] - 1]) return q;
  const order = parsed.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const text =
    parsed.stem +
    "\n" +
    order.map((from, i) => `${i + 1}. ${parsed.options[from]}`).join("\n");
  return [text, order.indexOf(q[1] - 1) + 1, ...q.slice(2)];
}

// Lo que lee el estudiante: sin códigos de objetivos ni referencias
// curriculares, que son información para adultos (el mantenedor las conserva).
export function forStudent(text) {
  return String(text ?? "")
    .split("\n")
    .filter((line) => !/^(Referencia curricular|Actividad original)/.test(line.trim()))
    .join("\n")
    .replace(/\s*\((?:Mineduc|MINEDUC)[^)]*\)/g, "")
    .replace(/^\s*(?:(?:(?:MA|LE)\w{2}|FG-\dM) OA \d{1,2}\s*(?:\/\s*)?)+·\s*/, "")
    .trim();
}

export const GRADES = {
  "5b": "5° Básico",
  "6b": "6° Básico",
  "7b": "7° Básico",
  "8b": "8° Básico",
  "1m": "1° Medio",
  "2m": "2° Medio",
  "3m": "3° Medio",
  "4m": "4° Medio",
};
const gradePrefix = new RegExp(
  `^(?:${Object.values(GRADES).join("|")})(?:\\s*/\\s*(?:${Object.values(GRADES).join("|")}))*\\s*·\\s*`,
);
// Catálogos anteriores guardaban el curso solo en el título («7° Básico · …»).
export function inferGrade(lesson) {
  if (lesson?.grade in GRADES) return lesson.grade;
  const title = String(lesson?.title || "");
  const prefix = title.match(gradePrefix)?.[0] ?? "";
  // «8° Básico / 1° Medio · …» se asigna al curso más alto.
  let grade = "7b";
  for (const [key, label] of Object.entries(GRADES))
    if (prefix.includes(label)) grade = key;
  return grade;
}
export function displayTitle(lesson) {
  return String(lesson?.title || "").replace(gradePrefix, "");
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
          // Sin comprimir, una foto de varios MB llenaría el almacenamiento.
          const ctx = canvas.getContext ? canvas.getContext("2d") : null;
          if (!ctx) {
            return resolve(null);
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        } catch {
          resolve(null);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

