// Engine physics constants, types, and pure simulation functions

export const MAX_RPM = 7000;
export const IDLE_RPM = 850;
export const STALL_RPM = 600;
export const REDLINE = 6200;
export const MAX_SPEED = 220;
export const STALL_COOLDOWN_SEC = 2.2;

export const RPM_ZONES = [
  { label: "idle",    min: 0,    max: 1000, stroke: "#B8B0D3" },
  { label: "low",     min: 1000, max: 2000, stroke: "#FFD700" },
  { label: "ideal",   min: 2000, max: 4500, stroke: "#39FF14" },
  { label: "caution", min: 4500, max: 6200, stroke: "#FF8C00" },
  { label: "redline", min: 6200, max: 7000, stroke: "#FF3B3F" },
] as const;

/** RPM per 1 km/h for each gear (approximates a typical manual car). */
export const RPM_PER_KMH: Record<number, number> = {
  1: 130, 2: 78, 3: 54, 4: 41, 5: 32, 6: 26,
};

/** RPM window for a "perfect shift" by difficulty level. */
export const IDEAL_SHIFT: Record<
  string,
  { up: [number, number]; down: [number, number] }
> = {
  learner: { up: [1500, 5500], down: [1200, 3800] },
  driver:  { up: [2000, 4500], down: [1500, 3000] },
  expert:  { up: [2500, 4200], down: [1800, 2800] },
};

export type GearCount  = 5 | 6;
export type Difficulty = "learner" | "driver" | "expert";
export type Mode       = "guided" | "free" | "city" | "highway" | "overtake";

export interface EngineState {
  rpm: number;
  speed: number;
  gear: number;
  clutchDepressed: boolean;
  stalled: boolean;
  stallCooldown: number;
  sessionTime: number;
  score: number;
  perfectShifts: number;
  streak: number;
  bestStreak: number;
  stalls: number;
  auraEarned: number;
  zoneAccum: number;
  gearCount: GearCount;
  difficulty: Difficulty;
  mode: Mode;
}

export function createEngineState(
  gearCount: GearCount,
  difficulty: Difficulty,
  mode: Mode,
): EngineState {
  return {
    rpm: IDLE_RPM,
    speed: 0,
    gear: 1,
    clutchDepressed: false,
    stalled: false,
    stallCooldown: 0,
    sessionTime: 0,
    score: 0,
    perfectShifts: 0,
    streak: 0,
    bestStreak: 0,
    stalls: 0,
    auraEarned: 0,
    zoneAccum: 0,
    gearCount,
    difficulty,
    mode,
  };
}

export interface InputState {
  throttle: boolean;
  brake: boolean;
  clutch: boolean;
}

export function updateEngine(
  state: EngineState,
  inputs: InputState,
  dt: number,
): EngineState {
  const dtC = Math.min(dt, 0.1);

  let {
    rpm, speed, gear, clutchDepressed, stalled, stallCooldown,
    sessionTime, score, perfectShifts, streak, bestStreak, stalls,
    auraEarned, zoneAccum, gearCount, difficulty, mode,
  } = state;

  sessionTime += dtC;

  if (stalled) {
    stallCooldown -= dtC;
    speed = Math.max(0, speed - 18 * dtC);
    const stillStalled = stallCooldown > 0;
    return {
      ...state,
      rpm: stillStalled ? 0 : IDLE_RPM,
      speed,
      stalled: stillStalled,
      stallCooldown: Math.max(0, stallCooldown),
      sessionTime,
    };
  }

  clutchDepressed = inputs.clutch;

  // Natural RPM = what RPM would be if clutch is fully engaged
  const naturalRpm = speed > 0.5 ? speed * RPM_PER_KMH[gear] : IDLE_RPM;

  let targetRpm: number;
  if (clutchDepressed) {
    targetRpm = inputs.throttle
      ? Math.min(REDLINE + 500, rpm + 5500 * dtC)
      : Math.max(IDLE_RPM, rpm - 3800 * dtC);
  } else {
    targetRpm = inputs.throttle
      ? Math.min(REDLINE + 500, Math.max(naturalRpm, rpm) + 2000 * dtC)
      : Math.max(IDLE_RPM, naturalRpm);
  }

  const lag = clutchDepressed ? 14 : 8;
  rpm = rpm + (targetRpm - rpm) * (1 - Math.exp(-lag * dtC));
  rpm = Math.max(0, Math.min(MAX_RPM, rpm));

  if (!clutchDepressed) {
    if (inputs.throttle) {
      const torque = Math.max(0, 1 - Math.abs(rpm - 3000) / 4500);
      speed += torque * 16 * dtC;
    } else {
      const engineSpeed = rpm / RPM_PER_KMH[gear];
      speed += (engineSpeed - speed) * 0.04;
    }
  }

  speed -= 3.5 * dtC;
  if (inputs.brake) speed -= 26 * dtC;
  speed = Math.max(0, Math.min(MAX_SPEED, speed));

  let newStalled = false;
  let newStallCooldown = stallCooldown;
  if (!clutchDepressed && speed < 10 && rpm < STALL_RPM && difficulty !== "learner") {
    newStalled = true;
    newStallCooldown = STALL_COOLDOWN_SEC;
    stalls += 1;
    streak = 0;
    score = Math.max(0, score - 25);
  }

  let newZoneAccum = zoneAccum;
  if (!newStalled && rpm >= 2000 && rpm <= 4500 && !clutchDepressed) {
    newZoneAccum += dtC;
    if (newZoneAccum >= 4.0) {
      auraEarned += 2;
      score += 5;
      newZoneAccum = 0;
    }
  } else {
    newZoneAccum = Math.max(0, newZoneAccum - dtC * 0.3);
  }

  return {
    ...state,
    rpm, speed, gear, clutchDepressed,
    stalled: newStalled, stallCooldown: newStallCooldown,
    sessionTime, score, perfectShifts, streak, bestStreak, stalls,
    auraEarned, zoneAccum: newZoneAccum,
    gearCount, difficulty, mode,
  };
}

