// Metáfora: probar una cucharada para saber cómo está la sopa.
export default {
  id: "muestreo",
  title: "Muestras",
  grade: "7° Básico",
  beats: [
    {
      say: "Para saber si la sopa está salada no te tomas toda la olla: pruebas una cucharada. Eso es una muestra.",
      visual: { type: "cards", items: [{ icon: "🥄", title: "Una muestra", text: "Una parte que representa al grupo completo" }] },
    },
    {
      say: "En un colegio de seiscientos estudiantes, preguntamos a cincuenta si usan lentes. Diez dicen que sí.",
      visual: { type: "tokens", size: 40, groups: [{ icon: "👓", count: 10, cols: 10, label: "10 con lentes" }, { icon: "🙂", count: 40, cols: 10, label: "40 sin lentes" }] },
      eq: "10 de 50",
    },
    {
      say: "Diez de cincuenta es uno de cada cinco. O sea, el veinte por ciento.",
      eq: "10 ÷ 50 = 1/5 = 20 %",
    },
    {
      say: "Si la muestra representa bien al colegio, uno de cada cinco de los seiscientos usa lentes: unos ciento veinte.",
      visual: { type: "lines", lines: ["600 ÷ 5 = {{120}}", "aproximadamente"] },
      eq: "",
    },
    {
      say: "Una buena muestra se elige al azar, de distintos cursos. Si solo preguntas en un curso, puede salir muy distinto.",
      visual: { type: "cards", items: [{ icon: "🎲", title: "Elige al azar", text: "Así la muestra se parece al grupo completo" }] },
    },
    {
      say: "Recuerda: la muestra es una cucharada del grupo. Calcula qué parte cumple en la muestra y úsala para estimar en el grupo completo.",
      visual: {
        type: "list",
        title: "Muestras",
        items: ["🥄 La muestra es una parte del grupo.", "➗ Calcula la parte: 10 de 50 = 1/5.", "🔁 Úsala en el grupo: 600 ÷ 5.", "🎲 Elige al azar."],
      },
    },
  ],
};
