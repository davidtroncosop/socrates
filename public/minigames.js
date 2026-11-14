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
      if (n === r.target) return { ...s, won: true, msg: r.win };
      return { ...s, msg: n === 0 ? "Toca las partes para pintarlas." : `Pintaste ${n} ${n === 1 ? "parte" : "partes"}. ${r.hint}` };
    }
    return s;
  },
  view(s, r) {
    const cols = r.cols ?? r.parts;
    const ref = r.ref
      ? `<div class="mg-ref"><span class="muted">${escape(r.ref.label)}</span><div class="mg-bar" style="grid-template-columns:repeat(${r.ref.parts},1fr)">${times(r.ref.parts, (i) => `<span class="mg-cell${i < r.ref.painted ? " on" : ""}"></span>`)}</div></div>`
      : "";
    return `${ref}<div class="mg-bar" style="grid-template-columns:repeat(${cols},1fr)">${s.on
      .map(
        (on, i) =>
          `<button type="button" class="mg-cell${on ? " on" : ""}" data-action="game:cell:${i}" aria-pressed="${on}" aria-label="Parte ${i + 1}"${s.won ? " disabled" : ""}>${r.cellLabel ?? ""}</button>`,
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
    const value = (r.start ?? 0) + r.steps.reduce((sum, step, k) => sum + step * counts[k], 0);
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
        row += `<button type="button" class="mg-dot${x === 0 ? " axis-y" : ""}${y === 0 ? " axis-x" : ""}${s.tapped?.[0] === x && s.tapped?.[1] === y ? (s.won ? " hit" : " miss") : ""}" data-action="game:tap:${x}:${y}" aria-label="Punto ${fmt(x)}, ${fmt(y)}"${s.won ? " disabled" : ""}></button>`;
      rows.push(row);
    }
    let labels = "<span></span>";
    for (let x = min; x <= max; x++) labels += `<span class="mg-axis-label">${fmt(x)}</span>`;
    return `<div class="mg-plane" style="grid-template-columns:auto repeat(${max - min + 1},1fr)">${rows.join("")}${labels}</div>`;
  },
};

const KINDS = { balance, elevator, paint, first, sort, share, build, point };

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
    { kind: "paint", parts: 10, target: 7, cellLabel: "0,1", prompt: "La barra mide 1 metro. Cada parte es 0,1. Pinta 0,7 metros.", hint: "0,7 son 7 décimos.", win: "7 partes de 0,1 son 0,7." },
    ascending("Ordena de menor a mayor.", [0.5, 0.25, 0.8], "Piensa en plata: 0,5 son 50 centavos y 0,25 son 25."),
  ],
  porcentajes: [
    { kind: "paint", parts: 10, target: 3, cellLabel: "10%", prompt: "Cada parte es el 10%. Pinta el 30%.", hint: "30% son 3 partes de 10%.", win: "30% es 30 de cada 100: 3 partes de 10." },
    { kind: "paint", parts: 10, target: 5, cellLabel: "10%", prompt: "Pinta el 50%.", hint: "50% es la mitad.", win: "50% es la mitad." },
  ],
  "variacion-porcentual": [
    { kind: "paint", parts: 10, target: 8, cellLabel: "10%", prompt: "Una polera tiene 20% de descuento. Pinta la parte que SÍ pagas.", hint: "Si te descuentan 20%, pagas el resto.", win: "Con 20% de descuento pagas el 80% del precio." },
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
