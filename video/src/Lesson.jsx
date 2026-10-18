import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fustat";
import { LEAD } from "./timeline.js";
import { C, clamp01 } from "./anim.js";
import { Balance } from "./visuals/Balance.jsx";
import { Screen } from "./visuals/Screen.jsx";
import { Cards, List, Lines, Marked, Passage, Steps, Table } from "./visuals/Text.jsx";
import { Angles, Bars, Bell, Curve, Galton, Inscribed, Parabola, Pie, Plane, Poly, Sector, Tales, Trapezoid } from "./visuals/Geo.jsx";
import { Area, Bar, Chart, Circle, Freq, Grid100, NumberLine, Shape, Tokens, Triangle } from "./visuals/Math.jsx";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

const VISUALS = {
  balance: Balance,
  cards: Cards,
  steps: Steps,
  list: List,
  lines: Lines,
  table: Table,
  passage: Passage,
  numberline: NumberLine,
  tokens: Tokens,
  grid100: Grid100,
  bar: Bar,
  area: Area,
  circle: Circle,
  triangle: Triangle,
  chart: Chart,
  freq: Freq,
  shape: Shape,
  angles: Angles,
  pie: Pie,
  bars: Bars,
  poly: Poly,
  trapezoid: Trapezoid,
  plane: Plane,
  sector: Sector,
  tales: Tales,
  galton: Galton,
  parabola: Parabola,
  inscribed: Inscribed,
  bell: Bell,
  curve: Curve,
  screen: Screen,
};

// Zona disponible para la visualización: bajo la ecuación (si hay) y sobre
// los subtítulos.
const areaFor = (beat) => ({ top: beat.eq ? 260 : 130, bottom: 200 });

function Visual({ visual, prev, t, beat }) {
  if (!visual) return null;
  const Component = VISUALS[visual.type];
  if (!Component) throw new Error(`Visualización desconocida: ${visual.type}`);
  return <Component prev={prev} cur={visual} t={t} beat={beat} area={areaFor(beat)} />;
}

function EquationLine({ prev, cur, t }) {
  if (prev.eq === cur.eq) return <div style={styles.eq}>{cur.eq && <Marked text={cur.eq} />}</div>;
  const out = interpolate(t, [0, 8], [1, 0], clamp01);
  const inn = interpolate(t, [6, 16], [0, 1], clamp01);
  return (
    <>
      <div style={{ ...styles.eq, opacity: out, transform: `translateY(${-20 * (1 - out)}px)` }}>{prev.eq && <Marked text={prev.eq} />}</div>
      <div style={{ ...styles.eq, opacity: inn, transform: `translateY(${20 * (1 - inn)}px)` }}>{cur.eq && <Marked text={cur.eq} />}</div>
    </>
  );
}

export function Lesson({ lesson, timeline }) {
  const frame = useCurrentFrame();
  const { beats } = timeline;
  const index = Math.max(0, beats.findLastIndex((b) => b.from <= frame));
  const cur = beats[index];
  const prev = beats[index - 1] ?? null;
  const t = frame - cur.from;
  const sameVisual = prev && prev.visual === cur.visual;
  const sameType = prev && prev.visual && cur.visual && prev.visual.type === cur.visual.type;
  const captionIn = interpolate(t, [LEAD - 4, LEAD + 4], [0, 1], clamp01);
  // Mismo tipo: la visualización anima el cambio. Distinto: se funden.
  const fadeOut = interpolate(t, [0, 10], [1, 0], clamp01);
  const fadeIn = interpolate(t, [6, 18], [0, 1], clamp01);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily, color: C.ink }}>
      <div style={styles.header}>
        <span style={{ color: C.blue, fontWeight: 800 }}>socatres</span>
        <span style={{ color: C.muted }}>
          {lesson.grade} · {lesson.title}
        </span>
      </div>
      {sameVisual || sameType ? (
        <Visual visual={cur.visual} prev={sameVisual ? null : prev.visual} t={sameVisual ? 1000 : t} beat={cur} />
      ) : (
        <>
          {prev?.visual && (
            <AbsoluteFill style={{ opacity: fadeOut }}>
              <Visual visual={prev.visual} prev={null} t={1000} beat={prev} />
            </AbsoluteFill>
          )}
          <AbsoluteFill style={{ opacity: prev ? fadeIn : 1, transform: `translateY(${prev ? 16 * (1 - fadeIn) : 0}px)` }}>
            <Visual visual={cur.visual} prev={null} t={t} beat={cur} />
          </AbsoluteFill>
        </>
      )}
      <EquationLine prev={prev ?? cur} cur={cur} t={t} />
      <div style={{ ...styles.caption, opacity: captionIn }}>{cur.caption}</div>
      {beats.map((b) => (
        <Sequence key={b.audio} from={b.from + LEAD} durationInFrames={b.duration - LEAD}>
          <Audio src={staticFile(`audio/${lesson.id}/${b.audio}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

const styles = {
  header: { position: "absolute", top: 40, left: 60, right: 60, display: "flex", justifyContent: "space-between", fontSize: 32 },
  eq: { position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontSize: 96, fontWeight: 800, letterSpacing: 2, whiteSpace: "pre" },
  caption: {
    position: "absolute",
    bottom: 36,
    left: 180,
    right: 180,
    textAlign: "center",
    fontSize: 36,
    fontWeight: 500,
    lineHeight: 1.35,
    color: "#ffffff",
    background: "rgba(15, 23, 42, 0.86)",
    borderRadius: 18,
    padding: "16px 32px",
  },
};
