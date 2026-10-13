// Sube los videos renderizados a R2 y actualiza ../public/lesson-videos.js.
// Cada archivo lleva su huella en el nombre, así se puede guardar en caché
// para siempre y un video nuevo nunca choca con la copia vieja.
// Uso: npm run upload (todas las que estén en out/) o npm run upload -- equations
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, readFile, writeFile } from "node:fs/promises";
import { lessons } from "./lessons/index.mjs";
import { buildTimeline, FPS } from "./src/timeline.js";

const BUCKET = process.env.R2_BUCKET || "socatres-videos";
const manifestFile = new URL("../public/lesson-videos.js", import.meta.url);
const wanted = process.argv.slice(2);
const exists = (url) => access(url).then(() => true, () => false);

const current = await import(manifestFile.href).then((m) => m.lessonVideos);
const videos = { ...current };
for (const lesson of lessons.filter((l) => !wanted.length || wanted.includes(l.id))) {
  const file = new URL(`./out/${lesson.id}.mp4`, import.meta.url);
  if (!(await exists(file))) continue;
  const data = await readFile(file);
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 10);
  const key = `lessons/${lesson.id}-${hash}.mp4`;
  const src = `/media/${key}`;
  if (videos[lesson.id]?.src !== src) {
    execFileSync("npx", ["wrangler", "r2", "object", "put", `${BUCKET}/${key}`, "--file", file.pathname, "--content-type", "video/mp4", "--remote"], { stdio: ["ignore", "ignore", "inherit"] });
    console.log(`Subido ${key} (${(data.length / 1e6).toFixed(1)} MB)`);
  }
  const narration = JSON.parse(await readFile(new URL(`./src/generated/${lesson.id}.json`, import.meta.url), "utf8"));
  const duration = Math.round(buildTimeline(lesson, narration).duration / FPS);
  videos[lesson.id] = { src, title: `${lesson.title}: explicado en video`, duration };
}
const body = Object.entries(videos)
  .map(([id, v]) => `  ${JSON.stringify(id)}: ${JSON.stringify(v)},`)
  .join("\n");
await writeFile(
  manifestFile,
  `// Generado por \`npm run upload\` en video/. No editar a mano.\n// Videos propios de cada lección (animados y narrados), servidos desde R2.\nexport const lessonVideos = {\n${body}\n};\n`,
);
console.log(`public/lesson-videos.js: ${Object.keys(videos).length} videos.`);
