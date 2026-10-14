// Metáfora: una escalera de potencias; cada escalón hacia abajo divide por la base.
export default {
  id: "potencias-negativas",
  title: "Exponente cero y negativo",
  grade: "1° Medio",
  beats: [
    {
      say: "Mira esta escalera de potencias de dos: dos al cubo es ocho, dos al cuadrado es cuatro, dos a la uno es dos.",
      visual: { type: "lines", lines: ["2³ = 8", "2² = 4", "2¹ = 2"] },
    },
    {
      say: "Cada vez que bajas un escalón, el número se divide por dos. Ocho, cuatro, dos.",
      visual: { type: "lines", lines: ["2³ = 8", "2² = 4  ← ÷ 2", "2¹ = 2  ← ÷ 2"] },
    },
    {
      say: "Sigamos bajando. Dos dividido en dos es uno: dos elevado a cero es uno. Cualquier número elevado a cero da uno.",
      visual: { type: "lines", lines: ["2² = 4", "2¹ = 2", "2⁰ = {{1}}  ← ÷ 2"] },
      eq: "",
    },
    {
      say: "Un escalón más: uno dividido en dos es un medio. Dos elevado a menos uno es un medio.",
      visual: { type: "lines", lines: ["2¹ = 2", "2⁰ = 1", "2⁻¹ = {{1/2}}  ← ÷ 2"] },
    },
    {
      say: "Y dos elevado a menos tres es un octavo: uno partido en dos al cubo. El exponente negativo da vuelta la potencia.",
      visual: { type: "lines", lines: ["2⁻¹ = 1/2", "2⁻² = 1/2² = 1/4", "2⁻³ = 1/2³ = {{1/8}}"] },
    },
    {
      say: "Ojo: el exponente negativo no hace negativo al número. Dos elevado a menos tres no es menos ocho, ni menos seis. Es un octavo.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No da un número negativo", text: "2⁻³ no es −8 ni −6. Es 1/8" }] },
      eq: "",
    },
    {
      say: "Recuerda: elevado a cero da uno. Un exponente negativo da una fracción: uno partido en la potencia.",
      visual: {
        type: "list",
        title: "Exponente cero y negativo",
        items: ["🔽 Cada escalón hacia abajo divide por la base.", "1️⃣ Elevado a 0 da 1.", "🔄 Negativo: 1 partido en la potencia.", "🚫 No da un número negativo."],
      },
    },
  ],
};
