"use client";

import React, { useId, useState } from "react";

type CarView = "front" | "left" | "rear" | "top";

type HotspotKey =
  | "mirrors"
  | "headlights"
  | "tires"
  | "windshield"
  | "rearLights";

/** Short label for hover/focus chip above each marker. */
const HOTSPOT_HOVER_LABEL: Record<HotspotKey, string> = {
  mirrors: "Mirror",
  headlights: "Headlight",
  tires: "Tire",
  windshield: "Glass",
  rearLights: "Rear light",
};

const HOTSPOT_COPY: Record<HotspotKey, { title: string; hint: string }> = {
  mirrors: {
    title: "Mirrors",
    hint: "Check housings are secure; set after your seat so you see lanes and minimize blind spots.",
  },
  headlights: {
    title: "Headlights",
    hint: "Confirm they work and lenses are clean—you need to see and be seen in low light.",
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
    hint: "Tail and brake lamps help others judge your position—burnt bulbs are easy to miss.",
  },
};

const VIEWS: { id: CarView; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "left", label: "Left side" },
  { id: "rear", label: "Rear" },
  { id: "top", label: "Top" },
];

/**
 * Percent of the visible (cropped) quadrant — 0–100.
 * Keep markers small; `round: true` = circle; false = soft rounded box (e.g. glass).
 */
type Region = {
  left: number;
  top: number;
  width: number;
  height: number;
  round?: boolean;
};

type ViewConfig = {
  /** 2×2 sprite: one quadrant fills the frame; no stretching. */
  crop: {
    backgroundSize: string;
    backgroundPosition: string;
  };
  alt: string;
  hotspots: Partial<Record<HotspotKey, Region[]>>;
};

const SPRITE_SRC = "/g2-car-explorer/car-views-sprite.png";

const VIEW_CONFIG: Record<CarView, ViewConfig> = {
  front: {
    crop: {
      backgroundSize: "200% 200%",
      backgroundPosition: "0% 0%",
    },
    alt: "Front view of the same car for a walk-around check",
    hotspots: {
      windshield: [{ left: 40, top: 21, width: 20, height: 7, round: false }],
      headlights: [
        { left: 17, top: 37, width: 6, height: 6, round: true },
        { left: 77, top: 37, width: 6, height: 6, round: true },
      ],
      mirrors: [
        { left: 4, top: 29, width: 5, height: 5, round: true },
        { left: 91, top: 29, width: 5, height: 5, round: true },
      ],
      tires: [
        { left: 18, top: 73, width: 7, height: 7, round: true },
        { left: 75, top: 73, width: 7, height: 7, round: true },
      ],
    },
  },
  left: {
    crop: {
      backgroundSize: "200% 200%",
      backgroundPosition: "100% 0%",
    },
    alt: "Left side view of the same car for a walk-around check",
    hotspots: {
      windshield: [{ left: 33, top: 24, width: 13, height: 9, round: false }],
      headlights: [{ left: 5, top: 39, width: 5, height: 5, round: true }],
      mirrors: [{ left: 27, top: 29, width: 5, height: 5, round: true }],
      rearLights: [{ left: 91, top: 37, width: 5, height: 5, round: true }],
      tires: [
        { left: 23, top: 66, width: 7, height: 7, round: true },
        { left: 70, top: 66, width: 7, height: 7, round: true },
      ],
    },
  },
  rear: {
    crop: {
      backgroundSize: "200% 200%",
      backgroundPosition: "0% 100%",
    },
    alt: "Rear view of the same car for a walk-around check",
    hotspots: {
      windshield: [{ left: 40, top: 21, width: 20, height: 7, round: false }],
      rearLights: [
        { left: 17, top: 44, width: 6, height: 6, round: true },
        { left: 77, top: 44, width: 6, height: 6, round: true },
      ],
      mirrors: [
        { left: 4, top: 27, width: 5, height: 5, round: true },
        { left: 91, top: 27, width: 5, height: 5, round: true },
      ],
      tires: [
        { left: 18, top: 79, width: 7, height: 7, round: true },
        { left: 75, top: 79, width: 7, height: 7, round: true },
      ],
    },
  },
  top: {
    crop: {
      backgroundSize: "200% 200%",
      backgroundPosition: "100% 100%",
    },
    alt: "Top-down view of the same car for a walk-around check",
    hotspots: {
      windshield: [
        { left: 31, top: 46, width: 10, height: 7, round: false },
        { left: 63, top: 46, width: 10, height: 7, round: false },
      ],
      headlights: [
        { left: 5, top: 23, width: 5, height: 5, round: true },
        { left: 5, top: 72, width: 5, height: 5, round: true },
      ],
      rearLights: [
        { left: 91, top: 24, width: 5, height: 5, round: true },
        { left: 91, top: 71, width: 5, height: 5, round: true },
      ],
      mirrors: [
        { left: 42, top: 8, width: 5, height: 5, round: true },
        { left: 42, top: 87, width: 5, height: 5, round: true },
      ],
      tires: [
        { left: 11, top: 28, width: 6, height: 6, round: true },
        { left: 11, top: 66, width: 6, height: 6, round: true },
        { left: 83, top: 28, width: 6, height: 6, round: true },
        { left: 83, top: 66, width: 6, height: 6, round: true },
      ],
    },
  },
};

