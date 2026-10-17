// Metáfora: el área bajo la curva; la distancia que acumula la velocidad.
export default {
  id: "integrales",
  title: "Integrales",
  grade: "Electivo",
  beats: [
    {
      say: "La integral suma lo que se acumula: es el área bajo la curva entre dos valores.",
      visual: { type: "curve", f: { kind: "lin", m: 0, b: 2 }, window: [0, 6, 0, 4], area: [0, 4] },
      eq: "f(x) = 2, de 0 a 4",
    },
    {
      say: "Si la función es constante, el área es un rectángulo. Alto dos por ancho cuatro: ocho.",
      eq: "∫₀⁴ 2 dx = 2 · 4 = 8",
    },
    {
      say: "Si la función es equis, entre cero y cuatro el área es un triángulo: cuatro por cuatro dividido en dos, ocho.",
      visual: { type: "curve", f: { kind: "lin", m: 1, b: 0 }, window: [0, 6, 0, 6], area: [0, 4] },
      eq: "∫₀⁴ x dx = 4 · 4 ÷ 2 = 8",
    },
    {
      say: "Ojo: si es un triángulo, no olvides dividir por dos.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Triángulo: ÷ 2", text: "base · altura ÷ 2" }] },
      eq: "",
    },
    {
      say: "Si la función es una velocidad, el área es la distancia. Un auto a sesenta kilómetros por hora durante tres horas recorre sesenta por tres: ciento ochenta kilómetros.",
      visual: { type: "curve", f: { kind: "lin", m: 0, b: 60 }, window: [0, 4, 0, 80], area: [0, 3] },
      eq: "60 · 3 = 180 km",
    },
    {
      say: "Recuerda: la integral es el área bajo la curva. Rectángulo, alto por ancho. Triángulo, la mitad. Y bajo la velocidad, la distancia.",
      visual: {
        type: "list",
        title: "Integrales",
        items: ["🟦 Área bajo la curva.", "▭ Constante: alto · ancho.", "◺ Recta desde 0: la mitad.", "🚗 Velocidad → distancia."],
      },
      eq: "",
    },
  ],
};
