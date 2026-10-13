// Narra cada paso del guion con Fish Audio y guarda un WAV por frase.
// Uso: npm run narrate (todas) o npm run narrate -- equations signs
// Solo vuelve a pedir las frases cuyo texto o voz cambió.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { lessons } from "./lessons/index.mjs";

const wanted = process.argv.slice(2);
const env = process.env;
for (const key of ["FISH_AUDIO_API_KEY", "FISH_AUDIO_VOICE_ID"])
  if (!env[key]) throw new Error(`Falta ${key} en ../.env (ver ../.env.example).`);
const API = env.FISH_AUDIO_API_URL || "https://api.fish.audio/v1/tts";
const MODEL = env.FISH_AUDIO_MODEL || "s2.1-pro-free";
const RETRIES = Number(env.FISH_AUDIO_RETRIES || 3);
const TIMEOUT = Number(env.FISH_AUDIO_TIMEOUT_SECONDS || 120) * 1000;
const SAMPLE_RATE = 44100;

const exists = (url) => access(url).then(() => true, () => false);

async function synthesize(text) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.FISH_AUDIO_API_KEY}`,
          "Content-Type": "application/json",
          model: MODEL,
        },
        body: JSON.stringify({
          text,
          reference_id: env.FISH_AUDIO_VOICE_ID,
          format: "wav",
          sample_rate: SAMPLE_RATE,
          latency: "normal",
        }),
        signal: AbortSignal.timeout(TIMEOUT),
      });
      if (!res.ok) throw new Error(`Fish Audio respondió ${res.status}: ${await res.text()}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt >= RETRIES) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

// La respuesta llega en streaming y su cabecera WAV no trae los tamaños
// reales: se corrigen para que el navegador y ffmpeg midan bien la duración.
function fixWav(buf) {
  let offset = 12;
  while (offset + 8 <= buf.length) {
    const chunk = buf.toString("ascii", offset, offset + 4);
    if (chunk === "data") {
      const size = buf.length - offset - 8;
      buf.writeUInt32LE(size, offset + 4);
      buf.writeUInt32LE(buf.length - 8, 4);
      const byteRate = buf.readUInt32LE(28);
      return { buf, seconds: size / byteRate };
    }
    offset += 8 + buf.readUInt32LE(offset + 4);
  }
  throw new Error("El audio recibido no es un WAV válido.");
}

async function narrate(lesson) {
  const { id } = lesson;
  const audioDir = new URL(`./public/audio/${id}/`, import.meta.url);
  const manifestFile = new URL(`./src/generated/${id}.json`, import.meta.url);
  await mkdir(audioDir, { recursive: true });
  await mkdir(new URL("./src/generated/", import.meta.url), { recursive: true });
  const previous = (await exists(manifestFile))
    ? JSON.parse(await readFile(manifestFile, "utf8"))
    : { beats: [] };
  const beats = [];
  for (const [i, beat] of lesson.beats.entries()) {
    const hash = createHash("sha256")
      .update(`${MODEL}|${env.FISH_AUDIO_VOICE_ID}|${beat.say}`)
      .digest("hex")
      .slice(0, 12);
    const file = `${String(i + 1).padStart(2, "0")}-${hash}.wav`;
    const old = previous.beats[i];
    if (old?.file === file && (await exists(new URL(file, audioDir)))) {
      beats.push(old);
      continue;
    }
    process.stdout.write(`Narrando ${i + 1}/${lesson.beats.length}… `);
    const { buf, seconds } = fixWav(await synthesize(beat.say));
    await writeFile(new URL(file, audioDir), buf);
    beats.push({ file, seconds: Math.round(seconds * 1000) / 1000 });
    console.log(`${seconds.toFixed(1)} s`);
  }
  await writeFile(manifestFile, JSON.stringify({ id, beats }, null, 2) + "\n");
  const total = beats.reduce((s, b) => s + b.seconds, 0);
  console.log(`Listo: ${beats.length} frases, ${total.toFixed(0)} s de narración.`);
}

for (const lesson of lessons.filter((l) => !wanted.length || wanted.includes(l.id))) {
  console.log(`\n== ${lesson.id}`);
  await narrate(lesson);
}
