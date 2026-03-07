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
      className={`w-full rounded-xl border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F5FF] focus:ring-offset-2 focus:ring-offset-[#0F051D] ${
        isSelected
          ? "border-[#00F5FF] bg-[#1C1132] shadow-[0_0_12px_rgba(0,245,255,0.2)]"
          : "border-[#B8B0D3]/20 bg-[#1C1132] hover:border-[#B8B0D3]/40 hover:bg-[#0F051D]/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-[#0F051D]/60 p-2">
          <MapPin
            className="h-4 w-4 text-[#00F5FF]"
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#F5F5F7]">
            {centre.name}
          </p>
          <p className="mt-0.5 text-sm text-[#B8B0D3]">
            {centre.address}
          </p>
          <span className="mt-2 inline-block rounded-full bg-[#0F051D]/80 px-2 py-0.5 text-xs font-medium text-[#B8B0D3]">
            {centre.testType}
          </span>
        </div>
      </div>
    </button>
  );
}
