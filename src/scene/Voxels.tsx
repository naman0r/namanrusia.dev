"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { DynamicDrawUsage, InstancedBufferAttribute, type InstancedMesh } from "three";
import { stage, useStage } from "@/lib/stage";
import { buildCity, buildShots, CARTS, GATES, type FrameCtx, type Shot } from "./shots";

type Buf = { pos: Float32Array; col: Float32Array; scl: Float32Array };

const makeBuf = (n: number): Buf => ({
  pos: new Float32Array(n * 3),
  col: new Float32Array(n * 3),
  scl: new Float32Array(n * 3),
});

// Share of a morph spent waiting on each voxel's own delay; the rest is travel.
const STAGGER = 0.55;

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Local target to world, with the shot's pose and the cursor tilt baked in. */
function place(shot: Shot, ctx: FrameCtx, out: Buf, tiltX: number, tiltY: number) {
  const t = shot.target;
  out.pos.set(t.pos);
  out.col.set(t.col);
  out.scl.set(t.scl);
  shot.animate?.(ctx, out.pos, out.col, out.scl);

  const p = shot.pose(ctx);
  const cx = Math.cos(p.rx + tiltX);
  const sx = Math.sin(p.rx + tiltX);
  const cy = Math.cos(p.ry + tiltY);
  const sy = Math.sin(p.ry + tiltY);
  // R = Rx * Ry
  const r00 = cy,
    r02 = sy;
  const r10 = sx * sy,
    r11 = cx,
    r12 = -sx * cy;
  const r20 = -cx * sy,
    r21 = sx,
    r22 = cx * cy;
  const pos = out.pos;
  for (let o = 0; o < t.n * 3; o += 3) {
    const x = pos[o] * p.s;
    const y = pos[o + 1] * p.s;
    const z = pos[o + 2] * p.s;
    pos[o] = r00 * x + r02 * z + p.x;
    pos[o + 1] = r10 * x + r11 * y + r12 * z + p.y;
    pos[o + 2] = r20 * x + r21 * y + r22 * z + p.z;
    out.scl[o] *= p.s;
    out.scl[o + 1] *= p.s;
    out.scl[o + 2] *= p.s;
  }
}

function makeSim(count: number) {
  // Per voxel: delay, a unit direction to swing out along, and a tumble amount.
  const seed = new Float32Array(count * 5);
  let a = 1234567;
  const rnd = () => {
    a = (a * 16807) % 2147483647;
    return a / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    seed[i * 5] = rnd();
    const th = rnd() * Math.PI * 2;
    const ph = Math.acos(2 * rnd() - 1);
    seed[i * 5 + 1] = Math.sin(ph) * Math.cos(th);
    seed[i * 5 + 2] = Math.cos(ph);
    seed[i * 5 + 3] = Math.sin(ph) * Math.sin(th);
    seed[i * 5 + 4] = (rnd() - 0.5) * 2;
  }
  return {
    count,
    seed,
    a: makeBuf(count),
    b: makeBuf(count),
    out: makeBuf(count),
    snap: makeBuf(count),
    snapAt: -10,
    key: "",
    time: 0,
    pos: 0,
    tiltX: 0,
    tiltY: 0,
    hover: new Float32Array(CARTS),
    gate: new Float32Array(GATES),
  };
}

