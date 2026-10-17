// Metáfora: un arriendo fijo por tu dinero; cada año se paga lo mismo.
export default {
  id: "interes-simple",
  title: "Interés simple",
  grade: "4° Medio",
  beats: [
    {
      say: "Depositas cien mil pesos al cinco por ciento de interés simple anual. Es como si el banco te pagara un arriendo fijo por usar tu dinero.",
      visual: { type: "cards", items: [{ icon: "🏦", title: "$100.000 al 5 % anual", text: "Interés simple: siempre sobre lo inicial" }] },
    },
    {
      say: "Paso uno: pasa la tasa a decimal. Cinco por ciento es cero coma cero cinco.",
      visual: { type: "lines", lines: ["Paso 1: 5 % = {{0,05}}"] },
    },
    {
      say: "Paso dos: calcula el interés de un año. Cien mil por cero coma cero cinco: cinco mil pesos.",
      visual: { type: "lines", lines: ["Paso 1: 5 % = 0,05", "Paso 2: 100.000 · 0,05 = {{5.000}} por año"] },
    },
    {
      say: "Paso tres: multiplica por los años. En tres años, cinco mil por tres: quince mil pesos de interés.",
      visual: { type: "lines", lines: ["Paso 1: 5 % = 0,05", "Paso 2: 100.000 · 0,05 = 5.000 por año", "Paso 3: 5.000 · 3 = {{15.000}}"] },
    },
    {
      say: "Paso cuatro: si te piden el total, súmale lo que depositaste. Cien mil más quince mil: ciento quince mil.",
      visual: { type: "lines", lines: ["Paso 4: 100.000 + 15.000", "= {{115.000}}"] },
    },
    {
      say: "Cada año se gana lo mismo, porque el interés siempre se calcula sobre los cien mil iniciales.",
      visual: { type: "bars", ymax: 120, ystep: 20, bars: [{ label: "inicio", values: [100] }, { label: "año 1", values: [105] }, { label: "año 2", values: [110] }, { label: "año 3", values: [115] }] },
      eq: "+5 cada año (miles de $)",
    },
    {
      say: "Recuerda: interés igual capital por tasa por tiempo. Pasa la tasa a decimal, calcula un período, multiplica por los períodos y, si piden el total, suma el capital.",
      visual: {
        type: "list",
        title: "Interés simple",
        items: ["1️⃣ Tasa a decimal: 5 % = 0,05.", "2️⃣ Un período: capital · tasa.", "3️⃣ Por la cantidad de períodos.", "4️⃣ Total: súmale el capital."],
      },
      eq: "",
    },
  ],
};
