import { interpolate, spring, useVideoConfig } from "remotion";
import { C, clamp01, lerp, progress } from "../anim.js";

// La balanza: bolsas misteriosas (x), medias bolsas (0,5x) y bolitas (1).
// Se inclina sola según el peso real de cada plato.
const PX = 960;
const PY = 470;
const HALF = 520;
const HANG = 170;
const PLATE = 420;
const BALL = 17;
const MAX_TILT = 11;

const side = (v, name) => ({ bags: 0, halves: 0, balls: 0, ...(v[name] ?? {}) });
const weight = (s, x) => s.bags * x + (s.halves * x) / 2 + s.balls;
const tiltOf = (v) =>
  Math.max(-MAX_TILT, Math.min(MAX_TILT, (weight(side(v, "left"), v.x) - weight(side(v, "right"), v.x)) * 2.2));

// Las bolsas (y medias bolsas) van a la izquierda del plato; las bolitas, a la derecha.
const holders = (s) => s.bags + s.halves;
function ballSpot(v, name, i) {
  const s = side(v, name);
  if (name === "right" && v.groups && holders(s) === 0) {
    const perGroup = Math.ceil(s.balls / 2) || 1;
    const g = Math.floor(i / perGroup);
    const j = i % perGroup;
    return { x: (g === 0 ? -100 : 100) + ((j % 3) - 1) * 38, y: -BALL - Math.floor(j / 3) * 35 };
  }
  if (holders(s) > 0) {
    const start = -PLATE / 2 + holders(s) * 100 + 40;
    const cols = Math.max(3, Math.floor((PLATE / 2 - 20 - start) / 38) + 1);
    return { x: start + (i % cols) * 38, y: -BALL - Math.floor(i / cols) * 35 };
  }
  return { x: ((i % 5) - 2) * 38, y: -BALL - Math.floor(i / 5) * 35 };
}
const holderSpot = (i) => ({ x: -PLATE / 2 + 55 + i * 100, y: 0 });

// Elementos que aparecen, se quedan o salen volando entre dos pasos.
function items(prevCount, curCount, p, spot) {
  return Array.from({ length: Math.max(prevCount, curCount) }, (_, i) => {
    const a = spot.prev(i);
    const b = spot.cur(i);
    const leaving = i >= curCount;
    const arriving = i >= prevCount;
    const pos = leaving ? a : arriving ? b : { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) };
    return {
      key: i,
      x: pos.x,
      y: pos.y + (leaving ? -160 * p : arriving ? -120 * (1 - p) : 0),
      opacity: leaving ? 1 - p : arriving ? p : 1,
    };
  });
}

const Ball = ({ x, y, opacity }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <circle r={BALL} fill={C.blue} />
    <circle r={BALL * 0.35} cx={-5} cy={-6} fill="#ffffff" opacity={0.45} />
  </g>
);

const Bag = ({ x, y, opacity, value, reveal, half }) => (
  <g transform={`translate(${x} ${y}) scale(${half ? 0.72 : 1})`} opacity={opacity}>
    <path
      d="M -42 0 Q -50 -60 -22 -88 L -14 -100 L 14 -100 L 22 -88 Q 50 -60 42 0 Z"
      fill={half ? C.amberSoft : C.amber}
      stroke={C.amberDark}
      strokeWidth={4}
      strokeDasharray={half ? "10 7" : undefined}
    />
    <rect x={-20} y={-96} width={40} height={9} rx={4} fill={C.amberDark} />
    <text y={-30} textAnchor="middle" fontSize={half ? 40 : 44} fontWeight={800} fill={half ? C.amberDark : "#ffffff"} opacity={1 - reveal}>
      {half ? "½x" : "x"}
    </text>
    <g opacity={reveal}>
      <circle cy={-44} r={27} fill="#ffffff" />
      <text y={-29} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.amberDark}>
        {half ? value / 2 : value}
      </text>
    </g>
  </g>
);

export function Balance({ prev, cur, t }) {
  const { fps } = useVideoConfig();
  const before = prev ?? cur;
  const p = prev ? progress(t) : 1;
  // La balanza reacciona después de que se mueven las bolitas, con un vaivén.
  const swing = prev ? spring({ frame: t - 10, fps, config: { damping: 7, stiffness: 70, mass: 0.9 } }) : 1;
  const angle = lerp(tiltOf(before), tiltOf(cur), swing);
  const rad = (angle * Math.PI) / 180;
  const ends = {
    left: { x: PX - HALF * Math.cos(rad), y: PY + HALF * Math.sin(rad) },
    right: { x: PX + HALF * Math.cos(rad), y: PY - HALF * Math.sin(rad) },
  };
  const pivot = interpolate(t, [0, 12], [before.pivot ? 1 : 0, cur.pivot ? 1 : 0], clamp01);
  const reveal = interpolate(t, [4, 16], [before.reveal ? 1 : 0, cur.reveal ? 1 : 0], clamp01);
  const value = cur.x === before.x || p > 0.5 ? cur.x : before.x;

  const plate = (name) => {
    const end = ends[name];
    const cx = end.x;
    const cy = end.y + HANG;
    const a = side(before, name);
    const b = side(cur, name);
    const balls = items(a.balls, b.balls, p, {
      prev: (i) => ballSpot(before, name, i),
      cur: (i) => ballSpot(cur, name, i),
    });
    const bags = items(a.bags, b.bags, p, { prev: holderSpot, cur: holderSpot });
    const halves = items(a.halves, b.halves, p, {
      prev: (i) => holderSpot(a.bags + i),
      cur: (i) => holderSpot(b.bags + i),
    });
    return (
      <g key={name}>
        <line x1={end.x} y1={end.y} x2={cx - PLATE / 2 + 20} y2={cy} stroke={C.line} strokeWidth={3} />
        <line x1={end.x} y1={end.y} x2={cx + PLATE / 2 - 20} y2={cy} stroke={C.line} strokeWidth={3} />
        <g transform={`translate(${cx} ${cy})`}>
          {bags.map((g) => (
            <Bag key={`b${g.key}`} x={g.x} y={g.y} opacity={g.opacity} value={value} reveal={reveal} />
          ))}
          {halves.map((g) => (
            <Bag key={`h${g.key}`} x={g.x} y={g.y} opacity={g.opacity} value={value} reveal={reveal} half />
          ))}
          {balls.map((g) => (
            <Ball key={g.key} x={g.x} y={g.y} opacity={g.opacity} />
          ))}
          <path d={`M ${-PLATE / 2} 0 L ${PLATE / 2} 0 L ${PLATE / 2 - 30} 22 L ${-PLATE / 2 + 30} 22 Z`} fill="#94a3b8" />
        </g>
      </g>
    );
  };

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={PX - 14} y={PY} width={28} height={400} rx={10} fill={C.beam} />
      <rect x={PX - 170} y={PY + 390} width={340} height={26} rx={13} fill={C.beam} />
      <line x1={ends.left.x} y1={ends.left.y} x2={ends.right.x} y2={ends.right.y} stroke={C.beam} strokeWidth={16} strokeLinecap="round" />
      {plate("left")}
      {plate("right")}
      <circle cx={PX} cy={PY} r={34 + 8 * pivot} fill={pivot > 0.5 ? C.blue : C.beam} />
      <text x={PX} y={PY + 17} textAnchor="middle" fontSize={50 + 10 * pivot} fontWeight={800} fill="#ffffff">
        =
      </text>
      <g opacity={pivot}>
        <text x={PX} y={PY - 70} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.blue}>
          el signo igual es el punto de apoyo
        </text>
      </g>
    </svg>
  );
}
