// Metáfora: baldosas — las baldosas de los cuadrados de los catetos alcanzan
// justo para cubrir el cuadrado de la hipotenusa.
const tri = (show, more = {}) => ({ type: "triangle", a: 3, b: 4, c: 5, tiles: true, show, ...more });

export default {
  id: "pitagoras",
  title: "Distancias con Pitágoras",
  grade: "8° Básico",
  beats: [
    {
      say: "Un triángulo rectángulo tiene una esquina recta, como la de una hoja. Los dos lados que forman esa esquina son los catetos, y el lado más largo, enfrente, es la hipotenusa.",
      visual: tri(["tri"]),
    },
    {
      say: "Ahora ponemos un cuadrado de baldosas sobre cada lado. Sobre el cateto de tres: tres por tres, nueve baldosas.",
      visual: tri(["sqA", "tri"]),
    },
    {
      say: "Sobre el cateto de cuatro: dieciséis baldosas.",
      visual: tri(["sqA", "sqB", "tri"]),
    },
    {
      say: "¿Y sobre la hipotenusa? Veinticinco baldosas: justo las nueve más las dieciséis.",
      visual: tri(["sqA", "sqB", "sqC", "tri"]),
    },
    {
      say: "Esa es la idea de Pitágoras: las baldosas de los dos catetos alcanzan exactamente para cubrir el cuadrado de la hipotenusa.",
      eq: "3² + 4² = 5²  →  9 + 16 = 25",
    },
    {
      say: "En general: a al cuadrado, más b al cuadrado, igual a c al cuadrado, donde c es la hipotenusa.",
      eq: "a² + b² = c²",
    },
    {
      say: "Si los catetos miden seis y ocho centímetros: treinta y seis más sesenta y cuatro es cien.",
      visual: { type: "triangle", a: 6, b: 8, c: 10, show: ["tri"], labels: { c: "?" } },
      eq: "6² + 8² = c²  →  36 + 64 = 100",
    },
    {
      say: "Si la hipotenusa al cuadrado es cien, la hipotenusa es la raíz de cien: diez centímetros.",
      visual: { type: "triangle", a: 6, b: 8, c: 10, show: ["tri"], labels: { c: "10" } },
      eq: "c² = 100  →  c = √100 = 10",
    },
    {
      say: "Una escalera de cinco metros, apoyada en un muro, llega a cuatro metros de altura. ¿A qué distancia del muro está el pie? Aquí la escalera es la hipotenusa.",
      visual: { type: "cards", items: [{ icon: "🪜", title: "La escalera", text: "Escalera de 5 m · llega a 4 m de altura · ¿a qué distancia del muro está el pie?" }] },
      eq: "",
    },
    {
      say: "Entonces, dieciséis más b al cuadrado es veinticinco. A b al cuadrado le quedan nueve, así que b es tres metros.",
      visual: { type: "lines", lines: ["4² + b² = 5²", "16 + b² = 25", "b² = 9  →  b = 3 m"] },
    },
    {
      say: "Paso a paso, con catetos seis y ocho. Paso uno: eleva cada cateto al cuadrado. Paso dos: súmalos. Paso tres: saca la raíz.",
      visual: { type: "lines", lines: ["Paso 1: 6² = 36 y 8² = 64", "Paso 2: 36 + 64 = 100", "Paso 3: √100 = {{10}}"] },
      eq: "",
    },
    {
      say: "Recuerda: Pitágoras funciona solo en triángulos rectángulos, y la hipotenusa es siempre el lado más largo, frente a la esquina recta.",
      visual: {
        type: "list",
        title: "Pitágoras",
        items: ["📐 Solo en triángulos rectángulos.", "📏 La hipotenusa es la más larga, frente al ángulo recto.", "🧮 a² + b² = c²"],
      },
    },
  ],
};
