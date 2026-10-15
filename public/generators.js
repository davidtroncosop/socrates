// Variantes generadas para practicar de nuevo y repasar sin repetir ejercicios.
// Cada generador recibe rng (0 ≤ n < 1) y un nivel 0–3 (las cuatro fases de la
// lección) y devuelve [expresión, respuesta, instrucción, pista, explicación].
// Las respuestas son siempre exactas; los datos se eligen para que lo sean.

const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, list) => list[Math.floor(rng() * list.length)];
const nonZero = (rng, min, max) => {
  const n = int(rng, min, max);
  return n === 0 ? max : n;
};
const num = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));
const paren = (n) => (n < 0 ? `(${num(n)})` : String(n));
// «+ 3», «− 3»: término que continúa una expresión.
const plus = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);
// «3x», «−x», «x»: coeficiente delante de x.
const coef = (a) => (a === 1 ? "x" : a === -1 ? "−x" : num(a) + "x");
const linear = (a, b) => (b === 0 ? coef(a) : `${coef(a)} ${plus(b)}`);
const balance = "⚖️ Mantén el equilibrio: aplica la misma operación a ambos lados.";

function equations(rng, level) {
  const x = int(rng, 2, 12);
  if (level === 0) {
    const b = int(rng, 2, 15);
    return [
      `x + ${b} = ${x + b}`,
      x,
      "Encuentra x aplicando la operación inversa.",
      `${balance} Resta ${b} en ambos lados.`,
      `x = ${x + b} − ${b} = ${x}. Comprobación: ${x} + ${b} = ${x + b}.`,
    ];
  }
  if (level === 1) {
    const a = int(rng, 2, 9);
    return [
      `${a}x = ${a * x}`,
      x,
      `x está multiplicada por ${a}. Encuentra su valor.`,
      `${balance} Divide ambos lados entre ${a}.`,
      `x = ${a * x} ÷ ${a} = ${x}. Comprobación: ${a} × ${x} = ${a * x}.`,
    ];
  }
  const a = int(rng, 2, 9);
  const b = level === 2 ? int(rng, 1, 15) : -int(rng, 1, 15);
  const c = a * x + b;
  return [
    `${linear(a, b)} = ${num(c)}`,
    x,
    "Resuelve en dos pasos en tu cuaderno.",
    `${balance} Primero ${b > 0 ? "resta" : "suma"} ${Math.abs(b)} en ambos lados (${a}x = ${a * x}); luego divide entre ${a}.`,
    `${a}x = ${a * x}; x = ${x}. Comprobación: ${a}(${x}) ${plus(b)} = ${num(c)}.`,
  ];
}

function enteros(rng, level) {
  const size = [10, 15, 25, 40][level];
  const terms = Array.from({ length: level < 2 ? 2 : 3 }, () =>
    nonZero(rng, -size, size),
  );
  if (!terms.some((t) => t < 0)) terms[0] = -terms[0];
  const answer = terms.reduce((a, b) => a + b, 0);
  const expr = terms.map((t, i) => (i === 0 ? num(t) : "+ " + paren(t))).join(" ");
  return [
    expr,
    answer,
    "Calcula el resultado combinando los números enteros.",
    "Sumar un negativo equivale a restar su valor absoluto. Opera de izquierda a derecha.",
    `${expr} = ${num(answer)}.`,
    [
      [
        terms.reduce((a, b) => a + Math.abs(b), 0),
        "Sumaste los números sin sus signos. Un número negativo resta: ubícalo en la recta numérica.",
      ],
    ],
  ];
}

function semejantes(rng, level) {
  const count = level + 2;
  const terms = [int(rng, 5, 15)];
  for (let i = 1; i < count; i++) terms.push(nonZero(rng, -9, 9));
  const answer = terms.reduce((a, b) => a + b, 0);
  if (answer === 0) return semejantes(rng, level);
  const expr = terms
    .map((t, i) => (i === 0 ? coef(t) : `${t < 0 ? "−" : "+"} ${coef(Math.abs(t))}`))
    .join(" ");
  return [
    expr,
    answer,
    "Reduce los términos semejantes y escribe el coeficiente final de x.",
    "Todos los términos tienen x: suma y resta solo sus coeficientes.",
    `${terms.map(paren).join(" + ")} = ${num(answer)}; queda ${coef(answer)}.`,
    [
      [
        terms.reduce((a, b) => a + Math.abs(b), 0),
        "Sumaste todos los coeficientes. Los términos con signo − se restan.",
      ],
    ],
  ];
}

function proporciones(rng, level) {
  if (level < 2) {
    const k = int(rng, 2, 9),
      x = int(rng, 3, 15);
    return [
      `${k}x = ${k * x}`,
      x,
      `En una proporción directa la constante es ${k}. Encuentra x.`,
      `Divide ${k * x} entre ${k}.`,
      `x = ${k * x} ÷ ${k} = ${x}.`,
    ];
  }
  const price = pick(rng, [300, 450, 500, 600, 750, 800, 1200]);
  const a = int(rng, 2, 5),
    b = int(rng, a + 1, 9);
  return [
    `${a} cuadernos cuestan $${a * price}.`,
    b * price,
    `¿Cuánto cuestan ${b} cuadernos? Escribe solo el número.`,
    `Encuentra primero el precio de un cuaderno: $${a * price} ÷ ${a}.`,
    `Un cuaderno cuesta $${price}; ${b} cuestan ${b} × ${price} = $${b * price}.`,
    [
      [price, `Ese es el precio de un cuaderno. Ahora multiplícalo por ${b}.`],
      [a * price + (b - a), "En una proporción directa no se suma la diferencia: se mantiene el precio por unidad."],
    ],
  ];
}

function signs(rng, level) {
  if (level === 0) {
    const a = -int(rng, 2, 9),
      b = -int(rng, 2, 9);
    return [
      `${num(a)} × ${paren(b)}`,
      a * b,
      "Calcula el producto.",
      "Dos factores negativos dan un producto positivo.",
      `${num(a)} × ${paren(b)} = ${a * b}.`,
      [[a + b, "Sumaste los números. Aquí se multiplican: (−) × (−) = (+)."]],
    ];
  }
  if (level === 1) {
    const a = -int(rng, 2, 6),
      b = int(rng, 1, 5),
      c = int(rng, b + 1, 12);
    return [
      `${num(a)} × (${b} − ${c})`,
      a * (b - c),
      "Resuelve primero el paréntesis.",
      `${b} − ${c} = ${num(b - c)}. Luego multiplica por ${num(a)}.`,
      `${num(a)} × ${paren(b - c)} = ${num(a * (b - c))}.`,
      [[a * (b + c), `Dentro del paréntesis es una resta: ${b} − ${c} = ${num(b - c)}.`]],
    ];
  }
  const a = level === 2 ? int(rng, 2, 6) : -int(rng, 2, 6);
  const b = int(rng, 1, 9),
    x = nonZero(rng, -6, 12);
  const c = a * (x - b);
  return [
    `${num(a)}(x − ${b}) = ${num(c)}`,
    x,
    "Distribuye o divide primero: elige tu estrategia y encuentra x.",
    `Divide ambos lados entre ${num(a)}: x − ${b} = ${num(x - b)}.`,
    `x − ${b} = ${num(x - b)}; entonces x = ${num(x)}.`,
  ];
}

function both(rng, level) {
  const x = nonZero(rng, level < 2 ? 1 : -6, 12);
  const c = int(rng, 1, 5),
    a = c + int(rng, 1, 4);
  const b = int(rng, -12, 12),
    d = (a - c) * x + b;
  return [
    `${linear(a, b)} = ${linear(c, d)}`,
    x,
    "Agrupa las x en un lado y los números en el otro.",
    `${balance} Resta ${coef(c)} en ambos lados: ${linear(a - c, b)} = ${num(d)}.`,
    `${coef(a - c)} = ${num(d - b)}; x = ${num(x)}.`,
  ];
}

function combinadas(rng, level) {
  const a = int(rng, 2, 5),
    b = nonZero(rng, -6, 6),
    c = level < 2 ? 0 : int(rng, 1, a - 1),
    x = nonZero(rng, -5, 10);
  const d = a * (x + b) - c * x;
  const left = `${a}(x ${plus(b)})`;
  const right = c ? `${coef(c)} ${plus(d)}` : num(d);
  return [
    `${left} = ${right}`,
    x,
    "Distribuye el paréntesis, reduce y despeja x.",
    `Distribuye: ${linear(a, a * b)} = ${right}.`,
    `${coef(a - c)} = ${num(d - a * b)}; x = ${num(x)}.`,
  ];
}

function racionales(rng, level) {
  const x = int(rng, 2, 12) * 2;
  if (level < 2) {
    const b = int(rng, 1, 9);
    return [
      `0.5x + ${b} = ${x / 2 + b}`,
      x,
      "Resuelve la ecuación con decimales.",
      `Resta ${b} y divide entre 0.5 (equivale a multiplicar por 2).`,
      `0.5x = ${x / 2}; x = ${x}.`,
    ];
  }
  const d = pick(rng, [2, 3, 4]),
    q = int(rng, 2, 9),
    b = int(rng, 1, 9);
  return [
    `x/${d} + ${b} = ${q + b}`,
    q * d,
    "Resuelve la ecuación con una fracción.",
    `${balance} Resta ${b} en ambos lados y luego multiplica por ${d}.`,
    `x/${d} = ${q}; x = ${q} × ${d} = ${q * d}.`,
  ];
}

function potencias(rng, level) {
  const base = pick(rng, level < 2 ? [2, 3] : [2, 3, 5]);
  const max = base === 2 ? 8 : base === 3 ? 5 : 3;
  if (level % 2 === 0) {
    const m = int(rng, 1, max - 1),
      n = int(rng, 1, max - m);
    return [
      `${base}^${m} · ${base}^${n}`,
      base ** (m + n),
      "Aplica la suma de exponentes y calcula el valor.",
      `Misma base: suma los exponentes, ${m} + ${n} = ${m + n}.`,
      `${base}^${m + n} = ${base ** (m + n)}.`,
      [
        [base ** (m * n), "Multiplicaste los exponentes. Al multiplicar potencias de igual base, los exponentes se suman."],
        [base * (m + n), `Una potencia no es base × exponente: ${base}^${m + n} es ${base} multiplicado por sí mismo ${m + n} veces.`],
      ],
    ];
  }
  const n = int(rng, 1, max - 1),
    m = int(rng, n + 1, max + n);
  return [
    `${base}^${m} ÷ ${base}^${n}`,
    base ** (m - n),
    "Aplica la resta de exponentes y calcula el valor.",
    `Misma base: resta los exponentes, ${m} − ${n} = ${m - n}.`,
    `${base}^${m - n} = ${base ** (m - n)}.`,
    [
      [base * (m - n), `Una potencia no es base × exponente: ${base}^${m - n} es ${base} multiplicado por sí mismo ${m - n} veces.`],
      [base ** (m + n), "Sumaste los exponentes. Al dividir potencias de igual base, se restan."],
    ],
  ];
}

function funcion(rng, level) {
  const m = nonZero(rng, -5, 6),
    n = nonZero(rng, -9, 9);
  const k = int(rng, -4, 8);
  const y = m * k + n;
  if (level < 3)
    return [
      `f(${num(k)}) con f(x) = ${linear(m, n)}`,
      y,
      `Calcula la imagen de ${num(k)}.`,
      `Reemplaza x por ${num(k)}: ${num(m)} · ${paren(k)} ${plus(n)}.`,
      `f(${num(k)}) = ${num(m * k)} ${plus(n)} = ${num(y)}.`,
      [
        [m * k, `Calculaste ${num(m)} · ${paren(k)}, pero falta ${n < 0 ? "restar" : "sumar"} ${Math.abs(n)}.`],
        [m + k + n, "Sumaste los números. En f(x) = mx + n, m multiplica a x."],
      ],
    ];
  return [
    `f(x) = ${linear(m, n)} y f(x) = ${num(y)}`,
    k,
    "¿Para qué valor de x la función toma ese valor?",
    `${balance} Plantea ${linear(m, n)} = ${num(y)} y despeja x.`,
    `${coef(m)} = ${num(y - n)}; x = ${num(k)}.`,
  ];
}

