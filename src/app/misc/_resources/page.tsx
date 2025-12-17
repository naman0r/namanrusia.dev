"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaBook,
  FaCode,
  FaTools,
  FaLaptopCode,
  FaPalette,
} from "react-icons/fa";

interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  icon: React.ReactNode;
}

const resources: Resource[] = [
  {
    title: "Refactoring UI",
    description:
      "Learn how to design beautiful user interfaces by yourself using specific tactics explained from a developer's point of view.",
    url: "https://www.refactoringui.com/",
    category: "Design",
    tags: ["UI", "Book", "CSS"],
    icon: <FaPalette />,
  },
  {
    title: "Next.js Documentation",
    description:
      "The React Framework for the Web. Best place to learn Next.js features and API.",
    url: "https://nextjs.org/docs",
    category: "Development",
    tags: ["React", "Framework", "Docs"],
    icon: <FaCode />,
  },
  {
    title: "Vercel",
    description:
      "Develop. Preview. Ship. The best platform for deploying Next.js applications.",
    url: "https://vercel.com",
    category: "Tools",
    tags: ["Hosting", "Deployment"],
    icon: <FaTools />,
  },
  {
    title: "Tailwind CSS",
    description:
      "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
    url: "https://tailwindcss.com/",
    category: "Design",
    tags: ["CSS", "Framework"],
    icon: <FaPalette />,
  },
  {
    title: "Roadmap.sh",
    description:
      "Community driven roadmaps, articles and resources for developers.",
    url: "https://roadmap.sh/",
    category: "Learning",
    tags: ["Career", "Guide"],
    icon: <FaBook />,
  },
  {
    title: "Supabase",
    description:
      "The open source Firebase alternative. Build in a weekend, scale to millions.",
    url: "https://supabase.com/",
    category: "Development",
    tags: ["Database", "Backend"],
    icon: <FaCode />,
  },
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check sidebar state and screen size (reused logic from Projects page)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const checkSidebarState = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("sidebar:expanded");
        setSidebarExpanded(saved !== "0");
      }
    };

    checkMobile();
    checkSidebarState();

    window.addEventListener("resize", checkMobile);
    const interval = setInterval(checkSidebarState, 100);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(interval);
    };
  }, []);

  const getLeftPadding = () => {
    if (isMobile) return "px-6";
    return sidebarExpanded ? "pl-[280px] pr-12" : "pl-[108px] pr-12";
  };

  const allCategories = ["All", ...new Set(resources.map((r) => r.category))];

  const filteredResources =
    selectedCategory === "All"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  return (
    <div
      className={`min-h-screen bg-black/20 text-white py-12 lg:py-12 ${getLeftPadding()} relative overflow-hidden transition-all duration-300`}
    >
      {/* Background Animation (reused style) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: ["-20%", "120%"],
            y: ["10%", "80%", "20%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(79, 70, 229, 0.2) 50%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: ["120%", "-20%"],
            y: ["80%", "10%", "70%"],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(219, 39, 119, 0.2) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
            Resources
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-3xl leading-relaxed">
            A curated collection of tools, libraries, articles, and design
            resources that I find useful. Hoping this helps you as much as it
            helps me.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-purple-500/20 text-purple-200 border border-purple-500/50"
                    : "bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:bg-gray-800/60 hover:border-gray-700 transition-all duration-300 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-800/50 rounded-lg text-purple-400 group-hover:text-purple-300 transition-colors">
                  {resource.icon}
                </div>
                <FaExternalLinkAlt className="text-gray-600 group-hover:text-gray-400 text-sm transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white mb-2 transition-colors">
                {resource.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-gray-300 transition-colors">
                {resource.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-800/50 text-gray-400 rounded-md border border-gray-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
