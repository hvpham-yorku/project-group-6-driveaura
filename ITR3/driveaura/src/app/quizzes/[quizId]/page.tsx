"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { MODULES } from "@/app/modules/data";
import { QUIZZES, type QuizQuestion } from "../data";
import { addPassedQuiz } from "../passedQuizzes";
import { awardQuizPoints, AURA_POINT_VALUES } from "@/lib/auraPoints";
import { fetchUserAuraPoints, saveUserAuraPoints } from "@/lib/firebase/auraPoints";

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

function IconCheck({ className, style }: { className?: string; style?: React.CSSProperties }) {
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
      style={style}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconX({ className, style }: { className?: string; style?: React.CSSProperties }) {
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
      style={style}
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

  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [auraPointsEarned, setAuraPointsEarned] = useState<number>(0);

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
    const lessonAgg = new Map<
      string,
      { lessonId: string; wrong: number; total: number }
    >();

    for (const q of quiz.questions) {
      const chosen = answers[q.id];
      const isWrong = chosen === undefined || chosen !== q.correctIndex;

      if (isWrong) wrong += 1;
      else correct += 1;

      if (q.lessonId) {
        const existing =
          lessonAgg.get(q.lessonId) ?? {
            lessonId: q.lessonId,
            wrong: 0,
            total: 0,
          };
        existing.total += 1;
        if (isWrong) existing.wrong += 1;
        lessonAgg.set(q.lessonId, existing);
      }
    }
    const total = quiz.questions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= PASS_PERCENT;
    const lessonWeaknesses = Array.from(lessonAgg.values()).filter(
      (entry) => entry.wrong > 0
    );
    return { correct, wrong, total, percent, passed, lessonWeaknesses };
  }, [quiz, submitted, answers]);

  // Persist passed quiz + award Aura Points on first pass
  useEffect(() => {
    if (!results?.passed || !quizId) return;

    const isNew = addPassedQuiz(quizId);
    if (isNew) {
      const pts = awardQuizPoints(quizId);
      if (pts > 0) {
        setAuraPointsEarned(pts);
        if (user) {
          void fetchUserAuraPoints(user.uid).then((remote) => {
            const base = remote ?? 0;
            return saveUserAuraPoints(user.uid, base + pts);
          }).catch(() => {
            // non-critical — local points already saved
          });
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const moduleItem = useMemo(
    () => MODULES.find((m) => m.id === quizId),
    [quizId]
  );

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
                {results.passed && (
                  <div
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                    style={{
                      backgroundColor: "rgba(0,245,255,0.10)",
                      color: "var(--electric-cyan)",
                      border: "1px solid rgba(0,245,255,0.30)",
                    }}
                  >
                    ✦{" "}
                    {auraPointsEarned > 0
                      ? `+${auraPointsEarned} Aura Points earned!`
                      : `+${AURA_POINT_VALUES.QUIZ} Aura Points (already earned)`}
                  </div>
                )}
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
              {moduleItem && results.lessonWeaknesses.length > 0 && (
                <section
                  className="mt-6 rounded-xl border-2 p-4"
                  style={{
                    backgroundColor: "var(--midnight-indigo)",
                    borderColor: "var(--electric-cyan)",
                  }}
                  aria-label="Personalized study recommendations"
                >
                  <h2
                    className="mb-2 text-base font-semibold"
                    style={{ color: "var(--ghost-white)" }}
                  >
                    Where to improve next
                  </h2>
                  <p
                    className="mb-3 text-sm"
                    style={{ color: "var(--lavender-mist)" }}
                  >
                    Based on your answers, you may want to review these lessons
                    from{" "}
                    <span className="font-semibold">{moduleItem.title}</span>:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {results.lessonWeaknesses.map((entry) => {
                      const lesson = moduleItem.lessons.find(
                        (l) => l.id === entry.lessonId
                      );
                      const href = `/modules/${moduleItem.id}?lesson=${entry.lessonId}`;
                      return (
                        <li key={entry.lessonId} className="flex flex-col">
                          <Link
                            href={href}
                            className="inline-flex w-fit items-center gap-2 font-medium hover:underline"
                            style={{ color: "var(--electric-cyan)" }}
                          >
                            <span>
                              {lesson?.title ?? `Lesson ${entry.lessonId}`}
                            </span>
                          </Link>
                          <span
                            className="text-xs"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            You answered {entry.wrong} of {entry.total} question
                            {entry.total === 1 ? "" : "s"} in this area
                            incorrectly.
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
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
              {currentQuestion.imageSrc && (
                <div className="mb-6 flex justify-center">
                  <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl border-2 bg-white"
                    style={{ borderColor: "var(--midnight-indigo)" }}>
                    <Image
                      src={currentQuestion.imageSrc}
                      alt={currentQuestion.imageAlt ?? "Question image"}
                      fill
                      className="object-contain p-2"
                      sizes="192px"
                    />
                  </div>
                </div>
              )}
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
