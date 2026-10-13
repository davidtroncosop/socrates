// Metáforas: la barra de chocolate de cien cuadritos (por ciento = de cada
// cien) y el modelo de barra para calcular partes de una cantidad.
export default {
  id: "porcentajes",
  title: "Porcentajes en la vida diaria",
  grade: "7° Básico",
  beats: [
    {
      say: "Por ciento quiere decir de cada cien. Imagina una barra de chocolate con cien cuadritos.",
      visual: { type: "grid100", filled: 0, label: "100 cuadritos" },
    },
    {
      say: "El veinticinco por ciento son veinticinco cuadritos de cada cien: un cuarto de la barra.",
      visual: { type: "grid100", filled: 25, label: "25 % = 25 de cada 100 = un cuarto" },
    },
    {
      say: "¿Y el veinticinco por ciento de ochenta? Si dividimos ochenta en cuatro partes iguales, cada parte es veinte.",
      visual: { type: "bar", total: "80", parts: 4, filled: 1, partLabel: "20", caption: "25 % de 80 = un cuarto de 80" },
    },
    {
      say: "La cuenta general es: multiplicar por el porcentaje y dividir por cien. Ochenta por veinticinco, dividido en cien: veinte.",
      eq: "80 · 25 ÷ 100 = 20",
    },
    {
      say: "Un atajo útil: el diez por ciento es dividir por diez. El diez por ciento de doscientos cincuenta es veinticinco.",
      visual: { type: "bar", total: "250", parts: 10, filled: 1, partLabel: "25", caption: "10 % = una décima parte" },
      eq: "10 % de 250 = 25",
    },
    {
      say: "Ahora, una mochila de veinte mil pesos tiene quince por ciento de descuento. ¿Cuánto pagas?",
      visual: { type: "cards", items: [{ icon: "🎒", title: "Mochila con 15 % de descuento", text: "Precio: $20 000" }] },
      eq: "",
    },
    {
      say: "Cada cinco por ciento son mil pesos, porque veinte mil dividido en veinte partes es mil. El quince por ciento son tres partes: tres mil pesos de descuento.",
      visual: { type: "bar", total: "$20 000", parts: 20, filled: 3, partLabel: "$1 000", caption: "15 % de 20 000 = 3 000" },
    },
    {
      say: "El descuento se resta: pagas diecisiete mil pesos. Ojo: el quince por ciento es lo que te ahorras, no lo que pagas.",
      eq: "20 000 − 3 000 = 17 000",
    },
    {
      say: "Y para saber cuánto aumentó algo, compara el aumento con lo que había al principio. Si un taller pasa de cuarenta a cincuenta participantes, aumentó diez de cuarenta: un cuarto, el veinticinco por ciento.",
      visual: { type: "bar", total: "40 participantes al principio", parts: 4, filled: 1, partLabel: "10", caption: "aumento: 10 de 40 = 25 %" },
      eq: "",
    },
    {
      say: "Recuerda: un porcentaje es una parte de cada cien. Para calcularlo, multiplica por el porcentaje y divide por cien. Y en un descuento, resta lo que calculaste.",
      visual: {
        type: "list",
        title: "Porcentajes",
        items: ["💯 p % es p de cada 100.", "✖️ p % de una cantidad: cantidad · p ÷ 100.", "🏷️ En un descuento, resta lo que calculaste.", "📈 Un aumento se compara con lo que había al principio."],
      },
    },
  ],
};
