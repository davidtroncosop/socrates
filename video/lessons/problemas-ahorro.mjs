// Metáfora: la alcancía que se llena semana a semana.
const piggy = (weeks) => ({ type: "bars", ymax: 30, ystep: 6, bars: Array.from({ length: weeks + 1 }, (_, i) => ({ label: i ? `sem ${i}` : "hoy", values: [6 + 4 * i] })) });

export default {
  id: "problemas-ahorro",
  title: "Problemas: metas de ahorro",
  grade: "6° Básico",
  beats: [
    {
      say: "Quieres unas zapatillas de treinta mil pesos. Tienes seis mil y puedes ahorrar cuatro mil cada semana. ¿Cuántas semanas necesitas?",
      visual: { type: "cards", items: [{ icon: "👟", title: "Meta: $30.000", text: "Tienes $6.000 · ahorras $4.000 por semana" }] },
    },
    {
      say: "Paso uno: calcula cuánto te falta. Treinta mil menos seis mil: veinticuatro mil.",
      visual: { type: "lines", lines: ["Paso 1: 30.000 − 6.000 = {{24.000}}"] },
    },
    {
      say: "Paso dos: divide lo que falta por lo que ahorras cada semana. Veinticuatro mil dividido en cuatro mil: seis semanas.",
      visual: { type: "lines", lines: ["Paso 1: 30.000 − 6.000 = 24.000", "Paso 2: 24.000 ÷ 4.000 = {{6}} semanas"] },
    },
    {
      say: "Así se ve la alcancía: semana a semana llega a los treinta mil.",
      visual: piggy(6),
      eq: "miles de $",
    },
    {
      say: "Paso tres: si la división no es exacta, necesitas una semana más. Si faltan diez mil y ahorras tres mil, con tres semanas juntas nueve mil: falta. Necesitas cuatro.",
      visual: { type: "lines", lines: ["10.000 ÷ 3.000 = 3,3…", "3 semanas: 9.000 ✗", "{{4}} semanas: 12.000 ✓"] },
      eq: "",
    },
    {
      say: "Recuerda: primero lo que falta, después divide por lo que ahorras. Si no es exacto, suma una semana más.",
      visual: {
        type: "list",
        title: "Metas de ahorro",
        items: ["1️⃣ Falta = meta − lo que tengo.", "2️⃣ Semanas = falta ÷ ahorro semanal.", "3️⃣ Si no es exacto, una semana más."],
      },
    },
  ],
};
