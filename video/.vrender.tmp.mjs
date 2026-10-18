import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const serveUrl = await bundle({ entryPoint: new URL("./src/promo-vertical.jsx", import.meta.url).pathname });
const composition = await selectComposition({ serveUrl, id: "promo-socatres-vertical" });
const started = Date.now();
await renderMedia({ serveUrl, composition, codec: "h264", outputLocation: new URL("./out/promo-socatres-vertical.mp4", import.meta.url).pathname, crf: 20, concurrency: 2, timeoutInMilliseconds: 600000 });
console.log(`listo en ${((Date.now() - started) / 1000).toFixed(0)} s`);
