/**
 * Learning Hub module data — G1 Phase 1 (Theory) only for now.
 * licenseLevel drives the pathway and module list on /modules.
 */
export type LicenseLevel = "G1" | "G2" | "G";

export interface Lesson {
  id: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  note?: string;
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
      {
        id: "1",
        title: "Stay Calm and Check for Injuries",
        content: "If an accident happens, the first thing is to stay calm and check if anyone is injured.",
        bulletPoints: [
          "Check yourself and passengers",
          "Check people in the other vehicle",
          "Call 911 immediately if someone is injured",
        ],
      },
      {
        id: "2",
        title: "Move to a Safe Location",
        content: "If the accident is minor and the vehicles can move:",
        bulletPoints: [
          "Turn on hazard lights",
          "Move the vehicle to the side of the road",
          "Avoid blocking traffic",
        ],
      },
      {
        id: "3",
        title: "Call Emergency Services if Needed",
        content: "Call 911 if:",
        bulletPoints: [
          "Someone is injured",
          "Vehicles are heavily damaged",
          "The road is blocked",
          "There is a fire or danger",
        ],
      },
      {
        id: "4",
        title: "Exchange Information",
        content: "Drivers must exchange important details. Collect:",
        bulletPoints: [
          "Full name",
          "Phone number",
          "Driver's license number",
          "License plate number",
          "Insurance company and policy number",
        ],
      },
      {
        id: "5",
        title: "Document the Scene",
        content: "Take photos and gather evidence. Important things to photograph:",
        bulletPoints: [
          "Damage to vehicles",
          "License plates",
          "Road conditions",
          "Traffic signs or signals",
          "Position of vehicles",
        ],
      },
      {
        id: "6",
        title: "Report the Accident",
        content: "In Ontario, accidents must be reported if:",
        bulletPoints: [
          "Damage exceeds $2000",
          "Someone is injured",
        ],
        note: "You must report to a Collision Reporting Centre.",
      },
    ],
  },
  {
    id: "g2-vehicle-interior-essentials",
    licenseLevel: "G2",
    title: "Interior Essentials: Vehicle Explorer",
    category: "G2 Road Prep",
    description:
      "Interactive interior explorer: cabin overview, instrument cluster, steering stalks, and center console — everything you need to know before your G2 road test.",
    lessons: [
      { id: "1", title: "Cabin & Instrument Cluster", content: "" },
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
          "Effective scanning means moving your eyes continuously — not staring at the vehicle ahead. Aim to look 12–15 seconds ahead in city driving and up to 30 seconds on highways so you have time to react before a hazard reaches you.",
        bulletPoints: [
          "Sweep your eyes from side to side across the full width of the road",
          "Check your mirrors every 5–8 seconds to maintain situational awareness",
          "Maintain a space cushion on all four sides of your vehicle — front, rear, left, and right",
          "If a vehicle closes your front cushion, ease off the gas to rebuild your following gap",
          "Identify an escape route (open lane or shoulder) before you actually need it",
        ],
      },
      {
        id: "2",
        title: "Blind spots & mirror checks",
        content:
          "Mirrors eliminate most blind spots, but not all. The zone alongside your rear quarter panel — roughly beside and slightly behind your shoulder — cannot be seen in any mirror. A quick shoulder check before every lane change or merge is mandatory.",
        bulletPoints: [
          "Set mirrors before every drive: side mirrors should barely show the side of your car",
          "Check mirrors before braking, turning, changing lanes, and when stopped at lights",
          "Perform a shoulder check over the appropriate shoulder for the direction you are moving",
          "Cyclists and motorcyclists frequently occupy blind spots — always check twice",
          "Convex (wide-angle) passenger mirrors compress distance; objects are closer than they appear",
        ],
        note: "Ontario law requires a shoulder check before every lane change and merge.",
      },
      {
        id: "3",
        title: "Intersections & pedestrian hazards",
        content:
          "More than 40% of collisions occur at or near intersections. Even when you have a green light, scan left-right-left before proceeding and watch for pedestrians who may still be crossing.",
        bulletPoints: [
          "Slow down and cover the brake as you approach any intersection",
          "Scan left, right, then left again before entering, even on a green",
          "Watch for pedestrians starting to cross on the opposite pedestrian signal",
          "Be alert for drivers running red or amber lights from cross traffic",
          "Treat every uncontrolled intersection (no sign or signal) as a yield",
          "Look for cyclists in the crosswalk or alongside your vehicle before turning right",
        ],
      },
      {
        id: "4",
        title: "Following distance & speed choice",
        content:
          "The 3-second rule gives you minimum safe following distance at normal speeds. Increase to 4–5 seconds in rain, snow, fog, or when following large trucks. Never drive faster than conditions allow — posted limits assume ideal conditions.",
        bulletPoints: [
          "Pick a fixed landmark; count '1 one-thousand, 2 one-thousand, 3 one-thousand' after the car ahead passes it",
          "If you reach the landmark before finishing the count, drop back",
          "Double your gap at night, in rain, snow, or fog",
          "Leave extra space behind large trucks — their stopping distance is much longer",
          "Adjust speed for curves, hills, slippery surfaces, and reduced visibility — not just speed signs",
          "Slow down before a curve, not during it",
        ],
      },
      {
        id: "5",
        title: "Defensive responses (brake, steer, escape routes)",
        content:
          "When a hazard appears, most drivers instinctively steer around it faster than they can stop. Practice identifying your escape route before you need it — open lane, shoulder, or empty curb lane. If braking hard, brake in a straight line whenever possible.",
        bulletPoints: [
          "Look where you want to go, not at the hazard — your vehicle follows your eyes",
          "In a panic stop with ABS: press the brake pedal hard and hold it down; do not pump",
          "If ABS is not available, threshold brake — apply firm pressure just short of lockup",
          "Steering around an obstacle is often faster than braking to a stop at highway speeds",
          "Always have a pre-planned escape: empty lane to the right is the safest default",
          "After avoiding a hazard, check mirrors and re-establish a safe following gap",
        ],
        note: "ABS is standard on all vehicles made after 2004. Do not pump the brake — hold it down and steer.",
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
          "Low-speed manoeuvres require smooth, precise control of throttle, brake, and steering. In automatic vehicles, use light throttle or let the vehicle creep at idle. In manual vehicles, feather the clutch at the friction point to control crawl speed without stalling.",
        bulletPoints: [
          "In automatic: release the brake gently to creep; tap the brake to slow or stop without lurching",
          "In manual: find the clutch friction point — the vehicle moves without engine lag or stalling",
          "Use only fingertip pressure on the steering wheel; over-gripping reduces sensitivity at low speed",
          "Look in the direction you are moving, not directly in front of the bumper",
          "At very low speeds, small steering inputs have large effects — move the wheel slowly",
          "In tight spaces, use a spotter outside the vehicle and stop the moment they signal",
        ],
      },
      {
        id: "2",
        title: "Parallel parking",
        content:
          "Parallel parking means reversing into a space alongside the curb between two parked vehicles. The space must be at least 1.5 times the length of your vehicle. Signal, scan, and reverse slowly — this is the manoeuvre most commonly tested on the G2 road test.",
        bulletPoints: [
          "Signal and stop alongside the vehicle ahead of the space, leaving about 1 metre between you",
          "Reverse slowly until your rear bumper is level with that vehicle's rear bumper",
          "Turn the wheel sharply toward the curb (right for right-side parking)",
          "When your vehicle is at a 45-degree angle to the curb, straighten the wheel",
          "Continue reversing until your front clears the vehicle ahead, then turn the wheel away from the curb",
          "Pull forward to centre yourself in the space — aim to finish within 30 cm of the curb",
          "Check both mirrors and do a shoulder check before opening your door",
        ],
        note: "Ontario law: park within 15 cm of the curb. Signal before every parallel park attempt.",
      },
      {
        id: "3",
        title: "Reverse parking",
        content:
          "Reverse parking (backing into a space) is safer for exiting because you leave nose-first into traffic with full visibility. It takes more time to park but significantly reduces the risk when leaving. Many G2 examiners look for this skill.",
        bulletPoints: [
          "Drive past the space and signal before stopping",
          "Check mirrors and blind spots; reverse slowly toward the space entrance",
          "Turn the wheel toward the space once your rear axle aligns with the space edge",
          "Straighten the wheel as the vehicle enters the space and centre yourself between the lines",
          "Use all mirrors plus shoulder checks throughout — parking sensors are a supplement, not a substitute",
          "Stop before any part of the vehicle overhangs the end of the space",
        ],
      },
      {
        id: "4",
        title: "Perpendicular parking",
        content:
          "Perpendicular (angle) parking is common in lots and garages. You can enter nose-first or reverse-in; reverse-in is preferred because exiting forward is safer. Always park centred in the bay and ensure you leave enough room for passengers to open doors.",
        bulletPoints: [
          "Approach at a slow, steady speed and signal your intention",
          "For nose-in: begin turning early so the vehicle tracks into the centre of the bay",
          "For reverse-in: drive one bay past and then reverse, turning sharply into the space",
          "Check that you are centred between the lines before shutting off",
          "Look for pedestrians walking behind parked cars before reversing out",
          "When reversing out, back slowly until you can see past the adjacent vehicles, then stop and check both ways",
        ],
      },
      {
        id: "5",
        title: "Hill parking (uphill/downhill)",
        content:
          "When parking on a hill, gravity must be counteracted by both the parking brake and the wheels turned to use the curb as a physical stop. If the parking brake ever fails, the wheel position determines whether the vehicle rolls into traffic or into the curb.",
        bulletPoints: [
          "Uphill with a curb: turn front wheels away from the curb (to the left); if brakes fail, the curb stops the car",
          "Downhill with a curb: turn front wheels toward the curb (to the right); curb acts as a wheel stop",
          "No curb (uphill or downhill): turn front wheels toward the edge of the road (right), so the car rolls off the road rather than into traffic",
          "Always apply the parking brake before shifting to Park (automatic) or selecting a gear (manual)",
          "On steep hills, leave the vehicle in a lower gear to add engine braking resistance",
          "Place a wheel chock if available — especially on very steep slopes or in a manual vehicle",
        ],
        note: "Ontario G2 road test includes hill parking. An examiner will check wheel direction and parking brake engagement.",
      },
    ],
  },
  {
    id: "g-high-speed-expressway-driving",
    licenseLevel: "G",
    title: "High-Speed Expressway Driving",
    category: "G License: Highway Skills",
    description:
      "Confident merging, lane etiquette, safe space cushions at 100 km/h, and proper exits—key skills from the MTO Driver’s Handbook (Chapter 2).",
    lessons: [
      {
        id: "1.1",
        title: "The Entrance Ramp & Acceleration Lane",
        content:
          "Interactive lesson: ramp → acceleration lane → merge (MTO handbook based).",
      },
      {
        id: "1.2",
        title: "Highway Lane Etiquette",
        content:
          "Interactive lesson: keep right except to pass + HOV basics (MTO handbook based).",
      },
      {
        id: "1.3",
        title: "Space Cushions at 100km/h",
        content:
          "Interactive lesson: 3‑second rule, weather adjustments, and avoiding “wolf packs.”",
      },
      {
        id: "1.4",
        title: "Exiting the Expressway",
        content:
          "Interactive lesson: signal early, deceleration lane, and safe “missed exit” decisions.",
      },
    ],
  },
  {
    id: "g-advanced-lane-management",
    licenseLevel: "G",
    title: "Advanced Lane Management",
    category: "G License: Decision-Making",
    description:
      "Lane changes, passing, blind spots, and Ontario-specific laws—advanced habits drawn from the MTO Driver’s Handbook (Chapters 2 & 4).",
    lessons: [
      {
        id: "2.1",
        title: "The SMOG Technique",
        content:
          "Interactive lesson: SMOG (Signal, Mirror, Over‑shoulder, Go) with pro‑tips.",
      },
      {
        id: "2.2",
        title: "The Move Over Law (Ontario Highway Traffic Act)",
        content:
          "Interactive lesson: Move Over law—slow down and move over when safe.",
      },
      {
        id: "2.3",
        title: "Safe Passing Procedures",
        content:
          "Interactive lesson: safe passing checks, rules, and no‑pass zones (MTO handbook).",
      },
      {
        id: "2.4",
        title: "Blind Spots & Truck Safety",
        content:
          "Interactive lesson: truck no‑zones and safe passing space cushions.",
      },
    ],
  },
  {
    id: "g-complex-intersections-hazard-perception",
    licenseLevel: "G",
    title: "Complex Intersections & Hazard Perception",
    category: "G License: Module 3",
    description:
      "Master 360-degree scanning, truck no-zones, and pedestrian crossover right-of-way using MTO Chapter 2 principles.",
    lessons: [
      {
        id: "3.1",
        title: "Intersection Scan and Conflict Management",
        content:
          "Interactive lesson: 360 scan, large-vehicle no-zones, and crossover hazard priorities.",
      },
      {
        id: "3.2",
        title: "Protected vs. Unprotected Left Turns",
        content:
          "Interactive lesson: risk checks for left turns across traffic (MTO Chapter 2).",
      },
      {
        id: "3.3",
        title: "Rail Crossings, Buses, and School Zones",
        content:
          "Interactive lesson: legal stopping priorities and hazard anticipation at controlled conflict points.",
      },
    ],
  },
  {
    id: "g-system-of-driving-oea",
    licenseLevel: "G",
    title: "The System of Driving (Observe, Evaluate, Act)",
    category: "G License: Module 4",
    description:
      "Apply the OEA method and space-cushion strategy for better decision-making at city and highway speeds.",
    lessons: [
      {
        id: "4.1",
        title: "Observe, Evaluate, Act in Real Traffic",
        content:
          "Interactive lesson: OEA flow and 2-second vs 3-second space-cushion comparison.",
      },
      {
        id: "4.2",
        title: "Escape Routes and Decision Timing",
        content:
          "Interactive lesson: building escape options and choosing early low-risk actions.",
      },
      {
        id: "4.3",
        title: "Highway OEA Under Pressure",
        content:
          "Interactive lesson: applying OEA during merges, lane closures, and fast-changing traffic.",
      },
    ],
  },
  {
    id: "g-environmental-awareness-eco-driving",
    licenseLevel: "G",
    title: "Environmental Awareness & Eco-Driving",
    category: "G License: Module 5",
    description:
      "Adjust safely to rain/snow and reduce fuel and wear with practical eco-driving habits from MTO Chapter 4.",
    lessons: [
      {
        id: "5.1",
        title: "Adverse Conditions and Efficient Driving",
        content:
          "Interactive lesson: weather toggle for follow-distance targets and eco-driving checklist.",
      },
      {
        id: "5.2",
        title: "Night Driving and Visibility Strategy",
        content:
          "Interactive lesson: headlight discipline, glare control, and nighttime hazard scanning.",
      },
      {
        id: "5.3",
        title: "Skid Prevention and Recovery Basics",
        content:
          "Interactive lesson: traction limits, smooth inputs, and skid-response priorities.",
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
    moduleCount: 6,
  },
  {
    licenseLevel: "G",
    title: "Full License Test",
    description:
      "Advanced highway driving, complex intersections, and emergency maneuvers for your G test.",
    moduleCount: 5,
  },
];
