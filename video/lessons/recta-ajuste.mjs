// Metáfora: una recta que pasa por el medio de la nube.
const pts = [[1, 3], [2, 4], [2, 6], [3, 7], [4, 8], [5, 10], [5, 12], [6, 12]];

export default {
  id: "recta-ajuste",
  title: "Recta de ajuste",
  grade: "1° Medio",
  beats: [
    {
      say: "Cada punto es un estudiante: horas de estudio hacia el lado y puntaje hacia arriba. Juntos forman una nube de puntos.",
      visual: { type: "plane", max: 13, points: pts.map(([x, y]) => [x, y, ""]) },
    },
    {
      say: "La nube sube: quienes estudian más tienden a sacar más puntaje. Una recta que pasa por el medio de la nube se llama recta de ajuste.",
      visual: { type: "plane", max: 13, points: pts.map(([x, y]) => [x, y, ""]), line: [2, 1] },
      eq: "y = 2x + 1",
    },
    {
      say: "La recta sirve para estimar. Con cinco horas: dos por cinco más uno, once puntos.",
      visual: { type: "plane", max: 13, points: [...pts.map(([x, y]) => [x, y, ""]), [5, 11, "(5, 11)"]], line: [2, 1] },
      eq: "2 · 5 + 1 = 11",
    },
    {
      say: "La pendiente dice cuánto sube por cada paso. Aquí, cada hora de estudio suma unos dos puntos.",
      visual: { type: "lines", lines: ["pendiente = sube ÷ avanza", "de (1, 3) a (3, 7): 4 ÷ 2 = {{2}}"] },
      eq: "",
    },
    {
      say: "Ojo: es una estimación. Los puntos reales no caen justo en la recta, y estudiar más no garantiza la nota.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Es una estimación", text: "Muestra una tendencia, no una certeza" }] },
    },
    {
      say: "Recuerda: la recta de ajuste pasa por el medio de la nube. Para estimar, reemplaza x en la recta.",
      visual: {
        type: "list",
        title: "Recta de ajuste",
        items: ["☁️ Pasa por el medio de la nube.", "📈 Pendiente: cuánto sube por paso.", "🔮 Sirve para estimar."],
      },
    },
  ],
};
