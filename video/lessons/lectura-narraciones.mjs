// Metáforas: leer como detective (toda conclusión necesita una pista) y el
// efecto dominó (conflicto → acción → consecuencia).
const ines = "Antes de salir, Inés revisó tres veces su mochila. Al encontrar la autorización, soltó el aire y sonrió.";
const inesMarked = "Antes de salir, Inés [[revisó tres veces]] su mochila. Al encontrar la autorización, [[soltó el aire y sonrió]].";
const luis = "Luis [[oyó el timbre]]. Aunque llevaba todo el recreo esperando jugar, {{dejó la pelota y volvió a la sala}}.";

export default {
  id: "lectura-narraciones",
  title: "Comprender una narración",
  grade: "7° Básico",
  beats: [
    {
      say: "Para comprender una narración, lee como detective: lo que concluyes tiene que apoyarse en pistas del texto, no en lo que te imaginas.",
      visual: { type: "cards", items: [{ icon: "🕵️", title: "Lee como detective", text: "Toda conclusión necesita una pista del texto" }] },
    },
    {
      say: "Lee: Antes de salir, Inés revisó tres veces su mochila. Al encontrar la autorización, soltó el aire y sonrió.",
      visual: { type: "passage", text: ines },
    },
    {
      say: "¿Qué pistas hay? Revisó tres veces: estaba preocupada. Soltó el aire y sonrió: sintió alivio.",
      visual: { type: "passage", text: inesMarked, notes: [{ label: "Pistas", text: "Revisa tres veces · suelta el aire · sonríe" }] },
    },
    {
      say: "Conclusión: Inés temía haber perdido la autorización. El texto no lo dice directamente, pero las pistas lo sostienen. Eso es una inferencia.",
      visual: {
        type: "passage",
        text: inesMarked,
        notes: [
          { label: "Pistas", text: "Revisa tres veces · suelta el aire · sonríe" },
          { label: "Inferencia", text: "Temía haber perdido la autorización" },
        ],
      },
    },
    {
      say: "Inferir no es inventar. Si alguien dijera que Inés no quería ir al paseo, no habría ninguna pista que lo apoye: su sonrisa dice lo contrario.",
      visual: { type: "cards", items: [{ icon: "🚫", title: "Inferir no es inventar", text: "«Inés no quería ir» no tiene ninguna pista que lo apoye" }] },
    },
    {
      say: "Además, en un relato las acciones caen como fichas de dominó: hay un conflicto, alguien actúa, y eso trae consecuencias.",
      visual: { type: "steps", title: "Efecto dominó", steps: ["Conflicto", "Acción", "Consecuencia"] },
    },
    {
      say: "Por ejemplo: Luis oyó el timbre. Aunque llevaba todo el recreo esperando jugar, dejó la pelota y volvió a la sala. ¿Por qué volvió? Por el timbre: esa es la causa. Y volver a la sala es la consecuencia.",
      visual: {
        type: "passage",
        text: luis,
        notes: [
          { label: "Causa", text: "Sonó el timbre" },
          { label: "Consecuencia", text: "Deja de jugar y vuelve a la sala" },
        ],
      },
    },
    {
      say: "Al leer una narración, pregúntate: ¿cuál es el conflicto?, ¿qué acciones provoca y con qué consecuencias?, y ¿qué pista del texto apoya tu conclusión?",
      visual: {
        type: "list",
        title: "Al leer una narración",
        items: ["🎯 ¿Cuál es el conflicto?", "🔗 ¿Qué acciones provoca y con qué consecuencias?", "🕵️ ¿Qué pista del texto apoya tu conclusión?"],
      },
    },
  ],
};
