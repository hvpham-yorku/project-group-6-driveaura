"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { logAnalyticsEvent } from "@/lib/firebase/analytics";
import { saveReadinessCheck } from "@/lib/firebase/readiness";
import {
  computeReadinessScore,
  readinessQuestions,
  scoreLabel,
  type GateStopId,
} from "@/lib/readiness/scoring";

// ─── Gate definitions ─────────────────────────────────────────────────────────
type GateStop = {
  id: GateStopId;
  emoji: string;
  title: string;
  prompt: string;
};

const gateStops: readonly GateStop[] = [
  {
    id: "alcoholOrDrugs",
    emoji: "🍺",
    title: "Alcohol or drugs",
    prompt: "Have you consumed alcohol, cannabis, or any impairing substance in the last 8–12 hours, or do you feel any effects right now?",
  },
  {
    id: "severeSleepiness",
    emoji: "😴",
    title: "Severe sleepiness",
    prompt: "Are you fighting to stay awake — heavy eyelids, constant yawning, or you've had a microsleep in the past hour?",
  },
  {
    id: "dizzyOrFaint",
    emoji: "💫",
    title: "Dizziness or faintness",
    prompt: "Do you feel dizzy, faint, or unusually lightheaded right now?",
  },
  {
    id: "panicOrOverwhelmed",
    emoji: "⚡",
    title: "Panic or overwhelm",
    prompt: "Are you panicking, dissociating, or so overwhelmed that safely tracking traffic and signs feels impossible?",
  },
] as const;

// ─── Score colour helpers ─────────────────────────────────────────────────────
function scoreColor(score: number, forced: boolean) {
  if (forced || score < 60) return { fg: "var(--crimson-spark)", bg: "rgba(255,59,63,0.12)", border: "rgba(255,59,63,0.35)" };
  if (score < 80) return { fg: "#E9C452", bg: "rgba(233,196,82,0.1)", border: "rgba(233,196,82,0.3)" };
  return { fg: "var(--neon-mint)", bg: "rgba(57,255,20,0.08)", border: "rgba(57,255,20,0.3)" };
}

