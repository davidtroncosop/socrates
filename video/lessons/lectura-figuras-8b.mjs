// Metáforas para las figuras: la metáfora es un disfraz (una cosa vestida de
// otra por un parecido), la personificación da vida de persona, y la
// hipérbole es un megáfono que agranda.
export default {
  id: "lectura-figuras-8b",
  title: "Recursos poéticos y figuras literarias",
  grade: "8° Básico",
  beats: [
    {
      say: "El lenguaje figurado no dice las cosas al pie de la letra: las dice de otra forma, para que las sintamos más.",
      visual: { type: "cards", items: [{ icon: "🎭", title: "Lenguaje figurado", text: "Decir algo de otra manera para que se sienta más" }] },
    },
    {
      say: "La metáfora es como un disfraz: una cosa aparece vestida de otra, porque tienen algo en común.",
      visual: { type: "cards", items: [{ icon: "🥸", title: "Metáfora: un disfraz", text: "Una cosa se presenta como otra porque se parecen" }] },
    },
    {
      say: "Sus palabras fueron dagas heladas. Nadie sacó un cuchillo: las palabras se disfrazan de dagas porque hirieron, y dejaron a todos helados, sin poder seguir discutiendo.",
      visual: {
        type: "passage",
        text: "«Sus palabras fueron {{dagas heladas}} que paralizaron la discusión».",
        notes: [
          { label: "Disfraz", text: "Las palabras se visten de dagas" },
          { label: "Parecido", text: "Hirieron y dejaron a todos fríos, sin moverse" },
        ],
      },
    },
    {
      say: "En la personificación, cosas o fenómenos cobran vida y actúan como personas.",
      visual: { type: "cards", items: [{ icon: "🌙", title: "Personificación", text: "Las cosas actúan como personas" }] },
    },
    {
      say: "La noche arropó al pueblo. Arropar es algo que hace una persona, como una madre que tapa a su hijo. La noche se vuelve alguien que cuida.",
      visual: {
        type: "passage",
        text: "«La noche {{arropó}} al pueblo con su oscuro abrigo de niebla y silencio».",
        notes: [
          { label: "Acción humana", text: "Arropar: tapar a alguien para que duerma" },
          { label: "Efecto", text: "La noche parece alguien que cuida" },
        ],
      },
    },
    {
      say: "La hipérbole es un megáfono: exagera a propósito, para que se note la emoción.",
      visual: { type: "cards", items: [{ icon: "📣", title: "Hipérbole: un megáfono", text: "Exagera para que se note la emoción" }] },
    },
    {
      say: "Te he advertido un millón de veces. Nadie lo contó: la exageración muestra cuánto cansancio e insistencia hay.",
      visual: {
        type: "passage",
        text: "«Te he advertido {{un millón de veces}} que guardes los libros antes de salir».",
        notes: [
          { label: "Exageración", text: "Nadie lo dijo un millón de veces" },
          { label: "Emoción", text: "Cansancio e insistencia" },
        ],
      },
    },
    {
      say: "Recuerda: la metáfora viste una cosa de otra por un parecido; la personificación hace actuar como persona a lo que no lo es; y la hipérbole exagera para remarcar una emoción.",
      visual: {
        type: "list",
        title: "Figuras literarias",
        items: ["🥸 Metáfora: una cosa vestida de otra por un parecido.", "🌙 Personificación: lo no humano actúa como persona.", "📣 Hipérbole: exagera para remarcar una emoción."],
      },
    },
  ],
};
