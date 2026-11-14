// Minijuegos: antes de practicar, el estudiante toca, arrastra o aprieta un
// botón para ver la idea de la lección funcionando. No dan puntos ni tienen
// tiempo: se puede saltar, repetir y equivocarse sin consecuencias.
//
// Cada juego es una lista de rondas; cada ronda tiene un tipo (`kind`):
//   balance  botones: quitar lo mismo de cada lado de la balanza y repartir.
//   elevator botones: subir y bajar pisos (números enteros).
//   paint    tocar: pintar partes de una barra (fracciones, decimales, %).
//   first    tocar: elegir qué operación va primero (PAPOMUDAS).
//   sort     arrastrar: ordenar tarjetas de menor a mayor.
//   share    arrastrar o tocar: repartir en partes iguales.
//   build    botones: armar una cantidad con saltos iguales o con piezas.
//   point    tocar: ubicar un punto en el plano.
//   machine  botones: mover una perilla y ver cómo cambia el resultado.
//   counters botones: subir y bajar varias cantidades hasta que calcen.
//   draw     botón: repetir un experimento al azar y ver qué se junta.
//
// La lógica es pura (estado → estado, estado → HTML) para poder probarla sin
// navegador; `enableDrag` es lo único que toca el DOM.
import { escape } from "./ui.js";

// Números a la chilena: coma decimal, punto de miles y signo menos largo.
export function fmt(n) {
  const [int, dec] = String(Math.abs(n)).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+$)/g, ".");
  return (n < 0 ? "−" : "") + grouped + (dec ? "," + dec : "");
}
const round6 = (n) => Math.round(n * 1e6) / 1e6;
const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join("");
const act = (action, label, cls = "", extra = "") =>
  `<button type="button" class="mg-btn ${cls}" data-action="game:${action}"${extra}>${label}</button>`;

// ── Balanza ──────────────────────────────────────────────────────────────────
// a bolsas + b pesas = a2 bolsas + c pesas. Cada bolsa esconde x pesas.
const side = (bags, weights) => {
  const parts = [];
  if (bags) parts.push(bags === 1 ? "x" : `${bags}x`);
  if (weights || !bags) parts.push(fmt(weights));
  return parts.join(" + ");
};
const balance = {
  init: (r) => ({ a: r.a, b: r.b, a2: r.a2 ?? 0, c: r.c }),
  act(s, r, action) {
    if (action === "take") {
      if (s.b > 0 && s.c > 0) return { ...s, b: s.b - 1, c: s.c - 1, msg: "Quitaste 1 de cada lado. La balanza sigue pareja." };
      return { ...s, msg: "Ya no quedan pesas sueltas junto a las bolsas." };
    }
    if (action === "bag") {
      if (s.a2 > 0 && s.a > 0) return { ...s, a: s.a - 1, a2: s.a2 - 1, msg: "Quitaste 1 bolsa de cada lado. Sigue pareja." };
      return { ...s, msg: "Solo queda un lado con bolsas." };
    }
    if (action === "split") {
      if (s.b > 0 || s.a2 > 0) return { ...s, msg: "Primero deja las bolsas solas en un lado." };
      if (s.a === 1) return s;
      const c = s.c / s.a;
      return { ...s, a: 1, c, won: true, msg: `Repartiste en ${s.a} partes iguales. Cada bolsa pesa ${fmt(c)}: x = ${fmt(c)}.` };
    }
    return s;
  },
  // Una sola bolsa sola en su lado ya muestra cuánto vale.
  settle: (s) => (!s.won && s.a === 1 && s.b === 0 && s.a2 === 0 ? { ...s, won: true, msg: `La bolsa quedó sola: pesa ${fmt(s.c)}. x = ${fmt(s.c)}.` } : s),
  view(s, r) {
    const pan = (bags, weights) =>
      `<div class="mg-pan">${times(bags, () => '<span class="mg-bag" aria-hidden="true">🎒</span>')}${times(weights, () => '<span class="mg-weight" aria-hidden="true"></span>')}${bags + weights === 0 ? '<span class="muted">vacío</span>' : ""}</div>`;
    return `<div class="mg-balance" role="img" aria-label="Balanza: ${side(s.a, s.b)} igual a ${side(s.a2, s.c)}">${pan(s.a, s.b)}<span class="mg-equals">=</span>${pan(s.a2, s.c)}</div>
      <p class="mg-equation">${side(s.a, s.b)} = ${side(s.a2, s.c)}</p>
      ${
        s.won
          ? ""
          : `<div class="mg-controls">${act("take", "Quitar 1 pesa de cada lado")}${r.a2 ? act("bag", "Quitar 1 bolsa de cada lado") : ""}${s.a > 1 || r.a > 1 ? act("split", `Repartir en ${s.a} partes iguales`) : ""}</div>`
      }`;
  },
};

// ── Ascensor ─────────────────────────────────────────────────────────────────
const elevator = {
  init: (r) => ({ pos: r.start }),
  act(s, r, action) {
    const [min, max] = [r.min ?? -5, r.max ?? 5];
    if (action === "up") return { ...s, pos: Math.min(max, s.pos + 1), msg: "" };
    if (action === "down") return { ...s, pos: Math.max(min, s.pos - 1), msg: "" };
    if (action === "check") {
      const target = r.start + r.move;
      if (s.pos === target)
        return { ...s, won: true, msg: `¡Llegaste! ${fmt(r.start)} ${r.move > 0 ? "+" : "−"} ${Math.abs(r.move)} = ${fmt(target)}.` };
      const moved = s.pos - r.start;
      return {
        ...s,
        msg:
          moved === 0
            ? "Todavía estás donde partiste. Aprieta la flecha y cuenta cada piso."
            : `Te moviste ${Math.abs(moved)} ${Math.abs(moved) === 1 ? "piso" : "pisos"} hacia ${moved > 0 ? "arriba" : "abajo"}. Tienes que ${r.move > 0 ? "subir" : "bajar"} ${Math.abs(r.move)}.`,
      };
    }
    return s;
  },
  view(s, r) {
    const [min, max] = [r.min ?? -5, r.max ?? 5];
    const floors = [];
    for (let f = max; f >= min; f--)
      floors.push(
        `<li class="mg-floor${f === s.pos ? " here" : ""}${f === r.start ? " start" : ""}${f === 0 ? " ground" : ""}${f < 0 ? " under" : ""}"><span class="mg-floor-num">${fmt(f)}</span><span class="mg-floor-cabin" aria-hidden="true">${f === s.pos ? "🦉" : ""}</span><span class="mg-floor-note">${f === 0 ? "calle" : f === r.start ? "partiste aquí" : ""}</span></li>`,
      );
    return `<div class="mg-elevator"><ol class="mg-building" aria-label="Estás en el piso ${fmt(s.pos)}">${floors.join("")}</ol>
      ${
        s.won
          ? ""
          : `<div class="mg-controls mg-controls-col">${act("up", "▲ Subir 1")}${act("down", "▼ Bajar 1")}${act("check", "Aquí es", "primary")}</div>`
      }</div>`;
  },
};

// ── Pintar partes ────────────────────────────────────────────────────────────
const paint = {
  init: (r) => ({ on: Array(r.parts).fill(false) }),
  act(s, r, action, arg) {
    if (action === "cell") {
      const on = s.on.slice();
      on[Number(arg)] = !on[Number(arg)];
      return { ...s, on, msg: "" };
    }
    if (action === "check") {
      const n = s.on.filter(Boolean).length;
      const right = r.cells ? n === r.cells.length && r.cells.every((i) => s.on[i]) : n === r.target;
      if (right) return { ...s, won: true, msg: r.win };
      return { ...s, msg: n === 0 ? "Toca las partes para pintarlas." : `Pintaste ${n} ${n === 1 ? "parte" : "partes"}. ${r.hint}` };
    }
    return s;
  },
  view(s, r) {
    const cols = r.cols ?? r.parts;
    const ref = r.ref
      ? `<div class="mg-ref"><span class="muted">${escape(r.ref.label)}</span><div class="mg-bar" style="grid-template-columns:repeat(${r.ref.parts},1fr)">${times(r.ref.parts, (i) => `<span class="mg-cell${i < r.ref.painted ? " on" : ""}"></span>`)}</div></div>`
      : "";
    return `${ref}<div class="mg-bar" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${s.on
      .map(
        (on, i) =>
          `<button type="button" class="mg-cell${on ? " on" : ""}" data-action="game:cell:${i}" aria-pressed="${on}" aria-label="Parte ${i + 1}"${s.won ? " disabled" : ""}>${r.cellLabels?.[i] ?? r.cellLabel ?? ""}</button>`,
      )
      .join("")}</div>
      <p class="mg-count">Pintadas: <strong>${s.on.filter(Boolean).length}</strong> de ${r.parts}</p>
      ${s.won ? "" : `<div class="mg-controls">${act("check", "Listo", "primary")}</div>`}`;
  },
};

// ── ¿Qué va primero? ─────────────────────────────────────────────────────────
const OPS = { "+": (a, b) => a + b, "−": (a, b) => a - b, "·": (a, b) => a * b, "÷": (a, b) => a / b, "^": (a, b) => a ** b };
export const parseExpression = (text) =>
  text.split(" ").map((t) => (t in OPS || t === "(" || t === ")" ? t : Number(t.replace("−", "-"))));
