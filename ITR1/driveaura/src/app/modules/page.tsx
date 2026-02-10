"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LICENSE_LABELS,
  MODULES,
  type LicenseLevel,
  type ModuleItem,
} from "./data";

/* Inline SVG icons — no external library */
function IconBook() {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
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

/** Demo: completed module IDs for progress calculation. Replace with real state later. */
const DEMO_COMPLETED_IDS = new Set<string>([]);

function ModuleCard({
  module: m,
  isActive,
}: {
  module: ModuleItem;
  isActive: boolean;
}) {
  const completed = DEMO_COMPLETED_IDS.has(m.id);
  return (
    <article
      className={`module-card group relative flex flex-col overflow-hidden rounded-xl border-2 ${
        isActive ? "module-card--active" : ""
      }`}
      style={{
        backgroundColor: "var(--midnight-indigo)",
        borderColor: "transparent",
      }}
    >
      {/* Placeholder image area */}
      <div
        className="h-32 w-full shrink-0 opacity-80"
        style={{ backgroundColor: "var(--void-purple)" }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-5">
        <span
          className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
          style={{ backgroundColor: "var(--void-purple)", color: "var(--lavender-mist)" }}
        >
          <IconBook />
          {m.category}
        </span>
        <h2
          className="mb-2 text-lg font-semibold"
          style={{ color: "var(--ghost-white)" }}
        >
          {m.title}
        </h2>
        <p
          className="mb-4 flex-1 text-sm line-clamp-3"
          style={{ color: "var(--lavender-mist)" }}
        >
          {m.description}
        </p>
        <div className="flex items-center justify-between gap-2">
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
            href={`/modules/${m.id}`}
            className="ml-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--electric-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--midnight-indigo)]"
            style={{ backgroundColor: "var(--crimson-spark)" }}
          >
            Start Module
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ModulesPage() {
  const [activeLicense, setActiveLicense] = useState<LicenseLevel>("G1");

  const filteredModules = useMemo(
    () => MODULES.filter((m) => m.licenseLevel === activeLicense),
    [activeLicense]
  );

  /* Progress: count completed vs total for current license path */
  const progress = useMemo(() => {
    const forLicense = MODULES.filter((m) => m.licenseLevel === activeLicense);
    const total = forLicense.length;
    const completed = forLicense.filter((m) => DEMO_COMPLETED_IDS.has(m.id)).length;
    return total ? Math.round((completed / total) * 100) : 0;
  }, [activeLicense]);

  const tabs: LicenseLevel[] = ["G1", "G2", "G"];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      {/* Progress bar */}
      <section
        className="border-b px-4 py-4"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--void-purple)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--lavender-mist)" }}
            >
              {LICENSE_LABELS[activeLicense]} progress
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--ghost-white)" }}
            >
              {progress}%
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--midnight-indigo)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--electric-cyan)",
                boxShadow: "0 0 12px var(--electric-cyan)",
              }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <h1
          className="mb-6 text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--ghost-white)" }}
        >
          Learning Hub
        </h1>

        {/* License switcher (tabs) */}
        <nav
          className="mb-8 border-b"
          style={{ borderColor: "var(--midnight-indigo)" }}
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
                      ? "text-[var(--electric-cyan)]"
                      : "text-[var(--lavender-mist)] hover:text-[var(--ghost-white)]"
                  }`}
                  style={{
                    borderBottomColor:
                      activeLicense === level
                        ? "var(--electric-cyan)"
                        : "transparent",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <IconClock />
                    {LICENSE_LABELS[level]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Module grid */}
        <section aria-label={`Modules for ${LICENSE_LABELS[activeLicense]}`}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((m, index) => (
              <ModuleCard
                key={m.id}
                module={m}
                isActive={activeLicense === "G1" && index === 0}
              />
            ))}
          </div>
          {filteredModules.length === 0 && (
            <p
              className="rounded-xl border-2 border-[var(--midnight-indigo)] p-8 text-center"
              style={{
                backgroundColor: "var(--midnight-indigo)",
                color: "var(--lavender-mist)",
              }}
            >
              No modules for this license level yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
