import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

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

export const googleProvider = new GoogleAuthProvider();

