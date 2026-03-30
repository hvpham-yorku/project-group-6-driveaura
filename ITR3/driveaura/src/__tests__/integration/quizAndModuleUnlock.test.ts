/**
 * INTEGRATION TESTS — Quiz Flow + Module Unlock
 * User Stories: Quizzes inside Modules + Learning Modules
 *
 * Tests that multiple modules work correctly together:
 *   1. Quiz entry gate (quizEntry) controls access to the quiz page
 *   2. Module unlock (moduleUnlock) uses quiz pass state
 *   3. Progress clearing (progress) happens on 3 failed attempts
 *
 * This simulates the full journey: student finishes lessons → starts quiz
 * → passes/fails → next module locks/unlocks.
 */

import {
  setQuizEntryAllowed,
  isQuizEntryAllowed,
  clearQuizEntry,
} from "@/lib/learning/quizEntry";

import {
  setLessonComplete,
  areAllLessonsComplete,
  clearModuleProgress,
  getCompletedLessonsForModule,
} from "@/app/modules/progress";

import { isModuleUnlocked } from "@/lib/learning/moduleUnlock";
import { MODULES } from "@/app/modules/data";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// ─── Scenario 1: Student completes all lessons then starts the quiz ───────────

describe("Student completes lessons and starts quiz", () => {
  const moduleId = MODULES[0].id; // first module (always unlocked)
  const lessonIds = MODULES[0].lessons.map((l) => l.id);

  test("quiz start button is blocked until all lessons are complete", () => {
    // Only complete the first lesson
    setLessonComplete(moduleId, lessonIds[0]);
    const allDone = areAllLessonsComplete(moduleId, lessonIds);
    expect(allDone).toBe(false);
  });

  test("quiz start becomes available after all lessons are complete", () => {
    lessonIds.forEach((id) => setLessonComplete(moduleId, id));
    expect(areAllLessonsComplete(moduleId, lessonIds)).toBe(true);
  });

  test("quiz entry token is set when student clicks 'Continue' on confirm modal", () => {
    lessonIds.forEach((id) => setLessonComplete(moduleId, id));
    // Simulate the confirm modal setting the token before navigation
    setQuizEntryAllowed(moduleId);
    expect(isQuizEntryAllowed(moduleId)).toBe(true);
  });

  test("quiz entry token is rejected for a different quiz ID", () => {
    setQuizEntryAllowed(moduleId);
    expect(isQuizEntryAllowed("some-other-quiz")).toBe(false);
  });
});

// ─── Scenario 2: After quiz results, entry token is cleared ──────────────────

describe("Quiz entry token lifecycle", () => {
  test("token is cleared after the student returns to module from results", () => {
    setQuizEntryAllowed("g1-signs-signals-markings");
    // Simulate clicking 'Back to module' which calls clearQuizEntry()
    clearQuizEntry();
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(false);
  });

  test("direct URL navigation (no token) is blocked", () => {
    // Session storage is fresh — no token set
    expect(isQuizEntryAllowed("g1-right-of-way")).toBe(false);
  });
});

// ─── Scenario 3: Passing a quiz unlocks the next module ──────────────────────

describe("Module progression after quiz pass", () => {
  const g1Modules = MODULES.filter((m) => m.licenseLevel === "G1");

  test("second module is locked before first quiz is passed", () => {
    if (g1Modules.length < 2) return;
    expect(isModuleUnlocked(g1Modules[1].id, new Set())).toBe(false);
  });

  test("second module becomes unlocked once first quiz is passed", () => {
    if (g1Modules.length < 2) return;
    const passedIds = new Set([g1Modules[0].id]);
    expect(isModuleUnlocked(g1Modules[1].id, passedIds)).toBe(true);
  });

  test("passing first quiz does not unlock third module directly", () => {
    if (g1Modules.length < 3) return;
    const passedIds = new Set([g1Modules[0].id]); // only first quiz passed
    expect(isModuleUnlocked(g1Modules[2].id, passedIds)).toBe(false);
  });

  test("third module unlocks after both first and second quizzes are passed", () => {
    if (g1Modules.length < 3) return;
    const passedIds = new Set([g1Modules[0].id, g1Modules[1].id]);
    expect(isModuleUnlocked(g1Modules[2].id, passedIds)).toBe(true);
  });
});

// ─── Scenario 4: 3 failed attempts → module progress resets ──────────────────

describe("Lockout after 3 failed quiz attempts", () => {
  const moduleId = MODULES[0].id;
  const lessonIds = MODULES[0].lessons.map((l) => l.id);

  test("lesson progress is wiped after lockout reset", () => {
    // Student had completed lessons
    lessonIds.forEach((id) => setLessonComplete(moduleId, id));
    expect(areAllLessonsComplete(moduleId, lessonIds)).toBe(true);

    // Simulate lockout: clearModuleProgress is called
    clearModuleProgress(moduleId);

    // Lessons should be gone
    expect(getCompletedLessonsForModule(moduleId)).toHaveLength(0);
    expect(areAllLessonsComplete(moduleId, lessonIds)).toBe(false);
  });

  test("student can redo lessons after a lockout", () => {
    clearModuleProgress(moduleId);
    // Redo all lessons
    lessonIds.forEach((id) => setLessonComplete(moduleId, id));
    expect(areAllLessonsComplete(moduleId, lessonIds)).toBe(true);
  });
});
