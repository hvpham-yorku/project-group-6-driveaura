"use client";

import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Gauge,
  GitMerge,
  MoveRight,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import React from "react";
import { InfoTile, MiniHudBadge, ProTipBubble, SourceCard, StepTracker } from "./helpers";

function LaneDiagram() {
  return (
    <div
      className="relative overflow-hidden rounded-lg border p-4"
      style={{ borderColor: "var(--midnight-indigo)", backgroundColor: "var(--void-purple)" }}
      aria-label="Merge diagram: setup zone vs acceleration lane"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold" style={{ color: "var(--ghost-white)" }}>
          Merge diagram (CSS)
        </div>
        <span className="text-xs" style={{ color: "var(--lavender-mist)" }}>
          Setup Zone → Acceleration Lane → Merge
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div
          className="relative rounded-lg border p-3"
          style={{ borderColor: "var(--midnight-indigo)", backgroundColor: "rgba(0,0,0,0.10)" }}
        >
          <div className="mb-2 text-base font-semibold" style={{ color: "var(--ghost-white)" }}>
            Setup Zone
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded-full" style={{ backgroundColor: "rgba(184,176,211,0.14)" }} />
            <div className="h-3 rounded-full" style={{ backgroundColor: "rgba(184,176,211,0.10)" }} />
            <div className="h-3 rounded-full" style={{ backgroundColor: "rgba(184,176,211,0.08)" }} />
          </div>
          <div className="mt-3 text-xs" style={{ color: "var(--lavender-mist)" }}>
            Scan far ahead, pick a gap, and prepare your speed.
          </div>
        </div>
        <div
          className="relative rounded-lg border p-3"
          style={{ borderColor: "var(--midnight-indigo)", backgroundColor: "rgba(0,0,0,0.10)" }}
        >
          <div className="mb-2 text-base font-semibold" style={{ color: "var(--ghost-white)" }}>
            Acceleration Lane
          </div>
          <div
            className="relative h-20 overflow-hidden rounded-lg"
            style={{ backgroundColor: "rgba(0,0,0,0.18)", border: "1px solid rgba(184,176,211,0.16)" }}
          >
            <div className="absolute inset-y-0 left-4 w-1" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="absolute inset-y-0 right-4 w-1" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="absolute left-3 top-6 h-6 w-10 rounded-md" style={{ backgroundColor: "rgba(0,245,255,0.22)", border: "1px solid rgba(0,245,255,0.45)" }} />
            <div className="absolute left-14 top-10 h-2 w-16 rounded-full" style={{ backgroundColor: "rgba(0,245,255,0.35)" }} />
            <div className="absolute left-28 top-8 h-2 w-20 rounded-full" style={{ backgroundColor: "rgba(0,245,255,0.22)" }} />
            <div className="absolute right-6 top-2 h-16 w-2 rounded-full" style={{ backgroundColor: "rgba(233,196,82,0.25)" }} />
            <div className="absolute right-2 top-3 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#E9C452" }}>
              Merge point
            </div>
          </div>
          <div className="mt-3 text-xs" style={{ color: "var(--lavender-mist)" }}>
            Match flow speed, then merge smoothly into a chosen gap.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GHighSpeedLesson({ lessonId }: { lessonId: string }) {
  if (lessonId === "1.1") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MiniHudBadge label="Mini‑HUD" value="Target: 100 km/h flow" icon={<Gauge size={18} />} />
          <ProTipBubble title="Check the Dash">
            When checking your blind spot, remember to glance at the side‑mirror hotspots [x:46, y:39] before merging.
          </ProTipBubble>
        </div>
        <StepTracker
          steps={[
            {
              title: "Acceleration",
              icon: <Gauge size={18} />,
              hud: (
                <MiniHudBadge label="Target speed" value="Match traffic flow" icon={<MoveRight size={18} />} />
              ),
              body: (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
                    Use the entrance ramp to build speed. The MTO Driver&apos;s Handbook emphasizes matching the speed of highway traffic so you merge without forcing others to brake.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoTile title="Do" icon={<CheckCircle2 size={18} />} accent="mint">
                      Build speed early, keep eyes up, and aim for a specific gap.
                    </InfoTile>
                    <InfoTile title="Avoid" icon={<AlertTriangle size={18} />} accent="warning">
                      Braking hard at the end of the ramp or merging far below traffic speed.
                    </InfoTile>
                  </div>
                </div>
              ),
            },
            {
              title: "Signaling",
              icon: <Sparkles size={18} />,
              body: (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
                    Signal early to communicate intent. Then scan far ahead, check mirrors, and hold steady lane position while you time your gap.
                  </p>
                  <InfoTile title="Examiner tip" icon={<ShieldAlert size={18} />} accent="crimson">
                    Signal first, then confirm with mirrors. Signaling &quot;as you drift&quot; reads like a late decision.
                  </InfoTile>
                </div>
              ),
            },
            {
              title: "Merging",
              icon: <GitMerge size={18} />,
              body: (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--lavender-mist)" }}>
                    Shoulder‑check just before moving, then merge smoothly into a real space cushion (room ahead and behind).
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoTile title="Common mistake" icon={<AlertTriangle size={18} />} accent="warning">
                      Merging into a gap that only exists &quot;for a moment,&quot; causing other drivers to brake.
                    </InfoTile>
                    <SourceCard>
                      Ontario Ministry of Transportation. Official MTO Driver&apos;s Handbook (Chapter 2): expressway driving, merging, and lane changes.
                    </SourceCard>
                  </div>
                </div>
              ),
            },
          ]}
        />
        <LaneDiagram />
      </div>
    );
  }

  if (lessonId === "1.2") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MiniHudBadge label="Mini‑HUD" value="Lane goal: predictable" icon={<ArrowRightLeft size={18} />} />
          <ProTipBubble title="Check the Dash">
            Mirror checks before lane changes reduce sudden &quot;surprise moves.&quot;
          </ProTipBubble>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-7">
            <InfoTile title="Core rule" icon={<CheckCircle2 size={18} />} accent="mint">
              Keep right except to pass. Use the left lane mainly to pass, then return to the right when safe.
            </InfoTile>
          </div>
          <div className="md:col-span-5">
            <InfoTile title="HOV lanes" icon={<Users size={18} />} accent="cyan">
              Follow posted occupancy rules and don&apos;t cross solid lines. Plan entry/exit early where allowed.
            </InfoTile>
          </div>
          <div className="md:col-span-6">
            <InfoTile title="Common mistake" icon={<AlertTriangle size={18} />} accent="warning">
              Camping in the left lane at the same speed as traffic.
            </InfoTile>
          </div>
          <div className="md:col-span-6">
            <SourceCard>
              Ontario Ministry of Transportation. Official MTO Driver&apos;s Handbook (Chapter 2): lane use and passing on expressways.
            </SourceCard>
          </div>
        </div>
      </div>
    );
  }

  if (lessonId === "1.3") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MiniHudBadge label="Mini‑HUD" value="Baseline: 3 seconds" icon={<Gauge size={18} />} />
          <ProTipBubble title="Check the Dash">
            If your speed creeps up, your following time shrinks fast—protect your gap with quick speed checks.
          </ProTipBubble>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <InfoTile title="3‑second rule" icon={<CheckCircle2 size={18} />} accent="mint">
              Pick a fixed point, count 3 seconds after the vehicle ahead passes it, and increase space if you arrive too soon.
            </InfoTile>
          </div>
          <div className="md:col-span-6">
            <InfoTile title="Increase time when…" icon={<AlertTriangle size={18} />} accent="warning">
              Rain/snow, spray, darkness, glare, fatigue, or when following large vehicles.
            </InfoTile>
          </div>
          <div className="md:col-span-7">
            <InfoTile title="Avoid &quot;wolf packs&quot;" icon={<Sparkles size={18} />} accent="cyan">
              Don&apos;t stay boxed in—use small legal speed changes and planned lane changes to create space.
            </InfoTile>
          </div>
          <div className="md:col-span-5">
            <SourceCard>
              Ontario Ministry of Transportation. Official MTO Driver&apos;s Handbook (Chapter 2): following distance and space cushions.
            </SourceCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MiniHudBadge label="Mini‑HUD" value="Exit plan: early" icon={<MoveRight size={18} />} />
        <ProTipBubble title="Check the Dash">
          Don&apos;t brake hard in the travel lane—get into the deceleration lane first.
        </ProTipBubble>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <InfoTile title="Exit sequence" icon={<CheckCircle2 size={18} />} accent="mint">
            Plan early → signal → mirror + shoulder check → enter exit lane → slow down in the deceleration lane.
          </InfoTile>
        </div>
        <div className="md:col-span-5">
          <InfoTile title="Missed exit?" icon={<AlertTriangle size={18} />} accent="warning">
            Go to the next exit and reroute. Never stop, reverse, or back up on the expressway or ramp.
          </InfoTile>
        </div>
        <div className="md:col-span-12">
          <SourceCard>
            Ontario Ministry of Transportation. Official MTO Driver&apos;s Handbook (Chapter 2): expressway exits and deceleration lanes.
          </SourceCard>
        </div>
      </div>
    </div>
  );
}
