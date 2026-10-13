// Metáfora: repartir dulces entre amigos en partes iguales; lo que sobra es el resto.
const candies = (count, label) => ({ icon: "🍭", count, label, cols: Math.min(count, 4) });

export default {
  id: "base-dividir",
  title: "Dividir es repartir",
  grade: "Base",
  beats: [
    {
      say: "Dividir es repartir en partes iguales. Tenemos doce dulces para tres amigos.",
      visual: { type: "tokens", size: 66, groups: [candies(12, "12 dulces")] },
      eq: "12 ÷ 3",
    },
    {
      say: "Repartimos de a uno, hasta que no quede nada. A cada amigo le tocan cuatro. Doce dividido en tres es cuatro.",
      visual: { type: "tokens", size: 66, groups: [candies(4, "amigo 1"), candies(4, "amigo 2"), candies(4, "amigo 3")] },
      eq: "12 ÷ 3 = 4",
    },
    {
      say: "Para dividir, piensa en la multiplicación: ¿qué número por tres da doce? Cuatro. Dividir es la multiplicación al revés.",
      visual: { type: "cards", items: [{ icon: "🔁", title: "La multiplicación al revés", text: "12 ÷ 3 = 4 porque 3 · 4 = 12" }] },
    },
    {
      say: "A veces no alcanza para repartir parejo. Catorce dulces entre cuatro amigos: a cada uno le tocan tres, y sobran dos. Lo que sobra se llama resto.",
      visual: { type: "tokens", size: 58, groups: [candies(3, "3"), candies(3, "3"), candies(3, "3"), candies(3, "3"), { icon: "🍭", count: 2, label: "sobran 2", debt: true, cols: 2 }] },
      eq: "14 ÷ 4 = 3, y sobran [[2]]",
    },
    {
      say: "Con números más grandes, reparte por partes. Ochenta y cuatro dividido en cuatro: ochenta entre cuatro son veinte, y cuatro entre cuatro es uno. En total, veintiuno.",
      visual: { type: "lines", lines: ["84 ÷ 4", "80 ÷ 4 = 20", "4 ÷ 4 = 1", "20 + 1 = [[21]]"] },
      eq: "",
    },
    {
      say: "Recuerda: dividir es repartir en partes iguales. Piensa en la multiplicación al revés. Y lo que no se puede repartir parejo es el resto.",
      visual: {
        type: "list",
        title: "Dividir es repartir",
        items: ["🍭 Reparte en partes iguales.", "🔁 Piensa: ¿qué número por el divisor da el total?", "🧮 Lo que no se reparte parejo es el resto."],
      },
    },
  ],
};
