import { getFirebaseDb } from "@/lib/firebase/client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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

export async function saveManualShiftSession(data: ManualShiftSessionData): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  await addDoc(
    collection(db, "users", data.userId, "manualShiftSessions"),
    { ...data, createdAt: serverTimestamp() },
  );
}
