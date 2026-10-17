// Metáfora: el logaritmo cuenta cuántas veces se multiplica.
export default {
  id: "logaritmos",
  title: "Logaritmos",
  grade: "2° Medio",
  beats: [
    {
      say: "Dos por dos por dos es ocho. El logaritmo hace la pregunta al revés: ¿cuántas veces multiplico el dos para llegar a ocho?",
      visual: { type: "lines", lines: ["2 · 2 · 2 = 8", "¿cuántas veces?"] },
    },
    {
      say: "Tres veces. Se escribe logaritmo en base dos de ocho, igual a tres.",
      visual: { type: "lines", lines: ["2³ = 8", "log₂ 8 = {{3}}"] },
    },
    {
      say: "Potencia, raíz y logaritmo hablan de lo mismo. Dos al cubo es ocho; raíz cúbica de ocho es dos; logaritmo en base dos de ocho es tres.",
      visual: { type: "lines", lines: ["2³ = 8", "∛8 = 2", "log₂ 8 = 3"] },
    },
    {
      say: "Si no se escribe la base, es diez. Logaritmo de mil es tres, porque mil tiene tres ceros: diez al cubo.",
      visual: { type: "lines", lines: ["log 1.000 = {{3}}", "10³ = 1.000"] },
    },
    {
      say: "Y el logaritmo de uno siempre es cero, porque cualquier número elevado a cero da uno.",
      visual: { type: "lines", lines: ["5⁰ = 1", "log₅ 1 = {{0}}"] },
    },
    {
      say: "Ojo: el logaritmo no divide. Logaritmo en base dos de ocho no es cuatro. Cuenta las veces que multiplicas.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No es dividir", text: "log₂ 8 = 3 (no 8 ÷ 2 = 4)" }] },
    },
    {
      say: "Recuerda: el logaritmo es el exponente. Pregunta cuántas veces se multiplica la base para llegar al número.",
      visual: {
        type: "list",
        title: "Logaritmos",
        items: ["🔁 log_b n: ¿cuántas veces multiplico b?", "🔟 Sin base: base 10.", "1️⃣ log de 1 = 0."],
      },
    },
  ],
};
