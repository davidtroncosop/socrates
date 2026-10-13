// Metáforas: los paquetes de la multiplicación y el ascensor de los enteros
// (sumar es subir, restar es bajar, restar un negativo es quitar una deuda).
const lift = (marker, more = {}) => ({ type: "numberline", vertical: true, min: -14, max: 10, zero: "calle (piso 0)", marker, ...more });

export default {
  id: "jerarquia-enteros",
  title: "Jerarquía con números enteros",
  grade: "7° Básico",
  beats: [
    {
      say: "Con números negativos la jerarquía no cambia: primero paréntesis, después multiplicaciones y divisiones, y al final sumas y restas. Para las sumas y restas usamos el ascensor.",
      visual: { type: "cards", items: [{ icon: "🛗", title: "La misma jerarquía, también bajo cero", text: "Primero los paquetes; después subes o bajas en el ascensor" }] },
    },
    {
      say: "Calculemos menos ocho, más dos por seis. Primero el paquete: dos por seis, doce. Partimos en el subterráneo menos ocho.",
      visual: lift(-8),
      eq: "−8 + [[2 · 6]] = −8 + 12",
    },
    {
      say: "Ahora el ascensor: desde el menos ocho subimos doce pisos. Llegamos al cuatro.",
      visual: lift(4, { from: -8, op: "+12" }),
      eq: "−8 + 12 = 4",
    },
    {
      say: "Si hubieras sumado primero, menos ocho más dos, y después por seis, te daría menos treinta y seis. Muy lejos: por eso el orden importa.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Si sumas primero", text: "(−8 + 2) · 6 = −36: otra cuenta distinta" }] },
      eq: "",
    },
    {
      say: "Ahora, diez menos tres por cinco. Primero el paquete: tres por cinco, quince. Partimos en el piso diez.",
      visual: lift(10),
      eq: "10 − [[3 · 5]] = 10 − 15",
    },
    {
      say: "Desde el piso diez bajamos quince: pasamos la calle y llegamos al subterráneo menos cinco.",
      visual: lift(-5, { from: 10, op: "−15" }),
      eq: "10 − 15 = −5",
    },
    {
      say: "Con paréntesis: menos seis, menos, cuatro menos nueve. Primero la caja: cuatro menos nueve, menos cinco. Restar menos cinco es quitar una deuda: es sumar cinco. Menos seis más cinco: menos uno.",
      visual: { type: "lines", lines: ["−6 − (4 − 9)", "= −6 − ([[−5]])", "= −6 + 5", "= −1"] },
      eq: "",
    },
    {
      say: "Y uno completo. Paréntesis: menos tres más siete, cuatro. Multiplicación: cuatro por dos, ocho. Al final la resta: ocho menos diez, menos dos.",
      visual: { type: "lines", lines: ["(−3 + 7) · 2 − 10", "= [[4]] · 2 − 10", "= [[8]] − 10", "= −2"] },
    },
    {
      say: "Recuerda: la jerarquía es la misma con negativos. Primero los paquetes, y después el ascensor: sumar es subir, restar es bajar.",
      visual: {
        type: "list",
        title: "Jerarquía con enteros",
        items: ["🎁 Paréntesis primero.", "📦 Después multiplicaciones y divisiones.", "🛗 Al final sumas y restas: sube o baja en el ascensor."],
      },
    },
  ],
};
