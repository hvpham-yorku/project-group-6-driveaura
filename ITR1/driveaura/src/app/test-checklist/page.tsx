"use client";

import type {
  TestChecklistItem,
  TestChecklistSectionKey,
  TestChecklistState,
} from "@/lib/core/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function TestChecklistPage() {
  const items: TestChecklistItem[] = useMemo(
    () => [
      {
        id: "prep-id",
        section: "Prep",
        text: "Bring your driver’s licence + any required documents.",
      },
      {
        id: "prep-car",
        section: "Prep",
        text: "Make sure the test car is clean and working (signals, horn, lights).",
      },
      {
        id: "prep-practice",
        section: "Prep",
        text: "Quick practice: parallel park, 3‑point turn, and lane changes.",
      },
      {
        id: "testday-early",
        section: "TestDay",
        text: "Arrive 15 minutes early and stay calm.",
        tip: "Breathe in for 4, out for 6. Repeat 3 times.",
      },
      {
        id: "testday-adjust",
        section: "TestDay",
        text: "Adjust seat, mirrors, and steering wheel before you start.",
      },
      {
        id: "during-checks",
        section: "During",
        text: "Check mirrors often and do shoulder checks for turns and lane changes.",
      },
      {
        id: "during-speed",
        section: "During",
        text: "Follow the speed limit and match traffic when safe.",
      },
      {
        id: "during-stops",
        section: "During",
        text: "Full stop at stop signs; scan left-right-left before going.",
      },
      {
        id: "after-review",
        section: "After",
        text: "Review what went well and what to practice next time.",
      },
    ],
    [],
  );

  const storageKey = "driveaura:test-checklist:v1";

  const initialState: TestChecklistState = useMemo(() => {
    const base: TestChecklistState = {};
    for (const item of items) base[item.id] = false;
    return base;
  }, [items]);

  const [state, setState] = useState<TestChecklistState>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;

      const record = parsed as Record<string, unknown>;
      const next: TestChecklistState = { ...initialState };
      for (const id of Object.keys(next)) {
        const v = record[id];
        if (typeof v === "boolean") next[id] = v;
      }
      setState(next);
    } catch {
      // ignore bad localStorage
    }
  }, [initialState]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [state]);

  const completed = Object.values(state).filter(Boolean).length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const sections = useMemo(() => {
    const order: TestChecklistSectionKey[] = ["Prep", "TestDay", "During", "After"];
    const title: Record<TestChecklistSectionKey, string> = {
      Prep: "Before the test",
      TestDay: "On test day",
      During: "During the test",
      After: "After the test",
    };

    return order.map((key) => ({
      key,
      title: title[key],
      items: items.filter((i) => i.section === key),
    }));
  }, [items]);

  function toggle(id: string) {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setState(initialState);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Test Checklist
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Simple steps to help you feel ready.
      </p>

      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Progress: <span className="font-medium">{completed}</span> / {total} (
            {percent}%)
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Reset
          </button>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100"
            style={{ width: `${percent}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.key}>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item) => {
                const checked = Boolean(state[item.id]);
                return (
                  <li
                    key={item.id}
                    className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={checked}
                        onChange={() => toggle(item.id)}
                      />
                      <div>
                        <div
                          className={`text-sm ${
                            checked
                              ? "text-zinc-500 line-through dark:text-zinc-500"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {item.text}
                        </div>
                        {item.tip ? (
                          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            Tip: {item.tip}
                          </div>
                        ) : null}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}