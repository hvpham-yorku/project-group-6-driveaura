"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { WEATHER_MODULES } from "./weatherModulesData";

export default function WeatherTrainingPage() {
  const [activeModuleId, setActiveModuleId] = useState(WEATHER_MODULES[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeModule = useMemo(
    () => WEATHER_MODULES.find((module) => module.id === activeModuleId) ?? WEATHER_MODULES[0],
    [activeModuleId],
  );
  const answeredCount = activeModule.quiz.filter((q) => answers[q.id]).length;
  const score = activeModule.quiz.filter(
    (q) => answers[q.id] === q.correctOptionId,
  ).length;
  const allAnswered = answeredCount === activeModule.quiz.length;

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const resetModuleQuiz = () => {
    const nextAnswers = { ...answers };
    for (const question of activeModule.quiz) {
      delete nextAnswers[question.id];
    }
    setAnswers(nextAnswers);
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10">
      <header
        className="mb-8 border-b pb-6"
        style={{ borderColor: "var(--midnight-indigo)" }}
      >
        <h1 className="text-2xl font-semibold" style={{ color: "var(--ghost-white)" }}>
          Weather & Seasonal Hazard Training
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--lavender-mist)" }}>
          Nine mini-modules (Glare, Fog, Rain, Flooded Roads, Skids, Snow,
          Whiteouts, Ice, and Snow Plows), each paired with a quiz for
          immediate practice and feedback.
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--lavender-mist)" }}>
          Content expanded from Ontario MTO guidance for night and bad-weather
          driving.
        </p>
        <p
          className="mt-3 text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--lavender-mist)" }}
        >
          {WEATHER_MODULES.length} modules · {activeModule.quiz.length} quiz
          questions in this module
        </p>
        <a
          href="https://www.ontario.ca/document/official-mto-drivers-handbook/driving-night-and-bad-weather"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs underline"
          style={{ color: "var(--electric-cyan)" }}
        >
          Source: Ontario MTO Driver's Handbook (Night and Bad Weather)
        </a>
      </header>

      <section
        className="mb-6 rounded-xl border-2 p-4"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--ghost-white)" }}>
          Modules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {WEATHER_MODULES.map((module) => {
            const active = module.id === activeModule.id;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveModuleId(module.id)}
                className="rounded-lg border-2 p-3 text-left transition-opacity hover:opacity-95"
                style={{
                  borderColor: active ? "var(--electric-cyan)" : "var(--void-purple)",
                  backgroundColor: "rgba(15, 5, 29, 0.7)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--electric-cyan)" }}
                >
                  {module.condition}
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
                  {module.title}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--lavender-mist)" }}>
                  {module.quiz.length} quiz question{module.quiz.length > 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="rounded-xl border-2 p-5"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--electric-cyan)" }}
        >
          {activeModule.condition}
        </p>
        <h2 className="mt-2 text-xl font-semibold" style={{ color: "var(--ghost-white)" }}>
          {activeModule.title}
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--lavender-mist)" }}>
          {activeModule.summary}
        </p>

        <div
          className="mt-4 rounded-lg border-2 p-4"
          style={{
            borderColor: "var(--void-purple)",
            backgroundColor: "rgba(15, 5, 29, 0.7)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
            Module content
          </p>
          <ul
            className="mt-2 list-disc space-y-2 pl-5 text-sm"
            style={{ color: "var(--lavender-mist)" }}
          >
            {activeModule.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-base font-semibold" style={{ color: "var(--ghost-white)" }}>
            Quiz
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--lavender-mist)" }}>
            Answered {answeredCount}/{activeModule.quiz.length} · Score {score}/
            {activeModule.quiz.length}
          </p>

          <div className="mt-4 space-y-4">
            {activeModule.quiz.map((question) => {
              const selectedOptionId = answers[question.id];
              const hasAnsweredQuestion = Boolean(selectedOptionId);
              const isCorrect = selectedOptionId === question.correctOptionId;

              return (
                <article
                  key={question.id}
                  className="rounded-lg border-2 p-4"
                  style={{
                    borderColor: "var(--void-purple)",
                    backgroundColor: "rgba(15, 5, 29, 0.7)",
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
                    {question.prompt}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option) => {
                      const isSelected = selectedOptionId === option.id;
                      const isCorrectOption = question.correctOptionId === option.id;

                      const style = hasAnsweredQuestion
                        ? isCorrectOption
                          ? {
                              borderColor: "var(--neon-mint)",
                              backgroundColor: "rgba(57, 255, 20, 0.10)",
                              color: "var(--ghost-white)",
                            }
                          : isSelected
                            ? {
                                borderColor: "var(--crimson-spark)",
                                backgroundColor: "rgba(255, 59, 63, 0.14)",
                                color: "var(--ghost-white)",
                              }
                            : {
                                borderColor: "var(--void-purple)",
                                backgroundColor: "rgba(15, 5, 29, 0.7)",
                                color: "var(--lavender-mist)",
                              }
                        : {
                            borderColor: "var(--void-purple)",
                            backgroundColor: "rgba(15, 5, 29, 0.7)",
                            color: "var(--ghost-white)",
                          };

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleOptionSelect(question.id, option.id)}
                          className="rounded border-2 px-3 py-2 text-left text-sm transition-opacity hover:opacity-95"
                          style={style}
                        >
                          {option.text}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnsweredQuestion ? (
                    <p
                      className="mt-3 text-sm"
                      style={{
                        color: isCorrect ? "var(--neon-mint)" : "var(--crimson-spark)",
                      }}
                    >
                      {isCorrect ? "Correct." : "Needs improvement."} {question.explanation}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={resetModuleQuiz}
          disabled={!allAnswered}
          className="mt-6 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "var(--crimson-spark)" }}
        >
          Retake this module quiz
        </button>
      </section>

      <Link
        href="/"
        className="mt-6 inline-block text-sm underline"
        style={{ color: "var(--lavender-mist)" }}
      >
        ← Back to Home
      </Link>
      </div>
    </main>
  );
}
