// Metáfora: la trayectoria de una pelota es una parábola.
export default {
  id: "funcion-cuadratica",
  title: "Función cuadrática",
  grade: "2° Medio",
  beats: [
    {
      say: "Cuando lanzas una pelota hacia arriba, sube, llega a una punta y baja. Esa curva se llama parábola.",
      visual: { type: "parabola", a: -1, h: 3, k: 9, window: [-1, 7, -2, 11] },
    },
    {
      say: "Las funciones con equis al cuadrado dibujan parábolas. Equis al cuadrado menos seis equis más cinco se abre hacia arriba, como una sonrisa, porque el número de la equis al cuadrado es positivo.",
      visual: { type: "parabola", a: 1, h: 3, k: -4, window: [-2, 8, -6, 10] },
      eq: "f(x) = x² − 6x + 5",
    },
    {
      say: "La punta se llama vértice. Está en equis igual a menos be dividido en dos a: seis dividido en dos, tres. Y f de tres es menos cuatro.",
      visual: { type: "parabola", a: 1, h: 3, k: -4, window: [-2, 8, -6, 10], vertex: true },
      eq: "x = 6 ÷ 2 = 3",
    },
    {
      say: "La parábola corta el eje y en el número solo, el que no tiene equis: cinco.",
      visual: { type: "parabola", a: 1, h: 3, k: -4, window: [-2, 8, -6, 10], vertex: true, yint: true },
      eq: "f(0) = 5",
    },
    {
      say: "Para calcular un valor, reemplaza. f de tres en equis al cuadrado menos cuatro es nueve menos cuatro, cinco. Ojo: tres al cuadrado es nueve, no seis.",
      visual: { type: "lines", lines: ["f(x) = x² − 4", "f(3) = 3 · 3 − 4", "= {{5}}"] },
      eq: "",
    },
    {
      say: "Recuerda: con equis al cuadrado, el gráfico es una parábola. Si a es positivo, se abre hacia arriba. El vértice está en menos be partido en dos a, y corta el eje y en ce.",
      visual: {
        type: "list",
        title: "Función cuadrática",
        items: ["😊 a > 0: se abre hacia arriba.", "📍 Vértice: x = −b ÷ (2a).", "↕️ Corta el eje y en c."],
      },
    },
  ],
};
