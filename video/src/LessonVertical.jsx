import { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fustat";
import { LEAD } from "./timeline.js";
import { C, clamp01 } from "./anim.js";
import { VISUALS } from "./Lesson.jsx";
import { Marked } from "./visuals/Text.jsx";
import { Background, Caption } from "./PromoVertical.jsx";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

// Lección en formato vertical (1080×1920): para la app en el celular y para
// reels. Las visualizaciones están hechas para un lienzo de 1920×1080 (los
// dibujos SVG con coordenadas fijas, centrados en x = 960). Cada paso se
// encuadra solo: se mide lo que de verdad se dibuja en su estado final y se
// escala y centra para llenar el espacio entre la ecuación y los subtítulos.
// Las de texto se arman en un lienzo más angosto para que sus líneas quepan.
const NARROW = new Set(["cards", "steps", "list", "lines", "table", "passage"]);
const BOX = { top: 560, height: 880, width: 1000 }; // espacio para el dibujo
const MAX_SCALE = 1.8;
const canvasWidth = (visual) => (NARROW.has(visual?.type) ? BOX.width : 1920);

// Medida del contenido real: solo lo que pinta algo. En SVG, las figuras y
// textos; en HTML, elementos con texto propio, fondo, borde, sombra o imagen.
// Los contenedores de diseño (invisibles, a veces de ancho completo) no cuentan.
const SVG_SKIP = new Set(["svg", "defs", "g", "linearGradient", "radialGradient", "stop", "clipPath", "mask", "pattern", "filter", "tspan"]);
const transparent = (c) => !c || c === "transparent" || /rgba\([^)]*,\s*0\)$/.test(c);
function paints(el) {
  if (el instanceof SVGElement) return !SVG_SKIP.has(el.tagName) && !el.closest("defs");
  if (el.tagName === "IMG") return true;
  if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return true;
  const st = getComputedStyle(el);
  return !transparent(st.backgroundColor) || st.backgroundImage !== "none" || st.boxShadow !== "none" ||
    ["Top", "Right", "Bottom", "Left"].some((side) => parseFloat(st[`border${side}Width`]) > 0 && !transparent(st[`border${side}Color`]));
}
function measure(root, width) {
  const base = root.getBoundingClientRect();
  const k = base.width / width || 1; // el Studio muestra el video reducido
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const el of root.querySelectorAll("*")) {
    if (!paints(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    x0 = Math.min(x0, (r.left - base.left) / k);
    y0 = Math.min(y0, (r.top - base.top) / k);
    x1 = Math.max(x1, (r.right - base.left) / k);
    y1 = Math.max(y1, (r.bottom - base.top) / k);
  }
  if (!Number.isFinite(x0)) return { scale: 0.56, cx: width / 2, cy: 540 };
  const pad = 30;
  const scale = Math.min(MAX_SCALE, BOX.width / (x1 - x0 + 2 * pad), BOX.height / (y1 - y0 + 2 * pad));
  return { scale, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

// Copia invisible del paso en su estado final, solo para medirlo.
function useFit(visual, beat) {
  const ref = useRef(null);
  const [fit, setFit] = useState(null);
  useLayoutEffect(() => {
    if (ref.current) setFit(measure(ref.current, canvasWidth(visual)));
  }, [visual]);
  const probe = visual ? (
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, width: canvasWidth(visual), height: 1080, visibility: "hidden", pointerEvents: "none" }}>
      <Visual visual={visual} prev={null} t={100000} beat={beat} />
    </div>
  ) : null;
  return [fit, probe];
}

function Stage({ visual, fit, children }) {
  if (!fit) return null;
  const { scale, cx, cy } = fit;
  return (
    <div style={{ position: "absolute", top: BOX.top + BOX.height / 2 - cy * scale, left: 540 - cx * scale, width: canvasWidth(visual), height: 1080, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      {children}
    </div>
  );
}
// Entre dos pasos del mismo dibujo con distinto tamaño, el encuadre se mueve suave.
const blend = (a, b, k) => (a && b ? { scale: a.scale + (b.scale - a.scale) * k, cx: a.cx + (b.cx - a.cx) * k, cy: a.cy + (b.cy - a.cy) * k } : b);
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
  const [curFit, curProbe] = useFit(cur.visual, cur);
  const [prevFit, prevProbe] = useFit(prev?.visual, prev);
  const move = spring({ frame: t, fps, config: { damping: 20, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ fontFamily, color: C.ink }}>
      <Background still={!url} />
      {curProbe}
      {prevProbe}
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
            <Stage visual={cur.visual} fit={sameVisual ? curFit : blend(prevFit, curFit, move)}>
              <Visual visual={cur.visual} prev={sameVisual ? null : prev.visual} t={sameVisual ? 1000 : t} beat={cur} />
            </Stage>
          ) : (
            <>
              {prev?.visual && (
                <AbsoluteFill style={{ opacity: fadeOut, transform: `scale(${1 - 0.05 * (1 - fadeOut)})` }}>
                  <Stage visual={prev.visual} fit={prevFit}>
                    <Visual visual={prev.visual} prev={null} t={1000} beat={prev} />
                  </Stage>
                </AbsoluteFill>
              )}
              <AbsoluteFill style={{ opacity: prev ? fadeIn : 1, transform: `translateY(${prev ? 60 * (1 - fadeIn) : 0}px) scale(${prev ? 0.94 + 0.06 * fadeIn : 1})` }}>
                <Stage visual={cur.visual} fit={curFit}>
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
