// Metáfora: pintar la pieza; no se vende medio tarro.
export default {
  id: "problemas-pintar",
  title: "Problemas: pintar y embaldosar",
  grade: "6° Básico",
  beats: [
    {
      say: "Quieres pintar una pared de cuatro metros de largo y tres de alto. Cada tarro de pintura alcanza para cinco metros cuadrados. ¿Cuántos tarros compras?",
      visual: { type: "shape", kind: "rect", base: 4, height: 3, grid: true, labels: { base: "4 m", height: "3 m" } },
    },
    {
      say: "Paso uno: calcula el área. Cuatro por tres: doce metros cuadrados.",
      eq: "Paso 1: 4 · 3 = 12 m²",
    },
    {
      say: "Paso dos: divide por lo que pinta cada tarro. Doce dividido en cinco es dos coma cuatro.",
      visual: { type: "lines", lines: ["Paso 2: 12 ÷ 5 = 2,4"] },
      eq: "",
    },
    {
      say: "Paso tres: no se vende cero coma cuatro tarros. Con dos tarros pintas solo diez metros: falta. Compras tres.",
      visual: { type: "lines", lines: ["2 tarros: 10 m² ✗", "{{3 tarros}}: 15 m² ✓"] },
    },
    {
      say: "Con baldosas es igual. Un piso de cinco por cuatro tiene veinte metros cuadrados. Si cada caja cubre dos, necesitas diez cajas.",
      visual: { type: "lines", lines: ["5 · 4 = 20 m²", "20 ÷ 2 = {{10}} cajas"] },
    },
    {
      say: "Ojo: para pintar o embaldosar se usa el área, no el perímetro. El perímetro sirve para el borde, como el guardapolvo.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Área, no perímetro", text: "Pintura y baldosas cubren la superficie" }] },
    },
    {
      say: "Recuerda: calcula el área, divide por lo que cubre cada tarro o caja, y si no es exacto, compra uno más.",
      visual: {
        type: "list",
        title: "Pintar y embaldosar",
        items: ["1️⃣ Área = largo · alto.", "2️⃣ Divide por lo que cubre cada uno.", "3️⃣ Si no es exacto, uno más."],
      },
    },
  ],
};
