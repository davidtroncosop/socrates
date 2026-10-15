// Metáfora: con cuartos de pizza se arman pizzas enteras.
const bar = (parts, filled, caption, total = "1 pizza") => ({ type: "bar", total, parts, filled, partLabel: "1/4", caption });

export default {
  id: "fracciones-mixtos",
  title: "Fracciones impropias y números mixtos",
  grade: "6° Básico",
  beats: [
    {
      say: "Tienes siete cuartos de pizza. Siete cuartos es más que una pizza entera.",
      visual: { type: "cards", items: [{ icon: "🍕", title: "7/4 de pizza", text: "Arriba hay más que abajo: es más de un entero" }] },
      eq: "7/4",
    },
    {
      say: "Con cuatro cuartos armas una pizza completa.",
      visual: bar(4, 4, "4 cuartos = 1 pizza entera"),
    },
    {
      say: "Te sobran tres cuartos, que no alcanzan para otra pizza.",
      visual: bar(4, 3, "Sobran 3 cuartos", "la segunda pizza"),
    },
    {
      say: "Entonces siete cuartos es una pizza entera y tres cuartos. Eso es un número mixto: uno, tres cuartos.",
      visual: { type: "lines", lines: ["7 ÷ 4 = [[1]] y sobran [[3]]", "7/4 = {{1 3/4}}"] },
      eq: "",
    },
    {
      say: "Al revés: dos enteros y un tercio. Cada entero tiene tres tercios: dos por tres son seis, más uno, siete tercios.",
      visual: { type: "lines", lines: ["2 1/3", "2 · 3 + 1 = [[7]]", "2 1/3 = {{7/3}}"] },
    },
    {
      say: "Recuerda: para pasar a número mixto, arma enteros y mira cuánto sobra. Para volver, multiplica los enteros por el número de abajo y suma.",
      visual: {
        type: "list",
        title: "Números mixtos",
        items: ["🍕 Arma enteros con las partes.", "➗ Lo que sobra queda como fracción.", "🔁 Para volver: enteros · abajo + arriba."],
      },
    },
  ],
};
