"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryRow } from "./components/CategoryRow";
import type { ChecklistCategoryId, ChecklistState } from "./types";
import { CHECKLIST_CATEGORY_IDS } from "./types";
import { getInitialState } from "./utils";

export default function ChecklistPage() {
  const [state, setState] = useState<ChecklistState>(getInitialState);

  const updateCategory = useMemo(
    () => (categoryId: ChecklistCategoryId, next: ChecklistState[ChecklistCategoryId]) => {
      setState((prev) => ({ ...prev, [categoryId]: next }));
    },
    []
  );

  return (
    <div
      className="mx-auto max-w-2xl px-4 py-12 min-h-screen"
      style={{ backgroundColor: "#0F051D" }}
    >
      <h1 className="mb-2 text-2xl font-semibold" style={{ color: "#F5F5F7" }}>
        Checklist for Passenger – G2 and G
      </h1>

      <div className="mb-6 space-y-4">
        {CHECKLIST_CATEGORY_IDS.map((id) => (
          <CategoryRow
            key={id}
            categoryId={id}
            value={state[id]}
            onChange={updateCategory}
          />
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm underline transition-colors"
          style={{ color: "#B8B0D3" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F5F5F7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#B8B0D3";
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
