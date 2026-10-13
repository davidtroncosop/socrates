// Metáforas: la entrada al parque de diversiones (n, lo que pagas aunque no
// te subas a nada) y la escalera de peldaños iguales (m, la pendiente).
const chart = (more) => ({ type: "chart", m: 2, n: 5, xmax: 5, ymax: 16, xLabel: "juegos", yLabel: "miles de $", ...more });

export default {
  id: "funcion",
  title: "Función afín y pendiente",
  grade: "8° Básico",
  beats: [
    {
      say: "En un parque de diversiones pagas cinco mil pesos de entrada, y dos mil por cada juego. ¿Cuánto gastas si te subes a tres juegos?",
      visual: { type: "cards", items: [{ icon: "🎡", title: "La entrada y los juegos", text: "Entrada: $5 000 · Cada juego: $2 000" }] },
    },
    {
      say: "Eso es una función: f de equis, igual a dos equis más cinco, en miles de pesos. Equis es la cantidad de juegos; el dos es lo que sube cada juego, y el cinco es lo que pagas aunque no te subas a ninguno.",
      visual: { type: "lines", lines: ["f(x) = 2x + 5", "x: juegos   ·   f(x): miles de pesos"], size: 70 },
    },
    {
      say: "Para tres juegos, reemplazamos equis por tres: dos por tres, seis, más cinco, once. Gastas once mil pesos.",
      visual: { type: "lines", lines: ["f(x) = 2x + 5", "x: juegos   ·   f(x): miles de pesos", "f(3) = 2 · 3 + 5 = 11"], size: 70 },
    },
    {
      say: "Veámoslo en un gráfico. Con cero juegos ya pagaste cinco mil: ese es el punto de partida, donde la recta corta el eje vertical.",
      visual: chart({ points: [0] }),
      eq: "f(x) = 2x + 5",
    },
    {
      say: "Cada juego más suma dos mil: un paso a la derecha, dos hacia arriba. Es como subir una escalera con peldaños siempre iguales.",
      visual: chart({ points: [0, 1, 2, 3, 4, 5], stairs: true }),
    },
    {
      say: "Los puntos quedan alineados en una recta. La pendiente, el dos, dice qué tan empinada es la escalera. Y en equis igual a tres, la altura es once.",
      visual: chart({ points: [0, 1, 2, 3, 4, 5], stairs: true, line: true, highlight: 3 }),
    },
    {
      say: "En f de equis igual a eme equis más ene: eme es la pendiente, cuánto sube en cada paso; y ene es el punto de partida.",
      visual: {
        type: "cards",
        items: [
          { icon: "🧗", title: "Pendiente m", text: "Cuánto sube por cada paso" },
          { icon: "🚩", title: "Valor inicial n", text: "Dónde partes cuando x = 0" },
        ],
      },
      eq: "f(x) = mx + n",
    },
    {
      say: "Si la pendiente es negativa, la escalera baja: como una tarjeta con quince mil pesos que pierde dos mil por cada juego. Después de tres juegos, quedan nueve mil.",
      visual: { type: "lines", lines: ["f(x) = −2x + 15", "f(3) = −2 · 3 + 15 = 9"] },
      eq: "",
    },
    {
      say: "Recuerda: ene es el punto de partida, eme es cuánto cambia en cada paso, y para evaluar reemplazas la equis y calculas.",
      visual: {
        type: "list",
        title: "Función afín",
        items: ["🚩 n: el punto de partida (x = 0).", "🧗 m: cuánto cambia por cada paso.", "🔁 Para evaluar, reemplaza x y calcula."],
      },
    },
  ],
};
