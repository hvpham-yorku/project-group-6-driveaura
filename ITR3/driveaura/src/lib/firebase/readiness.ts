import { getFirebaseDb } from "@/lib/firebase/client";
import {
  addDoc,
  collection,
  limit as firestoreLimit,
  orderBy,
  query,
  serverTimestamp,
  type Firestore,
  type Timestamp,
  getDocs,
} from "firebase/firestore";

export type ReadinessCheckRecord = {
  id: string;
  userId: string;
  createdAt: Timestamp | null;
  readinessScore: number;
  gateStops: Record<string, boolean>;
  answers: Record<string, number>;
};

function userReadinessChecksCollection(db: Firestore, userId: string) {
  return collection(db, "users", userId, "readinessChecks");
}

export async function saveReadinessCheck(input: {
  userId: string;
  readinessScore: number;
  gateStops: Record<string, boolean>;
  answers: Record<string, number>;
}): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const { userId, readinessScore, gateStops, answers } = input;
  try {
    await addDoc(userReadinessChecksCollection(db, userId), {
      userId,
      readinessScore,
      gateStops,
      answers,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("saveReadinessCheck failed:", err);
    throw new Error("Could not save readiness check. Please check your connection and try again.");
  }
}

export async function fetchReadinessHistory(input: {
  userId: string;
  limit?: number;
}): Promise<ReadinessCheckRecord[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    userReadinessChecksCollection(db, input.userId),
    orderBy("createdAt", "desc"),
    firestoreLimit(Math.max(1, Math.min(50, input.limit ?? 10))),
  );

  let snap;
  try {
    snap = await getDocs(q);
  } catch (err) {
    console.error("fetchReadinessHistory failed:", err);
    throw new Error("Could not load readiness history. Please check your connection and try again.");
  }
  return snap.docs.map((docSnap) => {
    const data = docSnap.data() as Partial<ReadinessCheckRecord> & {
      readinessScore?: unknown;
      gateStops?: unknown;
      answers?: unknown;
      createdAt?: unknown;
      userId?: unknown;
    };

    return {
      id: docSnap.id,
      userId: typeof data.userId === "string" ? data.userId : input.userId,
      createdAt: (data.createdAt as Timestamp) ?? null,
      readinessScore: typeof data.readinessScore === "number" ? data.readinessScore : 0,
      gateStops:
        data.gateStops && typeof data.gateStops === "object" && !Array.isArray(data.gateStops)
          ? (data.gateStops as Record<string, boolean>)
          : {},
      answers:
        data.answers && typeof data.answers === "object" && !Array.isArray(data.answers)
          ? (data.answers as Record<string, number>)
          : {},
    };
  });
}

