import { NextResponse } from "next/server";
import { enforceRateLimit, clientAddress } from "@/lib/rateLimit";
import { auth } from "@/lib/auth";
import {
  ZYRA_SYSTEM_PROMPT,
  zyraFallback,
  detectMoodFromReply,
} from "@/lib/zyraPersonality";

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
const GROQ_TIMEOUT_MS = 10_000;

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
        {
          reply: "Whoa, slow down! Take a breath, think through what you know, then come back. Rushing never helped anyone crack DSA. 😏",
          mood: "naughty",
        },
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

    const problemTitle =
      typeof body.problemTitle === "string" && body.problemTitle.length <= 200
        ? body.problemTitle
        : undefined;
    const problemDescription =
      typeof body.problemDescription === "string" && body.problemDescription.length <= MAX_DESCRIPTION_LENGTH
        ? body.problemDescription
        : undefined;
    const userCode =
      typeof body.userCode === "string" && body.userCode.length <= MAX_CODE_LENGTH
        ? body.userCode
        : undefined;
    const lastError =
      typeof body.lastError === "string" && body.lastError.length <= MAX_ERROR_LENGTH
        ? body.lastError
        : undefined;
    const context =
      typeof body.context === "string" ? body.context.slice(0, 100) : undefined;

    const apiKey = (process.env.GROQ_API_KEY || "").trim();

    // ── Build rich contextual system addendum ─────────────────────────────────
    let contextAddendum = "";

    if (context) {
      const ctxLabels: Record<string, string> = {
        problem: "The student is on the Problem Solving page, working on a specific coding problem.",
        session: "The student is inside a structured learning session — they're studying a concept, not just solving randomly.",
        dashboard: "The student is on their dashboard. They may want study strategy advice, motivation, or to pick what to focus on.",
      };
      contextAddendum += `\n\nCONTEXT: ${ctxLabels[context] || `Learning context: ${context}`}`;
    }

    if (problemTitle) {
      contextAddendum += `\n\nPROBLEM TITLE: "${problemTitle}"`;
    }

    if (problemDescription) {
      contextAddendum += `\nPROBLEM DESCRIPTION:\n${problemDescription}`;
    }

    if (userCode) {
      contextAddendum += `\n\nSTUDENT'S CURRENT CODE:\n\`\`\`python\n${userCode}\n\`\`\`\nWhen relevant, comment specifically on their code — don't give generic advice.`;
    }

    if (lastError) {
      contextAddendum += `\n\nLAST ERROR / EXECUTION OUTPUT:\n${lastError}\nHelp them isolate what caused this specific error.`;
    }

    const fullSystemInstruction = ZYRA_SYSTEM_PROMPT + contextAddendum;

    // ── Call Groq API ────────────────────────────────────────────────────────
    if (apiKey) {
      const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: fullSystemInstruction },
      ];

      for (const m of messages) {
        chatMessages.push({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        });
      }

      // Ensure conversation ends with a user turn
      if (chatMessages.length === 1) {
        chatMessages.push({ role: "user", content: "Hi Zyra, I need help with DSA." });
      }
      if (chatMessages[chatMessages.length - 1].role !== "user") {
        chatMessages.push({ role: "user", content: "Please continue." });
      }

      // Primary: llama-3.3-70b-versatile (best quality)
      // Fallback: llama-3.1-8b-instant (faster, lower rate-limit pressure)
      const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

      for (const modelName of models) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);
          let res: Response;
          try {
            res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: modelName,
                messages: chatMessages,
                max_tokens: 500,
                temperature: 0.75,
                // Stop sequences to keep replies concise
                stop: ["\n\n\n", "---"],
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeout);
          }

          if (res.ok) {
            const data = await res.json();
            const rawReply: string =
              data.choices?.[0]?.message?.content?.trim() ?? "";

            if (!rawReply) continue;

            // Cap reply to 2000 chars
            const reply = rawReply.slice(0, 2_000);

            // Use smart mood detection
            const mood = detectMoodFromReply(reply);

            return NextResponse.json({ reply, mood });
          } else {
            const errText = await res.text();
            console.warn(
              `[Zyra Groq API] ${modelName} returned ${res.status}:`,
              errText.slice(0, 300)
            );
          }
        } catch (e) {
          if ((e as Error)?.name === "AbortError") {
            console.warn(`[Zyra Groq API] ${modelName} timed out after ${GROQ_TIMEOUT_MS}ms`);
          } else {
            console.warn(`[Zyra Groq API] ${modelName} request failed:`, e);
          }
        }
      }
    }

    // ── Smart local fallback ──────────────────────────────────────────────────
    const fallback = zyraFallback({
      message: messages.filter((m) => m.role === "user").pop()?.text ?? "",
      problemTitle,
      userCode,
      lastError,
      context,
    });
    return NextResponse.json(fallback);
  } catch (error) {
    console.error("[Zyra API Error]", error);
    return NextResponse.json(
      {
        reply: "Something went wrong on my end. Try again in a second — and use that time to re-read the problem statement. 😏",
        mood: "alert",
      },
      { status: 500 }
    );
  }
}
