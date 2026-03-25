/**
 * Learning Hub module data — G1 Phase 1 (Theory) only for now.
 * licenseLevel drives the pathway and module list on /modules.
 */
export type LicenseLevel = "G1" | "G2" | "G";

export type VisualSource = "Ontario" | "Unsplash" | "Pexels";

export type LessonVisual = {
  visualSuggestion: string;
  imageSource: VisualSource;
  searchQuery: string;
};

export interface Lesson {
  id: string;
  title: string;
  content: string;
  /** Optional internal visual reference (not rendered by the lesson UI). */
  visual?: LessonVisual;
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
          "A good driver is “reading the road” all the time—not staring at the bumper in front. Use an active scan: far ahead (what’s changing), near ahead (your lane), then mirrors (what’s around you), then back to the road. Your goal is a space cushion: room in front, space to the sides when possible, and awareness of what’s behind. Watch out for tunnel vision—people often miss a pedestrian stepping out, a vehicle from a side street, or a fast-approaching car behind. Examiners like calm, visible scanning and early speed adjustments. If you feel rushed on test day, slow your scan down (not your reactions) and create space earlier.",
        visual: {
          visualSuggestion:
            "Photo from the driver’s perspective showing cars ahead and side streets (use it to practice “far–near–mirrors” scanning).",
          imageSource: "Unsplash",
          searchQuery: "driver view through windshield city traffic",
        },
      },
      {
        id: "2",
        title: "Blind spots & mirror checks",
        content:
          "Mirrors help, but they don’t show everything. Before changing lanes, moving around a parked car, or merging, check mirrors first, then do a quick shoulder check into the blind spot, then move smoothly if it’s clear. Keep head checks quick so your eyes leave the road for the shortest time possible. Watch out for skipping the shoulder check because you “already looked in the mirror,” or turning too long and drifting. Examiners expect a complete sequence with space kept. If you’re unsure on test day, don’t force it—cancel the signal, hold your lane, and try again when there’s a safe gap.",
        visual: {
          visualSuggestion:
            "Photo showing a side mirror with adjacent-lane traffic (use it to explain blind spots and why shoulder checks matter).",
          imageSource: "Pexels",
          searchQuery: "car side mirror blind spot",
        },
      },
      {
        id: "3",
        title: "Intersections & pedestrian hazards",
        content:
          "Most serious surprises happen at intersections: left turns, pedestrians stepping off the curb, cyclists beside you, and vehicles pushing late yellow/red. Approach with a plan—scan left/centre/right near the crosswalk, check mirrors before braking, and be ready to stop if anything is uncertain. When turning, double-check the crosswalk and complete your turn into the correct lane. Watch out for rushing because the light is changing; that’s when people miss pedestrians. Examiners like early slowing, clear checks, and controlled turns. If you miss a turn on test day, keep going safely—route errors are better than risky moves.",
        visual: {
          visualSuggestion:
            "Photo of a marked crosswalk at an intersection with turning lanes (use it to practice where to look before and during a turn).",
          imageSource: "Unsplash",
          searchQuery: "crosswalk intersection turning lane",
        },
      },
      {
        id: "4",
        title: "Following distance & speed choice",
        content:
          "Following distance is your reaction time. In normal conditions, keep a few seconds behind the vehicle ahead and increase it in rain, snow, darkness, or heavy traffic. Choose a speed that matches what you can see and what you can stop for—not just the posted limit. If someone tailgates you, don’t speed up; create more space in front so you can brake gently. Watch out for “closing the gap” to block merges—smooth driving with space kept scores well. On test day, calm speed choice looks confident and controlled.",
        visual: {
          visualSuggestion:
            "Simple diagram or photo showing safe following distance between vehicles (use it to talk through “seconds” of space).",
          imageSource: "Ontario",
          searchQuery: "Ontario Driver's Handbook following distance",
        },
      },
      {
        id: "5",
        title: "Defensive responses (brake, steer, escape routes)",
        content:
          "Defensive driving is choosing the safest option early. When a hazard appears, ease off the accelerator, cover the brake, then brake smoothly. Steer only if you have space and you’ve checked it. Keep an escape option in mind (an open lane, a shoulder, or space behind), and avoid last-second swerves. Watch out for panic steering without checking mirrors or side space, or braking too late and too hard. Examiners reward early risk management and controlled responses. If something unexpected happens on test day, prioritize safety—slow down, stabilize the car, then continue when safe.",
        visual: {
          visualSuggestion:
            "Photo of a road with a clear shoulder or open lane (use it to discuss escape options and planning space).",
          imageSource: "Pexels",
          searchQuery: "two lane road shoulder",
        },
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
          "Most parking errors happen because the car is moving too fast. Use very slow, controlled movement: gentle brake control in an automatic, or smooth clutch/brake coordination in a manual. Keep your head moving—mirrors and shoulder checks—especially when reversing. If you’re not sure, stop. Watch out for rolling while you look; that’s how people clip curbs, lines, or other cars. Examiners want clear observation (a full check before backing) and steady control. Take your time on test day—parking is graded on safety, not speed.",
        visual: {
          visualSuggestion:
            "Photo showing a car moving slowly in a parking lot with clear lane lines (use it to reinforce that slow control is safer).",
          imageSource: "Unsplash",
          searchQuery: "car parking lot slow maneuver",
        },
      },
      {
        id: "2",
        title: "Parallel parking",
        content:
          "Parallel parking is a positioning task: set up beside the parked car, reverse slowly, and use reference points (mirrors and the other car’s rear corner) to guide your angle. Check for traffic, cyclists, and pedestrians before and during the maneuver. If you’re too far from the curb, stop and correct—small adjustments are normal. Watch out for turning too early/late and then trying to “save it” by moving faster. Examiners care most about observation and control. If you need a second attempt on test day, stay calm and correct safely.",
        visual: {
          visualSuggestion:
            "Top-down style photo showing cars along a curb (use it to explain where a parallel space starts/ends).",
          imageSource: "Pexels",
          searchQuery: "parallel parked cars curb",
        },
      },
      {
        id: "3",
        title: "Reverse parking",
        content:
          "Reverse parking is often easier because you can see out when you drive forward to leave. Approach slowly, signal, and position the car so you have room to swing into the stall. Before reversing, do a full check around the vehicle, then back in slowly. Use your mirrors to keep equal spacing from the lines. Watch out for relying only on a backup camera or only one mirror—cameras help, but they don’t replace checks for people. Examiners want to see observation before and during reversing. If someone walks behind you on test day, stop and wait; that’s good judgment.",
        visual: {
          visualSuggestion:
            "Photo of a car backing into a parking stall with clear painted lines (use it to discuss alignment and low speed).",
          imageSource: "Unsplash",
          searchQuery: "car reversing into parking spot",
        },
      },
      {
        id: "4",
        title: "Perpendicular parking",
        content:
          "Perpendicular parking depends on a good setup and a smooth, slow turn. Signal, choose a spot with room, and watch for pedestrians—especially between parked cars. If you’re off-centre, stop and adjust rather than cutting across lines at speed. Watch out for approaching too close or too fast; that leads to sharp turns and crooked parking. Examiners also watch how you drive through the lot: correct side, yielding, and controlled speed. On test day, treat the lot like a road—scan, yield, and be patient.",
        visual: {
          visualSuggestion:
            "Photo of a parking lot with clear perpendicular stalls and a car centered in one spot (use it to discuss alignment).",
          imageSource: "Pexels",
          searchQuery: "parking lot perpendicular parking",
        },
      },
      {
        id: "5",
        title: "Hill parking (uphill/downhill)",
        content:
          "Hill parking is a safety routine. Always set the parking brake. Turn your wheels so the vehicle would roll into the curb (or away from traffic) if it moved. Use the curb as a backup: after turning the wheel, let the car roll gently until the tire touches the curb, then stop. Downhill wheel direction differs from uphill, and if there’s no curb you still turn the wheels so the car would roll off the road surface if it moved. Watch out for forgetting the parking brake or setting wheels the wrong way. Examiners often watch wheel direction closely. On test day, take an extra second to think before you set the wheels—rushing causes wrong-direction mistakes.",
        visual: {
          visualSuggestion:
            "Handbook-style image or photo of a car parked on a hill near a curb (use it to discuss wheel direction uphill vs downhill).",
          imageSource: "Ontario",
          searchQuery: "Ontario Driver's Handbook hill parking wheels",
        },
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
