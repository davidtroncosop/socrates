// Metáfora: mirar el triángulo desde un ángulo; SOH-CAH-TOA.
const tri = (labels) => ({ type: "triangle", a: 3, b: 4, c: 5, show: ["tri"], labels });

export default {
  id: "trigonometria",
  title: "Seno, coseno y tangente",
  grade: "2° Medio",
  beats: [
    {
      say: "Un triángulo rectángulo de lados tres, cuatro y cinco. Ponte en el ángulo que está frente al lado tres.",
      visual: tri({ a: "3", b: "4", c: "5" }),
    },
    {
      say: "Desde ahí, el lado tres está enfrente: es el opuesto. El cuatro está al lado: el adyacente. Y el cinco, el más largo, es la hipotenusa.",
      visual: tri({ a: "opuesto 3", b: "adyacente 4", c: "hipotenusa 5" }),
    },
    {
      say: "El seno es opuesto dividido en hipotenusa: tres quintos, cero coma seis.",
      eq: "sen = 3/5 = 0,6",
    },
    {
      say: "El coseno es adyacente dividido en hipotenusa: cuatro quintos, cero coma ocho. Y la tangente es opuesto dividido en adyacente: tres cuartos.",
      eq: "cos = 4/5   tan = 3/4",
    },
    {
      say: "Se recuerda con SOH CAH TOA: seno, opuesto sobre hipotenusa; coseno, adyacente sobre hipotenusa; tangente, opuesto sobre adyacente.",
      visual: { type: "lines", lines: ["SOH: sen = O / H", "CAH: cos = A / H", "TOA: tan = O / A"] },
      eq: "",
    },
    {
      say: "Sirve para medir sin subir. Una escalera de diez metros forma treinta grados con el suelo. Seno de treinta es un medio, así que llega a cinco metros de altura.",
      visual: { type: "lines", lines: ["opuesto = hipotenusa · sen", "10 · 0,5 = {{5 m}}"] },
    },
    {
      say: "Paso a paso, para encontrar un lado con el seno. Paso uno: marca el ángulo y nombra los lados. Paso dos: elige la razón que une lo que sabes con lo que buscas. Paso tres: despeja y calcula.",
      visual: { type: "lines", lines: ["Paso 1: hipotenusa 10, ángulo 30°", "Paso 2: sen = opuesto ÷ hipotenusa", "Paso 3: opuesto = 10 · 0,5 = {{5}}"] },
      eq: "",
    },
    {
      say: "Recuerda: identifica opuesto, adyacente e hipotenusa desde tu ángulo, y usa SOH CAH TOA.",
      visual: {
        type: "list",
        title: "Trigonometría",
        items: ["👀 Mira desde el ángulo.", "📐 SOH-CAH-TOA.", "🪜 Opuesto = hipotenusa · seno."],
      },
    },
  ],
};
