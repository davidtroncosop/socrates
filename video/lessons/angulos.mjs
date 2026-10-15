// Metáfora: una recta es medio giro (180°); el triángulo cabe en una recta.
export default {
  id: "angulos",
  title: "Ángulos",
  grade: "6° Básico",
  beats: [
    {
      say: "Una recta es medio giro: mide ciento ochenta grados. Si un rayo la parte en dos ángulos, los dos juntos suman ciento ochenta.",
      visual: { type: "angles", kind: "straight", a: 70, labels: ["70°", "110°"] },
      eq: "70° + 110° = 180°",
    },
    {
      say: "Si uno mide setenta, el otro es ciento ochenta menos setenta: ciento diez.",
      visual: { type: "angles", kind: "straight", a: 70, labels: ["70°", "?"] },
      eq: "180° − 70° = 110°",
    },
    {
      say: "Cuando dos rectas se cruzan, se forman cuatro ángulos. Los que están frente a frente, opuestos por el vértice, son iguales.",
      visual: { type: "angles", kind: "cross", a: 40, labels: ["40°", "140°", "40°", "140°"] },
      eq: "",
    },
    {
      say: "Los tres ángulos de un triángulo siempre suman ciento ochenta grados. Si recortas las tres esquinas y las juntas, forman una recta.",
      visual: { type: "angles", kind: "triangle", a: 50, b: 60, labels: ["50°", "60°", "70°"] },
      eq: "50° + 60° + 70° = 180°",
    },
    {
      say: "Si conoces dos, encuentras el tercero: cincuenta más sesenta es ciento diez, y ciento ochenta menos ciento diez es setenta.",
      visual: { type: "angles", kind: "triangle", a: 50, b: 60, labels: ["50°", "60°", "?"] },
      eq: "180° − 110° = 70°",
    },
    {
      say: "Un cuadrilátero se divide en dos triángulos. Por eso sus cuatro ángulos suman el doble: trescientos sesenta grados.",
      visual: { type: "angles", kind: "quad", labels: ["?", "?", "?", "?"] },
      eq: "2 · 180° = 360°",
    },
    {
      say: "Recuerda: en una recta, ciento ochenta. Opuestos por el vértice, iguales. Triángulo, ciento ochenta. Cuadrilátero, trescientos sesenta.",
      visual: {
        type: "list",
        title: "Ángulos",
        items: ["➖ En una recta suman 180°.", "✖️ Opuestos por el vértice: iguales.", "🔺 Triángulo: 180°.", "◻️ Cuadrilátero: 360°."],
      },
      eq: "",
    },
  ],
};
