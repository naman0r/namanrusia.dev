/**
 * Bridge Brawl: a small Clash Royale-style lane battler. Pure simulation, no DOM, so a future
 * multiplayer host can run the same rules. Distances are in tiles (18 x 32 arena), time in seconds.
 * Side 0 deploys on the bottom half, side 1 (the bot) on the top.
 */

export const W = 18;
export const H = 32;
export const RIVER = [15, 17] as const;
export const LANES = [3.5, 14.5] as const;
const BRIDGE_HALF = 1.5;
const MATCH = 180;
const OVERTIME = 60;
export const MAX_ELIXIR = 10;
const ELIXIR_EVERY = 2.8;
const DEPLOY_TIME = 1;
/** Crown towers take this share of spell damage, as in the real game. */
const TOWER_SPELL_SHARE = 0.3;

export type Side = 0 | 1;
export type CardId =
  | "knight"
  | "archers"
  | "giant"
  | "goblins"
  | "musketeer"
  | "hog"
  | "fireball"
  | "cannon"
  | "minipekka"
  | "valkyrie"
  | "skeletons"
  | "speargoblins"
  | "barbarians"
  | "arrows";
export type Rarity = "common" | "rare" | "epic";

type Stats = { hp: number; dmg: number; hit: number; range: number; r: number };
type Card = { name: string; cost: number; blurb: string; rarity: Rarity } & (
  | ({ kind: "troop"; count: number; speed: number; sight: number; buildings?: boolean; jumps?: boolean; splash?: number } & Stats)
  | ({ kind: "building"; life: number } & Stats)
  | { kind: "spell"; dmg: number; radius: number; knock?: boolean }
);

export const CARDS: Record<CardId, Card> = {
  knight: { name: "Knight", rarity: "common", cost: 3, blurb: "Sturdy sword, big mustache", kind: "troop", count: 1, hp: 1766, dmg: 202, hit: 1.2, range: 0.7, r: 0.5, speed: 1, sight: 5.5 },
  archers: { name: "Archers", rarity: "common", cost: 3, blurb: "Two archers, long reach", kind: "troop", count: 2, hp: 304, dmg: 107, hit: 0.9, range: 5, r: 0.4, speed: 1, sight: 5.5 },
  giant: { name: "Giant", rarity: "rare", cost: 5, blurb: "Huge, slow, only hits towers", kind: "troop", count: 1, hp: 4091, dmg: 254, hit: 1.5, range: 1, r: 0.75, speed: 0.75, sight: 7.5, buildings: true },
  goblins: { name: "Goblins", rarity: "common", cost: 2, blurb: "Three fast stabby pests", kind: "troop", count: 3, hp: 202, dmg: 120, hit: 1.1, range: 0.5, r: 0.35, speed: 2, sight: 5.5 },
  musketeer: { name: "Musketeer", rarity: "rare", cost: 4, blurb: "Fragile, hits hard from afar", kind: "troop", count: 1, hp: 721, dmg: 217, hit: 1, range: 6, r: 0.45, speed: 1, sight: 6 },
  hog: { name: "Hog Rider", rarity: "rare", cost: 4, blurb: "Jumps the river, rams towers", kind: "troop", count: 1, hp: 1697, dmg: 318, hit: 1.6, range: 0.8, r: 0.6, speed: 2, sight: 9.5, buildings: true, jumps: true },
  fireball: { name: "Fireball", rarity: "rare", cost: 4, blurb: "Big splash, knocks small troops back", kind: "spell", dmg: 689, radius: 2.5, knock: true },
  cannon: { name: "Cannon", rarity: "common", cost: 3, blurb: "Pulls tower-hitters off course", kind: "building", life: 30, hp: 824, dmg: 212, hit: 0.9, range: 5.5, r: 1 },
  minipekka: { name: "Mini P.E.K.K.A", rarity: "rare", cost: 4, blurb: "Pancakes! Huge single hits", kind: "troop", count: 1, hp: 1129, dmg: 598, hit: 1.6, range: 0.8, r: 0.45, speed: 1.5, sight: 5.5 },
  valkyrie: { name: "Valkyrie", rarity: "rare", cost: 4, blurb: "Spins her axe, hits all around", kind: "troop", count: 1, hp: 1654, dmg: 221, hit: 1.5, range: 0.5, r: 0.5, speed: 1, sight: 5.5, splash: 1.2 },
  skeletons: { name: "Skeleton Army", rarity: "epic", cost: 3, blurb: "Fifteen bony swarmers", kind: "troop", count: 15, hp: 67, dmg: 67, hit: 1, range: 0.5, r: 0.3, speed: 1.5, sight: 5.5 },
  speargoblins: { name: "Spear Goblins", rarity: "common", cost: 2, blurb: "Three goblins with spears", kind: "troop", count: 3, hp: 133, dmg: 81, hit: 1.7, range: 5, r: 0.35, speed: 2, sight: 5.5 },
  barbarians: { name: "Barbarians", rarity: "common", cost: 5, blurb: "Five angry mustaches", kind: "troop", count: 5, hp: 670, dmg: 192, hit: 1.4, range: 0.7, r: 0.5, speed: 1, sight: 5.5 },
  arrows: { name: "Arrows", rarity: "common", cost: 3, blurb: "Wide volley, clears swarms", kind: "spell", dmg: 366, radius: 4 },
};

