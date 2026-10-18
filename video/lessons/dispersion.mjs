// Metáfora: dos cursos con el mismo promedio, uno parejo y otro disperso.
export default {
  id: "dispersion",
  title: "Medidas de dispersión",
  grade: "3° Medio",
  beats: [
    {
      say: "Dos cursos tienen promedio cinco coma cinco. ¿Son iguales? No necesariamente.",
      visual: { type: "bars", ymax: 8, ystep: 2, series: ["Curso A", "Curso B"], bars: [{ label: "Ana", values: [5, 2] }, { label: "Beto", values: [6, 7] }, { label: "Cata", values: [5, 6] }, { label: "Dani", values: [6, 7] }] },
    },
    {
      say: "En el A, las notas están juntas. En el B, están repartidas: hay notas muy bajas y muy altas. La dispersión mide eso.",
      visual: { type: "cards", items: [{ icon: "🎯", title: "Curso A: parejo", text: "Notas cerca del promedio" }, { icon: "💥", title: "Curso B: disperso", text: "Notas lejos del promedio" }] },
    },
    {
      say: "La medida más simple es el rango: el mayor menos el menor. En tres, ocho, cinco, doce y siete, el rango es doce menos tres, nueve.",
      visual: { type: "lines", lines: ["3, 8, 5, 12, 7", "rango = 12 − 3 = {{9}}"] },
    },
    {
      say: "La desviación estándar mira todos los datos. Resta el promedio a cada uno, eleva al cuadrado, promedia: eso es la varianza. Y saca la raíz.",
      visual: { type: "lines", lines: ["2, 4, 4, 4, 5, 5, 7, 9 (promedio 5)", "9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32", "varianza = 32 ÷ 8 = [[4]]", "desviación = √4 = {{2}}"] },
    },
    {
      say: "Menos desviación significa datos más parejos. Con el mismo promedio, el curso con menor desviación es más parejo.",
      visual: { type: "lines", lines: ["desviación pequeña → parejo", "desviación grande → disperso"] },
    },
    {
      say: "Paso a paso, para la desviación estándar de dos, cuatro, seis. Paso uno: calcula el promedio. Paso dos: resta el promedio a cada dato. Paso tres: eleva al cuadrado. Paso cuatro: promedia: es la varianza. Paso cinco: saca la raíz.",
      visual: { type: "lines", lines: ["1: promedio 4  ·  2: −2, 0, 2", "3: 4, 0, 4", "4: 8 ÷ 3 ≈ 2,67", "5: √2,67 ≈ {{1,63}}"] },
      eq: "",
    },
    {
      say: "Recuerda: el promedio dice dónde está el centro y la dispersión, qué tan repartidos están los datos. Rango: mayor menos menor. Desviación: la raíz de la varianza.",
      visual: {
        type: "list",
        title: "Dispersión",
        items: ["📏 Rango: mayor − menor.", "² Varianza: promedio de diferencias al cuadrado.", "√ Desviación: raíz de la varianza."],
      },
    },
  ],
};
