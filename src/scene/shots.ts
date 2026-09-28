import { Color } from "three";
import { experience, roleEnd, TIMELINE_END, TIMELINE_START } from "@/content/experience";
import { homes } from "@/content/profile";
import { featured } from "@/content/projects";
import { stage, type Day, type ShotId } from "@/lib/stage";
import { ACCENT, HEAT, heatLevel } from "./palette";
import { EARTH, EARTH_H, EARTH_W } from "./earth";

type Rgb = [number, number, number];

// Instance colors are linear; three's Color converts from the sRGB hex the CSS uses.
const rgb = (hex: string): Rgb => {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
};

const C = {
  plastic: rgb("#16140f"),
  line: rgb("#2a2622"),
  dust: rgb("#3a352e"),
  stone: rgb("#6b6356"),
  bone: rgb("#eee7d7"),
  accent: rgb(ACCENT),
  deep: rgb("#1c3a82"),
  lime: rgb("#c8f03c"),
  moss: rgb("#4f6b2a"),
  coin: rgb("#ffd23f"),
  white: rgb("#f1ebdc"),
  yellow: rgb("#ffd23f"),
  red: rgb("#e8402a"),
  orange: rgb("#ff7a1a"),
  blue: rgb("#2f6bff"),
  green: rgb("#1fbf6a"),
};

const HEAT_RGB = HEAT.map(rgb);

export type Target = {
  n: number;
  pos: Float32Array;
  col: Float32Array;
  /** Per-axis scale, so bars can stretch and spare voxels can shrink to nothing. */
  scl: Float32Array;
  tag: Uint8Array;
  /** Gate, cartridge or letter index; -1 when unused. */
  group: Int16Array;
  /** Per-instance phase or seed for animators. */
  aux: Float32Array;
};

export type Pose = { x: number; y: number; z: number; rx: number; ry: number; s: number };

export type FrameCtx = {
  time: number;
  dt: number;
  local: number;
  mobile: boolean;
  reduced: boolean;
  /** Damped 0..1 hover amount per cartridge. */
  hover: Float32Array;
  /** Damped 0..1 highlight per track gate. */
  gate: Float32Array;
  /** Seconds since the last section's burst fired, or -1. */
  burstAge: number;
};

export type Shot = {
  target: Target;
  pose: (ctx: FrameCtx) => Pose;
  /** Advances any state the shot keeps. Called once per frame while the shot is on screen. */
  tick?: (ctx: FrameCtx) => void;
  /** Mutates working copies of the target in local space. */
  animate?: (ctx: FrameCtx, pos: Float32Array, col: Float32Array, scl: Float32Array) => void;
};

const TAG = { base: 0, home: 1, satellite: 2, route: 3, kerb: 4, gate: 5, label: 6, spark: 7, front: 8, star: 9 } as const;

function alloc(n: number): Target {
  return {
    n,
    pos: new Float32Array(n * 3),
    col: new Float32Array(n * 3),
    scl: new Float32Array(n * 3),
    tag: new Uint8Array(n),
    group: new Int16Array(n).fill(-1),
    aux: new Float32Array(n),
  };
}

function put(t: Target, i: number, x: number, y: number, z: number, c: Rgb, s: number | Rgb, k = 1) {
  const o = i * 3;
  t.pos[o] = x;
  t.pos[o + 1] = y;
  t.pos[o + 2] = z;
  t.col[o] = c[0] * k;
  t.col[o + 1] = c[1] * k;
  t.col[o + 2] = c[2] * k;
  if (typeof s === "number") t.scl.fill(s, o, o + 3);
  else t.scl.set(s, o);
}

// Deterministic, so reloads look the same.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Voxels a shot doesn't need hide inside random used ones, so they emerge from the shape. */
function hideRest(t: Target, from: number, seed = 7) {
  const r = rng(seed);
  for (let i = from; i < t.n; i++) {
    const j = Math.floor(r() * Math.max(1, from));
    t.pos.copyWithin(i * 3, j * 3, j * 3 + 3);
    t.col.copyWithin(i * 3, j * 3, j * 3 + 3);
    t.scl.fill(0, i * 3, i * 3 + 3);
  }
}

function spinY(pos: Float32Array, n: number, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  for (let o = 0; o < n * 3; o += 3) {
    const x = pos[o];
    const z = pos[o + 2];
    pos[o] = x * c + z * s;
    pos[o + 2] = -x * s + z * c;
  }
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const pose = (x: number, y: number, z: number, rx: number, ry: number, s: number): Pose => ({ x, y, z, rx, ry, s });

/** Row-major Rx * Ry, the orientation every shot is placed with. */
export function rotation(rx: number, ry: number) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  return [cy, 0, sy, sx * sy, cx, -sx * cy, -cx * sy, sx, cx * cy];
}

const CUBIE = 5;
const CUBE_VOX = 0.2;
const CUBE_EDGE = 3 * CUBIE;
/** Distance between cubie centers; a coordinate divided by it and rounded gives its layer. */
const PITCH = CUBIE * CUBE_VOX + 0.06;

