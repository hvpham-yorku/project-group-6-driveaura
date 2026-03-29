/**
 * Quiz data — one quiz per learning module. Edit here to add real questions.
 * quizId matches module id from /modules for "test your knowledge" pairing.
 */
import type { LicenseLevel } from "../modules/data";

export type QuizQuestionType = "mcq" | "scenario" | "image";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correctIndex: number; // 0-based index of correct option
  /** Optional image source for image-based questions (served from /public). */
  imageSrc?: string;
  /** Accessible description for any image used in the question. */
  imageAlt?: string;
  /**
   * Optional lesson id from the parent module's lessons array.
   * Used to provide targeted feedback and deep links back to module content.
   */
  lessonId?: string;
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
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "image",
        prompt: "What does this sign mean? You must:",
        options: ["Yield to traffic", "Come to a complete stop", "Slow down only", "No entry"],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-1.jpg",
        imageAlt: "Red octagonal stop sign",
        lessonId: "1",
      },
      {
        id: "2",
        type: "image",
        prompt: "You see this sign. How should you respond as you approach the intersection?",
        options: [
          "Come to a full stop every time",
          "Yield to traffic and pedestrians; stop if necessary and go when clear",
          "Proceed without slowing",
          "Change lanes immediately",
        ],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-3.jpg",
        imageAlt: "Yield sign — triangular with red border and white centre",
        lessonId: "2",
      },
      {
        id: "3",
        type: "mcq",
        prompt: "A yellow diamond-shaped sign typically indicates:",
        options: [
          "A regulatory requirement",
          "A warning or hazard ahead",
          "A destination",
          "A speed limit",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "4",
        type: "mcq",
        prompt: "What does a solid yellow line on your side of the centre of the road mean?",
        options: [
          "Passing is encouraged",
          "Passing is not allowed",
          "Lane is for buses only",
          "Reduce speed only",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "5",
        type: "image",
        prompt: "This sign indicates:",
        options: ["Police station", "Parking permitted", "Pedestrian crossing", "Passing zone"],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-6.jpg",
        imageAlt: "Blue square sign with white letter P — parking permitted",
        lessonId: "4",
      },
      {
        id: "6",
        type: "image",
        prompt: "What does this sign mean at an intersection?",
        options: [
          "Left turn only",
          "No left turn permitted",
          "Left turn allowed with caution",
          "Merge left",
        ],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-12.jpg",
        imageAlt: "No left turn — red circle with slash over left-turn arrow",
        lessonId: "1",
      },
      {
        id: "7",
        type: "scenario",
        prompt:
          "You are first in line at an intersection with a flashing green light. There are no pedestrians entering the crosswalk. What does this signal allow you to do?",
        options: [
          "Stop and wait",
          "Left-turn advance: you may turn left through the intersection",
          "Proceed with caution only",
          "Yield to pedestrians",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "8",
        type: "image",
        prompt:
          "This overhead sign shows lane directions. You are in the right lane. What are you allowed to do?",
        options: ["Turn right only", "Go straight only", "Turn right or go straight", "U-turn only"],
        correctIndex: 0,
        imageSrc: "https://files.ontario.ca/3-1-27.jpg",
        imageAlt: "Lane directional arrows — straight in left lane, right turn in right lane",
        lessonId: "4",
      },
      {
        id: "9",
        type: "mcq",
        prompt: "Regulatory signs are usually which shape and colour?",
        options: [
          "Yellow diamond",
          "White rectangle or square with black/red symbols",
          "Blue circle",
          "Green triangle",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "10",
        type: "mcq",
        prompt: "True or false: A red octagonal sign always means you must come to a complete stop.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "1",
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
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt: "At a 4-way stop, who goes first when two vehicles arrive at the same time?",
        options: [
          "The vehicle on the left",
          "The vehicle on the right",
          "The larger vehicle",
          "The first to come to a complete stop",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "2",
        type: "scenario",
        prompt: "When an emergency vehicle with lights and siren is approaching from behind, you should:",
        options: [
          "Speed up to get out of the way",
          "Pull to the right and stop if safe",
          "Stop in your lane immediately",
          "Change lanes only",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "3",
        type: "mcq",
        prompt: "At an uncontrolled intersection (no signs or signals), you must yield to:",
        options: [
          "No one; first to enter goes",
          "Vehicles approaching from your right",
          "Only pedestrians",
          "Only larger vehicles",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "4",
        type: "scenario",
        prompt: "When turning left at an intersection, you must yield to:",
        options: [
          "No one",
          "Oncoming vehicles and pedestrians in your path",
          "Only vehicles on your right",
          "Only vehicles already in the intersection",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "5",
        type: "image",
        prompt:
          "This sign shows lane directions. You are in the right lane approaching the intersection. What are you allowed to do?",
        options: [
          "Turn right only",
          "Go straight only",
          "Turn right or go straight",
          "Make a U-turn",
        ],
        correctIndex: 0,
        imageSrc: "https://files.ontario.ca/3-1-27.jpg",
        imageAlt: "Lane directional arrows: straight in left lane, right turn in right lane",
        lessonId: "1",
      },
      {
        id: "6",
        type: "image",
        prompt:
          "You see this sign. What must you do when pedestrians are crossing?",
        options: [
          "Proceed if no one is in your lane",
          "Stop and yield right-of-way to pedestrians",
          "Honk and proceed slowly",
          "Only slow down",
        ],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-29.jpg",
        imageAlt: "Pedestrian crossover sign — be prepared to stop and yield",
        lessonId: "1",
      },
      {
        id: "7",
        type: "scenario",
        prompt: "When a streetcar has stopped to pick up or let off passengers and there is no safety zone, you must:",
        options: [
          "Pass on the left only",
          "Stop behind the rear door and wait until passengers are clear",
          "Sound your horn and proceed",
          "Pass at reduced speed only",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "8",
        type: "mcq",
        prompt:
          "At a pedestrian crossover with activated flashing lights, you must remain stopped until:",
        options: [
          "The pedestrian has cleared your lane only",
          "All pedestrians have completely crossed and are off the roadway",
          "The flashing lights stop, regardless of where pedestrians are",
          "Another driver honks to proceed",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "9",
        type: "mcq",
        prompt: "True or false: At a 4-way stop, the vehicle that stopped first has the right to go first.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "10",
        type: "scenario",
        prompt: "You and another vehicle arrive at a 4-way stop at the same time. The other vehicle is on your right. Who should go first?",
        options: [
          "You go first",
          "The vehicle on the right goes first",
          "The larger vehicle",
          "Whoever signals first",
        ],
        correctIndex: 1,
        lessonId: "1",
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
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt: "In Ontario, demerit points stay on your record for:",
        options: ["6 months", "1 year", "2 years from the offence date", "5 years"],
        correctIndex: 2,
        lessonId: "1",
      },
      {
        id: "2",
        type: "mcq",
        prompt: "A fully licensed driver (G) can accumulate how many demerit points before a warning letter?",
        options: ["2–5 points", "6–8 points", "9–14 points", "15+ points"],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "3",
        type: "mcq",
        prompt: "Novice drivers (G1, G2) face licence suspension for accumulating how many demerit points?",
        options: ["2 points", "4 points", "6 points", "9 points"],
        correctIndex: 2,
        lessonId: "4",
      },
      {
        id: "4",
        type: "mcq",
        prompt: "Failing to yield to a pedestrian in a crosswalk typically results in how many demerit points?",
        options: ["0", "2", "4", "6"],
        correctIndex: 2,
        lessonId: "3",
      },
      {
        id: "5",
        type: "scenario",
        prompt: "Speeding 30 km/h or more over the limit can result in:",
        options: [
          "Demerit points only",
          "Demerit points and possible licence suspension",
          "A warning only",
          "No demerit points",
        ],
        correctIndex: 1,
        lessonId: "3",
      },
      {
        id: "6",
        type: "scenario",
        prompt:
          "A novice driver has already received a warning letter and continues to commit offences that add more demerit points. What is the likely consequence?",
        options: [
          "Nothing changes until they get a full G licence",
          "Their record is wiped clean each year",
          "They may face escalating sanctions, including licence suspension",
          "They only pay higher fines",
        ],
        correctIndex: 2,
        lessonId: "4",
      },
      {
        id: "7",
        type: "mcq",
        prompt:
          "What happens when a fully licensed driver reaches 15 or more demerit points?",
        options: [
          "They receive a written warning only",
          "Their licence may be suspended",
          "Their licence is automatically cancelled permanently",
          "Nothing changes; they simply pay more for insurance",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: Demerit points are removed from your record as soon as you pay the fine.",
        options: ["True", "False"],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "9",
        type: "scenario",
        prompt: "A G1 driver accumulates 6 demerit points. What is a possible outcome?",
        options: [
          "They receive a congratulatory letter",
          "Their licence may be suspended and they may need to attend an interview",
          "Nothing; G1 drivers are exempt",
          "Only a small fine",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "10",
        type: "mcq",
        prompt: "Running a red light typically carries how many demerit points?",
        options: ["0", "2", "3", "6"],
        correctIndex: 2,
        lessonId: "3",
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
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "image",
        prompt: "When you see this sign and the bus has its red lights flashing, you must:",
        options: [
          "Slow down and pass with caution",
          "Stop until the lights stop flashing and the arm is withdrawn",
          "Stop only if children are visible",
          "Honk and proceed slowly",
        ],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-25b.jpg",
        imageAlt: "Stop for school bus when signals are flashing",
        lessonId: "1",
      },
      {
        id: "2",
        type: "image",
        prompt:
          "This sign indicates that the lane is:",
        options: [
          "Closed to all vehicles",
          "Reserved for buses, HOV, or bicycles (as posted) during certain hours or always",
          "For pedestrians only",
          "A passing lane only",
        ],
        correctIndex: 1,
        imageSrc: "https://files.ontario.ca/3-1-32.jpg",
        imageAlt: "Reserved lanes — HOV, bus, or bicycle",
        lessonId: "2",
      },
      {
        id: "3",
        type: "mcq",
        prompt: "How much space should you leave when passing a cyclist?",
        options: [
          "As close as possible",
          "At least 1 metre where possible",
          "Only in the same lane",
          "No minimum; use your judgment",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "4",
        type: "scenario",
        prompt: "When a streetcar is stopped and there is a safety zone (island), you must:",
        options: [
          "Pass on the left of the safety zone",
          "Stop and wait until passengers are clear of the roadway",
          "Speed up to pass quickly",
          "Only yield to pedestrians",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "5",
        type: "mcq",
        prompt: "Cyclists on the road have:",
        options: [
          "No rights; they must use the sidewalk",
          "The same rights and duties as drivers of vehicles",
          "Right-of-way over all vehicles",
          "Only rights in bike lanes",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "6",
        type: "scenario",
        prompt: "When driving near large trucks, you should avoid:",
        options: [
          "Passing on the right",
          "Driving in the truck's blind spots (especially the right side and directly behind)",
          "Using your signals",
          "Maintaining a steady speed",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "7",
        type: "mcq",
        prompt:
          "When following a motorcycle on a wet or gravel road, you should:",
        options: [
          "Follow closely so other drivers can see both of you",
          "Increase your following distance to give them more space",
          "Drive beside them in the same lane",
          "Use your high beams continuously",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: On a multi-lane road with no median, vehicles approaching a stopped school bus from both directions must stop when the bus has its red lights flashing.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "9",
        type: "scenario",
        prompt: "A school bus has stopped with flashing amber lights. You should:",
        options: [
          "Speed up to pass before the red lights come on",
          "Slow down and prepare to stop",
          "Change lanes and continue",
          "Honk to warn the bus driver",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "10",
        type: "mcq",
        prompt:
          "A streetcar has stopped at a safety zone (island). The roadway beside you is clear and passing is permitted. How may you proceed?",
        options: [
          "Pass on the left of the streetcar when it is safe and legal to do so",
          "Always remain stopped behind the streetcar until it moves",
          "Pass on the right between the streetcar and the curb",
          "Use the sidewalk to get around the streetcar",
        ],
        correctIndex: 0,
        lessonId: "1",
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
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt: "For fully licensed drivers (G) age 21 and over, the legal blood alcohol concentration (BAC) limit in Ontario is:",
        options: ["0.00%", "0.05%", "0.08%", "0.10%"],
        correctIndex: 2,
        lessonId: "1",
      },
      {
        id: "2",
        type: "mcq",
        prompt: "For G1 and G2 drivers, the legal BAC limit is:",
        options: ["0.00%", "0.05%", "0.08%", "Any amount under 0.08%"],
        correctIndex: 0,
        lessonId: "1",
      },
      {
        id: "3",
        type: "scenario",
        prompt: "In Ontario, drivers in the G1 or G2 program must have zero alcohol in their system. This means:",
        options: [
          "One drink is acceptable",
          "No alcohol is allowed before driving",
          "Only cannabis is restricted",
          "Only the driver over 21 can have alcohol",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "4",
        type: "scenario",
        prompt: "Using cannabis (recreational or medical) before driving:",
        options: [
          "Is legal if you have a prescription",
          "Can impair driving and is subject to penalties",
          "Is only illegal for G1/G2 drivers",
          "Has no legal consequences",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "5",
        type: "scenario",
        prompt: "If you are caught driving with a BAC over the legal limit, you may face:",
        options: [
          "A warning only",
          "Fines, licence suspension, and possible criminal charges",
          "Only demerit points",
          "A written test only",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "6",
        type: "scenario",
        prompt:
          "A friend has had alcohol and plans to drive home. What is the safest message to follow?",
        options: [
          "Only experienced drivers may drink and drive",
          "Plan a safe ride home instead of driving after drinking",
          "You may drive short distances after a few drinks",
          "Cannabis use does not affect driving",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "7",
        type: "mcq",
        prompt:
          "For novice drivers, a roadside licence suspension can occur at a BAC starting at approximately:",
        options: ["0.00%", "0.02%", "0.05%", "0.10%"],
        correctIndex: 2,
        lessonId: "1",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: G1 and G2 drivers must have zero alcohol in their blood when driving.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "9",
        type: "scenario",
        prompt: "You are at a party and have had two drinks. You need to get home. The safest option is:",
        options: [
          "Drive slowly and take back roads",
          "Arrange a designated driver, taxi, or ride-share",
          "Wait 1 hour then drive",
          "Drive with the windows down to stay alert",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "10",
        type: "mcq",
        prompt: "Warn-range BAC (0.05% to 0.08%) for fully licensed drivers can result in:",
        options: [
          "No consequences",
          "A 3-day licence suspension and other sanctions for first occurrence",
          "Automatic criminal charge",
          "Only a verbal warning",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
    ],
  },
  {
    id: "g2-licensing-restrictions",
    licenseLevel: "G2",
    title: "G2 Licensing Restrictions",
    category: "G2 Road Prep",
    description:
      "Rules and restrictions that apply to G2 licence holders in Ontario.",
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt:
          "For G2 drivers under 21, what is the legal blood alcohol concentration (BAC) limit when driving?",
        options: ["0.00%", "0.05%", "0.08%", "Any amount under 0.08%"],
        correctIndex: 0,
        lessonId: "1",
      },
      {
        id: "2",
        type: "scenario",
        prompt:
          "You are 18 with a G2 licence and plan to drive friends home after a party. You have had one drink. What must you do to stay within the law?",
        options: [
          "Switch to a larger vehicle",
          "Wait 30 minutes before driving",
          "Do not drive at all; arrange a sober ride",
          "Drive slowly to reduce risk",
        ],
        correctIndex: 2,
        lessonId: "1",
      },
      {
        id: "3",
        type: "mcq",
        prompt:
          "At night, a G2 driver under 20 years old in the first six months of having their G2 is generally restricted to a maximum of how many teen passengers (19 or under) on certain high-speed roads?",
        options: ["1 passenger", "2 passengers", "3 passengers", "No passengers"],
        correctIndex: 0,
        lessonId: "2",
      },
      {
        id: "4",
        type: "scenario",
        prompt:
          "A G2 driver under 20, in their first months of G2, is driving at night on a 400-series highway with four teenage friends. How does this violate typical passenger restrictions?",
        options: [
          "They must drive below the speed limit",
          "They have exceeded the allowed number of teen passengers",
          "They are not allowed on highways at night",
          "They must have a fully licensed driver with them",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "5",
        type: "mcq",
        prompt:
          "Seatbelt and capacity laws require that in a passenger vehicle:",
        options: [
          "Only front-seat passengers need seatbelts",
          "There must be one working seatbelt for each person",
          "Seatbelts are optional for adults",
          "Only children require seatbelts",
        ],
        correctIndex: 1,
        lessonId: "3",
      },
      {
        id: "6",
        type: "scenario",
        prompt:
          "A G2 driver repeatedly drives 30 km/h over the limit and receives multiple tickets. What can escalating sanctions lead to?",
        options: [
          "Only higher insurance premiums",
          "Automatic full licence upgrade",
          "Licence suspensions and required interviews or re-tests",
          "No consequences after paying the fines",
        ],
        correctIndex: 2,
        lessonId: "4",
      },
      {
        id: "7",
        type: "mcq",
        prompt:
          "What is the final step for a G2 driver to obtain a full G licence?",
        options: [
          "Wait a set amount of time without driving",
          "Pass the G road test that focuses on highway and advanced driving",
          "Re-take the written G1 test",
          "Simply renew the G2 licence at expiry",
        ],
        correctIndex: 1,
        lessonId: "5",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: G2 drivers under 19 must have zero alcohol in their system when driving.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "9",
        type: "mcq",
        prompt:
          "What does Ontario's zero-alcohol rule mean for G2 drivers under 21?",
        options: [
          "A small amount of alcohol is acceptable if driving carefully",
          "Only weekend driving requires zero BAC",
          "They must maintain 0.00% BAC whenever driving",
          "Zero BAC applies only on highways",
        ],
        correctIndex: 2,
        lessonId: "1",
      },
      {
        id: "10",
        type: "scenario",
        prompt: "A G2 driver is pulled over and has one teen passenger in the car at 11 p.m. on a highway. They are in their first six months of G2 and under 20. Is this allowed?",
        options: [
          "Yes, one passenger is always allowed",
          "It depends on the road type and time; restrictions may limit teen passengers at night",
          "No; G2 drivers cannot drive at night",
          "Only if the passenger is over 25",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
    ],
  },
  {
    id: "g2-pre-drive-vehicle-safety",
    licenseLevel: "G2",
    title: "Pre-Drive and Vehicle Safety",
    category: "G2 Road Prep",
    description:
      "Pre-drive inspections, seat and mirror adjustment, warning lights, tires and brakes, visibility, required documents, and hazard awareness.",
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt:
          "Before starting a trip, a pre-drive inspection should include checking:",
        options: [
          "Only the fuel level",
          "Tires, lights, mirrors, and any visible leaks",
          "Stereo and air conditioning only",
          "Window tint darkness",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "2",
        type: "scenario",
        prompt:
          "After getting into the driver’s seat, what is the best sequence before moving the vehicle?",
        options: [
          "Start driving, then adjust mirrors and seat on the move",
          "Adjust seat and steering, then mirrors, then fasten seatbelt",
          "Fasten seatbelt later when traffic is light",
          "Check mirrors only if driving at night",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "3",
        type: "scenario",
        prompt:
          "While driving, a red oil-pressure warning appears on your dashboard. What should you do?",
        options: [
          "Ignore it; it is only for service reminders",
          "Continue driving and check it next week",
          "Safely pull over and check oil level or seek service immediately",
          "Turn up the radio to reduce distraction",
        ],
        correctIndex: 2,
        lessonId: "3",
      },
      {
        id: "4",
        type: "mcq",
        prompt:
          "Underinflated or badly worn tires can lead to:",
        options: [
          "Improved fuel economy",
          "Longer stopping distances and poor handling",
          "Better traction on wet roads",
          "No noticeable change in vehicle behaviour",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "5",
        type: "scenario",
        prompt:
          "On a rainy night, your windshield is fogging up and visibility is poor. What should you do first?",
        options: [
          "Turn off all ventilation to avoid more moisture",
          "Use the defrost setting and adjust fan and temperature to clear the glass",
          "Open all windows fully",
          "Rely only on your hazard lights",
        ],
        correctIndex: 1,
        lessonId: "5",
      },
      {
        id: "6",
        type: "mcq",
        prompt:
          "Which documents should you have with you when driving in Ontario?",
        options: [
          "Only your driver’s licence",
          "Driver’s licence, vehicle ownership, and valid insurance",
          "Passport and health card only",
          "Only proof of insurance",
        ],
        correctIndex: 1,
        lessonId: "6",
      },
      {
        id: "7",
        type: "scenario",
        prompt:
          "During your pre-drive scan, you notice children playing near the roadway and a ball in the gutter. How should this affect your driving?",
        options: [
          "Maintain normal speed; they are off the road",
          "Increase your speed to pass the area quickly",
          "Slow down, cover the brake, and be prepared to stop suddenly",
          "Honk continuously so they move away",
        ],
        correctIndex: 2,
        lessonId: "7",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: You must have a valid driver's licence, vehicle ownership, and proof of insurance when driving in Ontario.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "6",
      },
      {
        id: "9",
        type: "mcq",
        prompt: "Blind spots can be reduced by:",
        options: [
          "Driving faster",
          "Properly adjusting mirrors and doing shoulder checks",
          "Using only the rear-view mirror",
          "Keeping the radio off",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "10",
        type: "scenario",
        prompt: "Your check-engine or oil pressure warning light comes on while you are driving on a busy highway. The safest action is:",
        options: [
          "Continue to your destination and check later",
          "Safely pull off the road when possible and check the issue or call for help",
          "Speed up to exit the highway quickly",
          "Turn off the engine immediately in your lane",
        ],
        correctIndex: 1,
        lessonId: "3",
      },
    ],
  },
  {
    id: "g2-vehicle-interior-essentials",
    licenseLevel: "G2",
    title: "Interior Essentials: Vehicle Explorer",
    category: "G2 Road Prep",
    description:
      "Check understanding of cabin layout, primary controls, and dashboard warnings before your road test.",
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt:
          "Before driving, your seat position should allow you to:",
        options: [
          "Reach pedals with legs fully straight",
          "Steer with arms locked straight",
          "Reach pedals comfortably with a slight bend in your knees",
          "Sit as far back as possible from the wheel",
        ],
        correctIndex: 2,
        lessonId: "1",
      },
      {
        id: "2",
        type: "mcq",
        prompt: "Interior mirrors should be adjusted so you can:",
        options: [
          "See mostly the rear seat passengers",
          "See the road behind through the rear window with minimal blind spots",
          "See only the side windows",
          "Avoid seeing headlights behind you",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "3",
        type: "mcq",
        prompt:
          "A red oil-pressure warning light while driving usually means you should:",
        options: [
          "Ignore it if the engine sounds fine",
          "Stop safely as soon as possible and check oil or get help",
          "Add fuel at the next station",
          "Turn on high beams for visibility",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "4",
        type: "mcq",
        prompt: "The tachometer (RPM gauge) is most useful for:",
        options: [
          "Measuring fuel level",
          "Knowing engine speed and when to shift in a manual vehicle",
          "Setting cruise control",
          "Checking tire pressure",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "5",
        type: "scenario",
        prompt:
          "Your windshield fogs up on the inside in cold weather. Which control helps clear it safely?",
        options: [
          "Turning off all fans",
          "Defrost directed at the windshield with appropriate temperature/fan",
          "Opening only the sunroof",
          "Wiping the inside with your sleeve while driving",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "6",
        type: "mcq",
        prompt: "Hazard (four-way) flashers are used to:",
        options: [
          "Show you are turning only",
          "Signal an emergency or unusual hazard to other road users",
          "Replace turn signals on the highway",
          "Thank other drivers",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "7",
        type: "mcq",
        prompt: "The parking brake should be:",
        options: [
          "Left off whenever you are in park",
          "Released before driving and applied when parked as appropriate",
          "Used only on hills",
          "Ignored if the transmission is in neutral",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "A battery/charging warning light may indicate:",
        options: [
          "Low tire pressure",
          "A problem with the charging system or battery",
          "Overheated brakes only",
          "Low windshield washer fluid only",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "9",
        type: "mcq",
        prompt: "True or false: You should know where your headlight and wiper controls are before you drive.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "10",
        type: "scenario",
        prompt:
          "You cannot find your turn signal and you are approaching a turn. You should:",
        options: [
          "Turn without signaling",
          "Slow down, locate controls safely, and signal before turning when possible",
          "Use hazard lights for the whole turn only",
          "Speed up to clear the intersection",
        ],
        correctIndex: 1,
        lessonId: "1",
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
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "scenario",
        prompt:
          "You are turning right at an intersection with a stop line and crosswalk. What is the correct sequence?",
        options: [
          "Slow down, roll through if clear, and signal while turning",
          "Stop completely at the line, check for pedestrians and traffic, signal, then turn when safe",
          "Signal only after you have started the turn",
          "Turn from any lane as long as traffic is light",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "2",
        type: "mcq",
        prompt:
          "Before changing lanes on a multi-lane road, you should:",
        options: [
          "Signal and immediately move into the lane",
          "Check mirrors, signal, shoulder check, and then change lanes smoothly",
          "Change lanes first, then signal",
          "Rely on your mirrors only",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "3",
        type: "scenario",
        prompt:
          "When reversing straight back, the safest technique is to:",
        options: [
          "Use only the rear-view mirror",
          "Look over your right shoulder and move slowly, covering the brake",
          "Look forward while reversing using side mirrors only",
          "Rely on backup sensors without looking",
        ],
        correctIndex: 1,
        lessonId: "3",
      },
      {
        id: "4",
        type: "mcq",
        prompt:
          "A proper three-point turn should be done:",
        options: [
          "On a hill or near a curve where visibility is limited",
          "Only where the road is clear in both directions for a safe distance",
          "In the middle of a busy intersection",
          "Anywhere it seems convenient",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "5",
        type: "scenario",
        prompt:
          "You finish parking with your car parallel to the curb and balanced front and rear. Which maneuver did you complete?",
        options: [
          "Perpendicular parking",
          "Parallel parking",
          "Angle parking",
          "Parking on a hill only",
        ],
        correctIndex: 1,
        lessonId: "5",
      },
      {
        id: "6",
        type: "scenario",
        prompt:
          "When parking facing uphill with a curb, how should you position your front wheels?",
        options: [
          "Turned toward the curb",
          "Straight ahead",
          "Turned away from the curb so the vehicle would roll back into the curb",
          "It does not matter",
        ],
        correctIndex: 2,
        lessonId: "5",
      },
      {
        id: "7",
        type: "mcq",
        prompt:
          "During a road test, examiners particularly watch for:",
        options: [
          "Smooth steering, proper checks, and adherence to right-of-way rules",
          "How quickly you can accelerate away from stops",
          "Frequent lane changes to show confidence",
          "Use of horn in every maneuver",
        ],
        correctIndex: 0,
        lessonId: "5",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: You should signal before changing lanes and maintain your signal until the maneuver is complete.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "9",
        type: "scenario",
        prompt: "You are preparing to make a left turn at an intersection. The light is green. You should:",
        options: [
          "Accelerate through the turn",
          "Yield to oncoming traffic and pedestrians, then turn when safe",
          "Turn immediately; you have the right-of-way",
          "Stop and wait for a green arrow only",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "10",
        type: "mcq",
        prompt: "When parking facing downhill with a curb, you should turn your front wheels:",
        options: [
          "Away from the curb",
          "Toward the curb",
          "Straight ahead",
          "It does not matter",
        ],
        correctIndex: 1,
        lessonId: "5",
      },
    ],
  },
  {
    id: "g2-hazard-awareness-defensive-driving",
    licenseLevel: "G2",
    title: "Hazard Awareness & Defensive Driving",
    category: "G2 Road Prep",
    description:
      "Identify developing hazards, maintain space, and choose safe defensive actions.",
    questionCount: 10,
    questions: [
      { id: "1", type: "mcq", prompt: "A good visual scanning habit in city traffic is to:", options: ["Look only at the car directly ahead", "Check mirrors and road users every 5-8 seconds", "Focus only on traffic lights", "Keep your eyes on dashboard alerts"], correctIndex: 1, lessonId: "1" },
      { id: "2", type: "scenario", prompt: "You notice a parked car with brake lights on and a cyclist approaching from behind. What is the best defensive action?", options: ["Maintain speed and pass close", "Move slightly left when safe and prepare to brake", "Honk repeatedly and continue", "Stop in your lane immediately"], correctIndex: 1, lessonId: "1" },
      { id: "3", type: "mcq", prompt: "Before changing lanes, your final safety check should be:", options: ["A quick horn tap", "A shoulder check of the blind spot", "Turning on high beams", "Checking only the centre mirror"], correctIndex: 1, lessonId: "2" },
      { id: "4", type: "scenario", prompt: "You shoulder-check and notice a vehicle in your blind spot. What should you do?", options: ["Change lanes anyway because you signaled", "Proceed because mirrors were clear", "Delay lane change until the blind spot is clear", "Accelerate and force entry"], correctIndex: 2, lessonId: "2" },
      { id: "5", type: "scenario", prompt: "Approaching an intersection, a pedestrian steps toward the curb while your light is green. You should:", options: ["Accelerate before they enter", "Cover the brake and be ready to yield", "Maintain speed; green means go", "Change lanes to avoid stopping"], correctIndex: 1, lessonId: "3" },
      { id: "6", type: "mcq", prompt: "In good conditions, a safe minimum following distance is generally:", options: ["1 second", "2 seconds", "3 seconds", "5 seconds at all times"], correctIndex: 2, lessonId: "4" },
      { id: "7", type: "scenario", prompt: "The vehicle ahead suddenly brakes. The best defensive response is to:", options: ["Swerve without checking", "Brake firmly while keeping a safe escape path", "Honk and continue", "Look in mirrors only after impact"], correctIndex: 1, lessonId: "5" },
      { id: "8", type: "mcq", prompt: "True or false: Defensive driving means planning an escape route before you need it.", options: ["False", "True"], correctIndex: 1, lessonId: "5" },
      { id: "9", type: "scenario", prompt: "Heavy rain starts and visibility drops. How should your spacing change?", options: ["Reduce following distance to keep traffic flowing", "Increase following distance and reduce speed", "Maintain normal distance", "Use hazard lights and continue at same speed"], correctIndex: 1, lessonId: "4" },
      { id: "10", type: "mcq", prompt: "When risk increases near schools, parks, or bus stops, you should:", options: ["Keep normal speed but honk", "Slow down and scan for unpredictable movement", "Only watch vehicles", "Drive in the centre of the road"], correctIndex: 1, lessonId: "1" },
    ],
  },
  {
    id: "g2-parking-low-speed-control",
    licenseLevel: "G2",
    title: "Parking & Low-Speed Control",
    category: "G2 Road Prep",
    description:
      "Assess low-speed control, parking precision, and hill parking choices.",
    questionCount: 10,
    questions: [
      { id: "1", type: "mcq", prompt: "Low-speed control is best maintained by:", options: ["Abrupt throttle inputs", "Smooth brake/accelerator balance and slow steering", "Constant hard braking", "Frequent horn use"], correctIndex: 1, lessonId: "1" },
      { id: "2", type: "scenario", prompt: "You begin parallel parking and realize you are too far from the curb. What should you do?", options: ["Leave the car angled", "Pull out safely and reset the approach", "Mount the curb to correct", "Reverse quickly to finish"], correctIndex: 1, lessonId: "2" },
      { id: "3", type: "scenario", prompt: "You back into a marked parking space between two lines. Which maneuver is this?", options: ["Parallel parking", "Reverse parking", "Hill parking", "U-turn"], correctIndex: 1, lessonId: "3" },
      { id: "4", type: "mcq", prompt: "In perpendicular parking, your goal at the end should be:", options: ["Car straddling the line", "Centered in the space with wheels straight", "Front bumper touching curb", "Rear tires on the line"], correctIndex: 1, lessonId: "4" },
      { id: "5", type: "scenario", prompt: "Parking uphill with a curb, your wheels should be:", options: ["Straight", "Turned away from curb", "Turned toward curb", "Opposite your steering preference"], correctIndex: 1, lessonId: "5" },
      { id: "6", type: "mcq", prompt: "When parking downhill with a curb, front wheels should be:", options: ["Turned toward curb", "Turned away from curb", "Straight", "Depends only on transmission"], correctIndex: 0, lessonId: "5" },
      { id: "7", type: "scenario", prompt: "You are reversing into a space and a pedestrian appears behind you. You should:", options: ["Continue slowly", "Stop immediately and yield", "Honk and continue", "Accelerate to finish quickly"], correctIndex: 1, lessonId: "1" },
      { id: "8", type: "mcq", prompt: "True or false: Looking over your shoulder is still important even with a backup camera.", options: ["False", "True"], correctIndex: 1, lessonId: "1" },
      { id: "9", type: "mcq", prompt: "A vehicle parked close and parallel to the curb with balanced front and rear spacing indicates:", options: ["Poor parking alignment", "Correct parallel parking finish", "Perpendicular parking", "Unsafe stopping"], correctIndex: 1, lessonId: "2" },
      { id: "10", type: "mcq", prompt: "Before moving from a parked position, you should always:", options: ["Release brake first", "Check mirrors, shoulder check, signal, then move when safe", "Turn wheel fully first", "Rely on horn only"], correctIndex: 1, lessonId: "1" },
    ],
  },
  {
    id: "g-high-speed-expressway-driving",
    licenseLevel: "G",
    title: "High-Speed Expressway Driving",
    category: "G License: Highway Skills",
    description:
      "Test merging, lane discipline, high-speed spacing, and expressway exits.",
    questionCount: 10,
    questions: [
      { id: "1", type: "scenario", prompt: "On an entrance ramp, your primary goal before merging is to:", options: ["Stop at the end of ramp", "Match speed of expressway traffic", "Signal after entering lane", "Use shoulder to merge"], correctIndex: 1, lessonId: "1" },
      { id: "2", type: "mcq", prompt: "The left lane on most expressways is primarily for:", options: ["Cruising at any speed", "Passing", "Heavy trucks only", "New drivers only"], correctIndex: 1, lessonId: "2" },
      { id: "3", type: "scenario", prompt: "Approaching an expressway split with lane-use signs, what is the safest action?", options: ["Choose lane early and signal", "Wait to decide at last second", "Stop and read sign", "Use hazard lights and drift"], correctIndex: 0, lessonId: "2" },
      { id: "4", type: "mcq", prompt: "At expressway speeds in good weather, the recommended minimum space cushion is:", options: ["1 second", "2 seconds", "3 seconds", "No fixed guideline"], correctIndex: 2, lessonId: "3" },
      { id: "5", type: "scenario", prompt: "You miss your intended exit. Best action is to:", options: ["Brake hard and cross lanes", "Continue to next exit safely", "Reverse on shoulder", "Stop in travel lane"], correctIndex: 1, lessonId: "4" },
      { id: "6", type: "mcq", prompt: "True or false: You should signal before both lane changes and exits on expressways.", options: ["False", "True"], correctIndex: 1, lessonId: "4" },
      { id: "7", type: "scenario", prompt: "Traffic in your lane slows suddenly. You should first:", options: ["Tailgate to avoid cut-ins", "Increase following distance and scan escape options", "Change lanes without checking", "Honk continuously"], correctIndex: 1, lessonId: "3" },
      { id: "8", type: "mcq", prompt: "A common merge mistake is:", options: ["Checking mirrors and shoulder", "Trying to merge far below traffic speed", "Signaling early", "Choosing a safe gap"], correctIndex: 1, lessonId: "1" },
      { id: "9", type: "mcq", prompt: "Why is lingering in another driver's blind spot risky on expressways?", options: ["It improves visibility", "It can make you invisible to the driver beside you", "It reduces wind resistance", "It is required before passing"], correctIndex: 1, lessonId: "2" },
      { id: "10", type: "scenario", prompt: "Rain starts while on a 400-series highway. Best adaptation is to:", options: ["Maintain speed and reduce gap", "Slow down and increase following distance", "Use high beams", "Drive in left lane continuously"], correctIndex: 1, lessonId: "3" },
    ],
  },
  {
    id: "g-advanced-lane-management",
    licenseLevel: "G",
    title: "Advanced Lane Management",
    category: "G License: Decision-Making",
    description:
      "Assess advanced lane-change habits, passing judgment, and blind-spot management.",
    questionCount: 10,
    questions: [
      { id: "1", type: "mcq", prompt: "SMOG stands for:", options: ["Signal, Mirror, Over-shoulder, Go", "Speed, Merge, Observe, Go", "Signal, Move, Overtake, Glide", "Scan, Move, Observe, Guard"], correctIndex: 0, lessonId: "1" },
      { id: "2", type: "scenario", prompt: "You want to change lanes to pass. Which sequence is best?", options: ["Move first, signal later", "SMOG: signal, mirror, shoulder check, then go", "Only shoulder check", "Only mirror check"], correctIndex: 1, lessonId: "1" },
      { id: "3", type: "mcq", prompt: "Ontario Move Over rules generally require drivers to:", options: ["Ignore stopped emergency vehicles", "Move over or slow down significantly when safe", "Stop in the lane beside them", "Pass quickly in nearest lane"], correctIndex: 1, lessonId: "2" },
      { id: "4", type: "scenario", prompt: "You are being passed while on a two-lane road. You should:", options: ["Speed up to block", "Maintain steady speed and lane position", "Move toward centre line", "Honk repeatedly"], correctIndex: 1, lessonId: "3" },
      { id: "5", type: "scenario", prompt: "You are near a large truck and may be in its no-zone. What is the safest action?", options: ["Drive alongside in no-zones", "Stay out of blind spots and pass decisively when safe", "Merge directly in front after passing", "Tailgate for visibility"], correctIndex: 1, lessonId: "4" },
      { id: "6", type: "mcq", prompt: "True or false: Signaling alone guarantees a safe lane change.", options: ["True", "False"], correctIndex: 1, lessonId: "1" },
      { id: "7", type: "scenario", prompt: "A vehicle is in your right blind spot while you need to exit soon. Best response:", options: ["Force lane change", "Adjust speed to create a safe gap", "Honk and merge", "Stop in lane"], correctIndex: 1, lessonId: "4" },
      { id: "8", type: "mcq", prompt: "When passing on highways, you should generally:", options: ["Stay in left lane after passing", "Return to right lane when safe", "Pass only on shoulders", "Pass without signaling"], correctIndex: 1, lessonId: "3" },
      { id: "9", type: "scenario", prompt: "Approaching a stopped tow truck with flashing lights on a multi-lane road, you should:", options: ["Keep speed in adjacent lane", "Move over if safe or significantly slow down", "Stop in travel lane", "Ignore and continue"], correctIndex: 1, lessonId: "2" },
      { id: "10", type: "mcq", prompt: "A good lane-management mindset is to:", options: ["React late to openings", "Plan lane changes early and smoothly", "Change lanes frequently to save time", "Follow very closely before passing"], correctIndex: 1, lessonId: "1" },
    ],
  },
  {
    id: "g-complex-intersections-hazard-perception",
    licenseLevel: "G",
    title: "Complex Intersections & Hazard Perception",
    category: "G License: Module 3",
    description:
      "Measure hazard perception and safe decision-making through complex intersections.",
    questionCount: 10,
    questions: [
      { id: "1", type: "mcq", prompt: "At busy intersections, an effective scanning pattern is:", options: ["Left-right-left and mirror checks", "Look only straight ahead", "Check mirrors after crossing", "Focus on traffic lights only"], correctIndex: 0, lessonId: "1" },
      { id: "2", type: "scenario", prompt: "Your light is green, but an ambulance enters the intersection with siren on. You should:", options: ["Proceed because you have green", "Yield and allow emergency vehicle through", "Honk and continue", "Stop in centre of intersection"], correctIndex: 1, lessonId: "1" },
      { id: "3", type: "mcq", prompt: "An unprotected left turn requires you to yield to:", options: ["No one", "Oncoming traffic and pedestrians", "Only pedestrians", "Only vehicles on your right"], correctIndex: 1, lessonId: "2" },
      { id: "4", type: "scenario", prompt: "You approach a pedestrian crossover at an intersection. What is the safest approach?", options: ["Maintain speed through crossing", "Reduce speed and prepare to stop for pedestrians", "Pass vehicles stopped at crossing", "Honk to clear path"], correctIndex: 1, lessonId: "1" },
      { id: "5", type: "scenario", prompt: "At a rail crossing with flashing red lights and lowered gates, you must:", options: ["Proceed if train seems far", "Stop and wait until signals stop and gates fully rise", "Drive around gates carefully", "Reverse into intersection"], correctIndex: 1, lessonId: "3" },
      { id: "6", type: "mcq", prompt: "True or false: Entering an intersection when your exit path is blocked is acceptable if your light is green.", options: ["True", "False"], correctIndex: 1, lessonId: "1" },
      { id: "7", type: "scenario", prompt: "A school bus ahead has flashing red lights. On a two-way road with no median, you should:", options: ["Pass slowly", "Stop until lights stop and children are clear", "Change lanes and continue", "Honk then pass"], correctIndex: 1, lessonId: "3" },
      { id: "8", type: "mcq", prompt: "A key hazard-perception habit is to:", options: ["Scan only one hazard at a time", "Predict what could happen next", "Focus on nearest bumper", "Ignore side streets"], correctIndex: 1, lessonId: "1" },
      { id: "9", type: "scenario", prompt: "You are first at a stale green light. Best action is to:", options: ["Accelerate immediately", "Cover brake and check cross-traffic before entering", "Wait for yellow", "Honk and proceed"], correctIndex: 1, lessonId: "1" },
      { id: "10", type: "mcq", prompt: "When turning left across traffic, a major risk is:", options: ["Rear-window fog only", "Misjudging oncoming speed and gaps", "Using mirrors", "Turning too slowly only"], correctIndex: 1, lessonId: "2" },
    ],
  },
  {
    id: "g-system-of-driving-oea",
    licenseLevel: "G",
    title: "The System of Driving (Observe, Evaluate, Act)",
    category: "G License: Module 4",
    description:
      "Practice applying Observe-Evaluate-Act to real road decisions.",
    questionCount: 10,
    questions: [
      { id: "1", type: "mcq", prompt: "In OEA, the first step 'Observe' means:", options: ["Choose a maneuver immediately", "Gather information from mirrors, signs, and road users", "Honk at hazards", "Brake at every intersection"], correctIndex: 1, lessonId: "1" },
      { id: "2", type: "scenario", prompt: "You observe brake lights ahead and a merging vehicle. In OEA, 'Evaluate' means you should:", options: ["Ignore and keep speed", "Judge risk, space, and timing before deciding", "Only signal", "Accelerate to pass both"], correctIndex: 1, lessonId: "1" },
      { id: "3", type: "mcq", prompt: "An 'Act' step that reflects defensive driving is:", options: ["Late, abrupt steering", "Early smooth braking and lane-position adjustment", "No action until hazard is immediate", "Hard acceleration first"], correctIndex: 1, lessonId: "2" },
      { id: "4", type: "mcq", prompt: "Why are escape routes important in the OEA system?", options: ["They reduce need for mirrors", "They provide safer options if traffic changes suddenly", "They allow faster lane weaving", "They replace braking"], correctIndex: 1, lessonId: "2" },
      { id: "5", type: "scenario", prompt: "On a highway merge, OEA best sequence is:", options: ["Act first, then observe", "Observe traffic, evaluate gaps, act by adjusting speed/position", "Evaluate only after merging", "Observe only mirrors"], correctIndex: 1, lessonId: "3" },
      { id: "6", type: "mcq", prompt: "True or false: OEA is a continuous loop while driving, not a one-time check.", options: ["False", "True"], correctIndex: 1, lessonId: "1" },
      { id: "7", type: "scenario", prompt: "A vehicle drifts toward your lane. Best OEA response:", options: ["Honk and hold position", "Create space and prepare controlled braking/avoidance", "Accelerate beside it", "Look away to avoid panic"], correctIndex: 1, lessonId: "2" },
      { id: "8", type: "mcq", prompt: "Which action best supports OEA under pressure?", options: ["Fixating on one hazard", "Scanning broadly and updating decisions often", "Ignoring rear traffic", "Driving with minimal mirror use"], correctIndex: 1, lessonId: "1" },
      { id: "9", type: "scenario", prompt: "Traffic flow suddenly compresses on an expressway. What should you do first?", options: ["Change two lanes quickly", "Increase following space and reassess escape options", "Brake hard without mirror check", "Move to shoulder"], correctIndex: 1, lessonId: "3" },
      { id: "10", type: "mcq", prompt: "OEA improves driving mainly by helping you:", options: ["React later", "Make earlier, lower-risk decisions", "Drive faster in all conditions", "Avoid using mirrors"], correctIndex: 1, lessonId: "1" },
    ],
  },
  {
    id: "g-environmental-awareness-eco-driving",
    licenseLevel: "G",
    title: "Environmental Awareness & Eco-Driving",
    category: "G License: Module 5",
    description:
      "Check weather adaptation, night visibility strategy, and eco-driving habits.",
    questionCount: 10,
    questions: [
      { id: "1", type: "mcq", prompt: "In heavy rain, the safest adjustment is to:", options: ["Increase speed to clear water", "Reduce speed and increase following distance", "Use high beams", "Turn off headlights"], correctIndex: 1, lessonId: "1" },
      { id: "2", type: "scenario", prompt: "You encounter glare from oncoming headlights at night. Best response is to:", options: ["Look directly at lights", "Look toward right edge of your lane and reduce speed", "Close one eye and continue", "Flash high beams continuously"], correctIndex: 1, lessonId: "2" },
      { id: "3", type: "mcq", prompt: "Eco-driving generally helps by:", options: ["Increasing sudden acceleration", "Reducing fuel use and vehicle wear", "Using brakes more often", "Ignoring tire pressure"], correctIndex: 1, lessonId: "1" },
      { id: "4", type: "scenario", prompt: "Your dashboard warns of low tire pressure. Why does this matter for eco-driving and safety?", options: ["No effect on efficiency", "Can increase fuel use and reduce traction", "Only affects parking", "Improves braking"], correctIndex: 1, lessonId: "1" },
      { id: "5", type: "scenario", prompt: "Your vehicle begins to skid on a slippery road. First priority is to:", options: ["Brake hard and steer sharply", "Ease off accelerator and steer smoothly where you want to go", "Accelerate to regain grip", "Shift to park"], correctIndex: 1, lessonId: "3" },
      { id: "6", type: "mcq", prompt: "True or false: Gentle acceleration and anticipating stops can improve fuel efficiency.", options: ["False", "True"], correctIndex: 1, lessonId: "1" },
      { id: "7", type: "scenario", prompt: "At night on an unlit road with no traffic ahead, proper headlight use is:", options: ["Keep low beams always", "Use high beams and switch to low when needed for other road users", "Drive with parking lights only", "Use hazard lights"], correctIndex: 1, lessonId: "2" },
      { id: "8", type: "mcq", prompt: "In snow or ice, following distance should generally:", options: ["Stay the same", "Increase significantly", "Decrease to prevent cut-ins", "Depend only on ABS"], correctIndex: 1, lessonId: "1" },
      { id: "9", type: "scenario", prompt: "You are approaching a downhill curve in wet weather. Best approach is to:", options: ["Brake hard in curve", "Slow before the curve and steer smoothly", "Accelerate through curve", "Use high beams and maintain speed"], correctIndex: 1, lessonId: "3" },
      { id: "10", type: "mcq", prompt: "Which habit supports both eco-driving and safety?", options: ["Late hard braking", "Maintaining steady speed with smooth inputs", "Frequent lane weaving", "Rapid acceleration after every stop"], correctIndex: 1, lessonId: "1" },
    ],
  },
  {
    id: "g1-what-to-do-when-accident-occurs",
    licenseLevel: "G1",
    title: "What To Do When an Accident Occurs",
    category: "G1 Knowledge Path",
    description:
      "Test your knowledge of the steps to take after a crash: staying calm, staying safe, exchanging information, and reporting.",
    questionCount: 10,
    questions: [
      {
        id: "1",
        type: "mcq",
        prompt: "What should you do first after an accident?",
        options: [
          "Leave the area",
          "Stay calm and check for injuries",
          "Argue with the other driver",
          "Drive away",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "2",
        type: "mcq",
        prompt: "When should you call 911?",
        options: [
          "Only if your car is scratched",
          "If someone is injured or the road is blocked",
          "Never",
          "Only at night",
        ],
        correctIndex: 1,
        lessonId: "3",
      },
      {
        id: "3",
        type: "mcq",
        prompt: "What information should you exchange with the other driver(s)?",
        options: [
          "Social media account",
          "Driver's licence and insurance details",
          "Favourite car brand",
          "None",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "4",
        type: "scenario",
        prompt: "After a minor collision, the vehicles can still be driven. What should you do before moving them?",
        options: [
          "Move them immediately to avoid traffic",
          "If safe, turn on hazards and move to the side of the road to avoid blocking traffic",
          "Leave them in place until police arrive",
          "Drive to the nearest parking lot",
        ],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "5",
        type: "scenario",
        prompt: "You have been in an accident. Someone in the other vehicle is holding their neck and seems hurt. What should you do?",
        options: [
          "Exchange insurance and leave",
          "Call 911 and do not move the injured person unless necessary for their safety",
          "Help them walk to the curb",
          "Wait for the other driver to decide",
        ],
        correctIndex: 1,
        lessonId: "1",
      },
      {
        id: "6",
        type: "scenario",
        prompt:
          "After a collision, which details are most important to document for records and insurance?",
        options: [
          "Only one close-up of your own bumper",
          "Damage, licence plates, roadway conditions, and the final vehicle positions",
          "Only the other driver standing near the car",
          "No photos are needed if both drivers appear calm",
        ],
        correctIndex: 1,
        lessonId: "5",
      },
      {
        id: "7",
        type: "mcq",
        prompt: "In Ontario, you must report an accident to a Collision Reporting Centre when:",
        options: [
          "Only if someone is killed",
          "Damage exceeds $2000 and/or someone is injured",
          "Only for highway accidents",
          "Never; insurance handles it",
        ],
        correctIndex: 1,
        lessonId: "6",
      },
      {
        id: "8",
        type: "mcq",
        prompt: "True or false: After an accident, you should turn on your hazard lights if your vehicle is blocking or partly blocking the road.",
        options: ["False", "True"],
        correctIndex: 1,
        lessonId: "2",
      },
      {
        id: "9",
        type: "scenario",
        prompt: "You are in a minor fender-bender. No one is hurt. The other driver suggests you both leave without exchanging information. You should:",
        options: [
          "Agree and leave",
          "Politely decline and exchange licence, insurance, and contact information",
          "Only take a photo of their licence plate",
          "Call the police to decide",
        ],
        correctIndex: 1,
        lessonId: "4",
      },
      {
        id: "10",
        type: "mcq",
        prompt: "At the scene of an accident, you should:",
        options: [
          "Admit fault immediately to speed things up",
          "Stay calm, ensure safety, and cooperate with others and authorities",
          "Only speak to your insurance company",
          "Move injured people into your car",
        ],
        correctIndex: 1,
        lessonId: "1",
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
