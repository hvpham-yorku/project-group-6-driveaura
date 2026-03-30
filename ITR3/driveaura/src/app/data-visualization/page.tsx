"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { MODULES } from "@/app/modules/data";
import { QUIZZES } from "@/app/quizzes/data";
import {
  getCompletedLessonKeys,
  getCompletedLessonsForModule,
} from "@/app/modules/progress";
import {
  getAuraPointsBreakdown,
  AURA_POINT_VALUES,
  type AuraPointsBreakdown,
} from "@/lib/auraPoints";
import {
  fetchUserQuizProgressMap,
  type QuizProgressRecord,
} from "@/lib/firebase/userQuizProgress";
import {
  fetchReadinessHistory,
  type ReadinessCheckRecord,
} from "@/lib/firebase/readiness";
import { fetchUserProfile } from "@/lib/firebase/users";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type LicenseLevel = "G1" | "G2" | "G";

interface ModuleProgress {
  id: string;
  title: string;
  licenseLevel: LicenseLevel;
  totalLessons: number;
  completedLessons: number;
  quizPassed: boolean;
  quizAttempts: number;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconTrendUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ─── Radial progress ring ─────────────────────────────────────────────────────
function RadialRing({
  percent,
  size = 120,
  stroke = 10,
  color,
  label,
  sublabel,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color: string;
  label: string;
  sublabel: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(184,176,211,0.1)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: "stroke-dasharray 1s ease",
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "none" }}
        >
          <span className="text-2xl font-black" style={{ color: "var(--ghost-white)" }}>
            {percent}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold" style={{ color: "var(--ghost-white)" }}>{label}</div>
        <div className="text-xs" style={{ color: "var(--lavender-mist)" }}>{sublabel}</div>
      </div>
    </div>
  );
}

// ─── Thin horizontal bar ──────────────────────────────────────────────────────
function ProgressBar({
  percent,
  color,
  height = 6,
}: {
  percent: number;
  color: string;
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height, backgroundColor: "rgba(184,176,211,0.1)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.max(percent > 0 ? 3 : 0, percent)}%`,
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--midnight-indigo)",
        borderColor: "rgba(184,176,211,0.12)",
        boxShadow: `0 0 20px ${accent}18`,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>
          {label}
        </span>
      </div>
      <div className="text-3xl font-black" style={{ color: "var(--ghost-white)" }}>
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-xs" style={{ color: "var(--lavender-mist)" }}>{sub}</div>
      )}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(0,245,255,0.18), rgba(57,255,20,0.08))",
          border: "1px solid rgba(0,245,255,0.25)",
          color: "var(--electric-cyan)",
        }}
      >
        {icon}
      </span>
      <div>
        <h2 className="text-base font-bold" style={{ color: "var(--ghost-white)" }}>{title}</h2>
        {sub && <p className="text-xs" style={{ color: "var(--lavender-mist)" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Module row ───────────────────────────────────────────────────────────────
function ModuleRow({ mod }: { mod: ModuleProgress }) {
  const pct = mod.totalLessons > 0 ? Math.round((mod.completedLessons / mod.totalLessons) * 100) : 0;
  const barColor = mod.quizPassed
    ? "var(--neon-mint)"
    : pct === 100
      ? "var(--electric-cyan)"
      : pct > 0
        ? "#B8B0D3"
        : "rgba(184,176,211,0.3)";

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: mod.quizPassed ? "rgba(57,255,20,0.04)" : "rgba(0,0,0,0.15)",
        borderColor: mod.quizPassed
          ? "rgba(57,255,20,0.2)"
          : pct === 100
            ? "rgba(0,245,255,0.18)"
            : "rgba(184,176,211,0.1)",
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-snug" style={{ color: "var(--ghost-white)" }}>
          {mod.title}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {mod.quizPassed ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: "rgba(57,255,20,0.15)", color: "var(--neon-mint)", border: "1px solid rgba(57,255,20,0.3)" }}
            >
              <IconCheck /> Quiz passed
            </span>
          ) : QUIZZES.some((q) => q.id === mod.id) && mod.quizAttempts > 0 ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: "rgba(255,59,63,0.12)", color: "var(--crimson-spark)", border: "1px solid rgba(255,59,63,0.25)" }}
            >
              <IconX /> {mod.quizAttempts} attempt{mod.quizAttempts !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
      </div>
      <ProgressBar percent={pct} color={barColor} />
      <div className="mt-1.5 text-xs" style={{ color: "var(--lavender-mist)" }}>
        {mod.completedLessons}/{mod.totalLessons} lessons
      </div>
    </div>
  );
}

