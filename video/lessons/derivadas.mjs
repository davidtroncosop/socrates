// Metáfora: el velocímetro: qué tan rápido cambia algo en un instante.
export default {
  id: "derivadas",
  title: "Derivadas",
  grade: "Electivo",
  beats: [
    {
      say: "La derivada mide qué tan rápido cambia algo en un instante, como el velocímetro de un auto.",
      visual: { type: "cards", items: [{ icon: "🚗", title: "Derivada", text: "Qué tan rápido cambia, en un punto" }] },
    },
    {
      say: "En una curva, la derivada es la pendiente de la recta que la toca en un punto: la recta tangente.",
      visual: { type: "curve", f: { kind: "pow", n: 2 }, window: [-1, 5, -2, 16], tangent: { x: 3, slope: 6 } },
      eq: "f(x) = x²",
    },
    {
      say: "Regla: la derivada de equis a la ene es ene por equis a la ene menos uno. La de equis al cuadrado es dos equis. En tres, la pendiente es seis.",
      visual: { type: "lines", lines: ["(xⁿ)' = n · xⁿ⁻¹", "(x²)' = 2x", "en x = 3: {{6}}"] },
      eq: "",
    },
    {
      say: "La derivada de un número solo es cero, porque no cambia. La de cinco equis más dos es cinco.",
      visual: { type: "lines", lines: ["(5x + 2)' = 5 + 0", "= {{5}}"] },
    },
    {
      say: "Ojo: no confundas la derivada con el valor de la función. En equis al cuadrado, efe de tres es nueve, pero la derivada en tres es seis.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "f(3) ≠ f'(3)", text: "f(3) = 9 · f'(3) = 6" }] },
    },
    {
      say: "Recuerda: la derivada es la pendiente en un punto. Baja el exponente multiplicando y réstale uno. La de un número solo es cero.",
      visual: {
        type: "list",
        title: "Derivadas",
        items: ["📈 Pendiente en un punto.", "⬇️ (xⁿ)' = n · xⁿ⁻¹.", "0️⃣ (número)' = 0."],
      },
    },
  ],
};
