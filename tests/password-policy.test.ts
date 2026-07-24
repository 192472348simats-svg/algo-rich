import { describe, expect, it } from "vitest";
import { isValidPassword } from "@/lib/passwordPolicy";

describe("password policy", () => {
  it("accepts a strong password", () => {
    expect(isValidPassword("AlgoRich#2026")).toBe(true);
  });

  it("rejects weak, non-string, and oversized passwords", () => {
    expect(isValidPassword("short1!")).toBe(false);
    expect(isValidPassword("allletters!")).toBe(false);
    expect(isValidPassword("12345678")).toBe(false);
    expect(isValidPassword("A1!".repeat(50))).toBe(false);
    expect(isValidPassword(null)).toBe(false);
  });
});
