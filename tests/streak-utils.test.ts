import { describe, it, expect } from "vitest";
import { computeStreak } from "../lib/streakUtils";

describe("Streak Utils: computeStreak", () => {
  it("should return streak 0 and practicedToday false for no activity", () => {
    const res = computeStreak([]);
    expect(res.currentStreak).toBe(0);
    expect(res.practicedToday).toBe(false);
  });

  it("should return streak 1 and practicedToday true if only today", () => {
    const today = new Date().toISOString().slice(0, 10);
    const res = computeStreak([today]);
    expect(res.currentStreak).toBe(1);
    expect(res.practicedToday).toBe(true);
  });

  it("should handle consecutive days correctly", () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const res = computeStreak(dates);
    expect(res.currentStreak).toBe(4);
    expect(res.practicedToday).toBe(true);
  });

  it("should break streak on missing day", () => {
    const dates: string[] = [];
    const today = new Date();
    
    // Today
    dates.push(today.toISOString().slice(0, 10));
    // Yesterday
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    dates.push(yesterday.toISOString().slice(0, 10));
    // Missing day before yesterday, but has the day before that
    const dayThree = new Date(today);
    dayThree.setUTCDate(dayThree.getUTCDate() - 3);
    dates.push(dayThree.toISOString().slice(0, 10));

    const res = computeStreak(dates);
    // Streak is only 2 because of the gap at day 2 (UTC index 2)
    expect(res.currentStreak).toBe(2);
    expect(res.practicedToday).toBe(true);
  });

  it("keeps yesterday's streak visible until today is missed", () => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const res = computeStreak([yesterday.toISOString().slice(0, 10)]);
    expect(res.currentStreak).toBe(1);
    expect(res.practicedToday).toBe(false);
  });
});
