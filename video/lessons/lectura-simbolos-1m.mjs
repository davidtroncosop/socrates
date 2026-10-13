// Metáfora: un símbolo es una llave (un objeto concreto que abre una idea
// abstracta) y la cerradura depende de la obra (el contexto).
const compass = "Al cumplir la mayoría de edad, el joven recibe como herencia una brújula rota cuya aguja gira sin detenerse en el norte.";
const compassMarked = "Al cumplir la mayoría de edad, el joven recibe como herencia una {{brújula rota}} cuya aguja [[gira sin detenerse en el norte]].";

export default {
  id: "lectura-simbolos-1m",
  title: "Símbolos y visiones de mundo en la literatura",
  grade: "1° Medio",
  beats: [
    {
      say: "Un símbolo es como una llave: es un objeto concreto, que puedes ver o tocar, y abre una idea abstracta, como la libertad o el miedo.",
      visual: { type: "cards", items: [{ icon: "🗝️", title: "Un símbolo es una llave", text: "Un objeto concreto que abre una idea abstracta" }] },
    },
    {
      say: "Un pájaro enjaulado puede abrir la idea del deseo de libertad. Una tempestad puede representar una crisis interior del personaje.",
      visual: {
        type: "cards",
        items: [
          { icon: "🐦", title: "Pájaro enjaulado", text: "→ deseo de libertad" },
          { icon: "⛈️", title: "Tempestad", text: "→ crisis interior" },
        ],
      },
    },
    {
      say: "Lee: Al cumplir la mayoría de edad, el joven recibe como herencia una brújula rota, cuya aguja gira sin detenerse en el norte.",
      visual: { type: "passage", text: compass },
    },
    {
      say: "Una brújula sirve para orientarse. Si está rota y no marca el norte, puede simbolizar que el joven tendrá que encontrar su propio rumbo, sin que nadie se lo indique.",
      visual: {
        type: "passage",
        text: compassMarked,
        notes: [
          { label: "Objeto", text: "Una brújula que no marca el norte" },
          { label: "Idea", text: "Deberá encontrar su propio rumbo" },
        ],
      },
    },
    {
      say: "Pero ojo: la misma llave puede abrir puertas distintas según la obra. Hay que leer el símbolo junto con lo que pasa en el relato, y con la visión de mundo del texto.",
      visual: { type: "cards", items: [{ icon: "🌍", title: "La cerradura depende de la obra", text: "Un mismo objeto puede abrir ideas distintas según el contexto" }] },
    },
    {
      say: "Aquí, una lámpara de aceite contrasta con luces de neón frías y publicidad automática. Leída en ese contexto, la lámpara puede simbolizar lo humano y lo propio, que resiste en un mundo impersonal.",
      visual: {
        type: "passage",
        text: "El protagonista cuida una {{lámpara de aceite}} en medio de una ciudad dominada por [[luces de neón frías]] y carteles publicitarios automáticos.",
        notes: [
          { label: "Contraste", text: "Luz cálida y antigua frente a luz fría y comercial" },
          { label: "Visión de mundo", text: "Lo humano resiste frente a lo impersonal" },
        ],
      },
    },
    {
      say: "Para interpretar símbolos: busca objetos que se repiten o destacan, pregunta qué idea abstracta abren, y confírmalo con el contexto de la obra.",
      visual: {
        type: "list",
        title: "Interpretar símbolos",
        items: ["🗝️ Busca objetos que se repiten o destacan.", "💭 Pregunta qué idea abstracta abren.", "🌍 Confírmalo con el contexto y la visión de mundo de la obra."],
      },
    },
  ],
};
