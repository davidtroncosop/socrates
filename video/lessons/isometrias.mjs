// Metáfora: el espejo y la media vuelta.
const plane = (more) => ({ type: "plane", min: -6, max: 6, ...more });

export default {
  id: "isometrias",
  title: "Mover figuras: traslación, reflexión y rotación",
  grade: "8° Básico",
  beats: [
    {
      say: "Mover una figura sin cambiar su forma ni su tamaño se llama isometría. Hay tres: trasladar, reflejar y rotar.",
      visual: { type: "cards", items: [{ icon: "🧩", title: "Isometrías", text: "Trasladar, reflejar y rotar sin deformar" }] },
    },
    {
      say: "Trasladar es deslizar. El punto tres, dos con el vector dos, uno llega a cinco, tres: se suma.",
      visual: plane({ points: [[3, 2], [5, 3]], vector: [[3, 2], [2, 1]] }),
      eq: "(3, 2) → (5, 3)",
    },
    {
      say: "Reflejar en el eje y es como un espejo vertical. El punto cuatro, uno se ve al otro lado: menos cuatro, uno. Cambia el signo de la x.",
      visual: plane({ mirror: "y", points: [[4, 1], [-4, 1]] }),
      eq: "(4, 1) → (−4, 1)",
    },
    {
      say: "En el espejo del eje x, cambia el signo de la y. Cinco, tres llega a cinco, menos tres.",
      visual: plane({ mirror: "x", points: [[5, 3], [5, -3]] }),
      eq: "(5, 3) → (5, −3)",
    },
    {
      say: "Rotar media vuelta alrededor del origen cambia los dos signos. Dos, cinco llega a menos dos, menos cinco.",
      visual: plane({ points: [[2, 5], [-2, -5]] }),
      eq: "(2, 5) → (−2, −5)",
    },
    {
      say: "Recuerda: trasladar es sumar el vector. En el espejo del eje y cambia la x; en el del eje x, la y. Media vuelta cambia las dos.",
      visual: {
        type: "list",
        title: "Isometrías",
        items: ["➡️ Trasladar: suma el vector.", "🪞 Eje y: cambia el signo de x.", "🪞 Eje x: cambia el signo de y.", "🔄 Media vuelta: cambian las dos."],
      },
      eq: "",
    },
  ],
};
