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
    id: "g1-rules",
    licenseLevel: "G1",
    title: "Rules of the Road",
    category: "Rules of the Road",
    description:
      "Test your knowledge of signs, right-of-way, and speed rules from the G1 module.",
    questionCount: 3,
    questions: [
      {
        id: "1",
        prompt: "What does a red octagonal sign mean?",
        options: ["Yield", "Stop", "No entry", "Slow down"],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "Who has right-of-way at an uncontrolled intersection?",
        options: ["Vehicle on the left", "Vehicle on the right", "Largest vehicle", "First to arrive"],
        correctIndex: 3,
      },
      {
        id: "3",
        prompt: "What is a safe following distance in good conditions?",
        options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "g2-highway",
    licenseLevel: "G2",
    title: "Highway Driving",
    category: "Highway",
    description:
      "Check your understanding of highway entry, merging, and lane discipline.",
    questionCount: 2,
    questions: [
      {
        id: "1",
        prompt: "When merging onto a highway, you should:",
        options: [
          "Merge at a slow speed",
          "Match highway speed in the acceleration lane",
          "Stop before merging",
          "Use the shoulder",
        ],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "The left lane on a highway is primarily for:",
        options: ["Cruising", "Passing", "Slower traffic", "Exiting"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "g-exit",
    licenseLevel: "G",
    title: "G Exit Test Prep",
    category: "Test Prep",
    description:
      "Review what to expect on the G test and defensive driving concepts.",
    questionCount: 2,
    questions: [
      {
        id: "1",
        prompt: "The G exit test typically includes:",
        options: [
          "Parking only",
          "Highway driving, complex intersections, and independent driving",
          "Written exam only",
          "Simulator only",
        ],
        correctIndex: 1,
      },
      {
        id: "2",
        prompt: "Defensive driving includes:",
        options: [
          "Speeding up in traffic",
          "Scanning ahead, managing space, and communicating",
          "Ignoring blind spots",
          "Minimal mirror use",
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
