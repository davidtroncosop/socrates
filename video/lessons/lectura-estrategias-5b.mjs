// Metáfora: resumir es hacer la maleta para un viaje corto (llevas lo
// esencial, dejas los detalles).
const bees = "Las abejas cumplen un rol vital: al recolectar polen para alimentarse, polinizan miles de plantas que producen frutos y semillas. Algunas abejas tienen rayas más oscuras que otras.";
const beesA = "Las abejas cumplen un rol vital: al recolectar polen para alimentarse, {{polinizan miles de plantas que producen frutos y semillas}}. Algunas abejas tienen rayas más oscuras que otras.";
const beesB = "Las abejas cumplen un rol vital: al recolectar polen para alimentarse, {{polinizan miles de plantas que producen frutos y semillas}}. ~~Algunas abejas tienen rayas más oscuras que otras.~~";

export default {
  id: "lectura-estrategias-5b",
  title: "Resumen e ideas principales",
  grade: "5° Básico",
  beats: [
    {
      say: "Resumir es como hacer la maleta para un viaje corto: no cabe todo, así que llevas lo esencial y dejas lo que sobra.",
      visual: { type: "cards", items: [{ icon: "🧳", title: "Resumir es hacer la maleta", text: "Llevas lo esencial y dejas lo que sobra" }] },
    },
    {
      say: "Lee: Las abejas cumplen un rol vital: al recolectar polen para alimentarse, polinizan miles de plantas que producen frutos y semillas. Algunas abejas tienen rayas más oscuras que otras.",
      visual: { type: "passage", text: bees },
    },
    {
      say: "Primera pregunta: ¿de qué habla el texto? De las abejas, y de lo que hacen por las plantas.",
      visual: { type: "passage", text: beesA, notes: [{ label: "¿De qué habla?", text: "De las abejas y las plantas" }] },
    },
    {
      say: "Segunda pregunta: ¿qué es lo más importante? Que al alimentarse polinizan las plantas que nos dan frutos. Lo de las rayas es un detalle: no va en la maleta.",
      visual: {
        type: "passage",
        text: beesB,
        notes: [
          { label: "¿De qué habla?", text: "De las abejas y las plantas" },
          { label: "Lo más importante", text: "Al alimentarse, polinizan plantas que dan frutos y semillas" },
        ],
      },
    },
    {
      say: "El resumen cabe en una sola oración: las abejas polinizan plantas que producen frutos y semillas.",
      visual: { type: "cards", items: [{ icon: "✅", title: "Resumen", text: "Las abejas polinizan plantas que producen frutos y semillas." }] },
    },
    {
      say: "En un texto de instrucciones, lo esencial son los pasos en orden: primero, luego, al final. Que el papel sea de cualquier color es un detalle.",
      visual: {
        type: "passage",
        text: "Para armar un volantín necesitas dos varillas, papel y cuerda. {{Primero}} se cruzan las varillas, {{luego}} se pega el papel tenso y {{al final}} se amarra la cuerda. ~~El papel puede ser de cualquier color.~~",
        notes: [{ label: "Lo esencial", text: "Los pasos, en orden" }],
      },
    },
    {
      say: "Para resumir, pregúntate: ¿de qué habla el texto?, ¿qué es lo más importante?, y deja fuera los detalles y lo que se repite.",
      visual: {
        type: "list",
        title: "Para resumir",
        items: ["❓ ¿De qué habla el texto?", "⭐ ¿Qué es lo más importante?", "🧳 Deja fuera los detalles y lo repetido."],
      },
    },
  ],
};
