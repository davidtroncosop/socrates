// Metáforas: el ascensor de un edificio con subterráneos (sumar es subir,
// restar es bajar) y la deuda (restar un negativo es quitar una deuda).
const lift = (marker, more = {}) => ({ type: "numberline", vertical: true, min: -14, max: 10, zero: "calle (piso 0)", marker, ...more });

export default {
  id: "enteros",
  title: "Suma y resta de enteros en Z",
  grade: "7° Básico",
  beats: [
    {
      say: "Imagina un edificio con subterráneos. El piso cero es la calle; arriba están los pisos positivos, y abajo los subterráneos: menos uno, menos dos, menos tres.",
      visual: lift(0),
    },
    {
      say: "Partimos en el subterráneo menos ocho.",
      visual: lift(-8),
      eq: "−8",
    },
    {
      say: "Sumar quince es subir quince pisos. Pasamos la calle y llegamos al piso siete. Menos ocho más quince es siete.",
      visual: lift(7, { from: -8, op: "+15" }),
      eq: "−8 + 15 = 7",
    },
    {
      say: "Un atajo: con signos distintos, restas los valores, quince menos ocho es siete, y te quedas con el signo del que tiene más pisos. El quince es positivo, así que da más siete.",
      eq: "15 − 8 = 7  →  [[+]]7",
    },
    {
      say: "Ahora estamos en el menos cuatro.",
      visual: lift(-4),
      eq: "−4",
    },
    {
      say: "Restar nueve es bajar nueve pisos: llegamos al menos trece. Si ya estás abajo y bajas más, quedas todavía más abajo.",
      visual: lift(-13, { from: -4, op: "−9" }),
      eq: "−4 − 9 = −13",
    },
    {
      say: "¿Y restar un número negativo? Piensa en deudas: un número negativo es una deuda. Si alguien te perdona una deuda de catorce mil pesos, quedas mejor, como si te dieran catorce mil.",
      visual: { type: "cards", items: [{ icon: "💳", title: "Restar un negativo", text: "Quitar una deuda te deja mejor: es como sumar" }] },
      eq: "−6 − (−14)",
    },
    {
      say: "Por eso, restar menos catorce es lo mismo que sumar catorce.",
      visual: lift(-6),
      eq: "−6 − (−14) = −6 [[+ 14]]",
    },
    {
      say: "Desde el menos seis subimos catorce pisos: llegamos al ocho.",
      visual: lift(8, { from: -6, op: "+14" }),
      eq: "−6 + 14 = 8",
    },
    {
      say: "Recuerda: sumar es subir, restar es bajar, y restar un negativo es quitar una deuda: también es subir.",
      visual: {
        type: "list",
        title: "En el ascensor",
        items: ["⬆️ Sumar un positivo: subir.", "⬇️ Restar un positivo: bajar.", "💳 Restar un negativo: quitar una deuda, es subir."],
      },
      eq: "",
    },
  ],
};
