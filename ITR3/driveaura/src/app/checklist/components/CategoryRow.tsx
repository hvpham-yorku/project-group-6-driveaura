"use client";

import { useMemo } from "react";
import type { ChecklistCategoryId, ChecklistCategoryResponse } from "../types";
import { CHECKLIST_CATEGORY_LABELS, CHECKLIST_SUBITEMS } from "../types";

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
  const subItems = CHECKLIST_SUBITEMS[categoryId];
  const hasSubItems = subItems.length > 0;
  const subChecks = value.subChecks ?? [];

  /** Progress bar matches utils.getCategoryCompletionRatio (sub-checks vs Yes/No-only). */
  const progressPercent = useMemo(() => {
    if (hasSubItems) {
      const total = subItems.length;
      if (total === 0) return 0;
      const done = subChecks.filter(Boolean).length;
      return Math.round((done / total) * 100);
    }
    return value.pass ? 100 : 0;
  }, [hasSubItems, subItems.length, subChecks, value.pass]);

  function setPass(pass: boolean) {
    onChange(categoryId, { ...value, pass });
  }

  function setNotes(notes: string) {
    onChange(categoryId, { ...value, notes });
  }

  function setSubCheck(index: number, checked: boolean) {
    const next = [...(value.subChecks ?? [])];
    next[index] = checked;
    onChange(categoryId, { ...value, subChecks: next });
  }

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: "#1C1132",
        borderColor: value.pass ? "#39FF14" : "#00F5FF",
        borderWidth: value.pass ? "2px" : "1px",
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium" style={{ color: "#F5F5F7" }}>
          {label}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPass(true)}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors"
            style={{
              backgroundColor: value.pass ? "#39FF14" : "transparent",
              borderColor: value.pass ? "#39FF14" : "#B8B0D3",
              color: value.pass ? "#0F051D" : "#B8B0D3",
            }}
            onMouseEnter={(e) => {
              if (!value.pass) {
                e.currentTarget.style.borderColor = "#00F5FF";
                e.currentTarget.style.color = "#F5F5F7";
              }
            }}
            onMouseLeave={(e) => {
              if (!value.pass) {
                e.currentTarget.style.borderColor = "#B8B0D3";
                e.currentTarget.style.color = "#B8B0D3";
              }
            }}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setPass(false)}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors"
            style={{
              backgroundColor: !value.pass ? "#FF3B3F" : "transparent",
              borderColor: !value.pass ? "#FF3B3F" : "#B8B0D3",
              color: !value.pass ? "#F5F5F7" : "#B8B0D3",
            }}
            onMouseEnter={(e) => {
              if (value.pass) {
                e.currentTarget.style.borderColor = "#FF3B3F";
                e.currentTarget.style.color = "#F5F5F7";
              }
            }}
            onMouseLeave={(e) => {
              if (value.pass) {
                e.currentTarget.style.borderColor = "#B8B0D3";
                e.currentTarget.style.color = "#B8B0D3";
              }
            }}
          >
            No
          </button>
        </div>
      </div>
      <div className="mb-3 h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#0F051D" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ backgroundColor: "#00F5FF", width: `${progressPercent}%` }}
        />
      </div>
      {hasSubItems && (
        <div className="mb-4 mt-1 space-y-2 pl-1">
          <span className="block text-xs font-medium" style={{ color: "#B8B0D3" }}>
            Sub-checkpoints
          </span>
          <ul className="space-y-2">
            {subItems.map((text, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${categoryId}-sub-${i}`}
                  checked={subChecks[i] === true}
                  onChange={(e) => setSubCheck(i, e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                  style={{ accentColor: "#00F5FF" }}
                />
                <label
                  htmlFor={`${categoryId}-sub-${i}`}
                  className="cursor-pointer text-sm"
                  style={{ color: "#F5F5F7" }}
                >
                  {text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-xs" style={{ color: "#B8B0D3" }}>
          Optional notes
        </span>
        <textarea
          value={value.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes for this category..."
          rows={2}
          className="w-full rounded-md border px-3 py-2 text-sm placeholder:text-[#B8B0D3] focus:outline-none focus:ring-1"
          style={{
            backgroundColor: "#0F051D",
            borderColor: "#B8B0D3",
            color: "#F5F5F7",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#00F5FF";
            e.currentTarget.style.boxShadow = "0 0 0 1px #00F5FF";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#B8B0D3";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </label>
    </div>
  );
}