// Índice de la operación que corresponde hacer ahora.
export function nextOperation(tokens) {
  let from = 0,
    to = tokens.length;
  const close = tokens.indexOf(")");
  if (close !== -1) {
    to = close;
    from = tokens.lastIndexOf("(", close) + 1;
  }
  for (const level of [["^"], ["·", "÷"], ["+", "−"]])
    for (let i = from; i < to; i++) if (level.includes(tokens[i])) return { index: i, inParens: close !== -1 };
  return null;
}
const OP_NAMES = { "+": "la suma", "−": "la resta", "·": "la multiplicación", "÷": "la división", "^": "la potencia" };
const first = {
  init: (r) => ({ tokens: parseExpression(r.expression) }),
  act(s, r, action, arg) {
    if (action !== "op") return s;
    const i = Number(arg),
      due = nextOperation(s.tokens);
    if (!due || !(s.tokens[i] in OPS)) return s;
    if (i !== due.index) {
      const op = s.tokens[due.index];
      const why = due.inParens
        ? "Primero lo que está dentro del paréntesis."
        : op === "^"
          ? "Primero las potencias."
          : op === "·" || op === "÷"
            ? "Primero se multiplica y se divide. Después se suma y se resta."
            : "Las que quedan se hacen de izquierda a derecha.";
      return { ...s, msg: `Todavía no. ${why}` };
    }
    const [a, op, b] = s.tokens.slice(i - 1, i + 2);
    const result = OPS[op](a, b);
    const tokens = [...s.tokens.slice(0, i - 1), result, ...s.tokens.slice(i + 2)];
    // Un paréntesis con un solo número ya no hace falta.
    const at = i - 1;
    if (tokens[at - 1] === "(" && tokens[at + 1] === ")") tokens.splice(at - 1, 3, result);
    const text = op === "^" ? `${fmt(a)} elevado a ${fmt(b)} es ${fmt(result)}` : `${fmt(a)} ${op} ${fmt(b)} = ${fmt(result)}`;
    return tokens.length === 1
      ? { ...s, tokens, won: true, msg: `${text}. ¡El resultado es ${fmt(result)}!` }
      : { ...s, tokens, msg: `Bien: ${text}. ¿Y ahora?` };
  },
  view(s) {
    const out = [];
    for (let i = 0; i < s.tokens.length; i++) {
      const t = s.tokens[i];
      if (t === "^") {
        // Potencia de un paréntesis: el exponente es el botón.
        out.push(`<button type="button" class="mg-op mg-pow" data-action="game:op:${i}" aria-label="elevado a ${fmt(s.tokens[i + 1])}"><sup>${fmt(s.tokens[i + 1])}</sup></button>`);
        i += 1;
      } else if (typeof t === "number" && s.tokens[i + 1] === "^") {
        out.push(
          `<button type="button" class="mg-op mg-pow" data-action="game:op:${i + 1}" aria-label="${fmt(t)} elevado a ${fmt(s.tokens[i + 2])}">${fmt(t)}<sup>${fmt(s.tokens[i + 2])}</sup></button>`,
        );
        i += 2;
      } else if (t in OPS) out.push(`<button type="button" class="mg-op" data-action="game:op:${i}" aria-label="${OP_NAMES[t]}">${t}</button>`);
      else out.push(`<span class="mg-num${s.won ? " result" : ""}">${typeof t === "number" ? fmt(t) : t}</span>`);
    }
    return `<div class="mg-expression">${out.join("")}</div>${s.won ? "" : '<p class="mg-count">Toca el signo de la operación que va primero.</p>'}`;
  },
};

// ── Ordenar ──────────────────────────────────────────────────────────────────
const sort = {
  init: (r) => ({ order: r.items.map((_, i) => i), picked: null }),
  act(s, r, action, arg, arg2) {
    if (action === "pick") {
      const i = Number(arg);
      if (s.picked === null) return { ...s, picked: i, msg: "Ahora toca la tarjeta con la que quieres cambiarla." };
      const order = s.order.slice();
      [order[s.picked], order[i]] = [order[i], order[s.picked]];
      return { ...s, order, picked: null, msg: "" };
    }
    if (action === "drop") {
      const from = Number(arg),
        to = Number(arg2);
      if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return { ...s, picked: null };
      const order = s.order.slice();
      order.splice(to, 0, ...order.splice(from, 1));
      return { ...s, order, picked: null, msg: "" };
    }
    if (action === "check") {
      const values = s.order.map((i) => r.items[i].value);
      if (values.every((v, i) => i === 0 || values[i - 1] <= v)) return { ...s, won: true, picked: null, msg: r.win };
      return { ...s, picked: null, msg: `Todavía no. ${r.hint}` };
    }
    return s;
  },
  view(s, r) {
    return `<div class="mg-sort"><span class="mg-sort-end">menor</span>${s.order
      .map(
        (item, i) =>
          `<button type="button" class="mg-card${s.picked === i ? " picked" : ""}" data-action="game:pick:${i}" data-drag="${i}" data-drop="${i}"${s.won ? " disabled" : ""}>${escape(r.items[item].label)}</button>`,
      )
      .join("")}<span class="mg-sort-end">mayor</span></div>
      ${s.won ? "" : `<p class="mg-count">Arrastra las tarjetas, o toca dos para cambiarlas de lugar.</p><div class="mg-controls">${act("check", "Listo", "primary")}</div>`}`;
  },
};

// ── Repartir ─────────────────────────────────────────────────────────────────
const share = {
  init: (r) => ({ pile: r.total, plates: Array(r.plates).fill(0) }),
  act(s, r, action, arg, arg2) {
    // Soltar la pila sobre un plato es lo mismo que tocar el plato.
    const i = Number(action === "drop" ? arg2 : arg);
    const plates = s.plates.slice();
    if (action === "put" || action === "drop") {
      if (!(i in plates)) return s;
      if (s.pile === 0) return { ...s, msg: "Ya repartiste todo. Si no quedó parejo, saca de un plato con el botón −." };
      plates[i]++;
      const pile = s.pile - 1;
      if (pile > 0) return { ...s, pile, plates, msg: "" };
      if (plates.every((p) => p === plates[0]))
        return { ...s, pile, plates, won: true, msg: `¡Quedó parejo! ${r.total} repartido en ${r.plates} da ${plates[0]} para cada uno: ${r.total} ÷ ${r.plates} = ${plates[0]}.` };
      return { ...s, pile, plates, msg: "No quedó parejo. Saca de donde hay más (botón −) y ponlo donde hay menos." };
    }
    if (action === "take" && plates[i] > 0) {
      plates[i]--;
      return { ...s, pile: s.pile + 1, plates, msg: "" };
    }
    return s;
  },
  view(s, r) {
    const item = r.item ?? "🍪";
    return `<div class="mg-share"><div class="mg-pile${s.pile ? "" : " empty"}"><span class="mg-pile-items" aria-hidden="true">${times(Math.min(s.pile, 30), () => `<span class="mg-item" data-drag="pile">${item}</span>`)}</span><strong>${s.pile ? `Quedan ${s.pile}` : "Nada por repartir"}</strong></div>
      <div class="mg-plates">${s.plates
        .map(
          (n, i) =>
            `<div class="mg-plate-wrap"><button type="button" class="mg-plate" data-action="game:put:${i}" data-drop="${i}" aria-label="${escape(r.container ?? "Plato")} ${i + 1}: tiene ${n}. Toca para poner uno."${s.won ? " disabled" : ""}><span aria-hidden="true">${times(n, () => item)}</span><strong>${n}</strong></button>${s.won ? "" : act(`take:${i}`, "−", "mg-minus", ` aria-label="Sacar uno del ${escape(r.container ?? "plato")} ${i + 1}"${n ? "" : " disabled"}`)}</div>`,
        )
        .join("")}</div></div>
      ${s.won ? "" : '<p class="mg-count">Toca un plato para poner uno, o arrastra desde el montón.</p>'}`;
  },
};

// ── Armar una cantidad ───────────────────────────────────────────────────────
const build = {
  init: (r) => ({ value: r.start ?? 0, counts: r.steps.map(() => 0) }),
  act(s, r, action, arg) {
    const i = Number(arg);
    if (!(i in s.counts)) return s;
    const counts = s.counts.slice();
    if (action === "add") counts[i]++;
    else if (action === "sub" && counts[i] > 0) counts[i]--;
    else return s;
    const value = round6((r.start ?? 0) + r.steps.reduce((sum, step, k) => sum + step * counts[k], 0));
    const unit = r.unit ?? "";
    if (value === r.target) {
      const win =
        r.win ??
        (r.steps.length === 1
          ? `${counts[0]} veces ${unit}${fmt(r.steps[0])} es ${unit}${fmt(r.target)}. Eso es ${counts[0]} · ${fmt(r.steps[0])} = ${fmt(r.target)}.`
          : `¡Justo! ${r.steps.map((step, k) => `${counts[k]} de ${unit}${fmt(step)}`).join(", ")}.`);
      return { ...s, counts, value, won: true, msg: win };
    }
    return { ...s, counts, value, msg: value > r.target ? "Te pasaste. Quita con el botón −." : "" };
  },
  view(s, r) {
    const unit = r.unit ?? "";
    return `<div class="mg-build"><div class="mg-total${s.value > r.target ? " over" : ""}"><span>Llevas</span><strong>${unit}${fmt(s.value)}</strong><span>Meta: ${unit}${fmt(r.target)}</span></div>
      <div class="mg-meter" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, (s.value / r.target) * 100))}%"></span></div>
      <div class="mg-steps">${r.steps
        .map(
          (step, i) =>
            `<div class="mg-step">${s.won ? "" : act(`sub:${i}`, "−", "mg-minus", ` aria-label="Quitar ${fmt(step)}"${s.counts[i] ? "" : " disabled"}`)}${s.won ? `<span class="mg-chip">${unit}${fmt(step)}</span>` : act(`add:${i}`, `+ ${unit}${fmt(step)}`, "mg-chip")}<span class="mg-times">× ${s.counts[i]}</span></div>`,
        )
        .join("")}</div></div>`;
  },
};

