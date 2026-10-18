// Metáfora: grupos que se repiten; la razón se multiplica, no se suma.
const grupos = (k) => [
  { icon: "🔴", count: 2 * k, cols: 2 * k, label: `${2 * k} rojas` },
  { icon: "🔵", count: 3 * k, cols: 3 * k, label: `${3 * k} azules` },
];

export default {
  id: "razones",
  title: "Razones",
  grade: "6° Básico",
  beats: [
    {
      say: "Una razón compara dos cantidades. Por cada dos bolitas rojas hay tres azules. Se escribe dos es a tres.",
      visual: { type: "tokens", size: 60, groups: grupos(1) },
      eq: "2 : 3",
    },
    {
      say: "Si ponemos otro grupo igual, ahora hay cuatro rojas y seis azules. Las dos cantidades se duplicaron.",
      visual: { type: "tokens", size: 60, groups: grupos(2) },
      eq: "4 : 6",
    },
    {
      say: "Con tres grupos: seis rojas y nueve azules. Siempre se multiplica por el mismo número.",
      visual: { type: "tokens", size: 52, groups: grupos(3) },
      eq: "6 : 9",
    },
    {
      say: "Un error común es sumar. Si a cuatro rojas le sumas dos, no puedes sumar dos a las azules. Hay que ver cuántas veces se repitió el grupo.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Se multiplica, no se suma", text: "Cuenta cuántas veces se repite el grupo" }] },
      eq: "",
    },
    {
      say: "Una receta usa tres tazas de harina por cada una de leche. Con doce tazas de harina, el grupo se repite cuatro veces. Entonces van cuatro tazas de leche.",
      visual: { type: "lines", lines: ["3 : 1", "12 = 3 · [[4]]", "Leche: 1 · 4 = {{4}}"] },
    },
    {
      say: "Paso a paso: por cada dos rojas hay tres azules. Con ocho rojas, ¿cuántas azules? Paso uno: busca por cuánto se multiplicó el dos. Paso dos: multiplica el tres por lo mismo.",
      visual: { type: "lines", lines: ["Paso 1: 8 = 2 · 4", "Paso 2: 3 · 4 = {{12}} azules"] },
      eq: "",
    },
    {
      say: "Recuerda: una razón dice por cada tanto, hay tanto. Busca cuántas veces se repite el grupo y multiplica las dos cantidades por ese número.",
      visual: {
        type: "list",
        title: "Razones",
        items: ["🔴🔵 Por cada 2 rojas, 3 azules: 2 : 3.", "🔁 Cuenta cuántas veces se repite el grupo.", "✖️ Multiplica las dos cantidades."],
      },
    },
  ],
};
