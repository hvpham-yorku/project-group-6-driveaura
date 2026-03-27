"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { logAnalyticsEvent } from "@/lib/firebase/analytics";
import { saveManualShiftSession } from "@/lib/firebase/manualShift";
import {
  createEngineState,
  getShiftTip,
  MAX_RPM,
  MAX_SPEED,
  RPM_ZONES,
  shiftGear,
  updateEngine,
  type Difficulty,
  type EngineState,
  type GearCount,
  type InputState,
  type Mode,
} from "@/lib/manual-shift/engine";
import { EngineAudio } from "@/lib/manual-shift/audio";
import { getScenarioSteps, type ScenarioStep } from "@/lib/manual-shift/scenarios";

// ─── SVG Helpers ──────────────────────────────────────────────────────────────

function svgPt(deg: number, r: number): { x: number; y: number } {
  const rad = (((deg % 360) + 360) % 360) * (Math.PI / 180);
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

/** Clockwise arc from value v0 to v1 on a gauge spanning 270° (SVG 135° → 45°). */
function dialArc(v0: number, v1: number, maxV: number, r: number): string {
  const a0 = 135 + (v0 / maxV) * 270;
  const a1 = 135 + (v1 / maxV) * 270;
  const s  = svgPt(a0, r);
  const e  = svgPt(a1, r);
  const span = a1 - a0;
  const large = span > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

/** Needle rotation: −135° (min) → 0° (middle) → +135° (max). */
function needleRot(v: number, maxV: number): number {
  return -135 + (Math.min(v, maxV) / maxV) * 270;
}

// ─── Dial Component ───────────────────────────────────────────────────────────

interface DialProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  zones?: readonly { min: number; max: number; stroke: string }[];
  ticks?: readonly number[];
  tickLabels?: readonly string[];
  size?: number;
}

function Dial({ value, maxValue, label, unit, zones, ticks, tickLabels, size = 220 }: DialProps) {
  const rot = needleRot(value, maxValue);
  return (
    <svg
      width={size}
      height={size}
      viewBox="-110 -110 220 220"
      className="select-none overflow-visible"
    >
      {/* Outer glow ring */}
      <circle cx="0" cy="0" r="108" fill="none" stroke="#00F5FF" strokeWidth="0.5" opacity="0.18" />
      {/* Face */}
      <circle cx="0" cy="0" r="104" fill="#0F051D" stroke="#1C1132" strokeWidth="2" />
      {/* Track background */}
      <path d={dialArc(0, maxValue, maxValue, 79)} stroke="#1C1132" strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* Zone arcs */}
      {zones?.map((z) => (
        <path
          key={z.min}
          d={dialArc(z.min, Math.min(z.max, maxValue), maxValue, 79)}
          stroke={z.stroke}
          strokeWidth="7"
          fill="none"
          strokeLinecap="butt"
          opacity="0.8"
        />
      ))}
      {/* Tick marks */}
      {ticks?.map((t, i) => {
        const a  = 135 + (t / maxValue) * 270;
        const p1 = svgPt(a, 64);
        const p2 = svgPt(a, 74);
        const pl = svgPt(a, 55);
        return (
          <g key={t}>
            <line
              x1={p1.x.toFixed(1)} y1={p1.y.toFixed(1)}
              x2={p2.x.toFixed(1)} y2={p2.y.toFixed(1)}
              stroke="#B8B0D3" strokeWidth="1.5" opacity="0.5"
            />
            {tickLabels?.[i] && (
              <text
                x={pl.x.toFixed(1)} y={pl.y.toFixed(1)}
                textAnchor="middle" dominantBaseline="middle"
                fill="#B8B0D3" fontSize="8" fontFamily="monospace" opacity="0.6"
              >
                {tickLabels[i]}
              </text>
            )}
          </g>
        );
      })}
      {/* Needle glow */}
      <polygon
        points="0,-71 -4,9 4,9"
        fill="rgba(255,59,63,0.18)"
        transform={`rotate(${rot.toFixed(2)}, 0, 0)`}
      />
      {/* Needle */}
      <polygon
        points="0,-71 -2.5,9 2.5,9"
        fill="#FF3B3F"
        transform={`rotate(${rot.toFixed(2)}, 0, 0)`}
      />
      {/* Hub */}
      <circle cx="0" cy="0" r="9" fill="#1C1132" stroke="#FF3B3F" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="4" fill="#FF3B3F" />
      {/* Value readout */}
      <text x="0" y="33" textAnchor="middle" fill="#F5F5F7" fontSize="15" fontWeight="bold" fontFamily="monospace">
        {Math.round(value)}
      </text>
      <text x="0" y="47" textAnchor="middle" fill="#B8B0D3" fontSize="9" fontFamily="monospace">
        {unit}
      </text>
      {/* Label */}
      <text x="0" y="-24" textAnchor="middle" fill="#00F5FF" fontSize="7" fontFamily="monospace" letterSpacing="2">
        {label}
      </text>
    </svg>
  );
}

