"use client";

import { BadgeInfo } from "lucide-react";
import React, { useState } from "react";

export function MiniHudBadge({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
      style={{
        borderColor: "rgba(0,245,255,0.25)",
        backgroundColor: "rgba(0,245,255,0.08)",
      }}
    >
      <span className="shrink-0" style={{ color: "var(--electric-cyan)" }}>
        {icon}
      </span>
      <div className="min-w-0">
        <div
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--lavender-mist)" }}
        >
          {label}
        </div>
        <div className="text-sm font-bold" style={{ color: "var(--ghost-white)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export function ProTipBubble({
  title = "Pro‑tip",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition-colors"
        style={{
          borderColor: open ? "rgba(233,196,82,0.9)" : "rgba(233,196,82,0.35)",
          backgroundColor: open ? "rgba(233,196,82,0.12)" : "rgba(233,196,82,0.06)",
          color: "var(--ghost-white)",
        }}
        aria-expanded={open}
      >
        <BadgeInfo size={16} />
        <span className="truncate">{title}</span>
        <span
          className="ml-2 rounded-full px-2 py-0.5 text-[11px]"
          style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "var(--lavender-mist)" }}
        >
          {open ? "hide" : "view"}
        </span>
      </button>
      {open ? (
        <div
          className="mt-2 max-w-xl rounded-xl border p-3 text-xs leading-relaxed"
          style={{
            borderColor: "rgba(233,196,82,0.35)",
            backgroundColor: "rgba(0,0,0,0.18)",
            color: "var(--lavender-mist)",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function InfoTile({
  title,
  icon,
  accent = "cyan",
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  accent?: "cyan" | "crimson" | "warning" | "mint";
  children: React.ReactNode;
}) {
  const accentColor =
    accent === "crimson"
      ? "var(--crimson-spark)"
      : accent === "warning"
        ? "#E9C452"
        : accent === "mint"
          ? "var(--neon-mint)"
          : "var(--electric-cyan)";

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "var(--midnight-indigo)",
        backgroundColor: "var(--void-purple)",
      }}
    >
      <div className="mb-2 flex items-start gap-2">
        <span className="mt-0.5 shrink-0" style={{ color: accentColor }}>
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-base font-semibold" style={{ color: "var(--ghost-white)" }}>
            {title}
          </div>
        </div>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
        {children}
      </div>
    </div>
  );
}

export function SourceCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg border-2 p-4"
      style={{
        borderColor: "var(--electric-cyan)",
        backgroundColor: "var(--midnight-indigo)",
      }}
    >
      <div
        className="mb-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--electric-cyan)" }}
      >
        Source
      </div>
      <div className="text-sm leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
        {children}
      </div>
    </div>
  );
}

export function StepTracker({
  steps,
  defaultActive = 0,
}: {
  steps: Array<{
    title: string;
    icon: React.ReactNode;
    body: React.ReactNode;
    hud?: React.ReactNode;
  }>;
  defaultActive?: number;
}) {
  const [active, setActive] = useState(defaultActive);
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <div
        className="rounded-lg border p-3"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--void-purple)",
        }}
      >
        <div
          className="mb-3 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--lavender-mist)" }}
        >
          Step‑by‑step
        </div>
        <div className="space-y-2">
          {steps.map((s, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(idx)}
                className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                style={{
                  borderColor: isActive ? "rgba(0,245,255,0.55)" : "rgba(184,176,211,0.18)",
                  backgroundColor: isActive ? "rgba(0,245,255,0.08)" : "rgba(0,0,0,0.08)",
                  color: "var(--ghost-white)",
                }}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.22)",
                    color: isActive ? "var(--electric-cyan)" : "var(--lavender-mist)",
                  }}
                >
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{s.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-lg font-semibold" style={{ color: "var(--ghost-white)" }}>
            {steps[active]?.title}
          </div>
          {steps[active]?.hud ? <div className="shrink-0">{steps[active].hud}</div> : null}
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: "var(--midnight-indigo)",
            backgroundColor: "var(--void-purple)",
          }}
        >
          {steps[active]?.body}
        </div>
      </div>
    </div>
  );
}
