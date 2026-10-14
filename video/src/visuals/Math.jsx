import { interpolate } from "remotion";
import { C, clamp01, ease, lerp, stagger } from "../anim.js";
import { LEAD } from "../timeline.js";
import { Marked } from "./Text.jsx";

const num = (n) => (n < 0 ? `−${-n}` : String(n));
const svgFill = { position: "absolute", inset: 0 };
// Movimiento que acompaña la frase: empieza con la voz y dura parte de ella.
const during = (t, beat, share = 0.6) => ease(t, LEAD, LEAD + Math.max(20, beat.speak * share));

// Recta numérica horizontal o vertical (el ascensor), con un marcador que se
// mueve, saltos con su operación y flechas desde el cero.
export function NumberLine({ prev, cur, t, beat }) {
  const { min, max, vertical } = cur;
  const every = cur.every ?? (max - min > 16 ? 2 : 1);
  const span = max - min;
  const pos = vertical
    ? (v) => ({ x: 960, y: 880 - ((v - min) / span) * 600 })
    : (v) => ({ x: 260 + ((v - min) / span) * 1400, y: 640 });
  const moving = prev && prev.marker !== undefined && cur.marker !== undefined && prev.marker !== cur.marker;
  const m = moving ? during(t, beat) : 1;
  const markerValue = moving ? lerp(prev.marker, cur.marker, m) : cur.marker;
  const jump = cur.from !== undefined && cur.marker !== undefined && cur.from !== cur.marker;
  const jumpIn = jump && !(prev && prev.from === cur.from && prev.marker === cur.marker) ? m : 1;
  const ticks = [];
  for (let v = min; v <= max; v++) ticks.push(v);
  const arrows = cur.arrows ?? [];
  const known = (prev?.arrows ?? []).map((a) => JSON.stringify(a));
  const freshArrows = arrows.filter((a) => !known.includes(JSON.stringify(a)));
  const z = pos(0);
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {vertical && cur.zero && (
        <g>
          <rect x={620} y={z.y} width={980} height={880 - z.y + 20} fill="#f1f5f9" />
          <line x1={620} y1={z.y} x2={1600} y2={z.y} stroke={C.green} strokeWidth={5} strokeDasharray="14 10" />
          <text x={1600} y={z.y - 14} textAnchor="end" fontSize={34} fontWeight={700} fill={C.green}>{cur.zero}</text>
          <text x={1600} y={880} textAnchor="end" fontSize={30} fontWeight={600} fill={C.muted}>subterráneos</text>
        </g>
      )}
      {vertical ? (
        <line x1={960} y1={270} x2={960} y2={890} stroke={C.beam} strokeWidth={8} strokeLinecap="round" />
      ) : (
        <line x1={230} y1={640} x2={1690} y2={640} stroke={C.beam} strokeWidth={8} strokeLinecap="round" />
      )}
      {ticks.map((v) => {
        const p = pos(v);
        const labeled = v % every === 0 || v === 0;
        return (
          <g key={v}>
            {vertical ? (
              <line x1={950} y1={p.y} x2={970} y2={p.y} stroke={C.beam} strokeWidth={4} />
            ) : (
              <line x1={p.x} y1={630} x2={p.x} y2={650} stroke={C.beam} strokeWidth={4} />
            )}
            {labeled && (
              <text
                x={vertical ? 1000 : p.x}
                y={vertical ? p.y + 11 : 700}
                textAnchor={vertical ? "start" : "middle"}
                fontSize={v === 0 ? 34 : 30}
                fontWeight={v === 0 ? 800 : 600}
                fill={v === 0 ? C.ink : C.muted}
              >
                {num(v)}
              </text>
            )}
          </g>
        );
      })}
      {arrows.map((a, i) => {
        const k = freshArrows.indexOf(a);
        const d = k === -1 ? 1 : stagger(t, k, freshArrows.length, beat.speak);
        const s = pos(a.from ?? 0);
        const e = pos(lerp(a.from ?? 0, a.to, d));
        const y = 640 - 80 - (a.row ?? i) * 90;
        const color = a.color ?? C.blue;
        const dir = Math.sign(a.to - (a.from ?? 0));
        return (
          <g key={i} opacity={Math.min(1, d * 3)}>
            <line x1={s.x} y1={y} x2={e.x} y2={y} stroke={color} strokeWidth={10} strokeLinecap="round" />
            <path d={`M ${e.x} ${y} l ${-22 * dir} -16 M ${e.x} ${y} l ${-22 * dir} 16`} stroke={color} strokeWidth={10} strokeLinecap="round" />
            <text x={(s.x + e.x) / 2} y={y - 22} textAnchor="middle" fontSize={36} fontWeight={800} fill={color}>{a.label}</text>
          </g>
        );
      })}
      {jump && (() => {
        const a = pos(cur.from);
        const b = pos(lerp(cur.from, cur.marker, jumpIn));
        const color = cur.marker > cur.from ? C.green : C.red;
        const path = vertical
          ? `M 1080 ${a.y} C 1200 ${a.y}, 1200 ${b.y}, 1080 ${b.y}`
          : `M ${a.x} 600 C ${a.x} 470, ${b.x} 470, ${b.x} 600`;
        return (
          <g>
            <path d={path} stroke={color} strokeWidth={8} fill="none" strokeDasharray="4 14" strokeLinecap="round" />
            <text x={vertical ? 1210 : (a.x + b.x) / 2} y={vertical ? (a.y + b.y) / 2 + 16 : 460} textAnchor={vertical ? "start" : "middle"} fontSize={52} fontWeight={800} fill={color} opacity={jumpIn}>
              {cur.op}
            </text>
          </g>
        );
      })()}
      {cur.marker !== undefined && (() => {
        const p = pos(markerValue);
        return vertical ? (
          <g transform={`translate(${p.x - 190} ${p.y})`}>
            <rect x={-90} y={-38} width={180} height={76} rx={14} fill={C.blue} />
            <text x={0} y={13} textAnchor="middle" fontSize={34} fontWeight={800} fill="#fff">
              piso {num(Math.round(markerValue))}
            </text>
            <line x1={90} y1={0} x2={170} y2={0} stroke={C.blue} strokeWidth={6} />
          </g>
        ) : (
          <g transform={`translate(${p.x} 640)`}>
            <circle r={22} fill={C.blue} stroke="#fff" strokeWidth={6} />
          </g>
        );
      })()}
    </svg>
  );
}

