// Metáfora: todo polígono se corta en triángulos desde una esquina.
export default {
  id: "angulos-poligonos",
  title: "Ángulos de los polígonos",
  grade: "7° Básico",
  beats: [
    {
      say: "Los ángulos de un triángulo suman ciento ochenta grados. ¿Y los de un pentágono, que tiene cinco lados?",
      visual: { type: "poly", n: 5 },
    },
    {
      say: "Desde una esquina, traza líneas a las otras. El pentágono queda cortado en tres triángulos.",
      visual: { type: "poly", n: 5, diagonals: true },
      eq: "5 − 2 = 3 triángulos",
    },
    {
      say: "Cada triángulo suma ciento ochenta. Tres triángulos: quinientos cuarenta grados.",
      eq: "3 · 180° = 540°",
    },
    {
      say: "Con seis lados se forman cuatro triángulos. Siempre son dos menos que los lados.",
      visual: { type: "poly", n: 6, diagonals: true },
      eq: "(6 − 2) · 180° = 720°",
    },
    {
      say: "Si el polígono es regular, todos sus ángulos son iguales. Reparte la suma: setecientos veinte dividido en seis, ciento veinte grados cada uno.",
      eq: "720° ÷ 6 = 120°",
    },
    {
      say: "Los ángulos exteriores son más fáciles: en cualquier polígono suman trescientos sesenta, una vuelta completa.",
      visual: { type: "cards", items: [{ icon: "🔄", title: "Exteriores: 360°", text: "Una vuelta completa, en cualquier polígono" }] },
      eq: "",
    },
    {
      say: "Recuerda: un polígono de ene lados tiene ene menos dos triángulos. La suma es ene menos dos, por ciento ochenta.",
      visual: {
        type: "list",
        title: "Ángulos de polígonos",
        items: ["🔺 n lados → n − 2 triángulos.", "➕ Suma: (n − 2) · 180°.", "⚖️ Regular: reparte la suma.", "🔄 Exteriores: 360°."],
      },
    },
  ],
};
