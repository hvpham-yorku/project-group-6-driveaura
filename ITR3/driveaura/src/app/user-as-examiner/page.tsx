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
        <p className="mb-4 flex-1 text-sm text-lavender-mist line-clamp-3">
          {scenario.caseStudy}
        </p>
        <Link
          href={`/user-as-examiner/${scenario.id}`}
          className="inline-flex items-center justify-center gap-2 rounded bg-crimson-spark px-4 py-2 text-sm font-medium text-ghost-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
        >
          <IconPlay />
          Mock grading
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
        <p className="mb-6 text-lavender-mist">
          Act as the examiner: read each case study and classify the driver error
          on an MTO-style rubric. Submit your verdict, earn Aura Points when
          correct, and review official-style guidance when not.
        </p>

        <section
          aria-labelledby="rubric-explainer-heading"
          className="mb-10 rounded-lg border border-electric-cyan/30 bg-midnight-indigo p-5 shadow-lg shadow-black/20 sm:p-6"
        >
          <h2
            id="rubric-explainer-heading"
            className="mb-3 text-lg font-semibold text-ghost-white"
          >
            Minor vs major — what to choose
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-lavender-mist">
            Ontario road tests use deductions for errors. For this practice tool,
            use the labels below the same way an examiner thinks about risk and
            rule violations—not every mistake is equally serious.
          </p>
          <ul className="space-y-4 text-sm leading-relaxed text-lavender-mist">
            <li>
              <span className="font-semibold text-electric-cyan">Minor error</span>
              <span className="text-lavender-mist">
                {" "}
                — A mistake that shows imperfect technique or timing but does{" "}
                <strong className="text-ghost-white">not</strong> put people in
                clear danger, break a fundamental rule (e.g. full stop at a stop
                sign), or create a serious conflict. Examples: slightly late
                signal when you still signaled before moving, a bit wide on a turn
                with no oncoming issue, or a small positioning fix that stayed
                under control.
              </span>
            </li>
            <li>
              <span className="font-semibold text-crimson-spark">
                Major / critical error
              </span>
              <span className="text-lavender-mist">
                {" "}
                — A serious violation or unsafe act examiners treat as
                high-risk: right-of-way failures, ignoring controls (rolling
                stops, red lights), missing blind spots or shoulder checks when
                they matter for safety, speeding in sensitive zones, or forcing
                others to brake or swerve. These often match automatic-fail
                territory on a real test.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-lavender-mist/90">
            Read the case study, pick the column that best matches how serious the
            error is, then open a scenario to try mock grading.
          </p>
        </section>

        <section aria-label="Mock grading scenarios">
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
