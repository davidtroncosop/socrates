// Reel (~1 minuto): la metáfora de la balanza de la feria con un solo
// ejercicio, x + 4 = 9. La propuesta de valor es imaginar, no solo calcular.
const bal = (x, left, right, more = {}) => ({ type: "balance", x, left, right, ...more });

export default {
  id: "reel-ecuaciones-balanza",
  title: "Ecuaciones: la balanza",
  grade: "7° Básico",
  beats: [
    {
      say: "Imagina que estás en la feria, frente a la balanza del casero.",
      visual: bal(5, {}, {}),
    },
    {
      say: "Cuando los dos platos quedan a la misma altura, pesan exactamente lo mismo. Están en equilibrio.",
    },
    {
      say: "Una ecuación es eso: una balanza en equilibrio. El signo igual es el punto de apoyo, justo al medio.",
      visual: bal(5, {}, {}, { pivot: true }),
    },
    {
      say: "En un plato hay una bolsa cerrada y cuatro bolitas. En el otro, nueve bolitas.",
      visual: bal(5, { bags: 1, balls: 4 }, { balls: 9 }),
    },
    {
      say: "¿Cuántas bolitas esconde la bolsa? Ese misterio es la equis.",
      eq: "x + 4 = 9",
    },
    {
      say: "Si sacas las cuatro bolitas sueltas solo de un lado, ¡la balanza se desequilibra!",
      visual: bal(5, { bags: 1 }, { balls: 9 }),
      eq: "x + 4 [[− 4]] = 9",
    },
    {
      say: "Para recuperar el equilibrio, saca también cuatro del otro plato. Lo que haces en un lado, lo haces en el otro.",
      visual: bal(5, { bags: 1 }, { balls: 5 }),
      eq: "x + 4 [[− 4]] = 9 [[− 4]]",
    },
    {
      say: "Ahora la bolsa sola pesa lo mismo que cinco bolitas. ¡Descubriste el misterio! Equis es cinco.",
      visual: bal(5, { bags: 1 }, { balls: 5 }, { reveal: true }),
      eq: "x = 5",
    },
    {
      say: "Cada vez que veas una ecuación, imagina la balanza de la feria.",
    },
  ],
};
