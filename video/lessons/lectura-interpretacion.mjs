// Metáforas: el dilema como encrucijada (algo valioso en cada camino) e
// interpretar como un abogado (una propuesta defendida con pruebas del texto).
const eva = "Eva llevaba meses ahorrando para una bicicleta. Cuando supo que su hermano necesitaba anteojos, puso su alcancía sobre la mesa y dijo: «La bicicleta puede esperar».";
const evaMarked = "Eva llevaba [[meses ahorrando]] para una bicicleta. Cuando supo que su hermano necesitaba anteojos, [[puso su alcancía sobre la mesa]] y dijo: «La bicicleta puede esperar».";
const omar = "Aunque todos se burlaron de su pequeño árbol, Omar [[siguió regándolo]]. Años después {{descansaron juntos bajo su sombra}}.";

export default {
  id: "lectura-interpretacion",
  title: "Interpretar dilemas literarios",
  grade: "7° Básico",
  beats: [
    {
      say: "Un dilema es como una encrucijada: hay dos caminos, y en cada uno hay algo que te importa. Elegir uno significa renunciar a algo del otro.",
      visual: { type: "cards", items: [{ icon: "🛣️", title: "Un dilema es una encrucijada", text: "En cada camino hay algo valioso" }] },
    },
    {
      say: "Lee: Eva llevaba meses ahorrando para una bicicleta. Cuando supo que su hermano necesitaba anteojos, puso su alcancía sobre la mesa y dijo: la bicicleta puede esperar.",
      visual: { type: "passage", text: eva },
    },
    {
      say: "¿Cuál es el dilema? En un camino está su sueño, la bicicleta. En el otro, ayudar a su hermano.",
      visual: {
        type: "cards",
        items: [
          { icon: "🚲", title: "Camino 1", text: "Su sueño: la bicicleta" },
          { icon: "👓", title: "Camino 2", text: "Ayudar a su hermano" },
        ],
      },
    },
    {
      say: "Interpretar es proponer un sentido y defenderlo con pruebas, como un abogado. Propuesta: Eva pone a su familia antes que su deseo. Prueba: había ahorrado meses, y aun así entrega la alcancía.",
      visual: {
        type: "passage",
        text: evaMarked,
        notes: [
          { label: "Pruebas", text: "Ahorró meses, pero entrega la alcancía" },
          { label: "Interpretación", text: "Pone a su familia antes que su deseo" },
        ],
      },
    },
    {
      say: "Fíjate que el detalle de los meses ahorrando hace más fuerte la interpretación: mientras más le cuesta renunciar, más generoso es el gesto.",
      visual: { type: "cards", items: [{ icon: "⚖️", title: "Lo que cuesta el gesto", text: "Mientras más cuesta renunciar, más valor tiene el gesto" }] },
    },
    {
      say: "Otro relato: aunque todos se burlaron de su pequeño árbol, Omar siguió regándolo. Años después descansaron juntos bajo su sombra. El sentido: la perseverancia puede dar frutos, incluso para quienes se burlaban.",
      visual: { type: "passage", text: omar, notes: [{ label: "Sentido", text: "La perseverancia da frutos con el tiempo, también para otros" }] },
    },
    {
      say: "Para interpretar: identifica qué valores están en tensión, propón un sentido, y sostenlo con detalles del texto.",
      visual: {
        type: "list",
        title: "Para interpretar",
        items: ["🛣️ Identifica qué valores están en tensión.", "💡 Propón un sentido.", "🧾 Sostenlo con detalles del texto."],
      },
    },
  ],
};
