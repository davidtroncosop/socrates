import { interpolate } from "remotion";
import { C, clamp01, ease, parseMarks, plainText, stagger } from "../anim.js";
import { LEAD } from "../timeline.js";

const MARK = {
  op: { color: C.red },
  key: { color: C.green },
  cut: { color: C.muted, textDecoration: "line-through", textDecorationThickness: 4 },
};
// Ecuaciones y frases con [[operación]], {{comprobación}} y ~~cancelado~~.
export function Marked({ text }) {
  return parseMarks(text).map((part, i) => (
    <span key={i} style={MARK[part.kind]}>
      {part.text}
    </span>
  ));
}

// Elementos nuevos (que no estaban en el paso anterior) entran escalonados.
const isNew = (prevList, item, key = (x) => JSON.stringify(x)) =>
  !(prevList ?? []).some((x) => key(x) === key(item));

const center = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" };

// Tarjetas de metáfora: un ícono grande, un título y una frase.
export function Cards({ prev, cur, t, beat, area }) {
  const fresh = cur.items.filter((item) => isNew(prev?.items, item));
  const single = cur.items.length === 1;
  return (
    <div style={{ ...center, top: area.top, bottom: area.bottom, justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 44, alignItems: "stretch" }}>
        {cur.items.map((item, i) => {
          const k = fresh.indexOf(item);
          const a = k === -1 ? 1 : stagger(t, k, fresh.length, beat.speak);
          return (
            <div
              key={item.title}
              style={{
                width: single ? 1240 : cur.items.length === 2 ? 700 : 520,
                background: "#ffffff",
                border: `2px solid ${C.soft}`,
                borderRadius: 36,
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)",
                padding: single ? "56px 70px" : "44px 40px",
                display: "flex",
                flexDirection: single ? "row" : "column",
                alignItems: "center",
                gap: single ? 56 : 18,
                textAlign: single ? "left" : "center",
                opacity: a,
                transform: `translateY(${30 * (1 - a)}px)`,
              }}
            >
              <div style={{ fontSize: single ? 190 : 120, lineHeight: 1 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: single ? 66 : 50, fontWeight: 800, lineHeight: 1.15 }}>{item.title}</div>
                {item.text && (
                  <div style={{ fontSize: single ? 42 : 36, color: C.muted, marginTop: 16, lineHeight: 1.3 }}>
                    <Marked text={item.text} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pasos en orden, con flechas: «primero esto, después esto».
export function Steps({ prev, cur, t, beat, area }) {
  const fresh = prev?.title === cur.title ? cur.steps.filter((s) => isNew(prev.steps, s)) : cur.steps;
  return (
    <div style={{ ...center, top: area.top, bottom: area.bottom, justifyContent: "center", gap: 56 }}>
      <div style={{ fontSize: 64, fontWeight: 800 }}>
        <Marked text={cur.title} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: cur.steps.length > 3 ? 22 : 36 }}>
        {cur.steps.map((step, i) => {
          const k = fresh.indexOf(step);
          const a = k === -1 ? 1 : stagger(t, k, fresh.length, beat.speak);
          return (
            <div key={i + step} style={{ display: "flex", alignItems: "center", gap: cur.steps.length > 3 ? 22 : 36, opacity: a, transform: `scale(${0.9 + 0.1 * a})` }}>
              {i > 0 && <div style={{ fontSize: cur.steps.length > 3 ? 56 : 80, color: C.muted }}>→</div>}
              <div style={{ position: "relative", fontSize: [66, 66, 66, 54, 52][cur.steps.length] ?? 46, fontWeight: 800, background: C.blueSoft, color: C.blueDark, borderRadius: 28, padding: cur.steps.length > 3 ? "26px 26px" : cur.steps.length > 2 ? "30px 38px" : "34px 50px", whiteSpace: "nowrap" }}>
                <div style={{ position: "absolute", top: -22, left: -22, width: 52, height: 52, borderRadius: 26, background: C.blue, color: "#fff", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </div>
                <Marked text={step} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Lista para recordar (cierre de cada lección).
export function List({ prev, cur, t, beat, area }) {
  const fresh = prev?.title === cur.title ? cur.items.filter((s) => isNew(prev.items, s)) : cur.items;
  return (
    <div style={{ ...center, top: area.top, bottom: area.bottom, justifyContent: "center" }}>
      <div style={{ background: "#ffffff", border: `2px solid ${C.soft}`, borderRadius: 36, boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)", padding: "54px 80px", maxWidth: 1500 }}>
        <div style={{ fontSize: 60, fontWeight: 800, marginBottom: 34 }}>{cur.title}</div>
        {cur.items.map((item) => {
          const k = fresh.indexOf(item);
          const a = k === -1 ? 1 : stagger(t, k, fresh.length, beat.speak);
          return (
            <div key={item} style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.3, margin: "22px 0", opacity: a, transform: `translateX(${-24 * (1 - a)}px)` }}>
              <Marked text={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Desarrollo algebraico paso a paso: cada línea nueva entra debajo; se ven
// las últimas cinco.
const VISIBLE = 5;
export function Lines({ prev, cur, t, beat, area }) {
  const before = prev?.lines ?? [];
  const sameStart = before.length > 0 && before.every((l, i) => cur.lines[i] === l);
  const freshFrom = sameStart ? before.length : 0;
  const freshCount = cur.lines.length - freshFrom;
  const shownFrom = Math.max(0, cur.lines.length - VISIBLE);
  const prevFrom = sameStart ? Math.max(0, before.length - VISIBLE) : shownFrom;
  const shift = interpolate(ease(t, 0, 16), [0, 1], [prevFrom, shownFrom]);
  const size = cur.size ?? 76;
  const rowH = size * 1.55;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: area.top, bottom: area.bottom, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30 - shift * rowH }}>
        {cur.lines.map((line, i) => {
          const a = i < freshFrom ? 1 : stagger(t, i - freshFrom, freshCount, beat.speak);
          const hidden = interpolate(i - shift, [-1, 0], [0, 1], clamp01);
          const last = i === cur.lines.length - 1;
          return (
            <div
              key={i}
              style={{
                height: rowH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size,
                fontWeight: last ? 800 : 700,
                color: last ? C.ink : "#334155",
                opacity: a * hidden * (last ? 1 : 0.8),
                transform: `translateY(${24 * (1 - a)}px)`,
                whiteSpace: "pre",
              }}
            >
              <Marked text={line} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Tabla con filas que aparecen y una flecha que relaciona dos filas.
export function Table({ prev, cur, t, beat, area }) {
  const before = prev?.rows ?? [];
  const freshIdx = cur.rows.map((_, i) => i).filter((i) => i >= before.length);
  const rowH = 118;
  // Posición fija: la tabla no salta cuando aparece o se va la ecuación.
  const top = 300;
  const arrowIn = cur.arrow && JSON.stringify(cur.arrow) !== JSON.stringify(prev?.arrow) ? ease(t, LEAD + 4, LEAD + 20) : cur.arrow ? 1 : 0;
  const width = cur.width ?? 1000;
  return (
    <div style={{ position: "absolute", top, left: (1920 - width) / 2, width }}>
      <div style={{ display: "flex", background: C.beam, color: "#fff", borderRadius: "24px 24px 0 0", fontSize: 40, fontWeight: 700 }}>
        {cur.headers.map((h) => (
          <div key={h} style={{ flex: 1, padding: "22px 30px", textAlign: "center" }}>{h}</div>
        ))}
      </div>
      {cur.rows.map((row, i) => {
        const k = freshIdx.indexOf(i);
        const a = k === -1 ? 1 : stagger(t, k, freshIdx.length, beat.speak);
        const lit = cur.highlight === i;
        return (
          <div key={i} style={{ display: "flex", height: rowH, alignItems: "center", background: lit ? C.greenSoft : i % 2 ? "#ffffff" : "#f1f5f9", opacity: a, fontSize: 52, fontWeight: 700 }}>
            {row.map((cell, j) => {
              const old = before[i]?.[j];
              const swap = old !== undefined && old !== cell ? ease(t, LEAD, LEAD + 14) : 1;
              return (
                <div key={j} style={{ flex: 1, textAlign: "center", position: "relative", fontSize: String(cell).length > 22 ? 34 : 52 }}>
                  {swap < 1 && <span style={{ position: "absolute", left: 0, right: 0, opacity: 1 - swap }}>{old}</span>}
                  <span style={{ opacity: swap, color: lit && j > 0 ? C.green : C.ink }}>
                    <Marked text={String(cell)} />
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
      {cur.arrow && (
        <div style={{ position: "absolute", left: width + 30, top: 82 + cur.arrow.from * rowH + rowH / 2, height: (cur.arrow.to - cur.arrow.from) * rowH, opacity: arrowIn }}>
          <svg width={60} height={Math.abs((cur.arrow.to - cur.arrow.from) * rowH) + 20} style={{ overflow: "visible" }}>
            <path d={`M 0 0 C 50 0, 50 ${(cur.arrow.to - cur.arrow.from) * rowH}, 0 ${(cur.arrow.to - cur.arrow.from) * rowH}`} stroke={C.red} strokeWidth={6} fill="none" />
            <path d={`M 0 ${(cur.arrow.to - cur.arrow.from) * rowH} l 16 -12 m -16 12 l 18 8`} stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: 70, top: ((cur.arrow.to - cur.arrow.from) * rowH) / 2 - 34, fontSize: 52, fontWeight: 800, color: C.red, whiteSpace: "nowrap" }}>
            {cur.arrow.label}
          </div>
        </div>
      )}
    </div>
  );
}

// Texto para leer, con pistas ([[…]] amarillo), ideas clave ({{…}} azul) y
// detalles descartados (~~…~~). Las marcas nuevas se pintan mientras la voz
// las nombra; las notas aparecen a la derecha.
const HL = {
  op: { background: "#fde68a" },
  key: { background: "#bfdbfe" },
  cut: { color: "#94a3b8", textDecoration: "line-through", textDecorationThickness: 3 },
};
export function Passage({ prev, cur, t, beat, area }) {
  const sameText = prev && plainText(prev.text) === plainText(cur.text);
  const known = new Set(sameText ? parseMarks(prev.text).filter((p) => p.kind !== "plain").map((p) => p.kind + p.text) : []);
  const parts = parseMarks(cur.text);
  const newMarks = parts.filter((p) => p.kind !== "plain" && !known.has(p.kind + p.text));
  const prevNotes = sameText ? (prev.notes ?? []) : [];
  const notes = cur.notes ?? [];
  const freshNotes = notes.filter((n) => isNew(prevNotes, n));
  const withNotes = notes.length > 0;
  const total = newMarks.length + freshNotes.length;
  return (
    <div style={{ position: "absolute", top: area.top + 10, bottom: area.bottom, left: 110, right: 110, display: "flex", gap: 50, alignItems: "center", justifyContent: "center" }}>
      <div style={{ flex: withNotes ? "0 0 1000px" : "0 1 1400px", background: "#ffffff", border: `2px solid ${C.soft}`, borderRadius: 32, boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)", padding: "50px 60px" }}>
        {cur.label && <div style={{ fontSize: 30, fontWeight: 700, color: C.muted, marginBottom: 18, textTransform: "uppercase", letterSpacing: 2 }}>{cur.label}</div>}
        <div style={{ fontSize: withNotes ? 44 : 50, lineHeight: 1.55, fontWeight: 500 }}>
          {parts.map((part, i) => {
            if (part.kind === "plain") return <span key={i}>{part.text}</span>;
            const k = newMarks.indexOf(part);
            const a = k === -1 ? 1 : stagger(t, k, total, beat.speak);
            const style = HL[part.kind];
            return (
              <span
                key={i}
                style={{
                  ...(part.kind === "cut"
                    ? { color: a > 0.5 ? style.color : C.ink, textDecoration: a > 0.5 ? style.textDecoration : "none", textDecorationThickness: 3 }
                    : { backgroundImage: `linear-gradient(${style.background}, ${style.background})`, backgroundSize: `${a * 100}% 100%`, backgroundRepeat: "no-repeat", borderRadius: 8, padding: "0 4px" }),
                }}
              >
                {part.text}
              </span>
            );
          })}
        </div>
      </div>
      {withNotes && (
        <div style={{ flex: "0 0 560px", display: "flex", flexDirection: "column", gap: 26 }}>
          {notes.map((note, i) => {
            const k = freshNotes.indexOf(note);
            const a = k === -1 ? 1 : stagger(t, newMarks.length + k, total, beat.speak);
            return (
              <div key={note.label + i} style={{ background: i === notes.length - 1 && notes.length > 1 ? C.blueSoft : "#ffffff", border: `2px solid ${C.soft}`, borderRadius: 26, padding: "26px 32px", opacity: a, transform: `translateX(${40 * (1 - a)}px)` }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.blue, textTransform: "uppercase", letterSpacing: 1.5 }}>{note.label}</div>
                <div style={{ fontSize: 38, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>
                  <Marked text={note.text} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