function notables(rng, level) {
  const a = int(rng, 2, 12);
  if (level === 0)
    return [
      `En (x + ${a})^2, ¿cuál es el coeficiente de x?`,
      2 * a,
      "Calcula el coeficiente del término del medio.",
      `El término del medio es 2 · x · ${a}.`,
      `(x + ${a})² = x² + ${2 * a}x + ${a * a}; el coeficiente es ${2 * a}.`,
      [
        [a, `Falta el doble: el término del medio es 2 · x · ${a}.`],
        [a * a, "Ese es el término libre (a²). El coeficiente de x es 2a."],
      ],
    ];
  if (level === 1)
    return [
      `En (x − ${a})^2, ¿cuál es el término libre?`,
      a * a,
      "Calcula el término que no tiene x.",
      `El último término es el cuadrado de ${a}, siempre positivo.`,
      `(x − ${a})² = x² − ${2 * a}x + ${a * a}; el término libre es ${a * a}.`,
      [
        [-(a * a), "El cuadrado de un número negativo es positivo: (−a)² = a²."],
        [2 * a, "Ese es el coeficiente del término del medio. El término libre es a²."],
      ],
    ];
  if (level === 2)
    return [
      `En (x + ${a})(x − ${a}), ¿cuál es el término libre?`,
      -a * a,
      "Suma por su diferencia: calcula el término sin x.",
      "(x + a)(x − a) = x² − a².",
      `(x + ${a})(x − ${a}) = x² − ${a * a}; el término libre es −${a * a}.`,
      [[a * a, "En la suma por su diferencia el término libre es −a²: (+a)(−a) es negativo."]],
    ];
  const x = int(rng, 2, 9);
  return [
    `Si x = ${x}, calcula (x + ${a})^2 − (x − ${a})^2`,
    4 * a * x,
    "Usa productos notables antes de reemplazar.",
    "Desarrolla ambos cuadrados: los términos x² y a² se cancelan.",
    `La diferencia es 4 · ${a} · x = ${4 * a} · ${x} = ${4 * a * x}.`,
  ];
}

function porcentajes(rng, level) {
  const p = pick(rng, [[10, 20, 50], [5, 25, 30], [15, 40, 75], [12, 35, 60]][level]);
  const base = pick(rng, [20, 40, 60, 80, 120, 200, 400]);
  const value = (p * base) / 100;
  if (!Number.isInteger(value)) return porcentajes(rng, level);
  return [
    `${p} % de ${base}`,
    value,
    "Calcula la cantidad. Escribe solo el número.",
    `Multiplica ${base} por ${p} y divide entre 100.`,
    `${base} × ${p} ÷ 100 = ${value}.`,
    [
      [p * base, "Olvidaste dividir entre 100: p % significa p de cada 100."],
      [base - value, "Eso es lo que queda después de descontar. Se pide el porcentaje, no el resto."],
    ],
  ];
}

function pitagoras(rng, level) {
  const [a, b, c] = pick(rng, [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [6, 8, 10],
  ]);
  const k = level < 2 ? 1 : int(rng, 2, 3);
  if (level % 2 === 0)
    return [
      `Catetos ${a * k} y ${b * k}`,
      c * k,
      "Calcula la hipotenusa del triángulo rectángulo.",
      "Usa a² + b² = c² y saca raíz cuadrada.",
      `${(a * k) ** 2} + ${(b * k) ** 2} = ${(c * k) ** 2}; c = ${c * k}.`,
      [
        [(a + b) * k, "No se suman los lados: se suman sus cuadrados y después se saca la raíz."],
        [(c * k) ** 2, "Ese es c². Falta sacar la raíz cuadrada."],
      ],
    ];
  return [
    `Hipotenusa ${c * k} y un cateto ${a * k}`,
    b * k,
    "Calcula el otro cateto.",
    "Despeja: b² = c² − a².",
    `${(c * k) ** 2} − ${(a * k) ** 2} = ${(b * k) ** 2}; b = ${b * k}.`,
    [
      [(b * k) ** 2, "Ese es b². Falta sacar la raíz cuadrada."],
      [(c - a) * k, "No se restan los lados: se restan sus cuadrados y después se saca la raíz."],
    ],
  ];
}

// Jerarquía de operaciones (PAPOMUDAS). El error típico es operar de
// izquierda a derecha sin respetar la prioridad: se anticipa en cada nivel.
const SUP = { 2: "²", 3: "³" };
const order = "Calcula respetando la jerarquía de operaciones.";
const ifInt = (value, message) => (Number.isInteger(value) ? [[value, message]] : []);

function jerarquiaMult(rng, level) {
  if (level === 0) {
    const [a, b, c] = [int(rng, 2, 20), int(rng, 2, 9), int(rng, 2, 9)];
    return [
      `${a} + ${b} · ${c}`, a + b * c, order,
      `📦 Primero el paquete: ${b} · ${c}. Después suma lo suelto.`,
      `${b} · ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}.`,
      [[(a + b) * c, `Sumaste primero (${a} + ${b}). La multiplicación va antes: ${b} · ${c} = ${b * c}.`]],
    ];
  }
  if (level === 1) {
    const c = int(rng, 2, 9);
    const q = int(rng, 2, 9);
    const a = q + int(rng, 1, 20);
    return [
      `${a} − ${c * q} ÷ ${c}`, a - q, order,
      `La división va antes que la resta: calcula ${c * q} ÷ ${c}.`,
      `${c * q} ÷ ${c} = ${q}; ${a} − ${q} = ${a - q}.`,
      ifInt((a - c * q) / c, `Restaste antes de dividir. Primero ${c * q} ÷ ${c} = ${q}.`),
    ];
  }
  if (level === 2) {
    const [a, b, c, d] = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)];
    return [
      `${a} · ${b} + ${c} · ${d}`, a * b + c * d,
      "Hay dos multiplicaciones: resuélvelas antes de sumar.",
      `Calcula cada paquete por separado: ${a} · ${b} y ${c} · ${d}.`,
      `${a * b} + ${c * d} = ${a * b + c * d}.`,
      [[(a * b + c) * d, `Operaste de izquierda a derecha. Primero las dos multiplicaciones: ${a * b} y ${c * d}.`]],
    ];
  }
  const [b, c, d] = [int(rng, 2, 6), int(rng, 2, 6), int(rng, 1, 9)];
  const a = b * c + int(rng, 2, 15);
  return [
    `${a} − ${b} · ${c} + ${d}`, a - b * c + d, order,
    "Primero la multiplicación; después resta y suma, de izquierda a derecha.",
    `${b} · ${c} = ${b * c}; ${a} − ${b * c} = ${a - b * c}; ${a - b * c} + ${d} = ${a - b * c + d}.`,
    [
      [(a - b) * c + d, `Operaste de izquierda a derecha: primero va ${b} · ${c} = ${b * c}.`],
      [a - (b * c + d), `La resta y la suma van de izquierda a derecha: ${a} − ${b * c} = ${a - b * c} y después + ${d}.`],
    ],
  ];
}

function jerarquiaParentesis(rng, level) {
  if (level === 0) {
    const [a, b, c] = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)];
    return [
      `(${a} + ${b}) · ${c}`, (a + b) * c, order,
      `📦 Primero lo que está dentro del paréntesis: ${a} + ${b}.`,
      `${a} + ${b} = ${a + b}; ${a + b} · ${c} = ${(a + b) * c}.`,
      [[a + b * c, `Ignoraste el paréntesis. Lo de adentro va primero: ${a} + ${b} = ${a + b}.`]],
    ];
  }
  if (level === 1) {
    const b = int(rng, 1, 5);
    const c = int(rng, 1, 5);
    const q = int(rng, 2, 9);
    const a = (b + c) * q;
    return [
      `${a} ÷ (${b} + ${c})`, q, order,
      "Resuelve el paréntesis antes de dividir.",
      `${b} + ${c} = ${b + c}; ${a} ÷ ${b + c} = ${q}.`,
      ifInt(a / b + c, `Dividiste antes de resolver el paréntesis. Primero ${b} + ${c} = ${b + c}.`),
    ];
  }
  if (level === 2) {
    const [a, c, d] = [int(rng, 2, 9), int(rng, 1, 6), int(rng, 1, 9)];
    const b = c + int(rng, 2, 8);
    return [
      `${a} · (${b} − ${c}) + ${d}`, a * (b - c) + d, order,
      "Paréntesis, después la multiplicación y al final la suma.",
      `${b} − ${c} = ${b - c}; ${a} · ${b - c} = ${a * (b - c)}; ${a * (b - c)} + ${d} = ${a * (b - c) + d}.`,
      [
        [a * b - c + d, `Ignoraste el paréntesis: primero ${b} − ${c} = ${b - c}.`],
        [a * (b - c + d), `El + ${d} está fuera del paréntesis: se suma al final.`],
      ],
    ];
  }
  const [a, b, d] = [int(rng, 2, 5), int(rng, 1, 9), int(rng, 1, 6)];
  const c = d + int(rng, 1, 8);
  return [
    `${a} · [${b} + (${c} − ${d})]`, a * (b + c - d),
    "Hay un paréntesis dentro de un corchete. Calcula desde adentro hacia afuera.",
    `Abre las cajas desde la más chica: primero ${c} − ${d}, después el corchete.`,
    `${c} − ${d} = ${c - d}; ${b} + ${c - d} = ${b + c - d}; ${a} · ${b + c - d} = ${a * (b + c - d)}.`,
    [[a * b + c - d, `El ${a} multiplica a todo el corchete, no solo al ${b}.`]],
  ];
}

function jerarquiaEnteros(rng, level) {
  if (level === 0) {
    const [a, b, c] = [int(rng, 5, 20), int(rng, 2, 6), int(rng, 2, 6)];
    return [
      `−${a} + ${b} · ${c}`, -a + b * c, order,
      `📦 Primero el paquete ${b} · ${c}; después sube desde el −${a}.`,
      `${b} · ${c} = ${b * c}; −${a} + ${b * c} = ${num(-a + b * c)}.`,
      [[(-a + b) * c, `Sumaste −${a} + ${b} antes de multiplicar. Primero ${b} · ${c} = ${b * c}.`]],
    ];
  }
  if (level === 1) {
    const [b, c] = [int(rng, 2, 6), int(rng, 3, 7)];
    const a = int(rng, 1, b * c - 1);
    return [
      `${a} − ${b} · ${c}`, a - b * c, order,
      `Multiplica primero: ${b} · ${c} = ${b * c}. ¿Qué pasa si al ${a} le quitas ${b * c}?`,
      `${b} · ${c} = ${b * c}; ${a} − ${b * c} = ${num(a - b * c)}.`,
      [
        [(a - b) * c, `Restaste primero. La multiplicación va antes: ${b} · ${c} = ${b * c}.`],
        [b * c - a, `${a} − ${b * c} queda bajo cero: es ${num(a - b * c)}.`],
      ],
    ];
  }
  if (level === 2) {
    const [a, b] = [int(rng, 2, 12), int(rng, 1, 8)];
    const c = b + int(rng, 1, 9);
    return [
      `−${a} − (${b} − ${c})`, -a - (b - c), order,
      `Primero el paréntesis: ${b} − ${c} = ${num(b - c)}. Después, restar un negativo es quitar una deuda.`,
      `${b} − ${c} = ${num(b - c)}; −${a} − (${num(b - c)}) = −${a} + ${c - b} = ${num(-a - (b - c))}.`,
      [[-a + (b - c), `Restar un negativo es sumar: −${a} − (${num(b - c)}) = −${a} + ${c - b}.`]],
    ];
  }
  const [a, c] = [int(rng, 2, 9), int(rng, 2, 4)];
  const b = a + int(rng, 1, 6);
  const d = (b - a) * c + int(rng, 1, 8);
  return [
    `(−${a} + ${b}) · ${c} − ${d}`, (b - a) * c - d, order,
    "Paréntesis, multiplicación y al final la resta.",
    `−${a} + ${b} = ${b - a}; ${b - a} · ${c} = ${(b - a) * c}; ${(b - a) * c} − ${d} = ${num((b - a) * c - d)}.`,
    [
      [-a + b * c - d, `Ignoraste el paréntesis: primero −${a} + ${b} = ${b - a}.`],
      [d - (b - a) * c, `${(b - a) * c} − ${d} queda bajo cero: es ${num((b - a) * c - d)}.`],
    ],
  ];
}

