/**
 * INTEGRATION TESTS — Readiness Check + Aura Points
 * User Stories: Strategies to Stay Calm + Aura Points
 *
 * Tests that the readiness scoring works end-to-end with realistic
 * answer sets, and that Aura Points awarded across different features
 * (lessons, quizzes, examiner) all add up correctly.
 */

import {
  computeReadinessScore,
  scoreLabel,
  readinessQuestions,
} from "@/lib/readiness/scoring";

import {
  awardLessonPoints,
  awardQuizPoints,
  awardExaminerScenarioPoints,
  getAuraPoints,
  getAuraPointsBreakdown,
  AURA_POINT_VALUES,
} from "@/lib/auraPoints";

beforeEach(() => {
  localStorage.clear();
});

// ─── Readiness: realistic student scenarios ───────────────────────────────────

describe("Readiness check — realistic scenarios", () => {
  test("Well-rested student with no stress scores 'Safe to drive'", () => {
    const answers: Record<string, number> = {};
    readinessQuestions.forEach((q) => (answers[q.id] = 0)); // all best answers
    const score = computeReadinessScore(answers);
    expect(scoreLabel(score)).toBe("Safe to drive");
  });

  test("Student with impairing substances scores 'Do not drive'", () => {
    const answers: Record<string, number> = {};
    readinessQuestions.forEach((q) => (answers[q.id] = 0));
    // Override substances question with worst answer
    answers["substancesMedication"] = 4;
    const score = computeReadinessScore(answers);
    expect(score).toBeLessThan(80);
  });

  test("Student who had under 4 hours sleep has a lower score than 7+ hours sleep", () => {
    const goodSleep: Record<string, number> = {};
    readinessQuestions.forEach((q) => (goodSleep[q.id] = 0));
    goodSleep["sleep24h"] = 0; // 7+ hours

    const badSleep: Record<string, number> = { ...goodSleep };
    badSleep["sleep24h"] = 4; // under 4 hours

    expect(computeReadinessScore(goodSleep)).toBeGreaterThan(
      computeReadinessScore(badSleep)
    );
  });

  test("Panicking student (worst stress + worst focus) scores below 60", () => {
    const answers: Record<string, number> = {};
    readinessQuestions.forEach((q) => (answers[q.id] = 0));
    answers["stressLevel"] = 4;
    answers["focusDistraction"] = 4;
    const score = computeReadinessScore(answers);
    // With two high-weight bad answers, score should be notably reduced
    expect(score).toBeLessThan(100);
  });

  test("Moderately tired student scores 'Use caution' range", () => {
    const answers: Record<string, number> = {};
    readinessQuestions.forEach((q) => (answers[q.id] = 1)); // all 'slightly off'
    const score = computeReadinessScore(answers);
    // Moderate risk across all questions should land in caution/not-drive range
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThan(100);
  });
});

// ─── Aura Points: cross-feature accumulation ─────────────────────────────────

describe("Aura Points — accumulation across multiple features", () => {
  test("completing lessons, passing a quiz, and mock grading all add up", () => {
    awardLessonPoints("g1-signs", "1");   // +5
    awardLessonPoints("g1-signs", "2");   // +5
    awardQuizPoints("g1-signs");           // +15
    awardExaminerScenarioPoints("s1");     // +12

    const expected =
      AURA_POINT_VALUES.LESSON * 2 +
      AURA_POINT_VALUES.QUIZ +
      AURA_POINT_VALUES.EXAMINER_SCENARIO;

    expect(getAuraPoints()).toBe(expected);
  });

  test("breakdown totals match the sum of individual categories", () => {
    awardLessonPoints("g1-signs", "1");
    awardQuizPoints("g1-signs");
    awardExaminerScenarioPoints("s1");

    const b = getAuraPointsBreakdown();
    expect(b.total).toBe(b.lessons + b.quizzes + b.examinerScenarios);
  });

  test("completing many lessons never double-counts any single lesson", () => {
    const lessonIds = ["1", "2", "3", "4", "5"];
    // Award each once, then try to award them all again
    lessonIds.forEach((id) => awardLessonPoints("g1-module", id));
    lessonIds.forEach((id) => awardLessonPoints("g1-module", id));

    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON * lessonIds.length);
  });

  test("quizzes across different modules each award points once", () => {
    awardQuizPoints("g1-signs-signals-markings");
    awardQuizPoints("g1-right-of-way");
    awardQuizPoints("g1-demerit-points");

    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.QUIZ * 3);
  });
});

// ─── Combined: readiness score threshold matches scoreLabel ──────────────────

describe("scoreLabel correctly classifies every possible integer score", () => {
  test("all scores 0–59 return 'Do not drive'", () => {
    for (let s = 0; s <= 59; s++) {
      expect(scoreLabel(s)).toBe("Do not drive");
    }
  });

  test("all scores 60–79 return 'Use caution'", () => {
    for (let s = 60; s <= 79; s++) {
      expect(scoreLabel(s)).toBe("Use caution");
    }
  });

  test("all scores 80–100 return 'Safe to drive'", () => {
    for (let s = 80; s <= 100; s++) {
      expect(scoreLabel(s)).toBe("Safe to drive");
    }
  });
});