export const DECK_SIZE = 6;
const HAND_SIZE = 4;
export const DEFAULT_DECK: CardId[] = ["giant", "musketeer", "knight", "archers", "goblins", "fireball"];
// The bot brings one of these, picked by the match seed.
const BOT_DECKS: CardId[][] = [
  ["giant", "musketeer", "knight", "archers", "goblins", "fireball"],
  ["hog", "valkyrie", "musketeer", "cannon", "skeletons", "arrows"],
  ["giant", "minipekka", "speargoblins", "barbarians", "archers", "fireball"],
];

export type Entity = {
  id: number;
  side: Side;
  kind: "king" | "princess" | "troop" | "building";
  card?: CardId;
  x: number;
  y: number;
  /** Position at the start of the last step, for render interpolation. */
  px: number;
  py: number;
  r: number;
  hp: number;
  maxHp: number;
  dmg: number;
  hit: number;
  range: number;
  sight: number;
  speed: number;
  buildings: boolean;
  jumps: boolean;
  /** Melee splash radius around the attacker, 0 for single-target. */
  splash: number;
  target: number;
  /** Attacking: in range of its target, which it keeps until it dies or walks off. */
  locked: boolean;
  cooldown: number;
  deploy: number;
  /** Kings sleep until hit or until one of their princess towers falls. */
  active: boolean;
  decay: number;
  flash: number;
  /** Seconds since the last swing, for the lunge animation. */
  swing: number;
  face: 1 | -1;
  moving: boolean;
};

type Projectile = {
  x: number;
  y: number;
  px: number;
  py: number;
  side: Side;
  kind: "arrow" | "bullet" | "spell";
  /** Which spell, for kind "spell". */
  card?: CardId;
  target: number;
  dmg: number;
  speed: number;
  /** Spells fly to a point; the rest home on `target`. */
  tx: number;
  ty: number;
  sx: number;
  sy: number;
};

export type GameEvent =
  | { type: "hit" | "death" | "deploy"; x: number; y: number; side: Side; big?: boolean }
  | { type: "boom" | "volley" | "spin"; x: number; y: number; radius: number }
  | { type: "tower"; x: number; y: number; side: Side; king: boolean };

export type Game = {
  entities: Entity[];
  projectiles: Projectile[];
  rubble: { x: number; y: number; r: number; side: Side; king: boolean }[];
  events: GameEvent[];
  elixir: [number, number];
  hand: [CardId[], CardId[]];
  queue: [CardId[], CardId[]];
  crowns: [number, number];
  clock: number;
  phase: "play" | "overtime" | "over";
  /** Set once the phase is "over": the winning side, or -1 for a draw. */
  winner: Side | -1 | null;
  time: number;
  nextId: number;
  seed: number;
};