/** A Rubik's cube: 3x3 cubies of 5x5x5 voxels, shell only. */
function buildCube(n: number): Target {
  const t = alloc(n);
  const faces = { px: C.red, nx: C.orange, py: C.white, ny: C.yellow, pz: C.green, nz: C.blue };
  // A sticker is the inner 3x3 of a cubie's outer face; its rim is black plastic.
  const rim = (a: number, b: number) => a === 0 || a === CUBIE - 1 || b === 0 || b === CUBIE - 1;
  const at = (v: number) => (Math.floor(v / CUBIE) - 1) * PITCH + ((v % CUBIE) - (CUBIE - 1) / 2) * CUBE_VOX;
  let i = 0;
  for (let x = 0; x < CUBE_EDGE; x++) {
    for (let y = 0; y < CUBE_EDGE; y++) {
      for (let z = 0; z < CUBE_EDGE; z++) {
        if (![x, y, z].some((v) => v === 0 || v === CUBE_EDGE - 1)) continue;
        const [lx, ly, lz] = [x % CUBIE, y % CUBIE, z % CUBIE];
        let c = C.plastic;
        if (x === CUBE_EDGE - 1 && !rim(ly, lz)) c = faces.px;
        else if (x === 0 && !rim(ly, lz)) c = faces.nx;
        else if (y === CUBE_EDGE - 1 && !rim(lx, lz)) c = faces.py;
        else if (y === 0 && !rim(lx, lz)) c = faces.ny;
        else if (z === CUBE_EDGE - 1 && !rim(lx, ly)) c = faces.pz;
        else if (z === 0 && !rim(lx, ly)) c = faces.nz;
        put(t, i++, at(x), at(y), at(z), c, CUBE_VOX * 0.94);
      }
    }
  }
  hideRest(t, i);
  return t;
}

type Move = { axis: 0 | 1 | 2; layer: -1 | 0 | 1; dir: 1 | -1 };

/** Turns one layer by `amount` of a quarter turn. A full turn is exact, so baked state never drifts. */
function turn(p: Float32Array, m: Move, amount: number) {
  const [i, j] = m.axis === 0 ? [1, 2] : m.axis === 1 ? [2, 0] : [0, 1];
  const full = amount === 1;
  const angle = (Math.PI / 2) * m.dir * amount;
  const c = full ? 0 : Math.cos(angle);
  const s = full ? m.dir : Math.sin(angle);
  for (let o = 0; o < p.length; o += 3) {
    if (Math.round(p[o + m.axis] / PITCH) !== m.layer) continue;
    const a = p[o + i];
    const b = p[o + j];
    p[o + i] = a * c - b * s;
    p[o + j] = a * s + b * c;
  }
}

/** Every quarter turn a 3x3 has: 3 axes, 3 layers, 2 directions. */
const MOVES: Move[] = [0, 1, 2].flatMap((axis) => [-1, 0, 1].flatMap((layer) => [1, -1].map((dir) => ({ axis, layer, dir }) as Move)));

type Queued = Move & { dur: number; solve?: boolean };

/**
 * The About cube. Idle, it scrambles itself a little and solves it back. The timer button
 * asks for a proper scramble, then a timed solve, which undoes the scramble in reverse.
 * It keeps its own clock so a button press still plays out under reduced motion.
 */
function aboutCube(n: number): Shot {
  const target = buildCube(n);
  const baked = target.pos.slice();
  const r = rng(99);
  const queue: Queued[] = [];
  let history: Move[] = [];
  let current: (Queued & { t0: number }) | null = null;
  let clock = 0;
  let idleSince = 0;
  let engaged = false;
  const cube = stage.cube;

  const scramble = (count: number, dur: number) => {
    let prev: Move | null = null;
    for (let k = 0; k < count; k++) {
      let m = MOVES[Math.floor(r() * MOVES.length)];
      while (prev && m.axis === prev.axis && m.layer === prev.layer) m = MOVES[Math.floor(r() * MOVES.length)];
      queue.push({ ...m, dur });
      prev = m;
    }
  };

  return {
    target,
    pose: (c) => (c.mobile ? pose(0, 2.2, -3, 0.5, 0.72, 0.75) : pose(4.1, 0.5, 0, 0.5, 0.72, 0.88)),
    tick(c) {
      clock += c.dt;
      // A command waits until the turn in flight lands; the fidgeting stops as soon as one arrives.
      if (cube.command) engaged = true;
      if (cube.command === "scramble" && !current && !queue.length) {
        cube.command = null;
        cube.phase = "scrambling";
        scramble(22, 0.13);
      } else if (cube.command === "solve" && cube.phase === "scrambled") {
        cube.command = null;
        queue.push(...history.reverse().map((m) => ({ ...m, dir: (m.dir * -1) as Move["dir"], dur: 0.2, solve: true })));
        history = [];
        cube.phase = "solving";
        cube.solveStart = performance.now();
      }

      if (current && clock - current.t0 >= current.dur) {
        turn(baked, current, 1);
        if (!current.solve) history.push(current);
        current = null;
        idleSince = clock;
      }
      if (current) return;
      const next = queue.shift();
      if (next) {
        current = { ...next, t0: clock };
        return;
      }
      if (cube.phase === "scrambling") cube.phase = "scrambled";
      if (cube.phase === "solving") {
        cube.phase = "solved";
        cube.solveEnd = performance.now();
      }
      // Until someone presses the button, it fidgets: a few turns, then undoes them.
      if (engaged || c.reduced) return;
      const idle = clock - idleSince;
      if (history.length && idle > 1.2) {
        queue.push(...history.reverse().map((m) => ({ ...m, dir: (m.dir * -1) as Move["dir"], dur: 0.45, solve: true })));
        history = [];
      } else if (!history.length && idle > 2.4) scramble(5, 0.45);
    },
    animate(c, pos) {
      pos.set(baked);
      if (current) turn(pos, current, ease(clamp01((clock - current.t0) / current.dur)));
      if (!c.reduced) spinY(pos, target.n, Math.sin(c.time * 0.3) * 0.25);
    },
  };
}

