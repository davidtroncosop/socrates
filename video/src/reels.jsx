import { registerRoot, Composition } from "remotion";
import { LessonVertical, OUTRO } from "./LessonVertical.jsx";
import { buildTimeline, FPS } from "./timeline.js";
import { reels, REEL_URL } from "../reels/index.mjs";

// Reels verticales: solo los ya narrados (`SCRIPT=reels/<id>.mjs npm run narrate`).
const manifests = require.context("./generated", false, /^\.\/reel-.*\.json$/);
const narrated = Object.fromEntries(manifests.keys().map((k) => [manifests(k).id, manifests(k)]));

registerRoot(() =>
  reels
    .filter((r) => narrated[r.id])
    .map((lesson) => {
      const timeline = buildTimeline(lesson, narrated[lesson.id]);
      return (
        <Composition
          key={lesson.id}
          id={lesson.id}
          component={LessonVertical}
          durationInFrames={timeline.duration + OUTRO}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ lesson, timeline, url: REEL_URL }}
        />
      );
    }),
);
