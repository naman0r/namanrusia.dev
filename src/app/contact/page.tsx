"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import {
  readSidebarExpanded,
  subscribeToSidebarExpandedChange,
} from "@/lib/sidebar";

export default function Contact() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check sidebar state and screen size (same logic as projects page)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    setSidebarExpanded(readSidebarExpanded(true));

    window.addEventListener("resize", checkMobile);
    const unsubscribe = subscribeToSidebarExpandedChange(setSidebarExpanded);

    return () => {
      window.removeEventListener("resize", checkMobile);
      unsubscribe();
    };
  }, []);

  // Calculate left padding based on sidebar state
  const getLeftPadding = () => {
    if (isMobile) return "px-6";
    return sidebarExpanded ? "pl-[280px] pr-12" : "pl-[108px] pr-12";
  };

  const socialLinks = [
    {
      name: "Email",
      handle: "rusia.n@northeastern.edu",
      url: "mailto:rusia.n@northeastern.edu",
      icon: AiOutlineMail,
      gradient: "from-red-500 to-pink-600",
      description: "Drop me a line anytime",
    },
    {
      name: "LinkedIn",
      handle: "@namanrusia",
      url: "https://linkedin.com/in/namanrusia",
      icon: AiOutlineLinkedin,
      gradient: "from-blue-500 to-blue-700",
      description: "Let's connect professionally",
    },
    {
      name: "GitHub",
      handle: "@naman0r",
      url: "https://github.com/naman0r",
      icon: AiOutlineGithub,
      gradient: "from-gray-700 to-gray-900",
      description: "Check out my code",
    },
    /* {
      name: "Instagram",
      handle: "@naman._.r",
      url: "https://instagram.com/naman._.r",
      icon: AiOutlineInstagram,
      gradient: "from-purple-500 to-pink-500",
      description: "Follow my journey",
    }, */

    {
      name: "X",
      handle: "@namanrusia1",
      url: "https://twitter.com/namanrusia1",
      icon: AiOutlineTwitter,
      gradient: "from-purple-500 to-pink-500",
      description: "Follow my journey",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-black text-white py-12 lg:py-16 ${getLeftPadding()} relative overflow-hidden transition-all duration-300`}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Subtle gradient orbs */}
        <motion.div
          animate={{
            x: ["-20%", "120%"],
            y: ["10%", "80%", "20%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.2) 50%, transparent 70%)",
          }}
        />

        <motion.div
          animate={{
            x: ["120%", "-20%"],
            y: ["80%", "10%", "70%"],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-[300px] h-[300px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
            Get in Touch
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-6">
              I'm always excited to connect with fellow developers, potential
              collaborators, or anyone interested in discussing technology and
              innovation.
            </p>
            <p className="text-lg text-gray-500">
              Feel free to reach out to me anytime through any of these
              platforms!
            </p>
          </div>
        </motion.div>

        {/* Social Links Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;

            return (
              <motion.a
                key={link.name}
                href={link.url}
                target={link.name !== "Email" ? "_blank" : undefined}
                rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group relative overflow-hidden rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm p-6 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/70"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative flex items-center space-x-4">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2 group-hover:text-gray-300 transition-colors">
                      {link.description}
                    </p>
                    <p className="text-gray-500 text-sm font-mono truncate group-hover:text-gray-400 transition-colors">
                      {link.handle}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center pt-12 border-t border-gray-900"
        >
          <h2 className="text-2xl font-light text-white mb-4">
            Let's build something amazing together
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Whether you have a project idea, want to collaborate, or just want
            to chat about tech, I'd love to hear from you. Looking forward to
            connecting!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
