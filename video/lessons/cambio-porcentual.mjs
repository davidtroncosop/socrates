// Metáfora: una bola de nieve; el porcentaje se calcula sobre lo nuevo.
export default {
  id: "cambio-porcentual",
  title: "Cambio porcentual constante",
  grade: "2° Medio",
  beats: [
    {
      say: "Un pueblo tiene mil habitantes y crece un diez por ciento cada año.",
      visual: { type: "cards", items: [{ icon: "🏘️", title: "1.000 habitantes", text: "Crece 10 % cada año" }] },
    },
    {
      say: "El primer año crece cien: el diez por ciento de mil. Llega a mil cien.",
      visual: { type: "lines", lines: ["Año 1: 1.000 + 100 = 1.100"] },
    },
    {
      say: "El segundo año, el diez por ciento es de mil cien: ciento diez. Llega a mil doscientos diez, no a mil doscientos.",
      visual: { type: "lines", lines: ["Año 1: 1.000 + 100 = 1.100", "Año 2: 1.100 + [[110]] = {{1.210}}"] },
    },
    {
      say: "Atajo: crecer un diez por ciento es multiplicar por uno coma uno. Dos años: por uno coma uno, dos veces.",
      eq: "1.000 · 1,1 · 1,1 = 1.210",
    },
    {
      say: "Bajar también funciona así. Si un celular pierde el veinte por ciento cada año, se multiplica por cero coma ocho: diez mil, ocho mil, seis mil cuatrocientos.",
      visual: { type: "lines", lines: ["10.000 → 8.000 → {{6.400}}", "· 0,8 cada año"] },
      eq: "",
    },
    {
      say: "Recuerda: el porcentaje se aplica sobre lo nuevo, no sobre lo del principio. Crecer es multiplicar por uno coma algo; bajar, por cero coma algo.",
      visual: {
        type: "list",
        title: "Cambio porcentual",
        items: ["🔁 El % se aplica sobre lo nuevo.", "📈 +10 %: · 1,1.", "📉 −20 %: · 0,8."],
      },
    },
  ],
};
