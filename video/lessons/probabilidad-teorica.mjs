// Metáfora: casos que sirven sobre todos los casos.
const balls = (red, blue) => ({ type: "tokens", size: 70, groups: [{ icon: "🔴", count: red, cols: red, label: `${red} rojas` }, { icon: "🔵", count: blue, cols: blue, label: `${blue} azules` }] });

export default {
  id: "probabilidad-teorica",
  title: "Probabilidad teórica",
  grade: "7° Básico",
  beats: [
    {
      say: "Un dado tiene seis caras, y todas tienen la misma oportunidad de salir.",
      visual: { type: "lines", lines: ["🎲  1  2  3  4  5  6", "6 casos posibles"] },
    },
    {
      say: "¿Qué probabilidad hay de sacar un cuatro? Un caso sirve, de seis posibles: un sexto.",
      visual: { type: "lines", lines: ["🎲  1  2  3  [[4]]  5  6", "1 caso favorable de 6"] },
      eq: "P = 1/6",
    },
    {
      say: "¿Y sacar un número par? Sirven el dos, el cuatro y el seis: tres de seis. Es un medio.",
      visual: { type: "lines", lines: ["🎲  1  [[2]]  3  [[4]]  5  [[6]]", "3 casos favorables de 6"] },
      eq: "P = 3/6 = 1/2",
    },
    {
      say: "Una bolsa tiene tres bolitas rojas y dos azules. Sin mirar, sacas una.",
      visual: balls(3, 2),
      eq: "",
    },
    {
      say: "Casos favorables: las tres rojas. Casos posibles: todas, cinco. La probabilidad de roja es tres quintos.",
      eq: "P(roja) = 3/5",
    },
    {
      say: "Ojo: no se divide rojas por azules. Se divide por el total de bolitas.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Divide por el total", text: "3 rojas de 5 bolitas: 3/5 (no 3/2)" }] },
      eq: "",
    },
    {
      say: "Recuerda: la probabilidad es casos favorables dividido en casos posibles. Siempre es un número entre cero y uno.",
      visual: {
        type: "list",
        title: "Probabilidad",
        items: ["✅ Casos favorables: los que sirven.", "🎲 Casos posibles: todos.", "➗ Favorables ÷ posibles."],
      },
    },
  ],
};
