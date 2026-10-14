import test from "node:test";
import assert from "node:assert/strict";
import { generators, generateQuestions } from "../public/generators.js";
import { validateCatalog } from "../public/content.js";

// Solo para pruebas: convierte la notación escolar a JavaScript y evalúa.
const js = (expr) =>
  expr
    .replace(/−/g, "-")
    .replace(/[·×]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/²/g, "**2")
    .replace(/³/g, "**3")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/(\d)\s*(x|\()/g, "$1*$2")
    .replace(/\)\s*\(/g, ")*(")
    .replace(/(^|[^\w)])-x/g, "$1-1*x");
const evaluate = (expr, x) => Function("x", `return (${js(expr)});`)(x);

// Preguntas de las bases escritas con palabras.
function baseAnswer(expr, id) {
  let m;
  if ((m = expr.match(/^¿Cuánto vale el (\d) en (\d+)\?$/))) return m[1] * 10 ** [...m[2]].reverse().indexOf(m[1]);
  if ((m = expr.match(/^¿En cuántas partes se corta la pizza en \d+\/(\d+)\?$/))) return Number(m[1]);
  if ((m = expr.match(/^(\d+)\/(\d+) de (\d+)$/))) return (m[1] / m[2]) * m[3];
  if ((m = expr.match(/^1\/2 = \?\/(\d+)$/))) return m[1] / 2;
  if ((m = expr.match(/^([\d,]+) m = \? cm$/))) return Math.round(Number(m[1].replace(",", ".")) * 100);
  if ((m = expr.match(/^(\d+) láminas ÷ (\d+) amigos$/))) return m[1] % m[2];
  // Dividir por una fracción: la fracción va completa (no de izquierda a derecha).
  if ((m = expr.match(/^(\d+)(?:\/(\d+))? ÷ (\d+)\/(\d+)$/))) return (m[1] / (m[2] ?? 1)) / (m[3] / m[4]);
  // Lote 1: se recalcula cada respuesta de forma independiente.
  const ordinals = ["primer", "segundo", "tercer", "cuarto", "quinto", "sexto", "séptimo", "octavo"];
  if ((m = expr.match(/^¿Cuál es el (\S+) múltiplo de (\d+)\?$/))) return (ordinals.indexOf(m[1]) + 1) * m[2];
  if ((m = expr.match(/^¿Cuántos divisores tiene el (\d+)\?$/))) return Array.from({ length: +m[1] }, (_, i) => i + 1).filter((d) => m[1] % d === 0).length;
  const prime = (n) => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d);
  if ((m = expr.match(/^¿Cuál es el único número primo entre (\d+) y (\d+)\?$/))) {
    const found = Array.from({ length: m[2] - m[1] - 1 }, (_, i) => +m[1] + 1 + i).filter(prime);
    assert.equal(found.length, 1, expr);
    return found[0];
  }
  if ((m = expr.match(/^Buses cada (\d+) y cada (\d+) minutos$/))) {
    let t = 1;
    while (t % m[1] || t % m[2]) t++;
    return t;
  }
  const nums = (text) => text.split(/, | y /).map(Number);
  if ((m = expr.match(/^Promedio de (.+)$/))) return nums(m[1]).reduce((a, b) => a + b, 0) / nums(m[1]).length;
  if ((m = expr.match(/^Mediana de (.+)$/))) return [...nums(m[1])].sort((a, b) => a - b)[Math.floor(nums(m[1]).length / 2)];
  if ((m = expr.match(/^Moda de (.+)$/))) {
    const counts = new Map();
    for (const v of nums(m[1])) counts.set(v, (counts.get(v) ?? 0) + 1);
    const top = Math.max(...counts.values());
    const modes = [...counts].filter(([, c]) => c === top);
    assert.equal(modes.length, 1, `${expr}: una sola moda`);
    return modes[0][0];
  }
  if ((m = expr.match(/^Rectángulo de (\d+) cm por (\d+) cm$/))) return m[1] * m[2];
  if ((m = expr.match(/^Paralelogramo: base (\d+) cm, altura (\d+) cm$/))) return m[1] * m[2];
  if ((m = expr.match(/^Triángulo: base (\d+) c?m, altura (\d+) c?m$/))) return (m[1] * m[2]) / 2;
  // Lote 2.
  if ((m = expr.match(/^√(\d+)$/))) return Math.sqrt(m[1]);
  if ((m = expr.match(/^Entero más cercano a √(\d+)$/))) {
    assert.ok(!Number.isInteger(Math.sqrt(m[1])), expr);
    return Math.round(Math.sqrt(m[1]));
  }
  if ((m = expr.match(/^Cuadrado de (\d+) m²$/))) return Math.sqrt(m[1]);
  if ((m = expr.match(/^Caja de (\d+) cm, (\d+) cm y (\d+) cm$/))) return m[1] * m[2] * m[3];
  if ((m = expr.match(/^Prisma: base de (\d+) cm², altura (\d+) cm$/))) return m[1] * m[2];
  if ((m = expr.match(/^Prisma triangular: triángulo de base (\d+) cm y altura (\d+) cm, largo (\d+) cm$/))) return (m[1] * m[2] * m[3]) / 2;
  if ((m = expr.match(/^Cilindro: radio (\d+) cm, altura (\d+) cm$/))) return 3.14 * m[1] * m[1] * m[2];
  if (id === "combinatoria") {
    if ((m = expr.match(/^Candado: (\d+) ruedas con (\d+) números$/))) return m[2] ** m[1];
    return expr.match(/\d+/g).reduce((a, b) => a * b, 1);
  }
  if ((m = expr.match(/^(\d+)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)))
    return m[1] ** Number(m[2].replace("⁻", "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)));
  return null;
}

// Sistemas 2×2: resuelve por determinantes y devuelve el valor de cada letra.
function solveSystem(expr) {
  const letters = [...new Set(expr.match(/[a-z]/g))];
  const coefs = expr.split(" ; ").map((eq) => {
    const [left, right] = eq.split(" = ");
    const f = (a, b) => Function(...letters, `return (${js(left).replace(/(\d)([a-z])/g, "$1*$2")});`)(a, b);
    return [f(1, 0) - f(0, 0), f(0, 1) - f(0, 0), Number(right) - f(0, 0)];
  });
  const [[a, b, c], [d, e, f]] = coefs;
  const det = a * e - b * d;
  assert.notEqual(det, 0, expr);
  return { [letters[0]]: (c * e - b * f) / det, [letters[1]]: (a * f - c * d) / det };
}
function checkAnswer(id, [expr, answer, prompt]) {
  if (id === "sistemas") {
    const values = solveSystem(expr);
    const asked = prompt.match(/^Encuentra (\w)\.$/)?.[1] ?? "c";
    return assert.equal(values[asked], answer, `${id}: ${expr} → ${asked}`);
  }
  const base = baseAnswer(expr, id);
  if (base !== null) return assert.ok(Math.abs(base - answer) < 1e-9, `${id}: ${expr} ≠ ${answer}`);
  if (id === "base-decimales") expr = expr.replace(/(\d),(\d)/g, "$1.$2");
  if (/ % de /.test(expr)) {
    const [p, base] = expr.split(" % de ").map(Number);
    return assert.equal(answer, (p * base) / 100, expr);
  }
  if (/^Catetos|^Hipotenusa|cuadernos|^En |^Si x|^f\(/.test(expr)) return;
  if (expr.includes("=")) {
    const [left, right] = expr.replace(/ y f\(x\)/, " =").replace(/^f\(x\) = /, "").split(" = ");
    const diff = evaluate(left, answer) - evaluate(right, answer);
    return assert.ok(Math.abs(diff) < 1e-9, `${id}: ${expr} con x = ${answer}`);
  }
  assert.ok(Math.abs(evaluate(expr, 1) - answer) < 1e-9, `${id}: ${expr} ≠ ${answer}`);
}

test("every generator yields valid, exact questions at every level", () => {
  let seed = 1;
  const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (const id of Object.keys(generators))
    for (let run = 0; run < 150; run++) {
      const questions = generateQuestions(id, [0, 1, 2, 3], rng);
      validateCatalog({
        version: 1,
        lessons: [
          {
            id: "prueba",
            title: "t",
            description: "d",
            concept: "c",
            examples: "e",
            status: "draft",
            questions,
            review: questions[3],
          },
        ],
      });
      for (const q of questions) {
        // Respuestas exactas: enteros, salvo la lección de decimales (hasta centésimas).
        // Respuestas exactas: enteros, salvo decimales (hasta centésimas) y fracciones.
        if (id.startsWith("fracciones-") || id === "potencias-negativas") assert.ok(q[1] > 0 && Number.isFinite(q[1]), `${id}: ${q[0]} → ${q[1]}`);
        else assert.ok(Math.abs(q[1] * 100 - Math.round(q[1] * 100)) < 1e-6 && (id === "base-decimales" || id === "volumen" || Number.isInteger(q[1])), `${id}: ${q[0]} → ${q[1]}`);
        assert.doesNotMatch(q.join(" "), /NaN|undefined|\+ -|--/, id);
        checkAnswer(id, q);
      }
    }
});

test("function and notable-product generators match their definitions", () => {
  for (let i = 0; i < 100; i++) {
    const [image, inverse] = generateQuestions("funcion", [0, 3]);
    const [, k, rule] = image[0].match(/^f\((−?\d+)\) con f\(x\) = (.+)$/);
    assert.equal(evaluate(rule, Number(k.replace("−", "-"))), image[1]);
    const [, f, y] = inverse[0].match(/^f\(x\) = (.+) y f\(x\) = (.+)$/);
    assert.equal(evaluate(f, inverse[1]), Number(y.replace("−", "-")));
    const [mid, free, diff, sub] = generateQuestions("notables", [0, 1, 2, 3]);
    const a = Number(mid[0].match(/\+ (\d+)/)[1]);
    assert.equal(mid[1], 2 * a);
    assert.equal(free[1], Number(free[0].match(/− (\d+)/)[1]) ** 2);
    assert.equal(diff[1], -(Number(diff[0].match(/\+ (\d+)/)[1]) ** 2));
    const [, x, b] = sub[0].match(/x = (\d+).*\(x \+ (\d+)\)/).map(Number);
    assert.equal(sub[1], (x + b) ** 2 - (x - b) ** 2);
  }
});

test("lessons without a generator fall back to curated content", () => {
  assert.equal(generateQuestions("lectura-narraciones", [0]), null);
});
