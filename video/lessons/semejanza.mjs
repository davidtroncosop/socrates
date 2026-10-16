// Metáfora: la foto ampliada; el plano de una casa.
const tri = (k) => [[0, 0], [3 * k, 0], [0, 2 * k]];

export default {
  id: "semejanza",
  title: "Semejanza y escalas",
  grade: "1° Medio",
  beats: [
    {
      say: "Dos figuras son semejantes si tienen la misma forma, aunque distinto tamaño. Como una foto y su ampliación.",
      visual: { type: "plane", max: 7, polygons: [tri(1), tri(2)] },
    },
    {
      say: "Todos los lados se multiplican por el mismo número. Aquí el triángulo grande mide el doble: tres pasa a seis y dos pasa a cuatro.",
      visual: { type: "lines", lines: ["3 → 6", "2 → 4", "todo · {{2}}"] },
    },
    {
      say: "Ojo: no se suma lo mismo. Si a tres le sumas tres, a dos no se le suma tres. Se multiplica.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Se multiplica, no se suma", text: "Todos los lados por el mismo número" }] },
    },
    {
      say: "Los planos usan escalas. Una escala uno es a cien dice que un centímetro en el plano son cien centímetros reales: un metro.",
      visual: { type: "lines", lines: ["Escala 1 : 100", "1 cm del plano = 100 cm = {{1 m}}"] },
    },
    {
      say: "Una pieza que mide cuatro centímetros en el plano mide cuatrocientos centímetros reales: cuatro metros.",
      visual: { type: "lines", lines: ["4 cm · 100 = 400 cm", "= {{4 m}}"] },
    },
    {
      say: "Recuerda: en figuras semejantes todo se multiplica por el mismo número. En una escala, multiplica y después pasa a la unidad que te piden.",
      visual: {
        type: "list",
        title: "Semejanza y escalas",
        items: ["🖼️ Misma forma, otro tamaño.", "✖️ Todo por el mismo número.", "🗺️ Escala 1 : 100: 1 cm = 1 m."],
      },
    },
  ],
};
