import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const serveUrl = await bundle({ entryPoint: new URL("./src/reels.jsx", import.meta.url).pathname });
const composition = await selectComposition({ serveUrl, id: "reel-equations" });
const started = Date.now();
await renderMedia({ serveUrl, composition, codec: "h264", outputLocation: new URL("./out/reel-equations.mp4", import.meta.url).pathname, crf: 20, concurrency: 2, timeoutInMilliseconds: 600000 });
console.log(`${(composition.durationInFrames / 30).toFixed(0)} s, listo en ${((Date.now() - started) / 1000).toFixed(0)} s`);
