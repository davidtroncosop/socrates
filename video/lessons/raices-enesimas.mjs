// Metáfora: la raíz es la potencia al revés.
export default {
  id: "raices-enesimas",
  title: "Raíces enésimas y exponentes racionales",
  grade: "2° Medio",
  beats: [
    {
      say: "Dos al cubo es ocho: dos por dos por dos. La raíz cúbica va al revés: ¿qué número, multiplicado tres veces, da ocho? Dos.",
      visual: { type: "lines", lines: ["2³ = 2 · 2 · 2 = 8", "∛8 = {{2}}"] },
    },
    {
      say: "Ojo: la raíz cúbica no es dividir por tres. Ocho dividido en tres no es dos.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No es dividir por 3", text: "∛8 = 2, porque 2 · 2 · 2 = 8" }] },
    },
    {
      say: "La raíz cuarta de ochenta y uno es tres, porque tres por tres por tres por tres es ochenta y uno.",
      visual: { type: "lines", lines: ["3 · 3 · 3 · 3 = 81", "∜81 = {{3}}"] },
    },
    {
      say: "Un exponente con fracción es una raíz. Ocho elevado a un tercio es raíz cúbica de ocho: dos.",
      visual: { type: "lines", lines: ["8^(1/3) = ∛8 = {{2}}", "16^(1/2) = √16 = {{4}}"] },
    },
    {
      say: "Veintisiete elevado a dos tercios: el de abajo es la raíz y el de arriba la potencia. Raíz cúbica de veintisiete es tres, y tres al cuadrado, nueve.",
      visual: { type: "lines", lines: ["27^(2/3)", "= (∛27)² = 3²", "= {{9}}"] },
    },
    {
      say: "Recuerda: la raíz enésima busca el número que, multiplicado ene veces, da el resultado. En un exponente fraccionario, abajo va la raíz y arriba la potencia.",
      visual: {
        type: "list",
        title: "Raíces enésimas",
        items: ["🔁 La raíz deshace la potencia.", "🚫 ∛ no es dividir por 3.", "➗ a^(m/n): raíz n, potencia m."],
      },
    },
  ],
};
