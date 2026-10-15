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
