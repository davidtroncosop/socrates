// Metáfora: las paralelas cortan las dos rectas en la misma proporción.
export default {
  id: "tales",
  title: "Teorema de Tales",
  grade: "1° Medio",
  beats: [
    {
      say: "Dos rectas salen del mismo punto. Unas rectas paralelas, las verdes, las cortan.",
      visual: { type: "tales", k: 2, labels: ["", "", "", ""] },
    },
    {
      say: "En la recta de arriba, los trozos miden dos y cuatro. En la de abajo, el primero mide tres.",
      visual: { type: "tales", k: 2, labels: ["2", "4", "3", "x"] },
    },
    {
      say: "Tales dice que las paralelas cortan en la misma proporción. Cuatro es el doble de dos, así que equis es el doble de tres: seis.",
      eq: "2/4 = 3/x → x = 6",
    },
    {
      say: "Ojo: no se suma. De dos a cuatro hay dos más, pero lo que importa es que se multiplicó por dos.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Se multiplica, no se suma", text: "4 es 2 · 2, así que x = 3 · 2 = 6 (no 5)" }] },
      eq: "",
    },
    {
      say: "Así se mide un edificio con su sombra. Un poste de dos metros da tres metros de sombra. Si la sombra del edificio mide treinta, es diez veces más: el edificio mide veinte metros.",
      visual: { type: "lines", lines: ["poste 2 m → sombra 3 m", "edificio ? → sombra 30 m", "30 = 3 · 10 → 2 · 10 = {{20 m}}"] },
    },
    {
      say: "Recuerda: con paralelas, los trozos están en la misma proporción. Busca por cuánto se multiplicó y aplícalo al otro lado.",
      visual: {
        type: "list",
        title: "Teorema de Tales",
        items: ["📐 Las paralelas cortan en la misma proporción.", "✖️ Busca por cuánto se multiplicó.", "🏢 Sirve para medir alturas con sombras."],
      },
    },
  ],
};
