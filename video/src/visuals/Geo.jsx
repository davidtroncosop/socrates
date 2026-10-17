import { C, ease } from "../anim.js";
import { LEAD } from "../timeline.js";

const svgFill = { position: "absolute", inset: 0 };
const num = (n) => (n < 0 ? `−${-n}` : String(n));
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
  const min = cur.min ?? 0;
  const span = max - min;
  const u = Math.min(64, 560 / span);
  const x0 = 960 - (span * u) / 2 - min * u;
  const y0 = 300 + max * u;
  const P = ([x, y]) => [x0 + x * u, y0 - y * u];
  const o = prev && JSON.stringify(prev.vector) === JSON.stringify(cur.vector) ? 1 : during(t, beat, 0.6);
  const ticks = Array.from({ length: span + 1 }, (_, i) => min + i);
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {ticks.map((i) => (
        <g key={i}>
          <line x1={x0 + i * u} y1={y0 - min * u} x2={x0 + i * u} y2={y0 - max * u} stroke={C.soft} strokeWidth={2} />
          <line x1={x0 + min * u} y1={y0 - i * u} x2={x0 + max * u} y2={y0 - i * u} stroke={C.soft} strokeWidth={2} />
          {i !== 0 && <text x={x0 + i * u} y={y0 + 34} textAnchor="middle" fontSize={26} fill={C.muted}>{num(i)}</text>}
          {i !== 0 && <text x={x0 - 14} y={y0 - i * u + 9} textAnchor="end" fontSize={26} fill={C.muted}>{num(i)}</text>}
        </g>
      ))}
      <line x1={x0 + min * u - (min ? 20 : 0)} y1={y0} x2={x0 + max * u + 30} y2={y0} stroke={C.beam} strokeWidth={5} />
      <line x1={x0} y1={y0 - min * u + (min ? 20 : 0)} x2={x0} y2={y0 - max * u - 30} stroke={C.beam} strokeWidth={5} />
      <text x={x0 + max * u + 50} y={y0 + 12} fontSize={40} fontWeight={800} fill={C.ink}>x</text>
      <text x={x0 - 12} y={y0 - max * u - 46} fontSize={40} fontWeight={800} fill={C.ink}>y</text>
      {cur.mirror && (
        <line
          {...(cur.mirror === "y" ? { x1: x0, y1: y0 - min * u, x2: x0, y2: y0 - max * u } : { x1: x0 + min * u, y1: y0, x2: x0 + max * u, y2: y0 })}
          stroke={C.blue}
          strokeWidth={10}
          opacity={0.45}
        />
      )}
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
      {(cur.polygons ?? []).map((list, i) => (
        <polygon key={`p${i}`} points={list.map(P).map((p) => p.join(",")).join(" ")} fill={i ? C.greenSoft : "#bfdbfe"} stroke={i ? C.green : C.blue} strokeWidth={5} opacity={i && !prev?.polygons?.[i] ? o : 0.9} />
      ))}
      {(cur.points ?? []).map(([x, y, label], i) => {
        const [px, py] = P([x, y]);
        return (
          <g key={i} opacity={i && !prev?.points?.[i] ? o : 1}>
            <circle cx={px} cy={py} r={14} fill={i ? C.green : C.red} />
            <text x={px + 22} y={py - 18} fontSize={38} fontWeight={800} fill={i ? C.green : C.red}>{label ?? `(${num(x)}, ${num(y)})`}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Sector circular: un trozo de pizza de `angle` grados.
export function Sector({ prev, cur, t, beat }) {
  const o = prev && prev.angle === cur.angle ? 1 : during(t, beat, 0.6);
  const cx = 960;
  const cy = 600;
  const R = 270;
  const span = cur.angle * o;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <circle cx={cx} cy={cy} r={R} fill="#f1f5f9" stroke={C.beam} strokeWidth={5} />
      {span >= 359.9 ? (
        <circle cx={cx} cy={cy} r={R} fill="#bfdbfe" stroke={C.blue} strokeWidth={5} />
      ) : (
        <path d={arc(cx, cy, R, 90, span)} fill="#bfdbfe" stroke={C.blue} strokeWidth={5} />
      )}
      {cur.arc && <path d={(() => { const [x1, y1] = at(cx, cy, R, 90); const [x2, y2] = at(cx, cy, R, 90 + span); return `M ${x1} ${y1} A ${R} ${R} 0 ${span > 180 ? 1 : 0} 0 ${x2} ${y2}`; })()} fill="none" stroke={C.red} strokeWidth={12} />}
      <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke={C.amber} strokeWidth={6} />
      <text x={cx + 18} y={cy - R / 2} fontSize={44} fontWeight={800} fill={C.amberDark}>{cur.r ?? "r"}</text>
      {o > 0.9 && <text {...(([x, y]) => ({ x, y: y + 16 }))(at(cx, cy, 90, 90 + cur.angle / 2))} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.blueDark}>{cur.angle}°</text>}
      {cur.label && <text x={cx + R + 60} y={cy + 16} fontSize={52} fontWeight={800} fill={C.ink}>{cur.label}</text>}
    </svg>
  );
}

// Teorema de Tales: dos rectas que salen de un punto, cortadas por paralelas.
export function Tales({ prev, cur, t, beat }) {
  const o = prev && prev.k === cur.k ? 1 : during(t, beat, 0.6);
  const O = [520, 820];
  const dirA = [1, -0.62];
  const dirB = [1, 0.02];
  const steps = [0, 260, 260 * (1 + cur.k)];
  const P = (dir, d) => [O[0] + dir[0] * d, O[1] + dir[1] * d];
  const labels = cur.labels ?? [];
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <line x1={O[0]} y1={O[1]} x2={P(dirA, 1050)[0]} y2={P(dirA, 1050)[1]} stroke={C.beam} strokeWidth={5} />
      <line x1={O[0]} y1={O[1]} x2={P(dirB, 1050)[0]} y2={P(dirB, 1050)[1]} stroke={C.beam} strokeWidth={5} />
      {steps.slice(1).map((d, i) => {
        const [ax, ay] = P(dirA, d);
        const [bx, by] = P(dirB, d);
        return <line key={i} x1={ax - 40} y1={ay - 40 * ((by - ay) / (bx - ax || 1))} x2={bx} y2={by + 40} stroke={C.green} strokeWidth={5} strokeDasharray="16 10" opacity={i ? o : 1} />;
      })}
      {[0, 1].map((i) => {
        const [a1, a2] = [P(dirA, steps[i]), P(dirA, steps[i + 1])];
        const [b1, b2] = [P(dirB, steps[i]), P(dirB, steps[i + 1])];
        return (
          <g key={i} opacity={i ? o : 1}>
            <text x={(a1[0] + a2[0]) / 2 - 20} y={(a1[1] + a2[1]) / 2 - 24} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.blue}>{labels[i]}</text>
            <text x={(b1[0] + b2[0]) / 2} y={(b1[1] + b2[1]) / 2 + 60} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.amberDark}>{labels[i + 2]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Tablero de Galton: clavos en triángulo y, opcionalmente, un camino marcado.
export function Galton({ prev, cur, t, beat }) {
  const rows = cur.rows;
  const o = prev && JSON.stringify(prev.path) === JSON.stringify(cur.path) ? 1 : during(t, beat, 0.7);
  const dx = 120;
  const dy = 110;
  const top = 300;
  const peg = (r, i) => [960 + (i - r / 2) * dx, top + r * dy];
  const path = cur.path ?? [];
  const points = [[960, top - 70]];
  let pos = 0;
  path.forEach((step, r) => {
    points.push(peg(r, pos).map((v, k) => (k ? v - 30 : v)));
    if (step === "D") pos += 1;
  });
  if (path.length) points.push(peg(rows, pos));
  const shown = Math.max(1, Math.round(o * points.length));
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {Array.from({ length: rows }, (_, r) => Array.from({ length: r + 1 }, (_, i) => {
        const [x, y] = peg(r, i);
        return <circle key={`${r}-${i}`} cx={x} cy={y} r={14} fill={C.beam} />;
      }))}
      {Array.from({ length: rows + 1 }, (_, i) => {
        const [x, y] = peg(rows, i);
        return (
          <g key={i}>
            <rect x={x - dx / 2 + 8} y={y - 20} width={dx - 16} height={90} rx={10} fill={cur.highlight === i ? C.amberSoft : "#f1f5f9"} stroke={C.line} strokeWidth={3} />
            {cur.counts && <text x={x} y={y + 40} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.ink}>{cur.counts[i]}</text>}
          </g>
        );
      })}
      {path.length > 0 && (
        <polyline points={points.slice(0, shown).map((p) => p.join(",")).join(" ")} fill="none" stroke={C.red} strokeWidth={8} strokeLinejoin="round" />
      )}
      {path.length > 0 && <circle cx={points[shown - 1][0]} cy={points[shown - 1][1]} r={20} fill={C.red} />}
    </svg>
  );
}

// Parábola y = a(x − h)² + k, con el vértice y el corte con el eje y marcados.
export function Parabola({ prev, cur, t, beat }) {
  const o = prev && prev.a === cur.a && prev.h === cur.h && prev.k === cur.k ? 1 : during(t, beat, 0.7);
  const { a, h, k } = cur;
  const [xmin, xmax, ymin, ymax] = cur.window ?? [-2, 8, -6, 10];
  const W = 900;
  const H = 560;
  const x0 = 960 - W / 2;
  const y0 = 260;
  const X = (x) => x0 + ((x - xmin) / (xmax - xmin)) * W;
  const Y = (y) => y0 + ((ymax - y) / (ymax - ymin)) * H;
  const f = (x) => a * (x - h) ** 2 + k;
  const steps = 120;
  const pts = [];
  for (let i = 0; i <= steps * o; i++) {
    const x = xmin + ((xmax - xmin) * i) / steps;
    const y = f(x);
    if (y >= ymin - 1 && y <= ymax + 1) pts.push([X(x), Y(Math.max(ymin, Math.min(ymax, y)))]);
  }
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <rect x={x0} y={y0} width={W} height={H} fill="#ffffff" stroke={C.soft} strokeWidth={2} />
      <line x1={x0} y1={Y(0)} x2={x0 + W} y2={Y(0)} stroke={C.beam} strokeWidth={4} />
      <line x1={X(0)} y1={y0} x2={X(0)} y2={y0 + H} stroke={C.beam} strokeWidth={4} />
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.blue} strokeWidth={7} />
      {o > 0.95 && cur.vertex && (
        <g>
          <circle cx={X(h)} cy={Y(k)} r={14} fill={C.red} />
          <text x={X(h) + 22} y={Y(k) + (a > 0 ? 44 : -20)} fontSize={40} fontWeight={800} fill={C.red}>vértice ({num(h)}, {num(k)})</text>
        </g>
      )}
      {o > 0.95 && cur.yint && (
        <g>
          <circle cx={X(0)} cy={Y(f(0))} r={14} fill={C.green} />
          <text x={X(0) + 22} y={Y(f(0)) - 16} fontSize={40} fontWeight={800} fill={C.green}>(0, {num(f(0))})</text>
        </g>
      )}
      {o > 0.95 && (cur.roots ?? []).map((r) => (
        <g key={r}>
          <circle cx={X(r)} cy={Y(0)} r={14} fill={C.amber} />
          <text x={X(r)} y={Y(0) + 50} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.amberDark}>{num(r)}</text>
        </g>
      ))}
    </svg>
  );
}

// Ángulo del centro y ángulo inscrito que abarcan el mismo arco.
export function Inscribed({ prev, cur, t, beat }) {
  const o = prev && prev.central === cur.central && prev.show === cur.show ? 1 : during(t, beat, 0.6);
  const cx = 960;
  const cy = 650;
  const R = 250;
  const half = cur.central / 2;
  const A = at(cx, cy, R, -90 - half);
  const B = at(cx, cy, R, -90 + half);
  const P = at(cx, cy, R, 90);
  const show = cur.show ?? ["central", "inscribed"];
  const dir = (p, q) => (Math.atan2(-(q[1] - p[1]), q[0] - p[0]) * 180) / Math.PI;
  const iStart = dir(P, A);
  const iSpan = (((dir(P, B) - iStart) % 360) + 360) % 360;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <circle cx={cx} cy={cy} r={R} fill="#f8fafc" stroke={C.beam} strokeWidth={5} />
      <path d={(() => { const [x1, y1] = at(cx, cy, R, -90 - half); const [x2, y2] = at(cx, cy, R, -90 + half); return `M ${x1} ${y1} A ${R} ${R} 0 ${cur.central > 180 ? 1 : 0} 0 ${x2} ${y2}`; })()} fill="none" stroke={C.red} strokeWidth={12} />
      {show.includes("central") && (
        <g opacity={o}>
          <path d={arc(cx, cy, 70, -90 - half, cur.central)} fill="#bfdbfe" stroke={C.blue} strokeWidth={4} />
          <line x1={cx} y1={cy} x2={A[0]} y2={A[1]} stroke={C.blue} strokeWidth={6} />
          <line x1={cx} y1={cy} x2={B[0]} y2={B[1]} stroke={C.blue} strokeWidth={6} />
          <text x={cx} y={cy + 120} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.blueDark}>{cur.labels?.central ?? `${cur.central}°`}</text>
        </g>
      )}
      {show.includes("inscribed") && (
        <g opacity={show.includes("central") ? o : 1}>
          <path d={arc(P[0], P[1], 60, iStart, iSpan)} fill={C.amberSoft} stroke={C.amber} strokeWidth={4} />
          <line x1={P[0]} y1={P[1]} x2={A[0]} y2={A[1]} stroke={C.amber} strokeWidth={6} />
          <line x1={P[0]} y1={P[1]} x2={B[0]} y2={B[1]} stroke={C.amber} strokeWidth={6} />
          <text x={P[0] + 110} y={P[1] + 20} textAnchor="start" fontSize={44} fontWeight={800} fill={C.amberDark}>{cur.labels?.inscribed ?? `${half}°`}</text>
        </g>
      )}
      <circle cx={cx} cy={cy} r={9} fill={C.beam} />
    </svg>
  );
}

