/**
 * Learning Hub module data — edit here to add real content.
 * licenseLevel drives the tab filter on /modules.
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

export const MODULES: ModuleItem[] = [
  {
    id: "g1-signs-signals-markings",
    licenseLevel: "G1",
    title: "Signs, Signals, and Markings",
    category: "G1 Knowledge Path",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    lessons: [
      {
        id: "1",
        title: "Lesson 1: Traffic Signs",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      },
      {
        id: "2",
        title: "Lesson 2: Signals and Markings",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      },
    ],
  },
  {
    id: "g1-right-of-way",
    licenseLevel: "G1",
    title: "Right-of-Way Rules",
    category: "G1 Knowledge Path",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    lessons: [
      {
        id: "1",
        title: "Lesson 1: Understanding Right-of-Way",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      },
      {
        id: "2",
        title: "Lesson 2: Intersections and Yielding",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      },
    ],
  },
  {
    id: "g1-demerit-points",
    licenseLevel: "G1",
    title: "The Demerit Point System",
    category: "G1 Knowledge Path",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    lessons: [
      {
        id: "1",
        title: "Lesson 1: How Demerit Points Work",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      },
      {
        id: "2",
        title: "Lesson 2: Consequences and Suspension",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      },
    ],
  },
  {
    id: "g1-sharing-the-road",
    licenseLevel: "G1",
    title: "Sharing the Road",
    category: "G1 Knowledge Path",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    lessons: [
      {
        id: "1",
        title: "Lesson 1: Pedestrians and Cyclists",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      },
      {
        id: "2",
        title: "Lesson 2: Large Vehicles and Emergency",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      },
    ],
  },
  {
    id: "g1-impaired-driving",
    licenseLevel: "G1",
    title: "Impaired Driving & Legal Limits",
    category: "G1 Knowledge Path",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.",
    lessons: [
      {
        id: "1",
        title: "Lesson 1: Alcohol and Drugs",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      },
      {
        id: "2",
        title: "Lesson 2: Legal Limits and Penalties",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      },
    ],
  },
  {
    id: "g2-highway",
    licenseLevel: "G2",
    title: "Highway Driving",
    category: "Highway",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Highway driving requires higher speeds and merging skills. Practice in low-traffic conditions first.",
    lessons: [
      {
        id: "1",
        title: "Entering the Highway",
        content:
          "Lorem ipsum dolor sit amet. Use the acceleration lane to match highway speed before merging. Signal and check blind spots.",
      },
      {
        id: "2",
        title: "Lane Discipline",
        content:
          "Keep right except to pass. Use the left lane only for passing. Return to the right lane when safe.",
      },
    ],
  },
  {
    id: "g-exit",
    licenseLevel: "G",
    title: "G Exit Test Prep",
    category: "Test Prep",
    description:
      "Final preparation for the full G license. Covers advanced scenarios, highway exit test expectations, and defensive driving review.",
    lessons: [
      {
        id: "1",
        title: "What to Expect on the G Test",
        content:
          "Lorem ipsum dolor sit amet. The G exit test includes highway driving, complex intersections, and independent driving. Be prepared for examiner directions.",
      },
      {
        id: "2",
        title: "Defensive Driving Review",
        content:
          "Scan ahead, manage space, and communicate with other road users. Examiners look for consistent safe habits.",
      },
    ],
  },
];

export const LICENSE_LABELS: Record<LicenseLevel, string> = {
  G1: "G1 Knowledge",
  G2: "G2 Road Prep",
  G: "G Exit",
};
