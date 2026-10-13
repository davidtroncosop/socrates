// Metáfora: pedirle el carnet a la fuente — ¿quién lo dice?, ¿con qué
// pruebas?, ¿qué gana con que le creas?
export default {
  id: "lectura-noliterarios-6b",
  title: "Evaluar textos no literarios y fuentes",
  grade: "6° Básico",
  beats: [
    {
      say: "Antes de creerle a un texto, pídele su carnet: ¿quién lo dice?, ¿con qué pruebas?, y ¿qué gana con que le creas?",
      visual: { type: "cards", items: [{ icon: "🪪", title: "El carnet de la fuente", text: "¿Quién lo dice? ¿Con qué pruebas? ¿Qué gana?" }] },
    },
    {
      say: "Este informe sobre higiene bucal está firmado por la Sociedad de Odontología, y cita tres investigaciones universitarias. Sabemos quién habla y muestra sus pruebas: es una fuente confiable.",
      visual: {
        type: "passage",
        text: "Un informe sobre higiene bucal está [[firmado por la Sociedad de Odontología]] y [[cita tres investigaciones universitarias]] con datos de pacientes.",
        notes: [
          { label: "¿Quién?", text: "Especialistas que se identifican" },
          { label: "¿Pruebas?", text: "Investigaciones citadas" },
        ],
      },
    },
    {
      say: "En cambio, este sitio es anónimo, no cita a nadie, y promete curar cualquier infección. No tiene carnet, y su promesa es exagerada: no es confiable.",
      visual: {
        type: "passage",
        text: "Un sitio web [[anónimo]] asegura: «Comer tres manzanas ácidas cada mañana {{cura cualquier infección}}», [[sin citar médicos ni estudios]].",
        notes: [
          { label: "¿Quién?", text: "Nadie se identifica" },
          { label: "¿Pruebas?", text: "Ninguna" },
          { label: "Alerta", text: "Promesa exagerada: «cualquier infección»" },
        ],
      },
    },
    {
      say: "Pregunta también por el propósito: ¿el texto quiere informar, convencer o vender? Un anuncio comercial puede tener datos, pero su meta es que compres.",
      visual: {
        type: "cards",
        items: [
          { icon: "📢", title: "Informar", text: "Dar a conocer datos" },
          { icon: "🗳️", title: "Convencer", text: "Que pienses de cierta forma" },
          { icon: "🛒", title: "Vender", text: "Que compres algo" },
        ],
      },
    },
    {
      say: "Este afiche lo emite la municipalidad, y su propósito es invitar a la comunidad a plantar árboles nativos. No vende nada: convoca.",
      visual: {
        type: "passage",
        label: "Afiche comunal",
        text: "«El sábado a las 10:00 sembraremos 50 árboles nativos en el Parque El Roble. {{Trae pala y guantes para sumarte al voluntariado}}».",
        notes: [
          { label: "Emisor", text: "La municipalidad" },
          { label: "Propósito", text: "Invitar a participar en el voluntariado" },
        ],
      },
    },
    {
      say: "Antes de creer, revisa: ¿quién lo dice y si se identifica?, ¿muestra pruebas o fuentes?, y ¿qué propósito tiene?",
      visual: {
        type: "list",
        title: "Antes de creer",
        items: ["🪪 ¿Quién lo dice? ¿Se identifica?", "🔬 ¿Muestra pruebas o fuentes?", "🎯 ¿Qué propósito tiene: informar, convencer o vender?"],
      },
    },
  ],
};