/** mulberry32: small, seedable, so a match replays the same from the same seed. */
function random(g: Game) {
  g.seed = (g.seed + 0x6d2b79f5) | 0;
  let t = g.seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function shuffle(g: Game, deck: CardId[]) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(random(g) * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

/** Mirror a bottom-half y onto the top half. */
const flipY = (side: Side, y: number) => (side === 0 ? y : H - y);

function spawn(g: Game, e: Partial<Entity> & Pick<Entity, "side" | "kind" | "x" | "y" | "r" | "hp">) {
  const ent: Entity = {
    id: g.nextId++,
    px: e.x,
    py: e.y,
    maxHp: e.hp,
    dmg: 0,
    hit: 1,
    range: 0,
    sight: 0,
    speed: 0,
    buildings: false,
    jumps: false,
    splash: 0,
    target: -1,
    locked: false,
    cooldown: 0,
    deploy: 0,
    active: true,
    decay: 0,
    flash: 0,
    swing: 9,
    face: 1,
    moving: false,
    ...e,
  };
  g.entities.push(ent);
  return ent;
}

/** `deck` is side 0's six cards; the bot's deck comes from the seed. */
export function createGame(seed: number, deck: CardId[] = DEFAULT_DECK): Game {
  const g: Game = {
    entities: [],
    projectiles: [],
    rubble: [],
    events: [],
    elixir: [5, 5],
    hand: [[], []],
    queue: [[], []],
    crowns: [0, 0],
    clock: MATCH,
    phase: "play",
    winner: null,
    time: 0,
    nextId: 1,
    seed,
  };
  const decks = [deck, BOT_DECKS[Math.abs(seed) % BOT_DECKS.length]];
  for (const side of [0, 1] as Side[]) {
    const d = shuffle(g, decks[side]);
    g.hand[side] = d.slice(0, HAND_SIZE);
    g.queue[side] = d.slice(HAND_SIZE);
    // Tower range is measured from the tower's edge, so these read as 7 and 7.5 tiles from center.
    spawn(g, { side, kind: "king", x: 9, y: flipY(side, 29), r: 2, hp: 4824, dmg: 120, hit: 1, range: 5, active: false });
    for (const x of LANES) spawn(g, { side, kind: "princess", x, y: flipY(side, 25.5), r: 1.5, hp: 3052, dmg: 109, hit: 0.8, range: 6 });
  }
  return g;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
const edge = (a: Entity, b: Entity) => dist(a, b) - a.r - b.r;
const isTower = (e: Entity) => e.kind === "king" || e.kind === "princess";
const laneOf = (x: number) => (x < W / 2 ? 0 : 1);
const byId = (g: Game, id: number) => g.entities.find((e) => e.id === id);

function princess(g: Game, side: Side, lane: number) {
  return g.entities.find((e) => e.side === side && e.kind === "princess" && laneOf(e.x) === lane);
}

/** Whether `side` may drop a troop or building with its center at (x, y). */
function inZone(g: Game, side: Side, x: number, y: number, r: number) {
  if (x < 0 || x > W || y < 0 || y > H) return false;
  const yy = flipY(side, y);
  // Taking a princess tower opens a pocket on that lane, up to four tiles past the river.
  const pocket = !princess(g, side === 0 ? 1 : 0, laneOf(x));
  if (yy < RIVER[1] && !(pocket && yy > RIVER[0] - 4)) return false;
  return !g.entities.some((e) => (isTower(e) || e.kind === "building") && Math.abs(e.x - x) < e.r + r && Math.abs(e.y - y) < e.r + r);
}

export function canPlace(g: Game, side: Side, card: CardId, x: number, y: number) {
  const c = CARDS[card];
  if (c.kind === "spell") return x >= 0 && x <= W && y >= 0 && y <= H;
  return inZone(g, side, x, y, c.kind === "building" ? c.r : 0.3);
}

/**
 * The tile center nearest (x, y) where `card` can go, searching a few tiles out, so a drop just
 * over the river lands on the bank instead of failing. Null if nothing is close.
 */
export function snap(g: Game, side: Side, card: CardId, x: number, y: number): [number, number] | null {
  const cx = Math.min(W - 0.5, Math.max(0.5, Math.floor(x) + 0.5));
  const cy = Math.min(H - 0.5, Math.max(0.5, Math.floor(y) + 0.5));
  if (CARDS[card].kind === "building") {
    // Two-tile buildings sit on tile corners.
    const bx = Math.min(W - 1, Math.max(1, Math.round(x)));
    const by = Math.min(H - 1, Math.max(1, Math.round(y)));
    let best: [number, number] | null = null;
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const p: [number, number] = [bx + dx, by + dy];
        if (p[0] < 1 || p[0] > W - 1 || p[1] < 1 || p[1] > H - 1) continue;
        if (canPlace(g, side, card, p[0], p[1]) && (!best || Math.hypot(dx, dy) < Math.hypot(best[0] - bx, best[1] - by))) best = p;
      }
    return best;
  }
  let best: [number, number] | null = null;
  for (let dy = -4; dy <= 4; dy++)
    for (let dx = -4; dx <= 4; dx++) {
      const p: [number, number] = [cx + dx, cy + dy];
      if (p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H) continue;
      if (canPlace(g, side, card, p[0], p[1]) && (!best || Math.hypot(dx, dy) < Math.hypot(best[0] - cx, best[1] - cy))) best = p;
    }
  return best;
}

const SPREAD: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.5, 0], [0.5, 0]],
  3: [[0, -0.45], [-0.5, 0.35], [0.5, 0.35]],
};
/** Bigger groups fan out in a sunflower spiral. */
const spread = (n: number): [number, number][] =>
  SPREAD[n] ?? Array.from({ length: n }, (_, i) => [Math.cos(i * 2.4) * 0.38 * Math.sqrt(i), Math.sin(i * 2.4) * 0.38 * Math.sqrt(i)]);

