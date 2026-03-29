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

type StepId = "intro" | "gates" | "questions" | "results";

type GateStop = {
  id: GateStopId;
  title: string;
  prompt: string;
  hardStop: boolean;
};

const gateStops: readonly GateStop[] = [
  {
    id: "alcoholOrDrugs",
    title: "Alcohol / impairing substances",
    prompt:
      "Have you had alcohol, cannabis, or any impairing drugs in the last 8–12 hours (or do you feel any effects right now)?",
    hardStop: true,
  },
  {
    id: "severeSleepiness",
    title: "Severe sleepiness",
    prompt:
      "Are you fighting sleep (heavy eyelids, yawning constantly, or you’ve had any microsleeps)?",
    hardStop: true,
  },
  {
    id: "dizzyOrFaint",
    title: "Dizziness or faintness",
    prompt: "Do you feel dizzy, faint, or unusually lightheaded right now?",
    hardStop: true,
  },
  {
    id: "panicOrOverwhelmed",
    title: "Panic / overwhelmed",
    prompt:
      "Are you panicking, dissociating, or feeling too overwhelmed to safely track traffic and signs?",
    hardStop: true,
  },
  {
    id: "visionOrCoordinationIssue",
    title: "Vision / coordination issue",
    prompt:
      "Do you have blurred vision, poor coordination, or anything that would slow reactions right now?",
    hardStop: true,
  },
  {
    id: "unsafeEnvironment",
    title: "Unsafe environment",
    prompt:
      "Is your environment unsafe to start driving right now (e.g., aggressive conflict, you feel pressured, or you can’t stop distractions)?",
    hardStop: false,
  },
] as const;

function formatScore(score: number | null) {
  if (score === null) return "—";
  return `${Math.max(0, Math.min(100, Math.round(score)))}/100`;
}

function scoreSubtitle(score: number | null, forcedNoDrive: boolean): string {
  if (forcedNoDrive) return "Hard stop is active.";
  if (score === null) return "Answer all questions for a score.";
  return scoreLabel(score);
}

function recommendationFor(score: number | null, forcedNoDrive: boolean) {
  if (forcedNoDrive) {
    return {
      headline: "Not safe to drive right now",
      subhead:
        "Based on your check-in, the safest option is to pause and reset before driving.",
      tone: "danger" as const,
    };
  }

  if (score === null) {
    return {
      headline: "Checklist incomplete",
      subhead:
        "Answer every readiness question so we can estimate your readiness; unanswered items are not treated as zero risk.",
      tone: "caution" as const,
    };
  }

  const label = scoreLabel(score);
  if (label === "Safe to drive") {
    return {
      headline: "You look ready to drive",
      subhead: "Do a quick 60-second reset and keep distractions low.",
      tone: "good" as const,
    };
  }
  if (label === "Use caution") {
    return {
      headline: "Use caution before driving",
      subhead:
        "A short reset can make a real difference. Try the steps below, then re-check.",
      tone: "caution" as const,
    };
  }
  return {
    headline: "Driving is not advised right now",
    subhead:
      "Take time to rest and regulate first. Use the steps below and re-check later.",
    tone: "danger" as const,
  };
}

function toneClasses(tone: "good" | "caution" | "danger") {
  switch (tone) {
    case "good":
      return "border-[#39FF14]/30 bg-[#1C1132] shadow-[0_0_30px_rgba(57,255,20,0.10)]";
    case "caution":
      return "border-[#00F5FF]/30 bg-[#1C1132] shadow-[0_0_30px_rgba(0,245,255,0.10)]";
    case "danger":
      return "border-[#FF3B3F]/30 bg-[#1C1132] shadow-[0_0_30px_rgba(255,59,63,0.12)]";
  }
}

