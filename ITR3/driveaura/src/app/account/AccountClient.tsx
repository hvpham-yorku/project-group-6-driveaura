"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchReadinessHistory, type ReadinessCheckRecord } from "@/lib/firebase/readiness";
import { logAnalyticsEvent } from "@/lib/firebase/analytics";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function safeDateFromRecord(record: ReadinessCheckRecord): Date | null {
  const anyCreatedAt = record.createdAt as unknown as { toDate?: () => Date } | null;
  if (anyCreatedAt && typeof anyCreatedAt.toDate === "function") return anyCreatedAt.toDate();
  return null;
}

function SettingsPanel() {
  const { user } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [nameSaving, setNameSaving] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  const [signingOut, setSigningOut] = useState(false);

  const isGoogleUser = user?.providerData.some((p) => p.providerId === "google.com") ?? false;

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setNameSaving(true);
    setNameMsg(null);
    try {
      await updateProfile(user, { displayName: displayName.trim() || null });
      setNameMsg({ ok: true, text: "Display name updated." });
    } catch {
      setNameMsg({ ok: false, text: "Could not update display name. Please try again." });
    } finally {
      setNameSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !user.email) return;
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ ok: false, text: "Password must be at least 6 characters." });
      return;
    }
    setPwSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      setPwMsg({ ok: true, text: "Password updated successfully." });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      const msg = String(err);
      if (msg.includes("auth/wrong-password") || msg.includes("auth/invalid-credential")) {
        setPwMsg({ ok: false, text: "Current password is incorrect." });
      } else {
        setPwMsg({ ok: false, text: "Could not update password. Please try again." });
      }
    } finally {
      setPwSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const auth = getFirebaseAuth();
      if (auth) await signOut(auth);
      router.replace("/login");
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Display name */}
      <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
        <h2 className="mb-1 text-base font-semibold text-[#F5F5F7]">Display Name</h2>
        <p className="mb-4 text-xs text-[#B8B0D3]">
          This name appears across DriveAura.
        </p>
        <form onSubmit={handleNameSave} className="space-y-3">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
            className="w-full rounded-lg border border-[#00F5FF]/20 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7] outline-none placeholder:text-[#B8B0D3]/50 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/15"
          />
          {nameMsg && (
            <p className={`text-xs ${nameMsg.ok ? "text-[#39FF14]" : "text-[#FF3B3F]"}`}>
              {nameMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={nameSaving}
            className="rounded-lg bg-[#FF3B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e23337] disabled:opacity-60"
          >
            {nameSaving ? "Saving…" : "Save name"}
          </button>
        </form>
      </div>

      {/* Password change — only for email/password accounts */}
      {!isGoogleUser && (
        <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
          <h2 className="mb-1 text-base font-semibold text-[#F5F5F7]">Change Password</h2>
          <p className="mb-4 text-xs text-[#B8B0D3]">
            You&apos;ll need to enter your current password to confirm.
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Current password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#00F5FF]/20 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7] outline-none placeholder:text-[#B8B0D3]/50 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/15"
            />
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="New password (min 6 characters)"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-[#00F5FF]/20 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7] outline-none placeholder:text-[#B8B0D3]/50 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/15"
            />
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Confirm new password"
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-[#00F5FF]/20 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7] outline-none placeholder:text-[#B8B0D3]/50 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/15"
            />
            {pwMsg && (
              <p className={`text-xs ${pwMsg.ok ? "text-[#39FF14]" : "text-[#FF3B3F]"}`}>
                {pwMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={pwSaving}
              className="rounded-lg bg-[#FF3B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e23337] disabled:opacity-60"
            >
              {pwSaving ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      )}

      {isGoogleUser && (
        <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-5">
          <h2 className="mb-1 text-base font-semibold text-[#F5F5F7]">Password</h2>
          <p className="text-xs text-[#B8B0D3]">
            You signed in with Google — password changes are managed through your Google account.
          </p>
        </div>
      )}

      {/* Sign out */}
      <div className="rounded-2xl border border-[#FF3B3F]/20 bg-[#1C1132]/70 p-5">
        <h2 className="mb-1 text-base font-semibold text-[#F5F5F7]">Sign Out</h2>
        <p className="mb-4 text-xs text-[#B8B0D3]">
          You will be returned to the login page.
        </p>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="rounded-lg border border-[#FF3B3F]/50 px-4 py-2 text-sm font-semibold text-[#FF3B3F] hover:bg-[#FF3B3F]/10 disabled:opacity-60"
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}

export default function AccountClient() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadinessCheckRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"history" | "settings">("history");

  useEffect(() => {
    void logAnalyticsEvent("account_viewed");
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setHistory(null);
    setError(null);

    fetchReadinessHistory({ userId: user.uid, limit: 10 })
      .then((items) => {
        if (cancelled) return;
        setHistory(items);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load readiness history.");
        setHistory([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const readinessRows = useMemo(() => {
    if (!history) return null;
    return history.map((r) => {
      const when = safeDateFromRecord(r);
      return {
        id: r.id,
        whenLabel: when ? formatWhen(when) : "Just now",
        scoreLabel: `${Math.round(r.readinessScore)}/100`,
        hardStop: Object.values(r.gateStops ?? {}).some(Boolean),
      };
    });
  }, [history]);

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-xs text-[#B8B0D3]">
              DriveAura • Account
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Account</h1>
            <p className="mt-3 text-sm text-[#B8B0D3]">
              Signed in as{" "}
              <span className="font-semibold text-[#F5F5F7]">
                {user?.email ?? user?.displayName ?? "Driver"}
              </span>
              .
            </p>
          </div>

          <Link
            href="/readiness-check"
            className="rounded-full bg-[#FF3B3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
          >
            New readiness check
          </Link>
        </div>

        {/* Tab bar */}
        <div className="mt-8 flex gap-1 rounded-xl border border-[#00F5FF]/15 bg-[#1C1132]/50 p-1 sm:w-fit">
          {(["history", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-[#FF3B3F] text-white"
                  : "text-[#B8B0D3] hover:text-[#F5F5F7]"
              }`}
            >
              {tab === "history" ? "Readiness history" : "Settings"}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "history" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6">
                  <h2 className="text-xl font-semibold">Drive readiness history</h2>
                  <p className="mt-2 text-sm text-[#B8B0D3]">
                    Your last check-ins (score + whether any hard stop was triggered).
                  </p>

                  {error ? (
                    <p className="mt-6 text-sm text-[#FF3B3F]">{error}</p>
                  ) : history === null ? (
                    <p className="mt-6 text-sm text-[#B8B0D3]">Loading…</p>
                  ) : readinessRows && readinessRows.length > 0 ? (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#00F5FF]/10">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#0F051D]/45 text-xs text-[#B8B0D3]">
                          <tr>
                            <th className="px-4 py-3 font-semibold">When</th>
                            <th className="px-4 py-3 font-semibold">Score</th>
                            <th className="px-4 py-3 font-semibold">Hard stop</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#00F5FF]/10">
                          {readinessRows.map((row) => (
                            <tr key={row.id} className="bg-[#1C1132]/40">
                              <td className="px-4 py-3 text-[#F5F5F7]">{row.whenLabel}</td>
                              <td className="px-4 py-3 font-semibold text-[#00F5FF]">
                                {row.scoreLabel}
                              </td>
                              <td className="px-4 py-3 text-[#B8B0D3]">
                                {row.hardStop ? (
                                  <span className="inline-flex rounded-full border border-[#FF3B3F]/35 bg-[#0F051D]/40 px-2 py-0.5 text-xs font-semibold text-[#FF3B3F]">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full border border-[#39FF14]/25 bg-[#0F051D]/40 px-2 py-0.5 text-xs font-semibold text-[#39FF14]">
                                    No
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-[#00F5FF]/10 bg-[#0F051D]/35 p-5">
                      <p className="text-sm text-[#B8B0D3]">
                        No saved readiness checks yet. Run one and save it to start a history.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
                  <p className="text-sm font-semibold text-[#F5F5F7]">Tip</p>
                  <p className="mt-1 text-xs text-[#B8B0D3]">
                    If your score is lower than usual, try the breathing + grounding steps and re-check
                    before driving.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-4">
                  <p className="text-sm font-semibold text-[#F5F5F7]">Privacy</p>
                  <p className="mt-1 text-xs text-[#B8B0D3]">
                    Saved history includes your score and your selected answers so you can spot patterns
                    over time.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl">
              <SettingsPanel />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
