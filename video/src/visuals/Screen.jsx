import { Img, interpolate, staticFile } from "remotion";
import { C, clamp01, ease } from "../anim.js";

// Captura de la app dentro de una ventana de navegador, con un acercamiento
// lento (y opcionalmente un desplazamiento hacia `focus`, 0 a 1 en vertical).
export function Screen({ cur, t, beat, area }) {
  const height = 1080 - area.top - area.bottom - 20;
  const width = Math.round(((height - 44) * 1317) / 767);
  const a = ease(t, 0, 18);
  const zoom = interpolate(t, [0, beat.duration], [1, cur.zoom ?? 1.06], clamp01);
  const focus = cur.focus ?? 0.5;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: area.top, bottom: area.bottom, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width,
          height,
          borderRadius: 22,
          overflow: "hidden",
          background: "#ffffff",
          border: `2px solid ${C.soft}`,
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.18)",
          opacity: a,
          transform: `translateY(${24 * (1 - a)}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: 44, flex: "none", background: C.soft, display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <span style={{ marginLeft: 18, fontSize: 20, color: C.muted }}>socatres.pages.dev</span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Img
            src={staticFile(`promo/${cur.src}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: `50% ${focus * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
