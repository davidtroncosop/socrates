// Metáfora: la balanza con bolsas en los dos platos. Como todas las bolsas
// pesan lo mismo, se puede quitar una bolsa de cada lado.
const bal = (left, right, more = {}) => ({ type: "balance", x: 4, left, right, ...more });

export default {
  id: "both",
  title: "Conecta las dos partes",
  grade: "8° Básico",
  beats: [
    {
      say: "Volvamos a la balanza y a las bolsas misteriosas. Esta vez hay bolsas en los dos platos: tres bolsas y una bolita a la izquierda; una bolsa y nueve bolitas a la derecha.",
      visual: bal({ bags: 3, balls: 1 }, { bags: 1, balls: 9 }),
    },
    {
      say: "Todas las bolsas son iguales: tienen la misma cantidad de bolitas adentro. Se escribe así: tres equis más uno, igual a equis más nueve.",
      eq: "3x + 1 = x + 9",
    },
    {
      say: "La idea es juntar todas las bolsas en un solo lado. Sacamos una bolsa de la izquierda… y la balanza se inclina.",
      visual: bal({ bags: 2, balls: 1 }, { bags: 1, balls: 9 }),
      eq: "3x + 1 [[− x]] = x + 9",
    },
    {
      say: "Así que sacamos también una bolsa de la derecha. Como todas pesan lo mismo, vuelve el equilibrio.",
      visual: bal({ bags: 2, balls: 1 }, { balls: 9 }),
      eq: "3x + 1 [[− x]] = x + 9 [[− x]]",
    },
    {
      say: "Ahora quedan dos bolsas y una bolita, igual a nueve bolitas. Las bolsas quedaron todas juntas en un lado.",
      eq: "2x + 1 = 9",
    },
    {
      say: "Sacamos una bolita de cada lado: dos bolsas pesan lo mismo que ocho bolitas.",
      visual: bal({ bags: 2 }, { balls: 8 }),
      eq: "2x + 1 [[− 1]] = 9 [[− 1]]",
    },
    {
      say: "Repartimos las ocho bolitas en dos grupos iguales: cuatro para cada bolsa.",
      visual: bal({ bags: 2 }, { balls: 8 }, { groups: true }),
      eq: "2x = 8  →  x = 8 [[÷ 2]]",
    },
    {
      say: "Equis es igual a cuatro.",
      visual: bal({ bags: 2 }, { balls: 8 }, { groups: true, reveal: true }),
      eq: "x = 4",
    },
    {
      say: "Comprobamos en la balanza original: tres por cuatro, más uno, es trece. Cuatro más nueve también es trece. ¡Equilibrio!",
      visual: bal({ bags: 3, balls: 1 }, { bags: 1, balls: 9 }, { reveal: true }),
      eq: "3 · 4 + 1 = 4 + 9 = 13 {{✓}}",
    },
    {
      say: "Sin dibujar la balanza funciona igual. En cuatro equis más dos, igual a dos equis más dieciocho: quitamos dos equis de cada lado, después dos, y repartimos entre dos. Equis es ocho.",
      visual: { type: "lines", lines: ["4x + 2 = 2x + 18", "4x + 2 [[− 2x]] = 2x + 18 [[− 2x]]", "2x + 2 = 18", "2x = 16", "x = 8"] },
      eq: "",
    },
    {
      say: "Paso a paso, con cinco equis más dos igual dos equis más once. Paso uno: junta las equis en un lado, restando dos equis. Paso dos: deja los números en el otro, restando dos. Paso tres: divide. Paso cuatro: comprueba.",
      visual: { type: "lines", lines: ["Paso 1: 5x − 2x + 2 = 11 → 3x + 2 = 11", "Paso 2: 3x = 11 − 2 = 9", "Paso 3: x = 9 ÷ 3 = 3", "Paso 4: 5 · 3 + 2 = 17 = 2 · 3 + 11 ✓"] },
      eq: "",
    },
    {
      say: "Recuerda: junta las bolsas en un lado y las bolitas en el otro, quitando siempre lo mismo de ambos platos. Y comprueba al final.",
      visual: {
        type: "list",
        title: "Conecta las dos partes",
        items: ["🧺 Junta las x en un lado y los números en el otro.", "⚖️ Lo que quitas de un lado, quítalo también del otro.", "✅ Comprueba en la ecuación original."],
      },
    },
  ],
};
