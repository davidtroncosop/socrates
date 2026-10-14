// Metáfora: dos pistas sobre lo mismo; al compararlas, una incógnita desaparece.
export default {
  id: "sistemas",
  title: "Sistemas de dos ecuaciones",
  grade: "1° Medio",
  beats: [
    {
      say: "Un sistema son dos pistas al mismo tiempo. Con las dos juntas puedes descubrir dos números escondidos.",
      visual: { type: "cards", items: [{ icon: "🧩", title: "Dos pistas a la vez", text: "Dos ecuaciones para descubrir dos incógnitas" }] },
    },
    {
      say: "Pista uno: un completo y un jugo cuestan tres mil pesos. Pista dos: dos completos y un jugo cuestan cinco mil.",
      visual: { type: "lines", lines: ["🌭 + 🧃 = $3.000", "🌭 🌭 + 🧃 = $5.000"] },
    },
    {
      say: "Compara las dos compras. La segunda tiene un completo más, y cuesta dos mil pesos más. Entonces, el completo cuesta dos mil.",
      visual: { type: "lines", lines: ["🌭 + 🧃 = $3.000", "🌭 🌭 + 🧃 = $5.000", "Diferencia: 🌭 = {{$2.000}}"] },
    },
    {
      say: "Y si el completo cuesta dos mil, el jugo cuesta mil, porque juntos son tres mil.",
      visual: { type: "lines", lines: ["🌭 = $2.000", "2.000 + 🧃 = 3.000", "🧃 = {{$1.000}}"] },
    },
    {
      say: "Con letras es igual. x más y es diez, y x menos y es cuatro. Si sumas las dos ecuaciones, la y desaparece: dos x es catorce.",
      visual: { type: "lines", lines: ["x + y = 10", "x − y = 4", "2x = [[14]]"] },
    },
    {
      say: "Entonces x es siete. Reemplazas en la primera: siete más y es diez, así que y es tres. Comprueba en las dos: siete más tres es diez, y siete menos tres es cuatro.",
      visual: { type: "lines", lines: ["x = {{7}}", "7 + y = 10 → y = {{3}}", "7 − 3 = 4 ✓"] },
    },
    {
      say: "Recuerda: suma o resta las ecuaciones para que una letra desaparezca. Encuentra una, reemplaza para la otra, y comprueba en las dos.",
      visual: {
        type: "list",
        title: "Sistemas de ecuaciones",
        items: ["🧩 Suma o resta las ecuaciones: una letra desaparece.", "🔁 Reemplaza para encontrar la otra.", "✅ Comprueba en las dos ecuaciones."],
      },
    },
  ],
};