function jerarquiaPotencias(rng, level) {
  if (level === 0) {
    const [a, b] = [int(rng, 1, 9), int(rng, 2, 6)];
    return [
      `${a} + ${b}²`, a + b * b, order,
      `La potencia va antes que la suma: ${b}² = ${b} · ${b}.`,
      `${b}² = ${b * b}; ${a} + ${b * b} = ${a + b * b}.`,
      [
        [(a + b) ** 2, `Sumaste antes de elevar. La potencia solo afecta al ${b}: ${b}² = ${b * b}.`],
        [a + 2 * b, `${b}² no es ${b} · 2: es ${b} · ${b} = ${b * b}.`],
      ],
    ];
  }
  if (level === 1) {
    const [a, b] = [int(rng, 2, 5), int(rng, 2, 4)];
    return [
      `${a} · ${b}³`, a * b ** 3, order,
      `Primero la potencia: ${b}³ = ${b} · ${b} · ${b}.`,
      `${b}³ = ${b ** 3}; ${a} · ${b ** 3} = ${a * b ** 3}.`,
      [
        [(a * b) ** 3, `Multiplicaste antes de elevar. Primero ${b}³ = ${b ** 3}.`],
        [a * b * 3, `${b}³ no es ${b} · 3: es ${b} · ${b} · ${b} = ${b ** 3}.`],
      ],
    ];
  }
  if (level === 2) {
    const [a, b] = [int(rng, 1, 4), int(rng, 1, 4)];
    const c = int(rng, 1, 9);
    return [
      `(${a} + ${b})${SUP[2]} − ${c}`, (a + b) ** 2 - c, order,
      "Paréntesis, potencia y al final la resta.",
      `${a} + ${b} = ${a + b}; ${a + b}² = ${(a + b) ** 2}; ${(a + b) ** 2} − ${c} = ${num((a + b) ** 2 - c)}.`,
      [[a + b * b - c, `El exponente afecta a todo el paréntesis: primero ${a} + ${b} = ${a + b}.`]],
    ];
  }
  const [a, b, d] = [int(rng, 2, 4), int(rng, 2, 3), int(rng, 1, 4)];
  const c = d + int(rng, 1, 5);
  return [
    `${a} · ${b}² − (${c} − ${d})`, a * b * b - (c - d),
    "Calcula paso a paso con PAPOMUDAS.",
    `Paréntesis (${c} − ${d}), potencia (${b}²), multiplicación y al final la resta.`,
    `${c} − ${d} = ${c - d}; ${b}² = ${b * b}; ${a} · ${b * b} = ${a * b * b}; ${a * b * b} − ${c - d} = ${num(a * b * b - (c - d))}.`,
    [[(a * b) ** 2 - (c - d), `Multiplicaste antes de elevar. Primero ${b}² = ${b * b}.`]],
  ];
}

// Bases (para todos los cursos). Cada nivel anticipa el error típico.
const comma = (n) => String(Math.round(n * 100) / 100).replace(".", ",");
const PLACE = [1, 10, 100];

function baseValorPosicional(rng, level) {
  if (level === 0) {
    // Una cifra que no se repita, para que la pregunta no sea ambigua.
    const digits = [int(rng, 1, 9), int(rng, 0, 9), int(rng, 0, 9)];
    const place = int(rng, 0, 2);
    const d = digits[2 - place] || 5;
    digits[2 - place] = d;
    for (let i = 0; i < 3; i++) if (i !== 2 - place && digits[i] === d) digits[i] = (d % 9) + 1 === d ? 0 : (d % 9) + 1;
    if (digits[0] === 0) digits[0] = d === 1 ? 2 : 1;
    const n = Number(digits.join(""));
    const names = ["unidades", "decenas", "centenas"];
    return [
      `¿Cuánto vale el ${d} en ${n}?`, d * PLACE[place],
      `Escribe cuánto vale el ${d} según su lugar.`,
      `💰 Cuenta los lugares desde la derecha: unidades, decenas, centenas.`,
      `El ${d} está en las ${names[place]}: ${d} · ${PLACE[place]} = ${d * PLACE[place]}.`,
      [[d, `Esa es la cifra, pero vale según su lugar: está en las ${names[place]}.`]],
    ];
  }
  if (level === 1) {
    const [a, b, c] = [int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)];
    return [
      `${a * 100} + ${b * 10} + ${c}`, a * 100 + b * 10 + c,
      "Junta las monedas en un solo número.",
      `${a} monedas de $100, ${b} de $10 y ${c} de $1.`,
      `${a * 100} + ${b * 10} + ${c} = ${a * 100 + b * 10 + c}.`,
      [[a + b + c, "No se suman las cifras: cada una va en su lugar."]],
    ];
  }
  if (level === 2) {
    const n = int(rng, 11, 99);
    return [
      `${n} · 10`, n * 10, "Multiplica por 10.",
      "Por 10, todo sube un lugar: se agrega un cero a la derecha.",
      `${n} · 10 = ${n * 10}.`,
      [[n + 10, `Sumaste 10. Multiplicar por 10 es tener 10 veces lo mismo: ${n * 10}.`], [n * 100, `Por 10 se agrega un solo cero: ${n * 10}.`]],
    ];
  }
  const [a, b, c] = [int(rng, 2, 8), int(rng, 10, 19), int(rng, 1, 9)];
  return [
    `${a} · 100 + ${b} · 10 + ${c}`, a * 100 + b * 10 + c,
    `Tienes ${a} monedas de $100, ${b} de $10 y ${c} de $1. ¿Cuánto dinero tienes?`,
    `${b} monedas de $10 son $${b * 10}.`,
    `${a * 100} + ${b * 10} + ${c} = ${a * 100 + b * 10 + c}.`,
    [[Number(`${a}${b}${c}`), `No se escriben las cantidades una al lado de la otra: ${b} monedas de $10 son $${b * 10}.`]],
  ];
}

// Cifras por lugar (unidades primero) para calcular los errores de columna.
const columns = (n, size) => Array.from({ length: size }, (_, i) => Math.floor(n / 10 ** i) % 10);
const noCarrySum = (a, b, size) =>
  columns(a, size).reduce((t, d, i) => t + ((d + columns(b, size)[i]) % 10) * 10 ** i, 0);
const absDiff = (a, b, size) =>
  columns(a, size).reduce((t, d, i) => t + Math.abs(d - columns(b, size)[i]) * 10 ** i, 0);

function baseSumaResta(rng, level) {
  if (level === 0) {
    const [a0, b0] = [int(rng, 3, 9), int(rng, 3, 9)];
    const fix0 = a0 + b0 < 10 ? 10 - a0 - b0 : 0;
    const a = int(rng, 1, 4) * 10 + a0;
    const b = int(rng, 1, 4) * 10 + Math.min(9, b0 + fix0);
    return [
      `${a} + ${b}`, a + b, "Suma con canje.",
      "Si las unidades suman 10 o más, deja las unidades y lleva 1 decena.",
      `${a} + ${b} = ${a + b}.`,
      [[noCarrySum(a, b, 2), "Olvidaste la decena que llevabas."]],
    ];
  }
  if (level === 1) {
    // Las unidades siempre suman 10 o más: hay canje.
    const a0 = int(rng, 3, 9);
    const a = int(rng, 1, 4) * 100 + int(rng, 1, 8) * 10 + a0;
    const b = int(rng, 1, 4) * 100 + int(rng, 1, 8) * 10 + int(rng, 10 - a0, 9);
    return [
      `${a} + ${b}`, a + b, "Suma con canje.",
      "Suma cada lugar por separado. Si juntas 10 o más, lleva 1 al lugar siguiente.",
      `${a} + ${b} = ${a + b}.`,
      [[noCarrySum(a, b, 3), "Olvidaste lo que llevabas de un lugar al siguiente."]],
    ];
  }
  if (level === 2) {
    const a = int(rng, 4, 9) * 10 + int(rng, 0, 4);
    const b = int(rng, 1, Math.floor(a / 10) - 1) * 10 + int(rng, (a % 10) + 1, 9);
    return [
      `${a} − ${b}`, a - b, "Resta con canje.",
      "Si las unidades no alcanzan, cambia una decena por 10 unidades.",
      `${a} − ${b} = ${a - b}.`,
      [[absDiff(a, b, 2), "Restaste al revés en las unidades. Cuando no alcanza, cambia una decena por 10 unidades."]],
    ];
  }
  const a = int(rng, 3, 9) * 100 + int(rng, 0, 5);
  const b = int(rng, 1, Math.floor(a / 100) - 1) * 100 + int(rng, 1, 9) * 10 + int(rng, (a % 10) + 1, 9);
  return [
    `${a} − ${b}`, a - b, "Resta con canje, aunque haya un cero.",
    "En las decenas hay 0: primero cambia una centena por 10 decenas, y después una decena por 10 unidades.",
    `${a} − ${b} = ${a - b}.`,
    [[absDiff(a, b, 3), "Restaste el número chico del grande en cada lugar. Cuando no alcanza, hay que cambiar."]],
  ];
}

function baseMultiplicar(rng, level) {
  if (level === 0) {
    const n = int(rng, 3, 9);
    return [`${n} · 4`, n * 4, "Usa el atajo del doble del doble.", `${n} · 2 = ${n * 2}. Ahora el doble de ${n * 2}.`, `${n} · 2 = ${n * 2} y el doble es ${n * 4}.`,
      [[n + 4, `Sumaste. Multiplicar es juntar ${n} grupos de 4: ${n * 4}.`]]];
  }
  if (level === 1) {
    const n = int(rng, 12, 24);
    return [`5 · ${n}`, 5 * n, "Usa el atajo de la mitad.", `${n} · 10 = ${n * 10}. Ahora la mitad.`, `5 · ${n} es la mitad de ${n * 10}: ${5 * n}.`,
      [[5 + n, `Sumaste. Por 5 es la mitad de por 10: ${5 * n}.`], [10 * n, `Eso es por 10. Por 5 es la mitad: ${5 * n}.`]]];
  }
  if (level === 2) {
    const n = int(rng, 3, 9);
    return [`9 · ${n}`, 9 * n, "Usa el atajo de por 10 menos una vez.", `10 · ${n} = ${10 * n}. Ahora quita un ${n}.`, `9 · ${n} = ${10 * n} − ${n} = ${9 * n}.`,
      [[10 * n, `Eso es 10 · ${n}. Por 9 es una vez menos: ${9 * n}.`], [9 + n, `Sumaste. Multiplicar es juntar 9 grupos de ${n}: ${9 * n}.`]]];
  }
  const [a, b] = [int(rng, 6, 9), int(rng, 6, 9)];
  return [`${a} · ${b}`, a * b, "Elige el atajo que quieras.", "Por ejemplo: el doble, la mitad de por 10, o por 10 menos una vez.", `${a} · ${b} = ${a * b}.`,
    [[a + b, `Sumaste. Multiplicar es juntar ${a} grupos de ${b}: ${a * b}.`]]];
}

function baseDividir(rng, level) {
  if (level <= 1) {
    const b = level === 0 ? int(rng, 2, 5) : int(rng, 6, 9);
    const q = int(rng, 3, 9);
    return [`${b * q} ÷ ${b}`, q, "Reparte en partes iguales.", `¿Qué número por ${b} da ${b * q}?`, `${b} · ${q} = ${b * q}, así que ${b * q} ÷ ${b} = ${q}.`,
      [[b * q - b, `Restaste ${b}. Dividir es repartir: ¿qué número por ${b} da ${b * q}?`], [b * q * b, "Multiplicaste. Dividir es lo contrario."]]];
  }
  if (level === 2) {
    const b = int(rng, 3, 6);
    const q = int(rng, 4, 9);
    const r = int(rng, 1, b - 1);
    const n = b * q + r;
    return [`${n} láminas ÷ ${b} amigos`, r, `Reparte ${n} láminas entre ${b} amigos, todos con la misma cantidad. ¿Cuántas sobran?`,
      `${b} · ${q} = ${b * q}. ¿Cuánto falta de ${b * q} a ${n}?`, `A cada amigo le tocan ${q} (${b} · ${q} = ${b * q}) y sobran ${n} − ${b * q} = ${r}.`,
      [[q, `${q} es lo que le toca a cada uno. La pregunta es cuántas sobran: ${r}.`]]];
  }
  const b = int(rng, 2, 4);
  const q = int(rng, 11, Math.floor(99 / b));
  return [`${b * q} ÷ ${b}`, q, "Divide por partes.", `Reparte primero las decenas y después las unidades.`, `${b * q} ÷ ${b} = ${q}, porque ${b} · ${q} = ${b * q}.`,
    [[b * q * b, "Multiplicaste. Dividir es repartir en partes iguales."]]];
}

