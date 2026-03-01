"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

function getFriendlyAuthError(message: string) {
  if (message.includes("auth/invalid-credential")) return "Invalid email or password.";
  if (message.includes("auth/invalid-email")) return "That email address looks invalid.";
  if (message.includes("auth/missing-password")) return "Please enter a password.";
  if (message.includes("auth/email-already-in-use")) return "That email is already in use.";
  if (message.includes("auth/weak-password")) return "Password is too weak (min 6 characters).";
  if (message.includes("auth/popup-closed-by-user")) return "Popup closed before completing sign-in.";
  return "Something went wrong. Please try again.";
}

export default function LoginClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, router, next]);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        setError("Sign-in is not configured. Add Firebase keys to .env.local.");
        setSubmitting(false);
        return;
      }
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace(next);
    } catch (err) {
      setError(getFriendlyAuthError(String(err)));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        setError("Sign-in is not configured. Add Firebase keys to .env.local.");
        setSubmitting(false);
        return;
      }
      await signInWithPopup(auth, googleProvider);
      router.replace(next);
    } catch (err) {
      setError(getFriendlyAuthError(String(err)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="w-full max-w-md">
      <div className="rounded-2xl border border-[#00F5FF]/20 bg-[#1C1132] p-6 shadow-[0_0_0_1px_rgba(0,245,255,0.08),0_20px_60px_rgba(0,0,0,0.45)]">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold text-[#F5F5F7]">
            {mode === "login" ? "Log in" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-[#B8B0D3]">
            Sign in to access DriveAura.
          </p>
        </header>

        {error ? (
          <div className="mb-4 rounded-lg border border-[#FF3B3F]/35 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7]">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="mb-4 w-full rounded-lg border border-[#00F5FF]/25 bg-[#0F051D] px-3 py-2 text-sm font-medium text-[#F5F5F7] hover:border-[#00F5FF]/45 hover:bg-[#0F051D]/80 disabled:opacity-60"
        >
          Continue with Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#00F5FF]/15" />
          <span className="text-xs text-[#B8B0D3]">or</span>
          <div className="h-px flex-1 bg-[#00F5FF]/15" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm text-[#B8B0D3]">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-[#00F5FF]/20 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7] outline-none placeholder:text-[#B8B0D3]/60 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/15"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-[#B8B0D3]">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={6}
              className="w-full rounded-lg border border-[#00F5FF]/20 bg-[#0F051D] px-3 py-2 text-sm text-[#F5F5F7] outline-none placeholder:text-[#B8B0D3]/60 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/15"
              placeholder="••••••••"
            />
          </label>

          <button
            disabled={submitting}
            type="submit"
            className="w-full rounded-lg bg-[#FF3B3F] px-3 py-2 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,59,63,0.25)] hover:bg-[#e23337] disabled:opacity-60"
          >
            {submitting ? "Working…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-[#B8B0D3]">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-[#00F5FF] hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-[#00F5FF] hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </div>

        <footer className="mt-6 border-t border-[#00F5FF]/15 pt-4 text-xs text-[#B8B0D3]">
          <Link href="/" className="hover:underline hover:decoration-[#00F5FF]">
            Back to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}

