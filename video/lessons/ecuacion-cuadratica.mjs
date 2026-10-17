// Metáfora: dos caminos llegan a cero.
export default {
  id: "ecuacion-cuadratica",
  title: "Ecuación cuadrática",
  grade: "2° Medio",
  beats: [
    {
      say: "Equis al cuadrado es cuarenta y nueve. ¿Qué número al cuadrado da cuarenta y nueve? El siete. Pero también menos siete: menos por menos es más.",
      visual: { type: "lines", lines: ["x² = 49", "x = {{7}} o x = {{−7}}"] },
    },
    {
      say: "Una ecuación cuadrática puede tener dos soluciones. En el gráfico, son los dos puntos donde la parábola corta el eje equis.",
      visual: { type: "parabola", a: 1, h: 2.5, k: -0.25, window: [-1, 6, -2, 6], roots: [2, 3] },
      eq: "x² − 5x + 6 = 0",
    },
    {
      say: "Para resolverla, busca dos números que sumen cinco y multipliquen seis: el dos y el tres.",
      visual: { type: "lines", lines: ["suman 5, multiplican 6", "→ 2 y 3", "(x − 2)(x − 3) = 0"] },
    },
    {
      say: "Si una multiplicación da cero, uno de los factores es cero. Equis menos dos es cero, o equis menos tres es cero. Las soluciones son dos y tres.",
      visual: { type: "lines", lines: ["x − 2 = 0 → x = {{2}}", "x − 3 = 0 → x = {{3}}"] },
      eq: "",
    },
    {
      say: "Si no hay número solo, como equis al cuadrado más tres equis, saca equis de factor común: equis por equis más tres. Las soluciones son cero y menos tres.",
      visual: { type: "lines", lines: ["x² + 3x = 0", "x(x + 3) = 0", "x = {{0}} o x = {{−3}}"] },
    },
    {
      say: "Recuerda: una ecuación cuadrática puede tener dos soluciones. Factoriza y haz cero cada factor.",
      visual: {
        type: "list",
        title: "Ecuación cuadrática",
        items: ["✌️ Puede tener dos soluciones.", "🔍 Suman b y multiplican c.", "0️⃣ Cada factor igual a cero."],
      },
    },
  ],
};
