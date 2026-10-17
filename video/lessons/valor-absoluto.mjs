// Metáfora: la distancia al cero nunca es negativa.
export default {
  id: "valor-absoluto",
  title: "Valor absoluto y funciones por tramos",
  grade: "Electivo",
  beats: [
    {
      say: "El valor absoluto es la distancia al cero. Menos cinco y cinco están a la misma distancia: cinco pasos.",
      visual: { type: "numberline", min: -6, max: 6, arrows: [{ from: 0, to: -5, label: "5", row: 0, color: "#d97706" }, { from: 0, to: 5, label: "5", row: 0 }] },
      eq: "|−5| = |5| = 5",
    },
    {
      say: "Una distancia nunca es negativa. Por eso el valor absoluto siempre da positivo o cero.",
      visual: { type: "cards", items: [{ icon: "📏", title: "Siempre positivo", text: "|−7| = 7" }] },
      eq: "",
    },
    {
      say: "Si hay una operación adentro, primero se calcula. Valor absoluto de tres menos ocho: tres menos ocho es menos cinco, y su valor absoluto es cinco.",
      visual: { type: "lines", lines: ["|3 − 8|", "= |−5|", "= {{5}}"] },
    },
    {
      say: "Equis menos tres, en valor absoluto, forma una ve: baja hasta cero en tres y vuelve a subir.",
      visual: { type: "curve", f: { kind: "abs", c: 3 }, window: [-1, 7, -1, 5], points: [[3, 0, "(3, 0)"], [1, 2, "(1, 2)"]] },
      eq: "f(x) = |x − 3|",
    },
    {
      say: "Una función por tramos usa reglas distintas según el caso. Un estacionamiento cobra mil la primera hora y quinientos cada hora siguiente. Tres horas: mil más dos por quinientos, dos mil.",
      visual: { type: "lines", lines: ["1ª hora: 1.000", "cada hora más: 500", "3 horas: 1.000 + 2 · 500 = {{2.000}}"] },
      eq: "",
    },
    {
      say: "Recuerda: el valor absoluto es una distancia, siempre positiva. Calcula primero lo de adentro. Y en una función por tramos, usa la regla de cada tramo.",
      visual: {
        type: "list",
        title: "Valor absoluto y tramos",
        items: ["📏 |x|: distancia al cero.", "➕ Siempre positivo o cero.", "🧩 Por tramos: cada tramo su regla."],
      },
    },
  ],
};
