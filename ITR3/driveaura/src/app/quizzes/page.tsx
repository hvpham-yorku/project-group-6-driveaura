"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Quizzes are only started from the end of each learning module.
 * This hub is removed from navigation; keep a client redirect for old links.
 */
export default function QuizzesHubRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/modules");
  }, [router]);
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--void-purple)", color: "var(--lavender-mist)" }}
    >
      Redirecting to modules…
    </div>
  );
}
