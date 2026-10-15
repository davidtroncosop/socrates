// Metáfora: una fila ordenada por estatura, partida en cuatro grupos iguales.
export default {
  id: "cuartiles",
  title: "Cuartiles y percentiles",
  grade: "8° Básico",
  beats: [
    {
      say: "Tenemos siete datos. Lo primero es ordenarlos de menor a mayor, como una fila por estatura.",
      visual: { type: "lines", lines: ["2, 4, 5, 7, 8, 9, 11"] },
    },
    {
      say: "El dato del medio es la mediana, o cuartil dos. Aquí es el siete: deja tres datos a cada lado.",
      visual: { type: "lines", lines: ["2, 4, 5, [[7]], 8, 9, 11", "Q2 = 7"] },
    },
    {
      say: "El cuartil uno es la mediana de la mitad de abajo: dos, cuatro, cinco. Es el cuatro.",
      visual: { type: "lines", lines: ["2, [[4]], 5 | 7 | 8, 9, 11", "Q1 = 4"] },
    },
    {
      say: "El cuartil tres es la mediana de la mitad de arriba: ocho, nueve, once. Es el nueve.",
      visual: { type: "lines", lines: ["2, 4, 5 | 7 | 8, [[9]], 11", "Q3 = 9"] },
    },
    {
      say: "Los cuartiles parten la fila en cuatro grupos. Los percentiles la parten en cien. Si estás en el percentil ochenta, superas al ochenta por ciento del grupo.",
      visual: { type: "bar", total: "100 %", parts: 10, filled: 8, partLabel: "10 %", caption: "Percentil 80: superas al 80 %" },
    },
    {
      say: "Recuerda: ordena primero. La mediana es el cuartil dos. Q1 y Q3 son las medianas de cada mitad. Y el percentil dice a cuántos superas.",
      visual: {
        type: "list",
        title: "Cuartiles y percentiles",
        items: ["📏 Ordena de menor a mayor.", "🎯 Q2: la mediana.", "⬇️⬆️ Q1 y Q3: medianas de cada mitad.", "💯 Percentil: a qué % superas."],
      },
    },
  ],
};
