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
function baseAnswer(expr) {
  let m;
  if ((m = expr.match(/^¿Cuánto vale el (\d) en (\d+)\?$/))) return m[1] * 10 ** [...m[2]].reverse().indexOf(m[1]);
  if ((m = expr.match(/^¿En cuántas partes se corta la pizza en \d+\/(\d+)\?$/))) return Number(m[1]);
  if ((m = expr.match(/^(\d+)\/(\d+) de (\d+)$/))) return (m[1] / m[2]) * m[3];
  if ((m = expr.match(/^1\/2 = \?\/(\d+)$/))) return m[1] / 2;
  if ((m = expr.match(/^([\d,]+) m = \? cm$/))) return Math.round(Number(m[1].replace(",", ".")) * 100);
  if ((m = expr.match(/^(\d+) láminas ÷ (\d+) amigos$/))) return m[1] % m[2];
  return null;
}
function checkAnswer(id, [expr, answer]) {
  const base = baseAnswer(expr);
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
        assert.ok(Number.isInteger(id === "base-decimales" ? Math.round(q[1] * 100) : q[1]) && Math.abs(q[1] * 100 - Math.round(q[1] * 100)) < 1e-6, `${id}: ${q[0]} → ${q[1]}`);
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