// ── Punto en el plano ────────────────────────────────────────────────────────
const point = {
  init: () => ({ tapped: null }),
  act(s, r, action, arg, arg2) {
    if (action !== "tap") return s;
    const x = Number(arg),
      y = Number(arg2);
    if (x === r.x && y === r.y)
      return { tapped: [x, y], won: true, msg: `¡Ese es! (${fmt(r.x)}, ${fmt(r.y)}): ${Math.abs(r.x)} hacia ${r.x < 0 ? "la izquierda" : "la derecha"} y ${Math.abs(r.y)} hacia ${r.y < 0 ? "abajo" : "arriba"}.` };
    return {
      tapped: [x, y],
      msg:
        x === r.y && y === r.x
          ? "Casi: están al revés. El primer número es hacia el lado; el segundo, hacia arriba o abajo."
          : `Ese es el punto (${fmt(x)}, ${fmt(y)}). Parte del 0: primero camina hacia el lado, después sube o baja.`,
    };
  },
  view(s, r) {
    const [min, max] = [r.min ?? 0, r.max ?? 5];
    const rows = [];
    for (let y = max; y >= min; y--) {
      let row = `<span class="mg-axis-label">${fmt(y)}</span>`;
      for (let x = min; x <= max; x++)
        row += `<button type="button" class="mg-dot${x === 0 ? " axis-y" : ""}${y === 0 ? " axis-x" : ""}${s.tapped?.[0] === x && s.tapped?.[1] === y ? (s.won ? " hit" : " miss") : ""}${r.marks?.some(([mx, my]) => mx === x && my === y) ? " mark" : ""}" data-action="game:tap:${x}:${y}" aria-label="Punto ${fmt(x)}, ${fmt(y)}"${s.won ? " disabled" : ""}></button>`;
      rows.push(row);
    }
    let labels = "<span></span>";
    for (let x = min; x <= max; x++) labels += `<span class="mg-axis-label">${fmt(x)}</span>`;
    return `<div class="mg-plane" style="grid-template-columns:auto repeat(${max - min + 1},minmax(0,1fr))">${rows.join("")}${labels}</div>`;
  },
};

// ── Dibujos para la máquina ──────────────────────────────────────────────────
const num = (n) => fmt(Math.round(n * 100) / 100);
const tiles = (cols, n) =>
  `<div class="mg-tiles" style="grid-template-columns:repeat(${Math.max(1, cols)},20px)">${times(Math.min(n, 150), () => '<span class="mg-tile"></span>')}</div>`;
const dial = (deg) =>
  `<div class="mg-dial" style="background:conic-gradient(from 90deg,#f5a524 0 ${Math.max(0, Math.min(360, deg))}deg,#ffffff 0)"></div>`;
// Dos ángulos vecinos sobre una recta: el naranjo y lo que le falta para 180°.
const neighbors = (deg) =>
  `<div class="mg-dial" style="background:conic-gradient(from 90deg,#f5a524 0 ${deg}deg,#7fb0ff 0 180deg,#ffffff 0)"></div>`;
const bars = (values, labels, max = Math.max(...values, 1)) =>
  `<div class="mg-bars">${values.map((v, i) => `<span class="mg-bar-col"><span class="mg-bar-fill" style="height:${Math.max(0, Math.min(100, (v / max) * 100))}%"></span><small>${labels?.[i] ?? fmt(v)}</small></span>`).join("")}</div>`;
const many = (n, emoji) => `<div class="mg-many">${times(Math.max(0, Math.min(n, 60)), () => emoji)}</div>`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (n, d) => {
  const g = gcd(Math.abs(n), d) || 1;
  return d / g === 1 ? fmt(n / g) : `${fmt(n / g)}/${d / g}`;
};

// ── Máquina ──────────────────────────────────────────────────────────────────
// Una perilla (x) y un resultado f(x) que cambia en vivo. Se gana cuando el
// resultado es `target` o, si la ronda trae `ok`, cuando `ok(x, y)` se cumple.
const machine = {
  init: (r) => ({ x: r.start }),
  act(s, r, action) {
    const step = r.step ?? 1;
    if (action === "inc") return { ...s, x: Math.min(r.max, round6(s.x + step)), msg: "" };
    if (action === "dec") return { ...s, x: Math.max(r.min, round6(s.x - step)), msg: "" };
    if (action !== "check") return s;
    const y = r.f(s.x),
      show = r.show ?? num;
    if (r.ok ? r.ok(s.x, y) : Math.abs(y - r.target) < 1e-6) return { ...s, won: true, msg: r.win };
    return {
      ...s,
      msg: r.ok
        ? `Todavía no. ${r.hint ?? ""}`
        : `Con ${r.input} = ${num(s.x)} sale ${show(y, s.x)}. Buscas ${show(r.target)}.${r.hint ? " " + r.hint : ""}`,
    };
  },
  view(s, r) {
    const y = r.f(s.x),
      show = r.show ?? num;
    return `${r.draw ? `<div class="mg-picture">${r.draw(s.x, y)}</div>` : ""}
      <div class="mg-machine"><div class="mg-io"><span class="mg-io-label">${escape(r.input)}</span><div class="mg-stepper">${
        s.won ? "" : act("dec", "−", "mg-minus", ` aria-label="Bajar ${escape(r.input)}"${s.x <= r.min ? " disabled" : ""}`)
      }<strong>${num(s.x)}</strong>${s.won ? "" : act("inc", "+", "mg-minus", ` aria-label="Subir ${escape(r.input)}"${s.x >= r.max ? " disabled" : ""}`)}</div></div>
      <span class="mg-arrow" aria-hidden="true">→</span>${r.rule ? `<span class="mg-rule">${escape(r.rule)}</span><span class="mg-arrow" aria-hidden="true">→</span>` : ""}
      <div class="mg-io"><span class="mg-io-label">${escape(r.output)}</span><strong class="mg-out">${show(y, s.x)}</strong></div></div>
      ${s.won ? "" : `<p class="mg-count">${r.goal ? escape(r.goal) : `Buscas: <strong>${escape(r.output)} = ${show(r.target)}</strong>`}</p><div class="mg-controls">${act("check", "Listo", "primary")}</div>`}`;
  },
};

// ── Contadores ───────────────────────────────────────────────────────────────
const counters = {
  init: (r) => ({ counts: r.items.map(() => 0) }),
  act(s, r, action, arg) {
    const i = Number(arg),
      counts = s.counts.slice();
    if (action === "add" && i in counts && counts[i] < (r.max ?? 12)) counts[i]++;
    else if (action === "sub" && counts[i] > 0) counts[i]--;
    else if (action === "check")
      return s.counts.every((c, k) => c === r.target[k]) ? { ...s, won: true, msg: r.win } : { ...s, msg: `Todavía no. ${r.hint}` };
    else return s;
    return { ...s, counts, msg: "" };
  },
  view(s, r) {
    return `<div class="mg-counters">${r.items
      .map(
        ([label, emoji], i) =>
          `<div class="mg-counter"><span class="mg-counter-label">${escape(label)}</span>${s.won ? "" : act(`sub:${i}`, "−", "mg-minus", ` aria-label="Quitar: ${escape(label)}"${s.counts[i] ? "" : " disabled"}`)}<strong class="mg-counter-num">${s.counts[i]}</strong>${s.won ? "" : act(`add:${i}`, "+", "mg-minus", ` aria-label="Agregar: ${escape(label)}"`)}<span class="mg-counter-chips" aria-hidden="true">${emoji ? times(s.counts[i], () => emoji) : `<span class="mg-counter-bar" style="width:${s.counts[i] * 14}px"></span>`}</span></div>`,
      )
      .join("")}</div>${s.won ? "" : `<div class="mg-controls">${act("check", "Listo", "primary")}</div>`}`;
  },
};

// ── Experimento al azar ──────────────────────────────────────────────────────
const coins = (n) => (rnd) => Array.from({ length: n }, () => rnd() < 0.5).filter(Boolean).length;
const weighted = (weights) => (rnd) => {
  let pick = rnd() * weights.reduce((a, b) => a + b, 0);
  return weights.findIndex((w) => (pick -= w) < 0);
};
const draw = {
  init: (r) => ({ tally: r.outcomes.map(() => 0), last: null }),
  act(s, r, action, arg) {
    if (action !== "go") return s;
    const tally = s.tally.slice();
    let last = s.last;
    for (let i = 0; i < (Number(arg) || 1); i++) {
      last = r.sample(Math.random);
      tally[last]++;
    }
    const total = tally.reduce((a, b) => a + b, 0);
    return total >= r.goal ? { tally, last, won: true, msg: r.win(tally, total) } : { tally, last, msg: "" };
  },
  view(s, r) {
    const total = s.tally.reduce((a, b) => a + b, 0);
    return `<p class="mg-last">${s.last === null ? "Aprieta el botón." : `Salió: <strong>${escape(r.outcomes[s.last])}</strong>`}</p>
      ${bars(s.tally, r.outcomes.map((o, i) => `${escape(o)}: ${s.tally[i]}`), Math.max(...s.tally, 5))}
      <p class="mg-count">Llevas <strong>${total}</strong> de ${r.goal}.</p>
      ${s.won ? "" : `<div class="mg-controls">${act("go:1", r.verb ?? "Una vez", "primary")}${act("go:10", "10 veces")}</div>`}`;
  },
};

const KINDS = { balance, elevator, paint, first, sort, share, build, point, machine, counters, draw };

