import type { EngineState, Mode } from "./engine";

export interface ScenarioStep {
  instruction: string;
  hint: string;
  completed: (state: EngineState) => boolean;
  auraBonus: number;
}

export const GUIDED_STEPS: readonly ScenarioStep[] = [
  {
    instruction: "Step 1 — Start the engine",
    hint: "Hold Space to rev the engine. Watch the RPM needle rise. Release to return to idle (~850 RPM).",
    completed: (s) => s.sessionTime > 6,
    auraBonus: 5,
  },
  {
    instruction: "Step 2 — Use the clutch to shift to 2nd",
    hint: "Hold C (clutch), then press W to shift up to 2nd gear. Release C smoothly.",
    completed: (s) => s.gear >= 2,
    auraBonus: 10,
  },
  {
    instruction: "Step 3 — Build speed and upshift to 3rd",
    hint: "Accelerate until RPM reaches the green zone (2000–4500), then C + W to shift to 3rd.",
    completed: (s) => s.gear >= 3 && s.speed > 30,
    auraBonus: 15,
  },
  {
    instruction: "Step 4 — Downshift when slowing down",
    hint: "Brake (B) to slow. As speed drops, press C + S to downshift and avoid stalling.",
    completed: (s) => s.gear <= 2 && s.speed < 25,
    auraBonus: 15,
  },
  {
    instruction: "Step 5 — Rev-match on a downshift",
    hint: "Before releasing the clutch after a downshift, briefly tap Space to 'blip' the revs. This is rev-matching — it smooths the transition.",
    completed: (s) => s.perfectShifts >= 2,
    auraBonus: 20,
  },
  {
    instruction: "Tutorial complete — you know the basics!",
    hint: "Try Free Drive to build muscle memory, or test yourself on City / Highway / Overtake.",
    completed: () => false,
    auraBonus: 30,
  },
];

export const CITY_STEPS: readonly ScenarioStep[] = [
  {
    instruction: "City — Accelerate from rest to 30 km/h (1st → 2nd)",
    hint: "Launch in 1st, shift to 2nd around 15–20 km/h. Keep RPM in the green zone.",
    completed: (s) => s.speed >= 30 && s.gear >= 2,
    auraBonus: 20,
  },
  {
    instruction: "City — Reach 50 km/h and settle in 3rd gear",
    hint: "Upshift to 3rd around 2200–2800 RPM. At 50 km/h in 3rd you should be in the ideal zone.",
    completed: (s) => s.speed >= 45 && s.gear === 3,
    auraBonus: 30,
  },
  {
    instruction: "City — School zone: slow to under 20 km/h and downshift",
    hint: "Brake + downshift as speed drops. Clutch before RPM falls below 1000.",
    completed: (s) => s.speed < 20 && s.gear <= 2,
    auraBonus: 25,
  },
  {
    instruction: "City — Clear of school zone: back to 50 km/h",
    hint: "Smooth 1 → 2 → 3 upshift sequence. Each perfect shift earns streak bonuses.",
    completed: (s) => s.speed >= 48 && s.gear >= 3,
    auraBonus: 30,
  },
  {
    instruction: "City scenario complete — well driven!",
    hint: "End the session to save results, or keep driving for more Aura.",
    completed: () => false,
    auraBonus: 20,
  },
];

export const HIGHWAY_STEPS: readonly ScenarioStep[] = [
  {
    instruction: "Highway — Launch and reach 40 km/h (1st → 2nd → 3rd)",
    hint: "Quick, clean shifts. Stay in the ideal RPM zone for bonus points.",
    completed: (s) => s.speed >= 40 && s.gear >= 3,
    auraBonus: 25,
  },
  {
    instruction: "Highway — On-ramp: build to 80 km/h in 4th gear",
    hint: "Shift to 4th around 3000 RPM. Match traffic speed before merging.",
    completed: (s) => s.speed >= 78 && s.gear >= 4,
    auraBonus: 30,
  },
  {
    instruction: "Highway — Cruise at 100 km/h in 5th (or 6th) gear",
    hint: "Ideal highway RPM in 5th is roughly 2800–3200. Ease off throttle and hold speed.",
    completed: (s) => s.speed >= 95 && s.gear >= 5,
    auraBonus: 35,
  },
  {
    instruction: "Highway scenario complete — smooth highway driving!",
    hint: "End the session to save results.",
    completed: () => false,
    auraBonus: 20,
  },
];

export const OVERTAKE_STEPS: readonly ScenarioStep[] = [
  {
    instruction: "Overtake — Cruise at 80 km/h in 5th gear",
    hint: "Build up to 80 km/h and hold it in 5th. Prepare to overtake.",
    completed: (s) => s.speed >= 75 && s.gear >= 4,
    auraBonus: 20,
  },
  {
    instruction: "Overtake — Downshift to 4th for extra power",
    hint: "Clutch + S to drop to 4th. Rev-match. Then accelerate hard past 100 km/h.",
    completed: (s) => s.speed >= 100 && s.gear === 4,
    auraBonus: 35,
  },
  {
    instruction: "Overtake — Pass complete: upshift and settle at 90 km/h",
    hint: "Upshift to 5th (or 6th) and ease off to 90 km/h.",
    completed: (s) => s.speed <= 95 && s.speed >= 82 && s.gear >= 5,
    auraBonus: 30,
  },
  {
    instruction: "Overtake scenario complete — precise driving!",
    hint: "End the session to save results.",
    completed: () => false,
    auraBonus: 20,
  },
];

export function getScenarioSteps(mode: Mode): readonly ScenarioStep[] | null {
  switch (mode) {
    case "guided":   return GUIDED_STEPS;
    case "city":     return CITY_STEPS;
    case "highway":  return HIGHWAY_STEPS;
    case "overtake": return OVERTAKE_STEPS;
    default:         return null;
  }
}
