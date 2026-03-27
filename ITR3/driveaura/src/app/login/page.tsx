import LoginClient from "./LoginClient";
import React, { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="w-full max-w-md">
          <p className="text-sm text-[#B8B0D3]">Loading…</p>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

