// Metáfora: la cabra amarrada a una estaca — estaca = centro, cuerda = radio,
// el camino alrededor = perímetro, el pasto que alcanza = área.
const circle = (show) => ({ type: "circle", goat: true, show, labels: { r: "r = 3 m", d: "d = 6 m" } });

export default {
  id: "circulos",
  title: "Radio, perímetro y área",
  grade: "7° Básico",
  beats: [
    {
      say: "Una cabra está amarrada a una estaca con una cuerda de tres metros. La estaca es el centro del círculo.",
      visual: circle(["center"]),
    },
    {
      say: "La cuerda es el radio: la distancia del centro a cualquier punto del borde. Aquí, tres metros.",
      visual: circle(["center", "radius"]),
    },
    {
      say: "Si estiras la cuerda hacia los dos lados de la estaca, cubres el diámetro: dos radios. Seis metros.",
      visual: circle(["center", "radius", "diameter"]),
      eq: "d = 2 · r = 6 m",
    },
    {
      say: "Si la cabra camina con la cuerda tensa, da una vuelta completa. Ese camino es la circunferencia, y su largo es el perímetro: dos por pi por el radio.",
      visual: circle(["center", "radius", "diameter", "perimeter"]),
      eq: "P = 2 · π · r",
    },
    {
      say: "Pi es aproximadamente tres coma catorce: una vuelta mide un poco más de tres diámetros. Dos por tres coma catorce por tres: dieciocho coma ochenta y cuatro metros.",
      eq: "P = 2 · 3,14 · 3 = 18,84 m",
    },
    {
      say: "Y todo el pasto que la cabra alcanza a comer es el área del círculo: pi por el radio al cuadrado.",
      visual: circle(["center", "radius", "perimeter", "area"]),
      eq: "A = π · r²",
    },
    {
      say: "Tres coma catorce, por tres al cuadrado, que es nueve: veintiocho coma veintiséis metros cuadrados. Ojo: primero elevas el radio al cuadrado, y después multiplicas por pi.",
      eq: "A = 3,14 · 3² = 3,14 · 9 = 28,26 m²",
    },
    {
      say: "Para no confundirlos: el perímetro es el camino alrededor, y se mide en metros. El área es todo el pasto de adentro, y se mide en metros cuadrados.",
      visual: {
        type: "cards",
        items: [
          { icon: "🚶", title: "Perímetro", text: "El camino alrededor · en metros" },
          { icon: "🌿", title: "Área", text: "El pasto de adentro · en metros cuadrados" },
        ],
      },
      eq: "",
    },
    {
      say: "Recuerda: el diámetro son dos radios. El perímetro es dos pi erre. Y el área es pi erre al cuadrado.",
      visual: {
        type: "list",
        title: "El círculo de la cabra",
        items: ["📏 d = 2 · r", "🚶 P = 2 · π · r", "🌿 A = π · r²", "🥧 π ≈ 3,14"],
      },
    },
  ],
};
