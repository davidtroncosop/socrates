// Metáfora: la misma pizza cortada en más o menos trozos.
const bar = (parts, filled, partLabel, caption) => ({ type: "bar", total: "1 pizza", parts, filled, partLabel, caption });

export default {
  id: "base-fracciones-equivalentes",
  title: "Fracciones equivalentes",
  grade: "Base",
  beats: [
    {
      say: "Un medio de pizza.",
      visual: bar(2, 1, "1/2", "1/2"),
    },
    {
      say: "Si cortas cada trozo en dos, la misma cantidad de pizza son dos cuartos. Un medio y dos cuartos son equivalentes: valen lo mismo.",
      visual: bar(4, 2, "1/4", "1/2 = 2/4"),
    },
    {
      say: "Y si cortas cada trozo en tres, son tres sextos. La regla: multiplica arriba y abajo por el mismo número.",
      visual: bar(6, 3, "1/6", "1/2 = 3/6"),
      eq: "(1 · 3)/(2 · 3) = 3/6",
    },
    {
      say: "Para encontrar el número que falta: un medio igual a cuántos sextos. Abajo, el dos se multiplicó por tres. Arriba también: uno por tres, tres.",
      visual: { type: "lines", lines: ["1/2 = ?/6", "2 · [[3]] = 6", "1 · [[3]] = {{3}}"] },
      eq: "",
    },
    {
      say: "Simplificar es al revés: divide arriba y abajo por el mismo número. Seis octavos, dividido en dos: tres cuartos.",
      visual: { type: "lines", lines: ["6/8", "6 ÷ 2 = 3 · 8 ÷ 2 = 4", "= {{3/4}}"] },
    },
    {
      say: "Ojo: arriba y abajo no se suma ni se resta lo mismo. Se multiplica o se divide.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Multiplica o divide", text: "Nunca sumes ni restes lo mismo arriba y abajo" }] },
    },
    {
      say: "Recuerda: fracciones equivalentes valen lo mismo. Multiplica o divide arriba y abajo por el mismo número.",
      visual: {
        type: "list",
        title: "Fracciones equivalentes",
        items: ["🍕 Misma pizza, otro corte.", "✖️ Amplificar: multiplica arriba y abajo.", "➗ Simplificar: divide arriba y abajo."],
      },
    },
  ],
};
