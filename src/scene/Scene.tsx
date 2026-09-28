"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useState } from "react";
import { prefersReducedMotion } from "@/lib/stage";
import { DitherEffect } from "./DitherEffect";
import { ACCENT } from "./palette";
import { Voxels } from "./Voxels";

export default function Scene() {
  const dither = useMemo(() => new DitherEffect(7), []);
  const [visible, setVisible] = useState(true);
  const [env] = useState(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    return { mobile, reduced: prefersReducedMotion(), count: mobile || weak ? 2200 : 5200 };
  });

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      flat
      // Half resolution, upscaled with nearest-neighbour: the pixels are the look, and a quarter of the fill cost.
      dpr={0.5}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 12], fov: 40 }}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => gl.setClearColor("#0c0b0a")}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 6]} intensity={2.4} />
      <directionalLight position={[-6, -3, -4]} intensity={1.2} color={ACCENT} />
      <Voxels count={env.count} mobile={env.mobile} reduced={env.reduced} />
      <EffectComposer multisampling={0}>
        <primitive object={dither} dispose={null} />
      </EffectComposer>
    </Canvas>
  );
}
