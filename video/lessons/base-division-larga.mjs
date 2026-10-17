// Metáfora: repartir billetes de cien, de diez y monedas de uno.
export default {
  id: "base-division-larga",
  title: "División larga paso a paso",
  grade: "Base",
  beats: [
    {
      say: "Hay que repartir ochocientos cincuenta y dos pesos entre cuatro amigos. Imagina ocho billetes de cien, cinco monedas de diez y dos de uno.",
      visual: { type: "lines", lines: ["852 ÷ 4", "8 de cien · 5 de diez · 2 de uno"] },
    },
    {
      say: "Paso uno: reparte los billetes de cien. Ocho dividido en cuatro: dos para cada uno.",
      visual: { type: "lines", lines: ["Paso 1: 8 ÷ 4 = {{2}}"] },
    },
    {
      say: "Paso dos: reparte las monedas de diez. Cinco dividido en cuatro: una para cada uno, y sobra una moneda de diez.",
      visual: { type: "lines", lines: ["Paso 1: 8 ÷ 4 = 2", "Paso 2: 5 ÷ 4 = {{1}}, sobra [[1]]"] },
    },
    {
      say: "Paso tres: la moneda de diez que sobró se cambia por diez de uno, y se junta con las dos que había: doce. Doce dividido en cuatro: tres.",
      visual: { type: "lines", lines: ["Paso 1: 8 ÷ 4 = 2", "Paso 2: 5 ÷ 4 = 1, sobra 1", "Paso 3: 12 ÷ 4 = {{3}}"] },
    },
    {
      say: "Cada uno recibe dos, uno, tres: doscientos trece. Comprueba: doscientos trece por cuatro es ochocientos cincuenta y dos.",
      visual: { type: "lines", lines: ["852 ÷ 4 = {{213}}", "213 · 4 = 852 ✓"] },
    },
    {
      say: "Ojo: si una cifra no alcanza para repartir, se escribe un cero en el resultado. Quinientos veinticinco dividido en cinco es ciento cinco.",
      visual: { type: "lines", lines: ["525 ÷ 5", "5 ÷ 5 = 1 · 2 ÷ 5 = [[0]] · 25 ÷ 5 = 5", "= {{105}}"] },
    },
    {
      say: "Recuerda: reparte de izquierda a derecha. Lo que sobra se junta con la cifra siguiente. Si no alcanza, escribe cero. Y comprueba multiplicando.",
      visual: {
        type: "list",
        title: "División larga",
        items: ["⬅️ De izquierda a derecha.", "➡️ Lo que sobra pasa a la cifra siguiente.", "0️⃣ Si no alcanza, escribe 0.", "✅ Comprueba multiplicando."],
      },
    },
  ],
};
