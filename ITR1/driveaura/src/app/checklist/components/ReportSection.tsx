"use client";

import type { ChecklistReport } from "../types";

interface ReportSectionProps {
  report: ChecklistReport;
}

export function ReportSection({ report }: ReportSectionProps) {
  return (
    <section
      className="rounded-lg border-2 p-5"
      style={{
        backgroundColor: "#1C1132",
        borderColor: "#00F5FF",
      }}
      aria-labelledby="report-heading"
    >
      <h2
        id="report-heading"
        className="mb-4 text-lg font-semibold"
        style={{ color: "#F5F5F7" }}
      >
        Report
      </h2>

      <div className="mb-4">
        <span className="text-sm font-medium" style={{ color: "#B8B0D3" }}>
          Readiness:{" "}
        </span>
        <span
          className="font-semibold"
          style={{
            color: report.ready ? "#39FF14" : "#FF3B3F",
          }}
        >
          {report.ready ? "Pass (ready)" : "Fail (not ready)"}
        </span>
      </div>

      {report.strengths.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-1 text-sm font-medium" style={{ color: "#F5F5F7" }}>
            Strengths
          </h3>
          <ul className="list-inside list-disc text-sm" style={{ color: "#39FF14" }}>
            {report.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {report.weaknesses.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-1 text-sm font-medium" style={{ color: "#F5F5F7" }}>
            Weaknesses
          </h3>
          <ul className="list-inside list-disc text-sm" style={{ color: "#FF3B3F" }}>
            {report.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {report.notesSummary.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-medium" style={{ color: "#F5F5F7" }}>
            Notes summary
          </h3>
          <ul className="space-y-1 text-sm" style={{ color: "#B8B0D3" }}>
            {report.notesSummary.map(({ category, notes }) => (
              <li key={category}>
                <span className="font-medium" style={{ color: "#F5F5F7" }}>
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
          <p className="text-sm" style={{ color: "#B8B0D3" }}>
            Fill in the checklist and click Generate Report to see results.
          </p>
        )}
    </section>
  );
}
