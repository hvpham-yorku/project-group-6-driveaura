"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { QUIZZES, type QuizQuestion } from "../data";
import { addPassedQuiz } from "../passedQuizzes";

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

  // Persist passed quiz so progress bar updates (only when user passes)
  useEffect(() => {
    if (results?.passed && quizId) {
      addPassedQuiz(quizId);
    }
  }, [results?.passed, quizId]);

  if (!quiz) {
    return (
      <main
        className="mx-auto max-w-5xl px-4 py-12"
        style={{ backgroundColor: "var(--void-purple)" }}
      >
        <p style={{ color: "var(--lavender-mist)" }}>Quiz not found.</p>
        <Link
          href="/quizzes"
          className="mt-4 inline-flex items-center gap-2 font-medium hover:opacity-90"
          style={{ color: "var(--crimson-spark)" }}
        >
          <IconChevronLeft />
          Back to Quizzes
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      <div
        className="border-b px-4 py-3"
        style={{
          backgroundColor: "var(--midnight-indigo)",
          borderColor: "var(--lavender-mist)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-90"
            style={{ color: "var(--crimson-spark)" }}
          >
            <IconChevronLeft />
            Back to Quizzes
          </Link>
          <span
            className="text-sm"
            style={{ color: "var(--lavender-mist)" }}
          >
            {submitted
              ? `${quiz.title} — Results`
              : `${quiz.title} — Question ${questionIndex + 1} of ${totalQuestions}`}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        {!submitted && (
          <aside
            className="w-full border-b lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r"
            style={{
              backgroundColor: "var(--midnight-indigo)",
              borderColor: "var(--lavender-mist)",
            }}
          >
            <nav className="p-4" aria-label="Quiz questions">
              <h2
                className="mb-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--lavender-mist)" }}
              >
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
                        className="block rounded-lg px-3 py-2 text-sm transition-colors"
                        style={{
                          backgroundColor: isActive
                            ? "var(--crimson-spark)"
                            : "transparent",
                          color: isActive
                            ? "white"
                            : "var(--lavender-mist)",
                        }}
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
              <h1
                className="mb-6 text-2xl font-bold"
                style={{ color: "var(--ghost-white)" }}
              >
                Quiz results
              </h1>
              <div
                className="mb-6 rounded-xl border-2 p-6 text-center"
                style={{
                  backgroundColor: "var(--midnight-indigo)",
                  borderColor: results.passed
                    ? "var(--neon-mint)"
                    : "var(--crimson-spark)",
                }}
              >
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: results.passed
                      ? "var(--neon-mint)"
                      : "var(--crimson-spark)",
                  }}
                >
                  {results.passed ? "Passed" : "Not passed"}
                </p>
                <p
                  className="mt-2 text-4xl font-bold"
                  style={{ color: "var(--ghost-white)" }}
                >
                  {results.percent}%
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--lavender-mist)" }}
                >
                  Need {PASS_PERCENT}% to pass
                </p>
              </div>
              <ul
                className="space-y-3 rounded-xl border-2 p-4"
                style={{
                  backgroundColor: "var(--midnight-indigo)",
                  borderColor: "var(--lavender-mist)",
                }}
              >
                <li
                  className="flex items-center justify-between gap-4 border-b pb-3"
                  style={{ borderColor: "var(--lavender-mist)" }}
                >
                  <span
                    className="flex items-center gap-2"
                    style={{ color: "var(--lavender-mist)" }}
                  >
                    <IconCheck
                      className="shrink-0"
                      style={{ color: "var(--neon-mint)" }}
                    />
                    Correct
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--ghost-white)" }}
                  >
                    {results.correct} of {results.total}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span
                    className="flex items-center gap-2"
                    style={{ color: "var(--lavender-mist)" }}
                  >
                    <IconX
                      className="shrink-0"
                      style={{ color: "var(--crimson-spark)" }}
                    />
                    Wrong
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--ghost-white)" }}
                  >
                    {results.wrong} of {results.total}
                  </span>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/quizzes"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-95"
                  style={{ backgroundColor: "var(--crimson-spark)" }}
                >
                  Back to Quizzes
                </Link>
                <Link
                  href={`/quizzes/${quizId}`}
                  className="inline-flex items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all hover:opacity-95"
                  style={{
                    borderColor: "var(--lavender-mist)",
                    color: "var(--ghost-white)",
                  }}
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
              <h1
                className="mb-6 text-xl font-bold sm:text-2xl"
                style={{ color: "var(--ghost-white)" }}
              >
                {currentQuestion.prompt}
              </h1>
              <div
                className="space-y-3"
                role="radiogroup"
                aria-label="Answer options"
              >
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition-colors"
                    style={{
                      backgroundColor:
                        selectedOption === idx
                          ? "var(--midnight-indigo)"
                          : "var(--void-purple)",
                      borderColor:
                        selectedOption === idx
                          ? "var(--electric-cyan)"
                          : "var(--lavender-mist)",
                    }}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => setSelectedOption(idx)}
                      className="h-4 w-4 focus:ring-2 focus:ring-offset-0"
                      style={{
                        accentColor: "var(--crimson-spark)",
                      }}
                    />
                    <span style={{ color: "var(--ghost-white)" }}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-95"
                    style={{ backgroundColor: "var(--crimson-spark)" }}
                  >
                    Submit quiz
                  </button>
                ) : (
                  <Link
                    href={`/quizzes/${quizId}?q=${quiz.questions[questionIndex + 1].id}`}
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      selectedOption === null
                        ? "pointer-events-none opacity-50"
                        : "text-white hover:opacity-95"
                    }`}
                    style={{
                      backgroundColor:
                        selectedOption === null
                          ? "var(--lavender-mist)"
                          : "var(--crimson-spark)",
                    }}
                  >
                    Next question →
                  </Link>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: "var(--lavender-mist)" }}>
              No question selected.
            </p>
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
        <div
          className="flex min-h-screen items-center justify-center"
          style={{
            backgroundColor: "var(--void-purple)",
            color: "var(--lavender-mist)",
          }}
        >
          Loading…
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
