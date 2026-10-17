// Metáfora: el viaje en bus: distancia, velocidad y tiempo.
export default {
  id: "problemas-viajes",
  title: "Problemas: viajes y horarios",
  grade: "7° Básico",
  beats: [
    {
      say: "Un bus va a ochenta kilómetros por hora. Eso significa que en cada hora avanza ochenta kilómetros.",
      visual: { type: "cards", items: [{ icon: "🚌", title: "80 km/h", text: "80 km en cada hora" }] },
    },
    {
      say: "En tres horas: ochenta por tres, doscientos cuarenta kilómetros. Distancia es velocidad por tiempo.",
      visual: { type: "lines", lines: ["distancia = velocidad · tiempo", "80 · 3 = {{240 km}}"] },
    },
    {
      say: "Al revés: un viaje de trescientos kilómetros a cien por hora dura trescientos dividido en cien: tres horas.",
      visual: { type: "lines", lines: ["tiempo = distancia ÷ velocidad", "300 ÷ 100 = {{3 h}}"] },
    },
    {
      say: "Para los horarios, suma horas con horas y minutos con minutos. El bus sale a las catorce treinta y el viaje dura dos horas y cuarenta y cinco minutos.",
      visual: { type: "lines", lines: ["Sale: 14:30", "Dura: 2 h 45 min"] },
    },
    {
      say: "Horas: catorce más dos, dieciséis. Minutos: treinta más cuarenta y cinco, setenta y cinco. Pero setenta y cinco minutos son una hora y quince. Llega a las diecisiete quince.",
      visual: { type: "lines", lines: ["14 + 2 = 16 h", "30 + 45 = 75 min = [[1 h 15 min]]", "Llega: {{17:15}}"] },
    },
    {
      say: "Recuerda: distancia es velocidad por tiempo; tiempo es distancia dividido en velocidad. Y en los horarios, cada sesenta minutos forman una hora.",
      visual: {
        type: "list",
        title: "Viajes",
        items: ["🚌 Distancia = velocidad · tiempo.", "⏱️ Tiempo = distancia ÷ velocidad.", "🕒 60 minutos = 1 hora."],
      },
    },
  ],
};