/** Plays the card in hand `slot` at (x, y). Returns false if it can't be afforded or placed. */
export function play(g: Game, side: Side, slot: number, x: number, y: number) {
  const id = g.hand[side][slot];
  const c = CARDS[id];
  if (g.phase === "over" || !id || g.elixir[side] < c.cost || !canPlace(g, side, id, x, y)) return false;
  g.elixir[side] -= c.cost;
  g.hand[side][slot] = g.queue[side].shift()!;
  g.queue[side].push(id);

  if (c.kind === "spell") {
    const king = g.entities.find((e) => e.side === side && e.kind === "king");
    const sx = king?.x ?? 9;
    const sy = king?.y ?? flipY(side, 29);
    g.projectiles.push({ x: sx, y: sy, px: sx, py: sy, sx, sy, side, kind: "spell", card: id, target: -1, dmg: c.dmg, speed: c.knock ? 11 : 16, tx: x, ty: y });
    return true;
  }
  if (c.kind === "building") {
    spawn(g, { side, kind: "building", card: id, x, y, r: c.r, hp: c.hp, dmg: c.dmg, hit: c.hit, range: c.range, sight: c.range, deploy: DEPLOY_TIME, decay: c.hp / c.life });
  } else {
    for (const [ox, oy] of spread(c.count)) {
      spawn(g, {
        side,
        kind: "troop",
        card: id,
        x: x + ox,
        y: y + oy * (side === 0 ? 1 : -1),
        r: c.r,
        hp: c.hp,
        dmg: c.dmg,
        hit: c.hit,
        range: c.range,
        sight: c.sight,
        speed: c.speed,
        buildings: !!c.buildings,
        jumps: !!c.jumps,
        splash: c.splash ?? 0,
        deploy: DEPLOY_TIME,
        face: x < W / 2 ? 1 : -1,
      });
    }
  }
  g.events.push({ type: "deploy", x, y, side });
  return true;
}

