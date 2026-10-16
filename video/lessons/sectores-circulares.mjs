// Metáfora: el sector es un trozo de pizza.
export default {
  id: "sectores-circulares",
  title: "Sectores circulares",
  grade: "1° Medio",
  beats: [
    {
      say: "Un sector circular es un trozo de pizza. Este mide noventa grados.",
      visual: { type: "sector", angle: 90, r: "4 cm" },
    },
    {
      say: "Una vuelta completa tiene trescientos sesenta grados. Noventa es un cuarto de vuelta: el trozo es un cuarto de la pizza.",
      eq: "90 ÷ 360 = 1/4",
    },
    {
      say: "El círculo completo de radio cuatro tiene área tres coma catorce por cuatro por cuatro: cincuenta coma veinticuatro. Un cuarto es doce coma cincuenta y seis.",
      visual: { type: "sector", angle: 90, r: "4 cm", label: "12,56 cm²" },
      eq: "50,24 ÷ 4 = 12,56",
    },
    {
      say: "Con ciento veinte grados es un tercio. Con ciento ochenta, la mitad. Con sesenta, un sexto.",
      visual: { type: "sector", angle: 120, r: "r", label: "1/3" },
      eq: "120 ÷ 360 = 1/3",
    },
    {
      say: "El borde curvo se llama arco. Se calcula igual: toma la parte del contorno completo, dos por pi por el radio.",
      visual: { type: "sector", angle: 90, r: "10 cm", arc: true, label: "arco" },
      eq: "62,8 ÷ 4 = 15,7 cm",
    },
    {
      say: "Recuerda: divide el ángulo por trescientos sesenta para saber qué parte es. Esa parte del área es el sector; esa parte del contorno es el arco.",
      visual: {
        type: "list",
        title: "Sectores circulares",
        items: ["🍕 Ángulo ÷ 360 = la parte.", "🟦 Área: la parte de π · r².", "〰️ Arco: la parte de 2 · π · r."],
      },
      eq: "",
    },
  ],
};
