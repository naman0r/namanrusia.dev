"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Window from "./Window";
import { motion } from "framer-motion";
import CubeMosaic from "./CubeMosaic";

type Axis = "x" | "y" | "z";
type Move = { axis: Axis; layer: number; direction: number };
const axes: Axis[] = ["x", "y", "z"];
const faces: Record<string, Move> = {
  U: { axis: "y", layer: 1, direction: -1 },
  D: { axis: "y", layer: -1, direction: 1 },
  L: { axis: "x", layer: -1, direction: 1 },
  R: { axis: "x", layer: 1, direction: -1 },
  F: { axis: "z", layer: 1, direction: -1 },
  B: { axis: "z", layer: -1, direction: 1 },
};

export default function RubiksCube() {
  const host = useRef<HTMLDivElement>(null);
  const command = useRef<(action: string, reverse?: boolean) => void>(() => {});
  const [status, setStatus] = useState("loading cube...");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const container = host.current!;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("This browser could not start 3D graphics. Try another browser.");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cube = new THREE.Group();
    scene.add(cube);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(6, 5, 7);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9b9eab, 2.8));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(3, 6, 5);
    scene.add(light);
    const rim = new THREE.DirectionalLight(0xdde8ff, 1.6);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    let pieces: THREE.Object3D[] = [];
    const homes = new Map<THREE.Object3D, { position: THREE.Vector3; quaternion: THREE.Quaternion }>();
    const history: Move[] = [];
    const queue: { move: Move; record: boolean }[] = [];
    let active: { pivot: THREE.Group; move: Move; start: number } | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 1 : 180;
    const disposeModel = (root: THREE.Object3D) => root.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    const solved = () => {
      const directions = new Map<string, THREE.Vector3>();
      return pieces.every((piece) => {
        const home = homes.get(piece)!;
        const rotation = piece.quaternion.clone().multiply(home.quaternion.clone().invert());
        return axes.every((axis) => {
          const sign = Math.round(home.position[axis]);
          if (!sign) return true;
          const normal = new THREE.Vector3();
          normal[axis] = sign;
          normal.applyQuaternion(rotation).round();
          const key = `${axis}${sign}`;
          if (!directions.has(key)) directions.set(key, normal);
          return directions.get(key)!.equals(normal);
        });
      });
    };
    const updateStatus = () => {
      setMoves(history.length);
      setStatus(solved() ? "solved. give it a shuffle." : "your move.");
    };
    new GLTFLoader().load("/more/rubiks-cube.glb", (gltf) => {
      if (disposed) { disposeModel(gltf.scene); return; }
      pieces = gltf.scene.children.filter((object) => object.name.startsWith("Cubie_"));
      pieces.forEach((piece) => {
        cube.add(piece);
        homes.set(piece, { position: piece.position.clone(), quaternion: piece.quaternion.clone() });
      });
      setReady(true);
      updateStatus();
    }, undefined, () => {
      if (!disposed) setStatus("The cube could not load. Refresh to try again.");
    });
    const turn = (move: Move, record = true) => queue.push({ move, record });
    command.current = (action, invert = false) => {
      if (!pieces.length || active || queue.length) return;
      if (action === "reset") {
        pieces.forEach((piece) => {
          const home = homes.get(piece)!;
          piece.position.copy(home.position);
          piece.quaternion.copy(home.quaternion);
        });
        history.length = 0;
        camera.position.set(6, 5, 7);
        controls.target.set(0, 0, 0);
        controls.update();
        updateStatus();
      } else if (action === "undo") {
        const move = history.pop();
        if (move) turn({ ...move, direction: -move.direction }, false);
      } else if (action === "scramble") {
        let previous = "";
        for (let i = 0; i < 20; i++) {
          const options = Object.keys(faces).filter((face) => face !== previous);
          const face = options[Math.floor(Math.random() * options.length)];
          previous = face;
          turn({ ...faces[face], direction: Math.random() < 0.5 ? 1 : -1 });
        }
      } else if (faces[action]) {
        turn({ ...faces[action], direction: faces[action].direction * (invert ? -1 : 1) });
      }
    };

    const raycaster = new THREE.Raycaster();
    let drag: { x: number; y: number; point: THREE.Vector3; normal: THREE.Vector3; piece: THREE.Object3D } | null = null;
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || active || queue.length) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2(
        (event.clientX - rect.left) / rect.width * 2 - 1,
        -(event.clientY - rect.top) / rect.height * 2 + 1,
      ), camera);
      const hit = raycaster.intersectObjects(pieces, true)[0];
      if (!hit?.face) return;
      let piece = hit.object;
      while (piece.parent && piece.parent !== cube) piece = piece.parent;
      const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
      const axis = axes.reduce((a, b) => Math.abs(normal[a]) > Math.abs(normal[b]) ? a : b);
      normal.set(0, 0, 0)[axis] = Math.sign(hit.point[axis]);
      drag = { x: event.clientX, y: event.clientY, point: hit.point.clone(), normal, piece };
      controls.enabled = false;
      renderer.domElement.setPointerCapture(event.pointerId);
      event.stopImmediatePropagation();
    };
    const pointerMove = (event: PointerEvent) => {
      if (!drag) return;
      const delta = new THREE.Vector2(event.clientX - drag.x, event.clientY - drag.y);
      if (delta.length() < 14) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const start = drag.point.clone().project(camera);
      let best: { axis: Axis; score: number; direction: number } | null = null;
      for (const axis of axes) {
        if (Math.abs(drag.normal[axis]) > 0.5) continue;
        const unit = new THREE.Vector3(); unit[axis] = 1;
        const tangent = unit.cross(drag.normal);
        const end = drag.point.clone().add(tangent).project(camera);
        const screen = new THREE.Vector2((end.x - start.x) * rect.width, -(end.y - start.y) * rect.height).normalize();
        const dot = screen.dot(delta.clone().normalize());
        if (!best || Math.abs(dot) > best.score) best = { axis, score: Math.abs(dot), direction: Math.sign(dot) };
      }
      if (best) turn({ axis: best.axis, layer: Math.round(drag.piece.position[best.axis]), direction: best.direction });
      drag = null;
    };
    const pointerUp = () => { drag = null; controls.enabled = true; };
    renderer.domElement.addEventListener("pointerdown", pointerDown, true);
    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointercancel", pointerUp);
    const resize = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resize.observe(container);
    renderer.setAnimationLoop((time) => {
      if (!active && queue.length) {
        const { move, record } = queue.shift()!;
        const pivot = new THREE.Group();
        cube.add(pivot);
        cube.updateMatrixWorld(true);
        pieces.filter((piece) => Math.round(piece.position[move.axis]) === move.layer).forEach((piece) => pivot.attach(piece));
        if (record) history.push(move);
        active = { pivot, move, start: time };
        setBusy(true);
      }
      if (active) {
        const progress = Math.min(1, (time - active.start) / duration);
        active.pivot.rotation[active.move.axis] = active.move.direction * Math.PI / 2 * (1 - Math.pow(1 - progress, 3));
        if (progress === 1) {
          active.pivot.updateMatrixWorld(true);
          [...active.pivot.children].forEach((piece) => {
            cube.attach(piece);
            piece.position.round();
            piece.quaternion.normalize();
          });
          cube.remove(active.pivot);
          active = null;
          if (!queue.length) { setBusy(false); updateStatus(); }
        }
      }
      controls.update();
      renderer.render(scene, camera);
    });
    return () => {
      disposed = true;
      command.current = () => {};
      resize.disconnect();
      renderer.setAnimationLoop(null);
      renderer.domElement.removeEventListener("pointerdown", pointerDown, true);
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      renderer.domElement.removeEventListener("pointercancel", pointerUp);
      controls.dispose();
      disposeModel(cube);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const buttonClass = "rounded-md border border-ink/15 bg-desk px-3 py-2 text-[12px] text-ink/75 shadow-sm transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <section id="cube" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-16">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-[12px] tracking-wide text-ink/55">a little distraction</h2>
        <span className="text-[11px] text-ink/35">go on, mess it up.</span>
      </div>
      <div className="grid grid-cols-2 items-center gap-4 lg:grid-cols-[160px_minmax(0,1fr)_160px] lg:gap-8">
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.03 }}
          className="relative z-20 w-32 cursor-grab touch-none active:cursor-grabbing sm:w-40"
        >
          <CubeMosaic src="/more/mona-lisa-mosaic.glb" label="Mona Lisa mosaic made from 100 Rubik's cubes." />
        </motion.div>
        <Window title="rubik's cube" className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <div className="relative bg-desk">
            <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex justify-between px-5 text-[11px] text-ink/45">
              <span role="status">{busy ? "turning..." : status}</span>
              <span>{moves} moves</span>
            </div>
            <div ref={host} className="h-[360px] cursor-grab touch-none active:cursor-grabbing sm:h-[420px]" role="img" aria-label="Interactive Rubik's cube. Drag a sticker to turn its layer, or use the face buttons below." />
            <div className="px-5 pb-6 text-center">
              <p className="mb-5 text-[11px] text-ink/45">drag a sticker to turn a layer · drag around the cube to rotate</p>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(faces).map((face) => (
                  <button key={face} className={buttonClass + " min-w-9 font-mono"} disabled={!ready || busy} aria-label={`Turn ${ { U: "top", D: "bottom", L: "left", R: "right", F: "front", B: "back" }[face]} face${reverse ? " counterclockwise" : " clockwise"}`} onClick={() => command.current(face, reverse)}>{face}{reverse ? "′" : ""}</button>
                ))}
                <button className={buttonClass} aria-pressed={reverse} onClick={() => setReverse(!reverse)}>reverse {reverse ? "on" : "off"}</button>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <button className={buttonClass + " !bg-[#1d6ee5] !text-white"} disabled={!ready || busy} onClick={() => command.current("scramble")}>scramble</button>
                <button className={buttonClass} disabled={!ready || busy || !moves} onClick={() => command.current("undo")}>undo</button>
                <button className={buttonClass} disabled={!ready || busy} onClick={() => command.current("reset")}>reset</button>
              </div>
            </div>
          </div>
        </Window>
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.03 }}
          className="relative z-20 col-start-2 row-start-1 w-32 cursor-grab touch-none justify-self-end active:cursor-grabbing sm:w-40 lg:col-start-3"
        >
          <CubeMosaic src="/more/naman-mosaic.glb" label="Naman Rusia spelled in a Rubik's cube mosaic." />
        </motion.div>
      </div>
    </section>
  );
}
