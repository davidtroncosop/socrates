// Metáfora: el total de las entradas depende de adultos y niños.
export default {
  id: "funcion-dos-variables",
  title: "Funciones de dos variables",
  grade: "1° Medio",
  beats: [
    {
      say: "En el cine, la entrada de adulto cuesta dos mil pesos y la de niño, mil. El total depende de dos cantidades: adultos y niños.",
      visual: { type: "cards", items: [{ icon: "🎟️", title: "Adulto $2.000 · Niño $1.000", text: "El total depende de dos cantidades" }] },
    },
    {
      say: "Si equis son los adultos e y son los niños, el total es dos mil equis más mil y.",
      eq: "f(x, y) = 2.000x + 1.000y",
      visual: { type: "lines", lines: ["x = adultos", "y = niños"] },
    },
    {
      say: "Dos adultos y tres niños: reemplaza equis por dos e y por tres. Cuatro mil más tres mil: siete mil pesos.",
      visual: { type: "lines", lines: ["f(2, 3) = 2.000 · [[2]] + 1.000 · [[3]]", "= 4.000 + 3.000", "= {{7.000}}"] },
    },
    {
      say: "El orden importa: el primer número es equis, el segundo es y. Tres adultos y dos niños es otra cuenta: ocho mil.",
      visual: { type: "lines", lines: ["f(3, 2) = 6.000 + 2.000 = 8.000", "f(2, 3) ≠ f(3, 2)"] },
    },
    {
      say: "También puedes buscar una cantidad. Si pagaron siete mil con dos adultos, los niños pagaron tres mil: tres niños.",
      visual: { type: "lines", lines: ["4.000 + 1.000y = 7.000", "1.000y = 3.000", "y = {{3}}"] },
      eq: "",
    },
    {
      say: "Recuerda: una función de dos variables usa dos letras. Reemplaza cada una por su número, en orden.",
      visual: {
        type: "list",
        title: "Dos variables",
        items: ["🔤 Dos letras: x e y.", "🔁 Reemplaza cada una por su número.", "📍 Primero x, después y."],
      },
    },
  ],
};