function baseFracciones(rng, level) {
  if (level === 0) {
    const b = int(rng, 3, 9);
    const a = int(rng, 1, b - 1);
    return [`¿En cuántas partes se corta la pizza en ${a}/${b}?`, b, "Mira el número de abajo.", "🍕 El número de abajo dice en cuántas partes iguales se corta.",
      `En ${a}/${b} la pizza se corta en ${b} partes y se toman ${a}.`,
      [[a, `El ${a} es cuántas partes tomas. El número de abajo, ${b}, dice en cuántas se corta.`]]];
  }
  if (level === 1) {
    const b = int(rng, 2, 6);
    const k = int(rng, 2, 9);
    return [`1/${b} de ${b * k}`, k, "Calcula la parte.", `Divide en ${b} partes iguales.`, `${b * k} ÷ ${b} = ${k}.`,
      [[b * k * b, `Multiplicaste. Es dividir en ${b} partes: ${k}.`], [b * k - b, `Restaste. Es dividir en ${b} partes iguales: ${k}.`]]];
  }
  if (level === 2) {
    const b = int(rng, 3, 6);
    const a = int(rng, 2, b - 1);
    const k = int(rng, 2, 9);
    return [`${a}/${b} de ${b * k}`, a * k, "Calcula la parte.", `Divide ${b * k} en ${b} partes y toma ${a}.`, `${b * k} ÷ ${b} = ${k}; ${a} · ${k} = ${a * k}.`,
      [[k, `Esa es una sola parte. Toma ${a}: ${a * k}.`], [a * b * k, `Te faltó dividir en ${b} partes.`]]];
  }
  const k = int(rng, 2, 6);
  return [`1/2 = ?/${2 * k}`, k, "Encuentra la fracción equivalente.", `${2 * k} partes forman el entero. ¿Cuántas son la mitad?`, `La mitad de ${2 * k} es ${k}: 1/2 = ${k}/${2 * k}.`,
    [[2, `La mitad no son 2 partes: ${2 * k} forman el entero, y la mitad son ${k}.`]]];
}

function baseDecimales(rng, level) {
  if (level === 0) {
    const d = int(rng, 1, 9);
    return [`0,${d} m = ? cm`, d * 10, "Convierte a centímetros.", "📏 Un metro tiene 100 cm.", `0,${d} · 100 = ${d * 10} cm.`,
      [[d, `Para pasar de metros a centímetros se multiplica por 100: ${d * 10}.`]]];
  }
  if (level === 1) {
    const cm = int(rng, 11, 99);
    const m = 1 + cm / 100;
    return [`${comma(m)} m = ? cm`, 100 + cm, "Convierte a centímetros.", `1 m son 100 cm, y 0,${String(cm).padStart(2, "0")} m son ${cm} cm.`, `${comma(m)} · 100 = ${100 + cm} cm.`,
      [[Math.round((100 + cm)) / 10, `Para pasar de metros a centímetros se multiplica por 100: ${100 + cm}.`]]];
  }
  if (level === 2) {
    const a = int(rng, 1, 5) + int(rng, 1, 9) / 10;
    const b = int(rng, 1, 5) + int(rng, 11, 99) / 100;
    const sum = Math.round((a + b) * 100) / 100;
    return [`${comma(a)} + ${comma(b)}`, sum, "Suma con la coma debajo de la coma.", `Escribe ${comma(a)}0 + ${comma(b)}.`, `${comma(a)}0 + ${comma(b)} = ${comma(sum)}.`,
      [[Math.round((Math.trunc(a) + Math.trunc(b) + (Math.round((a % 1) * 10) + Math.round((b % 1) * 100)) / 100) * 100) / 100, `El ${comma(a)} tiene décimas: escríbelo como ${comma(a)}0 y suma con la coma debajo de la coma.`]]];
  }
  const n = int(rng, 2, 9);
  const d = int(rng, 1, 9);
  const diff = Math.round((n - d / 10) * 10) / 10;
  return [`${n} − 0,${d}`, diff, "Resta con la coma debajo de la coma.", `Escribe ${n} como ${n},0.`, `${n},0 − 0,${d} = ${comma(diff)}.`,
    [[Math.abs(d - n), `Escribe ${n} como ${n},0: ${n},0 − 0,${d} = ${comma(diff)}.`]]];
}

// Lote 1 (6° y 7° Básico): múltiplos, fracciones, promedio y área.
const frac = (a, b) => `${a}/${b}`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const divisorsOf = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const isPrime = (n) => n > 1 && divisorsOf(n).length === 2;
const shuffle = (rng, list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

function multiplosDivisores(rng, level) {
  if (level === 0) {
    const [n, k] = [int(rng, 3, 9), int(rng, 3, 8)];
    const ord = ["", "primer", "segundo", "tercer", "cuarto", "quinto", "sexto", "séptimo", "octavo"][k];
    return [`¿Cuál es el ${ord} múltiplo de ${n}?`, n * k, `Recorre la tabla del ${n}.`, `🦘 Salta de ${n} en ${n}.`,
      `Los múltiplos de ${n} son ${Array.from({ length: k }, (_, i) => n * (i + 1)).join(", ")}: el ${ord} es ${n * k}.`,
      [[n + k, `Sumaste. El ${ord} múltiplo es ${n} · ${k} = ${n * k}.`], [n * (k - 1), `Ese es el anterior. Cuenta de ${n} en ${n} hasta el ${ord}.`]]];
  }
  if (level === 1) {
    const n = pick(rng, [12, 18, 20, 24, 28, 30]);
    const ds = divisorsOf(n);
    return [`¿Cuántos divisores tiene el ${n}?`, ds.length, `Busca todos los números que dividen a ${n} sin que sobre nada.`,
      "Busca parejas que multiplicadas den el número.", `Los divisores de ${n} son ${ds.join(", ")}: son ${ds.length}.`,
      [[ds.length - 2, `Te faltaron el 1 y el ${n}: también lo dividen.`]]];
  }
  if (level === 2) {
    // Intervalos con un solo primo.
    const starts = [];
    for (let a = 8; a < 90; a++) {
      const primes = Array.from({ length: 5 }, (_, i) => a + 1 + i).filter(isPrime);
      if (primes.length === 1) starts.push([a, primes[0]]);
    }
    const [a, p] = pick(rng, starts);
    return [`¿Cuál es el único número primo entre ${a} y ${a + 6}?`, p, "Un primo solo se divide por 1 y por sí mismo.",
      "Descarta los pares y los que terminan en 5. ¿Qué queda?", `El ${p} solo se divide por 1 y por ${p}.`, []];
  }
  const pairs = [[4, 6], [6, 8], [6, 9], [4, 10], [8, 12], [6, 10], [9, 12], [10, 15]];
  const [a, b] = pick(rng, pairs);
  const lcm = (a * b) / gcd(a, b);
  return [`Buses cada ${a} y cada ${b} minutos`, lcm,
    `Dos buses salen juntos. Uno pasa cada ${a} minutos y el otro cada ${b}. ¿En cuántos minutos vuelven a pasar juntos?`,
    "Escribe los múltiplos de cada uno y busca el primero que se repite.", `El primer múltiplo común de ${a} y ${b} es ${lcm}.`,
    [[a + b, `Sumaste. Busca el primer múltiplo común: ${lcm}.`], [a * b, `${a * b} también es común, pero hay uno antes: ${lcm}.`]]];
}

function fraccionesSuma(rng, level) {
  if (level <= 1) {
    const d = int(rng, 5, 9);
    let a = int(rng, 1, d - 2);
    let b = int(rng, 1, d - 1 - a);
    if (level === 1 && a < b) [a, b] = [b, a];
    if (level === 1 && a === b) a = Math.min(d - 1, a + 1);
    const top = level === 0 ? a + b : a - b;
    return [`${frac(a, d)} ${level === 0 ? "+" : "−"} ${frac(b, d)}`, top / d,
      `${level === 0 ? "Suma" : "Resta"} las fracciones. Puedes responder como fracción, por ejemplo ${frac(1, d)}.`,
      "🍕 Las partes ya son del mismo tamaño: opera solo los de arriba.", `${frac(a, d)} ${level === 0 ? "+" : "−"} ${frac(b, d)} = ${frac(top, d)}.`,
      level === 0 ? [[top / (2 * d), `Sumaste también los de abajo. El de abajo dice el tamaño de las partes: se queda en ${d}.`]] : []];
  }
  const b = int(rng, 2, 5);
  const a = int(rng, 1, b - 1);
  // En la resta, lo que se quita es menor: el resultado es positivo.
  const c = level === 2 ? int(rng, 1, b) : int(rng, 1, Math.min(b, 2 * a - 1));
  const total = level === 2 ? (2 * a + c) / (2 * b) : (2 * a - c) / (2 * b);
  return [`${frac(a, b)} ${level === 2 ? "+" : "−"} ${frac(c, 2 * b)}`, total, `${level === 2 ? "Suma" : "Resta"} las fracciones.`,
    `Corta cada parte de ${frac(1, b)} en dos: ${frac(a, b)} = ${frac(2 * a, 2 * b)}.`,
    `${frac(a, b)} = ${frac(2 * a, 2 * b)}; ${frac(2 * a, 2 * b)} ${level === 2 ? "+" : "−"} ${frac(c, 2 * b)} = ${frac(level === 2 ? 2 * a + c : 2 * a - c, 2 * b)}.`,
    level === 2 ? [[(a + c) / (3 * b), "Sumaste arriba y abajo por separado. Primero haz partes del mismo tamaño."]] : []];
}

function fraccionesMult(rng, level) {
  if (level === 0) {
    const [a, b] = [int(rng, 2, 5), int(rng, 2, 5)];
    return [`${frac(1, a)} · ${frac(1, b)}`, 1 / (a * b), "Multiplica las fracciones.", "🍕 Arriba por arriba y abajo por abajo.",
      `1 · 1 = 1 y ${a} · ${b} = ${a * b}: ${frac(1, a * b)}.`, [[2 / (a + b), "Sumaste. Para multiplicar: arriba por arriba y abajo por abajo."]]];
  }
  if (level === 1) {
    const [b, d] = [int(rng, 3, 6), int(rng, 3, 6)];
    const [a, c] = [int(rng, 1, b - 1), int(rng, 1, d - 1)];
    return [`${frac(a, b)} · ${frac(c, d)}`, (a * c) / (b * d), "Multiplica las fracciones.", `Arriba: ${a} · ${c}. Abajo: ${b} · ${d}.`,
      `${a * c}/${b * d}.`, [[(a * d) / (b * c), "Eso es dividir (cruzaste los números). Para multiplicar: arriba por arriba y abajo por abajo."]]];
  }
  if (level === 2) {
    const [n, k] = [int(rng, 2, 6), int(rng, 2, 4)];
    return [`${n} ÷ ${frac(1, k)}`, n * k, `¿Cuántos trozos de ${frac(1, k)} caben en ${n} pizzas?`, `Cada pizza tiene ${k} trozos.`,
      `${n} · ${k} = ${n * k} trozos.`, [[n / k, `Eso es repartir ${n} en ${k}. Dividir por ${frac(1, k)} es contar cuántos trozos caben: ${n * k}.`]]];
  }
  const b = int(rng, 4, 8);
  const a = int(rng, 2, b - 1);
  return [`${frac(a, b)} ÷ ${frac(1, b)}`, a, `¿Cuántas veces cabe ${frac(1, b)} en ${frac(a, b)}?`, `${frac(a, b)} son ${a} trozos de ${frac(1, b)}.`,
    `Cabe ${a} veces.`, [[a / (b * b), "Multiplicaste. Dividir es contar cuántas veces cabe."]]];
}

function promedio(rng, level) {
  if (level === 0 || level === 3) {
    const n = level === 0 ? 3 : 4;
    const mean = int(rng, 3, 9);
    const data = Array.from({ length: n - 1 }, () => int(rng, Math.max(1, mean - 3), mean + 3));
    data.push(mean * n - data.reduce((a, b) => a + b, 0));
    if (data.at(-1) < 1) return promedio(rng, level);
    const sum = mean * n;
    return [`Promedio de ${data.join(", ")}`, mean, "Calcula el promedio.", `📊 Suma los ${n} datos y divide por ${n}.`,
      `${data.join(" + ")} = ${sum}; ${sum} ÷ ${n} = ${mean}.`,
      [[sum, `Esa es la suma. Falta repartirla en ${n}: ${mean}.`], ...(n === 4 ? [[sum / 3, "Son 4 datos: divide por 4, no por 3."]] : [])]];
  }
  if (level === 1) {
    const data = shuffle(rng, shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5));
    const median = [...data].sort((a, b) => a - b)[2];
    return [`Mediana de ${data.join(", ")}`, median, "Encuentra el dato del medio.", "Primero ordénalos de menor a mayor.",
      `Ordenados: ${[...data].sort((a, b) => a - b).join(", ")}. El del medio es ${median}.`,
      [[data[2], "Tomaste el del medio sin ordenar. Ordena primero."]]];
  }
  const [m, o] = shuffle(rng, [2, 3, 4, 5, 6, 7, 8]).slice(0, 2);
  // El sexto dato es distinto de los otros dos: una sola moda.
  const other = pick(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m && v !== o));
  const data = shuffle(rng, [m, m, m, o, o, other]);
  return [`Moda de ${data.join(", ")}`, m, "Encuentra el dato que más se repite.", "Cuenta cuántas veces aparece cada número.",
    `El ${m} aparece 3 veces: es la moda.`, [[o, `El ${o} aparece 2 veces; el ${m} aparece 3. La moda es ${m}.`]]];
}

