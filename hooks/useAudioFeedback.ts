"use client";

import useSound from "use-sound";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "algo-rich-sound-enabled";

function fallbackTone(frequency: number, duration: number) {
  if (typeof window === "undefined" || typeof window.AudioContext === "undefined") return;
  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  window.setTimeout(() => void context.close(), duration * 1000 + 100);
}

export function useAudioFeedback() {
  const [enabled, setEnabled] = useState(true);
  const [playSuccessFile] = useSound("/sounds/success.mp3", { volume: 0.5, soundEnabled: enabled });
  const [playErrorFile] = useSound("/sounds/error.mp3", { volume: 0.4, soundEnabled: enabled });
  const [playLevelUpFile] = useSound("/sounds/levelup.mp3", { volume: 0.6, soundEnabled: enabled });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setEnabled(stored !== "false");
  }, []);

  const setSoundEnabled = useCallback((value: boolean) => {
    setEnabled(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  const playSuccess = useCallback(() => {
    if (!enabled) return;
    playSuccessFile();
    fallbackTone(660, 0.14);
  }, [enabled, playSuccessFile]);
  const playError = useCallback(() => {
    if (!enabled) return;
    playErrorFile();
    fallbackTone(180, 0.18);
  }, [enabled, playErrorFile]);
  const playLevelUp = useCallback(() => {
    if (!enabled) return;
    playLevelUpFile();
    fallbackTone(880, 0.25);
  }, [enabled, playLevelUpFile]);

  const triggerHaptic = useCallback((pattern: "light" | "heavy" | "celebration") => {
    if (enabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: [50], heavy: [100], celebration: [100, 50, 100, 50, 200] };
      navigator.vibrate(patterns[pattern]);
    }
  }, [enabled]);

  return { enabled, setSoundEnabled, playSuccess, playError, playLevelUp, triggerHaptic };
}
