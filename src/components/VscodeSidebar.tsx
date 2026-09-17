"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  VscHome,
  VscBriefcase,
  VscRocket,
  VscTerminal,
  VscAccount,
  VscChevronDown,
  VscMarkdown,
  VscFilePdf,
  VscTerminalBash,
  VscFileCode,
  VscGithubInverted,
  VscTwitter,
  VscPlay,
  VscDebugPause,
  VscMute,
  VscUnmute,
  VscClose,
  VscMenu,
  VscLinkExternal,
} from "react-icons/vsc";
import { AiOutlineLinkedin } from "react-icons/ai";
import { useMusic } from "@/contexts/MusicContext";

// Activity bar (40) + explorer panel (176), edge to edge like VS Code.
export const SIDEBAR_WIDTH = 216;
// Left padding pages use on desktop to clear the fixed sidebar.
export const CONTENT_PADDING = "lg:pl-[240px]";

const activities = [
  { icon: VscHome, label: "Home", href: "/" },
  { icon: VscBriefcase, label: "Experience", href: "/experience" },
  { icon: VscRocket, label: "Projects", href: "/projects" },
  { icon: VscTerminal, label: "Terminal", href: "/terminal" },
];

type TreeNode = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  external?: boolean;
};

const tree: TreeNode[] = [
  { name: "home.tsx", href: "/", icon: VscFileCode, color: "text-sky-400" },
  { name: "experience.tsx", href: "/experience", icon: VscFileCode, color: "text-sky-400" },
  { name: "projects.tsx", href: "/projects", icon: VscFileCode, color: "text-sky-400" },
  { name: "terminal.sh", href: "/terminal", icon: VscTerminalBash, color: "text-emerald-400" },
  { name: "contact.md", href: "/contact", icon: VscMarkdown, color: "text-indigo-400" },
  {
    name: "resume.pdf",
    href: "/resume.pdf",
    icon: VscFilePdf,
    color: "text-rose-400",
    external: true,
  },
];

const socialLinks = [
  { icon: VscGithubInverted, label: "github", url: "https://github.com/naman0r" },
  {
    icon: AiOutlineLinkedin,
    label: "linkedin",
    url: "https://linkedin.com/in/namanrusia",
  },
  { icon: VscTwitter, label: "twitter", url: "https://x.com/namanrusia1" },
];

interface SidebarProps {
  isOpen?: boolean; // mobile drawer open
  onClose?: () => void; // mobile drawer close handler
  user?: {
    name?: string;
    title?: string;
    avatarUrl?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  user = {
    name: "Naman Rusia",
    title: "Student",
    avatarUrl: "/profile_pic.jpeg",
  },
}) => {
  const pathname = usePathname() ?? "";
  const [isMobile, setIsMobile] = useState(false);
  const { isPlaying, isMuted, hasConsented, currentSong, togglePlay, toggleMute } =
    useMusic();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const sectionHeader = (label: string) => (
    <div className="flex h-[22px] items-center gap-0.5 pl-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      <VscChevronDown className="h-3.5 w-3.5" />
      {label}
    </div>
  );

  const renderNode = ({ name, href, icon: Icon, color, external }: TreeNode) => {
    const selected = isActive(href);
    const row = (
      <span
        className={`flex h-[22px] items-center gap-1.5 whitespace-nowrap pl-5 text-[12px] leading-[22px] ${
          selected
            ? "bg-indigo-500/20 text-white"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
        {name}
        {external && (
          <VscLinkExternal className="ml-auto mr-2 h-3 w-3 text-gray-500" />
        )}
      </span>
    );
    return (
      <li key={href}>
        {external ? (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {row}
          </a>
        ) : (
          <Link href={href} onClick={onClose} aria-current={selected ? "page" : undefined}>
            {row}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isMobile && !isOpen ? -SIDEBAR_WIDTH : 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 35, mass: 0.6 }}
        style={{ width: SIDEBAR_WIDTH }}
        className="fixed inset-y-0 left-0 z-50 flex font-mono text-gray-300 backdrop-blur-xl"
        role="navigation"
        aria-label="Primary"
      >
        {/* Activity bar */}
        <div className="flex w-10 shrink-0 flex-col border-r border-white/10 bg-gray-950/95">
          {activities.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={label}
                aria-label={label}
                className={`relative flex h-10 items-center justify-center border-l-2 transition-colors ${
                  active
                    ? "border-indigo-400 text-white"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
          <div className="flex-1" />
          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause music" : "Play music"}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="relative flex h-10 items-center justify-center text-gray-500 hover:text-white"
          >
            {isPlaying ? (
              <VscDebugPause className="h-5 w-5" />
            ) : (
              <VscPlay className="h-5 w-5" />
            )}
            {hasConsented && isPlaying && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
          <Link
            href="/contact"
            onClick={onClose}
            title="Contact"
            aria-label="Contact"
            className={`flex h-10 items-center justify-center ${
              isActive("/contact") ? "text-white" : "text-gray-500 hover:text-white"
            }`}
          >
            <VscAccount className="h-5 w-5" />
          </Link>
        </div>

        {/* Explorer panel */}
        <div className="flex min-w-0 flex-1 flex-col border-r border-white/10 bg-gray-950/90">
          <div className="flex h-[32px] items-center justify-between pl-4 pr-2 text-[10px] uppercase tracking-wider text-gray-500">
            Explorer
            {isMobile && (
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-1 hover:text-white"
              >
                <VscClose className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {sectionHeader("namanrusia.dev")}
            <ul>{tree.map(renderNode)}</ul>
          </div>

          <div className="border-t border-white/10">
            {sectionHeader("now playing")}
            <div className="flex items-center gap-2 px-3 pb-2 text-[11px]">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  hasConsented && isPlaying ? "bg-emerald-400" : "bg-gray-600"
                }`}
              />
              <span className="min-w-0 flex-1 truncate text-gray-300">
                {currentSong || "grab some headphones"}
              </span>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="shrink-0 p-1 text-gray-500 hover:text-white"
              >
                {isMuted ? (
                  <VscMute className="h-4 w-4" />
                ) : (
                  <VscUnmute className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-white/10">
            {sectionHeader("connect")}
            <ul className="pb-1">
              {socialLinks.map(({ icon: Icon, label, url }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-[22px] items-center gap-1.5 pl-5 text-[12px] text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    {label}
                    <VscLinkExternal className="ml-auto mr-2 h-3 w-3 text-gray-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
            <img
              src={user.avatarUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
            <div className="min-w-0 text-[11px] leading-tight">
              <p className="truncate text-gray-300">{user.name}</p>
              <p className="truncate text-gray-500">student | swe</p>
            </div>
          </div>
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
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-gray-950/90 px-4 py-3 font-mono backdrop-blur-xl lg:hidden">
      <h1 className="text-sm text-gray-300">{title}</h1>
      <button
        onClick={onMenuClick}
        className="p-2 text-gray-500 hover:text-white"
        aria-label="Open menu"
      >
        <VscMenu className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Sidebar;
