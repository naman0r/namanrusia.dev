"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  hasConsented: boolean;
  volume: number;
  currentSong: string;
  togglePlay: () => void;
  toggleMute: () => void;
  setConsent: (consent: boolean) => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [volume, setVolumeState] = useState(0.4); // 30% volume by default
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determine which song to play based on current route
  const getSongForRoute = (path: string): string => {
    /* if (path === "/projects" || path.startsWith("/projects/")) {
      return "/sounds/clubhouse_clean.mp3";
    } */
    //return "/sounds/fastLife.mp3";
    return "/sounds/magnetic.mp3";
  };

  // Get display name for current song
  const getSongDisplayName = (src: string): string => {
    if (src.includes("clubhouse.mp3")) {
      return "Clubhouse";
    }
    if (src.includes("fastLife.mp3")) {
      return "Fast Life";
    }
    if (src.includes("magnetic.mp3")) {
      return "Magnetic";
    }
    return "Unknown";
  };

  // Initialize audio element
  useEffect(() => {
    const initialSong = getSongForRoute(pathname);
    // Initialize audio element with the appropriate song for current route
    audioRef.current = new Audio(initialSong);
    audioRef.current.loop = true;
    setCurrentSrc(initialSong);

    // Set initial volume
    audioRef.current.volume = volume;

    // Reset consent on initial load
    setHasConsented(false);

    const cleanup = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };

    return cleanup;
  }, []);

  // Handle route changes to switch audio source
  useEffect(() => {
    if (!audioRef.current) return;

    const newSong = getSongForRoute(pathname);

    // Only switch if the song is different from current
    if (newSong !== currentSrc) {
      const wasPlaying = isPlaying;
      const currentTime = audioRef.current.currentTime;

      // Pause current audio
      audioRef.current.pause();
      setIsPlaying(false);

      // Create new audio element with new song
      audioRef.current.src = newSong;
      audioRef.current.load(); // Important: reload the audio element
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;

      // Update current source
      setCurrentSrc(newSong);

      // If music was playing and user has consented, resume with new song
      if (wasPlaying && hasConsented) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Failed to resume with new song:", error);
            });
        }
      }
    }
  }, [pathname, currentSrc, hasConsented, isPlaying, volume, isMuted]);

  // Separate effect for handling volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle auto-play when consent is given
  useEffect(() => {
    if (hasConsented && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Auto-play prevented:", error);
          });
      }
    }
  }, [hasConsented]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If user hasn't consented yet but clicks play, automatically set consent
      if (!hasConsented) {
        setHasConsented(true);
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Play failed:", error);
          });
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const setConsent = (consent: boolean) => {
    setHasConsented(consent);
    // Don't persist consent to localStorage anymore

    if (!consent && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        hasConsented: hasConsented === true,
        volume,
        currentSong: getSongDisplayName(currentSrc),
        togglePlay,
        toggleMute,
        setConsent,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
