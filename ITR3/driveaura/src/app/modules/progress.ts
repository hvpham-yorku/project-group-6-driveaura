/**
 * Learning modules progress — persisted in localStorage.
 * Key format: `${moduleId}-${lessonId}`.
 *
 * Lock rules: the first module in each license level is always unlocked.
 * Every subsequent module unlocks when all lessons of the previous module
 * in the same level are marked complete.
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

/**
 * Returns true if the given module is unlocked.
 * The first module per license level is always unlocked.
 * Subsequent modules require all lessons of the previous module to be done.
 */
export function isModuleUnlocked(
  moduleId: string,
  allModules: Array<{ id: string; licenseLevel: string; lessons: Array<{ id: string }> }>
): boolean {
  const mod = allModules.find((m) => m.id === moduleId);
  if (!mod) return false;

  const levelModules = allModules.filter((m) => m.licenseLevel === mod.licenseLevel);
  const idx = levelModules.findIndex((m) => m.id === moduleId);

  if (idx <= 0) return true;

  const prev = levelModules[idx - 1];
  const completedKeys = getCompletedLessonKeys();
  return prev.lessons.every((l) => completedKeys.includes(`${prev.id}-${l.id}`));
}

/** Returns true if all lessons in a module are complete. */
export function isModuleComplete(
  moduleId: string,
  lessons: Array<{ id: string }>
): boolean {
  const completedKeys = getCompletedLessonKeys();
  return lessons.every((l) => completedKeys.includes(`${moduleId}-${l.id}`));
}
