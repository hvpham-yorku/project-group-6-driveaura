"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ENVIRONMENT_LABELS,
  USER_AS_EXAMINER_SCENARIOS,
} from "../data";

const OPTION_LETTERS = ["A", "B", "C", "D"];

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

export default function UserAsExaminerScenarioPage() {
  const params = useParams();
  const scenarioId =
    typeof params.scenarioId === "string" ? params.scenarioId : "";
  const scenario = USER_AS_EXAMINER_SCENARIOS.find((s) => s.id === scenarioId);

  const [step, setStep] = useState<"watch" | "answer" | "feedback">("watch");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = selectedIndex !== null && selectedIndex === scenario?.correctIndex;
  const showFeedback = submitted && step === "feedback";

  if (!scenario) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-slate-600">Scenario not found.</p>
        <Link
          href="/user-as-examiner"
          className="mt-4 inline-flex items-center gap-2 text-ontario-blue hover:underline"
        >
          <IconChevronLeft />
          Back to User as Examiner
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/user-as-examiner"
            className="inline-flex items-center gap-2 text-sm font-medium text-ontario-blue hover:underline"
          >
            <IconChevronLeft />
            Back to User as Examiner
          </Link>
          <span className="text-sm text-slate-500">
            {ENVIRONMENT_LABELS[scenario.environment]} — {scenario.title}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {step === "watch" && (
          <>
            <h1 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
              Watch the clip (10 seconds)
            </h1>
            <p className="mb-4 text-sm text-slate-600">
              As the examiner, observe the driver&apos;s actions. A video would
              play here; below is the visual script for this scenario.
            </p>
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-100/80 p-4 text-sm text-slate-700">
              <p className="whitespace-pre-wrap font-medium text-slate-800">
                Video visual script:
              </p>
              <p className="mt-2 whitespace-pre-wrap">{scenario.videoVisualScript}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("answer")}
              className="inline-flex items-center justify-center rounded bg-ontario-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
            >
              I&apos;ve watched the clip — Continue to question
            </button>
          </>
        )}

        {step === "answer" && !submitted && (
          <>
            <h1 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">
              {scenario.question}
            </h1>
            <div
              className="space-y-3"
              role="radiogroup"
              aria-label="Answer options"
            >
              {scenario.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                    selectedIndex === idx
                      ? "border-ontario-blue bg-ontario-blue/5"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={idx}
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                    className="h-4 w-4 border-slate-300 text-ontario-blue focus:ring-ontario-blue"
                  />
                  <span className="font-medium text-slate-700">
                    {OPTION_LETTERS[idx]}.
                  </span>
                  <span className="text-slate-800">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(true);
                  setStep("feedback");
                }}
                disabled={selectedIndex === null}
                className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2 ${
                  selectedIndex === null
                    ? "pointer-events-none bg-slate-200 text-slate-500"
                    : "bg-ontario-blue text-white hover:bg-ontario-blue-light"
                }`}
              >
                Submit answer
              </button>
            </div>
          </>
        )}

        {showFeedback && (
          <>
            <div
              className={`mb-6 rounded-lg border-2 p-6 ${
                correct
                  ? "border-green-600 bg-green-50"
                  : "border-amber-600 bg-amber-50"
              }`}
            >
              <p className="flex items-center gap-2 text-lg font-bold text-slate-900">
                {correct ? (
                  <>
                    <IconCheck className="shrink-0 text-green-600" />
                    Correct
                  </>
                ) : (
                  <>
                    <IconX className="shrink-0 text-amber-600" />
                    Incorrect
                  </>
                )}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                The major mistake was: <strong>{scenario.majorMistake}</strong>
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                Examiner&apos;s feedback
              </h2>
              <p className="text-sm text-slate-700">
                {scenario.examinerFeedback}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/user-as-examiner"
                className="inline-flex items-center justify-center rounded bg-ontario-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
              >
                Back to scenarios
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep("watch");
                  setSelectedIndex(null);
                  setSubmitted(false);
                }}
                className="inline-flex items-center justify-center rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
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
