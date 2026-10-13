// Metáfora: los centímetros de un metro; la coma debajo de la coma.
export default {
  id: "base-decimales",
  title: "Decimales con medidas",
  grade: "Base",
  beats: [
    {
      say: "Los decimales son partes de una unidad, como los centímetros de un metro. Un metro tiene cien centímetros.",
      visual: { type: "cards", items: [{ icon: "📏", title: "Decimales: partes de una unidad", text: "Como los centímetros de un metro" }] },
    },
    {
      say: "Cero coma cinco metros es la mitad de un metro: cincuenta centímetros.",
      visual: { type: "bar", total: "1 metro = 100 cm", parts: 10, filled: 5, partLabel: "10 cm", caption: "0,5 m = la mitad" },
      eq: "0,5 m = 50 cm",
    },
    {
      say: "Uno coma veinticinco metros es un metro y veinticinco centímetros: ciento veinticinco centímetros.",
      visual: { type: "table", headers: ["Metros", "Centímetros"], rows: [["1", "100"], ["0,25", "25"], ["1,25", "{{125}}"]] },
      eq: "1,25 m = 125 cm",
    },
    {
      say: "Para sumar o restar decimales hay una regla muy importante: la coma va debajo de la coma.",
      visual: { type: "cards", items: [{ icon: "📐", title: "La coma debajo de la coma", text: "Así sumas décimas con décimas y centésimas con centésimas" }] },
      eq: "",
    },
    {
      say: "Por ejemplo: dos coma cinco, más uno coma veinticinco. Si falta una cifra, agregamos un cero: dos coma cincuenta. El resultado es tres coma setenta y cinco.",
      visual: { type: "lines", lines: ["2,5 + 1,25", "= 2,5[[0]] + 1,25", "= 3,75"] },
    },
    {
      say: "Y tres menos cero coma cuatro: escribimos el tres como tres coma cero. El resultado es dos coma seis.",
      visual: { type: "lines", lines: ["3 − 0,4", "= 3[[,0]] − 0,4", "= 2,6"] },
    },
    {
      say: "Recuerda: un metro tiene cien centímetros. La coma va debajo de la coma. Y si falta una cifra, agrega un cero.",
      visual: {
        type: "list",
        title: "Decimales",
        items: ["📏 1 metro = 100 centímetros.", "📐 La coma va debajo de la coma.", "0️⃣ Si falta una cifra, agrega un cero."],
      },
    },
  ],
};
