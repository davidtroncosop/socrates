// Metáforas: la fila de PAPOMUDAS y la potencia pegada a su base como un
// imán (en 2 + 3², solo el 3 se eleva).
const PAPOMUDAS = { type: "steps", title: "PAPOMUDAS", steps: ["Pa · ( )", "Po · x²", "MuDi · × ÷", "AS · + −"] };

export default {
  id: "jerarquia-potencias",
  title: "Las potencias en la fila",
  grade: "8° Básico",
  beats: [
    {
      say: "Repasemos la fila de PAPOMUDAS: paréntesis, potencias, multiplicación y división, adición y sustracción. Hoy nos toca el segundo lugar: las potencias.",
      visual: PAPOMUDAS,
    },
    {
      say: "Una potencia está pegada a su base, como un imán. En dos más tres al cuadrado, el cuadrado es solo del tres: el dos no tiene nada que ver.",
      visual: { type: "cards", items: [{ icon: "🧲", title: "La potencia está pegada a su base", text: "En 2 + 3², solo el 3 se eleva al cuadrado" }] },
    },
    {
      say: "Primero la potencia: tres al cuadrado es tres por tres, nueve. Después la suma: once.",
      visual: { type: "lines", lines: ["2 + 3²", "= 2 + [[9]]", "= 11"] },
    },
    {
      say: "Si quisieras elevar todo, necesitas un paréntesis: dos más tres, entre paréntesis, al cuadrado. Primero la caja, cinco. Y cinco al cuadrado es veinticinco. Otra cuenta.",
      visual: { type: "lines", lines: ["(2 + 3)²", "= [[5]]²", "= 25"] },
    },
    {
      say: "Un error muy común es creer que dos al cubo es dos por tres. No: es dos por dos por dos, ocho. El exponente dice cuántas veces se usa la base como factor.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "2³ no es 2 · 3", text: "2³ = 2 · 2 · 2 = 8: el exponente cuenta cuántas veces se multiplica la base" }] },
    },
    {
      say: "Entonces, cuatro por dos al cubo: primero la potencia, ocho. Después cuatro por ocho: treinta y dos.",
      visual: { type: "lines", lines: ["4 · 2³", "= 4 · [[8]]", "= 32"] },
    },
    {
      say: "Uno con todo: tres por dos al cuadrado, menos, seis menos uno. Paréntesis: cinco. Potencia: dos al cuadrado, cuatro. Multiplicación: tres por cuatro, doce. Y al final la resta: doce menos cinco, siete.",
      visual: { type: "lines", lines: ["3 · 2² − (6 − 1)", "= 3 · 2² − [[5]]", "= 3 · [[4]] − 5", "= [[12]] − 5", "= 7"] },
    },
    {
      say: "Paso a paso, con dos más tres al cuadrado. Paso uno: paréntesis. Paso dos: potencias. Paso tres: multiplicaciones y divisiones. Paso cuatro: sumas y restas.",
      visual: { type: "lines", lines: ["2 + 3²", "Paso 2: 3² = 9", "Paso 4: 2 + 9 = {{11}}"] },
      eq: "",
    },
    {
      say: "Recuerda el orden completo: paréntesis, potencias, multiplicación y división, y al final adición y sustracción. En cada nivel, de izquierda a derecha.",
      visual: {
        type: "list",
        title: "PAPOMUDAS completo",
        items: ["🎁 Pa: Paréntesis.", "🧲 Po: Potencias, pegadas a su base.", "✖️ MuDi: Multiplicación y División, de izquierda a derecha.", "➕ AS: Adición y Sustracción, de izquierda a derecha."],
      },
    },
  ],
};