function shelfCube(n: number): Shot {
  const target = buildCube(n);
  return {
    target,
    pose: (c) => (c.mobile ? pose(2.6, 4.2, -3, 0.5, 0.7, 0.45) : pose(6.2, 2.2, -1, 0.5, 0.7, 0.5)),
    animate: (c, pos) => spinY(pos, target.n, c.time * 0.25),
  };
}

const GLOBE_R = 1.6;
const ROUTE_STEPS = 48;

function latLon(lat: number, lon: number, r: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
}

const G = { land: 0, home: 1, ocean: 2, route: 3, beacon: 4, satellite: 5 } as const;

/** A chunky voxel Earth: a Fibonacci sphere where land is lime, the countries Naman lived in are blue. */
function buildGlobe(n: number) {
  const t = alloc(n);
  const r = rng(7);
  const legs = homes.length - 1;
  const beaconN = homes.length * 4;
  const sphere = n - legs * (ROUTE_STEPS + 1) - beaconN - 16;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const size = Math.sqrt((4 * Math.PI) / sphere) * GLOBE_R * 0.9;
  let i = 0;

  for (; i < sphere; i++) {
    const y = 1 - ((i + 0.5) / sphere) * 2;
    const rad = Math.sqrt(1 - y * y);
    const x = Math.cos(golden * i) * rad;
    const z = Math.sin(golden * i) * rad;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    const cell = EARTH[Math.min(EARTH_H - 1, Math.floor(90 - lat)) * EARTH_W + Math.min(EARTH_W - 1, Math.floor(lon + 180))];
    const roll = r();
    t.aux[i] = r();
    if (cell === "U" || cell === "I") {
      put(t, i, x * GLOBE_R, y * GLOBE_R, z * GLOBE_R, C.accent, size * 1.05);
      t.tag[i] = G.home;
    } else if (cell === "#") {
      put(t, i, x * GLOBE_R, y * GLOBE_R, z * GLOBE_R, roll > 0.82 ? C.bone : roll > 0.68 ? C.moss : C.lime, size, 0.92);
      t.tag[i] = G.land;
    } else {
      put(t, i, x * GLOBE_R, y * GLOBE_R, z * GLOBE_R, C.line, size * 0.36, 1.5);
      t.tag[i] = G.ocean;
    }
  }

  // The route of a life so far: US, India, Singapore, Boston.
  for (let k = 0; k < legs; k++) {
    const a = latLon(homes[k].lat, homes[k].lon, 1);
    const b = latLon(homes[k + 1].lat, homes[k + 1].lon, 1);
    for (let j = 0; j <= ROUTE_STEPS; j++, i++) {
      const f = j / ROUTE_STEPS;
      const v = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
      const len = Math.hypot(v[0], v[1], v[2]) || 1;
      const lift = GLOBE_R * (1.04 + Math.sin(Math.PI * f) * 0.3);
      put(t, i, (v[0] / len) * lift, (v[1] / len) * lift, (v[2] / len) * lift, C.deep, 0.06);
      t.tag[i] = G.route;
      t.aux[i] = (k + f) / legs;
    }
  }

  // A stubby beacon on each home; Boston's is white.
  homes.forEach((h, k) => {
    for (let j = 0; j < 4; j++, i++) {
      const [x, y, z] = latLon(h.lat, h.lon, GLOBE_R * (1.03 + j * 0.05));
      put(t, i, x, y, z, h.code === "BOS" ? C.white : C.coin, 0.085 - j * 0.012);
      t.tag[i] = G.beacon;
      t.group[i] = k;
    }
  });

  // One satellite per country visited. Which 16 is never stated, so they orbit instead of pinning.
  for (let k = 0; k < 16; k++, i++) {
    put(t, i, 0, 0, 0, k % 4 ? C.bone : C.coin, 0.07);
    t.tag[i] = G.satellite;
    t.group[i] = k;
  }
  return t;
}

