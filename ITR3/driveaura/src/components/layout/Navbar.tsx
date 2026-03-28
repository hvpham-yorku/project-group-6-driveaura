"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = Boolean(user);

  const navLinks = [
    { href: "/modules", label: "Modules" },
    { href: "/test-centres", label: "Test Centres" },
    { href: "/test-checklist", label: "Checklist" },
    { href: "/readiness-check", label: "Readiness" },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-[#00F5FF]/10 bg-[#0b0820]/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight text-[#F5F5F7]"
        >
          <span>
            Drive<span className="text-[#FF3B3F]">Aura</span>
          </span>
          <Image
            src="/driveaura-logo.png"
            alt="DriveAura logo"
            width={250}
            height={100}
            priority
            className="h-16 w-auto sm:h-[4.5rem]"
          />
        </Link>
        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-4 md:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={
                    isLoggedIn || item.href.startsWith("/#")
                      ? item.href
                      : `/login?next=${encodeURIComponent(item.href)}`
                  }
                  className="text-sm text-[#B8B0D3] transition hover:text-[#F5F5F7]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li>
                <Link
                  href="/account"
                  className="text-sm text-[#B8B0D3] transition hover:text-[#F5F5F7]"
                >
                  Account
                </Link>
              </li>
            ) : null}
          </ul>

          {loading ? (
            <span className="text-xs text-[#B8B0D3]">
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
              className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-3 py-1.5 text-sm text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
            >
              Log out
            </button>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(pathname || "/")}`}
              className="rounded-full bg-[#FF3B3F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e23337]"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
