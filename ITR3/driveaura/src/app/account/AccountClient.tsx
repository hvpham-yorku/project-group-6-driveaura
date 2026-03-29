"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchReadinessHistory, type ReadinessCheckRecord } from "@/lib/firebase/readiness";
import {
  fetchManualShiftHistory,
  type ManualShiftSessionRecord,
} from "@/lib/firebase/manualShift";
import { logAnalyticsEvent } from "@/lib/firebase/analytics";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function safeDateFromRecord(record: ReadinessCheckRecord): Date | null {
  const anyCreatedAt = record.createdAt as unknown as { toDate?: () => Date } | null;
  if (anyCreatedAt && typeof anyCreatedAt.toDate === "function") return anyCreatedAt.toDate();
  return null;
}

function safeDateFromManualShift(record: ManualShiftSessionRecord): Date | null {
  const anyCreatedAt = record.createdAt as unknown as { toDate?: () => Date } | null;
  if (anyCreatedAt && typeof anyCreatedAt.toDate === "function") return anyCreatedAt.toDate();
  return null;
}

export default function AccountClient() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadinessCheckRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualShiftHistory, setManualShiftHistory] = useState<ManualShiftSessionRecord[] | null>(
    null,
  );
  const [manualShiftError, setManualShiftError] = useState<string | null>(null);

  useEffect(() => {
    void logAnalyticsEvent("account_viewed");
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setHistory(null);
    setError(null);

    fetchReadinessHistory({ userId: user.uid, limit: 10 })
      .then((items) => {
        if (cancelled) return;
        setHistory(items);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load readiness history.");
        setHistory([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setManualShiftHistory(null);
    setManualShiftError(null);

    fetchManualShiftHistory({ userId: user.uid, limit: 10 })
      .then((items) => {
        if (cancelled) return;
        setManualShiftHistory(items);
      })
      .catch(() => {
        if (cancelled) return;
        setManualShiftError("Could not load Manual Shift Trainer history.");
        setManualShiftHistory([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const readinessRows = useMemo(() => {
    if (!history) return null;
    return history.map((r) => {
      const when = safeDateFromRecord(r);
      return {
        id: r.id,
        whenLabel: when ? formatWhen(when) : "Just now",
        scoreLabel: `${Math.round(r.readinessScore)}/100`,
        hardStop: Object.values(r.gateStops ?? {}).some(Boolean),
      };
    });
  }, [history]);

  const manualShiftRows = useMemo(() => {
    if (!manualShiftHistory) return null;
    return manualShiftHistory.map((r) => {
      const when = safeDateFromManualShift(r);
      return {
        id: r.id,
        whenLabel: when ? formatWhen(when) : "—",
        scoreLabel: String(r.score),
        auraLabel: `+${r.auraEarned} ✦`,
        modeLabel: r.mode || "—",
      };
    });
  }, [manualShiftHistory]);

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-xs text-[#B8B0D3]">
              DriveAura • Account
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Account</h1>
            <p className="mt-3 text-sm text-[#B8B0D3]">
              Signed in as{" "}
              <span className="font-semibold text-[#F5F5F7]">
                {user?.email ?? user?.displayName ?? "Driver"}
              </span>
              .
            </p>
          </div>

          <Link
            href="/readiness-check"
            className="rounded-full bg-[#FF3B3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
          >
            New readiness check
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
              <h2 className="text-xl font-semibold">Drive readiness history</h2>
              <p className="mt-2 text-sm text-[#B8B0D3]">
                Your last check-ins (score + whether any hard stop was triggered).
              </p>

              {error ? (
                <p className="mt-6 text-sm text-[#FF3B3F]">{error}</p>
              ) : history === null ? (
                <p className="mt-6 text-sm text-[#B8B0D3]">Loading…</p>
              ) : readinessRows && readinessRows.length > 0 ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#00F5FF]/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0F051D]/45 text-xs text-[#B8B0D3]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">When</th>
                        <th className="px-4 py-3 font-semibold">Score</th>
                        <th className="px-4 py-3 font-semibold">Hard stop</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00F5FF]/10">
                      {readinessRows.map((row) => (
                        <tr key={row.id} className="bg-[#1C1132]/40">
                          <td className="px-4 py-3 text-[#F5F5F7]">{row.whenLabel}</td>
                          <td className="px-4 py-3 font-semibold text-[#00F5FF]">
                            {row.scoreLabel}
                          </td>
                          <td className="px-4 py-3 text-[#B8B0D3]">
                            {row.hardStop ? (
                              <span className="inline-flex rounded-full border border-[#FF3B3F]/35 bg-[#0F051D]/40 px-2 py-0.5 text-xs font-semibold text-[#FF3B3F]">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-[#39FF14]/25 bg-[#0F051D]/40 px-2 py-0.5 text-xs font-semibold text-[#39FF14]">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-5">
                  <p className="text-sm text-[#B8B0D3]">
                    No saved readiness checks yet. Run one and save it to start a history.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
              <h2 className="text-xl font-semibold">Manual Shift Trainer history</h2>
              <p className="mt-2 text-sm text-[#B8B0D3]">
                Saved sessions from the trainer (score, Aura earned, and mode).
              </p>

              {manualShiftError ? (
                <p className="mt-6 text-sm text-[#FF3B3F]">{manualShiftError}</p>
              ) : manualShiftHistory === null ? (
                <p className="mt-6 text-sm text-[#B8B0D3]">Loading…</p>
              ) : manualShiftRows && manualShiftRows.length > 0 ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#00F5FF]/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0F051D]/45 text-xs text-[#B8B0D3]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">When</th>
                        <th className="px-4 py-3 font-semibold">Score</th>
                        <th className="px-4 py-3 font-semibold">Aura</th>
                        <th className="px-4 py-3 font-semibold">Mode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00F5FF]/10">
                      {manualShiftRows.map((row) => (
                        <tr key={row.id} className="bg-[#1C1132]/40">
                          <td className="px-4 py-3 text-[#F5F5F7]">{row.whenLabel}</td>
                          <td className="px-4 py-3 font-semibold text-[#00F5FF]">{row.scoreLabel}</td>
                          <td className="px-4 py-3 text-[#39FF14]">{row.auraLabel}</td>
                          <td className="px-4 py-3 text-[#B8B0D3]">{row.modeLabel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-5">
                  <p className="text-sm text-[#B8B0D3]">
                    No saved Manual Shift sessions yet. Complete a session and tap Save to account on the
                    results screen.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
              <p className="text-sm font-semibold text-[#F5F5F7]">Tip</p>
              <p className="mt-1 text-xs text-[#B8B0D3]">
                If your score is lower than usual, try the breathing + grounding steps and re-check
                before driving.
              </p>
            </div>

            <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
              <p className="text-sm font-semibold text-[#F5F5F7]">Privacy</p>
              <p className="mt-1 text-xs text-[#B8B0D3]">
                Saved history includes your score and your selected answers so you can spot patterns
                over time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

