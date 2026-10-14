// Leer en voz alta con la voz del propio navegador (Web Speech API): no se
// envía nada a internet. Ayuda a quien le cuesta leer y a quien se distrae.

// Los símbolos matemáticos se dicen con palabras.
export function toSpeech(text) {
  return String(text ?? "")
    .replace(/\p{Extended_Pictographic}️?/gu, "")
    .replace(/f\(x\)/g, "f de equis")
    .replace(/f\((−?\d+)\)/g, "f de $1")
    .replace(/(\d)x\b/g, "$1 equis")
    .replace(/(^|[^\p{L}])x(?![\p{L}])/gu, "$1equis")
    // La «y» de una ecuación es la letra ye, no la conjunción.
    .replace(/(?<=[+\-−=·(\d]\s?)y(?![\p{L}])|(?<![\p{L}])y(?=\s?[+\-−=)])/gu, "ye")
    .replace(/\^\(?(−?\d+)\)?/g, " elevado a $1")
    .replace(/⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁰¹⁴⁵⁶⁷⁸⁹⁻][⁰¹²³⁴⁵⁶⁷⁸⁹]*|⁻[²³]/g, (m) => " elevado a " + m.replace("⁻", "menos ").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)))
    .replace(/²/g, " al cuadrado")
    .replace(/³/g, " al cubo")
    .replace(/[·×]/g, " por ")
    .replace(/÷/g, " dividido en ")
    .replace(/(^|\s|\()−\s?(?=\d|\()/g, "$1menos ")
    .replace(/\s[−-]\s/g, " menos ")
    .replace(/\+/g, " más ")
    .replace(/=/g, " igual a ")
    .replace(/√/g, "raíz de ")
    .replace(/π/g, "pi")
    .replace(/%/g, " por ciento")
    .replace(/→/g, ", entonces, ")
    .replace(/\(/g, " abre paréntesis, ")
    .replace(/\)/g, ", cierra paréntesis ")
    .replace(/\[/g, " abre corchete, ")
    .replace(/\]/g, ", cierra corchete ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

export const canSpeak = () => typeof speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";

function spanishVoice() {
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "es-CL") ??
    voices.find((v) => /^es[-_]419|^es[-_](MX|AR|CO|US)/.test(v.lang)) ??
    voices.find((v) => v.lang.startsWith("es"))
  );
}

export function speak(text) {
  if (!canSpeak()) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(toSpeech(text));
  utterance.lang = "es-CL";
  utterance.rate = 0.9;
  const voice = spanishVoice();
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

export const stopSpeaking = () => canSpeak() && speechSynthesis.cancel();

// Botón para leer una parte de la pantalla (ver SPEAK_TARGETS en app.js).
export const speakButton = (target, label = "Escuchar") =>
  canSpeak()
    ? `<button type="button" class="speak-btn" data-action="speak:${target}" aria-label="${label} en voz alta">🔊 ${label}</button>`
    : "";
