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

/** Mark a quiz as passed (call only when the user passes the quiz). */
export function addPassedQuiz(quizId: string): void {
  if (typeof window === "undefined") return;
  const ids = new Set(getStored());
  ids.add(quizId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent("driveaura-quizzes-passed-updated"));
}