/**
 * The title screen. The globe drifts on its own, spins where you drag it, and turns a home to
 * face you when you point at its name. A scan line sweeps pole to pole, flashing the land it
 * crosses. The About story then peels it apart into shells; both share one spin.
 */
function globeShots(n: number): { globe: Shot; peel: Shot } {
  const t = buildGlobe(n);
  const g = stage.globe;
  let spin = (homes[0].lon * -Math.PI) / 180;
  let tilt = 0.35;
  let velocity = 0.12;
  let clock = 0;
  let lastTick = 0;

  const turnGlobe = (c: FrameCtx) => {
    // Globe and peel share this state; mid-morph both tick in the same frame, so count it once.
    const now = performance.now();
    if (now - lastTick < 2) return;
    lastTick = now;
    clock += c.dt;
    const dt = c.dt;
    if (g.dragging) {
      // Follow the pointer exactly, and remember how fast it moved for the fling.
      const d = g.dx * 0.008;
      spin += d;
      tilt = Math.max(-0.9, Math.min(1.3, tilt + g.dy * 0.006));
      velocity = dt > 0 ? d / dt : velocity;
    } else if (g.hover >= 0) {
      const goal = (-homes[g.hover].lon * Math.PI) / 180;
      spin += Math.atan2(Math.sin(goal - spin), Math.cos(goal - spin)) * (1 - Math.exp(-dt * 3));
      tilt += (0.2 + (homes[g.hover].lat * Math.PI) / 180 / 1.6 - tilt) * (1 - Math.exp(-dt * 3));
      velocity = 0;
    } else {
      // A fling coasts, then settles back into a slow drift; the tilt drifts home too.
      const drift = c.reduced ? 0 : 0.12;
      velocity += (drift - velocity) * (1 - Math.exp(-dt * 1.2));
      spin += velocity * dt;
      tilt += (0.35 - tilt) * (1 - Math.exp(-dt * 0.8));
    }
    g.dx = 0;
    g.dy = 0;
  };

  const place = (c: FrameCtx, pos: Float32Array, col: Float32Array, scl: Float32Array, peel: number) => {
    const cs = Math.cos(spin);
    const ss = Math.sin(spin);
    const scan = Math.sin(clock * 0.45) * GLOBE_R;
    const traveller = (clock * 0.16) % 1;
    const pulse = (Math.sin(clock * 3) + 1) / 2;
    for (let i = 0; i < t.n; i++) {
      const tag = t.tag[i];
      const o = i * 3;
      if (tag === G.satellite) {
        const k = t.group[i];
        const ring = k % 2;
        const ph = (k / 16) * Math.PI * 2 + clock * (0.35 + ring * 0.12) * (ring ? -1 : 1);
        const R = GLOBE_R * (1.4 + ring * 0.16 + peel * 0.5);
        const incline = ring ? 0.5 : -0.35;
        const z = Math.sin(ph) * R;
        pos[o] = Math.cos(ph) * R;
        pos[o + 1] = z * Math.sin(incline);
        pos[o + 2] = z * Math.cos(incline);
        const blink = 0.7 + ((Math.sin(clock * 3 + k * 1.7) + 1) / 2) * 0.6;
        for (let q = 0; q < 3; q++) scl[o + q] *= blink;
        continue;
      }
      let x = pos[o];
      let y = pos[o + 1];
      let z = pos[o + 2];
      if (peel) {
        // Four shells lift off at different heights and turn against each other.
        const layer = Math.floor(t.aux[i] * 4);
        const f = 1 + peel * (0.08 + layer * 0.16);
        const a = clock * 0.14 * (layer % 2 ? 1 : -1) * (1 + layer * 0.4) + layer;
        const [ca, sa] = [Math.cos(a), Math.sin(a)];
        [x, z] = [x * ca + z * sa, -x * sa + z * ca];
        x *= f;
        y *= f;
        z *= f;
      }
      pos[o] = x * cs + z * ss;
      pos[o + 1] = y;
      pos[o + 2] = -x * ss + z * cs;

      if (tag === G.land || tag === G.home) {
        // The scan line: a band of latitude that flashes yellow and lifts as it passes.
        const band = Math.max(0, 1 - Math.abs(y - scan) / 0.14) * (1 - peel);
        if (band > 0) {
          const lift = 1 + band * 0.05;
          pos[o] *= lift;
          pos[o + 1] *= lift;
          pos[o + 2] *= lift;
          for (let q = 0; q < 3; q++) col[o + q] += (C.coin[q] * 1.4 - col[o + q]) * band;
        }
        if (peel && tag === G.land) {
          const shade = Math.floor(t.aux[i] * 4) % 2 ? C.lime : C.moss;
          for (let q = 0; q < 3; q++) col[o + q] += (shade[q] - col[o + q]) * peel;
        }
      } else if (tag === G.route) {
        let d = traveller - t.aux[i];
        if (d < 0) d += 1;
        const head = d < 0.1 ? 1 - d / 0.1 : 0;
        for (let q = 0; q < 3; q++) {
          col[o + q] = C.accent[q] * 1.2 + (C.coin[q] * 1.8 - C.accent[q] * 1.2) * head;
          scl[o + q] *= (1 + head * 0.9) * (1 - peel);
        }
      } else if (tag === G.beacon) {
        const lit = g.hover === t.group[i] ? 1 : pulse * 0.4;
        for (let q = 0; q < 3; q++) {
          col[o + q] *= 1 + lit;
          scl[o + q] *= (1 + lit * 0.4) * (1 - peel);
        }
      } else if (tag === G.ocean && peel) {
        for (let q = 0; q < 3; q++) {
          col[o + q] += (C.stone[q] * 0.6 - col[o + q]) * peel;
          scl[o + q] *= 1 + peel * 1.2;
        }
      }
    }
  };

  return {
    globe: {
      target: t,
      // Short phones get a smaller globe so it clears the copy below it.
      pose: (c) =>
        c.mobile
          ? innerHeight < 720
            ? pose(0.4, 3.1, -1.5, tilt, 0, 0.82)
            : pose(0.4, 2.75, -1.5, tilt, 0, 1.05)
          : pose(4.2, -0.1, 0, tilt, 0, 1.6),
      tick: turnGlobe,
      animate: (c, pos, col, scl) => place(c, pos, col, scl, 0),
    },
    peel: {
      target: t,
      pose: (c) => (c.mobile ? pose(0, 2.4, -3, 0.5, 0, 0.9) : pose(4.6, -0.1, -1.5, 0.5, 0, 1.15)),
      tick: turnGlobe,
      animate: (c, pos, col, scl) => place(c, pos, col, scl, 1),
    },
  };
}

