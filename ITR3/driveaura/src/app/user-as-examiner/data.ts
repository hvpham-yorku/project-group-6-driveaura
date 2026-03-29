/**
 * User-as-Examiner: Mock Grading scenarios (MTO-style rubric).
 * Each scenario has a case study, one rubric row, correct severity, and guidance.
 */

export type ScenarioEnvironment =
  | "residential"
  | "highway"
  | "intersection"
  | "parking";

/** How the error would be classified on an Ontario road test rubric. */
export type ErrorSeverity = "minor" | "major";

export interface ExaminerScenario {
  id: string;
  title: string;
  environment: ScenarioEnvironment;
  /** Prominent case study text shown at the top */
  caseStudy: string;
  /** First column: maneuver / checklist item */
  maneuverItem: string;
  /** Official severity for this error */
  correctSeverity: ErrorSeverity;
  /** Short label for what went wrong (feedback summary) */
  majorMistake: string;
  /** Shown after a correct verdict */
  examinerFeedback: string;
  /** Shown after an incorrect verdict — MTO-style grading standard */
  mtoGuidance: string;
}

export const USER_AS_EXAMINER_SCENARIOS: ExaminerScenario[] = [
  {
    id: "rolling-stop-residential",
    title: "Residential Stop Sign",
    environment: "residential",
    caseStudy:
      "The driver approaches a four-way stop on a quiet residential street (30 km/h zone). They slow but do not bring the vehicle to a complete stop—the wheels keep rolling at roughly 5–8 km/h—and they proceed straight through the intersection without pausing. No other vehicles are at the intersection.",
    maneuverItem: "Stop sign — full stop before proceeding",
    correctSeverity: "major",
    majorMistake: "Rolling the stop sign (failing to come to a complete stop)",
    examinerFeedback:
      "Correct. Rolling through a stop sign is treated as a serious error on the G2 road test: the vehicle must fully stop with no forward motion before entering the intersection. This goes beyond a minor timing issue and reflects failure to obey a primary control device.",
    mtoGuidance:
      "Ontario examiners expect a full stop at every stop sign: the vehicle ceases all forward motion, however briefly, before you proceed. Rolling through—even slowly—is not a minor slip; it is a failure to stop and is scored as a major/critical-class error because it ignores right-of-way rules at a controlled intersection.",
  },
  {
    id: "blind-spot-highway",
    title: "Lane Change on Highway",
    environment: "highway",
    caseStudy:
      "On a multi-lane highway at about 100 km/h, the driver signals and moves from the right lane into the middle lane. They check mirrors but never turn their head to check the blind spot before or during the lane change. Traffic is moderate; no collision occurs in the clip.",
    maneuverItem: "Lane change — mirror and blind spot (shoulder) check",
    correctSeverity: "major",
    majorMistake: "Failing to check the blind spot before changing lanes",
    examinerFeedback:
      "Correct. A mirror glance is not enough for a lane change at highway speed. Examiners look for a visible shoulder check before you commit; missing it is graded as a major safety error because it creates real collision risk.",
    mtoGuidance:
      "MTO road-test standards require you to check mirrors and the blind spot (shoulder check) before changing lanes or direction. Relying only on mirrors misses the blind spot. Failing to shoulder check is not treated as a minor oversight at speed—it is a major/critical-class error due to the severity of a potential sideswipe or merge collision.",
  },
  {
    id: "unprotected-left-intersection",
    title: "Unprotected Left Turn at Intersection",
    environment: "intersection",
    caseStudy:
      "At a signalized intersection, the traffic light is solid green with no left-turn arrow. The driver is in the left-turn lane. Oncoming traffic is still approaching. The driver begins the left turn before that traffic has cleared, causing the oncoming driver to slow sharply.",
    maneuverItem: "Unprotected left — yield to oncoming traffic",
    correctSeverity: "major",
    majorMistake:
      "Failing to yield right-of-way to oncoming traffic on an unprotected left turn",
    examinerFeedback:
      "Correct. On a green ball (no arrow), you must yield to oncoming traffic and only turn when you can complete the turn safely. Turning across live traffic is a major right-of-way violation and is typically an automatic fail.",
    mtoGuidance:
      "For an unprotected left on a green light, Ontario standards require you to wait until oncoming traffic has passed or stopped safely before you turn. Misjudging gap or forcing oncoming traffic to brake is not a minor error—it is a major/critical-class right-of-way failure because it directly endangers other road users.",
  },
  {
    id: "late-signal-lane-change",
    title: "Late Signal Before Lane Change",
    environment: "highway",
    caseStudy:
      "On a multi-lane highway, the driver decides to move left. They check mirrors and perform a shoulder check, wait for a safe gap, and move smoothly. They activate the turn signal only a second or two before starting the lane change—later than ideal, but other drivers can still see intent before the vehicle moves.",
    maneuverItem: "Lane change — timely signal before moving",
    correctSeverity: "minor",
    majorMistake: "Late activation of the turn signal before the lane change",
    examinerFeedback:
      "Correct. A late signal is still a real error, but here the driver signaled before committing and completed full mirror and blind-spot checks. Examiners often record late signaling as a minor deduction when communication was still clear and the maneuver stayed safe.",
    mtoGuidance:
      "If you marked this as major: late signaling can be serious if others had no warning, but in this case the driver still signaled before moving and checked properly. That pattern is usually scored as a minor timing issue rather than a major safety failure.",
  },
  {
    id: "wide-right-turn-residential",
    title: "Wide Right Turn",
    environment: "residential",
    caseStudy:
      "On a two-lane residential road, the driver slows for a right turn onto another street. They take the turn a bit wide—nudging toward the centre of the new street—but stay in their lane, signal throughout, and no pedestrians or vehicles are close. The turn is completed without conflict.",
    maneuverItem: "Right turn — path and lane discipline",
    correctSeverity: "minor",
    majorMistake: "Slightly wide right-turn path (still controlled and in-lane)",
    examinerFeedback:
      "Correct. A wide turn without crossing into opposing traffic or threatening pedestrians is usually a minor path error. The driver maintained control, stayed in the correct lane, and kept the signal on.",
    mtoGuidance:
      "If you chose major: wide turns become major when they create conflict—wrong lane, head-on risk, or near-miss. Here the issue is positioning only, with no serious hazard, which fits a minor deduction on typical rubrics.",
  },
  {
    id: "stale-red-light",
    title: "Entering on a Red Light",
    environment: "intersection",
    caseStudy:
      "The driver approaches a signalized intersection. The light has turned red for their direction while they are close to the stop line. Instead of stopping, they accelerate slightly and enter the intersection after the red, clearing the cross street while cross-traffic is still waiting on green.",
    maneuverItem: "Traffic signal — stop on red",
    correctSeverity: "major",
    majorMistake: "Entering the intersection after the signal turned red",
    examinerFeedback:
      "Correct. Running or entering on a stale red is a fundamental signal violation. Examiners treat this as a major or automatic-fail-level error because it ignores the primary control of the intersection.",
    mtoGuidance:
      "Ontario examiners require you to stop for a steady red when you can do so safely. Entering after red is not a minor timing slip—it is a serious breach of traffic control and is classified as major/critical.",
  },
  {
    id: "school-zone-speed",
    title: "Speed in a School Zone",
    environment: "residential",
    caseStudy:
      "School zone signs and a 40 km/h limit are clearly posted on a two-lane road during school hours. The driver travels at about 55 km/h past the school frontage without slowing for the reduced limit. Children are visible on the sidewalk near the school property.",
    maneuverItem: "School zone — obey posted speed limit",
    correctSeverity: "major",
    majorMistake: "Excessive speed in an active school zone",
    examinerFeedback:
      "Correct. Speeding through a school zone where children are present is a major safety violation. Examiners emphasize reduced limits precisely because of pedestrian risk.",
    mtoGuidance:
      "School zones are treated strictly. Driving well over the posted limit where children may step onto the road is not a minor oversight—it is a major/critical-class error due to the potential severity of a collision.",
  },
  {
    id: "three-point-blind-spot-reverse",
    title: "Blind Spot on Reverse (Three-Point Turn)",
    environment: "parking",
    caseStudy:
      "The driver performs a three-point turn on a quiet street. They check mirrors before reversing but do not turn their head to look through the rear side window or over the shoulder for pedestrians, cyclists, or vehicles in the blind area behind them during the reverse segment.",
    maneuverItem: "Low-speed reverse — 360° awareness / blind spot",
    correctSeverity: "major",
    majorMistake: "Failing to check the blind spot and rear path while reversing",
    examinerFeedback:
      "Correct. During reverse in a three-point turn, examiners expect a real look back—not only mirrors. Missing the blind area while backing is a major safety error because vulnerable road users can be directly behind the vehicle.",
    mtoGuidance:
      "Mirrors alone do not cover everything behind and beside the vehicle when reversing. Failing to shoulder-check or look back in a maneuver where pedestrians commonly appear is graded as major/critical, not a minor habit slip.",
  },
  {
    id: "tailgating-highway",
    title: "Following Too Closely",
    environment: "highway",
    caseStudy:
      "On a busy highway, the driver follows a sedan in the same lane at about 100 km/h with roughly one car length of space behind it. Traffic ahead slows slightly; the driver does not increase following distance and remains close enough that avoiding a sudden stop would be difficult.",
    maneuverItem: "Following distance — space cushion at speed",
    correctSeverity: "major",
    majorMistake: "Following too closely at highway speed (unsafe gap)",
    examinerFeedback:
      "Correct. At highway speeds, a one-car-length gap is far below safe following distance. Examiners treat inadequate space as a major error because it removes room to react to braking or debris.",
    mtoGuidance:
      "Minor spacing issues might mean a bit tight but still plausible; here the gap is clearly unsafe for the speed. That degree of tailgating is a major/critical-class error on road tests.",
  },
];

export const ENVIRONMENT_LABELS: Record<ScenarioEnvironment, string> = {
  residential: "Residential",
  highway: "Highway",
  intersection: "Intersection",
  parking: "Parking",
};
