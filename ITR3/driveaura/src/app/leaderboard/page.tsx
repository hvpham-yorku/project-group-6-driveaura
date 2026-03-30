"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchLeaderboard, fetchUserProfile, type UserProfile } from "@/lib/firebase/users";
import { fetchUserAuraPoints } from "@/lib/firebase/auraPoints";
import { getAuraPoints, AURA_POINT_VALUES } from "@/lib/auraPoints";
import Link from "next/link";

// ─── Medal colours ────────────────────────────────────────────────────────────
const MEDAL: Record<number, { label: string; color: string; glow: string }> = {
  1: { label: "🥇", color: "#FFD700", glow: "rgba(255,215,0,0.35)" },
  2: { label: "🥈", color: "#C0C0C0", glow: "rgba(192,192,192,0.25)" },
  3: { label: "🥉", color: "#CD7F32", glow: "rgba(205,127,50,0.25)" },
};

// ─── Tiny icon helpers ────────────────────────────────────────────────────────
function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

// ─── Rank number badge ────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const medal = MEDAL[rank];
  if (medal) {
    return (
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-black"
        style={{
          backgroundColor: `${medal.glow}`,
          border: `2px solid ${medal.color}`,
          color: medal.color,
          boxShadow: `0 0 12px ${medal.glow}`,
        }}
        aria-label={`Rank ${rank}`}
      >
        {rank}
      </span>
    );
  }
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
      style={{
        backgroundColor: "rgba(184,176,211,0.10)",
        border: "1.5px solid rgba(184,176,211,0.25)",
        color: "var(--lavender-mist)",
      }}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </span>
  );
}

// ─── Points pill ──────────────────────────────────────────────────────────────
function PointsPill({ points, isMe }: { points: number; isMe: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold"
      style={{
        backgroundColor: isMe ? "rgba(0,245,255,0.12)" : "rgba(184,176,211,0.08)",
        border: `1.5px solid ${isMe ? "rgba(0,245,255,0.5)" : "rgba(184,176,211,0.2)"}`,
        color: isMe ? "var(--electric-cyan)" : "var(--lavender-mist)",
      }}
    >
      <IconZap />
      {points.toLocaleString()}
    </span>
  );
}

// ─── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ name, isMe, rank }: { name: string; isMe: boolean; rank: number }) {
  const initial = name.charAt(0).toUpperCase();
  const medal = MEDAL[rank];

  return (
    <span
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-black"
      style={{
        backgroundColor: isMe
          ? "rgba(0,245,255,0.15)"
          : medal
            ? `${medal.glow}`
            : "rgba(184,176,211,0.12)",
        border: isMe
          ? "2px solid var(--electric-cyan)"
          : medal
            ? `2px solid ${medal.color}`
            : "1.5px solid rgba(184,176,211,0.25)",
        color: isMe
          ? "var(--electric-cyan)"
          : medal
            ? medal.color
            : "var(--lavender-mist)",
        boxShadow: isMe
          ? "0 0 12px rgba(0,245,255,0.3)"
          : medal
            ? `0 0 10px ${medal.glow}`
            : "none",
      }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

// ─── Single leaderboard row ───────────────────────────────────────────────────
function LeaderRow({
  entry,
  rank,
  isMe,
}: {
  entry: UserProfile;
  rank: number;
  isMe: boolean;
}) {
  const medal = MEDAL[rank];

  return (
    <li
      className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all"
      style={{
        backgroundColor: isMe
          ? "rgba(0,245,255,0.06)"
          : medal
            ? `rgba(0,0,0,0.18)`
            : "rgba(0,0,0,0.12)",
        border: isMe
          ? "1.5px solid rgba(0,245,255,0.4)"
          : medal
            ? `1.5px solid ${medal.glow}`
            : "1.5px solid rgba(184,176,211,0.10)",
        boxShadow: isMe
          ? "0 0 20px rgba(0,245,255,0.08), inset 0 0 30px rgba(0,245,255,0.03)"
          : medal
            ? `0 0 18px ${medal.glow}`
            : "none",
      }}
    >
      <RankBadge rank={rank} />
      <Avatar name={entry.username} isMe={isMe} rank={rank} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="truncate text-sm font-semibold"
            style={{ color: isMe ? "var(--ghost-white)" : "var(--ghost-white)" }}
          >
            {entry.username}
          </span>
          {isMe && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{
                backgroundColor: "rgba(0,245,255,0.15)",
                color: "var(--electric-cyan)",
                border: "1px solid rgba(0,245,255,0.35)",
              }}
            >
              You
            </span>
          )}
          {medal && !isMe && (
            <span className="text-base" aria-hidden>{medal.label}</span>
          )}
        </div>
        <div
          className="mt-0.5 text-xs"
          style={{ color: "var(--lavender-mist)" }}
        >
          {entry.email ? `${entry.email.split("@")[0]}` : "Driver"}
        </div>
      </div>

      <PointsPill points={entry.auraPoints} isMe={isMe} />
    </li>
  );
}

