// Metáforas: múltiplos = saltos del mismo tamaño; divisores = filas iguales
// sin que sobre; primo = solo cabe en una fila.
const candies = (count, cols, label) => ({ icon: "🍭", count, cols, label });
const hop = (from) => ({ from, to: from + 3, label: "+3", row: 0 });

export default {
  id: "multiplos-divisores",
  title: "Múltiplos, divisores y primos",
  grade: "6° Básico",
  beats: [
    {
      say: "Los múltiplos de un número son saltos del mismo tamaño. Si saltas de tres en tres: tres, seis, nueve, doce. Es la tabla del tres.",
      visual: { type: "cards", items: [{ icon: "🦘", title: "Múltiplos: saltos iguales", text: "Los múltiplos de 3 son 3, 6, 9, 12…" }] },
    },
    {
      say: "En la recta numérica se ve así: cada salto mide tres. Tres, seis, nueve, doce.",
      visual: { type: "numberline", min: 0, max: 15, arrows: [hop(0), hop(3), hop(6), hop(9)] },
      eq: "3, 6, 9, 12…",
    },
    {
      say: "Los divisores son al revés: son los números que reparten sin que sobre nada. Doce dulces se pueden ordenar en filas iguales de varias formas.",
      visual: { type: "cards", items: [{ icon: "🍭", title: "Divisores: repartir sin que sobre", text: "12 dulces se ordenan en filas iguales de varias formas" }] },
      eq: "",
    },
    {
      say: "Una fila de doce, dos filas de seis, o tres filas de cuatro. Por eso los divisores de doce son uno, dos, tres, cuatro, seis y doce.",
      visual: { type: "tokens", size: 40, groups: [candies(12, 12, "1 · 12"), candies(12, 6, "2 · 6"), candies(12, 4, "3 · 4")] },
      eq: "Divisores de 12: 1, 2, 3, 4, 6, 12",
    },
    {
      say: "Con siete dulces solo se puede hacer una fila de siete. El siete tiene solo dos divisores: el uno y el siete. Por eso es un número primo.",
      visual: { type: "tokens", size: 56, groups: [candies(7, 7, "1 · 7")] },
      eq: "7 es primo",
    },
    {
      say: "Para saber cuándo coinciden dos cosas, como dos buses, busca el primer múltiplo que tienen en común. Uno pasa cada cuatro minutos y otro cada seis: los dos coinciden a los doce.",
      visual: { type: "lines", lines: ["Cada 4: 4, 8, [[12]], 16…", "Cada 6: 6, [[12]], 18…", "Coinciden a los {{12}} minutos"], size: 68 },
      eq: "",
    },
    {
      say: "Recuerda: los múltiplos son saltos iguales, la tabla. Los divisores reparten sin que sobre. Y un primo solo se divide por uno y por sí mismo.",
      visual: {
        type: "list",
        title: "Múltiplos, divisores y primos",
        items: ["🦘 Múltiplos: saltos del mismo tamaño (la tabla).", "🍭 Divisores: reparten sin que sobre nada.", "1️⃣ Primo: solo se divide por 1 y por sí mismo."],
      },
    },
  ],
};
