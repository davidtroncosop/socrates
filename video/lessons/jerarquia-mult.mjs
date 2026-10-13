// Metáfora: la multiplicación es un paquete cerrado — primero se abre y se
// cuenta lo que trae, después se junta con lo suelto.
const apples = (n, label, cols) => ({ icon: "🍎", count: n, label, cols });

export default {
  id: "jerarquia-mult",
  title: "Primero multiplicar y dividir",
  grade: "5° Básico",
  beats: [
    {
      say: "¿Cuánto es tres más cuatro por dos? Algunos dicen catorce, y otros dicen once. Solo una respuesta es correcta. Veamos por qué.",
      visual: { type: "cards", items: [{ icon: "🤔", title: "¿3 + 4 · 2 es 11 o 14?", text: "Solo una respuesta es correcta" }] },
    },
    {
      say: "Imagina que tienes tres manzanas sueltas, y además cuatro bolsas cerradas. Cada bolsa trae dos manzanas.",
      visual: { type: "tokens", groups: [apples(3, "3 sueltas"), { op: "+" }, { icon: "🛍️", count: 4, label: "4 bolsas de 2", cols: 2 }] },
      eq: "3 + 4 · 2",
    },
    {
      say: "Cuatro por dos es contar lo que traen las bolsas: ocho manzanas. La multiplicación es un paquete cerrado: primero se abre y se cuenta.",
      visual: { type: "tokens", groups: [apples(3, "3 sueltas"), { op: "+" }, apples(8, "4 · 2 = 8", 2)] },
      eq: "3 + [[4 · 2]]",
    },
    {
      say: "Después juntas todo: tres sueltas, más ocho de las bolsas. Once manzanas. La respuesta es once.",
      visual: { type: "tokens", groups: [apples(3, "3"), { op: "+" }, apples(8, "8", 2), { op: "=" }, apples(11, "11")] },
      eq: "3 + 4 · 2 = 3 + 8 = 11",
    },
    {
      say: "Catorce sale de sumar primero tres más cuatro, y después multiplicar por dos. Pero eso sería como si las tres manzanas sueltas también vinieran en bolsas de dos. Es otra situación, y otra cuenta.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "¿Por qué no 14?", text: "(3 + 4) · 2 sería tener 7 bolsas de 2: otra situación" }] },
      eq: "",
    },
    {
      say: "Por eso la regla es: primero las multiplicaciones y divisiones, y después las sumas y restas. Si hay varias del mismo nivel, de izquierda a derecha.",
      visual: { type: "steps", title: "La regla", steps: ["1° × y ÷", "2° + y −"] },
    },
    {
      say: "Con una división pasa lo mismo: veinte menos doce dividido en cuatro. Primero repartimos: doce dividido en cuatro es tres. Después, veinte menos tres: diecisiete.",
      visual: { type: "lines", lines: ["20 − 12 ÷ 4", "= 20 − [[3]]", "= 17"] },
    },
    {
      say: "Si hay dos paquetes, se abren los dos antes de sumar: cinco por tres es quince, y dos por seis es doce. Quince más doce: veintisiete.",
      visual: { type: "lines", lines: ["5 · 3 + 2 · 6", "= [[15]] + [[12]]", "= 27"] },
    },
    {
      say: "Ojo con la última etapa: después de multiplicar, la resta y la suma van de izquierda a derecha. Dieciocho menos diez es ocho, y ocho más cuatro, doce.",
      visual: { type: "lines", lines: ["18 − 2 · 5 + 4", "= 18 − [[10]] + 4", "= 8 + 4", "= 12"] },
    },
    {
      say: "Recuerda: primero se abren los paquetes, las multiplicaciones y divisiones. Después las sumas y restas. Y en el mismo nivel, de izquierda a derecha.",
      visual: {
        type: "list",
        title: "Primero los paquetes",
        items: ["📦 Multiplicaciones y divisiones primero.", "➕ Sumas y restas después.", "➡️ En el mismo nivel, de izquierda a derecha."],
      },
    },
  ],
};
