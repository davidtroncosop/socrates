// Metáfora: una lupa que exagera; el eje que no parte en cero.
const bars = (ymin) => ({ type: "bars", ymin, ymax: 100, ystep: ymin ? 1 : 20, bars: [{ label: "A", values: [98] }, { label: "B", values: [100] }] });

export default {
  id: "graficos-enganosos",
  title: "Gráficos engañosos",
  grade: "8° Básico",
  beats: [
    {
      say: "Mira este gráfico: la barra B parece mucho más grande que la A, como el doble.",
      visual: bars(97),
    },
    {
      say: "Pero lee el eje: no parte en cero, parte en noventa y siete. Es como mirar con una lupa: exagera las diferencias.",
      visual: bars(97),
      eq: "El eje parte en 97",
    },
    {
      say: "Los valores reales son noventa y ocho y cien. La diferencia es solo dos.",
      visual: { type: "lines", lines: ["A = 98", "B = 100", "Diferencia: {{2}}"] },
      eq: "",
    },
    {
      say: "Con el eje partiendo en cero, las barras se ven casi iguales. Esa es la comparación honesta.",
      visual: bars(0),
      eq: "El eje parte en 0",
    },
    {
      say: "Antes de creerle a un gráfico, revisa dónde parte el eje y calcula la diferencia con los números, no con el tamaño de las barras.",
      visual: { type: "cards", items: [{ icon: "🔍", title: "Lee el eje", text: "¿Parte en cero?" }, { icon: "🔢", title: "Usa los números", text: "Resta o calcula el %" }] },
      eq: "",
    },
    {
      say: "Recuerda: un eje que no parte en cero exagera. Mira los números y calcula la diferencia real.",
      visual: {
        type: "list",
        title: "Gráficos engañosos",
        items: ["🔍 ¿El eje parte en 0?", "🔢 Compara con los números.", "📊 La altura puede engañar."],
      },
    },
  ],
};
