// Metáfora: agrandar un huerto cuadrado (modelo de área). El término central
// son las dos franjas que aparecen al agrandarlo.
const area = (show) => ({ type: "area", show, labels: { a: "x", b: "4", a2: "x²", ab: "4x", b2: "16" } });

export default {
  id: "notables",
  title: "Productos notables y binomios",
  grade: "1° Medio",
  beats: [
    {
      say: "Imagina un huerto cuadrado que mide equis metros por lado. Lo agrandas cuatro metros hacia el lado y cuatro hacia abajo, y sigue siendo cuadrado. ¿Cuánta tierra tienes ahora?",
      visual: { type: "cards", items: [{ icon: "🌱", title: "Agrandar un huerto cuadrado", text: "Lado x, y lo agrandas 4 metros por cada lado" }] },
    },
    {
      say: "El huerto original es un cuadrado de equis por equis: equis al cuadrado.",
      visual: area(1),
      eq: "(x + 4)²",
    },
    {
      say: "Al agrandarlo aparecen dos franjas de equis por cuatro: cuatro equis cada una.",
      visual: area(3),
    },
    {
      say: "Y en la esquina queda un cuadradito de cuatro por cuatro: dieciséis.",
      visual: area(4),
    },
    {
      say: "Sumamos todas las partes: equis al cuadrado, más ocho equis, más dieciséis. Por eso el término del medio es el doble producto: dos por equis por cuatro.",
      eq: "(x + 4)² = x² + [[8x]] + 16",
    },
    {
      say: "Un error muy común es escribir solo equis al cuadrado más dieciséis. En el huerto se ve claro: te faltarían las dos franjas.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Error frecuente", text: "(x + 4)² no es x² + 16: faltan las dos franjas, 8x" }] },
      eq: "",
    },
    {
      say: "En general: el primero al cuadrado, más el doble del primero por el segundo, más el segundo al cuadrado. Con dos equis más uno: cuatro equis al cuadrado, más cuatro equis, más uno.",
      visual: { type: "lines", lines: ["(a + b)² = a² + 2ab + b²", "(2x + 1)² = 4x² + [[4x]] + 1"] },
    },
    {
      say: "Y la suma por su diferencia: equis más siete, por equis menos siete. Los términos del medio, más siete equis y menos siete equis, se cancelan. Queda equis al cuadrado menos cuarenta y nueve.",
      visual: { type: "lines", lines: ["(x + 7)(x − 7)", "= x² ~~− 7x + 7x~~ − 49", "= x² − 49"] },
    },
    {
      say: "Recuerda: en el cuadrado de un binomio no olvides las dos franjas, el doble producto. Y en la suma por su diferencia, los términos del medio se cancelan.",
      visual: {
        type: "list",
        title: "Productos notables",
        items: ["🌱 (a + b)² = a² + 2ab + b²: no olvides las dos franjas.", "✂️ (a + b)(a − b) = a² − b²: los del medio se cancelan."],
      },
    },
  ],
};
