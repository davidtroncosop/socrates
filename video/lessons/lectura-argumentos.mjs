// Metáfora: la postura es una mesa y los argumentos son sus patas: una pata
// debe tocar la mesa (pertinente) y ser firme (comprobable).
const water = "Propongo instalar bebederos en el patio. Así podremos rellenar nuestras botellas y reducir el uso de envases desechables.";
const waterA = "{{Propongo instalar bebederos en el patio.}} Así podremos rellenar nuestras botellas y reducir el uso de envases desechables.";
const waterB = "{{Propongo instalar bebederos en el patio.}} Así podremos [[rellenar nuestras botellas y reducir el uso de envases desechables]].";

export default {
  id: "lectura-argumentos",
  title: "Reconocer posturas y argumentos",
  grade: "7° Básico",
  beats: [
    {
      say: "Imagina una mesa. La postura es la mesa: lo que el autor defiende. Los argumentos son las patas que la sostienen.",
      visual: { type: "cards", items: [{ icon: "🪑", title: "La postura es la mesa", text: "Los argumentos son las patas que la sostienen" }] },
    },
    {
      say: "Lee: Propongo instalar bebederos en el patio. Así podremos rellenar nuestras botellas y reducir el uso de envases desechables.",
      visual: { type: "passage", text: water },
    },
    {
      say: "La postura es instalar bebederos. Es lo que el autor quiere que aceptemos.",
      visual: { type: "passage", text: waterA, notes: [{ label: "Postura", text: "Instalar bebederos" }] },
    },
    {
      say: "Y la razón es poder rellenar botellas y usar menos envases desechables. Es una pata firme: tiene relación directa con la propuesta.",
      visual: {
        type: "passage",
        text: waterB,
        notes: [
          { label: "Postura", text: "Instalar bebederos" },
          { label: "Argumento", text: "Rellenar botellas y reducir envases desechables" },
        ],
      },
    },
    {
      say: "Para evaluar un argumento, hazte dos preguntas. ¿La pata toca la mesa? Es decir, ¿la razón tiene que ver con la postura? Y ¿es firme? ¿Se apoya en información que se puede comprobar?",
      visual: {
        type: "cards",
        items: [
          { icon: "🔩", title: "¿Toca la mesa?", text: "La razón debe ser pertinente: tener relación con la postura" },
          { icon: "🔎", title: "¿Es firme?", text: "Mejor si se apoya en información comprobable" },
        ],
      },
    },
    {
      say: "Por ejemplo: el club debería reunirse los viernes porque los patios son grandes. ¿Esa pata toca la mesa? No: el tamaño del patio no explica por qué el viernes. Una razón pertinente sería que el viernes todos terminan clases a la misma hora.",
      visual: {
        type: "passage",
        text: "El club debería reunirse los viernes porque [[los patios son grandes]].",
        notes: [
          { label: "¿Pertinente?", text: "No: el patio no explica por qué el viernes" },
          { label: "Mejor razón", text: "El viernes todos terminan clases a la misma hora" },
        ],
      },
    },
    {
      say: "Distingue también datos de opiniones. La biblioteca prestó trescientos libros en abril: eso se puede comprobar. Que sea el lugar más agradable del colegio es una opinión.",
      visual: {
        type: "passage",
        text: "La biblioteca [[prestó 300 libros en abril]]. {{Creo que es el lugar más agradable del colegio.}}",
        notes: [
          { label: "Dato comprobable", text: "300 libros prestados en abril" },
          { label: "Opinión", text: "Es el lugar más agradable" },
        ],
      },
    },
    {
      say: "Recuerda: la postura es lo que se defiende; el argumento, la razón que la sostiene. Y evalúa si esa razón es pertinente y comprobable.",
      visual: {
        type: "list",
        title: "Posturas y argumentos",
        items: ["🪑 Postura: lo que se defiende.", "🦵 Argumento: la razón que la sostiene.", "🔎 Evalúa: ¿es pertinente? ¿es comprobable?"],
      },
    },
  ],
};
