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

/** Sub-checkpoints per category (3–5 items). */
export const CHECKLIST_SUBITEMS: Record<ChecklistCategoryId, string[]> = {
  safety: [
    "Seatbelt fastened before moving",
    "Mirrors and seat adjusted",
    "Hands in correct position (10 and 2 or 9 and 3)",
    "Speed appropriate for conditions",
  ],
  mirrors: [
    "Rear-view mirror adjusted before driving",
    "Side mirrors set to minimize blind spots",
    "Checked mirrors before signalling or changing speed",
    "Shoulder check before lane change or turn",
  ],
  lane_changes: [
    "Signalled in advance (e.g. 3–5 seconds)",
    "Checked mirrors and blind spot before moving",
    "Smooth lane change without affecting other traffic",
    "Cancelled signal after completing the change",
  ],
  passenger_rules: [
    "Know G1/G2 passenger restrictions (e.g. supervising driver)",
    "All passengers have seatbelts fastened",
    "No distraction from passengers (focused on driving)",
    "Passenger limits and conditions for your licence class",
  ],
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
