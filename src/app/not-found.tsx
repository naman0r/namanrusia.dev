"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Home, ArrowLeft, Terminal, FileCode } from "lucide-react";

export default function NotFound() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  // Typewriter effect state
  const [text, setText] = useState("");
  const fullText = "ERR_PAGE_NOT_FOUND: The requested resource is unavailable.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center p-6"
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(600px circle at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 40%)`
          ),
        }}
      />

      {/* Spotlight for the whole page (always visible) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(800px circle at ${x}px ${y}px, rgba(50, 50, 50, 0.15), transparent 40%)`
          ),
        }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6 text-red-500 font-mono text-sm tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            System Error 404
          </div>

          <h1 className="text-8xl md:text-9xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            404
          </h1>

          <div className="h-8 font-mono text-blue-400 text-sm md:text-base">
            <span className="mr-2">{">"}</span>
            {text}
            <span className="animate-pulse">_</span>
          </div>
        </motion.div>

        {/* Code Block / Context */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 font-mono text-sm text-gray-400 overflow-hidden backdrop-blur-sm"
        >
          <div className="flex gap-2 mb-4 border-b border-neutral-800 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
          </div>
          <div className="space-y-1">
            <p>
              <span className="text-purple-400">const</span>{" "}
              <span className="text-blue-400">destination</span> ={" "}
              <span className="text-orange-400">null</span>;
            </p>
            <p>
              <span className="text-purple-400">if</span> (!found) {"{"}
            </p>
            <p className="pl-4">
              <span className="text-yellow-400">throw</span>{" "}
              <span className="text-purple-400">new</span>{" "}
              <span className="text-green-400">Error</span>(
              <span className="text-orange-400">
                "This path does not exist."
              </span>
              );
            </p>
            <p>{"}"}</p>
            <p className="text-gray-600 mt-2">
              // TODO: Redirect user to safe zone
            </p>
          </div>
        </motion.div>

        {/* Navigation Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            <Home size={18} />
            Return Home
          </Link>

          <Link
            href="/blogs"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
          >
            <FileCode size={18} />
            Read Blogs
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-transparent border border-neutral-800 text-gray-400 rounded-full font-medium hover:text-white hover:border-neutral-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </motion.div>
      </div>

      {/* Decorative Footers */}
      <div className="absolute bottom-6 left-60 text-xs text-neutral-600 font-mono">
        ID: 404_NOT_FOUND
      </div>
      <div className="absolute bottom-6 right-60 text-xs text-neutral-600 font-mono flex items-center gap-2">
        <Terminal size={12} />
        namanrusia.dev
      </div>
    </div>
  );
}