function damage(g: Game, e: Entity, amount: number) {
  if (e.hp <= 0) return;
  e.hp -= amount;
  e.flash = 0.12;
  if (e.kind === "king") e.active = true;
  if (e.hp > 0) return;
  e.hp = 0;
  if (isTower(e)) {
    const king = e.kind === "king";
    const other: Side = e.side === 0 ? 1 : 0;
    g.crowns[other] = king ? 3 : g.crowns[other] + 1;
    g.rubble.push({ x: e.x, y: e.y, r: e.r, side: e.side, king });
    g.events.push({ type: "tower", x: e.x, y: e.y, side: e.side, king });
    const k = g.entities.find((t) => t.side === e.side && t.kind === "king");
    if (k) k.active = true;
    if (king || g.phase === "overtime") end(g, other);
  } else {
    g.events.push({ type: "death", x: e.x, y: e.y, side: e.side, big: e.r > 0.6 });
  }
}

function end(g: Game, winner: Side | -1) {
  g.phase = "over";
  g.winner = winner;
}

/** Where a troop actually walks to reach `to`: across a bridge if the river is in the way. */
function waypoint(e: Entity, to: { x: number; y: number }) {
  if (e.jumps) return to;
  const mid = (RIVER[0] + RIVER[1]) / 2;
  const below = e.y > mid;
  if (below === to.y > mid || (e.y > RIVER[0] && e.y < RIVER[1])) return to;
  const bx = LANES.reduce((a, b) => (Math.abs(e.x - a) + Math.abs(to.x - a) <= Math.abs(e.x - b) + Math.abs(to.x - b) ? a : b));
  const bank = below ? RIVER[1] + 0.3 : RIVER[0] - 0.3;
  if (Math.abs(e.x - bx) > 0.4) return { x: bx, y: bank };
  return { x: bx, y: below ? RIVER[0] - 0.5 : RIVER[1] + 0.5 };
}

function acquire(g: Game, e: Entity) {
  let best: Entity | undefined;
  let bestD = Infinity;
  for (const o of g.entities) {
    if (o.side === e.side || o.hp <= 0) continue;
    if (e.buildings && o.kind === "troop") continue;
    // Towers and cannons only shoot troops.
    if (e.kind !== "troop" && o.kind !== "troop") continue;
    const d = edge(e, o);
    if (d <= (e.kind === "troop" ? e.sight : e.range) && d < bestD) {
      best = o;
      bestD = d;
    }
  }
  if (best || e.kind !== "troop") return best;
  // Nothing in sight: march on this lane's princess tower, or the king once it's gone.
  const other: Side = e.side === 0 ? 1 : 0;
  return princess(g, other, laneOf(e.x)) ?? g.entities.find((o) => o.side === other && o.kind === "king");
}