function BoxBreathing({ minutes = 2 }: { minutes?: number }) {
  const totalSeconds = Math.max(30, Math.round(minutes * 60));
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);

  const phase = useMemo(() => {
    const sec = t % 16;
    if (sec < 4) return { label: "Inhale", progress: sec / 4 };
    if (sec < 8) return { label: "Hold", progress: (sec - 4) / 4 };
    if (sec < 12) return { label: "Exhale", progress: (sec - 8) / 4 };
    return { label: "Hold", progress: (sec - 12) / 4 };
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setT((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const remaining = Math.max(0, totalSeconds - t);
  const done = remaining === 0;

  useEffect(() => {
    if (!running) return;
    if (!done) return;
    setRunning(false);
  }, [done, running]);

  return (
    <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#0F051D]/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#F5F5F7]">Box breathing</p>
          <p className="mt-1 text-xs text-[#B8B0D3]">
            A simple rhythm to slow the body down: inhale 4, hold 4, exhale 4, hold 4.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (running) {
              setRunning(false);
              return;
            }
            if (done) setT(0);
            setRunning(true);
          }}
          className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-3 py-1.5 text-xs font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
        >
          {running ? "Pause" : done ? "Restart" : "Start"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#00F5FF]/10 bg-[#1C1132]/60 p-3">
          <p className="text-xs text-[#B8B0D3]">Phase</p>
          <p className="mt-1 text-lg font-semibold text-[#F5F5F7]">{phase.label}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0F051D]">
            <div
              className="h-full bg-[#00F5FF]"
              style={{ width: `${Math.round(phase.progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#00F5FF]/10 bg-[#1C1132]/60 p-3">
          <p className="text-xs text-[#B8B0D3]">Remaining</p>
          <p className="mt-1 text-lg font-semibold text-[#F5F5F7]">
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-[#B8B0D3]">
            {done ? "Done. Take one normal breath." : "Keep shoulders relaxed."}
          </p>
        </div>

        <div className="rounded-xl border border-[#00F5FF]/10 bg-[#1C1132]/60 p-3">
          <p className="text-xs text-[#B8B0D3]">Tip</p>
          <p className="mt-1 text-sm font-medium text-[#F5F5F7]">
            Exhale like you’re fogging a mirror.
          </p>
          <p className="mt-1 text-xs text-[#B8B0D3]">Longer exhales calm faster.</p>
        </div>
      </div>
    </div>
  );
}

function GroundingSteps() {
  const steps = [
    { title: "5 things you can see", detail: "Name them slowly. Notice colors and shapes." },
    { title: "4 things you can feel", detail: "Feet on floor, fabric, temperature." },
    { title: "3 things you can hear", detail: "Near, far, and subtle sounds." },
    { title: "2 things you can smell", detail: "Even faint smells count." },
    { title: "1 thing you can taste", detail: "Sip water or notice your mouth." },
  ] as const;

  return (
    <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#0F051D]/40 p-4">
      <p className="text-sm font-semibold text-[#F5F5F7]">Grounding (5-4-3-2-1)</p>
      <p className="mt-1 text-xs text-[#B8B0D3]">
        Pull attention out of spirals and back into the present moment.
      </p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {steps.map((s) => (
          <li
            key={s.title}
            className="rounded-xl border border-[#00F5FF]/10 bg-[#1C1132]/60 p-3"
          >
            <p className="text-xs font-semibold text-[#00F5FF]">{s.title}</p>
            <p className="mt-1 text-xs text-[#B8B0D3]">{s.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FocusReset() {
  const items = [
    {
      title: "60-second scan",
      detail: "Slowly turn your head: left, centre, right. Notice 3 details in each view.",
    },
    {
      title: "Hands-on-wheel rehearsal",
      detail: "Imagine 3 upcoming actions: mirror check, shoulder check, smooth brake.",
    },
    {
      title: "Distraction shutdown",
      detail: "Silence notifications. Put phone out of reach. Set GPS before moving.",
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#0F051D]/40 p-4">
      <p className="text-sm font-semibold text-[#F5F5F7]">Focus reset</p>
      <p className="mt-1 text-xs text-[#B8B0D3]">
        Build a “driving-only” mindset before you turn the key.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {items.map((i) => (
          <li
            key={i.title}
            className="rounded-xl border border-[#00F5FF]/10 bg-[#1C1132]/60 p-3"
          >
            <p className="text-xs font-semibold text-[#00F5FF]">{i.title}</p>
            <p className="mt-1 text-xs text-[#B8B0D3]">{i.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CanadaEmergencyCard() {
  return (
    <div className="rounded-2xl border border-[#FF3B3F]/30 bg-[#1C1132] p-4">
      <p className="text-sm font-semibold text-[#F5F5F7]">If you might be in danger</p>
      <p className="mt-1 text-xs text-[#B8B0D3]">
        If you feel unsafe, out of control, or at risk of harming yourself or someone else,
        don’t drive.
      </p>
      <ul className="mt-3 space-y-2 text-xs text-[#B8B0D3]">
        <li>
          <span className="font-semibold text-[#FF3B3F]">Immediate danger:</span> call 911.
        </li>
        <li>
          <span className="font-semibold text-[#FF3B3F]">Canada: 9-8-8</span> — call or text
          for suicide crisis support.
        </li>
        <li>
          <span className="font-semibold text-[#FF3B3F]">Talk Suicide Canada:</span>{" "}
          1-833-456-4566 (or text 45645, where available).
        </li>
      </ul>
      <p className="mt-3 text-[11px] text-[#B8B0D3]">
        This tool is educational and not medical advice.
      </p>
    </div>
  );
}

function serializeGateStopsForSave(
  answers: Record<GateStopId, boolean | null>,
): Record<GateStopId, boolean> {
  return Object.fromEntries(
    gateStops.map((g) => [g.id, answers[g.id] === true]),
  ) as Record<GateStopId, boolean>;
}

export default function ReadinessCheckClient() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState<StepId>("intro");
  const [gateAnswers, setGateAnswers] = useState<Record<GateStopId, boolean | null>>(() =>
    Object.fromEntries(gateStops.map((g) => [g.id, null])) as Record<
      GateStopId,
      boolean | null
    >,
  );
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const gatesAllAnswered = useMemo(
    () => gateStops.every((g) => typeof gateAnswers[g.id] === "boolean"),
    [gateAnswers],
  );

  const forcedNoDrive = useMemo(
    () => gateStops.some((g) => g.hardStop && gateAnswers[g.id] === true),
    [gateAnswers],
  );

  const readinessScore = useMemo(
    () => computeReadinessScore(questionAnswers),
    [questionAnswers],
  );

  const rec = useMemo(
    () => recommendationFor(readinessScore, forcedNoDrive),
    [forcedNoDrive, readinessScore],
  );

  const canViewResults = forcedNoDrive || readinessScore !== null;

  const scoreToPersist =
    readinessScore !== null ? readinessScore : forcedNoDrive ? 0 : null;

  useEffect(() => {
    void logAnalyticsEvent("readiness_check_viewed");
  }, []);

  useEffect(() => {
    setSaved(false);
  }, [gateAnswers, questionAnswers]);

  const steps: readonly { id: StepId; label: string }[] = [
    { id: "intro", label: "Start" },
    { id: "gates", label: "Quick safety checks" },
    { id: "questions", label: "Readiness score" },
    { id: "results", label: "Next steps" },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section
        className="border-b border-[#00F5FF]/10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,245,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,245,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-xs text-[#B8B0D3]">
                DriveAura • Mental + physical check-in
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Drive Readiness Check
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#B8B0D3] sm:text-base">
                Get a clear recommendation based on how you feel right now, plus step-by-step
                strategies to reset stress, focus, and alertness before driving.
              </p>
            </div>

            <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
              <p className="text-xs font-semibold text-[#00F5FF]">Important</p>
              <p className="mt-1 text-xs text-[#B8B0D3]">
                This tool is educational and not medical advice. If you feel impaired, unsafe,
                or in crisis, don’t drive.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {steps.map((s, idx) => {
                const active = idx === stepIndex;
                const done = idx < stepIndex;
                return (
                  <span
                    key={s.id}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                      active
                        ? "border-[#00F5FF]/40 bg-[#1C1132] text-[#F5F5F7]"
                        : done
                          ? "border-[#00F5FF]/20 bg-[#0F051D]/40 text-[#B8B0D3]"
                          : "border-[#00F5FF]/10 bg-[#0F051D]/20 text-[#B8B0D3]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                        active
                          ? "bg-[#00F5FF] text-[#0F051D]"
                          : done
                            ? "bg-[#00F5FF]/20 text-[#00F5FF]"
                            : "bg-[#1C1132] text-[#B8B0D3]",
                      ].join(" ")}
                    >
                      {idx + 1}
                    </span>
                    {s.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {step === "intro" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
                <h2 className="text-xl font-semibold">What you’ll do</h2>
                <ol className="mt-4 space-y-3 text-sm text-[#B8B0D3]">
                  <li>
                    <span className="font-semibold text-[#00F5FF]">Quick safety checks:</span>{" "}
                    immediate “hard stops” (sleepiness, substances, panic, dizziness).
                  </li>
                  <li>
                    <span className="font-semibold text-[#00F5FF]">Readiness score:</span> a
                    short questionnaire to estimate driving readiness right now.
                  </li>
                  <li>
                    <span className="font-semibold text-[#00F5FF]">Next steps:</span> clear
                    guidance (rest, hydration, breathing, grounding, focus reset).
                  </li>
                </ol>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      void logAnalyticsEvent("readiness_check_started");
                      setStep("gates");
                    }}
                    className="rounded-full bg-[#FF3B3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
                  >
                    Start check-in
                  </button>
                  <Link
                    href="/"
                    className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-6 py-3 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CanadaEmergencyCard />
              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
                <p className="text-sm font-semibold text-[#F5F5F7]">Privacy</p>
                <p className="mt-1 text-xs text-[#B8B0D3]">
                  If you complete the check-in while signed in, your score and answers can be
                  saved to your DriveAura account for history.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {step === "gates" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
                <h2 className="text-xl font-semibold">Quick safety checks</h2>
                <p className="mt-2 text-sm text-[#B8B0D3]">
                  These checks catch situations where driving should be postponed right away.
                </p>

                <div className="mt-6 space-y-4">
                  {gateStops.map((g) => {
                    const value = gateAnswers[g.id];
                    return (
                      <fieldset
                        key={g.id}
                        className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-4"
                      >
                        <legend className="px-1 text-sm font-semibold text-[#F5F5F7]">
                          {g.title}
                          {g.hardStop ? (
                            <span className="ml-2 rounded-full border border-[#FF3B3F]/30 bg-[#1C1132] px-2 py-0.5 text-[11px] font-semibold text-[#FF3B3F]">
                              hard stop
                            </span>
                          ) : null}
                        </legend>
                        <p className="mt-2 text-sm text-[#B8B0D3]">{g.prompt}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setGateAnswers((prev) => ({ ...prev, [g.id]: false }))
                            }
                            className={[
                              "rounded-full border px-4 py-2 text-sm font-semibold transition",
                              value === false
                                ? "border-[#00F5FF]/50 bg-[#1C1132] text-[#F5F5F7]"
                                : "border-[#00F5FF]/15 bg-[#0F051D]/30 text-[#B8B0D3] hover:border-[#00F5FF]/40",
                            ].join(" ")}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setGateAnswers((prev) => ({ ...prev, [g.id]: true }))
                            }
                            className={[
                              "rounded-full border px-4 py-2 text-sm font-semibold transition",
                              value === true
                                ? "border-[#FF3B3F]/55 bg-[#1C1132] text-[#F5F5F7]"
                                : "border-[#00F5FF]/15 bg-[#0F051D]/30 text-[#B8B0D3] hover:border-[#FF3B3F]/40",
                            ].join(" ")}
                          >
                            Yes
                          </button>
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep("intro")}
                    className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-5 py-2.5 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
                  >
                    Back
                  </button>
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    {!gatesAllAnswered ? (
                      <p className="text-xs text-[#B8B0D3]">
                        Answer Yes or No for each check before continuing.
                      </p>
                    ) : null}
                    <button
                      type="button"
                      disabled={!gatesAllAnswered}
                      onClick={() => setStep("questions")}
                      className={[
                        "rounded-full px-6 py-3 text-sm font-semibold text-white transition",
                        gatesAllAnswered
                          ? "bg-[#FF3B3F] hover:bg-[#e23337]"
                          : "cursor-not-allowed bg-[#FF3B3F]/35 text-white/70",
                      ].join(" ")}
                    >
                      Continue to score
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {forcedNoDrive ? (
                <div className="rounded-2xl border border-[#FF3B3F]/30 bg-[#1C1132] p-4">
                  <p className="text-sm font-semibold text-[#F5F5F7]">Hard stop triggered</p>
                  <p className="mt-1 text-xs text-[#B8B0D3]">
                    If any hard stop is “Yes”, the safest option is to postpone driving. You can
                    still continue to get a score and next steps.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
                  <p className="text-sm font-semibold text-[#F5F5F7]">Tip</p>
                  <p className="mt-1 text-xs text-[#B8B0D3]">
                    Be honest. This is a private check-in to support safer decisions.
                  </p>
                </div>
              )}
              <CanadaEmergencyCard />
            </div>
          </div>
        ) : null}

        {step === "questions" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
                <h2 className="text-xl font-semibold">Readiness score</h2>
                <p className="mt-2 text-sm text-[#B8B0D3]">
                  Answer based on how you feel right now. We’ll generate a score and next steps.
                </p>

                <div className="mt-6 space-y-4">
                  {readinessQuestions.map((q) => {
                    const value = questionAnswers[q.id];
                    return (
                      <fieldset
                        key={q.id}
                        className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-4"
                      >
                        <legend className="px-1 text-sm font-semibold text-[#F5F5F7]">
                          {q.prompt}
                        </legend>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() =>
                                setQuestionAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt.risk,
                                }))
                              }
                              className={[
                                "rounded-xl border px-3 py-2 text-left text-sm transition",
                                value === opt.risk
                                  ? "border-[#00F5FF]/55 bg-[#1C1132] text-[#F5F5F7]"
                                  : "border-[#00F5FF]/15 bg-[#0F051D]/25 text-[#B8B0D3] hover:border-[#00F5FF]/40",
                              ].join(" ")}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep("gates")}
                    className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-5 py-2.5 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
                  >
                    Back
                  </button>
                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    {!canViewResults ? (
                      <p className="text-xs text-[#B8B0D3]">
                        Answer every question above, or go back if a quick safety check applies.
                      </p>
                    ) : null}
                    <button
                      type="button"
                      disabled={!canViewResults}
                      onClick={() => {
                        void logAnalyticsEvent("readiness_check_completed", {
                          readinessScore: readinessScore ?? "incomplete",
                          hardStop: forcedNoDrive,
                        });
                        setStep("results");
                      }}
                      className={[
                        "rounded-full px-6 py-3 text-sm font-semibold text-white transition",
                        canViewResults
                          ? "bg-[#FF3B3F] hover:bg-[#e23337]"
                          : "cursor-not-allowed bg-[#FF3B3F]/35 text-white/70",
                      ].join(" ")}
                    >
                      See results
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
                <p className="text-xs font-semibold text-[#00F5FF]">Current score</p>
                <p className="mt-1 text-3xl font-semibold text-[#F5F5F7]">
                  {formatScore(readinessScore)}
                </p>
                <p className="mt-1 text-xs text-[#B8B0D3]">
                  {scoreSubtitle(readinessScore, forcedNoDrive)}
                </p>
              </div>
              <CanadaEmergencyCard />
            </div>
          </div>
        ) : null}

        {step === "results" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className={`rounded-2xl border p-6 ${toneClasses(rec.tone)}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{rec.headline}</h2>
                    <p className="mt-2 text-sm text-[#B8B0D3]">{rec.subhead}</p>
                  </div>
                  <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 px-4 py-3">
                    <p className="text-xs font-semibold text-[#00F5FF]">Readiness score</p>
                    <p className="mt-1 text-3xl font-semibold text-[#F5F5F7]">
                      {formatScore(readinessScore)}
                    </p>
                    <p className="mt-1 text-xs text-[#B8B0D3]">
                      {scoreSubtitle(readinessScore, forcedNoDrive)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setGateAnswers(
                        Object.fromEntries(gateStops.map((g) => [g.id, null])) as Record<
                          GateStopId,
                          boolean | null
                        >,
                      );
                      setQuestionAnswers({});
                      setSaved(false);
                      setStep("gates");
                    }}
                    className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-5 py-2.5 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
                  >
                    Re-check
                  </button>

                  {loading ? (
                    <span className="text-sm text-[#B8B0D3]">Checking sign-in…</span>
                  ) : user ? (
                    <button
                      type="button"
                      disabled={saving || saved || scoreToPersist === null}
                      title={
                        scoreToPersist === null
                          ? "Complete all readiness questions to save a scored check-in."
                          : undefined
                      }
                      onClick={async () => {
                        if (scoreToPersist === null) return;
                        setSaving(true);
                        try {
                          await saveReadinessCheck({
                            userId: user.uid,
                            readinessScore: scoreToPersist,
                            gateStops: serializeGateStopsForSave(gateAnswers),
                            answers: questionAnswers,
                          });
                          setSaved(true);
                          void logAnalyticsEvent("readiness_check_saved", {
                            readinessScore: scoreToPersist,
                            hardStop: forcedNoDrive,
                          });
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className={[
                        "rounded-full px-6 py-3 text-sm font-semibold text-white transition",
                        saved
                          ? "bg-[#39FF14]/30 text-[#39FF14] cursor-default"
                          : saving
                            ? "bg-[#FF3B3F]/60 cursor-wait"
                            : "bg-[#FF3B3F] hover:bg-[#e23337]",
                      ].join(" ")}
                    >
                      {saved ? "Saved to account" : saving ? "Saving…" : "Save to account"}
                    </button>
                  ) : (
                    <Link
                      href="/login?next=%2Freadiness-check"
                      className="rounded-full bg-[#FF3B3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
                    >
                      Log in to save history
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <BoxBreathing minutes={2} />
                <GroundingSteps />
                <FocusReset />
              </div>

              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
                <h3 className="text-lg font-semibold">If driving isn’t advised, do this</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-4">
                    <p className="text-sm font-semibold text-[#F5F5F7]">Rest</p>
                    <p className="mt-1 text-xs text-[#B8B0D3]">
                      Take a break and re-check after a rest period. If you’re sleepy, a 15–20
                      minute nap can help.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-4">
                    <p className="text-sm font-semibold text-[#F5F5F7]">Hydration</p>
                    <p className="mt-1 text-xs text-[#B8B0D3]">
                      Drink water and have a light snack if needed. Avoid “energy spikes” that
                      lead to a crash.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-4">
                    <p className="text-sm font-semibold text-[#F5F5F7]">Postpone</p>
                    <p className="mt-1 text-xs text-[#B8B0D3]">
                      If you’re impaired or overwhelmed, postpone the trip and use another option
                      (ride share, transit, or a friend).
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-4">
                    <p className="text-sm font-semibold text-[#F5F5F7]">Reach out</p>
                    <p className="mt-1 text-xs text-[#B8B0D3]">
                      If you feel unsafe or pressured to drive, contact someone you trust and
                      ask for help with a safer plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CanadaEmergencyCard />
              <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
                <p className="text-sm font-semibold text-[#F5F5F7]">Saved history</p>
                <p className="mt-1 text-xs text-[#B8B0D3]">
                  After saving, you can review recent check-ins in your account area.
                </p>
                <Link
                  href="/account"
                  className="mt-3 inline-flex rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-4 py-2 text-xs font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
                >
                  Go to account
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

