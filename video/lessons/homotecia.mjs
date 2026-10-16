// Metáfora: una linterna que proyecta una sombra más grande.
const tri = (k) => [[1 * k, 1 * k], [3 * k, 1 * k], [1 * k, 2 * k]];

export default {
  id: "homotecia",
  title: "Homotecia",
  grade: "1° Medio",
  beats: [
    {
      say: "Una homotecia agranda o achica una figura desde un punto, como una linterna que proyecta una sombra en la pared.",
      visual: { type: "cards", items: [{ icon: "🔦", title: "Homotecia", text: "Agrandar o achicar desde un punto" }] },
    },
    {
      say: "Este triángulo tiene un vértice en uno, dos.",
      visual: { type: "plane", max: 7, polygons: [tri(1)], points: [[1, 2]] },
    },
    {
      say: "Con razón dos desde el origen, cada coordenada se multiplica por dos. El punto uno, dos llega a dos, cuatro. Todo el triángulo mide el doble.",
      visual: { type: "plane", max: 7, polygons: [tri(1), tri(2)], points: [[1, 2], [2, 4]] },
      eq: "k = 2: (1, 2) → (2, 4)",
    },
    {
      say: "Con razón tres, todo mide el triple. Un lado de cuatro centímetros pasa a medir doce.",
      visual: { type: "lines", lines: ["k = 3", "4 cm · 3 = {{12 cm}}"] },
      eq: "",
    },
    {
      say: "Si la razón es un medio, la figura se achica a la mitad. Diez centímetros pasan a cinco.",
      visual: { type: "lines", lines: ["k = 1/2", "10 cm · 1/2 = {{5 cm}}"] },
    },
    {
      say: "Recuerda: la razón k dice cuántas veces. Mayor que uno agranda, menor que uno achica. Todo se multiplica por k.",
      visual: {
        type: "list",
        title: "Homotecia",
        items: ["🔦 Se agranda o achica desde un punto.", "✖️ Todo se multiplica por k.", "🔼 k > 1 agranda; 🔽 k < 1 achica."],
      },
    },
  ],
};
