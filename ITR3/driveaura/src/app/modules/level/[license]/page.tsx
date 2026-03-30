"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  LICENSE_LABELS,
  MODULES,
  PATHWAY_LEVELS,
  type LicenseLevel,
  type ModuleItem,
} from "../../data";
import { getCompletedLessonKeys } from "../../progress";
import { isModuleUnlocked } from "@/lib/learning/moduleUnlock";
import {
  fetchUserQuizProgressMap,
  passedQuizIdsFromMap,
} from "@/lib/firebase/userQuizProgress";
import { useAuth } from "@/components/auth/AuthProvider";

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

function IconLock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ModuleCard({ module: m, locked }: { module: ModuleItem; locked: boolean }) {
  if (locked) {
    return (
      <div
        className="block rounded-xl border-2 border-dashed p-5 opacity-60"
        style={{
          backgroundColor: "var(--midnight-indigo)",
          borderColor: "var(--lavender-mist)",
        }}
        aria-disabled="true"
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
          style={{ color: "var(--lavender-mist)" }}
        >
          <IconLock />
          Complete the previous module to unlock
        </span>
      </div>
    );
  }

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
  const { user } = useAuth();
  const params = useParams();
  const licenseParam = params.license;
  const rawSegment =
    typeof licenseParam === "string"
      ? licenseParam
      : Array.isArray(licenseParam)
        ? licenseParam[0]
        : undefined;

  const license: LicenseLevel | null =
    rawSegment === "G1" || rawSegment === "G2" || rawSegment === "G"
      ? rawSegment
      : null;

  const modulesForLicense = useMemo(
    () =>
      license ? MODULES.filter((m) => m.licenseLevel === license) : [],
    [license]
  );

  const levelInfo = useMemo(
    () =>
      license
        ? PATHWAY_LEVELS.find((l) => l.licenseLevel === license)
        : undefined,
    [license]
  );

  const levelLessonKeys = useMemo(
    () =>
      new Set(
        modulesForLicense.flatMap((m) =>
          m.lessons.map((l) => `${m.id}-${l.id}`)
        )
      ),
    [modulesForLicense]
  );
  const levelTotal = levelLessonKeys.size;

  const [completedCount, setCompletedCount] = useState(0);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const keys = getCompletedLessonKeys().filter((k) => levelLessonKeys.has(k));
    setCompletedCount(keys.length);
  }, [license, levelLessonKeys]);

  useEffect(() => {
    if (!user?.uid) {
      setUnlockedIds(
        new Set(modulesForLicense.filter((_, idx) => idx === 0).map((m) => m.id))
      );
      return;
    }
    let cancelled = false;
    void fetchUserQuizProgressMap(user.uid).then((map) => {
      if (cancelled) return;
      const passedIds = passedQuizIdsFromMap(map);
      setUnlockedIds(
        new Set(modulesForLicense.filter((m) => isModuleUnlocked(m.id, passedIds)).map((m) => m.id))
      );
    });
    return () => { cancelled = true; };
  }, [user?.uid, modulesForLicense]);

  const levelPercent =
    levelTotal > 0 ? Math.round((completedCount / levelTotal) * 100) : 0;

  if (!license) {
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
          <div
            className="rounded-xl border-2 p-8 text-center"
            style={{
              backgroundColor: "var(--midnight-indigo)",
              borderColor: "var(--midnight-indigo)",
              color: "var(--lavender-mist)",
            }}
          >
            <h1
              className="mb-3 text-xl font-semibold"
              style={{ color: "var(--ghost-white)" }}
            >
              Level not found
            </h1>
            <p className="mb-2">
              {rawSegment
                ? `“${rawSegment}” is not a valid license level. Use G1, G2, or G.`
                : "This URL does not match a valid license level. Use G1, G2, or G."}
            </p>
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 font-medium hover:underline"
              style={{ color: "var(--electric-cyan)" }}
            >
              Go to modules
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </main>
    );
  }

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

        {levelTotal > 0 && (
          <div
            className="mb-8 rounded-xl border-2 p-4"
            style={{
              borderColor: "var(--midnight-indigo)",
              backgroundColor: "var(--midnight-indigo)",
            }}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={levelTotal}
            aria-label={`${license} modules progress`}
          >
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--ghost-white)" }}
              >
                {license} progress
              </span>
              <span
                className="text-sm"
                style={{ color: "var(--lavender-mist)" }}
              >
                {completedCount} of {levelTotal} lessons
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--void-purple)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${levelPercent}%`,
                  backgroundColor: "var(--electric-cyan)",
                }}
              />
            </div>
          </div>
        )}

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
                <ModuleCard key={m.id} module={m} locked={!unlockedIds.has(m.id)} />
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