// ─── Readiness sparkline ──────────────────────────────────────────────────────
function ReadinessSparkline({ records }: { records: ReadinessCheckRecord[] }) {
  if (records.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border py-10 text-sm"
        style={{ borderColor: "rgba(184,176,211,0.1)", color: "var(--lavender-mist)" }}
      >
        No readiness checks yet. Take a <Link href="/readiness-check" className="ml-1 font-semibold hover:underline" style={{ color: "var(--electric-cyan)" }}>Drive Readiness Check</Link>.
      </div>
    );
  }

  const max = 100;
  const h = 80;
  const w = 100;
  const pts = records.slice(-12);
  const step = pts.length > 1 ? w / (pts.length - 1) : w;

  const points = pts
    .map((r, i) => {
      const x = pts.length === 1 ? w / 2 : i * step;
      const y = h - (r.readinessScore / max) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const avg = Math.round(pts.reduce((s, r) => s + r.readinessScore, 0) / pts.length);
  const latest = pts[pts.length - 1].readinessScore;
  const latestColor = latest >= 75 ? "var(--neon-mint)" : latest >= 50 ? "#E9C452" : "var(--crimson-spark)";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>Latest score</div>
          <div className="text-3xl font-black" style={{ color: latestColor }}>{latest}%</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>Average</div>
          <div className="text-2xl font-black" style={{ color: "var(--ghost-white)" }}>{avg}%</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>Checks taken</div>
          <div className="text-2xl font-black" style={{ color: "var(--ghost-white)" }}>{records.length}</div>
        </div>
      </div>

      <div
        className="relative rounded-xl border p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.2)", borderColor: "rgba(184,176,211,0.1)" }}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 80 }}
        >
          {/* Grid lines */}
          {[25, 50, 75].map((v) => (
            <line
              key={v}
              x1={0} y1={h - (v / max) * h}
              x2={w} y2={h - (v / max) * h}
              stroke="rgba(184,176,211,0.1)"
              strokeWidth="0.5"
            />
          ))}
          {/* Line */}
          {pts.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke="var(--electric-cyan)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 3px rgba(0,245,255,0.6))" }}
            />
          )}
          {/* Dots */}
          {pts.map((r, i) => {
            const x = pts.length === 1 ? w / 2 : i * step;
            const y = h - (r.readinessScore / max) * h;
            const c = r.readinessScore >= 75 ? "var(--neon-mint)" : r.readinessScore >= 50 ? "#E9C452" : "var(--crimson-spark)";
            return (
              <circle key={i} cx={x} cy={y} r="2.5" fill={c}
                style={{ filter: `drop-shadow(0 0 3px ${c})` }}
              />
            );
          })}
        </svg>
        <div className="mt-2 flex justify-between text-[10px]" style={{ color: "var(--lavender-mist)" }}>
          <span>Oldest</span>
          <span>Most recent</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs" style={{ color: "var(--lavender-mist)" }}>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--neon-mint)" }} />≥75 Ready</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#E9C452" }} />50–74 Caution</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--crimson-spark)" }} />&lt;50 Not ready</span>
      </div>
    </div>
  );
}

