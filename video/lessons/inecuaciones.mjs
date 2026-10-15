// Metáfora: la inecuación es una balanza desequilibrada; la respuesta es un tramo de la recta.
const line = (arrows, more = {}) => ({ type: "numberline", min: 0, max: 10, arrows, ...more });

export default {
  id: "inecuaciones",
  title: "Inecuaciones",
  grade: "7° Básico",
  beats: [
    {
      say: "Una ecuación dice que dos cosas son iguales. Una inecuación dice que una es mayor o menor que la otra.",
      visual: { type: "cards", items: [{ icon: "⚖️", title: "> mayor que, < menor que", text: "Una inecuación tiene muchas respuestas" }] },
    },
    {
      say: "Equis más tres es mayor que siete. Se resuelve como una ecuación: resta tres en los dos lados. Queda equis mayor que cuatro.",
      visual: { type: "lines", lines: ["x + 3 > 7", "x + 3 [[− 3]] > 7 [[− 3]]", "x > {{4}}"] },
    },
    {
      say: "No hay una sola respuesta. Sirven todos los números mayores que cuatro: cinco, seis, siete, y muchos más.",
      visual: line([{ from: 4, to: 10, label: "x > 4", row: 0 }]),
      eq: "x > 4",
    },
    {
      say: "¿Sirve el cuatro? Cuatro más tres es siete, y siete no es mayor que siete. El cuatro no sirve: el menor entero es el cinco.",
      visual: line([{ from: 4, to: 10, label: "x > 4", row: 0 }], { marker: 5 }),
      eq: "4 + 3 = 7 ✗   5 + 3 = 8 ✓",
    },
    {
      say: "Si el signo tiene una rayita abajo, mayor o igual, el borde sí sirve.",
      visual: { type: "lines", lines: ["x ≥ 8", "8 sirve ✓"] },
      eq: "",
    },
    {
      say: "Tienes tres mil pesos y cada helado cuesta quinientos. Quinientos equis menor o igual que tres mil: equis menor o igual que seis. Puedes comprar hasta seis.",
      visual: { type: "lines", lines: ["500x ≤ 3.000", "x ≤ 3.000 ÷ 500", "x ≤ {{6}}"] },
    },
    {
      say: "Recuerda: resuelve como una ecuación, haciendo lo mismo en los dos lados. La respuesta es un tramo de números. Y revisa si el borde sirve.",
      visual: {
        type: "list",
        title: "Inecuaciones",
        items: ["⚖️ Lo mismo en los dos lados.", "📏 La respuesta es un tramo de números.", "🔍 Revisa si el borde sirve."],
      },
    },
  ],
};