function trackXZ(u: number): [number, number] {
  return [
    3.3 * Math.cos(u) + 0.9 * Math.cos(2 * u + 0.6) - 0.35 * Math.cos(3 * u),
    2.0 * Math.sin(u) + 0.55 * Math.sin(2 * u) + 0.4 * Math.sin(3 * u + 1.0),
  ];
}
const trackY = (u: number) => 0.14 * Math.sin(2 * u + 0.3);

export const GATES = experience.length;
const gateU = (k: number) => ((k + 0.5) / GATES) * Math.PI * 2;

function frame(u: number) {
  const [x, z] = trackXZ(u);
  const [x2, z2] = trackXZ(u + 0.001);
  const len = Math.hypot(x2 - x, z2 - z);
  const tx = (x2 - x) / len;
  const tz = (z2 - z) / len;
  return { x, z, y: trackY(u), tx, tz, nx: -tz, nz: tx };
}

/** A street circuit with one checkpoint gate per org, lapped by a light. */
function buildTrack(n: number): Target {
  const t = alloc(n);
  const perGate = 30;
  const lanes = [-0.2, -0.1, 0, 0.1, 0.2];
  const S = Math.floor((n - GATES * perGate) / (lanes.length + 2));
  const vs = n > 2000 ? 0.075 : 0.1;
  let i = 0;

  for (let s = 0; s < S; s++) {
    const u = (s / S) * Math.PI * 2;
    const f = frame(u);
    const startLine = s < 3;
    lanes.forEach((off, li) => {
      const chequer = startLine && (s + li) % 2 === 0;
      put(t, i, f.x + f.nx * off, f.y, f.z + f.nz * off, chequer ? C.bone : C.line, vs, chequer ? 1 : 1.5);
      t.aux[i] = u;
      i++;
    });
    for (const side of [-1, 1]) {
      const red = Math.floor(s / 3) % 2 === 0;
      put(t, i, f.x + f.nx * 0.31 * side, f.y + vs * 0.3, f.z + f.nz * 0.31 * side, red ? C.red : C.bone, vs * 0.85);
      t.tag[i] = TAG.kerb;
      t.aux[i] = u;
      i++;
    }
  }

  const gv = 0.075;
  for (let k = 0; k < GATES; k++) {
    const f = frame(gateU(k));
    const cells: [number, number][] = [];
    for (let h = 0; h < 5; h++) cells.push([-0.4, h], [0.4, h]);
    for (let b = 0; b < 5; b++) cells.push([-0.4 + (b + 0.5) * 0.16, 5]);
    for (const row of [0, 1]) {
      for (const [lat, h] of cells) {
        const along = (row - 0.5) * gv;
        put(t, i, f.x + f.nx * lat + f.tx * along, f.y + (h + 0.5) * gv * 1.2, f.z + f.nz * lat + f.tz * along, C.stone, gv);
        t.tag[i] = TAG.gate;
        t.group[i] = k;
        i++;
      }
    }
  }
  hideRest(t, i);
  return t;
}

