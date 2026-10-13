// Metáforas: la noticia es una ventana (muestra lo que pasó), la publicidad
// una vitrina (muestra lo que te quiere vender), y la lupa para comparar el
// titular con los datos.
export default {
  id: "lectura-medios",
  title: "Leer noticias y publicidad",
  grade: "7° Básico",
  beats: [
    {
      say: "Una noticia es como una ventana: muestra algo que pasó. La publicidad es como una vitrina: muestra lo que te quiere vender, de la forma más atractiva posible.",
      visual: {
        type: "cards",
        items: [
          { icon: "🪟", title: "Noticia: una ventana", text: "Muestra lo que pasó" },
          { icon: "🛍️", title: "Publicidad: una vitrina", text: "Muestra lo que te quiere vender" },
        ],
      },
    },
    {
      say: "Este aviso dice: trae tu taza y recibe un descuento en tu café. ¡Visítanos esta semana! ¿Qué quiere lograr? Que vayas a comprar. Es una vitrina.",
      visual: {
        type: "passage",
        label: "Aviso",
        text: "«Trae tu taza y recibe un descuento en tu café. {{¡Visítanos esta semana!}}»",
        notes: [{ label: "¿Qué quiere?", text: "Que vayas a comprar al local" }],
      },
    },
    {
      say: "En una noticia también aparecen opiniones. Que la sala tenga ciento veinte libros se puede comprobar contándolos. Que sea el espacio más hermoso es la opinión de la directora.",
      visual: {
        type: "passage",
        label: "Noticia escolar",
        text: "«El lunes se inauguró una [[sala de lectura con 120 libros]]. La directora afirmó: {{Es nuestro espacio más hermoso}}».",
        notes: [
          { label: "Hecho comprobable", text: "La sala tiene 120 libros" },
          { label: "Opinión", text: "Es el espacio más hermoso" },
        ],
      },
    },
    {
      say: "Usa la lupa: el titular dice que todo el barrio usa bicicleta, pero los datos dicen quince de cuarenta personas. Menos de la mitad. El titular exagera.",
      visual: {
        type: "passage",
        label: "Titular y datos",
        text: "{{«¡Todo el barrio usa bicicleta!»}} El texto informa que [[15 de las 40 personas]] encuestadas dicen usarla.",
        notes: [{ label: "Lupa", text: "15 de 40 no es «todo el barrio»: el titular exagera" }],
      },
    },
    {
      say: "Y cuando una publicación afirma que solo los jóvenes pueden aprender tecnología, sin datos ni ejemplos, pregúntate: ¿con qué pruebas? Si no hay, es una afirmación sin respaldo.",
      visual: {
        type: "passage",
        label: "Publicación",
        text: "«{{Solo los jóvenes pueden aprender a usar tecnología}}». No presenta datos ni ejemplos.",
        notes: [{ label: "¿Pruebas?", text: "Ninguna: es una afirmación sin respaldo" }],
      },
    },
    {
      say: "Al leer medios, hazte tres preguntas: ¿quién habla?, ¿qué quiere lograr: informar, opinar o vender?, y ¿con qué pruebas lo respalda?",
      visual: {
        type: "list",
        title: "Tres preguntas para leer medios",
        items: ["🗣️ ¿Quién habla?", "🎯 ¿Qué quiere lograr: informar, opinar o vender?", "🔍 ¿Con qué pruebas lo respalda?"],
      },
    },
  ],
};
