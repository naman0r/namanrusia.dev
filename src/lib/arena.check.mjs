// Rules check for the arena engine: `node --no-warnings src/lib/arena.check.mjs` (Node 22.18+ strips the types).
import assert from "node:assert/strict";
import { CARDS, DECK_SIZE, DEFAULT_DECK, RIVER, LANES, botStep, canPlace, createBot, createGame, play, snap, step } from "./arena.ts";

const DT = 1 / 60;
const run = (g, seconds, each = () => {}) => {
  for (let t = 0; t < seconds && g.phase !== "over"; t += DT) {
    each(g);
    step(g, DT);
  }
};
const offRiver = (g) =>
  g.entities.every((e) => e.kind !== "troop" || e.jumps || !(e.y > RIVER[0] && e.y < RIVER[1]) || LANES.some((x) => Math.abs(e.x - x) <= 1.5));

{
  const g = createGame(1);
  assert.equal(g.entities.length, 6);
  assert.equal(g.hand[0].length, 4);
  assert.deepEqual(new Set([...g.hand[0], ...g.queue[0]]), new Set(DEFAULT_DECK));
  assert.equal(new Set([...g.hand[1], ...g.queue[1]]).size, DECK_SIZE, "the bot brings six cards too");
  assert.ok(canPlace(g, 0, "knight", 9.5, 20.5));
  assert.ok(!canPlace(g, 0, "knight", 9.5, 10.5), "enemy half is off limits");
  assert.ok(!canPlace(g, 0, "knight", 3.5, 25.5), "not on a tower");
  assert.ok(canPlace(g, 0, "fireball", 3.5, 6.5), "spells go anywhere");
  assert.deepEqual(snap(g, 0, "knight", 9.2, 15.6), [9.5, 17.5], "a drop on the river lands on the bank");

  const card = g.hand[0][0];
  const next = g.queue[0][0];
  g.elixir[0] = 10;
  assert.ok(play(g, 0, 0, ...snap(g, 0, card, 9, 20)));
  assert.equal(g.elixir[0], 10 - CARDS[card].cost);
  assert.equal(g.hand[0][0], next, "the next card fills the slot");
  assert.equal(g.queue[0].at(-1), card, "the played card goes to the back");
  g.elixir[0] = 0;
  assert.ok(!play(g, 0, 1, 9.5, 20.5), "can't play without elixir");
}

{
  // A lone Giant walks the left lane, crosses the bridge and takes the princess tower.
  const g = createGame(2);
  g.hand[0][0] = "giant";
  assert.ok(play(g, 0, 0, 3.5, 20.5));
  run(g, 60, (g) => assert.ok(offRiver(g), "troops stay out of the river"));
  assert.equal(g.crowns[0], 1);
  assert.ok(g.entities.find((e) => e.side === 1 && e.kind === "king").active, "losing a princess wakes the king");
  assert.ok(canPlace(g, 0, "knight", 3.5, 13.5), "the fallen tower opens a pocket");
  assert.ok(!canPlace(g, 0, "knight", 14.5, 13.5), "only on that lane");
}

{
  // Nobody plays: regulation ends level, overtime ends level, it's a draw.
  const g = createGame(3);
  run(g, 260);
  assert.equal(g.phase, "over");
  assert.equal(g.winner, -1);
}

for (const level of ["easy", "medium", "hard"]) {
  // Against an empty side, every bot should win, and nothing should go NaN or swim.
  const g = createGame(4);
  const bot = createBot(level);
  run(g, 260, (g) => {
    botStep(bot, g, DT);
    assert.ok(offRiver(g));
    assert.ok(g.entities.every((e) => Number.isFinite(e.x) && Number.isFinite(e.y)));
  });
  assert.equal(g.winner, 1, `${level} bot wins an undefended match`);
}

{
  // The bot defends: a Giant alone shouldn't walk through a hard bot.
  const g = createGame(5);
  const bot = createBot("hard");
  g.hand[0][0] = "giant";
  play(g, 0, 0, 3.5, 20.5);
  run(g, 40, (g) => botStep(bot, g, DT));
  assert.equal(g.crowns[0], 0, "hard bot stops a lone Giant");
}

{
  // A custom deck is what you cycle through.
  const deck = ["skeletons", "valkyrie", "arrows", "minipekka", "speargoblins", "barbarians"];
  const g = createGame(6, deck);
  assert.deepEqual(new Set([...g.hand[0], ...g.queue[0]]), new Set(deck));
  g.elixir[0] = 10;
  g.hand[0][0] = "skeletons";
  play(g, 0, 0, 9.5, 20.5);
  assert.equal(g.entities.filter((e) => e.card === "skeletons").length, 15, "an army of fifteen");
}

{
  // Valkyrie's spin hits every skeleton around her; Arrows clear a swarm.
  const g = createGame(7);
  // No towers to help.
  g.entities = g.entities.filter((e) => e.kind !== "princess");
  g.elixir = [10, 10];
  g.hand[0][0] = "valkyrie";
  play(g, 0, 0, 9.5, 18.5);
  g.hand[1][0] = "skeletons";
  play(g, 1, 0, 9.5, 14.5);
  // Drop the army right on top of her, past the river.
  for (const e of g.entities) if (e.card === "skeletons") e.y += 5.5;
  run(g, 5);
  assert.ok(g.entities.filter((e) => e.card === "skeletons").length <= 3, "the spin shreds the army");

  const h = createGame(8);
  h.elixir = [10, 10];
  h.hand[1][0] = "barbarians";
  play(h, 1, 0, 9.5, 10.5);
  run(h, 1.2);
  h.hand[0][0] = "arrows";
  play(h, 0, 0, 9.5, 10.5);
  run(h, 2);
  const barbs = h.entities.filter((e) => e.card === "barbarians");
  assert.equal(barbs.length, 5, "arrows don't kill barbarians");
  assert.ok(barbs.every((e) => e.hp < e.maxHp), "but they hit all five");
}

console.log("arena: all checks passed");
