/**
 * Learning modules progress — persisted in localStorage.
 * Key format: `${moduleId}-${lessonId}`.
 */

const STORAGE_KEY = "driveaura-module-progress";

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

function setStored(keys: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore
  }
}

/** Returns the set of completed lesson keys (moduleId-lessonId). */
export function getCompletedLessonKeys(): string[] {
  return getStored();
}

/** Returns the completed lesson ids for a given module. */
export function getCompletedLessonsForModule(moduleId: string): string[] {
  const prefix = `${moduleId}-`;
  return getCompletedLessonKeys()
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice(prefix.length));
}

/** Mark a lesson as complete. Idempotent. */
export function setLessonComplete(moduleId: string, lessonId: string): void {
  const key = `${moduleId}-${lessonId}`;
  const current = getStored();
  if (current.includes(key)) return;
  setStored([...current, key]);
}

/** Check if a lesson is marked complete. */
export function isLessonComplete(moduleId: string, lessonId: string): boolean {
  return getCompletedLessonKeys().includes(`${moduleId}-${lessonId}`);
}