function areaTriangulos(rng, level) {
  if (level === 0) {
    const [w, h] = [int(rng, 3, 9), int(rng, 2, 7)];
    return [`Rectángulo de ${w} cm por ${h} cm`, w * h, "Calcula el área en cm².", `🟦 Cuenta cuadraditos: ${w} por fila y ${h} filas.`,
      `${w} · ${h} = ${w * h} cm².`, [[2 * (w + h), "Ese es el perímetro. El área es base por altura."], [w + h, "Sumaste los lados. El área es base por altura."]]];
  }
  if (level === 2) {
    const [b, h] = [int(rng, 4, 12), int(rng, 2, 8)];
    return [`Paralelogramo: base ${b} cm, altura ${h} cm`, b * h, "Calcula el área en cm².", "Mueve el triángulo de un lado al otro: queda un rectángulo.",
      `${b} · ${h} = ${b * h} cm².`, [[(b * h) / 2, "Dividiste por 2, pero eso es para triángulos. El paralelogramo es base por altura."]]];
  }
  const b = 2 * int(rng, 2, 7);
  const h = int(rng, 3, 9);
  const unit = level === 3 ? "m" : "cm";
  return [`Triángulo: base ${b} ${unit}, altura ${h} ${unit}`, (b * h) / 2, `Calcula el área en ${unit}².`, "Es la mitad de un rectángulo: base por altura, dividido en 2.",
    `${b} · ${h} = ${b * h}; ${b * h} ÷ 2 = ${(b * h) / 2} ${unit}².`,
    [[b * h, "Ese es el rectángulo completo. El triángulo es la mitad."], [b + h, "Sumaste base y altura. Es base por altura, dividido en 2."]]];
}

function raices(rng, level) {
  if (level <= 1) {
    const n = level === 0 ? int(rng, 2, 9) : int(rng, 10, 15);
    return [`√${n * n}`, n, "Calcula la raíz cuadrada.", `🟦 ¿Qué número por sí mismo da ${n * n}?`,
      `${n} · ${n} = ${n * n}, así que √${n * n} = ${n}.`, [[(n * n) / 2, `Dividiste por 2. Busca un número que por sí mismo dé ${n * n}: ${n} · ${n}.`]]];
  }
  if (level === 2) {
    // √k está más cerca de n si k ≤ n² + n, y de n + 1 si no.
    const n = int(rng, 3, 11);
    const low = rng() < 0.5;
    const k = low ? n * n + int(rng, 1, n) : n * n + int(rng, n + 1, 2 * n);
    const near = low ? n : n + 1;
    return [`Entero más cercano a √${k}`, near, `√${k} no es exacta. ¿A qué número entero está más cerca?`,
      `${n} · ${n} = ${n * n} y ${n + 1} · ${n + 1} = ${(n + 1) ** 2}. ¿A cuál está más cerca el ${k}?`,
      `${k} está más cerca de ${near * near} = ${near} · ${near}. Por eso √${k} es casi ${near}.`,
      [[low ? n + 1 : n, `Compara las distancias: ${k} está más cerca de ${near * near}.`]]];
  }
  const n = int(rng, 4, 15);
  return [`Cuadrado de ${n * n} m²`, n, `Un patio cuadrado tiene ${n * n} m² de área. ¿Cuánto mide cada lado, en metros?`,
    `El área es lado · lado. ¿Qué número por sí mismo da ${n * n}?`, `${n} · ${n} = ${n * n}: cada lado mide ${n} m.`,
    [[(n * n) / 4, "Dividiste por 4, como si fuera el perímetro. El área es lado · lado."], [(n * n) / 2, "Dividiste por 2. Busca un número que por sí mismo dé el área."]]];
}

// Decimales con coma, como se escriben en Chile.
const dec = (n) => String(n).replace(".", ",");

function volumen(rng, level) {
  if (level === 0) {
    const [a, b, c] = [int(rng, 2, 6), int(rng, 2, 6), int(rng, 2, 5)];
    return [`Caja de ${a} cm, ${b} cm y ${c} cm`, a * b * c, "Calcula el volumen en cm³.",
      `🧊 Piso: ${a} · ${b} cubitos. Luego multiplica por las ${c} capas.`, `${a} · ${b} = ${a * b}; ${a * b} · ${c} = ${a * b * c} cm³.`,
      [[a + b + c, `Sumaste las medidas. Multiplica: ${a} · ${b} · ${c}.`]]];
  }
  if (level === 1) {
    const [base, h] = [int(rng, 6, 20), int(rng, 2, 9)];
    return [`Prisma: base de ${base} cm², altura ${h} cm`, base * h, "Calcula el volumen en cm³.", "Área de la base por la altura.",
      `${base} · ${h} = ${base * h} cm³.`, [[base + h, "Sumaste. Es área de la base por altura."]]];
  }
  if (level === 2) {
    const [b, h, l] = [2 * int(rng, 1, 4), int(rng, 2, 6), int(rng, 2, 10)];
    return [`Prisma triangular: triángulo de base ${b} cm y altura ${h} cm, largo ${l} cm`, (b * h * l) / 2, "Calcula el volumen en cm³.",
      `Primero el área del triángulo: ${b} · ${h} ÷ 2. Después por el largo.`, `${b} · ${h} ÷ 2 = ${(b * h) / 2} cm²; ${(b * h) / 2} · ${l} = ${(b * h * l) / 2} cm³.`,
      [[b * h * l, "Falta dividir por 2 el triángulo de la base."]]];
  }
  const [r, h] = [int(rng, 1, 4), int(rng, 2, 10)];
  const base = (314 * r * r) / 100;
  const v = Math.round(314 * r * r * h) / 100;
  return [`Cilindro: radio ${r} cm, altura ${h} cm`, v, "Un vaso tiene forma de cilindro. Calcula su volumen en cm³. Usa π = 3,14.",
    `Base: 3,14 · ${r} · ${r}. Después por la altura.`, `3,14 · ${r} · ${r} = ${dec(base)} cm²; ${dec(base)} · ${h} = ${dec(v)} cm³.`,
    [[Math.round(314 * r * h) / 100, "Usaste el radio una sola vez. La base es 3,14 · r · r."]]];
}

function combinatoria(rng, level) {
  if (level <= 1) {
    const [a, b] = level === 0 ? [int(rng, 2, 6), int(rng, 2, 5)] : [int(rng, 3, 8), int(rng, 2, 3)];
    if (level === 0)
      return [`${a} poleras y ${b} pantalones`, a * b, "¿Cuántas tenidas distintas puedes armar con una polera y un pantalón?",
        `👕 Cada polera puede ir con los ${b} pantalones.`, `${a} · ${b} = ${a * b} tenidas.`, [[a + b, `Sumaste. Cada polera va con cada pantalón: ${a} · ${b}.`]]];
    return [`${a} sabores y ${b} conos`, a * b, `En una heladería hay ${a} sabores y ${b} tipos de cono. Eliges un sabor y un cono. ¿Cuántos helados distintos hay?`,
      "Cada sabor puede ir en cada cono.", `${a} · ${b} = ${a * b} helados.`, [[a + b, `Sumaste. Cada sabor va en cada cono: ${a} · ${b}.`]]];
  }
  if (level === 2) {
    const [a, b, c] = [int(rng, 2, 4), int(rng, 2, 4), int(rng, 2, 3)];
    return [`${a} panes, ${b} rellenos y ${c} bebidas`, a * b * c, "Un combo tiene un pan, un relleno y una bebida. ¿Cuántos combos distintos hay?",
      "Multiplica las tres elecciones.", `${a} · ${b} · ${c} = ${a * b * c} combos.`,
      [[a + b + c, "Sumaste. Multiplica las tres elecciones."], [a * b, `Te faltó multiplicar por las ${c} bebidas.`]]];
  }
  const [k, n] = [int(rng, 2, 3), pick(rng, [4, 5, 6, 10])];
  const ruedas = n === 10 ? "del 0 al 9" : `del 1 al ${n}`;
  return [`Candado: ${k} ruedas con ${n} números`, n ** k, `Un candado tiene ${k} ruedas y cada una va ${ruedas}. ¿Cuántas claves distintas hay?`,
    `Cada rueda tiene ${n} opciones: ${Array(k).fill(n).join(" · ")}.`, `${Array(k).fill(n).join(" · ")} = ${n ** k} claves.`,
    [[k * n, `Cada rueda multiplica las opciones: ${Array(k).fill(n).join(" · ")}.`]]];
}

