// Metáfora: el reloj va de 60 en 60, no de 100 en 100.
export default {
  id: "base-tiempo",
  title: "Medidas de tiempo",
  grade: "Base",
  beats: [
    {
      say: "Una hora tiene sesenta minutos, y un minuto, sesenta segundos. El tiempo va de sesenta en sesenta, no de cien en cien.",
      visual: { type: "lines", lines: ["1 hora = 60 minutos", "1 minuto = 60 segundos"] },
    },
    {
      say: "Dos horas son dos por sesenta: ciento veinte minutos.",
      visual: { type: "lines", lines: ["2 · 60 = {{120}} minutos"] },
    },
    {
      say: "¿Cuánto dura una clase de nueve cuarenta a diez quince? Paso uno: cuenta hasta la hora en punto. De nueve cuarenta a diez son veinte minutos.",
      visual: { type: "lines", lines: ["Paso 1: 9:40 → 10:00 = [[20]] min"] },
    },
    {
      say: "Paso dos: cuenta lo que sigue. De diez a diez quince, quince minutos. Paso tres: suma. Treinta y cinco minutos.",
      visual: { type: "lines", lines: ["Paso 1: 9:40 → 10:00 = 20 min", "Paso 2: 10:00 → 10:15 = 15 min", "Paso 3: 20 + 15 = {{35}} min"] },
    },
    {
      say: "En formato de veinticuatro horas, después del mediodía se suma doce. Las tres de la tarde son las quince horas.",
      visual: { type: "lines", lines: ["3 de la tarde", "3 + 12 = {{15:00}}"] },
    },
    {
      say: "Recuerda: el tiempo va de sesenta en sesenta. Para una duración, cuenta hasta la hora en punto y después lo que sigue.",
      visual: {
        type: "list",
        title: "Tiempo",
        items: ["⏰ 1 h = 60 min.", "1️⃣ Cuenta hasta la hora en punto.", "2️⃣ Suma lo que sigue.", "🕒 Tarde: + 12 en formato 24 h."],
      },
    },
  ],
};
