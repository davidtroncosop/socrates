// Metáforas: frutas (solo se juntan las de la misma fruta) y la letra como
// apellido del término.
export default {
  id: "semejantes",
  title: "Reducción de términos semejantes",
  grade: "7° Básico",
  beats: [
    {
      say: "Si tienes tres manzanas y te dan ocho manzanas más, ¿cuántas tienes? Once manzanas. Es fácil, porque son la misma fruta.",
      visual: { type: "tokens", groups: [{ icon: "🍎", count: 3, label: "3 manzanas" }, { op: "+" }, { icon: "🍎", count: 8, label: "8 manzanas" }] },
    },
    {
      say: "Juntamos las cantidades, y la fruta sigue siendo la misma.",
      visual: { type: "tokens", groups: [{ icon: "🍎", count: 3, label: "3 manzanas" }, { op: "+" }, { icon: "🍎", count: 8, label: "8 manzanas" }, { op: "=" }, { icon: "🍎", count: 11, label: "11 manzanas" }] },
    },
    {
      say: "En álgebra pasa lo mismo. Tres equis más ocho equis son once equis. El número de adelante, el coeficiente, dice cuántas hay; la letra dice de qué tipo son.",
      visual: { type: "tokens", size: 60, groups: [{ tile: "x", count: 3, label: "3x" }, { op: "+" }, { tile: "x", count: 8, label: "8x" }, { op: "=" }, { tile: "x", count: 11, label: "11x" }] },
      eq: "3x + 8x = 11x",
    },
    {
      say: "Pero tres manzanas y dos plátanos no son cinco manzanátanos. Son de distinto tipo, así que no se juntan. Tres equis más dos ye se queda así.",
      visual: { type: "tokens", groups: [{ icon: "🍎", count: 3, label: "3 manzanas" }, { op: "+" }, { icon: "🍌", count: 2, label: "2 plátanos" }] },
      eq: "3x + 2y",
    },
    {
      say: "Piensa que la letra es el apellido del término. Solo se juntan los que tienen exactamente el mismo apellido: equis con equis, ye con ye, y equis al cuadrado con equis al cuadrado.",
      visual: { type: "cards", items: [{ icon: "🏷️", title: "La letra es el apellido", text: "Solo se juntan los términos con el mismo apellido: x con x, y con y, x² con x²" }] },
      eq: "",
    },
    {
      say: "¿Y nueve equis menos doce equis? Tienes nueve, pero debes entregar doce: te faltan tres. El resultado es menos tres equis.",
      visual: { type: "tokens", size: 60, groups: [{ tile: "x", count: 9, label: "9x" }, { op: "−" }, { tile: "x", count: 12, label: "12x" }, { op: "=" }, { tile: "x", count: 3, label: "−3x", debt: true }] },
      eq: "9x − 12x = −3x",
    },
    {
      say: "Con varios términos, vamos de a uno: cinco equis más siete equis son doce equis; menos cuatro equis, ocho equis.",
      visual: { type: "lines", lines: ["5x + 7x − 4x", "= 12x − 4x", "= 8x"] },
      eq: "",
    },
    {
      say: "Y si hay distintos apellidos, primero los agrupamos: las equis con las equis, y las ye con las ye. Queda seis equis más dos ye.",
      visual: { type: "lines", lines: ["4x + 3y + 2x − y", "= (4x + 2x) + (3y − y)", "= 6x + 2y"] },
    },
    {
      say: "Recuerda: se juntan solo los términos con el mismo apellido; se suman o restan sus coeficientes, y la letra se mantiene igual.",
      visual: {
        type: "list",
        title: "Términos semejantes",
        items: ["🏷️ Solo se juntan los de igual parte literal (el apellido).", "🔢 Se suman o restan los coeficientes.", "🔒 La parte literal no cambia."],
      },
    },
  ],
};
