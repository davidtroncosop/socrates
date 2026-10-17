// Metáfora: lo que pagas de más es el precio del préstamo.
export default {
  id: "credito",
  title: "El costo de un crédito",
  grade: "4° Medio",
  beats: [
    {
      say: "Te prestan cien mil pesos y pagas doce cuotas de diez mil. ¿Cuánto te costó el crédito?",
      visual: { type: "lines", lines: ["Recibes: $100.000", "Pagas: 12 · $10.000"] },
    },
    {
      say: "En total pagaste ciento veinte mil. Lo que pagaste de más, veinte mil, es el costo del crédito.",
      visual: { type: "lines", lines: ["Pagas: $120.000", "Recibiste: $100.000", "Costo: {{$20.000}}"] },
    },
    {
      say: "En porcentaje, veinte mil de cien mil es el veinte por ciento de lo prestado.",
      eq: "20.000 ÷ 100.000 = 20 %",
    },
    {
      say: "Para comparar créditos se usa la CAE, la carga anual equivalente. Incluye intereses y gastos en un solo porcentaje.",
      visual: { type: "bars", ymax: 40, ystep: 10, bars: [{ label: "Banco A", values: [28] }, { label: "Tienda B", values: [35] }] },
      eq: "",
    },
    {
      say: "Menor CAE, crédito más barato. Aquí conviene el banco A, con veintiocho por ciento.",
      visual: { type: "bars", ymax: 40, ystep: 10, highlight: 0, bars: [{ label: "Banco A", values: [28] }, { label: "Tienda B", values: [35] }] },
      eq: "Conviene: CAE 28 %",
    },
    {
      say: "Recuerda: suma todas las cuotas y réstale lo que recibiste: eso es lo que te cuesta. Y compara siempre la CAE.",
      visual: {
        type: "list",
        title: "Créditos",
        items: ["➕ Suma todas las cuotas.", "➖ Resta lo prestado: ese es el costo.", "📉 Menor CAE, más barato."],
      },
      eq: "",
    },
  ],
};
