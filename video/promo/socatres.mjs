// Video promocional de socatres para familias (16:9, 1920×1080).
// Se narra y renderiza aparte de las lecciones (ver video/README.md).
// `caption` reemplaza el subtítulo cuando la voz debe decir algo distinto.
const screen = (src, more = {}) => ({ type: "screen", src, ...more });

export default {
  id: "promo-socatres",
  title: "Matemática paso a paso",
  grade: "Para familias",
  beats: [
    {
      say: "¿A tu hijo o hija le cuestan las matemáticas? ¿Las tareas terminan en frustración, en peleas o en lágrimas?",
      visual: {
        type: "cards",
        items: [
          { icon: "😣", title: "Frustración" },
          { icon: "⏳", title: "Tareas eternas" },
          { icon: "😢", title: "Lágrimas" },
        ],
      },
    },
    {
      say: "No es falta de capacidad. Muchas veces solo falta que alguien explique paso a paso, a su ritmo, sin apuro y sin miedo a equivocarse.",
      visual: { type: "cards", items: [{ icon: "🦉", title: "Paso a paso", text: "A su ritmo, sin apuro y sin miedo a equivocarse." }] },
    },
    {
      say: "Para eso creamos socatres: una app de matemática pensada para estudiantes con dificultades de aprendizaje, desde tercero básico hasta cuarto medio.",
      visual: screen("ruta.jpg", { focus: 0.3 }),
    },
    {
      say: "Cada lección parte con un video corto que explica con ejemplos de la vida diaria. Por ejemplo, una ecuación es como la balanza de la feria.",
      visual: { type: "balance", x: 5, left: { bags: 1, balls: 4 }, right: { balls: 9 } },
      eq: "x + 4 = 9",
    },
    {
      say: "Después practica con ejercicios guiados. Si se equivoca, la app le explica qué revisar y le ofrece una pista, sin castigos.",
      visual: screen("ejercicio.jpg", { focus: 0.75, zoom: 1.12 }),
      eq: "",
    },
    {
      say: "Además, puede escuchar cada enunciado en voz alta, ideal si le cuesta leer.",
    },
    {
      say: "Tú, como apoderado, ves un resumen de la semana: qué días practicó, dónde le va bien, dónde necesita apoyo, y una sugerencia concreta para ayudar en casa.",
      visual: screen("resumen.jpg", { focus: 0.45 }),
    },
    {
      say: "Y pueden acordar premios en casa, como elegir la película o una tarde de parque. Las fichas se ganan por constancia, no por acertar, y tú apruebas cada canje.",
      visual: screen("premios.jpg", { focus: 0.3 }),
    },
    {
      say: "Sigue las Bases Curriculares, funciona en el celular y no necesita que estés al lado todo el tiempo.",
      visual: {
        type: "list",
        title: "socatres",
        items: ["📚 Bases Curriculares, de 3° Básico a 4° Medio", "📱 En el celular o el computador", "🦉 Practica con autonomía"],
      },
    },
    {
      say: "Entra a socatres punto pages punto dev y prueba tu primera lección gratis. socatres: el siguiente paso lo entiendes tú.",
      caption: "Entra a socatres.pages.dev y prueba tu primera lección gratis. socatres: el siguiente paso lo entiendes tú.",
      visual: { type: "cards", items: [{ icon: "🦉", title: "socatres", text: "Prueba gratis en {{socatres.pages.dev}}" }] },
    },
  ],
};
