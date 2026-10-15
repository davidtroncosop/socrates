// Metáfora: cada signo menos es una media vuelta (como en «signs»).
export default {
  id: "enteros-mult",
  title: "Multiplicar y dividir enteros",
  grade: "8° Básico",
  beats: [
    {
      say: "Para multiplicar enteros, primero olvida los signos y multiplica los números. Tres por cuatro, doce.",
      visual: { type: "lines", lines: ["(−3) · 4", "3 · 4 = 12"] },
    },
    {
      say: "Después decide el signo. Imagina que cada signo menos es una media vuelta. Con una sola media vuelta, quedas mirando hacia atrás: negativo.",
      visual: { type: "lines", lines: ["(−3) · 4", "un signo menos → {{−12}}"] },
    },
    {
      say: "Con dos signos menos das dos medias vueltas, y vuelves a mirar al frente: positivo. Menos tres por menos cuatro, doce.",
      visual: { type: "lines", lines: ["(−3) · (−4)", "dos signos menos → {{+12}}"] },
    },
    {
      say: "La regla corta: signos iguales, positivo. Signos distintos, negativo.",
      visual: { type: "lines", lines: ["+ · + = +", "− · − = +", "+ · − = −", "− · + = −"] },
    },
    {
      say: "Para dividir, la regla es la misma. Menos veinticuatro dividido en seis: cuatro, y como los signos son distintos, menos cuatro.",
      visual: { type: "lines", lines: ["(−24) ÷ 6", "24 ÷ 6 = 4", "signos distintos → {{−4}}"] },
    },
    {
      say: "Con tres números, ve de a dos. Menos dos por menos tres es seis. Seis por menos cinco, menos treinta.",
      visual: { type: "lines", lines: ["(−2) · (−3) · (−5)", "= 6 · (−5)", "= {{−30}}"] },
    },
    {
      say: "Recuerda: multiplica los números y después el signo. Iguales, positivo. Distintos, negativo.",
      visual: {
        type: "list",
        title: "Multiplicar enteros",
        items: ["✖️ Primero los números.", "➕ Signos iguales: positivo.", "➖ Signos distintos: negativo.", "➗ Para dividir, igual."],
      },
    },
  ],
};
