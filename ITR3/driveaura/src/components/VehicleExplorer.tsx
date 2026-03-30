"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { G2CarExplorer } from "./G2CarExplorer";
import {
  INSTRUMENT_HOTSPOTS,
  CENTER_CONSOLE_HOTSPOTS,
  type InstrumentHotspot,
  type CenterConsoleHotspot,
} from "@/lib/vehicleHotspots";

type ViewMode = "CABIN" | "DASHBOARD" | "SPEEDOMETER" | "CENTER_CONSOLE";

const CABIN_IMAGE_SRC = "/images/vehicle-explorer-cabin.png";
const INSTRUMENT_CLUSTER_SRC = "/images/car-instrument-cluster.png";
const CENTER_CONSOLE_SRC = "/images/car-center-console.png";

function InteriorExplorer() {
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

      {/* Center console hotspot */}
      <Hotspot
        top="60%"
        left="50%"
        label="Center Console"
        onClick={() => onSelectView("CENTER_CONSOLE")}
      />
    </div>
  );
}

function DetailView({ view }: { view: ViewMode }) {
  if (view === "SPEEDOMETER") {
    return <SpeedometerDetailView />;
  }
  if (view === "CENTER_CONSOLE") {
    return <CenterConsoleDetailView />;
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

function CenterConsoleDetailView() {
  const [activeHotspot, setActiveHotspot] = useState<CenterConsoleHotspot | null>(null);
  const openModal = useCallback((hotspot: CenterConsoleHotspot) => setActiveHotspot(hotspot), []);
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
            src={CENTER_CONSOLE_SRC}
            alt="Car center console showing hazard lights, climate control, defrost controls, and parking brake"
            className="block h-auto w-full select-none"
            draggable={false}
          />
          {CENTER_CONSOLE_HOTSPOTS.map((hotspot) => (
            <CenterConsoleHotspotButton
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
        Click a highlighted area to learn about that control on the center console.
      </p>

      {activeHotspot && (
        <CenterConsoleModal
          hotspot={activeHotspot}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function CenterConsoleHotspotButton({
  hotspot,
  onActivate,
}: {
  hotspot: CenterConsoleHotspot;
  onActivate: (h: CenterConsoleHotspot) => void;
}) {
  const sizePct = hotspot.size;
  const left = hotspot.centerX - sizePct / 2;
  const top = hotspot.centerY - sizePct / 2;

  return (
    <button
      type="button"
      onClick={() => onActivate(hotspot)}
      className="absolute rounded-full transition-all duration-200 hover:ring-4 focus:outline-none focus:ring-4 focus:ring-[var(--electric-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--void-purple)]"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${sizePct}%`,
        aspectRatio: "1/1",
      }}
      aria-label={hotspot.label}
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-[rgba(0,245,255,0.5)] bg-[rgba(0,245,255,0.12)] opacity-0 transition-opacity duration-200 hover:opacity-100 focus:opacity-100"
        aria-hidden
      />
      <span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--electric-cyan)] opacity-80 ring-2 ring-[rgba(0,245,255,0.6)]"
        aria-hidden
      />
    </button>
  );
}

function CenterConsoleModal({
  hotspot,
  onClose,
}: {
  hotspot: CenterConsoleHotspot;
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

  return (
    <button
      type="button"
      onClick={() => onActivate(hotspot)}
      className="absolute rounded-full transition-all duration-200 hover:ring-4 focus:outline-none focus:ring-4 focus:ring-[var(--electric-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--void-purple)]"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${sizePct}%`,
        aspectRatio: "1/1",
      }}
      aria-label={hotspot.label}
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-[rgba(0,245,255,0.5)] bg-[rgba(0,245,255,0.12)] opacity-0 transition-opacity duration-200 hover:opacity-100 focus:opacity-100"
        aria-hidden
      />
      <span
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--electric-cyan)] opacity-80 ring-2 ring-[rgba(0,245,255,0.6)]"
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

/**
 * VehicleExplorer — unified component replacing the separate G2CarExplorer.
 * Use mode="interior" (default) for cabin/dashboard/instrument cluster/center console.
 * Use mode="exterior" for the walk-around exterior hotspot view.
 */
export function VehicleExplorer({ mode = "interior" }: { mode?: "interior" | "exterior" }) {
  if (mode === "exterior") return <G2CarExplorer />;
  return <InteriorExplorer />;
}

export default VehicleExplorer;
