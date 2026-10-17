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

// Lote 5: 8° Básico.

function enterosMult(rng, level) {
  const [a, b] = [int(rng, 2, 9), int(rng, 2, 9)];
  const sign = (n) => (n < 0 ? "negativo" : "positivo");
  if (level === 0 || level === 1) {
    const [x, y] = level === 0 ? (rng() < 0.5 ? [-a, b] : [a, -b]) : [-a, -b];
    return [`${paren(x)} · ${paren(y)}`, x * y, "Multiplica.", level === 0 ? "➖➕ Signos distintos: el resultado es negativo." : "Signos iguales: el resultado es positivo.",
      `${a} · ${b} = ${a * b}; signos ${level === 0 ? "distintos" : "iguales"}: ${num(x * y)}.`, [[-x * y, `El resultado es ${sign(x * y)}.`], [x + y, "Sumaste. Es multiplicar."]]];
  }
  if (level === 2) {
    const [x, y] = rng() < 0.5 ? [-a * b, b] : [-a * b, -b];
    return [`${paren(x)} ÷ ${paren(y)}`, x / y, "Divide.", y < 0 ? "Signos iguales: positivo." : "Signos distintos: negativo.",
      `${a * b} ÷ ${b} = ${a}; signos ${y < 0 ? "iguales" : "distintos"}: ${num(x / y)}.`, [[-x / y, `El resultado es ${sign(x / y)}.`]]];
  }
  const c = int(rng, 2, 5);
  const negs = int(rng, 1, 3);
  const f = [a, b, c].map((v, i) => (i < negs ? -v : v));
  const r = f[0] * f[1] * f[2];
  return [f.map(paren).join(" · "), r, "Multiplica los tres.", `Ve de a dos: primero ${paren(f[0])} · ${paren(f[1])}.`,
    `${paren(f[0])} · ${paren(f[1])} = ${num(f[0] * f[1])}; ${num(f[0] * f[1])} · ${paren(f[2])} = ${num(r)}.`,
    [[-r, `Cuenta los signos menos: ${negs}. ${negs % 2 ? "Uno queda sin pareja: negativo." : "Se cancelan de a dos: positivo."}`]]];
}

function racionalesMult(rng, level) {
  if (level === 0 || level === 2) {
    const [b, d] = [int(rng, 2, 5), int(rng, 2, 6)];
    const [a, c] = [int(rng, 1, b - 1), int(rng, 1, d - 1)];
    const s1 = -1;
    const s2 = level === 2 ? -1 : 1;
    const r = (s1 * s2 * a * c) / (b * d);
    const f2 = `${s2 < 0 ? "(−" : ""}${frac(c, d)}${s2 < 0 ? ")" : ""}`;
    return [`−${frac(a, b)} · ${f2}`, r, "Multiplica. Responde como fracción.", `Arriba por arriba, abajo por abajo, y signos ${s2 < 0 ? "iguales" : "distintos"}.`,
      `${a} · ${c} = ${a * c}, ${b} · ${d} = ${b * d}; signos ${s2 < 0 ? "iguales" : "distintos"}: ${r < 0 ? "−" : ""}${a * c}/${b * d}.`,
      [[-r, `El resultado es ${r < 0 ? "negativo" : "positivo"}.`]]];
  }
  if (level === 1) {
    const k = 2 * int(rng, 1, 9);
    return [`−0,5 · (−${k})`, k / 2, "Multiplica.", "0,5 es la mitad. Y menos por menos…", `La mitad de ${k} es ${k / 2}; signos iguales: +${k / 2}.`, [[-k / 2, "Menos por menos da más."]]];
  }
  const [step, hours] = [pick(rng, [0.5, 1.5, 2.5, 3.5]), int(rng, 2, 6)];
  return [`−${dec(step)} · ${hours}`, -step * hours, `La temperatura baja ${dec(step)} °C cada hora. ¿Cuánto cambia en ${hours} horas?`, `Baja: es un número negativo, −${dec(step)}.`,
    `−${dec(step)} · ${hours} = ${num(-step * hours).replace(".", ",")} °C.`, [[step * hours, "La temperatura baja: el cambio es negativo."]]];
}

function variacionPorcentual(rng, level) {
  const price = 1000 * int(rng, 2, 20);
  const p = pick(rng, [10, 20, 25, 30, 40, 50]);
  const delta = (price * p) / 100;
  if (level === 0)
    return [`$${pesos(price)} con ${p} % de descuento`, price - delta, "¿Cuánto pagas?", `🏷️ El ${p} % de ${pesos(price)} es ${pesos(delta)}. Réstalo.`,
      `${pesos(price)} − ${pesos(delta)} = $${pesos(price - delta)}.`, [[delta, "Ese es el descuento. Pagas lo que queda."], [price + delta, "Es descuento: se resta."]]];
  if (level === 1)
    return [`$${pesos(price)} con ${p} % de aumento`, price + delta, `Un producto de $${pesos(price)} sube un ${p} %. ¿Cuánto cuesta ahora?`, `El ${p} % de ${pesos(price)} es ${pesos(delta)}. Súmalo.`,
      `${pesos(price)} + ${pesos(delta)} = $${pesos(price + delta)}.`, [[delta, "Ese es el aumento. Súmalo al precio."], [price - delta, "Es aumento: se suma."]]];
  if (level === 2) {
    // Cantidades cuyo 10, 20, 25 y 50 % es entero.
    const before = pick(rng, [20, 40, 80, 100, 200]);
    const pct = pick(rng, [10, 20, 25, 50]);
    const up = (before * pct) / 100;
    return [`De ${before} a ${before + up}: ¿% de aumento?`, pct, `Un club tenía ${before} socios y ahora tiene ${before + up}. ¿En qué porcentaje aumentó?`,
      `Aumentó ${up}. ¿Qué porcentaje es ${up} de ${before}?`, `${up} ÷ ${before} = ${dec(pct / 100)} = ${pct} %.`,
      [[up, "Ese es el aumento en socios. Pásalo a porcentaje."], [Math.round((up * 100) / (before + up) * 100) / 100, "Comparaste con el número nuevo. Se compara con lo que había antes."]]];
  }
  const q = pick(rng, [5, 15, 35, 45]);
  const pay = (price * (100 - q)) / 100;
  return [`$${pesos(price)} · ${dec((100 - q) / 100)}`, pay, `Algo de $${pesos(price)} tiene ${q} % de descuento. ¿Cuánto pagas? (Pagas el ${100 - q} %.)`, `Multiplica por ${dec((100 - q) / 100)}.`,
    `${pesos(price)} · ${dec((100 - q) / 100)} = $${pesos(pay)}.`, [[price - pay, "Ese es el descuento. Pagas el resto."]]];
}

function algebraProducto(rng, level) {
  const [a, b] = [int(rng, 1, 9), int(rng, 1, 9)];
  if (level === 0) {
    const k = int(rng, 2, 9);
    return [`${k}(x + ${a}) = ${k}x + ?`, k * a, "Multiplica. ¿Qué número va en lugar de «?»?", `🟦 El ${k} multiplica a cada parte del paréntesis.`, `${k} · ${a} = ${k * a}: ${k}x + ${k * a}.`,
      [[a, `Falta multiplicar el ${a} por ${k}.`], [k + a, `Sumaste. Es ${k} · ${a}.`]]];
  }
  if (level === 1)
    return [`(x + ${a})(x + ${b}) = x² + ?x + ${a * b}`, a + b, "Multiplica. ¿Cuánto vale el número que va delante de x?", `Las partes del medio son ${b}x y ${a}x.`,
      `${b}x + ${a}x = ${a + b}x.`, [[a * b, "Ese es el último término. El del medio es la suma."]]];
  if (level === 2) {
    const k = int(rng, 2, 6);
    const [m, c] = [int(rng, 1, 5), int(rng, 1, 9)];
    return [`${k * m}x + ${k * c} = ${k}(${coef(m)} + ?)`, c, "Factoriza. ¿Qué número va en lugar de «?»?", `Divide ${k * c} por ${k}.`,
      `${k * c} ÷ ${k} = ${c}: ${k}(${coef(m)} + ${c}).`, [[k * c, `Hay que sacar el ${k} también del ${k * c}.`]]];
  }
  return [`(x + ${a})(x + ${b}) = x² + ${a + b}x + ?`, a * b, "Multiplica. ¿Cuál es el último número?", "Multiplica los dos números de los paréntesis.",
    `${a} · ${b} = ${a * b}.`, [[a + b, `Sumaste. El último número es ${a} · ${b}.`]]];
}

function isometrias(rng, level) {
  const [x, y] = [nonZero(rng, -7, 7), nonZero(rng, -7, 7)];
  const pt = `(${num(x)}, ${num(y)})`;
  if (level === 0)
    return [`${pt} reflejado en el eje y: ¿x?`, -x, `Reflejas el punto ${pt} en el eje y, como en un espejo. ¿Cuál es la nueva x?`, "🪞 En el eje y, la x cambia de signo.",
      `${pt} → (${num(-x)}, ${num(y)}).`, [[x, "En el espejo del eje y, la x cambia de signo."], [-y, "Cambiaste la y. En el eje y cambia la x."]]];
  if (level === 1)
    return [`${pt} reflejado en el eje x: ¿y?`, -y, `Reflejas el punto ${pt} en el eje x. ¿Cuál es la nueva y?`, "En el eje x, la y cambia de signo.",
      `${pt} → (${num(x)}, ${num(-y)}).`, [[y, "En el espejo del eje x, la y cambia de signo."], [-x, "Cambiaste la x. En el eje x cambia la y."]]];
  if (level === 2) {
    const askX = rng() < 0.5;
    return [`${pt} rotado 180°: ¿${askX ? "x" : "y"}?`, askX ? -x : -y, `Rotas el punto ${pt} media vuelta (180°) alrededor del origen. ¿Cuál es la nueva ${askX ? "x" : "y"}?`,
      "Media vuelta cambia el signo de las dos coordenadas.", `${pt} → (${num(-x)}, ${num(-y)}).`, [[askX ? x : y, "Media vuelta cambia los dos signos."]]];
  }
  const [a, b] = [nonZero(rng, -5, 5), nonZero(rng, -5, 5)];
  return [`${pt} trasladado con (${num(a)}, ${num(b)}): ¿y?`, y + b, `Trasladas el punto ${pt} con el vector (${num(a)}, ${num(b)}). ¿Cuál es la nueva y?`,
    "Suma el segundo número del vector a la y.", `${num(y)} + ${paren(b)} = ${num(y + b)}. El punto llega a (${num(x + a)}, ${num(y + b)}).`,
    [[y - b, "Se suma el vector, no se resta."], [x + a, "Esa es la nueva x."]]];
}

function cuartiles(rng, level) {
  if (level === 3) {
    const [p, n] = [pick(rng, [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]), pick(rng, [100, 200, 300, 400])];
    return [`Percentil ${p} de ${n}`, (p * n) / 100, `En una prueba de ${n} estudiantes, Ana quedó en el percentil ${p}. ¿Cuántos estudiantes sacaron menos que ella, aproximadamente?`,
      `El percentil ${p} supera al ${p} % del grupo.`, `${p} % de ${n} = ${(p * n) / 100} estudiantes.`, [[p, `${p} es el percentil, no la cantidad.`], [n - (p * n) / 100, "Esos quedaron sobre ella."]]];
  }
  const data = shuffle(rng, Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 7).sort((a, b) => a - b);
  const [k, name, hint] = [
    [3, "el cuartil 2 (la mediana)", "Los datos ya están ordenados: busca el del medio."],
    [1, "el cuartil 1", "Toma la mitad de abajo (los 3 primeros) y busca su mediana."],
    [5, "el cuartil 3", "Toma la mitad de arriba (los 3 últimos) y busca su mediana."],
  ][level];
  return [`Q${level === 0 ? 2 : level === 1 ? 1 : 3} de ${data.join(", ")}`, data[k], `¿Cuál es ${name}?`, `📏 ${hint}`,
    `Ordenados: ${data.join(", ")}. ${name[0].toUpperCase() + name.slice(1)} es ${data[k]}.`,
    [[data[3], "Esa es la mediana (Q2)."], [level === 1 ? data[0] : data[6], "Ese es un extremo, no el cuartil."]]];
}

// Lote 6: 1° Medio.

const PI = 3.14;
// Redondea a centésimas para evitar errores de coma flotante con π = 3,14.
const cents = (n) => Math.round(n * 100) / 100;

function racionalesOperatoria(rng, level) {
  if (level === 0) {
    const [d, txt] = pick(rng, [[0.5, "0,5"], [0.25, "0,25"], [0.75, "0,75"]]);
    const k = pick(rng, [2, 4, 8].filter((v) => v !== 2 || d === 0.5));
    const a = int(rng, 1, k - 1);
    return [`${txt} + ${frac(a, k)}`, d + a / k, "Calcula. Puedes responder como fracción o decimal.", `🔁 Pasa ${txt} a fracción.`,
      `${txt} = ${d * 4}/4; ${txt} + ${frac(a, k)} = ${dec(d + a / k)}.`, []];
  }
  if (level === 1) {
    const [a, b] = [int(rng, 2, 5), int(rng, 2, 5)];
    return [`1/2 + 1/${a} · ${a}/${b}`, 0.5 + 1 / b, "Calcula respetando el orden de las operaciones.", `Primero la multiplicación: 1/${a} · ${a}/${b}.`,
      `1/${a} · ${a}/${b} = 1/${b}; 1/2 + 1/${b}.`, [[(0.5 + 1 / a) * (a / b), "Sumaste antes de multiplicar."]]];
  }
  if (level === 2) {
    const [b, k] = [int(rng, 2, 4), int(rng, 1, 4)];
    const m = b * b * k;
    return [`(1/${b})² · ${m}`, k, "Calcula.", `Primero la potencia: (1/${b})² = 1/${b * b}.`, `1/${b * b} · ${m} = ${k}.`,
      [[(2 * m) / b, "Elevar al cuadrado no es multiplicar por 2."], [m / b, `(1/${b})² es 1/${b * b}, no 1/${b}.`]]];
  }
  const [num_, den] = pick(rng, [[3, 4], [1, 4], [1, 2], [2, 5], [3, 5]]);
  const tenths = den * int(rng, 1, 6);
  return [`${num_}/${den} de ${dec(tenths / 10)}`, cents((num_ * tenths) / den / 10), `Una botella tiene ${dec(tenths / 10)} litros y tomas ${num_}/${den}. ¿Cuántos litros tomaste?`,
    `«de» es multiplicar: ${num_}/${den} · ${dec(tenths / 10)}.`, `${dec(tenths / 10)} ÷ ${den} = ${dec(tenths / den / 10)}; · ${num_} = ${dec(cents((num_ * tenths) / den / 10))} litros.`,
    [[cents(tenths / den / 10), `Ese es 1/${den}.`]]];
}

