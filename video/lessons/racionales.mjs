// Metáforas: 0,5x es media bolsa (la bolsa entera pesa el doble) y
// multiplicar todo por 10 es cambiar de unidad (0,5 m = 50 cm).
const bal = (left, right, more = {}) => ({ type: "balance", x: 8, left, right, ...more });

export default {
  id: "racionales",
  title: "Ecuaciones con racionales y decimales",
  grade: "8° Básico",
  beats: [
    {
      say: "¿Qué significa cero coma cinco equis? Es la mitad de equis: media bolsa. Aquí, media bolsa y tres bolitas pesan lo mismo que siete bolitas.",
      visual: bal({ halves: 1, balls: 3 }, { balls: 7 }),
      eq: "0,5x + 3 = 7",
    },
    {
      say: "Primero, como siempre, sacamos tres bolitas de cada lado. Media bolsa pesa lo mismo que cuatro bolitas.",
      visual: bal({ halves: 1 }, { balls: 4 }),
      eq: "0,5x = 4",
    },
    {
      say: "Si media bolsa pesa cuatro, ¿cuánto pesa la bolsa entera? El doble: ocho.",
    },
    {
      say: "En la balanza, eso es duplicar lo que hay en cada plato. Si duplicas los dos lados, el equilibrio se mantiene. Equis es igual a ocho.",
      visual: bal({ bags: 1 }, { balls: 8 }, { reveal: true }),
      eq: "0,5x [[· 2]] = 4 [[· 2]]  →  x = 8",
    },
    {
      say: "Hay otra forma de deshacerse de la coma: cambiar de unidad. Cero coma cinco metros son cincuenta centímetros. Si multiplicas todos los términos por diez o por cien, los decimales se vuelven enteros.",
      visual: { type: "cards", items: [{ icon: "📏", title: "Cambiar de unidad", text: "0,5 m = 50 cm: multiplicar por 10 o por 100 borra la coma" }] },
      eq: "",
    },
    {
      say: "Por ejemplo: cero coma dos equis menos uno, igual a tres. Multiplicamos todos los términos por diez: dos equis menos diez, igual a treinta.",
      visual: { type: "lines", lines: ["0,2x − 1 = 3", "[[· 10]]   2x − 10 = 30"] },
    },
    {
      say: "Sumamos diez: dos equis igual a cuarenta. Equis es veinte.",
      visual: { type: "lines", lines: ["0,2x − 1 = 3", "[[· 10]]   2x − 10 = 30", "2x = 40", "x = 20"] },
    },
    {
      say: "Comprobamos: cero coma dos por veinte es cuatro, menos uno, tres. ¡Correcto!",
      visual: { type: "lines", lines: ["0,2x − 1 = 3", "[[· 10]]   2x − 10 = 30", "2x = 40", "x = 20", "{{0,2 · 20 − 1 = 3 ✓}}"] },
    },
    {
      say: "Ojo con un error frecuente: hay que multiplicar todos los términos, también el que está solo. Si multiplicas solo uno, la balanza se desequilibra.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Todos los términos", text: "0,2x − 1 = 3 → 2x − 10 = 30, no 2x − 1 = 3" }] },
    },
    {
      say: "Paso a paso, con equis medios más uno igual cuatro. Paso uno: quita el uno, restando en los dos lados. Paso dos: deshaz la división multiplicando por dos. Paso tres: comprueba.",
      visual: { type: "lines", lines: ["Paso 1: x/2 = 4 − 1 = 3", "Paso 2: x = 3 · 2 = 6", "Paso 3: 6/2 + 1 = 4 ✓"] },
      eq: "",
    },
    {
      say: "Recuerda: un decimal delante de equis es una parte de la bolsa. Y si multiplicas todos los términos por el mismo número, la ecuación sigue en equilibrio, pero sin comas.",
      visual: {
        type: "list",
        title: "Ecuaciones con decimales",
        items: ["½ 0,5x es media bolsa: la bolsa entera pesa el doble.", "✖️ Multiplica todos los términos por 10 o 100 para borrar la coma.", "⚖️ Lo que haces en un lado, lo haces en el otro."],
      },
    },
  ],
};
