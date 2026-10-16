// Metáfora: todo al mismo idioma (fracciones) y después el orden de siempre.
export default {
  id: "racionales-operatoria",
  title: "Operaciones con números racionales",
  grade: "1° Medio",
  beats: [
    {
      say: "Cero coma cinco más un cuarto. Hay un decimal y una fracción: primero pásalos al mismo idioma.",
      visual: { type: "lines", lines: ["0,5 + 1/4", "0,5 = [[1/2]]"] },
    },
    {
      say: "Un medio son dos cuartos. Dos cuartos más un cuarto: tres cuartos.",
      visual: { type: "bar", total: "1 entero", parts: 4, filled: 3, partLabel: "1/4", caption: "2/4 + 1/4 = 3/4" },
      eq: "0,5 + 1/4 = 3/4",
    },
    {
      say: "Cuando hay varias operaciones, se respeta el orden de siempre, PAPOMUDAS. En un medio más un tercio por tres medios, primero se multiplica.",
      visual: { type: "lines", lines: ["1/2 + [[1/3 · 3/2]]", "= 1/2 + 1/2", "= {{1}}"] },
      eq: "",
    },
    {
      say: "Con potencias, primero la potencia. Un medio al cuadrado es un medio por un medio: un cuarto. Un cuarto de ocho es dos.",
      visual: { type: "lines", lines: ["(1/2)² · 8", "= 1/4 · 8", "= {{2}}"] },
    },
    {
      say: "Ojo: elevar al cuadrado no es multiplicar por dos. Un medio al cuadrado es un cuarto, no uno.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "(1/2)² no es 1", text: "Es 1/2 · 1/2 = 1/4" }] },
    },
    {
      say: "Recuerda: pasa todo a fracciones, respeta el orden de las operaciones y revisa las potencias.",
      visual: {
        type: "list",
        title: "Operaciones con racionales",
        items: ["🔁 Decimales a fracción: 0,5 = 1/2.", "🪜 Orden: PAPOMUDAS.", "² Potencia: multiplica la base por sí misma."],
      },
    },
  ],
};
