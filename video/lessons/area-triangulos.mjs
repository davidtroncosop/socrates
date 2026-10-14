// Metáforas: el área cuenta cuadraditos; el triángulo es la mitad de un
// rectángulo; el paralelogramo se arma como rectángulo moviendo un triángulo.
export default {
  id: "area-triangulos",
  title: "Área de triángulos y paralelogramos",
  grade: "7° Básico",
  beats: [
    {
      say: "El área cuenta cuántos cuadraditos caben en una figura. Este rectángulo mide cinco por tres.",
      visual: { type: "shape", kind: "rect", base: 5, height: 3, grid: true, labels: { base: "5 cm", height: "3 cm" } },
    },
    {
      say: "Hay cinco cuadraditos por fila y tres filas: quince cuadraditos. El área es quince centímetros cuadrados.",
      eq: "5 · 3 = 15 cm²",
    },
    {
      say: "Un triángulo es la mitad de un rectángulo. Si dibujas el rectángulo de seis por cuatro alrededor, el triángulo ocupa justo la mitad.",
      visual: { type: "shape", kind: "triangle", base: 6, height: 4, labels: { base: "6 cm", height: "4 cm" } },
      eq: "6 · 4 = 24",
    },
    {
      say: "Por eso el área del triángulo es base por altura, dividido en dos. Seis por cuatro es veinticuatro, y la mitad es doce.",
      eq: "6 · 4 ÷ 2 = 12 cm²",
    },
    {
      say: "¿Y un paralelogramo? Si cortas el triángulo de un lado y lo pegas en el otro, se transforma en un rectángulo.",
      visual: { type: "shape", kind: "parallelogram", base: 7, height: 3, labels: { base: "7 cm", height: "3 cm" } },
      eq: "",
    },
    {
      say: "El rectángulo tiene la misma base y la misma altura. Por eso el área del paralelogramo es base por altura: siete por tres, veintiuno.",
      visual: { type: "shape", kind: "parallelogram", base: 7, height: 3, asRect: true, labels: { base: "7 cm", height: "3 cm" } },
      eq: "7 · 3 = 21 cm²",
    },
    {
      say: "Ojo: la altura siempre se mide derecha, formando una esquina recta con la base. No es el lado inclinado.",
      visual: { type: "cards", items: [{ icon: "📏", title: "La altura se mide derecha", text: "Forma una esquina recta con la base: no es el lado inclinado" }] },
      eq: "",
    },
    {
      say: "Recuerda: rectángulo, base por altura. Triángulo, base por altura dividido en dos. Paralelogramo, base por altura.",
      visual: {
        type: "list",
        title: "Área",
        items: ["🟦 Rectángulo: base · altura.", "🔺 Triángulo: base · altura ÷ 2.", "▱ Paralelogramo: base · altura.", "📏 La altura se mide derecha."],
      },
    },
  ],
};
