import { CARDS, H, LANES, RIVER, W, canPlace, type CardId, type Entity, type Game, type GameEvent, type Side } from "./arena";

/** Pixels per tile. The canvas is 288 x 512 and the browser scales it up without smoothing. */
export const TILE = 16;
/** Troops are drawn at double size so they read next to the towers. */
const UNIT = 2;

const INK = "#0c0b0a";
const BONE = "#eee7d7";
const TEAM: Record<Side, { T: string; D: string; L: string }> = {
  0: { T: "#4f8bff", D: "#2f5fcf", L: "#9cc0ff" },
  1: { T: "#e8402a", D: "#a82a1a", L: "#ff8f7a" },
};
const FIXED: Record<string, string> = {
  K: INK,
  B: BONE,
  G: "#8e8577",
  g: "#6b6356",
  S: "#f0b88a",
  s: "#c98a5e",
  F: "#a8693f",
  W: "#8a5a3a",
  w: "#5a3a24",
  Y: "#ffd23f",
  y: "#d99a1e",
  P: "#ff8fb8",
  p: "#d9608f",
  N: "#7fd34a",
  n: "#3f8f2a",
  R: "#8a5a3a",
  r: "#5a3a24",
  H: "#c46a8a",
  O: "#ff7a1a",
  X: "#e8402a",
};

// Every sprite faces right. T/D/L take the team's colors.
const SPRITES: Record<string, string[]> = {
  knight: [
    "....KKKKK...",
    "...KYYYYYK..",
    "..KYYYYYYYK.",
    "..KYSSSSSYK.",
    "..KSSSKSSKK.",
    "..KYYYYYYYK.",
    "...KYSSSYK.K",
    "..KKKSSSKKKB",
    ".KGGKTTTKKBK",
    "KGGKTTYTKBK.",
    "KSSKTTTTGK..",
    ".KKKDDDDKK..",
    "...KgK.KgK..",
    "...KKK.KKK..",
  ],
  archers: [
    "...KKKK....",
    "..KPPPPK...",
    ".KPPPPPPK..",
    "KPPSSSSPK.W",
    "KPKSSKSK.KW",
    "KPKSSSSK.KB",
    "KPPKSSKKK.B",
    ".KKTTTTSSKB",
    "..KTTTTKKKW",
    "..KTLTTK.W.",
    "..KDDDDK...",
    "..KDKKDK...",
    "..KK..KK...",
  ],
  giant: [
    "......KKKK......",
    ".....KOOOOK.....",
    "....KSSSSSSK....",
    "....KSSSKSSK....",
    "....KSSSSSSK....",
    "....KSOOOOSK....",
    "..KKKKSSSSKKKK..",
    ".KSSKWWWWWWKSSK.",
    "KSSKWWTTWWWWKSSK",
    "KSSKWWWTTWWWKSSK",
    "KSSKWWWWTTWWKSSK",
    "KSSSKTTTTTTKSSSK",
    ".KKKKWWWWWWKKKK.",
    "....KwwK.KwwK...",
    "....KwwK.KwwK...",
    "...KKKKK.KKKKK..",
  ],
  goblins: [
    "K.......K.",
    "KNK.....NK",
    ".KNNNNNNK.",
    ".KNNNYKNK.",
    ".KNNNNNNKG",
    "..KNNXXK.G",
    "..KTTTTKNG",
    "..KTTTTKK.",
    "..KnK.KnK.",
    "..KK..KK..",
  ],
  musketeer: [
    "....KKKKK.....",
    "...KGBBGGK....",
    ".KKGGGGGGGKK..",
    "KGGKKKKKKKGGK.",
    "...KHSSSSK....",
    "...KHSSKSK....",
    "...KHHSSSK....",
    "..KKTTTTTKKKKK",
    ".KTTKTTTSGGGGG",
    ".KTTTKTTWWKKK.",
    "..KTTTTTK.....",
    "..KDDDDDK.....",
    "..KDKKKDK.....",
    "..KK...KK.....",
  ],
  hog: [
    ".....KK.......KK.",
    "....KKKK.....KGGK",
    "...KFFFFK...KGGGK",
    "...KFFKFK....KWK.",
    "...KFFFFK...KWK..",
    "..KKTTTTKFFKWK...",
    ".KFKTTTTKKFK.....",
    "..KKDDDDK........",
    "..KRRRRRRRRRRRK..",
    ".KRRRRRRRRRRRRRK.",
    "KRRRRRRRRRRRRKPPK",
    "KRRRRRRRRRRRRRPKB",
    ".KRRRRRRRRRRRRKB.",
    "..KrK.KrK.KrK.K..",
    "..KK..KK..KK.....",
  ],
  minipekka: [
    "..K.....K...",
    "..KgK.KgK...",
    "..KKKKKKK...",
    ".KTTTTTTTK..",
    ".KTKKKKKTK..",
    ".KTKKKLKTK.B",
    ".KTTTTTTTKBB",
    "..KDTTTDKBK.",
    ".KTKDDDKBK..",
    "KTTKTTTKKK..",
    ".KKKDDDK....",
    "...KgKgK....",
    "..KKK.KKK...",
  ],
  valkyrie: [
    "..KKKKK.....",
    ".KOOOOOK....",
    "KOOOOOOOK...",
    "KOOSSSSK..K.",
    "KOKSKSSK.KGK",
    "KOKSSSSK.KGK",
    "KOOKSSKK.KWK",
    ".KKTTTTSSKW.",
    "..KTTYTKKW..",
    "..KTTTTK.W..",
    "..KDDDDK....",
    "..KSKKSK....",
    "..KK..KK....",
  ],
  skeletons: [
    "..KKK..",
    ".KBBBK.",
    ".KBKBK.",
    "..KBK.G",
    ".KBKBKG",
    "..KBK.G",
    ".KB.BK.",
    ".KK.KK.",
  ],
  speargoblins: [
    "K.......K..",
    "KNK.....NK.",
    ".KNNNNNNK..",
    ".KNNNYKNK..",
    ".KNNNNNNK.G",
    "..KNNXXKKWK",
    "..KTTTTKWK.",
    "..KTTTWKK..",
    "..KnKWKnK..",
    "..KKWK.KK..",
    "...W.......",
  ],
  barbarians: [
    "K.........K.",
    "KBK.KKK.KBK.",
    ".KBKGGGKBK..",
    "..KGGGGGK...",
    "..KYSSSSK...",
    "..KYSKSSK..K",
    ".KYYYYYYYK.B",
    "..KYYYYYK.KB",
    ".KSKTTTKKKBK",
    "KSSKTTTTSBK.",
    ".KKKwwwwKK..",
    "...KDK.KDK..",
    "...KK..KK...",
  ],
  arrows: [
    "......KK..",
    ".....KBK..",
    "..KK.KWK..",
    ".KBK.KWKKK",
    ".KWKKKWKBK",
    ".KWKKWKKWK",
    "KXWKXWK.WK",
    "KXKKXK.KWK",
    ".K..K..KXK",
    ".......KK.",
  ],
  minions: [
    "KK..KKK..KK",
    "KLKKTTTKKLK",
    "KLLKTTBKLLK",
    ".KLKTTTKLK.",
    "..KKTTTTKK.",
    "...KTTTTK..",
    "...KDKKDK..",
    "....K..K...",
  ],
  megaminion: [
    "....KKKK....",
    "...KGGGGK...",
    "KK.KGKBGK.KK",
    "KLKKGGGGKKLK",
    "KLLKTTTTKLLK",
    "KLLKTGGTKLLK",
    ".KLKTTTTKLK.",
    "..KKTTTTKK..",
    "...KDDDDK...",
    "...KgK.KgK..",
    "...KK..KK...",
  ],
  babydragon: [
    ".....KKK......",
    "....KLLLK..KK.",
    "...KLTTLK.KNNK",
    "..KLTTTK.KNNBK",
    "..KTTTK.KNNNNK",
    ".KKKK.KNNNNKK.",
    "KNK..KNNYYNK..",
    ".KNKKNNYYYNK..",
    "..KNNNNYYNK...",
    "...KKNKKNK....",
    "....KK..KK....",
  ],
  bomber: [
    "..KKKK.....",
    ".KTTTTK....",
    ".KBBBBK....",
    ".KBKBKK..Y.",
    "..KBBK..KO.",
    "..KBBK.KKKK",
    ".KBKKBKKgGK",
    ".KBKKBKKggK",
    "..KBBK.KKKK",
    "..KBKBK....",
    "..KK.KK....",
  ],
  wizard: [
    "...KKKKK....",
    "..KRRRRRK...",
    ".KRRRRRRK...",
    ".KRSSSSK....",
    ".KRSKSSK.KK.",
    ".KRSSSSKKOYK",
    "..KKSSKKKYOK",
    ".KTTTTTTSKK.",
    "KTTKTTTTK...",
    "KTTKTYTTK...",
    ".KKTTTTTK...",
    "..KDDDDDK...",
    "..KDKKKDK...",
    "..KK...KK...",
  ],
  pekka: [
    "..K.......K.....",
    ".KgK.....KgK....",
    ".KggKKKKKggK....",
    "..KgggggggK.....",
    "..KgKKKKKgK.....",
    "..KgKKKLLKK....K",
    "..KgggggggK...KB",
    ".KKKTTTTTKKK.KBK",
    "KgGKTggTTKGgKBK.",
    "KgGKTTTTTKGKBK..",
    "KggKgggggKKBK...",
    ".KKKTTTTTKKK....",
    "...KgggggK......",
    "...KggKggK......",
    "..KggK.KggK.....",
    "..KKKK.KKKK.....",
  ],
  zap: [
    ".....KKKK.",
    "....KLLTK.",
    "...KLLTK..",
    "..KLLTK...",
    ".KLLTKKKK.",
    "KLLLLLLTK.",
    "KKKKLTTK..",
    "...KLTK...",
    "..KLTK....",
    ".KLTK.....",
    ".KKK......",
  ],
  rocket: [
    "....KK....",
    "...KXXK...",
    "...KXXK...",
    "..KGBGGK..",
    "..KGBGGK..",
    "..KGGGgK..",
    "..KGGGgK..",
    ".KXKGGKXK.",
    "KXXKggKXXK",
    "KK.KOYK.KK",
    "...KOYOK..",
    "....KYK...",
  ],
  fireball: [
    "......KKK..",
    "....KKLLK..",
    "..KKTTLLLK.",
    ".KTTLLBBLK.",
    "KDTLLBBBLK.",
    "KDTTLLBLLK.",
    "KDDTTLLLTK.",
    ".KDDTTTTK..",
    "..KKDDDK...",
    "....KKK....",
  ],
  crown: [
    "K.K.K.K.K",
    "KYKYKYKYK",
    "KYYYYYYYK",
    "KYBYYYBYK",
    "KYYYYYYYK",
    ".KKKKKKK.",
  ],
  drop: [
    "...KK...",
    "..KLLK..",
    ".KLTTLK.",
    "KLTTTTDK",
    "KTTTTTDK",
    "KTTTTDDK",
    ".KTDDDK.",
    "..KKKK..",
  ],
};

