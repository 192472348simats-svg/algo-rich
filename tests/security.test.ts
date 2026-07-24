import { describe, it, expect, vi } from "vitest";

// Mock auth to avoid deep dependency on next/server in pure unit tests
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { isAdmin } from "@/lib/isAdmin";

// Mock environment variables
vi.stubEnv("ADMIN_EMAILS", "admin@algorich.com,master@algorich.com");

describe("Security: isAdmin Utility", () => {
  it("should return true for an email in ADMIN_EMAILS", () => {
    expect(isAdmin("admin@algorich.com")).toBe(true);
    expect(isAdmin("master@algorich.com")).toBe(true);
  });

  it("should return false for an email not in ADMIN_EMAILS", () => {
    expect(isAdmin("user@example.com")).toBe(false);
  });

  it("should return false for null or undefined", () => {
    expect(isAdmin(null as any)).toBe(false);
    expect(isAdmin(undefined as any)).toBe(false);
  });

  it("should be case-insensitive", () => {
    expect(isAdmin("ADMIN@ALGORICH.COM")).toBe(true);
  });
});
