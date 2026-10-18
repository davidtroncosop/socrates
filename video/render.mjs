// Renderiza las lecciones narradas a out/<id>.mp4 (un solo empaquetado).
// Uso: npm run render (todas) o npm run render -- equations signs
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { lessons } from "./lessons/index.mjs";

const wanted = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: new URL("./src/index.jsx", import.meta.url).pathname });
for (const { id } of lessons.filter((l) => !wanted.length || wanted.includes(l.id))) {
  const composition = await selectComposition({ serveUrl, id });
  const outputLocation = new URL(`./out/${id}.mp4`, import.meta.url).pathname;
  const started = Date.now();
  // Con la máquina ocupada, cargar fuentes y audio puede tardar más de los 30 s por defecto.
  await renderMedia({ serveUrl, composition, codec: "h264", outputLocation, crf: 23, timeoutInMilliseconds: Number(process.env.RENDER_TIMEOUT) || 120000,
    // Con poca memoria libre, RENDER_CONCURRENCY=1 evita que el navegador se caiga.
    ...(process.env.RENDER_CONCURRENCY ? { concurrency: Number(process.env.RENDER_CONCURRENCY) } : {}) });
  console.log(`${id}: ${(composition.durationInFrames / composition.fps).toFixed(0)} s de video, renderizado en ${((Date.now() - started) / 1000).toFixed(0)} s`);
}