/** Rotation that brings the checkpoint for `local` progress to the front of the camera. */
function lapAngle(local: number) {
  const f = frame(gateU(Math.min(GATES - 1, Math.max(0, local * GATES - 0.5))));
  return -Math.atan2(f.x, f.z) + 0.35;
}

function track(n: number): Shot {
  const t = buildTrack(n);
  const gateColors = experience.map((o) => rgb(o.color));
  return {
    target: t,
    pose: (c) => (c.mobile ? pose(0, 2.9, -5, 1.0, lapAngle(c.local), 0.7) : pose(4.6, -0.2, -0.8, 0.95, lapAngle(c.local), 0.78)),
    animate(c, pos, col, scl) {
      const lap = (c.time * 0.25) % 1;
      for (let i = 0; i < t.n; i++) {
        const tag = t.tag[i];
        const o = i * 3;
        if (tag === TAG.gate) {
          const g = c.gate[t.group[i]];
          const base = gateColors[t.group[i]];
          const k = 0.45 + g * 1.3;
          for (let q = 0; q < 3; q++) {
            col[o + q] = base[q] * k;
            scl[o + q] *= 1 + g * 0.35;
          }
          pos[o + 1] += g * 0.12 * (1 + Math.sin(c.time * 5) * 0.3);
        } else if (scl[o] > 0) {
          let d = Math.abs(t.aux[i] / (Math.PI * 2) - lap);
          d = Math.min(d, 1 - d);
          if (d < 0.02) {
            const k = 1 + (1 - d / 0.02) * 1.6;
            col[o] *= k;
            col[o + 1] *= k;
            col[o + 2] *= k;
            pos[o + 1] += (1 - d / 0.02) * 0.06;
          }
        }
      }
    },
  };
}

const CART_RING = 3.1;
export const CARTS = featured.length;

/** One cartridge per featured project in a ring that turns with scroll, or swings the hovered one to the front. */
function carts(n: number): Shot {
  const t = alloc(n);
  const W = 9;
  const H = 11;
  const v = 0.17;
  let i = 0;
  featured.forEach((p, k) => {
    const body = rgb(p.color);
    const angle = (k / CARTS) * Math.PI * 2;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        // The clipped top-right corner every cartridge has.
        if (y >= H - 2 && x >= W - 2) continue;
        for (let d = 0; d < 2; d++) {
          const label = d === 0 && x >= 1 && x <= W - 2 && y >= 3 && y <= H - 3;
          const grip = d === 0 && y <= 1 && x % 2 === 1;
          const c = label ? (y === H - 3 ? body : C.bone) : grip ? C.plastic : body;
          const lx = (x - (W - 1) / 2) * v;
          const ly = (y - (H - 1) / 2) * v;
          const lz = CART_RING - d * v;
          put(t, i, lx * ca + lz * sa, ly, -lx * sa + lz * ca, c, v * 0.92);
          t.tag[i] = label ? TAG.label : TAG.base;
          t.group[i] = k;
          i++;
        }
      }
    }
  });
  hideRest(t, i);

  let angle = 0;
  return {
    target: t,
    pose: (c) => (c.mobile ? pose(0, 2, -6, 0.18, 0, 0.85) : pose(4.5, 0.1, -4, 0.34, 0, 1)),
    tick(c) {
      const hovered = stage.hoveredProject;
      const goal = hovered >= 0 ? -(hovered / CARTS) * Math.PI * 2 : -clamp01(c.local * 1.15) * ((CARTS - 1) / CARTS) * Math.PI * 2;
      // Take the short way round to a hovered cartridge.
      let d = goal - angle;
      if (hovered >= 0) d = Math.atan2(Math.sin(d), Math.cos(d));
      angle += d * (1 - Math.exp(-c.dt * 5));
    },
    animate(c, pos, col, scl) {
      spinY(pos, t.n, angle);
      let any = 0;
      for (let k = 0; k < CARTS; k++) any = Math.max(any, c.hover[k]);
      for (let i = 0; i < t.n; i++) {
        const k = t.group[i];
        if (k < 0) continue;
        const h = c.hover[k];
        const o = i * 3;
        pos[o + 1] += h * 0.35 + Math.sin(c.time * 1.1 + k * 0.9) * 0.05;
        const dim = 1 - (any - h) * 0.6;
        const glow = t.tag[i] === TAG.label ? 1 + h * 0.8 : 1;
        for (let q = 0; q < 3; q++) {
          col[o + q] *= dim * glow;
          scl[o + q] *= 1 + h * 0.08;
        }
      }
    },
  };
}

