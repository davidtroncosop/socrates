// Metáfora: duplicar y contar los pasos; escalas que saltan de 10 en 10.
export default {
  id: "modelos-exp-log",
  title: "Modelos exponenciales y logarítmicos",
  grade: "3° Medio",
  beats: [
    {
      say: "Una colonia de cien bacterias se duplica cada hora: cien, doscientos, cuatrocientos, ochocientos.",
      visual: { type: "curve", f: { kind: "exp", a: 100, b: 2 }, window: [0, 4, 0, 900], points: [[0, 100, "100"], [1, 200, "200"], [2, 400, "400"], [3, 800, "800"]] },
    },
    {
      say: "El modelo es f de t igual cien por dos elevado a t. El exponente t cuenta las horas.",
      visual: { type: "lines", lines: ["f(t) = 100 · 2ᵗ", "f(3) = 100 · 8 = {{800}}"] },
    },
    {
      say: "¿Y al revés? ¿Cuántas horas para llegar a ochocientos? Ochocientos dividido en cien es ocho, y dos elevado a cuánto da ocho: tres. Eso es un logaritmo.",
      visual: { type: "lines", lines: ["800 ÷ 100 = 8", "2^? = 8", "log₂ 8 = {{3}} horas"] },
    },
    {
      say: "Algunas escalas son logarítmicas. En la de Richter, subir un punto multiplica la amplitud del sismo por diez. De cinco a siete son dos puntos: cien veces.",
      visual: { type: "lines", lines: ["5 → 6: · 10", "6 → 7: · 10", "5 → 7: · {{100}}"] },
    },
    {
      say: "El pH también: es menos el logaritmo de la concentración. Si es diez a la menos tres, el pH es tres.",
      visual: { type: "lines", lines: ["[H⁺] = 10⁻³", "pH = −log(10⁻³) = {{3}}"] },
    },
    {
      say: "Recuerda: el modelo exponencial multiplica por lo mismo en cada paso. El logaritmo cuenta cuántos pasos. Y en escalas logarítmicas, cada punto es diez veces más.",
      visual: {
        type: "list",
        title: "Modelos exponenciales y logarítmicos",
        items: ["📈 f(t) = a · bᵗ: multiplica cada paso.", "🔁 El logaritmo cuenta los pasos.", "🌋 Richter y pH: cada punto, · 10."],
      },
    },
  ],
};