/** Advances the match by `dt` seconds. Call with a fixed step for consistent results. */
export function step(g: Game, dt: number) {
  if (g.phase === "over") return;
  g.time += dt;
  g.clock -= dt;
  const rate = (g.phase === "overtime" || g.clock <= 60 ? 2 : 1) / ELIXIR_EVERY;
  for (const s of [0, 1] as Side[]) g.elixir[s] = Math.min(MAX_ELIXIR, g.elixir[s] + rate * dt);

  for (const e of g.entities) {
    e.px = e.x;
    e.py = e.y;
    e.flash = Math.max(0, e.flash - dt);
    e.swing += dt;
    e.moving = false;
  }

  for (const e of g.entities) {
    if (e.hp <= 0) continue;
    if (e.deploy > 0) {
      e.deploy -= dt;
      continue;
    }
    if (e.kind === "building") damage(g, e, e.decay * dt);
    if (e.kind === "king" && !e.active) continue;
    if (e.kind === "princess" || e.kind === "king" || e.kind === "building") e.cooldown -= dt;

    let t = e.target >= 0 ? byId(g, e.target) : undefined;
    if (!t || t.hp <= 0) {
      t = undefined;
      e.locked = false;
    }
    if (!e.locked || !t) {
      const next = acquire(g, e);
      if (next && next !== t) {
        t = next;
        e.target = next.id;
      }
      if (!next) e.target = -1;
    }
    if (!t) continue;

    const inRange = edge(e, t) <= e.range;
    if (inRange) {
      if (!e.locked) e.cooldown = Math.max(e.cooldown, e.hit * 0.4);
      e.locked = true;
      if (e.kind === "troop") e.cooldown -= dt;
      if (Math.abs(t.x - e.x) > 0.05) e.face = t.x > e.x ? 1 : -1;
      if (e.cooldown <= 0) {
        e.cooldown += e.hit;
        e.swing = 0;
        if (e.range >= 2) {
          const kind = e.card === "musketeer" ? "bullet" : "arrow";
          g.projectiles.push({ x: e.x, y: e.y, px: e.x, py: e.y, sx: e.x, sy: e.y, side: e.side, kind, target: t.id, dmg: e.dmg, speed: kind === "bullet" ? 20 : 14, tx: t.x, ty: t.y });
        } else if (e.splash) {
          for (const o of g.entities) if (o.side !== e.side && o.hp > 0 && o.kind === "troop" && edge(e, o) <= e.splash) damage(g, o, e.dmg);
          if (t.kind !== "troop") damage(g, t, e.dmg);
          g.events.push({ type: "spin", x: e.x, y: e.y, radius: e.splash + e.r });
        } else {
          damage(g, t, e.dmg);
          g.events.push({ type: "hit", x: t.x, y: t.y, side: t.side });
        }
      }
    } else {
      e.locked = false;
      if (e.kind !== "troop") continue;
      e.cooldown = Math.max(0, e.cooldown - dt);
      const w = waypoint(e, t);
      const d = dist(e, w) || 1;
      const s = Math.min(e.speed * dt, d);
      e.x += ((w.x - e.x) / d) * s;
      e.y += ((w.y - e.y) / d) * s;
      if (Math.abs(w.x - e.x) > 0.05) e.face = w.x > e.x ? 1 : -1;
      e.moving = true;
    }
  }

  collide(g);
  fly(g, dt);
  g.entities = g.entities.filter((e) => e.hp > 0);

  if (g.phase === "play" && g.clock <= 0) {
    if (g.crowns[0] !== g.crowns[1]) end(g, g.crowns[0] > g.crowns[1] ? 0 : 1);
    else {
      g.phase = "overtime";
      g.clock = OVERTIME;
    }
  } else if (g.phase === "overtime" && g.clock <= 0) end(g, -1);
}

