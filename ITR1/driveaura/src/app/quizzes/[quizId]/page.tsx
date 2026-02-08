"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { QUIZZES, type QuizQuestion } from "../data";

const PASS_PERCENT = 70;

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

function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = typeof params.quizId === "string" ? params.quizId : "";
  const questionParam = searchParams.get("q");

  const quiz = useMemo(
    () => QUIZZES.find((q) => q.id === quizId),
    [quizId]
  );

  const questionIndex = useMemo(() => {
    if (!quiz?.questions.length) return 0;
    const idx = questionParam
      ? quiz.questions.findIndex((q: QuizQuestion) => q.id === questionParam)
      : -1;
    return idx >= 0 ? idx : 0;
  }, [quiz, questionParam]);

  /** Selected answer per question id (option index). */
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz?.questions[questionIndex];
  const totalQuestions = quiz?.questions.length ?? 0;
  const isLastQuestion = totalQuestions > 0 && questionIndex === totalQuestions - 1;
  const selectedOption = currentQuestion
    ? answers[currentQuestion.id] ?? null
    : null;

  const setSelectedOption = (idx: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }));
  };

  /** Compute results when quiz is submitted. */
  const results = useMemo(() => {
    if (!quiz || !submitted) return null;
    let correct = 0;
    let wrong = 0;
    for (const q of quiz.questions) {
      const chosen = answers[q.id];
      if (chosen === undefined) wrong += 1;
      else if (chosen === q.correctIndex) correct += 1;
      else wrong += 1;
    }
    const total = quiz.questions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= PASS_PERCENT;
    return { correct, wrong, total, percent, passed };
  }, [quiz, submitted, answers]);

  if (!quiz) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-slate-600">Quiz not found.</p>
        <Link
          href="/quizzes"
          className="mt-4 inline-flex items-center gap-2 text-ontario-blue hover:underline"
        >
          <IconChevronLeft />
          Back to Quizzes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 text-sm font-medium text-ontario-blue hover:underline"
          >
            <IconChevronLeft />
            Back to Quizzes
          </Link>
          <span className="text-sm text-slate-500">
            {submitted
              ? `${quiz.title} — Results`
              : `${quiz.title} — Question ${questionIndex + 1} of ${totalQuestions}`}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        {!submitted && (
          <aside className="w-full border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
            <nav className="p-4" aria-label="Quiz questions">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Questions
              </h2>
              <ul className="space-y-1">
                {quiz.questions.map((q: QuizQuestion, idx: number) => {
                  const isActive = idx === questionIndex;
                  const href = `/quizzes/${quizId}?q=${q.id}`;
                  return (
                    <li key={q.id}>
                      <Link
                        href={href}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-ontario-blue text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Question {idx + 1}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}

        <div className="flex-1 p-4 lg:p-8">
          {submitted && results ? (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-6 text-2xl font-bold text-slate-900">
                Quiz results
              </h1>

              <div
                className={`mb-6 rounded-lg border-2 p-6 text-center ${
                  results.passed
                    ? "border-green-600 bg-green-50"
                    : "border-amber-600 bg-amber-50"
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    results.passed ? "text-green-800" : "text-amber-800"
                  }`}
                >
                  {results.passed ? "Passed" : "Not passed"}
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {results.percent}%
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Need {PASS_PERCENT}% to pass
                </p>
              </div>

              <ul className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                <li className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-2 text-slate-700">
                    <IconCheck className="shrink-0 text-green-600" />
                    Correct
                  </span>
                  <span className="font-semibold text-slate-900">
                    {results.correct} of {results.total}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-slate-700">
                    <IconX className="shrink-0 text-red-600" />
                    Wrong
                  </span>
                  <span className="font-semibold text-slate-900">
                    {results.wrong} of {results.total}
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/quizzes"
                  className="inline-flex items-center justify-center rounded bg-ontario-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
                >
                  Back to Quizzes
                </Link>
                <Link
                  href={`/quizzes/${quizId}`}
                  className="inline-flex items-center justify-center rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers({});
                  }}
                >
                  Retake quiz
                </Link>
              </div>
            </div>
          ) : currentQuestion ? (
            <>
              <h1 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">
                {currentQuestion.prompt}
              </h1>

              <div className="space-y-3" role="radiogroup" aria-label="Answer options">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                      selectedOption === idx
                        ? "border-ontario-blue bg-ontario-blue/5"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => setSelectedOption(idx)}
                      className="h-4 w-4 border-slate-300 text-ontario-blue focus:ring-ontario-blue"
                    />
                    <span className="text-slate-800">{option}</span>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="inline-flex items-center justify-center rounded bg-ontario-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
                  >
                    Submit quiz
                  </button>
                ) : (
                  <Link
                    href={`/quizzes/${quizId}?q=${quiz.questions[questionIndex + 1].id}`}
                    className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2 ${
                      selectedOption === null
                        ? "pointer-events-none bg-slate-200 text-slate-500"
                        : "bg-ontario-blue text-white hover:bg-ontario-blue-light"
                    }`}
                  >
                    Next question →
                  </Link>
                )}
              </div>
            </>
          ) : (
            <p className="text-slate-600">No question selected.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function QuizTakePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading…
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
