import { registerRoot, Composition } from "remotion";
import { PromoVertical } from "./PromoVertical.jsx";
import { buildTimeline, FPS } from "./timeline.js";
import promo from "../promo/socatres-vertical.mjs";

// Promocional vertical (9:16): una composición por cada narración del guion
// (promo-socatres, promo-socatres-voz2, …), con id «<narración>-vertical».
const manifests = require.context("./generated", false, /^\.\/promo-socatres.*\.json$/);
registerRoot(() =>
  manifests.keys().map((key) => {
    const narration = manifests(key);
    const lesson = { ...promo, id: narration.id };
    const timeline = buildTimeline(lesson, narration);
    return (
      <Composition
        key={narration.id}
        id={`${narration.id}-vertical`}
        component={PromoVertical}
        durationInFrames={timeline.duration}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ lesson, timeline }}
      />
    );
  }),
);