function crecimientoExponencial(rng, level) {
  if (level === 0) {
    const [a, n] = [int(rng, 2, 6), int(rng, 2, 5)];
    return [`${a} · 2${sup(n)}`, a * 2 ** n, `Hay ${a} bacterias y se duplican cada hora. ¿Cuántas hay después de ${n} horas?`, `📈 Se multiplica por 2, ${n} veces.`,
      Array.from({ length: n + 1 }, (_, i) => a * 2 ** i).join(" → ") + ".", [[a + 2 * n, "Se duplica: se multiplica por 2, no se suma."], [a * 2 * n, `2${sup(n)} no es 2 · ${n}.`]]];
  }
  if (level === 1) {
    const [b, n] = [pick(rng, [2, 3]), int(rng, 3, 5)];
    return [`${b}${sup(n)}`, b ** n, `Una cadena de mensajes: cada persona lo manda a ${b} nuevas. ¿Cuántas personas nuevas lo reciben en el paso ${n}?`,
      `${b} multiplicado ${n} veces.`, `${b}${sup(n)} = ${b ** n}.`, [[b * n, `No es ${b} · ${n}. Es ${b} multiplicado ${n} veces.`]]];
  }
  if (level === 2) {
    const n = int(rng, 2, 4);
    const start = 2 ** n * int(rng, 5, 50);
    return [`${start} · (1/2)${sup(n)}`, start / 2 ** n, `Un remedio se reduce a la mitad cada 6 horas. Si hay ${start} mg, ¿cuánto queda después de ${n} mitades?`,
      `${start} → ${start / 2} → …`, Array.from({ length: n + 1 }, (_, i) => start / 2 ** i).join(" → ") + " mg.",
      [[start / 2 ** (n - 1), "Te faltó una mitad."], [start / (2 * n), `No se divide por ${2 * n}: se parte por la mitad ${n} veces.`]]];
  }
  const p = 1000 * int(rng, 1, 5);
  return [`${p} · 1,1²`, cents(p * 1.21), `Tienes $${pesos(p)} y cada año aumenta un 10 % (se multiplica por 1,1). ¿Cuánto tienes después de 2 años?`,
    `${pesos(p)} · 1,1 = ${pesos(p * 1.1)}; y otra vez · 1,1.`, `${pesos(p)} → ${pesos(cents(p * 1.1))} → ${pesos(cents(p * 1.21))}.`, [[p * 1.2, "El segundo año el 10 % es del monto nuevo, no del inicial."]]];
}

function funcionDosVariables(rng, level) {
  if (level <= 1) {
    const [a, b] = level === 0 ? [pick(rng, [1500, 2000, 2500, 3000]), pick(rng, [500, 1000, 1500])] : [int(rng, 2, 9), int(rng, 2, 9)];
    let [x, y] = [int(rng, 1, 5), int(rng, 1, 5)];
    if (x === y) y += 1;
    const v = a * x + b * y;
    return [`f(${x}, ${y}) con f(x, y) = ${a}x + ${b}y`, v,
      level === 0 ? `Entradas: adulto $${pesos(a)} (x), niño $${pesos(b)} (y). ¿Cuánto pagan ${x} adultos y ${y} niños?` : `Calcula f(${x}, ${y}).`,
      `🎟️ Reemplaza x por ${x} e y por ${y}.`, `${a} · ${x} + ${b} · ${y} = ${a * x} + ${b * y} = ${v}.`, [[a * y + b * x, "Cruzaste los valores: x va con el primer número."]]];
  }
  const [a, b] = level === 2 ? [int(rng, 2, 5), int(rng, 2, 5)] : [pick(rng, [400, 500, 600]), pick(rng, [200, 300])];
  const [x, y] = [int(rng, 1, 6), int(rng, 1, 6)];
  const c = a * x + b * y;
  return [`${a}x + ${b}y = ${c} con x = ${x}`, y,
    level === 2 ? `Si ${a}x + ${b}y = ${c} y x = ${x}, ¿cuánto vale y?` : `Empanadas a $${a} (x) y bebidas a $${b} (y). Pagaste $${pesos(c)} y compraste ${x} empanadas. ¿Cuántas bebidas compraste?`,
    `Reemplaza x: ${a * x} + ${b}y = ${c}.`, `${b}y = ${c - a * x}; y = ${y}.`, [[b * y, `Ese es ${b}y. Divide por ${b}.`]]];
}

const SECTOR = { 60: ["un sexto", 6], 90: ["un cuarto", 4], 120: ["un tercio", 3], 180: ["la mitad", 2] };

function sectoresCirculares(rng, level) {
  const angle = pick(rng, level === 0 ? [90] : [60, 90, 120, 180]);
  const [name, parts] = SECTOR[angle];
  if (level === 1)
    return [`¿Qué parte del círculo es ${angle}°?`, angle / 360, `¿Qué fracción del círculo es un sector de ${angle}°? Responde como fracción.`, "Un círculo completo tiene 360°.",
      `${angle} ÷ 360 = 1/${parts}.`, [[360 / angle, "Dividiste al revés."]]];
  // Radios con resultado exacto en centésimas: π · r² ÷ partes y 2 · π · r ÷ partes.
  const radii = level === 3 ? { 2: [1, 2, 3, 5], 3: [3, 6, 9], 4: [2, 4, 6, 10], 6: [3, 6, 9] } : { 2: [1, 2, 3, 4, 5], 3: [3, 6], 4: [2, 4, 6], 6: [6] };
  const r = pick(rng, radii[parts]);
  if (level === 3)
    return [`Arco de ${angle}°, radio ${r} cm`, cents((2 * PI * r) / parts), `¿Cuánto mide el borde curvo (el arco) de un sector de ${angle}° y radio ${r} cm? Usa π = 3,14.`,
      `El borde completo mide 2 · π · r. Toma ${name}.`, `2 · 3,14 · ${r} = ${dec(cents(2 * PI * r))}; ${name} es ${dec(cents((2 * PI * r) / parts))} cm.`,
      [[cents(2 * PI * r), "Ese es el borde completo."], [cents((PI * r * r) / parts), "Esa es el área. El arco es el borde."]]];
  return [`Sector de ${angle}°, radio ${r} cm`, cents((PI * r * r) / parts), "Calcula el área del sector en cm². Usa π = 3,14.", `🍕 ${angle}° es ${name} del círculo.`,
    `3,14 · ${r} · ${r} = ${dec(cents(PI * r * r))}; ${name} es ${dec(cents((PI * r * r) / parts))} cm².`, [[cents(PI * r * r), "Ese es el círculo completo."]]];
}

function cono(rng, level) {
  if (level === 1) {
    const v = 3 * int(rng, 5, 40);
    return [`Cilindro de ${v} cm³`, v / 3, `Un cilindro tiene ${v} cm³. ¿Cuál es el volumen de un cono con la misma base y la misma altura?`, "Tres conos llenan el cilindro.",
      `${v} ÷ 3 = ${v / 3} cm³.`, [[v / 2, "No es la mitad: es un tercio."], [v * 3, "El cono es más chico."]]];
  }
  const r = int(rng, 1, 4);
  const h = 3 * int(rng, 1, 4);
  const cyl = cents(PI * r * r * h);
  return [`Cono: radio ${r} cm, altura ${h} cm`, cents(cyl / 3), level === 3 ? `Un cono de helado tiene radio ${r} cm y altura ${h} cm. ¿Cuántos cm³ caben? Usa π = 3,14.` : "Calcula el volumen en cm³. Usa π = 3,14.",
    "🍦 Calcula el cilindro y divide en 3.", `3,14 · ${r} · ${r} · ${h} = ${dec(cyl)}; ÷ 3 = ${dec(cents(cyl / 3))} cm³.`, [[cyl, "Ese es el cilindro. El cono es un tercio."]]];
}

function homotecia(rng, level) {
  if (level === 0 || level === 2) {
    const [l, k] = level === 0 ? [int(rng, 2, 9), int(rng, 2, 5)] : [2 * int(rng, 2, 10), 0.5];
    return [`Segmento de ${l} cm, k = ${k === 0.5 ? "1/2" : k}`, l * k, `Un segmento mide ${l} cm. Le aplicas una homotecia de razón ${k === 0.5 ? "1/2" : k}. ¿Cuánto mide ahora?`,
      k === 0.5 ? "k = 1/2 es la mitad." : `🔦 k = ${k}: todo se multiplica por ${k}.`, `${l} · ${k === 0.5 ? "1/2" : k} = ${l * k} cm.`,
      [[k === 0.5 ? l * 2 : l + k, k === 0.5 ? "k = 1/2 achica." : "La homotecia multiplica, no suma."]]];
  }
  if (level === 1) {
    const [x, y, k] = [int(rng, 1, 6), int(rng, 1, 6), int(rng, 2, 4)];
    return [`(${x}, ${y}) con k = ${k}: ¿y?`, y * k, `Aplicas una homotecia desde el origen con k = ${k} al punto (${x}, ${y}). ¿Cuál es la nueva y?`, `Multiplica cada coordenada por ${k}.`,
      `(${x}, ${y}) → (${x * k}, ${y * k}).`, [[y + k, "Se multiplica, no se suma."], [x * k, "Esa es la nueva x."]]];
  }
  const [a, k] = [int(rng, 2, 6), int(rng, 2, 6)];
  return [`De ${a} cm a ${a * k} cm: ¿k?`, k, `Un dibujo de ${a} cm se proyecta y mide ${a * k} cm. ¿Cuál es la razón k?`, `¿Por cuánto se multiplicó ${a}?`,
    `${a * k} ÷ ${a} = ${k}.`, [[a * k - a, "Restaste. k es cuántas veces."]]];
}

function tales(rng, level) {
  const [a, k] = [int(rng, 2, 6), int(rng, 2, 4)];
  const c = int(rng, 2, 9);
  if (level <= 1)
    return [`${a}/${a * k} = ${c}/x`, c * k, level === 0 ? `Tres paralelas cortan dos rectas. En una, los trozos miden ${a} y ${a * k}. En la otra, el primero mide ${c}. ¿Cuánto mide el segundo?` : `Encuentra x en la proporción de Tales ${a}/${a * k} = ${c}/x.`,
      `📐 ${a * k} es ${k} veces ${a}. El otro trozo también.`, `x = ${c} · ${k} = ${c * k}.`, [[c + a * k - a, "Sumaste. Es proporción: se multiplica."]]];
  if (level === 2)
    return [`${c}/x = ${c * k}/${a * k}`, a, `Encuentra x en ${c}/x = ${c * k}/${a * k}.`, `${c * k} es ${k} veces ${c}. Entonces ${a * k} es ${k} veces x.`,
      `x = ${a * k} ÷ ${k} = ${a}.`, [[a * k * k, "Al revés: divide."]]];
  const [h, sh] = shuffle(rng, [1, 2, 3, 4]).slice(0, 2);
  const m = int(rng, 3, 10);
  return [`Sombra: ${h} m → ${sh} m; edificio con sombra de ${sh * m} m`, h * m,
    `Un poste de ${h} m da una sombra de ${sh} m. A la misma hora, un edificio da una sombra de ${sh * m} m. ¿Cuánto mide el edificio?`,
    `La sombra del edificio es ${m} veces la del poste.`, `${sh * m} = ${sh} · ${m}, así que el edificio mide ${h} · ${m} = ${h * m} m.`,
    [[h + sh * m - sh, "Sumaste. Es proporción: se multiplica."], [(sh * sh * m) / h, "Cruzaste los datos: la altura va con la altura."]]];
}

