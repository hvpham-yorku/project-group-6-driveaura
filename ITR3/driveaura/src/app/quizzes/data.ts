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
        type: "image",
        prompt:
          "Review the following chart image summarizing demerit point ranges and consequences. What happens when a fully licensed driver reaches 15 or more points?",
        options: [
          "They receive a written warning only",
          "Their licence may be suspended",
          "Their licence is automatically cancelled permanently",
          "Nothing changes; they simply pay more for insurance",
        ],
        correctIndex: 1,
        imageSrc: "/globe.svg",
        imageAlt: "Chart summarizing demerit point ranges and consequences",
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
        prompt: "When a streetcar has stopped to pick up or let off passengers and there is no safety zone, you must:",
        options: [
          "Pass on the left only",
          "Stop behind the rear door and wait until passengers are clear",
          "Proceed at 20 km/h",
          "Sound your horn and proceed",
        ],
        correctIndex: 1,
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
        type: "image",
        prompt:
          "The following image shows a car key beside a drink crossed out. What is the main safety message?",
        options: [
          "Only experienced drivers may drink and drive",
          "Plan a safe ride home instead of driving after drinking",
          "You may drive short distances after a few drinks",
          "Cannabis use does not affect driving",
        ],
        correctIndex: 1,
        imageSrc: "/driveaura-logo.png",
        imageAlt: "Car key and drink symbol crossed out — do not drive after drinking",
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
        prompt: "Escalating sanctions for novice drivers may include:",
        options: [
          "Only increased fines",
          "Licence suspension, interview, or re-test requirements",
          "Automatic upgrade to G licence",
          "No additional consequences",
        ],
        correctIndex: 1,
        lessonId: "4",
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
        type: "image",
        prompt:
          "The dashboard shows a red oil can warning light. What should you do?",
        options: [
          "Ignore it; it is only for service reminders",
          "Continue driving and check it next week",
          "Safely pull over and check oil level or seek service immediately",
          "Turn up the radio to reduce distraction",
        ],
        correctIndex: 2,
        imageSrc: "/file.svg",
        imageAlt: "Dashboard warning light — oil/engine symbol",
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
        type: "image",
        prompt:
          "The diagram shows a vehicle positioned parallel to the curb with equal space in front and behind. Which parking maneuver does this represent?",
        options: [
          "Perpendicular parking",
          "Parallel parking",
          "Angle parking",
          "Parking on a hill only",
        ],
        correctIndex: 1,
        imageSrc: "/window.svg",
        imageAlt: "Top-down diagram of a car parallel to a curb",
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
        type: "mcq",
        prompt: "When documenting the scene, what should you photograph if possible?",
        options: [
          "Only the other driver's face",
          "Damage to vehicles, licence plates, road conditions, and position of vehicles",
          "Only your own vehicle",
          "Nothing; let the police do it",
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
