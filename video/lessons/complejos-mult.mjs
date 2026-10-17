// Metáfora: cada parte con cada parte, y i² se vuelve −1.
export default {
  id: "complejos-mult",
  title: "Multiplicar números complejos",
  grade: "3° Medio",
  beats: [
    {
      say: "Para multiplicar dos más i por tres más i, multiplica cada parte por cada parte, como en álgebra.",
      visual: { type: "lines", lines: ["(2 + i)(3 + i)", "= 2 · 3 + 2 · i + i · 3 + i · i"] },
    },
    {
      say: "Queda seis más dos i más tres i más i al cuadrado.",
      visual: { type: "lines", lines: ["= 6 + 2i + 3i + [[i²]]"] },
    },
    {
      say: "Ahora el truco: i al cuadrado es menos uno. Seis menos uno es cinco, y dos i más tres i es cinco i. El resultado es cinco más cinco i.",
      visual: { type: "lines", lines: ["= 6 + 5i + (−1)", "= {{5 + 5i}}"] },
    },
    {
      say: "Ojo: si olvidas que i al cuadrado es menos uno, te queda seis o siete, y está mal.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "i² = −1", text: "Siempre cámbialo por −1" }] },
    },
    {
      say: "El conjugado de tres más cuatro i es tres menos cuatro i: se cambia el signo de la parte imaginaria. Un complejo por su conjugado da un número real.",
      visual: { type: "lines", lines: ["(1 + 2i)(1 − 2i)", "= 1 − 4i²", "= 1 + 4 = {{5}}"] },
    },
    {
      say: "Recuerda: multiplica cada parte por cada parte, cambia i al cuadrado por menos uno y junta las partes.",
      visual: {
        type: "list",
        title: "Multiplicar complejos",
        items: ["🔁 Cada parte con cada parte.", "i² → −1.", "🪞 Conjugado: cambia el signo de la i."],
      },
    },
  ],
};
