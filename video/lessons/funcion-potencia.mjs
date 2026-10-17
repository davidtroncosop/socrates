// Metáfora: el espejo de los exponentes pares.
export default {
  id: "funcion-potencia",
  title: "Función potencia",
  grade: "4° Medio",
  beats: [
    {
      say: "Una función potencia es equis elevado a un número. Equis al cuadrado tiene forma de U.",
      visual: { type: "curve", f: { kind: "pow", n: 2 }, window: [-3, 3, -1, 9], points: [[-2, 4, "(−2, 4)"], [2, 4, "(2, 4)"]] },
      eq: "f(x) = x²",
    },
    {
      say: "Con exponente par, menos dos y dos dan lo mismo: cuatro. La curva es simétrica, como un espejo en el eje y.",
      eq: "(−2)² = 2² = 4",
    },
    {
      say: "Con exponente impar, como equis al cubo, los negativos quedan negativos: menos dos al cubo es menos ocho.",
      visual: { type: "curve", f: { kind: "pow", n: 3 }, window: [-2.5, 2.5, -10, 10], points: [[2, 8, "(2, 8)"], [-2, -8, "(−2, −8)"]] },
      eq: "(−2)³ = −8",
    },
    {
      say: "Con exponente negativo, como ocho dividido en equis, la curva se acerca a los ejes sin tocarlos nunca.",
      visual: { type: "curve", f: { kind: "inv", k: 8 }, window: [-8, 8, -8, 8], points: [[2, 4, "(2, 4)"], [4, 2, "(4, 2)"]] },
      eq: "f(x) = 8/x",
    },
    {
      say: "Para calcular, primero la potencia. Dos por equis al cubo, con equis dos: dos al cubo es ocho, por dos, dieciséis.",
      visual: { type: "lines", lines: ["f(x) = 2x³", "f(2) = 2 · [[8]] = {{16}}"] },
      eq: "",
    },
    {
      say: "Recuerda: con exponente par, la curva es simétrica. Con impar, conserva el signo. Con negativo, se acerca a los ejes.",
      visual: {
        type: "list",
        title: "Función potencia",
        items: ["🪞 Par: simétrica, (−x)ⁿ = xⁿ.", "➖ Impar: conserva el signo.", "↘️ Negativo: se acerca a los ejes."],
      },
    },
  ],
};
