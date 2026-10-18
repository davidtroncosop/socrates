import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fustat";
import { LEAD } from "./timeline.js";
import { C, clamp01 } from "./anim.js";
import { Balance } from "./visuals/Balance.jsx";
import { Marked } from "./visuals/Text.jsx";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

// Promocional vertical (1080×1920): escenas con entrada en resorte y salida
// cruzada, fondo en movimiento continuo y subtítulos por frases cortas con la
// palabra que se está diciendo resaltada.
const EXIT = 14; // cuadros en que la escena anterior se funde con la nueva
const STAGE = { top: 230, bottom: 430 };

const smooth = (t, a, b) => interpolate(t, [a, b], [0, 1], { ...clamp01, easing: Easing.bezier(0.45, 0, 0.2, 1) });

function useEnter(t, delay = 0) {
  const { fps } = useVideoConfig();
  return spring({ frame: t - delay, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
}

function Background() {
  const f = useCurrentFrame();
  const blob = (color, size, x, y, speed, phase) => (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(90px)",
        opacity: 0.55,
        left: x + Math.sin(f / speed + phase) * 120,
        top: y + Math.cos(f / (speed * 1.3) + phase) * 140,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 55%, #fff8eb 100%)", overflow: "hidden" }}>
      {blob("#bfdbfe", 760, -260, 120, 70, 0)}
      {blob("#fde68a", 640, 560, 1150, 85, 2)}
      {blob("#c7d2fe", 520, 620, -120, 95, 4)}
    </AbsoluteFill>
  );
}

function Cards({ v, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      {v.items.map((item, i) => {
        const a = useEnter(t, 6 + i * 9);
        return (
          <div
            key={item.title}
            style={{
              width: 820,
              display: "flex",
              alignItems: "center",
              gap: 44,
              padding: "44px 56px",
              background: "#ffffff",
              borderRadius: 44,
              boxShadow: "0 30px 70px rgba(20, 60, 140, 0.14)",
              opacity: a,
              transform: `translateX(${(i % 2 ? 1 : -1) * 160 * (1 - a)}px) rotate(${(i % 2 ? 1 : -1) * 3 * (1 - a)}deg)`,
            }}
          >
            <div style={{ fontSize: 130, lineHeight: 1, transform: `scale(${0.6 + 0.4 * a})` }}>{item.icon}</div>
            <div style={{ fontSize: 76, fontWeight: 800 }}>{item.title}</div>
          </div>
        );
      })}
    </div>
  );
}

function Hero({ v, t }) {
  const a = useEnter(t, 4);
  const b = useEnter(t, 14);
  const f = useCurrentFrame();
  return (
    <div style={{ textAlign: "center", width: 900 }}>
      <div style={{ fontSize: 300, lineHeight: 1, transform: `scale(${a}) translateY(${Math.sin(f / 18) * 12}px)`, opacity: a }}>{v.icon}</div>
      <div style={{ fontSize: 110, fontWeight: 800, marginTop: 40, opacity: b, transform: `translateY(${50 * (1 - b)}px)` }}>{v.title}</div>
      <div style={{ fontSize: 56, color: C.muted, marginTop: 24, lineHeight: 1.3, opacity: b, transform: `translateY(${70 * (1 - b)}px)` }}>{v.text}</div>
    </div>
  );
}

// Teléfono con la captura de la app; la pantalla se desplaza con suavidad
// durante toda la escena y el teléfono flota levemente.
const PHONE_W = 720;
const PHONE_H = 1250;
const BEZEL = 22;
const NOTCH = 84; // franja superior libre, como la barra de estado de un teléfono
function Phone({ v, t, length }) {
  const f = useCurrentFrame();
  const a = useEnter(t, 2);
  const screenW = PHONE_W - 2 * BEZEL;
  const screenH = PHONE_H - 2 * BEZEL;
  const imgH = (v.h * screenW) / 1170;
  const maxScroll = Math.max(0, imgH - (screenH - NOTCH));
  const p = smooth(t, 20, Math.max(40, length - 10));
  const y = -maxScroll * (v.scroll[0] + (v.scroll[1] - v.scroll[0]) * p);
  return (
    <div
      style={{
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 86,
        background: "#0f172a",
        padding: BEZEL,
        boxShadow: "0 50px 120px rgba(15, 23, 42, 0.35)",
        opacity: a,
        transform: `translateY(${180 * (1 - a) + Math.sin(f / 30) * 8}px) rotate(${(1 - a) * -6 + Math.sin(f / 45) * 0.8}deg) scale(${0.9 + 0.1 * a})`,
      }}
    >
      <div style={{ width: screenW, height: screenH, borderRadius: 66, overflow: "hidden", background: C.bg, position: "relative" }}>
        <Img src={staticFile(`promo/${v.src}`)} style={{ width: screenW, position: "absolute", top: NOTCH + y, left: 0 }} />
        <div style={{ position: "absolute", top: 18, left: "50%", width: 190, height: 44, marginLeft: -95, borderRadius: 22, background: "#0f172a" }} />
      </div>
    </div>
  );
}

function BalanceScene({ v, t, beat }) {
  const a = useEnter(t, 2);
  const eq = useEnter(t, 10);
  const empty = { ...v, left: {}, right: {} };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: 4, opacity: eq, transform: `scale(${0.7 + 0.3 * eq})` }}>{v.eq}</div>
      <div style={{ width: 1080, height: 760, position: "relative", opacity: a, overflow: "visible" }}>
        <div style={{ position: "absolute", width: 1920, height: 1080, left: -420, top: -160, transform: "scale(0.65)", transformOrigin: "50% 50%" }}>
          <Balance prev={empty} cur={v} t={Math.max(0, t - 12)} beat={beat} area={{ top: 0, bottom: 0 }} />
        </div>
      </div>
    </div>
  );
}

