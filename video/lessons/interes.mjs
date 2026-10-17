// Metáfora: el ahorro que crece; la bola de nieve del interés compuesto.
// En miles de pesos, para que las cifras quepan sobre las barras.
const bars = (simple, comp) => ({ type: "bars", ymax: 140, ystep: 20, series: ["Simple", "Compuesto"], bars: [{ label: "inicio", values: [100, 100] }, { label: "año 1", values: [110, 110] }, { label: "año 2", values: [simple, comp] }] });

export default {
  id: "interes",
  title: "Interés simple y compuesto",
  grade: "4° Medio",
  beats: [
    {
      say: "Depositas cien mil pesos en el banco al diez por ciento anual. El banco te paga interés por guardar tu dinero.",
      visual: { type: "cards", items: [{ icon: "🏦", title: "$100.000 al 10 % anual", text: "El interés es lo que te pagan por tu dinero" }] },
    },
    {
      say: "Con interés simple, cada año ganas lo mismo: el diez por ciento de cien mil, diez mil. En dos años, veinte mil.",
      visual: { type: "lines", lines: ["Año 1: + 10.000", "Año 2: + 10.000", "Total: {{120.000}}"] },
    },
    {
      say: "Con interés compuesto, el interés se suma al ahorro. El segundo año ganas el diez por ciento de ciento diez mil: once mil. Llegas a ciento veintiún mil.",
      visual: bars(120, 121),
      eq: "100.000 · 1,1 · 1,1 = 121.000",
    },
    {
      say: "Mil pesos de diferencia parece poco, pero con los años crece como una bola de nieve. Por eso ahorrar temprano conviene.",
      visual: { type: "cards", items: [{ icon: "⛄", title: "Bola de nieve", text: "El compuesto gana interés sobre el interés" }] },
      eq: "",
    },
    {
      say: "Ojo: con las deudas pasa lo mismo, pero en tu contra. Una deuda sin pagar crece con interés compuesto.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Las deudas también crecen", text: "Si no pagas, el interés se suma a la deuda" }] },
    },
    {
      say: "Recuerda: simple, el mismo interés cada año. Compuesto, el interés se calcula sobre lo acumulado: multiplica por uno coma diez cada año.",
      visual: {
        type: "list",
        title: "Interés",
        items: ["➕ Simple: el mismo monto cada año.", "✖️ Compuesto: · (1 + tasa) cada año.", "⚠️ Las deudas también se componen."],
      },
    },
  ],
};
