// Metáfora: unidades grandes y chicas; de grande a chica hay más.
export default {
  id: "base-longitud",
  title: "Medidas de longitud",
  grade: "Base",
  beats: [
    {
      say: "Para medir largos usamos kilómetros, metros, centímetros y milímetros.",
      visual: { type: "lines", lines: ["1 km = 1.000 m", "1 m = 100 cm", "1 cm = 10 mm"] },
    },
    {
      say: "Paso uno: mira si vas de una unidad grande a una chica, o al revés.",
      visual: { type: "cards", items: [{ icon: "⬇️", title: "De grande a chica", text: "Multiplica: hay más" }, { icon: "⬆️", title: "De chica a grande", text: "Divide: hay menos" }] },
    },
    {
      say: "Tres kilómetros a metros: de grande a chica, multiplica por mil. Tres mil metros.",
      visual: { type: "lines", lines: ["3 km → m", "3 · 1.000 = {{3.000 m}}"] },
    },
    {
      say: "Doscientos cincuenta centímetros a metros: de chica a grande, divide por cien. Dos coma cinco metros.",
      visual: { type: "lines", lines: ["250 cm → m", "250 ÷ 100 = {{2,5 m}}"] },
    },
    {
      say: "Ojo: no todas van de diez en diez. Un kilómetro son mil metros, y un metro son cien centímetros.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Revisa cuánto vale cada unidad", text: "km → m: 1.000 · m → cm: 100 · cm → mm: 10" }] },
    },
    {
      say: "Recuerda: de grande a chica, multiplica. De chica a grande, divide. Y revisa por cuánto: mil, cien o diez.",
      visual: {
        type: "list",
        title: "Longitud",
        items: ["⬇️ Grande → chica: multiplica.", "⬆️ Chica → grande: divide.", "📏 km–m: 1.000 · m–cm: 100 · cm–mm: 10."],
      },
    },
  ],
};
