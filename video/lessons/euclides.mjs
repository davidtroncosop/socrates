// Metáfora: la altura parte el triángulo en dos triángulos parecidos.
export default {
  id: "euclides",
  title: "Teorema de Euclides",
  grade: "1° Medio",
  beats: [
    {
      say: "En un triángulo rectángulo, traza la altura desde el ángulo recto hasta la hipotenusa. La hipotenusa queda partida en dos trozos: pe y cu.",
      visual: { type: "cards", items: [{ icon: "📐", title: "Altura sobre la hipotenusa", text: "Parte la hipotenusa en p y q" }] },
    },
    {
      say: "Euclides descubrió que la altura al cuadrado es igual a pe por cu.",
      visual: { type: "lines", lines: ["h² = p · q"] },
    },
    {
      say: "Si los trozos miden cuatro y nueve: altura al cuadrado es treinta y seis, y la altura es seis.",
      visual: { type: "lines", lines: ["h² = 4 · 9 = 36", "h = √36 = {{6}}"] },
    },
    {
      say: "Ojo: los trozos se multiplican, no se suman. Y al final hay que sacar la raíz.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Multiplica y saca la raíz", text: "h = √(p · q)" }] },
    },
    {
      say: "Hay otra regla para los catetos: cada cateto al cuadrado es su trozo por la hipotenusa completa. Si el trozo mide cuatro y la hipotenusa nueve, el cateto al cuadrado es treinta y seis: el cateto mide seis.",
      visual: { type: "lines", lines: ["a² = p · c", "a² = 4 · 9 = 36", "a = {{6}}"] },
    },
    {
      say: "Recuerda: la altura al cuadrado es pe por cu, y cada cateto al cuadrado es su trozo por la hipotenusa.",
      visual: {
        type: "list",
        title: "Teorema de Euclides",
        items: ["📏 h² = p · q.", "📐 a² = p · c.", "√ Al final, saca la raíz."],
      },
    },
  ],
};
