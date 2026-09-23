// Retroalimentación para errores frecuentes: sin profesor al lado, decir
// «incorrecto» no basta. Primero se revisan los errores declarados en el
// ejercicio (sexto elemento: [[respuesta, mensaje], …]); luego detectores
// genéricos para ecuaciones lineales.
import { parseNumber, solveLinear } from "./learning.js";

const close = (a, b) => Math.abs(a - b) < 1e-8;
const num = (n) =>
  (n < 0 ? "−" : "") +
  String(Math.round(Math.abs(n) * 1000) / 1000).replace(".", ",");
const coef = (a) => (a === 1 ? "" : a === -1 ? "−" : num(a));

export function diagnoseMistake(q, raw) {
  const value = parseNumber(raw);
  if (value === null || close(value, q[1])) return null;
  for (const [answer, message] of q[5] ?? [])
    if (close(value, answer)) return message;

  const eq = /x/.test(q[0]) && q[0].includes("=") ? solveLinear(q[0]) : null;
  if (eq?.kind === "unique") {
    const { a, b, left, right } = eq;
    if (a !== 1 && close(value, b))
      return `Llegaste a ${coef(a)}x = ${num(b)}, pero falta el último paso: divide ambos lados entre ${num(a)}.`;
    if (Math.abs(a) !== 1 && close(value, b * a))
      return `Multiplicaste por ${num(a)}. Para deshacer una multiplicación se divide: x = ${num(b)} ÷ ${num(a)}.`;
    if (left.b !== 0 && right.a === 0 && close(value, (right.b + left.b) / left.a))
      return `Revisa el paso del ${num(Math.abs(left.b))}: para deshacer ${left.b > 0 ? "una suma se resta" : "una resta se suma"} en ambos lados.`;
    if (right.a !== 0 && left.a + right.a !== 0 && close(value, b / (left.a + right.a)))
      return `Al mover ${coef(right.a)}x al otro lado cambia de signo: ${coef(left.a)}x − ${coef(right.a)}x = ${coef(a)}x.`;
  }
  if (q[1] !== 0 && close(value, -q[1]))
    return "Tu resultado tiene el signo contrario. Revisa los signos paso a paso.";
  return null;
}

// Formato para autores: una línea (o «|» en CSV) por error, «respuesta: mensaje».
export function parseMistakes(text, prefix = "Errores frecuentes") {
  const lines = String(text ?? "")
    .split(/\n|\s\|\s/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((line) => {
    const i = line.indexOf(":");
    const answer = i > 0 ? parseNumber(line.slice(0, i)) : null;
    const message = i > 0 ? line.slice(i + 1).trim() : "";
    if (answer === null || !message)
      throw Error(`${prefix}: escribe cada error como «respuesta: mensaje», por ejemplo «−7: revisa el signo».`);
    return [answer, message];
  });
}
export const formatMistakes = (mistakes, separator = "\n") =>
  (mistakes ?? [])
    .map(([answer, message]) => `${num(answer)}: ${message}`)
    .join(separator);