// Exponentes escritos arriba: 2⁻³.
const sup = (n) => String(n).replace("-", "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);

function potenciasNegativas(rng, level) {
  if (level === 0) {
    const a = int(rng, 2, 12);
    return [`${a}${sup(0)}`, 1, "Calcula la potencia.", "🔽 Un número elevado a 0 da 1.", `${a}¹ = ${a} y al bajar un paso se divide por ${a}: ${a}⁰ = 1.`,
      [[0, "Elevado a 0 no da 0: da 1."], [a, `Ese es ${a}¹. Baja un paso más y divide por ${a}: 1.`]]];
  }
  const [a, k] = level === 1 ? [int(rng, 2, 9), 1] : level === 2 ? [int(rng, 2, 5), 2] : [pick(rng, [2, 10]), int(rng, 2, 3)];
  const p = a ** k;
  return [`${a}${sup(-k)}`, 1 / p, "Calcula la potencia. Puedes responder como fracción, por ejemplo 1/3.",
    k === 1 ? `Sigue el patrón: ${a}¹ = ${a}, ${a}⁰ = 1, ${a}⁻¹ = 1 ÷ ${a}.` : `Da vuelta la potencia: ${a}${sup(-k)} = 1/${a}${sup(k)}.`,
    k === 1 ? `${a}⁻¹ = 1/${a}.` : `${a}${sup(k)} = ${p}, así que ${a}${sup(-k)} = 1/${p}.`,
    [[-p, "El exponente negativo no da un número negativo: da una fracción."], [-a * k, "No se multiplica la base por el exponente."]]];
}

// Miles con punto, como se escriben en Chile.
const pesos = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function sistemas(rng, level) {
  if (level <= 1) {
    const x = int(rng, 3, 12);
    const y = int(rng, 1, x - 1);
    const askY = level === 1;
    return [`x + y = ${x + y} ; x − y = ${x - y}`, askY ? y : x, `Encuentra ${askY ? "y" : "x"}.`,
      askY ? "Primero encuentra x sumando las ecuaciones. Después reemplaza." : "🧩 Suma las dos ecuaciones: la y desaparece.",
      `2x = ${x + y} + ${x - y} = ${2 * x}, así que x = ${x}; ${x} + y = ${x + y}, y = ${y}.`,
      [[askY ? x : y, `Ese es el valor de ${askY ? "x" : "y"}.`], ...(askY ? [] : [[2 * x, `Falta dividir por 2: x = ${x}.`]])]];
  }
  if (level === 2) {
    const [x, y] = [int(rng, 2, 9), int(rng, 1, 9)];
    return [`2x + y = ${2 * x + y} ; x + y = ${x + y}`, x, "Encuentra x.", "Resta las ecuaciones: la y desaparece.",
      `(2x + y) − (x + y) = ${2 * x + y} − ${x + y}, así que x = ${x}. Comprobación: y = ${y}.`, [[y, `Ese es y. Se pide x: x = ${x}.`]]];
  }
  const c = 500 * int(rng, 3, 6);
  const j = 500 * int(rng, 1, 3);
  return [`c + j = ${c + j} ; 2c + j = ${2 * c + j}`, c,
    `1 completo (c) y 1 jugo (j) cuestan $${pesos(c + j)}. 2 completos y 1 jugo cuestan $${pesos(2 * c + j)}. ¿Cuánto cuesta un completo?`,
    "Compara: la segunda compra tiene 1 completo más.", `(2c + j) − (c + j) = ${2 * c + j} − ${c + j}, así que c = ${c}. El completo cuesta $${pesos(c)}.`,
    [[j, "Ese es el precio del jugo. El completo es la diferencia."], [3 * c + 2 * j, "Sumaste las compras. Réstalas: la diferencia es 1 completo."]]];
}

// Lote 3: 6° Básico.

function razones(rng, level) {
  if (level <= 1) {
    const [a, b] = level === 0 ? pick(rng, [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5]]) : [int(rng, 2, 4), 1];
    const k = int(rng, 2, 5);
    if (level === 0)
      return [`Razón ${a} : ${b} con ${a * k} rojas`, b * k, `Por cada ${a} bolitas rojas hay ${b} azules. Si hay ${a * k} rojas, ¿cuántas azules hay?`,
        `⚖️ ¿Cuántas veces cabe ${a} en ${a * k}? Las azules aumentan las mismas veces.`, `${a * k} = ${a} · ${k}, así que las azules son ${b} · ${k} = ${b * k}.`,
        [[b + (a * k - a), `Sumaste lo mismo a cada lado. Las razones se multiplican: ${b} · ${k} = ${b * k}.`]]];
    return [`Razón ${a} : 1 con ${a * k} tazas`, k, `Una receta usa ${a} tazas de harina por cada 1 de leche. Con ${a * k} tazas de harina, ¿cuántas de leche?`,
      `¿Cuántas veces cabe ${a} en ${a * k}?`, `${a * k} = ${a} · ${k}, así que la leche es 1 · ${k} = ${k} tazas.`,
      [[a * k - a + 1, `Restaste lo mismo a cada lado. Se divide: ${a * k} ÷ ${a} = ${k}.`]]];
  }
  if (level === 2) {
    const [a, b] = pick(rng, [[3, 2], [2, 3], [4, 3], [3, 4], [5, 2], [5, 3]]);
    const k = int(rng, 2, 6);
    return [`${a * k} : ${b * k} = ${a} : ?`, b, `Simplifica la razón ${a * k} : ${b * k} a ${a} : ?`, "Divide los dos números por el mismo número.",
      `${a * k} ÷ ${k} = ${a} y ${b * k} ÷ ${k} = ${b}. La razón es ${a} : ${b}.`, [[b * k - (a * k - a), "Restaste lo mismo a cada lado. Se divide por el mismo número."]]];
  }
  const [n, price] = [pick(rng, [2, 3, 4]), pick(rng, [1000, 1200, 1500, 2000])];
  const k = int(rng, 2, 4);
  return [`${n} jugos cuestan $${pesos(price)}; ¿${n * k} jugos?`, price * k, `Por cada ${n} jugos pagas $${pesos(price)}. ¿Cuánto pagas por ${n * k} jugos?`,
    `${n * k} jugos son ${k} veces ${n} jugos.`, `${n * k} = ${n} · ${k}, así que pagas ${pesos(price)} · ${k} = $${pesos(price * k)}.`,
    [[price * n * k, `Multiplicaste por ${n * k}, pero el precio es por ${n} jugos: ${pesos(price)} · ${k}.`]]];
}

function fraccionesMixtos(rng, level) {
  const d = int(rng, 3, 6);
  const whole = int(rng, 1, 3);
  // Lo que sobra no se simplifica (sin 2/4): es más claro.
  const r = pick(rng, Array.from({ length: d - 1 }, (_, i) => i + 1).filter((v) => gcd(v, d) === 1));
  const top = whole * d + r;
  const enteros = whole === 1 ? "1 entero" : `${whole} enteros`;
  if (level === 0)
    return [`¿Cuántos enteros completos hay en ${frac(top, d)}?`, whole, "Responde cuántos enteros completos se arman.", `🍕 Con ${d} partes se arma 1 entero.`,
      `${top} ÷ ${d} = ${whole} y sobran ${r}: hay ${enteros} y ${frac(r, d)}.`, [[r, `Ese es lo que sobra. Los enteros son ${whole}.`]]];
  if (level === 1)
    return [`${frac(top, d)} = ${enteros} y ¿cuántos de 1/${d}?`, r, "Responde cuántas partes sobran.", `Cada entero usa ${d} partes. ¿Cuántas quedan?`,
      `${top} − ${whole * d} = ${r}: ${frac(top, d)} = ${whole} ${frac(r, d)}.`, [[top, `Ese es el total. Quita las ${whole * d} partes de los enteros: quedan ${r}.`]]];
  if (level === 2)
    return [`${whole} ${frac(r, d)} = ?/${d}`, top, `Escribe ${whole} ${frac(r, d)} como fracción impropia. ¿Cuántas partes de 1/${d} son?`, `Cada entero tiene ${d} partes.`,
      `${whole} · ${d} = ${whole * d}; ${whole * d} + ${r} = ${top}: ${frac(top, d)}.`,
      [[whole + r, `Sumaste ${whole} + ${r}. Cada entero tiene ${d} partes: ${whole} · ${d} + ${r}.`], [whole * d, `Te faltó sumar las ${r} partes que sobran.`]]];
  const n = 2 * int(rng, 2, 7) + 1;
  return [`${n} mitades de naranja`, n / 2, `Tienes ${n} mitades de naranja. ¿Cuántas naranjas son? Puedes responder con decimal o fracción.`, "Con 2 mitades se arma 1 naranja.",
    `${n} ÷ 2 = ${(n - 1) / 2} y sobra 1 mitad: ${dec(n / 2)} naranjas.`, [[(n - 1) / 2, "Te faltó la mitad que sobra."], [n, "Esas son las mitades. Con 2 se arma una naranja."]]];
}

function decimalesMult(rng, level) {
  if (level === 0) {
    const [a, b] = [int(rng, 2, 9), int(rng, 2, 9)];
    return [`0,${a} · ${b}`, (a * b) / 10, "Multiplica.", `🪙 Piensa en ${a} décimas, ${b} veces: ${a * b} décimas.`, `${a} · ${b} = ${a * b}; con un decimal: ${dec((a * b) / 10)}.`,
      [[a * b, `Falta la coma: 0,${a} tiene un decimal.`], [(a * b) / 100, "Pusiste dos decimales. 0," + a + " tiene solo uno."]]];
  }
  if (level === 1) {
    const x = int(rng, 11, 99);
    const k = pick(rng, [10, 100]);
    return [`${dec(x / 10)} · ${k}`, (x * k) / 10, "Multiplica.", `Por ${k}, la coma se corre ${k === 10 ? "un lugar" : "dos lugares"} a la derecha.`,
      `${dec(x / 10)} · ${k} = ${(x * k) / 10}.`, [[x / 10, "Por " + k + " el número crece: la coma se corre a la derecha."], [x / (k === 10 ? 100 : 1000), "La coma va a la derecha, no a la izquierda."]]];
  }
  if (level === 2) {
    const [q, k] = [int(rng, 11, 29), int(rng, 2, 5)];
    return [`${dec((q * k) / 10)} ÷ ${k}`, q / 10, "Divide.", `Reparte ${dec((q * k) / 10)} en ${k} partes iguales.`, `${q * k} ÷ ${k} = ${q}; con un decimal: ${dec(q / 10)}.`,
      [[q, "Falta la coma: el resultado tiene un decimal."]]];
  }
  const [x, k] = [pick(rng, [15, 25, 12, 35, 45]), int(rng, 2, 6)];
  return [`${k} · ${dec(x / 10)}`, (x * k) / 10, `Compras ${k} botellas de ${dec(x / 10)} litros. ¿Cuántos litros son en total?`, `Multiplica ${x} · ${k} y pon la coma.`,
    `${x} · ${k} = ${x * k}; con un decimal: ${dec((x * k) / 10)} litros.`, [[x * k, "Falta la coma: el resultado tiene un decimal."]]];
}

function patrones(rng, level) {
  if (level === 0) {
    const [a, d] = [int(rng, 1, 9), int(rng, 2, 9)];
    const seq = Array.from({ length: 4 }, (_, i) => a + i * d);
    return [`${seq.join(", ")}, ?`, a + 4 * d, "¿Qué número sigue?", "🔎 ¿Cuánto aumenta cada vez?", `Cada vez se suma ${d}: ${seq[3]} + ${d} = ${a + 4 * d}.`,
      [[seq[3] + 1, `El salto es ${d}, no 1.`]]];
  }
  if (level === 1) {
    const [m, b, x] = [int(rng, 2, 5), int(rng, 1, 9), int(rng, 3, 12)];
    return [`Regla: · ${m} + ${b} con entrada ${x}`, m * x + b, `La regla es «multiplica por ${m} y suma ${b}». Si la entrada es ${x}, ¿cuál es la salida?`,
      `Primero ${x} · ${m}, después suma ${b}.`, `${x} · ${m} = ${m * x}; ${m * x} + ${b} = ${m * x + b}.`,
      [[m * x, `Te faltó sumar ${b}.`], [m * (x + b), `Primero se multiplica y después se suma ${b}.`]]];
  }
  if (level === 2) {
    const [m, b] = [int(rng, 2, 5), int(rng, 1, 5)];
    const x = int(rng, 8, 12);
    const row = (k) => `${k} → ${m * k + b}`;
    return [`Tabla ${row(1)}, ${row(2)}, ${row(3)}; ¿${x} → ?`, m * x + b,
      `La tabla tiene entrada y salida: ${row(1)}, ${row(2)}, ${row(3)}. ¿Qué salida tiene la entrada ${x}?`,
      `La salida sube ${m} cada vez: es ${m} · entrada + ${b}.`, `${m} · ${x} + ${b} = ${m * x + b}.`,
      [[m * 3 + b + m, `Sumaste ${m} una sola vez. La regla es ${m} · entrada + ${b}.`], [(m + b) * x, `La regla es ${m} · entrada + ${b}.`]]];
  }
  const n = int(rng, 4, 9);
  return [`Mesas: 1 → 4, 2 → 6, 3 → 8; ¿${n} → ?`, 2 * n + 2, `1 mesa tiene 4 sillas, 2 mesas juntas 6, 3 mesas 8. ¿Cuántas sillas tienen ${n} mesas juntas?`,
    "Cada mesa nueva suma 2 sillas.", `Cada mesa suma 2: ${n} mesas tienen 2 · ${n} + 2 = ${2 * n + 2} sillas.`,
    [[4 * n, "No son 4 sillas por mesa: al juntarlas, cada mesa nueva suma solo 2."]]];
}

function expresiones(rng, level) {
  if (level <= 1) {
    const n = int(rng, 2, 9);
    if (level === 0) {
      const [m, b] = [int(rng, 2, 5), int(rng, 1, 9)];
      return [`Si n = ${n}: ${m}n + ${b}`, m * n + b, `Reemplaza n por ${n} y calcula.`, `🔤 ${m}n es ${m} · n: ${m} · ${n}.`, `${m} · ${n} + ${b} = ${m * n} + ${b} = ${m * n + b}.`,
        [[Number(`${m}${n}`) + b, `${m}n no es «${m} y ${n} pegados». Es ${m} · ${n}.`], [m + n + b, `${m}n es ${m} por n, no ${m} más n.`]]];
    }
    const b = int(rng, 2, 9);
    return [`Si n = ${n}: n + ${b}`, n + b, `Juan tiene n láminas y Ana tiene n + ${b}. Si Juan tiene ${n}, ¿cuántas tiene Ana?`, `Reemplaza n por ${n}.`, `${n} + ${b} = ${n + b} láminas.`,
      [[n * b, `n + ${b} es sumar, no multiplicar.`]]];
  }
  const n = int(rng, 2, 12);
  if (level === 2) {
    const b = int(rng, 3, 12);
    return [`n + ${b} = ${n + b}`, n, `Un número más ${b} es ${n + b}. ¿Cuál es el número?`, `⚖️ Quita ${b} de los dos lados.`, `${n + b} − ${b} = ${n}. Comprobación: ${n} + ${b} = ${n + b}.`,
      [[n + 2 * b, `Sumaste ${b}. Para deshacer «+ ${b}», resta ${b}.`]]];
  }
  const b = int(rng, 1, 9);
  return [`2n + ${b} = ${2 * n + b}`, n, `El doble de un número, más ${b}, es ${2 * n + b}. ¿Cuál es el número?`, `Primero quita ${b}; después divide por 2.`,
    `${2 * n + b} − ${b} = ${2 * n}; ${2 * n} ÷ 2 = ${n}. Comprobación: 2 · ${n} + ${b} = ${2 * n + b}.`,
    [[2 * n, "Ese es el doble. Divide por 2."], [(2 * n + b) / 2 - b, `Primero quita el ${b} y después divide por 2.`]]];
}

