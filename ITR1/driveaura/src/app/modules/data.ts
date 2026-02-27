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
      { id: "2", title: "Warning signs and pavement lines", content: "" },
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
      { id: "2", title: "Consequences and suspension", content: "" },
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
      {
        id: "1",
        title: "Streetcars and school buses",
        content: `
### G1: Sharing the Road – Overview

Sharing the road means driving in a way that keeps pedestrians, cyclists, and other drivers safe. You need to know who you share the road with and how to give them space.

- **Learning objective 1**: Recognize the main road users you will drive around (pedestrians, cyclists, large vehicles, school buses, emergency vehicles).
- **Learning objective 2**: Understand why giving others space and respecting right-of-way reduces crashes and tickets in Ontario.

**Quick knowledge check**

Q1: Why is it important for a G1 driver to learn how to share the road with other road users?

### G1.2: School Buses and Streetcars – Key Rules

- **School buses (no median)**: Stop in both directions when red lights flash and the stop arm is out. Stay at least 20 metres back until the lights stop.
- **School buses (divided road with median)**: Only vehicles behind the bus must stop; oncoming traffic can continue with caution.
- **Streetcars without a safety island**: Stop at least 2 metres behind the rear door and wait until passengers are safely off the road.

**Quick knowledge check**

Q2: On a two-lane road with no median, what must you do when a school bus has its red lights flashing and stop arm extended?
        `,
      },
      {
        id: "2",
        title: "Cyclists and other road users",
        content: `
### G1.1: Who You Share the Road With

On Ontario roads, you are **never alone**. You must drive in a way that protects more vulnerable road users.

- **Pedestrians**: People walking, running, using mobility devices, or crossing at intersections and crosswalks.
- **Cyclists**: Riders in bike lanes, on the right side of the road, or crossing intersections.
- **Motorcyclists and moped riders**: Smaller, harder to see, and more exposed than car drivers.
- **Large vehicles**: Buses and transport trucks that need more space to turn, change lanes, and stop.
- **School buses**: Vehicles carrying children, with strict stopping and passing rules.
- **Emergency vehicles**: Police, fire, and ambulances that may need you to move over or stop quickly.

### G1.3: Safe Space for Cyclists and Pedestrians

- **Passing cyclists**: In Ontario, leave at least 1 metre of space when passing a cyclist, where possible. Change lanes to pass if you need more room.
- **Right turns and bike lanes**: Check mirrors and do a right shoulder check before turning across a bike lane. Yield to any cyclist beside or just behind you.
- **Crosswalks and turning**: When turning at an intersection, yield to pedestrians already in the crosswalk you are entering.

### G1.4: Large Vehicles and Blind Spots

- **No-zones**: Avoid driving beside or close behind large trucks and buses; if you can’t see their mirrors, they likely can’t see you.
- **Wide turns**: Never squeeze between a large vehicle and the curb when it is turning right; it may swing wide then move back.
- **Stopping distance**: Do not cut in front of large vehicles; they need more space to stop than a car.

**Quick knowledge check**

- Q3: In Ontario, how much space should you leave when passing a cyclist, where possible?
- Q4: Why is it unsafe to drive beside a large truck in its blind spot for a long time?
        `,
      },
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
    moduleCount: 5,
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
    moduleCount: 4,
  },
];
