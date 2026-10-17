// Metáfora: ponerle un número a cada resultado del azar.
export default {
  id: "variable-aleatoria",
  title: "Variable aleatoria",
  grade: "2° Medio",
  beats: [
    {
      say: "Lanzas dos monedas. Los resultados posibles son cara cara, cara sello, sello cara y sello sello.",
      visual: { type: "lines", lines: ["CC   CS   SC   SS"] },
    },
    {
      say: "Una variable aleatoria le pone un número a cada resultado. Equis será el número de caras.",
      visual: { type: "table", headers: ["Resultado", "CC", "CS", "SC", "SS"], rows: [["X (caras)", "2", "1", "1", "0"]] },
    },
    {
      say: "Equis vale uno en dos casos de cuatro: la probabilidad es un medio. Vale dos o cero en un solo caso: un cuarto cada uno.",
      visual: { type: "table", headers: ["X", "0", "1", "2"], rows: [["P(X)", "1/4", "{{1/2}}", "1/4"]] },
    },
    {
      say: "Ojo: los valores no son igual de probables. Equis igual uno pasa más, porque hay dos maneras de lograrlo.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Cuenta las maneras", text: "X = 1 pasa de 2 maneras: CS y SC" }] },
    },
    {
      say: "El valor esperado es el promedio a la larga. En un dado: uno más dos más tres más cuatro más cinco más seis, veintiuno, dividido en seis: tres coma cinco.",
      visual: { type: "lines", lines: ["(1 + 2 + 3 + 4 + 5 + 6) ÷ 6", "= 21 ÷ 6 = {{3,5}}"] },
    },
    {
      say: "Recuerda: la variable aleatoria pone un número a cada resultado. Su probabilidad se calcula contando los casos. Y el valor esperado es el promedio a la larga.",
      visual: {
        type: "list",
        title: "Variable aleatoria",
        items: ["🔢 Un número para cada resultado.", "✋ Cuenta los casos de cada valor.", "📊 Esperado: el promedio a la larga."],
      },
    },
  ],
};
