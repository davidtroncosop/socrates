import test from "node:test";
import assert from "node:assert/strict";
import {
  parseNumber,
  isCorrect,
  solveLinear,
  loadState,
  lessons,
  getSubject,
  compressImage,
} from "./learning.js";
test("accepts equivalent numeric answers without executing expressions", () => {
  for (const raw of ["7", "x = 7", "14/2", "7,0"]) assert.ok(isCorrect(raw, 7));
  assert.equal(parseNumber("1/0"), null);
  assert.equal(parseNumber("2+5"), null);
  assert.equal(parseNumber("alert(1)"), null);
  assert.equal(parseNumber(""), null);
  assert.ok(isCorrect("−2", -2));
});
test("solves supported linear equations and distinguishes degenerate cases", () => {
  assert.equal(solveLinear("2x + 3 = 15").answer, 6);
  assert.equal(solveLinear("4x + 2 = 2x + 18").answer, 8);
  assert.equal(solveLinear("-3x + 6 = 12").answer, -2);
  assert.equal(solveLinear("x = x").kind, "infinite");
  assert.equal(solveLinear("x + 1 = x + 2").kind, "none");
  assert.equal(solveLinear("0.5x = 2").answer, 4);
});
test("unsupported syntax is rejected instead of silently misinterpreted", () => {
  for (const raw of [
    "2(x+1)=4",
    "x^2=4",
    "x/2=3",
    "xx=3",
    "2xx=3",
    "2x3=6",
    "1/2x=3",
    "x++2=3",
    "=2",
    "2=",
  ])
    assert.equal(solveLinear(raw), null, raw);
});
test("corrupt or unavailable storage does not prevent startup", () => {
  for (const getItem of [
    () => "{",
    () => null,
    () => {
      throw Error("denied");
    },
    () =>
      JSON.stringify({
        version: 1,
        completed: ["bad"],
        mastered: null,
        notes: [null],
        reviews: [{}],
        attempts: [null],
      }),
  ]) {
    const s = loadState({ getItem });
    assert.deepEqual(s.completed, []);
    assert.deepEqual(s.notes, []);
  }
});
test("curated linear questions have the declared answers", () => {
  for (const l of lessons)
    for (const q of l.questions) {
      const result = solveLinear(q[0]);
      if (result?.kind === "unique")
        assert.ok(Math.abs(result.answer - q[1]) < 1e-8, q[0]);
    }
});
test("correctly differentiates between matematica and lenguaje", () => {
  assert.equal(getSubject(lessons[0]), "matematica");
  assert.equal(
    getSubject({
      id: "lectura-narraciones",
      title: "7° Básico · Comprender una narración",
      description: "LE07 OA 03 · Comprensión lectora",
    }),
    "lenguaje",
  );
  assert.equal(
    getSubject({
      id: "porcentajes",
      title: "7° Básico · Porcentajes",
      description: "MA07 OA 04 · Números",
    }),
    "matematica",
  );
  assert.equal(getSubject({ subject: "lenguaje" }), "lenguaje");
  assert.equal(getSubject({ subject: "matematica" }), "matematica");
  assert.equal(getSubject(null), "matematica");
});

test("loadState preserves handwritten photo notes and sanitizes invalid notes", () => {
  const photoData = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
  const s = loadState({
    getItem: () =>
      JSON.stringify({
        version: 1,
        completed: [],
        mastered: [],
        reviews: [],
        attempts: [],
        notes: [
          {
            title: "2x + 3 = 15",
            text: "Desarrollo a mano",
            at: 123456,
            image: photoData,
          },
          { title: "Solo texto", text: "Paso a paso", at: 123457 },
          { title: "Sin texto", at: 123458 },
        ],
      }),
  });
  assert.equal(s.notes.length, 2);
  assert.equal(s.notes[0].image, photoData);
  assert.equal(s.notes[0].title, "2x + 3 = 15");
  assert.equal(s.notes[1].image, undefined);
});

test("compressImage returns null gracefully in non-browser environments", async () => {
  const res = await compressImage(null);
  assert.equal(res, null);
});
