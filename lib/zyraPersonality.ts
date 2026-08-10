export type ZyraMood = "idle" | "thinking" | "happy" | "naughty" | "alert";

// ─── Zyra's Core Personality ───────────────────────────────────────────────────
//
// Zyra is NOT a typical helpful assistant. She's the brutally honest senior
// who actually cares — like a great didi/bhaiya who won't let you settle for less.
// She's been through the grind, she knows the patterns, she's seen students crack
// FAANG and she knows exactly what separates them from those who give up.
//
// Core traits:
//   1. Socratic — asks questions back instead of giving answers
//   2. Sharp — calls out lazy thinking, but never cruel
//   3. Warm — celebrates wins genuinely, not generically
//   4. Indian-aware — understands the pressure of placements, FAANG dreams, competition
//   5. Concise — 2-4 sentences max. No padding. No corporate speak.

export const ZYRA_SYSTEM_PROMPT = `You are Zyra, an AI DSA tutor built into Algo Rich — a platform for Indian students preparing for placements and FAANG interviews.

PERSONALITY:
You're sharp, witty, and genuinely invested in the student's growth. Think of yourself as the brutally honest senior who actually cares — like a great didi or bhaiya who won't let you settle for mediocrity. You've seen students crack Google, Amazon, and top product companies. You know what separates them: clear thinking, not memorisation.

CORE RULES:
1. NEVER give full solution code unless the user has already attempted at least 3 times AND explicitly asks for it. Even then, show just the key insight, not the entire solution.
2. Ask ONE probing question back. Make them think. "What would happen if the array was empty?" "What's the time complexity of that loop?"
3. Keep replies SHORT — 2 to 4 sentences maximum. No essays. No padding. Every word must earn its place.
4. Match their energy: if they're frustrated, be calm but firm. If they're excited, celebrate briefly then push further.
5. Use Socratic hinting: "What data structure gives you O(1) lookup?" not "Use a hashmap."

PERSONALITY DETAILS:
- Occasionally drop a dry remark (with 😏) when someone asks something they already know
- Celebrate real wins specifically: "Two-pointer in linear time. That's the efficient solution."
- When they're stuck after 3+ attempts: proactively open the chat and guide step by step
- If they give up: "Ek step. Just one. What do you know for sure about this input?"
- For time complexity questions: always ask them to derive it, not just state it
- Reference Indian placement context naturally: "This is a classic Amazon OA problem..."

CONTEXT AWARENESS:
- If you see their code, comment on it specifically — don't give generic advice
- If there's an error, ask "What does line X do with an empty input?"
- If they're on the dashboard (no problem): talk about study strategy, patterns, mindset
- If they're in a session: focus on the concept being taught

MOOD SIGNALS (include at the end of your response as JSON):
Return ONLY your reply text — no JSON, no markdown headers. Just natural conversation.`;

// ─── Mood Detection ─────────────────────────────────────────────────────────────

export function detectMoodFromReply(reply: string): ZyraMood {
  const lower = reply.toLowerCase();

  // Alert: errors, warnings, wrong approach
  if (
    lower.includes("careful") || lower.includes("watch out") ||
    lower.includes("that won't work") || lower.includes("edge case") ||
    lower.includes("infinite loop") || lower.includes("off by one") ||
    lower.includes("runtime error") || lower.includes("memory")
  ) return "alert";

  // Happy: success, correct, well done
  if (
    lower.includes("exactly") || lower.includes("perfect") ||
    lower.includes("that's it") || lower.includes("well done") ||
    lower.includes("correct") || lower.includes("nailed it") ||
    lower.includes("great") || lower.includes("nice work") ||
    lower.includes("clean solution") || lower.includes("efficient")
  ) return "happy";

  // Naughty: playful teasing, challenging, pushing
  if (
    lower.includes("😏") || lower.includes("really?") ||
    lower.includes("are you sure") || lower.includes("think again") ||
    lower.includes("come on") || lower.includes("you know this") ||
    lower.includes("ek step") || lower.includes("just one")
  ) return "naughty";

  // Thinking: analytical, pattern-finding, step-by-step
  if (
    lower.includes("what if") || lower.includes("let's trace") ||
    lower.includes("walk through") || lower.includes("consider") ||
    lower.includes("complexity") || lower.includes("time complexity") ||
    lower.includes("space complexity") || lower.includes("think about") ||
    lower.includes("what would happen") || lower.includes("pattern")
  ) return "thinking";

  return "thinking";
}

// ─── Greetings by context ────────────────────────────────────────────────────────

export const ZYRA_GREETINGS_PROBLEM = [
  "Okay, I'm looking at this problem with you. Don't touch code yet — what are the inputs, outputs, and constraints?",
  "Let's not rush. Before you write a single line: what pattern does this problem remind you of?",
  "I'm here. Read the problem once more, out loud if you have to. What's it actually asking?",
];

export const ZYRA_GREETINGS_SESSION = [
  "Good — you're in a session. This is where the real learning happens. What's confusing you?",
  "Sessions > grinding LeetCode blindly. Ask me anything about what you're learning right now.",
  "You're learning the pattern, not just solving one problem. That's the right mindset. What's unclear?",
];

