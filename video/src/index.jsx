import { registerRoot, Composition } from "remotion";
import { Lesson } from "./Lesson.jsx";
import { buildTimeline, FPS } from "./timeline.js";
import { lessons } from "../lessons/index.mjs";

// Solo se registran las lecciones ya narradas (`npm run narrate`).
const manifests = require.context("./generated", false, /\.json$/);
const narrated = Object.fromEntries(manifests.keys().map((k) => [manifests(k).id, manifests(k)]));

const Root = () =>
  lessons
    .filter((lesson) => narrated[lesson.id])
    .map((lesson) => {
      const timeline = buildTimeline(lesson, narrated[lesson.id]);
      return (
        <Composition
          key={lesson.id}
          id={lesson.id}
          component={Lesson}
          durationInFrames={timeline.duration}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ lesson, timeline }}
        />
      );
    });

registerRoot(Root);
