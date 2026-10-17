// Metáfora: repetir el mismo intento; el tablero de Galton cuenta los órdenes.
export default {
  id: "binomial",
  title: "Distribución binomial",
  grade: "4° Medio",
  beats: [
    {
      say: "Lanzas tres monedas. ¿Cuál es la probabilidad de exactamente dos caras?",
      visual: { type: "cards", items: [{ icon: "🪙", title: "3 lanzamientos", text: "¿Exactamente 2 caras?" }] },
    },
    {
      say: "Hay ocho resultados posibles. Con dos caras hay tres: cara cara sello, cara sello cara y sello cara cara.",
      visual: { type: "lines", lines: ["CCC  [[CCS]]  [[CSC]]  CSS", "[[SCC]]  SCS  SSC  SSS", "3 de 8 = {{3/8}}"] },
    },
    {
      say: "Es como el tablero de Galton: a los extremos llega un solo camino y al centro, varios. Uno, tres, tres, uno.",
      visual: { type: "galton", rows: 3, counts: [1, 3, 3, 1], highlight: 2 },
      eq: "P(2 caras) = 3/8",
    },
    {
      say: "Esto es una distribución binomial: repites un intento con dos resultados, éxito o fracaso, y cuentas los éxitos.",
      visual: { type: "cards", items: [{ icon: "🔁", title: "Binomial", text: "n intentos iguales, contar los éxitos" }] },
      eq: "",
    },
    {
      say: "¿Cuántos éxitos esperas? Ene por pe. Si aciertas el treinta por ciento de tus tiros, en diez tiros esperas tres aciertos.",
      visual: { type: "lines", lines: ["esperado = n · p", "10 · 0,3 = {{3}}"] },
    },
    {
      say: "Recuerda: cuenta los órdenes que dan los éxitos que buscas y divide por todos los casos. Y el valor esperado es ene por pe.",
      visual: {
        type: "list",
        title: "Binomial",
        items: ["🔁 Mismo intento, repetido.", "✋ Cuenta los órdenes posibles.", "📊 Esperado: n · p."],
      },
    },
  ],
};