// ─── Gear Gate Component ──────────────────────────────────────────────────────

function GearGate({ gear, gearCount }: { gear: number; gearCount: GearCount }) {
  const base: Record<number, [number, number]> = {
    1: [-40, -26], 2: [-40, 26],
    3: [  0, -26], 4: [  0, 26],
    5: [ 40, -26],
  };
  const positions: Record<number, [number, number]> = gearCount === 6
    ? { ...base, 6: [40, 26] }
    : base;
  const knob = positions[gear] ?? [0, 0] as [number, number];

  return (
    <svg width="120" height="88" viewBox="-60 -44 120 88" className="select-none">
      {/* H-gate lines */}
      {[-40, 0, 40].map((x) => (
        <line key={x} x1={x} y1="-26" x2={x} y2="26" stroke="#1C1132" strokeWidth="2.5" />
      ))}
      <line x1="-50" y1="0" x2="50" y2="0" stroke="#1C1132" strokeWidth="2.5" />
      {/* Gear positions */}
      {Object.entries(positions).map(([g, [x, y]]) => {
        const active = Number(g) === gear;
        return (
          <g key={g}>
            <circle cx={x} cy={y} r="11"
              fill={active ? "#1C1132" : "#0F051D"}
              stroke={active ? "#00F5FF" : "#2a2040"}
              strokeWidth={active ? 1.5 : 1}
            />
            <text
              x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              fill={active ? "#F5F5F7" : "#4a4060"}
              fontSize="9" fontFamily="monospace" fontWeight="bold"
            >
              {g}
            </text>
          </g>
        );
      })}
      {/* Active knob ring */}
      <circle
        cx={knob[0]} cy={knob[1]} r="14"
        fill="none"
        stroke="#00F5FF"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

interface SetupConfig {
  gearCount: GearCount;
  difficulty: Difficulty;
  mode: Mode;
}

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: "learner", label: "Learner",  desc: "Wide RPM window. No stalls. Forgiving." },
  { id: "driver",  label: "Driver",   desc: "Standard window. Stall if RPM drops too low." },
  { id: "expert",  label: "Expert",   desc: "Narrow window. Rev-match required. Stall risk." },
];

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "guided",   label: "Guided Tutorial", desc: "Step-by-step intro to manual driving." },
  { id: "free",     label: "Free Drive",      desc: "Open practice, no prompts." },
  { id: "city",     label: "City Streets",    desc: "Stop-start urban driving, 50 km/h max." },
  { id: "highway",  label: "Highway Entry",   desc: "Accelerate to 100 km/h on the ramp." },
  { id: "overtake", label: "Overtaking",      desc: "Downshift for power, then settle." },
];

