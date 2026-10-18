// Metáfora: la pizza cortada en partes iguales (modelo de barra).
const bar = (total, parts, filled, partLabel, caption) => ({ type: "bar", total, parts, filled, partLabel, caption });

export default {
  id: "base-fracciones",
  title: "Fracciones: partes iguales",
  grade: "Base",
  beats: [
    {
      say: "Una fracción es una parte de algo que se cortó en partes iguales. Esta pizza está cortada en cuatro partes iguales.",
      visual: bar("1 pizza entera", 4, 0, "1/4", "Cortada en 4 partes iguales"),
    },
    {
      say: "Si tomas tres de esas partes, tienes tres cuartos. El número de abajo dice en cuántas partes se cortó. El de arriba, cuántas tomaste.",
      visual: bar("1 pizza entera", 4, 3, "1/4", "Tomas 3 de 4 partes"),
      eq: "3/4",
    },
    {
      say: "Las partes tienen que ser iguales. Si un trozo es más grande que otro, ya no son cuartos.",
      visual: { type: "cards", items: [{ icon: "🍕", title: "Partes iguales", text: "Si los trozos no son iguales, no son cuartos" }] },
      eq: "",
    },
    {
      say: "¿Cuánto es un cuarto de veinte láminas? Repartimos las veinte en cuatro partes iguales: cada parte tiene cinco.",
      visual: bar("20 láminas", 4, 1, "5", "1/4 de 20"),
      eq: "1/4 de 20 = 20 ÷ 4 = 5",
    },
    {
      say: "Y tres cuartos de veinte son tres de esas partes: tres por cinco, quince.",
      visual: bar("20 láminas", 4, 3, "5", "3/4 de 20"),
      eq: "3/4 de 20 = 3 · 5 = 15",
    },
    {
      say: "Si cortas la pizza en ocho partes, la mitad son cuatro trozos. Por eso un medio es lo mismo que cuatro octavos. Son fracciones equivalentes.",
      visual: bar("1 pizza entera", 8, 4, "1/8", "La mitad = 4 de 8 trozos"),
      eq: "1/2 = 4/8",
    },
    {
      say: "Paso a paso, para tres cuartos de veinte. Paso uno: divide por el número de abajo. Paso dos: multiplica por el de arriba.",
      visual: { type: "lines", lines: ["Paso 1: 20 ÷ 4 = 5", "Paso 2: 5 · 3 = {{15}}"] },
      eq: "",
    },
    {
      say: "Recuerda: el número de abajo dice en cuántas partes iguales se corta. El de arriba, cuántas tomas. Y para calcular tres cuartos de veinte, divide en cuatro y toma tres.",
      visual: {
        type: "list",
        title: "Fracciones",
        items: ["🍕 Abajo: en cuántas partes iguales se corta.", "✋ Arriba: cuántas partes tomas.", "➗ 3/4 de 20: divide en 4 y toma 3 partes."],
      },
      eq: "",
    },
  ],
};
