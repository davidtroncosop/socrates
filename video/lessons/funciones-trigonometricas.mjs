// Metáfora: la rueda de la fortuna y las mareas.
const ticks = [[0, "0°"], [90, "90°"], [180, "180°"], [270, "270°"], [360, "360°"]];

export default {
  id: "funciones-trigonometricas",
  title: "Funciones seno y coseno",
  grade: "4° Medio",
  beats: [
    {
      say: "Imagina una rueda de la fortuna. Tu altura sube, llega arriba, baja y vuelve a subir. Eso es la función seno.",
      visual: { type: "curve", f: { kind: "sin", A: 1 }, window: [0, 720, -1.5, 1.5], xLabels: ticks },
    },
    {
      say: "El seno va de menos uno a uno. En noventa grados está arriba, en uno; en doscientos setenta, abajo, en menos uno.",
      visual: { type: "curve", f: { kind: "sin", A: 1 }, window: [0, 360, -1.5, 1.5], xLabels: ticks, points: [[90, 1, "1"], [270, -1, "−1"]] },
    },
    {
      say: "Si multiplicas por tres, sube hasta tres y baja hasta menos tres. Ese número es la amplitud.",
      visual: { type: "curve", f: { kind: "sin", A: 3 }, window: [0, 360, -4, 4], xLabels: ticks, hlines: [[3, "3"], [-3, "−3"]] },
      eq: "f(x) = 3 · sen(x)",
    },
    {
      say: "Una marea: h de t igual dos seno de t más cinco. El cinco sube toda la curva. La altura máxima es cinco más dos, siete, y la mínima, cinco menos dos, tres.",
      visual: { type: "curve", f: { kind: "sin", A: 2, D: 5 }, window: [0, 360, 0, 8], xLabels: ticks, hlines: [[7, "7"], [3, "3"]] },
      eq: "h(t) = 2 · sen(t) + 5",
    },
    {
      say: "El período es lo que tarda en repetirse. Seno de dos equis va el doble de rápido: se repite cada ciento ochenta grados.",
      visual: { type: "curve", f: { kind: "sin", A: 1, B: 2 }, window: [0, 360, -1.5, 1.5], xLabels: ticks },
      eq: "período: 360° ÷ 2 = 180°",
    },
    {
      say: "Recuerda: el seno sube y baja entre menos uno y uno. El número de adelante es la amplitud, el que se suma la mueve hacia arriba, y el de adentro cambia el período.",
      visual: {
        type: "list",
        title: "Seno y coseno",
        items: ["🎡 Sube y baja: de −1 a 1.", "↕️ A · sen(x): amplitud A.", "⬆️ + D: sube la curva.", "⏱️ sen(Bx): período 360° ÷ B."],
      },
      eq: "",
    },
  ],
};
