"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LicenseLevel } from "@/app/modules/data";
import { getLicenseLabel, QUIZZES, type QuizItem } from "./data";
import { getPassedQuizIds } from "./passedQuizzes";

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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function QuizCard({
  quiz,
  passedIds,
}: {
  quiz: QuizItem;
  passedIds: Set<string>;
}) {
  const completed = passedIds.has(quiz.id);
  return (
    <article
      className="pathway-card group flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-300"
      style={{
        backgroundColor: "var(--midnight-indigo)",
        borderColor: "transparent",
      }}
    >
      <div
        className="h-36 w-full shrink-0"
        style={{ backgroundColor: "var(--void-purple)" }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-5">
        <span
          className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: "var(--lavender-mist)",
            color: "var(--void-purple)",
          }}
        >
          <IconClipboard />
          {quiz.category}
        </span>
        <h2
          className="mb-2 text-lg font-bold"
          style={{ color: "var(--ghost-white)" }}
        >
          {quiz.title}
        </h2>
        <p
          className="mb-4 flex-1 text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--lavender-mist)" }}
        >
          {quiz.description}
        </p>
        <div
          className="mb-4 flex w-fit items-baseline gap-1 rounded-lg px-3 py-2"
          style={{
            backgroundColor: "var(--void-purple)",
            color: "var(--ghost-white)",
          }}
        >
          <span className="text-xl font-bold">{quiz.questionCount}</span>
          <span className="text-sm">
            question{quiz.questionCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          {completed ? (
            <span
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "var(--neon-mint)" }}
            >
              <IconCheck />
              Completed
            </span>
          ) : null}
          <Link
            href={`/quizzes/${quiz.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-95"
            style={{ backgroundColor: "var(--crimson-spark)" }}
          >
            {completed ? "Retake quiz" : "Take quiz"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function QuizzesListPage() {
  const [activeLicense, setActiveLicense] = useState<LicenseLevel>("G1");
  const [passedIds, setPassedIds] = useState<Set<string>>(() => getPassedQuizIds());

  // Re-read passed quizzes when returning from a quiz or when storage is updated
  useEffect(() => {
    const sync = () => setPassedIds(getPassedQuizIds());
    sync();
    window.addEventListener("driveaura-quizzes-passed-updated", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("driveaura-quizzes-passed-updated", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const filteredQuizzes = useMemo(
    () => QUIZZES.filter((q) => q.licenseLevel === activeLicense),
    [activeLicense]
  );

  const progress = useMemo(() => {
    const forLicense = QUIZZES.filter((q) => q.licenseLevel === activeLicense);
    const total = forLicense.length;
    const passed = forLicense.filter((q) => passedIds.has(q.id)).length;
    return total ? Math.round((passed / total) * 100) : 0;
  }, [activeLicense, passedIds]);

  const tabs: LicenseLevel[] = ["G1", "G2", "G"];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="mb-10 text-center">
          <p
            className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: "var(--lavender-mist)",
              color: "var(--void-purple)",
            }}
          >
            <IconClipboard />
            Quizzes
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <span style={{ color: "var(--ghost-white)" }}>Test Your </span>
            <span style={{ color: "var(--crimson-spark)" }}>Knowledge</span>
          </h1>
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--lavender-mist)" }}
          >
            Test your knowledge with a quiz for each learning module. Complete
            quizzes to track your progress.
          </p>
        </header>

        <section
          className="mb-8 rounded-xl p-4 sm:p-5"
          style={{ backgroundColor: "var(--midnight-indigo)" }}
          aria-label={`${getLicenseLabel(activeLicense)} quiz progress`}
        >
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--lavender-mist)" }}
              >
                {getLicenseLabel(activeLicense)} quiz progress
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--ghost-white)" }}
              >
                {progress}%
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--void-purple)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "var(--ghost-white)",
                }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </section>

        <nav
          className="mb-8 flex flex-wrap justify-center gap-2"
          aria-label="License level"
        >
          {tabs.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setActiveLicense(level)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all sm:px-6 sm:py-3 sm:text-base"
              style={{
                backgroundColor:
                  activeLicense === level
                    ? "var(--crimson-spark)"
                    : "var(--midnight-indigo)",
                color: "var(--ghost-white)",
                border:
                  activeLicense === level
                    ? "2px solid var(--crimson-spark)"
                    : "2px solid var(--lavender-mist)",
              }}
            >
              <IconClock />
              {getLicenseLabel(level)}
            </button>
          ))}
        </nav>

        <section aria-label={`Quizzes for ${getLicenseLabel(activeLicense)}`}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((q) => (
              <QuizCard key={q.id} quiz={q} passedIds={passedIds} />
            ))}
          </div>
          {filteredQuizzes.length === 0 && (
            <p
              className="rounded-xl border-2 p-8 text-center"
              style={{
                backgroundColor: "var(--midnight-indigo)",
                borderColor: "var(--lavender-mist)",
                color: "var(--lavender-mist)",
              }}
            >
              No quizzes for this license level yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
