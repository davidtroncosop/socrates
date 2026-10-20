// Reel (~1 minuto): la metáfora de los zapatos y los calcetines (deshacer en
// orden inverso) con un solo ejercicio, 2x + 3 = 15.
const bal = (x, left, right, more = {}) => ({ type: "balance", x, left, right, ...more });

export default {
  id: "reel-ecuaciones-zapatos",
  title: "Ecuaciones: zapatos y calcetines",
  grade: "7° Básico",
  beats: [
    {
      say: "Piensa en cómo te vistes en la mañana: primero los calcetines, después los zapatos.",
      visual: { type: "steps", title: "Para vestirte", steps: ["🧦 Calcetines", "👟 Zapatos"] },
    },
    {
      say: "Para sacártelos, lo haces al revés: primero los zapatos, después los calcetines. Nadie se saca los calcetines con los zapatos puestos.",
      visual: { type: "steps", title: "Para sacártelos: al revés", steps: ["👟 Zapatos", "🧦 Calcetines"] },
    },
    {
      say: "Con la equis pasa lo mismo. Mira esta balanza: dos equis más tres, igual a quince.",
      visual: bal(6, { bags: 2, balls: 3 }, { balls: 15 }),
      eq: "2x + 3 = 15",
    },
    {
      say: "A la equis primero la multiplicaron por dos: esos son sus calcetines. Después le sumaron tres: esos son sus zapatos.",
      visual: { type: "steps", title: "Así se vistió la x", steps: ["🧦 × 2", "👟 + 3"] },
    },
    {
      say: "Para despejarla, primero los zapatos: quita tres bolitas de cada lado.",
      visual: bal(6, { bags: 2 }, { balls: 12 }),
      eq: "2x + 3 [[− 3]] = 15 [[− 3]]",
    },
    {
      say: "Después los calcetines: reparte las doce bolitas en dos grupos iguales. A cada bolsa le tocan seis.",
      visual: bal(6, { bags: 2 }, { balls: 12 }, { groups: true }),
      eq: "2x = 12  →  x = 12 [[÷ 2]]",
    },
    {
      say: "Equis es igual a seis. Para despejar, deshaz al revés, como cuando te sacas los zapatos.",
      visual: bal(6, { bags: 2 }, { balls: 12 }, { groups: true, reveal: true }),
      eq: "x = 6",
    },
  ],
};
