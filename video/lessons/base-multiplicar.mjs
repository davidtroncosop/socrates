// Metáfora: grupos iguales, y atajos en vez de memorizar (doble, mitad de por 10, por 10 menos una vez).
const group = { icon: "🍪", count: 3, label: "3", cols: 3 };

export default {
  id: "base-multiplicar",
  title: "Multiplicar con atajos",
  grade: "Base",
  beats: [
    {
      say: "Multiplicar es juntar grupos iguales. Cuatro por tres son cuatro grupos de tres galletas: doce galletas.",
      visual: { type: "tokens", size: 64, groups: [group, { op: "+" }, group, { op: "+" }, group, { op: "+" }, group] },
      eq: "4 · 3 = 3 + 3 + 3 + 3 = 12",
    },
    {
      say: "No necesitas saberte todas las tablas de memoria. Con unos pocos atajos puedes llegar a cualquier resultado.",
      visual: { type: "cards", items: [{ icon: "🧠", title: "Atajos, no memoria", text: "Con 4 atajos llegas a casi todas las tablas" }] },
      eq: "",
    },
    {
      say: "Por dos es el doble. Por cuatro es el doble del doble. Seis por dos es doce, y el doble de doce es veinticuatro.",
      visual: { type: "lines", lines: ["6 · 2 = 12", "6 · 4 = doble de 12 = [[24]]"] },
    },
    {
      say: "Por cinco es la mitad de por diez. Catorce por diez es ciento cuarenta, y la mitad es setenta.",
      visual: { type: "lines", lines: ["14 · 10 = 140", "5 · 14 = mitad de 140 = [[70]]"] },
    },
    {
      say: "Por nueve es por diez, menos una vez. Ocho por diez es ochenta, y le quitamos un ocho: setenta y dos.",
      visual: { type: "lines", lines: ["10 · 8 = 80", "9 · 8 = 80 − 8 = [[72]]"] },
    },
    {
      say: "Y si no recuerdas uno, combínalos. Siete por seis es siete por tres, que es veintiuno, y después el doble: cuarenta y dos.",
      visual: { type: "lines", lines: ["7 · 3 = 21", "7 · 6 = doble de 21 = [[42]]"] },
    },
    {
      say: "Paso a paso, para seis por catorce. Paso uno: separa el catorce en diez y cuatro. Paso dos: multiplica cada parte. Paso tres: suma.",
      visual: { type: "lines", lines: ["Paso 1: 14 = 10 + 4", "Paso 2: 6 · 10 = 60 y 6 · 4 = 24", "Paso 3: 60 + 24 = {{84}}"] },
      eq: "",
    },
    {
      say: "Recuerda los atajos: por dos, el doble. Por cuatro, el doble del doble. Por cinco, la mitad de por diez. Y por nueve, por diez menos una vez.",
      visual: {
        type: "list",
        title: "Atajos para multiplicar",
        items: ["✌️ Por 2: el doble.", "🔁 Por 4: el doble del doble.", "✋ Por 5: la mitad de por 10.", "🔟 Por 9: por 10, menos una vez."],
      },
    },
  ],
};
