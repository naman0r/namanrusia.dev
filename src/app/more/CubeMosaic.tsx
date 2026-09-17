"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Window from "./Window";

export default function CubeMosaic({ src, label }: { src: string; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading mosaic...");

  useEffect(() => {
    const container = host.current!;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("This browser could not display the mosaic.");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 6, -6, 0.1, 100);
    camera.position.set(0, 0, 22);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9b9eab, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(-3, 8, 12);
    scene.add(light);
    const disposeModel = (root: THREE.Object3D) => root.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    new GLTFLoader().load(src, (gltf) => {
      if (disposed) { disposeModel(gltf.scene); return; }
      scene.add(gltf.scene);
      renderer.render(scene, camera);
      setStatus("");
    }, undefined, () => {
      if (!disposed) setStatus("The mosaic could not load. Refresh to try again.");
    });
    const resize = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      const aspect = width / height;
      const halfHeight = Math.max(5.12, 5.12 / aspect);
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    });
    resize.observe(container);
    return () => {
      disposed = true;
      resize.disconnect();
      disposeModel(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src]);

  return (
    <Window className="touch-none select-none">
      <div ref={host} className="pointer-events-none relative aspect-square w-full overflow-hidden" role="img" aria-label={label} />
      {status && <span role="status" className="sr-only">{status}</span>}
    </Window>
  );
}
