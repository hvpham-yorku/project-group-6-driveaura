import { getFirebaseApp } from "@/lib/firebase/client";

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export async function logAnalyticsEvent(
  name: string,
  params?: AnalyticsEventParams,
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return;

  const app = getFirebaseApp();
  if (!app) return;

  try {
    const { getAnalytics, isSupported, logEvent } = await import("firebase/analytics");
    const supported = await isSupported();
    if (!supported) return;

    const analytics = getAnalytics(app);
    logEvent(analytics, name, params);
  } catch {
    // Intentionally swallow — analytics should never break UX.
  }
}