/** The GitHub contribution calendar as bars, one column per week. */
export function buildCity(n: number, days: Day[] | null): Shot {
  const t = alloc(n);
  const list = days ?? [];
  const step = 0.19;
  const first = list.length ? new Date(list[0][0] + "T00:00:00Z").getUTCDay() : 0;
  const weeks = Math.ceil((list.length + first) / 7);
  const levels = (count: number, cap: number) => (count === 0 ? 1 : Math.min(cap, 1 + Math.ceil(Math.sqrt(count) * 1.6)));
  // Lower the ceiling until every day fits, so a busy year never truncates the recent weeks.
  let cap = 14;
  while (cap > 2 && list.reduce((a, [, c]) => a + levels(c, cap), 0) > n) cap--;

  let i = 0;
  list.forEach(([, count], d) => {
    const k = d + first;
    const x = (Math.floor(k / 7) - weeks / 2) * step;
    const z = ((k % 7) - 3) * step;
    const heat = HEAT_RGB[heatLevel(count)];
    const h = levels(count, cap);
    for (let y = 0; y < h && i < n; y++) {
      put(t, i++, x, y * step * 0.9, z, count === 0 ? C.line : heat, count === 0 ? [step * 0.85, 0.04, step * 0.85] : step * 0.85);
    }
  });
  hideRest(t, i);
  return {
    target: t,
    pose: (c) => (c.mobile ? pose(0, 3.2, -6, 0.8, -0.3, 0.7) : pose(0.4, -2.6, -3, 0.75, -0.35, 1.1)),
  };
}

const MONO: Record<string, string[]> = {
  N: ["##...##", "###..##", "####.##", "##.####", "##..###", "##...##", "##...##"],
  R: ["######.", "##...##", "##...##", "######.", "##.##..", "##..##.", "##...##"],
};

/** NR in chunky voxels, ringed by sparks that burst when the page bottoms out. */
function monogram(n: number): Shot {
  const t = alloc(n);
  const cells: [number, number][] = [];
  ["N", "R"].forEach((ch, li) =>
    MONO[ch].forEach((row, ry) => [...row].forEach((px, rx) => px === "#" && cells.push([li * 9 + rx, 6 - ry]))),
  );
  let q = 3;
  let d = 3;
  while (cells.length * q * q * d > n * 0.45 && (q > 1 || d > 1)) {
    if (d >= q && d > 1) d--;
    else q--;
  }
  const cell = 0.27;
  const v = cell / q;
  let i = 0;
  for (const [cx, cy] of cells) {
    for (let sz = 0; sz < d; sz++) {
      for (let sy = 0; sy < q; sy++) {
        for (let sx = 0; sx < q; sx++) {
          const front = sz === 0;
          put(
            t,
            i,
            (cx - 8 + 0.5) * cell + (sx - (q - 1) / 2) * v,
            (cy - 3) * cell + (sy - (q - 1) / 2) * v,
            -sz * v,
            front ? C.bone : sz === 1 ? C.accent : C.lime,
            v * 0.96,
          );
          t.tag[i] = front ? TAG.front : TAG.base;
          t.aux[i] = cx / 16;
          i++;
        }
      }
    }
  }
  const r = rng(31);
  const sparks = [C.accent, C.lime, C.coin, C.bone];
  for (; i < n; i++) {
    const a = r() * Math.PI * 2;
    const rad = 2.7 + (r() - 0.5) * 0.9;
    put(
      t,
      i,
      Math.cos(a) * rad * 1.25,
      Math.sin(a) * rad * 0.62,
      -0.4 + (r() - 0.5) * 0.8,
      sparks[Math.floor(r() * 4)],
      0.03 + r() * 0.03,
      0.8,
    );
    t.tag[i] = TAG.spark;
    t.aux[i] = r();
  }

  return {
    target: t,
    pose: (c) =>
      c.mobile
        ? // Phones scroll the copy up into the monogram, so it rises out of the way.
          pose(0, 3.2 + Math.max(0, c.local - 0.45) * 14, -3, 0.1, Math.sin(c.time * 0.5) * 0.3, 0.75)
        : pose(5, 0.6, -0.8, 0.12, -0.25 + Math.sin(c.time * 0.5) * 0.25, 0.72),
    animate(c, pos, col, scl) {
      const age = c.burstAge;
      const burst = age >= 0 && age < 2.6 ? Math.sin(Math.PI * Math.min(1, age / 2.6)) : 0;
      const ringA = c.time * 0.1;
      const cr = Math.cos(ringA);
      const sr = Math.sin(ringA);
      for (let i = 0; i < t.n; i++) {
        const o = i * 3;
        const a = t.aux[i];
        if (t.tag[i] === TAG.spark) {
          const x = pos[o];
          const y = pos[o + 1];
          const rx = x * cr - y * sr * 0.5;
          const ry = x * sr * 0.5 + y * cr;
          const len = Math.hypot(rx, ry) || 1;
          const push = burst * (0.6 + a * 1.6);
          pos[o] = rx + (rx / len) * push;
          pos[o + 1] = ry + (ry / len) * push + burst * (1 - a) * 1.2;
          pos[o + 2] += burst * (a - 0.5) * 1.5;
          for (let k = 0; k < 3; k++) {
            scl[o + k] *= 1 + burst * 0.6;
            col[o + k] *= 1 + burst;
          }
        } else {
          // A wave runs across the letters; the burst makes them hop.
          pos[o + 1] += Math.sin(c.time * 2.2 - a * 6) * 0.035 + burst * Math.max(0, Math.sin(age * 9 - a * 4)) * 0.25;
        }
      }
    },
  };
}

