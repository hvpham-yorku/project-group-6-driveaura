/**
 * Quiz data — one quiz per learning module. Edit here to add real questions.
 * quizId matches module id from /modules for "test your knowledge" pairing.
 */
import type { LicenseLevel } from "../modules/data";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number; // 0-based index of correct option
}

export interface QuizItem {
  id: string; // same as module id
  licenseLevel: LicenseLevel;
  title: string;
  category: string;
  description: string;
  questionCount: number;
  questions: QuizQuestion[];
}

export const QUIZZES: QuizItem[] = [
  {
    id: "g1-signs-signals-markings",
    licenseLevel: "G1",
    title: "Signs, Signals, and Markings",
    category: "G1 Knowledge Path",
    description:
      "Regulatory, warning, and pavement line markings you need to know for the G1 written test.",
    questionCount: 5,
    questions: [
      {
        id: "1",
        prompt: "What does a red octagonal sign mean?",
        options: ["Yield", "Stop", "No entry", "Slow down"],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "A yellow diamond-shaped sign typically indicates:",
        options: [
          "A regulatory requirement",
          "A warning or hazard ahead",
          "A destination",
          "A speed limit",
        ],
        correctIndex: 1,
      },
      {
        id: "3",
        prompt: "What does a solid yellow line on your side of the centre of the road mean?",
        options: [
          "Passing is encouraged",
          "Passing is not allowed",
          "Lane is for buses only",
          "Reduce speed only",
        ],
        correctIndex: 1,
      },
      {
        id: "4",
        prompt: "A flashing green light at an intersection means:",
        options: [
          "Stop and wait",
          "Left-turn advance: you may turn left through the intersection",
          "Proceed with caution only",
          "Yield to pedestrians",
        ],
        correctIndex: 1,
      },
      {
        id: "5",
        prompt: "What does a blue sign with a white letter 'P' indicate?",
        options: ["Police station", "Parking", "Pedestrian crossing", "Passing zone"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "g1-right-of-way",
    licenseLevel: "G1",
    title: "Right-of-Way Rules",
    category: "G1 Knowledge Path",
    description:
      "4-way stops, yielding, and emergency vehicles — when to go and when to wait.",
    questionCount: 5,
    questions: [
      {
        id: "1",
        prompt: "At a 4-way stop, who goes first when two vehicles arrive at the same time?",
        options: [
          "The vehicle on the left",
          "The vehicle on the right",
          "The larger vehicle",
          "The first to come to a complete stop",
        ],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "When an emergency vehicle with lights and siren is approaching from behind, you should:",
        options: [
          "Speed up to get out of the way",
          "Pull to the right and stop if safe",
          "Stop in your lane immediately",
          "Change lanes only",
        ],
        correctIndex: 1,
      },
      {
        id: "3",
        prompt: "At an uncontrolled intersection (no signs or signals), you must yield to:",
        options: [
          "No one; first to enter goes",
          "Vehicles approaching from your right",
          "Only pedestrians",
          "Only larger vehicles",
        ],
        correctIndex: 1,
      },
      {
        id: "4",
        prompt: "When turning left at an intersection, you must yield to:",
        options: [
          "No one",
          "Oncoming vehicles and pedestrians in your path",
          "Only vehicles on your right",
          "Only vehicles already in the intersection",
        ],
        correctIndex: 1,
      },
      {
        id: "5",
        prompt: "When a streetcar has stopped to pick up or let off passengers and there is no safety zone, you must:",
        options: [
          "Pass on the left only",
          "Stop behind the rear door and wait until passengers are clear",
          "Sound your horn and proceed",
          "Pass at reduced speed only",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "g1-demerit-points",
    licenseLevel: "G1",
    title: "The Demerit Point System",
    category: "G1 Knowledge Path",
    description:
      "The consequences of traffic violations in Ontario and how demerit points affect your licence.",
    questionCount: 5,
    questions: [
      {
        id: "1",
        prompt: "In Ontario, demerit points stay on your record for:",
        options: ["6 months", "1 year", "2 years from the offence date", "5 years"],
        correctIndex: 2,
      },
      {
        id: "2",
        prompt: "A fully licensed driver (G) can accumulate how many demerit points before a warning letter?",
        options: ["2–5 points", "6–8 points", "9–14 points", "15+ points"],
        correctIndex: 1,
      },
      {
        id: "3",
        prompt: "Novice drivers (G1, G2) face licence suspension for accumulating how many demerit points?",
        options: ["2 points", "4 points", "6 points", "9 points"],
        correctIndex: 2,
      },
      {
        id: "4",
        prompt: "Failing to yield to a pedestrian in a crosswalk typically results in how many demerit points?",
        options: ["0", "2", "4", "6"],
        correctIndex: 2,
      },
      {
        id: "5",
        prompt: "Speeding 30 km/h or more over the limit can result in:",
        options: [
          "Demerit points only",
          "Demerit points and possible licence suspension",
          "A warning only",
          "No demerit points",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "g1-sharing-the-road",
    licenseLevel: "G1",
    title: "Sharing the Road",
    category: "G1 Knowledge Path",
    description:
      "Rules for streetcars, school buses, and cyclists so everyone stays safe.",
    questionCount: 5,
    questions: [
      {
        id: "1",
        prompt: "When a school bus has its red lights flashing and stop arm extended, you must:",
        options: [
          "Slow down and pass with caution",
          "Stop until the lights stop flashing and the arm is withdrawn",
          "Stop only if children are visible",
          "Honk and proceed slowly",
        ],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "How much space should you leave when passing a cyclist?",
        options: [
          "As close as possible",
          "At least 1 metre where possible",
          "Only in the same lane",
          "No minimum; use your judgment",
        ],
        correctIndex: 1,
      },
      {
        id: "3",
        prompt: "When a streetcar is stopped and there is a safety zone (island), you must:",
        options: [
          "Pass on the left of the safety zone",
          "Stop and wait until passengers are clear of the roadway",
          "Speed up to pass quickly",
          "Only yield to pedestrians",
        ],
        correctIndex: 1,
      },
      {
        id: "4",
        prompt: "Cyclists on the road have:",
        options: [
          "No rights; they must use the sidewalk",
          "The same rights and duties as drivers of vehicles",
          "Right-of-way over all vehicles",
          "Only rights in bike lanes",
        ],
        correctIndex: 1,
      },
      {
        id: "5",
        prompt: "When driving near large trucks, you should avoid:",
        options: [
          "Passing on the right",
          "Driving in the truck's blind spots (especially the right side and directly behind)",
          "Using your signals",
          "Maintaining a steady speed",
        ],
        correctIndex: 1,
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
    questionCount: 5,
    questions: [
      {
        id: "1",
        prompt: "For fully licensed drivers (G) age 21 and over, the legal blood alcohol concentration (BAC) limit in Ontario is:",
        options: ["0.00%", "0.05%", "0.08%", "0.10%"],
        correctIndex: 2,
      },
      {
        id: "2",
        prompt: "For G1 and G2 drivers, the legal BAC limit is:",
        options: ["0.00%", "0.05%", "0.08%", "Any amount under 0.08%"],
        correctIndex: 0,
      },
      {
        id: "3",
        prompt: "In Ontario, drivers in the G1 or G2 program must have zero alcohol in their system. This means:",
        options: [
          "One drink is acceptable",
          "No alcohol is allowed before driving",
          "Only cannabis is restricted",
          "Only the driver over 21 can have alcohol",
        ],
        correctIndex: 1,
      },
      {
        id: "4",
        prompt: "Using cannabis (recreational or medical) before driving:",
        options: [
          "Is legal if you have a prescription",
          "Can impair driving and is subject to penalties",
          "Is only illegal for G1/G2 drivers",
          "Has no legal consequences",
        ],
        correctIndex: 1,
      },
      {
        id: "5",
        prompt: "If you are caught driving with a BAC over the legal limit, you may face:",
        options: [
          "A warning only",
          "Fines, licence suspension, and possible criminal charges",
          "Only demerit points",
          "A written test only",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "g1-what-to-do-when-accident-occurs",
    licenseLevel: "G1",
    title: "What To Do When an Accident Occurs",
    category: "G1 Knowledge Path",
    description:
      "Test your knowledge of the steps to take after a crash: staying calm, staying safe, exchanging information, and reporting.",
    questionCount: 3,
    questions: [
      {
        id: "1",
        prompt: "What should you do first after an accident?",
        options: [
          "Leave the area",
          "Stay calm and check for injuries",
          "Argue with the other driver",
          "Drive away",
        ],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "When should you call 911?",
        options: [
          "Only if your car is scratched",
          "If someone is injured or the road is blocked",
          "Never",
          "Only at night",
        ],
        correctIndex: 1,
      },
      {
        id: "3",
        prompt: "What information should you exchange?",
        options: [
          "Social media account",
          "Driver license and insurance details",
          "Favorite car brand",
          "None",
        ],
        correctIndex: 1,
      },
    ],
  },
];

export const LICENSE_LABELS: Record<LicenseLevel, string> = {
  G1: "G1 Knowledge",
  G2: "G2 Road Prep",
  G: "G Exit",
};

export function getLicenseLabel(level: LicenseLevel): string {
  return LICENSE_LABELS[level];
}
