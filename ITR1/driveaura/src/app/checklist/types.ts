/**
 * Checklist for Passenger – G2 and G driving tests.
 * Self-contained types for this module.
 */

export const CHECKLIST_CATEGORY_IDS = [
  "safety",
  "mirrors",
  "lane_changes",
  "passenger_rules",
] as const;

export type ChecklistCategoryId = (typeof CHECKLIST_CATEGORY_IDS)[number];

export const CHECKLIST_CATEGORY_LABELS: Record<ChecklistCategoryId, string> = {
  safety: "Safety",
  mirrors: "Mirrors",
  lane_changes: "Lane changes",
  passenger_rules: "Passenger rules & restrictions",
};

/** Sub-checkpoints per category (3–5 items). Empty array = no sub-items yet. */
export const CHECKLIST_SUBITEMS: Record<ChecklistCategoryId, string[]> = {
  safety: [
    "Seatbelt fastened before moving",
    "Mirrors and seat adjusted",
    "Hands in correct position (10 and 2 or 9 and 3)",
    "Speed appropriate for conditions",
  ],
  mirrors: [],
  lane_changes: [],
  passenger_rules: [],
};

export interface ChecklistCategoryResponse {
  pass: boolean; // Yes = true, No = false
  notes: string;
  /** For categories with sub-items: checked state per sub-item. Length matches CHECKLIST_SUBITEMS[id].length. */
  subChecks?: boolean[];
}

export type ChecklistState = Record<ChecklistCategoryId, ChecklistCategoryResponse>;

export interface CategoryCompletion {
  categoryId: ChecklistCategoryId;
  label: string;
  completed: number;
  total: number;
}

export interface ChecklistReport {
  ready: boolean; // pass/fail readiness (all categories >= 75% or pass)
  strengths: string[];
  weaknesses: string[];
  notesSummary: { category: string; notes: string }[];
  categoryCompletion: CategoryCompletion[];
}
