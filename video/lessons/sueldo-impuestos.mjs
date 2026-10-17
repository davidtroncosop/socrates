// Metáfora: del sueldo pactado a lo que llega a la cuenta.
export default {
  id: "sueldo-impuestos",
  title: "Sueldo e impuestos",
  grade: "4° Medio",
  beats: [
    {
      say: "En un trabajo te ofrecen un sueldo bruto de quinientos mil pesos. Pero eso no es lo que llega a tu cuenta.",
      visual: { type: "cards", items: [{ icon: "💼", title: "Sueldo bruto: $500.000", text: "Lo pactado, antes de descuentos" }] },
    },
    {
      say: "Se descuenta la salud, el siete por ciento: treinta y cinco mil. Y la AFP, cerca del diez por ciento más una comisión.",
      visual: { type: "lines", lines: ["Salud 7 %: − 35.000", "AFP ≈ 11 %: − 55.000"] },
    },
    {
      say: "Lo que queda es el sueldo líquido. Si los descuentos suman dieciocho por ciento, recibes el ochenta y dos por ciento: cuatrocientos diez mil.",
      visual: { type: "lines", lines: ["500.000 · 0,82", "= {{410.000}} líquido"] },
    },
    {
      say: "Al comprar pagas IVA, el diecinueve por ciento del precio neto. Un producto de diez mil neto paga mil novecientos de IVA.",
      visual: { type: "lines", lines: ["Neto: 10.000", "IVA 19 %: 1.900", "Total: {{11.900}}"] },
    },
    {
      say: "Atajo: el precio con IVA es el neto por uno coma diecinueve.",
      eq: "10.000 · 1,19 = 11.900",
    },
    {
      say: "Recuerda: del sueldo bruto se descuentan salud y AFP, y queda el líquido. En las compras, el IVA es el diecinueve por ciento del neto.",
      visual: {
        type: "list",
        title: "Sueldo e impuestos",
        items: ["💼 Bruto − descuentos = líquido.", "🏥 Salud: 7 %.", "🧾 IVA: 19 %. Con IVA: · 1,19."],
      },
      eq: "",
    },
  ],
};
