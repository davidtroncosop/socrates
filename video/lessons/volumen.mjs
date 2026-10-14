// Metáfora: el volumen cuenta cubitos, capa por capa.
const layer = (label) => ({ icon: "🧊", count: 12, cols: 4, label });

export default {
  id: "volumen",
  title: "Volumen de prismas y cilindros",
  grade: "8° Básico",
  beats: [
    {
      say: "El volumen cuenta cuántos cubitos caben adentro de una caja.",
      visual: { type: "cards", items: [{ icon: "📦", title: "Volumen", text: "Cuántos cubitos caben adentro" }] },
    },
    {
      say: "Esta caja mide cuatro por tres en el piso. En el piso caben doce cubitos: es el área de la base.",
      visual: { type: "tokens", size: 52, groups: [layer("piso: 4 · 3 = 12")] },
      eq: "4 · 3 = 12",
    },
    {
      say: "La caja tiene dos de alto, así que hay dos capas iguales. Doce más doce: veinticuatro cubitos.",
      visual: { type: "tokens", size: 52, groups: [layer("capa 1"), layer("capa 2")] },
      eq: "12 · 2 = 24 cm³",
    },
    {
      say: "Por eso el volumen es el área de la base por la altura. Sirve para cualquier prisma, sin importar la forma de la base.",
      visual: { type: "lines", lines: ["Volumen = {{base}} · {{altura}}", "Caja: 4 · 3 · 2 = 24 cm³"] },
      eq: "",
    },
    {
      say: "Si la base es un triángulo, primero calcula su área: base por altura, dividido en dos. Después multiplica por el largo.",
      visual: { type: "lines", lines: ["Triángulo: 4 · 3 ÷ 2 = [[6]] cm²", "Largo 10 cm", "6 · 10 = {{60}} cm³"] },
    },
    {
      say: "Un cilindro, como un vaso, tiene un círculo de base. Su área es pi por radio por radio. Con radio dos y altura cinco: tres coma catorce por cuatro, por cinco. Sesenta y dos coma ocho.",
      visual: { type: "lines", lines: ["Base: 3,14 · 2 · 2 = 12,56", "12,56 · 5 = {{62,8}} cm³"] },
    },
    {
      say: "Recuerda: cuenta el piso, que es el área de la base, y multiplica por la altura, que son las capas. Las medidas no se suman.",
      visual: {
        type: "list",
        title: "Volumen",
        items: ["🧊 Piso: el área de la base.", "📚 Capas: multiplica por la altura.", "🥤 Cilindro: la base es 3,14 · r · r.", "🚫 Las medidas no se suman."],
      },
    },
  ],
};
