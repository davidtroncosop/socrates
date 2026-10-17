// Metáfora: «sabiendo que…» achica el total.
export default {
  id: "probabilidad-condicional",
  title: "Probabilidad condicional",
  grade: "3° Medio",
  beats: [
    {
      say: "Lanzas un dado. La probabilidad de un seis es un sexto.",
      visual: { type: "lines", lines: ["🎲  1  2  3  4  5  [[6]]", "P(6) = 1/6"] },
    },
    {
      say: "Pero alguien mira y te dice: salió par. Ahora solo pueden ser el dos, el cuatro o el seis. La probabilidad de seis es un tercio.",
      visual: { type: "lines", lines: ["🎲  ~~1~~  2  ~~3~~  4  ~~5~~  [[6]]", "P(6 | par) = {{1/3}}"] },
    },
    {
      say: "Eso es probabilidad condicional: saber algo cambia el total. Se lee: probabilidad de seis, sabiendo que salió par.",
      visual: { type: "cards", items: [{ icon: "🔍", title: "P(A | B)", text: "Probabilidad de A sabiendo que pasó B" }] },
    },
    {
      say: "Con una tabla: en un curso de treinta, doce juegan fútbol, y ocho de ellos son mujeres.",
      visual: { type: "table", headers: ["", "Mujeres", "Hombres", "Total"], rows: [["Fútbol", "8", "4", "12"], ["No juega", "10", "8", "18"], ["Total", "18", "12", "30"]] },
    },
    {
      say: "Sabiendo que juega fútbol, mira solo esa fila: ocho mujeres de doce. La probabilidad es ocho doceavos, dos tercios.",
      visual: { type: "table", headers: ["", "Mujeres", "Hombres", "Total"], rows: [["Fútbol", "{{8}}", "4", "[[12]]"], ["No juega", "10", "8", "18"], ["Total", "18", "12", "30"]] },
      eq: "8/12 = 2/3",
    },
    {
      say: "Recuerda: con «sabiendo que», el total son solo los casos que cumplen lo que sabes.",
      visual: {
        type: "list",
        title: "Probabilidad condicional",
        items: ["🔍 «Sabiendo que» achica el total.", "📋 Mira solo la fila o columna que sabes.", "➗ Casos con las dos ÷ casos que sabes."],
      },
      eq: "",
    },
  ],
};
