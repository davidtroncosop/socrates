// Metáfora: ¿a qué número redondo estás más cerca?
const line = (marker, more = {}) => ({ type: "numberline", min: 40, max: 50, marker, ...more });

export default {
  id: "base-redondeo",
  title: "Redondear y estimar",
  grade: "Base",
  beats: [
    {
      say: "Redondear es buscar el número redondo más cercano. ¿El cuarenta y siete está más cerca del cuarenta o del cincuenta?",
      visual: line(47),
    },
    {
      say: "Está más cerca del cincuenta. La regla: mira la unidad. Si es cinco o más, sube. Si es menos de cinco, se queda.",
      visual: line(47),
      eq: "47 → 50",
    },
    {
      say: "Cuarenta y tres: la unidad es tres, menos de cinco. Se queda en cuarenta.",
      visual: line(43),
      eq: "43 → 40",
    },
    {
      say: "Para redondear a la centena, mira la decena. Trescientos sesenta y dos: la decena es seis, cinco o más. Sube a cuatrocientos.",
      visual: { type: "lines", lines: ["3[[6]]2", "6 es 5 o más → {{400}}"] },
      eq: "",
    },
    {
      say: "Estimar es calcular con números redondos para saber si un resultado tiene sentido. Ciento noventa y ocho más trescientos cuatro es casi doscientos más trescientos: quinientos.",
      visual: { type: "lines", lines: ["198 + 304", "≈ 200 + 300", "= {{500}}"] },
    },
    {
      say: "Recuerda: mira la cifra de la derecha. Cinco o más, sube; menos de cinco, se queda. Y estima para revisar tus cuentas.",
      visual: {
        type: "list",
        title: "Redondear y estimar",
        items: ["👀 Mira la cifra de la derecha.", "⬆️ 5 o más: sube.", "⬇️ Menos de 5: se queda.", "🔍 Estima para revisar."],
      },
    },
  ],
};
