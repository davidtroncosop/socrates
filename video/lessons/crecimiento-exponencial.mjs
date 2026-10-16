// Metáfora: bacterias que se duplican; un remedio que se reduce a la mitad.
const bact = (n, label) => ({ icon: "🦠", count: n, cols: Math.min(n, 12), label });

export default {
  id: "crecimiento-exponencial",
  title: "Crecimiento exponencial",
  grade: "1° Medio",
  beats: [
    {
      say: "Hay tres bacterias, y cada hora se duplican.",
      visual: { type: "tokens", size: 44, groups: [bact(3, "hora 0: 3")] },
    },
    {
      say: "Hora uno: seis. Hora dos: doce. Hora tres: veinticuatro. Cada hora se multiplica por dos.",
      visual: { type: "tokens", size: 30, groups: [bact(6, "hora 1: 6"), bact(12, "hora 2: 12"), bact(24, "hora 3: 24")] },
    },
    {
      say: "Después de cuatro horas: tres por dos, por dos, por dos, por dos. Eso es tres por dos a la cuatro: cuarenta y ocho.",
      visual: { type: "lines", lines: ["3 · 2 · 2 · 2 · 2", "= 3 · 2⁴", "= {{48}}"] },
    },
    {
      say: "Ojo: no se suma dos cada hora. Se multiplica. Por eso crece tan rápido.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Se multiplica, no se suma", text: "3 + 2 + 2 + 2 + 2 = 11, pero hay 48" }] },
    },
    {
      say: "También puede decrecer. Un remedio se reduce a la mitad cada seis horas: ochocientos, cuatrocientos, doscientos, cien.",
      visual: { type: "lines", lines: ["800 → 400 → 200 → 100", "800 · (1/2)³ = {{100}}"] },
    },
    {
      say: "Recuerda: si se multiplica por el mismo número en cada paso, es crecimiento exponencial. El exponente cuenta los pasos.",
      visual: {
        type: "list",
        title: "Crecimiento exponencial",
        items: ["📈 Se multiplica por el mismo número cada vez.", "🔢 El exponente cuenta los pasos.", "📉 Por 1/2: decrece."],
      },
    },
  ],
};