/** Every role as a bar of voxels on its org's lane, laid along real time. */
function skyline(n: number): Shot {
  const t = alloc(n);
  const span = TIMELINE_END - TIMELINE_START;
  const width = 10;
  const vox = 0.2;
  const lanes = experience.length;
  let i = 0;
  experience.forEach((org, lane) => {
    const z = (lane - (lanes - 1) / 2) * 0.62;
    const color = rgb(org.color);
    org.roles.forEach((role, level) => {
      const x0 = ((role.start - TIMELINE_START) / span - 0.5) * width;
      const x1 = ((roleEnd(role) - TIMELINE_START) / span - 0.5) * width;
      for (let x = x0; x < x1 - vox * 0.5; x += vox) {
        for (let h = 0; h < 2; h++) {
          for (let d = 0; d < 2 && i < n; d++) put(t, i++, x + vox / 2, level * 0.5 + h * vox, z + d * vox, color, vox * 0.92);
        }
      }
    });
  });
  // A floor of dim tiles with brighter year lines, so the bars read as a chart.
  const years: number[] = [];
  for (let y = Math.ceil(TIMELINE_START); y <= TIMELINE_END; y++) years.push(((y - TIMELINE_START) / span - 0.5) * width);
  for (let gx = -width / 2; gx <= width / 2 && i < n; gx += 0.4) {
    for (let gz = -3; gz <= 3 && i < n; gz += 0.4) {
      const onYear = years.some((y) => Math.abs(y - gx) < 0.2);
      put(t, i++, gx, -0.25, gz, onYear ? C.bone : C.dust, onYear ? [0.1, 0.03, 0.3] : [0.06, 0.03, 0.06]);
    }
  }
  hideRest(t, i);
  return {
    target: t,
    pose: (c) => (c.mobile ? pose(0, 3.2, -8, 0.6, -0.5, 0.75) : pose(5.6, 0.4, -3, 0.5, -0.9 + c.local * 0.5, 0.62)),
  };
}

const GLYPHS: Record<string, string[]> = {
  "4": ["#..#.", "#..#.", "#..#.", "#####", "...#.", "...#.", "...#."],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
};

/** 404 over a slow starfield. */
function lost(n: number): Shot {
  const t = alloc(n);
  const px = 0.36;
  const sub = 2;
  const vox = px / sub;
  const text = "404";
  const total = text.length * 5 + text.length - 1;
  let i = 0;
  [...text].forEach((ch, gi) => {
    GLYPHS[ch].forEach((row, ry) =>
      [...row].forEach((on, rx) => {
        if (on !== "#") return;
        for (let a = 0; a < sub; a++)
          for (let b = 0; b < sub; b++)
            for (let d = 0; d < 3; d++)
              put(
                t,
                i++,
                (gi * 6 + rx - total / 2) * px + a * vox,
                (3.5 - ry) * px - b * vox,
                -d * vox,
                d === 0 ? C.accent : C.plastic,
                vox * 0.92,
              );
      }),
    );
  });
  const r = rng(9);
  for (; i < n; i++) {
    const a = r() * Math.PI * 2;
    const u = r() * 2 - 1;
    const rad = 6 + r() * 9;
    const q = Math.sqrt(1 - u * u);
    const tint = r();
    put(
      t,
      i,
      Math.cos(a) * q * rad,
      u * rad * 0.6,
      Math.sin(a) * q * rad - 6,
      tint > 0.95 ? C.accent : tint > 0.75 ? C.stone : C.dust,
      0.02 + r() * 0.04,
    );
    t.tag[i] = TAG.star;
  }
  return {
    target: t,
    pose: (c) => (c.mobile ? pose(0, 2.4, -3, 0.1, 0.3, 0.8) : pose(1.5, 2.3, -1, 0.1, 0.3, 1.05)),
    animate(c, pos) {
      const a = c.time * 0.03;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      for (let i = 0; i < t.n; i++) {
        if (t.tag[i] !== TAG.star) continue;
        const o = i * 3;
        const x = pos[o];
        const z = pos[o + 2];
        pos[o] = x * ca + z * sa;
        pos[o + 2] = -x * sa + z * ca;
      }
    },
  };
}

export function buildShots(n: number): Omit<Record<ShotId, Shot>, "city"> {
  return {
    ...globeShots(n),
    cube: aboutCube(n),
    track: track(n),
    carts: carts(n),
    monogram: monogram(n),
    skyline: skyline(n),
    shelf: shelfCube(n),
    lost: lost(n),
  };
}