function semejanza(rng, level) {
  if (level === 1) {
    const [a, c] = shuffle(rng, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
    const k = int(rng, 2, 4);
    return [`Triángulos semejantes: ${a} → ${a * k}, ${c} → ?`, c * k, `Dos triángulos son semejantes. Un lado de ${a} cm corresponde a uno de ${a * k} cm. ¿Cuánto mide el lado que corresponde a uno de ${c} cm?`,
      `${a * k} es ${k} veces ${a}.`, `${c} · ${k} = ${c * k} cm.`, [[c + a * k - a, "Sumaste. En la semejanza todo se multiplica."]]];
  }
  const [scale, unit, factor, label] = [[100, "metros", 100, "1 : 100"], [100, "metros", 100, "1 : 100"], [50, "metros", 100, "1 : 50"], [100000, "km", 100000, "1 : 100.000"]][level];
  const cm = level === 2 ? 2 * int(rng, 5, 30) : int(rng, 2, 12);
  const real = (cm * scale) / factor;
  const what = level === 3 ? `En un mapa a escala ${label}, dos pueblos están a ${cm} cm. ¿Cuántos km los separan?` : level === 2 ? `Una maqueta a escala ${label} tiene una torre de ${cm} cm. ¿Cuántos metros mide la torre real?` : `En un plano a escala ${label}, una pieza mide ${cm} cm. ¿Cuántos metros mide en la realidad?`;
  return [`${level === 3 ? "Mapa" : level === 2 ? "Maqueta" : "Plano"} ${label.replace(".", "")}, ${cm} cm`, real, what, `🗺️ 1 cm son ${pesos(scale)} cm reales.`,
    `${cm} · ${pesos(scale)} = ${pesos(cm * scale)} cm = ${dec(real)} ${unit}.`, [[cm * scale, `Esos son centímetros. Pásalo a ${unit}.`]]];
}

function dobleEntrada(rng, level) {
  const [a, b] = [int(rng, 3, 15), int(rng, 3, 15)];
  if (level === 0)
    return [`1°A: fútbol ${a}, básquetbol ${b}`, a + b, `En una tabla, el 1°A tiene ${a} estudiantes que prefieren fútbol y ${b} básquetbol. ¿Cuál es el total de la fila 1°A?`, "📋 Suma la fila.",
      `${a} + ${b} = ${a + b}.`, [[a * b, "Multiplicaste. El total es la suma."]]];
  if (level === 1)
    return [`Fútbol: 1°A ${a}, 1°B ${b}`, a + b, `En la columna de fútbol, el 1°A tiene ${a} y el 1°B ${b}. ¿Cuántos prefieren fútbol en total?`, "Suma la columna.",
      `${a} + ${b} = ${a + b}.`, [[Math.abs(a - b), "Restaste. El total es la suma."]]];
  if (level === 2) {
    const total = pick(rng, [20, 25, 50]);
    const part = int(rng, 1, total - 1);
    return [`1°B: fútbol ${part} de ${total}`, (part * 100) / total, `En el 1°B hay ${total} estudiantes y ${part} prefieren fútbol. ¿Qué porcentaje del 1°B prefiere fútbol?`,
      `${part} de ${total}.`, `${part} ÷ ${total} = ${dec(part / total)} = ${dec((part * 100) / total)} %.`, [[part, "Esa es la cantidad. Pásala a porcentaje."]]];
  }
  const total = a + b + int(rng, 10, 30);
  return [`Total ${total}, fútbol ${a + b}`, total - a - b, `En total hay ${total} estudiantes y ${a + b} prefieren fútbol. Si el resto prefiere básquetbol, ¿cuántos prefieren básquetbol?`,
    "Resta del total.", `${total} − ${a + b} = ${total - a - b}.`, [[total + a + b, "Sumaste. El resto es la resta."]]];
}

function reglasProbabilidad(rng, level) {
  if (level === 0) {
    const [x, y] = shuffle(rng, [1, 2, 3, 4, 5, 6]).slice(0, 2).sort();
    return [`Dado: ${x} o ${y}`, 1 / 3, `Lanzas un dado. ¿Cuál es la probabilidad de sacar ${x} o ${y}? Responde como fracción.`, "🎲 «O» se suma: 1/6 + 1/6.",
      "1/6 + 1/6 = 2/6 = 1/3.", [[1 / 36, "Multiplicaste. «O» se suma."]]];
  }
  if (level === 1) {
    const face = int(rng, 1, 6);
    const side = pick(rng, ["cara", "sello"]);
    return [`Moneda y dado: ${side} y ${face}`, 1 / 12, `Lanzas una moneda y un dado. ¿Cuál es la probabilidad de ${side} y un ${face}?`, "«Y» se multiplica: 1/2 · 1/6.",
      "1/2 · 1/6 = 1/12.", [[2 / 3, "Sumaste. «Y» se multiplica."]]];
  }
  if (level === 2) {
    const n = int(rng, 2, 4);
    return [`${n} monedas: todas cara`, 1 / 2 ** n, `Lanzas ${n} monedas. ¿Cuál es la probabilidad de que todas salgan cara?`, `1/2 multiplicado ${n} veces.`,
      `(1/2)${sup(n)} = 1/${2 ** n}.`, [[n / 2, "Sumaste. «Y» se multiplica."], [1 / (2 * n), `No es 1/(2 · ${n}): es 1/2 multiplicado ${n} veces.`]]];
  }
  const odd = rng() < 0.5;
  const face = pick(rng, odd ? [2, 4, 6] : [1, 3, 5]);
  return [`Dado: ${odd ? "impar" : "par"} o ${face}`, 2 / 3, `Lanzas un dado. ¿Cuál es la probabilidad de sacar un ${odd ? "impar" : "par"} o un ${face}?`,
    `${odd ? "Impar" : "Par"}: 3/6. Un ${face}: 1/6. Súmalas.`, "3/6 + 1/6 = 4/6 = 2/3.", [[1 / 12, "Multiplicaste. «O» se suma."]]];
}

function galton(rng, level) {
  const n = level === 3 ? int(rng, 4, 6) : level === 2 ? 2 : int(rng, 2, 5);
  if (level === 0 || level === 3)
    return [`Galton: ${n} filas, ¿caminos?`, 2 ** n, `Una bolita pasa por ${n} filas de clavos y en cada una va a la izquierda o a la derecha. ¿Cuántos caminos posibles hay?`,
      `🔻 En cada fila hay 2 opciones: ${Array(n).fill(2).join(" · ")}.`, `2${sup(n)} = ${2 ** n} caminos.`, [[2 * n, "Sumaste. Se multiplica."]]];
  if (level === 1) {
    const side = pick(rng, ["izquierdo", "derecho"]);
    return [`Galton: ${n} filas, extremo ${side}`, 1 / 2 ** n, `Con ${n} filas, ¿cuál es la probabilidad de llegar al extremo ${side}? Responde como fracción.`,
      `Hay que ir siempre a la ${side === "izquierdo" ? "izquierda" : "derecha"}: 1 camino.`, `1 camino de ${2 ** n}: 1/${2 ** n}.`, [[1 / n, `Hay ${2 ** n} caminos, no ${n}.`]]];
  }
  return ["Galton: 2 filas, centro", 0.5, "Con 2 filas, ¿cuál es la probabilidad de caer en el centro?", "Caminos: II, ID, DI, DD. ¿Cuántos llegan al centro?",
    "ID y DI: 2 de 4 = 1/2.", [[0.25, "Al centro llegan 2 caminos (ID y DI)."]]];
}

// Lote 7: 2° Medio.

function raicesSimplificar(rng, level) {
  const inner = pick(rng, [2, 3, 5, 6, 7]);
  const k = int(rng, 2, 6);
  if (level === 0 || level === 2)
    return [`√${k * k * inner} = ?√${inner}`, k, `Simplifica √${k * k * inner}. ¿Qué número va delante de √${inner}?`, `🔍 ${k * k * inner} = ${k * k} · ${inner}, y ${k * k} es un cuadrado.`,
      `√${k * k * inner} = √${k * k} · √${inner} = ${k}√${inner}.`, [[k * k, `Sacaste el ${k * k} sin su raíz. √${k * k} = ${k}.`]]];
  if (level === 1) {
    const [a, m] = [pick(rng, [2, 3, 5]), int(rng, 2, 5)];
    return [`√${a} · √${a * m * m}`, a * m, "Calcula.", `Junta las raíces: √(${a} · ${a * m * m}).`, `√${a * a * m * m} = ${a * m}.`,
      [[a * a * m * m, "Falta la raíz."]]];
  }
  const [p, q] = [int(rng, 2, 4), int(rng, 1, 3)];
  return [`√${p * p * 2} + √${q * q * 2} = ?√2`, p + q, `Simplifica y suma: √${p * p * 2} + √${q * q * 2}. ¿Qué número va delante de √2?`,
    `√${p * p * 2} = ${p}√2 y √${q * q * 2} = ${q}√2.`, `${p}√2 + ${q}√2 = ${p + q}√2.`, [[(p * p + q * q) * 2, "No se suma adentro de la raíz. Simplifica primero."]]];
}

const ROOT = { 3: "∛", 4: "∜" };

function raicesEnesimas(rng, level) {
  if (level <= 1) {
    const b = level === 0 ? int(rng, 2, 4) : int(rng, 3, 6);
    const n = level === 0 ? 3 : pick(rng, b <= 4 ? [3, 4] : [3]);
    return [`${ROOT[n]}${b ** n}`, b, `Calcula la raíz ${n === 3 ? "cúbica" : "cuarta"}.`, `🧊 ¿Qué número multiplicado ${n} veces da ${b ** n}?`,
      `${Array(n).fill(b).join(" · ")} = ${b ** n}.`, [[b ** n / n, `No es dividir por ${n}.`]]];
  }
  if (level === 2) {
    const [b, n] = pick(rng, [[4, 2], [5, 2], [6, 2], [7, 2], [9, 2], [2, 3], [3, 3], [4, 3]]);
    return [`${b ** n}^(1/${n})`, b, `Calcula. El exponente 1/${n} es la raíz ${n === 2 ? "cuadrada" : "cúbica"}.`, `${b ** n}^(1/${n}) = ${n === 2 ? "√" : "∛"}${b ** n}.`,
      `${n === 2 ? "√" : "∛"}${b ** n} = ${b}.`, [[b ** n / n, `No es dividir por ${n}.`]]];
  }
  const [b, m] = [int(rng, 2, 4), 2];
  return [`${b ** 3}^(${m}/3)`, b ** m, "Calcula.", `Primero la raíz cúbica de ${b ** 3}; después al cuadrado.`, `∛${b ** 3} = ${b}; ${b}² = ${b * b}.`,
    [[(b ** 3 * m) / 3, `No es ${b ** 3} · 2/3.`], [b, "Falta elevar al cuadrado."]]];
}

const SUB = (n) => String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);

function logaritmos(rng, level) {
  if (level === 1) {
    const k = int(rng, 1, 6);
    return [`log ${10 ** k}`, k, "Calcula. Sin base escrita, la base es 10.", `${pesos(10 ** k)} es un 1 con ${k} ceros.`, `10${sup(k)} = ${pesos(10 ** k)}, así que log ${pesos(10 ** k)} = ${k}.`,
      [[10 ** (k - 1), "Dividiste por 10. Cuenta los ceros."]]];
  }
  if (level === 3 && rng() < 0.4) {
    const b = int(rng, 2, 9);
    return [`log${SUB(b)} 1`, 0, "Calcula.", `¿A qué exponente hay que elevar ${b} para obtener 1?`, `${b}⁰ = 1, así que log${SUB(b)} 1 = 0.`,
      [[1, `${b}¹ = ${b}, no 1.`], [b, "El logaritmo es el exponente, no la base."]]];
  }
  const b = pick(rng, [2, 3, 5]);
  const k = int(rng, 2, b === 2 ? 6 : b === 3 ? 4 : 3);
  return [`log${SUB(b)} ${b ** k}`, k, "Calcula.", `🔁 ¿Cuántas veces multiplicas ${b} para llegar a ${b ** k}?`, `${b}${sup(k)} = ${b ** k}, así que log${SUB(b)} ${b ** k} = ${k}.`,
    [[b ** k / b, `Dividiste por ${b}. Cuenta las veces que se multiplica.`]]];
}

function funcionCuadratica(rng, level) {
  if (level === 0) {
    const [x, c] = [int(rng, 2, 6), int(rng, -9, 9)];
    return [`f(${x}) con f(x) = x² ${plus(c)}`, x * x + c, `Calcula f(${x}).`, `📈 Reemplaza x por ${x}: ${x}² ${plus(c)}.`, `${x}² = ${x * x}; ${x * x} ${plus(c)} = ${num(x * x + c)}.`,
      [[2 * x + c, `${x}² no es ${x} · 2.`]]];
  }
  if (level === 1) {
    const [h, c] = [int(rng, 1, 6), int(rng, -9, 9)];
    return [`Vértice de x² − ${2 * h}x ${plus(c)}: ¿x?`, h, `¿En qué x está el vértice de f(x) = x² − ${2 * h}x ${plus(c)}?`, `x = −b ÷ (2a), con a = 1 y b = −${2 * h}.`,
      `x = ${2 * h} ÷ 2 = ${h}.`, [[-h, "Cuidado con el signo: −b es positivo."], [2 * h, "Falta dividir por 2a = 2."]]];
  }
  if (level === 2) {
    const [a, b, c] = [nonZero(rng, -5, 5), nonZero(rng, -9, 9), nonZero(rng, -12, 12)];
    return [`f(x) = ${coef(a).replace("x", "x²")} ${plus(b).replace(/(\d+)$/, "$1x").replace(/^([+−]) 1x$/, "$1 x")} ${plus(c)}: corte con eje y`, c,
      "¿En qué valor corta el eje y esta parábola?", "En el eje y, x = 0.", `f(0) = ${num(c)}.`, [[a, "Ese es a. Con x = 0 queda solo c."]]];
  }
  // Mientras la pelota está en el aire: t ≤ v ÷ 5.
  const v = pick(rng, [10, 20, 30]);
  const t = int(rng, 1, v / 5);
  return [`Altura: h(t) = −5t² + ${v}t; h(${t})`, -5 * t * t + v * t, `Una pelota se lanza hacia arriba y su altura es h(t) = −5t² + ${v}t metros. ¿A qué altura está a los ${t} segundos?`,
    `Reemplaza t por ${t}.`, `−5 · ${t * t} + ${v} · ${t} = ${-5 * t * t} + ${v * t} = ${-5 * t * t + v * t} m.`, [[5 * t * t + v * t, "−5 · t² es negativo."]]];
}

function ecuacionCuadratica(rng, level) {
  if (level === 0) {
    const r = int(rng, 2, 12);
    return [`x² = ${r * r}, solución positiva`, r, `Resuelve x² = ${r * r}. Escribe la solución positiva.`, `🔁 ¿Qué número al cuadrado da ${r * r}?`, `x = ${r} o x = −${r}. La positiva es ${r}.`,
      [[(r * r) / 2, "No es dividir por 2."]]];
  }
  if (level === 1) {
    const [p, q] = [int(rng, 1, 9), int(rng, 1, 9)];
    return [`(x − ${p})(x + ${q}) = 0, solución positiva`, p, "Resuelve. Escribe la solución positiva.", "Uno de los paréntesis vale 0.",
      `x − ${p} = 0 → x = ${p}; x + ${q} = 0 → x = −${q}. La positiva es ${p}.`, [[-p, `Si x − ${p} = 0, entonces x = ${p}.`], [q, `x + ${q} = 0 da x = −${q}.`]]];
  }
  if (level === 2) {
    const [p, q] = shuffle(rng, [1, 2, 3, 4, 5, 6, 7]).slice(0, 2).sort((a, b) => a - b);
    return [`x² − ${p + q}x + ${p * q} = 0, solución mayor`, q, "Resuelve. Escribe la solución mayor.", `Busca dos números que sumen ${p + q} y multipliquen ${p * q}.`,
      `${p} y ${q}: (x − ${p})(x − ${q}) = 0. La mayor es ${q}.`, [[p, "Esa es la menor."], [p * q, `Ese es el número sin x (${p * q}). Las soluciones son ${p} y ${q}.`]]];
  }
  const b = int(rng, 2, 9);
  return [`x² + ${b}x = 0, solución distinta de 0`, -b, `Resuelve x² + ${b}x = 0. Una solución es 0; ¿cuál es la otra?`, `Saca x factor común: x(x + ${b}) = 0.`,
    `x = 0 o x + ${b} = 0 → x = −${b}.`, [[b, "Cuidado con el signo."]]];
}

