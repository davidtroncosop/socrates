// Metáfora: una varilla que cabe de esquina a esquina en una caja.
export default {
  id: "pitagoras-3d",
  title: "Pitágoras en tres dimensiones",
  grade: "8° Básico",
  beats: [
    {
      say: "¿Cabe una varilla de trece centímetros en una caja de tres por cuatro por doce? Hay que calcular la diagonal, de una esquina a la opuesta.",
      visual: { type: "cards", items: [{ icon: "📦", title: "Caja de 3 × 4 × 12", text: "¿Cuánto mide la diagonal?" }] },
    },
    {
      say: "Primero, la diagonal del piso. El piso es un rectángulo de tres por cuatro: por Pitágoras, cinco.",
      visual: { type: "triangle", a: 3, b: 4, c: 5, show: ["tri"], labels: { a: "3", b: "4", c: "5" } },
      eq: "√(9 + 16) = 5",
    },
    {
      say: "Después, esa diagonal y la altura forman otro triángulo rectángulo: cinco y doce. La diagonal de la caja es trece.",
      visual: { type: "triangle", a: 5, b: 12, c: 13, show: ["tri"], labels: { a: "5", b: "12", c: "13" } },
      eq: "√(25 + 144) = 13",
    },
    {
      say: "Atajo: suma los tres cuadrados y saca la raíz. Tres al cuadrado más cuatro al cuadrado más doce al cuadrado es ciento sesenta y nueve, y su raíz es trece.",
      visual: { type: "lines", lines: ["d = √(a² + b² + c²)", "= √(9 + 16 + 144)", "= √169 = {{13}}"] },
      eq: "",
    },
    {
      say: "Ojo: no se suman los lados. Tres más cuatro más doce es diecinueve, y eso no es la diagonal.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No se suman los lados", text: "Se suman los cuadrados y se saca la raíz" }] },
    },
    {
      say: "Recuerda: la diagonal de una caja es la raíz de la suma de los tres cuadrados. Es Pitágoras dos veces.",
      visual: {
        type: "list",
        title: "Pitágoras en 3D",
        items: ["📦 Diagonal del piso: Pitágoras.", "📐 Con la altura: Pitágoras otra vez.", "✨ Atajo: √(a² + b² + c²)."],
      },
    },
  ],
};
