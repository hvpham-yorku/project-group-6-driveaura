"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

type ViewMode = "CABIN" | "DASHBOARD" | "SPEEDOMETER";

const CABIN_IMAGE_SRC = "/images/vehicle-explorer-cabin.png";
const INSTRUMENT_CLUSTER_SRC = "/images/car-instrument-cluster.png";

/** Hotspot content for instrument cluster detail view */
interface InstrumentHotspot {
  id: string;
  label: string;
  /** Center X as percentage (0–100) */
  centerX: number;
  /** Center Y as percentage (0–100) */
  centerY: number;
  /** Size as percentage of image width (for circular hit area) */
  size: number;
  title: string;
  bullets: string[];
}

const INSTRUMENT_HOTSPOTS: InstrumentHotspot[] = [
  {
    id: "left-gauge",
    label: "Left gauge (RPM, oil pressure, check engine)",
    centerX: 37,
    centerY: 54,
    size: 16, // r=8 → diameter 16%
    title: "Left Gauge – RPM, Oil Pressure & Check Engine",
    bullets: [
      "Tachometer shows engine speed (RPM); avoid redlining to protect the engine.",
      "Red oil can light means low oil pressure—pull over safely and turn off the engine.",
      "Check Engine light indicates an emissions or engine fault; get the vehicle checked soon.",
    ],
  },
  {
    id: "center-gauge",
    label: "Speedometer",
    centerX: 50,
    centerY: 52,
    size: 20, // r=10 → diameter 20%
    title: "Speedometer",
    bullets: [
      "Shows your current speed in km/h (and often mph); always stay within the posted limit.",
      "Use it to maintain a steady speed on highways and in school zones.",
    ],
  },
  {
    id: "right-gauge",
    label: "Right gauge (fuel, temp, battery, parking brake)",
    centerX: 63,
    centerY: 54,
    size: 16, // r=8 → diameter 16%
    title: "Right Gauge – Fuel, Temp, Battery & Parking Brake",
    bullets: [
      "Fuel gauge shows remaining fuel; temperature gauge should stay in the normal range.",
      "Red battery light means charging problem; red parking brake light means the brake is on.",
    ],
  },
  {
    id: "left-stalk",
    label: "Left stalk (turn signals, lights)",
    centerX: 22,
    centerY: 74,
    size: 12, // r=6 → diameter 12%
    title: "Left Stalk – Turn Signals & Lights",
    bullets: [
      "Move the stalk up for right turn signal, down for left; cancel after the turn.",
      "Twist the end to turn on parking lights, headlights, and high beams as needed.",
    ],
  },
  {
    id: "right-stalk",
    label: "Right stalk (wipers)",
    centerX: 78,
    centerY: 74,
    size: 12, // r=6 → diameter 12%
    title: "Right Stalk – Wipers",
    bullets: [
      "Use OFF, INT (intermittent), LO, and HI for front wipers in rain or snow.",
      "The end of the stalk often controls rear wiper and washer fluid.",
    ],
  },
];