// Campana normal con franjas de 1 y 2 desviaciones.
export function Bell({ prev, cur, t, beat }) {
  const o = prev && prev.band === cur.band ? 1 : during(t, beat, 0.6);
  const x0 = 360;
  const W = 1200;
  const base = 800;
  const H = 440;
  const X = (z) => x0 + ((z + 3.2) / 6.4) * W;
  const Y = (z) => base - H * Math.exp((-z * z) / 2);
  const curve = Array.from({ length: 161 }, (_, i) => -3.2 + (6.4 * i) / 160);
  const band = cur.band ?? 0;
  const area = curve.filter((z) => Math.abs(z) <= band * o);
  const labels = cur.labels ?? [];
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {band > 0 && area.length > 1 && (
        <polygon points={[[X(area[0]), base], ...area.map((z) => [X(z), Y(z)]), [X(area.at(-1)), base]].map((p) => p.join(",")).join(" ")} fill={band === 1 ? "#bfdbfe" : C.amberSoft} />
      )}
      {cur.half && <polygon points={[[X(0), base], ...curve.filter((z) => z >= 0).map((z) => [X(z), Y(z)]), [X(3.2), base]].map((p) => p.join(",")).join(" ")} fill={C.greenSoft} opacity={o} />}
      <polyline points={curve.map((z) => [X(z), Y(z)].join(",")).join(" ")} fill="none" stroke={C.blue} strokeWidth={7} />
      <line x1={x0} y1={base} x2={x0 + W} y2={base} stroke={C.beam} strokeWidth={4} />
      {[-2, -1, 0, 1, 2].map((z, i) => (
        <g key={z}>
          <line x1={X(z)} y1={base} x2={X(z)} y2={base + 16} stroke={C.beam} strokeWidth={4} />
          <text x={X(z)} y={base + 56} textAnchor="middle" fontSize={36} fontWeight={700} fill={C.ink}>{labels[i] ?? (z === 0 ? "promedio" : `${z > 0 ? "+" : "−"}${Math.abs(z)}`)}</text>
        </g>
      ))}
      {cur.text && o > 0.9 && <text x={X(0)} y={Y(0) + 160} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.ink}>{cur.text}</text>}
    </svg>
  );
}

