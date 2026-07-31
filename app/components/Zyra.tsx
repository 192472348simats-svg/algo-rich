"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { analytics } from "@/lib/analytics";
import { recordDailyQuestProgress } from "@/app/dashboard/components/dailyQuestEvents";

// ─── Zyra message types ────────────────────────────────────

type ZyraMood = "idle" | "thinking" | "happy" | "naughty" | "alert";
type ZyraContext = "problem" | "session" | "dashboard";

export interface ZyraProps {
  context?: ZyraContext;
  problemTitle?: string;
  problemDescription?: string;
  userCode?: string;
  lastError?: string;
}

interface ZyraMessage {
  id: string;
  text: string;
  from: "zyra" | "user";
}

// ─── Context-aware messages ────────────────────────────────

const GREETINGS = [
  "Hey… I'm Zyra ⭐\nYou're here to get better… right? Good. I don't like wasting potential.",
  "Oh, you're back. Good. Let's not waste this session.",
  "Zyra here. Ready when you are.",
];

const IDLE_NUDGES = [
  "You opened this for a reason. Don't walk away now.",
  "Still there? The problem won't solve itself. 😏",
  "3 minutes of staring… are you thinking or just hoping?",
  "Tap me if you're stuck. I don't judge. Much.",
];

const HINT_RESPONSES = [
  "Start by writing what you know — inputs, outputs. Don't touch code yet.",
  "What's the pattern here? You've seen something like this before.",
  "Brute force first. Make it work, then make it fast.",
  "Draw it out. Seriously. Paper beats staring.",
  "Break it into smaller problems. What's the smallest version you can solve?",
];

const STUCK_RESPONSES = [
  "You've been staring at this for a while… thinking or overthinking? 😏\nTry breaking it into smaller steps.",
  "You're close. Stop rushing.",
  "What do you actually know about this problem? Start from there.",
  "Wrong answer doesn't mean wrong approach. Check your edge cases.",
];

const SUCCESS_RESPONSES = [
  "Nice. That wasn't luck… don't pretend it was.",
  "Clean. Now do it faster.",
  "I knew you had it. You doubted yourself though, didn't you? 😏",
  "That's the one. Now remember why it works.",
];

const NAUGHTY_REMARKS = [
  "You sure about that… or just hoping it works? 😏",
  "Confidence is good. Blind confidence… not so much 😏",
  "Interesting choice. Bold. Let's see how that goes.",
  "That's one way to do it. Definitely a way.",
];

function randomFrom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Zyra Face SVG ────────────────────────────────────────

