// Metáfora: un banco que paga cada vez más seguido; el límite es e.
export default {
  id: "numero-e",
  title: "El número e y el logaritmo natural",
  grade: "3° Medio",
  beats: [
    {
      say: "Imagina un banco muy generoso: paga cien por ciento de interés al año. Un peso se convierte en dos.",
      visual: { type: "lines", lines: ["1 pago al año:", "1 · 2 = {{2}}"] },
    },
    {
      say: "Si paga en dos mitades, cincuenta por ciento cada semestre: uno coma cinco por uno coma cinco, dos coma veinticinco. Un poco más.",
      visual: { type: "lines", lines: ["2 pagos: 1,5 · 1,5 = 2,25"] },
    },
    {
      say: "Si paga cada mes, llega a dos coma sesenta y uno. Y si paga cada día, cada segundo, cada instante, se acerca a un número especial: e, dos coma siete uno ocho.",
      visual: { type: "lines", lines: ["2 pagos: 2,25", "12 pagos: 2,61", "365 pagos: 2,71", "infinitos: {{e ≈ 2,718}}"] },
    },
    {
      say: "e aparece en todo lo que crece de forma continua: poblaciones, interés continuo, enfriamiento de un café.",
      visual: { type: "curve", f: { kind: "exp", a: 1, b: 2.718 }, window: [0, 3, 0, 21] },
      eq: "f(t) = eᵗ",
    },
    {
      say: "El logaritmo en base e se llama logaritmo natural, y se escribe ele ene. Pregunta: ¿a qué exponente elevo e? Ele ene de e a la cuatro es cuatro.",
      visual: { type: "lines", lines: ["ln = logaritmo en base e", "ln(e⁴) = {{4}}"] },
      eq: "",
    },
    {
      say: "Y como cualquier logaritmo, ele ene de uno es cero, porque e elevado a cero es uno.",
      visual: { type: "lines", lines: ["e⁰ = 1", "ln 1 = {{0}}"] },
    },
    {
      say: "Recuerda: e es aproximadamente dos coma siete uno ocho, el número del crecimiento continuo. Ele ene es el logaritmo en base e: ele ene de e a la equis es equis.",
      visual: {
        type: "list",
        title: "El número e",
        items: ["🏦 e ≈ 2,718: interés pagado cada instante.", "🌱 Crecimiento continuo.", "🔁 ln: logaritmo en base e.", "ln(eˣ) = x · ln 1 = 0."],
      },
    },
  ],
};
