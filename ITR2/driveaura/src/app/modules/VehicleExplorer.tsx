"use client";

import Image from "next/image";
import { useState } from "react";

type ViewMode = "CABIN" | "DASHBOARD" | "SPEEDOMETER";

const CABIN_IMAGE_SRC = "/images/vehicle-explorer-cabin.png";

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
  const isSpeedometer = view === "SPEEDOMETER";
  const src = isSpeedometer
    ? "https://placehold.co/800x400/1C1132/00F5FF?text=Speedometer+Detail+View"
    : "https://placehold.co/800x400/1C1132/00F5FF?text=Control+Panel+Detail+View";
  const alt = isSpeedometer
    ? "Speedometer detail placeholder"
    : "Control panel detail placeholder";

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
          <img
            src={src}
            alt={alt}
            className="h-auto w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(15,5,29,0.75)] via-transparent to-transparent" />
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
