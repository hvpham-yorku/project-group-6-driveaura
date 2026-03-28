import { Suspense } from "react";
import LeaderboardClient from "./LeaderboardClient";

export const metadata = {
  title: "Leaderboard — DriveAura",
  description: "See how your Aura Points rank against the entire DriveAura community.",
};

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0F051D]">
          <p className="text-sm text-[#B8B0D3]">Loading…</p>
        </main>
      }
    >
      <LeaderboardClient />
    </Suspense>
  );
}
