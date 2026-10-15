import { C, ease } from "../anim.js";
import { LEAD } from "../timeline.js";

const svgFill = { position: "absolute", inset: 0 };
const during = (t, beat, share = 0.6) => ease(t, LEAD, LEAD + Math.max(20, beat.speak * share));
const rad = (deg) => (deg * Math.PI) / 180;
// Punto a una distancia y ángulo (grados, sentido matemático: y hacia arriba).
const at = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
// Arco desde `start` que abre `span` grados en sentido antihorario.
function arc(cx, cy, r, start, span) {
  const [x1, y1] = at(cx, cy, r, start);
  const [x2, y2] = at(cx, cy, r, start + span);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${x2} ${y2} Z`;
}
const PAIR = [C.blue, C.amber];
const SOFT = ["#bfdbfe", C.amberSoft];

function AngleMark({ cx, cy, start, span, label, color, soft, o, r = 90 }) {
  if (label === undefined || label === null) return null;
  const [lx, ly] = at(cx, cy, r + 62, start + span / 2);
  return (
    <g opacity={o}>
      <path d={arc(cx, cy, r, start, span * o)} fill={soft} stroke={color} strokeWidth={4} />
      <text x={lx} y={ly + 16} textAnchor="middle" fontSize={46} fontWeight={800} fill={color}>
        {label}
      </text>
    </g>
  );
}

// Ángulos entre rectas que se cortan, en una recta (suplementarios) y en un
// triángulo o cuadrilátero. `labels` nombra cada ángulo; null lo oculta.
export function Angles({ prev, cur, t, beat }) {
  const same = prev && prev.kind === cur.kind && prev.a === cur.a && prev.b === cur.b;
  const o = same ? 1 : during(t, beat, 0.5);
  const labels = cur.labels ?? [];
  const cx = 960;
  const cy = cur.kind === "straight" ? 680 : 600;
  const line = (x1, y1, x2, y2) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.beam} strokeWidth={7} strokeLinecap="round" />;
  if (cur.kind === "cross" || cur.kind === "straight") {
    const a = cur.a;
    const regions = cur.kind === "cross" ? [[0, a], [a, 180 - a], [180, a], [180 + a, 180 - a]] : [[0, a], [a, 180 - a]];
    const [ex, ey] = at(cx, cy, 380, a);
    const [fx, fy] = at(cx, cy, 380, 180 + a);
    return (
      <svg width={1920} height={1080} style={svgFill}>
        {regions.map(([start, span], i) => (
          <AngleMark key={i} cx={cx} cy={cy} start={start} span={span} label={labels[i]} color={PAIR[i % 2]} soft={SOFT[i % 2]} o={o} />
        ))}
        {line(cx - 460, cy, cx + 460, cy)}
        {cur.kind === "cross" ? line(fx, fy, ex, ey) : line(cx, cy, ex, ey)}
        <circle cx={cx} cy={cy} r={9} fill={C.beam} />
      </svg>
    );
  }
  // Polígono: triángulo con ángulos a (izquierda) y b (derecha), o cuadrilátero.
  const pts =
    cur.kind === "quad"
      ? [[cx - 380, cy + 170], [cx + 380, cy + 170], [cx + 260, cy - 190], [cx - 300, cy - 150]]
      : (() => {
          const base = 760;
          const ta = Math.tan(rad(cur.a));
          const tb = Math.tan(rad(cur.b));
          const h = (base * ta * tb) / (ta + tb);
          const L = [cx - base / 2, cy + 190];
          return [L, [cx + base / 2, cy + 190], [L[0] + h / ta, L[1] - h]];
        })();
  const n = pts.length;
  const dir = (p, q) => (Math.atan2(-(q[1] - p[1]), q[0] - p[0]) * 180) / Math.PI;
  const marks = pts.map((p, i) => {
    const next = pts[(i + 1) % n];
    const prevPt = pts[(i + n - 1) % n];
    let start = dir(p, next);
    let span = (((dir(p, prevPt) - start) % 360) + 360) % 360;
    if (span > 180) {
      start = dir(p, prevPt);
      span = 360 - span;
    }
    return { p, start, span };
  });
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="#f1f5f9" stroke={C.beam} strokeWidth={6} strokeLinejoin="round" />
      {marks.map(({ p, start, span }, i) => (
        <AngleMark key={i} cx={p[0]} cy={p[1]} start={start} span={span} label={labels[i]} color={labels[i] === "?" ? C.red : PAIR[i % 2]} soft={labels[i] === "?" ? C.redSoft : SOFT[i % 2]} o={o} r={70} />
      ))}
    </svg>
  );
}

const SLICE = [C.blue, C.amber, C.green, "#7c3aed", C.red];

// Gráfico circular: cada parte es una fracción del total.
export function Pie({ prev, cur, t, beat }) {
  const same = prev && JSON.stringify(prev.slices) === JSON.stringify(cur.slices);
  const o = same ? 1 : during(t, beat, 0.6);
  const total = cur.slices.reduce((s, x) => s + x.value, 0);
  const cx = 760;
  const cy = 600;
  const R = 280;
  let start = 90;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {cur.slices.map((s, i) => {
        const span = (360 * s.value) / total;
        const from = start;
        start -= span;
        const lit = cur.highlight === undefined || cur.highlight === i;
        const d = span >= 359.9 ? null : arc(cx, cy, R, from - span * o, span * o);
        return (
          <g key={i} opacity={lit ? 1 : 0.35}>
            {d ? <path d={d} fill={SLICE[i % 5]} stroke="#ffffff" strokeWidth={5} /> : <circle cx={cx} cy={cy} r={R} fill={SLICE[i % 5]} />}
            <rect x={1120} y={380 + i * 92} width={52} height={52} rx={10} fill={SLICE[i % 5]} />
            <text x={1192} y={420 + i * 92} fontSize={46} fontWeight={700} fill={C.ink}>{s.label}</text>
            {o > 0.9 && span > 25 && (
              <text {...(([x, y]) => ({ x, y: y + 16 }))(at(cx, cy, R * 0.62, from - span / 2))} textAnchor="middle" fontSize={44} fontWeight={800} fill="#ffffff">
                {s.text ?? ""}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.beam} strokeWidth={4} opacity={0.2} />
      {cur.total && <text x={1120} y={420 + cur.slices.length * 92 + 40} fontSize={50} fontWeight={800} fill={C.ink}>Total: {cur.total}</text>}
    </svg>
  );
}

// Gráfico de barras dobles: dos grupos comparados en cada categoría.
export function Bars({ prev, cur, t, beat }) {
  const same = prev && JSON.stringify(prev.bars) === JSON.stringify(cur.bars);
  const o = same ? 1 : during(t, beat, 0.6);
  const series = cur.series ?? [""];
  const max = cur.ymax;
  const x0 = 420;
  const y0 = 780;
  const H = 440;
  const groupW = 1080 / cur.bars.length;
  const barW = Math.min(120, (groupW - 80) / series.length);
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {Array.from({ length: max / cur.ystep + 1 }, (_, i) => {
        const v = i * cur.ystep;
        const y = y0 - (v / max) * H;
        return (
          <g key={v}>
            <line x1={x0} y1={y} x2={x0 + 1080} y2={y} stroke={C.soft} strokeWidth={3} />
            <text x={x0 - 20} y={y + 12} textAnchor="end" fontSize={34} fill={C.muted}>{v}</text>
          </g>
        );
      })}
      {cur.bars.map((b, i) => {
        const gx = x0 + i * groupW + (groupW - barW * series.length) / 2;
        return (
          <g key={b.label}>
            {b.values.map((v, k) => {
              const h = (v / max) * H * o;
              const lit = cur.highlight === undefined || cur.highlight === i;
              return (
                <g key={k} opacity={lit ? 1 : 0.35}>
                  <rect x={gx + k * barW} y={y0 - h} width={barW - 10} height={h} rx={8} fill={SLICE[k]} />
                  {o > 0.9 && <text x={gx + k * barW + (barW - 10) / 2} y={y0 - h - 16} textAnchor="middle" fontSize={38} fontWeight={800} fill={C.ink}>{v}</text>}
                </g>
              );
            })}
            <text x={gx + (barW * series.length) / 2} y={y0 + 56} textAnchor="middle" fontSize={40} fontWeight={700} fill={C.ink}>{b.label}</text>
          </g>
        );
      })}
      <line x1={x0} y1={y0} x2={x0 + 1080} y2={y0} stroke={C.beam} strokeWidth={5} />
      {series.length > 1 &&
        series.map((s, k) => (
          <g key={s}>
            <rect x={1540} y={340 + k * 70} width={44} height={44} rx={8} fill={SLICE[k]} />
            <text x={1600} y={376 + k * 70} fontSize={40} fontWeight={700} fill={C.ink}>{s}</text>
          </g>
        ))}
    </svg>
  );
}

// Polígono regular dividido en triángulos desde una esquina.
export function Poly({ prev, cur, t, beat }) {
  const same = prev && prev.n === cur.n && prev.diagonals === cur.diagonals;
  const o = same ? 1 : during(t, beat, 0.6);
  const n = cur.n;
  const cx = 960;
  const cy = 610;
  const R = 300;
  const pts = Array.from({ length: n }, (_, i) => at(cx, cy, R, -90 - 180 / n + (360 * i) / n));
  const fills = ["#bfdbfe", C.amberSoft, C.greenSoft, "#ede9fe", C.redSoft, "#cffafe", "#fce7f3", "#e0e7ff", "#fef9c3", "#dcfce7"];
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {cur.diagonals
        ? pts.slice(1, -1).map((p, i) => (
            <polygon key={i} points={[pts[0], p, pts[i + 2]].map((q) => q.join(",")).join(" ")} fill={fills[i % fills.length]} opacity={Math.min(1, Math.max(0, o * (n - 2) - i))} />
          ))
        : <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="#f1f5f9" />}
      {cur.diagonals &&
        pts.slice(2, -1).map((p, i) => (
          <line key={i} x1={pts[0][0]} y1={pts[0][1]} x2={p[0]} y2={p[1]} stroke={C.blue} strokeWidth={5} strokeDasharray="14 10" opacity={o} />
        ))}
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.beam} strokeWidth={6} strokeLinejoin="round" />
      {cur.diagonals &&
        o > 0.95 &&
        pts.slice(1, -1).map((p, i) => {
          const q = pts[i + 2];
          return (
            <text key={i} x={(pts[0][0] + p[0] + q[0]) / 3} y={(pts[0][1] + p[1] + q[1]) / 3 + 14} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.ink}>
              180°
            </text>
          );
        })}
      {cur.label && <text x={cx} y={cy + R + 70} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.ink}>{cur.label}</text>}
    </svg>
  );
}

// Trapecio; con `double`, una copia girada lo completa en paralelogramo.
export function Trapezoid({ prev, cur, t, beat }) {
  const u = 80;
  const { B, b, h } = cur;
  const W = (B + b) * u;
  const x0 = 960 - (cur.double ? W : B * u) / 2;
  const y0 = 640 + (h * u) / 2;
  const off = ((B - b) * u) / 2;
  const trap = (x, flip) =>
    flip
      ? [[x, y0 - h * u], [x + B * u, y0 - h * u], [x + B * u - off, y0], [x + off, y0]]
      : [[x, y0], [x + B * u, y0], [x + B * u - off, y0 - h * u], [x + off, y0 - h * u]];
  const o = cur.double ? (prev?.double ? 1 : during(t, beat, 0.6)) : 0;
  const copy = trap(x0 + B * u - off, true).map(([x, y]) => [x + (1 - o) * 300, y]);
  const pts = (list) => list.map((p) => p.join(",")).join(" ");
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <polygon points={pts(trap(x0, false))} fill="#bfdbfe" stroke={C.blue} strokeWidth={5} />
      {cur.double && <polygon points={pts(copy)} fill={C.amberSoft} stroke={C.amber} strokeWidth={5} opacity={o} />}
      <line x1={x0 + off} y1={y0} x2={x0 + off} y2={y0 - h * u} stroke={C.red} strokeWidth={4} strokeDasharray="10 8" />
      <text x={x0 + off + 16} y={y0 - (h * u) / 2 + 16} fontSize={44} fontWeight={800} fill={C.red}>{h}</text>
      <text x={x0 + (B * u) / 2} y={y0 + 60} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.blueDark}>{B}</text>
      <text x={x0 + (B * u) / 2} y={y0 - h * u - 22} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.blueDark}>{b}</text>
      {cur.double && o > 0.95 && (
        <text x={x0 + W / 2} y={y0 + 120} textAnchor="middle" fontSize={46} fontWeight={800} fill={C.ink}>base: {B} + {b} = {B + b}</text>
      )}
    </svg>
  );
}

// Plano cartesiano con puntos y un vector que mueve un punto.
export function Plane({ prev, cur, t, beat }) {
  const max = cur.max ?? 8;
  const u = 64;
  const x0 = 960 - (max * u) / 2;
  const y0 = 300 + max * u;
  const P = ([x, y]) => [x0 + x * u, y0 - y * u];
  const o = prev && JSON.stringify(prev.vector) === JSON.stringify(cur.vector) ? 1 : during(t, beat, 0.6);
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {Array.from({ length: max + 1 }, (_, i) => (
        <g key={i}>
          <line x1={x0 + i * u} y1={y0} x2={x0 + i * u} y2={y0 - max * u} stroke={C.soft} strokeWidth={2} />
          <line x1={x0} y1={y0 - i * u} x2={x0 + max * u} y2={y0 - i * u} stroke={C.soft} strokeWidth={2} />
          <text x={x0 + i * u} y={y0 + 40} textAnchor="middle" fontSize={28} fill={C.muted}>{i}</text>
          {i > 0 && <text x={x0 - 18} y={y0 - i * u + 10} textAnchor="end" fontSize={28} fill={C.muted}>{i}</text>}
        </g>
      ))}
      <line x1={x0} y1={y0} x2={x0 + max * u + 30} y2={y0} stroke={C.beam} strokeWidth={5} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - max * u - 30} stroke={C.beam} strokeWidth={5} />
      <text x={x0 + max * u + 50} y={y0 + 12} fontSize={40} fontWeight={800} fill={C.ink}>x</text>
      <text x={x0 - 12} y={y0 - max * u - 46} fontSize={40} fontWeight={800} fill={C.ink}>y</text>
      {cur.walk && (() => {
        const [x, y] = cur.walk;
        const [ax, ay] = P([0, 0]);
        const [bx, by] = P([x, 0]);
        const [cx, cy] = P([x, y]);
        return (
          <g opacity={o}>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.blue} strokeWidth={8} />
            <line x1={bx} y1={by} x2={cx} y2={cy} stroke={C.amber} strokeWidth={8} />
          </g>
        );
      })()}
      {cur.vector && (() => {
        const [from, d] = cur.vector;
        const [ax, ay] = P(from);
        const [bx, by] = P([from[0] + d[0] * o, from[1] + d[1] * o]);
        return <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.green} strokeWidth={7} markerEnd="url(#arrow)" />;
      })()}
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green} />
        </marker>
      </defs>
      {(cur.points ?? []).map(([x, y, label], i) => {
        const [px, py] = P([x, y]);
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={14} fill={i ? C.green : C.red} />
            <text x={px + 22} y={py - 18} fontSize={40} fontWeight={800} fill={i ? C.green : C.red}>{label ?? `(${x}, ${y})`}</text>
          </g>
        );
      })}
    </svg>
  );
}