// ── Juegos por lección ───────────────────────────────────────────────────────
const bal = (a, b, c, a2 = 0) => ({
  kind: "balance",
  a,
  b,
  c,
  a2,
  prompt: "Cada bolsa esconde la misma cantidad de pesas. Deja una bolsa sola para saber cuánto pesa. Lo que hagas en un lado, hazlo en el otro.",
});
const lift = (start, move) => ({
  kind: "elevator",
  start,
  move,
  prompt: `Estás en el piso ${fmt(start)}. ${move > 0 ? "Sube" : "Baja"} ${Math.abs(move)} pisos. ¿A qué piso llegas?`,
});
const firstOp = (expression) => ({
  kind: "first",
  expression,
  prompt: "Resuelve paso a paso. Toca la operación que va primero.",
});
const jumps = (step, target, prompt, extra = {}) => ({ kind: "build", steps: [step], target, prompt, ...extra });
const ascending = (prompt, items, hint) => ({
  kind: "sort",
  prompt,
  hint,
  win: "¡Ordenadas de menor a mayor!",
  items: items.map((it) => (typeof it === "number" ? { label: fmt(it), value: it } : { label: it[0], value: it[1] })),
});

export const GAMES = {
  equations: [bal(1, 3, 8), bal(2, 1, 7), bal(3, 2, 14)],
  both: [bal(2, 1, 5, 1), bal(3, 2, 8, 1)],
  signs: [lift(-3, 5), lift(2, -6)],
  enteros: [lift(-3, 5), lift(2, -6), lift(-1, -4)],
  "valor-absoluto": [lift(0, -4), lift(0, 4)],
  "jerarquia-mult": [firstOp("3 + 4 · 2"), firstOp("20 − 12 ÷ 4"), firstOp("2 · 5 + 6 ÷ 3")],
  "jerarquia-parentesis": [firstOp("( 3 + 4 ) · 2"), firstOp("20 − ( 6 + 4 ) ÷ 2"), firstOp("2 · ( 8 − 3 ) + 1")],
  "jerarquia-enteros": [firstOp("−3 + 4 · 2"), firstOp("6 − 2 · 5"), firstOp("( −2 + 6 ) · −3")],
  "jerarquia-potencias": [firstOp("2 + 3 ^ 2"), firstOp("2 · 5 ^ 2"), firstOp("( 1 + 2 ) ^ 2 − 4")],
  "base-valor-posicional": [
    { kind: "build", steps: [100, 10, 1], target: 243, prompt: "Arma el número 243 con piezas de 100, de 10 y de 1.", win: "243 son 2 cientos, 4 dieces y 3 unos." },
    ascending("Ordena de menor a mayor. Mira primero los cientos.", [350, 53, 305], "Compara primero cuántos cientos tiene cada uno."),
  ],
  "base-suma-resta": [
    { kind: "build", start: 38, steps: [10, 1], target: 52, prompt: "Tienes 38. Llega a 52 sumando de a 10 y de a 1.", win: "38 + 14 = 52. Sumaste 1 diez y 4 unos." },
    { kind: "build", start: 46, steps: [10, 1], target: 71, prompt: "Tienes 46. Llega a 71 sumando de a 10 y de a 1.", win: "46 + 25 = 71. Sumaste 2 dieces y 5 unos." },
  ],
  "base-multiplicar": [
    jumps(10, 40, "Cada sobre trae 10 láminas. Agrega sobres hasta tener 40 láminas."),
    jumps(5, 30, "Cada mano tiene 5 dedos. Agrega manos hasta contar 30 dedos."),
  ],
  "base-mult-dos-cifras": [
    { kind: "build", steps: [120, 12], target: 156, prompt: "12 · 13 por partes: junta 10 veces 12 (son 120) y después 3 veces 12.", win: "120 + 36 = 156. Multiplicaste por 10 y por 3, y sumaste." },
  ],
  "base-dividir": [
    { kind: "share", total: 12, plates: 3, prompt: "Reparte 12 galletas en 3 platos. Todos deben tener lo mismo." },
    { kind: "share", total: 20, plates: 4, prompt: "Reparte 20 galletas en 4 platos, parejo." },
  ],
  "base-division-larga": [{ kind: "share", total: 24, plates: 4, item: "🍬", prompt: "Reparte 24 dulces en 4 bolsas, parejo." }],
  promedio: [
    { kind: "share", total: 12, plates: 3, item: "🍬", prompt: "Tres amigos tienen 2, 4 y 6 dulces. Los juntan: son 12. Repártelos parejo: eso es el promedio." },
  ],
  "base-fracciones": [
    { kind: "paint", parts: 4, target: 3, prompt: "Pinta 3/4 del chocolate.", hint: "El número de arriba dice cuántas partes pintar.", win: "3 de 4 partes iguales: eso es 3/4." },
    { kind: "paint", parts: 5, target: 2, prompt: "Pinta 2/5 de la barra.", hint: "El número de arriba dice cuántas partes pintar.", win: "2 de 5 partes iguales: eso es 2/5." },
  ],
  "base-fracciones-equivalentes": [
    { kind: "paint", parts: 4, target: 2, ref: { label: "Esto es 1/2", parts: 2, painted: 1 }, prompt: "Pinta la misma cantidad que 1/2, pero con cuartos.", hint: "Tiene que quedar pintado igual de largo que arriba.", win: "1/2 = 2/4. Es la misma cantidad, cortada en más partes." },
    { kind: "paint", parts: 6, target: 4, ref: { label: "Esto es 2/3", parts: 3, painted: 2 }, prompt: "Pinta la misma cantidad que 2/3, pero con sextos.", hint: "Tiene que quedar pintado igual de largo que arriba.", win: "2/3 = 4/6. Es la misma cantidad, cortada en más partes." },
  ],
  "fracciones-suma": [
    { kind: "paint", parts: 4, target: 3, prompt: "Comiste 1/4 de pizza y después 2/4. Pinta todo lo que comiste.", hint: "Junta las partes: 1 parte más 2 partes.", win: "1/4 + 2/4 = 3/4. Se suman las partes; el tamaño de la parte no cambia." },
  ],
  "fracciones-mixtos": [
    { kind: "paint", parts: 8, cols: 4, target: 5, prompt: "Cada fila es un chocolate entero, cortado en cuartos. Pinta 5/4.", hint: "Son 5 partes: no caben en un solo chocolate.", win: "5/4 es 1 chocolate entero y 1/4 más." },
  ],
  "base-decimales": [
    { kind: "paint", parts: 10, cols: 5, target: 7, cellLabel: "0,1", prompt: "La barra mide 1 metro. Cada parte es 0,1. Pinta 0,7 metros.", hint: "0,7 son 7 décimos.", win: "7 partes de 0,1 son 0,7." },
    ascending("Ordena de menor a mayor.", [0.5, 0.25, 0.8], "Piensa en plata: 0,5 son 50 centavos y 0,25 son 25."),
  ],
  porcentajes: [
    { kind: "paint", parts: 10, cols: 5, target: 3, cellLabel: "10%", prompt: "Cada parte es el 10%. Pinta el 30%.", hint: "30% son 3 partes de 10%.", win: "30% es 30 de cada 100: 3 partes de 10." },
    { kind: "paint", parts: 10, cols: 5, target: 5, cellLabel: "10%", prompt: "Pinta el 50%.", hint: "50% es la mitad.", win: "50% es la mitad." },
  ],
  "variacion-porcentual": [
    { kind: "paint", parts: 10, cols: 5, target: 8, cellLabel: "10%", prompt: "Una polera tiene 20% de descuento. Pinta la parte que SÍ pagas.", hint: "Si te descuentan 20%, pagas el resto.", win: "Con 20% de descuento pagas el 80% del precio." },
  ],
  "multiplos-divisores": [
    jumps(3, 12, "Salta de 3 en 3 hasta llegar a 12. Los números donde caes son múltiplos de 3."),
    jumps(4, 20, "Salta de 4 en 4 hasta llegar a 20."),
  ],
  proporciones: [jumps(800, 2400, "Un kilo de pan cuesta $800. Agrega kilos hasta ver cuánto cuestan 3.", { unit: "$" })],
  "potencias-10": [ascending("Ordena de menor a mayor.", [["10²", 100], ["10", 10], ["10³", 1000]], "10² es 10 · 10. 10³ es 10 · 10 · 10.")],
  "plano-cartesiano": [
    { kind: "point", x: 3, y: 2, prompt: "Toca el punto (3, 2). Parte del 0: 3 hacia la derecha y 2 hacia arriba." },
    { kind: "point", x: 1, y: 4, prompt: "Toca el punto (1, 4)." },
    { kind: "point", x: -2, y: 1, min: -3, max: 3, prompt: "Toca el punto (−2, 1). El menos manda hacia la izquierda." },
  ],
  funcion: [
    { kind: "point", x: 2, y: 5, max: 6, prompt: "En y = 2x + 1, si x vale 2, y vale 5. Toca ese punto: (2, 5)." },
  ],
  "base-tiempo": [jumps(60, 180, "Una hora tiene 60 minutos. Agrega horas hasta saber cuántos minutos son 3 horas.")],
  "base-longitud": [jumps(100, 300, "Un metro tiene 100 centímetros. Agrega metros hasta saber cuántos centímetros son 3 metros.")],
  "base-masa": [jumps(500, 2000, "Cada paquete pesa 500 gramos. Agrega paquetes hasta juntar 2 kilos (2.000 gramos).")],
  "problemas-compras": [
    { kind: "build", steps: [500, 100, 50, 10], target: 760, unit: "$", prompt: "Paga justo $760 con monedas.", win: "$760 pagados justo, sin vuelto." },
  ],
  "problemas-ahorro": [jumps(2000, 10000, "Ahorras $2.000 cada semana. Agrega semanas hasta juntar $10.000.", { unit: "$" })],
};

// ── Más juegos: una máquina, contadores o un experimento por lección ─────────
const mach = (prompt, input, output, f, target, opts = {}) => ({ kind: "machine", prompt, input, output, f, target, start: 1, min: 0, max: 12, ...opts });
const count = (prompt, items, target, hint, win, opts = {}) => ({ kind: "counters", prompt, items, target, hint, win, ...opts });
const sample = (prompt, outcomes, sampler, goal, win, opts = {}) => ({ kind: "draw", prompt, outcomes, sample: sampler, goal, win, ...opts });
const money = (y) => "$" + num(y);
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const pct = (part, total) => Math.round((part / total) * 100);

