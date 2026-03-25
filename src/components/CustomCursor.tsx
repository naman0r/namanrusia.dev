"use client";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  // Dot: fast, snappy spring
  const dx = useSpring(mx, { stiffness: 1200, damping: 60, mass: 0.1 });
  const dy = useSpring(my, { stiffness: 1200, damping: 60, mass: 0.1 });

  // Ring: slower, trailing spring
  const rx = useSpring(mx, { stiffness: 180, damping: 20, mass: 0.8 });
  const ry = useSpring(my, { stiffness: 180, damping: 20, mass: 0.8 });

  // Center the dot (10px → -5px offset) and ring (40px → -20px offset)
  const dotX = useTransform(dx, (v) => v - 5);
  const dotY = useTransform(dy, (v) => v - 5);
  const ringX = useTransform(rx, (v) => v - 20);
  const ringY = useTransform(ry, (v) => v - 20);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const el = e.target as Element;
      setIsPointer(
        !!el.closest(
          'a, button, [role="button"], input, select, textarea, label, [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [mx, my]);

  if (!mounted) return null;

  return (
    <>
      {/* Trailing ring — lags behind cursor */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white pointer-events-none z-[9998] mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isPointer ? 1.4 : 1,
          opacity: visible ? (isPointer ? 0.7 : 0.45) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
      {/* Snappy dot — nearly instant */}
      <motion.div
        className="fixed top-0 left-0 w-[10px] h-[10px] rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isPointer ? 2 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </>
  );
}