// ─── Aura breakdown bars ──────────────────────────────────────────────────────
function AuraBreakdown({ breakdown }: { breakdown: AuraPointsBreakdown }) {
  const total = breakdown.total || 1;
  const items = [
    {
      label: "Lessons completed",
      pts: breakdown.lessons,
      count: breakdown.earnedLessonCount,
      unit: `× ${AURA_POINT_VALUES.LESSON} pts`,
      color: "var(--electric-cyan)",
    },
    {
      label: "Quizzes passed",
      pts: breakdown.quizzes,
      count: breakdown.earnedQuizCount,
      unit: `× ${AURA_POINT_VALUES.QUIZ} pts`,
      color: "var(--neon-mint)",
    },
    {
      label: "Mock grading",
      pts: breakdown.examinerScenarios,
      count: breakdown.earnedExaminerScenarioCount,
      unit: `× ${AURA_POINT_VALUES.EXAMINER_SCENARIO} pts`,
      color: "#E9C452",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stacked total bar */}
      <div
        className="flex h-4 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(184,176,211,0.1)" }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              width: `${(item.pts / total) * 100}%`,
              backgroundColor: item.color,
              transition: "width 0.7s ease",
            }}
          />
        ))}
      </div>

      {/* Item rows */}
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm" style={{ color: "var(--lavender-mist)" }}>{item.label}</span>
              <span className="text-xs" style={{ color: "rgba(184,176,211,0.5)" }}>{item.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--lavender-mist)" }}>{item.count} earned</span>
              <span className="text-sm font-bold" style={{ color: "var(--ghost-white)" }}>
                {item.pts.toLocaleString()} pts
              </span>
            </div>
          </div>
          <ProgressBar
            percent={total > 0 ? (item.pts / total) * 100 : 0}
            color={item.color}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function InsightsContent() {
  const { user, loading: authLoading } = useAuth();

  const [quizMap, setQuizMap] = useState<Map<string, QuizProgressRecord>>(new Map());
  const [readinessHistory, setReadinessHistory] = useState<ReadinessCheckRecord[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const breakdown = useMemo<AuraPointsBreakdown>(
    () => (typeof window !== "undefined" ? getAuraPointsBreakdown() : {
      lessons: 0, quizzes: 0, examinerScenarios: 0, total: 0,
      earnedLessonCount: 0, earnedQuizCount: 0, earnedExaminerScenarioCount: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastRefresh]
  );

  async function loadRemote() {
    setLoading(true);
    try {
      if (user?.uid) {
        const [map, history, profile] = await Promise.all([
          fetchUserQuizProgressMap(user.uid),
          fetchReadinessHistory({ userId: user.uid, limit: 20 }),
          fetchUserProfile(user.uid),
        ]);
        setQuizMap(map);
        setReadinessHistory(history);
        if (profile?.username) setUsername(profile.username);
      }
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) void loadRemote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.uid]);

  // Build per-module progress from localStorage + Firestore
  const moduleProgress = useMemo<ModuleProgress[]>(() => {
    return MODULES.map((m) => {
      const completed = getCompletedLessonsForModule(m.id);
      const quizRec = quizMap.get(m.id);
      return {
        id: m.id,
        title: m.title,
        licenseLevel: m.licenseLevel as LicenseLevel,
        totalLessons: m.lessons.length,
        completedLessons: completed.length,
        quizPassed: quizRec?.passed ?? false,
        quizAttempts: quizRec ? (quizRec.passed ? 1 : quizRec.failedAttempts) : 0,
      };
    });
  }, [quizMap, lastRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-level summary
  const levelSummary = useMemo(() => {
    const levels: LicenseLevel[] = ["G1", "G2", "G"];
    return levels.map((level) => {
      const mods = moduleProgress.filter((m) => m.licenseLevel === level);
      const totalLessons = mods.reduce((s, m) => s + m.totalLessons, 0);
      const doneLessons = mods.reduce((s, m) => s + m.completedLessons, 0);
      const quizzesPassed = mods.filter((m) => m.quizPassed).length;
      const totalQuizzes = mods.filter((m) => QUIZZES.some((q) => q.id === m.id)).length;
      const pct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
      return { level, mods, totalLessons, doneLessons, quizzesPassed, totalQuizzes, pct };
    });
  }, [moduleProgress]);

  const totalLessons = useMemo(
    () => MODULES.reduce((s, m) => s + m.lessons.length, 0),
    []
  );
  const completedTotal = useMemo(
    () => (typeof window !== "undefined" ? getCompletedLessonKeys().length : 0),
    [lastRefresh] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const quizzesPassed = useMemo(
    () => moduleProgress.filter((m) => m.quizPassed).length,
    [moduleProgress]
  );

  const levelColors: Record<LicenseLevel, string> = {
    G1: "var(--electric-cyan)",
    G2: "#B8A0FF",
    G: "var(--neon-mint)",
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--void-purple)", color: "var(--lavender-mist)" }}>
        Loading…
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--void-purple)" }}>

      {/* ── Hero header ── */}
      <div
        className="border-b px-4 py-8"
        style={{
          background: "linear-gradient(160deg, rgba(28,17,50,1) 0%, rgba(15,5,29,0.96) 70%)",
          borderColor: "rgba(184,176,211,0.12)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-3">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.12))",
                    border: "1.5px solid rgba(0,245,255,0.35)",
                    color: "var(--electric-cyan)",
                    boxShadow: "0 0 24px rgba(0,245,255,0.2)",
                  }}
                >
                  <IconTrendUp />
                </span>
                <div>
                  <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--ghost-white)", textShadow: "0 0 40px rgba(0,245,255,0.2)" }}>
                    Progress Insights
                  </h1>
                  {username && (
                    <p className="text-sm" style={{ color: "var(--lavender-mist)" }}>
                      {username}&apos;s learning journey
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!loading && (
                <span className="text-xs" style={{ color: "var(--lavender-mist)" }}>
                  Updated {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              <button
                type="button"
                onClick={() => void loadRemote()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition hover:opacity-90 disabled:opacity-40"
                style={{ borderColor: "rgba(184,176,211,0.25)", backgroundColor: "rgba(184,176,211,0.06)", color: "var(--lavender-mist)" }}
              >
                <IconRefresh /> Refresh
              </button>
            </div>
          </div>

          {/* Accent line */}
          <div className="mt-6 h-px" style={{ background: "linear-gradient(90deg, var(--electric-cyan), rgba(57,255,20,0.4) 50%, transparent)", opacity: 0.4 }} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">

        {/* ── Summary stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<IconZap />} label="Aura Points" value={breakdown.total.toLocaleString()} sub="Total earned across all activities" accent="var(--electric-cyan)" />
          <StatCard icon={<IconBook />} label="Lessons done" value={`${completedTotal}/${totalLessons}`} sub={`${Math.round((completedTotal / totalLessons) * 100)}% of all lessons`} accent="#B8A0FF" />
          <StatCard icon={<IconCheck />} label="Quizzes passed" value={`${quizzesPassed}/${QUIZZES.length}`} sub="Modules with quiz passed" accent="var(--neon-mint)" />
          <StatCard
            icon={<IconTarget />}
            label="Readiness avg"
            value={readinessHistory.length > 0 ? `${Math.round(readinessHistory.reduce((s, r) => s + r.readinessScore, 0) / readinessHistory.length)}%` : "—"}
            sub={readinessHistory.length > 0 ? `Over ${readinessHistory.length} check${readinessHistory.length !== 1 ? "s" : ""}` : "No checks yet"}
            accent="#E9C452"
          />
        </div>

        {/* ── License level rings ── */}
        <section
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "var(--midnight-indigo)", borderColor: "rgba(184,176,211,0.12)" }}
        >
          <SectionHeader icon={<IconShield />} title="License Level Progress" sub="Lessons completed + quizzes passed per pathway" />
          <div className="grid gap-8 sm:grid-cols-3">
            {levelSummary.map(({ level, pct, doneLessons, totalLessons: tl, quizzesPassed: qp, totalQuizzes: tq }) => (
              <div key={level} className="flex flex-col items-center gap-4">
                <RadialRing
                  percent={pct}
                  color={levelColors[level]}
                  label={`${level} License`}
                  sublabel={`${doneLessons}/${tl} lessons`}
                  size={130}
                  stroke={11}
                />
                <div className="w-full space-y-2 text-xs">
                  <div className="flex justify-between" style={{ color: "var(--lavender-mist)" }}>
                    <span>Quizzes passed</span>
                    <span className="font-semibold" style={{ color: "var(--ghost-white)" }}>{qp}/{tq}</span>
                  </div>
                  <ProgressBar
                    percent={tq > 0 ? (qp / tq) * 100 : 0}
                    color={levelColors[level]}
                    height={5}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Module breakdown ── */}
        <section>
          <SectionHeader icon={<IconBook />} title="Module Breakdown" sub="Per-module lesson and quiz completion" />
          <div className="space-y-6">
            {levelSummary.map(({ level, mods }) => (
              <div key={level}>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: `${levelColors[level]}20`, color: levelColors[level], border: `1px solid ${levelColors[level]}40` }}
                  >
                    {level}
                  </span>
                  <span className="text-xs" style={{ color: "var(--lavender-mist)" }}>
                    {mods.filter((m) => m.quizPassed).length}/{mods.length} modules complete
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mods.map((mod) => (
                    <Link key={mod.id} href={`/modules/${mod.id}`} className="block transition-opacity hover:opacity-90">
                      <ModuleRow mod={mod} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Aura breakdown + Readiness (side by side on lg) ── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Aura breakdown */}
          <section
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "var(--midnight-indigo)", borderColor: "rgba(184,176,211,0.12)" }}
          >
            <SectionHeader icon={<IconZap />} title="Aura Points Breakdown" sub="Where your points came from" />
            <div className="mb-4 flex items-end gap-2">
              <span className="text-4xl font-black" style={{ color: "var(--electric-cyan)" }}>
                {breakdown.total.toLocaleString()}
              </span>
              <span className="mb-1 text-sm" style={{ color: "var(--lavender-mist)" }}>total pts</span>
            </div>
            <AuraBreakdown breakdown={breakdown} />
          </section>

          {/* Readiness history */}
          <section
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "var(--midnight-indigo)", borderColor: "rgba(184,176,211,0.12)" }}
          >
            <SectionHeader icon={<IconTarget />} title="Drive Readiness History" sub="Your readiness scores over time" />
            {loading
              ? <div className="flex h-32 items-center justify-center text-sm" style={{ color: "var(--lavender-mist)" }}>Loading…</div>
              : <ReadinessSparkline records={readinessHistory} />
            }
          </section>
        </div>

        {/* ── Quiz performance table ── */}
        <section
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "var(--midnight-indigo)", borderColor: "rgba(184,176,211,0.12)" }}
        >
          <SectionHeader icon={<IconShield />} title="Quiz Performance" sub="Pass/fail status for every module quiz" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(184,176,211,0.12)" }}>
                  {["Module", "Level", "Lessons", "Status", "Attempts"].map((h) => (
                    <th
                      key={h}
                      className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleProgress.map((mod, idx) => {
                  const hasQuiz = QUIZZES.some((q) => q.id === mod.id);
                  const lessonPct = mod.totalLessons > 0 ? Math.round((mod.completedLessons / mod.totalLessons) * 100) : 0;
                  return (
                    <tr
                      key={mod.id}
                      style={{
                        borderBottom: idx < moduleProgress.length - 1 ? "1px solid rgba(184,176,211,0.07)" : "none",
                      }}
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/modules/${mod.id}`}
                          className="font-medium hover:underline"
                          style={{ color: "var(--ghost-white)" }}
                        >
                          {mod.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                          style={{ backgroundColor: `${levelColors[mod.licenseLevel]}18`, color: levelColors[mod.licenseLevel], border: `1px solid ${levelColors[mod.licenseLevel]}35` }}
                        >
                          {mod.licenseLevel}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span style={{ color: "var(--lavender-mist)" }}>{mod.completedLessons}/{mod.totalLessons}</span>
                          <div className="w-16">
                            <ProgressBar
                              percent={lessonPct}
                              color={lessonPct === 100 ? "var(--electric-cyan)" : "#B8B0D3"}
                              height={4}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        {!hasQuiz ? (
                          <span style={{ color: "rgba(184,176,211,0.4)" }}>—</span>
                        ) : mod.quizPassed ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: "rgba(57,255,20,0.12)", color: "var(--neon-mint)", border: "1px solid rgba(57,255,20,0.25)" }}
                          >
                            <IconCheck /> Passed
                          </span>
                        ) : mod.quizAttempts > 0 ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: "rgba(255,59,63,0.1)", color: "var(--crimson-spark)", border: "1px solid rgba(255,59,63,0.2)" }}
                          >
                            <IconX /> Failed
                          </span>
                        ) : (
                          <span style={{ color: "rgba(184,176,211,0.4)" }}>Not started</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span style={{ color: hasQuiz ? "var(--lavender-mist)" : "rgba(184,176,211,0.3)" }}>
                          {hasQuiz ? mod.quizAttempts : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DataVisualizationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--void-purple)", color: "var(--lavender-mist)" }}>
          Loading…
        </div>
      }
    >
      <InsightsContent />
    </Suspense>
  );
}
