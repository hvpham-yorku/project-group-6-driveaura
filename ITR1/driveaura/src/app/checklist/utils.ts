/**
 * Pure functions for checklist report logic.
 * Testable and reusable; no React or DOM.
 */

import type {
  ChecklistCategoryId,
  ChecklistReport,
  ChecklistState,
} from "./types";
import { CHECKLIST_CATEGORY_LABELS } from "./types";

/** Pass/fail rule: ready only if every category is Yes (pass). */
export function getReadiness(state: ChecklistState): boolean {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids.every((id) => state[id]?.pass === true);
}

/** Categories marked Yes → strengths. */
export function getStrengths(state: ChecklistState): string[] {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids
    .filter((id) => state[id]?.pass === true)
    .map((id) => CHECKLIST_CATEGORY_LABELS[id]);
}

/** Categories marked No → weaknesses. */
export function getWeaknesses(state: ChecklistState): string[] {
  const ids = Object.keys(state) as ChecklistCategoryId[];
  return ids
    .filter((id) => state[id]?.pass === false)
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

/** Build full report from current state. */
export function buildReport(state: ChecklistState): ChecklistReport {
  return {
    ready: getReadiness(state),
    strengths: getStrengths(state),
    weaknesses: getWeaknesses(state),
    notesSummary: getNotesSummary(state),
  };
}
