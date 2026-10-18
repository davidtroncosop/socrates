// Metáforas: la balanza de la feria (el = es el punto de apoyo), la bolsa
// misteriosa (x), calcetines y zapatos (deshacer en orden inverso) y repartir
// en grupos iguales (dividir).
const bal = (x, left, right, more = {}) => ({ type: "balance", x, left, right, ...more });

export default {
  id: "equations",
  title: "Encuentra el valor de x",
  grade: "7° Básico",
  beats: [
    {
      say: "¿Has visto una balanza en la feria? Cuando los dos platos quedan a la misma altura, es porque pesan exactamente lo mismo.",
      visual: bal(5, {}, {}),
    },
    {
      say: "Una ecuación es eso: una balanza en equilibrio. El signo igual es el punto de apoyo, justo al medio.",
      visual: bal(5, {}, {}, { pivot: true }),
    },
    {
      say: "En el plato izquierdo ponemos una bolsa cerrada y cuatro bolitas. En el derecho, nueve bolitas.",
      visual: bal(5, { bags: 1, balls: 4 }, { balls: 9 }),
    },
    {
      say: "No sabemos cuántas bolitas hay dentro de la bolsa. Ese número misterioso es la equis. En matemática lo escribimos así: equis más cuatro, igual a nueve.",
      eq: "x + 4 = 9",
    },
    {
      say: "Para descubrirlo, sacamos las cuatro bolitas sueltas de la izquierda. ¡Cuidado! La balanza se desequilibra.",
      visual: bal(5, { bags: 1 }, { balls: 9 }),
      eq: "x + 4 [[− 4]] = 9",
    },
    {
      say: "Por eso sacamos también cuatro del lado derecho. Lo que haces en un lado, lo haces en el otro.",
      visual: bal(5, { bags: 1 }, { balls: 5 }),
      eq: "x + 4 [[− 4]] = 9 [[− 4]]",
    },
    {
      say: "Vuelve el equilibrio, y ahora la bolsa sola pesa lo mismo que cinco bolitas. Equis es igual a cinco.",
      visual: bal(5, { bags: 1 }, { balls: 5 }, { reveal: true }),
      eq: "x = 5",
    },
    {
      say: "Ahora, un desafío: dos bolsas iguales y tres bolitas pesan lo mismo que quince bolitas. Dos equis más tres, igual a quince.",
      visual: bal(6, { bags: 2, balls: 3 }, { balls: 15 }),
      eq: "2x + 3 = 15",
    },
    {
      say: "Piensa en cómo te vistes en la mañana: primero los calcetines, después los zapatos.",
      visual: { type: "steps", title: "Para vestirte", steps: ["🧦 Calcetines", "👟 Zapatos"] },
    },
    {
      say: "Para sacártelos, lo haces al revés: primero los zapatos, después los calcetines. Nadie se saca los calcetines con los zapatos puestos.",
      visual: { type: "steps", title: "Para sacártelos: al revés", steps: ["👟 Zapatos", "🧦 Calcetines"] },
    },
    {
      say: "A la equis le pasó lo mismo: primero se multiplicó por dos, y después se le sumó tres.",
      visual: { type: "steps", title: "Así se armó 2x + 3", steps: ["× 2", "+ 3"] },
    },
    {
      say: "Para despejarla, deshacemos al revés: primero quitamos el tres, y al final repartimos entre dos.",
      visual: { type: "steps", title: "Para despejar x: al revés", steps: ["− 3", "÷ 2"] },
    },
    {
      say: "Quitamos tres bolitas de cada lado. Ahora dos bolsas pesan lo mismo que doce bolitas.",
      visual: bal(6, { bags: 2 }, { balls: 12 }),
      eq: "2x + 3 [[− 3]] = 15 [[− 3]]",
    },
    {
      say: "Si dos bolsas iguales pesan doce, repartimos las doce bolitas en dos grupos iguales. A cada bolsa le tocan seis.",
      visual: bal(6, { bags: 2 }, { balls: 12 }, { groups: true }),
      eq: "2x = 12  →  x = 12 [[÷ 2]]",
    },
    {
      say: "Equis es igual a seis.",
      visual: bal(6, { bags: 2 }, { balls: 12 }, { groups: true, reveal: true }),
      eq: "x = 6",
    },
    {
      say: "Siempre puedes comprobar: pon seis en cada bolsa. Dos por seis, doce. Más tres, quince. La balanza queda en equilibrio.",
      visual: bal(6, { bags: 2, balls: 3 }, { balls: 15 }, { reveal: true }),
      eq: "2 · 6 + 3 = 15 {{✓}}",
    },
    {
      say: "Paso a paso, con tres equis más cuatro igual diecinueve. Paso uno: quita el cuatro restando en los dos lados. Paso dos: divide los dos lados por tres. Paso tres: comprueba.",
      visual: { type: "lines", lines: ["Paso 1: 3x + 4 − 4 = 19 − 4 → 3x = 15", "Paso 2: 3x ÷ 3 = 15 ÷ 3 → x = 5", "Paso 3: 3 · 5 + 4 = 19 ✓"] },
      eq: "",
    },
    {
      say: "Recuerda las dos reglas de la balanza: lo que haces en un lado, lo haces en el otro. Y deshaz las operaciones en orden inverso, como los zapatos y los calcetines.",
      visual: {
        type: "list",
        title: "Las reglas de la balanza",
        items: ["⚖️ Lo que haces en un lado, lo haces en el otro.", "↩️ Deshaz las operaciones al revés: primero lo último que se hizo."],
      },
    },
  ],
};
