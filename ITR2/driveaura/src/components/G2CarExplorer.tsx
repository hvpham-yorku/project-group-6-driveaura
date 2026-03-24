"use client";

import React, { useId, useState } from "react";

type CarView = "front" | "left" | "rear" | "top";

type HotspotKey =
  | "mirrors"
  | "headlights"
  | "tires"
  | "windshield"
  | "rearLights";

const HOTSPOT_COPY: Record<HotspotKey, { title: string; hint: string }> = {
  mirrors: {
    title: "Mirrors",
    hint: "Check housings are secure; set after your seat so you see lanes and minimize blind spots.",
  },
  headlights: {
    title: "Headlights",
    hint: "Confirm they work and lenses are cleanâ€”you need to see and be seen in low light.",
  },
  tires: {
    title: "Tires",
    hint: "Glance at tread, damage, and inflation; low or damaged tires affect control and braking.",
  },
  windshield: {
    title: "Windshield / glass",
    hint: "Clear snow, ice, and fog inside and out so nothing blocks your sight lines.",
  },
  rearLights: {
    title: "Rear lights",
    hint: "Tail and brake lamps help others judge your positionâ€”burnt bulbs are easy to miss.",
  },
};

const VIEWS: { id: CarView; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "left", label: "Left side" },
  { id: "rear", label: "Rear" },
  { id: "top", label: "Top" },
];

type HotspotShape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; rx?: number }
  | { kind: "circle"; cx: number; cy: number; r: number };

const HOTSPOTS: Record<
  CarView,
  Partial<Record<HotspotKey, HotspotShape[]>>
> = {
  front: {
    windshield: [{ kind: "rect", x: 118, y: 52, w: 164, h: 72, rx: 8 }],
    headlights: [
      { kind: "rect", x: 52, y: 128, w: 56, h: 40, rx: 12 },
      { kind: "rect", x: 292, y: 128, w: 56, h: 40, rx: 12 },
    ],
    tires: [
      { kind: "rect", x: 68, y: 178, w: 48, h: 52, rx: 8 },
      { kind: "rect", x: 284, y: 178, w: 48, h: 52, rx: 8 },
    ],
    mirrors: [
      { kind: "rect", x: 38, y: 78, w: 36, h: 28, rx: 6 },
      { kind: "rect", x: 326, y: 78, w: 36, h: 28, rx: 6 },
    ],
  },
  left: {
    windshield: [{ kind: "rect", x: 208, y: 58, w: 72, h: 56, rx: 6 }],
    headlights: [{ kind: "circle", cx: 272, cy: 132, r: 22 }],
    tires: [
      { kind: "circle", cx: 130, cy: 168, r: 32 },
      { kind: "circle", cx: 268, cy: 168, r: 32 },
    ],
    mirrors: [{ kind: "rect", x: 188, y: 72, w: 44, h: 32, rx: 6 }],
    rearLights: [{ kind: "rect", x: 64, y: 118, w: 28, h: 36, rx: 6 }],
  },
  rear: {
    windshield: [{ kind: "rect", x: 118, y: 56, w: 164, h: 68, rx: 8 }],
    rearLights: [
      { kind: "rect", x: 54, y: 132, w: 62, h: 42, rx: 10 },
      { kind: "rect", x: 284, y: 132, w: 62, h: 42, rx: 10 },
    ],
    tires: [
      { kind: "rect", x: 68, y: 176, w: 48, h: 52, rx: 8 },
      { kind: "rect", x: 284, y: 176, w: 48, h: 52, rx: 8 },
    ],
    mirrors: [
      { kind: "rect", x: 38, y: 88, w: 36, h: 26, rx: 6 },
      { kind: "rect", x: 326, y: 88, w: 36, h: 26, rx: 6 },
    ],
  },
  top: {
    windshield: [{ kind: "rect", x: 196, y: 72, w: 88, h: 52, rx: 10 }],
    headlights: [{ kind: "rect", x: 182, y: 40, w: 116, h: 28, rx: 8 }],
    rearLights: [{ kind: "rect", x: 182, y: 194, w: 116, h: 28, rx: 8 }],
    tires: [
      { kind: "circle", cx: 108, cy: 96, r: 26 },
      { kind: "circle", cx: 372, cy: 96, r: 26 },
      { kind: "circle", cx: 108, cy: 172, r: 26 },
      { kind: "circle", cx: 372, cy: 172, r: 26 },
    ],
    mirrors: [
      { kind: "rect", x: 62, y: 110, w: 44, h: 28, rx: 6 },
      { kind: "rect", x: 374, y: 110, w: 44, h: 28, rx: 6 },
    ],
  },
};

const SVG_VIEW = "0 0 400 240";

