// Reel corto (~1 minuto) de «Encuentra el valor de x»: guion propio, más
// directo que la lección, con la misma balanza.
import lesson from "../lessons/equations.mjs";

const bal = (x, left, right, more = {}) => ({ type: "balance", x, left, right, ...more });

export default {
  id: "reel-equations-corto",
  title: lesson.title,
  grade: lesson.grade,
  beats: [
    {
      say: "¿Te cuesta despejar la equis? Piensa en una balanza.",
      visual: bal(5, {}, {}, { pivot: true }),
    },
    {
      say: "En un plato, una bolsa con equis bolitas y cuatro sueltas. En el otro, nueve bolitas.",
      visual: bal(5, { bags: 1, balls: 4 }, { balls: 9 }),
      eq: "x + 4 = 9",
    },
    {
      say: "Saca cuatro de la izquierda, y también cuatro de la derecha. Lo que haces en un lado, lo haces en el otro.",
      visual: bal(5, { bags: 1 }, { balls: 5 }),
      eq: "x + 4 [[− 4]] = 9 [[− 4]]",
    },
    {
      say: "La bolsa sola pesa cinco. Equis es igual a cinco.",
      visual: bal(5, { bags: 1 }, { balls: 5 }, { reveal: true }),
      eq: "x = 5",
    },
    {
      say: "Ahora, un desafío: dos equis más tres, igual a quince.",
      visual: bal(6, { bags: 2, balls: 3 }, { balls: 15 }),
      eq: "2x + 3 = 15",
    },
    {
      say: "Deshaz al revés, como cuando te sacas primero los zapatos y después los calcetines. Primero, quita el tres.",
      visual: bal(6, { bags: 2 }, { balls: 12 }),
      eq: "2x + 3 [[− 3]] = 15 [[− 3]]",
    },
    {
      say: "Después, reparte las doce bolitas en dos grupos iguales. Equis es seis.",
      visual: bal(6, { bags: 2 }, { balls: 12 }, { groups: true, reveal: true }),
      eq: "x = 12 [[÷ 2]] = 6",
    },
    {
      say: "Comprueba: dos por seis, doce. Más tres, quince. ¡Equilibrio!",
      visual: bal(6, { bags: 2, balls: 3 }, { balls: 15 }, { reveal: true }),
      eq: "2 · 6 + 3 = 15 {{✓}}",
    },
    {
      say: "Practica paso a paso, a tu ritmo, en socatres.",
    },
  ],
};