// Curvas: potencia a · xⁿ, exponencial a · bˣ, k / x y A · sen(B · x) + D (x en grados).
export function Curve({ prev, cur, t, beat }) {
  const o = prev && JSON.stringify(prev.f) === JSON.stringify(cur.f) ? 1 : during(t, beat, 0.7);
  const { kind, a = 1, b = 2, n = 2, k = 1, A = 1, B = 1, D = 0 } = cur.f;
  const [xmin, xmax, ymin, ymax] = cur.window;
  const W = 1000;
  const H = 560;
  const x0 = 960 - W / 2;
  const y0 = 250;
  const X = (x) => x0 + ((x - xmin) / (xmax - xmin)) * W;
  const Y = (y) => y0 + ((ymax - y) / (ymax - ymin)) * H;
  const f = (x) =>
    kind === "pow" ? a * x ** n : kind === "exp" ? a * b ** x : kind === "inv" ? k / x : A * Math.sin((B * x * Math.PI) / 180) + D;
  const steps = 300;
  const segs = [[]];
  for (let i = 0; i <= steps * o; i++) {
    const x = xmin + ((xmax - xmin) * i) / steps;
    const y = f(x);
    if (!Number.isFinite(y) || y < ymin - 0.5 || y > ymax + 0.5) {
      if (segs.at(-1).length) segs.push([]);
      continue;
    }
    segs.at(-1).push([X(x), Y(y)]);
  }
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <rect x={x0} y={y0} width={W} height={H} fill="#ffffff" stroke={C.soft} strokeWidth={2} />
      {ymin < 0 && ymax > 0 && <line x1={x0} y1={Y(0)} x2={x0 + W} y2={Y(0)} stroke={C.beam} strokeWidth={4} />}
      {xmin < 0 && xmax > 0 && <line x1={X(0)} y1={y0} x2={X(0)} y2={y0 + H} stroke={C.beam} strokeWidth={4} />}
      {(cur.hlines ?? []).map(([y, label]) => (
        <g key={label}>
          <line x1={x0} y1={Y(y)} x2={x0 + W} y2={Y(y)} stroke={C.red} strokeWidth={3} strokeDasharray="12 10" />
          <text x={x0 + W + 16} y={Y(y) + 12} fontSize={36} fontWeight={800} fill={C.red}>{label}</text>
        </g>
      ))}
      {segs.filter((sg) => sg.length > 1).map((sg, i) => (
        <polyline key={i} points={sg.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.blue} strokeWidth={7} />
      ))}
      {(cur.points ?? []).map(([x, y, label]) => (
        <g key={label}>
          <circle cx={X(x)} cy={Y(y)} r={13} fill={C.green} />
          <text x={X(x) + 20} y={Y(y) - 16} fontSize={38} fontWeight={800} fill={C.green}>{label}</text>
        </g>
      ))}
      {cur.xLabels && cur.xLabels.map(([x, label]) => (
        <text key={label} x={X(x)} y={y0 + H + 44} textAnchor="middle" fontSize={32} fill={C.muted}>{label}</text>
      ))}
    </svg>
  );
}