function collide(g: Game) {
  const troops = g.entities.filter((e) => e.kind === "troop" && e.hp > 0);
  for (let i = 0; i < troops.length; i++) {
    const a = troops[i];
    for (let j = i + 1; j < troops.length; j++) {
      const b = troops[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const min = a.r + b.r;
      const d2 = dx * dx + dy * dy;
      if (d2 >= min * min) continue;
      const d = Math.sqrt(d2) || 0.01;
      // Heavier troops shove lighter ones; a deploying troop is planted.
      const ma = a.deploy > 0 ? 1e6 : a.r * a.r;
      const mb = b.deploy > 0 ? 1e6 : b.r * b.r;
      const push = (min - d) / d;
      const nx = d2 ? dx : 0.01 * (a.id % 2 ? 1 : -1);
      a.x -= nx * push * (mb / (ma + mb));
      a.y -= (d2 ? dy : 0) * push * (mb / (ma + mb));
      b.x += nx * push * (ma / (ma + mb));
      b.y += (d2 ? dy : 0) * push * (ma / (ma + mb));
    }
  }
  const solid = g.entities.filter((e) => e.kind !== "troop" && e.hp > 0);
  for (const t of troops) {
    for (const s of solid) {
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const min = t.r + s.r;
      const d = Math.hypot(dx, dy);
      if (d >= min) continue;
      // Dead center: nudge sideways by id so a troop can't wedge itself on a tower.
      const nx = d ? dx / d : t.id % 2 ? 1 : -1;
      const ny = d ? dy / d : 0;
      t.x = s.x + nx * min;
      t.y = s.y + ny * min;
    }
    t.x = Math.min(W - t.r, Math.max(t.r, t.x));
    t.y = Math.min(H - t.r, Math.max(t.r, t.y));
    if (!t.jumps && t.y > RIVER[0] && t.y < RIVER[1] && !LANES.some((bx) => Math.abs(t.x - bx) <= BRIDGE_HALF)) {
      t.y = t.py <= (RIVER[0] + RIVER[1]) / 2 ? RIVER[0] : RIVER[1];
    }
  }
}

function fly(g: Game, dt: number) {
  g.projectiles = g.projectiles.filter((p) => {
    p.px = p.x;
    p.py = p.y;
    if (p.kind !== "spell") {
      const t = byId(g, p.target);
      if (!t) return false;
      p.tx = t.x;
      p.ty = t.y;
    }
    const d = Math.hypot(p.tx - p.x, p.ty - p.y);
    const s = p.speed * dt;
    if (d > s) {
      p.x += ((p.tx - p.x) / d) * s;
      p.y += ((p.ty - p.y) / d) * s;
      return true;
    }
    p.x = p.tx;
    p.y = p.ty;
    if (p.kind === "spell") {
      const c = CARDS[p.card!];
      if (c.kind !== "spell") return false;
      for (const e of g.entities) {
        if (e.side === p.side || e.hp <= 0 || dist(e, p) > c.radius + e.r) continue;
        damage(g, e, isTower(e) ? p.dmg * TOWER_SPELL_SHARE : p.dmg);
        if (c.knock && e.kind === "troop" && e.maxHp < 1500) {
          const d2 = dist(e, p) || 1;
          e.x += ((e.x - p.x) / d2) * 0.8;
          e.y += ((e.y - p.y) / d2) * 0.8;
        }
      }
      g.events.push({ type: c.knock ? "boom" : "volley", x: p.x, y: p.y, radius: c.radius });
    } else {
      const t = byId(g, p.target);
      if (t) {
        damage(g, t, p.dmg);
        g.events.push({ type: "hit", x: t.x, y: t.y, side: t.side });
      }
    }
    return false;
  });
}

export type Level = "easy" | "medium" | "hard";

const LEVELS: Record<Level, { think: number; jitter: number; reserve: number; smart: number; idle: number }> = {
  // idle: chance the bot shrugs and does nothing on a given think. smart: chance it picks a real counter.
  easy: { think: 3.2, jitter: 2.5, reserve: 10, smart: 0, idle: 0.5 },
  medium: { think: 1.8, jitter: 1.2, reserve: 8, smart: 0.5, idle: 0.25 },
  hard: { think: 0.55, jitter: 0, reserve: 6, smart: 1, idle: 0 },
};

export type Bot = { level: Level; timer: number };

export function createBot(level: Level): Bot {
  return { level, timer: 2 };
}

/** The bot plays side 1. It defends what crosses toward it, and pushes a lane when it has elixir to spare. */
export function botStep(bot: Bot, g: Game, dt: number) {
  bot.timer -= dt;
  if (bot.timer > 0 || g.phase === "over") return;
  const L = LEVELS[bot.level];
  bot.timer = L.think * (0.7 + random(g) * 0.6);
  if (random(g) < L.idle) return;
  const smart = random(g) < L.smart;

  const side: Side = 1;
  const hand = g.hand[side];
  const elixir = g.elixir[side];
  const affordable = hand.map((id, slot) => ({ id, slot, c: CARDS[id] })).filter((h) => h.c.cost <= elixir);
  if (!affordable.length) return;
  const jitter = () => (random(g) - 0.5) * 2 * L.jitter;
  const tryPlay = (slot: number, x: number, y: number) => {
    const p = snap(g, side, hand[slot], x + jitter(), y + jitter());
    return !!p && play(g, side, slot, p[0], p[1]);
  };
  const pick = <T,>(xs: T[]) => xs[Math.floor(random(g) * xs.length)];

  const threats = g.entities.filter((e) => e.side === 0 && e.kind === "troop" && e.y < RIVER[1] + 3);
  if (threats.length) {
    // The threat nearest a tower matters most.
    const lead = threats.reduce((a, b) => (a.y < b.y ? a : b));
    const near = threats.filter((t) => dist(t, lead) < 2.5);
    const has = (id: CardId) => affordable.find((h) => h.id === id);

    if (!smart) {
      const h = pick(affordable.filter((h) => h.c.kind !== "spell")) ?? pick(affordable);
      tryPlay(h.slot, lead.x, Math.min(lead.y - 1.5, RIVER[0] - 1));
      return;
    }
    const value = near.reduce((s, t) => {
      const c = CARDS[t.card!];
      return s + (c.kind === "troop" ? c.cost / c.count : c.cost);
    }, 0);
    // A spell is worth it on a crowd it can actually kill.
    const spell = affordable.find((h) => h.c.kind === "spell" && near.length >= 3 && near.filter((t) => t.hp <= h.c.dmg).length >= 3) ?? has("fireball");
    if (spell && (near.length >= 3 || (spell.id === "fireball" && value >= 4 && near.every((t) => t.maxHp < 1000)))) {
      const cx = near.reduce((s, t) => s + t.x, 0) / near.length;
      const cy = near.reduce((s, t) => s + t.y, 0) / near.length;
      // Lead the target: spells take a moment to land.
      tryPlay(spell.slot, cx, cy - lead.speed * 0.6);
      return;
    }
    const cannon = has("cannon");
    if (cannon && lead.buildings) {
      tryPlay(cannon.slot, W / 2, 9);
      return;
    }
    const swarm = near.length >= 2 && near.every((t) => t.maxHp < 800);
    const order: CardId[] =
      lead.maxHp > 1500
        ? ["minipekka", "skeletons", "goblins", "barbarians", "knight", "musketeer", "valkyrie", "archers", "speargoblins", "cannon"]
        : swarm
          ? ["valkyrie", "archers", "speargoblins", "knight", "musketeer", "barbarians", "cannon", "goblins"]
          : ["knight", "valkyrie", "minipekka", "musketeer", "barbarians", "archers", "goblins", "speargoblins", "skeletons", "cannon"];
    const h = order.map(has).find(Boolean);
    if (!h) return;
    const ranged = h.c.kind === "troop" && h.c.range >= 2;
    if (ranged) tryPlay(h.slot, lead.x < W / 2 ? LANES[0] + 1.5 : LANES[1] - 1.5, 8.5);
    else tryPlay(h.slot, lead.x, Math.min(lead.y - 1.5, RIVER[0] - 0.5));
    return;
  }

  if (elixir < (elixir >= MAX_ELIXIR - 0.2 ? 0 : L.reserve)) return;
  const myTowers = (s: Side, lane: number) => princess(g, s, lane)?.hp ?? 0;
  const lane = myTowers(0, 0) <= myTowers(0, 1) ? 0 : 1;
  const lx = LANES[lane];

  if (smart) {
    // Back up a tank already walking with something that shoots.
    const tank = g.entities.find((e) => e.side === side && e.kind === "troop" && e.maxHp > 1500 && e.y < RIVER[0]);
    if (tank) {
      const support = affordable.find((h) => h.c.kind === "troop" && h.c.range >= 2) ?? affordable.find((h) => h.id === "goblins");
      if (support) {
        tryPlay(support.slot, tank.x, Math.max(0.5, tank.y - 1.5));
        return;
      }
    }
    // Finish a weak tower with a spell.
    for (const h of affordable) {
      const kill = h.c.kind === "spell" && g.entities.find((e) => e.side === 0 && e.kind === "princess" && e.hp <= h.c.dmg * TOWER_SPELL_SHARE);
      if (kill) {
        tryPlay(h.slot, kill.x, kill.y);
        return;
      }
    }
    // Slow tanks start at the back so support can catch up.
    const heavy = affordable.find((h) => h.c.kind === "troop" && h.c.hp > 3000);
    if (heavy) {
      tryPlay(heavy.slot, lx, 1.5);
      return;
    }
  }
  const attackers = affordable.filter((h) => h.c.kind === "troop");
  const h = pick(attackers);
  if (h) tryPlay(h.slot, lx, RIVER[0] - 0.5);
}