function List({ v, t }) {
  const a = useEnter(t, 2);
  return (
    <div style={{ width: 900, background: "#fff", borderRadius: 48, padding: "64px 60px", boxShadow: "0 30px 70px rgba(20, 60, 140, 0.14)", opacity: a, transform: `scale(${0.9 + 0.1 * a})` }}>
      <div style={{ fontSize: 80, fontWeight: 800, color: C.blue, marginBottom: 30 }}>{v.title}</div>
      {v.items.map((item, i) => {
        const b = useEnter(t, 12 + i * 12);
        return (
          <div key={item} style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.25, margin: "34px 0", opacity: b, transform: `translateX(${-80 * (1 - b)}px)` }}>
            {item}
          </div>
        );
      })}
    </div>
  );
}

function End({ v, t }) {
  const f = useCurrentFrame();
  const a = useEnter(t, 2);
  const b = useEnter(t, 14);
  const c = useEnter(t, 26);
  return (
    <div style={{ textAlign: "center", width: 940, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Img src={staticFile("promo/logo.png")} style={{ width: 300, height: 300, objectFit: "contain", transform: `scale(${a}) rotate(${(1 - a) * -20}deg) translateY(${Math.sin(f / 20) * 10}px)` }} />
      <div style={{ fontSize: 140, fontWeight: 800, color: C.blue, marginTop: 20, opacity: b, transform: `translateY(${50 * (1 - b)}px)` }}>{v.title}</div>
      <div style={{ fontSize: 54, color: C.muted, marginTop: 30, opacity: c }}>{v.text}</div>
      <div
        style={{
          marginTop: 22,
          fontSize: 66,
          fontWeight: 800,
          color: "#fff",
          background: C.blue,
          borderRadius: 999,
          padding: "26px 56px",
          opacity: c,
          transform: `scale(${0.85 + 0.15 * c + Math.sin(f / 12) * 0.015})`,
          boxShadow: "0 24px 60px rgba(20, 92, 230, 0.35)",
        }}
      >
        {v.url}
      </div>
      <div style={{ fontSize: 50, fontWeight: 600, marginTop: 60, opacity: c }}>{v.tagline}</div>
    </div>
  );
}

const SCENES = { cards: Cards, hero: Hero, phone: Phone, balance: BalanceScene, list: List, end: End };

// Subtítulo por frases cortas (máximo 6 palabras); la palabra que se dice va
// resaltada. El tiempo de cada palabra es proporcional a su largo.
function Caption({ beat, t }) {
  const words = beat.caption.split(/\s+/);
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((s, w) => s + w, 0);
  const p = interpolate(t, [LEAD, LEAD + beat.speak], [0, 1], clamp01) * total;
  let acc = 0;
  let current = words.length - 1;
  for (let i = 0; i < words.length; i++) {
    acc += weights[i];
    if (p < acc) {
      current = i;
      break;
    }
  }
  const chunks = [];
  for (let i = 0; i < words.length; ) {
    const size = Math.min(6, words.length - i);
    chunks.push([i, i + size]);
    i += size;
  }
  const [from, to] = chunks.find(([a, b]) => current >= a && current < b) ?? chunks.at(-1);
  // Momento en que empezó esta frase, para animar su entrada.
  const startAt = weights.slice(0, from).reduce((s, w) => s + w, 0);
  const startT = LEAD + (startAt / total) * beat.speak;
  const { fps } = useVideoConfig();
  const pop = spring({ frame: t - startT, fps, config: { damping: 16, stiffness: 160 } });
  const visible = interpolate(t, [LEAD - 6, LEAD], [0, 1], clamp01);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 170, textAlign: "center", opacity: visible }}>
      <div
        style={{
          display: "inline-block",
          fontSize: 66,
          fontWeight: 800,
          lineHeight: 1.25,
          color: "#fff",
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: 32,
          padding: "26px 40px",
          transform: `scale(${0.92 + 0.08 * pop}) translateY(${20 * (1 - pop)}px)`,
        }}
      >
        {words.slice(from, to).map((w, i) => (
          <span key={from + i} style={{ color: from + i === current ? "#fcd34d" : from + i < current ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
            {w}{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PromoVertical({ lesson, timeline }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { beats } = timeline;
  // Escenas: pasos seguidos con la misma visualización forman una sola escena.
  const scenes = [];
  for (const b of beats) {
    const last = scenes.at(-1);
    if (last && last.visual === b.visual) last.end = b.from + b.duration;
    else scenes.push({ visual: b.visual, from: b.from, end: b.from + b.duration, beat: b });
  }
  const index = Math.max(0, beats.findLastIndex((b) => b.from <= frame));
  const beat = beats[index];
  return (
    <AbsoluteFill style={{ fontFamily, color: C.ink }}>
      <Background />
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: C.blue }} />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <Img src={staticFile("promo/logo.png")} style={{ width: 84, height: 84, objectFit: "contain" }} />
        <span style={{ fontSize: 60, fontWeight: 800, color: C.blue }}>socatres</span>
      </div>
      {scenes.map((s) => {
        if (frame < s.from || frame > s.end + EXIT) return null;
        const Scene = SCENES[s.visual.type];
        const t = frame - s.from;
        const out = smooth(frame, s.end, s.end + EXIT);
        return (
          <AbsoluteFill
            key={s.from}
            style={{
              top: STAGE.top,
              bottom: STAGE.bottom,
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - out,
              transform: `scale(${1 - 0.06 * out}) translateY(${-40 * out}px)`,
            }}
          >
            <Scene v={s.visual} t={t} length={s.end - s.from} beat={s.beat} />
          </AbsoluteFill>
        );
      })}
      <Caption beat={beat} t={frame - beat.from} />
      {beats.map((b) => (
        <Sequence key={b.audio} from={b.from + LEAD} durationInFrames={b.duration - LEAD}>
          <Audio src={staticFile(`audio/${lesson.id}/${b.audio}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
