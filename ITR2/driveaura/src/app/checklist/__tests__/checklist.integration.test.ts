/**
 * Integration tests: Checklist state mutations → report generation.
 *
 * These tests verify the full flow of a user incrementally completing
 * checklist categories, and that the report reflects those changes
 * correctly (strengths, weaknesses, readiness, category completion).
 */
import {
  getInitialState,
  getReadiness,
  getStrengths,
  getWeaknesses,
  buildReport,
  getCategoryCompletion,
} from "../utils";
import { CHECKLIST_SUBITEMS } from "../types";

/** Mark all sub-checks in a given category as complete/incomplete. */
function setCategory(
  state: ReturnType<typeof getInitialState>,
  categoryId: keyof typeof CHECKLIST_SUBITEMS,
  checked: boolean
) {
  const items = CHECKLIST_SUBITEMS[categoryId];
  state[categoryId].subChecks = items.map(() => checked);
}

describe("Checklist state → report — integration", () => {
  test("initial state generates a failing report with all categories as weaknesses", () => {
    const state = getInitialState();
    const report = buildReport(state);
    expect(report.ready).toBe(false);
    expect(report.strengths).toHaveLength(0);
    expect(report.weaknesses.length).toBeGreaterThan(0);
  });

  test("completing one category moves it from weaknesses to strengths", () => {
    const state = getInitialState();
    setCategory(state, "safety", true);

    const report = buildReport(state);
    expect(report.strengths).toContain("Safety");
    expect(report.weaknesses).not.toContain("Safety");
  });

  test("partially completing a category (< 75%) keeps it as a weakness", () => {
    const state = getInitialState();
    // Only 1 of 4 sub-checks = 25%
    state.safety.subChecks = [true, false, false, false];
    const report = buildReport(state);
    expect(report.weaknesses).toContain("Safety");
    expect(report.strengths).not.toContain("Safety");
  });

  test("completing 3 of 4 sub-checks (75%) moves a category to strengths", () => {
    const state = getInitialState();
    state.mirrors.subChecks = [true, true, true, false]; // exactly 75%
    const report = buildReport(state);
    expect(report.strengths).toContain("Mirrors");
  });

  test("report is only ready when all categories reach 75%+ completion", () => {
    const state = getInitialState();
    setCategory(state, "safety", true);
    setCategory(state, "mirrors", true);
    expect(getReadiness(state)).toBe(false); // still 2 categories incomplete

    setCategory(state, "lane_changes", true);
    setCategory(state, "passenger_rules", true);
    expect(getReadiness(state)).toBe(true);
  });

  test("notes added to a category appear in the report notes summary", () => {
    const state = getInitialState();
    state.safety.notes = "Adjust mirrors before the test.";
    state.lane_changes.notes = "Practice shoulder checks tonight.";
    const report = buildReport(state);
    expect(report.notesSummary).toHaveLength(2);
    const categories = report.notesSummary.map((n) => n.category);
    expect(categories).toContain("Safety");
    expect(categories).toContain("Lane changes");
  });

  test("category completion totals match the number of sub-items defined", () => {
    const state = getInitialState();
    const completions = getCategoryCompletion(state);
    for (const { categoryId, total } of completions) {
      expect(total).toBe(CHECKLIST_SUBITEMS[categoryId].length);
    }
  });

  test("completed count updates correctly as sub-checks are toggled", () => {
    const state = getInitialState();
    state.safety.subChecks = [true, true, false, false];

    const completions = getCategoryCompletion(state);
    const safetyEntry = completions.find((c) => c.categoryId === "safety");
    expect(safetyEntry?.completed).toBe(2);
    expect(safetyEntry?.total).toBe(4);
  });

  test("strengths list labels match CHECKLIST_CATEGORY_LABELS", () => {
    const state = getInitialState();
    setCategory(state, "safety", true);
    setCategory(state, "mirrors", true);

    const strengths = getStrengths(state);
    expect(strengths).toContain("Safety");
    expect(strengths).toContain("Mirrors");
    expect(strengths).not.toContain("Lane changes");
    expect(strengths).not.toContain("Passenger rules & restrictions");
  });

  test("weaknesses count decreases as categories are completed", () => {
    const state = getInitialState();
    const initialWeaknesses = getWeaknesses(state).length;

    setCategory(state, "safety", true);
    expect(getWeaknesses(state).length).toBe(initialWeaknesses - 1);

    setCategory(state, "mirrors", true);
    expect(getWeaknesses(state).length).toBe(initialWeaknesses - 2);
  });
});
