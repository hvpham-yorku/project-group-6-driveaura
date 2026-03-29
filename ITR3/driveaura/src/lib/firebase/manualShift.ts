import { getFirebaseDb } from "@/lib/firebase/client";
import {
  addDoc,
  collection,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  serverTimestamp,
  type Firestore,
  type Timestamp,
} from "firebase/firestore";

export interface ManualShiftSessionData {
  userId: string;
  score: number;
  perfectShifts: number;
  bestStreak: number;
  stalls: number;
  auraEarned: number;
  sessionTimeSec: number;
  difficulty: string;
  mode: string;
  gearCount: number;
}

function userManualShiftSessionsCollection(db: Firestore, userId: string) {
  return collection(db, "users", userId, "manualShiftSessions");
}

export type ManualShiftSessionRecord = {
  id: string;
  userId: string;
  createdAt: Timestamp | null;
  score: number;
  perfectShifts: number;
  bestStreak: number;
  stalls: number;
  auraEarned: number;
  sessionTimeSec: number;
  difficulty: string;
  mode: string;
  gearCount: number;
};

export async function saveManualShiftSession(data: ManualShiftSessionData): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  await addDoc(
    userManualShiftSessionsCollection(db, data.userId),
    { ...data, createdAt: serverTimestamp() },
  );
}

export async function fetchManualShiftHistory(input: {
  userId: string;
  limit?: number;
}): Promise<ManualShiftSessionRecord[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    userManualShiftSessionsCollection(db, input.userId),
    orderBy("createdAt", "desc"),
    firestoreLimit(Math.max(1, Math.min(50, input.limit ?? 10))),
  );

  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const data = docSnap.data() as Partial<ManualShiftSessionData> & {
      createdAt?: unknown;
    };
    return {
      id: docSnap.id,
      userId: typeof data.userId === "string" ? data.userId : input.userId,
      createdAt: (data.createdAt as Timestamp) ?? null,
      score: typeof data.score === "number" ? data.score : 0,
      perfectShifts: typeof data.perfectShifts === "number" ? data.perfectShifts : 0,
      bestStreak: typeof data.bestStreak === "number" ? data.bestStreak : 0,
      stalls: typeof data.stalls === "number" ? data.stalls : 0,
      auraEarned: typeof data.auraEarned === "number" ? data.auraEarned : 0,
      sessionTimeSec: typeof data.sessionTimeSec === "number" ? data.sessionTimeSec : 0,
      difficulty: typeof data.difficulty === "string" ? data.difficulty : "",
      mode: typeof data.mode === "string" ? data.mode : "",
      gearCount: typeof data.gearCount === "number" ? data.gearCount : 0,
    };
  });
}
