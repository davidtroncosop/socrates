// Metáforas: el paréntesis es una caja que dice «ábreme primero»; con
// corchetes, cajas dentro de cajas (muñecas rusas): se abre desde la más chica.
const PAPOMUDAS = { type: "steps", title: "PAPOMUDAS", steps: ["Pa · ( )", "Po · x²", "MuDi · × ÷", "AS · + −"] };

export default {
  id: "jerarquia-parentesis",
  title: "Los paréntesis mandan",
  grade: "6° Básico",
  beats: [
    {
      say: "Los paréntesis son como una caja con una etiqueta que dice: ábreme primero. Lo que está adentro se resuelve antes que todo lo demás.",
      visual: { type: "cards", items: [{ icon: "🎁", title: "Los paréntesis mandan", text: "Lo que está adentro se resuelve primero" }] },
    },
    {
      say: "Sin paréntesis, tres más cuatro por dos es once. Pero con paréntesis, cambia todo.",
      visual: { type: "lines", lines: ["3 + 4 · 2 = 11", "(3 + 4) · 2 = ?"] },
    },
    {
      say: "Primero la caja: tres más cuatro, siete. Después, siete por dos: catorce. El paréntesis le ganó a la multiplicación.",
      visual: { type: "lines", lines: ["3 + 4 · 2 = 11", "(3 + 4) · 2 = [[7]] · 2 = 14"] },
    },
    {
      say: "Son dos situaciones distintas. Tres manzanas sueltas y cuatro bolsas de dos dan once. Dos bolsas con siete manzanas cada una dan catorce. El paréntesis dice cuál es la tuya.",
      visual: {
        type: "cards",
        items: [
          { icon: "🍎", title: "3 + 4 · 2 = 11", text: "3 sueltas y 4 bolsas de 2" },
          { icon: "🛍️", title: "(3 + 4) · 2 = 14", text: "2 bolsas con 7 cada una" },
        ],
      },
    },
    {
      say: "Otro ejemplo: treinta y seis dividido en, dos más cuatro. Primero la caja: seis. Treinta y seis dividido en seis: seis.",
      visual: { type: "lines", lines: ["36 ÷ (2 + 4)", "= 36 ÷ [[6]]", "= 6"] },
    },
    {
      say: "A veces hay cajas dentro de cajas, como las muñecas rusas: un paréntesis dentro de un corchete. Se abren desde la más chica, la de más adentro.",
      visual: { type: "cards", items: [{ icon: "🪆", title: "Cajas dentro de cajas", text: "Con corchetes y paréntesis, se abre desde la más chica" }] },
    },
    {
      say: "Dos, por el corchete: tres más, ocho menos dos. Primero la caja chica: ocho menos dos, seis. Luego el corchete: tres más seis, nueve. Y al final, dos por nueve: dieciocho.",
      visual: { type: "lines", lines: ["2 · [3 + (8 − 2)]", "= 2 · [3 + [[6]]]", "= 2 · [[9]]", "= 18"] },
    },
    {
      say: "Todo el orden se recuerda con una palabra: PAPOMUDAS. Paréntesis, potencias, multiplicación y división, adición y sustracción. En inglés se dice PEMDAS, y es lo mismo.",
      visual: PAPOMUDAS,
    },
    {
      say: "Paso a paso, con tres por, abre paréntesis, cuatro más dos. Paso uno: resuelve el paréntesis. Paso dos: sigue con multiplicaciones y divisiones. Paso tres: al final, sumas y restas.",
      visual: { type: "lines", lines: ["3 · (4 + 2)", "Paso 1: 4 + 2 = 6", "Paso 2: 3 · 6 = {{18}}"] },
      eq: "",
    },
    {
      say: "Recuerda: lo que está dentro del paréntesis va primero. Con cajas dentro de cajas, se empieza por la más chica. Y el orden completo es PAPOMUDAS.",
      visual: {
        type: "list",
        title: "Los paréntesis mandan",
        items: ["🎁 Lo de adentro va primero.", "🪆 Cajas dentro de cajas: desde la más chica.", "🪜 PAPOMUDAS: Paréntesis, Potencias, Multiplicación y División, Adición y Sustracción."],
      },
    },
  ],
};
