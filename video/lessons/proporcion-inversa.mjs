// Metáfora: más pintores, menos días; el trabajo total no cambia.
const painters = (n, days) => ({ type: "tokens", size: 64, groups: [{ icon: "🧑‍🎨", count: n, cols: n, label: `${n} pintores: ${days} días` }] });

export default {
  id: "proporcion-inversa",
  title: "Proporción inversa",
  grade: "7° Básico",
  beats: [
    {
      say: "Dos pintores tardan seis días en pintar una casa.",
      visual: painters(2, 6),
    },
    {
      say: "Si llegan dos pintores más, son cuatro. Con el doble de pintores, el trabajo se hace en la mitad del tiempo: tres días.",
      visual: painters(4, 3),
      eq: "2 · 6 = 4 · 3 = 12",
    },
    {
      say: "Eso es una proporción inversa: cuando una cantidad sube, la otra baja. Lo que no cambia es el producto: doce días de trabajo.",
      visual: { type: "lines", lines: ["2 pintores · 6 días = 12", "4 pintores · 3 días = 12", "6 pintores · {{2}} días = 12"] },
      eq: "",
    },
    {
      say: "Un error común es pensar que con más pintores se tarda más. Pregúntate: ¿tiene sentido? Con más ayuda se termina antes.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "¿Tiene sentido?", text: "Más pintores → menos días" }] },
    },
    {
      say: "Para resolver: multiplica para encontrar el total, y divide por la nueva cantidad. Dos por seis es doce; doce dividido en cuatro, tres.",
      visual: { type: "lines", lines: ["Total: 2 · 6 = [[12]]", "12 ÷ 4 = {{3}} días"] },
    },
    {
      say: "Recuerda: en la proporción inversa, si una sube, la otra baja. Multiplica para el total y divide por la nueva cantidad.",
      visual: {
        type: "list",
        title: "Proporción inversa",
        items: ["🔄 Si una sube, la otra baja.", "✖️ El producto se mantiene.", "➗ Total ÷ nueva cantidad."],
      },
    },
  ],
};
