import test from "node:test";
import assert from "node:assert/strict";
import { diagnoseMistake, parseMistakes, formatMistakes } from "../public/mistakes.js";
import { generators, generateQuestions } from "../public/generators.js";

const q = (expr, answer, mistakes) => [expr, answer, "i", "p", "e", ...(mistakes ? [mistakes] : [])];

test("linear equations get specific feedback for predictable mistakes", () => {
  assert.match(diagnoseMistake(q("2x + 3 = 15", 6), "12"), /falta el último paso: divide ambos lados entre 2/);
  assert.match(diagnoseMistake(q("3x = 18", 6), "54"), /Multiplicaste por 3/);
  assert.match(diagnoseMistake(q("2x + 3 = 15", 6), "9"), /para deshacer una suma se resta/);
  assert.match(diagnoseMistake(q("4x − 5 = 23", 7), "4,5"), /una resta se suma/);
  assert.match(diagnoseMistake(q("−2(x − 3) = 10", -2), "2"), /signo contrario/);
  assert.equal(diagnoseMistake(q("2x + 3 = 15", 6), "6"), null, "correct answers get no correction");
  assert.equal(diagnoseMistake(q("2x + 3 = 15", 6), "100"), null, "unknown mistakes fall back");
  assert.equal(diagnoseMistake(q("2x + 3 = 15", 6), "hola"), null);
});

test("declared mistakes win over generic detectors", () => {
  const item = q("Texto\n\n1. a\n2. b\n3. c", 2, [[1, "Esa idea no aparece en el texto."], [-2, "Mensaje propio."]]);
  assert.equal(diagnoseMistake(item, "1"), "Esa idea no aparece en el texto.");
  assert.equal(diagnoseMistake(item, "−2"), "Mensaje propio.");
});

test("authors write mistakes as «answer: message» lines", () => {
  const list = parseMistakes("−7: Revisa el signo.\n9: Falta dividir: entre 2.\n\n");
  assert.deepEqual(list, [[-7, "Revisa el signo."], [9, "Falta dividir: entre 2."]]);
  assert.deepEqual(parseMistakes(formatMistakes(list)), list);
  assert.deepEqual(parseMistakes(formatMistakes(list, " | ")), list);
  assert.deepEqual(parseMistakes(""), []);
  assert.throws(() => parseMistakes("sin respuesta"), /respuesta: mensaje/);
  assert.throws(() => parseMistakes("7:"), /respuesta: mensaje/);
});

test("generated exercises carry mistakes that never equal the answer", () => {
  let withFeedback = 0;
  for (const id of Object.keys(generators))
    for (let i = 0; i < 100; i++)
      for (const item of generateQuestions(id, [0, 1, 2, 3])) {
        for (const [value, message] of item[5] ?? []) {
          assert.notEqual(value, item[1], `${id}: ${item[0]}`);
          assert.ok(message.length > 10);
          assert.equal(diagnoseMistake(item, String(value)), message);
        }
        if (item[5]?.length) withFeedback++;
      }
  assert.ok(withFeedback > 2000, "most generated items explain at least one mistake");
  const [pct] = generateQuestions("porcentajes", [0]);
  const [p, base] = pct[0].split(" % de ").map(Number);
  assert.match(diagnoseMistake(pct, String(p * base)), /dividir entre 100/);
});
