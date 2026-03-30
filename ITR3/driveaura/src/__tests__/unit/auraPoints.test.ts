/**
 * UNIT TESTS — Aura Points System
 * User Story: Aura Points
 *
 * Tests the local Aura Points awarding logic — idempotency,
 * correct point values, and breakdown tracking.
 */

import {
  getAuraPoints,
  awardLessonPoints,
  awardQuizPoints,
  awardExaminerScenarioPoints,
  getAuraPointsBreakdown,
  AURA_POINT_VALUES,
} from "@/lib/auraPoints";

// Clear localStorage before every test
beforeEach(() => {
  localStorage.clear();
});

// ─── Starting state ───────────────────────────────────────────────────────────

describe("initial state", () => {
  test("starts with 0 Aura Points", () => {
    expect(getAuraPoints()).toBe(0);
  });

  test("breakdown shows all zeros at the start", () => {
    const b = getAuraPointsBreakdown();
    expect(b.lessons).toBe(0);
    expect(b.quizzes).toBe(0);
    expect(b.examinerScenarios).toBe(0);
    expect(b.total).toBe(0);
  });
});

// ─── awardLessonPoints ────────────────────────────────────────────────────────

describe("awardLessonPoints", () => {
  test("awards the correct number of points for a lesson", () => {
    awardLessonPoints("g1-signs", "1");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON);
  });

  test("does not award points twice for the same lesson (idempotent)", () => {
    awardLessonPoints("g1-signs", "1");
    awardLessonPoints("g1-signs", "1");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON);
  });

  test("awards points for two different lessons separately", () => {
    awardLessonPoints("g1-signs", "1");
    awardLessonPoints("g1-signs", "2");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON * 2);
  });

  test("returns the number of points earned (>0 first time, 0 second time)", () => {
    const first  = awardLessonPoints("g1-signs", "3");
    const second = awardLessonPoints("g1-signs", "3");
    expect(first).toBe(AURA_POINT_VALUES.LESSON);
    expect(second).toBe(0);
  });
});

// ─── awardQuizPoints ──────────────────────────────────────────────────────────

describe("awardQuizPoints", () => {
  test("awards the correct number of points for passing a quiz", () => {
    awardQuizPoints("g1-signs-signals-markings");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.QUIZ);
  });

  test("does not award quiz points twice for the same quiz", () => {
    awardQuizPoints("g1-signs-signals-markings");
    awardQuizPoints("g1-signs-signals-markings");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.QUIZ);
  });

  test("quiz points and lesson points stack correctly", () => {
    awardLessonPoints("g1-signs", "1");
    awardQuizPoints("g1-signs-signals-markings");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON + AURA_POINT_VALUES.QUIZ);
  });
});

// ─── awardExaminerScenarioPoints ──────────────────────────────────────────────

describe("awardExaminerScenarioPoints (Mock Grading / User as Examiner)", () => {
  test("awards the correct number of points for a correct verdict", () => {
    awardExaminerScenarioPoints("scenario-1");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.EXAMINER_SCENARIO);
  });

  test("does not award points twice for the same scenario", () => {
    awardExaminerScenarioPoints("scenario-1");
    awardExaminerScenarioPoints("scenario-1");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.EXAMINER_SCENARIO);
  });
});

// ─── getAuraPointsBreakdown ───────────────────────────────────────────────────

describe("getAuraPointsBreakdown", () => {
  test("breakdown.total matches getAuraPoints()", () => {
    awardLessonPoints("g1-signs", "1");
    awardQuizPoints("g1-quiz");
    const b = getAuraPointsBreakdown();
    expect(b.total).toBe(getAuraPoints());
  });

  test("earned lesson count increments when a new lesson is completed", () => {
    awardLessonPoints("g1-signs", "1");
    awardLessonPoints("g1-signs", "2");
    const b = getAuraPointsBreakdown();
    expect(b.earnedLessonCount).toBe(2);
  });

  test("earned quiz count increments when a quiz is passed", () => {
    awardQuizPoints("g1-signs-signals-markings");
    const b = getAuraPointsBreakdown();
    expect(b.earnedQuizCount).toBe(1);
  });
});
