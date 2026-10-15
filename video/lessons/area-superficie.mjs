// Metáfora: el papel para envolver un regalo; la caja desplegada.
export default {
  id: "area-superficie",
  title: "Área de la superficie de cajas",
  grade: "6° Básico",
  beats: [
    {
      say: "¿Cuánto papel necesitas para envolver una caja de regalo? Eso es el área de la superficie.",
      visual: { type: "cards", items: [{ icon: "🎁", title: "Área de la superficie", text: "Cuánto papel cubre todas las caras" }] },
    },
    {
      say: "Un cubo tiene seis caras, todas iguales. Si la arista mide tres centímetros, cada cara tiene tres por tres: nueve cuadraditos.",
      visual: { type: "shape", kind: "rect", base: 3, height: 3, grid: true, labels: { base: "3 cm", height: "3 cm" } },
      eq: "1 cara: 3 · 3 = 9 cm²",
    },
    {
      say: "Seis caras de nueve: cincuenta y cuatro centímetros cuadrados.",
      eq: "6 · 9 = 54 cm²",
    },
    {
      say: "Una caja tiene tres pares de caras iguales: adelante y atrás, arriba y abajo, izquierda y derecha.",
      visual: { type: "lines", lines: ["Caja de 4, 3 y 2 cm", "4 · 3 = 12  (×2)", "4 · 2 = 8  (×2)", "3 · 2 = 6  (×2)"] },
      eq: "",
    },
    {
      say: "Suma una de cada par: doce más ocho más seis, veintiséis. Como cada cara tiene su pareja, multiplica por dos: cincuenta y dos.",
      visual: { type: "lines", lines: ["12 + 8 + 6 = 26", "26 · [[2]] = {{52}} cm²"] },
    },
    {
      say: "No lo confundas con el volumen. El volumen cuenta los cubitos de adentro. El área de la superficie cuenta el papel de afuera.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No es el volumen", text: "Volumen: lo de adentro. Superficie: el papel de afuera" }] },
    },
    {
      say: "Recuerda: una caja tiene seis caras. Calcula cada par, suma y multiplica por dos. En un cubo, una cara por seis.",
      visual: {
        type: "list",
        title: "Área de la superficie",
        items: ["🎁 Es el papel que envuelve la caja.", "📦 6 caras, en 3 pares iguales.", "🧊 Cubo: una cara · 6.", "🚫 No es el volumen."],
      },
    },
  ],
};
