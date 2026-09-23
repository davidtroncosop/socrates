import { curriculumLessons } from "./curriculum.js";
import {
  lessons as defaults,
  parseNumber,
  GRADES,
  getSubject,
  inferGrade,
  displayTitle,
} from "./learning.js";
import { validateVideo } from "./video.js";
import { parseMistakes } from "./mistakes.js";
export const SUBJECTS = ["matematica", "lenguaje"];
export const CONTENT_KEY = "socatres.content.v1";
export const LEGACY_CONTENT_KEY = "tutorai.content.v1";
const reviews = [
  [
    "5x + 4 = 39",
    7,
    "Encuentra x sin ayuda para confirmar lo aprendido.",
    "⚖️ Mantén el equilibrio de la balanza: Primero resta 4 en ambos lados (5x = 35) y luego divide ambos lados entre 5.",
    "5x = 35; por lo tanto x = 7. Comprobación: 5(7) + 4 = 35 + 4 = 39 (la balanza permanece en equilibrio).",
  ],
  [
    "−3(x − 2) = 12",
    -2,
    "Encuentra x cuidando los signos.",
    "Divide entre −3 y luego suma 2.",
    "x − 2 = −4; x = −2.",
  ],
  [
    "4(x + 1) = 2x + 22",
    9,
    "Encuentra x combinando distribución y equilibrio.",
    "4x + 4 = 2x + 22.",
    "2x = 18; x = 9.",
  ],
  [
    "0.5x + 5 = 15",
    20,
    "Resuelve esta ecuación con decimales para confirmar tu dominio.",
    "Resta 5 y divide entre 0.5.",
    "0.5x = 10; por lo tanto, x = 20.",
  ],
  [
    "3(x + 4) = 2x + 19",
    7,
    "Resuelve de manera autónoma aplicando distribución y equilibrio.",
    "Distribuye: 3x + 12 = 2x + 19. Resta 2x y resta 12.",
    "x = 7.",
  ],
  [
    "3x + 12 = 5x − 4",
    8,
    "Encuentra el valor de x en la situación de equilibrio: 3x + 12 = 5x − 4.",
    "Resta 3x a ambos lados y suma 4: 2x = 16.",
    "2x = 16; por lo que x = 8.",
  ],
  [
    "−9 + (−11) + 25",
    5,
    "Calcula el resultado final combinando los enteros.",
    "−9 + (−11) = −20; luego −20 + 25 = 5.",
    "El resultado es 5.",
  ],
  [
    "12x − 5x − 4x",
    3,
    "Reduce los términos semejantes y escribe el coeficiente final.",
    "12 − 5 = 7; luego 7 − 4 = 3.",
    "12x − 5x − 4x = 3x. El coeficiente es 3.",
  ],
  [
    "4x = 72",
    18,
    "Encuentra la constante de proporcionalidad x si 4x = 72.",
    "Divide 72 entre 4.",
    "4x = 72; x = 18.",
  ],
  [
    "2^6 ÷ 2^2",
    16,
    "Aplica resta de exponentes y calcula el valor de 2⁶ ÷ 2².",
    "6 − 2 = 4; luego calcula 2⁴.",
    "2⁴ = 16.",
  ],
  [
    "f(6) con f(x) = 4x − 5",
    19,
    "Encuentra la imagen f(6) de la función afín f(x) = 4x − 5.",
    "4(6) − 5 = 24 − 5.",
    "f(6) = 19.",
  ],
  [
    "En (x + 6)^2, ¿cuál es el coeficiente de x?",
    12,
    "Calcula el coeficiente del término del medio: 2 · 6.",
    "2 · x · 6 = 12x.",
    "El coeficiente es 12.",
  ],
];
export function seedCatalog() {
  return {
    version: 1,
    lessons: [...defaults.map((l, i) => ({
      ...structuredClone(l),
      status: "published",
      review: reviews[i],
    })), ...structuredClone(curriculumLessons)],
  };
}
export function validateCatalog(input) {
  if (!input || input.version !== 1 || !Array.isArray(input.lessons))
    throw Error(
      "El archivo debe contener version: 1 y una lista lessons. Descarga la plantilla para ver el formato.",
    );
  if (input.lessons.length > 100)
    throw Error("Se admiten hasta 100 lecciones por catálogo.");
  const ids = new Set();
  const lessons = input.lessons.map((l, i) => {
    const prefix = `Lección ${i + 1}`;
    if (
      !l ||
      typeof l.id !== "string" ||
      !/^[a-z0-9][a-z0-9-]{0,79}$/.test(l.id)
    )
      throw Error(`${prefix}: identificador inválido.`);
    if (ids.has(l.id))
      throw Error(`${prefix}: el identificador ${l.id} está repetido.`);
    ids.add(l.id);
    if (!["draft", "published"].includes(l.status))
      throw Error(`${prefix}: el estado debe ser draft o published.`);
    function text(value, label, max = 3000) {
      if (typeof value !== "string" || !value.trim() || value.length > max)
        throw Error(`${prefix}: completa ${label} (máximo ${max} caracteres).`);
      return value.trim();
    }
    // Sexto elemento opcional: errores frecuentes [[respuesta, mensaje], …].
    function mistakes(list, label) {
      if (list === undefined || (Array.isArray(list) && !list.length)) return [];
      if (
        !Array.isArray(list) ||
        list.length > 8 ||
        !list.every(
          (m) =>
            Array.isArray(m) &&
            m.length === 2 &&
            Number.isFinite(m[0]) &&
            typeof m[1] === "string" &&
            m[1].trim() &&
            m[1].length <= 300,
        )
      )
        throw Error(
          `${prefix}: ${label} tiene errores frecuentes inválidos (hasta 8, cada uno con respuesta numérica y mensaje).`,
        );
      return [list.map(([answer, message]) => [answer, message.trim()])];
    }
    function question(q, label) {
      if (!Array.isArray(q) || (q.length !== 5 && q.length !== 6))
        throw Error(
          `${prefix}: ${label} debe tener expresión, respuesta, enunciado, pista y explicación.`,
        );
      if (typeof q[1] !== "number" || !Number.isFinite(q[1]))
        throw Error(
          `${prefix}: ${label} necesita una respuesta numérica finita.`,
        );
      return [
        text(q[0], `${label}, expresión`),
        q[1],
        text(q[2], `${label}, enunciado`),
        text(q[3], `${label}, pista`),
        text(q[4], `${label}, explicación`),
        ...mistakes(q[5], label),
      ];
    }
    if (!Array.isArray(l.questions) || l.questions.length !== 4)
      throw Error(`${prefix}: se necesitan exactamente cuatro ejercicios.`);
    if (l.subject !== undefined && !SUBJECTS.includes(l.subject))
      throw Error(`${prefix}: la materia debe ser matematica o lenguaje.`);
    if (l.grade !== undefined && !(l.grade in GRADES))
      throw Error(
        `${prefix}: el curso debe ser ${Object.keys(GRADES).join(", ")}.`,
      );
    const video = validateVideo(l.video, prefix);
    return {
      id: l.id,
      subject: l.subject ?? getSubject(l),
      grade: l.grade ?? inferGrade(l),
      // Al migrar, el curso deja de repetirse en el título.
      title: text(
        l.grade === undefined ? displayTitle(l) : l.title,
        "título",
        150,
      ),
      description: text(l.description, "descripción", 300),
      concept: text(l.concept, "concepto"),
      examples: text(l.examples, "ejemplo"),
      status: l.status,
      questions: l.questions.map((q, i) => question(q, `ejercicio ${i + 1}`)),
      review: question(l.review, "repaso"),
      ...(video ? { video } : {}),
    };
  });
  return { version: 1, lessons };
}
export function readCatalog(storage) {
  const raw = storage.getItem(CONTENT_KEY) ?? storage.getItem(LEGACY_CONTENT_KEY);
  if (raw === null) return seedCatalog();
  const catalog = validateCatalog(JSON.parse(raw));
  if (storage.getItem("socatres.curriculum.2026-09") === null && catalog.lessons.length) {
    const ids = new Set(catalog.lessons.map((l) => l.id));
    const added = curriculumLessons.filter((l) => !ids.has(l.id));
    if (catalog.lessons.length + added.length <= 100) {
      catalog.lessons.push(...structuredClone(added));
      // Persist the complete upgrade before marking it applied; never overwrite edits.
      return writeCatalog(storage, catalog);
    }
  }
  return catalog;
}
export function writeCatalog(storage, catalog) {
  const validated = validateCatalog(catalog);
  storage.setItem(CONTENT_KEY, JSON.stringify(validated));
  storage.setItem("socatres.curriculum.2026-09", "1");
  return validated;
}
export function mergeCatalog(current, incoming) {
  const added = validateCatalog(incoming);
  const ids = new Set(current.lessons.map((l) => l.id));
  const duplicate = added.lessons.find((l) => ids.has(l.id));
  if (duplicate)
    throw Error(
      `Ya existe «${duplicate.id}». Edita esa lección o cambia el identificador del archivo. No se sobrescribió contenido.`,
    );
  return validateCatalog({
    version: 1,
    lessons: [
      ...current.lessons,
      ...added.lessons.map((l) => ({ ...l, status: "draft" })),
    ],
  });
}
export function newLesson() {
  return {
    id: "leccion-" + crypto.randomUUID(),
    subject: "matematica",
    grade: "7b",
    title: "",
    description: "",
    concept: "",
    examples: "",
    status: "draft",
    questions: Array.from({ length: 4 }, () => ["", "", "", "", ""]),
    review: ["", "", "", "", ""],
  };
}
export function formQuestion(data, prefix) {
  const raw = data.get(prefix + "-1");
  const answer = parseNumber(raw);
  if (answer === null)
    throw Error(
      "Cada ejercicio necesita una respuesta numérica válida (ej.: 7 o 1/2).",
    );
  return [
    String(data.get(prefix + "-0") || ""),
    answer,
    ...[2, 3, 4].map((i) => String(data.get(prefix + "-" + i) || "")),
    ...(() => {
      const list = parseMistakes(data.get(prefix + "-5"));
      return list.length ? [list] : [];
    })(),
  ];
}
