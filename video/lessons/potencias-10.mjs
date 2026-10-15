// Metáfora: el exponente cuenta los ceros.
export default {
  id: "potencias-10",
  title: "Potencias de 10",
  grade: "7° Básico",
  beats: [
    {
      say: "Diez al cubo es diez por diez por diez: mil. Fíjate: un uno con tres ceros.",
      visual: { type: "lines", lines: ["10³ = 10 · 10 · 10", "= 1{{000}}"] },
    },
    {
      say: "El número de arriba cuenta los ceros. Diez a la cinco es un uno con cinco ceros: cien mil.",
      visual: { type: "lines", lines: ["10² = 100", "10³ = 1.000", "10⁵ = {{100.000}}"] },
    },
    {
      say: "Ojo: diez al cubo no es treinta. No se multiplica diez por tres: se multiplica diez, tres veces.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "10³ no es 30", text: "Es 10 · 10 · 10 = 1.000" }] },
    },
    {
      say: "Con esto escribimos números grandes en corto. Cuatro mil es cuatro por mil: cuatro por diez al cubo.",
      visual: { type: "lines", lines: ["4.000 = 4 · 1.000", "= 4 · {{10³}}"] },
    },
    {
      say: "Tres millones es tres por un millón. Un millón tiene seis ceros, así que es tres por diez a la seis. Eso se llama notación científica.",
      visual: { type: "lines", lines: ["3.000.000 = 3 · 1.000.000", "= 3 · {{10⁶}}"] },
    },
    {
      say: "Recuerda: el exponente de diez cuenta los ceros. Y para escribir un número grande, separa el número de adelante y cuenta los ceros.",
      visual: {
        type: "list",
        title: "Potencias de 10",
        items: ["🔟 El exponente cuenta los ceros.", "🚫 10³ no es 30.", "✍️ 4.000 = 4 · 10³."],
      },
    },
  ],
};
