// Metáfora: la letra es una caja que guarda un número.
const bal = (x, left, right, more = {}) => ({ type: "balance", x, left, right, ...more });

export default {
  id: "expresiones",
  title: "Expresiones con letras",
  grade: "6° Básico",
  beats: [
    {
      say: "Una letra es como una caja que guarda un número. Ese número puede cambiar.",
      visual: { type: "cards", items: [{ icon: "📦", title: "La letra guarda un número", text: "n puede valer 4, 10 o cualquier otro" }] },
    },
    {
      say: "Tres ene más dos dice: multiplica el número por tres y súmale dos. Tres ene es tres por ene.",
      visual: { type: "lines", lines: ["3n + 2", "= 3 · n + 2"] },
    },
    {
      say: "Si ene vale cuatro, cambia la letra por el cuatro: tres por cuatro es doce, más dos, catorce.",
      visual: { type: "lines", lines: ["n = 4", "3 · [[4]] + 2", "= 12 + 2 = {{14}}"] },
    },
    {
      say: "Ojo: tres ene no es treinta y cuatro. No se pegan los números: se multiplican.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "3n no es 34", text: "3n es 3 · n: con n = 4, 3 · 4 = 12" }] },
    },
    {
      say: "También puedes descubrir el número escondido. Un número más siete es quince. En la balanza: una caja y siete bolitas pesan lo mismo que quince bolitas.",
      visual: bal(8, { bags: 1, balls: 7 }, { balls: 15 }),
      eq: "n + 7 = 15",
    },
    {
      say: "Quita siete bolitas de cada lado. La caja pesa lo mismo que ocho bolitas: el número es ocho.",
      visual: bal(8, { bags: 1 }, { balls: 8 }),
      eq: "n = 8",
    },
    {
      say: "Recuerda: la letra guarda un número. Tres ene es tres por ene. Y para encontrar el número escondido, haz lo mismo en los dos lados de la balanza.",
      visual: {
        type: "list",
        title: "Expresiones con letras",
        items: ["📦 La letra guarda un número.", "✖️ 3n es 3 · n.", "⚖️ Lo mismo en los dos lados."],
      },
      eq: "",
    },
  ],
};
