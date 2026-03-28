import {
  getFirebaseDb,
} from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type UserProfile = {
  uid: string;
  username: string;
  email: string;
  auraPoints: number;
  createdAt: unknown;
};

/** Creates a user profile document in Firestore when someone signs up. */
export async function createUserProfile(
  uid: string,
  username: string,
  email: string,
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      username,
      email,
      auraPoints: 0,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Fetches a single user's profile from Firestore. */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data() as Partial<UserProfile>;
  return {
    uid: typeof data.uid === "string" ? data.uid : uid,
    username: typeof data.username === "string" ? data.username : "Driver",
    email: typeof data.email === "string" ? data.email : "",
    auraPoints: typeof data.auraPoints === "number" ? data.auraPoints : 0,
    createdAt: data.createdAt ?? null,
  };
}

/** Fetches the top N users ordered by auraPoints descending. */
export async function fetchLeaderboard(topN: number = 10): Promise<UserProfile[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, "users"),
    orderBy("auraPoints", "desc"),
    firestoreLimit(Math.min(topN, 100)),
  );

  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const data = docSnap.data() as Partial<UserProfile>;
    return {
      uid: docSnap.id,
      username: typeof data.username === "string" ? data.username : "Driver",
      email: typeof data.email === "string" ? data.email : "",
      auraPoints: typeof data.auraPoints === "number" ? data.auraPoints : 0,
      createdAt: data.createdAt ?? null,
    };
  });
}

/** Updates the auraPoints field on a user's profile. */
export async function updateUserAuraPoints(uid: string, auraPoints: number): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  await updateDoc(doc(db, "users", uid), { auraPoints });
}
