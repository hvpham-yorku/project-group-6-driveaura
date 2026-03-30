"use client";

/**
 * Test Centres Page — Driving test centres on the left; one large map on the right.
 * Clicking a centre updates the map to that centre’s location. Stacks vertically on mobile.
 */

import { useState, useMemo } from "react";
import { MapPin, Search } from "lucide-react";
import { drivingCentres } from "@/data/drivingCentres";
import type { DrivingCentre } from "@/data/drivingCentres";
import CentreCard from "@/components/test-centres/CentreCard";
import TestCentreDetails from "@/components/test-centres/TestCentreDetails";

export default function TestCentresPage() {
  const [selectedCentre, setSelectedCentre] = useState<DrivingCentre | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCentres = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return drivingCentres;
    return drivingCentres.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-void-purple">
      {/* Master-detail: flex on desktop, stack on mobile */}
      <div className="flex flex-col lg:flex-row lg:min-h-[calc(100vh-4rem)]">
        {/* Left: centres list (order-1 on desktop so it stays left) */}
        <aside className="w-full flex-shrink-0 border-b border-r border-electric-cyan/20 bg-midnight-indigo p-4 lg:w-[380px] lg:min-w-[320px] lg:border-b-0">
          <h2 className="mb-3 text-base font-semibold text-ghost-white">
            Driving test centres
          </h2>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lavender-mist"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-lavender-mist/30 bg-void-purple/60 py-2.5 pl-9 pr-3 text-sm text-ghost-white placeholder:text-lavender-mist focus:border-electric-cyan focus:outline-none focus:ring-2 focus:ring-electric-cyan/30"
              aria-label="Search driving centres"
            />
          </div>
          <ul className="space-y-2">
            {filteredCentres.length === 0 ? (
              <li className="py-4 text-center text-sm text-lavender-mist">
                No centres match your search.
              </li>
            ) : (
              filteredCentres.map((centre) => (
                <li key={centre.id}>
                  <CentreCard
                    centre={centre}
                    isSelected={selectedCentre?.id === centre.id}
                    onSelect={() => setSelectedCentre(centre)}
                  />
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Right: one big map — shows selected centre’s map; scrollable details below */}
        <main className="flex min-w-0 flex-1 flex-col overflow-auto p-4 lg:p-6" aria-label="Map and centre details">
          {!selectedCentre ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MapPin className="mb-3 h-12 w-12 text-lavender-mist/60" />
              <p className="text-base text-lavender-mist">
                Select a driving test centre on the left to see its map.
              </p>
            </div>
          ) : (
            <TestCentreDetails centre={selectedCentre} />
          )}
        </main>
      </div>
    </div>
  );
}
