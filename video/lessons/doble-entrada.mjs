// Metáfora: una tabla que cruza dos preguntas.
export default {
  id: "doble-entrada",
  title: "Tablas de doble entrada",
  grade: "1° Medio",
  beats: [
    {
      say: "Una tabla de doble entrada cruza dos preguntas. Aquí: en qué curso estás, y qué deporte prefieres.",
      visual: { type: "table", headers: ["", "Fútbol", "Básquetbol", "Total"], rows: [["1°A", "8", "7", "?"], ["1°B", "10", "10", "?"], ["Total", "?", "?", "?"]] },
    },
    {
      say: "Cada casilla cuenta a quienes cumplen las dos cosas. En el 1°A, ocho prefieren fútbol.",
      visual: { type: "table", headers: ["", "Fútbol", "Básquetbol", "Total"], rows: [["1°A", "[[8]]", "7", "?"], ["1°B", "10", "10", "?"], ["Total", "?", "?", "?"]] },
    },
    {
      say: "El total de una fila suma hacia el lado: ocho más siete, quince estudiantes en el 1°A.",
      visual: { type: "table", headers: ["", "Fútbol", "Básquetbol", "Total"], rows: [["1°A", "8", "7", "{{15}}"], ["1°B", "10", "10", "{{20}}"], ["Total", "?", "?", "?"]] },
    },
    {
      say: "El total de una columna suma hacia abajo: ocho más diez, dieciocho prefieren fútbol.",
      visual: { type: "table", headers: ["", "Fútbol", "Básquetbol", "Total"], rows: [["1°A", "8", "7", "15"], ["1°B", "10", "10", "20"], ["Total", "{{18}}", "{{17}}", "{{35}}"]] },
    },
    {
      say: "Para comparar cursos de distinto tamaño, usa porcentajes. En el 1°B, diez de veinte prefieren fútbol: el cincuenta por ciento.",
      visual: { type: "lines", lines: ["1°B: 10 de 20", "10 ÷ 20 = {{50 %}}"] },
    },
    {
      say: "Recuerda: cada casilla cumple dos cosas. Las filas suman hacia el lado, las columnas hacia abajo. Y para comparar, usa porcentajes.",
      visual: {
        type: "list",
        title: "Doble entrada",
        items: ["📋 Cada casilla cumple dos cosas.", "➡️ Fila: suma hacia el lado.", "⬇️ Columna: suma hacia abajo.", "💯 Compara con porcentajes."],
      },
    },
  ],
};