function funcionInversa(rng, level) {
  const x = int(rng, 1, 10);
  if (level === 0) {
    const [a, b] = [int(rng, 2, 5), int(rng, 1, 9)];
    const y = a * x + b;
    return [`f(x) = ${a}x + ${b}; f⁻¹(${y})`, x, `La máquina f(x) = ${a}x + ${b} entregó ${y}. ¿Qué número entró? Es decir, calcula f⁻¹(${y}).`,
      `⚙️ Deshaz al revés: primero resta ${b}, después divide por ${a}.`, `${y} − ${b} = ${y - b}; ${y - b} ÷ ${a} = ${x}.`, [[a * y + b, "Aplicaste f otra vez. La inversa deshace."]]];
  }
  if (level === 1) {
    const b = int(rng, 2, 9);
    return [`f(x) = x − ${b}; f⁻¹(${x})`, x + b, `Calcula f⁻¹(${x}) para f(x) = x − ${b}.`, `La inversa de restar ${b} es sumar ${b}.`, `${x} + ${b} = ${x + b}.`,
      [[x - b, `Restaste otra vez. La inversa suma ${b}.`]]];
  }
  if (level === 2) {
    const a = int(rng, 2, 6);
    return [`f(x) = ${a}x; f⁻¹(${a * x})`, x, `Calcula f⁻¹(${a * x}) para f(x) = ${a}x.`, `La inversa de multiplicar por ${a} es dividir por ${a}.`, `${a * x} ÷ ${a} = ${x}.`,
      [[a * a * x, "Multiplicaste. La inversa divide."]]];
  }
  const [b, y] = [int(rng, 1, 5), int(rng, 2, 9)];
  return [`f(x) = x/2 + ${b}; f⁻¹(${y + b})`, 2 * y, `Calcula f⁻¹(${y + b}) para f(x) = x/2 + ${b}.`, `Primero resta ${b}, después multiplica por 2.`, `${y + b} − ${b} = ${y}; ${y} · 2 = ${2 * y}.`,
    [[(y + b) / 2 + b, "Aplicaste f. La inversa deshace."], [2 * (y + b) - b, "Al revés: primero resta, después multiplica."]]];
}

function cambioPorcentual(rng, level) {
  if (level === 0) {
    const p = 1000 * int(rng, 1, 9);
    return [`${p} · 1,1²`, cents(p * 1.21), `Un pueblo tiene ${pesos(p)} habitantes y crece 10 % cada año. ¿Cuántos tiene después de 2 años?`, `📈 ${pesos(p)} · 1,1; y otra vez · 1,1.`,
      `${pesos(p)} → ${pesos(cents(p * 1.1))} → ${pesos(cents(p * 1.21))}.`, [[p * 1.2, "El segundo año el 10 % es del número nuevo."]]];
  }
  if (level === 1) {
    const p = 10000 * int(rng, 1, 9);
    const q = pick(rng, [10, 20, 50]);
    const f = (100 - q) / 100;
    return [`${p} · ${dec(f)}²`, cents(p * f * f), `Un celular de $${pesos(p)} pierde el ${q} % de su valor cada año. ¿Cuánto vale después de 2 años?`, `Cada año se multiplica por ${dec(f)}.`,
      `${pesos(p)} → ${pesos(cents(p * f))} → ${pesos(cents(p * f * f))}.`, [[p * (1 - (2 * q) / 100), `El segundo año baja el ${q} % del valor nuevo.`]]];
  }
  if (level === 2) {
    const p = 100 * int(rng, 1, 9);
    const q = pick(rng, [10, 20, 25, 50]);
    return [`${p} · ${dec(1 + q / 100)}`, cents(p * (1 + q / 100)), `Una planta mide ${p} mm y crece un ${q} % cada semana. ¿Cuánto mide después de 1 semana?`, `Crecer ${q} % es multiplicar por ${dec(1 + q / 100)}.`,
      `${p} · ${dec(1 + q / 100)} = ${dec(cents(p * (1 + q / 100)))} mm.`, [[p + q, `El ${q} % de ${p} no es ${q}.`]]];
  }
  const [p, n] = [100 * int(rng, 1, 9), int(rng, 2, 4)];
  return [`${p} · 2${sup(n)}`, p * 2 ** n, `Un video tiene ${p} visitas y cada día se duplican. ¿Cuántas tiene después de ${n} días?`, `Por 2, ${n} veces.`,
    Array.from({ length: n + 1 }, (_, i) => pesos(p * 2 ** i)).join(" → ") + ".", [[p * (n + 1), "Se multiplica por 2, no se suma."]]];
}

function esfera(rng, level) {
  if (level === 0 || level === 2) {
    const r = level === 0 ? 3 : pick(rng, [3, 6]);
    const v = cents((4 / 3) * PI * r ** 3);
    return [`Esfera: radio ${r} cm, volumen`, v, "Calcula el volumen en cm³. Usa π = 3,14.", `⚽ 4/3 · 3,14 · ${r} · ${r} · ${r}.`,
      `${r}³ = ${r ** 3}; 4/3 · ${r ** 3} = ${(4 * r ** 3) / 3}; · 3,14 = ${dec(v)} cm³.`, [[cents(PI * r * r * 4), "Esa es el área (r²). El volumen usa r³."]]];
  }
  const r = level === 1 ? int(rng, 1, 5) : pick(rng, [5, 10, 20]);
  const a = cents(4 * PI * r * r);
  return [`${level === 3 ? "Pelota" : "Esfera"}: radio ${r} cm, área`, a, level === 3 ? `¿Cuánto cuero se necesita para cubrir una pelota de radio ${r} cm? Usa π = 3,14.` : "Calcula el área de la superficie en cm². Usa π = 3,14.",
    `4 · 3,14 · ${r} · ${r}.`, `4 · 3,14 · ${r * r} = ${dec(a)} cm².`, [[cents(4 * PI * r * 2), "r² es r · r, no r · 2."]]];
}

const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];

function trigonometria(rng, level) {
  if (level === 3) {
    const [h, [ang, s]] = [2 * int(rng, 2, 15), pick(rng, [[30, 0.5]])];
    return [`Hipotenusa ${h}, sen ${ang}° = ${dec(s)}: opuesto`, h * s, `Una escalera de ${h} m forma ${ang}° con el suelo. ¿A qué altura llega? (sen ${ang}° = ${dec(s)})`,
      "Opuesto = hipotenusa · seno.", `${h} · ${dec(s)} = ${h * s} m.`, [[h / s, "Dividiste. Opuesto = hipotenusa · seno."]]];
  }
  const [a, b, c] = pick(rng, TRIPLES);
  const [name, val, hint] = [["seno", a / c, "Seno = opuesto ÷ hipotenusa."], ["coseno", b / c, "Coseno = adyacente ÷ hipotenusa."], ["tangente", a / b, "Tangente = opuesto ÷ adyacente."]][level];
  return [`Triángulo ${a}-${b}-${c}: ${name}`, val, `En un triángulo rectángulo de catetos ${a} y ${b} e hipotenusa ${c}, ¿cuál es el ${name} del ángulo opuesto al lado ${a}? Responde como fracción o decimal.`,
    `📐 ${hint}`, `${name[0].toUpperCase() + name.slice(1)}: ${level === 0 ? `${a}/${c}` : level === 1 ? `${b}/${c}` : `${a}/${b}`}.`,
    [[level === 2 ? b / a : level === 0 ? b / c : a / c, "Revisa qué lado va arriba: SOH-CAH-TOA."], [level === 0 ? a / b : c / a, "Revisa qué lados usa esta razón."]]];
}

function vectores(rng, level) {
  const [a, b, c, d] = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)];
  if (level <= 1) {
    const askX = level === 0;
    return [`(${num(a)}, ${num(b)}) + (${num(c)}, ${num(d)}): ¿${askX ? "x" : "y"}?`, askX ? a + c : b + d, `Suma los vectores. ¿Cuál es la componente ${askX ? "x" : "y"} del resultado?`,
      askX ? `➡️ Suma las x: ${num(a)} + ${paren(c)}.` : `Suma las y: ${num(b)} + ${paren(d)}.`, `(${num(a + c)}, ${num(b + d)}).`,
      [[askX ? b + d : a + c, "Esa es la otra componente."], [askX ? a + d : b + c, "Sumaste en cruz."]]];
  }
  if (level === 2) {
    const [p, q, r] = pick(rng, TRIPLES);
    return [`Módulo de (${p}, ${q})`, r, `¿Cuánto mide el vector (${p}, ${q})?`, `Pitágoras: √(${p}² + ${q}²).`, `√(${p * p} + ${q * q}) = √${r * r} = ${r}.`,
      [[p + q, "No se suman directo: Pitágoras."], [r * r, "Falta la raíz."]]];
  }
  const k = int(rng, 2, 5);
  return [`${k} · (${num(a)}, ${num(b)}): ¿y?`, k * b, `Multiplica el vector (${num(a)}, ${num(b)}) por ${k}. ¿Cuál es la componente y?`, `Multiplica cada componente por ${k}.`,
    `${k} · (${num(a)}, ${num(b)}) = (${num(k * a)}, ${num(k * b)}).`, [[b + k, `Sumaste ${k}. Se multiplica.`], [k * a, "Esa es la x."]]];
}

function variableAleatoria(rng, level) {
  if (level === 0 || level === 3) {
    const n = level === 0 ? 2 : 3;
    const k = int(rng, 0, n);
    const w = n === 2 ? [1, 2, 1][k] : [1, 3, 3, 1][k];
    return [`${n} monedas: P(X = ${k})`, w / 2 ** n, `Lanzas ${n} monedas y X es el número de caras. ¿Cuál es P(X = ${k})?`, `🪙 Hay ${2 ** n} casos. ¿En cuántos hay ${k} caras?`,
      `${w} de ${2 ** n} = ${w}/${2 ** n}.`, [[1 / 2 ** n, `Hay ${w} casos con ${k} caras.`], [1 / (n + 1), "Los valores de X no son igual de probables: cuenta los casos."]]];
  }
  if (level === 1) {
    const s = int(rng, 2, 12);
    const w = 6 - Math.abs(7 - s);
    return [`2 dados: P(suma = ${s})`, w / 36, `Lanzas 2 dados y X es la suma. ¿Cuál es P(X = ${s})? Responde como fracción.`, "Hay 36 casos. Cuenta los pares que suman.",
      `${w} de 36 = ${w}/36.`, [[1 / 11, "Las sumas no son igual de probables. Cuenta los 36 casos."]]];
  }
  const faces = pick(rng, [4, 6, 8]);
  return [`Dado de ${faces} caras: valor esperado`, (faces + 1) / 2, `¿Cuál es el valor esperado al lanzar un dado de ${faces} caras (del 1 al ${faces})?`, `Promedio de 1 a ${faces}.`,
    `${(faces * (faces + 1)) / 2} ÷ ${faces} = ${dec((faces + 1) / 2)}.`, [[(faces * (faces + 1)) / 2, `Esa es la suma. Divide por ${faces}.`], [faces / 2, "Promedia todas las caras."]]];
}

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

function permutaciones(rng, level) {
  if (level === 0) {
    const n = int(rng, 3, 6);
    return [`${n}!`, fact(n), `¿De cuántas formas se pueden ordenar ${n} personas en una fila?`, `🔢 ${Array.from({ length: n }, (_, i) => n - i).join(" · ")}.`,
      `${Array.from({ length: n }, (_, i) => n - i).join(" · ")} = ${fact(n)}.`, [[n * n, "Cada lugar tiene una opción menos."], [(n * (n + 1)) / 2, "Sumaste. Se multiplica."]]];
  }
  if (level === 1) {
    const n = int(rng, 4, 8);
    return [`Podio de 3 entre ${n}`, n * (n - 1) * (n - 2), `En una carrera hay ${n} corredores. ¿De cuántas formas puede quedar el podio (1°, 2° y 3°)?`, `${n} · ${n - 1} · ${n - 2}.`,
      `${n} · ${n - 1} · ${n - 2} = ${n * (n - 1) * (n - 2)}.`, [[n ** 3, "Un corredor no puede repetir lugar."], [(n * (n - 1) * (n - 2)) / 6, "En el podio importa el orden."]]];
  }
  if (level === 2) {
    const n = int(rng, 4, 9);
    return [`Elegir 2 de ${n}`, (n * (n - 1)) / 2, `¿De cuántas formas puedes elegir 2 amigos de ${n} para un equipo (el orden no importa)?`, `${n} · ${n - 1}, pero cada pareja se contó 2 veces.`,
      `${n * (n - 1)} ÷ 2 = ${(n * (n - 1)) / 2}.`, [[n * (n - 1), "Cada pareja se contó dos veces: divide por 2."]]];
  }
  const n = int(rng, 3, 5);
  return [`P(Ana primera de ${n})`, 1 / n, `${n} amigos, entre ellos Ana, se ordenan al azar. ¿Cuál es la probabilidad de que Ana quede primera?`, `Órdenes: ${n}!. ¿En cuántos Ana va primera?`,
    `${fact(n - 1)} de ${fact(n)} = 1/${n}.`, [[1 / fact(n), `Ana va primera en ${fact(n - 1)} órdenes, no en 1.`]]];
}

// Lote 8: 3° Medio.

