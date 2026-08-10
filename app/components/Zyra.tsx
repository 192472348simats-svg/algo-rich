"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { analytics } from "@/lib/analytics";
import { recordDailyQuestProgress } from "@/app/dashboard/components/dailyQuestEvents";
import {
  zyraFallback,
  ZYRA_GREETINGS_PROBLEM,
  ZYRA_GREETINGS_SESSION,
  ZYRA_GREETINGS_DASHBOARD,
  ZYRA_IDLE_NUDGES,
  ZYRA_WRONG_ANSWER_RESPONSES,
  ZYRA_SUCCESS_RESPONSES,
  ZYRA_MOTIVATE_RESPONSES,
} from "@/lib/zyraPersonality";

// ─── Types ─────────────────────────────────────────────────

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

// ─── Quick action chips per context ───────────────────────

const CHIPS_PROBLEM = ["Give me a hint", "I'm stuck", "What's the pattern?", "Explain my error"];
const CHIPS_SESSION = ["What is this concept?", "Give me an example", "Why does this work?", "I'm stuck"];
const CHIPS_DASHBOARD = ["What should I study?", "Motivate me", "Which pattern next?", "How's my progress?"];

function getChips(context?: ZyraContext) {
  if (context === "problem") return CHIPS_PROBLEM;
  if (context === "session") return CHIPS_SESSION;
  return CHIPS_DASHBOARD;
}

