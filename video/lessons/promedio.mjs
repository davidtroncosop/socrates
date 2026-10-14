// Metáforas: el promedio empareja torres de monedas; la mediana es la del
// medio; la moda es la que está de moda.
const tower = (count) => ({ icon: "🪙", count, cols: 1, label: String(count) });

export default {
  id: "promedio",
  title: "Promedio, mediana y moda",
  grade: "7° Básico",
  beats: [
    {
      say: "Cuando tienes muchos datos, como tus notas, hay tres formas de resumirlos: el promedio, la mediana y la moda.",
      visual: { type: "cards", items: [{ icon: "📊", title: "Tres formas de resumir datos", text: "Promedio, mediana y moda" }] },
    },
    {
      say: "Imagina tres torres de monedas: una de cuatro, una de seis y una de ocho.",
      visual: { type: "tokens", size: 44, groups: [tower(4), tower(6), tower(8)] },
      eq: "4, 6 y 8",
    },
    {
      say: "El promedio es emparejar las torres: pasamos monedas de la más alta a la más baja hasta que todas queden iguales. Quedan de seis. En números: sumas todo, dieciocho, y divides por tres.",
      visual: { type: "tokens", size: 44, groups: [tower(6), tower(6), tower(6)] },
      eq: "(4 + 6 + 8) ÷ 3 = 6",
    },
    {
      say: "La mediana es el dato del medio. Pero primero hay que ordenarlos de menor a mayor: dos, cuatro, cinco, siete, nueve. El del medio es cinco.",
      visual: { type: "lines", lines: ["7, 2, 9, 4, 5", "Ordenados: 2, 4, [[5]], 7, 9", "Mediana = 5"] },
      eq: "",
    },
    {
      say: "La moda es el dato que más se repite: el que está de moda. Aquí el tres aparece tres veces.",
      visual: { type: "lines", lines: ["3, 5, 3, 6, 3, 5", "El 3 aparece [[3 veces]]", "Moda = 3"] },
    },
    {
      say: "Para tu promedio de notas: suma todas, que dan veinte, y divide por cuántas son, cuatro. Tu promedio es cinco coma cero.",
      visual: { type: "lines", lines: ["Notas: 5,0; 6,0; 4,0; 5,0", "Suma: 20", "20 ÷ [[4]] = 5,0"] },
    },
    {
      say: "Recuerda: el promedio suma y divide por cuántos son. La mediana es la del medio, después de ordenar. Y la moda es la que más se repite.",
      visual: {
        type: "list",
        title: "Promedio, mediana y moda",
        items: ["⚖️ Promedio: suma y divide por cuántos son.", "🎯 Mediana: la del medio, después de ordenar.", "🔁 Moda: la que más se repite."],
      },
    },
  ],
};
