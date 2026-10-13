// Metáforas: la moneda no tiene memoria, y estimar con la frecuencia relativa
// es como probar una cucharada de sopa (más cucharadas, mejor estimación).
const RESULTS = "CSCCSCSCCSCCSCSCCSCS"; // 12 caras de 20

export default {
  id: "probabilidad-experimental",
  title: "Probabilidad y frecuencias",
  grade: "7° Básico",
  beats: [
    {
      say: "Lanzamos una moneda veinte veces y anotamos cada resultado: C para cara y S para sello.",
      visual: { type: "freq", results: RESULTS, reveal: 0 },
    },
    {
      say: "Estos fueron los resultados.",
      visual: { type: "freq", results: RESULTS, reveal: 20 },
    },
    {
      say: "Salió cara doce veces de veinte.",
      visual: { type: "freq", results: RESULTS, reveal: 20, highlight: "C", fraction: "12 caras de 20" },
    },
    {
      say: "La frecuencia relativa dice qué parte de las veces ocurrió: doce dividido en veinte, cero coma seis. Es decir, el sesenta por ciento de las veces.",
      visual: { type: "freq", results: RESULTS, reveal: 20, highlight: "C", fraction: "12 / 20 = 0,6 = 60 %" },
    },
    {
      say: "Pero cuidado: la moneda no tiene memoria. Que haya salido muchas caras no hace que la próxima vaya a ser sello. Ni cara.",
      visual: { type: "cards", items: [{ icon: "🪙", title: "La moneda no tiene memoria", text: "Lo que salió antes no cambia el próximo lanzamiento" }] },
    },
    {
      say: "La frecuencia relativa sirve para estimar la probabilidad, como probar una cucharada para saber cómo está la sopa. Mientras más lanzamientos, mejor la estimación.",
      visual: { type: "cards", items: [{ icon: "🍲", title: "Probar la sopa", text: "Una cucharada estima el sabor de la olla; con más cucharadas, mejor estimas" }] },
    },
    {
      say: "Otro ejemplo: en sesenta lanzamientos de un dado salen doce seis. Doce dividido en sesenta: cero coma dos.",
      visual: { type: "lines", lines: ["60 lanzamientos de dado · 12 veces sale 6", "12 / 60 = 0,2"], size: 68 },
    },
    {
      say: "Y si en ochenta giros de una ruleta, veinte terminan en azul: veinte de ochenta es cero coma veinticinco, o sea, el veinticinco por ciento.",
      visual: { type: "lines", lines: ["80 giros · 20 terminan en azul", "20 / 80 = 0,25 = 25 %"], size: 68 },
    },
    {
      say: "Recuerda: la frecuencia relativa es las veces que ocurrió, dividido en el total. Con más ensayos, mejor estimas. Y el azar no tiene memoria.",
      visual: {
        type: "list",
        title: "Frecuencia relativa",
        items: ["🔢 Veces que ocurrió ÷ total de ensayos.", "📈 Con más ensayos, mejor estimación.", "🪙 El azar no tiene memoria."],
      },
    },
  ],
};
