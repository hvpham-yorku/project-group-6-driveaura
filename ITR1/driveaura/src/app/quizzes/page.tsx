"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LicenseLevel } from "@/app/modules/data";
import { getLicenseLabel, QUIZZES, type QuizItem } from "./data";

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

/** Demo: completed quiz IDs for progress. Replace with real state later. */
const DEMO_COMPLETED_IDS = new Set<string>([]);

function QuizCard({ quiz }: { quiz: QuizItem }) {
  const completed = DEMO_COMPLETED_IDS.has(quiz.id);
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className="h-36 w-full shrink-0 bg-slate-200"
        style={{ backgroundColor: "var(--ontario-gray)" }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-ontario-slate">
          <IconClipboard />
          {quiz.category}
        </span>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">{quiz.title}</h2>
        <p className="mb-4 flex-1 text-sm text-slate-600 line-clamp-3">
          {quiz.description}
        </p>
        <p className="mb-3 text-xs text-slate-500">
          {quiz.questionCount} question{quiz.questionCount !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center justify-between gap-2">
          {completed ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ontario-blue">
              <IconCheck />
              Completed
            </span>
          ) : null}
          <Link
            href={`/quizzes/${quiz.id}`}
            className="inline-flex items-center justify-center rounded bg-ontario-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
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

  const filteredQuizzes = useMemo(
    () => QUIZZES.filter((q) => q.licenseLevel === activeLicense),
    [activeLicense]
  );

  const progress = useMemo(() => {
    const forLicense = QUIZZES.filter((q) => q.licenseLevel === activeLicense);
    const total = forLicense.length;
    const completed = forLicense.filter((q) => DEMO_COMPLETED_IDS.has(q.id)).length;
    return total ? Math.round((completed / total) * 100) : 0;
  }, [activeLicense]);

  const tabs: LicenseLevel[] = ["G1", "G2", "G"];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-700">
              {getLicenseLabel(activeLicense)} quiz progress
            </span>
            <span className="text-sm text-slate-500">{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-ontario-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
          Quizzes
        </h1>
        <p className="mb-8 text-slate-600">
          Test your knowledge with a quiz for each learning module. Complete quizzes to track your progress.
        </p>

        <nav
          className="mb-8 border-b border-slate-200"
          aria-label="License level"
        >
          <ul className="flex gap-0">
            {tabs.map((level) => (
              <li key={level}>
                <button
                  type="button"
                  onClick={() => setActiveLicense(level)}
                  className={`relative border-b-2 px-4 py-3 text-sm font-medium transition-colors sm:px-6 sm:py-4 sm:text-base ${
                    activeLicense === level
                      ? "border-ontario-blue text-ontario-blue"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <IconClock />
                    {getLicenseLabel(level)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label={`Quizzes for ${getLicenseLabel(activeLicense)}`}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((q) => (
              <QuizCard key={q.id} quiz={q} />
            ))}
          </div>
          {filteredQuizzes.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
              No quizzes for this license level yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
