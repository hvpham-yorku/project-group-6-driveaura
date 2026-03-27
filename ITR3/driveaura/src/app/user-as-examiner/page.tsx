"use client";

import Link from "next/link";
import {
  ENVIRONMENT_LABELS,
  USER_AS_EXAMINER_SCENARIOS,
  type ExaminerScenario,
} from "./data";

function IconClipboard() {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

function IconPlay() {
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
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ScenarioCard({ scenario }: { scenario: ExaminerScenario }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-electric-cyan/30 bg-midnight-indigo shadow-lg shadow-black/20 transition-all hover:border-electric-cyan/60 hover:shadow-xl">
      <div
        className="h-36 w-full shrink-0 bg-midnight-indigo/80"
        style={{ backgroundColor: "var(--midnight-indigo)" }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded bg-midnight-indigo/80 px-2 py-0.5 text-xs font-medium text-electric-cyan border border-electric-cyan/20">
          <IconClipboard />
          {ENVIRONMENT_LABELS[scenario.environment]}
        </span>
        <h2 className="mb-2 text-lg font-semibold text-ghost-white">
          {scenario.title}
        </h2>
        <p className="mb-4 flex-1 text-sm text-lavender-mist line-clamp-2">
          Watch the 10-second clip as the examiner and spot the driver&apos;s
          mistake.
        </p>
        <Link
          href={`/user-as-examiner/${scenario.id}`}
          className="inline-flex items-center justify-center gap-2 rounded bg-crimson-spark px-4 py-2 text-sm font-medium text-ghost-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
        >
          <IconPlay />
          Start scenario
        </Link>
      </div>
    </article>
  );
}

export default function UserAsExaminerListPage() {
  return (
    <main className="min-h-screen bg-void-purple">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <h1 className="mb-6 text-2xl font-bold text-ghost-white sm:text-3xl">
          User as Examiner
        </h1>
        <p className="mb-8 text-lavender-mist">
          Act as the examiner: watch each 10-second first-person driving clip and
          identify what the driver did wrong. Practice spotting common
          automatic-fail violations and earn examiner-style feedback.
        </p>

        <section aria-label="Spot the mistake scenarios">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {USER_AS_EXAMINER_SCENARIOS.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
