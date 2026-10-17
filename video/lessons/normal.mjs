// Metáfora: la campana de las estaturas.
const labels = ["150", "160", "170", "180", "190"];

export default {
  id: "normal",
  title: "Distribución normal",
  grade: "4° Medio",
  beats: [
    {
      say: "Si mides la estatura de mucha gente, la mayoría queda cerca del promedio y pocos en los extremos. Se forma una campana.",
      visual: { type: "bell", labels },
    },
    {
      say: "Con promedio ciento setenta y desviación diez, el sesenta y ocho por ciento mide entre ciento sesenta y ciento ochenta: a una desviación del promedio.",
      visual: { type: "bell", labels, band: 1, text: "68 %" },
    },
    {
      say: "Con dos desviaciones, entre ciento cincuenta y ciento noventa, está el noventa y cinco por ciento.",
      visual: { type: "bell", labels, band: 2, text: "95 %" },
    },
    {
      say: "La campana es simétrica: la mitad está sobre el promedio.",
      visual: { type: "bell", labels, half: true, text: "50 %" },
    },
    {
      say: "El valor zeta dice a cuántas desviaciones está un dato. Alguien de ciento noventa: ciento noventa menos ciento setenta, veinte, dividido en diez: zeta igual dos.",
      visual: { type: "lines", lines: ["z = (dato − promedio) ÷ desviación", "(190 − 170) ÷ 10 = {{2}}"] },
    },
    {
      say: "Recuerda: a una desviación del promedio está el sesenta y ocho por ciento; a dos, el noventa y cinco. Y zeta cuenta las desviaciones.",
      visual: {
        type: "list",
        title: "Distribución normal",
        items: ["🔔 ±1 desviación: 68 %.", "🔔 ±2 desviaciones: 95 %.", "📏 z = (dato − promedio) ÷ desviación."],
      },
    },
  ],
};
