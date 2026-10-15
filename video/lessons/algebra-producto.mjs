// Metáfora: multiplicar es calcular el área de un rectángulo por partes.
const area = (show) => ({ type: "area", show, labels: { a: "x", b: "3", c: "2", a2: "x²", ab: "3x", ac: "2x", b2: "6" } });

export default {
  id: "algebra-producto",
  title: "Multiplicar expresiones algebraicas",
  grade: "8° Básico",
  beats: [
    {
      say: "Tres por, abre paréntesis, equis más cinco. El tres multiplica a cada parte: tres equis más quince.",
      visual: { type: "lines", lines: ["3(x + 5)", "= 3 · x + 3 · 5", "= 3x + {{15}}"] },
    },
    {
      say: "¿Y equis más tres por equis más dos? Piensa en un rectángulo: un lado mide equis más tres, el otro equis más dos.",
      visual: area(1),
      eq: "(x + 3)(x + 2)",
    },
    {
      say: "El rectángulo se divide en cuatro partes. Equis por equis, equis al cuadrado. Equis por tres, tres equis. Equis por dos, dos equis. Y tres por dos, seis.",
      visual: area(4),
    },
    {
      say: "Junta las partes del medio: tres equis más dos equis, cinco equis.",
      eq: "x² + 5x + 6",
    },
    {
      say: "Factorizar es el camino de vuelta. En seis equis más nueve, el tres está en los dos: tres por, dos equis más tres.",
      visual: { type: "lines", lines: ["6x + 9", "= 3 · 2x + 3 · 3", "= {{3(2x + 3)}}"] },
      eq: "",
    },
    {
      say: "Recuerda: el número de afuera multiplica a todo lo de adentro. Dos paréntesis forman un rectángulo de cuatro partes. Y factorizar es sacar lo que se repite.",
      visual: {
        type: "list",
        title: "Productos algebraicos",
        items: ["✖️ Lo de afuera multiplica a todo.", "🟦 Dos paréntesis: 4 partes.", "↩️ Factorizar: saca lo que se repite."],
      },
    },
  ],
};
