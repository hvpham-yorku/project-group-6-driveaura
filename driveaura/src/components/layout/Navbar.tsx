"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
];

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          DriveAura
        </Link>
        <ul className="flex gap-4">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
