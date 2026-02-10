"use client";

/// <reference types="react" />
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { MODULES, type Lesson } from "../data";

/* Inline SVG */
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

function ModuleReaderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const moduleId = typeof params.moduleId === "string" ? params.moduleId : "";
  const lessonParam = searchParams.get("lesson");

  const moduleItem = useMemo(
    () => MODULES.find((m) => m.id === moduleId),
    [moduleId]
  );

  const lessonIndex = useMemo(() => {
    if (!moduleItem?.lessons.length) return 0;
    const idx = lessonParam
      ? moduleItem.lessons.findIndex((l: Lesson) => l.id === lessonParam)
      : -1;
    return idx >= 0 ? idx : 0;
  }, [moduleItem, lessonParam]);

  const [markedComplete, setMarkedComplete] = useState(false);
  const currentLesson = moduleItem?.lessons[lessonIndex];

  if (!moduleItem) {
    return (
      <main
        className="mx-auto min-h-screen px-4 py-12"
        style={{ backgroundColor: "var(--void-purple)" }}
      >
        <p style={{ color: "var(--lavender-mist)" }}>Module not found.</p>
        <Link
          href="/modules"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "var(--electric-cyan)" }}
        >
          <IconChevronLeft />
          Back to Learning Hub
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      {/* Top bar: back link */}
      <div
        className="border-b px-4 py-3"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href={`/modules/level/${moduleItem.licenseLevel}`}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "var(--electric-cyan)" }}
          >
            <IconChevronLeft />
            Back to {moduleItem.licenseLevel} modules
          </Link>
          <span
            className="text-sm"
            style={{ color: "var(--lavender-mist)" }}
          >
            {moduleItem.title}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        {/* Left: lesson nav */}
        <aside
          className="w-full border-b lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r"
          style={{
            borderColor: "var(--midnight-indigo)",
            backgroundColor: "var(--midnight-indigo)",
          }}
        >
          <nav className="p-4" aria-label="Module chapters">
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--lavender-mist)" }}
            >
              Lessons
            </h2>
            <ul className="space-y-1">
              {moduleItem.lessons.map((lesson: Lesson, idx: number) => {
                const isActive = idx === lessonIndex;
                const href = `/modules/${moduleId}?lesson=${lesson.id}`;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={href}
                      className="block rounded-lg px-3 py-2 text-sm transition-colors"
                      style={
                        isActive
                          ? {
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }
                          : {
                              color: "var(--lavender-mist)",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "var(--void-purple)";
                          e.currentTarget.style.color = "var(--ghost-white)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--lavender-mist)";
                        }
                      }}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Right: content */}
        <div className="flex-1 p-4 lg:p-8">
          {currentLesson ? (
            <>
              <h1
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: "var(--ghost-white)" }}
              >
                {currentLesson.title}
              </h1>

              {/* Video placeholder */}
              <div
                className="mb-6 flex aspect-video w-full items-center justify-center rounded-xl border-2"
                style={{
                  borderColor: "var(--midnight-indigo)",
                  backgroundColor: "var(--void-purple)",
                  color: "var(--lavender-mist)",
                }}
                aria-hidden
              >
                <span className="text-sm">Video placeholder</span>
              </div>

              {/* Lesson text */}
              <div className="mb-8 max-w-none">
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--lavender-mist)" }}
                >
                  {currentLesson.content}
                </p>
              </div>

              {/* Mark as complete */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setMarkedComplete(true)}
                  disabled={markedComplete}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--electric-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--void-purple)]"
                  style={
                    markedComplete
                      ? {
                          cursor: "default",
                          backgroundColor: "var(--midnight-indigo)",
                          color: "var(--neon-mint)",
                          border: "1px solid var(--neon-mint)",
                        }
                      : {
                          backgroundColor: "var(--crimson-spark)",
                          color: "white",
                        }
                  }
                >
                  <IconCheck />
                  {markedComplete ? "Marked complete" : "Mark as complete"}
                </button>
                {lessonIndex < moduleItem.lessons.length - 1 && (
                  <Link
                    href={`/modules/${moduleId}?lesson=${moduleItem.lessons[lessonIndex + 1].id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "var(--electric-cyan)" }}
                  >
                    Next lesson →
                  </Link>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: "var(--lavender-mist)" }}>
              No lesson selected.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ModuleReaderPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "var(--void-purple)", color: "var(--lavender-mist)" }}
        >
          Loading…
        </div>
      }
    >
      <ModuleReaderContent />
    </Suspense>
  );
}
