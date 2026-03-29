"use client";

import { MapPin, ExternalLink } from "lucide-react";
import type { DrivingCentre } from "@/data/drivingCentres";

interface TestCentreDetailsProps {
  centre: DrivingCentre;
}

function getDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Right-hand view: compact header, one large map (updates with selected centre), key watch-outs below.
 */
export default function TestCentreDetails({ centre }: TestCentreDetailsProps) {
  return (
    <div className="flex flex-col">
      {/* Compact header: name, address, Get Directions — Crimson Spark main button */}
      <header className="flex-shrink-0 border-b border-[#00F5FF]/20 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#F5F5F7]">
              {centre.name}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#B8B0D3]">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {centre.address}
            </p>
          </div>
          <a
            href={getDirectionsUrl(centre.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#FF3B3F] px-3 py-2 text-sm font-medium text-[#F5F5F7] transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF3B3F] focus:ring-offset-2 focus:ring-offset-[#0F051D]"
          >
            Get Directions
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </header>

      {/* One big map — Electric Cyan active border */}
      <div className="relative my-4 min-h-[360px] overflow-hidden rounded-xl border-2 border-[#00F5FF]/30 bg-[#1C1132] sm:min-h-[480px]">
        {centre.mapEmbedUrl ? (
          <iframe
            key={centre.id}
            src={centre.mapEmbedUrl}
            title={`Map for ${centre.name}`}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center">
            <MapPin className="h-12 w-12 text-[#00F5FF]" aria-hidden />
            <p className="mt-2 text-sm font-medium text-[#F5F5F7]">
              {centre.address}
            </p>
            <p className="mt-0.5 text-xs text-[#B8B0D3]">
              Map placeholder — add mapEmbedUrl in data for live map
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