// Fichas: grupos de objetos (🍎, fichas con x) separados por operaciones.
export function Tokens({ prev, cur, t, beat, area }) {
  const groups = cur.groups;
  const before = prev?.groups ?? [];
  const sameKind = (a, b) => a && b && a.op === b.op && a.icon === b.icon && a.tile === b.tile && a.paper === b.paper;
  const freshGroups = groups.filter((g, i) => !sameKind(g, before[i]));
  const size = cur.size ?? 70;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: area.top, bottom: area.bottom, display: "flex", alignItems: "center", justifyContent: "center", gap: 46 }}>
      {groups.map((g, i) => {
        const k = freshGroups.indexOf(g);
        const a = k === -1 ? 1 : stagger(t, k, freshGroups.length, beat.speak);
        if (g.op) return <div key={i} style={{ fontSize: 96, fontWeight: 800, color: C.muted, opacity: a }}>{g.op}</div>;
        const prevCount = k === -1 ? before[i].count : 0;
        const counting = k === -1 && prevCount !== g.count ? during(t, beat, 0.5) : 1;
        // Mientras salen fichas se mantiene el espacio; después, solo el que queda.
        const n = counting < 1 ? Math.max(prevCount, g.count) : g.count;
        const cols = g.cols ?? Math.min(n, 5);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: a, transform: `translateY(${30 * (1 - a)}px)` }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 10 }}>
              {Array.from({ length: n }, (_, j) => {
                const leaving = j >= g.count;
                const arriving = j >= prevCount;
                const o = leaving ? 1 - counting : arriving ? (k === -1 ? interpolate(counting, [(j - prevCount) / Math.max(1, g.count - prevCount) * 0.8, 1], [0, 1], clamp01) : 1) : 1;
                return (
                  <div key={j} style={{ width: size, height: size, opacity: o, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * o})` }}>
                    {g.paper ? (
                      <div style={{ width: size * 0.74, height: size - 8, background: "#ffffff", border: `3px solid ${C.beam}`, borderRadius: 6, padding: "14% 12%", display: "flex", flexDirection: "column", gap: "12%", boxShadow: "3px 3px 0 #cbd5e1" }}>
                        {[0, 1, 2, 3].map((l) => (
                          <div key={l} style={{ height: 4, background: "#94a3b8", width: l === 3 ? "60%" : "100%" }} />
                        ))}
                      </div>
                    ) : g.tile ? (
                      <div style={{ width: size - 6, height: size - 6, borderRadius: 14, background: g.debt ? "transparent" : C.blue, border: g.debt ? `4px dashed ${C.red}` : "none", color: g.debt ? C.red : "#fff", fontSize: size * 0.55, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {g.tile}
                      </div>
                    ) : (
                      <span style={{ fontSize: size * 0.82, lineHeight: 1, opacity: g.debt ? 0.35 : 1 }}>{g.icon}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {g.label && (
              <div style={{ fontSize: 46, fontWeight: 800, color: g.debt ? C.red : C.ink }}>
                <Marked text={g.label} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Cuadrícula de 100 (el chocolate de cien cuadritos).
export function Grid100({ prev, cur, t, beat, area }) {
  const from = prev?.filled ?? 0;
  const f = lerp(from, cur.filled, during(t, beat, 0.6));
  const cell = 52;
  const gap = 6;
  return (
    <div style={{ position: "absolute", top: area.top, bottom: area.bottom, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${cell}px)`, gap, padding: 16, background: "#7c4a1e", borderRadius: 18 }}>
        {Array.from({ length: 100 }, (_, i) => {
          const o = interpolate(f - i, [0, 1], [0, 1], clamp01);
          return (
            <div key={i} style={{ width: cell, height: cell, borderRadius: 8, background: o > 0 ? `color-mix(in srgb, ${C.blue} ${o * 100}%, #a86b3c)` : "#a86b3c" }} />
          );
        })}
      </div>
      {cur.label && (
        <div style={{ fontSize: 64, fontWeight: 800, maxWidth: 560, lineHeight: 1.2 }}>
          <Marked text={cur.label} />
        </div>
      )}
    </div>
  );
}

