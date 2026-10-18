// Metáfora: la etiqueta de la tienda; lo que se descuenta y lo que pagas.
const bar = (filled, caption) => ({ type: "bar", total: "$10.000", parts: 10, filled, partLabel: "10 %", caption });

export default {
  id: "variacion-porcentual",
  title: "Aumentos y descuentos",
  grade: "8° Básico",
  beats: [
    {
      say: "Una polera cuesta diez mil pesos y tiene treinta por ciento de descuento. ¿Cuánto pagas?",
      visual: bar(10, "Precio: $10.000"),
    },
    {
      say: "El treinta por ciento de diez mil es tres mil. Ese es el descuento.",
      visual: bar(7, "Descuento: 30 % = $3.000"),
      eq: "10.000 · 0,3 = 3.000",
    },
    {
      say: "Pagas lo que queda: diez mil menos tres mil, siete mil pesos. Es el setenta por ciento del precio.",
      eq: "10.000 − 3.000 = 7.000",
    },
    {
      say: "Un aumento es al revés: se suma. Un pasaje de cinco mil que sube veinte por ciento: el veinte por ciento es mil, y ahora cuesta seis mil.",
      visual: { type: "lines", lines: ["20 % de 5.000 = 1.000", "5.000 + 1.000 = {{6.000}}"] },
      eq: "",
    },
    {
      say: "¿Y en qué porcentaje aumentó algo? Un curso pasó de cuarenta a cincuenta estudiantes. Aumentó diez. Diez de cuarenta es el veinticinco por ciento. Siempre se compara con lo que había antes.",
      visual: { type: "lines", lines: ["40 → 50: aumentó 10", "10 ÷ [[40]] = 0,25 = {{25 %}}"] },
    },
    {
      say: "Paso a paso, para un descuento del treinta por ciento sobre diez mil. Paso uno: calcula el porcentaje. Paso dos: réstalo si es descuento, o súmalo si es aumento.",
      visual: { type: "lines", lines: ["Paso 1: 30 % de 10.000 = 3.000", "Paso 2: 10.000 − 3.000 = {{7.000}}"] },
      eq: "",
    },
    {
      say: "Recuerda: calcula el porcentaje del precio. En un descuento, réstalo. En un aumento, súmalo. Y para saber el porcentaje de cambio, compara con lo de antes.",
      visual: {
        type: "list",
        title: "Aumentos y descuentos",
        items: ["🏷️ Descuento: se resta.", "📈 Aumento: se suma.", "🔍 % de cambio: compara con lo de antes."],
      },
    },
  ],
};
