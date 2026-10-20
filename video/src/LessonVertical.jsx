import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fustat";
import { LEAD } from "./timeline.js";
import { C, clamp01 } from "./anim.js";
import { VISUALS } from "./Lesson.jsx";
import { Marked } from "./visuals/Text.jsx";
import { Background, Caption } from "./PromoVertical.jsx";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

// Lección en formato reel (1080×1920). Las visualizaciones de las lecciones
// están hechas para 1920×1080: se dibujan en ese lienzo, reducido al ancho
// del celular, con la ecuación grande encima y subtítulos por frases abajo.
// Las escenas de dibujo (balanza, gráficos) necesitan el ancho completo del
// lienzo; las de texto se dibujan en un lienzo más angosto y se ven más grandes.
const WIDE = new Set(["balance", "numberline", "plane", "chart", "bars", "freq", "galton", "curve", "parabola", "bell"]);
// Desarrollos y tablas tienen líneas largas: tamaño intermedio.
const MEDIUM = new Set(["lines", "table", "passage"]);
const STAGE_TOP = 600;
function Stage({ visual, children }) {
  const wide = !visual || WIDE.has(visual.type);
  const scale = wide ? 0.66 : MEDIUM.has(visual.type) ? 0.72 : 0.92;
  const width = wide ? 1920 : Math.round(1080 / scale);
  return (
    <div style={{ position: "absolute", top: STAGE_TOP, left: (1080 - width * scale) / 2, width, height: 1080, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      {children}
    </div>
  );
}
export const OUTRO = 90; // cuadros del cierre con la marca

function Visual({ visual, prev, t, beat }) {
  if (!visual) return null;
  const Component = VISUALS[visual.type];
  if (!Component) throw new Error(`Visualización desconocida: ${visual.type}`);
  return <Component prev={prev} cur={visual} t={t} beat={beat} area={{ top: 40, bottom: 40 }} />;
}

// La ecuación se achica si es larga, para que quepa en el ancho del celular.
function Equation({ text, opacity, y }) {
  const plain = text.replace(/\[\[|\]\]|\{\{|\}\}|~~/g, "");
  const size = Math.min(130, Math.floor(1700 / Math.max(1, plain.length)));
  return (
    <div style={{ position: "absolute", top: 360, left: 40, right: 40, textAlign: "center", fontSize: size, fontWeight: 800, letterSpacing: 2, whiteSpace: "pre", opacity, transform: `translateY(${y}px)` }}>
      {text && <Marked text={text} />}
    </div>
  );
}

function Outro({ t, url }) {
  const { fps } = useVideoConfig();
  const a = spring({ frame: t, fps, config: { damping: 16, stiffness: 120 } });
  const b = spring({ frame: t - 10, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: interpolate(t, [0, 10], [0, 1], clamp01) }}>
      <Img src={staticFile("promo/logo.png")} style={{ width: 320, height: 320, objectFit: "contain", transform: `scale(${a})` }} />
      <div style={{ fontSize: 140, fontWeight: 800, color: C.blue, marginTop: 20, opacity: b }}>socatres</div>
      <div style={{ fontSize: 56, color: C.muted, marginTop: 20, opacity: b }}>Más lecciones paso a paso en</div>
      <div style={{ marginTop: 26, fontSize: 64, fontWeight: 800, color: "#fff", background: C.blue, borderRadius: 999, padding: "24px 54px", opacity: b, transform: `scale(${0.85 + 0.15 * b})` }}>{url}</div>
    </AbsoluteFill>
  );
}

export function LessonVertical({ lesson, timeline, url }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beats } = timeline;
  const index = Math.max(0, beats.findLastIndex((b) => b.from <= frame));
  const cur = beats[index];
  const prev = beats[index - 1] ?? null;
  const t = frame - cur.from;
  const sameVisual = prev && prev.visual === cur.visual;
  const sameType = prev && prev.visual && cur.visual && prev.visual.type === cur.visual.type;
  const fadeOut = interpolate(t, [0, 12], [1, 0], clamp01);
  const fadeIn = spring({ frame: t - 6, fps, config: { damping: 20, stiffness: 110 } });
  const eqOut = interpolate(t, [0, 8], [1, 0], clamp01);
  const eqIn = spring({ frame: t - 6, fps, config: { damping: 18, stiffness: 140 } });
  const ending = frame >= timeline.duration;
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ fontFamily, color: C.ink }}>
      <Background />
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${Math.min(1, frame / timeline.duration) * 100}%`, background: C.blue }} />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: intro, transform: `translateY(${-30 * (1 - intro)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("promo/logo.png")} style={{ width: 80, height: 80, objectFit: "contain" }} />
          <span style={{ fontSize: 56, fontWeight: 800, color: C.blue }}>socatres</span>
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, background: "#fff", borderRadius: 999, padding: "14px 34px", boxShadow: "0 12px 30px rgba(20,60,140,0.12)" }}>
          {lesson.title}
          <span style={{ color: C.muted, fontWeight: 600 }}> · {lesson.grade}</span>
        </div>
      </div>
      {ending ? (
        <Outro t={frame - timeline.duration} url={url} />
      ) : (
        <>
          {prev && prev.eq !== cur.eq ? (
            <>
              <Equation text={prev.eq} opacity={eqOut} y={-24 * (1 - eqOut)} />
              <Equation text={cur.eq} opacity={eqIn} y={24 * (1 - eqIn)} />
            </>
          ) : (
            <Equation text={cur.eq} opacity={1} y={0} />
          )}
          {sameVisual || sameType ? (
            <Stage visual={cur.visual}>
              <Visual visual={cur.visual} prev={sameVisual ? null : prev.visual} t={sameVisual ? 1000 : t} beat={cur} />
            </Stage>
          ) : (
            <>
              {prev?.visual && (
                <AbsoluteFill style={{ opacity: fadeOut, transform: `scale(${1 - 0.05 * (1 - fadeOut)})` }}>
                  <Stage visual={prev.visual}>
                    <Visual visual={prev.visual} prev={null} t={1000} beat={prev} />
                  </Stage>
                </AbsoluteFill>
              )}
              <AbsoluteFill style={{ opacity: prev ? fadeIn : 1, transform: `translateY(${prev ? 60 * (1 - fadeIn) : 0}px) scale(${prev ? 0.94 + 0.06 * fadeIn : 1})` }}>
                <Stage visual={cur.visual}>
                  <Visual visual={cur.visual} prev={null} t={t} beat={cur} />
                </Stage>
              </AbsoluteFill>
            </>
          )}
          <Caption beat={cur} t={t} />
        </>
      )}
      {beats.map((b) => (
        <Sequence key={b.audio} from={b.from + LEAD} durationInFrames={b.duration - LEAD}>
          <Audio src={staticFile(`audio/${lesson.id}/${b.audio}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
