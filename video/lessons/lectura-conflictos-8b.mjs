// Metáforas: la motivación es el motor del personaje y el conflicto es una
// cuerda tirante (dos fuerzas tiran hacia lados contrarios).
const matias = "Matías advirtió que el cronómetro oficial falló a favor de su equipo. Aunque ganar significaba la copa, se acercó al árbitro y señaló la diferencia de segundos.";
const matiasMarked = "Matías advirtió que el cronómetro oficial falló a favor de su equipo. [[Aunque ganar significaba la copa]], {{se acercó al árbitro}} y señaló la diferencia de segundos.";

export default {
  id: "lectura-conflictos-8b",
  title: "Conflictos y motivaciones en el relato",
  grade: "8° Básico",
  beats: [
    {
      say: "Cada personaje tiene un motor que lo mueve: sus valores, sus lealtades o sus miedos. Eso es su motivación.",
      visual: { type: "cards", items: [{ icon: "⚙️", title: "La motivación es el motor", text: "Valores, lealtades o miedos mueven al personaje" }] },
    },
    {
      say: "El conflicto aparece cuando dos fuerzas tiran del personaje en direcciones contrarias, como en un tira y afloja.",
      visual: { type: "cards", items: [{ icon: "🪢", title: "El conflicto: una cuerda tirante", text: "Dos fuerzas tiran hacia lados contrarios" }] },
    },
    {
      say: "Lee: Matías advirtió que el cronómetro oficial falló a favor de su equipo. Aunque ganar significaba la copa, se acercó al árbitro y señaló la diferencia de segundos.",
      visual: { type: "passage", text: matias },
    },
    {
      say: "De un lado tira la copa. Del otro, su sentido de la justicia: ganar limpio.",
      visual: {
        type: "cards",
        items: [
          { icon: "🏆", title: "Tira hacia un lado", text: "Ganar la copa" },
          { icon: "⚖️", title: "Tira hacia el otro", text: "La justicia: ganar limpio" },
        ],
      },
    },
    {
      say: "¿Qué decide? Se acerca al árbitro. La palabra aunque muestra lo que le costó: sabía lo que perdía. Su motor más fuerte es la justicia.",
      visual: {
        type: "passage",
        text: matiasMarked,
        notes: [
          { label: "Decisión", text: "Avisa del error al árbitro" },
          { label: "Motivación", text: "Valora más la justicia que ganar" },
        ],
      },
    },
    {
      say: "Otro caso: Valeria ganó una pasantía científica en el extranjero, pero su abuela enferma depende de sus cuidados. Las dos cosas le importan. Por eso es un dilema, no una elección fácil.",
      visual: {
        type: "passage",
        text: "Valeria fue seleccionada para una [[pasantía científica en el extranjero]], pero [[su abuela enferma dependía de sus cuidados]] diarios.",
        notes: [{ label: "Conflicto", text: "Su sueño profesional frente al cuidado de su abuela" }],
      },
    },
    {
      say: "Para analizar un conflicto, pregúntate: ¿qué mueve al personaje?, ¿qué fuerzas tiran en direcciones opuestas?, y ¿qué decide, y qué revela eso de sus valores?",
      visual: {
        type: "list",
        title: "Para analizar un conflicto",
        items: ["⚙️ ¿Qué mueve al personaje?", "🪢 ¿Qué fuerzas tiran en direcciones opuestas?", "🧭 ¿Qué decide y qué revela eso de sus valores?"],
      },
    },
  ],
};
