import Link from "next/link";
import { iteration1 } from "./config/features";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-10 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          DriveAura — Ontario driving learning platform. Central directory of
          feature pages.
        </p>
      </header>

      <section className="rounded border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Iteration 1 (Learning)
        </h2>
        <ul className="list-none space-y-2">
          {iteration1.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
