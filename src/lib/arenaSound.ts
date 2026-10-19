/** Bridge Brawl's sound effects, synthesized with Web Audio so there are no files to load. */

let ctx: AudioContext | null = null;
let muted = true;
let lastHit = 0;

/** Browsers only allow audio after a gesture, so call this from a click before the first sound. */
export function unlockSound() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

export function setMuted(m: boolean) {
  muted = m;
}

function tone(freq: number, dur: number, { type = "square", vol = 0.04, slide = 0, delay = 0 }: { type?: OscillatorType; vol?: number; slide?: number; delay?: number } = {}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
}

function noise(dur: number, vol = 0.08, delay = 0) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + delay;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  gain.gain.value = vol;
  src.connect(gain).connect(ctx.destination);
  src.start(t);
}

export const sfx = {
  select: () => tone(660, 0.05, { vol: 0.025 }),
  deploy: () => {
    tone(330, 0.08, { slide: 2 });
    tone(520, 0.06, { delay: 0.05, vol: 0.03 });
  },
  nope: () => tone(160, 0.12, { type: "sawtooth", vol: 0.03, slide: 0.7 }),
  // Swarms land dozens of hits a second; one tick per 70ms is plenty.
  hit: () => {
    if (!ctx || ctx.currentTime - lastHit < 0.07) return;
    lastHit = ctx.currentTime;
    tone(220 + Math.random() * 80, 0.04, { type: "triangle", vol: 0.03, slide: 0.5 });
  },
  boom: () => {
    noise(0.35, 0.12);
    tone(110, 0.3, { type: "sawtooth", vol: 0.05, slide: 0.4 });
  },
  blast: () => {
    noise(0.7, 0.16);
    tone(80, 0.6, { type: "sawtooth", vol: 0.06, slide: 0.35 });
  },
  zap: () => {
    noise(0.12, 0.06);
    tone(1400, 0.12, { type: "sawtooth", vol: 0.03, slide: 0.3 });
  },
  tower: () => {
    noise(0.6, 0.14);
    [392, 523, 659].forEach((f, i) => tone(f, 0.18, { delay: 0.15 + i * 0.09 }));
  },
  tick: () => tone(440, 0.08, { vol: 0.04 }),
  go: () => tone(880, 0.25, { vol: 0.05 }),
  double: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, { delay: i * 0.07, vol: 0.035 })),
  win: () => [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, 0.16, { delay: i * 0.11 })),
  lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.22, { delay: i * 0.16, type: "triangle", vol: 0.05 })),
};