Object.assign(GAMES, {
  racionales: [mach("0,5x es media bolsa. Cambia x hasta que media bolsa sea 4.", "x", "0,5 · x", (x) => x / 2, 4, { start: 2, win: "La mitad de 8 es 4. Si 0,5x = 4, entonces x = 8." })],
  combinadas: [count("2(x + 4) son 2 grupos de «x + 4». Desarma el paréntesis: ¿cuántas x y cuántos unos quedan?", [["x", "🎒"], ["unos", "🟧"]], [2, 8], "Cada grupo trae 1 x y 4 unos. Son 2 grupos.", "2(x + 4) = 2x + 8. El 2 multiplica a todo lo de adentro.")],
  problemas: [mach("Pienso un número, lo doblo y le sumo 5. Me da 21. Busca el número.", "número", "resultado", (x) => 2 * x + 5, 21, { rule: "· 2 + 5", win: "2 · 8 + 5 = 21. El número es 8: eso es resolver 2x + 5 = 21." })],
  semejantes: [count("3 manzanas + 2 peras + 4 manzanas. Junta las frutas iguales.", [["manzanas (x)", "🍎"], ["peras (y)", "🍐"]], [7, 2], "Manzanas con manzanas, peras con peras.", "3x + 2y + 4x = 7x + 2y. Solo se juntan los que tienen la misma letra.")],
  potencias: [mach("Cada paso multiplica por 2. Cambia el exponente hasta llegar a 32.", "exponente", "2 elevado a eso", (x) => 2 ** x, 32, { max: 6, draw: (x, y) => tiles(8, y), win: "2⁵ = 2 · 2 · 2 · 2 · 2 = 32. El exponente dice cuántas veces se multiplica." })],
  notables: [count("(x + 2)² es un cuadrado de lado x + 2. Se parte en piezas: ¿cuántas hay de cada tipo?", [["x² (cuadrado grande)"], ["x (sumando las franjas)"], ["unos (cuadraditos)"]], [1, 4, 4], "Hay 1 cuadrado grande. Las 2 franjas valen 2x cada una: súmalas. El cuadradito de la esquina mide 2 · 2.", "(x + 2)² = x² + 4x + 4. No olvides las dos franjas del medio.")],
  circulos: [mach("La cuerda de la cabra es el radio. Alárgala hasta que el diámetro mida 10 metros.", "radio", "diámetro", (x) => 2 * x, 10, { max: 7, draw: (x) => `<div class="mg-circle" style="width:${x * 24}px;height:${x * 24}px"></div>`, win: "El diámetro son 2 radios: 2 · 5 = 10." })],
  pitagoras: [
    { kind: "build", steps: [9, 16], target: 25, prompt: "Catetos de 3 y 4. Cada uno arma un cuadrado: uno de 9 baldosas y otro de 16. Júntalas.", win: "9 + 16 = 25 baldosas: justo las del cuadrado de la hipotenusa." },
    mach("Con esas 25 baldosas arma un cuadrado. ¿Cuánto mide su lado?", "lado", "baldosas", (x) => x * x, 25, { max: 8, draw: (x) => tiles(x, x * x), win: "5 · 5 = 25: la hipotenusa mide 5. Eso es 3² + 4² = 5²." }),
  ],
  "pitagoras-3d": [
    { kind: "build", steps: [9, 16], target: 25, prompt: "Piso de 3 por 4. Primero su diagonal: junta 3² = 9 y 4² = 16.", win: "9 + 16 = 25, así que la diagonal del piso mide 5." },
    mach("Ahora esa diagonal (5) y la altura (12): 25 + 144 = 169. Busca el número que por sí mismo da 169.", "diagonal", "diagonal · diagonal", (x) => x * x, 169, { start: 10, min: 8, max: 15, win: "13 · 13 = 169. La diagonal de la caja mide 13: Pitágoras dos veces." }),
  ],
  "probabilidad-experimental": [
    sample("Lanza la moneda 20 veces y mira cuántas caras salen.", ["Cara", "Sello"], coins(1), 20, (t, n) => `Salió sello ${t[1]} de ${n} veces. Frecuencia relativa: ${t[1]} ÷ ${n} = ${num(t[1] / n)}. Con más lanzamientos se acerca a 0,5.`, { verb: "Lanzar" }),
  ],
  "fracciones-mult": [
    { kind: "paint", parts: 6, cols: 3, target: 1, prompt: "El chocolate tiene 3 columnas (tercios) y 2 filas (mitades). Pinta la mitad de un tercio.", hint: "Toma una columna y quédate con la mitad.", win: "1/2 · 1/3 = 1/6: un cuadrito de seis. Arriba por arriba, abajo por abajo." },
  ],
  "area-triangulos": [
    mach("El rectángulo tiene alto 3. Cambia la base hasta que el área sea 15 cuadraditos.", "base", "área", (x) => 3 * x, 15, { max: 8, draw: (x) => tiles(x, 3 * x), win: "5 · 3 = 15 cuadraditos." }),
    mach("Un triángulo es la mitad de su rectángulo. Con alto 4, busca la base que da área 12.", "base", "área del triángulo", (x) => (x * 4) / 2, 12, { max: 10, win: "6 · 4 ÷ 2 = 12. Base por altura, dividido en 2." }),
  ],
  raices: [mach("Tienes 49 baldosas. Arma un cuadrado: ¿cuánto mide el lado?", "lado", "baldosas", (x) => x * x, 49, { start: 3, max: 9, draw: (x) => tiles(x, x * x), win: "7 · 7 = 49, así que √49 = 7." })],
  volumen: [mach("El piso de la caja tiene 4 · 3 = 12 cubitos. Agrega capas hasta tener 36 cubitos.", "capas", "cubitos", (x) => 12 * x, 36, { max: 5, draw: (x) => times(x, () => tiles(4, 12)), win: "12 cubitos por capa · 3 capas = 36. Volumen = área de la base · altura." })],
  combinatoria: [mach("Tienes 3 poleras. Cada fila es un pantalón. Agrega pantalones hasta tener 12 tenidas distintas.", "pantalones", "tenidas", (x) => 3 * x, 12, { max: 6, draw: (x) => tiles(3, 3 * x), win: "3 poleras · 4 pantalones = 12 tenidas. Se multiplican las opciones." })],
  "potencias-negativas": [
    mach("Baja el exponente de a 1 y mira: cada vez se divide por 2. Llega a 1/4.", "exponente", "2 elevado a eso", (x) => 2 ** x, 0.25, { start: 3, min: -3, max: 4, show: (y) => (y >= 1 ? fmt(y) : `1/${fmt(1 / y)}`), win: "2⁻² = 1/4. Con exponente 0 da 1; con exponente negativo, 1 partido por la potencia." }),
  ],
  sistemas: [
    mach("Primera pista: x + y = 10. Cambia x (la y se ajusta sola) hasta cumplir también la segunda: x − y = 4.", "x", "x − y", (x) => x - (10 - x), 4, { start: 5, max: 10, draw: (x) => `<p class="mg-note">x = ${x} · y = ${10 - x} · suman 10</p>`, win: "x = 7 e y = 3 cumplen las dos pistas a la vez." }),
  ],
  razones: [count("Por cada 2 rojas hay 3 azules. Arma una bolsa con esa razón que tenga 4 rojas.", [["rojas", "🔴"], ["azules", "🔵"]], [4, 6], "Si las rojas se duplican, las azules también.", "2 : 3 es lo mismo que 4 : 6. Las dos se multiplican por 2.")],
  "decimales-mult": [jumps(0.4, 1.2, "Cada salto vale 0,4. ¿Cuántos saltos hacen falta para llegar a 1,2?")],
  patrones: [mach("3, 7, 11, 15… siempre se suma 4. Busca en qué posición aparece el 23.", "posición", "número", (x) => 3 + 4 * (x - 1), 23, { min: 1, max: 10, win: "En la posición 6: 3, 7, 11, 15, 19, 23." })],
  expresiones: [mach("«3n + 2» dice: multiplica n por 3 y suma 2. Cambia n hasta que salga 14.", "n", "3n + 2", (x) => 3 * x + 2, 14, { rule: "· 3 + 2", win: "Si n = 4: 3 · 4 + 2 = 14. La letra guarda un número que puede cambiar." })],
  angulos: [mach("Dos ángulos juntos en una recta suman 180°. Abre el ángulo naranjo hasta que su vecino azul mida 140°.", "ángulo", "su vecino", (x) => 180 - x, 140, { start: 90, min: 0, max: 180, step: 10, draw: neighbors, show: (y) => num(y) + "°", win: "40° + 140° = 180°: media vuelta." })],
  "angulos-poligonos": [mach("Un polígono de n lados se parte en n − 2 triángulos de 180°. Busca el polígono cuyos ángulos suman 540°.", "lados", "suma de ángulos", (x) => (x - 2) * 180, 540, { start: 3, min: 3, max: 8, rule: "(lados − 2) · 180", show: (y) => num(y) + "°", win: "El pentágono: 5 lados, 3 triángulos, 3 · 180° = 540°." })],
  "area-trapecio": [mach("Bases de 8 y 4: su promedio es 6. Cambia la altura hasta que el área sea 18.", "altura", "área", (x) => 6 * x, 18, { max: 6, draw: (x) => tiles(6, 6 * x), win: "(8 + 4) ÷ 2 · 3 = 18. El trapecio ocupa lo mismo que un rectángulo de base 6." })],
  "area-superficie": [mach("Un cubo tiene 6 caras iguales. Cambia la arista hasta necesitar 54 cm² de papel.", "arista", "papel para 6 caras", (x) => 6 * x * x, 54, { max: 5, draw: (x) => tiles(x, x * x), win: "Cada cara mide 3 · 3 = 9. Seis caras: 6 · 9 = 54 cm²." })],
  graficos: [count("Encuesta de frutas: 🍎 🍌 🍎 🍇 🍎 🍌 🍎. Sube cada barra hasta su cantidad.", [["🍎 manzana"], ["🍌 plátano"], ["🍇 uva"]], [4, 2, 1], "Cuenta una fruta a la vez.", "La barra más alta es la manzana: 4 de 7.")],
  inecuaciones: [mach("x + 3 > 7 tiene muchas respuestas. Busca el número entero MÁS CHICO que la cumple.", "x", "x + 3", (x) => x + 3, null, { ok: (x) => x === 5, show: (y) => `${num(y)} ${y > 7 ? "es mayor que 7 ✓" : "no es mayor que 7"}`, goal: "Tiene que cumplirse, y el número anterior no.", hint: "Busca el primero que la cumple: el anterior no debe cumplirla.", win: "x = 5 es el primero. También sirven 6, 7, 8…: todo x mayor que 4." })],
  frecuencias: [{ kind: "paint", parts: 20, cols: 10, target: 5, prompt: "En un curso de 20, 5 llegan en bus. Pinta a los que llegan en bus.", hint: "Son 5 de los 20.", win: "5 de 20: 5 ÷ 20 = 0,25. Eso es el 25%." }],
  "probabilidad-teorica": [count("Arma una bolsa con 8 bolitas donde sacar una roja tenga probabilidad 1/4.", [["rojas", "🔴"], ["azules", "🔵"]], [2, 6], "Deben ser 8 en total. Favorables ÷ posibles: ¿cuántas rojas de 8?", "2 rojas de 8 bolitas: 2/8 = 1/4.")],
  muestreo: [sample("En la bolsa grande, 1 de cada 4 bolitas es roja. Saca una muestra de 20 y mira.", ["Roja", "Azul"], weighted([1, 3]), 20, (t, n) => `En tu muestra salieron ${t[0]} rojas de ${n} (${pct(t[0], n)}%). En la bolsa son el 25%: la muestra se parece al total, pero no es exacta.`, { verb: "Sacar una" })],
  "proporcion-inversa": [mach("El trabajo completo son 12 días de un pintor. Agrega pintores y mira cómo bajan los días. Llega a 3 días.", "pintores", "días", (x) => 12 / x, 3, { min: 1, max: 6, win: "4 pintores tardan 3 días. 4 · 3 = 12: el producto no cambia." })],
  "enteros-mult": [mach("La máquina multiplica por −2. Cambia el número hasta que salga 6.", "número", "resultado", (x) => x * -2, 6, { start: 2, min: -5, max: 5, rule: "· (−2)", win: "(−3) · (−2) = 6. Signos iguales: resultado positivo." })],
  "racionales-mult": [mach("La máquina saca la mitad. Cambia el número hasta que salga −1,5.", "número", "resultado", (x) => x / 2, -1.5, { start: 2, min: -6, max: 6, rule: "· 1/2", win: "1/2 · (−3) = −1,5. Signos distintos: resultado negativo." })],
  "algebra-producto": [count("(x + 3)(x + 2) es un rectángulo con 4 partes: x · x, x · 2, 3 · x y 3 · 2. ¿Cuántas piezas hay de cada tipo?", [["x²"], ["x"], ["unos"]], [1, 5, 6], "2x y 3x se juntan. Los unos son 3 · 2.", "(x + 3)(x + 2) = x² + 5x + 6.", { max: 8 })],
  isometrias: [
    { kind: "point", x: 4, y: 3, marks: [[1, 2]], prompt: "Trasladar es deslizar. Mueve el punto azul (1, 2): 3 hacia la derecha y 1 hacia arriba. Toca dónde queda." },
    { kind: "point", x: -2, y: 3, min: -3, max: 3, marks: [[2, 3]], prompt: "Reflejar es mirarse al espejo. El eje y (la línea vertical) es el espejo: toca el reflejo del punto azul (2, 3)." },
  ],
  cuartiles: [{ ...ascending("Ordena los datos. El del medio es la mediana (Q2).", [7, 2, 9, 5, 4], "Empieza por el más chico."), win: "2, 4, 5, 7, 9. El del medio es 5: esa es la mediana." }],
  "racionales-operatoria": [ascending("Ordena de menor a mayor. Pasa todo a decimal: 1/2 = 0,5 y 3/4 = 0,75.", [["1/2", 0.5], ["0,25", 0.25], ["3/4", 0.75], ["−0,5", -0.5]], "El negativo es el más chico. Después compara 0,25, 0,5 y 0,75.")],
  "crecimiento-exponencial": [mach("3 bacterias se duplican cada hora. Avanza las horas hasta que haya 48.", "horas", "bacterias", (x) => 3 * 2 ** x, 48, { start: 0, max: 5, draw: (x, y) => many(y, "🦠"), win: "3 · 2⁴ = 48. Crece cada vez más rápido: se multiplica, no se suma." })],
  "funcion-dos-variables": [{ kind: "build", steps: [2000, 1000], target: 7000, unit: "$", prompt: "Entrada de adulto $2.000 y de niño $1.000. Arma un grupo que pague justo $7.000.", win: "Hay varias formas de llegar a $7.000: el total depende de dos cantidades, adultos y niños." }],
  "sectores-circulares": [mach("Un sector es un trozo de pizza. Abre el ángulo hasta que el trozo sea 1/4 de la pizza.", "ángulo", "parte de la pizza", (x) => x / 360, 0.25, { start: 30, min: 0, max: 360, step: 30, draw: dial, show: (y) => frac(Math.round(y * 360), 360), win: "90° de 360° es 1/4. Su área es un cuarto del área del círculo." })],
  cono: [mach("Llena el cilindro con vasos en forma de cono (misma base y altura). ¿Cuántos conos caben?", "conos vaciados", "cilindro lleno", (x) => x / 3, 1, { start: 0, max: 4, show: (y) => frac(Math.round(y * 3), 3), draw: (x) => many(x, "🍦"), win: "3 conos llenan 1 cilindro. Por eso el volumen del cono es el del cilindro dividido en 3." })],
  homotecia: [{ kind: "point", x: 2, y: 4, marks: [[1, 2]], prompt: "La linterna está en (0, 0). Con k = 2, todo queda al doble de distancia. Toca la sombra del punto azul (1, 2)." }],
  tales: [mach("2 es a 4 como 3 es a x. Y 2 ÷ 4 = 0,5. Cambia x hasta que 3 ÷ x también dé 0,5.", "x", "3 ÷ x", (x) => 3 / x, 0.5, { start: 2, min: 1, max: 9, win: "x = 6: 2/4 = 3/6. Los trozos quedan en la misma proporción." })],
  semejanza: [mach("Escala 1 : 50: cada cm del plano son 50 cm reales (medio metro). ¿Cuántos cm mide en el plano una pared de 4 metros?", "cm en el plano", "metros reales", (x) => x / 2, 4, { start: 2, max: 12, win: "8 cm · 50 = 400 cm = 4 metros." })],
  "doble-entrada": [{ kind: "build", steps: [8, 7], target: 15, prompt: "Fila del 1°A: 8 prefieren fútbol y 7 básquetbol. Junta las dos casillas para tener el total de la fila.", win: "8 + 7 = 15 estudiantes en el 1°A. Los totales salen de sumar las casillas." }],
  "reglas-probabilidad": [{ kind: "paint", parts: 6, target: 2, cells: [0, 1], cellLabels: ["1", "2", "3", "4", "5", "6"], prompt: "Un dado tiene 6 caras. Pinta las que sirven para «sacar 1 o 2».", hint: "Solo sirven el 1 y el 2.", win: "2 caras de 6: 1/6 + 1/6 = 2/6. Con «o» se suma." }],
  galton: [sample("Suelta bolitas. En cada uno de los 3 clavos, la bolita va a la izquierda o a la derecha.", ["casilla 0", "casilla 1", "casilla 2", "casilla 3"], coins(3), 30, () => "Al medio caen más. Hay 3 caminos hacia cada casilla del medio y solo 1 hacia cada orilla: 1, 3, 3, 1 de 8 caminos.", { verb: "Soltar una" })],
  "raices-simplificar": [mach("√50: busca el cuadrado escondido. 50 es «un número por sí mismo» · 2.", "número", "número · número · 2", (x) => 2 * x * x, 50, { max: 8, win: "50 = 5 · 5 · 2, así que √50 = 5√2." })],
  "raices-enesimas": [mach("Tienes 27 cubitos. Arma un cubo: ¿cuánto mide el lado?", "lado", "cubitos", (x) => x ** 3, 27, { max: 5, win: "3 · 3 · 3 = 27, así que ∛27 = 3." })],
  logaritmos: [mach("log₂ 8 pregunta: ¿cuántas veces multiplico 2 para llegar a 8?", "veces", "2 multiplicado esas veces", (x) => 2 ** x, 8, { max: 6, draw: (x, y) => tiles(8, y), win: "2 · 2 · 2 = 8. Tres veces: log₂ 8 = 3." })],
  "logaritmo-base": [
    mach("Ahora la base es 10. ¿Cuántos 10 multiplico para llegar a 1.000?", "veces", "10 multiplicado esas veces", (x) => 10 ** x, 1000, { max: 5, win: "10 · 10 · 10 = 1.000: log 1.000 = 3." }),
    mach("Cambia la base a 3. ¿Cuántos 3 multiplico para llegar a 81?", "veces", "3 multiplicado esas veces", (x) => 3 ** x, 81, { max: 6, win: "3 · 3 · 3 · 3 = 81: log₃ 81 = 4. La base es el número que se repite." }),
  ],
  "funcion-cuadratica": [mach("f(x) = x² − 4 es una parábola. Busca un x donde toca el suelo: f(x) = 0.", "x", "f(x)", (x) => x * x - 4, 0, { start: 0, min: -4, max: 4, win: "En x = 2 y también en x = −2: la parábola corta el eje dos veces." })],
  "ecuacion-cuadratica": [mach("x² = 49 tiene dos soluciones. Una es 7. Encuentra la otra.", "x", "x · x", (x) => x * x, null, { start: 0, min: -9, max: 9, ok: (x) => x === -7, goal: "Busca un número distinto de 7 que por sí mismo dé 49.", hint: "Un negativo por un negativo da positivo.", win: "(−7) · (−7) = 49. Las soluciones son 7 y −7." })],
  "funcion-inversa": [mach("La máquina hace «· 2 + 3». Salió 11. ¿Qué número entró?", "entra", "sale", (x) => 2 * x + 3, 11, { rule: "· 2 + 3", win: "Entró 4. La inversa deshace al revés: 11 − 3 = 8 y 8 ÷ 2 = 4." })],
  "cambio-porcentual": [mach("$1.000 crecen 10% cada año, calculado sobre lo que hay. Avanza hasta tener $1.210.", "años", "monto", (x) => 1000 * 1.1 ** x, 1210, { start: 0, max: 5, show: money, win: "1.000 → 1.100 → 1.210. El segundo año ganó $110, no $100: el 10% se aplica a la cantidad nueva." })],
  esfera: [mach("En el volumen de la esfera el radio va al cubo: r · r · r. Cambia el radio hasta que r³ sea 27.", "radio", "r · r · r", (x) => x ** 3, 27, { max: 5, draw: (x) => `<div class="mg-circle" style="width:${x * 28}px;height:${x * 28}px"></div>`, win: "Con radio 3, r³ = 27. El volumen es 4/3 · π · 27 ≈ 113 cm³." })],
  trigonometria: [count("Triángulo 3-4-5: el lado de enfrente mide 3, el de al lado 4 y la hipotenusa 5. Seno = opuesto ÷ hipotenusa. Arma la fracción.", [["arriba (opuesto)"], ["abajo (hipotenusa)"]], [3, 5], "Arriba va el lado de enfrente; abajo, el lado más largo.", "sen = 3/5 = 0,6.", { max: 6 })],
  vectores: [{ kind: "point", x: 4, y: 4, marks: [[2, 1]], prompt: "Un vector es una flecha. Parte del punto azul (2, 1) y avanza el vector (2, 3): 2 a la derecha y 3 hacia arriba." }],
  "variable-aleatoria": [sample("Lanza 2 monedas y cuenta las caras. X puede valer 0, 1 o 2.", ["0 caras", "1 cara", "2 caras"], coins(2), 20, () => "«1 cara» sale más: tiene dos caminos (cara-sello y sello-cara). P(X = 1) = 2/4.", { verb: "Lanzar las dos" })],
  permutaciones: [mach("Para ordenar personas en fila: el primer lugar tiene todas las opciones, el siguiente una menos… ¿Cuántas personas se pueden ordenar de 24 formas?", "personas", "formas de ordenarlas", factorial, 24, { min: 1, max: 6, win: "4! = 4 · 3 · 2 · 1 = 24." })],
  complejos: [count("(3 + 2i) + (1 + 4i): suma lo real con lo real y las i con las i.", [["parte real"], ["parte con i"]], [4, 6], "3 + 1 por un lado; 2i + 4i por el otro.", "(3 + 2i) + (1 + 4i) = 4 + 6i.")],
  "complejos-mult": [count("(2 + i)(3 + i) = 6 + 2i + 3i + i². Como i² = −1, junta todo: ¿cuánto queda de cada parte?", [["parte real"], ["parte con i"]], [5, 5], "6 y −1 son reales. 2i y 3i se juntan.", "6 − 1 = 5 y 2i + 3i = 5i. Resultado: 5 + 5i.")],
  dispersion: [mach("Datos: 3, 5, 7, 8 y uno más. Cambia el último dato hasta que el rango (mayor − menor) sea 9.", "último dato", "rango", (x) => x - 3, 9, { start: 8, min: 8, max: 15, draw: (x) => bars([3, 5, 7, 8, x], null, 15), win: "12 − 3 = 9. Un solo dato lejano agranda el rango." })],
  "probabilidad-condicional": [count("En un curso, 12 juegan fútbol y 8 de ellos son mujeres. «Probabilidad de mujer SABIENDO que juega fútbol»: mira solo a los de fútbol y arma la fracción.", [["arriba (mujeres que juegan)"], ["abajo (los que juegan)"]], [8, 12], "El total ya no es el curso: son solo los 12 de fútbol.", "8/12 = 2/3. La condición achica el grupo que se mira.")],
  "modelos-exp-log": [mach("100 se duplica en cada paso. ¿Cuántos pasos faltan para llegar a 800?", "pasos", "cantidad", (x) => 100 * 2 ** x, 800, { start: 0, max: 6, win: "100 → 200 → 400 → 800: 3 pasos. El logaritmo responde eso: log₂ 8 = 3." })],
  "numero-e": [mach("Un banco da 100% al año. Si lo paga en más partes, $1 crece más… ¿hasta dónde? Sube los pagos hasta 12 (uno por mes).", "pagos al año", "$1 termina en", (x) => (1 + 1 / x) ** x, null, { min: 1, max: 12, ok: (x) => x === 12, show: money, goal: "Llega a 12 pagos y mira cómo el resultado sube cada vez menos.", hint: "Sigue subiendo los pagos.", win: "Con 12 pagos da cerca de $2,61. Con más pagos se acerca a e ≈ 2,718 y no pasa de ahí." })],
  "circunferencia-angulos": [mach("El ángulo inscrito mide la mitad del ángulo del centro. Abre el del centro hasta que el inscrito mida 40°.", "ángulo del centro", "ángulo inscrito", (x) => x / 2, 40, { start: 40, min: 0, max: 180, step: 10, draw: dial, show: (y) => num(y) + "°", win: "Centro de 80°, inscrito de 40°: la mitad." })],
  "interes-simple": [mach("$100.000 al 5% simple: cada año gana lo mismo, $5.000. Avanza hasta tener $115.000.", "años", "monto", (x) => 100000 + 5000 * x, 115000, { start: 0, max: 6, show: money, win: "3 años · $5.000 = $15.000 de interés. Siempre se calcula sobre el capital inicial." })],
  "interes-compuesto": [mach("$100.000 al 10% compuesto: cada año gana 10% de lo que hay. Avanza hasta tener $121.000.", "años", "monto", (x) => 100000 * 1.1 ** x, 121000, { start: 0, max: 5, show: money, win: "Año 1: +$10.000. Año 2: +$11.000. El interés también gana interés." })],
  credito: [mach("Te prestan $100.000 y pagas cuotas de $10.000. ¿Con cuántas cuotas terminas pagando $20.000 de más?", "cuotas", "pagado de más", (x) => 10000 * x - 100000, 20000, { start: 10, min: 10, max: 15, show: money, win: "12 cuotas · $10.000 = $120.000. El costo del crédito es $20.000." })],
  "sueldo-impuestos": [mach("El IVA es 19%: $190 por cada $1.000. Cambia el precio hasta que el IVA sea $1.900.", "precio (en miles de $)", "IVA", (x) => 190 * x, 1900, { start: 5, max: 12, show: money, win: "El IVA de $10.000 es $1.900." })],
  binomial: [sample("Lanza 3 monedas y cuenta las caras. Repite 30 veces.", ["0 caras", "1 cara", "2 caras", "3 caras"], coins(3), 30, () => "«Exactamente 2 caras» tiene 3 caminos de 8 posibles: P = 3/8. Por eso 1 y 2 caras salen más que 0 y 3.", { verb: "Lanzar las tres" })],
  normal: [sample("Cada medida recibe 6 empujoncitos al azar, hacia arriba o hacia abajo. Mide 40 y mira la forma.", ["muy bajo", "bajo", "algo bajo", "medio", "algo alto", "alto", "muy alto"], coins(6), 40, () => "Se forma una campana: muchos cerca del medio y pocos en los extremos.", { verb: "Medir una" })],
  "funcion-potencia": [mach("f(x) = x². Un número y su negativo dan lo mismo: la curva es un espejo. Encuentra el número NEGATIVO que da 9.", "x", "x²", (x) => x * x, null, { start: 3, min: -5, max: 5, ok: (x) => x === -3, goal: "Ya sabes que 3 da 9. Busca el negativo que también da 9.", hint: "Cruza el cero hacia los negativos.", win: "f(−3) = f(3) = 9. Con exponente par, f(−x) = f(x)." })],
  "funciones-trigonometricas": [mach("Rueda de la fortuna: gira el ángulo y mira la altura (el seno). Llega a lo más alto.", "ángulo", "seno", (x) => Math.sin((x * Math.PI) / 180), 1, { start: 0, min: 0, max: 360, step: 30, draw: dial, win: "sen 90° = 1: lo más alto. Después baja hasta −1 y vuelve a subir, una y otra vez." })],
  "tallo-hojas": [{ ...ascending("Ordena los datos. Así se ve qué va en cada tallo.", [28, 31, 23, 35, 25], "Primero los que empiezan con 2; después los que empiezan con 3."), win: "Tallo 2 | 3 5 8 y tallo 3 | 1 5. El tallo es la decena y cada hoja es una unidad." }],
  teselados: [
    mach("En cada esquina del piso, los ángulos deben sumar 360° para no dejar huecos. ¿Cuántos cuadrados (90° cada uno) se juntan?", "cuadrados", "ángulo cubierto", (x) => 90 * x, 360, { max: 5, draw: (x) => dial(90 * x), show: (y) => num(y) + "°", win: "4 · 90° = 360°: no queda hueco." }),
    mach("¿Y con triángulos equiláteros (60° cada uno)?", "triángulos", "ángulo cubierto", (x) => 60 * x, 360, { max: 8, draw: (x) => dial(60 * x), show: (y) => num(y) + "°", win: "6 · 60° = 360°. Por eso los triángulos también cubren el piso." }),
  ],
  construcciones: [mach("La simetral corta un segmento justo por la mitad. El segmento mide 10 cm: mueve el corte hasta que los dos trozos sean iguales.", "trozo izquierdo", "trozo derecho", (x) => 10 - x, null, { start: 2, max: 10, ok: (x) => x === 5, goal: "Los dos trozos deben medir lo mismo.", hint: "Compara los dos trozos.", win: "5 cm y 5 cm: la simetral pasa por el punto medio." })],
  "graficos-enganosos": [mach("Dos barras: 98 y 100. Sube el inicio del eje y mira cómo la diferencia PARECE crecer.", "el eje parte en", "diferencia real", () => 2, null, { start: 0, min: 0, max: 90, step: 10, ok: (x) => x === 90, draw: (x) => bars([98 - x, 100 - x], ["98", "100"], 100 - x), goal: "Lleva el inicio del eje hasta 90.", hint: "Sigue subiendo el inicio del eje.", win: "Una barra se ve mucho más chica que la otra, pero la diferencia real sigue siendo 2. Mira siempre dónde parte el eje." })],
  euclides: [mach("altura² = p · q. Con p = 4 y q = 9, p · q = 36. Busca la altura.", "altura", "altura · altura", (x) => x * x, 36, { max: 9, win: "6 · 6 = 36: la altura mide 6." })],
  "recta-ajuste": [mach("La recta de ajuste es y = 2x + 1. Úsala para predecir: ¿con qué x se espera y = 11?", "x", "y", (x) => 2 * x + 1, 11, { rule: "· 2 + 1", win: "Con x = 5 se espera y = 11. La recta resume la tendencia de los puntos." })],
  "probabilidad-sociedad": [{ kind: "paint", parts: 20, cols: 10, target: 5, prompt: "La noticia dice «1 de cada 4 personas». Píntalo en un grupo de 20.", hint: "De cada 4 personas, pinta 1.", win: "5 de 20. «1 de cada 4» es lo mismo que 25%." }],
  composicion: [
    mach("Dos máquinas seguidas: primero g duplica, después f suma 1. ¿Qué número entra para que salga 7?", "entra", "sale f(g(x))", (x) => 2 * x + 1, 7, { rule: "· 2, después + 1", win: "f(g(3)) = 2 · 3 + 1 = 7." }),
    mach("Ahora al revés: primero f suma 1, después g duplica. Con el mismo 3, ¿qué sale? Busca la entrada que da 8.", "entra", "sale g(f(x))", (x) => (x + 1) * 2, 8, { rule: "+ 1, después · 2", win: "g(f(3)) = (3 + 1) · 2 = 8, no 7. El orden importa." }),
  ],
  limites: [mach("f(x) = (x² − 4) ÷ (x − 2) no se puede calcular justo en x = 2. Acércate a 2 todo lo que puedas y mira a qué se acerca f(x).", "x", "f(x)", (x) => x + 2, null, { start: 1.5, min: 1, max: 1.9, step: 0.1, ok: (x) => x === 1.9, goal: "Lleva x lo más cerca de 2 que puedas.", hint: "Sigue acercándote a 2.", win: "Mientras x se acerca a 2, f(x) se acerca a 4. Ese es el límite." })],
  derivadas: [mach("La derivada de x² es 2x: la pendiente de la curva en cada punto. Busca el punto donde la pendiente es 6.", "x", "pendiente (2x)", (x) => 2 * x, 6, { start: 0, max: 6, win: "f'(3) = 6: ahí la curva sube 6 por cada 1 que avanza." })],
  integrales: [mach("El área bajo f(x) = 2 es un rectángulo de alto 2. Avanza x hasta que el área sea 8.", "x", "área", (x) => 2 * x, 8, { max: 6, draw: (x) => tiles(x, 2 * x), win: "2 · 4 = 8. La integral entre 0 y 4 mide esa área." })],
  "base-redondeo": [mach("¿47 está más cerca de 40 o de 50? Camina desde 47 hasta la decena MÁS CERCANA.", "número", "pasos desde 47", (x) => Math.abs(x - 47), null, { start: 47, min: 40, max: 50, ok: (x) => x === 50, goal: "Llega a la decena que queda a menos pasos.", hint: "Cuenta los pasos hacia cada lado: gana el camino más corto.", win: "A 50 llegas en 3 pasos; a 40, en 7. Por eso 47 se redondea a 50." })],
  "base-perimetro": [{ kind: "build", steps: [5, 3], target: 16, prompt: "Rectángulo de 5 por 3. Da la vuelta completa: suma sus 4 lados.", win: "5 + 3 + 5 + 3 = 16 cm. El perímetro es el largo del borde." }],
  "problemas-recetas": [mach("La receta para 4 personas lleva 2 huevos. ¿Para cuántas personas alcanzan 6 huevos?", "personas", "huevos", (x) => x / 2, 6, { start: 4, min: 4, max: 20, step: 4, win: "12 personas: el triple de personas, el triple de huevos." })],
  "problemas-cuentas": [mach("La propina del 10% se calcula dividiendo por 10. ¿Qué cuenta deja una propina de $2.400?", "cuenta (en miles de $)", "propina", (x) => 100 * x, 2400, { start: 10, min: 10, max: 30, step: 2, show: money, win: "$24.000 ÷ 10 = $2.400." })],
  "problemas-viajes": [jumps(80, 240, "Vas a 80 km por hora. Agrega horas: ¿cuántas hacen falta para recorrer 240 km?")],
  "problemas-pintar": [mach("La pared tiene alto 3 metros. Cambia el largo hasta que el área sea 12 m².", "largo", "área", (x) => 3 * x, 12, { max: 6, draw: (x) => tiles(x, 3 * x), win: "4 · 3 = 12 m². Con el área sabes cuánta pintura comprar." })],
});

