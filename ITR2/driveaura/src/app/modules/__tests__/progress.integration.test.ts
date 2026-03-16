/**
 * Integration tests: localStorage-backed module progress helpers.
 *
 * These tests verify the full read-write-read cycle of the lesson
 * completion tracker, including idempotency and cross-module isolation.
 * jsdom provides a real localStorage implementation.
 */
import {
  getCompletedLessonKeys,
  getCompletedLessonsForModule,
  setLessonComplete,
  isLessonComplete,
} from "../progress";

describe("Module progress (localStorage) — integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("no completed lessons initially", () => {
    expect(getCompletedLessonKeys()).toHaveLength(0);
  });

  test("marking a lesson complete persists it", () => {
    setLessonComplete("mod-1", "lesson-a");
    expect(isLessonComplete("mod-1", "lesson-a")).toBe(true);
  });

  test("isLessonComplete returns false for a lesson that was not marked", () => {
    expect(isLessonComplete("mod-1", "lesson-z")).toBe(false);
  });

  test("setLessonComplete is idempotent — duplicate calls do not create duplicates", () => {
    setLessonComplete("mod-1", "lesson-a");
    setLessonComplete("mod-1", "lesson-a");
    setLessonComplete("mod-1", "lesson-a");
    expect(getCompletedLessonKeys()).toHaveLength(1);
  });

  test("getCompletedLessonsForModule only returns lessons for the queried module", () => {
    setLessonComplete("mod-1", "lesson-a");
    setLessonComplete("mod-1", "lesson-b");
    setLessonComplete("mod-2", "lesson-a");

    const mod1Lessons = getCompletedLessonsForModule("mod-1");
    expect(mod1Lessons).toContain("lesson-a");
    expect(mod1Lessons).toContain("lesson-b");
    expect(mod1Lessons).toHaveLength(2);
  });

  test("completing lessons in one module does not affect another module", () => {
    setLessonComplete("mod-1", "lesson-a");
    expect(getCompletedLessonsForModule("mod-2")).toHaveLength(0);
  });

  test("multiple lessons can be marked complete across different modules", () => {
    setLessonComplete("mod-1", "lesson-a");
    setLessonComplete("mod-1", "lesson-b");
    setLessonComplete("mod-2", "lesson-x");
    expect(getCompletedLessonKeys()).toHaveLength(3);
    expect(isLessonComplete("mod-1", "lesson-b")).toBe(true);
    expect(isLessonComplete("mod-2", "lesson-x")).toBe(true);
  });
});
