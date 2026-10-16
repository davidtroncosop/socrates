// Metáfora: una bolita que elige izquierda o derecha en cada clavo.
export default {
  id: "galton",
  title: "Caminos al azar: el tablero de Galton",
  grade: "1° Medio",
  beats: [
    {
      say: "En un tablero de Galton, una bolita cae entre clavos. En cada clavo va a la izquierda o a la derecha, al azar.",
      visual: { type: "galton", rows: 3 },
    },
    {
      say: "Este camino fue derecha, izquierda, derecha.",
      visual: { type: "galton", rows: 3, path: ["D", "I", "D"] },
      eq: "D · I · D",
    },
    {
      say: "Con tres filas, cada una tiene dos opciones: dos por dos por dos, ocho caminos.",
      visual: { type: "galton", rows: 3, counts: [1, 3, 3, 1] },
      eq: "2 · 2 · 2 = 8 caminos",
    },
    {
      say: "Al extremo izquierdo llega un solo camino: siempre izquierda. Su probabilidad es un octavo.",
      visual: { type: "galton", rows: 3, path: ["I", "I", "I"], counts: [1, 3, 3, 1], highlight: 0 },
      eq: "1/8",
    },
    {
      say: "A las casillas del centro llegan tres caminos cada una. Por eso, si lanzas muchas bolitas, la mayoría cae al medio.",
      visual: { type: "galton", rows: 3, counts: [1, 3, 3, 1], highlight: 1 },
      eq: "3/8",
    },
    {
      say: "Recuerda: cada fila duplica los caminos. A los extremos llega un solo camino, y al centro, muchos.",
      visual: {
        type: "list",
        title: "Tablero de Galton",
        items: ["🔻 Cada clavo: izquierda o derecha.", "✖️ Caminos: 2 por cada fila.", "🎯 Al centro llegan más caminos."],
      },
      eq: "",
    },
  ],
};