// Barra dividida en partes iguales (modelo de barra).
export function Bar({ prev, cur, t, beat }) {
  const W = 1400;
  const H = 140;
  const x0 = (1920 - W) / 2;
  const y0 = 470;
  const sameBar = prev && prev.parts === cur.parts && prev.total === cur.total;
  const fromFilled = sameBar ? prev.filled : 0;
  const f = lerp(fromFilled, cur.filled, during(t, beat, 0.5));
  const partW = W / cur.parts;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {Array.from({ length: cur.parts }, (_, i) => {
        const o = interpolate(f - i, [0, 1], [0, 1], clamp01);
        return (
          <g key={i}>
            <rect x={x0 + i * partW} y={y0} width={partW} height={H} fill={o > 0 ? C.blue : "#e2e8f0"} opacity={o > 0 ? 0.25 + 0.75 * o : 1} stroke="#ffffff" strokeWidth={4} />
            {cur.parts <= 10 && cur.partLabel && (
              <text x={x0 + i * partW + partW / 2} y={y0 + H / 2 + 14} textAnchor="middle" fontSize={cur.parts > 6 ? 32 : 44} fontWeight={800} fill={o > 0.5 ? "#ffffff" : C.muted}>
                {cur.partLabel}
              </text>
            )}
          </g>
        );
      })}
      <rect x={x0} y={y0} width={W} height={H} fill="none" stroke={C.beam} strokeWidth={6} rx={6} />
      {cur.parts > 10 && cur.partLabel && (
        <g opacity={Math.min(1, f / Math.max(1, cur.filled))}>
          <path d={`M ${x0} ${y0 - 14} L ${x0} ${y0 - 30} L ${x0 + cur.filled * partW} ${y0 - 30} L ${x0 + cur.filled * partW} ${y0 - 14}`} fill="none" stroke={C.blue} strokeWidth={4} />
          <text x={x0} y={y0 - 46} fontSize={40} fontWeight={800} fill={C.blue}>
            {cur.filled} partes de {cur.partLabel}
          </text>
        </g>
      )}
      <path d={`M ${x0} ${y0 + H + 30} q 0 20 20 20 L ${x0 + W / 2 - 20} ${y0 + H + 50} q 20 0 20 20 q 0 -20 20 -20 L ${x0 + W - 20} ${y0 + H + 50} q 20 0 20 -20`} fill="none" stroke={C.muted} strokeWidth={4} />
      <text x={960} y={y0 + H + 125} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.ink}>{cur.total}</text>
      {cur.caption && (
        <text x={960} y={y0 - (cur.parts > 10 ? 120 : 60)} textAnchor="middle" fontSize={50} fontWeight={700} fill={C.blueDark}>{cur.caption}</text>
      )}
    </svg>
  );
}

