// Metáfora: dar una vuelta caminando por el borde.
export default {
  id: "base-perimetro",
  title: "Perímetro",
  grade: "Base",
  beats: [
    {
      say: "El perímetro es lo que caminas al dar una vuelta completa por el borde de una figura.",
      visual: { type: "shape", kind: "rect", base: 5, height: 3, labels: { base: "5 cm", height: "3 cm" } },
    },
    {
      say: "Paso uno: anota todos los lados. Un rectángulo tiene dos largos de cinco y dos anchos de tres.",
      visual: { type: "lines", lines: ["Paso 1: 5, 3, 5, 3"] },
      eq: "",
    },
    {
      say: "Paso dos: súmalos. Cinco más tres más cinco más tres: dieciséis centímetros.",
      visual: { type: "lines", lines: ["Paso 1: 5, 3, 5, 3", "Paso 2: 5 + 3 + 5 + 3 = {{16 cm}}"] },
    },
    {
      say: "En un cuadrado los cuatro lados son iguales: lado por cuatro. Un cuadrado de seis tiene perímetro veinticuatro.",
      visual: { type: "lines", lines: ["Cuadrado de lado 6", "6 · 4 = {{24 cm}}"] },
    },
    {
      say: "Ojo: no lo confundas con el área. El área cuenta los cuadraditos de adentro; el perímetro, el borde. Para poner una malla alrededor de un huerto, usas el perímetro.",
      visual: { type: "cards", items: [{ icon: "🚶", title: "Perímetro: el borde", text: "Malla, cerca, cinta" }, { icon: "🟦", title: "Área: lo de adentro", text: "Pasto, pintura, baldosas" }] },
    },
    {
      say: "Recuerda: el perímetro suma todos los lados. Rectángulo: largo más ancho, por dos. Cuadrado: lado por cuatro.",
      visual: {
        type: "list",
        title: "Perímetro",
        items: ["1️⃣ Anota todos los lados.", "2️⃣ Súmalos.", "▭ Rectángulo: (largo + ancho) · 2.", "◻️ Cuadrado: lado · 4."],
      },
    },
  ],
};
