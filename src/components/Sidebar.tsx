"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineTwitter,
  AiOutlineLinkedin,
  AiOutlineGithub,
  AiOutlineInstagram,
  AiOutlineClose,
} from "react-icons/ai";
import { RiCoupon3Fill } from "react-icons/ri";

import { FaComputer } from "react-icons/fa6";
import {
  HiOutlineBriefcase,
  HiOutlineMenu,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { IoTerminal } from "react-icons/io5";
import { HiOutlineWrench, HiOutlineMinus } from "react-icons/hi2";
import { RiRocketLine } from "react-icons/ri";
import { SiMedium } from "react-icons/si";
import { BiLinkExternal } from "react-icons/bi";
import { useMusic } from "@/contexts/MusicContext";

interface SidebarProps {
  isOpen?: boolean; // mobile drawer open
  onClose?: () => void; // mobile drawer close handler
  initialExpanded?: boolean; // desktop expanded/collapsed
  user?: {
    name?: string;
    title?: string;
    avatarUrl?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  initialExpanded = true,
  user = {
    name: "Naman Rusia",
    title: "Student",
    avatarUrl: "/profile_pic.jpeg",
  },
}) => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const {
    isPlaying,
    isMuted,
    hasConsented,
    currentSong,
    togglePlay,
    toggleMute,
  } = useMusic();

  // On mobile, always treat as expanded when open
  const isExpanded = isMobile || expanded;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // persist expanded state across reloads
  useEffect(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("sidebar:expanded");
    if (saved !== null) setExpanded(saved === "1");
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar:expanded", expanded ? "1" : "0");
    }
  }, [expanded]);

  const navigationItems = useMemo(
    () => [
      { icon: AiOutlineHome, label: "Home", href: "/" },
      { icon: RiRocketLine, label: "Projects", href: "/projects" },
      { icon: HiOutlineBriefcase, label: "Experience", href: "/experience" },
      { icon: IoTerminal, label: "Terminal", href: "/terminal" },
      //{ icon: RiCoupon3Fill, label: "Misc", href: "/misc" },
      //{ icon: HiOutlinePencilAlt, label: "Thoughts", href: "/blogs" },
      //{ icon: AiOutlineUser, label: "About", href: "/about" },
      //{ icon: AiOutlineMail, label: "Contact", href: "/contact" },
      //{ icon: HiOutlineWrench, label: "Tools", href: "/tools" },

      //{ icon: FaComputer, label: "Playground", href: "/playground" },
      //{ icon: HiOutlinePencilAlt, label: "Thoughts", href: "/blogs" },
    ],
    [],
  );

  const musicControls = useMemo(() => {
    return [
      {
        id: "play-pause",
        label: isPlaying ? "Pause" : "Play",
        onClick: togglePlay,
        icon: isPlaying ? "pause" : "play",
        showIndicator: true,
      },
      {
        id: "mute-unmute",
        label: isMuted ? "Unmute" : "Mute",
        onClick: toggleMute,
        icon: isMuted ? "muted" : "volume",
        showIndicator: false,
      },
    ];
  }, [isPlaying, isMuted, togglePlay, toggleMute]);

  const socialLinks = useMemo(
    () => [
      {
        icon: AiOutlineGithub,
        label: "GitHub",
        url: "https://github.com/naman0r",
      },

      {
        icon: AiOutlineLinkedin,
        label: "LinkedIn",
        url: "https://linkedin.com/in/namanrusia",
      },
      {
        icon: AiOutlineTwitter,
        label: "Twitter (X)",
        url: "https://x.com/namanrusia1",
      },
    ],
    [],
  );

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getMusicIcon = (iconType: string) => {
    switch (iconType) {
      case "play":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
      case "pause":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        );
      case "volume":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        );
      case "muted":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const RailItem: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
  }> = ({ icon: Icon, label, href }) => {
    const active = isActive(href);
    return (
      <li>
        <Link
          href={href}
          onClick={onClose}
          aria-current={active ? "page" : undefined}
          className={
            `group relative flex items-center rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ` +
            (isExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-3") +
            " " +
            (active
              ? "bg-white text-gray-900 shadow-[inset_0_0_0_1px_rgba(17,24,39,0.08)]"
              : "text-gray-300 hover:text-white hover:bg-white/5")
          }
        >
          <Icon
            className={`shrink-0 transition-all ${
              isExpanded ? "h-5 w-5" : "h-6 w-6"
            }`}
          />
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="truncate"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip when collapsed */}
          {!isExpanded && (
            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 scale-95 opacity-0 rounded-lg bg-gray-900/95 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10 transition-all group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap z-50">
              {label}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          // Mobile: slide in/out based on isOpen, Desktop: always visible but width changes
          x: isMobile ? (isOpen ? 0 : -320) : 0,
          width: isExpanded ? 260 : 88,
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 35,
          mass: 0.6,
        }}
        className={`${
          isMobile ? "fixed" : "sticky"
        } inset-y-0 left-0 z-50 flex h-screen flex-col border-r transition-all duration-200 bg-gray-950/90 px-2 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl ${
          !isMobile && !isExpanded
            ? "border-white/20 hover:border-blue-500/30 cursor-pointer"
            : "border-white/10"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(1200px 400px at -10% -10%, rgba(99,102,241,0.12), transparent 40%), radial-gradient(1200px 400px at 110% 110%, rgba(56,189,248,0.12), transparent 40%)",
        }}
        role="navigation"
        aria-label="Primary"
        onClick={!isMobile && !isExpanded ? () => setExpanded(true) : undefined}
      >
        {/* Mobile close button */}
        {isMobile && (
          <div className="mb-3 flex justify-end px-2">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 transition-colors"
              aria-label="Close sidebar"
            >
              <AiOutlineClose className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Profile */}
        <div className="mb-6 px-2">
          <div
            className={`flex items-center ${
              isExpanded ? "gap-3" : "justify-center"
            }`}
          >
            <div className="relative group">
              <img
                src={user.avatarUrl}
                alt="Profile avatar"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition-all hover:ring-blue-500/30"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-gray-950"
                aria-hidden
              />

              {/* Expand trigger for desktop - always visible with subtle hint */}
              {!isMobile && !isExpanded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setExpanded(true)}
                    className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-center justify-center group"
                    aria-label="Expand sidebar"
                  >
                    <div className="relative">
                      {/* Subtle expand hint - always visible */}
                      <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse group-hover:bg-white/60 transition-colors" />
                      {/* Arrow on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-3 h-3 text-white"
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
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="flex-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-5">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-400">Student | SWE</p>
                    </div>
                    {!isMobile && (
                      <button
                        onClick={() => setExpanded(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 group border border-transparent hover:border-white/20"
                        aria-label="Collapse sidebar"
                        title="Collapse sidebar"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 grid grid-cols-2 gap-2"
              >
                <Link
                  href="/contact"
                  className="rounded-xl bg-gradient-to-br from-indigo-100 to-sky-500 px-3 py-2 text-center text-xs font-semibold text-black shadow-sm shadow-black/20 outline-solid ring-offset-0 transition hover:opacity-25 focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                >
                  Contact
                </Link>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-gray-200 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                >
                  Resume
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="mt-1 flex-1 overflow-y-auto px-1">
          <ul className="flex flex-col gap-1">
            {navigationItems.map((n) => (
              <RailItem
                key={n.href}
                icon={n.icon}
                label={n.label}
                href={n.href}
              />
            ))}
          </ul>

          {/* Divider after navigation */}
          <div className="my-4 mx-auto w-8 h-px bg-white/10"></div>

          {/* Expand hint when collapsed */}
          {!isMobile && !isExpanded && (
            <div className="flex flex-col items-center gap-2 px-1 py-3">
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              <div className="text-[10px] text-gray-500 text-center rotate-90 whitespace-nowrap select-none">
                Click to expand
              </div>
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          )}
        </nav>

        {/* Expand/Collapse Button for Desktop */}
        {!isMobile && (
          <div className="px-2 py-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20 group"
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg
                className="w-3 h-3 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Collapse
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}

        {/* Connect Section */}
        <div className="mt-auto w-full px-2 pb-3 pt-3">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.h4
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-gray-300"
              >
                Connect
              </motion.h4>
            )}
          </AnimatePresence>

          <div className={`${isExpanded ? "px-1" : "px-0"}`}>
            {isExpanded ? (
              // Expanded: horizontal layout with labels
              <div className="space-y-4">
                {/* Music Controls */}
                <div className="px-4 py-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                        transition={{
                          duration: 0.6,
                          repeat: isPlaying ? Infinity : 0,
                        }}
                        className={`w-2 h-2 rounded-full ${
                          hasConsented && isPlaying
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="text-xs text-gray-400">
                        {hasConsented
                          ? isPlaying
                            ? "Playing"
                            : "Paused"
                          : "Ready"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {musicControls.map((control) => (
                        <button
                          key={control.id}
                          onClick={control.onClick}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                          title={control.label}
                        >
                          {getMusicIcon(control.icon)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs text-gray-500 truncate">
                      {currentSong || "grab some headphones!"}
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-start gap-2">
                  {socialLinks.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        className="group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Collapsed: vertical stack
              <div className="flex flex-col items-center gap-3">
                {/* Music Controls - vertical stack when collapsed */}
                {musicControls.map((control) => (
                  <button
                    key={control.id}
                    onClick={control.onClick}
                    className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:text-white hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                    title={control.label}
                  >
                    {getMusicIcon(control.icon)}

                    {/* Status indicator for play button */}
                    {control.showIndicator && (
                      <motion.div
                        animate={{
                          scale: isPlaying ? [1, 1.2, 1] : 1,
                          opacity: isPlaying ? [0.5, 1, 0.5] : 0.3,
                        }}
                        transition={{
                          duration: 1,
                          repeat: isPlaying ? Infinity : 0,
                        }}
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          hasConsented && isPlaying
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                    )}

                    {/* Tooltip when collapsed */}
                    <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 scale-95 whitespace-nowrap rounded-lg bg-gray-900/95 px-3 py-2 text-xs text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all group-hover:scale-100 group-hover:opacity-100 z-50">
                      {control.label}
                    </span>
                  </button>
                ))}

                {/* Divider after music controls */}
                {musicControls.length > 0 && (
                  <div className="w-8 h-px bg-white/10 my-2"></div>
                )}

                {/* Social Links */}
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:text-white hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                    >
                      <Icon className="h-4 w-4" />
                      {/* Tooltip when collapsed */}
                      <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 scale-95 whitespace-nowrap rounded-lg bg-gray-900/95 px-3 py-2 text-xs text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all group-hover:scale-100 group-hover:opacity-100 z-50">
                        {s.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 rounded-xl border border-white/10 bg-white/5 p-2 text-center text-[10px] text-gray-400"
              >
                © {new Date().getFullYear()} {user.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

// Mobile Header Component
export const MobileHeader: React.FC<{
  onMenuClick: () => void;
  title?: string;
}> = ({ onMenuClick, title = "Naman Rusia" }) => {
  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-gray-950/90 px-4 py-3 backdrop-blur-xl lg:hidden"
      style={{
        backgroundImage:
          "radial-gradient(600px 200px at -10% -10%, rgba(99,102,241,0.12), transparent 40%), radial-gradient(600px 200px at 110% 110%, rgba(56,189,248,0.12), transparent 40%)",
      }}
    >
      <h1 className="text-sm font-semibold text-white">{title}</h1>
      <button
        onClick={onMenuClick}
        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
        aria-label="Open menu"
      >
        <HiOutlineMenu className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Sidebar;
