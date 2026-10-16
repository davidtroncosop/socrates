// Metáfora: tres conos de agua llenan un cilindro.
export default {
  id: "cono",
  title: "Volumen del cono",
  grade: "1° Medio",
  beats: [
    {
      say: "Un cono y un cilindro con la misma base y la misma altura. ¿Cuántos conos de agua llenan el cilindro?",
      visual: { type: "cards", items: [{ icon: "🍦", title: "Cono", text: "Misma base y altura que el cilindro" }, { icon: "🥫", title: "Cilindro", text: "π · r² · h" }] },
    },
    {
      say: "Se necesitan tres conos. Por eso el volumen del cono es un tercio del cilindro.",
      visual: { type: "lines", lines: ["3 conos = 1 cilindro", "Cono = {{cilindro ÷ 3}}"] },
    },
    {
      say: "Cono de radio tres y altura cuatro. Primero el cilindro: tres coma catorce por nueve por cuatro, ciento trece coma cero cuatro.",
      eq: "3,14 · 3 · 3 · 4 = 113,04",
      visual: { type: "lines", lines: ["radio 3 cm", "altura 4 cm"] },
    },
    {
      say: "Divide en tres: treinta y siete coma sesenta y ocho centímetros cúbicos.",
      eq: "113,04 ÷ 3 = 37,68 cm³",
    },
    {
      say: "Ojo: no es la mitad del cilindro, es un tercio.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Un tercio, no la mitad", text: "Tres conos llenan un cilindro" }] },
      eq: "",
    },
    {
      say: "Recuerda: calcula el cilindro, pi por radio al cuadrado por altura, y divide en tres.",
      visual: {
        type: "list",
        title: "Volumen del cono",
        items: ["🥫 Cilindro: 3,14 · r · r · h.", "➗ Cono: el cilindro ÷ 3.", "🚫 No es la mitad."],
      },
    },
  ],
};
