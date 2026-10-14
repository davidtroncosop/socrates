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
