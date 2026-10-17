// Metáfora: desde el borde se ve el arco con la mitad del ángulo.
export default {
  id: "circunferencia-angulos",
  title: "Ángulos y cuerdas en la circunferencia",
  grade: "3° Medio",
  beats: [
    {
      say: "Un ángulo del centro tiene su vértice en el centro de la circunferencia. Este abarca el arco rojo y mide ochenta grados.",
      visual: { type: "inscribed", central: 80, show: ["central"] },
    },
    {
      say: "Un ángulo inscrito tiene su vértice en la circunferencia. Si abarca el mismo arco, mide la mitad: cuarenta grados.",
      visual: { type: "inscribed", central: 80, show: ["central", "inscribed"] },
      eq: "80° ÷ 2 = 40°",
    },
    {
      say: "Si el arco es media circunferencia, el ángulo del centro mide ciento ochenta. El inscrito, la mitad: noventa. Siempre es un ángulo recto.",
      visual: { type: "inscribed", central: 180, show: ["central", "inscribed"] },
      eq: "180° ÷ 2 = 90°",
    },
    {
      say: "Ojo: es al revés de lo que parece. El del centro es el doble del inscrito, no la mitad.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Centro = doble del inscrito", text: "Inscrito = mitad del centro" }] },
      eq: "",
    },
    {
      say: "Si dos cuerdas se cortan, los trozos cumplen una regla: los productos son iguales. Tres por ocho igual cuatro por equis: veinticuatro igual cuatro equis, equis es seis.",
      visual: { type: "lines", lines: ["a · b = c · d", "3 · 8 = 4 · x", "x = {{6}}"] },
    },
    {
      say: "Recuerda: el inscrito mide la mitad del ángulo del centro. Sobre un diámetro, noventa grados. Y con dos cuerdas, los productos de sus trozos son iguales.",
      visual: {
        type: "list",
        title: "Circunferencia",
        items: ["⭕ Inscrito = mitad del centro.", "📐 Sobre un diámetro: 90°.", "✖️ Cuerdas: a · b = c · d."],
      },
    },
  ],
};