function HotspotButtons({
  view,
  activeKey,
  onSelect,
}: {
  view: CarView;
  activeKey: HotspotKey | null;
  onSelect: (key: HotspotKey) => void;
}) {
  const defs = VIEW_CONFIG[view].hotspots;
  const nodes: React.ReactNode[] = [];

  (Object.keys(HOTSPOT_COPY) as HotspotKey[]).forEach((key) => {
    const regions = defs[key];
    if (!regions) return;
    regions.forEach((r, i) => {
      const isActive = activeKey === key;
      const isCircle = r.round !== false;
      const hoverLabel = HOTSPOT_HOVER_LABEL[key];
      nodes.push(
        <button
          key={`${key}-${i}`}
          type="button"
          className="group absolute z-[3] box-border border-0 bg-transparent p-0 outline-none transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--crimson-spark)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--midnight-indigo)]"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: `${r.width}%`,
            height: `${r.height}%`,
            pointerEvents: "auto",
          }}
          aria-label={HOTSPOT_COPY[key].title}
          aria-pressed={isActive}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(key);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(key);
            }
          }}
        >
          <span
            className={`relative flex h-full w-full items-center justify-center border shadow-sm transition-[box-shadow,background-color] duration-150 group-hover:shadow-[0_0_10px_rgba(0,245,255,0.55)] group-focus-visible:shadow-[0_0_10px_rgba(0,245,255,0.55)] ${
              isCircle ? "rounded-full" : "rounded-md"
            }`}
            style={{
              borderColor: "var(--electric-cyan)",
              borderWidth: isActive ? 2 : 1,
              backgroundColor: isActive
                ? "rgba(0,245,255,0.22)"
                : "rgba(0,245,255,0.08)",
              boxShadow: isActive
                ? "0 0 12px rgba(0,245,255,0.5)"
                : undefined,
            }}
          >
            <span
              className="pointer-events-none rounded-full bg-[var(--electric-cyan)] shadow-[0_0_4px_rgba(0,245,255,0.9)]"
              style={{
                width: "min(32%, 10px)",
                height: "min(32%, 10px)",
                minWidth: 3,
                minHeight: 3,
              }}
              aria-hidden
            />
          </span>
          <span
            className="pointer-events-none absolute bottom-full left-1/2 z-[5] mb-1 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-[11px]"
            style={{
              backgroundColor: "var(--void-purple)",
              color: "var(--electric-cyan)",
              border: "1px solid var(--midnight-indigo)",
            }}
          >
            {hoverLabel}
          </span>
        </button>,
      );
    });
  });

  return <>{nodes}</>;
}

function CarSpriteScene({
  view,
  activeKey,
  onSelect,
}: {
  view: CarView;
  activeKey: HotspotKey | null;
  onSelect: (key: HotspotKey) => void;
}) {
  const cfg = VIEW_CONFIG[view];
  const descId = useId();

  return (
    <figure className="relative m-0 w-full" aria-labelledby={descId}>
      <p
        id={descId}
        className="absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)] whitespace-nowrap"
      >
        {cfg.alt}
      </p>
      <div className="relative aspect-square w-full max-w-full rounded-md">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-md">
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${SPRITE_SRC})`,
              backgroundSize: cfg.crop.backgroundSize,
              backgroundPosition: cfg.crop.backgroundPosition,
              filter: "brightness(0.82) contrast(1.02)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[rgba(15,5,29,0.28)]"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 z-[2] overflow-visible">
          <HotspotButtons
            view={view}
            activeKey={activeKey}
            onSelect={onSelect}
          />
        </div>
      </div>
      <figcaption
        className="mt-2 text-center text-[10px] leading-snug sm:text-xs"
        style={{ color: "var(--lavender-mist)" }}
      >
        One vehicle, four angles. Composite image for learning only.
      </figcaption>
    </figure>
  );
}

/** Multi-view car explorer — single sprite sheet, CSS crop per tab. */
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
        Switch views, then tap highlighted zones—same items you walk through on a real
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
        <CarSpriteScene view={view} activeKey={active} onSelect={setActive} />
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
