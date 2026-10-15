// Metáfora: el gráfico circular es una pizza; las barras, torres que se comparan.
export default {
  id: "graficos",
  title: "Leer gráficos",
  grade: "6° Básico",
  beats: [
    {
      say: "Un gráfico de barras compara cantidades. La barra más alta es la que tiene más.",
      visual: { type: "bars", ymax: 16, ystep: 4, bars: [{ label: "manzana", values: [8] }, { label: "plátano", values: [15] }, { label: "pera", values: [6] }, { label: "naranja", values: [11] }] },
    },
    {
      say: "Aquí ganó el plátano, con quince votos. La pera tiene menos: seis.",
      visual: { type: "bars", ymax: 16, ystep: 4, highlight: 1, bars: [{ label: "manzana", values: [8] }, { label: "plátano", values: [15] }, { label: "pera", values: [6] }, { label: "naranja", values: [11] }] },
    },
    {
      say: "En un gráfico de barras dobles se comparan dos grupos. En fútbol, el sexto A tiene doce votos y el sexto B tiene nueve. El A tiene tres más.",
      visual: { type: "bars", ymax: 16, ystep: 4, series: ["6°A", "6°B"], bars: [{ label: "fútbol", values: [12, 9] }, { label: "básquetbol", values: [5, 8] }, { label: "vóleibol", values: [7, 7] }] },
      eq: "12 − 9 = 3",
    },
    {
      say: "Un gráfico circular es como una pizza. El círculo completo es el total.",
      visual: { type: "pie", slices: [{ value: 2, label: "perros" }, { value: 1, label: "gatos" }, { value: 1, label: "peces" }], total: "40 mascotas" },
      eq: "",
    },
    {
      say: "La mitad del círculo son perros. Si hay cuarenta mascotas, la mitad son veinte perros.",
      visual: { type: "pie", highlight: 0, slices: [{ value: 2, label: "perros", text: "1/2" }, { value: 1, label: "gatos", text: "1/4" }, { value: 1, label: "peces", text: "1/4" }], total: "40 mascotas" },
      eq: "40 ÷ 2 = 20",
    },
    {
      say: "Y un cuarto del círculo son gatos: cuarenta dividido en cuatro, diez gatos.",
      visual: { type: "pie", highlight: 1, slices: [{ value: 2, label: "perros", text: "1/2" }, { value: 1, label: "gatos", text: "1/4" }, { value: 1, label: "peces", text: "1/4" }], total: "40 mascotas" },
      eq: "40 ÷ 4 = 10",
    },
    {
      say: "Recuerda: en las barras, compara las alturas. En el círculo, cada parte es una fracción del total.",
      visual: {
        type: "list",
        title: "Leer gráficos",
        items: ["📊 Barras: la más alta es la mayor.", "↔️ Barras dobles: compara los dos grupos.", "🥧 Círculo: cada parte es una fracción del total."],
      },
      eq: "",
    },
  ],
};
