// Metáfora: el canje — 10 unidades se cambian por 1 decena (llevar) y 1
// decena por 10 unidades (pedir prestado).
const H = ["Decenas", "Unidades"];

export default {
  id: "base-suma-resta",
  title: "Sumar y restar con canje",
  grade: "Base",
  beats: [
    {
      say: "Para sumar y restar usamos el canje: diez monedas chicas se cambian por una grande, y una grande por diez chicas.",
      visual: { type: "cards", items: [{ icon: "🔁", title: "El canje", text: "10 monedas chicas = 1 grande" }] },
    },
    {
      say: "Sumemos cuarenta y siete más treinta y ocho. Se suma cada lugar por separado. Primero las unidades: siete más ocho.",
      visual: { type: "table", headers: H, rows: [["4", "7"], ["3", "8"]] },
      eq: "47 + 38",
    },
    {
      say: "Siete más ocho es quince. Pero en el lugar de las unidades no caben quince.",
      visual: { type: "table", headers: H, rows: [["4", "7"], ["3", "8"], ["", "{{15}}"]] },
    },
    {
      say: "Hacemos el canje: diez unidades se cambian por una decena. Dejamos el cinco y llevamos una decena.",
      visual: { type: "tokens", size: 76, groups: [{ tile: "1", count: 10, label: "10 unidades", cols: 5 }, { op: "=" }, { tile: "10", count: 1, label: "1 decena", cols: 1 }] },
    },
    {
      say: "Ahora las decenas: cuatro más tres, más la que llevábamos, es ocho. El resultado es ochenta y cinco.",
      visual: { type: "table", headers: H, rows: [["4 [[+1]]", "7"], ["3", "8"], ["{{8}}", "{{5}}"]] },
      eq: "47 + 38 = 85",
    },
    {
      say: "Ahora una resta: cincuenta y dos menos veintisiete. En las unidades, dos menos siete no alcanza.",
      visual: { type: "table", headers: H, rows: [["5", "2"], ["2", "7"]] },
      eq: "52 − 27",
    },
    {
      say: "Cambiamos una decena por diez unidades: quedan cuatro decenas y doce unidades. Doce menos siete, cinco. Cuatro menos dos, dos. El resultado es veinticinco.",
      visual: { type: "table", headers: H, rows: [["[[4]]", "[[12]]"], ["2", "7"], ["{{2}}", "{{5}}"]] },
      eq: "52 − 27 = 25",
    },
    {
      say: "Ojo con un error muy común: restar al revés, siete menos dos. Cuando no alcanza, no se da vuelta la resta: se hace el canje.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "No restes al revés", text: "En 52 − 27 no se hace 7 − 2: se hace el canje" }] },
      eq: "",
    },
    {
      say: "Recuerda: suma y resta cada lugar por separado. Si juntas diez o más, lleva uno. Si no alcanza, haz el canje. Y comprueba: la resta se revisa con una suma.",
      visual: {
        type: "list",
        title: "Sumar y restar con canje",
        items: ["➕ Cada lugar por separado: unidades con unidades.", "🔁 Si juntas 10 o más, lleva 1 al lugar siguiente.", "➖ Si no alcanza, cambia una decena por 10 unidades.", "✅ Comprueba: 25 + 27 = 52."],
      },
    },
  ],
};