function HotspotLayer({
  view,
  activeKey,
  onSelect,
}: {
  view: CarView;
  activeKey: HotspotKey | null;
  onSelect: (key: HotspotKey) => void;
}) {
  const defs = HOTSPOTS[view];
  const nodes: React.ReactNode[] = [];

  (Object.keys(HOTSPOT_COPY) as HotspotKey[]).forEach((key) => {
    const shapes = defs[key];
    if (!shapes) return;
    const isActive = activeKey === key;
    shapes.forEach((s, i) => {
      const common = {
        className: "cursor-pointer transition-[stroke,fill-opacity] duration-150 outline-none focus-visible:stroke-[var(--crimson-spark)]",
        stroke: "var(--electric-cyan)",
        strokeWidth: isActive ? 2.5 : 1.5,
        fill: "rgba(0,245,255,0.12)",
        fillOpacity: isActive ? 0.45 : 0.2,
        onClick: () => onSelect(key),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(key);
          }
        },
        tabIndex: 0,
        role: "button" as const,
        "aria-label": HOTSPOT_COPY[key].title,
      };
      if (s.kind === "rect") {
        nodes.push(
          <rect
            key={`${key}-${i}`}
            {...common}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx={s.rx ?? 0}
          />,
        );
      } else {
        nodes.push(
          <circle key={`${key}-${i}`} {...common} cx={s.cx} cy={s.cy} r={s.r} />,
        );
      }
    });
  });

  return <g>{nodes}</g>;
}

function CarArtFront() {
  return (
    <g aria-hidden>
      <rect
        x={72}
        y={124}
        width={256}
        height={88}
        rx={20}
        fill="var(--midnight-indigo)"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <path
        d="M 112 124 L 140 56 L 260 56 L 288 124 Z"
        fill="var(--void-purple)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <ellipse
        cx={80}
        cy={148}
        rx={24}
        ry={16}
        fill="var(--ghost-white)"
        opacity={0.12}
      />
      <ellipse
        cx={320}
        cy={148}
        rx={24}
        ry={16}
        fill="var(--ghost-white)"
        opacity={0.12}
      />
      <rect
        x={168}
        y={138}
        width={64}
        height={8}
        rx={2}
        fill="var(--lavender-mist)"
        opacity={0.5}
      />
      <rect
        x={48}
        y={82}
        width={16}
        height={24}
        rx={4}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <rect
        x={336}
        y={82}
        width={16}
        height={24}
        rx={4}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <ellipse
        cx={88}
        cy={196}
        rx={22}
        ry={36}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={1.5}
      />
      <ellipse
        cx={312}
        cy={196}
        rx={22}
        ry={36}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={1.5}
      />
    </g>
  );
}

function CarArtLeft() {
  return (
    <g aria-hidden>
      <path
        d="M 88 168 L 100 92 L 120 68 L 248 68 L 280 92 L 312 168 Z"
        fill="var(--midnight-indigo)"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <path
        d="M 208 72 L 258 72 L 268 100 L 268 120 L 210 120 Z"
        fill="var(--void-purple)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <rect
        x={186}
        y={78}
        width={22}
        height={20}
        rx={4}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <circle
        cx={130}
        cy={168}
        r={34}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <circle
        cx={268}
        cy={168}
        r={34}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <circle
        cx={268}
        cy={132}
        r={14}
        fill="rgba(245,245,247,0.35)"
        stroke="var(--ghost-white)"
        strokeWidth={1.5}
      />
      <rect
        x={76}
        y={114}
        width={20}
        height={28}
        rx={4}
        fill="rgba(255,59,63,0.35)"
        stroke="var(--crimson-spark)"
        strokeWidth={1.5}
      />
    </g>
  );
}

function CarArtRear() {
  return (
    <g aria-hidden>
      <rect
        x={72}
        y={120}
        width={256}
        height={92}
        rx={22}
        fill="var(--midnight-indigo)"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <path
        d="M 112 120 L 140 52 L 260 52 L 288 120 Z"
        fill="var(--void-purple)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <rect
        x={152}
        y={134}
        width={96}
        height={6}
        rx={2}
        fill="var(--lavender-mist)"
        opacity={0.45}
      />
      <rect
        x={52}
        y={132}
        width={56}
        height={38}
        rx={10}
        fill="rgba(255,59,63,0.25)"
        stroke="var(--crimson-spark)"
        strokeWidth={1.5}
      />
      <rect
        x={292}
        y={132}
        width={56}
        height={38}
        rx={10}
        fill="rgba(255,59,63,0.25)"
        stroke="var(--crimson-spark)"
        strokeWidth={1.5}
      />
      <rect
        x={56}
        y={88}
        width={18}
        height={26}
        rx={4}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <rect
        x={326}
        y={88}
        width={18}
        height={26}
        rx={4}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <ellipse
        cx={88}
        cy={198}
        rx={22}
        ry={34}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={1.5}
      />
      <ellipse
        cx={312}
        cy={198}
        rx={22}
        ry={34}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={1.5}
      />
    </g>
  );
}

