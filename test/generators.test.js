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
function baseAnswer(expr, id, prompt) {
  let m;
  if (["razones", "fracciones-mixtos", "decimales-mult", "patrones", "expresiones", "angulos", "area-superficie", "graficos"].includes(id)) {
    const answer = lote3Answer(expr, id);
    assert.notEqual(answer, null, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE12.includes(id)) {
    const answer = lote12Answer(expr, id, prompt);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE11.includes(id)) {
    const answer = lote11Answer(expr, id, prompt);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE10.includes(id)) {
    const answer = lote10Answer(expr, id, prompt);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE9.includes(id)) {
    const answer = lote9Answer(expr, id);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE8.includes(id)) {
    const answer = lote8Answer(expr, id);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE7.includes(id)) {
    const answer = lote7Answer(expr, id);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE6.includes(id)) {
    const answer = lote6Answer(expr, id);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE5.includes(id)) {
    const answer = lote5Answer(expr, id, prompt);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
  if (LOTE4.includes(id)) {
    const answer = lote4Answer(expr, id);
    assert.ok(answer !== null && answer !== undefined, `${id}: sin cálculo para «${expr}»`);
    return answer;
  }
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
  if ((m = expr.match(/^Notas: (.+)$/))) {
    const notes = m[1].split("; ").map((v) => Number(v.replace(",", ".")));
    return notes.reduce((a, b) => a + b, 0) / notes.length;
  }
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

// Lote 3 (6° Básico): cada respuesta se recalcula desde el enunciado.
function lote3Answer(expr, id) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  if (id === "razones") {
    if ((m = expr.match(/^Razón (\d+) : (\d+) con (\d+) \D+$/))) return (m[2] * m[3]) / m[1];
    if ((m = expr.match(/^(\d+) : (\d+) = (\d+) : \?$/))) return (m[2] * m[3]) / m[1];
    if ((m = expr.match(/^(\d+) jugos cuestan \$([\d.]+); ¿(\d+) jugos\?$/))) return (n(m[2]) * m[3]) / m[1];
  }
  if (id === "fracciones-mixtos") {
    if ((m = expr.match(/^¿Cuántos enteros completos hay en (\d+)\/(\d+)\?$/))) return Math.floor(m[1] / m[2]);
    if ((m = expr.match(/^(\d+)\/(\d+) = (\d+) enteros? y ¿cuántos .+\?$/))) return m[1] - m[3] * m[2];
    if ((m = expr.match(/^(\d+) (\d+)\/(\d+) = \?\/\d+$/))) return m[1] * m[3] + Number(m[2]);
    if ((m = expr.match(/^(\d+) mitades de naranja$/))) return m[1] / 2;
  }
  if (id === "decimales-mult") return evaluate(expr.replace(/(\d),(\d)/g, "$1.$2"), 0);
  if (id === "patrones") {
    if ((m = expr.match(/^(\d+), (\d+), (\d+), (\d+), \?$/))) return 2 * m[4] - m[3];
    if ((m = expr.match(/^Regla: · (\d+) \+ (\d+) con entrada (\d+)$/))) return m[1] * m[3] + Number(m[2]);
    if ((m = expr.match(/^Tabla 1 → (\d+), 2 → (\d+), 3 → (\d+); ¿(\d+) → \?$/))) return Number(m[1]) + (m[2] - m[1]) * (m[4] - 1);
    if ((m = expr.match(/^Mesas: 1 → 4, 2 → 6, 3 → 8; ¿(\d+) → \?$/))) return 4 + 2 * (m[1] - 1);
  }
  if (id === "expresiones") {
    if ((m = expr.match(/^Si n = (\d+): (.+)$/))) return evaluate(m[2].replace(/n/g, "x"), Number(m[1]));
    for (let v = 0; v <= 100; v++) {
      const [left, right] = expr.split(" = ");
      if (evaluate(left.replace(/n/g, "x"), v) === Number(right)) return v;
    }
  }
  if (id === "angulos") {
    const nums = (expr.match(/\d+(?=°)/g) ?? []).map(Number);
    if (expr.startsWith("Opuesto")) return nums[0];
    if (expr.includes("= 180°")) return 180 - nums[0];
    if (expr.startsWith("Triángulo")) return 180 - nums[0] - nums[1];
    if (expr.startsWith("Cuadrilátero")) return 360 - nums[0] - nums[1] - nums[2];
  }
  if (id === "area-superficie") {
    if ((m = expr.match(/^Cubo de arista (\d+) cm$/))) return 6 * m[1] ** 2;
    if ((m = expr.match(/^Caja de (\d+) cm, (\d+) cm y (\d+) cm$/))) return 2 * (m[1] * m[2] + m[1] * m[3] + m[2] * m[3]);
  }
  if (id === "graficos") {
    const parts = { mitad: 2, tercio: 3, cuarto: 4, quinto: 5 };
    if ((m = expr.match(/^(?:la |un )?(mitad|tercio|cuarto|quinto) de (\d+)$/i))) return m[2] / parts[m[1].toLowerCase()];
    if ((m = expr.match(/^Barras: (\d+) y (\d+)$/))) return m[1] - m[2];
    if ((m = expr.match(/^Barras: (.+)$/))) return Math.max(...m[1].split(/, | y /).map(Number));
  }
  return null;
}

// Lote 4 (7° Básico).
const LOTE4 = ["potencias-10", "inecuaciones", "angulos-poligonos", "area-trapecio", "plano-cartesiano", "frecuencias", "probabilidad-teorica", "muestreo", "proporcion-inversa"];
function lote4Answer(expr, id) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const supNum = (v) => Number(v.replace("⁻", "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)));
  if (id === "potencias-10") {
    if ((m = expr.match(/^(?:(\d+) · )?10([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/))) return (m[1] ? Number(m[1]) : 1) * 10 ** supNum(m[2]);
    if ((m = expr.match(/^([\d.]+) = (?:(\d+) · )?10\^\?$/))) return Math.round(Math.log10(n(m[1]) / (m[2] ? Number(m[2]) : 1)));
  }
  if (id === "inecuaciones") {
    // Prueba enteros: el menor que cumple (> y ≥) o el mayor (<, ≤).
    const [left, op, right] = expr.split(/ ([<>]=?|≥|≤) /);
    const ok = (x) => {
      const v = evaluate(left, x);
      return { ">": v > right, "≥": v >= right, "<": v < right, "≤": v <= right }[op];
    };
    const range = Array.from({ length: 4001 }, (_, i) => i - 2000);
    return op === ">" || op === "≥" ? range.find(ok) : range.findLast(ok);
  }
  if (id === "angulos-poligonos") {
    const sides = { pentágono: 5, hexágono: 6, octágono: 8, decágono: 10, dodecágono: 12 };
    const k = sides[expr.match(/(\S+?)(?: regular)?$/)[1]];
    if (expr.startsWith("Suma")) return (k - 2) * 180;
    if (expr.startsWith("Ángulo exterior")) return 360 / k;
    return ((k - 2) * 180) / k;
  }
  if (id === "area-trapecio" && (m = expr.match(/^Trapecio: bases (\d+) c?m y (\d+) c?m, altura (\d+) c?m$/))) return ((+m[1] + +m[2]) * m[3]) / 2;
  if (id === "plano-cartesiano") {
    const val = (v) => Number(v.replace("−", "-"));
    if ((m = expr.match(/^Punto \((\d+), (\d+)\): ¿(x|y)\?$/))) return m[3] === "x" ? +m[1] : +m[2];
    if ((m = expr.match(/^\((\d+), (\d+)\) \+ vector \((−?\d+), (−?\d+)\): ¿(x|y)\?$/))) return m[5] === "x" ? +m[1] + val(m[3]) : +m[2] + val(m[4]);
    if ((m = expr.match(/^De \((\d+), (\d+)\) a \((\d+), \2\)$/))) return m[3] - m[1];
  }
  if (id === "frecuencias") {
    if ((m = expr.match(/^\D+: (\d+) de (\d+), en %$/))) return (m[1] * 100) / m[2];
    if ((m = expr.match(/^\D+: (\d+) de (\d+)$/))) return m[1] / m[2];
    if ((m = expr.match(/^Frecuencias (\d+), (\d+), (\d+): total$/))) return +m[1] + +m[2] + +m[3];
  }
  if (id === "probabilidad-teorica") {
    const faces = [1, 2, 3, 4, 5, 6];
    const events = { "un número par": (f) => f % 2 === 0, "un número impar": (f) => f % 2, "un número mayor que 4": (f) => f > 4,
      "un número menor que 3": (f) => f < 3, "un múltiplo de 3": (f) => f % 3 === 0 };
    if ((m = expr.match(/^Dado: sacar (\d)$/))) return 1 / 6;
    if ((m = expr.match(/^Dado: sacar par$/))) return 0.5;
    if ((m = expr.match(/^Dado: sacar (.+)$/))) return faces.filter(events[m[1]]).length / 6;
    if ((m = expr.match(/^Bolsa: (\d+) \D+ y (\d+) \D+$/))) return m[1] / (+m[1] + +m[2]);
    if (expr === "Moneda: sacar cara") return 0.5;
  }
  if (id === "muestreo") {
    if ((m = expr.match(/^Muestra: (\d+) de (\d+); \D+ de (\d+)$/))) return (m[1] / m[2]) * m[3];
    if ((m = expr.match(/^Muestra: (\d+) de 100$/))) return +m[1];
    if ((m = expr.match(/^Muestra: (\d+) % de (\d+)$/))) return (m[1] * m[2]) / 100;
  }
  if (id === "proporcion-inversa" && (m = expr.match(/^(\d+) [^,]+, (\d+) [^;]+; (\d+) \D+$/))) return (m[1] * m[2]) / m[3];
  return null;
}

// Lote 5 (8° Básico).
const LOTE5 = ["enteros-mult", "racionales-mult", "variacion-porcentual", "algebra-producto", "isometrias", "cuartiles"];
function lote5Answer(expr, id, prompt) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const val = (v) => Number(v.replace("−", "-"));
  // Cada fracción va agrupada: −3/4 ÷ 1/2 es (−3/4) ÷ (1/2).
  if (id === "enteros-mult" || id === "racionales-mult") return evaluate(expr.replace(/(\d),(\d)/g, "$1.$2").replace(/(\d+)\/(\d+)/g, "($1/$2)"), 0);
  if (id === "variacion-porcentual") {
    if ((m = expr.match(/^\$([\d.]+) con (\d+) % de (descuento|aumento)$/))) return n(m[1]) * (1 + (m[3] === "aumento" ? 1 : -1) * (m[2] / 100));
    if ((m = expr.match(/^De (\d+) a (\d+): ¿% de aumento\?$/))) return ((m[2] - m[1]) * 100) / m[1];
    if ((m = expr.match(/^\$([\d.]+) · ([\d,]+)$/))) {
      // El factor debe coincidir con el descuento del enunciado.
      const off = Number(prompt.match(/(\d+) % de descuento/)[1]);
      assert.equal(n(m[2]), 1 - off / 100, expr);
      return Math.round(n(m[1]) * n(m[2]));
    }
  }
  if (id === "algebra-producto") {
    // Compara las dos expresiones en varios x para despejar «?».
    const [left, right] = expr.split(" = ");
    const at = (x, q) => [evaluate(left, x), evaluate(right.replace("?", `(${q})`).replace(/\)x/g, ")*x"), x)];
    const [l0, r0] = at(3, 0);
    const [l1, r1] = at(3, 1);
    const q = (l0 - r0) / (r1 - r0 - (l1 - l0));
    for (const x of [-2, 0, 5]) {
      const [l, r] = at(x, q);
      assert.ok(Math.abs(l - r) < 1e-9, `${expr} con ? = ${q}`);
    }
    return q;
  }
  if (id === "isometrias") {
    if ((m = expr.match(/^\((−?\d+), (−?\d+)\) reflejado en el eje y: ¿x\?$/))) return -val(m[1]);
    if ((m = expr.match(/^\((−?\d+), (−?\d+)\) reflejado en el eje x: ¿y\?$/))) return -val(m[2]);
    if ((m = expr.match(/^\((−?\d+), (−?\d+)\) rotado 180°: ¿(x|y)\?$/))) return -val(m[3] === "x" ? m[1] : m[2]);
    if ((m = expr.match(/^\((−?\d+), (−?\d+)\) trasladado con \((−?\d+), (−?\d+)\): ¿y\?$/))) return val(m[2]) + val(m[4]);
  }
  if (id === "cuartiles") {
    if ((m = expr.match(/^Percentil (\d+) de (\d+)$/))) return (m[1] * m[2]) / 100;
    if ((m = expr.match(/^Q(\d) de (.+)$/))) {
      const data = m[2].split(", ").map(Number).sort((a, b) => a - b);
      const median = (list) => (list.length % 2 ? list[(list.length - 1) / 2] : (list[list.length / 2 - 1] + list[list.length / 2]) / 2);
      const half = Math.floor(data.length / 2);
      return { 1: median(data.slice(0, half)), 2: median(data), 3: median(data.slice(data.length - half)) }[m[1]];
    }
  }
  return null;
}

// Lote 6 (1° Medio).
const LOTE6 = ["racionales-operatoria", "crecimiento-exponencial", "funcion-dos-variables", "sectores-circulares", "cono", "homotecia", "tales", "semejanza", "doble-entrada", "reglas-probabilidad", "galton"];
function lote6Answer(expr, id) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const sup = (v) => v.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (d) => "^" + [...d].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
  const calc = (e) => evaluate(sup(e).replace(/(\d),(\d)/g, "$1.$2").replace(/(\d+)\/(\d+)/g, "($1/$2)"), 0);
  if (id === "racionales-operatoria") {
    if ((m = expr.match(/^(\d+)\/(\d+) de ([\d,]+)$/))) return (m[1] / m[2]) * n(m[3]);
    return calc(expr);
  }
  if (id === "crecimiento-exponencial") return calc(expr);
  if (id === "funcion-dos-variables") {
    if ((m = expr.match(/^f\((\d+), (\d+)\) con f\(x, y\) = (\d+)x \+ (\d+)y$/))) return m[3] * m[1] + m[4] * m[2];
    if ((m = expr.match(/^(\d+)x \+ (\d+)y = (\d+) con x = (\d+)$/))) return (m[3] - m[1] * m[4]) / m[2];
  }
  if (id === "sectores-circulares") {
    if ((m = expr.match(/^¿Qué parte del círculo es (\d+)°\?$/))) return m[1] / 360;
    if ((m = expr.match(/^Sector de (\d+)°, radio (\d+) cm$/))) return (3.14 * m[2] ** 2 * m[1]) / 360;
    if ((m = expr.match(/^Arco de (\d+)°, radio (\d+) cm$/))) return (2 * 3.14 * m[2] * m[1]) / 360;
  }
  if (id === "cono") {
    if ((m = expr.match(/^Cono: radio (\d+) cm, altura (\d+) cm$/))) return (3.14 * m[1] ** 2 * m[2]) / 3;
    if ((m = expr.match(/^Cilindro de (\d+) cm³$/))) return m[1] / 3;
  }
  if (id === "homotecia") {
    if ((m = expr.match(/^(?:Segmento|Lado) de (\d+) cm, k = (.+)$/))) return m[1] * calc(m[2]);
    if ((m = expr.match(/^\((\d+), (\d+)\) con k = (\d+): ¿y\?$/))) return m[2] * m[3];
    if ((m = expr.match(/^De (\d+) cm a (\d+) cm: ¿k\?$/))) return m[2] / m[1];
  }
  if (id === "tales") {
    if ((m = expr.match(/^(\d+)\/(\d+) = (\d+)\/x$/))) return (m[3] * m[2]) / m[1];
    if ((m = expr.match(/^(\d+)\/x = (\d+)\/(\d+)$/))) return (m[1] * m[3]) / m[2];
    if ((m = expr.match(/^Sombra: (\d+) m → (\d+) m; edificio con sombra de (\d+) m$/))) return (m[1] * m[3]) / m[2];
  }
  if (id === "semejanza") {
    if ((m = expr.match(/^Triángulos semejantes: (\d+) → (\d+), (\d+) → \?$/))) return (m[3] * m[2]) / m[1];
    if ((m = expr.match(/^(Plano|Maqueta|Mapa) 1 : (\d+), (\d+) cm$/))) return (m[3] * m[2]) / (m[1] === "Mapa" ? 100000 : 100);
  }
  if (id === "doble-entrada") {
    if ((m = expr.match(/^\S+ fútbol (\d+) de (\d+)$/))) return (m[1] * 100) / m[2];
    if ((m = expr.match(/^Total (\d+), fútbol (\d+)$/))) return m[1] - m[2];
    if ((m = expr.match(/(\d+), .+ (\d+)$/))) return +m[1] + +m[2];
  }
  if (id === "reglas-probabilidad") {
    const faces = [1, 2, 3, 4, 5, 6];
    const event = (name) => (name === "par" ? (f) => f % 2 === 0 : name === "impar" ? (f) => f % 2 === 1 : (f) => f === Number(name));
    if ((m = expr.match(/^Dado: (\w+) o (\d)$/))) return faces.filter((f) => event(m[1])(f) || event(m[2])(f)).length / 6;
    if ((m = expr.match(/^Moneda y dado: (cara|sello) y (\d)$/))) return 1 / 12;
    if ((m = expr.match(/^(\d) monedas: todas cara$/))) return 1 / 2 ** m[1];
    if (expr === "Dos monedas: dos caras") return 0.25;
    if (expr === "Dos dados: dos 6") return 1 / 36;
  }
  if (id === "galton") {
    if ((m = expr.match(/^Galton: (\d) filas, ¿caminos\?$/))) return 2 ** m[1];
    if ((m = expr.match(/^Galton: (\d) filas, extremo \w+$/))) return 1 / 2 ** m[1];
    if ((m = expr.match(/^Galton: 2 filas, centro$/))) return 0.5;
  }
  return null;
}

// Lote 7 (2° Medio).
const LOTE7 = ["raices-simplificar", "raices-enesimas", "logaritmos", "funcion-cuadratica", "ecuacion-cuadratica", "funcion-inversa", "cambio-porcentual", "esfera", "trigonometria", "vectores", "variable-aleatoria", "permutaciones"];
function lote7Answer(expr, id) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const val = (v) => Number(v.replace("−", "-"));
  const supd = (v) => Number([...v].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
  const subd = (v) => Number([...v].map((c) => "₀₁₂₃₄₅₆₇₈₉".indexOf(c)).join(""));
  if (id === "raices-simplificar") {
    if ((m = expr.match(/^√(\d+) = \?√(\d+)$/))) return Math.sqrt(m[1] / m[2]);
    if ((m = expr.match(/^√(\d+) · √(\d+)$/))) return Math.sqrt(m[1] * m[2]);
    if ((m = expr.match(/^√(\d+) \+ √(\d+) = \?√(\d+)$/))) return Math.sqrt(m[1] / m[3]) + Math.sqrt(m[2] / m[3]);
  }
  if (id === "raices-enesimas") {
    if ((m = expr.match(/^([∛∜])(\d+)$/))) return Math.round(Number(m[2]) ** (1 / (m[1] === "∛" ? 3 : 4)));
    if ((m = expr.match(/^(\d+)\^\((\d+)\/(\d+)\)$/))) return Math.round(Number(m[1]) ** (1 / m[3])) ** m[2];
  }
  if (id === "logaritmos") {
    if ((m = expr.match(/^log (\d+)$/))) return Math.round(Math.log10(m[1]));
    if ((m = expr.match(/^log([₀-₉]+) (\d+)$/))) return Math.round(Math.log(m[2]) / Math.log(subd(m[1])));
  }
  if (id === "funcion-cuadratica") {
    if ((m = expr.match(/^f\((−?\d+)\) con f\(x\) = (.+)$/))) return evaluate(m[2], val(m[1]));
    if ((m = expr.match(/^Vértice de (.+): ¿x\?$/))) {
      const f = (x) => evaluate(m[1], x);
      const b = (f(1) - f(-1)) / 2;
      const a = f(1) - f(0) - b;
      return -b / (2 * a);
    }
    if ((m = expr.match(/^f\(x\) = (.+): corte con eje y$/))) return evaluate(m[1], 0);
    if ((m = expr.match(/^Altura: h\(t\) = (.+); h\((\d+)\)$/))) return evaluate(m[1].replace(/t/g, "x"), Number(m[2]));
  }
  if (id === "ecuacion-cuadratica") {
    const [eq, which] = expr.split(", ");
    const [left, right] = eq.split(" = ");
    const roots = [];
    for (let x = -50; x <= 50; x++) if (Math.abs(evaluate(left, x) - evaluate(right, x)) < 1e-9) roots.push(x);
    if (which === "solución positiva") return roots.find((r) => r > 0);
    if (which === "solución mayor") return Math.max(...roots);
    if (which === "solución distinta de 0") return roots.find((r) => r !== 0);
  }
  if (id === "funcion-inversa" && (m = expr.match(/^f\(x\) = (.+); f⁻¹\((\d+)\)$/))) {
    const f = m[1].replace("x/2", "(x/2)");
    for (let x = -100; x <= 200; x += 0.5) if (Math.abs(evaluate(f, x) - Number(m[2])) < 1e-9) return x;
  }
  if (id === "cambio-porcentual") {
    if ((m = expr.match(/^(\d+) · ([\d,]+)([²³⁴]?)$/))) return Math.round(Number(m[1]) * n(m[2]) ** (m[3] ? supd(m[3]) : 1) * 100) / 100;
  }
  if (id === "esfera") {
    if ((m = expr.match(/^\D+: radio (\d+) cm, volumen$/))) return (4 / 3) * 3.14 * m[1] ** 3;
    if ((m = expr.match(/^\D+: radio (\d+) cm, área$/))) return 4 * 3.14 * m[1] ** 2;
  }
  if (id === "trigonometria") {
    if ((m = expr.match(/^Triángulo (\d+)-(\d+)-(\d+): (seno|coseno|tangente)$/))) {
      const [a, b, c] = [+m[1], +m[2], +m[3]];
      assert.equal(a * a + b * b, c * c, expr);
      return { seno: a / c, coseno: b / c, tangente: a / b }[m[4]];
    }
    if ((m = expr.match(/^Hipotenusa (\d+), sen 30° = 0,5: opuesto$/))) return m[1] * Math.sin(Math.PI / 6);
  }
  if (id === "vectores") {
    if ((m = expr.match(/^\((−?\d+), (−?\d+)\) \+ \((−?\d+), (−?\d+)\): ¿(x|y)\?$/))) return m[5] === "x" ? val(m[1]) + val(m[3]) : val(m[2]) + val(m[4]);
    if ((m = expr.match(/^Módulo de \((\d+), (\d+)\)$/))) return Math.hypot(m[1], m[2]);
    if ((m = expr.match(/^(\d+) · \((−?\d+), (−?\d+)\): ¿y\?$/))) return m[1] * val(m[3]);
  }
  if (id === "variable-aleatoria") {
    if ((m = expr.match(/^(\d) monedas: P\(X = (\d)( caras?)?\)$/))) {
      let count = 0;
      for (let mask = 0; mask < 2 ** m[1]; mask++) if (mask.toString(2).split("1").length - 1 === Number(m[2])) count++;
      return count / 2 ** m[1];
    }
    if ((m = expr.match(/^2 dados: P\(suma = (\d+)\)$/))) {
      let count = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === Number(m[1])) count++;
      return count / 36;
    }
    if ((m = expr.match(/^Dado(?: de (\d) caras)?: valor esperado$/))) return (Number(m[1] ?? 6) + 1) / 2;
  }
  if (id === "permutaciones") {
    const f = (k) => (k <= 1 ? 1 : k * f(k - 1));
    if ((m = expr.match(/^(\d)!$/))) return f(m[1]);
    if ((m = expr.match(/^Podio de 3 entre (\d)$/))) return m[1] * (m[1] - 1) * (m[1] - 2);
    if ((m = expr.match(/^Elegir 2 de (\d)$/))) return (m[1] * (m[1] - 1)) / 2;
    if ((m = expr.match(/^P\(Ana primera de (\d)\)$/))) return 1 / m[1];
  }
  return null;
}

// Lote 8 (3° Medio). Los complejos se calculan con pares [real, imaginaria].
const LOTE8 = ["complejos", "complejos-mult", "dispersion", "probabilidad-condicional", "modelos-exp-log", "circunferencia-angulos"];
function lote8Answer(expr, id) {
  let m;
  const val = (v) => Number(v.replace("−", "-"));
  const cplx = (t) => {
    const c = t.match(/^(−?\d+) ([+−]) (\d*)i$/);
    return [val(c[1]), (c[2] === "−" ? -1 : 1) * (c[3] === "" ? 1 : Number(c[3]))];
  };
  const part = (z, name) => (name === "real" ? z[0] : z[1]);
  if (id === "complejos" || id === "complejos-mult") {
    if ((m = expr.match(/^\((.+)\) ([+−]) \((.+)\): parte (real|imaginaria)$/))) {
      const [x, y] = [cplx(m[1]), cplx(m[3])];
      const k = m[2] === "+" ? 1 : -1;
      return part([x[0] + k * y[0], x[1] + k * y[1]], m[4]);
    }
    if ((m = expr.match(/^\((.+)\)\((.+)\)(?:: parte (real|imaginaria))?$/))) {
      const [x, y] = [cplx(m[1]), cplx(m[2])];
      const z = [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
      if (!m[3]) assert.equal(z[1], 0, `${expr}: el producto por el conjugado es real`);
      return m[3] ? part(z, m[3]) : z[0];
    }
    if ((m = expr.match(/^i([²⁴])$/))) return m[1] === "²" ? -1 : 1;
    if ((m = expr.match(/^Módulo de (\d+) \+ (\d+)i$/))) return Math.hypot(m[1], m[2]);
    if ((m = expr.match(/^Conjugado de (.+): parte imaginaria$/))) return -cplx(m[1])[1];
  }
  if (id === "dispersion") {
    if ((m = expr.match(/^Rango de (.+)$/))) {
      const d = m[1].split(", ").map(Number);
      return Math.max(...d) - Math.min(...d);
    }
    if ((m = expr.match(/^Varianza de (.+)$/))) {
      const d = m[1].split(", ").map(Number);
      const mean = d.reduce((a, b) => a + b, 0) / d.length;
      return d.reduce((a, b) => a + (b - mean) ** 2, 0) / d.length;
    }
    if ((m = expr.match(/^Desviación estándar con varianza (\d+)$/))) return Math.sqrt(m[1]);
    if ((m = expr.match(/^Curso A: desviación (\d+); curso B: desviación (\d+)$/))) return Math.min(m[1], m[2]);
  }
  if (id === "probabilidad-condicional") {
    const conds = { par: (f) => f % 2 === 0, impar: (f) => f % 2 === 1, "mayor que 3": (f) => f > 3, "menor que 4": (f) => f < 4 };
    if ((m = expr.match(/^Fútbol: (\d+); de ellos mujeres: (\d+)$/))) return m[2] / m[1];
    if ((m = expr.match(/^Dado: (\d) sabiendo que salió (.+)$/))) {
      const cases = [1, 2, 3, 4, 5, 6].filter(conds[m[2]]);
      assert.ok(cases.includes(Number(m[1])), expr);
      return 1 / cases.length;
    }
    if ((m = expr.match(/^Tabla: (\d+) vacunados, (\d+) enfermos$/))) return m[2] / m[1];
    if ((m = expr.match(/^(?:Fichas: (\d) rojas y (\d) azules, sin devolver|Dos fichas rojas sin devolver)$/))) {
      const [r, a] = m[1] ? [+m[1], +m[2]] : [2, 2];
      return (r - 1) / (r + a - 1);
    }
  }
  if (id === "modelos-exp-log") {
    if ((m = expr.match(/^(\d+) → (\d+) duplicando$/))) return Math.log2(m[2] / m[1]);
    if ((m = expr.match(/^f\(t\) = (\d+) · (\d+)ᵗ; f\((\d+)\)$/))) return m[1] * m[2] ** m[3];
    if ((m = expr.match(/^Richter: magnitud (\d+) vs (\d+)$/))) return 10 ** (m[1] - m[2]);
    if ((m = expr.match(/^pH con \[H⁺\] = 10⁻([⁰¹²³⁴⁵⁶⁷⁸⁹])$/))) return "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(m[1]);
  }
  if (id === "circunferencia-angulos") {
    if ((m = expr.match(/^Del centro (\d+)°: inscrito$/))) return m[1] / 2;
    if ((m = expr.match(/^Inscrito (\d+)°: del centro$/))) return m[1] * 2;
    if (expr === "Inscrito en un diámetro") return 90;
    if ((m = expr.match(/^Cuerdas: (\d+) · (\d+) = (\d+) · x$/))) return (m[1] * m[2]) / m[3];
  }
  return null;
}

// Lote 9 (4° Medio).
const LOTE9 = ["credito", "sueldo-impuestos", "binomial", "normal", "funcion-potencia", "funciones-trigonometricas"];
function lote9Answer(expr, id) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const val = (v) => Number(v.replace("−", "-"));
  if (id === "credito") {
    if ((m = expr.match(/^(\d+) cuotas de \$([\d.]+) por \$([\d.]+)$/))) return m[1] * n(m[2]) - n(m[3]);
    if ((m = expr.match(/^Costo \$([\d.]+) de \$([\d.]+): %$/))) return (n(m[1]) * 100) / n(m[2]);
    if ((m = expr.match(/^CAE (\d+) % vs (\d+) %: ¿cuál conviene\?$/))) return Math.min(m[1], m[2]);
  }
  if (id === "sueldo-impuestos") {
    if ((m = expr.match(/^IVA de \$([\d.]+)$/))) return Math.round(n(m[1]) * 0.19);
    if ((m = expr.match(/^Precio con IVA de \$([\d.]+) neto$/))) return Math.round(n(m[1]) * 1.19);
    if ((m = expr.match(/^Salud 7 % de \$([\d.]+)$/))) return Math.round(n(m[1]) * 0.07);
    if ((m = expr.match(/^Bruto \$([\d.]+), descuentos (\d+) %$/))) return Math.round((n(m[1]) * (100 - m[2])) / 100);
  }
  if (id === "binomial") {
    const choose = (a, b) => { let r = 1; for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1); return r; };
    if ((m = expr.match(/^(\d) monedas: (?:exactamente )?(\d) caras$/))) return choose(+m[1], +m[2]) / 2 ** m[1];
    if ((m = expr.match(/^Esperanza: (\d+) \D+, p = ([\d,]+)$/))) return Math.round(m[1] * n(m[2]) * 100) / 100;
  }
  if (id === "normal") {
    if ((m = expr.match(/^Promedio (\d+), desv\. (\d+): % entre (\d+) y (\d+)$/))) {
      const k = (m[4] - m[1]) / m[2];
      assert.equal((m[1] - m[3]) / m[2], k, expr);
      return { 1: 68, 2: 95 }[k];
    }
    if ((m = expr.match(/^z de (\d+) con promedio (\d+) y desv\. (\d+)$/))) return (m[1] - m[2]) / m[3];
    if (expr === "% sobre el promedio") return 50;
  }
  if (id === "funcion-potencia") {
    if ((m = expr.match(/^f\((−?\d+)\) con f\(x\) = (.+)$/))) return evaluate(m[2].replace(/(\d+)\/x/, "$1/(x)"), val(m[1]));
  }
  if (id === "funciones-trigonometricas") {
    const rad = (d) => (d * Math.PI) / 180;
    if ((m = expr.match(/^(sen|cos) (\d+)°$/))) return Math.round((m[1] === "sen" ? Math.sin : Math.cos)(rad(m[2])));
    if ((m = expr.match(/^Amplitud de (\d+) · sen\(x\)$/))) return +m[1];
    if ((m = expr.match(/^(Máximo|Mínimo) de (\d+) · sen\(t\) \+ (\d+)$/))) return +m[3] + (m[1] === "Máximo" ? 1 : -1) * m[2];
    if ((m = expr.match(/^Período de sen\((\d+)x\)$/))) return 360 / m[1];
  }
  return null;
}

