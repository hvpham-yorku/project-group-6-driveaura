"use client";

import type { ChecklistCategoryId, ChecklistCategoryResponse } from "../types";
import { CHECKLIST_CATEGORY_LABELS } from "../types";

interface CategoryRowProps {
  categoryId: ChecklistCategoryId;
  value: ChecklistCategoryResponse;
  onChange: (
    categoryId: ChecklistCategoryId,
    next: ChecklistCategoryResponse
  ) => void;
}

export function CategoryRow({ categoryId, value, onChange }: CategoryRowProps) {
  const label = CHECKLIST_CATEGORY_LABELS[categoryId];

  function setPass(pass: boolean) {
    onChange(categoryId, { ...value, pass });
  }

  function setNotes(notes: string) {
    onChange(categoryId, { ...value, notes });
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPass(true)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              value.pass
                ? "border-ontario-blue bg-ontario-blue text-white dark:bg-ontario-blue-light dark:text-white"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setPass(false)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              !value.pass
                ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            No
          </button>
        </div>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
          Optional notes
        </span>
        <textarea
          value={value.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes for this category..."
          rows={2}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-ontario-blue focus:outline-none focus:ring-1 focus:ring-ontario-blue dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
      </label>
    </div>
  );
}
