import LoginClient from "./LoginClient";
import React, { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-10">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

