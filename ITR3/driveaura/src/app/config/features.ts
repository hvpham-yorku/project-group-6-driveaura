/**
 * DriveAura feature routes — central config for homepage, nav, and route access.
 */

export type FeatureItem = {
  href: string;
  label: string;
  description: string;
};

export const learningFeatures: readonly FeatureItem[] = [
  {
    href: "/modules",
    label: "Modules",
    description: "Personalized G1 to G learning pathways with structured lessons.",
  },
  {
    href: "/data-visualization",
    label: "Progress Insights",
    description: "Visual analytics to understand strengths and improvement areas.",
  },
] as const;

export const practiceFeatures: readonly FeatureItem[] = [
  {
    href: "/test-checklist",
    label: "Passenger Test Checklist",
    description: "Run complete pre-test checks and generate readiness reports.",
  },
  {
    href: "/readiness-check",
    label: "Drive Readiness Check",
    description:
      "Assess your mental + physical state, get a readiness score, and follow step-by-step reset strategies.",
  },
  {
    href: "/manual-shift",
    label: "Manual Shift Trainer",
    description:
      "Practice shifting a manual car at the right RPM using keyboard controls. Earn Aura for clean shifts.",
  },
  {
    href: "/test-centres",
    label: "Test Centres",
    description: "Explore Ontario DriveTest centres, view embedded maps, and find key watch-outs.",
  },
  {
    href: "/user-as-examiner",
    label: "User as Examiner",
    description:
      "Practice mock grading: read case studies, classify errors as minor or major on an MTO-style rubric, and earn Aura Points.",
  },
  {
    href: "/weather-training",
    label: "Weather Training",
    description: "Prepare for low visibility, rain, snow, and shifting road conditions.",
  },
  {
    href: "/hazard-perception-training",
    label: "Hazard Perception Training",
    description:
      "Train reaction timing and hazard choices with dashcam-based crash scenarios.",
  },
] as const;

export const accountFeatures: readonly FeatureItem[] = [
  {
    href: "/account",
    label: "Account",
    description: "Manage profile, sign-in state, and personal DriveAura settings.",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    description: "See how your Aura Points rank against other DriveAura drivers.",
  },
] as const;

export const allFeatureSections = [
  { title: "Learn the Rules", items: learningFeatures },
  { title: "Practice the Road", items: practiceFeatures },
  { title: "Personal Dashboard", items: accountFeatures },
] as const;

export const protectedRoutePrefixes = [
  "/modules",
  "/quizzes",
  "/data-visualization",
  "/test-checklist",
  "/readiness-check",
  "/manual-shift",
  "/checklist",
  "/test-centres",
  "/user-as-examiner",
  "/weather-training",
  "/hazard-perception-training",
  "/account",
  "/leaderboard",
] as const;
