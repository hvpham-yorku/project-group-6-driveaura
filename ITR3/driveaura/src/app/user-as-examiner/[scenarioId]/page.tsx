"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { awardExaminerScenarioPoints } from "@/lib/auraPoints";
import { ENVIRONMENT_LABELS, USER_AS_EXAMINER_SCENARIOS } from "../data";
import type { ErrorSeverity } from "../data";

function IconChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function severityLabel(s: ErrorSeverity): string {
  return s === "minor" ? "Minor error" : "Major / critical error";
}

export default function UserAsExaminerScenarioPage() {
  const params = useParams();
  const scenarioId =
    typeof params.scenarioId === "string" ? params.scenarioId : "";
  const scenario = USER_AS_EXAMINER_SCENARIOS.find((s) => s.id === scenarioId);

  const [selectedSeverity, setSelectedSeverity] = useState<ErrorSeverity | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);

  const correct =
    selectedSeverity !== null && selectedSeverity === scenario?.correctSeverity;

  const scenarioIndex = USER_AS_EXAMINER_SCENARIOS.findIndex(
    (s) => s.id === scenarioId
  );
  const nextScenario =
    scenarioIndex >= 0 &&
    scenarioIndex < USER_AS_EXAMINER_SCENARIOS.length - 1
      ? USER_AS_EXAMINER_SCENARIOS[scenarioIndex + 1]
      : null;

  useEffect(() => {
    if (!scenario || !submitted || !correct) return;
    awardExaminerScenarioPoints(scenario.id);
  }, [scenario, submitted, correct]);

  if (!scenario) {
    return (
      <main className="min-h-screen bg-void-purple px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-lavender-mist">Scenario not found.</p>
          <Link
            href="/user-as-examiner"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-electric-cyan hover:underline"
          >
            <IconChevronLeft />
            Back to User as Examiner
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void-purple">
      <div
        className="border-b px-4 py-3"
        style={{
          backgroundColor: "var(--midnight-indigo)",
          borderColor: "var(--lavender-mist)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/user-as-examiner"
            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-90"
            style={{ color: "var(--crimson-spark)" }}
          >
            <IconChevronLeft />
            Back to User as Examiner
          </Link>
          <span
            className="truncate text-right text-sm text-lavender-mist"
            title={`${ENVIRONMENT_LABELS[scenario.environment]} — ${scenario.title}`}
          >
            {ENVIRONMENT_LABELS[scenario.environment]} — {scenario.title}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <h1 className="mb-6 text-xl font-bold text-ghost-white sm:text-2xl">
          Mock Grading
        </h1>

        {!submitted && (
          <>
            <section className="mb-8 rounded-lg border border-electric-cyan/30 bg-midnight-indigo p-5 shadow-lg shadow-black/20 sm:p-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-electric-cyan">
                Case study
              </h2>
              <p className="text-base leading-relaxed text-ghost-white sm:text-[1.05rem]">
                {scenario.caseStudy}
              </p>
            </section>

            <p className="mb-4 text-sm text-lavender-mist">
              Classify the driver error using the MTO-style rubric below, then
              submit your verdict.
            </p>

            <div className="overflow-x-auto rounded-lg border border-electric-cyan/30 bg-midnight-indigo shadow-lg shadow-black/20">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-electric-cyan/20 bg-midnight-indigo/80">
                    <th className="px-4 py-3 font-semibold text-ghost-white sm:px-5">
                      Maneuver item
                    </th>
                    <th className="px-4 py-3 font-semibold text-ghost-white sm:px-5">
                      Minor error
                    </th>
                    <th className="px-4 py-3 font-semibold text-ghost-white sm:px-5">
                      Major / critical error
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="align-top border-r border-midnight-indigo px-4 py-4 text-lavender-mist sm:px-5">
                      {scenario.maneuverItem}
                    </td>
                    <td className="px-2 py-3 sm:px-4">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selectedSeverity === "minor"}
                        onClick={() => setSelectedSeverity("minor")}
                        className={`flex h-full min-h-[52px] w-full items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium text-ghost-white transition-colors ${
                          selectedSeverity === "minor"
                            ? "border-electric-cyan bg-electric-cyan/10 shadow-[0_0_0_1px_rgba(0,245,255,0.25)]"
                            : "border-midnight-indigo bg-midnight-indigo/50 hover:border-electric-cyan/50"
                        }`}
                      >
                        {selectedSeverity === "minor" ? "●" : "○"} Minor
                      </button>
                    </td>
                    <td className="px-2 py-3 sm:px-4">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selectedSeverity === "major"}
                        onClick={() => setSelectedSeverity("major")}
                        className={`flex h-full min-h-[52px] w-full items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium text-ghost-white transition-colors ${
                          selectedSeverity === "major"
                            ? "border-crimson-spark bg-crimson-spark/10 shadow-[0_0_0_1px_rgba(255,59,63,0.25)]"
                            : "border-midnight-indigo bg-midnight-indigo/50 hover:border-crimson-spark/40"
                        }`}
                      >
                        {selectedSeverity === "major" ? "●" : "○"} Major
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={selectedSeverity === null}
                className={`inline-flex min-w-[200px] items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-ghost-white transition-colors focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple ${
                  selectedSeverity === null
                    ? "pointer-events-none bg-midnight-indigo/80 text-lavender-mist/50"
                    : "bg-crimson-spark hover:opacity-90"
                }`}
              >
                Submit verdict
              </button>
              {nextScenario ? (
                <Link
                  href={`/user-as-examiner/${nextScenario.id}`}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-electric-cyan hover:underline"
                >
                  Next case study
                  <IconChevronRight />
                </Link>
              ) : null}
            </div>
          </>
        )}

        {submitted && (
          <>
            <div
              className={`mb-6 rounded-xl border-2 p-6 ${
                correct
                  ? "border-neon-mint bg-neon-mint/10"
                  : "border-crimson-spark bg-crimson-spark/10"
              }`}
            >
              <p className="flex items-center gap-2 text-lg font-bold text-ghost-white">
                {correct ? (
                  <>
                    <IconCheck className="shrink-0 text-neon-mint" />
                    Verdict correct
                  </>
                ) : (
                  <>
                    <IconX className="shrink-0 text-crimson-spark" />
                    Verdict incorrect
                  </>
                )}
              </p>
              {correct && (
                <p className="mt-3 text-sm leading-relaxed text-lavender-mist">
                  You classified this as{" "}
                  <strong className="text-ghost-white">
                    {severityLabel(scenario.correctSeverity)}
                  </strong>
                  . Aura Points have been added for this scenario (first correct
                  verdict only).
                </p>
              )}
              <p className="mt-2 text-sm text-lavender-mist">
                Error identified:{" "}
                <strong className="text-ghost-white">
                  {scenario.majorMistake}
                </strong>
              </p>
            </div>

            {correct && (
              <div className="mb-6 rounded-lg border border-electric-cyan/30 bg-midnight-indigo p-6 shadow-lg shadow-black/20">
                <h2 className="mb-3 text-base font-semibold text-ghost-white">
                  Examiner feedback
                </h2>
                <p className="text-sm leading-relaxed text-lavender-mist">
                  {scenario.examinerFeedback}
                </p>
              </div>
            )}

            {!correct && (
              <div className="mb-6 rounded-lg border border-electric-cyan/30 bg-midnight-indigo p-6 shadow-lg shadow-black/20">
                <h2 className="mb-3 text-base font-semibold text-electric-cyan">
                  MTO guidance
                </h2>
                <p className="text-sm leading-relaxed text-lavender-mist">
                  {scenario.mtoGuidance}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {nextScenario ? (
                <Link
                  href={`/user-as-examiner/${nextScenario.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-crimson-spark px-5 py-2.5 text-sm font-medium text-ghost-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
                >
                  Next case study
                  <IconChevronRight />
                </Link>
              ) : null}
              <Link
                href="/user-as-examiner"
                className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple ${
                  nextScenario
                    ? "border border-electric-cyan/50 bg-midnight-indigo text-lavender-mist hover:border-electric-cyan"
                    : "bg-crimson-spark text-ghost-white hover:opacity-90"
                }`}
              >
                Back to scenarios
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSelectedSeverity(null);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-electric-cyan/50 bg-midnight-indigo px-5 py-2.5 text-sm font-medium text-lavender-mist transition-colors hover:border-electric-cyan focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
              >
                Try again
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
