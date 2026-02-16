"use client";

import { MapPin, AlertTriangle, ExternalLink } from "lucide-react";
import type { DrivingCentre } from "@/data/drivingCentres";

interface RouteDetailsProps {
  centre: DrivingCentre;
}

function getDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Right-hand view: compact header, one large map (updates with selected centre), key watch-outs and route links below.
 */
export default function RouteDetails({ centre }: RouteDetailsProps) {
  return (
    <div className="flex flex-col">
      {/* Compact header: name, address, Get Directions */}
      <header className="flex-shrink-0 border-b border-zinc-200 pb-4 dark:border-zinc-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {centre.name}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {centre.address}
            </p>
          </div>
          <a
            href={getDirectionsUrl(centre.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            Get Directions
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </header>

      {/* One big map — shows selected centre; key ensures it updates when centre changes */}
      <div className="relative my-4 min-h-[360px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 sm:min-h-[480px]">
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
            <MapPin className="h-12 w-12 text-amber-500 dark:text-amber-400" aria-hidden />
            <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {centre.address}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Map placeholder — add mapEmbedUrl in data for live map
            </p>
          </div>
        )}
      </div>

      {/* Route links + Key watch-outs below the map */}
      <div className="mt-4 flex-shrink-0 space-y-4">
        {(centre.mapEmbedUrlG2 || centre.mapEmbedUrlG) && (
          <div className="flex flex-wrap gap-3 text-sm">
            {centre.mapEmbedUrlG2 && (
              <a
                href={centre.mapEmbedUrlG2.replace("?output=embed", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                View G2 route in Google Maps
              </a>
            )}
            {centre.mapEmbedUrlG && (
              <a
                href={centre.mapEmbedUrlG.replace("?output=embed", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                View G route in Google Maps
              </a>
            )}
          </div>
        )}

        <section aria-label="Key watch-outs">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Key watch-outs
          </h2>
          <ul className="space-y-1.5">
            {centre.checkpoints.map((checkpoint, index) => (
              <li
                key={index}
                className="flex gap-2 rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-3 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  {index + 1}
                </span>
                {checkpoint}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
