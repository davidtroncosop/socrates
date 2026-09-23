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
} from "../public/learning.js";
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

test("merging two devices keeps all work and takes mastery from the latest activity", async () => {
  const { mergeStates, withoutPhotos } = await import("../public/learning.js");
  const base = { version: 1, diagnosed: false, completed: [], mastered: [], attempts: [], notes: [], reviews: [] };
  const phone = {
    ...base,
    diagnosed: true,
    completed: ["equations"],
    mastered: ["equations"],
    attempts: [{ lesson: "equations", correct: true, hints: 0, at: 100 }],
    notes: [{ title: "a", text: "foto", at: 100, image: "data:x" }],
    reviews: [{ lesson: "equations", due: 900 }],
  };
  const laptop = {
    ...base,
    completed: ["signs"],
    attempts: [
      { lesson: "equations", correct: true, hints: 0, at: 100 },
      { lesson: "signs", correct: false, hints: 1, at: 200 },
    ],
    notes: [{ title: "a", text: "foto", at: 100 }, { title: "b", text: "t", at: 200 }],
    reviews: [{ lesson: "signs", due: 300 }],
  };
  const merged = mergeStates(phone, laptop);
  assert.equal(merged.diagnosed, true);
  assert.deepEqual(merged.completed, ["equations", "signs"]);
  assert.deepEqual(merged.mastered, [], "laptop activity is newer");
  assert.equal(merged.attempts.length, 2);
  assert.deepEqual(merged.notes.map((n) => n.title), ["b", "a"]);
  assert.equal(merged.notes[1].image, "data:x", "local photo survives");
  assert.deepEqual(merged.reviews.map((r) => r.lesson).sort(), ["equations", "signs"]);
  assert.equal(mergeStates(phone, null), phone);
  assert.equal("image" in withoutPhotos(phone).notes[0], false);
  assert.equal(phone.notes[0].image, "data:x", "original untouched");
});

test("each account reads its own progress key", () => {
  const values = new Map([
    ["socatres.v1", JSON.stringify({ version: 1, completed: ["equations"] })],
  ]);
  const store = { getItem: (k) => values.get(k) ?? null };
  assert.deepEqual(loadState(store).completed, ["equations"]);
  assert.deepEqual(loadState(store, undefined, "socatres.v1.u1").completed, []);
});

test("alternatives are reshuffled without losing the correct one", async () => {
  const { shuffleAlternatives, isMultipleChoice } = await import("../public/learning.js");
  const q = ["Un texto.\n\n1. Primera\n2. Correcta\n3. Tercera", 2, "Elige", "pista", "expl"];
  const seen = new Set();
  for (let i = 0; i < 200; i++) {
    const [text, answer, ...rest] = shuffleAlternatives(q);
    const lines = text.split("\n");
    assert.equal(lines[0], "Un texto.");
    assert.deepEqual(lines.slice(2).map((l) => l.slice(0, 2)), ["1.", "2.", "3."]);
    assert.equal(lines.find((l) => l.startsWith(answer + ".")), `${answer}. Correcta`);
    assert.deepEqual(rest, ["Elige", "pista", "expl"]);
    seen.add(answer);
  }
  assert.deepEqual([...seen].sort(), [1, 2, 3], "the correct option moves around");
  assert.equal(isMultipleChoice(q), true);
  const math = ["2x + 3 = 15", 6, "a", "b", "c"];
  assert.equal(shuffleAlternatives(math), math);
  assert.equal(isMultipleChoice(math), false);
});
