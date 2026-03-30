/**
 * Aura Points — reward system for DriveAura.
 *
 * Points are earned by completing educational modules, passing quizzes,
 * finishing assessments, and playing interactive games.
 *
 * Storage: localStorage for instant access across the app.
 * A separate Firebase layer syncs the total when the user is signed in.
 */

const TOTAL_KEY = "driveaura-aura-points";
/** Tracks which lesson keys (moduleId-lessonId) have already earned points. */
const EARNED_LESSONS_KEY = "driveaura-aura-earned-lessons";
/** Tracks which quiz IDs have already earned points. */
const EARNED_QUIZZES_KEY = "driveaura-aura-earned-quizzes";
/** Tracks User-as-Examiner scenario IDs that have already earned Mock Grading points. */
const EARNED_EXAMINER_SCENARIOS_KEY = "driveaura-aura-earned-examiner-scenarios";

/** Custom DOM event dispatched whenever points change. */
export const AURA_POINTS_UPDATED_EVENT = "driveaura-aura-points-updated";

export type AuraPointsEventDetail = {
  earned: number;
  total: number;
};

/** How many Aura Points each action is worth. */
export const AURA_POINT_VALUES = {
  LESSON: 5,
  QUIZ: 15,
  ASSESSMENT: 10,
  GAME: 20,
  /** First correct Mock Grading verdict per scenario. */
  EXAMINER_SCENARIO: 12,
} as const;

// ─── Private helpers ──────────────────────────────────────────────────────────

function readNumber(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(key);
    const n = raw !== null ? parseInt(raw, 10) : 0;
    return isNaN(n) || n < 0 ? 0 : n;
  } catch {
    return 0;
  }
}

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

function dispatchUpdate(detail: AuraPointsEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AURA_POINTS_UPDATED_EVENT, { detail }));
}

type AwardOnceConfig = {
  earnedSetKey: string;
  earnedId: string;
  points: number;
};

/**
 * Single implementation for idempotent point awards (first completion only).
 */
function awardPointsOnce(config: AwardOnceConfig): number {
  const { earnedSetKey, earnedId, points } = config;
  const earned = readSet(earnedSetKey);
  if (earned.has(earnedId)) return 0;

  const total = readNumber(TOTAL_KEY) + points;
  earned.add(earnedId);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOTAL_KEY, String(total));
  }
  writeSet(earnedSetKey, earned);
  dispatchUpdate({ earned: points, total });
  return points;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns the total Aura Points stored locally. */
export function getAuraPoints(): number {
  return readNumber(TOTAL_KEY);
}

/**
 * Attempt to award points for completing a lesson.
 * Returns the points awarded (> 0) if this is the first time, or 0 if already earned.
 */
export function awardLessonPoints(moduleId: string, lessonId: string): number {
  return awardPointsOnce({
    earnedSetKey: EARNED_LESSONS_KEY,
    earnedId: `${moduleId}-${lessonId}`,
    points: AURA_POINT_VALUES.LESSON,
  });
}

/**
 * Attempt to award points for passing a quiz.
 * Returns the points awarded (> 0) if this is the first time, or 0 if already earned.
 */
export function awardQuizPoints(quizId: string): number {
  return awardPointsOnce({
    earnedSetKey: EARNED_QUIZZES_KEY,
    earnedId: quizId,
    points: AURA_POINT_VALUES.QUIZ,
  });
}

/**
 * Award Aura Points for a correct Mock Grading verdict (first time per scenario).
 */
export function awardExaminerScenarioPoints(scenarioId: string): number {
  return awardPointsOnce({
    earnedSetKey: EARNED_EXAMINER_SCENARIOS_KEY,
    earnedId: scenarioId,
    points: AURA_POINT_VALUES.EXAMINER_SCENARIO,
  });
}

/** Breakdown of points earned per category. */
export interface AuraPointsBreakdown {
  lessons: number;
  quizzes: number;
  examinerScenarios: number;
  total: number;
  earnedLessonCount: number;
  earnedQuizCount: number;
  earnedExaminerScenarioCount: number;
}

/** Returns a breakdown of how points were earned. */
export function getAuraPointsBreakdown(): AuraPointsBreakdown {
  const earnedLessonCount = readSet(EARNED_LESSONS_KEY).size;
  const earnedQuizCount = readSet(EARNED_QUIZZES_KEY).size;
  const earnedExaminerScenarioCount = readSet(EARNED_EXAMINER_SCENARIOS_KEY).size;
  const lessons = earnedLessonCount * AURA_POINT_VALUES.LESSON;
  const quizzes = earnedQuizCount * AURA_POINT_VALUES.QUIZ;
  const examinerScenarios =
    earnedExaminerScenarioCount * AURA_POINT_VALUES.EXAMINER_SCENARIO;
  return {
    lessons,
    quizzes,
    examinerScenarios,
    total: lessons + quizzes + examinerScenarios,
    earnedLessonCount,
    earnedQuizCount,
    earnedExaminerScenarioCount,
  };
}
