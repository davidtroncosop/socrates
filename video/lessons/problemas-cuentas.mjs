// Metáfora: la boleta del restorán y las cuentas de la casa.
export default {
  id: "problemas-cuentas",
  title: "Problemas: cuentas de la casa",
  grade: "7° Básico",
  beats: [
    {
      say: "Cuatro amigos comen en un restorán. La cuenta es veinticuatro mil pesos y quieren dejar diez por ciento de propina.",
      visual: { type: "cards", items: [{ icon: "🧾", title: "Cuenta: $24.000", text: "Propina 10 % · 4 personas" }] },
    },
    {
      say: "Paso uno: la propina. El diez por ciento es dividir por diez: dos mil cuatrocientos.",
      visual: { type: "lines", lines: ["Paso 1: 24.000 ÷ 10 = {{2.400}}"] },
    },
    {
      say: "Paso dos: el total. Veinticuatro mil más dos mil cuatrocientos: veintiséis mil cuatrocientos.",
      visual: { type: "lines", lines: ["Paso 1: propina 2.400", "Paso 2: 24.000 + 2.400 = {{26.400}}"] },
    },
    {
      say: "Paso tres: repartir entre cuatro. Veintiséis mil cuatrocientos dividido en cuatro: seis mil seiscientos cada uno.",
      visual: { type: "lines", lines: ["Paso 3: 26.400 ÷ 4 = {{6.600}}"] },
    },
    {
      say: "En la casa pasa igual. Si la cuenta de la luz es veinte mil y sube un cinco por ciento, el aumento es mil, y la cuenta será veintiún mil.",
      visual: { type: "lines", lines: ["5 % de 20.000 = 1.000", "20.000 + 1.000 = {{21.000}}"] },
    },
    {
      say: "Recuerda: diez por ciento es dividir por diez. Para repartir, divide por las personas. Y para un aumento, calcula el porcentaje y súmalo.",
      visual: {
        type: "list",
        title: "Cuentas de la casa",
        items: ["🧾 10 %: divide por 10.", "👥 Repartir: divide por las personas.", "📈 Aumento: % y súmalo."],
      },
    },
  ],
};
