"use client";

/**
 * Routes Page — Test Routes feature for DriveAura.
 * Shows a list of drive test centres (locations) on the left.
 * When you click a location, the right side shows its name, address,
 * a G2/G route type toggle, and a placeholder for a map.
 */

import { useState, useMemo } from "react";
import { MapPin, Search } from "lucide-react";

// --- Data ---
// List of Ontario drive test centres we show in the sidebar.
// Each has: id (for React keys and state), name (display), address (display).
const TEST_CENTRES = [
  { id: "downsview", name: "Downsview", address: "37 Carl Hall Rd" },
] as const;

// TypeScript type: the id of any centre in the list (e.g. "downsview").
// Used so we only store valid centre ids in state.
type TestCentreId = (typeof TEST_CENTRES)[number]["id"];

export default function RoutesPage() {
  // --- State ---
  // Which location is selected in the sidebar. null = none selected yet.
  const [activeLocationId, setActiveLocationId] = useState<TestCentreId | null>(
    null
  );
  // What the user typed in the search box. Filters the list of locations.
  const [searchQuery, setSearchQuery] = useState("");
  // Which route type is selected: "G2" or "G". Shown as two toggle options.
  const [routeType, setRouteType] = useState<"G2" | "G">("G2");

  // --- Derived data ---
  // List of centres to show in the sidebar. If search is empty, show all;
  // otherwise only show centres whose name or address contains the search text.
  const filteredCentres = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [...TEST_CENTRES];
    return TEST_CENTRES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // The full centre object for the selected location, or null if none selected.
  // We use this to show name, address, etc. on the right side.
  const activeCentre = activeLocationId
    ? TEST_CENTRES.find((c) => c.id === activeLocationId)
    : null;

  // --- Layout ---
  // Two columns: left sidebar (30% width), main content (70% width).
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-100 dark:bg-zinc-900">
      {/* --- Left sidebar: list of locations (30%) --- */}
      <aside className="w-[30%] min-w-[220px] border-r border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="mb-3 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Locations
        </h2>
        {/* Search box: typing here filters the list by name or address */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-zinc-300 py-2 pl-8 pr-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          />
        </div>
        {/* List of location buttons. Clicking one sets it as "active" and shows details on the right */}
        <ul className="space-y-1">
          {filteredCentres.length === 0 ? (
            <li className="py-2 text-sm text-zinc-500">No locations found.</li>
          ) : (
            filteredCentres.map((centre) => (
              <li key={centre.id}>
                <button
                  type="button"
                  onClick={() => setActiveLocationId(centre.id)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-2.5 text-left text-sm ${
                    activeLocationId === centre.id
                      ? "bg-amber-100 font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-200"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-zinc-500" />
                  {centre.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* --- Right side: details for the selected location (70%) --- */}
      <main className="flex-1 overflow-auto p-6">
        {!activeCentre ? (
          /* No location selected yet: show a short message and icon */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="mb-3 h-10 w-10 text-zinc-400" />
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Click a location on the left to see its routes.
            </p>
          </div>
        ) : (
          /* A location is selected: show its name, address, route type, and map placeholder */
          <>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {activeCentre.name}
            </h1>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {activeCentre.address}
            </p>

            {/* Route type: G2 (road test for full G) or G (full licence). Just visual for now */}
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Route type
            </p>
            <div className="mb-6 flex gap-4">
              <button
                type="button"
                onClick={() => setRouteType("G2")}
                className={`text-sm font-medium ${
                  routeType === "G2"
                    ? "text-amber-600 underline dark:text-amber-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                G2
              </button>
              <button
                type="button"
                onClick={() => setRouteType("G")}
                className={`text-sm font-medium ${
                  routeType === "G"
                    ? "text-amber-600 underline dark:text-amber-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                G
              </button>
            </div>

            {/* Placeholder for a real map. Will be replaced with a map API later */}
            <div className="mb-6 flex h-48 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Map coming soon
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
