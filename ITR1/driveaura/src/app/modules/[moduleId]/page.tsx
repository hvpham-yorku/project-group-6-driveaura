"use client";

/// <reference types="react" />
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { MODULES, type Lesson } from "../data";

/* Inline SVG */
function IconChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/** Placeholder for sign icon in the Regulatory Signs table. */
function SignIconPlaceholder() {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border"
      style={{
        borderColor: "var(--lavender-mist)",
        color: "var(--lavender-mist)",
        backgroundColor: "var(--midnight-indigo)",
      }}
      aria-hidden
    >
      <span className="text-xs">?</span>
    </div>
  );
}

/** Regulatory signs reference table — G1 Module 1. */
const REGULATORY_SIGN_TABLE_DATA: Array<{
  signName: string;
  instruction: string;
}> = [
  { signName: "Stop Sign", instruction: "Complete stop at line, crosswalk, sidewalk, or edge of intersection. Wait for clear path." },
  { signName: "Yield Sign", instruction: "Let traffic in/near intersection go first. Stop only if necessary." },
  { signName: "Railway Crossing", instruction: "X-shaped. Slow down, look both ways, and prepare to stop." },
  { signName: "Bicycle Route", instruction: "Official route. Watch for and share the road with cyclists." },
  { signName: "Parking Permitted", instruction: "Parking allowed between signs during posted times." },
  { signName: "Snowmobiles", instruction: "Snowmobiles are permitted to use this road." },
  { signName: "Do Not Enter", instruction: "Do not enter this road." },
  { signName: "No Stopping", instruction: "Do not stop even for a moment between these signs." },
  { signName: "No Standing", instruction: "No stopping except to load/unload passengers." },
  { signName: "No Parking", instruction: "No stopping except to load/unload passengers or merchandise." },
  { signName: "No Left / Right / U-Turn", instruction: "Forbidden maneuvers at the intersection or light." },
  { signName: "No Bicycles / Pedestrians", instruction: "Bicycles or pedestrians are not allowed on this road." },
  { signName: "Keep Right", instruction: "Keep to the right of the traffic island." },
  { signName: "Do Not Pass", instruction: "Passing other vehicles is forbidden on this road." },
  { signName: "Slow Traffic Keep Right", instruction: "Slower traffic on multi-lane roads must stay in the right lane." },
  { signName: "One Way", instruction: "Traffic may only travel in the direction of the arrow." },
  { signName: "Community Safety Zone", instruction: "Special risk area; traffic offences subject to increased fines." },
  { signName: "School Zone Speed", instruction: "Lower speed limit applies when yellow lights are flashing." },
  { signName: "Stop for School Bus", instruction: "Must stop for bus with flashing signals (even on multi-lane roads without medians)." },
  { signName: "Lane Directional Arrows", instruction: "Above road or on pavement; dictates mandatory travel direction for that lane." },
  { signName: "Two-Way Left Turn", instruction: "Center lane reserved exclusively for two-way left turns." },
  { signName: "Reserved (HOV) Lanes", instruction: "Lanes for specific vehicles (buses, taxis, 3+ people) during set hours." },
  { signName: "Climbing / Passing Lane", instruction: "Keep right except when passing on two-lane sections." },
  { signName: "Yield to Bus", instruction: "Reminder to yield to buses signaling intent to return to a lane." },
  { signName: "Road Forks Right", instruction: "Indicates the road splits to the right ahead." },
  { signName: "Pedestrian Crossover", instruction: "Be prepared to stop and yield to pedestrians." },
];

function ModuleReaderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const moduleId = typeof params.moduleId === "string" ? params.moduleId : "";
  const lessonParam = searchParams.get("lesson");

  const moduleItem = useMemo(
    () => MODULES.find((m) => m.id === moduleId),
    [moduleId]
  );

  const lessonIndex = useMemo(() => {
    if (!moduleItem?.lessons.length) return 0;
    const idx = lessonParam
      ? moduleItem.lessons.findIndex((l: Lesson) => l.id === lessonParam)
      : -1;
    return idx >= 0 ? idx : 0;
  }, [moduleItem, lessonParam]);

  const [markedComplete, setMarkedComplete] = useState(false);
  const currentLesson = moduleItem?.lessons[lessonIndex];

  if (!moduleItem) {
    return (
      <main
        className="mx-auto min-h-screen px-4 py-12"
        style={{ backgroundColor: "var(--void-purple)" }}
      >
        <p style={{ color: "var(--lavender-mist)" }}>Module not found.</p>
        <Link
          href="/modules"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "var(--electric-cyan)" }}
        >
          <IconChevronLeft />
          Back to Learning Hub
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--void-purple)" }}
    >
      {/* Top bar: back link */}
      <div
        className="border-b px-4 py-3"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href={`/modules/level/${moduleItem.licenseLevel}`}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "var(--electric-cyan)" }}
          >
            <IconChevronLeft />
            Back to {moduleItem.licenseLevel} modules
          </Link>
          <span
            className="text-sm"
            style={{ color: "var(--lavender-mist)" }}
          >
            {moduleItem.title}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        {/* Left: lesson nav */}
        <aside
          className="w-full border-b lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r"
          style={{
            borderColor: "var(--midnight-indigo)",
            backgroundColor: "var(--midnight-indigo)",
          }}
        >
          <nav className="p-4" aria-label="Module chapters">
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--lavender-mist)" }}
            >
              Lessons
            </h2>
            <ul className="space-y-1">
              {moduleItem.lessons.map((lesson: Lesson, idx: number) => {
                const isActive = idx === lessonIndex;
                const href = `/modules/${moduleId}?lesson=${lesson.id}`;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={href}
                      className="block rounded-lg px-3 py-2 text-sm transition-colors"
                      style={
                        isActive
                          ? {
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }
                          : {
                              color: "var(--lavender-mist)",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "var(--void-purple)";
                          e.currentTarget.style.color = "var(--ghost-white)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--lavender-mist)";
                        }
                      }}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Right: content */}
        <div className="flex-1 p-4 lg:p-8">
          {currentLesson ? (
            <>
              <h1
                className="mb-4 text-xl font-bold sm:text-2xl"
                style={{ color: "var(--ghost-white)" }}
              >
                {currentLesson.title}
              </h1>

              {/* Video placeholder */}
              <div
                className="mb-6 flex aspect-video w-full items-center justify-center rounded-xl border-2"
                style={{
                  borderColor: "var(--midnight-indigo)",
                  backgroundColor: "var(--void-purple)",
                  color: "var(--lavender-mist)",
                }}
                aria-hidden
              >
                <span className="text-sm">Video placeholder</span>
              </div>

              {/* Lesson text */}
              <div className="mb-8 max-w-none">
                {moduleId === "g1-signs-signals-markings" &&
                currentLesson.id === "1" ? (
                  <>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Regulatory signs tell you about laws and rules that apply
                      to the road. Follow them as required by the Ontario
                      Highway Traffic Act.
                    </p>
                    <div
                      className="overflow-x-auto rounded-lg border"
                      style={{
                        backgroundColor: "var(--void-purple)",
                        borderColor: "var(--midnight-indigo)",
                      }}
                    >
                      <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "var(--midnight-indigo)",
                              color: "var(--ghost-white)",
                            }}
                          >
                            <th
                              className="w-16 px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              Signs
                            </th>
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              Sign Name
                            </th>
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              Instruction / Legal Rule
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {REGULATORY_SIGN_TABLE_DATA.map((row, index) => (
                            <tr
                              key={`${row.signName}-${index}`}
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
                                borderBottom:
                                  index < REGULATORY_SIGN_TABLE_DATA.length - 1
                                    ? "1px solid var(--midnight-indigo)"
                                    : undefined,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 0 20px rgba(0, 245, 255, 0.25)";
                                e.currentTarget.style.color =
                                  "var(--ghost-white)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.color =
                                  "var(--lavender-mist)";
                              }}
                            >
                              <td
                                className="px-4 py-3"
                                style={{ color: "inherit" }}
                              >
                                <SignIconPlaceholder />
                              </td>
                              <td
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                {row.signName}
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                {row.instruction}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : moduleId === "g1-sharing-the-road" &&
                  currentLesson.id === "1" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Sharing the road means watching out for pedestrians,
                        cyclists, buses, and other drivers so everyone gets
                        home safely. As a G1 driver, you are learning to plan
                        ahead and leave extra space instead of reacting late.
                      </p>
                    </div>
                    <div
                      className="mt-6 rounded-lg border p-4"
                      style={{
                        backgroundColor: "var(--void-purple)",
                        borderColor: "var(--midnight-indigo)",
                        color: "var(--lavender-mist)",
                      }}
                    >
                      <h2 className="mb-2 text-sm font-semibold">
                        Who you share the road with
                      </h2>
                      <p className="mb-2 text-sm">
                        You will drive around many different road users. Know who
                        they are and give them space:
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        <li>Pedestrians</li>
                        <li>Cyclists</li>
                        <li>Large vehicles (trucks, buses)</li>
                        <li>School buses</li>
                        <li>Emergency vehicles</li>
                      </ul>
                    </div>
                    <div
                      className="mt-6 rounded-lg border p-4"
                      style={{
                        backgroundColor: "var(--void-purple)",
                        borderColor: "var(--midnight-indigo)",
                        color: "var(--lavender-mist)",
                      }}
                    >
                      <h2 className="text-sm font-semibold">
                        Quick knowledge check
                      </h2>
                      <p className="mt-2 text-sm">
                        Q1: Why is it important for a G1 driver to learn how to
                        share the road with other road users?
                      </p>
                      <ol className="mt-3 space-y-2 text-sm">
                        <li>
                          <span className="font-semibold">A.</span> It reduces
                          the chance of crashes and keeps vulnerable road users
                          safe.
                        </li>
                        <li>
                          <span className="font-semibold">B.</span> It only
                          matters on highways, not in the city.
                        </li>
                        <li>
                          <span className="font-semibold">C.</span> It is mainly
                          for experienced G drivers, not beginners.
                        </li>
                        <li>
                          <span className="font-semibold">D.</span> It just
                          helps you drive faster through intersections.
                        </li>
                      </ol>
                    </div>
                    <div
                      className="mt-6 rounded-lg border p-4"
                      style={{
                        backgroundColor: "var(--void-purple)",
                        borderColor: "var(--midnight-indigo)",
                        color: "var(--lavender-mist)",
                      }}
                    >
                      <h2 className="mb-2 text-sm font-semibold">
                        School buses and streetcars – key rules
                      </h2>
                      <ul className="list-disc space-y-2 pl-5 text-sm">
                        <li>
                          <strong>School buses (no median):</strong> Stop in
                          both directions when red lights flash and the stop arm
                          is out. Stay at least 20 metres back until the lights
                          stop.
                        </li>
                        <li>
                          <strong>School buses (divided road with median):</strong>{" "}
                          Only vehicles behind the bus must stop; oncoming
                          traffic may continue with caution.
                        </li>
                        <li>
                          <strong>Streetcars (no safety island):</strong> Stop
                          at least 2 metres behind the rear door and wait until
                          passengers are safely off the road.
                        </li>
                      </ul>
                    </div>
                    <div
                      className="mt-6 rounded-lg border p-4"
                      style={{
                        backgroundColor: "var(--void-purple)",
                        borderColor: "var(--midnight-indigo)",
                        color: "var(--lavender-mist)",
                      }}
                    >
                      <h2 className="text-sm font-semibold">
                        Quick knowledge check
                      </h2>
                      <p className="mt-2 text-sm">
                        Q2: On a two-lane road with no median, what must you do
                        when a school bus has its red lights flashing and stop
                        arm extended?
                      </p>
                      <ol className="mt-3 space-y-2 text-sm">
                        <li>
                          <span className="font-semibold">A.</span> Stop in
                          both directions and stay at least 20 metres back until
                          the lights stop.
                        </li>
                        <li>
                          <span className="font-semibold">B.</span> Only slow
                          down and pass with caution.
                        </li>
                        <li>
                          <span className="font-semibold">C.</span> Stop only if
                          you are behind the bus; oncoming traffic may continue.
                        </li>
                        <li>
                          <span className="font-semibold">D.</span> Honk and
                          drive past quickly so children clear the road.
                        </li>
                      </ol>
                    </div>
                  </>
                ) : moduleId === "g1-sharing-the-road" &&
                  currentLesson.id === "2" ? (
                  <>
                    <div className="space-y-3">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Cyclists, pedestrians, and people using mobility
                        devices do not have a vehicle to protect them. You must
                        give them extra space and time.
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Leave at least{" "}
                          <span className="font-semibold">1 metre</span> when
                          passing a cyclist where possible.
                        </li>
                        <li>
                          Shoulder check for cyclists before turning right or
                          opening your door.
                        </li>
                        <li>
                          If the lane is too narrow to pass safely, slow down
                          and wait instead of trying to squeeze by.
                        </li>
                        <li>
                          In school zones and at crosswalks, reduce speed and be
                          prepared to stop for pedestrians.
                        </li>
                      </ul>
                    </div>
                    <div
                      className="mt-6 rounded-lg border p-4"
                      style={{
                        backgroundColor: "var(--void-purple)",
                        borderColor: "var(--midnight-indigo)",
                        color: "var(--lavender-mist)",
                      }}
                    >
                      <h2 className="text-sm font-semibold">
                        Quick knowledge check
                      </h2>
                      <p className="mt-2 text-sm">
                        Q3: When you want to pass a cyclist, what is the safest
                        way to do it on a narrow city street?
                      </p>
                      <ol className="mt-3 space-y-2 text-sm">
                        <li>
                          <span className="font-semibold">A.</span> Slow down,
                          wait for a safe gap, and pass with at least 1 metre of
                          space.
                        </li>
                        <li>
                          <span className="font-semibold">B.</span> Honk and
                          pass closely so the cyclist moves out of the way.
                        </li>
                        <li>
                          <span className="font-semibold">C.</span> Squeeze
                          between the cyclist and oncoming traffic to save time.
                        </li>
                        <li>
                          <span className="font-semibold">D.</span> Drive on the
                          shoulder to get around the cyclist as fast as
                          possible.
                        </li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <p
                    className="leading-relaxed"
                    style={{ color: "var(--lavender-mist)" }}
                  >
                    {currentLesson.content}
                  </p>
                )}
              </div>

              {/* Mark as complete */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setMarkedComplete(true)}
                  disabled={markedComplete}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:ring-offset-2 focus:ring-offset-void-purple"
                  style={
                    markedComplete
                      ? {
                          cursor: "default",
                          backgroundColor: "var(--midnight-indigo)",
                          color: "var(--neon-mint)",
                          border: "1px solid var(--neon-mint)",
                        }
                      : {
                          backgroundColor: "var(--crimson-spark)",
                          color: "white",
                        }
                  }
                >
                  <IconCheck />
                  {markedComplete ? "Marked complete" : "Mark as complete"}
                </button>
                {lessonIndex < moduleItem.lessons.length - 1 && (
                  <Link
                    href={`/modules/${moduleId}?lesson=${moduleItem.lessons[lessonIndex + 1].id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "var(--electric-cyan)" }}
                  >
                    Next lesson →
                  </Link>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: "var(--lavender-mist)" }}>
              No lesson selected.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ModuleReaderPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "var(--void-purple)", color: "var(--lavender-mist)" }}
        >
          Loading…
        </div>
      }
    >
      <ModuleReaderContent />
    </Suspense>
  );
}