// Modelo de área: el huerto cuadrado que se agranda, (a + b)².
export function Area({ prev, cur, t, beat }) {
  const A = 400;
  const B = 160;
  const x0 = 960 - (A + B) / 2;
  const y0 = 300;
  const labels = cur.labels;
  const pieces = [
    { x: x0, y: y0, w: A, h: A, fill: "#bfdbfe", text: labels.a2 },
    { x: x0 + A, y: y0, w: B, h: A, fill: C.amberSoft, text: labels.ab },
    { x: x0, y: y0 + A, w: A, h: B, fill: C.amberSoft, text: labels.ab },
    { x: x0 + A, y: y0 + A, w: B, h: B, fill: C.greenSoft, text: labels.b2 },
  ];
  const shownBefore = prev?.show ?? 0;
  const freshCount = cur.show - shownBefore;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {pieces.slice(0, cur.show).map((p, i) => {
        const a = i < shownBefore ? 1 : stagger(t, i - shownBefore, freshCount, beat.speak);
        return (
          <g key={i} opacity={a}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={p.fill} stroke={C.beam} strokeWidth={5} />
            <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 22} textAnchor="middle" fontSize={i === 0 ? 80 : 56} fontWeight={800} fill={C.ink}>{p.text}</text>
          </g>
        );
      })}
      <text x={x0 + A / 2} y={y0 - 24} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.blueDark}>{labels.a}</text>
      <text x={x0 - 24} y={y0 + A / 2 + 18} textAnchor="end" fontSize={50} fontWeight={800} fill={C.blueDark}>{labels.a}</text>
      <g opacity={cur.show > 1 ? 1 : 0}>
        <text x={x0 + A + B / 2} y={y0 - 24} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.amberDark}>{labels.b}</text>
        <text x={x0 - 24} y={y0 + A + B / 2 + 18} textAnchor="end" fontSize={50} fontWeight={800} fill={C.amberDark}>{labels.b}</text>
      </g>
    </svg>
  );
}

