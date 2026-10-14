// Metáforas: multiplicar es tomar una parte de una parte; dividir es contar
// cuántas veces cabe.
export default {
  id: "fracciones-mult",
  title: "Multiplicar y dividir fracciones",
  grade: "7° Básico",
  beats: [
    {
      say: "Multiplicar por una fracción es tomar una parte de algo. Un medio por un tercio es la mitad de un tercio.",
      visual: { type: "cards", items: [{ icon: "🍕", title: "Una parte de una parte", text: "1/2 · 1/3 es la mitad de un tercio" }] },
    },
    {
      say: "Primero, un tercio de la pizza.",
      visual: { type: "bar", total: "1 pizza", parts: 3, filled: 1, partLabel: "1/3", caption: "Un tercio" },
      eq: "1/3",
    },
    {
      say: "Si cortamos cada tercio por la mitad, la pizza queda en seis trozos. La mitad de un tercio es un sexto.",
      visual: { type: "bar", total: "1 pizza", parts: 6, filled: 1, partLabel: "1/6", caption: "La mitad de un tercio" },
      eq: "1/2 · 1/3 = 1/6",
    },
    {
      say: "La regla es: arriba por arriba y abajo por abajo. Dos tercios por tres cuartos: seis doceavos, que es lo mismo que un medio.",
      visual: { type: "lines", lines: ["2/3 · 3/4", "= (2 · 3) / (3 · 4)", "= 6/12 = {{1/2}}"] },
      eq: "",
    },
    {
      say: "Dividir por una fracción es preguntar cuántas veces cabe. Tres dividido en un medio: ¿cuántas mitades caben en tres pizzas?",
      visual: { type: "cards", items: [{ icon: "➗", title: "Dividir: ¿cuántas veces cabe?", text: "3 ÷ 1/2: ¿cuántas mitades caben en 3 pizzas?" }] },
    },
    {
      say: "Cada pizza tiene dos mitades: en tres pizzas hay seis. Por eso, tres dividido en un medio es seis. Al dividir por una fracción, el resultado puede ser más grande.",
      visual: { type: "bar", total: "3 pizzas", parts: 6, filled: 6, partLabel: "1/2", caption: "6 mitades" },
      eq: "3 ÷ 1/2 = 6",
    },
    {
      say: "Recuerda: para multiplicar, arriba por arriba y abajo por abajo; es tomar una parte de una parte. Y dividir es contar cuántas veces cabe.",
      visual: {
        type: "list",
        title: "Multiplicar y dividir fracciones",
        items: ["✖️ Multiplicar: arriba por arriba, abajo por abajo.", "🍕 Es tomar una parte de una parte.", "➗ Dividir: cuántas veces cabe."],
      },
      eq: "",
    },
  ],
};