// ── Motor ────────────────────────────────────────────────────────────────────
export const hasGame = (lessonId) => Object.hasOwn(GAMES, lessonId);
const startRound = (game) => {
  const r = game.rounds[game.index];
  game.round = { msg: "", won: false, ...KINDS[r.kind].init(r) };
  return game;
};
export function createGame(lessonId) {
  if (!hasGame(lessonId)) return null;
  return startRound({ lesson: lessonId, rounds: GAMES[lessonId], index: 0, done: false });
}
// `action` es lo que va después de «game:» en data-action.
export function gameAction(game, action) {
  if (!game) return game;
  const [name, arg, arg2] = action.split(":");
  if (name === "reset") return startRound(game);
  if (name === "next") {
    if (game.round.won && game.index < game.rounds.length - 1) {
      game.index++;
      startRound(game);
    }
    return game;
  }
  if (game.round.won) return game;
  const r = game.rounds[game.index],
    kind = KINDS[r.kind];
  let round = kind.act(game.round, r, name, arg, arg2);
  if (kind.settle) round = kind.settle(round);
  game.round = round;
  if (round.won && game.index === game.rounds.length - 1) game.done = true;
  return game;
}
export function gameView(game) {
  const r = game.rounds[game.index],
    s = game.round,
    last = game.index === game.rounds.length - 1;
  return `<div class="mg-head"><span class="example-pill">Juega para entenderlo${game.rounds.length > 1 ? ` · ${game.index + 1} de ${game.rounds.length}` : ""}</span>${act("reset", "↺ Empezar de nuevo", "mg-reset")}</div>
    <p class="minigame-prompt">${escape(r.prompt)}</p>
    <div class="mg-stage mg-${r.kind}-stage">${KINDS[r.kind].view(s, r)}</div>
    <p class="mg-msg${s.won || /^(Bien|Quitaste)/.test(s.msg) ? " good" : ""}" role="status">${escape(s.msg || "")}</p>
    ${s.won ? (last ? '<p class="mg-done">🎉 ¡Lo lograste! Ahora mira el ejemplo.</p>' : `<div class="mg-controls">${act("next", "Otro más →", "primary")}</div>`) : ""}`;
}

