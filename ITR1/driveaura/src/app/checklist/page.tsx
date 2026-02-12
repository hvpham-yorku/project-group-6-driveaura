"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryRow } from "./components/CategoryRow";
import { ReportSection } from "./components/ReportSection";
import type { ChecklistCategoryId, ChecklistState } from "./types";
import { CHECKLIST_CATEGORY_IDS, type ChecklistReport } from "./types";
import { buildReport } from "./utils";

function getInitialState(): ChecklistState {
  const state = {} as ChecklistState;
  for (const id of CHECKLIST_CATEGORY_IDS) {
    state[id] = { pass: false, notes: "" };
  }
  return state;
}

export default function ChecklistPage() {
  const [state, setState] = useState<ChecklistState>(getInitialState);
  const [report, setReport] = useState<ChecklistReport | null>(null);

  const updateCategory = useMemo(
    () => (categoryId: ChecklistCategoryId, next: ChecklistState[ChecklistCategoryId]) => {
      setState((prev) => ({ ...prev, [categoryId]: next }));
    },
    []
  );

  function handleGenerateReport() {
    setReport(buildReport(state));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Checklist for Passenger – G2 and G
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Yes/No per category. Optional notes. Generate a report to see pass/fail
        readiness, strengths, and weaknesses.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateReport();
        }}
        className="space-y-4"
      >
        {CHECKLIST_CATEGORY_IDS.map((id) => (
          <CategoryRow
            key={id}
            categoryId={id}
            value={state[id]}
            onChange={updateCategory}
          />
        ))}

        <button
          type="submit"
          className="w-full rounded-md bg-ontario-blue px-4 py-3 text-sm font-medium text-white hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        >
          Generate Report
        </button>
      </form>

      {report && (
        <div className="mt-8">
          <ReportSection report={report} />
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
