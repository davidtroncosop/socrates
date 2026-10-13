// Metáfora: la máquina duplicadora — la base es lo que hace la máquina y el
// exponente cuántas veces la usas; dividir es deshacer usos.
const sheets = (count, label) => ({ type: "tokens", size: 110, groups: [{ paper: true, count, label, cols: Math.min(count, 4) }] });

export default {
  id: "potencias",
  title: "Potencias y propiedades de exponentes",
  grade: "8° Básico",
  beats: [
    {
      say: "Imagina una máquina que duplica: cada vez que la usas, lo que tienes se multiplica por dos. Empiezas con una hoja.",
      visual: { type: "cards", items: [{ icon: "🖨️", title: "La máquina duplicadora", text: "Cada vez que la usas, lo que tienes se multiplica por 2" }] },
    },
    { say: "La usas una vez: dos hojas.", visual: sheets(2, "una vez: 2") },
    { say: "Dos veces: cuatro hojas.", visual: sheets(4, "dos veces: 2 · 2 = 4") },
    {
      say: "Tres veces: ocho hojas. Eso es dos elevado a tres: la base dos es lo que hace la máquina, y el exponente tres es cuántas veces la usas.",
      visual: sheets(8, "tres veces: 2 · 2 · 2 = 8"),
      eq: "2³ = 8",
    },
    {
      say: "Si la usas tres veces, y después dos veces más, en total la usaste cinco veces. Por eso, al multiplicar potencias de igual base, los exponentes se suman: dos elevado a cinco, treinta y dos.",
      visual: { type: "lines", lines: ["2³ · 2² = (2 · 2 · 2) · (2 · 2)", "= 2⁵ = 32"] },
      eq: "",
    },
    {
      say: "¿Y dividir? Imagina ahora una máquina que triplica. Dividir por tres es deshacer uno de sus usos.",
      visual: { type: "cards", items: [{ icon: "↩️", title: "Dividir es deshacer", text: "Cada división por la base deshace un uso de la máquina" }] },
    },
    {
      say: "Tres a la cuatro, dividido en tres al cuadrado: usaste la máquina cuatro veces y deshaces dos. Quedan dos usos: tres al cuadrado, nueve. Los exponentes se restan.",
      visual: { type: "lines", lines: ["3⁴ ÷ 3² = (~~3 · 3~~ · 3 · 3) ÷ (~~3 · 3~~)", "= 3² = 9"] },
    },
    {
      say: "Con base negativa, cuenta los signos menos. Menos dos al cubo tiene tres factores negativos: un número impar de signos menos, así que el resultado es negativo. Menos ocho.",
      visual: { type: "lines", lines: ["(−2)³ = (−2) · (−2) · (−2)", "= −8"] },
    },
    {
      say: "Recuerda: al multiplicar potencias de igual base, se suman los exponentes; al dividir, se restan. Y con base negativa y exponente impar, el resultado es negativo.",
      visual: {
        type: "list",
        title: "Potencias de igual base",
        items: ["✖️ Multiplicar: se suman los exponentes.", "➗ Dividir: se restan los exponentes.", "➖ Base negativa con exponente impar: resultado negativo."],
      },
    },
  ],
};
