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

export interface ChecklistCategoryResponse {
  pass: boolean; // Yes = true, No = false
  notes: string;
}

export type ChecklistState = Record<ChecklistCategoryId, ChecklistCategoryResponse>;

export interface ChecklistReport {
  ready: boolean; // pass/fail readiness
  strengths: string[];
  weaknesses: string[];
  notesSummary: { category: string; notes: string }[];
}
