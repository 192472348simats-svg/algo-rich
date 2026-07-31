import { NextResponse } from "next/server";
import { enforceRateLimit, clientAddress } from "@/lib/rateLimit";
import { auth } from "@/lib/auth";

export interface ZyraChatPayload {
  messages: Array<{ role: "user" | "model" | "zyra"; text: string }>;
  context?: "dashboard" | "problem" | "session" | string;
  problemTitle?: string;
  problemDescription?: string;
  userCode?: string;
  lastError?: string;
}

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_DESCRIPTION_LENGTH = 1_500;
const MAX_CODE_LENGTH = 6_000;
const MAX_ERROR_LENGTH = 1_000;
const GEMINI_TIMEOUT_MS = 8_000;

const SYSTEM_PROMPT = `You are Zyra, a sharp, witty, and highly effective AI Data Structures & Algorithms (DSA) tutor for Algo Rich.

Personality & Rules:
1. Tone: Witty, encouraging, sharp, concise.
2. Goal: Coach the user to think like an engineer. NEVER provide full solution code directly unless explicitly requested after 3+ hints.
3. Hints over Answers: Give Socratic hints. Ask guiding questions: "What is the time complexity if you sort first?", "Notice any overlapping subproblems?", "What happens if both pointers start from opposite ends?"
4. Keep responses brief: 2 to 4 sentences maximum. Formatted cleanly with simple markdown.
5. If the user mentions feeling tired or wanting to give up, give them a short, punchy motivational push.`;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const ip = clientAddress(req.headers);
    const limit = await enforceRateLimit({
      scope: "zyra-chat",
      identifier: `${session.user.id}:${ip}`,
      limit: 20,
      windowMs: 60 * 1000,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { reply: "Whoa, slow down! Take a breath, think through your code, then ask me again in a moment.", mood: "naughty" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json().catch(() => null)) as Partial<ZyraChatPayload> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    if (rawMessages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: `A maximum of ${MAX_MESSAGES} messages is allowed` }, { status: 400 });
    }

    const messages = rawMessages.filter(
      (message): message is ZyraChatPayload["messages"][number] =>
        !!message &&
        typeof message === "object" &&
        (message.role === "user" || message.role === "model" || message.role === "zyra") &&
        typeof message.text === "string" &&
        message.text.trim().length > 0 &&
        message.text.length <= MAX_MESSAGE_LENGTH
    );
    if (messages.length !== rawMessages.length) {
      return NextResponse.json({ error: "Each message must have a valid role and short text" }, { status: 400 });
    }

    const problemTitle = typeof body.problemTitle === "string" ? body.problemTitle.slice(0, 200) : undefined;
    const problemDescription = typeof body.problemDescription === "string" ? body.problemDescription.slice(0, MAX_DESCRIPTION_LENGTH) : undefined;
    const userCode = typeof body.userCode === "string" ? body.userCode.slice(0, MAX_CODE_LENGTH) : undefined;
    const lastError = typeof body.lastError === "string" ? body.lastError.slice(0, MAX_ERROR_LENGTH) : undefined;
    const context = typeof body.context === "string" ? body.context.slice(0, 100) : undefined;

    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();

    // ── Build Contextual Instructions ─────────────────────────────────────
    let contextPrompt = "";
    if (context) {
      contextPrompt += `\nLearning context: ${context}`;
    }
    if (problemTitle) {
      contextPrompt += `\n\nCurrent Problem: ${problemTitle}`;
    }
    if (problemDescription) {
      contextPrompt += `\nProblem Description: ${problemDescription.slice(0, 500)}`;
    }
    if (userCode) {
      contextPrompt += `\nUser's Current Code:\n\`\`\`python\n${userCode.slice(0, 1000)}\n\`\`\``;
    }
    if (lastError) {
      contextPrompt += `\nUser's Last Error / Execution Output: ${lastError.slice(0, 300)}`;
    }

    const fullSystemInstruction = `${SYSTEM_PROMPT}${contextPrompt}`;

    // ── If Gemini API key is configured, call Gemini API ─────────────────────
    if (apiKey) {
      // 1. Convert messages & filter empty
      const rawContents = messages
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: m.text }],
        }))
        .filter((c) => c.parts[0].text.trim().length > 0);

      // 2. Gemini requires contents to START with "user"
      while (rawContents.length > 0 && rawContents[0].role !== "user") {
        rawContents.shift();
      }

      // If empty, add a default user message
      if (rawContents.length === 0) {
        rawContents.push({ role: "user", parts: [{ text: "Hi Zyra, can you help me with DSA?" }] });
      }

      // 3. Ensure strict role alternation (user -> model -> user -> model)
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
      for (const item of rawContents) {
        if (contents.length === 0) {
          contents.push(item);
        } else {
          const prev = contents[contents.length - 1];
          if (prev.role === item.role) {
            prev.parts[0].text += `\n${item.parts[0].text}`;
          } else {
            contents.push(item);
          }
        }
      }

      // Updated model list (supported by current Gemini API)
      const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"];

      for (const modelName of models) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
          let res: Response;
          try {
            res = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: fullSystemInstruction }],
                },
                contents,
                generationConfig: {
                  maxOutputTokens: 350,
                  temperature: 0.7,
                },
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeout);
          }

          if (res.ok) {
            const data = await res.json();
            const reply =
              data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
              "I'm analyzing your code... What pattern do you think fits best here?";

            let mood = "thinking";
            if (reply.toLowerCase().includes("great") || reply.toLowerCase().includes("nice") || reply.toLowerCase().includes("exactly")) {
              mood = "happy";
            } else if (reply.toLowerCase().includes("tired") || reply.toLowerCase().includes("push")) {
              mood = "naughty";
            }

            return NextResponse.json({ reply, mood });
          } else {
            const errText = await res.text();
            console.warn(`[Zyra Gemini API] ${modelName} returned ${res.status}:`, errText.slice(0, 200));
          }
        } catch (e) {
          console.warn(`[Zyra Gemini API] ${modelName} request failed:`, e);
        }
      }
    }

    // ── Fallback Socratic Response Generator ─────────────────────────────────
    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.text.toLowerCase() || "";

    let reply = "Look at the problem constraints. Small input size means brute force works, but for large N, what time complexity do you need?";
    let mood = "thinking";

    if (lastError) {
      reply = `I see an error: "${lastError.slice(0, 100)}". Check if your loop bounds are off or if an index is going out of range.`;
      mood = "alert";
    } else if (userCode && userCode.includes("def ")) {
      reply = "Your code structure looks like a good start! Walk through line by line with a small test case like `[1, 2, 3]`. What value does your function return?";
      mood = "thinking";
    } else if (lastUserMsg.includes("hint") || lastUserMsg.includes("stuck") || lastUserMsg.includes("help")) {
      reply = problemTitle
        ? `For "${problemTitle}", ask yourself: do you need to look at elements from both ends (Two Pointers), or keep a window of elements (Sliding Window)?`
        : "What data structure helps keep track of frequency or seen elements in O(1) time? A Hash Map is often your best friend!";
      mood = "thinking";
    } else if (lastUserMsg.includes("pattern")) {
      reply = "Most DSA problems fall into 15 patterns: Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, Binary Search, BFS/DFS, DP. Which one fits this problem's goal?";
      mood = "happy";
    } else if (lastUserMsg.includes("hi") || lastUserMsg.includes("hello") || lastUserMsg.includes("hey")) {
      reply = "Hey there! Ready to level up your DSA skills? What problem are we tackling today?";
      mood = "happy";
    }

    return NextResponse.json({ reply, mood });
  } catch (error) {
    console.error("[Zyra API Error]", error);
    return NextResponse.json(
      { reply: "My circuits flickered for a second! Try asking me again.", mood: "alert" },
      { status: 500 }
    );
  }
}