export function Voxels({ count, mobile, reduced }: { count: number; mobile: boolean; reduced: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const { days } = useStage();
  const base = useMemo(() => buildShots(count), [count]);
  const shots = useMemo(() => ({ ...base, city: buildCity(count, days) }), [base, count, days]);
  const sim = useRef<ReturnType<typeof makeSim> | null>(null);

  useLayoutEffect(() => {
    const m = mesh.current!;
    m.instanceMatrix.setUsage(DynamicDrawUsage);
    m.instanceColor = new InstancedBufferAttribute(new Float32Array(count * 3), 3);
    m.instanceColor.setUsage(DynamicDrawUsage);
  }, [count]);

  useFrame((_, rawDt) => {
    const m = mesh.current;
    if (!m?.instanceColor) return;
    const dt = Math.min(rawDt, 1 / 20);
    if (sim.current?.count !== count) sim.current = makeSim(count);
    const S = sim.current;
    S.time += reduced ? 0 : dt;

    const list = stage.shots;
    const key = list.join(",");
    if (key !== S.key) {
      // A new page: freeze what's on screen and morph from it instead of jump-cutting.
      if (S.key) {
        S.snap.pos.set(S.out.pos);
        S.snap.col.set(S.out.col);
        S.snap.scl.set(S.out.scl);
        S.snapAt = S.time;
      }
      S.key = key;
      S.pos = stage.position;
    }

    const last = list.length - 1;
    const goal = Math.min(last, Math.max(0, stage.position));
    S.pos += (goal - S.pos) * (1 - Math.exp(-dt * 5));
    if (Math.abs(goal - S.pos) < 1e-4) S.pos = goal;

    const k8 = 1 - Math.exp(-dt * 8);
    for (let c = 0; c < CARTS; c++) S.hover[c] += ((stage.hoveredProject === c ? 1 : 0) - S.hover[c]) * k8;
    for (let g = 0; g < GATES; g++) S.gate[g] += ((stage.activeCheckpoint === g ? 1 : 0) - S.gate[g]) * k8;
    const k3 = reduced ? 0 : 1 - Math.exp(-dt * 3);
    S.tiltX += (stage.pointer.y * 0.12 - S.tiltX) * k3;
    S.tiltY += (stage.pointer.x * 0.22 - S.tiltY) * k3;

    const ctx: FrameCtx = {
      time: S.time,
      dt,
      local: stage.local,
      mobile,
      reduced,
      hover: S.hover,
      gate: S.gate,
      burstAge: stage.burst ? (performance.now() - stage.burst) / 1000 : -1,
    };

    const ia = Math.floor(S.pos);
    const ib = Math.min(last, ia + 1);
    const mix = S.pos - ia;
    const morphing = ib !== ia && mix > 1e-4;
    const A = shots[list[ia]];
    const B = shots[list[ib]];
    A.tick?.(ctx);
    if (morphing) B.tick?.(ctx);
    place(A, ctx, S.a, S.tiltX, S.tiltY);
    if (morphing) place(B, ctx, S.b, S.tiltX, S.tiltY);

    // Reduced motion still follows the page, but voxels slide straight between shots instead of flying.
    const snapK = reduced ? 1 : (S.time - S.snapAt) / 1.6;
    const fromSnap = snapK < 1;
    const flight = reduced ? 0 : 1;

    const mat = m.instanceMatrix.array as Float32Array;
    const colAttr = m.instanceColor.array as Float32Array;
    const { a, b, out, seed, snap } = S;

    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const delay = seed[i * 5];
      let px = a.pos[o];
      let py = a.pos[o + 1];
      let pz = a.pos[o + 2];
      let cr = a.col[o];
      let cg = a.col[o + 1];
      let cb = a.col[o + 2];
      let sx = a.scl[o];
      let sy = a.scl[o + 1];
      let sz = a.scl[o + 2];
      let arc = 0;

      if (morphing) {
        const mi = smooth((mix - delay * STAGGER) / (1 - STAGGER));
        px += (b.pos[o] - px) * mi;
        py += (b.pos[o + 1] - py) * mi;
        pz += (b.pos[o + 2] - pz) * mi;
        cr += (b.col[o] - cr) * mi;
        cg += (b.col[o + 1] - cg) * mi;
        cb += (b.col[o + 2] - cb) * mi;
        sx += (b.scl[o] - sx) * mi;
        sy += (b.scl[o + 1] - sy) * mi;
        sz += (b.scl[o + 2] - sz) * mi;
        arc = Math.sin(Math.PI * mi) * flight;
      }
      if (fromSnap) {
        const mi = smooth((snapK - delay * STAGGER) / (1 - STAGGER));
        px = snap.pos[o] + (px - snap.pos[o]) * mi;
        py = snap.pos[o + 1] + (py - snap.pos[o + 1]) * mi;
        pz = snap.pos[o + 2] + (pz - snap.pos[o + 2]) * mi;
        cr = snap.col[o] + (cr - snap.col[o]) * mi;
        cg = snap.col[o + 1] + (cg - snap.col[o + 1]) * mi;
        cb = snap.col[o + 2] + (cb - snap.col[o + 2]) * mi;
        sx = snap.scl[o] + (sx - snap.scl[o]) * mi;
        sy = snap.scl[o + 1] + (sy - snap.scl[o + 1]) * mi;
        sz = snap.scl[o + 2] + (sz - snap.scl[o + 2]) * mi;
        arc = Math.max(arc, Math.sin(Math.PI * mi));
      }

      // In transit, each voxel swings out on its own arc and tumbles.
      if (arc > 0) {
        const swing = arc * (0.8 + delay * 1.4);
        px += seed[i * 5 + 1] * swing;
        py += seed[i * 5 + 2] * swing;
        pz += seed[i * 5 + 3] * swing;
      }

      out.pos[o] = px;
      out.pos[o + 1] = py;
      out.pos[o + 2] = pz;
      out.col[o] = cr;
      out.col[o + 1] = cg;
      out.col[o + 2] = cb;
      out.scl[o] = sx;
      out.scl[o + 1] = sy;
      out.scl[o + 2] = sz;

      // Column-major T * R * S, with R = Ry(ang) * Rx(0.7 ang).
      const e = i * 16;
      const ang = arc * seed[i * 5 + 4] * Math.PI;
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const cb2 = Math.cos(ang * 0.7);
      const sb = Math.sin(ang * 0.7);
      mat[e] = ca * sx;
      mat[e + 1] = 0;
      mat[e + 2] = -sa * sx;
      mat[e + 3] = 0;
      mat[e + 4] = sa * sb * sy;
      mat[e + 5] = cb2 * sy;
      mat[e + 6] = ca * sb * sy;
      mat[e + 7] = 0;
      mat[e + 8] = sa * cb2 * sz;
      mat[e + 9] = -sb * sz;
      mat[e + 10] = ca * cb2 * sz;
      mat[e + 11] = 0;
      mat[e + 12] = px;
      mat[e + 13] = py;
      mat[e + 14] = pz;
      mat[e + 15] = 1;

      colAttr[o] = cr;
      colAttr[o + 1] = cg;
      colAttr[o + 2] = cb;
    }
    m.instanceMatrix.needsUpdate = true;
    m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry />
      <meshStandardMaterial roughness={0.8} metalness={0} />
    </instancedMesh>
  );
}
