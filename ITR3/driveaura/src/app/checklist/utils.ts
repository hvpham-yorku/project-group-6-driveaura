/**
 * Pure functions for checklist report logic.
 * Testable and reusable; no React or DOM.
 */

import type {
  ChecklistCategoryId,
  ChecklistReport,
  ChecklistState,
} from "./types";
import type { ChecklistCategoryResponse } from "./types";
import {
  CHECKLIST_CATEGORY_IDS,
  CHECKLIST_CATEGORY_LABELS,
  CHECKLIST_SUBITEMS,
} from "./types";

const COMPLETION_THRESHOLD = 0.75;

/** Initial state: pass false, notes "", subChecks all false when category has sub-items. */
export function getInitialState(): ChecklistState {
  const state = {} as ChecklistState;
  for (const id of CHECKLIST_CATEGORY_IDS) {
    const items = CHECKLIST_SUBITEMS[id];
    const entry: ChecklistCategoryResponse = {
      pass: false,
      notes: "",
    };
    if (items.length > 0) {
      entry.subChecks = items.map(() => false);
    }
    state[id] = entry;
  }
  return state;
}

/** Completion for one category: 0–1. With sub-items uses subChecks; else uses pass (1 or 0). */
function getCategoryCompletionRatio(
  state: ChecklistState,
  id: ChecklistCategoryId
): number {
  const items = CHECKLIST_SUBITEMS[id];
  if (items.length === 0) {
    return state[id]?.pass === true ? 1 : 0;
  }
  const sub = state[id]?.subChecks ?? [];
  const completed = sub.filter(Boolean).length;
  return items.length === 0 ? 0 : completed / items.length;
}

/** Pass if all categories >= 75% (sub-check completion or pass). */
export function getReadiness(state: ChecklistState): boolean {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids.every((id) => getCategoryCompletionRatio(state, id) >= COMPLETION_THRESHOLD);
}

/** Strength if completion >= 75%. */
export function getStrengths(state: ChecklistState): string[] {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids
    .filter((id) => getCategoryCompletionRatio(state, id) >= COMPLETION_THRESHOLD)
    .map((id) => CHECKLIST_CATEGORY_LABELS[id]);
}

/** Weakness if completion < 75%. */
export function getWeaknesses(state: ChecklistState): string[] {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids
    .filter((id) => getCategoryCompletionRatio(state, id) < COMPLETION_THRESHOLD)
    .map((id) => CHECKLIST_CATEGORY_LABELS[id]);
}

/** All categories that have notes, for the notes summary. */
export function getNotesSummary(
  state: ChecklistState
): { category: string; notes: string }[] {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids
    .filter((id) => state[id]?.notes?.trim())
    .map((id) => ({
      category: CHECKLIST_CATEGORY_LABELS[id],
      notes: state[id].notes.trim(),
    }));
}

/** Per-category completed/total for report. With sub-items uses subChecks; else 1/1 if pass, 0/1 if not. */
export function getCategoryCompletion(
  state: ChecklistState
): { categoryId: ChecklistCategoryId; label: string; completed: number; total: number }[] {
  return (CHECKLIST_CATEGORY_IDS as readonly ChecklistCategoryId[]).map((id) => {
    const items = CHECKLIST_SUBITEMS[id];
    const label = CHECKLIST_CATEGORY_LABELS[id];
    if (items.length === 0) {
      return {
        categoryId: id,
        label,
        completed: state[id]?.pass === true ? 1 : 0,
        total: 1,
      };
    }
    const sub = state[id]?.subChecks ?? [];
    const completed = sub.filter(Boolean).length;
    return { categoryId: id, label, completed, total: items.length };
  });
}

/** Build full report from current state. */
export function buildReport(state: ChecklistState): ChecklistReport {
  return {
    ready: getReadiness(state),
    strengths: getStrengths(state),
    weaknesses: getWeaknesses(state),
    notesSummary: getNotesSummary(state),
    categoryCompletion: getCategoryCompletion(state),
  };
}
