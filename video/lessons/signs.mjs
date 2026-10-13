// Metáforas: multiplicar por un negativo es dar media vuelta (dos medias
// vueltas te dejan mirando al frente) y el número fuera del paréntesis es un
// cartero que entrega su multiplicación en cada casa.
const line = (arrows) => ({ type: "numberline", min: -8, max: 8, arrows });
const right3 = { from: 0, to: 3, label: "3 pasos", row: 0 };
const turn = { from: 0, to: -3, label: "(−1) · 3", color: "#dc2626", row: 1 };
const turn2 = { from: 0, to: 3, label: "(−1) · (−1) · 3", color: "#047857", row: 2 };

export default {
  id: "signs",
  title: "Haz las paces con los signos",
  grade: "8° Básico",
  beats: [
    {
      say: "Hoy vamos a hacer las paces con los signos usando dos ideas: la media vuelta y el cartero.",
      visual: { type: "cards", items: [{ icon: "🧭", title: "Haz las paces con los signos", text: "La media vuelta y el cartero" }] },
    },
    {
      say: "Imagina que estás parado en el cero, mirando hacia la derecha. Multiplicar por tres es avanzar tres pasos hacia donde miras.",
      visual: line([right3]),
    },
    {
      say: "Multiplicar por menos uno es dar media vuelta: ahora miras hacia la izquierda, y los mismos tres pasos te llevan al menos tres.",
      visual: line([right3, turn]),
      eq: "(−1) · 3 = −3",
    },
    {
      say: "¿Y si das dos medias vueltas? Quedas mirando otra vez hacia la derecha. Por eso, menos por menos da más.",
      visual: line([right3, turn, turn2]),
      eq: "(−1) · (−1) · 3 = 3",
    },
    {
      say: "Un signo menos es una media vuelta: el resultado es negativo. Dos signos menos son dos medias vueltas: el resultado es positivo.",
      visual: {
        type: "list",
        title: "La regla de las medias vueltas",
        items: ["(+) · (+) = (+)   ninguna media vuelta", "(−) · (+) = (−)   una media vuelta", "(−) · (−) = (+)   dos medias vueltas"],
      },
      eq: "",
    },
    {
      say: "Por ejemplo, menos tres por menos cuatro: dos medias vueltas, así que el resultado es positivo. Doce.",
      eq: "(−3) · (−4) = 12",
    },
    {
      say: "Ahora, el cartero. En menos dos, por el paréntesis equis menos tres, el menos dos es un cartero: entrega su multiplicación en cada casa del paréntesis, sin saltarse ninguna.",
      visual: { type: "cards", items: [{ icon: "📬", title: "El cartero", text: "El número de afuera multiplica a cada término del paréntesis" }] },
      eq: "−2(x − 3)",
    },
    {
      say: "Primera casa: menos dos por equis, menos dos equis. Segunda casa: menos dos por menos tres. Dos medias vueltas: más seis.",
      visual: { type: "lines", lines: ["−2 · x = [[−2x]]", "−2 · (−3) = [[+6]]"] },
    },
    {
      say: "Ahora resolvamos: menos dos, por equis menos tres, igual a diez. El cartero reparte y queda: menos dos equis más seis, igual a diez.",
      visual: { type: "lines", lines: ["−2(x − 3) = 10", "−2x + 6 = 10"] },
      eq: "",
    },
    {
      say: "Restamos seis en ambos lados: menos dos equis, igual a cuatro.",
      visual: { type: "lines", lines: ["−2(x − 3) = 10", "−2x + 6 = 10", "−2x + 6 [[− 6]] = 10 [[− 6]]", "−2x = 4"] },
    },
    {
      say: "Dividimos por menos dos. Un solo signo menos, una media vuelta: equis es igual a menos dos.",
      visual: { type: "lines", lines: ["−2(x − 3) = 10", "−2x + 6 = 10", "−2x + 6 [[− 6]] = 10 [[− 6]]", "−2x = 4", "x = 4 [[÷ (−2)]] = −2"] },
    },
    {
      say: "Comprobamos: menos dos, por menos dos menos tres, que es menos cinco. Dos medias vueltas: diez. ¡Correcto!",
      visual: { type: "lines", lines: ["−2(x − 3) = 10", "−2x + 6 = 10", "−2x + 6 [[− 6]] = 10 [[− 6]]", "−2x = 4", "x = 4 [[÷ (−2)]] = −2", "{{−2 · (−2 − 3) = −2 · (−5) = 10 ✓}}"] },
    },
    {
      say: "Recuerda: cada signo menos es una media vuelta, y dos medias vueltas se cancelan. Y el cartero del paréntesis entrega en todas las casas.",
      visual: {
        type: "list",
        title: "Para recordar",
        items: ["🔄 Cada signo menos es una media vuelta: dos se cancelan.", "📬 El número de afuera multiplica a cada término del paréntesis."],
      },
    },
  ],
};