// Arrastrar con mouse o dedo: lo que tenga data-drag se puede soltar sobre lo
// que tenga data-drop. Un toque sin mover sigue siendo un clic normal.
export function enableDrag(root, onDrop, doc = globalThis.document, win = globalThis.window) {
  if (typeof root?.addEventListener !== "function" || typeof win?.addEventListener !== "function") return;
  let drag = null,
    draggedAt = 0;
  root.addEventListener("pointerdown", (e) => {
    const el = e.target.closest?.("[data-drag]");
    if (!el || el.disabled) return;
    drag = { el, from: el.dataset.drag, x: e.clientX, y: e.clientY, moved: false };
  });
  win.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 8) return;
    drag.moved = true;
    drag.el.classList.add("dragging");
    drag.el.style.pointerEvents = "none";
    drag.el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  const end = (e) => {
    if (!drag) return;
    const { el, from, moved } = drag;
    drag = null;
    if (!moved) return;
    // Lo arrastrado no recibe el puntero: debajo está el destino.
    const target = e.type === "pointerup" ? doc.elementFromPoint(e.clientX, e.clientY)?.closest("[data-drop]") : null;
    el.classList.remove("dragging");
    el.style.transform = "";
    el.style.pointerEvents = "";
    draggedAt = Date.now();
    if (target) onDrop(from, target.dataset.drop);
  };
  win.addEventListener("pointerup", end);
  win.addEventListener("pointercancel", end);
  // El clic que sigue a un arrastre no cuenta como toque.
  root.addEventListener("click", (e) => Date.now() - draggedAt < 350 && e.stopPropagation(), true);
}