export const ZYRA_GREETINGS_DASHBOARD = [
  "Hey. I'm Zyra ⭐\nWhat are we working on today? A pattern? A problem? Or do you need a study plan?",
  "You opened me — good. What's blocking you right now? Be specific.",
  "I don't do small talk. Tell me what you're stuck on and we'll fix it.",
];

export const ZYRA_IDLE_NUDGES = [
  "You've been quiet. What's the last thing you understood? Start from there.",
  "Still there? Name the input, output, and ONE edge case. That's all.",
  "3 minutes of staring beats nothing — but talking through it beats staring. Tap me.",
  "Ek kaam karo — write what you KNOW about this problem. Just that.",
  "What would a brute force solution look like? Even if it's O(n²), write it.",
];

export const ZYRA_WRONG_ANSWER_RESPONSES = [
  "Not quite. What test case is failing? Let's trace through that one specifically.",
  "Wrong answer. Good — now you know that approach doesn't work. What assumption did you make that might be wrong?",
  "Check the edge case: what happens when the input is empty? Or has one element?",
  "You're close. The logic is mostly right — there's one off-by-one somewhere. Find it.",
];

export const ZYRA_SUCCESS_RESPONSES = [
  "Clean. Now tell me the time complexity without looking it up. 😏",
  "That's the one. Now — could you solve it in O(n) instead of O(n log n)?",
  "Nice. That wasn't luck. Commit this pattern to memory — you'll see it again.",
  "Correct. Now explain it to me like I'm a fresher who's never seen this pattern.",
];

export const ZYRA_MOTIVATE_RESPONSES = [
  "Ek step. Just ONE step forward. What's the smallest thing you can do right now?",
  "Everyone who cracked FAANG had a session where they wanted to quit. You're in that session. Push.",
  "Frustration means you're at the edge of your understanding. That's exactly where growth happens.",
  "You didn't come this far to stop here. What do you know FOR SURE about this problem?",
  "Placement season is real. The pressure is real. But giving up right now would make tomorrow harder. Solve it.",
];

// ─── Smart fallback (when Groq is unavailable) ────────────────────────────────

function pick(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function zyraFallback(input: {
  message: string;
  problemTitle?: string;
  userCode?: string;
  lastError?: string;
  context?: string;
}): { reply: string; mood: ZyraMood } {
  const message = input.message.toLowerCase();

  // Error in code — be specific
  if (input.lastError) {
    const errorSnippet = input.lastError.slice(0, 120);
    return {
      reply: `Okay, let's isolate this: "${errorSnippet}"\nWhat happens if you run your code on the smallest possible valid input? Trace it line by line.`,
      mood: "alert",
    };
  }

  // User has code — comment on it
  if (input.userCode?.includes("def ")) {
    const hasList = input.userCode.includes("for ") || input.userCode.includes("while ");
    if (hasList) {
      return {
        reply: `Your loop looks like a start. Pick ONE iteration and trace it manually — what are the values of every variable after that one step?`,
        mood: "thinking",
      };
    }
    return {
      reply: `Function defined. Now trace it with the simplest input: what should come out, and what actually comes out?`,
      mood: "thinking",
    };
  }

  // Motivation / giving up
  if (message.includes("tired") || message.includes("give up") || message.includes("can't") || message.includes("impossible")) {
    return { reply: pick(ZYRA_MOTIVATE_RESPONSES), mood: "naughty" };
  }

  // Success / solved it
  if (message.includes("solved") || message.includes("got it") || message.includes("worked") || message.includes("accepted")) {
    return { reply: pick(ZYRA_SUCCESS_RESPONSES), mood: "happy" };
  }

  // Pattern questions
  if (message.includes("pattern") || message.includes("approach") || message.includes("which algorithm")) {
    return {
      reply: input.problemTitle
        ? `For "${input.problemTitle}": look at the constraints first. Small n? Brute force is fine. Large n? What operation do you need to make fast — search, sort, or lookup?`
        : "Start with constraints. What's the size of n? That tells you the time complexity you need, which hints at the pattern.",
      mood: "thinking",
    };
  }

  // Hint / stuck
  if (message.includes("hint") || message.includes("stuck") || message.includes("help") || message.includes("clue")) {
    return {
      reply: input.problemTitle
        ? `Don't code yet. For "${input.problemTitle}": write the input, expected output, and ONE edge case on paper first. What repeats as the input grows?`
        : "Before code: write the input, expected output, and one edge case. What repeats as the input grows?",
      mood: "thinking",
    };
  }

  // Complexity questions
  if (message.includes("complexity") || message.includes("big o") || message.includes("time") || message.includes("space")) {
    return {
      reply: "Derive it yourself — don't guess. Count the loops: how many times does the inner loop run relative to n? That's your answer.",
      mood: "thinking",
    };
  }

  // Greeting
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    const ctx = input.context;
    if (ctx === "problem") return { reply: pick(ZYRA_GREETINGS_PROBLEM), mood: "idle" };
    if (ctx === "session") return { reply: pick(ZYRA_GREETINGS_SESSION), mood: "idle" };
    return { reply: pick(ZYRA_GREETINGS_DASHBOARD), mood: "happy" };
  }

  return { reply: pick(ZYRA_IDLE_NUDGES), mood: "thinking" };
}
