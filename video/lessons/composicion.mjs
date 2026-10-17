// Metáfora: dos máquinas en fila.
export default {
  id: "composicion",
  title: "Composición de funciones",
  grade: "Electivo",
  beats: [
    {
      say: "Imagina dos máquinas en fila. La máquina g duplica el número. La máquina f le suma uno.",
      visual: { type: "cards", items: [{ icon: "⚙️", title: "g(x) = 2x", text: "Duplica" }, { icon: "⚙️", title: "f(x) = x + 1", text: "Suma 1" }] },
    },
    {
      say: "Efe de ge de tres se lee de adentro hacia afuera: primero ge, después efe. Ge de tres es seis, y efe de seis es siete.",
      visual: { type: "lines", lines: ["f(g(3))", "g(3) = [[6]]", "f(6) = {{7}}"] },
    },
    {
      say: "Si cambias el orden, cambia el resultado. Ge de efe de tres: efe de tres es cuatro, y ge de cuatro es ocho.",
      visual: { type: "lines", lines: ["g(f(3))", "f(3) = [[4]]", "g(4) = {{8}}"] },
    },
    {
      say: "Ojo: siempre se empieza por la función de adentro, la que está más cerca del número.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "De adentro hacia afuera", text: "f(g(x)): primero g, después f" }] },
    },
    {
      say: "Otro ejemplo: efe de equis igual equis al cuadrado y ge de equis igual equis menos dos. Efe de ge de cinco: ge de cinco es tres, y tres al cuadrado, nueve.",
      visual: { type: "lines", lines: ["g(5) = 5 − 2 = 3", "f(3) = 3² = {{9}}"] },
    },
    {
      say: "Recuerda: componer es pasar el número por una máquina y el resultado por otra. Empieza por la de adentro.",
      visual: {
        type: "list",
        title: "Composición",
        items: ["⚙️ Una máquina después de otra.", "↩️ De adentro hacia afuera.", "🔄 El orden cambia el resultado."],
      },
    },
  ],
};
