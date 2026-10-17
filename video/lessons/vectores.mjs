// Metáfora: flechas que se encadenan.
const plane = (more) => ({ type: "plane", min: -2, max: 8, ...more });

export default {
  id: "vectores",
  title: "Vectores",
  grade: "2° Medio",
  beats: [
    {
      say: "Un vector es una flecha. El vector dos, tres dice: avanza dos en equis y sube tres.",
      visual: plane({ vector: [[0, 0], [2, 3]], points: [[0, 0, "inicio"], [2, 3]] }),
      eq: "(2, 3)",
    },
    {
      say: "Para sumar vectores, pon uno detrás del otro. Después de dos, tres, sigue el cuatro, menos uno.",
      visual: plane({ vector: [[2, 3], [4, -1]], points: [[2, 3], [6, 2]] }),
      eq: "(2, 3) + (4, −1)",
    },
    {
      say: "Llegas a seis, dos. Se suman las equis con las equis y las y con las y: dos más cuatro, seis; tres menos uno, dos.",
      eq: "(2 + 4, 3 − 1) = (6, 2)",
    },
    {
      say: "El largo de un vector se llama módulo. El vector tres, cuatro forma un triángulo rectángulo: por Pitágoras, raíz de nueve más dieciséis, cinco.",
      visual: plane({ vector: [[0, 0], [3, 4]], walk: [3, 4], points: [[0, 0, ""], [3, 4]] }),
      eq: "|(3, 4)| = √(9 + 16) = 5",
    },
    {
      say: "Multiplicar un vector por tres lo hace tres veces más largo: cada componente se multiplica por tres.",
      visual: { type: "lines", lines: ["3 · (2, −1)", "= (6, {{−3}})"] },
      eq: "",
    },
    {
      say: "Recuerda: suma x con x e y con y. El módulo se calcula con Pitágoras. Y multiplicar por un número estira la flecha.",
      visual: {
        type: "list",
        title: "Vectores",
        items: ["➡️ Suma componente a componente.", "📏 Módulo: √(a² + b²).", "✖️ k · (a, b) = (ka, kb)."],
      },
    },
  ],
};