// «3 + 2i», «3 − i», «−2 + 5i».
const cx = (a, b) => `${num(a)} ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;

function complejos(rng, level) {
  const [a, b, c, d] = [int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)];
  if (level === 0)
    return [`(${cx(a, b)}) + (${cx(c, d)}): parte real`, a + c, "Suma los complejos. ¿Cuál es la parte real del resultado?", `🍎 Junta los números sin i: ${a} + ${c}.`,
      `${a + c} + ${b + d}i. La parte real es ${a + c}.`, [[b + d, "Esa es la parte imaginaria."], [a + b + c + d, "Junta reales con reales, no todo."]]];
  if (level === 1) {
    const [p, q] = [a + c, b + d];
    return [`(${cx(p, q)}) − (${cx(c, d)}): parte imaginaria`, b, "Resta los complejos. ¿Cuál es la parte imaginaria del resultado?", `Resta los que tienen i: ${q} − ${d}.`,
      `${cx(a, b)}. La parte imaginaria es ${b}.`, [[a, "Esa es la parte real."], [q + d, `Es resta, no suma: ${q} − ${d}.`]]];
  }
  if (level === 2) {
    const k = pick(rng, [2, 4]);
    return [`i${sup(k)}`, k === 2 ? -1 : 1, `¿Cuánto vale i${sup(k)}? (Recuerda: i² = −1)`, "Usa i² = −1.", k === 2 ? "i² = −1." : "i⁴ = i² · i² = (−1) · (−1) = 1.",
      [[k === 2 ? 1 : -1, "Revisa los signos: i² = −1."]]];
  }
  const [p, q, r] = pick(rng, TRIPLES);
  return [`Módulo de ${p} + ${q}i`, r, `¿Cuál es el módulo de ${p} + ${q}i (su distancia al 0)?`, `√(${p}² + ${q}²).`, `√(${p * p} + ${q * q}) = ${r}.`,
    [[p + q, "No se suman directo: Pitágoras."], [r * r, "Falta la raíz."]]];
}

function complejosMult(rng, level) {
  const [a, b, c, d] = [int(rng, 1, 5), int(rng, 1, 4), int(rng, 1, 5), int(rng, 1, 4)];
  if (level <= 1) {
    const [re, im] = [a * c - b * d, a * d + b * c];
    const real = level === 0;
    return [`(${cx(a, b)})(${cx(c, d)}): parte ${real ? "real" : "imaginaria"}`, real ? re : im, `Multiplica. ¿Cuál es la parte ${real ? "real" : "imaginaria"} del resultado?`,
      `🔁 ${a * c} + ${a * d}i + ${b * c}i + ${b * d}i², y i² = −1.`, `${a * c} − ${b * d} + ${im}i = ${cx(re, im)}.`,
      real ? [[a * c, `Falta el i² = −1: ${a * c} − ${b * d}.`], [a * c + b * d, "i² es −1, no +1."]] : [[a * d, "Hay dos términos con i: súmalos."]]];
  }
  if (level === 2)
    return [`Conjugado de ${cx(a, b)}: parte imaginaria`, -b, `¿Cuál es la parte imaginaria del conjugado de ${cx(a, b)}?`, "El conjugado cambia el signo de la parte imaginaria.",
      `Conjugado: ${cx(a, -b)}. La parte imaginaria es −${b}.`, [[b, "El conjugado cambia el signo."], [-a, "Solo cambia la parte imaginaria."]]];
  return [`(${cx(a, b)})(${cx(a, -b)})`, a * a + b * b, "Multiplica un complejo por su conjugado.", `${a * a} − ${b * b}i², y i² = −1.`, `${a * a} + ${b * b} = ${a * a + b * b}.`,
    [[a * a - b * b, "i² = −1, así que −b²i² es positivo."]]];
}

function dispersion(rng, level) {
  if (level === 0) {
    const data = shuffle(rng, Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 5);
    const [mx, mn] = [Math.max(...data), Math.min(...data)];
    return [`Rango de ${data.join(", ")}`, mx - mn, "Calcula el rango.", "📏 Mayor menos menor.", `${mx} − ${mn} = ${mx - mn}.`, [[mx + mn, "Sumaste. Es la resta."]]];
  }
  if (level === 1) {
    // Datos simétricos alrededor del promedio: varianza entera.
    const m = int(rng, 4, 9);
    const devs = pick(rng, [[-2, 2, -1, 1], [-3, 3, -1, 1], [-2, 2, 0, 0], [-3, 3, -2, 2], [-1, 1, -1, 1]]);
    const data = devs.map((d) => m + d).sort((a, b) => a - b);
    const v = devs.reduce((s, d) => s + d * d, 0) / devs.length;
    return [`Varianza de ${data.join(", ")}`, v, `El promedio es ${m}. Calcula la varianza: el promedio de las diferencias al cuadrado.`, `Diferencias: ${devs.map(num).join(", ")}. Elévalas al cuadrado.`,
      `${devs.map((d) => d * d).join(" + ")} = ${v * 4}; ${v * 4} ÷ 4 = ${dec(v)}.`, [[v * 4, "Esa es la suma. Divide por los 4 datos."], [0, "Sin elevar al cuadrado, las diferencias se cancelan."]]];
  }
  if (level === 2) {
    const sd = int(rng, 1, 9);
    return [`Desviación estándar con varianza ${sd * sd}`, sd, `Si la varianza es ${sd * sd}, ¿cuál es la desviación estándar?`, "Es la raíz de la varianza.", `√${sd * sd} = ${sd}.`,
      [[sd ** 4, "Elevaste al cuadrado. Es la raíz."], [(sd * sd) / 2, "No es la mitad: es la raíz."]]];
  }
  const [lo, hi] = [int(rng, 1, 3), int(rng, 4, 8)];
  const aFirst = rng() < 0.5;
  const [sa, sb] = aFirst ? [lo, hi] : [hi, lo];
  return [`Curso A: desviación ${sa}; curso B: desviación ${sb}`, aFirst ? 1 : 2, `Dos cursos tienen el mismo promedio. El A tiene desviación estándar ${sa} y el B, ${sb}. ¿Cuál es más parejo? Responde 1 si es el A o 2 si es el B.`,
    "Menos desviación = datos más juntos.", `El ${aFirst ? "A" : "B"} (desviación ${lo}): sus datos están más cerca del promedio.`, [[aFirst ? 2 : 1, "Más desviación significa más repartido."]]];
}

function probabilidadCondicional(rng, level) {
  if (level === 0) {
    const total = int(rng, 6, 20);
    const both = int(rng, 1, total - 1);
    return [`Fútbol: ${total}; de ellos mujeres: ${both}`, both / total, `En un curso, ${total} estudiantes juegan fútbol y ${both} de ellos son mujeres. Si eliges a alguien que juega fútbol, ¿cuál es la probabilidad de que sea mujer? Responde como fracción.`,
      `🔍 Mira solo a los que juegan fútbol: ${total}.`, `${both} ÷ ${total} = ${both}/${total}.`, [[both / 40, "Dividiste por todo el curso. El total es solo los que juegan."]]];
  }
  if (level === 1) {
    const [cond, cases, face] = pick(rng, [["par", [2, 4, 6], 6], ["par", [2, 4, 6], 4], ["impar", [1, 3, 5], 5], ["mayor que 3", [4, 5, 6], 6], ["menor que 4", [1, 2, 3], 2]]);
    return [`Dado: ${face} sabiendo que salió ${cond}`, 1 / cases.length, `Lanzas un dado y te dicen que salió ${cond}. ¿Cuál es la probabilidad de que sea ${face}?`,
      `Ahora solo quedan ${cases.join(", ")}.`, `1 de ${cases.length}: 1/${cases.length}.`, [[1 / 6, "Ya sabes algo: solo quedan esos casos."]]];
  }
  if (level === 2) {
    // Totales con decimales exactos.
    const n = pick(rng, [10, 20, 25, 50, 100]);
    const k = int(rng, 1, n / 5);
    return [`Tabla: ${n} vacunados, ${k} enfermos`, k / n, `De ${n} personas vacunadas, ${k} se enfermaron. ¿Cuál es la probabilidad de enfermarse sabiendo que se vacunó?`, "Divide por los vacunados.",
      `${k} ÷ ${n} = ${dec(k / n)}.`, [[n / k, "Dividiste al revés."]]];
  }
  const [r, a] = [int(rng, 2, 4), int(rng, 1, 4)];
  return [`Fichas: ${r} rojas y ${a} azules, sin devolver`, (r - 1) / (r + a - 1), `Una caja tiene ${r} fichas rojas y ${a} azules. Sacas una roja y no la devuelves. ¿Cuál es la probabilidad de que la segunda sea roja? Responde como fracción.`,
    `Quedan ${r + a - 1} fichas: ¿cuántas rojas?`, `Quedan ${r - 1} rojas de ${r + a - 1}: ${r - 1}/${r + a - 1}.`, [[r / (r + a), "No la devolviste: hay una roja menos y una ficha menos."]]];
}

function modelosExpLog(rng, level) {
  if (level === 0) {
    const [start, n] = [pick(rng, [50, 100, 200, 300]), int(rng, 2, 5)];
    return [`${start} → ${start * 2 ** n} duplicando`, n, `Una colonia de ${start} bacterias se duplica cada hora. ¿En cuántas horas llega a ${pesos(start * 2 ** n)}?`,
      `📈 ${pesos(start * 2 ** n)} ÷ ${start} = ${2 ** n}. ¿Cuántas veces duplicas para llegar a ${2 ** n}?`, `2${sup(n)} = ${2 ** n}: ${n} horas.`,
      [[2 ** (n - 1), `Dividiste ${2 ** n} ÷ 2. Cuenta las duplicaciones.`]]];
  }
  if (level === 1) {
    const [a, b, t] = [pick(rng, [10, 20, 50, 100]), int(rng, 2, 4), int(rng, 2, 3)];
    return [`f(t) = ${a} · ${b}ᵗ; f(${t})`, a * b ** t, `Una población sigue f(t) = ${a} · ${b}ᵗ. ¿Cuánto vale después de ${t} períodos?`, `${b}${sup(t)} = ${b ** t}.`,
      `${a} · ${b ** t} = ${pesos(a * b ** t)}.`, [[a * b * t, `${b}${sup(t)} no es ${b} · ${t}.`], [(a * b) ** t, "Primero la potencia y después por " + a + "."]]];
  }
  if (level === 2) {
    const [m1, d] = [int(rng, 3, 6), int(rng, 1, 3)];
    return [`Richter: magnitud ${m1 + d} vs ${m1}`, 10 ** d, `En la escala de Richter, cada punto multiplica la amplitud por 10. ¿Cuántas veces mayor es la amplitud de un sismo de ${m1 + d} que uno de ${m1}?`,
      `Son ${d} punto${d > 1 ? "s" : ""}: ${Array(d).fill(10).join(" · ")}.`, `10${sup(d)} = ${pesos(10 ** d)} veces.`, [[10 * d, "Se multiplica por 10 en cada punto, no se suma."]].filter(([v]) => v !== 10 ** d)];
  }
  const k = int(rng, 2, 9);
  return [`pH con [H⁺] = 10⁻${sup(k)}`, k, `El pH es −log[H⁺]. Si [H⁺] = 10${sup(-k)}, ¿cuál es el pH?`, `log 10${sup(-k)} = −${k}.`, `pH = −(−${k}) = ${k}.`,
    [[-k, "El pH lleva un signo menos delante."]]];
}

function circunferenciaAngulos(rng, level) {
  if (level === 0) {
    const c = 2 * int(rng, 15, 85);
    return [`Del centro ${c}°: inscrito`, c / 2, `Un ángulo del centro mide ${c}°. ¿Cuánto mide un ángulo inscrito que abarca el mismo arco?`, "⭕ El inscrito es la mitad del del centro.",
      `${c} ÷ 2 = ${c / 2}°.`, [[c * 2, "Al revés: el inscrito es la mitad."]]];
  }
  if (level === 1) {
    const i = int(rng, 15, 85);
    return [`Inscrito ${i}°: del centro`, 2 * i, `Un ángulo inscrito mide ${i}°. ¿Cuánto mide el ángulo del centro que abarca el mismo arco?`, "El del centro es el doble.",
      `${i} · 2 = ${2 * i}°.`, [[i / 2, "Al revés: el del centro es el doble."]]];
  }
  if (level === 2)
    return ["Inscrito en un diámetro", 90, "Un ángulo inscrito abarca un diámetro (media circunferencia). ¿Cuánto mide?", "El ángulo del centro de un diámetro es 180°.",
      "180 ÷ 2 = 90°.", [[180, "Ese es el del centro. El inscrito es la mitad."]]];
  const [a, x] = [int(rng, 2, 9), int(rng, 2, 9)];
  const options = [2, 3, 4, 6].filter((v) => (v * x) % a === 0 && v !== a);
  if (!options.length) return circunferenciaAngulos(rng, level);
  const c = pick(rng, options);
  const b = (c * x) / a;
  if (b === x || b === c) return circunferenciaAngulos(rng, level);
  return [`Cuerdas: ${a} · ${b} = ${c} · x`, (a * b) / c, `Dos cuerdas se cortan. Una queda en trozos de ${a} y ${b}; la otra en trozos de ${c} y x. ¿Cuánto mide x?`, `${a} · ${b} = ${c} · x.`,
    `${a * b} = ${c}x → x = ${(a * b) / c}.`, [[a + b - c, "No se suma: los productos son iguales."], [a * b, `Ese es el producto. Divide por ${c}.`]]];
}

// Lote 9: 4° Medio.

function interesSimple(rng, level) {
  const P = 50000 * int(rng, 1, 8);
  if (level === 2) {
    const [r, m] = [int(rng, 1, 3), int(rng, 3, 12)];
    const month = (P * r) / 100;
    return [`Simple: $${pesos(P)} al ${r} % mensual por ${m} meses`, month * m, `Un préstamo de $${pesos(P)} cobra ${r} % de interés simple mensual. ¿Cuánto interés se paga en ${m} meses?`,
      `Interés de un mes: ${pesos(P)} · ${dec(r / 100)}.`, `${pesos(month)} por mes; ${pesos(month)} · ${m} = $${pesos(month * m)}.`, [[month, "Ese es un mes. Multiplica por los meses."]]];
  }
  if (level === 3) {
    const [r, t] = [int(rng, 2, 8), int(rng, 2, 6)];
    const year = (100000 * r) / 100;
    return [`Simple: $${pesos(year * t)} con $100.000 al ${r} %: ¿años?`, t, `¿Cuántos años necesitas para ganar $${pesos(year * t)} de interés simple con $100.000 al ${r} % anual?`,
      `Interés por año: ${pesos(year)}.`, `${pesos(year * t)} ÷ ${pesos(year)} = ${t} años.`, [[r, `${r} es la tasa. Divide el interés total por el de un año.`]]];
  }
  const [r, t] = [int(rng, 2, 8), int(rng, 2, 5)];
  const i = (P * r * t) / 100;
  if (level === 0)
    return [`Simple: $${pesos(P)} al ${r} % por ${t} años`, i, `Depositas $${pesos(P)} al ${r} % de interés simple anual. ¿Cuánto interés ganas en ${t} años?`,
      `💰 Interés de un año: ${pesos(P)} · ${dec(r / 100)}.`, `${pesos((P * r) / 100)} por año; · ${t} = $${pesos(i)}.`, [[(P * r) / 100, "Ese es un año."], [P + i, "Ese es el total. Pide solo el interés."]]];
  return [`Simple: $${pesos(P)} al ${r} % por ${t} años, total`, P + i, `Depositas $${pesos(P)} al ${r} % de interés simple anual. ¿Cuánto tienes en total después de ${t} años?`,
    `Interés por año: ${pesos((P * r) / 100)}. Después súmale el capital.`, `${pesos(i)} de interés; ${pesos(P)} + ${pesos(i)} = $${pesos(P + i)}.`, [[i, "Ese es solo el interés. Súmale el depósito."]]];
}

function interesCompuesto(rng, level) {
  const P = 50000 * int(rng, 1, 8);
  const r = pick(rng, [10, 20]);
  const f = 1 + r / 100;
  if (level === 3) {
    const simple = P * (1 + (3 * r) / 100);
    const comp = cents(P * f ** 3);
    return [`$${pesos(P)} al ${r} % por 3 años: compuesto − simple`, cents(comp - simple), `Con $${pesos(P)} al ${r} % anual por 3 años, ¿cuánto más da el interés compuesto que el simple?`,
      `Simple: ${pesos(simple)}. Compuesto: ${pesos(P)} · ${dec(f)} · ${dec(f)} · ${dec(f)}.`, `Compuesto ${pesos(comp)} − simple ${pesos(simple)} = $${pesos(cents(comp - simple))}.`,
      [[cents(comp - P), "Ese es el interés compuesto. Pide la diferencia con el simple."]]];
  }
  const total = cents(P * f * f);
  if (level === 1)
    return [`Compuesto: interés de $${pesos(P)} al ${r} % por 2 años`, cents(total - P), `Depositas $${pesos(P)} al ${r} % de interés compuesto anual. ¿Cuánto interés ganas en 2 años?`,
      `Total: ${pesos(P)} · ${dec(f)} · ${dec(f)}. Réstale el capital.`, `${pesos(total)} − ${pesos(P)} = $${pesos(cents(total - P))}.`,
      [[total, "Ese es el total. El interés es total menos capital."], [(P * 2 * r) / 100, "Eso sería interés simple."]]];
  return [`Compuesto: $${pesos(P)} al ${r} % por 2 años`, total, level === 0 ? `Depositas $${pesos(P)} al ${r} % de interés compuesto anual. ¿Cuánto tienes después de 2 años?` : `Una deuda de $${pesos(P)} crece ${r} % compuesto anual y no se paga nada en 2 años. ¿Cuánto se debe?`,
    `📈 Multiplica por ${dec(f)} dos veces.`, `${pesos(P)} → ${pesos(cents(P * f))} → ${pesos(total)}.`, [[P * (1 + (2 * r) / 100), "Eso es interés simple. En el compuesto, el segundo año el interés es sobre el monto nuevo."]]];
}

function logaritmoBase(rng, level) {
  if (level === 0) {
    const k = int(rng, 2, 7);
    return [`log ${10 ** k}`, k, "Calcula. Sin base escrita, la base es 10.", `🔟 Cuenta los ceros de ${pesos(10 ** k)}.`, `${pesos(10 ** k)} = 10${sup(k)}, así que el logaritmo es ${k}.`,
      [[10 ** (k - 1), "Dividiste por 10. Cuenta los ceros."], [k + 1, "Contaste también el 1. Solo los ceros."]]];
  }
  if (level === 1) {
    const [b, k] = pick(rng, [[4, 2], [4, 3], [6, 2], [7, 2], [8, 2], [9, 2], [6, 3]]);
    return [`log${SUB(b)} ${b ** k}`, k, `Calcula. Aquí la base es ${b}.`, `¿Cuántos ${b} multiplico para llegar a ${b ** k}?`, `${Array(k).fill(b).join(" · ")} = ${b ** k}: log${SUB(b)} ${b ** k} = ${k}.`,
      [[b ** k / b, `Dividiste ${b ** k} ÷ ${b}. Cuenta las veces.`]]];
  }
  if (level === 2) {
    const k = int(rng, 1, 4);
    const v = 10 ** -k;
    return [`log ${dec(Number(v.toFixed(k)))}`, -k, "Calcula. Sin base escrita, la base es 10.", `${dec(Number(v.toFixed(k)))} = 1/${pesos(10 ** k)} = 10${sup(-k)}.`, `log = −${k}.`,
      [[k, "Los números menores que 1 tienen logaritmo negativo."]]];
  }
  const [b, k] = pick(rng, [[2, 3], [2, 4], [3, 2], [5, 2], [2, 5], [3, 3]]);
  const [la, lb] = [Math.log10(b ** k), Math.log10(b)];
  const r3 = (x) => Math.round(x * 1000) / 1000;
  return [`log${SUB(b)} ${b ** k} = log ${b ** k} ÷ log ${b}`, k, `Tu calculadora dice log ${b ** k} ≈ ${dec(r3(la))} y log ${b} ≈ ${dec(r3(lb))}. Calcula log${SUB(b)} ${b ** k} con el cambio de base (redondea al entero).`,
    `Divide: log ${b ** k} ÷ log ${b}.`, `${dec(r3(la))} ÷ ${dec(r3(lb))} ≈ ${k}. Comprueba: ${b}${sup(k)} = ${b ** k}.`, [[r3(la - lb), "Restaste. El cambio de base divide."]]];
}

function numeroE(rng, level) {
  if (level === 0) {
    const k = int(rng, 2, 9);
    return [`ln(e${sup(k)})`, k, "Calcula. ln es el logaritmo en base e.", `🔁 ¿A qué exponente elevo e para obtener e${sup(k)}?`, `ln(e${sup(k)}) = ${k}.`,
      [[1, `ln(e) = 1, pero ln(e${sup(k)}) = ${k}.`]]];
  }
  if (level === 1)
    return ["ln 1", 0, "Calcula.", "¿A qué exponente elevo e para obtener 1?", "e⁰ = 1, así que ln 1 = 0.", [[1, "e¹ = e, no 1: ln 1 = 0."]]];
  if (level === 2) {
    const n = pick(rng, [2, 4]);
    const v = cents((1 + 1 / n) ** n);
    return [`(1 + 1/${n})${sup(n)}`, v, `Un banco paga 100 % al año, pero en ${n} partes iguales. ¿En cuánto se convierte $1 al año? Redondea a 2 decimales.`,
      `Cada parte se multiplica por ${dec(1 + 1 / n)}.`, `${dec(1 + 1 / n)} multiplicado ${n} veces ≈ ${dec(v)}.`, [[2, "Eso es con un solo pago."]]];
  }
  const k = pick(rng, [2, 3]);
  return [`e${sup(k)} con e ≈ 2,7`, cents(2.7 ** k), `Usa e ≈ 2,7 para calcular e${sup(k)}. Redondea a 2 decimales.`, `2,7 multiplicado ${k} veces.`, `${Array(k).fill("2,7").join(" · ")} = ${dec(cents(2.7 ** k))}.`,
    [[cents(2.7 * k), `e${sup(k)} es multiplicar e por sí mismo, no por ${k}.`]]];
}

function credito(rng, level) {
  if (level === 2) {
    const [a, b] = shuffle(rng, [18, 22, 25, 28, 32, 35, 40]).slice(0, 2);
    return [`CAE ${a} % vs ${b} %: ¿cuál conviene?`, Math.min(a, b), `Dos créditos iguales tienen CAE de ${a} % y ${b} %. Escribe la CAE del que conviene.`, "Menor CAE, crédito más barato.",
      `Conviene el de ${Math.min(a, b)} %.`, [[Math.max(a, b), "Una CAE mayor cuesta más."]]];
  }
  const n = pick(rng, [6, 10, 12, 24]);
  const loan = 10000 * int(rng, 5, 30);
  const extra = loan * pick(rng, [0.1, 0.2, 0.25, 0.3]);
  const cuota = (loan + extra) / n;
  if (!Number.isInteger(cuota)) return credito(rng, level);
  if (level === 1)
    return [`Costo $${pesos(extra)} de $${pesos(loan)}: %`, (extra * 100) / loan, `Si un crédito de $${pesos(loan)} costó $${pesos(extra)}, ¿qué porcentaje de lo prestado pagaste de más?`,
      `${pesos(extra)} de ${pesos(loan)}.`, `${pesos(extra)} ÷ ${pesos(loan)} = ${dec(extra / loan)} = ${(extra * 100) / loan} %.`, [[extra / loan, "Pásalo a porcentaje: por 100."]]];
  return [`${n} cuotas de $${pesos(cuota)} por $${pesos(loan)}`, extra, level === 3 ? `Una tienda vende algo de $${pesos(loan)} en ${n} cuotas de $${pesos(cuota)}. ¿Cuánto pagas de más?` : `Te prestan $${pesos(loan)} y pagas ${n} cuotas de $${pesos(cuota)}. ¿Cuánto te costó el crédito?`,
    `💳 Total pagado: ${n} · ${pesos(cuota)}. Réstale lo prestado.`, `${pesos(loan + extra)} − ${pesos(loan)} = $${pesos(extra)}.`, [[loan + extra, "Eso es todo lo pagado. El costo es lo que pagaste de más."]]];
}

function sueldoImpuestos(rng, level) {
  if (level <= 1) {
    const neto = 1000 * int(rng, 2, 50);
    const iva = (neto * 19) / 100;
    if (level === 0)
      return [`IVA de $${pesos(neto)}`, iva, `Un producto vale $${pesos(neto)} sin IVA. ¿Cuánto es el IVA (19 %)?`, `🧾 19 % de ${pesos(neto)}.`, `${pesos(neto)} · 0,19 = $${pesos(iva)}.`,
        [[neto + iva, "Ese es el precio con IVA. Pide solo el IVA."], [iva / 10, `19 % de ${pesos(neto)} es ${pesos(iva)}.`]]];
    return [`Precio con IVA de $${pesos(neto)} neto`, neto + iva, `Un producto vale $${pesos(neto)} neto. ¿Cuál es el precio final con IVA?`, "Multiplica por 1,19.", `${pesos(neto)} · 1,19 = $${pesos(neto + iva)}.`,
      [[iva, "Ese es solo el IVA. Súmalo."]]];
  }
  const bruto = 50000 * int(rng, 8, 30);
  if (level === 2)
    return [`Salud 7 % de $${pesos(bruto)}`, (bruto * 7) / 100, `Con un sueldo bruto de $${pesos(bruto)}, ¿cuánto se descuenta para salud (7 %)?`, `7 % de ${pesos(bruto)}.`, `${pesos(bruto)} · 0,07 = $${pesos((bruto * 7) / 100)}.`,
      [[(bruto * 7) / 1000, `7 % de ${pesos(bruto)} es ${pesos((bruto * 7) / 100)}.`]]];
  const d = pick(rng, [17, 18, 19, 20]);
  return [`Bruto $${pesos(bruto)}, descuentos ${d} %`, (bruto * (100 - d)) / 100, `Sueldo bruto $${pesos(bruto)}. Si los descuentos (AFP y salud) suman el ${d} %, ¿cuál es el sueldo líquido?`, `Quedas con el ${100 - d} %.`,
    `${pesos(bruto)} · ${dec((100 - d) / 100)} = $${pesos((bruto * (100 - d)) / 100)}.`, [[(bruto * d) / 100, "Esos son los descuentos. El líquido es lo que queda."]]];
}

function binomial(rng, level) {
  if (level === 0 || level === 2) {
    const n = level === 0 ? 3 : int(rng, 2, 4);
    const k = level === 0 ? 2 : n;
    const ways = fact(n) / (fact(k) * fact(n - k));
    return [`${n} monedas: ${level === 0 ? "exactamente 2 caras" : `${n} caras`}`, ways / 2 ** n, `Lanzas ${n} monedas. ¿Cuál es la probabilidad de ${level === 0 ? "exactamente 2 caras" : `${n} caras`}? Responde como fracción.`,
      `🪙 Cuenta los órdenes con ${k} caras. Total: ${2 ** n}.`, `${ways} de ${2 ** n} = ${ways}/${2 ** n}.`, level === 0 ? [[1 / 8, "Hay 3 órdenes con 2 caras (CCS, CSC, SCC), no 1."]] : [[0.5, `Cada moneda es 1/2, pero son ${n}: (1/2)${sup(n)}.`]]];
  }
  const [n, p] = level === 1 ? [10 * int(rng, 1, 5), pick(rng, [0.1, 0.2, 0.3, 0.4])] : [4 * int(rng, 3, 10), 0.25];
  return [`Esperanza: ${n} ${level === 1 ? "tiros" : "preguntas"}, p = ${dec(p)}`, cents(n * p), level === 1 ? `Un jugador acierta el ${Math.round(p * 100)} % de sus tiros. ¿Cuántos aciertos espera en ${n} tiros?` : `En una prueba de ${n} preguntas con 4 alternativas, alguien responde al azar. ¿Cuántas espera acertar?`,
    "n · p.", `${n} · ${dec(p)} = ${cents(n * p)}.`, [[n * p * 10, `${dec(p)} · ${n} = ${cents(n * p)}.`]]];
}

function normal(rng, level) {
  const [mu, sd] = pick(rng, [[170, 10], [50, 5], [100, 15], [60, 8]]);
  if (level === 0 || level === 2) {
    const k = level === 0 ? 1 : 2;
    return [`Promedio ${mu}, desv. ${sd}: % entre ${mu - k * sd} y ${mu + k * sd}`, k === 1 ? 68 : 95, `Una medida tiene promedio ${mu} y desviación estándar ${sd}. ¿Qué porcentaje está entre ${mu - k * sd} y ${mu + k * sd}?`,
      `🔔 Es ${k} desviación${k > 1 ? "es" : ""} a cada lado.`, `Entre −${k} y +${k} desviaciones está el ${k === 1 ? 68 : 95} %.`, [[k === 1 ? 95 : 68, "Cuenta cuántas desviaciones hay a cada lado."]]];
  }
  if (level === 1) {
    const z = pick(rng, [-2, -1, 1, 2, 3]);
    return [`z de ${mu + z * sd} con promedio ${mu} y desv. ${sd}`, z, `¿Cuál es el valor z de ${mu + z * sd} (promedio ${mu}, desviación ${sd})?`, `(${mu + z * sd} − ${mu}) ÷ ${sd}.`,
      `${num(z * sd)} ÷ ${sd} = ${num(z)}.`, [[z * sd, `Falta dividir por la desviación (${sd}).`]]];
  }
  return ["% sobre el promedio", 50, "En una distribución normal, ¿qué porcentaje de los datos está sobre el promedio?", "La campana es simétrica.", "La mitad: 50 %.",
    [[68, "La campana es simétrica: la mitad está sobre el promedio."]]];
}

function funcionPotencia(rng, level) {
  if (level === 0) {
    const [a, x] = [int(rng, 2, 5), int(rng, 2, 3)];
    return [`f(${x}) con f(x) = ${a}x³`, a * x ** 3, `Calcula f(${x}).`, `📈 Primero la potencia: ${x}³ = ${x ** 3}.`, `${a} · ${x ** 3} = ${a * x ** 3}.`,
      [[a * x * 3, `${x}³ no es ${x} · 3.`], [(a * x) ** 3, `Primero ${x}³ y después por ${a}.`]]];
  }
  if (level === 1) {
    const x = int(rng, 2, 9);
    return [`f(−${x}) con f(x) = x²`, x * x, `Calcula f(−${x}).`, `(−${x})² = (−${x}) · (−${x}).`, `(−${x}) · (−${x}) = ${x * x}.`,
      [[-x * x, "Menos por menos da más."], [-2 * x, `(−${x})² no es −${x} · 2.`]]];
  }
  if (level === 2) {
    const x = int(rng, 2, 4);
    return [`f(−${x}) con f(x) = x³`, -(x ** 3), `Calcula f(−${x}).`, `(−${x}) · (−${x}) · (−${x}).`, `${x * x} · (−${x}) = −${x ** 3}.`,
      [[x ** 3, "Son tres signos menos: queda negativo."]]];
  }
  const [x, k] = [int(rng, 2, 6), int(rng, 2, 6)];
  return [`f(${x}) con f(x) = ${x * k}/x`, k, `Calcula f(${x}) para f(x) = ${x * k} · x⁻¹ = ${x * k}/x.`, "x⁻¹ = 1/x.", `${x * k} ÷ ${x} = ${k}.`,
    [[x * x * k, "x⁻¹ es 1/x: divide."]]];
}

function funcionesTrigonometricas(rng, level) {
  if (level === 0) {
    const [ang, v, name] = pick(rng, [[90, 1, "sen"], [0, 0, "sen"], [270, -1, "sen"], [0, 1, "cos"], [180, -1, "cos"], [90, 0, "cos"]]);
    return [`${name} ${ang}°`, v, `¿Cuánto vale ${name} ${ang}°?`, "🎡 Piensa en la rueda: el seno es la altura y el coseno, el avance horizontal.", `${name} ${ang}° = ${num(v)}.`,
      [[ang, "El seno y el coseno van de −1 a 1."]]];
  }
  if (level === 1) {
    const A = int(rng, 2, 9);
    return [`Amplitud de ${A} · sen(x)`, A, `¿Cuál es la amplitud de f(x) = ${A} · sen(x)?`, "El número delante del seno.", `Sube hasta ${A} y baja hasta −${A}: amplitud ${A}.`,
      [[2 * A, "La amplitud es cuánto sube desde el centro."]]];
  }
  if (level === 2) {
    const [A, D] = [int(rng, 2, 4), int(rng, 5, 9)];
    const max = rng() < 0.5;
    return [`${max ? "Máximo" : "Mínimo"} de ${A} · sen(t) + ${D}`, max ? D + A : D - A, `Una marea sigue h(t) = ${A} · sen(t) + ${D} metros. ¿Cuál es la altura ${max ? "máxima" : "mínima"}?`,
      `El seno ${max ? "llega hasta 1" : "baja hasta −1"}.`, `${A} · ${max ? 1 : -1} + ${D} = ${max ? D + A : D - A} m.`, [[D, "Ese es el centro."]]];
  }
  const b = pick(rng, [2, 3, 4]);
  return [`Período de sen(${b}x)`, 360 / b, `¿Cuál es el período (en grados) de f(x) = sen(${b}x)?`, `El ${b} hace que vaya ${b} veces más rápido.`, `360° ÷ ${b} = ${360 / b}°.`,
    [[360 * b, "Al revés: va más rápido, se repite antes."]]];
}

// Lote 10: temas que faltaban y electivo de cálculo.

function talloHojas(rng, level) {
  const stem = int(rng, 1, 8);
  const leaves = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b);
  const row = `${stem} | ${leaves.join(" ")}`;
  const data = leaves.map((l) => stem * 10 + l);
  if (level === 0 || level === 2) {
    const max = level === 0;
    return [`${row}: ${max ? "mayor" : "menor"} dato`, max ? data[2] : data[0], `En la fila ${row}, ¿cuál es el dato ${max ? "mayor" : "menor"}?`,
      "🌿 El tallo es la decena y la hoja, la unidad.", `Los datos son ${data.join(", ")}.`, [[max ? leaves[2] : leaves[0], "La hoja sola es la unidad. Júntala con el tallo."], [stem, "Ese es el tallo."]]];
  }
  if (level === 1) {
    const a = int(rng, 1, 4);
    const b = int(rng, 1, 4);
    const r1 = `${stem} | ${shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, a).sort((x, y) => x - y).join(" ")}`;
    const r2 = `${stem + 1} | ${shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, b).sort((x, y) => x - y).join(" ")}`;
    return [`Tallos ${r1} y ${r2}: ¿cuántos datos?`, a + b, `Un diagrama tiene las filas ${r1} y ${r2}. ¿Cuántos datos hay en total?`, "Cuenta las hojas: cada una es un dato.",
      `${a} + ${b} = ${a + b} datos.`, [[2, "Esos son los tallos. Cada hoja es un dato."]]];
  }
  return [`Edades ${row}: mediana`, data[1], `Las edades de un grupo son ${row}. ¿Cuál es la mediana?`, `Los datos ordenados son ${data.join(", ")}.`,
    `El del medio es ${data[1]}.`, [[leaves[1], "Junta tallo y hoja."], [data[2], "Ese es el mayor."]]];
}

const TILES = [["Cuadrados", 90], ["Triángulos equiláteros", 60], ["Hexágonos", 120]];

function teselados(rng, level) {
  if (level <= 2) {
    const [name, ang] = TILES[level];
    return [`${name} en una esquina`, 360 / ang, `En un teselado de ${name.toLowerCase()} (ángulos de ${ang}°), ¿cuántas figuras se juntan en cada esquina?`, "🧱 Alrededor de un punto hay 360°.",
      `360 ÷ ${ang} = ${360 / ang}.`, [[360 / ang - 1, `Con ${360 / ang - 1} quedaría un hueco.`]]];
  }
  const [name, ang, k] = pick(rng, [["pentágono regular", 108, 3], ["octágono regular", 135, 2]]);
  return [`${name[0].toUpperCase() + name.slice(1)}: ¿falta o sobra?`, 360 - k * ang, `Un ${name} tiene ángulos de ${ang}°. Si juntas ${k} en una esquina, ¿cuántos grados faltan para completar 360°?`,
    `${k} · ${ang} = ${k * ang}.`, `360 − ${k * ang} = ${360 - k * ang}°.`, [[k * ang, "Esa es la suma. Lo que falta es la resta."]]];
}

function construcciones(rng, level) {
  if (level === 0) {
    const l = 2 * int(rng, 2, 15);
    return [`Simetral de ${l} cm`, l / 2, `La simetral corta un segmento de ${l} cm. ¿Cuánto mide cada parte?`, "📐 La simetral corta justo por la mitad.", `${l} ÷ 2 = ${l / 2} cm.`,
      [[l * 2, "La simetral divide en dos partes iguales."]]];
  }
  if (level === 1) {
    const a = 2 * int(rng, 15, 85);
    return [`Bisectriz de ${a}°`, a / 2, `La bisectriz parte un ángulo de ${a}°. ¿Cuánto mide cada parte?`, "La bisectriz divide el ángulo en dos iguales.", `${a} ÷ 2 = ${a / 2}°.`,
      [[a * 2, "La bisectriz divide, no duplica."]]];
  }
  if (level === 2)
    return ["Simetral: ¿ángulo con el segmento?", 90, "¿Qué ángulo forma la simetral con el segmento que corta?", "La simetral es perpendicular.", "Forma un ángulo recto: 90°.",
      [[180, "Perpendicular es una esquina recta: 90°."]]];
  const t = 3 * int(rng, 2, 8);
  return [`Transversal de ${t} cm: hasta el centro`, (2 * t) / 3, `Una transversal de gravedad mide ${t} cm. El centro de gravedad está a 2/3 desde el vértice. ¿A cuántos cm del vértice está?`,
    `2/3 de ${t}.`, `${t} ÷ 3 = ${t / 3}; · 2 = ${(2 * t) / 3} cm.`, [[t / 3, "Ese es 1/3. Desde el vértice son 2/3."], [t / 2, "No es la mitad: 2/3."]]];
}

const BOXES = [[3, 4, 12, 13], [2, 3, 6, 7], [1, 2, 2, 3], [2, 6, 9, 11], [4, 4, 7, 9], [2, 10, 11, 15], [6, 6, 7, 11]];

function pitagoras3d(rng, level) {
  if (level === 0) {
    const [a, b, c] = pick(rng, TRIPLES);
    return [`Piso de ${a} por ${b}: diagonal`, c, `El piso de una caja mide ${a} por ${b}. ¿Cuánto mide la diagonal del piso?`, `📦 Pitágoras: √(${a}² + ${b}²).`, `√(${a * a} + ${b * b}) = ${c}.`,
      [[a + b, "No se suman directo: Pitágoras."]]];
  }
  if (level === 3) {
    const a = int(rng, 1, 5);
    return [`Cubo de arista ${a}: diagonal²`, 3 * a * a, `En un cubo de arista ${a}, ¿cuánto vale el cuadrado de la diagonal?`, `${a}² + ${a}² + ${a}².`, `${a * a} · 3 = ${3 * a * a}.`,
      [[2 * a * a, "Ese es el de una cara. En el cubo son tres."]]];
  }
  const [a, b, c, d] = pick(rng, BOXES);
  return [`Caja ${a}, ${b} y ${c}: diagonal`, d, `¿Cuánto mide la diagonal de una caja de ${a}, ${b} y ${c}?`, `√(${a}² + ${b}² + ${c}²).`, `√(${a * a} + ${b * b} + ${c * c}) = √${d * d} = ${d}.`,
    [[a + b + c, "No se suman directo."], [d * d, "Falta la raíz."]]];
}

function graficosEnganosos(rng, level) {
  const a = int(rng, 40, 98);
  const d = int(rng, 1, 4);
  if (level === 0)
    return [`Barras ${a} y ${a + d}: diferencia`, d, `Un gráfico muestra la barra A en ${a} y la B en ${a + d}, y la B se ve mucho más alta. ¿Cuál es la diferencia real?`, "🔍 Resta los valores, no compares las alturas.",
      `${a + d} − ${a} = ${d}.`, [[a, "Resta los valores."]]];
  if (level === 1) {
    const base = a - int(rng, 1, 4);
    return [`Eje desde ${base}: altura de ${a}`, a - base, `En un gráfico el eje parte en ${base}. ¿Cuántas unidades de alto se dibuja una barra de ${a}?`, `La barra se dibuja desde ${base}.`,
      `${a} − ${base} = ${a - base}.`, [[a, `Se dibuja desde ${base}, no desde 0.`]]];
  }
  if (level === 2) {
    const [before, pct] = [pick(rng, [20, 40, 50, 80, 100, 200]), pick(rng, [5, 10, 20, 25])];
    const up = (before * pct) / 100;
    if (!Number.isInteger(up)) return graficosEnganosos(rng, level);
    return [`Ventas ${before} y ${before + up}: % de aumento`, pct, `Un gráfico muestra ventas de ${before} y ${before + up}, con barras que parecen triplicarse. ¿En qué porcentaje aumentaron de verdad?`,
      `Aumentó ${up} de ${before}.`, `${up} ÷ ${before} = ${pct} %.`, [[up, "Esa es la diferencia. Pásala a porcentaje."], [200, "Las barras engañan. Calcula con los números."]]];
  }
  return ["Eje que parte en: ¿qué valor es honesto?", 0, "Para que la altura de las barras se pueda comparar, ¿en qué valor debe partir el eje?", "Si parte en cero, la altura es proporcional al valor.",
    "En 0.", [[1, "Debe partir en 0."]]];
}

function euclides(rng, level) {
  const [p, q] = pick(rng, [[4, 9], [2, 8], [1, 9], [1, 4], [4, 16], [3, 12], [2, 18], [9, 16], [1, 16], [5, 20]]);
  const h = Math.sqrt(p * q);
  if (level <= 1)
    return [`p = ${p}, q = ${q}: altura`, h, `La altura parte la hipotenusa en trozos de ${p} y ${q}. ¿Cuánto mide la altura?`, "📐 altura² = p · q.", `altura² = ${p * q}, altura = ${h}.`,
      [[p * q, "Ese es altura². Saca la raíz."], [p + q, "No se suman: se multiplican."]]];
  if (level === 2) {
    const c = p + q;
    const cat = Math.sqrt(p * c);
    if (!Number.isInteger(cat)) return euclides(rng, level);
    return [`p = ${p}, c = ${c}: cateto`, cat, `Un trozo de la hipotenusa mide ${p} y la hipotenusa completa, ${c}. ¿Cuánto mide el cateto que está sobre ese trozo?`, "cateto² = p · c.",
      `cateto² = ${p * c}, cateto = ${cat}.`, [[p * c, "Ese es el cateto². Saca la raíz."]]];
  }
  return [`altura ${h}, p = ${p}: q`, q, `La altura mide ${h} y un trozo de la hipotenusa mide ${p}. ¿Cuánto mide el otro trozo?`, `${h}² = ${p} · q.`, `${h * h} = ${p}q, q = ${q}.`,
    [[h / p, `altura² es ${h * h}, no ${h}.`]]];
}

function rectaAjuste(rng, level) {
  if (level === 2) {
    const [x1, y1, m] = [int(rng, 0, 4), int(rng, 0, 6), int(rng, 1, 4)];
    const dx = int(rng, 1, 4);
    return [`Pendiente de (${x1}, ${y1}) a (${x1 + dx}, ${y1 + m * dx})`, m, `Una recta de ajuste pasa por (${x1}, ${y1}) y (${x1 + dx}, ${y1 + m * dx}). ¿Cuál es su pendiente?`,
      "Cuánto sube y ÷ cuánto avanza x.", `${m * dx} ÷ ${dx} = ${m}.`, [[1 / m, "Al revés: lo que sube ÷ lo que avanza."], [m * dx, "Falta dividir por lo que avanza x."]]];
  }
  if (level === 1) {
    const x = 2 * int(rng, 1, 6);
    const b = int(rng, 2, 4);
    return [`y = 0,5x + ${b} con x = ${x}`, x / 2 + b, `Nota y horas de estudio: y = 0,5x + ${b}. ¿Qué nota estimas para ${x} horas?`, `0,5 · ${x} + ${b}.`, `${x / 2} + ${b} = ${x / 2 + b}.`,
      [[0.5 + b, `0,5 · ${x} = ${x / 2}.`]]];
  }
  const [m, b, x] = [int(rng, 2, 5), level === 3 ? 0 : int(rng, 1, 9), int(rng, 2, 9)];
  return [`y = ${m}x${b ? ` + ${b}` : ""} con x = ${x}`, m * x + b, `La recta de ajuste es y = ${m}x${b ? ` + ${b}` : ""}. ¿Qué y estimas para x = ${x}?`, `Reemplaza x por ${x}.`,
    `${m} · ${x}${b ? ` + ${b}` : ""} = ${m * x + b}.`, [[m + x + b, `${m}x es ${m} · ${x}.`]]];
}

function probabilidadSociedad(rng, level) {
  if (level === 0) {
    const k = pick(rng, [2, 4, 5, 10, 20]);
    return [`1 de cada ${k} en %`, 100 / k, `Una noticia dice «1 de cada ${k} jóvenes hace deporte». ¿Qué porcentaje es?`, `📰 1 ÷ ${k}.`, `1 ÷ ${k} = ${dec(1 / k)} = ${100 / k} %.`,
      [[k, `1 de cada ${k} es 1 ÷ ${k}.`], [1 / k, "Pásalo a porcentaje."]]];
  }
  if (level === 1) {
    const [p, n] = [pick(rng, [1, 2, 3, 5]), pick(rng, [100, 200, 500, 1000])];
    return [`${p} % de ${n}`, (p * n) / 100, `Un riesgo es de ${p} %. ¿Cuántas personas de ${pesos(n)} se verían afectadas aproximadamente?`, `${p} de cada 100.`, `${pesos(n)} · ${dec(p / 100)} = ${(p * n) / 100}.`,
      [[p, `${p} % no son ${p} personas.`]]];
  }
  if (level === 2) {
    const [a, k] = [int(rng, 1, 5), int(rng, 2, 4)];
    return [`De ${a} % a ${a * k} %: ¿cuántas veces?`, k, `Un riesgo sube de ${a} % a ${a * k} %. ¿Cuántas veces mayor es ahora?`, `${a * k} ÷ ${a}.`, `${k} veces.`,
      [[a * k - a, `Sube ${a * k - a} puntos, pero es ${k} veces.`]]];
  }
  const p = 10 * int(rng, 1, 9);
  return [`${p} % de lluvia: no llueve`, 100 - p, `El pronóstico dice ${p} % de probabilidad de lluvia. ¿Cuál es la probabilidad (en %) de que no llueva?`, "Las dos suman 100 %.",
    `100 − ${p} = ${100 - p} %.`, [[p, "Esa es la de lluvia."]]];
}

function valorAbsoluto(rng, level) {
  if (level === 0) {
    const n = int(rng, 2, 30);
    return [`|−${n}|`, n, "Calcula el valor absoluto.", "📏 Es la distancia al cero.", `−${n} está a ${n} del cero.`, [[-n, "Una distancia nunca es negativa."]]];
  }
  if (level === 1) {
    const [a, b] = [int(rng, 1, 9), int(rng, 10, 20)];
    return [`|${a} − ${b}|`, b - a, "Calcula.", `Primero lo de adentro: ${a} − ${b}.`, `|−${b - a}| = ${b - a}.`, [[a - b, "El valor absoluto quita el signo."], [a + b, "Primero resta adentro."]]];
  }
  if (level === 2) {
    const [c, x] = [int(rng, 3, 9), int(rng, 0, 2)];
    return [`f(${x}) con f(x) = |x − ${c}|`, c - x, `Calcula f(${x}).`, `|${x} − ${c}|.`, `|${num(x - c)}| = ${c - x}.`, [[x - c, "El valor absoluto es positivo."]]];
  }
  const [first, next, h] = [pick(rng, [800, 1000, 1200]), pick(rng, [300, 400, 500]), int(rng, 2, 6)];
  return [`Estacionamiento: ${h} horas`, first + (h - 1) * next, `Un estacionamiento cobra $${pesos(first)} la primera hora y $${next} cada hora siguiente. ¿Cuánto pagas por ${h} horas?`,
    `Primer tramo: 1 hora. Segundo tramo: ${h - 1} horas más.`, `${pesos(first)} + ${h - 1} · ${next} = $${pesos(first + (h - 1) * next)}.`,
    [[first * h, "Solo la primera hora cuesta " + pesos(first) + "."], [first + h * next, `Después de la primera quedan ${h - 1} horas.`]]];
}

function composicion(rng, level) {
  const x = int(rng, 1, 5);
  const [a, b] = [int(rng, 1, 5), int(rng, 2, 4)];
  const defs = [
    [`f(x) = x + ${a}, g(x) = ${b}x: f(g(${x}))`, (v) => v + a, (v) => b * v, "f(g"],
    [`f(x) = x + ${a}, g(x) = ${b}x: g(f(${x}))`, (v) => v + a, (v) => b * v, "g(f"],
    [`f(x) = x², g(x) = x − ${a}: f(g(${x + a}))`, (v) => v * v, (v) => v - a, "f(g"],
    [`f(x) = ${b}x, g(x) = x + ${a}: f(g(${x}))`, (v) => b * v, (v) => v + a, "f(g"],
  ];
  const [expr, f, g, order] = defs[level];
  const input = level === 2 ? x + a : x;
  const right = order === "f(g" ? f(g(input)) : g(f(input));
  const wrong = order === "f(g" ? g(f(input)) : f(g(input));
  const inner = order === "f(g" ? "g" : "f";
  return [expr, right, `Calcula ${order}(${input})).`, `⚙️ Primero ${inner}(${input}), después la otra función.`, `${inner}(${input}) = ${order === "f(g" ? g(input) : f(input)}; resultado ${right}.`,
    [[wrong, "Aplicaste las funciones en el otro orden. Primero la de adentro."]]];
}

function limites(rng, level) {
  if (level === 0 || level === 3) {
    const [m, b, c] = [int(rng, 1, 5), int(rng, 1, 9), int(rng, 1, 6)];
    const lin = m === 1 ? "x" : `${m}x`;
    return [`lím x→${c} de (${lin} + ${b})`, m * c + b, "Calcula el límite.", `🎯 La función es continua: reemplaza x por ${c}.`, `${m} · ${c} + ${b} = ${m * c + b}.`,
      [[m * c, `Falta sumar ${b}.`]]];
  }
  if (level === 1) {
    const a = int(rng, 1, 6);
    return [`lím x→${a} de (x² − ${a * a})/(x − ${a})`, 2 * a, "Calcula el límite.", `Factoriza: x² − ${a * a} = (x − ${a})(x + ${a}).`, `Se cancela (x − ${a}): queda x + ${a} → ${2 * a}.`,
      [[0, "0 ÷ 0 no es 0: factoriza."], [a, `Queda x + ${a} con x → ${a}.`]]];
  }
  return ["lím x→∞ de 1/x", 0, "¿A qué se acerca 1/x cuando x crece sin parar?", "1/10, 1/100, 1/1.000…", "Se acerca a 0.", [[1, "1/x se hace cada vez más chico."]]];
}

function derivadas(rng, level) {
  if (level === 0) {
    const x = int(rng, 2, 9);
    return [`f(x) = x²: f'(${x})`, 2 * x, `Calcula la derivada de f(x) = x² en x = ${x}.`, "📈 La derivada de x² es 2x.", `f'(x) = 2x; f'(${x}) = ${2 * x}.`,
      [[x * x, `Ese es f(${x}).`], [x, "La derivada de x² es 2x, no x."]]];
  }
  if (level === 1) {
    const [m, b] = [int(rng, 2, 9), int(rng, 1, 9)];
    return [`f(x) = ${m}x + ${b}: f'(x)`, m, `¿Cuál es la derivada de f(x) = ${m}x + ${b}?`, `La derivada de ${m}x es ${m}; la de ${b} es 0.`, `f'(x) = ${m}.`,
      [[m + b, "La derivada de un número solo es 0."], [b, "La derivada de un número solo es 0."]]];
  }
  if (level === 2) {
    const [a, x] = [int(rng, 2, 5), int(rng, 1, 4)];
    return [`f(x) = ${a}x²: f'(${x})`, 2 * a * x, `Calcula f'(${x}) para f(x) = ${a}x².`, `f'(x) = ${a} · 2x = ${2 * a}x.`, `f'(${x}) = ${2 * a * x}.`,
      [[a * x, `Baja el 2 multiplicando: ${a} · 2x = ${2 * a}x.`], [a * x * x, `Ese es f(${x}).`]]];
  }
  const x = int(rng, 1, 4);
  return [`f(x) = x³: f'(${x})`, 3 * x * x, `Calcula f'(${x}) para f(x) = x³.`, "f'(x) = 3x².", `3 · ${x * x} = ${3 * x * x}.`, [[x ** 3, `Ese es f(${x}).`], [3 * x, "Es 3x², no 3x."]]];
}