export function shiftGear(
  state: EngineState,
  direction: "up" | "down",
): { newState: EngineState; feedback: { text: string; positive: boolean } } {
  const { gear, gearCount, rpm, speed, difficulty } = state;

  if (direction === "up" && gear >= gearCount) {
    return { newState: state, feedback: { text: "Already in top gear", positive: false } };
  }
  if (direction === "down" && gear <= 1) {
    return { newState: state, feedback: { text: "Already in 1st gear", positive: false } };
  }

  const newGear = direction === "up" ? gear + 1 : gear - 1;
  const newRpm = Math.max(IDLE_RPM, Math.min(MAX_RPM, speed * RPM_PER_KMH[newGear]));
  const window = IDEAL_SHIFT[difficulty][direction];
  const isPerfect = rpm >= window[0] && rpm <= window[1];

  let { score, perfectShifts, streak, bestStreak, auraEarned } = state;
  let feedbackText: string;
  let feedbackPositive: boolean;

  if (isPerfect) {
    streak += 1;
    if (streak > bestStreak) bestStreak = streak;
    perfectShifts += 1;
    const streakBonus = Math.min(streak - 1, 5) * 10;
    const pts = 50 + streakBonus;
    score += pts;
    auraEarned += Math.ceil(pts / 10);
    feedbackText =
      streak >= 3
        ? `Perfect! ${streak}× streak! +${pts} pts`
        : `Perfect shift! +${pts} pts`;
    feedbackPositive = true;
  } else {
    streak = 0;
    score = Math.max(0, score - 10);
    const tooLow = rpm < window[0];
    feedbackText =
      direction === "up"
        ? tooLow
          ? "RPM too low to upshift cleanly"
          : "Over-revving — shift a bit sooner"
        : tooLow
          ? "Rev up before downshifting"
          : "RPM too high for this downshift";
    feedbackPositive = false;
  }

  return {
    newState: { ...state, gear: newGear, rpm: newRpm, score, perfectShifts, streak, bestStreak, auraEarned },
    feedback: { text: feedbackText, positive: feedbackPositive },
  };
}

export function getShiftTip(
  rpm: number,
  gear: number,
  gearCount: GearCount,
  speed: number,
  stalled: boolean,
): string {
  if (stalled) return "Engine stalled — wait to restart, then ease the clutch";
  if (speed < 1) return "Hold Space to accelerate";
  if (rpm >= 5800 && gear < gearCount) return "⬆ Shift up now! (W)";
  if (rpm < 1200 && gear > 1) return "⬇ Shift down (S)";
  if (speed > 15 && gear === 1) return "Ready to shift to 2nd gear (W)";
  if (rpm >= 2000 && rpm <= 4500) return "✓ Ideal RPM zone";
  if (rpm > 4500 && gear < gearCount) return "Consider shifting up (W)";
  if (rpm < 1800 && gear > 1) return "Engine labouring — shift down (S)";
  return "";
}
