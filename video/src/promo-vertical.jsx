import { registerRoot, Composition } from "remotion";
import { PromoVertical } from "./PromoVertical.jsx";
import { buildTimeline, FPS } from "./timeline.js";
import promo from "../promo/socatres-vertical.mjs";
import narration from "./generated/promo-socatres.json";

// Promocional vertical (9:16) con la misma narración que el horizontal.
const timeline = buildTimeline(promo, narration);
registerRoot(() => (
  <Composition
    id="promo-socatres-vertical"
    component={PromoVertical}
    durationInFrames={timeline.duration}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ lesson: promo, timeline }}
  />
));