const SUBS = (n) => String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);
const SUPS = (n) => String(n).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);

function integrales(rng, level) {
  if (level === 0) {
    const [c, b] = [int(rng, 2, 9), int(rng, 2, 9)];
    return [`∫${SUBS(0)}${SUPS(b)} ${c} dx`, c * b, `Calcula el área bajo f(x) = ${c} entre x = 0 y x = ${b}.`, `🟦 Es un rectángulo de alto ${c} y ancho ${b}.`, `${c} · ${b} = ${c * b}.`,
      [[c + b, "Es un rectángulo: alto por ancho."]]];
  }
  if (level <= 2) {
    const b = 2 * int(rng, 1, 5);
    return [`∫${SUBS(0)}${SUPS(b)} x dx`, (b * b) / 2, `Calcula el área bajo f(x) = x entre 0 y ${b}.`, `Es un triángulo de base ${b} y altura ${b}.`, `${b} · ${b} ÷ 2 = ${(b * b) / 2}.`,
      [[b * b, "Es un triángulo: falta dividir por 2."]]];
  }
  const [v, t] = [pick(rng, [40, 50, 60, 80, 90, 100]), int(rng, 2, 5)];
  return [`Velocidad ${v} km/h por ${t} h`, v * t, `Un auto va a ${v} km/h constante durante ${t} horas. ¿Qué distancia recorre? (Es el área bajo la velocidad.)`, `Rectángulo de alto ${v} y ancho ${t}.`,
    `${v} · ${t} = ${v * t} km.`, [[v + t, "Es un área: se multiplica."], [v / t, "Multiplica, no dividas."]]];
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
  "enteros-mult": enterosMult,
  "racionales-mult": racionalesMult,
  "variacion-porcentual": variacionPorcentual,
  "algebra-producto": algebraProducto,
  isometrias,
  cuartiles,
  "racionales-operatoria": racionalesOperatoria,
  "crecimiento-exponencial": crecimientoExponencial,
  "funcion-dos-variables": funcionDosVariables,
  "sectores-circulares": sectoresCirculares,
  cono,
  homotecia,
  tales,
  semejanza,
  "doble-entrada": dobleEntrada,
  "reglas-probabilidad": reglasProbabilidad,
  galton,
  "raices-simplificar": raicesSimplificar,
  "raices-enesimas": raicesEnesimas,
  logaritmos,
  "funcion-cuadratica": funcionCuadratica,
  "ecuacion-cuadratica": ecuacionCuadratica,
  "funcion-inversa": funcionInversa,
  "cambio-porcentual": cambioPorcentual,
  esfera,
  trigonometria,
  vectores,
  "variable-aleatoria": variableAleatoria,
  permutaciones,
  complejos,
  "complejos-mult": complejosMult,
  dispersion,
  "probabilidad-condicional": probabilidadCondicional,
  "modelos-exp-log": modelosExpLog,
  "circunferencia-angulos": circunferenciaAngulos,
  "interes-simple": interesSimple,
  "interes-compuesto": interesCompuesto,
  "logaritmo-base": logaritmoBase,
  "numero-e": numeroE,
  credito,
  "sueldo-impuestos": sueldoImpuestos,
  binomial,
  normal,
  "funcion-potencia": funcionPotencia,
  "funciones-trigonometricas": funcionesTrigonometricas,
  "tallo-hojas": talloHojas,
  teselados,
  construcciones,
  "pitagoras-3d": pitagoras3d,
  "graficos-enganosos": graficosEnganosos,
  euclides,
  "recta-ajuste": rectaAjuste,
  "probabilidad-sociedad": probabilidadSociedad,
  "valor-absoluto": valorAbsoluto,
  composicion,
  limites,
  derivadas,
  integrales,
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