// El círculo de la cabra: estaca (centro), cuerda (radio), camino (perímetro)
// y pasto (área).
export function Circle({ prev, cur, t, beat }) {
  const cx = 960;
  const cy = 590;
  const R = 255;
  const has = (k) => cur.show.includes(k);
  const isFresh = (k) => has(k) && !(prev?.show ?? []).includes(k);
  const fade = (k) => (isFresh(k) ? ease(t, LEAD, LEAD + 18) : has(k) ? 1 : 0);
  const walk = isFresh("perimeter") ? during(t, beat, 0.75) : has("perimeter") ? 1 : 0;
  const angle = -walk * Math.PI * 2;
  const goat = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  const circumference = 2 * Math.PI * R;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      <circle cx={cx} cy={cy} r={R} fill="#86efac" opacity={0.75 * fade("area")} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.soft} strokeWidth={4} strokeDasharray="10 12" />
      {has("perimeter") && (
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.blue} strokeWidth={10} strokeDasharray={`${circumference * walk} ${circumference}`} transform={`rotate(0 ${cx} ${cy}) scale(1 -1) translate(0 ${-2 * cy})`} />
      )}
      {has("diameter") && (
        <g opacity={fade("diameter")}>
          <line x1={cx - R} y1={cy + 6} x2={cx + R} y2={cy + 6} stroke={C.blueDark} strokeWidth={6} strokeDasharray="16 10" />
          <text x={cx - R / 2} y={cy + 60} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.blueDark}>{cur.labels?.d}</text>
        </g>
      )}
      {has("radius") && (
        <g opacity={fade("radius")}>
          <line x1={cx} y1={cy} x2={goat.x} y2={goat.y} stroke={C.amberDark} strokeWidth={7} />
          <text x={cx + R / 2} y={cy - 22} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.amberDark} opacity={walk > 0 && walk < 1 ? 0 : 1}>{cur.labels?.r}</text>
        </g>
      )}
      {has("center") && (
        <g opacity={fade("center")}>
          <circle cx={cx} cy={cy} r={16} fill={C.amberDark} />
          <text x={cx} y={cy + 56} textAnchor="middle" fontSize={32} fontWeight={700} fill={C.muted} opacity={has("diameter") ? 0 : 1}>centro (la estaca)</text>
        </g>
      )}
      {has("area") && (
        <text x={cx} y={cy - 100} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.green} opacity={fade("area")}>área: el pasto</text>
      )}
      {cur.goat && (
        <text x={goat.x} y={goat.y + 30} textAnchor="middle" fontSize={84} opacity={has("radius") || has("center") ? 1 : 0}>🐐</text>
      )}
    </svg>
  );
}

// Triángulo rectángulo con un cuadrado de baldosas sobre cada lado.
export function Triangle({ prev, cur, t, beat }) {
  const { a, b, c } = cur;
  // Con baldosas, la figura completa mide (a + 2b)·u de alto y (2a + b)·u de
  // ancho; sin ellas, solo el triángulo, más grande.
  const u = cur.tiles ? Math.min(600 / (a + 2 * b), 1100 / (2 * a + b)) : Math.min(480 / a, 900 / b);
  const P = cur.tiles ? { x: 960 - (b * u) / 2, y: 875 - b * u } : { x: 960 - (b * u) / 2, y: 580 + (a * u) / 2 };
  const Q = { x: P.x + b * u, y: P.y };
  const R = { x: P.x, y: P.y - a * u };
  const n = { x: a / c, y: -b / c };
  const add = (p, v, k) => ({ x: p.x + v.x * k, y: p.y + v.y * k });
  const squares = {
    sqA: { s: P, e: R, n: { x: -1, y: 0 }, L: a * u, m: a, fill: "#bfdbfe" },
    sqB: { s: P, e: Q, n: { x: 0, y: 1 }, L: b * u, m: b, fill: C.amberSoft },
    sqC: { s: R, e: Q, n, L: c * u, m: c, fill: C.greenSoft },
  };
  const before = prev && prev.a === a && prev.b === b ? prev.show : [];
  const fresh = cur.show.filter((k) => !before.includes(k));
  const fade = (k) => (fresh.includes(k) ? stagger(t, fresh.indexOf(k), fresh.length, beat.speak) : 1);
  const labels = { a: num(a), b: num(b), c: num(c), ...cur.labels };
  const pts = (list) => list.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {["sqA", "sqB", "sqC"].filter((k) => cur.show.includes(k)).map((k) => {
        const q = squares[k];
        const d = { x: (q.e.x - q.s.x) / q.L, y: (q.e.y - q.s.y) / q.L };
        const corners = [q.s, q.e, add(q.e, q.n, q.L), add(q.s, q.n, q.L)];
        const mid = add(add(q.s, d, q.L / 2), q.n, q.L / 2);
        const lines = [];
        if (cur.tiles)
          for (let i = 1; i < q.m; i++) {
            const p1 = add(q.s, d, (i / q.m) * q.L);
            const p2 = add(q.s, q.n, (i / q.m) * q.L);
            lines.push([p1, add(p1, q.n, q.L)], [p2, add(p2, d, q.L)]);
          }
        return (
          <g key={k} opacity={fade(k)}>
            <polygon points={pts(corners)} fill={q.fill} stroke={C.beam} strokeWidth={4} />
            {lines.map(([p1, p2], i) => (
              <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ffffff" strokeWidth={2.5} />
            ))}
            <text x={mid.x} y={mid.y + 20} textAnchor="middle" fontSize={Math.min(64, q.L / 3.1)} fontWeight={800} fill={C.ink} stroke="#ffffff" strokeWidth={8} paintOrder="stroke">
              {cur.squareLabels?.[k] ?? `${q.m}² = ${q.m * q.m}`}
            </text>
          </g>
        );
      })}
      <g opacity={cur.show.includes("tri") ? fade("tri") : 0}>
        <polygon points={pts([P, Q, R])} fill="#ffffff" stroke={C.beam} strokeWidth={7} strokeLinejoin="round" />
        <rect x={P.x} y={P.y - 26} width={26} height={26} fill="none" stroke={C.beam} strokeWidth={4} />
        {/* La medida de cada lado va por fuera; si su cuadrado está a la vista, el cuadrado ya la dice. */}
        {!cur.show.includes("sqA") && <text x={P.x - 24} y={(P.y + R.y) / 2 + 16} textAnchor="end" fontSize={48} fontWeight={800} fill={C.blueDark}>{labels.a}</text>}
        {!cur.show.includes("sqB") && <text x={(P.x + Q.x) / 2} y={P.y + 56} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.amberDark}>{labels.b}</text>}
        {!cur.show.includes("sqC") && <text x={(R.x + Q.x) / 2 + n.x * 50} y={(R.y + Q.y) / 2 + n.y * 50 + 16} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.green}>{labels.c}</text>}
      </g>
    </svg>
  );
}

