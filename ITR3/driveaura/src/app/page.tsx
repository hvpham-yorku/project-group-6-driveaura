"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { allFeatureSections } from "./config/features";

type NavFeature = {
  href: string;
  label: string;
};

const heroQuickLinks: readonly NavFeature[] = [
  { href: "/modules", label: "Modules" },
  { href: "/test-centres", label: "Test Centres" },
  { href: "/test-checklist", label: "Checklist" },
  { href: "/readiness-check", label: "Readiness" },
];

function toFeatureHref(href: string, isLoggedIn: boolean) {
  return isLoggedIn ? href : `/login?next=${encodeURIComponent(href)}`;
}

export default function Home() {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  return (
    <main className="min-h-screen bg-[#0F051D] text-[#F5F5F7]">
      <section
        className="border-b border-[#00F5FF]/10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,245,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,245,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:py-24">
          <p className="mb-6 inline-flex rounded-full border border-[#00F5FF]/20 bg-[#1C1132] px-4 py-1.5 text-sm text-[#B8B0D3]">
            Now supporting Ontario G1, G2, G and readiness practice
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            Master the road,{" "}
            <span className="text-[#FF3B3F]">earn your Aura.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-[#B8B0D3] sm:text-lg">
            Personalized learning modules, practical driving tools, and calm prep
            experiences built for real Canadian roads and modern vehicles.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={toFeatureHref("/modules", isLoggedIn)}
              className="rounded-full bg-[#FF3B3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e23337]"
            >
              Start Learning
            </Link>
            <Link
              href={toFeatureHref("/test-centres", isLoggedIn)}
              className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-6 py-3 text-sm font-semibold text-[#F5F5F7] transition hover:border-[#00F5FF]/60"
            >
              Explore test centres
            </Link>
          </div>

          <div className="mt-10 max-w-4xl rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132]/70 p-6 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">About DriveAura</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#B8B0D3] sm:text-base">
              DriveAura is a Canadian driving learning platform for G1, G2, and G
              prep, built to turn test preparation into real-world confidence. Our
              approach combines targeted learning modules, practical assessments,
              scenario-based decision training, and guided route awareness so
              learners can improve weak areas with clear next steps. We also add
              gamified Aura progress and consistency milestones to keep practice
              focused, motivating, and measurable from first lesson to test day.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">Your path to a license</h2>
        <p className="mt-3 text-[#B8B0D3]">
          Learn the rules, practice the habits, and show up confident.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#00F5FF]/10 bg-[#1C1132] p-5 text-center">
            <p className="text-sm font-semibold text-[#00F5FF]">01. Learn with modules</p>
            <p className="mt-3 text-sm text-[#B8B0D3]">
              Start with guided G1 to G content, clean visuals, and quick checks.
            </p>
          </article>
          <article className="rounded-2xl border border-[#00F5FF]/10 bg-[#1C1132] p-5 text-center">
            <p className="text-sm font-semibold text-[#00F5FF]">02. Practice smarter</p>
            <p className="mt-3 text-sm text-[#B8B0D3]">
              Use the Passenger Checklist, quizzes, and test centre tools like a mock exam.
            </p>
          </article>
          <article className="rounded-2xl border border-[#00F5FF]/10 bg-[#1C1132] p-5 text-center">
            <p className="text-sm font-semibold text-[#00F5FF]">03. Know the test centres</p>
            <p className="mt-3 text-sm text-[#B8B0D3]">
              Explore centres, map previews, and scenario-based judgment training.
            </p>
          </article>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 pb-16 text-center">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {heroQuickLinks.map((item) => (
            <Link
              key={item.href}
              href={toFeatureHref(item.href, isLoggedIn)}
              className="rounded-full border border-[#00F5FF]/25 bg-[#1C1132] px-4 py-2 text-xs font-medium text-[#B8B0D3] hover:border-[#00F5FF]/60"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="space-y-10">
          {allFeatureSections.map((section) => (
            <section key={section.title} className="text-center">
              <h3 className="text-xl font-semibold text-[#F5F5F7]">{section.title}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={toFeatureHref(item.href, isLoggedIn)}
                    className="group rounded-2xl border border-[#00F5FF]/15 bg-[#1C1132] p-5 text-center transition hover:border-[#00F5FF]/60"
                  >
                    <p className="text-base font-semibold text-[#F5F5F7]">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#B8B0D3]">
                      {item.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-[#00F5FF]">
                      {isLoggedIn ? "Open feature" : "Log in to access"}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

    </main>
  );
}
