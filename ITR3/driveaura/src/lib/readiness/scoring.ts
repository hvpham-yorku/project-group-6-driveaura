export type GateStopId =
  | "alcoholOrDrugs"
  | "severeSleepiness"
  | "dizzyOrFaint"
  | "panicOrOverwhelmed"
  | "visionOrCoordinationIssue"
  | "unsafeEnvironment";

export type ReadinessQuestion = {
  id: string;
  prompt: string;
  weight: number;
  options: readonly { label: string; risk: 0 | 1 | 2 | 3 | 4 }[];
};

export const readinessQuestions: readonly ReadinessQuestion[] = [
  {
    id: "alertnessNow",
    prompt: "How alert do you feel right now?",
    weight: 4,
    options: [
      { label: "Fully alert & sharp", risk: 0 },
      { label: "Mostly alert", risk: 1 },
      { label: "A bit foggy", risk: 2 },
      { label: "Very tired", risk: 3 },
      { label: "Struggling to stay awake", risk: 4 },
    ],
  },
  {
    id: "sleep24h",
    prompt: "How much sleep did you get in the last 24 hours?",
    weight: 3,
    options: [
      { label: "7+ hours", risk: 0 },
      { label: "6–7 hours", risk: 1 },
      { label: "5–6 hours", risk: 2 },
      { label: "4–5 hours", risk: 3 },
      { label: "Under 4 hours", risk: 4 },
    ],
  },
  {
    id: "substancesMedication",
    prompt: "Any medication or substances affecting your reactions today?",
    weight: 4,
    options: [
      { label: "None at all", risk: 0 },
      { label: "Possibly mild effects", risk: 1 },
      { label: "Noticeable effects", risk: 2 },
      { label: "Strong effects", risk: 3 },
      { label: "Impairing effects", risk: 4 },
    ],
  },
  {
    id: "stressLevel",
    prompt: "What is your stress or emotional state right now?",
    weight: 3,
    options: [
      { label: "Calm and settled", risk: 0 },
      { label: "Mildly stressed", risk: 1 },
      { label: "Moderately stressed", risk: 2 },
      { label: "Highly stressed / anxious", risk: 3 },
      { label: "Overwhelmed / panicking", risk: 4 },
    ],
  },
  {
    id: "focusDistraction",
    prompt: "How focused can you be on driving right now?",
    weight: 3,
    options: [
      { label: "Fully focused", risk: 0 },
      { label: "Mostly focused", risk: 1 },
      { label: "Somewhat distracted", risk: 2 },
      { label: "Very distracted by thoughts", risk: 3 },
      { label: "Can't focus at all", risk: 4 },
    ],
  },
] as const;

export function computeReadinessScore(answers: Record<string, number>): number {
  const answered = readinessQuestions.filter((q) => typeof answers[q.id] === "number");
  if (answered.length === 0) return 0;

  const maxRisk = answered.reduce((sum, q) => sum + q.weight * 4, 0);
  const risk = answered.reduce((sum, q) => {
    const raw = answers[q.id];
    const normalized = typeof raw === "number" ? Math.max(0, Math.min(4, raw)) : 0;
    return sum + normalized * q.weight;
  }, 0);

  if (maxRisk <= 0) return 0;
  const score = Math.round(100 * (1 - risk / maxRisk));
  return Math.max(0, Math.min(100, score));
}

export function scoreLabel(score: number): "Safe to drive" | "Use caution" | "Do not drive" {
  if (score >= 80) return "Safe to drive";
  if (score >= 60) return "Use caution";
  return "Do not drive";
}
