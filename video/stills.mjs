// Un cuadro por paso (al final de cada frase), para revisar rápido.
// Uso: npm run stills -- equations signs  →  out/stills/<id>/NN.jpg
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";

const ids = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: new URL("./src/index.jsx", import.meta.url).pathname });
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id });
  const dir = new URL(`./out/stills/${id}/`, import.meta.url).pathname;
  await mkdir(dir, { recursive: true });
  for (const [i, beat] of composition.props.timeline.beats.entries()) {
    const frame = beat.from + beat.duration - 8;
    await renderStill({ serveUrl, composition, frame, output: `${dir}${String(i + 1).padStart(2, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 70, scale: 0.5 });
  }
  console.log(`${id}: ${composition.props.timeline.beats.length} cuadros en ${dir}`);
}
