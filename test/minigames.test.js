import test from "node:test";
import assert from "node:assert/strict";
import { GAMES, createGame, gameAction, gameView, hasGame, fmt, parseExpression, nextOperation } from "../public/minigames.js";
import { seedCatalog } from "../public/content.js";

const play = (game, ...actions) => actions.reduce((g, a) => gameAction(g, a), game);

test("every game belongs to a lesson and renders each round", () => {
  const ids = new Set(seedCatalog().lessons.map((l) => l.id));
  for (const [id, rounds] of Object.entries(GAMES)) {
    assert.ok(ids.has(id), `${id} is a lesson`);
    const game = createGame(id);
    for (let i = 0; i < rounds.length; i++) {
      game.index = i;
      gameAction(game, "reset");
      const html = gameView(game);
      assert.match(html, /minigame-prompt/);
      assert.match(html, /data-action="game:/, `${id} round ${i} can be played`);
      assert.doesNotMatch(html, /undefined|NaN/, `${id} round ${i}`);
    }
  }
  assert.equal(hasGame("no-existe"), false);
  assert.equal(createGame("no-existe"), null);
});

test("every round can be won", () => {
  // Juega cada ronda con la estrategia correcta de su tipo.
  const solve = {
    balance: (g, r) => {
      for (let i = 0; i < r.a2; i++) gameAction(g, "bag");
      for (let i = 0; i < r.b; i++) gameAction(g, "take");
      gameAction(g, "split");
    },
    elevator: (g, r) => {
      for (let i = 0; i < Math.abs(r.move); i++) gameAction(g, r.move > 0 ? "up" : "down");
      gameAction(g, "check");
    },
    paint: (g, r) => {
      for (let i = 0; i < r.target; i++) gameAction(g, `cell:${i}`);
      gameAction(g, "check");
    },
    first: (g) => {
      for (let i = 0; i < 10 && !g.round.won; i++) gameAction(g, `op:${nextOperation(g.round.tokens).index}`);
    },
    sort: (g, r) => {
      // Ordenamiento por selección usando el arrastre.
      for (let to = 0; to < r.items.length; to++) {
        const values = g.round.order.map((i) => r.items[i].value);
        const from = values.indexOf(Math.min(...values.slice(to)), to);
        gameAction(g, `drop:${from}:${to}`);
      }
      gameAction(g, "check");
    },
    share: (g, r) => {
      for (let i = 0; i < r.total; i++) gameAction(g, `put:${i % r.plates}`);
    },
    build: (g, r) => {
      let left = r.target - (r.start ?? 0);
      r.steps.forEach((step, i) => {
        for (; left >= step; left -= step) gameAction(g, `add:${i}`);
      });
    },
    point: (g, r) => gameAction(g, `tap:${r.x}:${r.y}`),
  };
  for (const [id, rounds] of Object.entries(GAMES)) {
    const game = createGame(id);
    rounds.forEach((r, i) => {
      solve[r.kind](game, r);
      assert.equal(game.round.won, true, `${id} round ${i} (${r.kind})`);
      assert.ok(game.round.msg, "winning explains what happened");
      if (i < rounds.length - 1) gameAction(game, "next");
    });
    assert.equal(game.done, true, id);
  }
});

test("the balance keeps both sides equal and refuses to split too early", () => {
  const g = createGame("equations");
  gameAction(g, "next");
  assert.equal(g.index, 0, "can't skip ahead without winning");
  play(g, "take", "take", "take");
  assert.equal(g.round.won, true, "x + 3 = 8 leaves the bag alone with 5");
  assert.match(g.round.msg, /x = 5/);
  gameAction(g, "next"); // 2x + 1 = 7
  gameAction(g, "split");
  assert.match(g.round.msg, /Primero deja las bolsas solas/);
  assert.equal(g.round.c, 7, "nothing changed");
  play(g, "take", "split");
  assert.match(g.round.msg, /x = 3/);
  const both = play(createGame("both"), "bag", "take"); // 2x + 1 = x + 5
  assert.match(both.round.msg, /x = 4/);
});

test("the order of operations only accepts the operation that goes first", () => {
  assert.deepEqual(parseExpression("−3 + 4 · 2"), [-3, "+", 4, "·", 2]);
  const g = createGame("jerarquia-mult"); // 3 + 4 · 2
  gameAction(g, "op:1");
  assert.match(g.round.msg, /Primero se multiplica y se divide/);
  assert.deepEqual(g.round.tokens, [3, "+", 4, "·", 2]);
  gameAction(g, "op:3");
  assert.deepEqual(g.round.tokens, [3, "+", 8]);
  gameAction(g, "op:1");
  assert.equal(g.round.won, true);
  assert.match(g.round.msg, /11/);

  const p = createGame("jerarquia-parentesis"); // ( 3 + 4 ) · 2
  gameAction(p, "op:5");
  assert.match(p.round.msg, /dentro del paréntesis/);
  gameAction(p, "op:2");
  assert.deepEqual(p.round.tokens, [7, "·", 2], "solved parentheses disappear");

  const pow = createGame("jerarquia-potencias"); // 2 + 3 ^ 2
  assert.match(gameView(pow), /3<sup>2<\/sup>/);
  gameAction(pow, "op:1");
  assert.match(pow.round.msg, /Primero las potencias/);
  play(pow, "op:3", "op:1");
  assert.match(pow.round.msg, /11/);
});

test("wrong tries explain, never punish, and a round can be restarted", () => {
  const lift = createGame("enteros"); // −3, sube 5
  play(lift, "up", "up", "check");
  assert.equal(lift.round.won, false);
  assert.match(lift.round.msg, /Te moviste 2 pisos hacia arriba\. Tienes que subir 5/);
  gameAction(lift, "reset");
  assert.equal(lift.round.pos, -3);

  const cookies = createGame("base-dividir"); // 12 en 3
  for (let i = 0; i < 12; i++) gameAction(cookies, "drop:pile:0");
  assert.match(cookies.round.msg, /No quedó parejo/);
  for (let i = 0; i < 8; i++) gameAction(cookies, "take:0");
  for (let i = 0; i < 8; i++) gameAction(cookies, `put:${1 + (i % 2)}`);
  assert.match(cookies.round.msg, /12 ÷ 3 = 4/);

  const cards = createGame("base-decimales");
  cards.index = 1;
  gameAction(cards, "reset"); // 0,5 · 0,25 · 0,8
  gameAction(cards, "check");
  assert.match(cards.round.msg, /Todavía no/);
  play(cards, "pick:0", "pick:1", "check"); // tocar dos las intercambia
  assert.equal(cards.round.won, true);

  const plane = createGame("plano-cartesiano"); // (3, 2)
  gameAction(plane, "tap:2:3");
  assert.match(plane.round.msg, /están al revés/);

  const coins = createGame("problemas-compras");
  play(coins, "add:0", "add:0");
  assert.match(coins.round.msg, /Te pasaste/);
});

test("numbers are written the Chilean way", () => {
  assert.equal(fmt(2400), "2.400");
  assert.equal(fmt(0.25), "0,25");
  assert.equal(fmt(-3), "−3");
  assert.equal(fmt(10000), "10.000");
});
