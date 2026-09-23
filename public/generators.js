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
    ];
  if (level === 1)
    return [
      `En (x − ${a})^2, ¿cuál es el término libre?`,
      a * a,
      "Calcula el término que no tiene x.",
      `El último término es el cuadrado de ${a}, siempre positivo.`,
      `(x − ${a})² = x² − ${2 * a}x + ${a * a}; el término libre es ${a * a}.`,
    ];
  if (level === 2)
    return [
      `En (x + ${a})(x − ${a}), ¿cuál es el término libre?`,
      -a * a,
      "Suma por su diferencia: calcula el término sin x.",
      "(x + a)(x − a) = x² − a².",
      `(x + ${a})(x − ${a}) = x² − ${a * a}; el término libre es −${a * a}.`,
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
    ];
  return [
    `Hipotenusa ${c * k} y un cateto ${a * k}`,
    b * k,
    "Calcula el otro cateto.",
    "Despeja: b² = c² − a².",
    `${(c * k) ** 2} − ${(a * k) ** 2} = ${(b * k) ** 2}; b = ${b * k}.`,
  ];
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
};

export const hasGenerator = (lessonId) => Object.hasOwn(generators, lessonId);

export function generateQuestions(lessonId, levels, rng = Math.random) {
  const gen = generators[lessonId];
  return gen ? levels.map((level) => gen(rng, level)) : null;
}
