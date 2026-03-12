import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import type { UserModuleStatus } from "@/lib/core/types";

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

/** True if Firebase env vars are set so we can initialize. */
function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (cachedApp) return cachedApp;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    appId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  if (!app) return null;
  cachedAuth = getAuth(app);
  return cachedAuth;
}

export function getFirebaseDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getFirebaseApp();
  if (!app) return null;
  cachedDb = getFirestore(app);
  return cachedDb;
}

type UserModuleProgressRecord = {
  userId: string;
  moduleId: string;
  completedLessons: string[];
};

export async function fetchUserModuleProgress(
  userId: string,
  moduleId: string,
): Promise<string[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const ref = doc(db, "userModuleProgress", `${userId}_${moduleId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];

  const data = snap.data() as Partial<UserModuleProgressRecord> & {
    completedLessons?: unknown;
  };
  const raw = Array.isArray(data.completedLessons) ? data.completedLessons : [];
  return raw.filter((value): value is string => typeof value === "string");
}

export async function saveUserModuleProgress(payload: UserModuleProgressRecord): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const { userId, moduleId, completedLessons } = payload;
  const ref = doc(db, "userModuleProgress", `${userId}_${moduleId}`);
  const uniqueLessons = Array.from(new Set(completedLessons));

  await setDoc(
    ref,
    {
      userId,
      moduleId,
      completedLessons: uniqueLessons,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

// ---------------------------------------------------------------------------
// userModules collection
// Tracks each user's overall status for a module (not_started / in_progress /
// completed), their progress percentage, and when they started / finished.
// Doc ID pattern: `${userId}_${moduleId}` — mirrors userModuleProgress.
// ---------------------------------------------------------------------------

type UserModuleRecord = {
  userId: string;
  moduleId: string;
  status: UserModuleStatus;
  progressPercent: number;
};

export type UserModuleSummary = {
  moduleId: string;
  status: UserModuleStatus;
  progressPercent: number;
};

export async function fetchUserModuleStatus(
  userId: string,
  moduleId: string,
): Promise<UserModuleSummary | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const ref = doc(db, "userModules", `${userId}_${moduleId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Partial<UserModuleRecord>;
  return {
    moduleId: data.moduleId ?? moduleId,
    status: data.status ?? "not_started",
    progressPercent: data.progressPercent ?? 0,
  };
}

export async function saveUserModuleStatus(payload: {
  userId: string;
  moduleId: string;
  status: UserModuleStatus;
  progressPercent: number;
  markCompleted?: boolean;
}): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const { userId, moduleId, status, progressPercent, markCompleted = false } = payload;
  const ref = doc(db, "userModules", `${userId}_${moduleId}`);

  const existing = await getDoc(ref);
  const existingData = existing.exists() ? existing.data() : null;

  await setDoc(
    ref,
    {
      userId,
      moduleId,
      status,
      progressPercent,
      // Preserve existing startedAt; set it on first write.
      startedAt: existingData?.startedAt ?? serverTimestamp(),
      // Only stamp completedAt when the module is actually finished.
      completedAt: markCompleted ? serverTimestamp() : (existingData?.completedAt ?? null),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function fetchAllUserModules(userId: string): Promise<UserModuleSummary[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(collection(db, "userModules"), where("userId", "==", userId));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as Partial<UserModuleRecord>;
    return {
      moduleId: data.moduleId ?? "",
      status: data.status ?? "not_started",
      progressPercent: data.progressPercent ?? 0,
    };
  });
}

export const googleProvider = new GoogleAuthProvider();

