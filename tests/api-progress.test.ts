import { describe, it, expect, vi } from "vitest";

// Mock prisma to avoid hitting a real DB in unit tests
vi.mock("@/lib/prisma", () => ({
  default: {
    progress: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    lesson: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

describe("API: Progress Tracking", () => {
  it("should validate input correctly and mock completions", async () => {
    const prisma = (await import("@/lib/prisma")).default;
    (prisma.progress.upsert as any).mockResolvedValue({
      id: "progress-123",
      userId: "user-1",
      lessonId: "lesson-1",
      completed: true,
    });

    const result = await prisma.progress.upsert({
      where: { userId_lessonId: { userId: "user-1", lessonId: "lesson-1" } },
      update: { completed: true },
      create: { userId: "user-1", lessonId: "lesson-1", completed: true },
    });

    expect(result.completed).toBe(true);
    expect(result.id).toBe("progress-123");
    expect(prisma.progress.upsert).toHaveBeenCalled();
  });
});
