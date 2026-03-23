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
    href: "/quizzes",
    label: "Quizzes",
    description: "Short checks to reinforce concepts and track mastery progress.",
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
    href: "/routes",
    label: "Test Centres & Routes",
    description: "Explore Ontario centres, route context, and map-based planning.",
  },
  {
    href: "/user-as-examiner",
    label: "User as Examiner",
    description: "Spot mistakes in scenario clips and build examiner-level awareness.",
  },
  {
    href: "/weather-training",
    label: "Weather Training",
    description: "Prepare for low visibility, rain, snow, and shifting road conditions.",
  },
] as const;

export const accountFeatures: readonly FeatureItem[] = [
  {
    href: "/account",
    label: "Account",
    description: "Manage profile, sign-in state, and personal DriveAura settings.",
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
  "/checklist",
  "/routes",
  "/user-as-examiner",
  "/weather-training",
  "/account",
] as const;
