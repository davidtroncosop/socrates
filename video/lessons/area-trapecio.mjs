// Metáfora: dos trapecios iguales forman un paralelogramo.
export default {
  id: "area-trapecio",
  title: "Área del trapecio",
  grade: "7° Básico",
  beats: [
    {
      say: "Un trapecio tiene dos lados paralelos: la base mayor, de ocho, y la base menor, de cuatro. Su altura es tres.",
      visual: { type: "trapezoid", B: 8, b: 4, h: 3 },
    },
    {
      say: "Pon otro trapecio igual, dado vuelta, al lado. Juntos forman un paralelogramo.",
      visual: { type: "trapezoid", B: 8, b: 4, h: 3, double: true },
    },
    {
      say: "La base del paralelogramo es ocho más cuatro, doce. Su área es doce por tres: treinta y seis.",
      eq: "(8 + 4) · 3 = 36",
    },
    {
      say: "Pero ese es el área de dos trapecios. Uno solo es la mitad: dieciocho.",
      eq: "36 ÷ 2 = 18",
    },
    {
      say: "Por eso el área del trapecio es: base mayor más base menor, por la altura, dividido en dos.",
      visual: { type: "lines", lines: ["Área = (B + b) · h ÷ 2", "(8 + 4) · 3 ÷ 2 = {{18}}"] },
      eq: "",
    },
    {
      say: "Paso a paso, con bases diez y seis y altura cuatro. Paso uno: suma las bases. Paso dos: multiplica por la altura. Paso tres: divide por dos.",
      visual: { type: "lines", lines: ["Paso 1: 10 + 6 = 16", "Paso 2: 16 · 4 = 64", "Paso 3: 64 ÷ 2 = {{32}}"] },
      eq: "",
    },
    {
      say: "Recuerda: suma las dos bases, multiplica por la altura y no olvides dividir por dos.",
      visual: {
        type: "list",
        title: "Área del trapecio",
        items: ["➕ Suma las dos bases.", "✖️ Multiplica por la altura.", "➗ Divide por 2."],
      },
    },
  ],
};
