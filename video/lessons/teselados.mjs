// Metáfora: las baldosas de un piso.
export default {
  id: "teselados",
  title: "Teselados",
  grade: "6° Básico",
  beats: [
    {
      say: "Un teselado cubre el piso con figuras, sin huecos y sin que se encimen. Como las baldosas.",
      visual: { type: "cards", items: [{ icon: "🧱", title: "Teselado", text: "Sin huecos y sin encimarse" }] },
    },
    {
      say: "Donde se juntan las esquinas, los ángulos tienen que dar una vuelta completa: trescientos sesenta grados.",
      visual: { type: "angles", kind: "cross", a: 90, labels: ["90°", "90°", "90°", "90°"] },
      eq: "4 · 90° = 360°",
    },
    {
      say: "Con cuadrados, cuatro esquinas de noventa completan la vuelta. Con triángulos equiláteros, seis de sesenta. Con hexágonos, tres de ciento veinte.",
      visual: { type: "lines", lines: ["Cuadrados: 4 · 90° = 360°", "Triángulos: 6 · 60° = 360°", "Hexágonos: 3 · 120° = 360°"] },
      eq: "",
    },
    {
      say: "El pentágono regular no sirve. Sus ángulos miden ciento ocho: tres suman trescientos veinticuatro, y quedan treinta y seis grados de hueco.",
      visual: { type: "poly", n: 5 },
      eq: "3 · 108° = 324° → hueco de 36°",
    },
    {
      say: "Los teselados también se arman moviendo una figura: trasladándola, girándola o reflejándola, sin cambiar su forma.",
      visual: { type: "cards", items: [{ icon: "➡️", title: "Trasladar", text: "" }, { icon: "🔄", title: "Rotar", text: "" }, { icon: "🪞", title: "Reflejar", text: "" }] },
      eq: "",
    },
    {
      say: "Recuerda: en cada esquina, los ángulos deben sumar trescientos sesenta. Divide trescientos sesenta por el ángulo para saber cuántas figuras se juntan.",
      visual: {
        type: "list",
        title: "Teselados",
        items: ["⭕ En cada esquina: 360°.", "➗ 360 ÷ ángulo = figuras por esquina.", "🚫 Si no da exacto, queda un hueco."],
      },
    },
  ],
};
