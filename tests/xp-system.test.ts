import { describe, it, expect } from "vitest";
import { getLevelForXP, getStreakBonus, LEVELS } from "../lib/xpSystem";

describe("XP System: Level calculation", () => {
  it("should return Level 1 for 0 XP", () => {
    const info = getLevelForXP(0);
    expect(info.current.level).toBe(1);
    expect(info.current.title).toBe("Seedling");
    expect(info.next?.level).toBe(2);
    expect(info.progress).toBe(0);
  });

  it("should return Level 2 for 150 XP", () => {
    const info = getLevelForXP(150);
    expect(info.current.level).toBe(2);
    expect(info.current.title).toBe("Sprout");
    expect(info.next?.level).toBe(3);
    // 150 XP is 50 XP into Level 2. Level 2 needs 100 to 300 (diff is 200). Progress should be 50 / 200 = 0.25
    expect(info.progress).toBe(0.25);
  });

  it("should cap progress at 1 for max level", () => {
    const info = getLevelForXP(20000);
    expect(info.current.level).toBe(12);
    expect(info.current.title).toBe("Universe");
    expect(info.next).toBeNull();
    expect(info.progress).toBe(1);
  });
});

describe("XP System: Streak bonuses", () => {
  it("should reward 0 for streaks under 3", () => {
    expect(getStreakBonus(0)).toBe(0);
    expect(getStreakBonus(1)).toBe(0);
    expect(getStreakBonus(2)).toBe(0);
  });

  it("should reward 5 XP for a streak of 3", () => {
    expect(getStreakBonus(3)).toBe(5);
    expect(getStreakBonus(4)).toBe(5);
  });

  it("should reward 15 XP for a streak of 5", () => {
    expect(getStreakBonus(5)).toBe(15);
    expect(getStreakBonus(9)).toBe(15);
  });

  it("should reward 30 XP for a streak of 10 or more", () => {
    expect(getStreakBonus(10)).toBe(30);
    expect(getStreakBonus(25)).toBe(30);
  });
});
