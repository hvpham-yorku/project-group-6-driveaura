/**
 * Firebase sync layer for Aura Points.
 * Reads and writes the user's auraPoints total from/to Firestore.
 * Document: users/{userId}  (merged, does not overwrite other fields)
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./client";

type UserAuraRecord = {
  auraPoints: number;
  auraPointsUpdatedAt?: unknown;
};

/** Fetch the stored aura points total for a signed-in user. Returns null if unavailable. */
export async function fetchUserAuraPoints(userId: string): Promise<number | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Partial<UserAuraRecord>;
  const pts = data.auraPoints;
  return typeof pts === "number" && pts >= 0 ? pts : null;
}

/** Persist the aura points total for a signed-in user. */
export async function saveUserAuraPoints(userId: string, points: number): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const ref = doc(db, "users", userId);
  await setDoc(
    ref,
    {
      auraPoints: points,
      auraPointsUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
