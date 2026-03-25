/**
 * Learning Hub module data — G1 Phase 1 (Theory) only for now.
 * licenseLevel drives the pathway and module list on /modules.
 */
export type LicenseLevel = "G1" | "G2" | "G";

export interface Lesson {
  id: string;
  title: string;
  content: string;
}

export interface ModuleItem {
  id: string;
  licenseLevel: LicenseLevel;
  title: string;
  category: string;
  description: string;
  lessons: Lesson[];
}

/** G1 Phase 1: The G1 Knowledge Path (Theory) — 5 modules only. Content to be added later. */
export const MODULES: ModuleItem[] = [
  {
    id: "g1-signs-signals-markings",
    licenseLevel: "G1",
    title: "Signs, Signals, and Markings",
    category: "G1 Knowledge Path",
    description:
      "Regulatory, warning, and pavement line markings you need to know for the G1 written test.",
    lessons: [
      { id: "1", title: "Regulatory signs", content: "" },
      { id: "2", title: "Warning signs and high occupancy vehicle (HOV) signs", content: "" },
      { id: "3", title: "Temporary Condition Signs", content: "" },
      { id: "4", title: "Information and Direction Signs", content: "" },
      { id: "5", title: "Other Signs", content: "" },
    ],
  },
  {
    id: "g1-right-of-way",
    licenseLevel: "G1",
    title: "Right-of-Way Rules",
    category: "G1 Knowledge Path",
    description:
      "4-way stops, yielding, and emergency vehicles — when to go and when to wait.",
    lessons: [
      { id: "1", title: "4-way stops and yielding", content: "" },
      { id: "2", title: "Emergency vehicles", content: "" },
    ],
  },
  {
    id: "g1-demerit-points",
    licenseLevel: "G1",
    title: "The Demerit Point System",
    category: "G1 Knowledge Path",
    description:
      "The consequences of traffic violations in Ontario and how demerit points affect your licence.",
    lessons: [
      { id: "1", title: "How demerit points work", content: "" },
      { id: "2", title: "How Demerit Points Are Applied", content: "" },
      { id: "3", title: "Points by Offence", content: "" },
      { id: "4", title: "Consequences & Penalties", content: "" },
    ],
  },
  {
    id: "g1-sharing-the-road",
    licenseLevel: "G1",
    title: "Sharing the Road",
    category: "G1 Knowledge Path",
    description:
      "Rules for streetcars, school buses, and cyclists so everyone stays safe.",
    lessons: [
      { id: "1", title: "Streetcars and school buses", content: "" },
      { id: "2", title: "Cyclists and other road users", content: "" },
    ],
  },
  {
    id: "g1-impaired-driving",
    licenseLevel: "G1",
    title: "Impaired Driving & Legal Limits",
    category: "G1 Knowledge Path",
    description:
      "BAC rules and cannabis laws for novice drivers in Ontario.",
    lessons: [
      { id: "1", title: "BAC and legal limits", content: "" },
      { id: "2", title: "Cannabis and novice drivers", content: "" },
    ],
  },
  {
    id: "g1-what-to-do-when-accident-occurs",
    licenseLevel: "G1",
    title: "What To Do When an Accident Occurs",
    category: "G1 Knowledge Path",
    description:
      "Step-by-step guide for what to do after a crash: stay calm, stay safe, exchange information, and report when required.",
    lessons: [
      { id: "1", title: "Stay Calm and Check for Injuries", content: "" },
      { id: "2", title: "Move to a Safe Location", content: "" },
      { id: "3", title: "Call Emergency Services if Needed", content: "" },
      { id: "4", title: "Exchange Information", content: "" },
      { id: "5", title: "Document the Scene", content: "" },
      { id: "6", title: "Report the Accident", content: "" },
    ],
  },
  {
    id: "g2-licensing-restrictions",
    licenseLevel: "G2",
    title: "G2 Licensing Restrictions",
    category: "G2 Road Prep",
    description:
      "Ontario G2 rules: zero alcohol/drugs, passenger limits for under 19, seatbelts, demerits, and how you progress to a full G.",
    lessons: [
      {
        id: "1",
        title: "The \"Zero Tolerance\" Rule (Alcohol & Drugs)",
        content: "",
      },
      {
        id: "2",
        title: "G2 Passenger Restrictions (Under 19)",
        content: "",
      },
      {
        id: "3",
        title: "Seatbelt & Capacity Laws",
        content: "",
      },
      {
        id: "4",
        title: "Escalating Sanctions & Demerits",
        content: "",
      },
      {
        id: "5",
        title: "Progression to the Full G License",
        content: "",
      },
    ],
  },
  {
    id: "g2-pre-drive-vehicle-safety",
    licenseLevel: "G2",
    title: "Pre-Drive and Vehicle Safety",
    category: "G2 Road Prep",
    description:
      "Before you drive: walk-around checks, seat and mirrors, dash lights, tires and brakes, visibility, and your papers—plus hazard awareness (Ontario MTO handbook).",
    lessons: [
      { id: "1", title: "Pre-Drive Vehicle Inspection", content: "" },
      { id: "2", title: "Seat and Mirror Adjustment", content: "" },
      { id: "3", title: "Dashboard Warning Lights", content: "" },
      { id: "4", title: "Tires and Brakes", content: "" },
      { id: "5", title: "Visibility and Lighting Checks", content: "" },
      {
        id: "6",
        title: "Required Documents (License, Ownership, Insurance)",
        content: "",
      },
      {
        id: "7",
        title: "Safe Vehicle Readiness and Hazard Awareness",
        content: "",
      },
    ],
  },
  {
    id: "g2-essential-road-maneuvers",
    licenseLevel: "G2",
    title: "Essential Road Maneuvers",
    category: "G2 Road Prep",
    description:
      "On the road: turns, lane changes, backing up, three-point and U-turns, and parking—core skills for your G2 road test.",
    lessons: [
      { id: "1", title: "Left and Right Turns", content: "" },
      { id: "2", title: "Lane Changes and Lane Positioning", content: "" },
      { id: "3", title: "Reversing and Backing Up", content: "" },
      { id: "4", title: "Three-Point Turns and U-Turns", content: "" },
      { id: "5", title: "Parking (Parallel, Perpendicular, Hill)", content: "" },
    ],
  },
  {
    id: "g2-hazard-awareness-defensive-driving",
    licenseLevel: "G2",
    title: "Hazard Awareness & Defensive Driving",
    category: "G2 Road Prep",
    description:
      "Identifying risks, scanning, blind spots, and reacting safely in real traffic.",
    lessons: [
      {
        id: "1",
        title: "Scanning & space cushions",
        content:
          "Main explanation:\nA good driver is “reading the road” all the time—not staring at the bumper in front. Use an active scan: far ahead (what’s changing), near ahead (your lane), then mirrors (what’s behind), then back to the road. The goal is to keep a space cushion: room in front, space to your sides when possible, and awareness of what’s behind you. If the road tightens (parked cars, cyclists, merges), slow early and create space before you’re forced to react.\n\nCommon mistake:\nOnly scanning straight ahead. Drivers miss side-street vehicles, pedestrians stepping out, or a car closing quickly from behind.\n\nExaminer tip:\nExaminers look for visible scanning habits. Small, regular mirror checks and early speed adjustments show you are planning, not guessing.\n\nTest day note:\nIf you feel rushed, slow your scan down—not your reactions. Calm scanning prevents sudden braking.\n\nvisualSuggestion: Simple photo showing a driver’s perspective with cars ahead and side streets (use as a prompt to practice “far–near–mirrors” scanning)\nimageSource: Unsplash\nsearchQuery: \"driver view through windshield city traffic\"\n",
      },
      {
        id: "2",
        title: "Blind spots & mirror checks",
        content:
          "Main explanation:\nMirrors help, but they don’t show everything. Before changing lanes, moving around a parked car, or merging, do a quick mirror check first, then a shoulder check into the blind spot, then move smoothly if it’s clear. Keep your head checks quick—your eyes should be off the road for the shortest time possible. If you’re passing cyclists or parked cars, leave extra space and be ready for doors opening.\n\nCommon mistake:\nTurning your whole upper body for too long (losing forward control) or skipping the shoulder check because you “already looked in the mirror.”\n\nExaminer tip:\nA lane change often fails because the check sequence is incomplete. Examiners want mirror → signal → shoulder check → move (smoothly), with space kept.\n\nTest day note:\nIf you’re unsure, don’t force it. Cancel the signal, keep your lane, and try again when you have a safe gap.\n\nvisualSuggestion: Simple diagram-style photo of a car with mirror + blind spot zones (use to explain where shoulder checks matter)\nimageSource: Pexels\nsearchQuery: \"car side mirror blind spot\"\n",
      },
      {
        id: "3",
        title: "Intersections & pedestrian hazards",
        content:
          "Main explanation:\nMost serious surprises happen at intersections: left turns, pedestrians stepping off the curb, and vehicles running late yellow/red. Approach intersections with a plan: scan left–center–right as you near the crosswalk, check mirrors before braking, and be ready to stop if anything is uncertain. When turning, watch for pedestrians and cyclists in the crosswalk and near corners, and complete your turn into the correct lane. If your view is blocked, creep forward slowly only when safe.\n\nCommon mistake:\nRushing a turn because the light is changing, or only checking for cars and forgetting pedestrians/cyclists.\n\nExaminer tip:\nThey want “decision time.” Slowing early, checking crosswalks twice, and turning into the correct lane shows control.\n\nTest day note:\nIf you miss a turn, it’s fine—continue safely. A wrong route is better than a risky move.\n\nvisualSuggestion: Photo of a marked crosswalk at an intersection with turning lanes (use to practice where to look)\nimageSource: Unsplash\nsearchQuery: \"crosswalk intersection turning lane\"\n",
      },
      {
        id: "4",
        title: "Following distance & speed choice",
        content:
          "Main explanation:\nFollowing distance is your reaction time. In normal conditions, keep at least a few seconds behind the vehicle ahead; increase it in rain, snow, darkness, or heavy traffic. Pick a speed that matches what you can see and what you can stop for—not the maximum posted speed. If someone tailgates you, don’t speed up. Create more space in front so you can brake gently if needed.\n\nCommon mistake:\nMatching the speed of traffic even when visibility is limited, or “closing the gap” so others don’t merge.\n\nExaminer tip:\nSmooth driving scores well: steady speed, gentle braking, and space kept. Sudden braking often means you were too close or not scanning.\n\nTest day note:\nNerves make people drive too fast. A calm, controlled speed looks confident to an examiner.\n\nvisualSuggestion: Simple photo showing two cars on a road with visible space between them (use to talk through seconds of distance)\nimageSource: Ontario\nsearchQuery: \"Ontario Driver's Handbook following distance\"\n",
      },
      {
        id: "5",
        title: "Defensive responses (brake, steer, escape routes)",
        content:
          "Main explanation:\nDefensive driving is choosing the safest option early. When a hazard appears, your order is usually: ease off the accelerator, cover the brake, then brake smoothly. Steer only if you have space and you’ve checked it. Always keep an “escape route” in mind: an open lane, a shoulder, or space behind. Avoid last-second swerves; they cause loss of control.\n\nCommon mistake:\nPanic steering without checking mirrors or side space, or braking too late and too hard.\n\nExaminer tip:\nThey’re watching how you manage risk: early speed changes, controlled braking, and clear decisions beat dramatic reactions.\n\nTest day note:\nIf something unexpected happens, prioritize safety over perfection. Slow down, stabilize the car, then continue when safe.\n\nvisualSuggestion: Photo of a road with a clear shoulder or open lane (use to discuss “escape routes”)\nimageSource: Pexels\nsearchQuery: \"two lane road shoulder\"\n",
      },
    ],
  },
  {
    id: "g2-parking-low-speed-control",
    licenseLevel: "G2",
    title: "Parking & Low-Speed Control",
    category: "G2 Road Prep",
    description:
      "Parallel parking, reverse parking, hill parking, and slow-speed control.",
    lessons: [
      {
        id: "1",
        title: "Slow-speed control (creep, clutch/brake balance)",
        content:
          "Main explanation:\nMost parking errors happen because the car is moving too fast. Use slow, controlled movement: gentle brake control in an automatic, or smooth clutch/brake coordination in a manual. Keep your head moving—mirrors and shoulder checks—especially when reversing. If you’re not sure, stop. You can always pause, re-check, and then continue.\n\nCommon mistake:\nRolling while looking, instead of stopping to check. That’s how people clip curbs, lines, or other cars.\n\nExaminer tip:\nThey want to see control: very low speed, full stops when needed, and clear observation (360° checks before backing).\n\nTest day note:\nTake your time. Parking is not graded on speed—it’s graded on safety and control.\n\nvisualSuggestion: Photo showing a car moving slowly in a parking lot with clear lane lines (use to emphasize “slow is safe”)\nimageSource: Unsplash\nsearchQuery: \"car parking lot slow maneuver\"\n",
      },
      {
        id: "2",
        title: "Parallel parking",
        content:
          "Main explanation:\nParallel parking is a positioning task: set up beside the parked car, reverse slowly, and use reference points (your mirrors and the other car’s rear corner) to guide your angle. Keep checking for traffic, cyclists, and pedestrians before and during the maneuver. If you’re too far from the curb or you touch it, stop and correct—small adjustments are normal.\n\nCommon mistake:\nStarting the turn too early or too late, then trying to “save it” by turning quickly at higher speed.\n\nExaminer tip:\nExaminers care most about safety checks and control. A clean setup and slow reverse with repeated checks looks strong.\n\nTest day note:\nIf you need a second attempt, stay calm. A safe correction is better than forcing a bad angle.\n\nvisualSuggestion: Simple top-down diagram/photo of a parallel parking space between two cars\nimageSource: Pexels\nsearchQuery: \"parallel parked cars curb\"\n",
      },
      {
        id: "3",
        title: "Reverse parking",
        content:
          "Main explanation:\nReverse parking is often easier because you can see out when you drive forward to leave. Approach slowly, signal, and position the car so you have space to swing into the stall. Before reversing, do a full 360° check (mirrors + shoulder checks), then back in slowly. Use your mirrors to keep equal spacing from the lines.\n\nCommon mistake:\nRelying only on the backup camera or only on one mirror. Cameras help, but they don’t replace checking for people.\n\nExaminer tip:\nThey want to see observation before and during reversing. A clear stop, scan, then smooth reverse shows control.\n\nTest day note:\nIf someone walks behind you, stop and wait. That’s not a failure—it’s good judgment.\n\nvisualSuggestion: Photo of a car backing into a parking stall (lines clearly visible)\nimageSource: Unsplash\nsearchQuery: \"car reversing into parking spot\"\n",
      },
      {
        id: "4",
        title: "Perpendicular parking",
        content:
          "Main explanation:\nPerpendicular parking is about setting up your approach and turning at the right time. Go slow, signal, and choose a spot that gives you room. Check for pedestrians (especially between parked cars), then turn smoothly into the stall. If you’re off-center, stop and adjust rather than “cutting across” lines at speed.\n\nCommon mistake:\nTurning too sharply because you approached too close or too fast, then ending up crooked.\n\nExaminer tip:\nThey’re watching for observation and lane discipline in the lot: driving on the correct side, yielding, and controlling speed.\n\nTest day note:\nParking lots are busy. Treat them like roads: scan, yield, and be patient.\n\nvisualSuggestion: Photo of a parking lot with clear perpendicular stalls and a car centered in one spot\nimageSource: Pexels\nsearchQuery: \"parking lot perpendicular parking\"\n",
      },
      {
        id: "5",
        title: "Hill parking (uphill/downhill)",
        content:
          "Main explanation:\nHill parking is a safety routine. Always set the parking brake. Turn your wheels so the car would roll into the curb (or away from traffic) if it moved. Use the curb as a backup: after turning the wheel, let the car roll gently until the tire touches the curb, then stop. On a downhill, your wheel direction changes compared to uphill. If there’s no curb, turn the wheels so the car rolls off the road surface if it moved.\n\nCommon mistake:\nForgetting the parking brake or turning wheels the wrong direction.\n\nExaminer tip:\nThis is a “show you know” item. Examiners often watch wheel direction and whether you secure the vehicle properly.\n\nTest day note:\nTake a second to think before you set the wheels—rushing causes wrong-direction errors.\n\nvisualSuggestion: Simple photo of a car parked on a hill near a curb (use to discuss wheel direction)\nimageSource: Ontario\nsearchQuery: \"Ontario Driver's Handbook hill parking wheels\" \n",
      },
    ],
  },
];

export const LICENSE_LABELS: Record<LicenseLevel, string> = {
  G1: "G1 Knowledge",
  G2: "G2 Road Prep",
  G: "G Exit",
};

/** Pathway Selector: G1, G2, G license level cards for the learning modules landing page. */
export interface PathwayLevel {
  licenseLevel: LicenseLevel;
  title: string;
  description: string;
  moduleCount: number;
}

export const PATHWAY_LEVELS: PathwayLevel[] = [
  {
    licenseLevel: "G1",
    title: "Written Knowledge Test",
    description:
      "Master road signs, rules of the road, and safe driving practices to pass your written G1 test.",
    moduleCount: 6,
  },
  {
    licenseLevel: "G2",
    title: "Road Test Level 1",
    description:
      "Prepare for your G2 road test: Ontario licence rules, pre-drive vehicle checks, and core maneuvers like turns, lane changes, and parking.",
    moduleCount: 5,
  },
  {
    licenseLevel: "G",
    title: "Full License Test",
    description:
      "Advanced highway driving, complex intersections, and emergency maneuvers for your G test.",
    moduleCount: 4,
  },
];
