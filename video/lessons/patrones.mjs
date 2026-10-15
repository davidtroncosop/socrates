// Metáfora: mesas que se juntan; cada mesa nueva agrega 2 sillas.
const mesas = (n) => ({ icon: "🪑", count: 2 * n + 2, cols: n + 1, label: `${n} ${n === 1 ? "mesa" : "mesas"}: ${2 * n + 2} sillas` });

export default {
  id: "patrones",
  title: "Patrones y tablas",
  grade: "6° Básico",
  beats: [
    {
      say: "Un patrón sigue una regla. Mira: tres, siete, once, quince. ¿Qué número sigue?",
      visual: { type: "lines", lines: ["3, 7, 11, 15, ?"] },
    },
    {
      say: "Mira cuánto cambia: de tres a siete hay cuatro, de siete a once, cuatro. Siempre se suma cuatro. Sigue el diecinueve.",
      visual: { type: "lines", lines: ["3 → 7 → 11 → 15 → {{19}}", "[[+4]] cada vez"] },
    },
    {
      say: "Ahora, mesas para un cumpleaños. Una mesa tiene cuatro sillas.",
      visual: { type: "tokens", size: 54, groups: [mesas(1)] },
    },
    {
      say: "Si juntas dos mesas, hay seis sillas. Con tres mesas, ocho. Cada mesa nueva suma dos sillas.",
      visual: { type: "tokens", size: 54, groups: [mesas(2), mesas(3)] },
    },
    {
      say: "Una tabla ayuda a ver la regla. Uno da cuatro, dos da seis, tres da ocho. La salida es el doble de la entrada, más dos.",
      visual: { type: "lines", lines: ["1 → 4", "2 → 6", "3 → 8", "Regla: {{2 · mesas + 2}}"] },
    },
    {
      say: "Con la regla puedes saber lo que viene sin dibujar todo. Diez mesas: dos por diez más dos, veintidós sillas.",
      visual: { type: "lines", lines: ["10 mesas", "2 · 10 + 2 = {{22}} sillas"] },
    },
    {
      say: "Recuerda: mira cuánto cambia de un paso al siguiente. Escribe la regla y úsala para encontrar lo que falta.",
      visual: {
        type: "list",
        title: "Patrones",
        items: ["🔎 Mira cuánto cambia cada vez.", "📋 Ordena los datos en una tabla.", "✍️ Escribe la regla y úsala."],
      },
    },
  ],
};
