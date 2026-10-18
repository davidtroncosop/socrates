import { registerRoot, Composition } from "remotion";
import { Lesson } from "./Lesson.jsx";
import { buildTimeline, FPS } from "./timeline.js";
import promo from "../promo/socatres.mjs";
import narration from "./generated/promo-socatres.json";

// Video promocional: misma presentación que las lecciones, aparte del catálogo.
const timeline = buildTimeline(promo, narration);
registerRoot(() => (
  <Composition
    id={promo.id}
    component={Lesson}
    durationInFrames={timeline.duration}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ lesson: promo, timeline }}
  />
));
