// Metáfora: la máquina que funciona al revés.
export default {
  id: "funcion-inversa",
  title: "Función inversa",
  grade: "2° Medio",
  beats: [
    {
      say: "Una función es una máquina. En efe de equis igual dos equis más tres, entra un número, se multiplica por dos y se le suma tres.",
      visual: { type: "lines", lines: ["entra 4", "→ · 2 → 8", "→ + 3 → {{11}}"] },
      eq: "f(x) = 2x + 3",
    },
    {
      say: "La función inversa es la máquina al revés: entra el resultado y sale el número original.",
      visual: { type: "cards", items: [{ icon: "⚙️", title: "f⁻¹: la máquina al revés", text: "Entra 11 y sale 4" }] },
    },
    {
      say: "Para deshacer, se va en orden contrario, como sacarse los zapatos antes que los calcetines. Primero se deshace el más tres: once menos tres, ocho.",
      visual: { type: "lines", lines: ["entra 11", "→ − 3 → 8"] },
    },
    {
      say: "Después se deshace el por dos: ocho dividido en dos, cuatro. Volvimos al número original.",
      visual: { type: "lines", lines: ["entra 11", "→ − 3 → 8", "→ ÷ 2 → {{4}}"] },
      eq: "f⁻¹(11) = 4",
    },
    {
      say: "Cada operación tiene su contraria: sumar se deshace restando, y multiplicar se deshace dividiendo.",
      visual: { type: "lines", lines: ["+ ↔ −", "· ↔ ÷"] },
      eq: "",
    },
    {
      say: "Recuerda: la inversa deshace la función. Usa las operaciones contrarias, en orden inverso.",
      visual: {
        type: "list",
        title: "Función inversa",
        items: ["⚙️ La máquina al revés.", "🔁 Operaciones contrarias.", "👟 En orden inverso."],
      },
    },
  ],
};
