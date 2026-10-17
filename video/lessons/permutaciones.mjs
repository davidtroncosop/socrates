// Metáfora: llenar los lugares de una fila; cada lugar tiene una opción menos.
const people = (n) => ({ type: "tokens", size: 70, groups: [{ icon: "🧍", count: n, cols: n, label: `${n} personas` }] });

export default {
  id: "permutaciones",
  title: "Permutaciones y combinaciones",
  grade: "2° Medio",
  beats: [
    {
      say: "¿De cuántas formas se pueden ordenar cuatro personas en una fila?",
      visual: people(4),
    },
    {
      say: "El primer lugar tiene cuatro opciones. El segundo, tres, porque uno ya se ubicó. El tercero, dos. Y el último, una.",
      visual: { type: "lines", lines: ["1° lugar: 4", "2° lugar: 3", "3° lugar: 2", "4° lugar: 1"] },
    },
    {
      say: "Se multiplican: cuatro por tres por dos por uno, veinticuatro. Se escribe cuatro factorial.",
      eq: "4! = 4 · 3 · 2 · 1 = 24",
    },
    {
      say: "En un podio de tres entre cinco corredores importa el orden: cinco por cuatro por tres, sesenta.",
      visual: { type: "lines", lines: ["🥇 5 · 🥈 4 · 🥉 3", "= {{60}}"] },
      eq: "",
    },
    {
      say: "Pero si eliges dos amigos de cinco para un equipo, el orden no importa: Ana con Beto es lo mismo que Beto con Ana. Cinco por cuatro es veinte, y se divide por dos: diez.",
      visual: { type: "lines", lines: ["5 · 4 = 20 parejas con orden", "20 ÷ 2 = {{10}} sin orden"] },
    },
    {
      say: "Recuerda: si importa el orden, multiplica bajando de a uno. Si no importa, divide por las formas de ordenar a los elegidos.",
      visual: {
        type: "list",
        title: "Contar órdenes",
        items: ["🔢 n! = n · (n − 1) · … · 1.", "🥇 Importa el orden: multiplica bajando.", "👥 No importa: divide por los órdenes repetidos."],
      },
    },
  ],
};
