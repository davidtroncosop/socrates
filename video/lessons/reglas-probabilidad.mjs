// Metáfora: «o» abre más puertas (suma); «y» exige pasar por dos (multiplica).
export default {
  id: "reglas-probabilidad",
  title: "Reglas de la probabilidad",
  grade: "1° Medio",
  beats: [
    {
      say: "Lanzas un dado. ¿Qué probabilidad hay de sacar un uno o un dos?",
      visual: { type: "lines", lines: ["🎲  [[1]]  [[2]]  3  4  5  6"] },
    },
    {
      say: "Con la palabra o, se suman: un sexto más un sexto, dos sextos, que es un tercio. Hay más maneras de ganar.",
      eq: "1/6 + 1/6 = 2/6 = 1/3",
    },
    {
      say: "Ahora lanzas una moneda y un dado. ¿Qué probabilidad hay de cara y un seis?",
      visual: { type: "cards", items: [{ icon: "🪙", title: "Cara: 1/2", text: "" }, { icon: "🎲", title: "Un 6: 1/6", text: "" }] },
      eq: "",
    },
    {
      say: "Con la palabra y, se multiplican: un medio por un sexto, un doceavo. Es más difícil que pasen las dos cosas.",
      eq: "1/2 · 1/6 = 1/12",
    },
    {
      say: "Dos monedas, dos caras: un medio por un medio, un cuarto.",
      visual: { type: "lines", lines: ["CC  CS  SC  SS", "1 de 4 = {{1/4}}"] },
      eq: "1/2 · 1/2 = 1/4",
    },
    {
      say: "Recuerda: o, suma. Y, multiplica. La suma sirve si las dos cosas no pueden pasar a la vez; la multiplicación, si una no afecta a la otra.",
      visual: {
        type: "list",
        title: "Reglas de la probabilidad",
        items: ["➕ «O»: se suman.", "✖️ «Y»: se multiplican.", "🔍 Revisa si pueden pasar a la vez."],
      },
      eq: "",
    },
  ],
};
