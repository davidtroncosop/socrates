// Metáfora: partir un rectángulo grande en dos más fáciles.
export default {
  id: "base-mult-dos-cifras",
  title: "Multiplicar por dos cifras",
  grade: "Base",
  beats: [
    {
      say: "¿Cuánto es veintitrés por catorce? Parece difícil, pero se puede hacer por partes.",
      visual: { type: "lines", lines: ["23 · 14 = ?"] },
    },
    {
      say: "Paso uno: separa el catorce en diez y cuatro. Es como partir un rectángulo grande en dos más fáciles.",
      visual: { type: "lines", lines: ["Paso 1: 14 = [[10]] + [[4]]"] },
    },
    {
      say: "Paso dos: veintitrés por diez es doscientos treinta. Basta agregar un cero.",
      visual: { type: "lines", lines: ["Paso 1: 14 = 10 + 4", "Paso 2: 23 · 10 = {{230}}"] },
    },
    {
      say: "Paso tres: veintitrés por cuatro. El doble de veintitrés es cuarenta y seis, y el doble de eso, noventa y dos.",
      visual: { type: "lines", lines: ["Paso 1: 14 = 10 + 4", "Paso 2: 23 · 10 = 230", "Paso 3: 23 · 4 = {{92}}"] },
    },
    {
      say: "Paso cuatro: suma las dos partes. Doscientos treinta más noventa y dos: trescientos veintidós.",
      visual: { type: "lines", lines: ["Paso 4: 230 + 92", "= {{322}}"] },
      eq: "23 · 14 = 322",
    },
    {
      say: "Ojo: no olvides ninguna parte. Si solo haces veintitrés por cuatro, te falta el veintitrés por diez.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Son dos partes", text: "23 · 10 y 23 · 4, y después se suman" }] },
      eq: "",
    },
    {
      say: "Recuerda: separa el segundo número en decenas y unidades, multiplica cada parte y suma.",
      visual: {
        type: "list",
        title: "Multiplicar por dos cifras",
        items: ["1️⃣ Separa: 14 = 10 + 4.", "2️⃣ Por las decenas.", "3️⃣ Por las unidades.", "4️⃣ Suma las partes."],
      },
    },
  ],
};