// Gráfico de una función afín: punto de partida, escalera y recta.
export function Chart({ prev, cur, t, beat }) {
  const O = { x: 640, y: 850 };
  const W = 700;
  const H = 540;
  const sx = W / cur.xmax;
  const sy = H / cur.ymax;
  const P = (x, y) => ({ x: O.x + x * sx, y: O.y - y * sy });
  const f = (x) => cur.m * x + cur.n;
  const before = prev?.points ?? [];
  const fresh = cur.points.filter((x) => !before.includes(x));
  const pointIn = (x) => (fresh.includes(x) ? stagger(t, fresh.indexOf(x), fresh.length, beat.speak) : 1);
  const lineIn = cur.line ? (prev?.line ? 1 : during(t, beat, 0.4)) : 0;
  const hl = cur.highlight !== undefined ? (prev?.highlight === cur.highlight ? 1 : ease(t, LEAD + 10, LEAD + 30)) : 0;
  const yTicks = [];
  for (let y = 0; y <= cur.ymax; y += cur.ystep ?? 2) yTicks.push(y);
  const start = P(0, f(0));
  const end = P(cur.xmax, f(cur.xmax));
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {yTicks.map((y) => (
        <g key={y}>
          <line x1={O.x} y1={P(0, y).y} x2={O.x + W} y2={P(0, y).y} stroke={C.soft} strokeWidth={2} />
          <text x={O.x - 20} y={P(0, y).y + 10} textAnchor="end" fontSize={28} fill={C.muted}>{y}</text>
        </g>
      ))}
      {Array.from({ length: cur.xmax + 1 }, (_, x) => (
        <text key={x} x={P(x, 0).x} y={O.y + 44} textAnchor="middle" fontSize={30} fill={C.muted}>{x}</text>
      ))}
      <line x1={O.x} y1={O.y} x2={O.x + W + 30} y2={O.y} stroke={C.beam} strokeWidth={5} />
      <line x1={O.x} y1={O.y} x2={O.x} y2={O.y - H - 30} stroke={C.beam} strokeWidth={5} />
      <text x={O.x + W + 40} y={O.y + 10} fontSize={34} fontWeight={700} fill={C.ink}>{cur.xLabel ?? "x"}</text>
      <text x={O.x} y={O.y - H - 46} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.ink}>{cur.yLabel ?? "f(x)"}</text>
      {cur.line && (
        <line x1={start.x} y1={start.y} x2={lerp(start.x, end.x, lineIn)} y2={lerp(start.y, end.y, lineIn)} stroke={C.blue} strokeWidth={7} strokeLinecap="round" />
      )}
      {cur.stairs &&
        cur.points.filter((x) => x < cur.xmax && cur.points.includes(x + 1)).map((x) => {
          const a = P(x, f(x));
          const b = P(x + 1, f(x));
          const c = P(x + 1, f(x + 1));
          const o = Math.min(pointIn(x), pointIn(x + 1));
          return (
            <g key={x} opacity={o}>
              <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`} stroke={C.amber} strokeWidth={5} fill="none" strokeDasharray="10 8" />
              <text x={b.x + 12} y={(b.y + c.y) / 2 + 10} fontSize={28} fontWeight={800} fill={C.amberDark}>+{cur.m}</text>
            </g>
          );
        })}
      {hl > 0 && (() => {
        const p = P(cur.highlight, f(cur.highlight));
        return (
          <g opacity={hl}>
            <path d={`M ${p.x} ${O.y} L ${p.x} ${p.y} L ${O.x} ${p.y}`} stroke={C.green} strokeWidth={4} fill="none" strokeDasharray="10 8" />
            <text x={O.x + 18} y={p.y - 18} fontSize={44} fontWeight={800} fill={C.green}>
              f({cur.highlight}) = {f(cur.highlight)}
            </text>
          </g>
        );
      })()}
      {cur.points.map((x) => {
        const p = P(x, f(x));
        const o = pointIn(x);
        return <circle key={x} cx={p.x} cy={p.y} r={14 * o} fill={x === 0 ? C.red : C.blue} stroke="#fff" strokeWidth={4} />;
      })}
      {cur.points.includes(0) && (
        <text x={start.x + 30} y={start.y + 12} fontSize={34} fontWeight={800} fill={C.red} opacity={pointIn(0)}>
          partida: {cur.n}
        </text>
      )}
    </svg>
  );
}

// Resultados de un experimento (monedas): aparecen uno a uno y se destacan
// los del evento que contamos.
export function Freq({ prev, cur, t, beat }) {
  const results = [...cur.results];
  const from = prev?.results === cur.results ? (prev.reveal ?? 0) : 0;
  const shown = lerp(from, cur.reveal ?? results.length, during(t, beat, 0.7));
  const hl = cur.highlight ? (prev?.highlight === cur.highlight ? 1 : ease(t, LEAD, LEAD + 16)) : 0;
  const cols = 10;
  const size = 96;
  const gap = 20;
  const x0 = 960 - (cols * size + (cols - 1) * gap) / 2;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {results.map((r, i) => {
        const o = interpolate(shown - i, [0, 1], [0, 1], clamp01);
        const x = x0 + (i % cols) * (size + gap) + size / 2;
        const y = 380 + Math.floor(i / cols) * (size + gap);
        const lit = r === cur.highlight;
        const fill = lit ? `color-mix(in srgb, ${C.amber} ${hl * 100}%, #94a3b8)` : `color-mix(in srgb, #e2e8f0 ${hl * 100}%, #94a3b8)`;
        return (
          <g key={i} opacity={o} transform={`translate(${x} ${y - 30 * (1 - o)})`}>
            <circle r={size / 2} fill={fill} />
            <text y={16} textAnchor="middle" fontSize={44} fontWeight={800} fill={lit || hl === 0 ? "#ffffff" : C.muted}>{r}</text>
          </g>
        );
      })}
      {cur.fraction && (
        <text x={960} y={720} textAnchor="middle" fontSize={76} fontWeight={800} fill={C.ink} opacity={prev?.fraction === cur.fraction ? 1 : ease(t, LEAD, LEAD + 14)}>
          {cur.fraction}
        </text>
      )}
    </svg>
  );
}

