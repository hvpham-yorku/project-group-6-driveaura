/**
 * DriveAura feature routes — central config for dashboard and nav.
 */

export const iteration1 = [
  { href: "/modules", label: "Modules" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/data-visualization", label: "Data Visualization" },
  { href: "/test-checklist", label: "Test Checklist" },
  { href: "/test-routes", label: "Test Routes" },
] as const;

export const iteration2 = [
  { href: "/know-your-car", label: "Know Your Car" },
  { href: "/accident-guide", label: "Accident Guide" },
  { href: "/mental-readiness", label: "Mental Readiness" },
  { href: "/hazard-perception", label: "Hazard Perception" },
  { href: "/weather-training", label: "Weather Training" },
] as const;

export const iteration3 = [
  { href: "/find-instructors", label: "Find Instructors" },
  { href: "/account", label: "Account" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/manual-simulator", label: "Manual Simulator" },
] as const;

export const allFeatures = [
  { iteration: "Iteration 1 (Learning)", items: iteration1 },
  { iteration: "Iteration 2 (Safety)", items: iteration2 },
  { iteration: "Iteration 3 (Extra)", items: iteration3 },
] as const;
