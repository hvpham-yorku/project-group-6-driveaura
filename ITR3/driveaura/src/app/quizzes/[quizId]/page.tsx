"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { MODULES } from "@/app/modules/data";
import { QUIZZES } from "../data";
import { addPassedQuiz } from "../passedQuizzes";
import { awardQuizPoints } from "@/lib/auraPoints";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  applyQuizSubmission,
  fetchUserQuizProgressMap,
  type QuizProgressRecord,
} from "@/lib/firebase/userQuizProgress";
import { clearQuizEntry, isQuizEntryAllowed } from "@/lib/learning/quizEntry";

const PASS_PERCENT = 70;
const MAX_FAILS_BEFORE_MODULE_RESET = 3;

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
  const router = useRouter();
  const { user } = useAuth();
  const quizId = typeof params.quizId === "string" ? params.quizId : "";

  const quiz = useMemo(() => QUIZZES.find((q) => q.id === quizId), [quizId]);

  const [entryAllowed, setEntryAllowed] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [persistError, setPersistError] = useState<string | null>(null);
  const [lockoutReset, setLockoutReset] = useState(false);
  const [remoteQuiz, setRemoteQuiz] = useState<QuizProgressRecord | null>(null);

  useEffect(() => {
    if (!quizId) return;
    if (!isQuizEntryAllowed(quizId)) {
      router.replace("/");
      return;
    }
    setEntryAllowed(true);
    setQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setPersistError(null);
    setLockoutReset(false);
  }, [quizId, router]);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void fetchUserQuizProgressMap(user.uid).then((map) => {
      if (cancelled) return;
      setRemoteQuiz(map.get(quizId) ?? { passed: false, failedAttempts: 0 });
    });
    return () => {
      cancelled = true;
    };
  }, [user?.uid, quizId]);

  useEffect(() => {
    if (!entryAllowed || submitted) return;
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [entryAllowed, submitted]);

  const currentQuestion = quiz?.questions[questionIndex];
  const totalQuestions = quiz?.questions.length ?? 0;
  const isLastQuestion = totalQuestions > 0 && questionIndex === totalQuestions - 1;
  const selectedOption = currentQuestion ? (answers[currentQuestion.id] ?? null) : null;

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
    const lessonWeaknesses = Array.from(lessonAgg.values()).filter((entry) => entry.wrong > 0);
    return { correct, wrong, total, percent, passed, lessonWeaknesses };
  }, [quiz, submitted, answers]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || !user?.uid) return;
    let correct = 0;
    for (const q of quiz.questions) {
      const chosen = answers[q.id];
      if (chosen !== undefined && chosen === q.correctIndex) correct += 1;
    }
    const total = quiz.questions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= PASS_PERCENT;

    setPersistError(null);
    setSubmitted(true);

    try {
      const prevMap = await fetchUserQuizProgressMap(user.uid);
      const prevRec = prevMap.get(quizId) ?? { passed: false, failedAttempts: 0 };

      const { record, lockoutReset: didReset } = await applyQuizSubmission(
        user.uid,
        quizId,
        quizId,
        passed,
      );

      if (didReset) {
        setLockoutReset(true);
      }

      if (passed && !prevRec.passed) {
        addPassedQuiz(quizId);
        awardQuizPoints(quizId);
      }

      setRemoteQuiz(record);
    } catch (e) {
      console.error(e);
      setPersistError("Could not save your quiz result. Check your connection and try again.");
    }
  }, [quiz, user?.uid, answers, quizId]);

  const moduleItem = useMemo(() => MODULES.find((m) => m.id === quizId), [quizId]);

  const attemptsHint = useMemo(() => {
    if (!remoteQuiz || remoteQuiz.passed) return null;
    const remaining = MAX_FAILS_BEFORE_MODULE_RESET - remoteQuiz.failedAttempts;
    if (remaining <= 0) return null;
    return `${remaining} passing attempt${remaining === 1 ? "" : "s"} left before this module must be redone`;
  }, [remoteQuiz]);

  if (!quizId || !entryAllowed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--void-purple)",
          color: "var(--lavender-mist)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!quiz) {
    return (
      <main
        className="mx-auto max-w-5xl px-4 py-12"
        style={{ backgroundColor: "var(--void-purple)" }}
      >
        <p style={{ color: "var(--lavender-mist)" }}>Quiz not found.</p>
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
          <span
            className="text-sm font-medium"
            style={{ color: "var(--lavender-mist)" }}
          >
            {submitted
              ? `${quiz.title} — Results`
              : `${quiz.title} — Question ${questionIndex + 1} of ${totalQuestions}`}
          </span>
        </div>
      </div>

      {!submitted && attemptsHint ? (
        <div
          className="mx-auto max-w-6xl px-4 pt-4 text-sm"
          style={{ color: "var(--lavender-mist)" }}
        >
          {attemptsHint}
        </div>
      ) : null}

      {lockoutReset ? (
        <div
          className="mx-auto max-w-6xl px-4 pt-4 text-sm"
          style={{ color: "var(--crimson-spark)" }}
        >
          After three failed attempts, your progress in this module was reset. Complete all lessons
          again, then take the quiz again to continue.
        </div>
      ) : null}

      {persistError ? (
        <div
          className="mx-auto max-w-6xl px-4 pt-4 text-sm"
          style={{ color: "var(--crimson-spark)" }}
        >
          {persistError}
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl flex-col p-4 lg:p-8">
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
                      (l) => l.id === entry.lessonId,
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
                href={`/modules/${quizId}`}
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-95"
                style={{ backgroundColor: "var(--crimson-spark)" }}
                onClick={() => clearQuizEntry()}
              >
                Back to module
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all hover:opacity-95"
                style={{
                  borderColor: "var(--lavender-mist)",
                  color: "var(--ghost-white)",
                }}
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setQuestionIndex(0);
                  setLockoutReset(false);
                  setPersistError(null);
                }}
              >
                Retake quiz
              </button>
            </div>
          </div>
        ) : currentQuestion ? (
          <>
            {currentQuestion.imageSrc && (
              <div className="mb-6 flex justify-center">
                <div
                  className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl border-2 bg-white"
                  style={{ borderColor: "var(--midnight-indigo)" }}
                >
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
                  <span style={{ color: "var(--ghost-white)" }}>{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={() => void handleSubmitQuiz()}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-95"
                  style={{ backgroundColor: "var(--crimson-spark)" }}
                >
                  Submit quiz
                </button>
              ) : (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={() => setQuestionIndex((i) => i + 1)}
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
                </button>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "var(--lavender-mist)" }}>No question selected.</p>
        )}
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
