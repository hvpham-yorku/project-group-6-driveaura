/**
 * UNIT TESTS — Quiz Entry Gate (Session Storage)
 * User Story: Quizzes inside Modules
 *
 * Tests that the session-based gate correctly controls access to the quiz page.
 * Users must come from a module page — direct URL access is blocked.
 */

import {
  setQuizEntryAllowed,
  isQuizEntryAllowed,
  clearQuizEntry,
} from "@/lib/learning/quizEntry";

// Clear sessionStorage before every test
beforeEach(() => {
  sessionStorage.clear();
});

// ─── setQuizEntryAllowed ──────────────────────────────────────────────────────

describe("setQuizEntryAllowed", () => {
  test("allows entry for the quiz ID that was set", () => {
    setQuizEntryAllowed("g1-signs-signals-markings");
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(true);
  });

  test("only allows the specific quiz that was set", () => {
    setQuizEntryAllowed("g1-signs-signals-markings");
    expect(isQuizEntryAllowed("g1-right-of-way")).toBe(false);
  });

  test("overwriting with a different quiz ID updates the allowed quiz", () => {
    setQuizEntryAllowed("g1-signs-signals-markings");
    setQuizEntryAllowed("g1-right-of-way");
    expect(isQuizEntryAllowed("g1-right-of-way")).toBe(true);
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(false);
  });
});

// ─── isQuizEntryAllowed ───────────────────────────────────────────────────────

describe("isQuizEntryAllowed", () => {
  test("returns false when nothing has been set (direct URL access)", () => {
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(false);
  });

  test("returns false after the entry is cleared", () => {
    setQuizEntryAllowed("g1-signs-signals-markings");
    clearQuizEntry();
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(false);
  });
});

// ─── clearQuizEntry ───────────────────────────────────────────────────────────

describe("clearQuizEntry", () => {
  test("calling clear when nothing is set does not throw", () => {
    expect(() => clearQuizEntry()).not.toThrow();
  });

  test("clears an existing entry so no quiz is accessible", () => {
    setQuizEntryAllowed("g2-licensing-restrictions");
    clearQuizEntry();
    expect(isQuizEntryAllowed("g2-licensing-restrictions")).toBe(false);
  });
});