// Lote 10: temas que faltaban y electivo de cálculo.
const LOTE10 = ["tallo-hojas", "teselados", "construcciones", "pitagoras-3d", "graficos-enganosos", "euclides", "recta-ajuste", "probabilidad-sociedad", "valor-absoluto", "composicion", "limites", "derivadas", "integrales"];
function lote10Answer(expr, id, prompt) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const digits = (v, set) => Number([...v].map((c) => set.indexOf(c)).join(""));
  if (id === "tallo-hojas") {
    const rows = [...expr.matchAll(/(\d) \| ([\d ]+?)(?= y |:|$)/g)].map(([, st, lv]) => lv.trim().split(" ").map((l) => st * 10 + Number(l)));
    const data = rows.flat().sort((a, b) => a - b);
    if (expr.includes("¿cuántos datos?")) return data.length;
    if (expr.endsWith("mayor dato")) return data.at(-1);
    if (expr.endsWith("menor dato")) return data[0];
    if (expr.endsWith("mediana")) return data[(data.length - 1) / 2];
  }
  if (id === "teselados") {
    if ((m = expr.match(/^Ángulos de 90° y (\d) figuras$/))) return 90 * m[1];
    const ang = Number(prompt.match(/(\d+)°/)[1]);
    if (/en una esquina$/.test(expr) && !/4 baldosas/.test(prompt)) return 360 / ang;
    if ((m = prompt.match(/Si juntas (\d+)/))) return 360 - m[1] * ang;
    if ((m = expr.match(/^Ángulos de 90° y (\d) figuras$/))) return 90 * m[1];
  }
  if (id === "construcciones") {
    if ((m = expr.match(/^Simetral de (\d+) cm$/))) return m[1] / 2;
    if ((m = expr.match(/^Bisectriz de (\d+)°$/))) return m[1] / 2;
    if (expr.startsWith("Simetral: ¿ángulo")) return 90;
    if ((m = expr.match(/^Transversal de (\d+) cm: hasta el centro$/))) return (2 * m[1]) / 3;
  }
  if (id === "pitagoras-3d") {
    if ((m = expr.match(/^Piso de (\d+) por (\d+): diagonal$/))) return Math.hypot(m[1], m[2]);
    if ((m = expr.match(/^Caja (\d+), (\d+) y (\d+): diagonal$/))) return Math.hypot(m[1], m[2], m[3]);
    if ((m = expr.match(/^Cubo de arista (\d+): diagonal²$/))) return 3 * m[1] ** 2;
  }
  if (id === "graficos-enganosos") {
    if ((m = expr.match(/^Barras (\d+) y (\d+): diferencia$/))) return m[2] - m[1];
    if ((m = expr.match(/^Eje desde (\d+): altura de (?:A \()?(\d+)\)?$/))) return m[2] - m[1];
    if ((m = expr.match(/^Ventas (\d+) y (\d+): % de aumento$/))) return ((m[2] - m[1]) * 100) / m[1];
    if (expr.startsWith("Eje que parte en")) return 0;
  }
  if (id === "euclides") {
    if ((m = expr.match(/^p = (\d+), q = (\d+): altura$/))) return Math.sqrt(m[1] * m[2]);
    if ((m = expr.match(/^p = (\d+), c = (\d+): cateto$/))) return Math.sqrt(m[1] * m[2]);
    if ((m = expr.match(/^altura (\d+), p = (\d+): q$/))) return m[1] ** 2 / m[2];
  }
  if (id === "recta-ajuste") {
    if ((m = expr.match(/^y = (.+) con x = (\d+)$/))) return evaluate(m[1].replace(/(\d),(\d)/g, "$1.$2"), Number(m[2]));
    if ((m = expr.match(/^Pendiente de \((\d+), (\d+)\) a \((\d+), (\d+)\)$/))) return (m[4] - m[2]) / (m[3] - m[1]);
  }
  if (id === "probabilidad-sociedad") {
    if ((m = expr.match(/^1 de cada (\d+) en %$/))) return 100 / m[1];
    if ((m = expr.match(/^(\d+) % de (\d+)$/))) return (m[1] * m[2]) / 100;
    if ((m = expr.match(/^De (\d+) % a (\d+) %: ¿cuántas veces\?$/))) return m[2] / m[1];
    if ((m = expr.match(/^(\d+) % de lluvia: no llueve$/))) return 100 - m[1];
  }
  if (id === "valor-absoluto") {
    if ((m = expr.match(/^\|(.+)\|$/))) return Math.abs(evaluate(m[1], 0));
    if ((m = expr.match(/^f\((\d+)\) con f\(x\) = \|x − (\d+)\|$/))) return Math.abs(m[1] - m[2]);
    if ((m = expr.match(/^Estacionamiento: (\d+) horas$/))) {
      const [, first, next] = prompt.match(/\$([\d.]+) la primera hora y \$([\d.]+)/);
      return n(first) + (m[1] - 1) * n(next);
    }
  }
  if (id === "composicion" && (m = expr.match(/^f\(x\) = (.+), g\(x\) = (.+): ([fg])\(([fg])\((\d+)\)\)$/))) {
    const F = { f: (v) => evaluate(m[1], v), g: (v) => evaluate(m[2], v) };
    return F[m[3]](F[m[4]](Number(m[5])));
  }
  if (id === "limites") {
    if ((m = expr.match(/^lím x→(\d+) de \((.+) \+ (\d+)\)$/))) return evaluate(m[2], Number(m[1])) + Number(m[3]);
    if ((m = expr.match(/^lím x→(\d+) de \(x² − (\d+)\)\/\(x − \1\)$/))) {
      const x = Number(m[1]) + 1e-7;
      return Math.round(((x * x - m[2]) / (x - m[1])) * 1e4) / 1e4;
    }
    if (expr === "lím x→∞ de 1/x") return 0;
  }
  if (id === "derivadas") {
    // Derivada numérica, redondeada.
    const d = (f, x) => Math.round(((f(x + 1e-5) - f(x - 1e-5)) / 2e-5) * 1000) / 1000;
    if ((m = expr.match(/^f\(x\) = (.+): f'\((\d+)\)$/))) return d((x) => evaluate(m[1], x), Number(m[2]));
    if ((m = expr.match(/^f\(x\) = (.+): f'\(x\)$/))) return d((x) => evaluate(m[1], x), 1.7);
  }
  if (id === "integrales") {
    if ((m = expr.match(/^∫([₀-₉]+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+) (.+) dx$/))) {
      const [a, b] = [digits(m[1], "₀₁₂₃₄₅₆₇₈₉"), digits(m[2], "⁰¹²³⁴⁵⁶⁷⁸⁹")];
      let area = 0;
      const steps = 1000;
      for (let i = 0; i < steps; i++) area += evaluate(m[3], a + ((b - a) * (i + 0.5)) / steps) * ((b - a) / steps);
      return Math.round(area * 1000) / 1000;
    }
    if ((m = expr.match(/^Velocidad (\d+) km\/h por (\d+) h$/))) return m[1] * m[2];
  }
  return null;
}

// Lote 11: interés simple y compuesto, base de un logaritmo y número e.
const LOTE11 = ["interes-simple", "interes-compuesto", "logaritmo-base", "numero-e"];
function lote11Answer(expr, id, prompt) {
  let m;
  const n = (v) => Number(v.replace(/\./g, "").replace(",", "."));
  const r2 = (v) => Math.round(v * 100) / 100;
  const supd = (v) => Number(v.replace("⁻", "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)));
  const subd = (v) => Number([...v].map((c) => "₀₁₂₃₄₅₆₇₈₉".indexOf(c)).join(""));
  if (id === "interes-simple") {
    if ((m = expr.match(/^Simple: \$([\d.]+) al (\d+) % (?:mensual )?por (\d+) (?:años|meses)(, total)?$/))) {
      const i = (n(m[1]) * m[2] * m[3]) / 100;
      return m[4] ? n(m[1]) + i : i;
    }
    if ((m = expr.match(/^Simple: \$([\d.]+) con \$([\d.]+) al (\d+) %: ¿años\?$/))) return n(m[1]) / ((n(m[2]) * m[3]) / 100);
  }
  if (id === "interes-compuesto") {
    if ((m = expr.match(/^Compuesto: (interés de )?\$([\d.]+) al (\d+) % por (\d+) años$/))) {
      const total = r2(n(m[2]) * (1 + m[3] / 100) ** m[4]);
      return m[1] ? r2(total - n(m[2])) : total;
    }
    if ((m = expr.match(/^\$([\d.]+) al (\d+) % por (\d+) años: compuesto − simple$/))) {
      const [P, r, t] = [n(m[1]), m[2] / 100, Number(m[3])];
      return r2(P * (1 + r) ** t - P * (1 + r * t));
    }
  }
  if (id === "logaritmo-base") {
    if ((m = expr.match(/^log (\d+)$/))) return Math.round(Math.log10(m[1]));
    if ((m = expr.match(/^log ([\d,]+)$/))) return Math.round(Math.log10(n(m[1])));
    if ((m = expr.match(/^log([₀-₉]+) (\d+)(?: = log \2 ÷ log \d+)?$/))) return Math.round(Math.log(m[2]) / Math.log(subd(m[1])));
  }
  if (id === "numero-e") {
    if ((m = expr.match(/^ln\(e([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\)$/))) return supd(m[1]);
    if (expr === "ln 1") return 0;
    if ((m = expr.match(/^\(1 \+ 1\/(\d)\)([²³⁴])$/))) return r2((1 + 1 / m[1]) ** supd(m[2]));
    if ((m = expr.match(/^e([²³]) con e ≈ 2,7$/))) return r2(2.7 ** supd(m[1]));
  }
  return null;
}

// Lote 12: bases de 3° a 5° Básico y problemas de la vida diaria.
const LOTE12 = ["base-mult-dos-cifras", "base-division-larga", "base-redondeo", "base-longitud", "base-tiempo", "base-masa", "base-perimetro", "base-fracciones-equivalentes",
  "problemas-compras", "problemas-ahorro", "problemas-recetas", "problemas-cuentas", "problemas-viajes", "problemas-pintar"];
function lote12Answer(expr, id, prompt) {
  let m;
  const n = (v) => Number(v.replace(/\$/g, "").replace(/\./g, "").replace(",", "."));
  const frac = (v) => { const [a, b] = v.split("/").map(Number); return a / b; };
  switch (id) {
    case "base-mult-dos-cifras":
      if ((m = expr.match(/^(?:Cajas: )?(\d+) · (\d+)$/))) return m[1] * m[2];
      break;
    case "base-division-larga":
      if ((m = expr.match(/^(\d+) ÷ (\d)$/))) { assert.equal(m[1] % m[2], 0, expr); return m[1] / m[2]; }
      if ((m = expr.match(/^Resto de (\d+) ÷ (\d)$/))) return m[1] % m[2];
      break;
    case "base-redondeo":
      if ((m = expr.match(/^(\d+) a la decena$/))) return Math.round(m[1] / 10) * 10;
      if ((m = expr.match(/^(\d+) a la centena$/))) return Math.round(m[1] / 100) * 100;
      if ((m = expr.match(/^Estimar (\d+) \+ (\d+)$/))) return Math.round(m[1] / 100) * 100 + Math.round(m[2] / 100) * 100;
      break;
    case "base-longitud": {
      const f = { km: 100000, m: 100, cm: 1, mm: 0.1 };
      if ((m = expr.match(/^([\d.,]+) (km|m|cm|mm) = \? (km|m|cm|mm)$/))) return Math.round(((n(m[1]) * f[m[2]]) / f[m[3]]) * 1000) / 1000;
      if ((m = expr.match(/^Caminar ([\d.]+) m: ¿km\?$/))) return n(m[1]) / 1000;
      break;
    }
    case "base-tiempo":
      if ((m = expr.match(/^(\d+) horas = \? minutos$/))) return m[1] * 60;
      if ((m = expr.match(/^De (\d+):(\d+) a (\d+):(\d+)$/))) return m[3] * 60 + Number(m[4]) - (m[1] * 60 + Number(m[2]));
      if ((m = expr.match(/^(\d+) de la tarde en formato 24 h$/))) return Number(m[1]) + 12;
      if ((m = expr.match(/^(\d+) minutos en horas$/))) return m[1] / 60;
      break;
    case "base-masa":
      if ((m = expr.match(/^(\d+) kg = \? g$/))) return m[1] * 1000;
      if ((m = expr.match(/^(Medio kilo|Un cuarto de kilo|Tres cuartos de kilo) en gramos$/))) return { "Medio kilo": 500, "Un cuarto de kilo": 250, "Tres cuartos de kilo": 750 }[m[1]];
      if ((m = expr.match(/^(\d+) g \+ (\d+) g en kg$/))) return (+m[1] + +m[2]) / 1000;
      if ((m = expr.match(/^(\d+) kg − (\d+) g en g$/))) return m[1] * 1000 - m[2];
      break;
    case "base-perimetro":
      if ((m = expr.match(/^(?:Rectángulo de|Huerto de) (\d+) c?m por (\d+) c?m: (?:perímetro|malla)$/))) return 2 * (+m[1] + +m[2]);
      if ((m = expr.match(/^Cuadrado de lado (\d+) cm: perímetro$/))) return 4 * m[1];
      if ((m = expr.match(/^Triángulo de (\d+), (\d+) y (\d+) cm: perímetro$/))) return +m[1] + +m[2] + +m[3];
      break;
    case "base-fracciones-equivalentes":
      if ((m = expr.match(/^(\d+)\/(\d+) = \?\/(\d+)$/))) return (m[1] * m[3]) / m[2];
      if ((m = expr.match(/^(\d+)\/(\d+) = (\d+)\/\?$/))) return (m[3] * m[2]) / m[1];
      break;
    case "problemas-compras":
      if ((m = expr.match(/^(\d+) · (\d+) \+ (\d+)$/))) return m[1] * m[2] + Number(m[3]);
      if ((m = expr.match(/^Vuelto de (\$[\d.]+) con (\$[\d.]+)$/))) return n(m[1]) - n(m[2]);
      if ((m = expr.match(/^Oferta (\d) × (\$[\d.]+) o 1 × (\$[\d.]+)$/))) return m[1] * n(m[3]) - n(m[2]);
      if ((m = expr.match(/^Cuadernos: (\d+) de (\$[\d.]+)$/))) return m[1] * n(m[2]);
      break;
    case "problemas-ahorro":
      if ((m = expr.match(/^Meta ([\d.]+), tienes ([\d.]+)$/))) return n(m[1]) - n(m[2]);
      if ((m = expr.match(/^Faltan ([\d.]+), ahorras ([\d.]+)$/))) return Math.ceil(n(m[1]) / n(m[2]));
      if ((m = expr.match(/^Ahorro diario (\d+) por (\d+) días$/))) return m[1] * m[2];
      break;
    case "problemas-recetas":
      if ((m = expr.match(/^(?:Receta para|Para) (\d+) con ([\d/]+) (?:huevos?|g de harina|taza de azúcar|ml de leche|papas); para (\d+)$/))) return (frac(m[2].includes("/") ? m[2] : m[2] + "/1") * m[3]) / m[1];
      break;
    case "problemas-cuentas":
      if ((m = expr.match(/^Propina 10 % de ([\d.]+)$/))) return n(m[1]) / 10;
      if ((m = expr.match(/^([\d.]+) entre (\d+)$/))) return n(m[1]) / m[2];
      if ((m = expr.match(/^Luz: ([\d.]+) con (\d+) % de aumento$/))) return n(m[1]) * (1 + m[2] / 100);
      if ((m = expr.match(/^Agua: (\d+) m³ a \$(\d+)$/))) return m[1] * m[2];
      break;
    case "problemas-viajes":
      if ((m = expr.match(/^(\d+) km\/h por (\d+) h$/))) return m[1] * m[2];
      if ((m = expr.match(/^(\d+) km a (\d+) km\/h$/))) return m[1] / m[2];
      if ((m = expr.match(/^Sale (\d+):(\d+), dura (\d+) h (\d+) min: ¿minutos de (?:llegada|la hora de llegada)\?$/))) return (Number(m[2]) + Number(m[4])) % 60;
      if ((m = expr.match(/^Bicicleta (\d+) km\/h, (\d+) km$/))) return m[2] / m[1];
      break;
    case "problemas-pintar":
      if ((m = expr.match(/^Pared (\d+) m por (\d+) m: área$/))) return m[1] * m[2];
      if ((m = expr.match(/^(\d+) m², tarro de (\d+) m²: tarros$/))) return Math.ceil(m[1] / m[2]);
      if ((m = expr.match(/^Piso (\d+) m por (\d+) m, caja de (\d+) m²: cajas$/))) return Math.ceil((m[1] * m[2]) / m[3]);
      if ((m = expr.match(/^Pieza (\d+) m por (\d+) m, baldosa de 1 m²: baldosas$/))) return m[1] * m[2];
      break;
  }
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
  const base = baseAnswer(expr, id, prompt);
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
        if (id.startsWith("fracciones-") || ["potencias-negativas", "probabilidad-teorica", "frecuencias", "racionales-mult", "racionales-operatoria", "sectores-circulares", "reglas-probabilidad", "galton", "trigonometria", "variable-aleatoria", "permutaciones", "ecuacion-cuadratica", "funcion-cuadratica", "vectores", "complejos", "complejos-mult", "probabilidad-condicional", "dispersion", "binomial", "funcion-potencia", "funciones-trigonometricas", "normal", "limites", "graficos-enganosos", "logaritmo-base", "numero-e", "base-longitud", "base-tiempo", "base-masa", "problemas-recetas"].includes(id)) assert.ok((q[1] > 0 || ["racionales-mult", "ecuacion-cuadratica", "funcion-cuadratica", "vectores", "complejos", "complejos-mult", "funcion-potencia", "funciones-trigonometricas", "normal", "limites", "graficos-enganosos", "logaritmo-base", "numero-e"].includes(id)) && Number.isFinite(q[1]), `${id}: ${q[0]} → ${q[1]}`);
        else assert.ok(Math.abs(q[1] * 100 - Math.round(q[1] * 100)) < 1e-6 && (["base-decimales", "volumen", "decimales-mult", "fracciones-mixtos", "crecimiento-exponencial", "cono", "homotecia", "cambio-porcentual", "esfera", "funcion-inversa"].includes(id) || Number.isInteger(q[1])), `${id}: ${q[0]} → ${q[1]}`);
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

test("curated curriculum questions match the generator checks", async () => {
  const { curriculumLessons } = await import("../public/curriculum.js");
  for (const lesson of curriculumLessons.filter((l) => l.since && generators[l.id]))
    for (const q of [...lesson.questions, lesson.review])
      try {
        checkAnswer(lesson.id, q);
      } catch (error) {
        throw new Error(`${lesson.id}: «${q[0]}» → ${error.message}`);
      }
});