function ScoreRing({ score, forced }: { score: number; forced: boolean }) {
  const display = forced ? 0 : score;
  const { fg } = scoreColor(display, forced);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (display / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg width={128} height={128} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={64} cy={64} r={r} fill="none" stroke="rgba(184,176,211,0.1)" strokeWidth={10} />
        <circle
          cx={64} cy={64} r={r} fill="none"
          stroke={fg} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${fg})`, transition: "stroke-dasharray 1.2s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color: "var(--ghost-white)" }}>{display}</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--lavender-mist)" }}>/ 100</span>
      </div>
    </div>
  );
}

// ─── Box breathing ────────────────────────────────────────────────────────────
function BoxBreathing() {
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const totalSeconds = 120;

  const phase = useMemo(() => {
    const sec = t % 16;
    if (sec < 4) return { label: "Inhale", progress: sec / 4, color: "var(--electric-cyan)" };
    if (sec < 8) return { label: "Hold", progress: (sec - 4) / 4, color: "#E9C452" };
    if (sec < 12) return { label: "Exhale", progress: (sec - 8) / 4, color: "var(--neon-mint)" };
    return { label: "Hold", progress: (sec - 12) / 4, color: "#E9C452" };
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setT((p) => p + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const remaining = Math.max(0, totalSeconds - t);
  const done = remaining === 0;

  useEffect(() => { if (done) setRunning(false); }, [done]);

  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "rgba(0,245,255,0.15)", backgroundColor: "rgba(0,0,0,0.2)" }}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>Box breathing</p>
          <p className="text-xs" style={{ color: "var(--lavender-mist)" }}>4-4-4-4 rhythm. Inhale · Hold · Exhale · Hold.</p>
        </div>
        <button
          type="button"
          onClick={() => { if (running) { setRunning(false); } else { if (done) setT(0); setRunning(true); } }}
          className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
          style={{ borderColor: "rgba(0,245,255,0.3)", color: "var(--ghost-white)", backgroundColor: "rgba(0,245,255,0.08)" }}
        >
          {running ? "Pause" : done ? "Again" : "Start"}
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-xl font-black" style={{ color: phase.color }}>{phase.label}</p>
          <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(184,176,211,0.1)" }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${phase.progress * 100}%`, backgroundColor: phase.color }} />
          </div>
        </div>
        <div className="text-sm" style={{ color: "var(--lavender-mist)" }}>
          {done ? "Done ✓" : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")} left`}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
type Phase = "intro" | "gates" | "questions" | "results";

export default function ReadinessCheckClient() {
  const { user, loading: authLoading } = useAuth();

  const [phase, setPhase] = useState<Phase>("intro");
  const [gateIndex, setGateIndex] = useState(0);
  const [gateAnswers, setGateAnswers] = useState<Partial<Record<GateStopId, boolean>>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hardStopGate, setHardStopGate] = useState<GateStop | null>(null);

  useEffect(() => { void logAnalyticsEvent("readiness_check_viewed"); }, []);

  const currentGate = gateStops[gateIndex];
  const currentQuestion = readinessQuestions[questionIndex];
  const totalGates = gateStops.length;
  const totalQuestions = readinessQuestions.length;

  const readinessScore = useMemo(
    () => computeReadinessScore(questionAnswers),
    [questionAnswers]
  );

  const displayScore = hardStopGate ? 0 : readinessScore;
  const label = scoreLabel(displayScore);
  const colors = scoreColor(displayScore, !!hardStopGate);

  function handleGateAnswer(yes: boolean) {
    const gate = gateStops[gateIndex];
    setGateAnswers((prev) => ({ ...prev, [gate.id]: yes }));

    if (yes) {
      setHardStopGate(gate);
      setPhase("results");
      void logAnalyticsEvent("readiness_check_hard_stop", { gate: gate.id });
      return;
    }

    if (gateIndex < totalGates - 1) {
      setGateIndex((i) => i + 1);
    } else {
      setPhase("questions");
      setQuestionIndex(0);
    }
  }

  function handleQuestionAnswer(risk: number) {
    const q = readinessQuestions[questionIndex];
    setQuestionAnswers((prev) => ({ ...prev, [q.id]: risk }));

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      void logAnalyticsEvent("readiness_check_completed", { readinessScore, hardStop: false });
      setPhase("results");
    }
  }

  function restart() {
    setPhase("intro");
    setGateIndex(0);
    setGateAnswers({});
    setQuestionIndex(0);
    setQuestionAnswers({});
    setSaved(false);
    setHardStopGate(null);
  }

  const answeredGateCount = Object.keys(gateAnswers).length;
  const answeredQuestionCount = Object.keys(questionAnswers).length;

  // ── Overall progress for the top bar ──
  const totalSteps = totalGates + totalQuestions;
  const doneSteps =
    phase === "intro" ? 0
    : phase === "gates" ? gateIndex
    : phase === "questions" ? totalGates + questionIndex
    : totalSteps;
  const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--void-purple)" }}>

      {/* ── Header ── */}
      <div
        className="border-b px-4 py-6"
        style={{
          background: "linear-gradient(160deg, rgba(28,17,50,1) 0%, rgba(15,5,29,0.96) 100%)",
          borderColor: "rgba(184,176,211,0.12)",
        }}
      >
        <div className="mx-auto max-w-xl">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--lavender-mist)" }}>
              DriveAura
            </span>
            <span style={{ color: "rgba(184,176,211,0.3)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--lavender-mist)" }}>Drive Readiness Check</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--ghost-white)" }}>
            Are you ready to drive?
          </h1>

          {/* Progress bar */}
          {phase !== "intro" && phase !== "results" && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--lavender-mist)" }}>
                <span>
                  {phase === "gates"
                    ? `Safety check ${gateIndex + 1} of ${totalGates}`
                    : `Question ${questionIndex + 1} of ${totalQuestions}`}
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(184,176,211,0.12)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, var(--electric-cyan), var(--neon-mint))",
                    boxShadow: "0 0 6px rgba(0,245,255,0.5)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-10">

        {/* ════════ INTRO ════════ */}
        {phase === "intro" && (
          <div className="space-y-5">
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "rgba(0,245,255,0.15)", backgroundColor: "var(--midnight-indigo)" }}
            >
              <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--ghost-white)" }}>
                How it works
              </h2>
              <ol className="space-y-3">
                {[
                  { n: "1", label: "4 quick safety checks", sub: "Immediate hard-stops like alcohol, severe sleepiness, or dizziness." },
                  { n: "2", label: "5 readiness questions", sub: "Alertness, sleep, stress, focus, and substances — answered one at a time." },
                  { n: "3", label: "Your score + next steps", sub: "A clear recommendation and strategies to reset before you drive." },
                ].map((s) => (
                  <li key={s.n} className="flex items-start gap-3">
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                      style={{ backgroundColor: "rgba(0,245,255,0.15)", color: "var(--electric-cyan)" }}
                    >
                      {s.n}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>{s.label}</p>
                      <p className="text-xs" style={{ color: "var(--lavender-mist)" }}>{s.sub}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div
              className="rounded-2xl border p-4 text-xs"
              style={{ borderColor: "rgba(255,59,63,0.2)", backgroundColor: "rgba(255,59,63,0.06)", color: "var(--lavender-mist)" }}
            >
              <span className="font-semibold" style={{ color: "var(--crimson-spark)" }}>Important: </span>
              This is educational only — not medical advice. If you feel impaired, don&apos;t drive.
            </div>

            <button
              type="button"
              onClick={() => {
                void logAnalyticsEvent("readiness_check_started");
                setPhase("gates");
              }}
              className="w-full rounded-2xl py-4 text-base font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--crimson-spark)" }}
            >
              Start check-in →
            </button>

            <Link
              href="/"
              className="block text-center text-sm transition hover:opacity-80"
              style={{ color: "var(--lavender-mist)" }}
            >
              Back to home
            </Link>
          </div>
        )}

        {/* ════════ GATE (one at a time) ════════ */}
        {phase === "gates" && currentGate && (
          <div className="space-y-5">
            {/* Gate card */}
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "rgba(255,59,63,0.2)", backgroundColor: "var(--midnight-indigo)" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl" role="img" aria-hidden>{currentGate.emoji}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: "rgba(255,59,63,0.15)", color: "var(--crimson-spark)", border: "1px solid rgba(255,59,63,0.25)" }}
                >
                  Hard stop if Yes
                </span>
              </div>
              <h2 className="mb-2 text-lg font-bold" style={{ color: "var(--ghost-white)" }}>
                {currentGate.title}
              </h2>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
                {currentGate.prompt}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGateAnswer(false)}
                  className="rounded-xl py-4 text-base font-bold transition hover:opacity-90"
                  style={{
                    backgroundColor: "rgba(57,255,20,0.1)",
                    border: "2px solid rgba(57,255,20,0.3)",
                    color: "var(--neon-mint)",
                  }}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => handleGateAnswer(true)}
                  className="rounded-xl py-4 text-base font-bold transition hover:opacity-90"
                  style={{
                    backgroundColor: "rgba(255,59,63,0.1)",
                    border: "2px solid rgba(255,59,63,0.3)",
                    color: "var(--crimson-spark)",
                  }}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {gateStops.map((_, i) => (
                <span
                  key={i}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === gateIndex ? 20 : 8,
                    backgroundColor: i < gateIndex
                      ? "var(--neon-mint)"
                      : i === gateIndex
                        ? "var(--electric-cyan)"
                        : "rgba(184,176,211,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (gateIndex > 0) {
                  setGateIndex((i) => i - 1);
                } else {
                  setPhase("intro");
                }
              }}
              className="w-full text-center text-sm transition hover:opacity-80"
              style={{ color: "var(--lavender-mist)" }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* ════════ QUESTIONS (one at a time) ════════ */}
        {phase === "questions" && currentQuestion && (
          <div className="space-y-5">
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "rgba(0,245,255,0.15)", backgroundColor: "var(--midnight-indigo)" }}
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--electric-cyan)" }}>
                Question {questionIndex + 1} of {totalQuestions}
              </div>
              <h2 className="mb-6 text-lg font-bold leading-snug" style={{ color: "var(--ghost-white)" }}>
                {currentQuestion.prompt}
              </h2>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt) => {
                  const selected = questionAnswers[currentQuestion.id] === opt.risk;
                  const riskColor =
                    opt.risk === 0 ? "var(--neon-mint)"
                    : opt.risk === 1 ? "#8EE4AF"
                    : opt.risk === 2 ? "#E9C452"
                    : opt.risk === 3 ? "#FF8C60"
                    : "var(--crimson-spark)";

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleQuestionAnswer(opt.risk)}
                      className="w-full rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all hover:opacity-90"
                      style={{
                        backgroundColor: selected ? "rgba(0,245,255,0.08)" : "rgba(0,0,0,0.15)",
                        border: selected
                          ? `2px solid ${riskColor}`
                          : "2px solid rgba(184,176,211,0.12)",
                        color: selected ? "var(--ghost-white)" : "var(--lavender-mist)",
                        boxShadow: selected ? `0 0 12px ${riskColor}40` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: selected ? riskColor : "rgba(184,176,211,0.25)" }}
                        />
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {readinessQuestions.map((_, i) => (
                <span
                  key={i}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === questionIndex ? 20 : 8,
                    backgroundColor: questionAnswers[readinessQuestions[i].id] !== undefined
                      ? "var(--electric-cyan)"
                      : i === questionIndex
                        ? "rgba(0,245,255,0.4)"
                        : "rgba(184,176,211,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (questionIndex > 0) {
                  setQuestionIndex((i) => i - 1);
                } else {
                  setPhase("gates");
                  setGateIndex(totalGates - 1);
                }
              }}
              className="w-full text-center text-sm transition hover:opacity-80"
              style={{ color: "var(--lavender-mist)" }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* ════════ RESULTS ════════ */}
        {phase === "results" && (
          <div className="space-y-5">

            {/* Score card */}
            <div
              className="rounded-2xl border p-6 text-center"
              style={{ borderColor: colors.border, backgroundColor: colors.bg, boxShadow: `0 0 40px ${colors.border}` }}
            >
              <ScoreRing score={displayScore} forced={!!hardStopGate} />

              <h2 className="mt-4 text-xl font-black" style={{ color: colors.fg }}>
                {hardStopGate
                  ? "Not safe to drive right now"
                  : label === "Safe to drive"
                    ? "You look ready to drive"
                    : label === "Use caution"
                      ? "Use caution before driving"
                      : "Driving is not advised"}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--lavender-mist)" }}>
                {hardStopGate
                  ? `Hard stop: ${hardStopGate.title.toLowerCase()}. The safest option is to postpone.`
                  : label === "Safe to drive"
                    ? "Do a quick 60-second reset and keep distractions low."
                    : label === "Use caution"
                      ? "A short reset can make a real difference. Try the tools below first."
                      : "Take time to rest and regulate. Use the steps below and re-check later."}
              </p>

              {hardStopGate && (
                <div
                  className="mx-auto mt-4 max-w-sm rounded-xl border p-3 text-sm"
                  style={{ borderColor: "rgba(255,59,63,0.3)", backgroundColor: "rgba(255,59,63,0.08)", color: "var(--crimson-spark)" }}
                >
                  If you feel impaired or in crisis:{" "}
                  <span className="font-bold">call 911</span> or text/call{" "}
                  <span className="font-bold">9-8-8</span> (Canada crisis line).
                </div>
              )}

              {/* Save / Re-check buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                  style={{ borderColor: "rgba(184,176,211,0.25)", color: "var(--ghost-white)", backgroundColor: "rgba(184,176,211,0.06)" }}
                >
                  Re-check
                </button>

                {authLoading ? null : user ? (
                  <button
                    type="button"
                    disabled={saving || saved}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const allGateAnswers = Object.fromEntries(
                          gateStops.map((g) => [g.id, gateAnswers[g.id] ?? false])
                        ) as Record<GateStopId, boolean>;
                        await saveReadinessCheck({
                          userId: user.uid,
                          readinessScore: displayScore,
                          gateStops: allGateAnswers,
                          answers: questionAnswers,
                        });
                        setSaved(true);
                        void logAnalyticsEvent("readiness_check_saved", { readinessScore: displayScore, hardStop: !!hardStopGate });
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: saved ? "rgba(57,255,20,0.3)" : "var(--crimson-spark)", color: saved ? "var(--neon-mint)" : "white" }}
                  >
                    {saved ? "✓ Saved" : saving ? "Saving…" : "Save to account"}
                  </button>
                ) : (
                  <Link
                    href="/login?next=%2Freadiness-check"
                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: "var(--crimson-spark)" }}
                  >
                    Log in to save
                  </Link>
                )}
              </div>
            </div>

            {/* Reset tools (only shown when needed) */}
            {(!hardStopGate) && (
              <BoxBreathing />
            )}

            {/* If driving not advised — action steps */}
            {(hardStopGate || displayScore < 60) && (
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: "rgba(184,176,211,0.12)", backgroundColor: "var(--midnight-indigo)" }}
              >
                <h3 className="mb-4 text-base font-bold" style={{ color: "var(--ghost-white)" }}>
                  What to do instead
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: "😴", title: "Rest first", body: "A 15–20 min nap can significantly improve alertness. Set an alarm." },
                    { icon: "🚗", title: "Alternative transport", body: "Rideshare, transit, or ask someone you trust to drive." },
                    { icon: "💧", title: "Hydrate & eat", body: "Drink water and have a light snack before re-checking." },
                    { icon: "📵", title: "Postpone the trip", body: "If possible, delay until you feel clear and rested." },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border p-3"
                      style={{ borderColor: "rgba(184,176,211,0.1)", backgroundColor: "rgba(0,0,0,0.18)" }}
                    >
                      <p className="mb-1 text-lg">{item.icon}</p>
                      <p className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>{item.title}</p>
                      <p className="text-xs" style={{ color: "var(--lavender-mist)" }}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breathing for caution-level */}
            {!hardStopGate && displayScore >= 60 && displayScore < 80 && (
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: "rgba(184,176,211,0.12)", backgroundColor: "var(--midnight-indigo)" }}
              >
                <h3 className="mb-3 text-sm font-bold" style={{ color: "var(--ghost-white)" }}>Quick focus reset</h3>
                <ul className="space-y-2 text-xs" style={{ color: "var(--lavender-mist)" }}>
                  <li>✦ Scan slowly: head left → centre → right. Name 3 details in each view.</li>
                  <li>✦ Silence all notifications. Put phone face-down and out of reach.</li>
                  <li>✦ Rehearse 3 upcoming actions mentally: mirror check, shoulder check, smooth brake.</li>
                </ul>
              </div>
            )}

            <p className="text-center text-xs" style={{ color: "rgba(184,176,211,0.4)" }}>
              This tool is educational and not medical advice.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
