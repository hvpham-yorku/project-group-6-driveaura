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
      "Rules and restrictions that apply to G2 licence holders in Ontario.",
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
      "Pre-drive inspections, seat and mirror adjustment, warning lights, tires and brakes, visibility, required documents, and hazard awareness — based on the Ontario MTO Driver's Handbook.",
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
      "Master left and right turns, lane changes, reversing, three-point and U-turns, and parking for your G2 road test.",
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
      { id: "1", title: "Scanning & space cushions", content: "" },
      { id: "2", title: "Blind spots & mirror checks", content: "" },
      { id: "3", title: "Intersections & pedestrian hazards", content: "" },
      { id: "4", title: "Following distance & speed choice", content: "" },
      {
        id: "5",
        title: "Defensive responses (brake, steer, escape routes)",
        content: "",
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
      { id: "1", title: "Slow-speed control (creep, clutch/brake balance)", content: "" },
      { id: "2", title: "Parallel parking", content: "" },
      { id: "3", title: "Reverse parking", content: "" },
      { id: "4", title: "Perpendicular parking", content: "" },
      { id: "5", title: "Hill parking (uphill/downhill)", content: "" },
    ],
  },
  {
    id: "g-high-speed-expressway-driving",
    licenseLevel: "G",
    title: "High-Speed Expressway Driving",
    category: "G License: Highway Skills",
    description:
      "Confident merging, lane etiquette, safe space cushions at 100 km/h, and proper exits.",
    lessons: [
      { id: "1", title: "The Entrance Ramp & Acceleration Lane", content: "" },
      { id: "2", title: "Highway Lane Etiquette", content: "" },
      { id: "3", title: "Space Cushions at 100km/h", content: "" },
      { id: "4", title: "Exiting the Expressway", content: "" },
    ],
  },
  {
    id: "g-advanced-lane-management",
    licenseLevel: "G",
    title: "Advanced Lane Management",
    category: "G License: Decision-Making",
    description:
      "Lane changes, passing, blind spots, and Ontario-specific high-speed lane discipline.",
    lessons: [
      { id: "1", title: "The SMOG Technique", content: "" },
      { id: "2", title: "Move Over Rules", content: "" },
      { id: "3", title: "Safe Passing Procedures", content: "" },
      { id: "4", title: "Blind Spots & Truck Safety", content: "" },
    ],
  },
  {
    id: "g-complex-intersections-hazard-perception",
    licenseLevel: "G",
    title: "Complex Intersections & Hazard Perception",
    category: "G License: Module 3",
    description:
      "Master intersection scanning, conflict management, and hazard prioritization.",
    lessons: [
      { id: "1", title: "Intersection Scan and Conflict Management", content: "" },
      { id: "2", title: "Protected vs. Unprotected Left Turns", content: "" },
      { id: "3", title: "Rail Crossings, Buses, and School Zones", content: "" },
    ],
  },
  {
    id: "g-system-of-driving-oea",
    licenseLevel: "G",
    title: "The System of Driving (Observe, Evaluate, Act)",
    category: "G License: Module 4",
    description:
      "Apply OEA and space-cushion strategy for better real-time decisions.",
    lessons: [
      { id: "1", title: "Observe, Evaluate, Act in Real Traffic", content: "" },
      { id: "2", title: "Escape Routes and Decision Timing", content: "" },
      { id: "3", title: "Highway OEA Under Pressure", content: "" },
    ],
  },
  {
    id: "g-environmental-awareness-eco-driving",
    licenseLevel: "G",
    title: "Environmental Awareness & Eco-Driving",
    category: "G License: Module 5",
    description:
      "Weather adaptation, visibility strategy, and eco-driving habits.",
    lessons: [
      { id: "1", title: "Adverse Conditions and Efficient Driving", content: "" },
      { id: "2", title: "Night Driving and Visibility Strategy", content: "" },
      { id: "3", title: "Skid Prevention and Recovery Basics", content: "" },
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
      "Learn practical driving skills, highway entry, and three-point turns for your G2 road test.",
    moduleCount: 5,
  },
  {
    licenseLevel: "G",
    title: "Full License Test",
    description:
      "Advanced highway driving, complex intersections, and emergency maneuvers for your G test.",
    moduleCount: 5,
  },
];
