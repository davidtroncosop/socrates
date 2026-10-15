// Metáfora: contar con palitos y comparar con el total.
const bars = (highlight) => ({ type: "bars", ymax: 12, ystep: 4, highlight, bars: [{ label: "a pie", values: [4] }, { label: "auto", values: [5] }, { label: "bus", values: [11] }] });

export default {
  id: "frecuencias",
  title: "Tablas de frecuencia",
  grade: "7° Básico",
  beats: [
    {
      say: "Preguntamos a veinte estudiantes cómo llegan al colegio. Cuatro a pie, cinco en auto y once en bus.",
      visual: bars(),
    },
    {
      say: "Esos números son las frecuencias absolutas: cuántas veces aparece cada respuesta. Sumadas dan el total, veinte.",
      visual: { type: "lines", lines: ["a pie: 4", "auto: 5", "bus: 11", "Total: {{20}}"] },
    },
    {
      say: "La frecuencia relativa compara con el total. A pie: cuatro de veinte. Cuatro dividido en veinte es cero coma dos.",
      visual: bars(0),
      eq: "4 ÷ 20 = 0,2",
    },
    {
      say: "Multiplicada por cien da el porcentaje: el veinte por ciento llega a pie.",
      eq: "0,2 · 100 = 20 %",
    },
    {
      say: "En bus: once de veinte, cero coma cincuenta y cinco. El cincuenta y cinco por ciento. Más de la mitad.",
      visual: bars(2),
      eq: "11 ÷ 20 = 0,55 = 55 %",
    },
    {
      say: "Recuerda: la frecuencia absoluta cuenta. La relativa divide por el total. Y por cien, es el porcentaje.",
      visual: {
        type: "list",
        title: "Frecuencias",
        items: ["🔢 Absoluta: cuántas veces.", "➗ Relativa: veces ÷ total.", "💯 Por 100: el porcentaje."],
      },
      eq: "",
    },
  ],
};
