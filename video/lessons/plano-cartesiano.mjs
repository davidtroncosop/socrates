// Metáfora: primero caminas por la calle, después subes al edificio.
export default {
  id: "plano-cartesiano",
  title: "El plano cartesiano",
  grade: "7° Básico",
  beats: [
    {
      say: "El plano cartesiano es como un mapa. Cada punto tiene dos números: primero cuánto caminas, después cuánto subes.",
      visual: { type: "plane" },
    },
    {
      say: "El punto tres, dos: camina tres hacia la derecha y sube dos.",
      visual: { type: "plane", walk: [3, 2], points: [[3, 2]] },
      eq: "(3, 2)",
    },
    {
      say: "El orden importa. Dos, tres es otro punto: camina dos y sube tres.",
      visual: { type: "plane", walk: [2, 3], points: [[3, 2], [2, 3]] },
      eq: "(3, 2) ≠ (2, 3)",
    },
    {
      say: "Un vector mueve un punto. El vector cuatro, uno dice: cuatro a la derecha y uno hacia arriba.",
      visual: { type: "plane", points: [[3, 2]], vector: [[3, 2], [4, 1]] },
      eq: "vector (4, 1)",
    },
    {
      say: "Sumas el vector al punto: tres más cuatro es siete, y dos más uno es tres. El punto llega a siete, tres.",
      visual: { type: "plane", points: [[3, 2], [7, 3]], vector: [[3, 2], [4, 1]] },
      eq: "(3 + 4, 2 + 1) = (7, 3)",
    },
    {
      say: "Recuerda: primero la x, lo que caminas; después la y, lo que subes. Para mover con un vector, suma cada número a su coordenada.",
      visual: {
        type: "list",
        title: "Plano cartesiano",
        items: ["🚶 Primero x: lo que caminas.", "🏢 Después y: lo que subes.", "➡️ Vector: suma a cada coordenada."],
      },
      eq: "",
    },
  ],
};
