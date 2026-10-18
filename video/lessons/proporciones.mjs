// Metáforas: la receta que crece al mismo ritmo y el «valor de uno» (k).
const H = ["Cuadernos", "Precio"];

export default {
  id: "proporciones",
  title: "Proporcionalidad directa y regla de tres",
  grade: "7° Básico",
  beats: [
    {
      say: "Si una receta de queque es para cuatro personas y llegan ocho, duplicas todos los ingredientes. Cuando dos cantidades crecen juntas, al mismo ritmo, son directamente proporcionales.",
      visual: { type: "cards", items: [{ icon: "🧁", title: "La receta que crece", text: "El doble de invitados, el doble de ingredientes" }] },
    },
    {
      say: "Ahora, en la librería: dos cuadernos cuestan seis mil pesos.",
      visual: { type: "table", headers: H, rows: [["2", "$6 000"]] },
    },
    {
      say: "La clave es averiguar el precio de uno. Si dos cuestan seis mil, uno cuesta la mitad: tres mil. Ese valor de uno es la constante de proporcionalidad: k igual a tres mil.",
      visual: { type: "table", headers: H, rows: [["2", "$6 000"], ["1", "$3 000"]], arrow: { from: 0, to: 1, label: "÷ 2" } },
    },
    {
      say: "¿Cuánto cuestan cinco cuadernos? Cinco veces el precio de uno.",
      visual: { type: "table", headers: H, rows: [["2", "$6 000"], ["1", "$3 000"], ["5", "?"]], arrow: { from: 1, to: 2, label: "× 5" } },
    },
    {
      say: "Cinco por tres mil: quince mil pesos. Así funciona: el precio es k veces la cantidad.",
      visual: { type: "table", headers: H, rows: [["2", "$6 000"], ["1", "$3 000"], ["5", "$15 000"]], arrow: { from: 1, to: 2, label: "× 5" }, highlight: 2 },
      eq: "y = k · x = 3 000 · 5 = 15 000",
    },
    {
      say: "Para saber si dos cantidades son proporcionales, divide una por la otra en cada fila. Si siempre da lo mismo, son proporcionales: aquí siempre da tres mil.",
      visual: { type: "cards", items: [{ icon: "📐", title: "El cociente no cambia", text: "6 000 ÷ 2 = 3 000   ·   15 000 ÷ 5 = 3 000" }] },
      eq: "",
    },
    {
      say: "Con ecuaciones: equis dividido en cuatro, igual a seis. Si cada una de las cuatro partes vale seis, el total es seis por cuatro: veinticuatro.",
      visual: { type: "lines", lines: ["x ÷ 4 = 6", "x = 6 [[· 4]]", "x = 24"] },
    },
    {
      say: "Y si tres veces equis es cuarenta y cinco, una sola equis es cuarenta y cinco dividido en tres: quince. Es buscar el valor de uno.",
      visual: { type: "lines", lines: ["3x = 45", "x = 45 [[÷ 3]]", "x = 15"] },
    },
    {
      say: "Paso a paso: si tres cuadernos cuestan seis mil, ¿cuánto cuestan cinco? Paso uno: busca el valor de uno, dividiendo. Paso dos: multiplica por la cantidad que te piden.",
      visual: { type: "lines", lines: ["Paso 1: 6.000 ÷ 3 = 2.000 cada uno", "Paso 2: 2.000 · 5 = {{10.000}}"] },
      eq: "",
    },
    {
      say: "Recuerda: busca el valor de uno, multiplícalo por la cantidad que te piden, y si el cociente es siempre igual, la relación es proporcional.",
      visual: {
        type: "list",
        title: "Proporcionalidad directa",
        items: ["1️⃣ Busca el valor de uno: k.", "✖️ Multiplica k por la cantidad que te piden.", "➗ Si el cociente es siempre igual, es proporcional."],
      },
    },
  ],
};