// Figuras para el área: rectángulo con cuadraditos, triángulo como mitad de
// un rectángulo y paralelogramo que se vuelve rectángulo al mover un triángulo.
export function Shape({ prev, cur, t, beat }) {
  const { kind, base, height } = cur;
  const slant = kind === "parallelogram" ? 0.5 : 0;
  const u = Math.min(720 / (base + height * slant), 380 / height);
  const W = base * u;
  const H = height * u;
  const S = height * slant * u;
  const x0 = 960 - (W + S) / 2;
  const y0 = 590 - H / 2;
  const pts = (list) => list.map(([x, y]) => `${x},${y}`).join(" ");
  const grid = [];
  if (cur.grid)
    for (let i = 1; i < base; i++) grid.push([x0 + i * u, y0, x0 + i * u, y0 + H]);
  if (cur.grid)
    for (let j = 1; j < height; j++) grid.push([x0, y0 + j * u, x0 + W, y0 + j * u]);
  // El triángulo que se corta y se mueve al otro lado.
  const move = cur.asRect ? (prev?.asRect ? 1 : during(t, beat, 0.6)) : 0;
  const labelBase = cur.labels?.base;
  const labelHeight = cur.labels?.height;
  return (
    <svg width={1920} height={1080} style={svgFill}>
      {kind === "rect" && (
        <g>
          <rect x={x0} y={y0} width={W} height={H} fill="#bfdbfe" stroke={C.beam} strokeWidth={5} />
          {grid.map(([a, b, c, d], i) => (
            <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#ffffff" strokeWidth={3} />
          ))}
        </g>
      )}
      {kind === "triangle" && (
        <g>
          <rect x={x0} y={y0} width={W} height={H} fill="#f1f5f9" stroke={C.muted} strokeWidth={3} strokeDasharray="12 10" />
          <polygon points={pts([[x0, y0 + H], [x0 + W, y0 + H], [x0, y0]])} fill={C.amberSoft} stroke={C.amberDark} strokeWidth={5} />
          <text x={x0 + W * 0.68} y={y0 + H * 0.35} textAnchor="middle" fontSize={40} fontWeight={700} fill={C.muted}>la otra mitad</text>
        </g>
      )}
      {kind === "parallelogram" && (
        <g>
          <polygon points={pts([[x0 + S, y0 + H], [x0 + W, y0 + H], [x0 + W + S, y0], [x0 + S, y0]])} fill="#bbf7d0" stroke={C.green} strokeWidth={5} />
          <g transform={`translate(${move * W} 0)`}>
            <polygon points={pts([[x0, y0 + H], [x0 + S, y0 + H], [x0 + S, y0]])} fill={move > 0 ? C.amberSoft : "#bbf7d0"} stroke={move > 0 ? C.amberDark : C.green} strokeWidth={5} />
          </g>
          {!cur.asRect && <line x1={x0 + S} y1={y0} x2={x0 + S} y2={y0 + H} stroke={C.red} strokeWidth={4} strokeDasharray="10 8" />}
        </g>
      )}
      {labelBase && (
        <text x={x0 + (kind === "parallelogram" && cur.asRect ? S : 0) + W / 2} y={y0 + H + 62} textAnchor="middle" fontSize={46} fontWeight={800} fill={C.blueDark}>
          {labelBase}
        </text>
      )}
      {labelHeight && (
        // En el paralelogramo inclinado, la etiqueta va junto a la altura (dentro), lejos del lado inclinado.
        <text
          x={kind === "parallelogram" ? x0 + S + (cur.asRect ? -24 : 20) : x0 - 24}
          y={y0 + H / 2 + 16}
          textAnchor={kind === "parallelogram" && !cur.asRect ? "start" : "end"}
          fontSize={46}
          fontWeight={800}
          fill={C.red}
        >
          {labelHeight}
        </text>
      )}
    </svg>
  );
}