function CarArtTop() {
  return (
    <g aria-hidden>
      <rect
        x={118}
        y={88}
        width={164}
        height={84}
        rx={20}
        fill="var(--midnight-indigo)"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <rect
        x={196}
        y={72}
        width={88}
        height={52}
        rx={10}
        fill="var(--void-purple)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <rect
        x={182}
        y={40}
        width={116}
        height={28}
        rx={8}
        fill="rgba(245,245,247,0.15)"
        stroke="var(--ghost-white)"
        strokeWidth={1.5}
      />
      <rect
        x={182}
        y={194}
        width={116}
        height={28}
        rx={8}
        fill="rgba(255,59,63,0.2)"
        stroke="var(--crimson-spark)"
        strokeWidth={1.5}
      />
      <rect
        x={62}
        y={110}
        width={44}
        height={28}
        rx={6}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <rect
        x={374}
        y={110}
        width={44}
        height={28}
        rx={6}
        fill="var(--midnight-indigo)"
        stroke="var(--lavender-mist)"
        strokeWidth={1.5}
      />
      <circle
        cx={108}
        cy={96}
        r={26}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <circle
        cx={372}
        cy={96}
        r={26}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <circle
        cx={108}
        cy={172}
        r={26}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
      <circle
        cx={372}
        cy={172}
        r={26}
        fill="#1a1330"
        stroke="var(--ghost-white)"
        strokeWidth={2}
      />
    </g>
  );
}

function CarScene({
  view,
  activeKey,
  onSelect,
}: {
  view: CarView;
  activeKey: HotspotKey | null;
  onSelect: (key: HotspotKey) => void;
}) {
  const titleId = useId();
  return (
    <svg
      viewBox={SVG_VIEW}
      className="h-auto w-full max-h-[280px]"
      fill="none"
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>
        Generic car â€” {VIEWS.find((v) => v.id === view)?.label} view with tappable areas
      </title>
      {view === "front" && <CarArtFront />}
      {view === "left" && <CarArtLeft />}
      {view === "rear" && <CarArtRear />}
      {view === "top" && <CarArtTop />}
      <HotspotLayer view={view} activeKey={activeKey} onSelect={onSelect} />
    </svg>
  );
}

/** Lightweight multi-view car diagram with hotspot labels for G2 pre-drive. */
export function G2CarExplorer() {
  const [view, setView] = useState<CarView>("front");
  const [active, setActive] = useState<HotspotKey | null>(null);

  const hint = active ? HOTSPOT_COPY[active] : null;

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "var(--midnight-indigo)",
        backgroundColor: "var(--void-purple)",
      }}
    >
      <h3
        className="mb-1 text-base font-semibold"
        style={{ color: "var(--ghost-white)" }}
      >
        Quick outside check (explore)
      </h3>
      <p
        className="mb-3 text-xs leading-relaxed sm:text-sm"
        style={{ color: "var(--lavender-mist)" }}
      >
        Switch views, then tap highlighted zonesâ€”same items you walk through on a real
        pre-drive, from different angles.
      </p>

      <div
        className="mb-3 flex flex-wrap gap-1.5 rounded-lg border p-1"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
        role="tablist"
        aria-label="Car view angle"
      >
        {VIEWS.map(({ id, label }) => {
          const isOn = view === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isOn}
              className="min-h-9 flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium sm:text-sm"
              style={{
                backgroundColor: isOn ? "var(--void-purple)" : "transparent",
                color: isOn ? "var(--electric-cyan)" : "var(--lavender-mist)",
                border: isOn ? "1px solid var(--electric-cyan)" : "1px solid transparent",
                boxShadow: isOn ? "0 0 12px rgba(0,245,255,0.15)" : undefined,
              }}
              onClick={() => {
                setView(id);
                setActive(null);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        className="rounded-lg border p-2 sm:p-3"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <CarScene view={view} activeKey={active} onSelect={setActive} />
      </div>

      <div
        className="mt-3 min-h-[4.5rem] rounded-md border px-3 py-2"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: hint
            ? "var(--midnight-indigo)"
            : "rgba(28, 17, 50, 0.5)",
        }}
        aria-live="polite"
      >
        {hint ? (
          <>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--electric-cyan)" }}
            >
              {hint.title}
            </p>
            <p
              className="mt-1 text-xs leading-relaxed sm:text-sm"
              style={{ color: "var(--lavender-mist)" }}
            >
              {hint.hint}
            </p>
          </>
        ) : (
          <p className="text-xs sm:text-sm" style={{ color: "var(--lavender-mist)" }}>
            Tap a cyan outline to read a short note for that area.
          </p>
        )}
      </div>
    </div>
  );
}
