// Metáfora: ir al almacén con la lista.
export default {
  id: "problemas-compras",
  title: "Problemas: compras y vuelto",
  grade: "6° Básico",
  beats: [
    {
      say: "Vas al almacén. Compras tres panes de trescientos pesos y una leche de mil cien. Pagas con un billete de cinco mil. ¿Cuánto vuelto recibes?",
      visual: { type: "cards", items: [{ icon: "🥖", title: "3 panes de $300", text: "" }, { icon: "🥛", title: "1 leche de $1.100", text: "" }] },
    },
    {
      say: "Paso uno: anota los datos. Tres panes, trescientos cada uno. Una leche, mil cien. Billete de cinco mil.",
      visual: { type: "lines", lines: ["Paso 1: datos", "3 panes · $300", "1 leche · $1.100", "billete $5.000"] },
    },
    {
      say: "Paso dos: calcula el total. Los panes son tres por trescientos, novecientos. Más la leche: dos mil.",
      visual: { type: "lines", lines: ["Paso 2: 3 · 300 = 900", "900 + 1.100 = {{2.000}}"] },
    },
    {
      say: "Paso tres: el vuelto es el billete menos el total. Cinco mil menos dos mil: tres mil pesos.",
      visual: { type: "lines", lines: ["Paso 3: 5.000 − 2.000 = {{3.000}}"] },
    },
    {
      say: "Paso cuatro: revisa si tiene sentido. Gastaste menos de cinco mil, así que debes recibir vuelto. Tres mil es razonable.",
      visual: { type: "cards", items: [{ icon: "✅", title: "¿Tiene sentido?", text: "Gasté $2.000 y pagué $5.000: me devuelven $3.000" }] },
    },
    {
      say: "Las ofertas también se calculan. Si un jugo cuesta cuatrocientos, o tres por mil, sin oferta pagarías mil doscientos. Ahorras doscientos.",
      visual: { type: "lines", lines: ["Sin oferta: 3 · 400 = 1.200", "Con oferta: 1.000", "Ahorro: {{200}}"] },
    },
    {
      say: "Recuerda: anota los datos, calcula el total, resta para el vuelto y revisa si tiene sentido.",
      visual: {
        type: "list",
        title: "Compras",
        items: ["1️⃣ Anota los datos.", "2️⃣ Calcula el total.", "3️⃣ Vuelto = billete − total.", "4️⃣ Revisa si tiene sentido."],
      },
    },
  ],
};
