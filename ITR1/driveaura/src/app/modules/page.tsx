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

function ModuleCard({ module: m }: { module: ModuleItem }) {
  const completed = DEMO_COMPLETED_IDS.has(m.id);
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Placeholder image area */}
      <div
        className="h-36 w-full shrink-0 bg-slate-200"
        style={{ backgroundColor: "var(--ontario-gray)" }}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-ontario-slate">
          <IconBook />
          {m.category}
        </span>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">{m.title}</h2>
        <p className="mb-4 flex-1 text-sm text-slate-600 line-clamp-3">
          {m.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          {completed ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ontario-blue">
              <IconCheck />
              Completed
            </span>
          ) : null}
          <Link
            href={`/modules/${m.id}`}
            className="inline-flex items-center justify-center rounded bg-ontario-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ontario-blue-light focus:outline-none focus:ring-2 focus:ring-ontario-blue focus:ring-offset-2"
          >
            Start
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
    <main className="min-h-screen bg-slate-50">
      {/* Progress bar */}
      <section className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-700">
              {LICENSE_LABELS[activeLicense]} progress
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
          Learning Hub
        </h1>

        {/* License switcher (tabs) */}
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
            {filteredModules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
          {filteredModules.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
              No modules for this license level yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