function angulos(rng, level) {
  if (level === 0) {
    const a = 5 * int(rng, 5, 30);
    return [`Opuesto a ${a}°`, a, `Dos rectas se cruzan. Un ángulo mide ${a}°. ¿Cuánto mide el ángulo opuesto por el vértice?`, "📐 Los ángulos opuestos son iguales.",
      `Opuestos por el vértice: los dos miden ${a}°.`, [[180 - a, "Ese es el ángulo de al lado (suman 180°). El opuesto es igual."]]];
  }
  if (level === 1) {
    const a = 5 * int(rng, 4, 32);
    return [`${a}° + ? = 180°`, 180 - a, `Dos ángulos juntos forman una recta. Uno mide ${a}°. ¿Cuánto mide el otro?`, "Una recta mide 180°.", `180 − ${a} = ${180 - a}°.`,
      [[180 + a, "Sumaste. Juntos suman 180°."], [90 - a, "Usaste 90°. Una recta mide 180°."]]];
  }
  if (level === 2) {
    const a = 5 * int(rng, 6, 16);
    const b = 5 * int(rng, 6, 34 - a / 5);
    return [`Triángulo: ${a}°, ${b}° y ?`, 180 - a - b, `Un triángulo tiene ángulos de ${a}° y ${b}°. ¿Cuánto mide el tercero?`, "Los tres ángulos suman 180°.",
      `${a} + ${b} = ${a + b}; 180 − ${a + b} = ${180 - a - b}°.`, [[360 - a - b, "Usaste 360°, que es para cuadriláteros. En un triángulo suman 180°."], [a + b, "Esa es la suma de los dos. Resta de 180."]]];
  }
  const [a, b, c] = [5 * int(rng, 14, 22), 5 * int(rng, 14, 22), 5 * int(rng, 14, 22)];
  return [`Cuadrilátero: ${a}°, ${b}°, ${c}° y ?`, 360 - a - b - c, `Un cuadrilátero tiene ángulos de ${a}°, ${b}° y ${c}°. ¿Cuánto mide el cuarto?`,
    "Los cuatro ángulos suman 360°.", `${a} + ${b} + ${c} = ${a + b + c}; 360 − ${a + b + c} = ${360 - a - b - c}°.`,
    [[180 - a - b - c, "Usaste 180°, pero los cuadriláteros suman 360°."]]];
}

function areaSuperficie(rng, level) {
  if (level % 2 === 0) {
    const a = level === 0 ? int(rng, 2, 6) : int(rng, 5, 10);
    return [`Cubo de arista ${a} cm`, 6 * a * a, "Calcula el área de la superficie en cm².", `📦 6 caras iguales, cada una de ${a} · ${a}.`,
      `${a} · ${a} = ${a * a} cm²; 6 · ${a * a} = ${6 * a * a} cm².`, [[a ** 3, "Ese es el volumen. Para envolver, suma las 6 caras."], [a * a, "Esa es una sola cara. Son 6."]]];
  }
  const [x, y, z] = level === 1 ? [int(rng, 3, 6), int(rng, 2, 5), int(rng, 1, 4)] : [int(rng, 6, 12), int(rng, 3, 6), int(rng, 2, 5)];
  const half = x * y + x * z + y * z;
  return [`Caja de ${x} cm, ${y} cm y ${z} cm`, 2 * half,
    level === 1 ? "Calcula el área de la superficie en cm²." : `Quieres envolver un regalo en una caja de ${x} cm, ${y} cm y ${z} cm. ¿Cuántos cm² de papel necesitas como mínimo?`,
    `Tres pares de caras: ${x} · ${y}, ${x} · ${z} y ${y} · ${z}. Cada una va dos veces.`,
    `${x * y} + ${x * z} + ${y * z} = ${half}; ${half} · 2 = ${2 * half} cm².`, [[x * y * z, "Ese es el volumen. Para envolver, suma las 6 caras."], [half, "Contaste 3 caras. Cada una tiene su pareja."]]];
}

function graficos(rng, level) {
  if (level <= 1) {
    const [name, parts] = level === 0 ? ["la mitad", 2] : pick(rng, [["un cuarto", 4], ["un tercio", 3], ["un quinto", 5]]);
    const total = parts * int(rng, 4, 20);
    return [`${name[0].toUpperCase() + name.slice(1)} de ${total}`, total / parts, `En un gráfico circular de ${total} estudiantes, ${name} del círculo eligió fútbol. ¿Cuántos eligieron fútbol?`,
      `🥧 ${name[0].toUpperCase() + name.slice(1)} del círculo es dividir el total en ${parts}.`, `${total} ÷ ${parts} = ${total / parts} estudiantes.`,
      [[total, "Ese es el total. Divide en partes iguales."], ...(parts !== 2 ? [[total / 2, "Esa es la mitad."]] : [])]];
  }
  if (level === 2) {
    const b = int(rng, 4, 15);
    const a = b + int(rng, 1, 9);
    return [`Barras: ${a} y ${b}`, a - b, `En un gráfico de barras dobles, el 6°A tiene ${a} votos por fútbol y el 6°B tiene ${b}. ¿Cuántos votos más tiene el 6°A?`,
      "Resta las dos barras.", `${a} − ${b} = ${a - b} votos más.`, [[a + b, "Sumaste. «Cuántos más» es la diferencia."]]];
  }
  const values = shuffle(rng, [3, 5, 6, 8, 9, 11, 12, 14, 15, 17]).slice(0, 4);
  const max = Math.max(...values);
  const fruits = ["manzana", "plátano", "pera", "naranja"];
  return [`Barras: ${values.slice(0, 3).join(", ")} y ${values[3]}`, max,
    `Un gráfico de barras muestra las frutas favoritas: ${fruits.map((f, i) => `${f} ${values[i]}`).join(", ")}. ¿Cuántos votos tiene la barra más alta?`,
    "La barra más alta es el número mayor.", `La barra más alta tiene ${max} votos.`, [[Math.min(...values), "Esa es la barra más baja."]]];
}

// Lote 4: 7° Básico.

function potencias10(rng, level) {
  const k = int(rng, 2, 7);
  const zeros = "1" + "0".repeat(k);
  if (level === 0)
    return [`10${sup(k)}`, 10 ** k, "Calcula la potencia.", `🔟 El ${k} dice cuántos ceros van después del 1.`, `10${sup(k)} = ${pesos(10 ** k)} (${k} ceros).`,
      [[10 * k, `No es 10 · ${k}. Es un 1 con ${k} ceros.`], [10 + k, "No se suma. Es un 1 con ceros."]]];
  if (level === 1) {
    const a = int(rng, 2, 9);
    const j = int(rng, 2, 5);
    return [`${a} · 10${sup(j)}`, a * 10 ** j, "Calcula.", `Primero 10${sup(j)} = ${pesos(10 ** j)}. Después por ${a}.`, `${a} · ${pesos(10 ** j)} = ${pesos(a * 10 ** j)}.`,
      [[a * 10 * j, `10${sup(j)} no es ${10 * j}. Es ${pesos(10 ** j)}.`]]];
  }
  if (level === 2)
    return [`${pesos(Number(zeros))} = 10^?`, k, `¿A qué número hay que elevar 10 para obtener ${pesos(Number(zeros))}?`, "Cuenta los ceros.", `${pesos(Number(zeros))} tiene ${k} ceros: 10${sup(k)}.`,
      [[k + 1, "Contaste también el 1. Solo se cuentan los ceros."]]];
  const a = int(rng, 2, 9);
  const j = int(rng, 4, 8);
  return [`${pesos(a * 10 ** j)} = ${a} · 10^?`, j, `Escribe ${pesos(a * 10 ** j)} como ${a} · 10^?. ¿Cuál es el exponente?`, `${pesos(a * 10 ** j)} es ${a} por ${pesos(10 ** j)}.`,
    `${pesos(10 ** j)} = 10${sup(j)}, así que ${pesos(a * 10 ** j)} = ${a} · 10${sup(j)}.`, [[a, `El ${a} va adelante; el exponente cuenta los ceros.`], [j + 1, "Solo se cuentan los ceros."]]];
}

function inecuaciones(rng, level) {
  if (level === 0) {
    const [b, x] = [int(rng, 2, 9), int(rng, 1, 12)];
    return [`x + ${b} > ${x + b}`, x + 1, "¿Cuál es el menor número entero que cumple la inecuación?", `⚖️ Resta ${b} en los dos lados: x > ${x}.`,
      `x > ${x}. El ${x} no sirve (${x} + ${b} = ${x + b}, no es mayor). El menor entero es ${x + 1}.`, [[x, `${x} + ${b} = ${x + b}, que no es mayor que ${x + b}.`]]];
  }
  if (level === 1) {
    const [a, x] = [int(rng, 2, 6), int(rng, 2, 10)];
    return [`${a}x < ${a * x}`, x - 1, "¿Cuál es el mayor número entero que cumple la inecuación?", `Divide los dos lados por ${a}: x < ${x}.`,
      `x < ${x}. El ${x} no sirve (${a} · ${x} = ${a * x}, no es menor). El mayor entero es ${x - 1}.`, [[x, `${a} · ${x} = ${a * x}, que no es menor que ${a * x}.`]]];
  }
  if (level === 2) {
    const [b, x] = [int(rng, 2, 9), int(rng, 3, 15)];
    return [`x − ${b} ≥ ${x - b}`, x, "¿Cuál es el menor número entero que cumple la inecuación? (≥ es «mayor o igual»)", `Suma ${b} en los dos lados.`,
      `x ≥ ${x}. Como vale el igual, el ${x} sirve.`, [[x + 1, "≥ incluye el igual: el borde sirve."], [x - 2 * b, `Para deshacer «− ${b}» se suma ${b}.`]]];
  }
  const [price, n] = [pick(rng, [300, 400, 500, 600, 800]), int(rng, 3, 9)];
  const money = price * n + int(rng, 0, price / 100 - 1) * 100;
  return [`${price}x ≤ ${money}`, n, `Cada helado cuesta $${pesos(price)} y tienes $${pesos(money)}. ¿Cuántos helados puedes comprar como máximo?`, `Divide los dos lados por ${price}.`,
    `x ≤ ${pesos(money)} ÷ ${price}. Puedes comprar hasta ${n} helados.`, [[money - price, `Restaste. Divide por ${price}.`], [n + 1, `${n + 1} helados costarían $${pesos(price * (n + 1))}: no alcanza.`]]];
}

const POLY = { 5: "pentágono", 6: "hexágono", 8: "octágono", 10: "decágono", 12: "dodecágono" };

function angulosPoligonos(rng, level) {
  const n = pick(rng, level === 0 ? [5, 6] : [5, 6, 8, 10, 12]);
  const sum = (n - 2) * 180;
  if (level <= 1)
    return [`Suma de ángulos de un ${POLY[n]}`, sum, `¿Cuánto suman los ángulos interiores de un ${POLY[n]} (${n} lados)?`, `🔺 Desde una esquina se forman ${n} − 2 = ${n - 2} triángulos.`,
      `${n - 2} · 180 = ${pesos(sum)}°.`, [[n * 180, `Usaste ${n} triángulos. Son ${n} − 2 = ${n - 2}.`], [360, "Eso suman los cuadriláteros."]]];
  if (level === 2)
    return [`Ángulo de un ${POLY[n]} regular`, sum / n, `Un ${POLY[n]} regular tiene ${n} ángulos iguales. ¿Cuánto mide cada uno?`, `Primero la suma (${pesos(sum)}°), después reparte en ${n}.`,
      `${pesos(sum)} ÷ ${n} = ${sum / n}°.`, [[sum, `Esa es la suma de los ${n}. Reparte en ${n}.`], [360 / n, `Ese es el ángulo exterior (360 ÷ ${n}).`]]];
  return [`Ángulo exterior de un ${POLY[n]} regular`, 360 / n, `¿Cuánto mide cada ángulo exterior de un ${POLY[n]} regular (${n} lados)?`, "Los exteriores de cualquier polígono suman 360°.",
    `360 ÷ ${n} = ${360 / n}°.`, [[sum / n, `Ese es el interior. El exterior es 360 ÷ ${n}.`]]];
}

