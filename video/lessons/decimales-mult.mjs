// Metáfora: las décimas son monedas de 10 pesos de un billete de 100.
export default {
  id: "decimales-mult",
  title: "Multiplicar y dividir decimales",
  grade: "6° Básico",
  beats: [
    {
      say: "Cero coma cuatro es cuatro décimas. Si lo multiplicas por tres, tienes tres veces cuatro décimas: doce décimas.",
      visual: { type: "bar", total: "1 entero", parts: 10, filled: 4, partLabel: "0,1", caption: "0,4 = 4 décimas" },
      eq: "0,4 · 3",
    },
    {
      say: "Doce décimas es un entero y dos décimas: uno coma dos.",
      visual: { type: "lines", lines: ["4 · 3 = 12 décimas", "12 décimas = {{1,2}}"] },
      eq: "0,4 · 3 = 1,2",
    },
    {
      say: "El truco: multiplica sin la coma, cuatro por tres, doce. Después pon la coma: cero coma cuatro tenía un decimal, así que el resultado también tiene uno.",
      visual: { type: "lines", lines: ["0,4 → 4", "4 · 3 = 12", "1 decimal → {{1,2}}"] },
      eq: "",
    },
    {
      say: "Multiplicar por diez es más fácil: la coma se corre un lugar a la derecha. Dos coma cinco por diez es veinticinco.",
      visual: { type: "lines", lines: ["2,5 · 10", "= {{25}}"] },
    },
    {
      say: "Para dividir, reparte. Cuatro coma ocho dividido en cuatro: cuatro enteros dan uno para cada uno, y ocho décimas dan dos décimas. Uno coma dos.",
      visual: { type: "lines", lines: ["4 enteros ÷ 4 = 1", "8 décimas ÷ 4 = 2 décimas", "4,8 ÷ 4 = {{1,2}}"] },
    },
    {
      say: "Recuerda: multiplica como si no hubiera coma y después pon la coma con los mismos decimales. Por diez, corre la coma a la derecha.",
      visual: {
        type: "list",
        title: "Decimales",
        items: ["✖️ Multiplica sin la coma.", "📍 Pon la coma con los mismos decimales.", "➡️ Por 10, la coma va a la derecha.", "➗ Para dividir, reparte."],
      },
    },
  ],
};
