/**
 * Persist which quizzes the user has passed (localStorage).
 * Progress bar and "Completed" badges only count passed quizzes.
 */

const STORAGE_KEY = "driveaura-quizzes-passed";

function getStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Returns the set of quiz IDs the user has passed. */
export function getPassedQuizIds(): Set<string> {
  return new Set(getStored());
}

/**
 * Mark a quiz as passed.
 * Returns true if newly passed (first time), false if already recorded.
 */
export function addPassedQuiz(quizId: string): boolean {
  if (typeof window === "undefined") return false;
  const ids = new Set(getStored());
  if (ids.has(quizId)) return false;
  ids.add(quizId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent("driveaura-quizzes-passed-updated"));
  return true;
}