// ─── Personal stats card ──────────────────────────────────────────────────────
function PersonalStatsCard({
  profile,
  rank,
  total,
  localPoints,
}: {
  profile: UserProfile | null;
  rank: number | null;
  total: number;
  localPoints: number;
}) {
  const pointsToShow = profile?.auraPoints ?? localPoints;

  return (
    <div
      className="rounded-2xl border-2 p-6"
      style={{
        backgroundColor: "var(--midnight-indigo)",
        borderColor: "rgba(0,245,255,0.3)",
        boxShadow: "0 0 32px rgba(0,245,255,0.08), inset 0 0 40px rgba(0,245,255,0.02)",
      }}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(0,245,255,0.12)", color: "var(--electric-cyan)" }}
        >
          <IconUser />
        </span>
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
            {profile?.username ?? "Your stats"}
          </div>
          <div className="text-xs" style={{ color: "var(--lavender-mist)" }}>
            Personal summary
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl border p-3 text-center"
          style={{
            borderColor: "rgba(0,245,255,0.2)",
            backgroundColor: "rgba(0,245,255,0.05)",
          }}
        >
          <div className="text-2xl font-black" style={{ color: "var(--electric-cyan)" }}>
            {pointsToShow.toLocaleString()}
          </div>
          <div className="mt-0.5 text-[11px] uppercase tracking-wide" style={{ color: "var(--lavender-mist)" }}>
            Aura Points
          </div>
        </div>

        <div
          className="rounded-xl border p-3 text-center"
          style={{
            borderColor: "rgba(184,176,211,0.18)",
            backgroundColor: "rgba(184,176,211,0.05)",
          }}
        >
          <div className="text-2xl font-black" style={{ color: "var(--ghost-white)" }}>
            {rank !== null ? `#${rank}` : "—"}
          </div>
          <div className="mt-0.5 text-[11px] uppercase tracking-wide" style={{ color: "var(--lavender-mist)" }}>
            Global Rank
          </div>
        </div>
      </div>

      {rank !== null && total > 0 && (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs" style={{ color: "var(--lavender-mist)" }}>
            <span>Rank progress</span>
            <span>Top {Math.round((rank / total) * 100)}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: "rgba(184,176,211,0.12)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(4, 100 - Math.round((rank / total) * 100))}%`,
                background: "linear-gradient(90deg, var(--electric-cyan), var(--neon-mint))",
                boxShadow: "0 0 8px rgba(0,245,255,0.5)",
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--lavender-mist)" }}
        >
          <span className="flex items-center gap-1.5">
            <IconStar />
            Per lesson
          </span>
          <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>
            +{AURA_POINT_VALUES.LESSON} pts
          </span>
        </div>
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--lavender-mist)" }}
        >
          <span className="flex items-center gap-1.5">
            <IconTrophy />
            Per quiz pass
          </span>
          <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>
            +{AURA_POINT_VALUES.QUIZ} pts
          </span>
        </div>
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--lavender-mist)" }}
        >
          <span className="flex items-center gap-1.5">
            <IconZap />
            Mock grading
          </span>
          <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>
            +{AURA_POINT_VALUES.EXAMINER_SCENARIO} pts
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Empty / loading states ───────────────────────────────────────────────────
function SkeletonRow({ rank }: { rank: number }) {
  return (
    <li
      className="flex animate-pulse items-center gap-4 rounded-xl px-4 py-3.5"
      style={{
        backgroundColor: "rgba(0,0,0,0.12)",
        border: "1.5px solid rgba(184,176,211,0.08)",
      }}
    >
      <span
        className="h-9 w-9 shrink-0 rounded-full"
        style={{ backgroundColor: "rgba(184,176,211,0.12)" }}
        aria-label={`Loading rank ${rank}`}
      />
      <span
        className="h-10 w-10 shrink-0 rounded-full"
        style={{ backgroundColor: "rgba(184,176,211,0.08)" }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-3.5 rounded-md"
          style={{ width: "40%", backgroundColor: "rgba(184,176,211,0.12)" }}
        />
        <div
          className="h-2.5 rounded-md"
          style={{ width: "25%", backgroundColor: "rgba(184,176,211,0.08)" }}
        />
      </div>
      <div
        className="h-7 w-20 rounded-full"
        style={{ backgroundColor: "rgba(184,176,211,0.10)" }}
      />
    </li>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function LeaderboardContent() {
  const { user, loading: authLoading } = useAuth();

  const [entries, setEntries] = useState<UserProfile[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const localPoints = useMemo(() => getAuraPoints(), []);

  async function loadData() {
    setLoading(true);
    setFetchError(null);
    try {
      const [board, userPts] = await Promise.all([
        fetchLeaderboard(10),
        user?.uid ? fetchUserAuraPoints(user.uid) : Promise.resolve(null),
      ]);
      setEntries(board);

      if (user?.uid) {
        const prof = await fetchUserProfile(user.uid);
        if (prof) {
          setMyProfile({ ...prof, auraPoints: userPts ?? prof.auraPoints });
        }
      }
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
      setFetchError("Could not load the leaderboard. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.uid]);

  const myRank = useMemo(() => {
    if (!user?.uid) return null;
    const idx = entries.findIndex((e) => e.uid === user.uid);
    return idx >= 0 ? idx + 1 : null;
  }, [entries, user?.uid]);

  // If current user isn't in top 10, append them at the end
  const displayEntries = useMemo(() => {
    if (!user?.uid || !myProfile) return entries;
    const inList = entries.some((e) => e.uid === user.uid);
    if (inList) return entries;
    return [...entries, myProfile];
  }, [entries, myProfile, user?.uid]);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      {/* ── Header ── */}
      <div
        className="border-b px-4 py-6"
        style={{
          backgroundColor: "var(--midnight-indigo)",
          borderColor: "rgba(184,176,211,0.12)",
          background: "linear-gradient(180deg, rgba(28,17,50,1) 0%, rgba(15,5,29,0.95) 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.1))",
                    border: "1.5px solid rgba(0,245,255,0.3)",
                    color: "var(--electric-cyan)",
                    boxShadow: "0 0 20px rgba(0,245,255,0.15)",
                  }}
                >
                  <IconTrophy />
                </span>
                <h1
                  className="text-3xl font-black tracking-tight"
                  style={{
                    color: "var(--ghost-white)",
                    textShadow: "0 0 30px rgba(0,245,255,0.2)",
                  }}
                >
                  Leaderboard
                </h1>
              </div>
              <p className="text-sm" style={{ color: "var(--lavender-mist)" }}>
                Top drivers ranked by Aura Points earned across all modules, quizzes & activities
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!loading && (
                <span className="text-xs" style={{ color: "var(--lavender-mist)" }}>
                  Updated {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              <button
                type="button"
                onClick={() => void loadData()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all hover:opacity-90 disabled:opacity-40"
                style={{
                  borderColor: "rgba(184,176,211,0.25)",
                  backgroundColor: "rgba(184,176,211,0.06)",
                  color: "var(--lavender-mist)",
                }}
              >
                <IconRefresh />
                Refresh
              </button>
            </div>
          </div>

          {/* Accent line */}
          <div
            className="mt-5 h-px"
            style={{
              background: "linear-gradient(90deg, var(--electric-cyan), transparent 60%)",
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {fetchError && (
          <div
            className="mb-6 rounded-xl border-2 px-4 py-3 text-sm"
            style={{
              borderColor: "var(--crimson-spark)",
              backgroundColor: "rgba(255,59,63,0.08)",
              color: "var(--crimson-spark)",
            }}
          >
            {fetchError}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* ── Rankings list ── */}
          <section aria-label="Global rankings">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--lavender-mist)" }}
              >
                Global Top 10
              </h2>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  backgroundColor: "rgba(0,245,255,0.08)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "var(--electric-cyan)",
                }}
              >
                {loading ? "—" : `${entries.length} drivers`}
              </span>
            </div>

            <ul className="space-y-2.5">
              {loading
                ? Array.from({ length: 10 }, (_, i) => (
                    <SkeletonRow key={i} rank={i + 1} />
                  ))
                : displayEntries.length === 0
                  ? (
                    <li
                      className="rounded-xl border-2 px-6 py-12 text-center"
                      style={{
                        borderColor: "rgba(184,176,211,0.12)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <IconTrophy />
                      <p className="mt-4 text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
                        No drivers yet
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--lavender-mist)" }}>
                        Complete modules and quizzes to earn Aura Points and appear here.
                      </p>
                    </li>
                  )
                  : displayEntries.map((entry, idx) => {
                      const rank = idx + 1;
                      const isMe = user?.uid === entry.uid;
                      const isOutsideTop10 = idx >= 10;
                      return (
                        <div key={entry.uid}>
                          {isOutsideTop10 && idx === 10 && (
                            <div
                              className="my-3 flex items-center gap-3"
                              aria-hidden
                            >
                              <div className="h-px flex-1" style={{ backgroundColor: "rgba(184,176,211,0.12)" }} />
                              <span className="text-[11px] uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>
                                your position
                              </span>
                              <div className="h-px flex-1" style={{ backgroundColor: "rgba(184,176,211,0.12)" }} />
                            </div>
                          )}
                          <LeaderRow entry={entry} rank={rank} isMe={isMe} />
                        </div>
                      );
                    })}
            </ul>

            {!loading && !user && (
              <div
                className="mt-6 rounded-xl border px-5 py-4 text-sm"
                style={{
                  borderColor: "rgba(0,245,255,0.2)",
                  backgroundColor: "rgba(0,245,255,0.04)",
                  color: "var(--lavender-mist)",
                }}
              >
                <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>
                  Sign in
                </span>{" "}
                to appear on the leaderboard and track your rank.{" "}
                <Link
                  href="/login"
                  className="font-semibold hover:underline"
                  style={{ color: "var(--electric-cyan)" }}
                >
                  Sign in →
                </Link>
              </div>
            )}
          </section>

          {/* ── Personal stats ── */}
          <aside aria-label="Your stats">
            <h2
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--lavender-mist)" }}
            >
              Your stats
            </h2>
            {!authLoading && !user ? (
              <div
                className="rounded-2xl border-2 p-6 text-center"
                style={{
                  borderColor: "rgba(184,176,211,0.15)",
                  backgroundColor: "var(--midnight-indigo)",
                }}
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(184,176,211,0.1)", color: "var(--lavender-mist)" }}
                >
                  <IconUser />
                </span>
                <p className="mt-4 text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
                  Not signed in
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--lavender-mist)" }}>
                  Sign in to see your rank and points.
                </p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: "var(--crimson-spark)" }}
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <PersonalStatsCard
                profile={myProfile}
                rank={myRank}
                total={entries.length}
                localPoints={localPoints}
              />
            )}

            {/* How points work */}
            <div
              className="mt-4 rounded-xl border px-4 py-4"
              style={{
                borderColor: "rgba(184,176,211,0.12)",
                backgroundColor: "rgba(0,0,0,0.18)",
              }}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--lavender-mist)" }}>
                How to earn points
              </p>
              <ul className="space-y-1.5 text-xs" style={{ color: "var(--lavender-mist)" }}>
                <li>Complete a lesson <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>→ +{AURA_POINT_VALUES.LESSON}</span></li>
                <li>Pass a module quiz <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>→ +{AURA_POINT_VALUES.QUIZ}</span></li>
                <li>Correct mock grading <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>→ +{AURA_POINT_VALUES.EXAMINER_SCENARIO}</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function LeaderboardPage() {
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
      <LeaderboardContent />
    </Suspense>
  );
}
