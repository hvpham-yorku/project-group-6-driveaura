"use client";

import type { ChecklistReport } from "../types";

interface ReportSectionProps {
  report: ChecklistReport;
}

export function ReportSection({ report }: ReportSectionProps) {
  return (
    <section
      className="rounded-lg border-2 border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
      aria-labelledby="report-heading"
    >
      <h2
        id="report-heading"
        className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
      >
        Report
      </h2>

      <div className="mb-4">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Readiness:{" "}
        </span>
        <span
          className={`font-semibold ${
            report.ready
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {report.ready ? "Pass (ready)" : "Fail (not ready)"}
        </span>
      </div>

      {report.strengths.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Strengths
          </h3>
          <ul className="list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
            {report.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {report.weaknesses.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Weaknesses
          </h3>
          <ul className="list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
            {report.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {report.notesSummary.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes summary
          </h3>
          <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            {report.notesSummary.map(({ category, notes }) => (
              <li key={category}>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {category}:
                </span>{" "}
                {notes}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.strengths.length === 0 &&
        report.weaknesses.length === 0 &&
        report.notesSummary.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Fill in the checklist and click Generate Report to see results.
          </p>
        )}
    </section>
  );
}
