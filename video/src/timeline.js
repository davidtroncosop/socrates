// Convierte el guion y las duraciones de la narración en pasos con tiempo.
// `eq` se hereda del paso anterior; `visual` también, salvo que el paso
// traiga uno nuevo (que reemplaza al anterior completo).
export const FPS = 30;
export const LEAD = 8; // cuadros antes de que empiece la voz
export const TAIL = 14; // pausa después de cada frase
const END_HOLD = 45;

export function buildTimeline(lesson, manifest) {
  if (manifest.beats.length !== lesson.beats.length)
    throw new Error(`La narración de ${lesson.id} no coincide con el guion: ejecuta \`npm run narrate\`.`);
  let from = 0;
  let eq = "";
  let visual = null;
  const beats = lesson.beats.map((beat, i) => {
    if (beat.eq !== undefined) eq = beat.eq;
    if (beat.visual !== undefined) visual = beat.visual;
    const audio = manifest.beats[i];
    const speak = Math.ceil(audio.seconds * FPS);
    const last = i === lesson.beats.length - 1;
    const duration = LEAD + speak + TAIL + (last ? END_HOLD : 0);
    const item = { say: beat.say, eq, visual, audio: audio.file, from, duration, speak };
    from += duration;
    return item;
  });
  return { beats, duration: from };
}
