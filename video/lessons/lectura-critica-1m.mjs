// Metáforas: las falacias son trucos de magia (desvían la atención): atacar
// a la persona, seguir a la manada y mostrar solo dos puertas.
export default {
  id: "lectura-critica-1m",
  title: "Lectura crítica, posturas y falacias",
  grade: "1° Medio",
  beats: [
    {
      say: "Una falacia es como un truco de magia: parece un buen razonamiento, pero desvía tu atención para que no mires lo importante.",
      visual: { type: "cards", items: [{ icon: "🎩", title: "Las falacias son trucos de magia", text: "Parecen razonamientos, pero desvían tu atención" }] },
    },
    {
      say: "Primer truco: el ataque personal, o ad hóminem. En vez de discutir las ideas, ataca a quien las dice.",
      visual: { type: "cards", items: [{ icon: "🎯", title: "Ataque personal (ad hominem)", text: "Apunta a la persona, no a sus razones" }] },
    },
    {
      say: "No consideremos sus propuestas sobre ciclovías, porque es desordenado en su vida privada. ¿Y las ciclovías? Nadie las discutió: el truco nos hizo mirar a la persona.",
      visual: {
        type: "passage",
        text: "«No debemos considerar las propuestas del arquitecto sobre ciclovías, porque es una persona [[desordenada en su vida privada]]».",
        notes: [{ label: "El truco", text: "Mira su vida privada, no las ciclovías" }],
      },
    },
    {
      say: "Segundo truco: seguir a la manada, o ad pópulum. Que mucha gente haga algo no prueba que sea bueno o verdadero.",
      visual: { type: "cards", items: [{ icon: "🐑", title: "Seguir a la manada (ad populum)", text: "«Todos lo hacen» no prueba que sea correcto" }] },
    },
    {
      say: "Debes usar esta aplicación porque todos en el curso la tienen. ¿Es útil? ¿Es segura? El argumento no dice nada de eso.",
      visual: {
        type: "passage",
        text: "«Debes adoptar esta aplicación, ya que {{absolutamente todos en el curso la tienen instalada}}».",
        notes: [{ label: "El truco", text: "La popularidad no dice nada sobre la aplicación" }],
      },
    },
    {
      say: "Tercer truco: el falso dilema. Te muestra solo dos puertas, cuando en realidad el pasillo tiene muchas más.",
      visual: { type: "cards", items: [{ icon: "🚪", title: "Falso dilema: solo dos puertas", text: "Esconde las demás opciones" }] },
    },
    {
      say: "O prohibimos toda la tecnología, o los estudiantes dejarán de razonar. ¿Y usarla con reglas, en algunas clases, para ciertos fines? Esas puertas quedaron escondidas.",
      visual: {
        type: "passage",
        text: "«{{O prohibimos todo uso de tecnología}} en las aulas, {{o los estudiantes perderán por completo}} su capacidad de razonar».",
        notes: [{ label: "Puertas escondidas", text: "Usarla con reglas, en ciertas clases, con ciertos fines…" }],
      },
    },
    {
      say: "Para desarmar el truco, pregúntate: ¿ataca a la persona en vez de sus razones?, ¿usa la popularidad como prueba?, ¿esconde otras opciones?",
      visual: {
        type: "list",
        title: "Desarma el truco",
        items: ["🎯 ¿Ataca a la persona en vez de sus razones?", "🐑 ¿Usa la popularidad como prueba?", "🚪 ¿Esconde otras opciones?"],
      },
    },
  ],
};
