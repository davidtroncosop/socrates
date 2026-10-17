// Metáfora: cocinar para más o menos personas.
export default {
  id: "problemas-recetas",
  title: "Problemas: recetas",
  grade: "7° Básico",
  beats: [
    {
      say: "Una receta de panqueques para cuatro personas lleva dos huevos y trescientos gramos de harina. Hoy cocinas para ocho.",
      visual: { type: "cards", items: [{ icon: "🥞", title: "Para 4 personas", text: "2 huevos · 300 g de harina" }] },
    },
    {
      say: "Paso uno: busca por cuánto se multiplica la cantidad de personas. Ocho es el doble de cuatro: por dos.",
      visual: { type: "lines", lines: ["Paso 1: 4 → 8 es · {{2}}"] },
    },
    {
      say: "Paso dos: multiplica cada ingrediente por ese número. Dos huevos por dos, cuatro. Trescientos gramos por dos, seiscientos.",
      visual: { type: "lines", lines: ["Paso 2:", "huevos: 2 · 2 = {{4}}", "harina: 300 · 2 = {{600 g}}"] },
    },
    {
      say: "Si cocinas para menos, se divide. Para dos personas, la mitad: un huevo y ciento cincuenta gramos.",
      visual: { type: "lines", lines: ["4 → 2 es ÷ 2", "1 huevo · 150 g"] },
    },
    {
      say: "Ojo: no se suma la diferencia. De cuatro a ocho personas no se agregan cuatro huevos: se duplica todo.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Se multiplica, no se suma", text: "Todo cambia en la misma proporción" }] },
    },
    {
      say: "Recuerda: busca por cuánto cambian las personas y aplica ese mismo cambio a cada ingrediente. Si cuesta, calcula primero para una persona.",
      visual: {
        type: "list",
        title: "Recetas",
        items: ["1️⃣ ¿Por cuánto cambian las personas?", "2️⃣ Lo mismo a cada ingrediente.", "1️⃣👤 Si cuesta, calcula para 1 persona."],
      },
    },
  ],
};
