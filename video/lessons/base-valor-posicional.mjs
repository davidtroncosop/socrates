// Metáfora: las cifras son monedas de $1, $10 y $100; el canje (10 chicas = 1 grande).
const coins = (value, count, label, cols) => ({ tile: String(value), count, label, cols });

export default {
  id: "base-valor-posicional",
  title: "Cada cifra vale según su lugar",
  grade: "Base",
  beats: [
    {
      say: "Los números funcionan como monedas. Una cifra vale distinto según el lugar donde está.",
      visual: { type: "cards", items: [{ icon: "💰", title: "Cada cifra vale según su lugar", text: "Como monedas de $1, $10 y $100" }] },
    },
    {
      say: "Mira el número cuatrocientos ochenta y dos. Son cuatro monedas de cien, ocho monedas de diez y dos monedas de uno.",
      visual: { type: "tokens", size: 92, groups: [coins(100, 4, "4 de $100", 2), coins(10, 8, "8 de $10", 4), coins(1, 2, "2 de $1", 2)] },
      eq: "482",
    },
    {
      say: "Por eso el cuatro no vale cuatro: vale cuatrocientos. El ocho vale ochenta, y el dos vale dos.",
      eq: "482 = [[400]] + [[80]] + [[2]]",
    },
    {
      say: "El lugar de más a la derecha son las unidades. Después vienen las decenas, y después las centenas. Cada lugar vale diez veces más que el de su derecha.",
      visual: { type: "table", headers: ["Centenas ($100)", "Decenas ($10)", "Unidades ($1)"], rows: [["4", "8", "2"]], width: 1300 },
    },
    {
      say: "Diez monedas de uno se cambian por una de diez. Y diez monedas de diez, por una de cien. Ese cambio se llama canje.",
      visual: { type: "tokens", size: 76, groups: [coins(1, 10, "10 de $1", 5), { op: "=" }, coins(10, 1, "1 de $10", 1)] },
      eq: "",
    },
    {
      say: "Multiplicar por diez es cambiar cada moneda por una que vale diez veces más. Todo sube un lugar, y a la derecha queda un cero. Cuarenta y seis por diez es cuatrocientos sesenta.",
      visual: { type: "table", headers: ["Centenas", "Decenas", "Unidades"], rows: [["", "4", "6"], ["4", "6", "{{0}}"]], arrow: { from: 0, to: 1, label: "· 10" }, width: 1100 },
      eq: "46 · 10 = 460",
    },
    {
      say: "Recuerda: cada cifra vale según su lugar. Cada lugar vale diez veces más que el de su derecha. Y al multiplicar por diez, todo sube un lugar.",
      visual: {
        type: "list",
        title: "El valor de cada lugar",
        items: ["💰 Cada cifra vale según su lugar.", "🔟 Cada lugar vale 10 veces más que el de su derecha.", "⬆️ Por 10, todo sube un lugar y queda un 0 a la derecha."],
      },
      eq: "",
    },
  ],
};
