"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import {
  LICENSE_LABELS,
  MODULES,
  PATHWAY_LEVELS,
  type LicenseLevel,
  type ModuleItem,
} from "../../data";

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

function IconBook() {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  );
}

function ModuleCard({ module: m }: { module: ModuleItem }) {
  return (
    <Link
      href={`/modules/${m.id}`}
      className="pathway-card block rounded-xl border-2 border-transparent p-5 transition-all duration-300 hover:border-[var(--electric-cyan)] hover:shadow-[0_0_24px_rgba(0,245,255,0.3)]"
      style={{ backgroundColor: "var(--midnight-indigo)" }}
    >
      <span
        className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
        style={{
          backgroundColor: "var(--void-purple)",
          color: "var(--lavender-mist)",
        }}
      >
        <IconBook />
        {m.category}
      </span>
      <h3
        className="mb-2 text-lg font-semibold"
        style={{ color: "var(--ghost-white)" }}
      >
        {m.title}
      </h3>
      <p
        className="mb-4 line-clamp-2 text-sm"
        style={{ color: "var(--lavender-mist)" }}
      >
        {m.description}
      </p>
      <span
        className="inline-flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--electric-cyan)" }}
      >
        Open module
        <IconArrowRight />
      </span>
    </Link>
  );
}

function LevelPageContent() {
  const params = useParams();
  const licenseParam = params.license;
  const license: LicenseLevel =
    licenseParam === "G1" || licenseParam === "G2" || licenseParam === "G"
      ? licenseParam
      : "G1";

  const modulesForLicense = useMemo(
    () => MODULES.filter((m) => m.licenseLevel === license),
    [license]
  );

  const levelInfo = useMemo(
    () => PATHWAY_LEVELS.find((l) => l.licenseLevel === license),
    [license]
  );

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link
          href="/modules"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "var(--electric-cyan)" }}
        >
          <IconChevronLeft />
          Back to pathway
        </Link>

        <header className="mb-10">
          <span
            className="mb-2 inline-block rounded-md px-2.5 py-1 text-sm font-semibold"
            style={{
              backgroundColor: "var(--midnight-indigo)",
              color: "var(--ghost-white)",
            }}
          >
            {license}
          </span>
          <h1
            className="mb-2 text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--ghost-white)" }}
          >
            {levelInfo?.title ?? LICENSE_LABELS[license]}
          </h1>
          {levelInfo?.description && (
            <p
              className="max-w-2xl text-base"
              style={{ color: "var(--lavender-mist)" }}
            >
              {levelInfo.description}
            </p>
          )}
        </header>

        {modulesForLicense.length > 0 ? (
          <section aria-label={`Modules for ${license}`}>
            <h2
              className="mb-6 text-lg font-semibold"
              style={{ color: "var(--lavender-mist)" }}
            >
              Phase 1 modules
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modulesForLicense.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
          </section>
        ) : (
          <p
            className="rounded-xl border-2 p-8 text-center"
            style={{
              backgroundColor: "var(--midnight-indigo)",
              borderColor: "var(--midnight-indigo)",
              color: "var(--lavender-mist)",
            }}
          >
            Modules for this level are coming soon.
          </p>
        )}
      </div>
    </main>
  );
}

export default function LevelPage() {
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
      <LevelPageContent />
    </Suspense>
  );
}
