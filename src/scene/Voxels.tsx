"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { DynamicDrawUsage, InstancedBufferAttribute, type InstancedMesh } from "three";
import { stage, useStage } from "@/lib/stage";
import { buildCity, buildShots, CARTS, GATES, rotation, type FrameCtx, type Shot } from "./shots";

/** A shot placed in the world. `rot` is its row-major 3x3 orientation, which every voxel shares. */
type Buf = { pos: Float32Array; col: Float32Array; scl: Float32Array; rot: Float32Array };

const makeBuf = (n: number): Buf => ({
  pos: new Float32Array(n * 3),
  col: new Float32Array(n * 3),
  scl: new Float32Array(n * 3),
  rot: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
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
  const r = out.rot;
  r.set(rotation(p.rx + tiltX, p.ry + tiltY));
  const pos = out.pos;
  for (let o = 0; o < t.n * 3; o += 3) {
    const x = pos[o] * p.s;
    const y = pos[o + 1] * p.s;
    const z = pos[o + 2] * p.s;
    pos[o] = r[0] * x + r[2] * z + p.x;
    pos[o + 1] = r[3] * x + r[4] * y + r[5] * z + p.y;
    pos[o + 2] = r[6] * x + r[7] * y + r[8] * z + p.z;
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
    rot: new Float32Array(9),
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
        S.snap.rot.set(S.out.rot);
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

    const ia = Math.floor(S.pos);
    const ib = Math.min(last, ia + 1);
    const mix = S.pos - ia;
    const A = shots[list[ia]];
    const B = shots[list[ib]];
    // Neighbouring sections can share a shot (the globe spans the title and the bio); it just stays.
    const morphing = A !== B && mix > 1e-4;
    // Each shot reads the scroll progress of its own section, so neither jumps mid-morph.
    const ctx = (i: number): FrameCtx => ({
      time: S.time,
      dt,
      local: stage.locals[i] ?? 0,
      mobile,
      reduced,
      hover: S.hover,
      gate: S.gate,
      burstAge: stage.burst && !reduced ? (performance.now() - stage.burst) / 1000 : -1,
    });
    const ca = ctx(ia);
    A.tick?.(ca);
    place(A, ca, S.a, S.tiltX, S.tiltY);
    if (morphing) {
      const cb = ctx(ib);
      B.tick?.(cb);
      place(B, cb, S.b, S.tiltX, S.tiltY);
    }

    // Reduced motion still follows the page, but voxels slide straight between shots instead of flying.
    const snapK = reduced ? 1 : (S.time - S.snapAt) / 1.6;
    const fromSnap = snapK < 1;
    const flight = reduced ? 0 : 1;

    const mat = m.instanceMatrix.array as Float32Array;
    const colAttr = m.instanceColor.array as Float32Array;
    const { a, b, out, seed, snap } = S;
    const R = S.rot;

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
      R.set(a.rot);
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
        for (let k = 0; k < 9; k++) R[k] += (b.rot[k] - R[k]) * mi;
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
        for (let k = 0; k < 9; k++) R[k] = snap.rot[k] + (R[k] - snap.rot[k]) * mi;
        arc = Math.max(arc, Math.sin(Math.PI * mi));
      }

      // In transit, each voxel swings out on its own arc and tumbles.
      if (arc > 0) {
        const swing = arc * (0.5 + delay * 0.9);
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

      // Column-major T * R * Rt * S, where the tumble Rt = Ry(ang) * Rx(0.7 ang). Blending two
      // orientations mid-morph skews the matrix a little, which the tumble hides.
      const ang = arc * seed[i * 5 + 4] * Math.PI;
      const tc = Math.cos(ang);
      const ts = Math.sin(ang);
      const uc = Math.cos(ang * 0.7);
      const us = Math.sin(ang * 0.7);
      const e = i * 16;
      // Rt's columns, each scaled by its axis.
      const c0x = tc * sx,
        c0y = 0,
        c0z = -ts * sx;
      const c1x = ts * us * sy,
        c1y = uc * sy,
        c1z = tc * us * sy;
      const c2x = ts * uc * sz,
        c2y = -us * sz,
        c2z = tc * uc * sz;
      mat[e] = R[0] * c0x + R[1] * c0y + R[2] * c0z;
      mat[e + 1] = R[3] * c0x + R[4] * c0y + R[5] * c0z;
      mat[e + 2] = R[6] * c0x + R[7] * c0y + R[8] * c0z;
      mat[e + 3] = 0;
      mat[e + 4] = R[0] * c1x + R[1] * c1y + R[2] * c1z;
      mat[e + 5] = R[3] * c1x + R[4] * c1y + R[5] * c1z;
      mat[e + 6] = R[6] * c1x + R[7] * c1y + R[8] * c1z;
      mat[e + 7] = 0;
      mat[e + 8] = R[0] * c2x + R[1] * c2y + R[2] * c2z;
      mat[e + 9] = R[3] * c2x + R[4] * c2y + R[5] * c2z;
      mat[e + 10] = R[6] * c2x + R[7] * c2y + R[8] * c2z;
      mat[e + 11] = 0;
      mat[e + 12] = px;
      mat[e + 13] = py;
      mat[e + 14] = pz;
      mat[e + 15] = 1;

      colAttr[o] = cr;
      colAttr[o + 1] = cg;
      colAttr[o + 2] = cb;
    }
    // The snapshot for the next page change takes the orientation the scene is showing now.
    out.rot.set(a.rot);
    if (morphing && mix > 0.5) out.rot.set(b.rot);
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
