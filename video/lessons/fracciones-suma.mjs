// Metáfora: trozos de pizza; solo se juntan trozos del mismo tamaño.
const pizza = (parts, filled, partLabel, caption) => ({ type: "bar", total: "1 pizza", parts, filled, partLabel, caption });

export default {
  id: "fracciones-suma",
  title: "Sumar y restar fracciones",
  grade: "6° Básico",
  beats: [
    {
      say: "Sumemos un quinto más dos quintos. Los trozos son del mismo tamaño: quintos.",
      visual: pizza(5, 1, "1/5", "Un quinto, y vienen dos más"),
      eq: "1/5 + 2/5",
    },
    {
      say: "Un trozo más dos trozos son tres trozos: tres quintos. Fíjate que el cinco no cambia, porque dice el tamaño de cada trozo.",
      visual: pizza(5, 3, "1/5", "3 trozos de 1/5"),
      eq: "1/5 + 2/5 = 3/5",
    },
    {
      say: "Un error muy común es sumar también los de abajo y escribir tres décimos. Pero al juntar trozos de pizza, los trozos no se achican.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "El de abajo no se suma", text: "1/5 + 2/5 no es 3/10: los trozos no se achican al juntarlos" }] },
      eq: "",
    },
    {
      say: "¿Y un medio más un cuarto? Ahora los trozos son de distinto tamaño, y no se pueden juntar así no más.",
      visual: pizza(2, 1, "1/2", "Un medio y un cuarto: trozos distintos"),
      eq: "1/2 + 1/4",
    },
    {
      say: "Cortamos la mitad en dos trozos: un medio es lo mismo que dos cuartos. Ahora todos los trozos son cuartos.",
      visual: pizza(4, 2, "1/4", "1/2 = 2/4"),
      eq: "1/2 = 2/4",
    },
    {
      say: "Dos cuartos más un cuarto: tres cuartos. Para restar se hace igual: primero trozos del mismo tamaño, y después se resta arriba.",
      visual: pizza(4, 3, "1/4", "2/4 + 1/4 = 3/4"),
      eq: "1/2 + 1/4 = 2/4 + 1/4 = 3/4",
    },
    {
      say: "Paso a paso, para un medio más un tercio. Paso uno: busca un número de abajo común: seis. Paso dos: transforma cada fracción. Paso tres: suma los de arriba y deja el de abajo.",
      visual: { type: "lines", lines: ["Paso 1: abajo común: 6", "Paso 2: 1/2 = 3/6 y 1/3 = 2/6", "Paso 3: 3/6 + 2/6 = {{5/6}}"] },
      eq: "",
    },
    {
      say: "Recuerda: si los trozos son del mismo tamaño, suma solo los de arriba. Si no, primero córtalos en trozos iguales. Y el de abajo no se suma.",
      visual: {
        type: "list",
        title: "Sumar y restar fracciones",
        items: ["🍕 Trozos del mismo tamaño: suma solo los de arriba.", "✂️ Si son distintos, córtalos en trozos iguales.", "🚫 El número de abajo no se suma."],
      },
      eq: "",
    },
  ],
};
