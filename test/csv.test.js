import test from "node:test";
import assert from "node:assert/strict";
import { parseCSV, importCSV, exportCSV } from "../public/csv.js";
import { seedCatalog } from "../public/content.js";
test("CSV round trips all lesson fields, accents, quotes, multiline and negative math", () => {
  const c = seedCatalog();
  c.lessons[0].title = 'Álgebra; "inicial"';
  c.lessons[0].concept = "Primera línea\nSegunda línea";
  const result = importCSV(exportCSV(c));
  assert.deepEqual(result, {
    ...c,
    lessons: c.lessons.map((l) => ({ ...l, status: "draft" })),
  });
});
test("CSV accepts comma, semicolon and tab delimiters with quoted separators", () => {
  assert.deepEqual(parseCSV('a,b\n"uno,dos",3'), [
    ["a", "b"],
    ["uno,dos", "3"],
  ]);
  assert.deepEqual(parseCSV('a;b\n"uno;dos";3'), [
    ["a", "b"],
    ["uno;dos", "3"],
  ]);
  assert.deepEqual(parseCSV("a\tb\nuno\t3"), [
    ["a", "b"],
    ["uno", "3"],
  ]);
  assert.throws(() => parseCSV('a,b\n"oops,3'), /cerrar/);
});
test("CSV rejects wrong columns, missing exercises, duplicate orders, invalid answers", () => {
  const csv = exportCSV(seedCatalog());
  assert.throws(() => importCSV("bad;header\none;two"), /columnas/);
  assert.throws(
    () => importCSV(csv.replace('"respuesta"', '"incorrecto"')),
    /respuesta/,
  );
  const rows = csv.split("\r\n");
  assert.throws(() => importCSV(rows.slice(0, 3).join("\r\n")));
  assert.throws(() => importCSV([...rows, rows[1]].join("\r\n")), /repetido/);
  assert.throws(
    () => importCSV(csv.replace('"7"', '"not-a-number"')),
    /Fila 2/,
  );
});
test("spreadsheet formula-like text is exported as literal text", () => {
  const c = seedCatalog();
  c.lessons[0].title = '=HYPERLINK("evil")';
  assert.match(exportCSV(c), /'=HYPERLINK/);
  assert.equal(importCSV(exportCSV(c)).lessons[0].title, c.lessons[0].title);
});

test("CSV carries subject and grade, accepts labels and older templates without them", () => {
  const c = seedCatalog();
  const csv = exportCSV(c);
  assert.deepEqual(importCSV(csv).lessons.map((l) => l.grade), c.lessons.map((l) => l.grade));
  const labelled = csv.replace(/;"7b"\r\n/, ';"7° Básico"\r\n');
  assert.equal(importCSV(labelled).lessons[0].grade, "7b");
  const older = parseCSV(csv)
    .map((row) => row.slice(0, 12).map((v) => '"' + v.replace(/"/g, '""') + '"').join(";"))
    .join("\r\n");
  assert.equal(importCSV(older).lessons[0].grade, "7b");
});
