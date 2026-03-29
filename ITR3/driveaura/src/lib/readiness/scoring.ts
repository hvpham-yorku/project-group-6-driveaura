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
    id: "sleep24h",
    prompt: "How much sleep did you get in the last 24 hours?",
    weight: 3,
    options: [
      { label: "8+ hours", risk: 0 },
      { label: "7–8 hours", risk: 1 },
      { label: "6–7 hours", risk: 2 },
      { label: "5–6 hours", risk: 3 },
      { label: "Under 5 hours", risk: 4 },
    ],
  },
  {
    id: "alertnessNow",
    prompt: "Right now, how alert do you feel?",
    weight: 4,
    options: [
      { label: "Fully alert", risk: 0 },
      { label: "Mostly alert", risk: 1 },
      { label: "A bit foggy", risk: 2 },
      { label: "Very tired", risk: 3 },
      { label: "Struggling to stay awake", risk: 4 },
    ],
  },
  {
    id: "stressLevel",
    prompt: "What is your stress level right now?",
    weight: 3,
    options: [
      { label: "Calm", risk: 0 },
      { label: "Mildly stressed", risk: 1 },
      { label: "Moderately stressed", risk: 2 },
      { label: "Highly stressed", risk: 3 },
      { label: "Overwhelmed / panicky", risk: 4 },
    ],
  },
  {
    id: "angerIrritability",
    prompt: "How irritable or angry do you feel?",
    weight: 2,
    options: [
      { label: "Calm", risk: 0 },
      { label: "A bit irritable", risk: 1 },
      { label: "Noticeably irritated", risk: 2 },
      { label: "Very angry", risk: 3 },
      { label: "Out of control / raging", risk: 4 },
    ],
  },
  {
    id: "focusDistraction",
    prompt: "How focused are you on driving right now (vs. distracted by thoughts/phone)?",
    weight: 3,
    options: [
      { label: "Fully focused", risk: 0 },
      { label: "Mostly focused", risk: 1 },
      { label: "Somewhat distracted", risk: 2 },
      { label: "Very distracted", risk: 3 },
      { label: "Can’t focus", risk: 4 },
    ],
  },
  {
    id: "hydrationFood",
    prompt: "How are hydration and nutrition right now?",
    weight: 2,
    options: [
      { label: "Hydrated and fed", risk: 0 },
      { label: "Slightly hungry/thirsty", risk: 1 },
      { label: "Moderately hungry/thirsty", risk: 2 },
      { label: "Very hungry/thirsty", risk: 3 },
      { label: "Dehydrated / lightheaded", risk: 4 },
    ],
  },
  {
    id: "illnessPain",
    prompt: "Any illness, pain, or symptoms affecting you (headache, nausea, etc.)?",
    weight: 3,
    options: [
      { label: "No symptoms", risk: 0 },
      { label: "Mild", risk: 1 },
      { label: "Moderate", risk: 2 },
      { label: "Strong symptoms", risk: 3 },
      { label: "Severe / unsafe", risk: 4 },
    ],
  },
  {
    id: "substancesMedication",
    prompt: "Any substances/medications affecting coordination, reaction, or alertness?",
    weight: 4,
    options: [
      { label: "None", risk: 0 },
      { label: "Possibly mild effects", risk: 1 },
      { label: "Noticeable effects", risk: 2 },
      { label: "Strong effects", risk: 3 },
      { label: "Impairing effects", risk: 4 },
    ],
  },
] as const;

export function computeReadinessScore(answers: Record<string, number>): number | null {
  const allAnswered = readinessQuestions.every((q) => {
    const raw = answers[q.id];
    return typeof raw === "number" && Number.isFinite(raw);
  });
  if (!allAnswered) return null;

  const maxRisk = readinessQuestions.reduce((sum, q) => sum + q.weight * 4, 0);
  const risk = readinessQuestions.reduce((sum, q) => {
    const raw = answers[q.id];
    const normalized = Math.max(0, Math.min(4, raw as number));
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

