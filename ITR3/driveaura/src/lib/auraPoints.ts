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
  const key = `${moduleId}-${lessonId}`;
  const earned = readSet(EARNED_LESSONS_KEY);
  if (earned.has(key)) return 0;

  const pts = AURA_POINT_VALUES.LESSON;
  const total = readNumber(TOTAL_KEY) + pts;

  earned.add(key);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOTAL_KEY, String(total));
  }
  writeSet(EARNED_LESSONS_KEY, earned);
  dispatchUpdate({ earned: pts, total });
  return pts;
}

/**
 * Attempt to award points for passing a quiz.
 * Returns the points awarded (> 0) if this is the first time, or 0 if already earned.
 */
export function awardQuizPoints(quizId: string): number {
  const earned = readSet(EARNED_QUIZZES_KEY);
  if (earned.has(quizId)) return 0;

  const pts = AURA_POINT_VALUES.QUIZ;
  const total = readNumber(TOTAL_KEY) + pts;

  earned.add(quizId);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOTAL_KEY, String(total));
  }
  writeSet(EARNED_QUIZZES_KEY, earned);
  dispatchUpdate({ earned: pts, total });
  return pts;
}

/** Breakdown of points earned per category. */
export interface AuraPointsBreakdown {
  lessons: number;
  quizzes: number;
  total: number;
  earnedLessonCount: number;
  earnedQuizCount: number;
}

/** Returns a breakdown of how points were earned. */
export function getAuraPointsBreakdown(): AuraPointsBreakdown {
  const earnedLessonCount = readSet(EARNED_LESSONS_KEY).size;
  const earnedQuizCount = readSet(EARNED_QUIZZES_KEY).size;
  const lessons = earnedLessonCount * AURA_POINT_VALUES.LESSON;
  const quizzes = earnedQuizCount * AURA_POINT_VALUES.QUIZ;
  return {
    lessons,
    quizzes,
    total: lessons + quizzes,
    earnedLessonCount,
    earnedQuizCount,
  };
}
