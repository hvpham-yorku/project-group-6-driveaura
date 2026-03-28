"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { fetchLeaderboard, type UserProfile } from "@/lib/firebase/users";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const INITIAL_COUNT = 10;
const EXPANDED_COUNT = 100;

const RANK_COLORS: Record<number, { border: string; glow: string; badge: string; label: string }> =
  {
    1: {
      border: "border-yellow-400/60",
      glow: "shadow-[0_0_18px_rgba(250,204,21,0.25)]",
      badge: "bg-yellow-400 text-black",
      label: "🥇",
    },
    2: {
      border: "border-slate-300/50",
      glow: "shadow-[0_0_12px_rgba(203,213,225,0.18)]",
      badge: "bg-slate-300 text-black",
      label: "🥈",
    },
    3: {
      border: "border-orange-400/50",
      glow: "shadow-[0_0_12px_rgba(251,146,60,0.18)]",
      badge: "bg-orange-400 text-black",
      label: "🥉",
    },
  };

function RankBadge({ rank }: { rank: number }) {
  const style = RANK_COLORS[rank];
  if (style) {
    return (
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-bold ${style.badge}`}
      >
        {style.label}
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#00F5FF]/20 bg-[#0F051D] text-xs font-semibold text-[#B8B0D3]">
      {rank}
    </span>
  );
}

function AuraPointsBadge({ points }: { points: number }) {
  const color =
    points >= 500
      ? "text-yellow-300 border-yellow-400/40 bg-yellow-400/10"
      : points >= 200
        ? "text-[#00F5FF] border-[#00F5FF]/40 bg-[#00F5FF]/10"
        : "text-[#B8B0D3] border-[#B8B0D3]/30 bg-[#B8B0D3]/5";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold ${color}`}
    >
      ✦ {points.toLocaleString()} AP
    </span>
  );
}

export default function LeaderboardClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [entries, setEntries] = useState<UserProfile[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/leaderboard");
    }
  }, [authLoading, user, router]);

  // Initial load — top 10
  useEffect(() => {
    if (!user) return;
    setFetchLoading(true);
    setError(null);

    fetchLeaderboard(INITIAL_COUNT)
      .then((data) => setEntries(data))
      .catch(() => setError("Could not load the leaderboard. Please try again."))
      .finally(() => setFetchLoading(false));
  }, [user]);

  async function handleShowMore() {
    setLoadingMore(true);
    setError(null);
    try {
      const data = await fetchLeaderboard(EXPANDED_COUNT);
      setEntries(data);
      setExpanded(true);
    } catch {
      setError("Could not load more entries. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F051D]">
        <p className="text-sm text-[#B8B0D3]">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-xs text-[#B8B0D3]">
            DriveAura • Leaderboard
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Aura Leaderboard
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#B8B0D3]">
            See how your Aura Points stack up against the entire DriveAura community. Earn points by
            completing modules, quizzes, and readiness checks.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-[#00F5FF]/15 bg-[#1C1132]/70 px-4 py-3">
            <p className="text-xs text-[#B8B0D3]">Showing</p>
            <p className="text-lg font-semibold text-[#F5F5F7]">
              Top {expanded ? EXPANDED_COUNT : INITIAL_COUNT}
            </p>
          </div>
          <div className="rounded-xl border border-[#00F5FF]/15 bg-[#1C1132]/70 px-4 py-3">
            <p className="text-xs text-[#B8B0D3]">Ranked by</p>
            <p className="text-lg font-semibold text-[#00F5FF]">Aura Points</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-[#FF3B3F]/35 bg-[#0F051D] px-4 py-3 text-sm text-[#FF3B3F]">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {fetchLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl border border-[#00F5FF]/10 bg-[#1C1132]/50"
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#1C1132]/40 p-8 text-center">
            <p className="text-2xl">🏁</p>
            <p className="mt-2 text-sm font-semibold text-[#F5F5F7]">No entries yet</p>
            <p className="mt-1 text-xs text-[#B8B0D3]">
              Be the first to earn Aura Points and claim the top spot!
            </p>
          </div>
        ) : (
          <>
            {/* Leaderboard rows */}
            <div className="space-y-3">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const style = RANK_COLORS[rank];
                const isCurrentUser = user?.uid === entry.uid;

                return (
                  <div
                    key={entry.uid}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition ${
                      isCurrentUser
                        ? "border-[#FF3B3F]/50 bg-[#FF3B3F]/5 shadow-[0_0_14px_rgba(255,59,63,0.12)]"
                        : style
                          ? `${style.border} bg-[#1C1132]/80 ${style.glow}`
                          : "border-[#00F5FF]/10 bg-[#1C1132]/50 hover:border-[#00F5FF]/25"
                    }`}
                  >
                    <RankBadge rank={rank} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-[#F5F5F7]">
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <span className="shrink-0 rounded-full border border-[#FF3B3F]/40 bg-[#FF3B3F]/15 px-2 py-0.5 text-xs font-semibold text-[#FF3B3F]">
                            You
                          </span>
                        )}
                      </div>
                    </div>

                    <AuraPointsBadge points={entry.auraPoints} />
                  </div>
                );
              })}
            </div>

            {/* Show More / Collapse */}
            {!expanded && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="rounded-full border border-[#00F5FF]/30 bg-[#1C1132] px-6 py-2.5 text-sm font-semibold text-[#00F5FF] transition hover:border-[#00F5FF]/60 hover:bg-[#1C1132]/80 disabled:opacity-60"
                >
                  {loadingMore ? "Loading…" : "Show more (Top 100)"}
                </button>
              </div>
            )}

            {expanded && entries.length >= EXPANDED_COUNT && (
              <p className="mt-6 text-center text-xs text-[#B8B0D3]">
                Showing the top {EXPANDED_COUNT} drivers.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
