import {
  getInitialState,
  getReadiness,
  getStrengths,
  getWeaknesses,
  buildReport,
  getCategoryCompletion,
  getNotesSummary,
} from "../utils";
import type { ChecklistState } from "../types";
import { CHECKLIST_CATEGORY_IDS, CHECKLIST_SUBITEMS } from "../types";

/** Builds a state where every sub-check in every category is set to a given value. */
function makeState(allChecked: boolean): ChecklistState {
  const state = getInitialState();
  for (const id of CHECKLIST_CATEGORY_IDS) {
    const items = CHECKLIST_SUBITEMS[id];
    if (items.length > 0) {
      state[id].subChecks = items.map(() => allChecked);
    } else {
      state[id].pass = allChecked;
    }
  }
  return state;
}

describe("checklist/utils — unit", () => {
  describe("getInitialState", () => {
    test("returns an entry for every category", () => {
      const state = getInitialState();
      for (const id of CHECKLIST_CATEGORY_IDS) {
        expect(state[id]).toBeDefined();
      }
    });

    test("all entries start unchecked with empty notes", () => {
      const state = getInitialState();
      for (const id of CHECKLIST_CATEGORY_IDS) {
        expect(state[id].pass).toBe(false);
        expect(state[id].notes).toBe("");
      }
    });

    test("categories with sub-items start with all sub-checks false", () => {
      const state = getInitialState();
      for (const id of CHECKLIST_CATEGORY_IDS) {
        const items = CHECKLIST_SUBITEMS[id];
        if (items.length > 0) {
          expect(state[id].subChecks).toEqual(items.map(() => false));
        }
      }
    });
  });

  describe("getReadiness", () => {
    test("returns false for a completely empty state", () => {
      expect(getReadiness(getInitialState())).toBe(false);
    });

    test("returns true when all sub-checks are completed", () => {
      expect(getReadiness(makeState(true))).toBe(true);
    });

    test("returns false when only some sub-checks are completed", () => {
      const state = getInitialState();
      // Check only the first sub-item in 'safety'
      state.safety.subChecks = [true, false, false, false];
      expect(getReadiness(state)).toBe(false);
    });
  });

  describe("getStrengths / getWeaknesses", () => {
    test("fully completed state has all categories as strengths, none as weaknesses", () => {
      const state = makeState(true);
      expect(getStrengths(state).length).toBeGreaterThan(0);
      expect(getWeaknesses(state)).toHaveLength(0);
    });

    test("empty state has all categories as weaknesses, none as strengths", () => {
      const state = getInitialState();
      expect(getStrengths(state)).toHaveLength(0);
      expect(getWeaknesses(state).length).toBeGreaterThan(0);
    });

    test("strengths and weaknesses are always complementary (no overlap)", () => {
      const state = getInitialState();
      state.safety.subChecks = [true, true, true, true]; // safety done
      const strengths = getStrengths(state);
      const weaknesses = getWeaknesses(state);
      const overlap = strengths.filter((s) => weaknesses.includes(s));
      expect(overlap).toHaveLength(0);
    });
  });

  describe("getNotesSummary", () => {
    test("returns empty array when no notes are set", () => {
      expect(getNotesSummary(getInitialState())).toHaveLength(0);
    });

    test("includes a category when it has a non-empty note", () => {
      const state = getInitialState();
      state.safety.notes = "Remember to adjust seat first";
      const summary = getNotesSummary(state);
      expect(summary).toHaveLength(1);
      expect(summary[0].notes).toBe("Remember to adjust seat first");
    });

    test("ignores whitespace-only notes", () => {
      const state = getInitialState();
      state.mirrors.notes = "   ";
      expect(getNotesSummary(state)).toHaveLength(0);
    });
  });

  describe("getCategoryCompletion", () => {
    test("returns an entry per category with correct totals", () => {
      const completions = getCategoryCompletion(getInitialState());
      for (const id of CHECKLIST_CATEGORY_IDS) {
        const entry = completions.find((c) => c.categoryId === id);
        expect(entry).toBeDefined();
        expect(entry!.total).toBeGreaterThanOrEqual(1);
      }
    });

    test("completed is 0 for all categories in initial state", () => {
      const completions = getCategoryCompletion(getInitialState());
      for (const entry of completions) {
        expect(entry.completed).toBe(0);
      }
    });
  });

  describe("buildReport", () => {
    test("returns a complete ChecklistReport shape", () => {
      const report = buildReport(getInitialState());
      expect(report).toHaveProperty("ready");
      expect(report).toHaveProperty("strengths");
      expect(report).toHaveProperty("weaknesses");
      expect(report).toHaveProperty("notesSummary");
      expect(report).toHaveProperty("categoryCompletion");
    });

    test("report.ready is false for empty state, true for fully completed state", () => {
      expect(buildReport(getInitialState()).ready).toBe(false);
      expect(buildReport(makeState(true)).ready).toBe(true);
    });
  });
});
