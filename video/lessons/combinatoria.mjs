// Metáfora: cada polera se prueba con cada pantalón.
const outfit = (label) => ({ icon: "👖", count: 2, cols: 2, label });

export default {
  id: "combinatoria",
  title: "Contar todas las combinaciones",
  grade: "8° Básico",
  beats: [
    {
      say: "Tienes tres poleras y dos pantalones. ¿Cuántas tenidas distintas puedes armar?",
      visual: { type: "cards", items: [{ icon: "👕", title: "3 poleras y 2 pantalones", text: "¿Cuántas tenidas distintas hay?" }] },
    },
    {
      say: "La polera roja puede ir con los dos pantalones. La azul, también. Y la verde, también.",
      visual: { type: "tokens", size: 64, groups: [outfit("👕 roja"), outfit("👕 azul"), outfit("👕 verde")] },
      eq: "2 + 2 + 2",
    },
    {
      say: "Son tres grupos de dos: tres por dos, seis tenidas.",
      eq: "3 · 2 = 6",
    },
    {
      say: "Un error común es sumar: tres más dos es cinco. Pero cada polera se combina con cada pantalón, por eso se multiplica.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Se multiplica, no se suma", text: "Cada opción se combina con cada opción" }] },
      eq: "",
    },
    {
      say: "Si además eliges entre dos zapatillas, cada una de las seis tenidas tiene dos opciones más: seis por dos, doce.",
      visual: { type: "lines", lines: ["3 poleras · 2 pantalones · 2 zapatillas", "3 · 2 · 2 = {{12}}"] },
    },
    {
      say: "Un candado de tres ruedas, cada una del cero al nueve, tiene diez opciones por rueda: diez por diez por diez, mil claves.",
      visual: { type: "lines", lines: ["🔒 3 ruedas, 10 números cada una", "10 · 10 · 10 = {{1000}}"] },
    },
    {
      say: "Recuerda: para contar todas las combinaciones, multiplica las opciones de cada elección.",
      visual: {
        type: "list",
        title: "Combinaciones",
        items: ["✖️ Multiplica las opciones de cada elección.", "👕 Cada opción va con cada opción.", "🚫 No se suman."],
      },
    },
  ],
};
