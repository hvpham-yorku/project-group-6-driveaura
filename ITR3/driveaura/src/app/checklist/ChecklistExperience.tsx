"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryRow } from "./components/CategoryRow";
import type { ChecklistCategoryId, ChecklistState } from "./types";
import { CHECKLIST_CATEGORY_IDS } from "./types";
import { getInitialState } from "./utils";

type ChecklistExperienceProps = {
  title: string;
  description?: string;
};

function IconClipboard() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

/**
 * Shared checklist UI for `/checklist` and `/test-checklist`.
 * Removes duplicate page logic (DRY — fixes shotgun duplication smell).
 */
export function ChecklistExperience({ title, description }: ChecklistExperienceProps) {
  const [state, setState] = useState<ChecklistState>(getInitialState);

  const updateCategory = useMemo(
    () => (categoryId: ChecklistCategoryId, next: ChecklistState[ChecklistCategoryId]) => {
      setState((prev) => ({ ...prev, [categoryId]: next }));
    },
    [],
  );

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--void-purple)" }}>
      <div
        className="relative overflow-hidden border-b px-4 py-8"
        style={{
          background: "linear-gradient(160deg, rgba(28,17,50,1) 0%, rgba(15,5,29,0.96) 70%)",
          borderColor: "rgba(184,176,211,0.12)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,245,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,245,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="flex flex-wrap items-start gap-4">
            <span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.12))",
                border: "1.5px solid rgba(0,245,255,0.35)",
                color: "var(--electric-cyan)",
                boxShadow: "0 0 24px rgba(0,245,255,0.2)",
              }}
            >
              <IconClipboard />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>
                  DriveAura
                </span>
                <span style={{ color: "rgba(184,176,211,0.35)" }}>·</span>
                <span style={{ color: "var(--lavender-mist)" }}>Passenger test checklist</span>
              </div>
              <h1
                className="text-2xl font-black tracking-tight sm:text-3xl"
                style={{ color: "var(--ghost-white)", textShadow: "0 0 40px rgba(0,245,255,0.15)" }}
              >
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-sm font-medium leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          <div
            className="mt-6 h-px"
            style={{
              background: "linear-gradient(90deg, var(--electric-cyan), rgba(57,255,20,0.4) 50%, transparent)",
              opacity: 0.45,
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="space-y-4">
          {CHECKLIST_CATEGORY_IDS.map((id) => (
            <CategoryRow
              key={id}
              categoryId={id}
              value={state[id]}
              onChange={updateCategory}
            />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="text-sm text-[var(--lavender-mist)] underline underline-offset-2 transition-colors hover:text-[var(--ghost-white)]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
