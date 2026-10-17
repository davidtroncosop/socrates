// Metáfora: traducir los números de las noticias a personas concretas.
export default {
  id: "probabilidad-sociedad",
  title: "La probabilidad en las noticias",
  grade: "2° Medio",
  beats: [
    {
      say: "Las noticias están llenas de probabilidades: uno de cada cuatro jóvenes, un riesgo del dos por ciento, setenta por ciento de lluvia.",
      visual: { type: "cards", items: [{ icon: "📰", title: "«1 de cada 4»", text: "" }, { icon: "⚠️", title: "«Riesgo de 2 %»", text: "" }] },
    },
    {
      say: "Pásalas al mismo idioma. Uno de cada cuatro es uno dividido en cuatro: el veinticinco por ciento.",
      visual: { type: "lines", lines: ["1 de cada 4", "= 1 ÷ 4 = {{25 %}}"] },
    },
    {
      say: "Después, piensa en personas concretas. Un riesgo del dos por ciento en quinientas personas son unas diez.",
      visual: { type: "lines", lines: ["2 % de 500", "= 500 · 0,02 = {{10}} personas"] },
    },
    {
      say: "Cuidado con los titulares. Si un riesgo pasa del uno al dos por ciento, se duplica, pero sigue siendo pequeño: dos de cada cien.",
      visual: { type: "lines", lines: ["1 % → 2 %", "«¡El doble!»", "pero son 2 de cada 100"] },
    },
    {
      say: "Y lo que no pasa es el resto hasta cien. Con setenta por ciento de lluvia, hay treinta por ciento de que no llueva.",
      visual: { type: "bar", total: "100 %", parts: 10, filled: 7, partLabel: "10 %", caption: "Lluvia 70 % · No llueve 30 %" },
    },
    {
      say: "Recuerda: traduce los porcentajes a personas concretas, compara con cuidado los aumentos y recuerda que todo suma cien por ciento.",
      visual: {
        type: "list",
        title: "Probabilidad en las noticias",
        items: ["🔁 1 de cada n = 100 ÷ n %.", "👥 Piensa en personas concretas.", "🔍 Doble no siempre es mucho."],
      },
    },
  ],
};
