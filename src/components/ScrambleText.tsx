"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234!@#$%&*";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "span" | "p";
}

export default function ScrambleText({
  text,
  className = "",
  delay = 0,
  tag: Tag = "span",
}: Props) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-30px",
  });
  const animated = useRef(false);

  useEffect(() => {
    if (!isInView || animated.current) return;
    animated.current = true;

    const timer = setTimeout(() => {
      let progress = 0;
      const tick = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, idx) => {
              if (char === " ") return " ";
              if (idx < progress) return text[idx];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        progress += 0.45;
        if (progress >= text.length) {
          setDisplay(text);
          clearInterval(tick);
        }
      }, 28);
      return () => clearInterval(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, text, delay]);

  return (
    // @ts-expect-error ref type mismatch is harmless
    <Tag ref={ref} className={className}>
      {display}
    </Tag>
  );
}
