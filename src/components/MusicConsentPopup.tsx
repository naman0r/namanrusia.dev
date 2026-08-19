"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "@/contexts/MusicContext";
import { useEffect, useState } from "react";

// Temporarily disabled: music must never start unprompted.
// Users start it from the sidebar play button. Flip to true to bring the popup back.
const SHOW_CONSENT_POPUP = false;

export default function MusicConsentPopup() {
  const { hasConsented, setConsent } = useMusic();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!SHOW_CONSENT_POPUP) return;

    // Only show popup on landing page and every time they reload
    const isHomePage = window.location.pathname === "/";
    if (isHomePage) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000); // Show after 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    setConsent(consent);
    setShowPopup(false);
  };

  if (!SHOW_CONSENT_POPUP || hasConsented || !showPopup) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-sm mx-4 p-6 bg-black/80 backdrop-blur-md rounded-xl border border-gray-800"
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>

            <h3 className="text-lg font-medium text-white mb-2">
              Background Music
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              My website is meant to be an immersive portfolio. Would you like
              for background music to be enabled? You can always pause or switch
              it off in the sidebar.
            </p>

            <p className="text-gray-600 text-xs mb-6">
              Music may contain profanity.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
