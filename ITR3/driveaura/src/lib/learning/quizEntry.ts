/**
 * Session-only gate so /quizzes/[id] is only reachable after "Start quiz" on the module.
 * Direct URL opens have no token → redirect home.
 */

const STORAGE_KEY = "driveaura-quiz-entry-id";

export function setQuizEntryAllowed(quizId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, quizId);
  } catch {
    // ignore
  }
}

export function isQuizEntryAllowed(quizId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === quizId;
  } catch {
    return false;
  }
}

export function clearQuizEntry(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
