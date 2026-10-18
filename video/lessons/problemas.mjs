// Metáfora: traducir del español al idioma matemático, frase por frase, y
// volver al problema para ver si la respuesta tiene sentido.
const dictionary = [
  ["lo que no sé: las láminas del hermano", "x"],
  ["el doble", "2x"],
  ["le regalaron 5", "+ 5"],
  ["ahora tiene", "="],
  ["21 láminas", "21"],
];

export default {
  id: "problemas",
  title: "Modelamiento y problemas reales",
  grade: "1° Medio",
  beats: [
    {
      say: "Un problema escrito es como un mensaje en otro idioma. Para resolverlo, primero hay que traducirlo al idioma de las matemáticas.",
      visual: { type: "cards", items: [{ icon: "🗣️", title: "Traducir al idioma matemático", text: "Cada frase tiene su traducción" }] },
    },
    {
      say: "Lee este problema: Camila tiene el doble de láminas que su hermano, y además le regalaron cinco. Ahora tiene veintiuna. ¿Cuántas tiene su hermano?",
      visual: { type: "passage", label: "Problema", text: "Camila tiene el doble de láminas que su hermano, y además le regalaron 5. Ahora tiene 21 láminas. ¿Cuántas tiene su hermano?" },
    },
    {
      say: "Primer paso: lo que no sabemos es la equis. Equis son las láminas del hermano.",
      visual: { type: "table", headers: ["En español", "En matemática"], rows: dictionary.slice(0, 1), width: 1100 },
    },
    {
      say: "Ahora traducimos frase por frase: el doble es dos equis; le regalaron cinco es más cinco; y ahora tiene es el signo igual.",
      visual: { type: "table", headers: ["En español", "En matemática"], rows: dictionary, width: 1100 },
    },
    {
      say: "La traducción completa es: dos equis más cinco, igual a veintiuno.",
      visual: { type: "lines", lines: ["2x + 5 = 21"] },
    },
    {
      say: "Resolvemos como siempre: restamos cinco y dividimos por dos. Equis es ocho.",
      visual: { type: "lines", lines: ["2x + 5 = 21", "2x = 16", "x = 8"] },
    },
    {
      say: "Y el último paso es volver al problema: si el hermano tiene ocho, el doble es dieciséis, más cinco regaladas, veintiuna. ¡Tiene sentido!",
      visual: { type: "cards", items: [{ icon: "🔍", title: "¿Tiene sentido?", text: "El hermano tiene 8. El doble es 16; más 5 regaladas: 21 ✓" }] },
    },
    {
      say: "Otro ejemplo: un plan de celular cobra cinco mil pesos al mes, más trescientos por cada gigabyte. Otro cobra tres mil, más quinientos por gigabyte. ¿Con cuántos gigas pagas lo mismo en los dos?",
      visual: { type: "passage", label: "Problema", text: "Plan A: $5\u00a0000 al mes, más $300 por cada GB. Plan B: $3\u00a0000 al mes, más $500 por cada GB. ¿Con cuántos GB pagas lo mismo?" },
    },
    {
      say: "Pagar lo mismo se traduce con un signo igual. Juntamos las equis en un lado, y queda: dos mil igual a doscientos equis. Equis es diez gigas.",
      visual: { type: "lines", lines: ["5 000 + 300x = 3 000 + 500x", "2 000 = 200x", "x = 10"] },
    },
    {
      say: "Paso a paso, para un problema en palabras. Paso uno: decide qué es equis. Paso dos: escribe la ecuación con los datos. Paso tres: resuélvela. Paso cuatro: responde con una frase y revisa si tiene sentido.",
      visual: { type: "lines", lines: ["Paso 1: x = lo que no sé", "Paso 2: traduce: «el doble más 5 es 21» → 2x + 5 = 21", "Paso 3: x = 8", "Paso 4: «El número es 8» ✓"] },
      eq: "",
    },
    {
      say: "Para modelar: define la equis, traduce frase por frase, resuelve, y vuelve al problema para ver si la respuesta tiene sentido.",
      visual: {
        type: "list",
        title: "Para modelar",
        items: ["❓ Define x: lo que no sabes.", "🗣️ Traduce frase por frase.", "⚖️ Resuelve la ecuación.", "🔍 Vuelve al problema: ¿tiene sentido?"],
      },
    },
  ],
};
