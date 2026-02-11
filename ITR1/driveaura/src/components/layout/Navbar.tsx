"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          DriveAura
        </Link>
        <div className="flex items-center gap-4">
          <ul className="flex gap-4">
            <li>
              <Link
                href="/"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Account
              </Link>
            </li>
          </ul>

          {loading ? (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              …
            </span>
          ) : user ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
                router.push(`/login${next}`);
              }}
              className="rounded border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Log out
            </button>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(pathname || "/")}`}
              className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
