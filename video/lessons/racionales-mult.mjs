// Metáfora: la misma regla de siempre, ahora con fracciones y decimales.
export default {
  id: "racionales-mult",
  title: "Multiplicar y dividir números racionales",
  grade: "8° Básico",
  beats: [
    {
      say: "Los números racionales son fracciones y decimales, positivos o negativos. Se multiplican con dos reglas que ya conoces.",
      visual: { type: "cards", items: [{ icon: "🧩", title: "Dos reglas que ya conoces", text: "Fracciones: arriba por arriba. Signos: iguales positivo" }] },
    },
    {
      say: "Menos un medio por tres cuartos. Primero los números: arriba uno por tres, tres. Abajo dos por cuatro, ocho. Tres octavos.",
      visual: { type: "lines", lines: ["−1/2 · 3/4", "1 · 3 = 3 y 2 · 4 = 8", "3/8"] },
    },
    {
      say: "Después el signo: menos por más es menos. El resultado es menos tres octavos.",
      visual: { type: "lines", lines: ["−1/2 · 3/4", "signos distintos", "= {{−3/8}}"] },
    },
    {
      say: "Con decimales es igual. Menos cero coma cinco por menos cuatro: la mitad de cuatro es dos, y menos por menos, más. Dos.",
      visual: { type: "lines", lines: ["−0,5 · (−4)", "la mitad de 4 = 2", "= {{+2}}"] },
    },
    {
      say: "Si la temperatura baja dos coma cinco grados cada hora, en cuatro horas cambia menos dos coma cinco por cuatro: menos diez grados.",
      visual: { type: "numberline", min: -10, max: 0, every: 2, marker: -10, from: 0 },
      eq: "−2,5 · 4 = −10",
    },
    {
      say: "Recuerda: multiplica los números como siempre, y el signo con la regla de los enteros.",
      visual: {
        type: "list",
        title: "Racionales",
        items: ["🍕 Fracciones: arriba por arriba, abajo por abajo.", "➕ Signos iguales: positivo.", "➖ Signos distintos: negativo."],
      },
      eq: "",
    },
  ],
};
