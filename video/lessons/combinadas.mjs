// Metáfora: ordenar la pieza después de una mudanza — desempacar las cajas
// (paréntesis), ordenar lo que es igual (semejantes) y poner cada cosa en su
// lugar (despejar).
const bal = (left, right, more = {}) => ({ type: "balance", x: 5, left, right, ...more });
const solve = ["2(3x − 1) = 4x + 6", "6x − 2 = 4x + 6", "6x [[− 4x]] − 2 = 4x [[− 4x]] + 6", "2x − 2 = 6", "2x = 8", "x = 4"];

export default {
  id: "combinadas",
  title: "Distribución y reducción combinada",
  grade: "8° Básico",
  beats: [
    {
      say: "Resolver una ecuación con paréntesis es como ordenar tu pieza después de una mudanza: primero desempacas las cajas, después juntas lo que es igual, y al final pones cada cosa en su lugar.",
      visual: { type: "cards", items: [{ icon: "📦", title: "Desempacar, ordenar, despejar", text: "Como ordenar tu pieza después de una mudanza" }] },
    },
    {
      say: "Mira: dos, por equis más cuatro, igual a dieciocho. El paréntesis es una caja con una bolsa y cuatro bolitas, y hay dos cajas iguales.",
      visual: bal({ bags: 2, balls: 8 }, { balls: 18 }),
      eq: "2(x + 4) = 18",
    },
    {
      say: "Desempacamos: dos cajas nos dan dos bolsas y ocho bolitas. Dos equis más ocho, igual a dieciocho.",
      eq: "2x + 8 = 18",
    },
    {
      say: "Sacamos ocho bolitas de cada lado: dos bolsas pesan diez.",
      visual: bal({ bags: 2 }, { balls: 10 }),
      eq: "2x + 8 [[− 8]] = 18 [[− 8]]",
    },
    {
      say: "Repartimos en dos grupos iguales: equis es cinco.",
      visual: bal({ bags: 2 }, { balls: 10 }, { groups: true, reveal: true }),
      eq: "x = 10 [[÷ 2]] = 5",
    },
    {
      say: "Ese es el orden: desempacar los paréntesis, ordenar juntando los términos semejantes, y despejar.",
      visual: { type: "steps", title: "El orden", steps: ["📦 Desempacar", "🧺 Ordenar", "🎯 Despejar"] },
      eq: "",
    },
    {
      say: "Ahora una más difícil: dos, por tres equis menos uno, igual a cuatro equis más seis.",
      visual: { type: "lines", lines: solve.slice(0, 1) },
    },
    {
      say: "Desempacar: el dos multiplica a cada término de la caja. Seis equis menos dos.",
      visual: { type: "lines", lines: solve.slice(0, 2) },
    },
    {
      say: "Ordenar: juntamos las equis en un lado, restando cuatro equis en ambos. Queda dos equis menos dos, igual a seis.",
      visual: { type: "lines", lines: solve.slice(0, 4) },
    },
    {
      say: "Despejar: sumamos dos y dividimos por dos. Equis es cuatro.",
      visual: { type: "lines", lines: solve },
    },
    {
      say: "Comprobamos: dos, por doce menos uno, es veintidós. Y cuatro por cuatro, más seis, también es veintidós. ¡Pieza ordenada!",
      visual: { type: "lines", lines: [...solve, "{{2(3 · 4 − 1) = 22   y   4 · 4 + 6 = 22 ✓}}"], size: 64 },
    },
    {
      say: "Paso a paso, con dos por, abre paréntesis, equis más tres, igual a equis más diez. Paso uno: distribuye. Paso dos: junta las equis. Paso tres: despeja. Paso cuatro: comprueba.",
      visual: { type: "lines", lines: ["Paso 1: 2x + 6 = x + 10", "Paso 2: 2x − x = 10 − 6", "Paso 3: x = 4", "Paso 4: 2 · (4 + 3) = 14 = 4 + 10 ✓"] },
      eq: "",
    },
    {
      say: "Recuerda: desempaca multiplicando cada término del paréntesis, ordena juntando las equis y los números, y despeja. Al final, comprueba.",
      visual: {
        type: "list",
        title: "Para recordar",
        items: ["📦 Desempaca: el número de afuera multiplica a cada término.", "🧺 Ordena: junta las x en un lado y los números en el otro.", "🎯 Despeja y comprueba."],
      },
    },
  ],
};
