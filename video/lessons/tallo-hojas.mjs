// Metáfora: un árbol: el tallo es la decena y las hojas, las unidades.
export default {
  id: "tallo-hojas",
  title: "Diagrama de tallo y hojas",
  grade: "6° Básico",
  beats: [
    {
      say: "Las edades de un grupo son veintitrés, veinticinco, veintiocho, treinta y uno y treinta y cuatro. Un diagrama de tallo y hojas las ordena así.",
      visual: { type: "table", headers: ["Tallo", "Hojas"], rows: [["2", "3  5  8"], ["3", "1  4"]] },
    },
    {
      say: "El tallo es la decena, a la izquierda. Cada hoja es una unidad, a la derecha.",
      visual: { type: "table", headers: ["Tallo", "Hojas"], rows: [["[[2]]", "3  5  8"], ["3", "1  4"]] },
    },
    {
      say: "Para leer un dato, junta el tallo con la hoja: dos y tres es veintitrés.",
      visual: { type: "lines", lines: ["2 | 3 → {{23}}", "2 | 5 → 25", "2 | 8 → 28"] },
    },
    {
      say: "Ojo: la hoja sola no es el dato. El ocho de la fila dos es veintiocho.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "La hoja sola no es el dato", text: "2 | 8 es 28, no 8" }] },
    },
    {
      say: "Para contar los datos, cuenta las hojas: tres más dos, cinco datos. Y como ya están ordenados, la mediana es el del medio: veintiocho.",
      visual: { type: "lines", lines: ["23, 25, [[28]], 31, 34", "5 datos · mediana = {{28}}"] },
    },
    {
      say: "Recuerda: tallo es la decena, hoja es la unidad. Cada hoja es un dato, y los datos quedan ordenados.",
      visual: {
        type: "list",
        title: "Tallo y hojas",
        items: ["🌳 Tallo: la decena.", "🍃 Hoja: la unidad.", "🔢 Cada hoja es un dato."],
      },
    },
  ],
};