export function VehicleExplorer() {
  const [view, setView] = useState<ViewMode>("CABIN");

  const isDetailView = view !== "CABIN";

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--void-purple)" }}
      aria-label="Vehicle Explorer drill-down"
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <header className="mb-4 sm:mb-6">
          <h2
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--ghost-white)" }}
          >
            Vehicle Explorer – Interior Drill-Down
          </h2>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--lavender-mist)" }}
          >
            Start from the full cabin view and click into key zones like the
            speedometer and centre console to see more detail. This mirrors how
            an examiner may ask you to identify and use specific controls during
            the G2 road test.
          </p>
        </header>

        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            borderColor: "var(--midnight-indigo)",
            backgroundColor: "var(--midnight-indigo)",
          }}
        >
          {/* Return button visible only on detail views */}
          {isDetailView && (
            <div className="pointer-events-none absolute left-3 top-3 z-20 sm:left-4 sm:top-4">
              <button
                type="button"
                onClick={() => setView("CABIN")}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-transform duration-200 hover:scale-105"
                style={{
                  backgroundColor: "rgba(15,5,29,0.9)",
                  borderColor: "var(--electric-cyan)",
                  color: "var(--electric-cyan)",
                }}
              >
                <span aria-hidden>←</span>
                <span>Return to Main Cabin</span>
              </button>
            </div>
          )}

          <div
            className={[
              "relative w-full transition-all duration-300 ease-out",
              isDetailView ? "bg-[rgba(15,5,29,0.92)] backdrop-blur-md" : "",
            ].join(" ")}
          >
            {view === "CABIN" ? (
              <CabinView onSelectView={setView} />
            ) : (
              <DetailView view={view} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CabinView({
  onSelectView,
}: {
  onSelectView: (view: ViewMode) => void;
}) {
  return (
    <div className="relative">
      <Image
        src={CABIN_IMAGE_SRC}
        alt="Vehicle interior cabin view showing steering wheel, speedometer, and centre console"
        width={1200}
        height={800}
        priority
        className="h-auto w-full select-none"
      />

      {/* Speedometer hotspot */}
      <Hotspot
        top="45%"
        left="29%"
        label="Speedometer"
        onClick={() => onSelectView("SPEEDOMETER")}
      />

      {/* Dashboard / console hotspot */}
      <Hotspot
        top="47%"
        left="50%"
        label="Dashboard and Console"
        onClick={() => onSelectView("DASHBOARD")}
      />
    </div>
  );
}

function DetailView({ view }: { view: ViewMode }) {
  if (view === "SPEEDOMETER") {
    return <SpeedometerDetailView />;
  }
  const src =
    "https://placehold.co/800x400/1C1132/00F5FF?text=Control+Panel+Detail+View";
  return (
    <div className="flex min-h-[260px] items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all duration-300"
        style={{
          borderColor: "rgba(0,245,255,0.45)",
          backgroundColor: "rgba(15,5,29,0.9)",
        }}
      >
        <div className="relative">
          <img src={src} alt="Control panel detail placeholder" className="h-auto w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(15,5,29,0.75)] via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function SpeedometerDetailView() {
  const [activeHotspot, setActiveHotspot] = useState<InstrumentHotspot | null>(null);
  const openModal = useCallback((hotspot: InstrumentHotspot) => setActiveHotspot(hotspot), []);
  const closeModal = useCallback(() => setActiveHotspot(null), []);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <div
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border shadow-[0_0_30px_rgba(0,245,255,0.2)] transition-all duration-300"
        style={{
          borderColor: "rgba(0,245,255,0.45)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        {/* Responsive container: aspect ratio keeps hotspot % aligned with image */}
        <div className="relative w-full">
          <img
            src={INSTRUMENT_CLUSTER_SRC}
            alt="Car instrument cluster showing gauges and control stalks"
            className="block h-auto w-full select-none"
            draggable={false}
          />
          {INSTRUMENT_HOTSPOTS.map((hotspot) => (
            <InstrumentHotspotButton
              key={hotspot.id}
              hotspot={hotspot}
              onActivate={openModal}
            />
          ))}
        </div>
      </div>

      <p
        className="mt-3 text-center text-sm"
        style={{ color: "var(--lavender-mist)" }}
      >
        Click a highlighted area to learn about that part of the instrument cluster.
      </p>

      {activeHotspot && (
        <InstrumentModal
          hotspot={activeHotspot}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function InstrumentHotspotButton({
  hotspot,
  onActivate,
}: {
  hotspot: InstrumentHotspot;
  onActivate: (h: InstrumentHotspot) => void;
}) {
  const sizePct = hotspot.size;
  const left = hotspot.centerX - sizePct / 2;
  const top = hotspot.centerY - sizePct / 2;
  const circleSizePx = 28;
  return (
    <button
      type="button"
      onClick={() => onActivate(hotspot)}
      className="absolute cursor-pointer rounded-full !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 active:!outline-none active:!ring-0"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${sizePct}%`,
        aspectRatio: "1/1",
        outline: "none",
        boxShadow: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      aria-label={hotspot.label}
    >
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--electric-cyan)] bg-[rgba(0,245,255,0.12)] pointer-events-none"
        style={{
          width: circleSizePx,
          height: circleSizePx,
        }}
        aria-hidden
      />
    </button>
  );
}

function InstrumentModal({
  hotspot,
  onClose,
}: {
  hotspot: InstrumentHotspot;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${hotspot.id}`}
      aria-describedby={`modal-desc-${hotspot.id}`}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-[var(--void-purple)]/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-[0_0_30px_rgba(0,245,255,0.2)]"
        style={{
          borderColor: "var(--electric-cyan)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <div className="border-b px-4 py-3 sm:px-5 sm:py-4" style={{ borderColor: "var(--midnight-indigo)" }}>
          <h3
            id={`modal-title-${hotspot.id}`}
            className="text-lg font-bold"
            style={{ color: "var(--ghost-white)" }}
          >
            {hotspot.title}
          </h3>
        </div>
        <div
          id={`modal-desc-${hotspot.id}`}
          className="px-4 py-3 sm:px-5 sm:py-4"
          style={{ color: "var(--lavender-mist)" }}
        >
          <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed">
            {hotspot.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end border-t px-4 py-3 sm:px-5" style={{ borderColor: "var(--midnight-indigo)" }}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--electric-cyan)]"
            style={{
              borderColor: "var(--electric-cyan)",
              color: "var(--electric-cyan)",
              backgroundColor: "transparent",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Hotspot({
  top,
  left,
  label,
  onClick,
}: {
  top: string;
  left: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
      style={{ top, left }}
      aria-label={label}
    >
      <span
        className="absolute inset-0 rounded-full opacity-70 animate-ping"
        style={{ backgroundColor: "rgba(0,245,255,0.4)" }}
        aria-hidden
      />
      <span
        className="relative block h-4 w-4 rounded-full ring-2 ring-[rgba(0,245,255,0.85)] transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: "var(--electric-cyan)" }}
        aria-hidden
      />
    </button>
  );
}

export default VehicleExplorer;