function areaTrapecio(rng, level) {
  const unit = level >= 2 ? "m" : "cm";
  let b = int(rng, 2, 9);
  const B = b + int(rng, 2, 8);
  const h = int(rng, 2, 9);
  if (((B + b) * h) % 2) b += 1;
  if (b >= B) return areaTrapecio(rng, level);
  const area = ((B + b) * h) / 2;
  return [`Trapecio: bases ${B} ${unit} y ${b} ${unit}, altura ${h} ${unit}`, area,
    level === 3 ? `Un jardín tiene forma de trapecio con bases de ${B} m y ${b} m, y ${h} m de altura. ¿Cuántos m² tiene?` : `Calcula el área en ${unit}².`,
    "🔁 Suma las bases, multiplica por la altura y divide por 2.", `(${B} + ${b}) · ${h} ÷ 2 = ${(B + b) * h} ÷ 2 = ${area} ${unit}².`,
    [[(B + b) * h, "Falta dividir por 2: dos trapecios forman el paralelogramo."], [B * b * h, "Primero suma las bases."]]];
}

function planoCartesiano(rng, level) {
  const [x, y] = [int(rng, 1, 9), int(rng, 1, 9)];
  if (level === 0) {
    const askX = rng() < 0.5;
    return [`Punto (${x}, ${y}): ¿${askX ? "x" : "y"}?`, askX ? x : y, `En el punto (${x}, ${y}), ¿cuánto se ${askX ? "camina a la derecha" : "sube"}?`,
      "📍 El primer número es lo que caminas; el segundo, lo que subes.", `En (${x}, ${y}) se caminan ${x} a la derecha y se suben ${y}.`,
      [[askX ? y : x, "Ese es el otro número. Primero se camina, después se sube."]]];
  }
  const [a, b] = level === 1 ? [int(rng, 1, 6), int(rng, 1, 6)] : [nonZero(rng, -5, 5), nonZero(rng, -5, 5)];
  if (level <= 2) {
    const askX = level === 1 || rng() < 0.5;
    const v = askX ? x + a : y + b;
    return [`(${x}, ${y}) + vector (${num(a)}, ${num(b)}): ¿${askX ? "x" : "y"}?`, v,
      `Mueves el punto (${x}, ${y}) con el vector (${num(a)}, ${num(b)}). ¿Cuál es la nueva coordenada ${askX ? "x" : "y"}?`,
      askX ? `Suma el primer número del vector a la x: ${x} + ${paren(a)}.` : `Suma el segundo número del vector a la y: ${y} + ${paren(b)}.`,
      `El punto llega a (${num(x + a)}, ${num(y + b)}).`, [[askX ? y + b : x + a, "Esa es la otra coordenada."], [askX ? x - a : y - b, "Se suma el vector, no se resta."]]];
  }
  const x2 = x + int(rng, 2, 8);
  return [`De (${x}, ${y}) a (${x2}, ${y})`, x2 - x, `En un mapa, la casa está en (${x}, ${y}) y el colegio en (${x2}, ${y}). ¿Cuántas cuadras hay de una a otra?`,
    "Están a la misma altura: compara las x.", `${x2} − ${x} = ${x2 - x} cuadras.`, [[x2 + x, "Sumaste. La distancia es la diferencia."]]];
}

function frecuencias(rng, level) {
  if (level === 2) {
    const f = [int(rng, 2, 9), int(rng, 2, 12), int(rng, 2, 15)];
    return [`Frecuencias ${f[0]}, ${f[1]}, ${f[2]}: total`, f[0] + f[1] + f[2], `En una tabla, las frecuencias son ${f[0]} (a pie), ${f[1]} (auto) y ${f[2]} (bus). ¿Cuántos estudiantes hay en total?`,
      "Suma todas las frecuencias.", `${f.join(" + ")} = ${f[0] + f[1] + f[2]}.`, [[Math.max(...f), "Esa es la mayor. El total es la suma."]]];
  }
  // Totales que dividen a 100: el porcentaje es entero.
  const total = pick(rng, [10, 20, 25, 50]);
  const part = int(rng, 1, total - 1);
  const pct = (part * 100) / total;
  if (level === 0)
    return [`Bus: ${part} de ${total}`, part / total, `De ${total} estudiantes, ${part} llegan en bus. ¿Cuál es la frecuencia relativa? Responde como decimal o fracción.`,
      "📋 Divide las veces por el total.", `${part} ÷ ${total} = ${dec(part / total)}.`, [[part, "Esa es la frecuencia absoluta."], [total / part, "Dividiste al revés."]]];
  return [`${level === 1 ? "Bus" : "Auto"}: ${part} de ${total}, en %`, pct, `De ${total} personas, ${part} viajan en ${level === 1 ? "bus" : "auto"}. ¿Qué porcentaje es?`,
    `${part} ÷ ${total} y después · 100.`, `${part} ÷ ${total} = ${dec(part / total)} = ${dec(pct)} %.`, [[part, "Ese es el número de personas."]]];
}

function probabilidadTeorica(rng, level) {
  if (level === 0) {
    const face = int(rng, 1, 6);
    return [`Dado: sacar ${face}`, 1 / 6, `Lanzas un dado. ¿Cuál es la probabilidad de sacar un ${face}? Responde como fracción.`, "🎲 Casos favorables: 1. Casos posibles: 6.",
      "1 caso favorable de 6: 1/6.", [[face, "La probabilidad es una fracción: casos favorables ÷ posibles."]]];
  }
  if (level === 1) {
    const [name, cases] = pick(rng, [["un número par", [2, 4, 6]], ["un número impar", [1, 3, 5]], ["un número mayor que 4", [5, 6]], ["un número menor que 3", [1, 2]], ["un múltiplo de 3", [3, 6]]]);
    return [`Dado: sacar ${name}`, cases.length / 6, `Lanzas un dado. ¿Cuál es la probabilidad de sacar ${name}?`, `Casos favorables: ${cases.join(", ")}.`,
      `${cases.length} casos de 6: ${cases.length}/6.`, [[cases.length, "Esos son los casos favorables. Divide por 6."]]];
  }
  const [a, b] = [int(rng, 1, 7), int(rng, 1, 7)];
  return [`Bolsa: ${a} rojas y ${b} azules`, a / (a + b), `Una bolsa tiene ${a} bolitas rojas y ${b} azules. ¿Cuál es la probabilidad de sacar una roja?`,
    "Casos posibles: todas las bolitas.", `${a} rojas de ${a + b} bolitas: ${a}/${a + b}.`, [[a / b, "Dividiste rojas por azules. Se divide por el total."]]];
}

function muestreo(rng, level) {
  if (level === 1) {
    const p = 5 * int(rng, 2, 18);
    return [`Muestra: ${p} de 100`, p, `En una muestra de 100 personas, ${p} prefieren el té. ¿Qué porcentaje prefiere té?`, "De 100, el número ya es el porcentaje.",
      `${p} de 100 = ${p} %.`, [[p / 100, `Eso es la fracción; en porcentaje es ${p}.`]]];
  }
  if (level === 2) {
    const p = 10 * int(rng, 1, 9);
    const N = 1000 * int(rng, 1, 5);
    return [`Muestra: ${p} % de ${N}`, (p * N) / 100, `Si el ${p} % de una muestra prefiere té, ¿cuántos de ${pesos(N)} personas lo preferirían aproximadamente?`, `${p} % es ${p} de cada 100.`,
      `${pesos(N)} · ${dec(p / 100)} = ${pesos((p * N) / 100)}.`, [[(p * N) / 1000, `Eso sería el ${dec(p / 10)} %.`]]];
  }
  const k = pick(rng, [2, 4, 5, 10]);
  const n = k * int(rng, 4, 10);
  const yes = n / k;
  const N = n * int(rng, 2, 12);
  return [`Muestra: ${yes} de ${n}; colegio de ${N}`, N / k,
    `En una muestra de ${n} estudiantes, ${yes} usan lentes. Si el colegio tiene ${N} estudiantes, ¿cuántos usarían lentes aproximadamente?`,
    `🥄 ${yes} de ${n} es 1 de cada ${k}.`, `${yes} ÷ ${n} = 1/${k}; ${N} ÷ ${k} = ${N / k}.`, [[N - n + yes, `Sumaste o restaste. Usa la proporción: 1 de cada ${k}.`]]];
}

function proporcionInversa(rng, level) {
  const contexts = [
    (a, t, b) => [`${a} pintores, ${t} días; ${b} pintores`, `${a} pintores tardan ${t} días en pintar una casa. ¿Cuántos días tardan ${b} pintores?`, "días"],
    (a, t, b) => [`${a} amigos, ${t} trozos; ${b} amigos`, `${a} amigos se reparten una pizza y cada uno recibe ${t} trozos. Si fueran ${b} amigos, ¿cuántos trozos recibiría cada uno?`, "trozos"],
    (a, t, b) => [`${a} llaves, ${t} horas; ${b} llaves`, `${a} llaves llenan un estanque en ${t} horas. ¿Cuántas horas tardan ${b} llaves?`, "horas"],
  ];
  // La pizza tiene 12 trozos; lo demás, un total múltiplo de las dos cantidades.
  const [a, b] = level === 1 ? shuffle(rng, [2, 3, 4, 6]).slice(0, 2) : (() => {
    const first = int(rng, 2, 6);
    return [first, level === 0 ? 2 * first : pick(rng, [2, 3, 4, 6, 8, 12].filter((v) => v !== first))];
  })();
  const total = level === 1 ? 12 : a * b * int(rng, 1, 3);
  const t = total / a;
  const [expr, prompt, unit] = contexts[level % 3](a, t, b);
  return [expr, total / b, prompt, `🔄 El total se mantiene: ${a} · ${t} = ${total}.`, `${a} · ${t} = ${total}; ${total} ÷ ${b} = ${total / b} ${unit}.`,
    [[(t * b) / a, "Con más, se tarda menos (y con menos, más). El producto se mantiene."], [t + b - a, "No se suma ni se resta: el producto se mantiene."]]];
}

export const generators = {
  equations,
  enteros,
  semejantes,
  proporciones,
  signs,
  both,
  combinadas,
  racionales,
  potencias,
  funcion,
  notables,
  porcentajes,
  pitagoras,
  "jerarquia-mult": jerarquiaMult,
  "jerarquia-parentesis": jerarquiaParentesis,
  "jerarquia-enteros": jerarquiaEnteros,
  "jerarquia-potencias": jerarquiaPotencias,
  "base-valor-posicional": baseValorPosicional,
  "base-suma-resta": baseSumaResta,
  "base-multiplicar": baseMultiplicar,
  "base-dividir": baseDividir,
  "base-fracciones": baseFracciones,
  "base-decimales": baseDecimales,
  "multiplos-divisores": multiplosDivisores,
  "fracciones-suma": fraccionesSuma,
  "fracciones-mult": fraccionesMult,
  promedio,
  "area-triangulos": areaTriangulos,
  raices,
  volumen,
  combinatoria,
  "potencias-negativas": potenciasNegativas,
  sistemas,
  razones,
  "fracciones-mixtos": fraccionesMixtos,
  "decimales-mult": decimalesMult,
  patrones,
  expresiones,
  angulos,
  "area-superficie": areaSuperficie,
  graficos,
  "potencias-10": potencias10,
  inecuaciones,
  "angulos-poligonos": angulosPoligonos,
  "area-trapecio": areaTrapecio,
  "plano-cartesiano": planoCartesiano,
  frecuencias,
  "probabilidad-teorica": probabilidadTeorica,
  muestreo,
  "proporcion-inversa": proporcionInversa,
};

export const hasGenerator = (lessonId) => Object.hasOwn(generators, lessonId);

// Quita errores que coinciden con la respuesta o se repiten.
function tidy(q) {
  const seen = new Set([q[1]]);
  const mistakes = (q[5] ?? []).filter(([v]) => !seen.has(v) && seen.add(v));
  return mistakes.length ? [...q.slice(0, 5), mistakes] : q.slice(0, 5);
}

export function generateQuestions(lessonId, levels, rng = Math.random) {
  const gen = generators[lessonId];
  return gen ? levels.map((level) => tidy(gen(rng, level))) : null;
}