type Variant = { canvas: HTMLCanvasElement; w: number; h: number };
const cache = new Map<string, Variant>();

function sprite(name: string, side: Side, white = false, colors?: Partial<Record<string, string>>): Variant {
  const key = `${name}:${side}:${white}:${colors ? JSON.stringify(colors) : ""}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const rows = SPRITES[name];
  const h = rows.length;
  const w = rows[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const pal = { ...FIXED, ...TEAM[side], ...colors };
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      ctx.fillStyle = white ? (ch === "K" ? INK : BONE) : pal[ch as keyof typeof pal]!;
      ctx.fillRect(x, y, 1, 1);
    }),
  );
  const v = { canvas, w, h };
  cache.set(key, v);
  return v;
}

const ELIXIR_COLORS = { T: "#b79cff", D: "#7f5fe0", L: "#e2d6ff" };
const ZAP_COLORS = { T: "#5ec8ff", D: "#2f6bff", L: "#eee7d7" };
const FIREBALL_COLORS = { T: "#ff7a1a", D: "#e8402a", L: "#ffd23f" };

const tintsFor = (name: string) => (name === "drop" ? ELIXIR_COLORS : name === "fireball" ? FIREBALL_COLORS : name === "zap" ? ZAP_COLORS : undefined);

/** A sprite's lit pixels in its palette, for building the voxel version behind the page. Null for the Cannon, which is drawn, not a sprite. */
export function spritePixels(name: string, side: Side) {
  const rows = SPRITES[name];
  if (!rows) return null;
  const pal: Record<string, string | undefined> = { ...FIXED, ...TEAM[side], ...tintsFor(name) };
  const px = rows.flatMap((row, y) => [...row].flatMap((ch, x) => (ch === "." ? [] : [{ x, y, color: pal[ch]!, ink: ch === "K" }])));
  return { w: rows[0].length, h: rows.length, px };
}

/** Paints card art or a HUD icon into a small canvas the page scales up. */
export function drawIcon(canvas: HTMLCanvasElement, name: CardId | "crown" | "drop", side: Side = 0) {
  const ctx = canvas.getContext("2d")!;
  if (name === "cannon") {
    canvas.width = 14;
    canvas.height = 12;
    drawCannonBody(ctx, 7, 11, -Math.PI / 4, TEAM[side], 0);
    return;
  }
  const s = sprite(name, side, false, tintsFor(name));
  canvas.width = s.w;
  canvas.height = s.h;
  ctx.clearRect(0, 0, s.w, s.h);
  ctx.drawImage(s.canvas, 0, 0);
}

/** 3x5 digits for tower hit points. */
const DIGITS = ["111101101101111", "010110010010111", "111001111100111", "111001111001111", "101101111001001", "111100111001111", "111100111101111", "111001010010010", "111101111101111", "111101111001111"];

function number(ctx: CanvasRenderingContext2D, n: number, cx: number, y: number, color: string) {
  const s = String(Math.ceil(n));
  const w = s.length * 4 - 1;
  let x = Math.round(cx - w / 2);
  for (const ch of s) {
    const bits = DIGITS[+ch];
    for (let i = 0; i < 15; i++) {
      if (bits[i] !== "1") continue;
      ctx.fillStyle = INK;
      ctx.fillRect(x + (i % 3) + 1, y + Math.floor(i / 3) + 1, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(x + (i % 3), y + Math.floor(i / 3), 1, 1);
    }
    x += 4;
  }
}

/** A pixel circle, one dot per pixel of circumference; `gap` dashes it in runs of that many dots. */
function ring(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, gap = 4) {
  ctx.fillStyle = color;
  const steps = Math.max(24, Math.round(Math.PI * 2 * r));
  for (let i = 0; i < steps; i++) {
    if (gap && Math.floor(i / gap) % 2) continue;
    const a = (i / steps) * Math.PI * 2;
    ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 1, 1);
  }
}

const GRASS = ["#2f7b3a", "#34853f"];
const FLOWERS = ["#e8402a", BONE, "#b79cff", "#ff8fb8", "#ffd23f"];

/** The pitch, river and bridges never change, so they're painted once. */
function paintGround() {
  const c = document.createElement("canvas");
  c.width = W * TILE;
  c.height = H * TILE;
  const ctx = c.getContext("2d")!;
  // Seeded so the pitch looks the same every match.
  let s = 7;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const px = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  };

  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(x * TILE, y * TILE, TILE, TILE, GRASS[(x + y) % 2]);
  for (let i = 0; i < 900; i++) px(rand() * W * TILE, rand() * H * TILE, 1, 1, rand() < 0.5 ? "#2a6e34" : "#3f9a48");
  for (let i = 0; i < 160; i++) {
    const x = rand() * W * TILE;
    const y = rand() * H * TILE;
    px(x, y, 1, 2, "#5cb84a");
    px(x + 2, y + 1, 1, 2, "#1f5a2a");
    px(x - 1, y + 1, 1, 1, "#9fe870");
  }
  // Flowers go down before the paths and plazas so those cover any that land underneath.
  for (let i = 0; i < 90; i++) {
    const x = rand() * W * TILE;
    const y = rand() * H * TILE;
    const petal = FLOWERS[Math.floor(rand() * FLOWERS.length)];
    px(x - 1, y, 3, 1, petal);
    px(x, y - 1, 1, 3, petal);
    px(x, y, 1, 1, petal === "#ffd23f" ? "#ff7a1a" : "#ffd23f");
    px(x, y + 2, 1, 2, "#1f5a2a");
  }

  const path = (x: number, y: number, w: number, h: number) => {
    px(x - 1, y - 1, w + 2, h + 2, "#6e5233");
    px(x, y, w, h, "#b08a55");
    for (let i = 0; i < (w * h) / 40; i++) px(x + rand() * (w - 2), y + rand() * (h - 2), 2, 1, rand() < 0.5 ? "#c9a46a" : "#8a6a40");
  };
  for (const lx of LANES) path((lx - 1) * TILE, 2.5 * TILE, 2 * TILE, (H - 5) * TILE);
  path(4 * TILE, 2.5 * TILE, 10 * TILE, TILE);
  path(4 * TILE, (H - 3.5) * TILE, 10 * TILE, TILE);

  // Stone plazas under the towers.
  const plaza = (cx: number, cy: number, half: number) => {
    const x = cx * TILE - half;
    const y = cy * TILE - half;
    px(x - 1, y - 1, half * 2 + 2, half * 2 + 2, INK);
    px(x, y, half * 2, half * 2, "#8e8577");
    for (let gy = y + 6; gy < y + half * 2; gy += 6) px(x, gy, half * 2, 1, "#6b6356");
    for (let gx = x + 6; gx < x + half * 2; gx += 6) px(gx, y, 1, half * 2, "#6b6356");
    px(x, y, half * 2, 1, "#b8ad98");
  };
  for (const cy of [6.5, H - 6.5]) for (const lx of LANES) plaza(lx, cy, 1.5 * TILE + 3);
  plaza(W / 2, 3, 2 * TILE + 3);
  plaza(W / 2, H - 3, 2 * TILE + 3);

  // Bushes hug the side lines, where troops rarely walk.
  for (const [bx, by] of [[0, 9], [W, 11], [0, 21], [W, 22], [0, 13], [W, 19], [W - 0.4, 1], [0.4, H - 1]] as const) {
    const x = bx * TILE;
    const y = by * TILE;
    px(x - 9, y - 6, 18, 13, INK);
    px(x - 8, y - 5, 16, 11, "#1f5a2a");
    px(x - 6, y - 5, 9, 5, "#3f9a48");
    px(x - 4, y - 4, 3, 2, "#5cb84a");
    px(x + 3, y - 1, 2, 2, "#e8402a");
    px(x - 2, y + 2, 2, 2, "#e8402a");
  }

  const ry = RIVER[0] * TILE;
  const rh = (RIVER[1] - RIVER[0]) * TILE;
  px(0, ry - 4, W * TILE, rh + 8, "#8e8577");
  for (let x = 0; x < W * TILE; x += 5) {
    px(x + (x % 3), ry - 4, 3, 2, "#b8ad98");
    px(x + ((x * 7) % 4), ry + rh + 2, 3, 2, "#6b6356");
  }
  px(0, ry - 1, W * TILE, 1, INK);
  px(0, ry, W * TILE, rh, "#2f6bff");
  px(0, ry + 8, W * TILE, rh - 14, "#2457d6");
  px(0, ry, W * TILE, 2, "#9cc0ff");
  px(0, ry + rh - 2, W * TILE, 2, "#1c3a82");
  px(0, ry + rh, W * TILE, 1, INK);

  for (const lx of LANES) {
    const bx = (lx - 1.5) * TILE;
    const by = ry - 8;
    const bh = rh + 16;
    px(bx - 1, by - 1, 3 * TILE + 2, bh + 2, INK);
    px(bx, by, 3 * TILE, bh, "#a8743f");
    for (let y = by + 3; y < by + bh; y += 4) px(bx, y, 3 * TILE, 1, "#6e4a26");
    px(bx, by, 3 * TILE, 1, "#c9925a");
    for (const rx of [bx, bx + 3 * TILE - 3]) {
      px(rx, by, 3, bh, "#5a3a24");
      for (let y = by; y < by + bh; y += 10) px(rx - 1, y, 5, 3, "#8a5a3a");
    }
  }
  return c;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  gravity: number;
  /** Walks through these over its life instead of holding `color`: fire cooling to smoke. */
  colors?: string[];
  /** Pixels of size gained per second, for smoke that billows. */
  grow?: number;
};
const FIRE = ["#fff3b0", "#ffd23f", "#ff7a1a", "#e8402a", "#8a3a24"];
const SMOKE = ["#8e8577", "#6b6356", "#3f3933"];
type Float = { x: number; y: number; t: number; side: Side };

type View = {
  ground: HTMLCanvasElement;
  particles: Particle[];
  crowns: Float[];
  booms: { x: number; y: number; r: number; t: number; color?: string; flash?: boolean }[];
  /** Billows of an explosion: each blooms white-hot, cools through orange and red, and drifts off as smoke. */
  puffs: { x: number; y: number; r: number; delay: number; t: number; life: number }[];
  /** Burn marks left on the grass by Fireball and Rocket. */
  scorch: { x: number; y: number; r: number; t: number }[];
  /** The placement ghost glides toward the snapped tile rather than jumping between tiles. */
  ghost: { card: CardId; x: number; y: number } | null;
  /** Elixir spent, floating up from where a card was played. */
  pops: { x: number; y: number; t: number; n: number }[];
  /** Red crosses where a drop was refused. */
  marks: { x: number; y: number; t: number }[];
  /** A brief screen tint, for Zap. */
  flash: number;
  shake: number;
  time: number;
};

export function createView(): View {
  return { ground: paintGround(), particles: [], crowns: [], booms: [], puffs: [], scorch: [], ghost: null, pops: [], marks: [], flash: 0, shake: 0, time: 0 };
}

/** Floats the elixir cost up from a card just played at tile (x, y). */
export function costPop(v: View, x: number, y: number, n: number) {
  v.pops.push({ x: x * TILE, y: y * TILE, t: 0, n });
}

/** Marks tile (x, y) as somewhere the card couldn't go. */
export function refuse(v: View, x: number, y: number) {
  v.marks.push({ x: x * TILE, y: y * TILE, t: 0 });
}

/** Fire, smoke and embers thrown out of an impact; `big` is the Rocket. */
function explode(v: View, x: number, y: number, r: number, big: boolean, calm: boolean) {
  v.booms.push({ x, y, r, t: 0, flash: true });
  v.scorch.push({ x, y, r: r * 0.55, t: 0 });
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const n = big ? 13 : 8;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = i === 0 ? 0 : rand(0.2, 0.62) * r;
    v.puffs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.7 - 3, r: i === 0 ? (big ? 15 : 11) : rand(big ? 7 : 5, big ? 12 : 9), delay: i === 0 ? 0 : rand(0, big ? 0.16 : 0.1), t: 0, life: rand(0.45, big ? 0.85 : 0.65) });
  }
  for (let i = 0; i < (big ? 54 : 34); i++) {
    const a = Math.random() * Math.PI * 2;
    const s = rand(30, big ? 170 : 130);
    const max = rand(0.3, 0.65);
    v.particles.push({ x, y: y - 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.7, life: max, max, color: FIRE[0], colors: FIRE, size: Math.random() < 0.4 ? 3 : 2, gravity: -40 });
  }
  for (let i = 0; i < (big ? 18 : 10); i++) {
    const max = rand(0.8, big ? 1.8 : 1.3);
    v.particles.push({ x: x + rand(-r, r) * 0.5, y: y + rand(-r, r) * 0.3, vx: rand(-12, 12), vy: rand(-34, -12), life: max, max, color: SMOKE[0], colors: SMOKE, size: 3, gravity: 0, grow: big ? 9 : 6 });
  }
  for (let i = 0; i < (big ? 22 : 12); i++) {
    const a = rand(Math.PI * 1.1, Math.PI * 1.9);
    const s = rand(90, big ? 210 : 160);
    const max = rand(0.4, 0.8);
    v.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: max, max, color: "#ffd23f", size: 1, gravity: 380 });
  }
  if (!calm) v.shake = Math.max(v.shake, big ? 0.45 : 0.25);
}

function burst(v: View, x: number, y: number, n: number, colors: string[], speed: number, size = 1, gravity = 0) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = speed * (0.4 + Math.random() * 0.6);
    const max = 0.25 + Math.random() * 0.35;
    v.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: max, max, color: colors[i % colors.length], size, gravity });
  }
}

/** Turns engine events into particles and shakes. Call once per frame, then clear `g.events`. */
export function absorb(v: View, events: GameEvent[], calm: boolean) {
  for (const e of events) {
    const x = e.x * TILE;
    const y = e.y * TILE;
    if (e.type === "hit") burst(v, x, y - 4, 4, [BONE, "#ffd23f", "#ff7a1a"], 50);
    else if (e.type === "death") burst(v, x, y - 4, e.big ? 20 : 10, [BONE, "#ffd23f", TEAM[e.side].T, TEAM[e.side].L], 70, 2, 60);
    else if (e.type === "deploy") {
      burst(v, x, y + 2, 12, [TEAM[e.side].T, TEAM[e.side].L, BONE, "#b08a55"], 50, 2, 40);
      v.booms.push({ x, y, r: TILE, t: 0, color: TEAM[e.side].L });
    }
    else if (e.type === "volley") {
      v.booms.push({ x, y, r: e.radius * TILE, t: 0, color: BONE });
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * e.radius * TILE;
        burst(v, x + Math.cos(a) * d, y + Math.sin(a) * d, 2, ["#8a5a3a", BONE], 30, 1, 60);
      }
    } else if (e.type === "zap") {
      v.booms.push({ x, y, r: e.radius * TILE, t: 0, color: "#9cc0ff" });
      burst(v, x, y, 22, ["#5ec8ff", BONE, "#9cc0ff"], 140, 1);
      v.flash = calm ? 0 : 0.12;
    } else if (e.type === "splash") {
      v.booms.push({ x, y, r: e.radius * TILE, t: 0, color: "#ff7a1a" });
      burst(v, x, y - 2, 8, ["#ff7a1a", "#ffd23f", "#e8402a"], 70, 1, 40);
    } else if (e.type === "spin") {
      v.booms.push({ x, y, r: e.radius * TILE, t: 0, color: "#ff7a1a" });
      burst(v, x, y - 4, 6, ["#ff7a1a", "#ffd23f", BONE], 70);
    } else if (e.type === "boom" || e.type === "blast") explode(v, x, y, e.radius * TILE, e.type === "blast", calm); else if (e.type === "tower") {
      burst(v, x, y, 40, ["#6b6356", "#8e8577", TEAM[e.side].T, "#ffd23f"], 120, 2, 160);
      v.crowns.push({ x, y, t: 0, side: e.side === 0 ? 1 : 0 });
      if (!calm) v.shake = Math.max(v.shake, e.king ? 0.6 : 0.35);
    }
  }
}

function drawCannonBody(ctx: CanvasRenderingContext2D, cx: number, bottom: number, angle: number, team: { T: string; D: string; L: string }, recoil: number) {
  ctx.fillStyle = INK;
  ctx.fillRect(cx - 7, bottom - 7, 14, 7);
  ctx.fillStyle = "#8a5a3a";
  ctx.fillRect(cx - 6, bottom - 6, 12, 5);
  ctx.fillStyle = "#a8743f";
  ctx.fillRect(cx - 6, bottom - 6, 12, 1);
  ctx.fillStyle = team.T;
  ctx.fillRect(cx - 6, bottom - 3, 12, 1);
  const hy = bottom - 8;
  const len = 7 - recoil;
  for (let i = 0; i <= len; i++) {
    const bx = Math.round(cx + Math.cos(angle) * i);
    const by = Math.round(hy + Math.sin(angle) * i);
    ctx.fillStyle = INK;
    ctx.fillRect(bx - 2, by - 2, 4, 4);
  }
  ctx.fillStyle = INK;
  ctx.fillRect(cx - 4, hy - 4, 8, 7);
  ctx.fillStyle = "#3f3933";
  ctx.fillRect(cx - 3, hy - 3, 6, 5);
  ctx.fillStyle = "#8e8577";
  ctx.fillRect(cx - 2, hy - 3, 2, 1);
  for (let i = 2; i < len; i++) {
    ctx.fillStyle = "#3f3933";
    ctx.fillRect(Math.round(cx + Math.cos(angle) * i) - 1, Math.round(hy + Math.sin(angle) * i) - 1, 2, 2);
  }
  ctx.fillStyle = "#6b6356";
  ctx.fillRect(Math.round(cx + Math.cos(angle) * len) - 1, Math.round(hy + Math.sin(angle) * len) - 1, 2, 2);
}

function cannon(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, team: { T: string; D: string; L: string }, recoil: number) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y) + 8);
  ctx.scale(UNIT, UNIT);
  drawCannonBody(ctx, 0, 0, angle, team, recoil);
  ctx.restore();
}

function drawTower(ctx: CanvasRenderingContext2D, e: Entity, x: number, y: number, time: number) {
  const king = e.kind === "king";
  const team = TEAM[e.side];
  const half = e.r * TILE;
  const left = Math.round(x - half + 2);
  const w = Math.round(half * 2 - 4);
  const top = Math.round(y - half + (king ? 4 : 6));
  const bottom = Math.round(y + half - 2);
  const flash = e.flash > 0;

  ctx.fillStyle = "rgba(12,11,10,0.45)";
  ctx.fillRect(left + 2, bottom - 2, w, 4);
  ctx.fillStyle = INK;
  ctx.fillRect(left - 1, top - 1, w + 2, bottom - top + 2);
  ctx.fillStyle = flash ? BONE : "#b0a690";
  ctx.fillRect(left, top, w, bottom - top);
  if (!flash) {
    ctx.fillStyle = "#857a66";
    for (let ry = top + 6, row = 0; ry < bottom; ry += 5, row++) {
      ctx.fillRect(left, ry, w, 1);
      for (let rx = left + (row % 2 ? 3 : 7); rx < left + w; rx += 8) ctx.fillRect(rx, ry - 4, 1, 4);
    }
    ctx.fillStyle = "#d8cfba";
    ctx.fillRect(left, top, 2, bottom - top);
    ctx.fillStyle = "#857a66";
    ctx.fillRect(left + w - 3, top, 3, bottom - top);
    // A team banner down the front, under the battlements.
    const bx = Math.round(x) - 5;
    ctx.fillStyle = INK;
    ctx.fillRect(bx - 1, top, 12, king ? 20 : 13);
    ctx.fillStyle = team.T;
    ctx.fillRect(bx, top, 10, king ? 18 : 11);
    ctx.fillStyle = team.L;
    ctx.fillRect(bx, top, 10, 1);
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(bx + 4, top + (king ? 6 : 3), 2, 4);
    ctx.fillRect(bx + 3, top + (king ? 7 : 4), 4, 2);
    // Slit windows.
    ctx.fillStyle = INK;
    for (const wx of [left + 5, left + w - 7]) ctx.fillRect(wx, top + 6, 2, 5);
  }
  // Battlements in team color.
  const bt = top - 4;
  ctx.fillStyle = INK;
  ctx.fillRect(left - 3, bt - 1, w + 6, 7);
  ctx.fillStyle = team.T;
  ctx.fillRect(left - 2, bt, w + 4, 5);
  ctx.fillStyle = team.L;
  ctx.fillRect(left - 2, bt, w + 4, 1);
  for (let cx = left - 2; cx < left + w + 2; cx += 6) {
    ctx.fillStyle = INK;
    ctx.fillRect(cx - 1, bt - 5, 5, 5);
    ctx.fillStyle = team.D;
    ctx.fillRect(cx, bt - 4, 3, 4);
  }
  ctx.fillStyle = INK;
  ctx.fillRect(Math.round(x) - 4, bottom - 9, 8, 9);
  ctx.fillStyle = "#8a5a3a";
  ctx.fillRect(Math.round(x) - 3, bottom - 8, 6, 8);
  ctx.fillStyle = "#5a3a24";
  ctx.fillRect(Math.round(x), bottom - 8, 1, 8);
  ctx.fillStyle = "#ffd23f";
  ctx.fillRect(Math.round(x) + 1, bottom - 5, 1, 1);

  // Flags on the corners, flapping.
  for (const fx of [left - 2, left + w + 1]) {
    ctx.fillStyle = INK;
    ctx.fillRect(fx, bt - 14, 1, 10);
    const flap = Math.floor(time * 6 + fx) % 2;
    const dir = fx < x ? -1 : 1;
    ctx.fillStyle = team.T;
    ctx.fillRect(dir > 0 ? fx + 1 : fx - 5, bt - 14 + flap, 5, 3);
    ctx.fillStyle = team.L;
    ctx.fillRect(dir > 0 ? fx + 1 : fx - 5, bt - 14 + flap, 5, 1);
  }

  if (king) {
    const crown = sprite("crown", e.side);
    const bob = e.active ? 0 : Math.round(Math.sin(time * 2) * 1);
    ctx.drawImage(crown.canvas, Math.round(x - crown.w / 2), bt - 13 + bob);
    if (!e.active) {
      // Asleep until provoked.
      const z = (time * 0.8) % 1;
      ctx.fillStyle = BONE;
      for (let i = 0; i < 2; i++) {
        const p = (z + i * 0.5) % 1;
        const zx = Math.round(x + 10 + p * 6);
        const zy = Math.round(bt - 14 - p * 10);
        ctx.globalAlpha = 1 - p;
        ctx.fillRect(zx, zy, 3, 1);
        ctx.fillRect(zx + 1, zy + 1, 1, 1);
        ctx.fillRect(zx, zy + 2, 3, 1);
      }
      ctx.globalAlpha = 1;
    }
  } else {
    // A little archer on the wall.
    const ax = Math.round(x) - 2;
    const ay = bt - 9;
    ctx.fillStyle = INK;
    ctx.fillRect(ax - 1, ay - 1, 6, 7);
    ctx.fillStyle = team.T;
    ctx.fillRect(ax, ay + 2, 4, 3);
    ctx.fillStyle = "#e0a878";
    ctx.fillRect(ax, ay, 4, 2);
  }

  const bw = Math.round(half * 2 - 2);
  // The enemy's bars hang below their towers so the top row stays on the canvas.
  const by = e.side === 1 ? bottom + 10 : bt - (king ? 24 : 18);
  ctx.fillStyle = INK;
  ctx.fillRect(Math.round(x - bw / 2) - 1, by - 1, bw + 2, 4);
  ctx.fillStyle = team.D;
  ctx.fillRect(Math.round(x - bw / 2), by, bw, 2);
  ctx.fillStyle = team.T;
  ctx.fillRect(Math.round(x - bw / 2), by, Math.round((bw * e.hp) / e.maxHp), 2);
  number(ctx, e.hp, x, e.side === 1 ? by + 5 : by - 7, BONE);
}

function bar(ctx: CanvasRenderingContext2D, e: Entity, x: number, top: number) {
  if (e.hp >= e.maxHp && e.kind === "troop") return;
  const w = Math.max(10, Math.round(e.r * 24));
  const bx = Math.round(x - w / 2);
  ctx.fillStyle = INK;
  ctx.fillRect(bx - 1, top - 1, w + 2, 4);
  ctx.fillStyle = TEAM[e.side].D;
  ctx.fillRect(bx, top, w, 2);
  ctx.fillStyle = TEAM[e.side].T;
  ctx.fillRect(bx, top, Math.max(1, Math.round((w * e.hp) / e.maxHp)), 2);
}

function drawUnit(ctx: CanvasRenderingContext2D, e: Entity, x: number, y: number, time: number) {
  const s = sprite(e.card!, e.side, e.flash > 0);
  const dropping = e.deploy > 0 ? e.deploy : 0;
  // Flyers hover above their shadow.
  const lift = Math.round(dropping * dropping * 28) + (e.air ? 14 + Math.round(Math.sin(time * 3 + e.id) * 2) : 0);
  const bob = e.moving && !e.air ? Math.floor(time * 8 + e.id) % 2 : 0;
  // A short lunge toward the target after each swing.
  const lunge = e.swing < 0.12 && e.range < 2 ? 3 : 0;
  const dx = Math.round(x) + lunge * e.face;
  const dy = Math.round(y);
  const sw = s.w * UNIT;
  const sh = s.h * UNIT;

  // A team-colored ring at the feet, so friend and foe read apart in a crowd.
  const shadow = Math.max(4, Math.round(sw * 0.7 * (1 - dropping * 0.5)));
  ctx.fillStyle = "rgba(12,11,10,0.4)";
  ctx.fillRect(dx - (shadow >> 1), dy, shadow, 4);
  ctx.fillStyle = TEAM[e.side].T;
  ctx.fillRect(dx - (shadow >> 1) + 1, dy + 4, shadow - 2, 1);
  ctx.fillRect(dx - (shadow >> 1), dy + 1, 1, 3);
  ctx.fillRect(dx + shadow - (shadow >> 1) - 1, dy + 1, 1, 3);

  if (e.jumps && y / TILE > RIVER[0] - 0.5 && y / TILE < RIVER[1] + 0.5) {
    // The hog hops the river.
    const p = (y / TILE - (RIVER[0] - 0.5)) / (RIVER[1] - RIVER[0] + 1);
    ctx.save();
    ctx.translate(0, -Math.round(Math.sin(p * Math.PI) * 14));
  } else ctx.save();
  ctx.translate(dx, dy - lift - bob);
  if (e.face < 0) ctx.scale(-1, 1);
  ctx.globalAlpha = dropping > 0 ? 0.6 + 0.4 * (1 - dropping) : 1;
  ctx.drawImage(s.canvas, -(sw >> 1), -sh + 2, sw, sh);
  ctx.restore();
  ctx.globalAlpha = 1;
  if (e.stun > 0) {
    ctx.fillStyle = Math.floor(time * 12) % 2 ? "#5ec8ff" : BONE;
    for (let i = 0; i < 3; i++) {
      const a = time * 6 + (i * Math.PI * 2) / 3;
      ctx.fillRect(Math.round(dx + Math.cos(a) * 7), Math.round(dy - lift - sh + Math.sin(a) * 2), 2, 2);
    }
  }
  bar(ctx, e, dx, dy - lift - sh - 3);
}

const ROCKET = [
  "KK...........",
  "KXK.KKKKKK...",
  ".KKKBBGGGGKK.",
  "..KGGGGGGGXXK",
  ".KKKggggggKK.",
  "KXK.KKKKKK...",
  "KK...........",
];
let rocketSprite: HTMLCanvasElement | null = null;

function disk(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.fillStyle = color;
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.round(Math.sqrt(r * r - dy * dy));
    ctx.fillRect(cx - w, cy + dy, w * 2 + 1, 1);
  }
}

/**
 * Fireball and Rocket in flight: a high arc from the king tower with a trail of fire and smoke,
 * and a shadow on the grass that tightens as it comes down, so you can read where it'll land.
 */
function drawShell(ctx: CanvasRenderingContext2D, v: View, p: Game["projectiles"][number], x: number, y: number, dt: number) {
  const rocket = p.card === "rocket";
  const total = Math.hypot(p.tx - p.sx, p.ty - p.sy) || 1;
  const done = Math.min(1, Math.hypot(x / TILE - p.sx, y / TILE - p.sy) / total);
  const peak = (rocket ? 34 : 22) + total * (rocket ? 3.2 : 2.4);
  const h = Math.sin(done * Math.PI) * peak;
  // Heading on screen: the ground direction, bent by how fast the arc is rising or falling.
  const climb = (Math.cos(done * Math.PI) * Math.PI * peak) / (total * TILE);
  const angle = Math.atan2((p.ty - p.sy) / total - climb, (p.tx - p.sx) / total);
  const bx = Math.round(x);
  const by = Math.round(y - h);

  const sw = Math.round((rocket ? 6 : 4) + done * (rocket ? 14 : 10));
  ctx.fillStyle = `rgba(12,11,10,${0.18 + done * 0.3})`;
  ctx.fillRect(bx - (sw >> 1), Math.round(y) - 1, sw, 3);
  ctx.fillRect(bx - (sw >> 1) + 2, Math.round(y) - 2, sw - 4, 5);

  const back = rocket ? 13 : 4;
  const tx = x - Math.cos(angle) * back;
  const ty = y - h - Math.sin(angle) * back;
  for (let i = 0; i < Math.max(1, Math.round(dt * 60)) * (rocket ? 2 : 3); i++) {
    const max = 0.18 + Math.random() * 0.22;
    v.particles.push({ x: tx + (Math.random() - 0.5) * 3, y: ty + (Math.random() - 0.5) * 3, vx: -Math.cos(angle) * 30 + (Math.random() - 0.5) * 20, vy: -Math.sin(angle) * 30 + (Math.random() - 0.5) * 20, life: max, max, color: FIRE[0], colors: FIRE, size: rocket ? 2 : 3, gravity: -30 });
  }
  if (Math.random() < (rocket ? 0.9 : 0.5)) {
    const max = rocket ? 0.9 : 0.55;
    v.particles.push({ x: tx, y: ty, vx: (Math.random() - 0.5) * 8, vy: -8, life: max, max, color: SMOKE[0], colors: rocket ? ["#b8ad98", ...SMOKE] : SMOKE, size: 2, gravity: 0, grow: rocket ? 7 : 5 });
  }

  if (rocket) {
    if (!rocketSprite) {
      rocketSprite = document.createElement("canvas");
      rocketSprite.width = ROCKET[0].length;
      rocketSprite.height = ROCKET.length;
      const rc = rocketSprite.getContext("2d")!;
      ROCKET.forEach((row, ry) =>
        [...row].forEach((ch, rx) => {
          if (ch === ".") return;
          rc.fillStyle = FIXED[ch];
          rc.fillRect(rx, ry, 1, 1);
        }),
      );
    }
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle);
    const flick = Math.random() < 0.5 ? 1 : 0;
    ctx.fillStyle = "#ff7a1a";
    ctx.fillRect(-19 - flick * 2, -3, 7 + flick * 2, 6);
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(-16 - flick, -2, 4 + flick, 4);
    ctx.fillStyle = BONE;
    ctx.fillRect(-14, -1, 2, 2);
    ctx.drawImage(rocketSprite, -13, -7, 26, 14);
    ctx.restore();
    return;
  }
  const r = 5 + (Math.floor(v.time * 18) % 2);
  const fx = Math.round(Math.cos(angle) * 1.5);
  const fy = Math.round(Math.sin(angle) * 1.5);
  disk(ctx, bx, by, r + 1, INK);
  disk(ctx, bx, by, r, "#e8402a");
  disk(ctx, bx + fx, by + fy, r - 1, "#ff7a1a");
  disk(ctx, bx + fx, by + fy, r - 3, "#ffd23f");
  disk(ctx, bx + fx * 2, by + fy * 2, 1, "#fff3b0");
}

/** Corner brackets on the tile a card will actually land on. */
function brackets(ctx: CanvasRenderingContext2D, x: number, y: number, half: number) {
  ctx.fillStyle = BONE;
  const l = Math.round(x - half);
  const t = Math.round(y - half);
  const r = Math.round(x + half) - 1;
  const b = Math.round(y + half) - 1;
  for (const [cx, cy, dx, dy] of [[l, t, 1, 1], [r, t, -1, 1], [l, b, 1, -1], [r, b, -1, -1]] as const) {
    ctx.fillRect(Math.min(cx, cx + dx * 3), cy, 4, 1);
    ctx.fillRect(cx, Math.min(cy, cy + dy * 3), 1, 4);
  }
}

/** `at` is the snapped tile; `glide` is where the ghost has eased to on its way there. */
function drawGhost(ctx: CanvasRenderingContext2D, card: CardId, at: [number, number], glide: [number, number], time: number) {
  const c = CARDS[card];
  const x = glide[0] * TILE;
  const y = glide[1] * TILE;
  if (c.kind === "spell") {
    ctx.fillStyle = card === "zap" ? "rgba(94,200,255,0.14)" : "rgba(255,122,26,0.14)";
    ctx.beginPath();
    ctx.arc(x, y, c.radius * TILE, 0, Math.PI * 2);
    ctx.fill();
    ring(ctx, x, y, c.radius * TILE, card === "zap" ? "#5ec8ff" : "#ff7a1a", 0);
    ring(ctx, x, y, c.radius * TILE - 2, BONE, 3);
    brackets(ctx, at[0] * TILE, at[1] * TILE, 4);
    return;
  }
  const half = c.kind === "building" ? TILE : TILE / 2;
  ctx.fillStyle = "rgba(238,231,215,0.16)";
  ctx.fillRect(Math.round(at[0] * TILE - half), Math.round(at[1] * TILE - half), half * 2, half * 2);
  brackets(ctx, at[0] * TILE, at[1] * TILE, half);
  if (c.kind === "building") {
    ring(ctx, x, y, (c.range + c.r) * TILE, "rgba(238,231,215,0.5)");
    ctx.globalAlpha = 0.75;
    cannon(ctx, x, y, -Math.PI / 2, TEAM[0], 0);
    ctx.globalAlpha = 1;
    return;
  }
  if (c.range >= 2) ring(ctx, x, y, (c.range + c.r) * TILE, "rgba(238,231,215,0.5)");
  const s = sprite(card, 0);
  const bob = Math.round(Math.sin(time * 6) * 1.5) - (c.air ? 14 : 0);
  // Groups preview as a small huddle; the full spread shows once they land.
  const huddle: [number, number][] = c.count === 1 ? [[0, 0]] : c.count === 2 ? [[-5, 0], [5, 0]] : [[0, -4], [-7, 3], [7, 3]];
  ctx.globalAlpha = 0.75;
  for (const [ox, oy] of huddle) ctx.drawImage(s.canvas, Math.round(x - s.w + ox), Math.round(y - s.h * UNIT + 4 + oy + bob), s.w * UNIT, s.h * UNIT);
  ctx.globalAlpha = 1;
}

/** Tiles the selected card can't go on, washed red so the legal half reads at a glance. */
function drawZone(ctx: CanvasRenderingContext2D, g: Game, card: CardId) {
  if (CARDS[card].kind === "spell") return;
  ctx.fillStyle = "rgba(232,64,42,0.12)";
  for (let ty = 0; ty < H; ty++)
    for (let tx = 0; tx < W; tx++) {
      if (!canPlace(g, 0, card, tx + 0.5, ty + 0.5)) ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
    }
  ctx.fillStyle = "rgba(232,64,42,0.7)";
  for (let ty = 0; ty < H; ty++)
    for (let tx = 0; tx < W; tx++) {
      const here = canPlace(g, 0, card, tx + 0.5, ty + 0.5);
      if (here && ty > 0 && !canPlace(g, 0, card, tx + 0.5, ty - 0.5)) ctx.fillRect(tx * TILE, ty * TILE, TILE, 1);
    }
}

type Aim = { card: CardId; at: [number, number] | null } | null;

/** Draws one frame. `alpha` is how far between the last two simulation steps this frame falls. */
export function render(ctx: CanvasRenderingContext2D, g: Game, v: View, dt: number, alpha: number, aim: Aim) {
  v.time += dt;
  const time = v.time;
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  if (v.shake > 0) {
    v.shake = Math.max(0, v.shake - dt);
    ctx.translate(Math.round((Math.random() - 0.5) * 4 * (v.shake / 0.3)), Math.round((Math.random() - 0.5) * 4 * (v.shake / 0.3)));
  }
  ctx.drawImage(v.ground, 0, 0);

  // River current and sparkles.
  for (let i = 0; i < 22; i++) {
    const sx = ((i * 41 + time * (i % 2 ? 12 : 8)) % (W * TILE) + W * TILE) % (W * TILE);
    const sy = RIVER[0] * TILE + 5 + ((i * 7) % 22);
    if (LANES.some((l) => Math.abs(sx / TILE - l) < 1.8)) continue;
    const glint = Math.floor(time * 3 + i) % 5 === 0;
    ctx.fillStyle = glint ? BONE : i % 3 ? "#5ec8ff" : "#9cc0ff";
    ctx.fillRect(Math.round(sx), sy, glint ? 2 : 4, 1);
  }

  // Cloud shadows drifting over the pitch.
  ctx.fillStyle = "rgba(12,11,10,0.13)";
  for (let i = 0; i < 3; i++) {
    const cx = ((i * 131 + time * 6) % (W * TILE + 120)) - 60;
    const cy = ((i * 197 + time * 3) % (H * TILE + 80)) - 40;
    ctx.fillRect(Math.round(cx - 22), Math.round(cy - 6), 44, 12);
    ctx.fillRect(Math.round(cx - 14), Math.round(cy - 12), 26, 6);
    ctx.fillRect(Math.round(cx - 30), Math.round(cy - 1), 8, 6);
  }

  v.scorch = v.scorch.filter((m) => {
    m.t += dt;
    if (m.t > 4) return false;
    ctx.globalAlpha = 0.22 * Math.min(1, (4 - m.t) / 1.5);
    disk(ctx, Math.round(m.x), Math.round(m.y), Math.round(m.r), "#1f2a1a");
    ctx.globalAlpha = 0.3 * Math.min(1, (4 - m.t) / 1.5);
    for (let k = 0; k < 6; k++) {
      const a = k * 1.7 + m.x;
      disk(ctx, Math.round(m.x + Math.cos(a) * m.r * 0.5), Math.round(m.y + Math.sin(a) * m.r * 0.35), 2, "#141a12");
    }
    ctx.globalAlpha = 1;
    return true;
  });

  if (aim) drawZone(ctx, g, aim.card);

  for (const r of g.rubble) {
    const x = r.x * TILE;
    const y = r.y * TILE;
    const half = r.r * TILE - 4;
    ctx.fillStyle = INK;
    ctx.fillRect(Math.round(x - half), Math.round(y + half - 8), Math.round(half * 2), 9);
    ctx.fillStyle = "#857a66";
    for (let i = 0; i < 7; i++) ctx.fillRect(Math.round(x - half + 2 + ((i * 13) % (half * 2 - 6))), Math.round(y + half - 7 + (i % 3) * 2), 4, 3);
    ctx.fillStyle = TEAM[r.side].D;
    ctx.fillRect(Math.round(x - 3), Math.round(y + half - 10), 6, 2);
  }

  const lerp = (a: number, b: number) => a + (b - a) * alpha;
  // Flyers draw over everything on the ground.
  const sorted = [...g.entities].sort((a, b) => Number(a.air) - Number(b.air) || a.y - b.y);
  for (const e of sorted) {
    const x = lerp(e.px, e.x) * TILE;
    const y = lerp(e.py, e.y) * TILE;
    if (e.kind === "king" || e.kind === "princess") drawTower(ctx, e, x, y, time);
    else if (e.kind === "building") {
      const t = g.entities.find((o) => o.id === e.target);
      const angle = t ? Math.atan2(t.y - e.y, t.x - e.x) : e.side === 0 ? -Math.PI / 2 : Math.PI / 2;
      ctx.globalAlpha = e.deploy > 0 ? 0.6 : 1;
      if (e.flash > 0) ctx.filter = "brightness(2)";
      cannon(ctx, x, y, angle, TEAM[e.side], e.swing < 0.1 ? 2 : 0);
      ctx.filter = "none";
      ctx.globalAlpha = 1;
      bar(ctx, e, x, Math.round(y) - 22);
    } else drawUnit(ctx, e, x, y, time);
  }

  for (const p of g.projectiles) {
    if (p.card === "zap") continue;
    const x = lerp(p.px, p.x) * TILE;
    const y = lerp(p.py, p.y) * TILE;
    if (p.kind === "spell" && p.card === "arrows") {
      // A volley: a few arrows arcing in a loose bunch.
      const total = Math.hypot(p.tx - p.sx, p.ty - p.sy) || 1;
      const done = 1 - Math.hypot(p.tx - p.x, p.ty - p.y) / total;
      const lift = Math.sin(done * Math.PI) * 40;
      const a = Math.atan2(p.ty - p.sy, p.tx - p.sx) + (done < 0.5 ? -0.6 : 0.6) * Math.sign(p.ty - p.sy || 1);
      for (let k = 0; k < 7; k++) {
        const ox = ((k * 37) % 23) - 11;
        const oy = ((k * 53) % 19) - 9;
        const ax = Math.round(x + ox);
        const ay = Math.round(y - lift + oy);
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = i === 0 ? BONE : i > 3 ? "#e8402a" : "#8a5a3a";
          ctx.fillRect(Math.round(ax - Math.cos(a) * i), Math.round(ay - Math.sin(a) * i), 1, 1);
        }
      }
    } else if (p.kind === "spell") drawShell(ctx, v, p, x, y, dt);
    else if (p.kind === "bullet") {
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 12, 2, 2);
    } else if (p.kind === "bomb") {
      const total = Math.hypot(p.tx - p.sx, p.ty - p.sy) || 1;
      const done = Math.min(1, Math.hypot(p.x - p.sx, p.y - p.sy) / total);
      const by = Math.round(y - 10 - Math.sin(done * Math.PI) * 22);
      ctx.fillStyle = "rgba(12,11,10,0.35)";
      ctx.fillRect(Math.round(x) - 2, Math.round(y), 4, 2);
      ctx.fillStyle = INK;
      ctx.fillRect(Math.round(x) - 3, by - 2, 6, 5);
      ctx.fillRect(Math.round(x) - 2, by - 3, 4, 7);
      ctx.fillStyle = "#6b6356";
      ctx.fillRect(Math.round(x) - 1, by - 1, 1, 1);
      ctx.fillStyle = Math.floor(time * 20) % 2 ? "#ffd23f" : "#ff7a1a";
      ctx.fillRect(Math.round(x) + 1, by - 5, 1, 2);
    } else if (p.kind === "orb" || p.kind === "bolt") {
      const orb = p.kind === "orb";
      const oy = Math.round(y) - (orb ? 14 : 22);
      ctx.fillStyle = INK;
      ctx.fillRect(Math.round(x) - 2, oy - 2, 5, 5);
      ctx.fillStyle = orb ? "#ff7a1a" : "#5ec8ff";
      ctx.fillRect(Math.round(x) - 1, oy - 1, 3, 3);
      ctx.fillStyle = orb ? "#ffd23f" : BONE;
      ctx.fillRect(Math.round(x), oy - 1, 1, 1);
      if (Math.random() < 0.5) v.particles.push({ x, y: oy, vx: 0, vy: -10, life: 0.2, max: 0.2, color: orb ? "#ff7a1a" : "#9cc0ff", size: 1, gravity: 0 });
    } else {
      const a = Math.atan2(p.ty - p.y, p.tx - p.x);
      ctx.fillStyle = BONE;
      for (let i = 0; i < 4; i++) ctx.fillRect(Math.round(x - Math.cos(a) * i), Math.round(y - 12 - Math.sin(a) * i), 1, 1);
    }
  }

  v.booms = v.booms.filter((b) => {
    b.t += dt;
    const p = b.t / 0.35;
    if (p >= 1) return false;
    if (b.color) {
      ring(ctx, b.x, b.y, b.r * (0.4 + p * 0.6), b.color, 0);
      return true;
    }
    if (b.flash && p < 0.3) {
      ctx.globalAlpha = 1 - p / 0.3;
      disk(ctx, Math.round(b.x), Math.round(b.y), Math.round(b.r * (0.3 + p)), p < 0.12 ? "#fff3b0" : "#ffd23f");
      ctx.globalAlpha = 1;
    }
    ring(ctx, b.x, b.y, b.r * (0.4 + p * 0.6), p < 0.5 ? "#ffd23f" : "#ff7a1a", 0);
    ring(ctx, b.x, b.y, b.r * (0.4 + p * 0.6) - 2, "#e8402a", 3);
    return true;
  });

  v.puffs = v.puffs.filter((f) => {
    f.t += dt;
    const a = (f.t - f.delay) / f.life;
    if (a < 0) return true;
    if (a >= 1) return false;
    const r = Math.max(1, Math.round(f.r * (a < 0.25 ? 0.35 + (a / 0.25) * 0.65 : 1 - (a - 0.25) * 0.35)));
    const fx = Math.round(f.x);
    const fy = Math.round(f.y - a * 10);
    if (a < 0.62) {
      disk(ctx, fx, fy, r + 1, INK);
      disk(ctx, fx, fy, r, a < 0.12 ? "#fff3b0" : a < 0.28 ? "#ffd23f" : a < 0.45 ? "#ff7a1a" : "#e8402a");
      // A hot core that cools a step behind the rim.
      if (a < 0.45) disk(ctx, fx - 1, fy - 1, Math.max(1, r - 3), a < 0.2 ? "#fff3b0" : "#ffd23f");
    } else {
      ctx.globalAlpha = 1 - (a - 0.62) / 0.38;
      disk(ctx, fx, fy, r, a < 0.75 ? "#6b6356" : "#3f3933");
      ctx.globalAlpha = 1;
    }
    return true;
  });

  v.particles = v.particles.filter((p) => {
    p.life -= dt;
    if (p.life <= 0) return false;
    p.vy += p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.92;
    p.vy *= 0.92;
    if (p.grow) p.size += p.grow * dt;
    const age = 1 - p.life / p.max;
    ctx.globalAlpha = Math.min(1, (p.life / p.max) * (p.grow ? 0.9 : 1.5));
    ctx.fillStyle = p.colors ? p.colors[Math.min(p.colors.length - 1, Math.floor(age * p.colors.length))] : p.color;
    const sz = Math.round(p.size);
    ctx.fillRect(Math.round(p.x - sz / 2), Math.round(p.y - sz / 2), sz, sz);
    return true;
  });
  ctx.globalAlpha = 1;

  v.pops = v.pops.filter((p) => {
    p.t += dt;
    if (p.t > 0.9) return false;
    const py = Math.round(p.y - 14 - p.t * 22);
    ctx.globalAlpha = p.t > 0.6 ? 1 - (p.t - 0.6) / 0.3 : 1;
    const w = String(p.n).length * 4 + 3;
    ctx.fillStyle = INK;
    ctx.fillRect(Math.round(p.x - w / 2) + 1, py + 3, 3, 1);
    ctx.fillStyle = "#b79cff";
    ctx.fillRect(Math.round(p.x - w / 2), py + 2, 3, 1);
    number(ctx, p.n, p.x + 2, py, "#b79cff");
    ctx.globalAlpha = 1;
    return true;
  });

  v.marks = v.marks.filter((m) => {
    m.t += dt;
    if (m.t > 0.5) return false;
    ctx.globalAlpha = 1 - m.t / 0.5;
    const mx = Math.round(m.x);
    const my = Math.round(m.y);
    for (let i = -4; i <= 4; i++) {
      ctx.fillStyle = INK;
      ctx.fillRect(mx + i - 1, my + i - 1, 3, 3);
      ctx.fillRect(mx + i - 1, my - i - 1, 3, 3);
    }
    ctx.fillStyle = "#e8402a";
    for (let i = -4; i <= 4; i++) {
      ctx.fillRect(mx + i, my + i, 1, 1);
      ctx.fillRect(mx + i, my - i, 1, 1);
    }
    ctx.globalAlpha = 1;
    return true;
  });

  if (v.flash > 0) {
    v.flash = Math.max(0, v.flash - dt);
    ctx.fillStyle = `rgba(156,192,255,${v.flash * 2.5})`;
    ctx.fillRect(0, 0, W * TILE, H * TILE);
  }

  v.crowns = v.crowns.filter((c) => {
    c.t += dt;
    if (c.t > 1.4) return false;
    const s = sprite("crown", c.side);
    const scale = c.t < 0.2 ? 1 + (c.t / 0.2) * 1 : 2;
    ctx.globalAlpha = c.t > 1 ? 1 - (c.t - 1) / 0.4 : 1;
    ctx.drawImage(s.canvas, Math.round(c.x - (s.w * scale) / 2), Math.round(c.y - 20 - c.t * 24), s.w * scale, s.h * scale);
    ctx.globalAlpha = 1;
    return true;
  });

  // Butterflies wander over everything.
  for (let i = 0; i < 5; i++) {
    const bx = (W * TILE) / 2 + Math.sin(time * 0.31 + i * 2.1) * 120 + Math.sin(time * 0.9 + i) * 14;
    const by = (H * TILE) / 2 + Math.cos(time * 0.23 + i * 1.7) * 220 + Math.cos(time * 1.3 + i) * 10;
    const open = Math.floor(time * 10 + i) % 2;
    ctx.fillStyle = FLOWERS[i];
    ctx.fillRect(Math.round(bx) - 2, Math.round(by) - open, 2, 1 + open);
    ctx.fillRect(Math.round(bx) + 1, Math.round(by) - open, 2, 1 + open);
    ctx.fillStyle = INK;
    ctx.fillRect(Math.round(bx), Math.round(by) - 1, 1, 2);
  }

  if (aim?.at) {
    const gh = v.ghost;
    if (!gh || gh.card !== aim.card) v.ghost = { card: aim.card, x: aim.at[0], y: aim.at[1] };
    else {
      const k = 1 - Math.exp(-dt * 28);
      gh.x += (aim.at[0] - gh.x) * k;
      gh.y += (aim.at[1] - gh.y) * k;
    }
    drawGhost(ctx, aim.card, aim.at, [v.ghost!.x, v.ghost!.y], time);
  } else v.ghost = null;
  ctx.restore();
}
