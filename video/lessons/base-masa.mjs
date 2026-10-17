// Metáfora: el paquete de azúcar pesa un kilo.
export default {
  id: "base-masa",
  title: "Medidas de masa",
  grade: "Base",
  beats: [
    {
      say: "Un paquete de azúcar pesa un kilogramo. Un clip pesa cerca de un gramo. Un kilo son mil gramos.",
      visual: { type: "cards", items: [{ icon: "🧂", title: "1 kg", text: "Un paquete de azúcar" }, { icon: "📎", title: "1 g", text: "Un clip" }] },
      eq: "1 kg = 1.000 g",
    },
    {
      say: "Dos kilos a gramos: multiplica por mil. Dos mil gramos.",
      visual: { type: "lines", lines: ["2 kg → g", "2 · 1.000 = {{2.000 g}}"] },
    },
    {
      say: "Medio kilo es la mitad de mil: quinientos gramos. Un cuarto de kilo, doscientos cincuenta.",
      visual: { type: "bar", total: "1 kg = 1.000 g", parts: 4, filled: 2, partLabel: "250 g", caption: "Medio kilo = 500 g" },
    },
    {
      say: "Para sumar o restar, pasa todo a la misma unidad. Tienes tres kilos de harina y usas cuatrocientos gramos: tres mil menos cuatrocientos, dos mil seiscientos gramos.",
      visual: { type: "lines", lines: ["Paso 1: 3 kg = 3.000 g", "Paso 2: 3.000 − 400 = {{2.600 g}}"] },
      eq: "",
    },
    {
      say: "Ojo: no restes tres menos cuatrocientos. Primero pasa los kilos a gramos.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Misma unidad", text: "Pasa todo a gramos antes de calcular" }] },
    },
    {
      say: "Recuerda: un kilo son mil gramos. De kilos a gramos, multiplica por mil; de gramos a kilos, divide. Y calcula siempre en la misma unidad.",
      visual: {
        type: "list",
        title: "Masa",
        items: ["⚖️ 1 kg = 1.000 g.", "⬇️ kg → g: · 1.000.", "⬆️ g → kg: ÷ 1.000.", "🔁 Misma unidad para calcular."],
      },
    },
  ],
};