function ZyraFace({ mood }: { mood: ZyraMood }) {
  const eyeY = mood === "thinking" ? 18 : 17;
  const mouthPath =
    mood === "happy"
      ? "M 14 26 Q 20 32 26 26"
      : mood === "naughty"
        ? "M 14 27 Q 20 31 26 25"
        : mood === "alert"
          ? "M 16 28 Q 20 26 24 28"
          : "M 15 27 Q 20 31 25 27";

  const leftBrowY = mood === "naughty" ? 10 : mood === "thinking" ? 11 : 12;
  const rightBrowY = mood === "naughty" ? 12 : mood === "thinking" ? 10 : 12;
  const leftBrowRot = mood === "naughty" ? -8 : mood === "thinking" ? -5 : 0;
  const rightBrowRot = mood === "naughty" ? 8 : mood === "thinking" ? 5 : 0;

  return (
    <svg viewBox="0 0 40 40" width="44" height="44">
      {/* Left eyebrow */}
      <motion.line
        x1="11" y1={leftBrowY} x2="18" y2={leftBrowY - 1}
        stroke="#7a4f00" strokeWidth="2" strokeLinecap="round"
        animate={{ rotate: leftBrowRot, y: leftBrowY - 12 }}
        style={{ transformOrigin: "14px 11px" }}
        transition={{ duration: 0.3 }}
      />
      {/* Right eyebrow */}
      <motion.line
        x1="22" y1={rightBrowY - 1} x2="29" y2={rightBrowY}
        stroke="#7a4f00" strokeWidth="2" strokeLinecap="round"
        animate={{ rotate: rightBrowRot }}
        style={{ transformOrigin: "26px 11px" }}
        transition={{ duration: 0.3 }}
      />
      {/* Left eye */}
      <motion.ellipse
        cx="15" cy={eyeY} rx={mood === "alert" ? 4 : 3} ry={mood === "alert" ? 4.5 : 3.5}
        fill="#7a4f00"
        animate={{ scaleY: mood === "thinking" ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Left eye shine */}
      <circle cx="16.5" cy={eyeY - 1} r="1" fill="white" opacity="0.8" />
      {/* Right eye */}
      <motion.ellipse
        cx="25" cy={eyeY} rx={mood === "alert" ? 4 : 3} ry={mood === "alert" ? 4.5 : 3.5}
        fill="#7a4f00"
        animate={{ scaleY: mood === "thinking" ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Right eye shine */}
      <circle cx="26.5" cy={eyeY - 1} r="1" fill="white" opacity="0.8" />
      {/* Mouth */}
      <motion.path
        d={mouthPath}
        fill="none" stroke="#7a4f00" strokeWidth="2" strokeLinecap="round"
        animate={{ d: mouthPath }}
        transition={{ duration: 0.4 }}
      />
      {/* Cheek blush for happy */}
      {mood === "happy" && (
        <>
          <circle cx="10" cy="23" r="3.5" fill="#ff9f7f" opacity="0.4" />
          <circle cx="30" cy="23" r="3.5" fill="#ff9f7f" opacity="0.4" />
        </>
      )}
    </svg>
  );
}

// ─── Zyra Star Body ───────────────────────────────────────

function ZyraStar({ mood, onClick }: { mood: ZyraMood; onClick: () => void }) {
  const glowColor =
    mood === "alert" ? "rgba(255,80,80,0.6)" :
      mood === "happy" ? "rgba(255,215,0,0.8)" :
        mood === "naughty" ? "rgba(255,180,0,0.7)" :
          "rgba(255,215,0,0.5)";

  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer select-none"
      style={{ width: 72, height: 72 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: glowColor, filter: "blur(12px)" }}
        animate={{
          scale: mood === "alert" ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: mood === "alert" ? [0.7, 1, 0.7] : [0.4, 0.7, 0.4],
        }}
        transition={{ duration: mood === "alert" ? 0.8 : 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Star shape */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          y: mood === "thinking" ? [0, -4, 0] : mood === "alert" ? [0, -7, 0] : [0, -8, 0],
          rotate: mood === "thinking" ? [0, -5, 5, 0] : [0, 2, -2, 0],
          scale: mood === "idle" ? [1, 1.035, 1] : 1,
        }}
        transition={{
          duration: mood === "thinking" ? 1.5 : mood === "idle" ? 2.8 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* 5-pointed star SVG */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            filter: `drop-shadow(0 4px 12px ${glowColor}) drop-shadow(0 2px 6px rgba(0,0,0,0.4))`,
          }}
        >
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE566" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#e6a800" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
            fill="url(#starGrad)"
            stroke="#c8900a"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Face centered over star */}
        <div style={{ position: "relative", zIndex: 1, marginTop: "2px" }}>
          <ZyraFace mood={mood} />
        </div>

        {/* Happy sparkles */}
        {mood === "happy" && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ background: "#FFD700", zIndex: 2 }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 32],
                  y: [0, (i < 2 ? -1 : 1) * 28],
                  opacity: [1, 0.5, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Chat panel ───────────────────────────────────────────

function ChatPanel({
  messages,
  onSend,
  onClose,
  isTyping,
  isMobile,
  disabled,
}: {
  messages: ZyraMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
  isTyping: boolean;
  isMobile: boolean;
  disabled: boolean;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`absolute bottom-20 right-0 ${isMobile ? 'w-[calc(100vw-2rem)]' : 'w-80'} rounded-2xl overflow-hidden shadow-2xl flex flex-col`}
      style={{
        background: "#0f1629",
        border: "1px solid #E5A82960",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(229,168,41,0.1)",
        height: "min(70dvh, 520px)",
        maxHeight: "calc(100dvh - 96px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #1E3A5F", background: "#0a0f24" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #FFD700, #FFC300)", color: "#7a4f00" }}>
            Z
          </div>
          <span className="text-sm font-semibold text-white">Zyra</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        </div>
        <button onClick={onClose} className="transition-colors hover:text-white" style={{ color: "#6b7a99" }}>
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-y-auto overscroll-contain">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed"
              style={{
                background: msg.from === "zyra" ? "#1a1400" : "#1a2847",
                color: msg.from === "zyra" ? "#fff" : "#c8d0e0",
                border: `1px solid ${msg.from === "zyra" ? "#E5A82940" : "#1E3A5F"}`,
                whiteSpace: "pre-line",
                overflowWrap: "anywhere",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl" style={{ background: "#1a1400", border: "1px solid #E5A82940" }}>
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#E5A829" }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick action chips */}
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-none">
        {["Give me a hint", "I'm stuck", "What's the pattern?", "Motivate me"].map((chip, index) => (
          <motion.button key={chip} onClick={() => onSend(chip)} disabled={disabled}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{ background: "#1a1400", color: "#E5A829", border: "1px solid #E5A82940", whiteSpace: "nowrap" }}>
            {chip}
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-3 pb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Zyra anything..."
          disabled={disabled}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-[#6b7a99] focus:outline-none"
          style={{ background: "#0a0f24", border: "1px solid #1E3A5F" }}
          onFocus={e => (e.currentTarget.style.borderColor = "#E5A829")}
          onBlur={e => (e.currentTarget.style.borderColor = "#1E3A5F")}
        />
        <button onClick={handleSend} disabled={disabled}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
          style={{ background: "#E5A829" }}>
          <Send size={15} color="#0a0f24" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Zyra Component ──────────────────────────────────

function ZyraComponent({
  context,
  problemTitle,
  problemDescription,
  userCode,
  lastError,
}: ZyraProps) {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<ZyraMood>("idle");
  const [messages, setMessages] = useState<ZyraMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<string | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem("zyra_state", JSON.stringify({ messages, hasGreeted }));
  }, [messages, hasGreeted]);

  // Greet after 3 seconds on first load
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasGreeted) {
        setHasGreeted(true);
        setBubble("Hey… I'm Zyra ⭐ Tap me if you need help.");
        setMood("happy");
        setTimeout(() => {
          setBubble(null);
          setMood("idle");
        }, 4000);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [hasGreeted]);

  // Idle nudge — if user hasn't interacted for 3 minutes
  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!open) {
          setBubble(randomFrom(IDLE_NUDGES));
          setMood("thinking");
          setTimeout(() => {
            setBubble(null);
            setMood("idle");
          }, 5000);
        }
      }, 3 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(idleTimerRef.current);
    };
  }, [open]);

  const addMessage = (text: string, from: "zyra" | "user") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, from },
    ].slice(-30));
  };

  useEffect(() => {
    const handleSolveCelebration = (event: Event) => {
      const message = (event as CustomEvent<{ message?: unknown }>).detail?.message;
      if (typeof message !== "string" || !message) return;
      setMood("happy");
      if (open) addMessage(message, "zyra");
      setBubble(message);
      const timer = window.setTimeout(() => {
        setBubble(null);
        setMood("idle");
      }, 4000);
      return () => window.clearTimeout(timer);
    };

    window.addEventListener("algo-rich:zyra-celebration", handleSolveCelebration);
    return () => window.removeEventListener("algo-rich:zyra-celebration", handleSolveCelebration);
  }, [open]);

  // React to failed submissions from the problem solver.
  useEffect(() => {
    const handleWrongAnswer = (event: Event) => {
      const attempts = (event as CustomEvent<{ attempts?: unknown }>).detail?.attempts;
      const isProactive = typeof attempts === "number" && attempts >= 3;
      const message = isProactive
        ? "Stuck? I can break this down. Tap me and we'll find the first step."
        : "Not quite. Slow down and check the failing case — you’re closer than you think.";
      setMood("alert");
      setBubble(message);
      if (open || isProactive) addMessage(message, "zyra");
      if (isProactive) setOpen(true);
      window.setTimeout(() => {
        setBubble(null);
        setMood("idle");
      }, isProactive ? 6000 : 3500);
    };

    window.addEventListener("algo-rich:zyra-wrong-answer", handleWrongAnswer);
    return () => window.removeEventListener("algo-rich:zyra-wrong-answer", handleWrongAnswer);
  }, [open]);

  // A lightweight local-time reminder; the server remains the source of truth for streaks.
  useEffect(() => {
    const scheduleEveningNudge = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(20, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return window.setTimeout(() => {
        const today = new Date().toISOString().slice(0, 10);
        if (localStorage.getItem("algo-rich:last-solved-date") !== today && !open) {
          setBubble("No solve yet today. Ten focused minutes beats a perfect plan.");
          setMood("thinking");
        }
        scheduleEveningNudge();
      }, Math.max(1000, next.getTime() - now.getTime()));
    };
    const timer = scheduleEveningNudge();
    return () => window.clearTimeout(timer);
  }, [open]);

  const getZyraResponse = (userText: string): string => {
    const lower = userText.toLowerCase();
    if (
      lower.includes("hint") ||
      lower.includes("help") ||
      lower.includes("stuck")
    ) {
      setMood("thinking");
      setTimeout(() => setMood("idle"), 2000);
      return randomFrom(HINT_RESPONSES);
    }
    if (
      lower.includes("motivat") ||
      lower.includes("tired") ||
      lower.includes("give up")
    ) {
      setMood("naughty");
      setTimeout(() => setMood("idle"), 2000);
      return "Tired? Good. That means you're actually working.\nPush through this one. The next one gets easier.";
    }
    if (lower.includes("pattern")) {
      setMood("thinking");
      setTimeout(() => setMood("idle"), 2000);
      return context === "problem"
        ? "Look at the constraints. Small n? Brute force might work.\nLarge n? You probably need O(n) or O(n log n).\nWhat does the problem want to minimize or maximize?"
        : "Most DSA problems map to 15 patterns. Two pointers, sliding window, BFS, DFS, DP...\nWhich one feels closest to what you're seeing?";
    }
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
      setMood("happy");
      setTimeout(() => setMood("idle"), 1500);
      return "You called me? Alright… let's fix this.";
    }
    if (
      lower.includes("wrong") ||
      lower.includes("fail") ||
      lower.includes("error")
    ) {
      setMood("naughty");
      setTimeout(() => setMood("idle"), 2000);
      return randomFrom(STUCK_RESPONSES);
    }
    // Occasionally be naughty
    if (Math.random() < 0.2) {
      setMood("naughty");
      setTimeout(() => setMood("idle"), 2000);
      return randomFrom(NAUGHTY_REMARKS);
    }
    return randomFrom(HINT_RESPONSES);
  };

  const handleOpen = () => {
    setOpen(true);
    setMood("happy");
    if (messages.length === 0) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(randomFrom(GREETINGS), "zyra");
          setMood("idle");
        }, 1200);
      }, 300);
    } else {
      setTimeout(() => setMood("idle"), 1000);
    }
  };

  const handleSend = async (text: string) => {
    const normalizedText = text.trim().slice(0, 2_000);
    if (!normalizedText || isTyping) return;

    const userMessage: ZyraMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: normalizedText,
      from: "user",
    };
    const history = [...messages, userMessage].slice(-12);
    setMessages((prev) => [...prev, userMessage].slice(-30));
    setIsTyping(true);
    setMood("thinking");

    try {
      const response = await fetch("/api/zyra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((message) => ({
            role: message.from === "user" ? "user" : "zyra",
            text: message.text,
          })),
          context,
          problemTitle,
          problemDescription,
          userCode,
          lastError,
        }),
      });
      const data = (await response.json().catch(() => null)) as { reply?: unknown; mood?: unknown } | null;
      if (!response.ok || typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error("Zyra request failed");
      }

      const serverMood = data.mood;
      if (serverMood === "idle" || serverMood === "thinking" || serverMood === "happy" || serverMood === "naughty" || serverMood === "alert") {
        setMood(serverMood);
      } else {
        setMood("idle");
      }
      addMessage(data.reply.trim().slice(0, 2_000), "zyra");
      recordDailyQuestProgress("zyra");
      analytics.track("zyra_hint_requested", { text: normalizedText, context, source: "gemini" });
    } catch {
      const fallback = getZyraResponse(normalizedText);
      addMessage(fallback, "zyra");
      recordDailyQuestProgress("zyra");
      analytics.track("zyra_hint_requested", { text: normalizedText, context, source: "fallback" });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50 flex flex-col items-end`}>
      {/* Level-Up Floating Portal Bubble */}
      {levelUpModal && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setLevelUpModal(null)}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              setLevelUpModal(null);
            }}
            className="bg-[#0f1629] border-2 border-[#E5A829] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4 cursor-pointer"
          >
            <ZyraStar mood="happy" onClick={() => { }} />
            <h3 className="text-xl font-bold text-[#E5A829]">Level Up!</h3>
            <p className="text-white text-sm font-medium">{levelUpModal}</p>
            <button className="px-5 py-2 rounded-full bg-[#E5A829] text-[#0a0f24] font-bold text-xs hover:opacity-90">
              Awesome!
            </button>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Speech bubble (auto-triggered) */}
      <AnimatePresence>
        {bubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="mb-3 max-w-[220px] px-3 py-2.5 rounded-2xl text-xs leading-relaxed text-white cursor-pointer"
            style={{
              background: "#0f1629",
              border: "1px solid #E5A82960",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
            onClick={handleOpen}
          >
            {bubble}
            <div
              className="absolute bottom-[-7px] right-6 w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "7px solid #E5A82960",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            onClose={() => {
            }}
            isTyping={isTyping}
            isMobile={isMobile}
            disabled={isTyping}
          />
        )}
      </AnimatePresence>

      {/* Zyra star */}
      <ZyraStar
        mood={mood}
        onClick={open ? () => setOpen(false) : handleOpen}
      />
    </div>
  );
}

export default function Zyra(props: ZyraProps) {
  return (
    <ErrorBoundary componentName="Zyra Mascot">
      <ZyraComponent {...props} />
    </ErrorBoundary>
  );
}
