import { validateCatalog } from "./content.js";
import { parseNumber } from "./learning.js";
export const columns = [
  "leccion_id",
  "titulo",
  "descripcion",
  "concepto",
  "ejemplo",
  "tipo",
  "orden",
  "expresion",
  "respuesta",
  "instruccion",
  "pista",
  "explicacion",
];
export function parseCSV(raw) {
  const text = raw
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  const first = text.split("\n")[0];
  const delimiter = first.includes(";")
    ? ";"
    : first.includes("\t")
      ? "\t"
      : ",";
  const rows = [];
  let row = [],
    value = "",
    quoted = false,
    closed = false;
  for (let i = 0; i <= text.length; i++) {
    const c = i === text.length ? "\n" : text[i];
    if (quoted) {
      if (i === text.length)
        throw Error("CSV: hay una celda con comillas sin cerrar.");
      if (c === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else value += c;
      continue;
    }
    if (c === delimiter || c === "\n") {
      row.push(value);
      value = "";
      closed = false;
      if (c === "\n") {
        if (row.some((v) => v.trim())) rows.push(row);
        row = [];
      }
      continue;
    }
    if (closed) throw Error("CSV: hay texto después del cierre de comillas.");
    if (c === '"') {
      if (value) throw Error("CSV: las comillas deben envolver toda la celda.");
      quoted = true;
    } else value += c;
  }
  return rows;
}
export function importCSV(raw) {
  const rows = parseCSV(raw);
  if (rows.length < 2)
    throw Error("El CSV no contiene ejercicios. Descarga la plantilla CSV.");
  const headers = rows.shift().map((s) => s.trim().toLowerCase());
  if (new Set(headers).size !== headers.length)
    throw Error("Hay encabezados repetidos en el CSV.");
  const missing = columns.filter((c) => !headers.includes(c));
  if (missing.length) throw Error("Faltan columnas: " + missing.join(", "));
  const groups = new Map();
  rows.forEach((row, i) => {
    const line = i + 2;
    if (row.length !== headers.length)
      throw Error(
        `Fila ${line}: hay ${row.length} columnas; se esperan ${headers.length}.`,
      );
    const record = Object.fromEntries(
      headers.map((h, j) => [
        h,
        row[j].replace(/^'(?=[=+\-@\t\r])/, "").trim(),
      ]),
    );
    const id = record.leccion_id;
    if (!id) throw Error(`Fila ${line}: falta leccion_id.`);
    let l = groups.get(id);
    if (!l) {
      l = {
        id,
        title: "",
        description: "",
        concept: "",
        examples: "",
        status: "draft",
        questions: Array(4).fill(null),
        review: null,
      };
      groups.set(id, l);
    }
    for (const [column, field] of [
      ["titulo", "title"],
      ["descripcion", "description"],
      ["concepto", "concept"],
      ["ejemplo", "examples"],
    ]) {
      if (record[column]) {
        if (l[field] && l[field] !== record[column])
          throw Error(
            `Fila ${line}: ${column} no coincide con las otras filas de ${id}.`,
          );
        l[field] = record[column];
      }
    }
    const answer = parseNumber(record.respuesta);
    if (answer === null)
      throw Error(
        `Fila ${line}: la respuesta debe ser numérica (por ejemplo 7, 0,5 o 1/2).`,
      );
    const q = [
      record.expresion,
      answer,
      record.instruccion,
      record.pista,
      record.explicacion,
    ];
    if (record.tipo === "repaso") {
      if (l.review) throw Error(`Fila ${line}: repaso repetido para ${id}.`);
      l.review = q;
    } else if (record.tipo === "ejercicio") {
      if (!/^[1-4]$/.test(record.orden))
        throw Error(`Fila ${line}: orden debe ser 1, 2, 3 o 4.`);
      const index = Number(record.orden) - 1;
      if (l.questions[index])
        throw Error(
          `Fila ${line}: ejercicio ${record.orden} repetido para ${id}.`,
        );
      l.questions[index] = q;
    } else throw Error(`Fila ${line}: tipo debe ser ejercicio o repaso.`);
  });
  return validateCatalog({ version: 1, lessons: [...groups.values()] });
}
export function exportCSV(catalog) {
  const rows = [columns];
  for (const l of validateCatalog(catalog).lessons) {
    [...l.questions, l.review].forEach((q, i) =>
      rows.push([
        l.id,
        l.title,
        l.description,
        l.concept,
        l.examples,
        i === 4 ? "repaso" : "ejercicio",
        i + 1,
        q[0],
        q[1],
        q[2],
        q[3],
        q[4],
      ]),
    );
  }
  const cell = (value) => {
    let s = String(value);
    if (typeof value === "string" && /^[\s]*[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  return "\uFEFF" + rows.map((row) => row.map(cell).join(";")).join("\r\n");
}