function getGreetings(context?: ZyraContext) {
  if (context === "problem") return ZYRA_GREETINGS_PROBLEM;
  if (context === "session") return ZYRA_GREETINGS_SESSION;
  return ZYRA_GREETINGS_DASHBOARD;
}

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
      <circle cx="16.5" cy={eyeY - 1} r="1" fill="white" opacity="0.8" />
      {/* Right eye */}
      <motion.ellipse
        cx="25" cy={eyeY} rx={mood === "alert" ? 4 : 3} ry={mood === "alert" ? 4.5 : 3.5}
        fill="#7a4f00"
        animate={{ scaleY: mood === "thinking" ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
      />
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

// ─── Typing dots ──────────────────────────────────────────

function TypingDots() {
  return (
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
  );
}

// ─── Message bubble ───────────────────────────────────────

function MessageBubble({ msg }: { msg: ZyraMessage }) {
  const isZyra = msg.from === "zyra";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isZyra ? "justify-start" : "justify-end"}`}
    >
      <div
        className="max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed"
        style={{
          background: isZyra ? "#140f00" : "#0e2040",
          color: isZyra ? "#f5e6c0" : "#c8d8f0",
          border: `1px solid ${isZyra ? "#E5A82930" : "#1E4A7F"}`,
          whiteSpace: "pre-line",
          overflowWrap: "anywhere",
        }}
      >
        {isZyra && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest mb-1 opacity-60 text-[#E5A829]">
            <Sparkles size={9} /> ZYRA
          </span>
        )}
        <div>{msg.text}</div>
      </div>
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
  context,
}: {
  messages: ZyraMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
  isTyping: boolean;
  isMobile: boolean;
  disabled: boolean;
  context?: ZyraContext;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-focus input when panel opens
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const chips = getChips(context);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`absolute bottom-20 right-0 ${isMobile ? "w-[calc(100vw-2rem)]" : "w-[340px]"} rounded-2xl overflow-hidden shadow-2xl flex flex-col`}
      style={{
        background: "#0a0d1a",
        border: "1px solid #E5A82940",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(229,168,41,0.08)",
        height: "min(72dvh, 540px)",
        maxHeight: "calc(100dvh - 100px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid #1a2840", background: "#070a14" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#3a2000" }}
          >
            Z
          </div>
          <div>
            <span className="text-sm font-bold text-white">Zyra</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">AI DSA Tutor · Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Zyra"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
          style={{ color: "#6b7a99" }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 flex flex-col gap-2.5 p-3.5 overflow-y-auto overscroll-contain scrollbar-thin">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="text-3xl">⭐</div>
            <p className="text-xs text-white/40 leading-relaxed">
              Zyra is your Socratic DSA guide.<br />She won't give you answers — she'll make you think.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Quick action chips */}
      <div className="flex gap-1.5 px-3.5 pb-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {chips.map((chip, index) => (
          <motion.button
            key={chip}
            onClick={() => onSend(chip)}
            disabled={disabled}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
            style={{
              background: "#1a1400",
              color: "#E5A829",
              border: "1px solid #E5A82930",
              whiteSpace: "nowrap",
            }}
          >
            {chip}
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-3 pb-3 flex-shrink-0">
        <input
          ref={inputRef}
          id="zyra-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={disabled ? "Zyra is thinking..." : "Ask Zyra anything..."}
          disabled={disabled}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-[#4a5570] focus:outline-none transition-all"
          style={{ background: "#070a14", border: "1px solid #1E3A5F" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#E5A829")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#1E3A5F")}
        />
        <motion.button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
          style={{ background: input.trim() && !disabled ? "#E5A829" : "#3a3010" }}
        >
          <Send size={14} color={input.trim() && !disabled ? "#0a0f24" : "#E5A82960"} />
        </motion.button>
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

  // Live context from problem solver events
  const [liveProblemContext, setLiveProblemContext] = useState<
    Pick<ZyraProps, "problemTitle" | "problemDescription" | "userCode" | "lastError">
  >({ problemTitle, problemDescription, userCode, lastError });

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const restoredStateRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;

  // ── Mobile detection ──────────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ── Restore persisted state ───────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zyra_state");
      if (!saved) return;
      const state: unknown = JSON.parse(saved);
      if (!state || typeof state !== "object") return;
      const candidate = state as { messages?: unknown; hasGreeted?: unknown };
      if (Array.isArray(candidate.messages)) {
        const restored = candidate.messages
          .filter(
            (m): m is ZyraMessage =>
              !!m &&
              typeof m === "object" &&
              typeof (m as ZyraMessage).id === "string" &&
              typeof (m as ZyraMessage).text === "string" &&
              ((m as ZyraMessage).from === "user" || (m as ZyraMessage).from === "zyra")
          )
          .slice(-30);
        setMessages(restored);
      }
      if (typeof candidate.hasGreeted === "boolean") setHasGreeted(candidate.hasGreeted);
    } catch {
      localStorage.removeItem("zyra_state");
    } finally {
      restoredStateRef.current = true;
    }
  }, []);

  // ── Persist state ─────────────────────────────────────────
  useEffect(() => {
    if (!restoredStateRef.current) return;
    localStorage.setItem("zyra_state", JSON.stringify({ messages, hasGreeted }));
  }, [messages, hasGreeted]);

  // ── Listen for live problem context updates ────────────────
  useEffect(() => {
    const updateContext = (event: Event) => {
      const detail = (
        event as CustomEvent<Pick<ZyraProps, "problemTitle" | "problemDescription" | "userCode" | "lastError">>
      ).detail;
      if (detail && typeof detail === "object") setLiveProblemContext(detail);
    };
    window.addEventListener("algo-rich:zyra-context", updateContext);
    return () => window.removeEventListener("algo-rich:zyra-context", updateContext);
  }, []);

  // ── First greeting bubble (3s delay) ─────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasGreeted) {
        setHasGreeted(true);
        const greeting = context === "problem"
          ? "Stuck? Don't code yet — tell me what you know about this problem first. ⭐"
          : "Hey… I'm Zyra ⭐  Tap me if you need a push.";
        setBubble(greeting);
        setMood("happy");
        setTimeout(() => { setBubble(null); setMood("idle"); }, 4500);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [hasGreeted, context]);

  // ── Idle nudge after 3 min ────────────────────────────────
  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!openRef.current) {
          setBubble(randomFrom(ZYRA_IDLE_NUDGES));
          setMood("thinking");
          setTimeout(() => { setBubble(null); setMood("idle"); }, 5000);
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
  }, []);

  // ── Evening nudge at 8 PM IST ────────────────────────────
  useEffect(() => {
    const scheduleEveningNudge = (): ReturnType<typeof setTimeout> => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(20, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return setTimeout(() => {
        const today = new Date().toISOString().slice(0, 10);
        if (localStorage.getItem("algo-rich:last-solved-date") !== today && !openRef.current) {
          setBubble("No solve yet today. Ek problem — 10 minutes. That's all.");
          setMood("naughty");
          setTimeout(() => { setBubble(null); setMood("idle"); }, 5000);
        }
        scheduleEveningNudge();
      }, Math.max(1000, next.getTime() - now.getTime()));
    };
    const timer = scheduleEveningNudge();
    return () => clearTimeout(timer);
  }, []);

  const addMessage = (text: string, from: "zyra" | "user") => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, from },
    ].slice(-30));
  };

  // ── Celebration event ─────────────────────────────────────
  useEffect(() => {
    const handle = (event: Event) => {
      const message = (event as CustomEvent<{ message?: unknown }>).detail?.message;
      if (typeof message !== "string" || !message) return;
      const reply = randomFrom(ZYRA_SUCCESS_RESPONSES);
      setMood("happy");
      if (openRef.current) addMessage(reply, "zyra");
      setBubble(reply);
      setTimeout(() => { setBubble(null); setMood("idle"); }, 4500);
    };
    window.addEventListener("algo-rich:zyra-celebration", handle);
    return () => window.removeEventListener("algo-rich:zyra-celebration", handle);
  }, []);

  // ── Wrong answer event ────────────────────────────────────
  useEffect(() => {
    const handle = (event: Event) => {
      const attempts = (event as CustomEvent<{ attempts?: unknown }>).detail?.attempts;
      const isProactive = typeof attempts === "number" && attempts >= 3;
      const message = isProactive
        ? randomFrom(ZYRA_WRONG_ANSWER_RESPONSES)
        : "Not quite. Slow down — what test case is failing?";
      setMood("alert");
      setBubble(message);
      if (openRef.current || isProactive) addMessage(message, "zyra");
      if (isProactive) setOpen(true);
      setTimeout(() => { setBubble(null); setMood("idle"); }, isProactive ? 6000 : 3500);
    };
    window.addEventListener("algo-rich:zyra-wrong-answer", handle);
    return () => window.removeEventListener("algo-rich:zyra-wrong-answer", handle);
  }, []);

  // ── Open & greet ──────────────────────────────────────────
  const handleOpen = () => {
    setOpen(true);
    setMood("happy");
    if (messages.length === 0) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(randomFrom(getGreetings(context)), "zyra");
          setMood("idle");
        }, 900);
      }, 200);
    } else {
      setTimeout(() => setMood("idle"), 800);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setMood("idle"), 300);
  };

  // ── Send message ──────────────────────────────────────────
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

    // Use live context (updated by problem solver) over initial props
    const ctx = liveProblemContext;

    try {
      const response = await fetch("/api/zyra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.from === "user" ? "user" : "zyra",
            text: m.text,
          })),
          context,
          problemTitle: ctx.problemTitle,
          problemDescription: ctx.problemDescription,
          userCode: ctx.userCode,
          lastError: ctx.lastError,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        reply?: unknown;
        mood?: unknown;
      } | null;

      if (!response.ok || typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error("Zyra request failed");
      }

      const serverMood = data.mood;
      if (
        serverMood === "idle" || serverMood === "thinking" ||
        serverMood === "happy" || serverMood === "naughty" || serverMood === "alert"
      ) {
        setMood(serverMood as ZyraMood);
      } else {
        setMood("idle");
      }

      addMessage(data.reply.trim().slice(0, 2_000), "zyra");
      recordDailyQuestProgress("zyra");
      analytics.track("zyra_hint_requested", { text: normalizedText, context, source: "groq" });

      // Reset mood after 3s
      setTimeout(() => setMood("idle"), 3000);
    } catch {
      const fallback = zyraFallback({
        message: normalizedText,
        problemTitle: ctx.problemTitle,
        userCode: ctx.userCode,
        lastError: ctx.lastError,
        context,
      });
      addMessage(fallback.reply, "zyra");
      setMood(fallback.mood);
      recordDailyQuestProgress("zyra");
      analytics.track("zyra_hint_requested", { text: normalizedText, context, source: "fallback" });
      setTimeout(() => setMood("idle"), 3000);
    } finally {
      setIsTyping(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <div
      className={`fixed ${isMobile ? "bottom-4 right-4" : "bottom-6 right-6"} z-50 flex flex-col items-end`}
      style={{ pointerEvents: "none" }}
    >
      {/* Level-Up Modal Portal */}
      {levelUpModal && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          style={{ pointerEvents: "auto" }}
          onClick={() => setLevelUpModal(null)}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => { e.stopPropagation(); setLevelUpModal(null); }}
            className="bg-[#0f1629] border-2 border-[#E5A829] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4 cursor-pointer"
          >
            <ZyraStar mood="happy" onClick={() => { }} />
            <h3 className="text-xl font-bold text-[#E5A829]">Level Up!</h3>
            <p className="text-white text-sm font-medium">{levelUpModal}</p>
            <button className="px-5 py-2 rounded-full bg-[#E5A829] text-[#0a0f24] font-bold text-xs hover:opacity-90">
              Let's Go! ⭐
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
            className="mb-3 max-w-[230px] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed text-white cursor-pointer relative"
            style={{
              background: "#0a0d1a",
              border: "1px solid #E5A82950",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 20px rgba(229,168,41,0.06)",
              pointerEvents: "auto",
            }}
            onClick={handleOpen}
          >
            <span className="text-[#E5A829] font-bold text-[10px] block mb-0.5">Zyra ⭐</span>
            {bubble}
            <div
              className="absolute bottom-[-7px] right-6 w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "7px solid #E5A82950",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <div style={{ pointerEvents: "auto" }}>
            <ChatPanel
              messages={messages}
              onSend={handleSend}
              onClose={handleClose}
              isTyping={isTyping}
              isMobile={isMobile}
              disabled={isTyping}
              context={context}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Zyra star button */}
      <div style={{ pointerEvents: "auto" }}>
        <ZyraStar
          mood={mood}
          onClick={open ? handleClose : handleOpen}
        />
      </div>
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
