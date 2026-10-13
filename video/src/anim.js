import { Easing, interpolate } from "remotion";
import { LEAD } from "./timeline.js";

export const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = (t, from, to) =>
  interpolate(t, [from, to], [0, 1], { ...clamp01, easing: Easing.inOut(Easing.cubic) });

// Paso general entre el estado anterior y el nuevo.
export const progress = (t) => ease(t, 0, 18);

// Aparición escalonada mientras la voz nombra cada elemento: el elemento k de
// n entra en su parte de la frase.
export function stagger(t, k, n, speak) {
  const start = LEAD + 2 + (n > 1 ? (k / n) * speak * 0.85 : 0);
  return ease(t, start, start + 14);
}

// Colores de la app (public/styles.css).
export const C = {
  bg: "#f8fafc",
  ink: "#0f172a",
  muted: "#64748b",
  line: "#cbd5e1",
  soft: "#e2e8f0",
  blue: "#145ce6",
  blueDark: "#1d4ed8",
  blueSoft: "#eff6ff",
  green: "#047857",
  greenSoft: "#dcfce7",
  red: "#dc2626",
  redSoft: "#fee2e2",
  amber: "#d97706",
  amberDark: "#92400e",
  amberSoft: "#fef3c7",
  beam: "#1e293b",
};

// Marcas en textos y ecuaciones: [[…]] operación o pista, {{…}} idea clave o
// comprobación, ~~…~~ lo que se descarta o se cancela.
export function parseMarks(text) {
  return String(text)
    .split(/(\[\[.+?\]\]|\{\{.+?\}\}|~~.+?~~)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("[[")
        ? { kind: "op", text: part.slice(2, -2) }
        : part.startsWith("{{")
          ? { kind: "key", text: part.slice(2, -2) }
          : part.startsWith("~~")
            ? { kind: "cut", text: part.slice(2, -2) }
            : { kind: "plain", text: part },
    );
}
export const plainText = (text) => parseMarks(text).map((p) => p.text).join("");
