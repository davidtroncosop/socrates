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
    .replace(/(\d)\s*(x|\()/g, "$1*$2")
    .replace(/\)\s*\(/g, ")*(")
    .replace(/(^|[^\w)])-x/g, "$1-1*x");
const evaluate = (expr, x) => Function("x", `return (${js(expr)});`)(x);

function checkAnswer(id, [expr, answer]) {
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
        assert.ok(Number.isInteger(q[1]), `${id}: ${q[0]} → ${q[1]}`);
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