function SetupScreen({ onStart }: { onStart: (cfg: SetupConfig) => void }) {
  const [cfg, setCfg] = useState<SetupConfig>({ gearCount: 6, difficulty: "driver", mode: "free" });

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section
        className="border-b border-[#00F5FF]/10"
        style={{
          backgroundImage:
            "linear-gradient(to right,rgba(0,245,255,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,245,255,0.04) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-xs text-[#B8B0D3]">
            DriveAura • Manual Shift Trainer
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Manual Shift Trainer
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#B8B0D3] sm:text-base">
            Practice shifting a manual car at the right RPM. Hold{" "}
            <kbd className="rounded border border-[#00F5FF]/20 bg-[#1C1132] px-1.5 py-0.5 text-xs font-mono">Space</kbd>{" "}
            to accelerate,{" "}
            <kbd className="rounded border border-[#00F5FF]/20 bg-[#1C1132] px-1.5 py-0.5 text-xs font-mono">W</kbd>{" "}
            / <kbd className="rounded border border-[#00F5FF]/20 bg-[#1C1132] px-1.5 py-0.5 text-xs font-mono">S</kbd>{" "}
            to shift, <kbd className="rounded border border-[#00F5FF]/20 bg-[#1C1132] px-1.5 py-0.5 text-xs font-mono">C</kbd>{" "}
            for clutch. Earn Aura points for clean shifts.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Gear count */}
          <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
            <p className="text-sm font-semibold text-[#00F5FF]">Gear count</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {([5, 6] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setCfg((c) => ({ ...c, gearCount: g }))}
                  className={[
                    "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                    cfg.gearCount === g
                      ? "border-[#00F5FF]/55 bg-[#0F051D] text-[#F5F5F7]"
                      : "border-[#00F5FF]/15 bg-[#0F051D]/30 text-[#B8B0D3] hover:border-[#00F5FF]/40",
                  ].join(" ")}
                >
                  {g}-speed
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
            <p className="text-sm font-semibold text-[#00F5FF]">Difficulty</p>
            <div className="mt-3 space-y-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setCfg((c) => ({ ...c, difficulty: d.id }))}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                    cfg.difficulty === d.id
                      ? "border-[#00F5FF]/55 bg-[#0F051D] text-[#F5F5F7]"
                      : "border-[#00F5FF]/15 bg-[#0F051D]/30 text-[#B8B0D3] hover:border-[#00F5FF]/40",
                  ].join(" ")}
                >
                  <span className="font-semibold">{d.label}</span>
                  <span className="ml-2 text-xs opacity-70">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
            <p className="text-sm font-semibold text-[#00F5FF]">Mode</p>
            <div className="mt-3 space-y-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCfg((c) => ({ ...c, mode: m.id }))}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                    cfg.mode === m.id
                      ? "border-[#00F5FF]/55 bg-[#0F051D] text-[#F5F5F7]"
                      : "border-[#00F5FF]/15 bg-[#0F051D]/30 text-[#B8B0D3] hover:border-[#00F5FF]/40",
                  ].join(" ")}
                >
                  <span className="font-semibold">{m.label}</span>
                  <span className="ml-2 text-xs opacity-70">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls reference */}
        <div className="mt-6 rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
          <p className="text-sm font-semibold text-[#F5F5F7]">Key bindings</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#B8B0D3]">
            {[
              { key: "Space", action: "Accelerate (hold)" },
              { key: "B", action: "Brake" },
              { key: "C (hold)", action: "Clutch" },
              { key: "W / ↑", action: "Shift up" },
              { key: "S / ↓", action: "Shift down" },
              { key: "P", action: "Pause / resume" },
            ].map((b) => (
              <span key={b.key} className="flex items-center gap-2">
                <kbd className="rounded border border-[#00F5FF]/20 bg-[#0F051D] px-2 py-1 font-mono">
                  {b.key}
                </kbd>
                {b.action}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onStart(cfg)}
            className="rounded-full bg-[#FF3B3F] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
          >
            Start session
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-6 py-3 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

interface SessionResult {
  score: number;
  perfectShifts: number;
  bestStreak: number;
  stalls: number;
  auraEarned: number;
  sessionTimeSec: number;
  difficulty: Difficulty;
  mode: Mode;
  gearCount: GearCount;
}

function ResultsScreen({
  result,
  onPlayAgain,
  onSave,
  saving,
  saved,
}: {
  result: SessionResult;
  onPlayAgain: () => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const { user } = useAuth();
  const mins = Math.floor(result.sessionTimeSec / 60);
  const secs = Math.round(result.sessionTimeSec % 60);

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <p className="inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-xs text-[#B8B0D3]">
          Session complete
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Your results</h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Score",          value: result.score.toString() },
            { label: "Aura earned",    value: `+${result.auraEarned} ✦` },
            { label: "Perfect shifts", value: result.perfectShifts.toString() },
            { label: "Best streak",    value: `${result.bestStreak}×` },
            { label: "Stalls",         value: result.stalls.toString() },
            { label: "Time",           value: `${mins}:${String(secs).padStart(2, "0")}` },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5"
            >
              <p className="text-xs text-[#B8B0D3]">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold text-[#F5F5F7]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="rounded-full bg-[#FF3B3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
          >
            Play again
          </button>

          {user ? (
            <button
              type="button"
              onClick={onSave}
              disabled={saving || saved}
              className={[
                "rounded-full px-6 py-3 text-sm font-semibold text-white transition",
                saved
                  ? "bg-[#39FF14]/25 text-[#39FF14] cursor-default"
                  : saving
                    ? "bg-[#FF3B3F]/50 cursor-wait"
                    : "bg-[#1C1132] border border-[#00F5FF]/25 text-[#F5F5F7] hover:border-[#00F5FF]/60",
              ].join(" ")}
            >
              {saved ? "Saved to account ✓" : saving ? "Saving…" : "Save to account"}
            </button>
          ) : (
            <Link
              href="/login?next=%2Fmanual-shift"
              className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-6 py-3 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
            >
              Log in to save
            </Link>
          )}

          <Link
            href="/"
            className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-6 py-3 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── Touch Button ─────────────────────────────────────────────────────────────

function TouchBtn({
  label,
  active,
  onDown,
  onUp,
  color = "#1C1132",
  border = "#00F5FF",
}: {
  label: string;
  active: boolean;
  onDown: () => void;
  onUp: () => void;
  color?: string;
  border?: string;
}) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); onDown(); }}
      onPointerUp={(e)   => { e.preventDefault(); onUp(); }}
      onPointerLeave={(e) => { e.preventDefault(); onUp(); }}
      className="select-none rounded-2xl border px-4 py-4 text-sm font-semibold text-[#F5F5F7] transition active:scale-95"
      style={{
        backgroundColor: active ? `${border}22` : color,
        borderColor: active ? border : `${border}30`,
        color: active ? border : "#F5F5F7",
      }}
    >
      {label}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const TACH_TICKS       = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000] as const;
const TACH_TICK_LABELS = ["0", "1", "2", "3", "4", "5", "6", "7"]     as const;
const SPEED_TICKS       = [0, 40, 80, 120, 160, 200]  as const;
const SPEED_TICK_LABELS = ["0", "40", "80", "120", "160", "200"] as const;

type Phase = "setup" | "playing" | "paused" | "results";

interface DisplayState {
  rpm: number;
  speed: number;
  gear: number;
  stalled: boolean;
  stallCooldown: number;
  sessionTime: number;
  score: number;
  perfectShifts: number;
  streak: number;
  auraEarned: number;
  shiftTip: string;
  feedback: { text: string; positive: boolean } | null;
  clutchActive: boolean;
  throttleActive: boolean;
}

interface TouchInputs {
  throttle: boolean;
  brake: boolean;
  clutch: boolean;
  shiftUp: boolean;
  shiftDown: boolean;
}

export default function ManualShiftClient() {
  const { user, loading } = useAuth();
  const [phase, setPhase]         = useState<Phase>("setup");
  const [display, setDisplay]     = useState<DisplayState>({
    rpm: 850, speed: 0, gear: 1, stalled: false, stallCooldown: 0,
    sessionTime: 0, score: 0, perfectShifts: 0, streak: 0, auraEarned: 0,
    shiftTip: "", feedback: null, clutchActive: false, throttleActive: false,
  });
  const [scenarioStep, setScenarioStep] = useState(0);
  const [saving, setSaving]     = useState(false);
  const [saved,  setSaved]      = useState(false);

  // Mutable refs — not react state, used in the rAF loop
  const simRef          = useRef<EngineState | null>(null);
  const keysRef         = useRef<Set<string>>(new Set());
  const touchRef        = useRef<TouchInputs>({ throttle: false, brake: false, clutch: false, shiftUp: false, shiftDown: false });
  const audioRef        = useRef<EngineAudio | null>(null);
  const rafRef          = useRef<number>(0);
  const lastTimeRef     = useRef<number>(0);
  const displayRpmRef   = useRef<number>(850);
  const displaySpeedRef = useRef<number>(0);
  const feedbackRef     = useRef<{ text: string; positive: boolean; timer: number } | null>(null);
  const scenarioStepsRef = useRef<readonly ScenarioStep[] | null>(null);
  const scenarioStepRef  = useRef<number>(0);
  const cfgRef           = useRef<{ gearCount: GearCount; difficulty: Difficulty; mode: Mode } | null>(null);
  const lastShiftUpRef   = useRef<boolean>(false);
  const lastShiftDownRef = useRef<boolean>(false);

  // ── Shift handler (called from loop or touch) ──────────────────────────────
  const handleShift = useCallback((direction: "up" | "down") => {
    if (!simRef.current) return;
    const { newState, feedback } = shiftGear(simRef.current, direction);
    simRef.current = newState;
    feedbackRef.current = { ...feedback, timer: 2.2 };
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (!simRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

      const keys   = keysRef.current;
      const touch  = touchRef.current;

      const shiftUpNow   = keys.has("w") || keys.has("arrowup")   || touch.shiftUp;
      const shiftDownNow = keys.has("s") || keys.has("arrowdown") || touch.shiftDown;

      // Edge-triggered shifts (fire once per press)
      if (shiftUpNow && !lastShiftUpRef.current)   handleShift("up");
      if (shiftDownNow && !lastShiftDownRef.current) handleShift("down");
      lastShiftUpRef.current   = shiftUpNow;
      lastShiftDownRef.current = shiftDownNow;

      const inputs: InputState = {
        throttle: keys.has(" ") || touch.throttle,
        brake:    keys.has("b") || touch.brake,
        clutch:   keys.has("c") || touch.clutch,
      };

      const newSim = updateEngine(simRef.current, inputs, dt);
      simRef.current = newSim;

      // Lerp display values for smooth needle movement
      displayRpmRef.current   += (newSim.rpm   - displayRpmRef.current)   * 0.22;
      displaySpeedRef.current += (newSim.speed - displaySpeedRef.current) * 0.18;

      // Feedback timer
      if (feedbackRef.current) {
        feedbackRef.current.timer -= dt;
        if (feedbackRef.current.timer <= 0) feedbackRef.current = null;
      }

      // Scenario step advancement
      const steps = scenarioStepsRef.current;
      const step  = scenarioStepRef.current;
      if (steps && step < steps.length - 1) {
        if (steps[step].completed(newSim)) {
          const bonus = steps[step].auraBonus;
          simRef.current = { ...simRef.current, auraEarned: simRef.current.auraEarned + bonus };
          scenarioStepRef.current += 1;
          setScenarioStep(scenarioStepRef.current);
        }
      }

      // Audio
      audioRef.current?.update(newSim.rpm, inputs.throttle, newSim.stalled);

      // Sync React display state
      setDisplay({
        rpm:           displayRpmRef.current,
        speed:         displaySpeedRef.current,
        gear:          newSim.gear,
        stalled:       newSim.stalled,
        stallCooldown: newSim.stallCooldown,
        sessionTime:   newSim.sessionTime,
        score:         newSim.score,
        perfectShifts: newSim.perfectShifts,
        streak:        newSim.streak,
        auraEarned:    newSim.auraEarned,
        shiftTip:      getShiftTip(newSim.rpm, newSim.gear, newSim.gearCount, newSim.speed, newSim.stalled),
        feedback:      feedbackRef.current ? { text: feedbackRef.current.text, positive: feedbackRef.current.positive } : null,
        clutchActive:  inputs.clutch,
        throttleActive: inputs.throttle,
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [handleShift]);

  // ── Start session ─────────────────────────────────────────────────────────
  const handleStart = useCallback((cfg: { gearCount: GearCount; difficulty: Difficulty; mode: Mode }) => {
    cfgRef.current = cfg;
    simRef.current = createEngineState(cfg.gearCount, cfg.difficulty, cfg.mode);
    scenarioStepsRef.current = getScenarioSteps(cfg.mode);
    scenarioStepRef.current = 0;
    setScenarioStep(0);
    displayRpmRef.current   = 850;
    displaySpeedRef.current = 0;
    feedbackRef.current     = null;
    lastShiftUpRef.current   = false;
    lastShiftDownRef.current = false;
    setSaved(false);

    // Init audio (user interaction just happened — context allowed)
    if (!audioRef.current) audioRef.current = new EngineAudio();
    audioRef.current.init();

    void logAnalyticsEvent("manual_shift_started", { mode: cfg.mode, difficulty: cfg.difficulty });
    setPhase("playing");
  }, []);

  // ── End session ────────────────────────────────────────────────────────────
  const handleEnd = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    audioRef.current?.suspend();
    setPhase("results");
    void logAnalyticsEvent("manual_shift_ended");
  }, []);

  // ── Pause / resume ────────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    setPhase((prev) => {
      if (prev === "playing") {
        cancelAnimationFrame(rafRef.current);
        audioRef.current?.suspend();
        return "paused";
      }
      if (prev === "paused") {
        audioRef.current?.resume();
        startLoop();
        return "playing";
      }
      return prev;
    });
  }, [startLoop]);

  // ── Start loop when playing ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    startLoop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, startLoop]);

  // ── Keyboard events ───────────────────────────────────────────────────────
  useEffect(() => {
    const PREVENT = new Set([" ", "arrowup", "arrowdown"]);

    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (phase === "playing" && PREVENT.has(k)) e.preventDefault();
      if (k === "p" && (phase === "playing" || phase === "paused")) { togglePause(); return; }
      keysRef.current.add(k);
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, [phase, togglePause]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.destroy();
    };
  }, []);

  // ── Save session ──────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!user || !simRef.current || !cfgRef.current) return;
    setSaving(true);
    try {
      const s = simRef.current;
      await saveManualShiftSession({
        userId: user.uid,
        score: s.score,
        perfectShifts: s.perfectShifts,
        bestStreak: s.bestStreak,
        stalls: s.stalls,
        auraEarned: s.auraEarned,
        sessionTimeSec: Math.round(s.sessionTime),
        difficulty: cfgRef.current.difficulty,
        mode: cfgRef.current.mode,
        gearCount: cfgRef.current.gearCount,
      });
      setSaved(true);
      void logAnalyticsEvent("manual_shift_saved", { score: s.score, auraEarned: s.auraEarned });
    } finally {
      setSaving(false);
    }
  }, [user]);

  const handlePlayAgain = useCallback(() => {
    audioRef.current?.destroy();
    audioRef.current = null;
    setPhase("setup");
  }, []);

  // ── Render: Setup ─────────────────────────────────────────────────────────
  if (phase === "setup") return <SetupScreen onStart={handleStart} />;

  // ── Render: Results ───────────────────────────────────────────────────────
  if (phase === "results") {
    const s = simRef.current;
    if (!s || !cfgRef.current) return null;
    return (
      <ResultsScreen
        result={{
          score: s.score,
          perfectShifts: s.perfectShifts,
          bestStreak: s.bestStreak,
          stalls: s.stalls,
          auraEarned: s.auraEarned,
          sessionTimeSec: Math.round(s.sessionTime),
          difficulty: s.difficulty,
          mode: s.mode,
          gearCount: s.gearCount,
        }}
        onPlayAgain={handlePlayAgain}
        onSave={handleSave}
        saving={saving}
        saved={saved}
      />
    );
  }

  // ── Render: Playing / Paused ──────────────────────────────────────────────
  const steps         = scenarioStepsRef.current;
  const currentStep   = steps?.[scenarioStep];
  const mins          = Math.floor(display.sessionTime / 60);
  const secs          = Math.floor(display.sessionTime % 60);
  const timeStr       = `${mins}:${String(secs).padStart(2, "0")}`;
  const gearCount     = cfgRef.current?.gearCount ?? 6;

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7] flex flex-col">

      {/* ── Top HUD ── */}
      <div className="sticky top-0 z-20 border-b border-[#00F5FF]/10 bg-[#0F051D]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 gap-2 flex-wrap">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#B8B0D3]">
              Score <span className="font-semibold text-[#F5F5F7]">{display.score}</span>
            </span>
            <span className="text-[#B8B0D3]">
              Aura <span className="font-semibold text-[#39FF14]">+{display.auraEarned} ✦</span>
            </span>
            {display.streak >= 2 && (
              <span className="inline-flex rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-2 py-0.5 text-[#00F5FF]">
                {display.streak}× streak
              </span>
            )}
            <span className="text-[#B8B0D3]">
              Shifts <span className="font-semibold text-[#F5F5F7]">{display.perfectShifts}</span>
            </span>
            <span className="text-[#B8B0D3]">{timeStr}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePause}
              className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-3 py-1 text-xs font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
            >
              {phase === "paused" ? "Resume (P)" : "Pause (P)"}
            </button>
            <button
              type="button"
              onClick={handleEnd}
              className="rounded-full border border-[#FF3B3F]/30 bg-[#1C1132] px-3 py-1 text-xs font-semibold text-[#FF3B3F] transition hover:border-[#FF3B3F]/60"
            >
              End session
            </button>
          </div>
        </div>
      </div>

      {/* ── Scenario / step banner ── */}
      {currentStep && (
        <div className="border-b border-[#00F5FF]/10 bg-[#1C1132]/50 px-4 py-3">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold text-[#F5F5F7]">{currentStep.instruction}</p>
            <p className="mt-0.5 text-xs text-[#B8B0D3]">{currentStep.hint}</p>
          </div>
        </div>
      )}

      {/* ── Paused overlay ── */}
      {phase === "paused" && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#0F051D]/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-[#00F5FF]/20 bg-[#1C1132] p-8 text-center">
            <p className="text-2xl font-semibold">Paused</p>
            <p className="mt-2 text-sm text-[#B8B0D3]">Press P or click Resume to continue.</p>
            <button
              type="button"
              onClick={togglePause}
              className="mt-6 rounded-full bg-[#FF3B3F] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {/* ── Stall banner ── */}
      {display.stalled && (
        <div className="border-b border-[#FF3B3F]/30 bg-[#FF3B3F]/10 px-4 py-2 text-center">
          <p className="text-sm font-semibold text-[#FF3B3F]">
            Engine stalled — restarting in {display.stallCooldown.toFixed(1)}s
          </p>
        </div>
      )}

      {/* ── Shift feedback ── */}
      {display.feedback && (
        <div className="border-b border-[#00F5FF]/10 px-4 py-2 text-center">
          <p className={`text-sm font-semibold ${display.feedback.positive ? "text-[#39FF14]" : "text-[#FF8C00]"}`}>
            {display.feedback.text}
          </p>
        </div>
      )}

      {/* ── Main driving view ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-6">
        {/* Dials row */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          {/* Tachometer */}
          <div className="flex flex-col items-center gap-2">
            <Dial
              value={display.rpm}
              maxValue={MAX_RPM}
              label="RPM ×1000"
              unit=""
              zones={RPM_ZONES}
              ticks={TACH_TICKS}
              tickLabels={TACH_TICK_LABELS}
              size={200}
            />
          </div>

          {/* Center: gear + gate */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 text-4xl font-bold"
              style={{
                borderColor: display.stalled ? "#FF3B3F" : display.clutchActive ? "#FFD700" : "#00F5FF",
                boxShadow: display.stalled
                  ? "0 0 24px rgba(255,59,63,0.4)"
                  : display.clutchActive
                    ? "0 0 18px rgba(255,215,0,0.3)"
                    : "0 0 18px rgba(0,245,255,0.25)",
                color: "#F5F5F7",
                background: "#0F051D",
              }}
            >
              {display.gear}
            </div>
            <GearGate gear={display.gear} gearCount={gearCount} />
            <p className="text-xs text-[#B8B0D3]">Gear</p>
          </div>

          {/* Speedometer */}
          <div className="flex flex-col items-center gap-2">
            <Dial
              value={display.speed}
              maxValue={MAX_SPEED}
              label="SPEED"
              unit="km/h"
              ticks={SPEED_TICKS}
              tickLabels={SPEED_TICK_LABELS}
              size={200}
            />
          </div>
        </div>

        {/* Shift tip */}
        {display.shiftTip && (
          <p className="mt-2 rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/60 px-6 py-2.5 text-sm font-semibold text-[#00F5FF]">
            {display.shiftTip}
          </p>
        )}

        {/* Input indicators (keyboard) */}
        <div className="flex gap-2 text-xs">
          {[
            { label: "Throttle", active: display.throttleActive, key: "Space" },
            { label: "Clutch",   active: display.clutchActive,   key: "C" },
          ].map((i) => (
            <span
              key={i.label}
              className={[
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 transition",
                i.active
                  ? "border-[#00F5FF]/50 bg-[#1C1132] text-[#00F5FF]"
                  : "border-[#00F5FF]/10 text-[#B8B0D3]",
              ].join(" ")}
            >
              <kbd className="font-mono">{i.key}</kbd> {i.label}
            </span>
          ))}
        </div>

        {/* ── Touch Controls ── */}
        <div className="mt-2 w-full max-w-sm sm:hidden grid grid-cols-2 gap-2">
          <TouchBtn
            label="⬆ Shift Up (W)"
            active={false}
            onDown={() => { touchRef.current.shiftUp = true; }}
            onUp={()   => { touchRef.current.shiftUp = false; }}
            border="#39FF14"
          />
          <TouchBtn
            label="⬇ Shift Down (S)"
            active={false}
            onDown={() => { touchRef.current.shiftDown = true; }}
            onUp={()   => { touchRef.current.shiftDown = false; }}
            border="#FFD700"
          />
          <TouchBtn
            label="⚡ Throttle"
            active={touchRef.current.throttle}
            onDown={() => { touchRef.current.throttle = true; }}
            onUp={()   => { touchRef.current.throttle = false; }}
            border="#FF3B3F"
          />
          <TouchBtn
            label="🛑 Brake"
            active={touchRef.current.brake}
            onDown={() => { touchRef.current.brake = true; }}
            onUp={()   => { touchRef.current.brake = false; }}
            border="#FF8C00"
          />
          <TouchBtn
            label="◎ Clutch (hold)"
            active={touchRef.current.clutch}
            onDown={() => { touchRef.current.clutch = true; }}
            onUp={()   => { touchRef.current.clutch = false; }}
            border="#00F5FF"
          />
          <div className="rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/30 px-4 py-4 text-center text-xs text-[#B8B0D3]">
            Hold Clutch<br />before shifting
          </div>
        </div>

        {/* Desktop keyboard reference (hidden on mobile) */}
        <div className="hidden sm:flex gap-3 flex-wrap justify-center text-xs text-[#B8B0D3] mt-2">
          {[
            { key: "Space", action: "Accelerate" },
            { key: "B",     action: "Brake" },
            { key: "C",     action: "Clutch" },
            { key: "W/↑",   action: "Shift up" },
            { key: "S/↓",   action: "Shift down" },
            { key: "P",     action: "Pause" },
          ].map((b) => (
            <span key={b.key} className="flex items-center gap-1">
              <kbd className="rounded border border-[#00F5FF]/20 bg-[#1C1132] px-1.5 py-0.5 font-mono text-[10px]">
                {b.key}
              </kbd>
              {b.action}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
