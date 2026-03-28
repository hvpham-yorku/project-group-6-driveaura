/**
 * Quiz pass state and failed-attempt counts — Firestore doc per user.
 * Document: userQuizProgress/{userId}
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb, saveUserModuleProgress } from "./client";
import { clearModuleProgress } from "@/app/modules/progress";

const COLLECTION = "userQuizProgress";

export type QuizProgressRecord = {
  passed: boolean;
  failedAttempts: number;
};

export async function fetchUserQuizProgressMap(
  userId: string,
): Promise<Map<string, QuizProgressRecord>> {
  const db = getFirebaseDb();
  if (!db) return new Map();

  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return new Map();

  const data = snap.data() as {
    quizzes?: Record<string, { passed?: boolean; failedAttempts?: unknown }>;
  };
  const raw = data.quizzes ?? {};
  const map = new Map<string, QuizProgressRecord>();
  for (const [id, v] of Object.entries(raw)) {
    map.set(id, {
      passed: Boolean(v.passed),
      failedAttempts:
        typeof v.failedAttempts === "number" && v.failedAttempts >= 0
          ? v.failedAttempts
          : 0,
    });
  }
  return map;
}

/** Returns which quiz IDs have been passed at least once (any attempt). */
export function passedQuizIdsFromMap(map: Map<string, QuizProgressRecord>): Set<string> {
  const s = new Set<string>();
  map.forEach((rec, id) => {
    if (rec.passed) s.add(id);
  });
  return s;
}

async function readQuizzesMap(
  userId: string,
): Promise<Record<string, QuizProgressRecord>> {
  const map = await fetchUserQuizProgressMap(userId);
  return Object.fromEntries(map);
}

async function writeQuizzesMap(
  userId: string,
  quizzes: Record<string, QuizProgressRecord>,
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const ref = doc(db, COLLECTION, userId);
  await setDoc(
    ref,
    {
      quizzes,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * After 3 failed submissions (without ever passing), clear module lesson progress
 * locally and in Firestore so the learner must redo the module.
 */
export async function resetModuleLessonsForUser(
  userId: string,
  moduleId: string,
): Promise<void> {
  clearModuleProgress(moduleId);
  await saveUserModuleProgress({
    userId,
    moduleId,
    completedLessons: [],
  });
}

/**
 * Apply a completed quiz submission. Updates pass flag, failed-attempt count, and
 * may reset the module after 3 consecutive failures while never passed.
 */
export async function applyQuizSubmission(
  userId: string,
  moduleId: string,
  quizId: string,
  attemptPassed: boolean,
): Promise<{ record: QuizProgressRecord; lockoutReset: boolean }> {
  const quizzes = await readQuizzesMap(userId);
  const prev = quizzes[quizId] ?? { passed: false, failedAttempts: 0 };
  let lockoutReset = false;

  let next: QuizProgressRecord;
  if (attemptPassed) {
    next = { passed: true, failedAttempts: 0 };
  } else if (prev.passed) {
    next = prev;
  } else {
    const failedAttempts = prev.failedAttempts + 1;
    if (failedAttempts >= 3) {
      lockoutReset = true;
      next = { passed: false, failedAttempts: 0 };
    } else {
      next = { passed: false, failedAttempts };
    }
  }

  quizzes[quizId] = next;
  await writeQuizzesMap(userId, quizzes);

  if (lockoutReset) {
    await resetModuleLessonsForUser(userId, moduleId);
  }

  return { record: next, lockoutReset };
}
