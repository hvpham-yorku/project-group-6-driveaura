"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MODULES,
  PATHWAY_LEVELS,
  type LicenseLevel,
  type PathwayLevel,
} from "./data";
import { getCompletedLessonKeys } from "./progress";

/* Inline SVG icons — no external library */
function IconArrowRight() {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconMap() {
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
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  );
}

function PathwayCard({ level }: { level: PathwayLevel }) {
  const href = `/modules/level/${level.licenseLevel}`;

  return (
    <Link
      href={href}
      className="pathway-card group relative flex flex-1 flex-col overflow-hidden rounded-xl border-2 transition-all duration-300"
      style={{
        backgroundColor: "var(--midnight-indigo)",
        borderColor: "transparent",
      }}
    >
      <article className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-base font-bold"
            style={{
              backgroundColor: "var(--lavender-mist)",
              color: "var(--void-purple)",
            }}
          >
            {level.licenseLevel}
          </span>
        </div>

        <h2
          className="mb-2 text-lg font-bold"
          style={{ color: "var(--ghost-white)" }}
        >
          {level.title}
        </h2>
        <p
          className="mb-4 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--lavender-mist)" }}
        >
          {level.description}
        </p>

        <div
          className="mb-4 flex w-fit items-baseline gap-1 rounded-lg px-3 py-2"
          style={{
            backgroundColor: "var(--void-purple)",
            color: "var(--ghost-white)",
          }}
        >
          <span className="text-xl font-bold">{level.moduleCount}</span>
          <span className="text-sm">Modules</span>
        </div>

        <div className="mt-auto">
          <span
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 group-hover:opacity-95"
            style={{ backgroundColor: "var(--crimson-spark)" }}
          >
            View modules
            <IconArrowRight />
          </span>
        </div>
      </article>
    </Link>
  );
}

function PathwayConnector() {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{ color: "var(--lavender-mist)" }}
      aria-hidden
    >
      <div
        className="h-0.5 w-6 sm:w-10"
        style={{ backgroundColor: "var(--lavender-mist)", opacity: 0.5 }}
      />
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--void-purple)",
          border: "1px solid var(--lavender-mist)",
        }}
      >
        <IconArrowRight />
      </span>
      <div
        className="h-0.5 w-6 sm:w-10"
        style={{ backgroundColor: "var(--lavender-mist)", opacity: 0.5 }}
      />
    </div>
  );
}

const TOTAL_LESSONS = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
const VALID_KEYS = new Set(
  MODULES.flatMap((m) => m.lessons.map((l) => `${m.id}-${l.id}`))
);

function ModulesProgressBar() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const keys = getCompletedLessonKeys().filter((k) => VALID_KEYS.has(k));
    setCompleted(keys.length);
    const onStorage = () => {
      const next = getCompletedLessonKeys().filter((k) => VALID_KEYS.has(k));
      setCompleted(next.length);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const percent = TOTAL_LESSONS > 0 ? Math.round((completed / TOTAL_LESSONS) * 100) : 0;

  return (
    <div
      className="rounded-xl border-2 p-4"
      style={{
        borderColor: "var(--midnight-indigo)",
        backgroundColor: "var(--midnight-indigo)",
      }}
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={TOTAL_LESSONS}
      aria-label="Learning modules progress"
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--ghost-white)" }}
        >
          Your progress
        </span>
        <span
          className="text-sm"
          style={{ color: "var(--lavender-mist)" }}
        >
          {completed} of {TOTAL_LESSONS} lessons
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--void-purple)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            backgroundColor: "var(--electric-cyan)",
          }}
        />
      </div>
    </div>
  );
}

export default function ModulesPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <ModulesProgressBar />
        <header className="mb-10 mt-8 text-center">
          <p
            className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: "var(--lavender-mist)",
              color: "var(--void-purple)",
            }}
          >
            <IconMap />
            Your Learning Journey
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <span style={{ color: "var(--ghost-white)" }}>Progress Through </span>
            <span style={{ color: "var(--crimson-spark)" }}>Every </span>
            <span style={{ color: "var(--ghost-white)" }}>Stage with </span>
            <span style={{ color: "var(--crimson-spark)" }}>Aura</span>
          </h1>
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--lavender-mist)" }}
          >
            Follow our structured learning pathway from G1 to G, with comprehensive
            modules designed for each licence level.
          </p>
        </header>

        <section
          className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-stretch sm:gap-0"
          aria-label="License pathway: G1, G2, G"
        >
          {PATHWAY_LEVELS.flatMap((level, index) => {
            const card = (
              <div
                key={level.licenseLevel}
                className="flex min-w-0 flex-1 justify-center"
              >
                <PathwayCard level={level} />
              </div>
            );
            const connector =
              index < PATHWAY_LEVELS.length - 1 ? (
                <div
                  key={`connector-${level.licenseLevel}`}
                  className="flex shrink-0 items-center justify-center py-4 sm:py-0"
                >
                  <PathwayConnector />
                </div>
              ) : null;
            return connector ? [card, connector] : [card];
          })}
        </section>
      </div>
    </main>
  );
}
