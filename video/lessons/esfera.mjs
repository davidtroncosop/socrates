// Metáfora: la pelota y el cuero que la cubre.
export default {
  id: "esfera",
  title: "Área y volumen de la esfera",
  grade: "2° Medio",
  beats: [
    {
      say: "Una esfera es una pelota. Todos sus puntos están a la misma distancia del centro: el radio.",
      visual: { type: "cards", items: [{ icon: "⚽", title: "Esfera", text: "Todos los puntos a la misma distancia del centro" }] },
    },
    {
      say: "El cuero que la cubre es su área: cuatro por pi por radio al cuadrado. Es justo cuatro círculos del mismo radio.",
      visual: { type: "lines", lines: ["Área = 4 · π · r²", "= 4 círculos"] },
    },
    {
      say: "Con radio dos: cuatro por tres coma catorce por cuatro, cincuenta coma veinticuatro centímetros cuadrados.",
      eq: "4 · 3,14 · 2 · 2 = 50,24 cm²",
    },
    {
      say: "Lo que cabe adentro es el volumen: cuatro tercios por pi por radio al cubo. El radio va al cubo porque es espacio.",
      visual: { type: "lines", lines: ["Volumen = 4/3 · π · r³"] },
      eq: "",
    },
    {
      say: "Con radio tres: tres al cubo es veintisiete; cuatro tercios de veintisiete es treinta y seis; por tres coma catorce, ciento trece coma cero cuatro.",
      eq: "4/3 · 3,14 · 27 = 113,04 cm³",
    },
    {
      say: "Recuerda: área, cuatro pi erre al cuadrado. Volumen, cuatro tercios pi erre al cubo. Al cuadrado para superficie, al cubo para espacio.",
      visual: {
        type: "list",
        title: "Esfera",
        items: ["⚽ Área: 4 · π · r².", "🫧 Volumen: 4/3 · π · r³.", "² Superficie; ³ espacio."],
      },
      eq: "",
    },
  ],
};
