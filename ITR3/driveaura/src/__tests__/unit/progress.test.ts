/**
 * UNIT TESTS — Lesson Progress
 * User Story: Learning Modules (All Licence Levels)
 *
 * Tests localStorage-based lesson tracking functions.
 * jsdom provides a mock localStorage automatically.
 */

import {
  isLessonComplete,
  setLessonComplete,
  getCompletedLessonsForModule,
  areAllLessonsComplete,
  clearModuleProgress,
  getCompletedLessonKeys,
} from "@/app/modules/progress";

// Clear localStorage before every test so tests don't affect each other
beforeEach(() => {
  localStorage.clear();
});

// ─── isLessonComplete ─────────────────────────────────────────────────────────

describe("isLessonComplete", () => {
  test("returns false for a lesson that has not been completed", () => {
    expect(isLessonComplete("g1-signs", "1")).toBe(false);
  });

  test("returns true after marking a lesson complete", () => {
    setLessonComplete("g1-signs", "1");
    expect(isLessonComplete("g1-signs", "1")).toBe(true);
  });

  test("completing lesson '1' does not affect lesson '2'", () => {
    setLessonComplete("g1-signs", "1");
    expect(isLessonComplete("g1-signs", "2")).toBe(false);
  });

  test("completing a lesson in one module does not affect another module", () => {
    setLessonComplete("g1-signs", "1");
    expect(isLessonComplete("g1-right-of-way", "1")).toBe(false);
  });
});

// ─── setLessonComplete ────────────────────────────────────────────────────────

describe("setLessonComplete", () => {
  test("calling twice is idempotent (no duplicates in storage)", () => {
    setLessonComplete("g1-signs", "1");
    setLessonComplete("g1-signs", "1");
    const keys = getCompletedLessonKeys();
    const count = keys.filter((k) => k === "g1-signs-1").length;
    expect(count).toBeLessThanOrEqual(1);
  });
});

// ─── getCompletedLessonsForModule ─────────────────────────────────────────────

describe("getCompletedLessonsForModule", () => {
  test("returns empty array when no lessons are done", () => {
    expect(getCompletedLessonsForModule("g1-signs")).toEqual([]);
  });

  test("returns only lessons for the given module", () => {
    setLessonComplete("g1-signs", "1");
    setLessonComplete("g1-signs", "2");
    setLessonComplete("g1-right-of-way", "1"); // different module
    const result = getCompletedLessonsForModule("g1-signs");
    expect(result).toContain("1");
    expect(result).toContain("2");
    expect(result).not.toContain("g1-right-of-way-1");
    expect(result).toHaveLength(2);
  });
});

// ─── areAllLessonsComplete ────────────────────────────────────────────────────

describe("areAllLessonsComplete", () => {
  test("returns false when no lessons are done", () => {
    expect(areAllLessonsComplete("g1-signs", ["1", "2", "3"])).toBe(false);
  });

  test("returns false when only some lessons are done", () => {
    setLessonComplete("g1-signs", "1");
    expect(areAllLessonsComplete("g1-signs", ["1", "2"])).toBe(false);
  });

  test("returns true when all lessons are done", () => {
    setLessonComplete("g1-signs", "1");
    setLessonComplete("g1-signs", "2");
    expect(areAllLessonsComplete("g1-signs", ["1", "2"])).toBe(true);
  });

  test("returns true for an empty lesson list (nothing to complete)", () => {
    expect(areAllLessonsComplete("g1-signs", [])).toBe(true);
  });
});

// ─── clearModuleProgress ──────────────────────────────────────────────────────

describe("clearModuleProgress", () => {
  test("removes all lessons for the given module", () => {
    setLessonComplete("g1-signs", "1");
    setLessonComplete("g1-signs", "2");
    clearModuleProgress("g1-signs");
    expect(getCompletedLessonsForModule("g1-signs")).toHaveLength(0);
  });

  test("does not remove lessons from other modules", () => {
    setLessonComplete("g1-signs", "1");
    setLessonComplete("g1-right-of-way", "1");
    clearModuleProgress("g1-signs");
    expect(getCompletedLessonsForModule("g1-right-of-way")).toHaveLength(1);
  });
});
