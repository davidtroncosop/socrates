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
        if (id.startsWith("fracciones-") || ["potencias-negativas", "probabilidad-teorica", "frecuencias", "racionales-mult", "racionales-operatoria", "sectores-circulares", "reglas-probabilidad", "galton"].includes(id)) assert.ok((q[1] > 0 || id === "racionales-mult") && Number.isFinite(q[1]), `${id}: ${q[0]} → ${q[1]}`);
        else assert.ok(Math.abs(q[1] * 100 - Math.round(q[1] * 100)) < 1e-6 && (["base-decimales", "volumen", "decimales-mult", "fracciones-mixtos", "crecimiento-exponencial", "cono", "homotecia"].includes(id) || Number.isInteger(q[1])), `${id}: ${q[0]} → ${q[1]}`);
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
