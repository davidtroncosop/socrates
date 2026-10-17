// Metáfora: manzanas y peras; un número con dos partes.
export default {
  id: "complejos",
  title: "Números complejos",
  grade: "3° Medio",
  beats: [
    {
      say: "¿Qué número al cuadrado da menos uno? Ningún número real: tanto positivo como negativo al cuadrado dan positivo.",
      visual: { type: "lines", lines: ["1² = 1", "(−1)² = 1", "?² = −1"] },
    },
    {
      say: "Por eso se inventó un número nuevo, i, con una sola regla: i al cuadrado es menos uno.",
      visual: { type: "lines", lines: ["i² = {{−1}}"] },
    },
    {
      say: "Un número complejo tiene dos partes: tres más dos i tiene parte real tres y parte imaginaria dos.",
      visual: { type: "lines", lines: ["3 + 2i", "real: [[3]]   imaginaria: [[2]]"] },
    },
    {
      say: "Para sumar, junta como manzanas con manzanas y peras con peras: reales con reales, imaginarios con imaginarios. Tres más dos i, más uno más cuatro i, da cuatro más seis i.",
      visual: { type: "lines", lines: ["(3 + 2i) + (1 + 4i)", "= (3 + 1) + (2 + 4)i", "= {{4 + 6i}}"] },
    },
    {
      say: "Un complejo se dibuja como un punto: la parte real hacia el lado y la imaginaria hacia arriba. Su distancia al cero es el módulo: para tres más cuatro i, cinco, por Pitágoras.",
      visual: { type: "plane", max: 6, walk: [3, 4], points: [[0, 0, ""], [3, 4, "3 + 4i"]] },
      eq: "|3 + 4i| = √(9 + 16) = 5",
    },
    {
      say: "Recuerda: i al cuadrado es menos uno. Suma las partes reales por un lado y las imaginarias por otro. Y el módulo se calcula con Pitágoras.",
      visual: {
        type: "list",
        title: "Números complejos",
        items: ["i² = −1.", "🍎 Real con real, imaginaria con imaginaria.", "📏 Módulo: √(a² + b²)."],
      },
      eq: "",
    },
  ],
};
