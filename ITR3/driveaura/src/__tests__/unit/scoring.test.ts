/**
 * UNIT TESTS — Readiness Scoring
 * User Story: Strategies to Stay Calm (Drive Readiness Check)
 *
 * Tests the pure scoring functions with no external dependencies.
 */

import {
  computeReadinessScore,
  scoreLabel,
  readinessQuestions,
} from "@/lib/readiness/scoring";

// Helper: build an answers map where every question gets the same risk value
function allAnswers(risk: 0 | 1 | 2 | 3 | 4): Record<string, number> {
  return Object.fromEntries(readinessQuestions.map((q) => [q.id, risk]));
}

// ─── computeReadinessScore ────────────────────────────────────────────────────

describe("computeReadinessScore", () => {
  test("returns 100 when all questions answered with lowest risk (0)", () => {
    const score = computeReadinessScore(allAnswers(0));
    expect(score).toBe(100);
  });

  test("returns 0 when all questions answered with highest risk (4)", () => {
    const score = computeReadinessScore(allAnswers(4));
    expect(score).toBe(0);
  });

  test("returns 0 when no questions are answered (empty object)", () => {
    const score = computeReadinessScore({});
    expect(score).toBe(0);
  });

  test("returns a number between 0 and 100 for mixed answers", () => {
    const answers: Record<string, number> = {};
    readinessQuestions.forEach((q, i) => {
      answers[q.id] = i % 2 === 0 ? 0 : 4; // alternate best/worst
    });
    const score = computeReadinessScore(answers);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("score is lower when alertness question is answered as 'worst'", () => {
    const goodAnswers = allAnswers(0);
    const badAlertness = { ...allAnswers(0), alertnessNow: 4 };
    expect(computeReadinessScore(badAlertness)).toBeLessThan(
      computeReadinessScore(goodAnswers)
    );
  });

  test("score is always an integer", () => {
    const score = computeReadinessScore(allAnswers(2));
    expect(Number.isInteger(score)).toBe(true);
  });

  test("score does not go below 0 or above 100", () => {
    // Even with out-of-range values, clamp to 0–100
    const extremeAnswers = Object.fromEntries(
      readinessQuestions.map((q) => [q.id, 999])
    );
    const score = computeReadinessScore(extremeAnswers);
    expect(score).toBe(0);
  });
});

// ─── scoreLabel ───────────────────────────────────────────────────────────────

describe("scoreLabel", () => {
  test("returns 'Safe to drive' for score >= 80", () => {
    expect(scoreLabel(80)).toBe("Safe to drive");
    expect(scoreLabel(100)).toBe("Safe to drive");
    expect(scoreLabel(95)).toBe("Safe to drive");
  });

  test("returns 'Use caution' for score between 60 and 79", () => {
    expect(scoreLabel(60)).toBe("Use caution");
    expect(scoreLabel(70)).toBe("Use caution");
    expect(scoreLabel(79)).toBe("Use caution");
  });

  test("returns 'Do not drive' for score below 60", () => {
    expect(scoreLabel(0)).toBe("Do not drive");
    expect(scoreLabel(59)).toBe("Do not drive");
    expect(scoreLabel(30)).toBe("Do not drive");
  });

  test("boundary: exactly 80 is 'Safe to drive'", () => {
    expect(scoreLabel(80)).toBe("Safe to drive");
  });

  test("boundary: exactly 60 is 'Use caution'", () => {
    expect(scoreLabel(60)).toBe("Use caution");
  });
});
