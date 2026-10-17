// Metáfora: rectas que cortan justo por la mitad.
export default {
  id: "construcciones",
  title: "Elementos del triángulo",
  grade: "7° Básico",
  beats: [
    {
      say: "Algunas rectas tienen nombre propio. La simetral corta un segmento justo por la mitad, formando un ángulo recto.",
      visual: { type: "angles", kind: "straight", a: 90, labels: ["90°", "90°"] },
      eq: "Simetral: mitad + ángulo recto",
    },
    {
      say: "Si el segmento mide diez centímetros, la simetral lo deja en dos partes de cinco.",
      visual: { type: "lines", lines: ["10 cm ÷ 2 = {{5 cm}}"] },
      eq: "",
    },
    {
      say: "La bisectriz parte un ángulo en dos iguales. La bisectriz de ochenta grados deja dos ángulos de cuarenta.",
      visual: { type: "angles", kind: "straight", a: 40, labels: ["40°", null] },
      eq: "80° ÷ 2 = 40°",
    },
    {
      say: "La transversal de gravedad va de un vértice al punto medio del lado de enfrente. Las tres transversales se cruzan en el centro de gravedad: el punto donde el triángulo se equilibra en un dedo.",
      visual: { type: "angles", kind: "triangle", a: 60, b: 60, labels: [null, null, null] },
      eq: "",
    },
    {
      say: "El centro de gravedad queda a dos tercios del vértice. Si la transversal mide nueve, está a seis del vértice.",
      visual: { type: "lines", lines: ["9 ÷ 3 = 3", "3 · 2 = {{6}}"] },
      eq: "2/3 de 9 = 6",
    },
    {
      say: "Recuerda: simetral, mitad del segmento en ángulo recto. Bisectriz, mitad del ángulo. Transversal de gravedad, del vértice al punto medio, y el centro a dos tercios.",
      visual: {
        type: "list",
        title: "Elementos del triángulo",
        items: ["📏 Simetral: mitad del segmento, 90°.", "📐 Bisectriz: mitad del ángulo.", "⚖️ Centro de gravedad: a 2/3 del vértice."],
      },
      eq: "",
    },
  ],
};
