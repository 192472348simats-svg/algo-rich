type LocalEntry = { count: number; resetAt: number };

const localEntries = new Map<string, LocalEntry>();
const MAX_LOCAL_ENTRIES = 10_000;

export type RateLimitOptions = {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  backend: "upstash" | "memory";
};

async function keyFor(scope: string, identifier: string) {
  const bytes = new TextEncoder().encode(identifier);
  const digestBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const digest = Array.from(new Uint8Array(digestBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `algo-rich:rate-limit:${scope}:${digest}`;
}

function checkMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = localEntries.get(key);

  if (!existing || existing.resetAt <= now) {
    if (localEntries.size >= MAX_LOCAL_ENTRIES) {
      for (const [entryKey, entry] of localEntries) {
        if (entry.resetAt <= now) localEntries.delete(entryKey);
      }
      if (localEntries.size >= MAX_LOCAL_ENTRIES) localEntries.clear();
    }
    localEntries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0, backend: "memory" };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    backend: "memory",
  };
}

/**
 * Fixed-window limiter. With UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN configured it is shared across server instances.
 */
export async function enforceRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const key = await keyFor(options.scope, options.identifier);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return checkMemory(key, options.limit, options.windowMs);

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, options.windowMs, "NX"],
        ["PTTL", key],
      ]),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Upstash returned ${response.status}`);

    const results = (await response.json()) as Array<{ result?: number }>;
    const count = Number(results[0]?.result);
    const ttlMs = Number(results[2]?.result);
    if (!Number.isFinite(count)) throw new Error("Upstash returned an invalid count");

    return {
      allowed: count <= options.limit,
      retryAfterSeconds: Math.max(1, Math.ceil((ttlMs > 0 ? ttlMs : options.windowMs) / 1000)),
      backend: "upstash",
    };
  } catch (error) {
    console.warn("[rate-limit] Upstash unavailable; using per-instance fallback", error instanceof Error ? error.message : error);
    return checkMemory(key, options.limit, options.windowMs);
  }
}

export function clientAddress(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? "").split(",")[0].trim()
    || headers.get("x-real-ip")
    || "unknown";
}
