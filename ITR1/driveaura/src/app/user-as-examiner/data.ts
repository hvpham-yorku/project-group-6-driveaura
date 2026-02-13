/**
 * User-as-Examiner scenarios: "Spot the mistake" driving clips.
 * Each scenario describes a 10-second POV clip, the intentional mistake,
 * a multiple-choice question, and examiner feedback.
 */

export type ScenarioEnvironment =
  | "residential"
  | "highway"
  | "intersection"
  | "parking";

export interface ExaminerScenario {
  id: string;
  title: string;
  environment: ScenarioEnvironment;
  /** Detailed description of the 10-second POV video (for placeholder or script) */
  videoVisualScript: string;
  /** The primary violation shown in the clip */
  majorMistake: string;
  /** Question shown after watching the clip */
  question: string;
  /** Answer options (A, B, C, D) — correctIndex is 0-based */
  options: [string, string, string, string];
  correctIndex: number;
  /** Professional feedback explaining the deduction/fail */
  examinerFeedback: string;
}

export const USER_AS_EXAMINER_SCENARIOS: ExaminerScenario[] = [
  {
    id: "rolling-stop-residential",
    title: "Residential Stop Sign",
    environment: "residential",
    videoVisualScript:
      "First-person view from the driver seat. The vehicle approaches a four-way stop on a quiet residential street (30 km/h zone). Trees and parked cars line the curb. The driver slows but does not come to a complete stop; the vehicle rolls through at roughly 5–8 km/h. No other vehicles are visible at the intersection. The driver proceeds straight without a full stop. Duration: ~10 seconds from approach to exit.",
    majorMistake: "Rolling the stop sign (failing to come to a complete stop)",
    question: "What mistake(s) did the driver make during this segment?",
    options: [
      "Rolling the stop sign (failing to come to a complete stop)",
      "Exceeding the speed limit",
      "Failing to signal before proceeding",
      "None of the above",
    ],
    correctIndex: 0,
    examinerFeedback:
      "The driver did not come to a complete stop at the stop sign. A full stop is required: wheels must cease moving and the vehicle must pause before proceeding. Rolling through is a serious violation and would result in significant point deduction or an automatic fail on a road test, as it demonstrates disregard for a controlled intersection and right-of-way rules.",
  },
  {
    id: "blind-spot-highway",
    title: "Lane Change on Highway",
    environment: "highway",
    videoVisualScript:
      "POV from driver seat on a multi-lane highway. Speed is steady at ~100 km/h. The driver signals and moves from the right lane into the middle lane. There is no visible head check or mirror check toward the blind spot before or during the lane change. Traffic is moderate; no vehicle is shown in the blind spot in the clip, but the driver never looks. The maneuver is completed within the 10-second window.",
    majorMistake: "Failing to check the blind spot before changing lanes",
    question: "What mistake(s) did the driver make during this segment?",
    options: [
      "Failing to check the blind spot before changing lanes",
      "Not using the turn signal",
      "Following too closely before the lane change",
      "All of the above",
    ],
    correctIndex: 0,
    examinerFeedback:
      "The driver changed lanes without performing a proper blind spot check (shoulder check). Even with a signal, examiners expect a clear head turn to check the blind spot before committing to the lane change. Failing to do so is a critical error and can be marked as an automatic fail, as it creates significant collision risk on the highway.",
  },
  {
    id: "unprotected-left-intersection",
    title: "Unprotected Left Turn at Intersection",
    environment: "intersection",
    videoVisualScript:
      "First-person view at a busy signalized intersection. The traffic light is green (no green arrow). The driver is in the left-turn lane. Oncoming traffic is visible; one vehicle is approaching in the opposite lane. The driver begins the left turn before the oncoming vehicle has cleared, forcing that vehicle to slow or creating a close call. The turn is completed within the 10-second clip. Pedestrian crosswalks are visible on both sides.",
    majorMistake:
      "Failing to yield right-of-way to oncoming traffic on an unprotected left turn",
    question: "What mistake(s) did the driver make during this segment?",
    options: [
      "Failing to yield right-of-way to oncoming traffic on an unprotected left turn",
      "Running a red light",
      "Speeding through the intersection",
      "None of the above",
    ],
    correctIndex: 0,
    examinerFeedback:
      "On an unprotected left turn (green light, no arrow), the driver must yield right-of-way to oncoming traffic and only turn when it is safe. Turning in front of an oncoming vehicle is a serious right-of-way violation and would typically result in an automatic fail. It endangers both the driver and the oncoming vehicle and shows a lack of judgment at an intersection.",
  },
];

export const ENVIRONMENT_LABELS: Record<ScenarioEnvironment, string> = {
  residential: "Residential",
  highway: "Highway",
  intersection: "Intersection",
  parking: "Parking",
};
