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
      <main className="min-h-screen bg-void-purple px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-lavender-mist">Scenario not found.</p>
          <Link
            href="/user-as-examiner"
            className="mt-4 inline-flex items-center gap-2 text-electric-cyan hover:underline"
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
      <div className="border-b border-midnight-indigo bg-midnight-indigo/50 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/user-as-examiner"
            className="inline-flex items-center gap-2 text-sm font-medium text-electric-cyan hover:underline"
          >
            <IconChevronLeft />
            Back to User as Examiner
          </Link>
          <span className="text-sm text-lavender-mist">
            {ENVIRONMENT_LABELS[scenario.environment]} — {scenario.title}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {step === "watch" && (
          <>
            <h1 className="mb-4 text-xl font-bold text-ghost-white sm:text-2xl">
              Watch the clip (10 seconds)
            </h1>
            <p className="mb-4 text-sm text-lavender-mist">
              As the examiner, observe the driver&apos;s actions. A video would
              play here; below is the visual script for this scenario.
            </p>
            <div className="mb-6 rounded-lg border border-electric-cyan/30 bg-midnight-indigo p-4 text-sm text-lavender-mist">
              <p className="font-medium text-ghost-white">
                Video visual script:
              </p>
              <p className="mt-2 whitespace-pre-wrap">{scenario.videoVisualScript}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("answer")}
              className="inline-flex items-center justify-center rounded bg-crimson-spark px-4 py-2 text-sm font-medium text-ghost-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
            >
              I&apos;ve watched the clip — Continue to question
            </button>
          </>
        )}

        {step === "answer" && !submitted && (
          <>
            <h1 className="mb-6 text-xl font-bold text-ghost-white sm:text-2xl">
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
                      ? "border-electric-cyan bg-electric-cyan/10"
                      : "border-midnight-indigo bg-midnight-indigo hover:border-electric-cyan/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={idx}
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                    className="h-4 w-4 border-lavender-mist/50 text-crimson-spark focus:ring-electric-cyan"
                  />
                  <span className="font-medium text-ghost-white">
                    {OPTION_LETTERS[idx]}.
                  </span>
                  <span className="text-lavender-mist">{option}</span>
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
                className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple ${
                  selectedIndex === null
                    ? "pointer-events-none bg-midnight-indigo/80 text-lavender-mist/50"
                    : "bg-crimson-spark text-ghost-white hover:opacity-90"
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
                  ? "border-neon-mint bg-neon-mint/10"
                  : "border-crimson-spark bg-crimson-spark/10"
              }`}
            >
              <p className="flex items-center gap-2 text-lg font-bold text-ghost-white">
                {correct ? (
                  <>
                    <IconCheck className="shrink-0 text-neon-mint" />
                    Correct
                  </>
                ) : (
                  <>
                    <IconX className="shrink-0 text-crimson-spark" />
                    Incorrect
                  </>
                )}
              </p>
              <p className="mt-2 text-sm text-lavender-mist">
                The major mistake was: <strong className="text-ghost-white">{scenario.majorMistake}</strong>
              </p>
            </div>
            <div className="rounded-lg border border-electric-cyan/30 bg-midnight-indigo p-6">
              <h2 className="mb-3 text-base font-semibold text-ghost-white">
                Examiner&apos;s feedback
              </h2>
              <p className="text-sm text-lavender-mist">
                {scenario.examinerFeedback}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/user-as-examiner"
                className="inline-flex items-center justify-center rounded bg-crimson-spark px-4 py-2 text-sm font-medium text-ghost-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
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
                className="inline-flex items-center justify-center rounded border border-electric-cyan/50 bg-midnight-indigo px-4 py-2 text-sm font-medium text-lavender-mist transition-colors hover:border-electric-cyan focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
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
