// Metáfora: la raíz cuadrada es el lado de un cuadrado de baldosas.
export default {
  id: "raices",
  title: "Raíces cuadradas",
  grade: "8° Básico",
  beats: [
    {
      say: "La raíz cuadrada pregunta: ¿qué número, multiplicado por sí mismo, da este número?",
      visual: { type: "cards", items: [{ icon: "🟦", title: "Raíz cuadrada", text: "¿Qué número por sí mismo da este?" }] },
    },
    {
      say: "Imagina un patio cuadrado con cuarenta y nueve baldosas. ¿Cuántas baldosas tiene cada lado?",
      visual: { type: "shape", kind: "rect", base: 7, height: 7, grid: true },
      eq: "49 baldosas",
    },
    {
      say: "Cada lado tiene siete, porque siete por siete es cuarenta y nueve. Por eso, la raíz cuadrada de cuarenta y nueve es siete.",
      visual: { type: "shape", kind: "rect", base: 7, height: 7, grid: true, labels: { base: "7", height: "7" } },
      eq: "√49 = 7",
    },
    {
      say: "Ojo: la raíz no es dividir por dos. La mitad de cuarenta y nueve es veinticuatro coma cinco, y eso no sirve.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No es la mitad", text: "√49 no es 49 ÷ 2. Es 7, porque 7 · 7 = 49" }] },
      eq: "",
    },
    {
      say: "¿Y la raíz de cincuenta? No es exacta. Siete por siete es cuarenta y nueve, y ocho por ocho es sesenta y cuatro. Cincuenta queda entre los dos.",
      visual: { type: "lines", lines: ["7 · 7 = 49", "√50 = ?", "8 · 8 = 64"] },
    },
    {
      say: "Cincuenta está mucho más cerca de cuarenta y nueve. Entonces la raíz de cincuenta es un poquito más que siete.",
      visual: { type: "lines", lines: ["7 · 7 = [[49]]", "√50 es casi {{7}}", "8 · 8 = 64"] },
    },
    {
      say: "Recuerda: la raíz cuadrada es el lado del cuadrado. Busca un número que, por sí mismo, dé el número. Y no es la mitad.",
      visual: {
        type: "list",
        title: "Raíces cuadradas",
        items: ["🟦 Es el lado del cuadrado.", "✖️ Busca un número que por sí mismo dé el número.", "🚫 No es dividir por 2."],
      },
    },
  ],
};
