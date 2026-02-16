"use client";

import { MapPin } from "lucide-react";
import type { DrivingCentre } from "@/data/drivingCentres";

interface CentreCardProps {
  centre: DrivingCentre;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Card for one driving centre in the sidebar list.
 * Shows centre name and address; click to select and show details.
 */
export default function CentreCard({
  centre,
  isSelected,
  onSelect,
}: CentreCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
        isSelected
          ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/30"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-700">
          <MapPin
            className="h-4 w-4 text-zinc-600 dark:text-zinc-300"
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {centre.name}
          </p>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {centre.address}
          </p>
          <span className="mt-2 inline-block rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300">
            {centre.testType}
          </span>
        </div>
      </div>
    </button>
  );
}
