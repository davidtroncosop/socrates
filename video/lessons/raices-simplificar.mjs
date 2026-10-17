// Metáfora: buscar el cuadrado escondido adentro de la raíz.
export default {
  id: "raices-simplificar",
  title: "Simplificar raíces",
  grade: "2° Medio",
  beats: [
    {
      say: "Algunas raíces no son exactas. La raíz de dos es uno coma cuatro uno cuatro, y sigue con decimales para siempre sin repetirse. Se llama número irracional.",
      visual: { type: "lines", lines: ["√2 = 1,41421356…", "infinitos decimales, sin patrón"] },
    },
    {
      say: "Para simplificar una raíz, busca un cuadrado escondido adentro. Cincuenta es veinticinco por dos, y veinticinco es cinco al cuadrado.",
      visual: { type: "lines", lines: ["√50 = √([[25]] · 2)"] },
    },
    {
      say: "La raíz de veinticinco sale como cinco. Queda cinco raíz de dos.",
      visual: { type: "lines", lines: ["√50 = √(25 · 2)", "= √25 · √2", "= {{5√2}}"] },
    },
    {
      say: "Ojo: el veinticinco no sale como veinticinco. Sale su raíz, cinco.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Sale la raíz", text: "√(25 · 2) = 5√2, no 25√2" }] },
    },
    {
      say: "Para multiplicar raíces, junta todo adentro. Raíz de dos por raíz de ocho es raíz de dieciséis: cuatro.",
      visual: { type: "lines", lines: ["√2 · √8", "= √(2 · 8) = √16", "= {{4}}"] },
    },
    {
      say: "Y para sumar, las raíces tienen que ser iguales, como sumar manzanas con manzanas. Raíz de dieciocho más raíz de ocho: tres raíz de dos más dos raíz de dos, cinco raíz de dos.",
      visual: { type: "lines", lines: ["√18 + √8", "= 3√2 + 2√2", "= {{5√2}}"] },
    },
    {
      say: "Recuerda: busca el cuadrado escondido y saca su raíz. Para multiplicar, junta adentro. Para sumar, simplifica primero.",
      visual: {
        type: "list",
        title: "Simplificar raíces",
        items: ["🔍 Busca un cuadrado escondido.", "⬆️ Sale su raíz: √25 = 5.", "✖️ √a · √b = √(a · b).", "➕ Suma solo raíces iguales."],
      },
    },
  ],
};
