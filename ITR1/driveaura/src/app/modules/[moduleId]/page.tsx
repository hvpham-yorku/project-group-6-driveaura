"use client";

/// <reference types="react" />
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";
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

/** Warning signs and HOV lanes reference table — G1 Module 1. */
const WARNING_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
}> = [
  { category: "HOV", signName: "HOV Lane (Diamond)", instruction: "Only public vehicles (buses) or vehicles with a minimum number of passengers (2+ or 3+) may use this lane." },
  { category: "HOV", signName: "HOV Do Not Cross", instruction: "Vehicles cannot change lanes into or out of an HOV lane in this area (marked by solid lines)." },
  { category: "Warning", signName: "General Warning", instruction: "Usually diamond-shaped with a yellow background; warns of dangerous or unusual conditions ahead." },
  { category: "Warning", signName: "Narrow Bridge", instruction: "The bridge ahead is narrower than the road; slow down and use caution." },
  { category: "Warning", signName: "Road Branching Off", instruction: "Indicates a road branches off ahead." },
  { category: "Warning", signName: "Intersection Ahead", instruction: "An intersection is ahead; the arrow shows which direction of traffic has the right-of-way." },
  { category: "Warning", signName: "Roundabout Ahead", instruction: "Reduce speed; counter-clockwise arrows show the direction of traffic within the roundabout." },
  { category: "Warning", signName: "Hidden Side Road", instruction: "Drivers on the side road at the intersection ahead do not have a clear view of traffic." },
  { category: "Warning", signName: "Pavement Narrows", instruction: "The road surface becomes narrower ahead." },
  { category: "Warning", signName: "Slight Curve", instruction: "There is a slight bend or curve in the road ahead." },
  { category: "Warning", signName: "Safe Curve Speed", instruction: "Posted under a curve warning; shows the maximum safe speed for that curve." },
  { category: "Warning", signName: "Sharp Bend/Turn", instruction: "A sharp bend or turn is in the road ahead." },
  { category: "Warning", signName: "Chevron (Arrowhead)", instruction: "Posted in groups to guide drivers around sharp curves." },
  { category: "Warning", signName: "Winding Road", instruction: "There is a winding road ahead." },
  { category: "Warning", signName: "Opening Bridge", instruction: "The bridge ahead lifts or swings to let boats pass." },
  { category: "Warning", signName: "Paved Surface Ends", instruction: "The paved portion of the road ends ahead." },
  { category: "Warning", signName: "Bicycle Crossing", instruction: "A bicycle crossing is ahead." },
  { category: "Warning", signName: "Stop Sign Ahead", instruction: "Slow down and prepare for a stop sign you cannot see yet." },
  { category: "Warning", signName: "Share the Road", instruction: "Warns motorists to provide safe space for cyclists and other vehicles." },
  { category: "Warning", signName: "Slippery When Wet", instruction: "Pavement is slick when wet; slow down and drive with caution." },
  { category: "Warning", signName: "Hazard Marker", instruction: "Downward lines show the side on which you may safely pass a hazard near the road edge." },
  { category: "Warning", signName: "Divided Highway Begins", instruction: "Traffic travels on separated roads ahead; keep to the right-hand road." },
  { category: "Warning", signName: "Right Lane Ends", instruction: "Merge safely with traffic in the lane to the left." },
  { category: "Warning", signName: "Traffic Lights Ahead", instruction: "Slow down for an upcoming signalized intersection." },
  { category: "Warning", signName: "Steep Hill", instruction: "A steep hill is ahead; you may need to use a lower gear." },
  { category: "Warning", signName: "Merging Traffic", instruction: "Two roads joining into one; both drivers are equally responsible for merging safely." },
  { category: "Warning", signName: "Snowmobile Crossing", instruction: "Snowmobiles cross this road." },
  { category: "Warning", signName: "Divided Highway Ends", instruction: "Traffic travels in both directions on the same road ahead; keep right." },
  { category: "Warning", signName: "Underpass Clearance", instruction: "Shows the height clearance for tall vehicles." },
  { category: "Warning", signName: "Bump / Uneven Road", instruction: "Slow down and keep control of your vehicle." },
  { category: "Warning", signName: "Railway Crossing Ahead", instruction: "Be alert for trains; sign shows the angle the tracks cross the road." },
  { category: "Warning", signName: "Sharp Turn (Checkerboard)", instruction: "Sharp turn in the arrow's direction; checkerboard border warns of danger." },
  { category: "Warning", signName: "Animal Crossing (Deer)", instruction: "Deer regularly cross here; be alert for animals." },
  { category: "Warning", signName: "Truck Entrance", instruction: "Watch for trucks entering the road from the side indicated on the sign." },
  { category: "Warning", signName: "Ramp Speed", instruction: "Shows the maximum safe speed on the ramp." },
  { category: "Warning", signName: "Fallen Rock", instruction: "Watch for rocks on the road and be prepared to avoid them." },
  { category: "Warning", signName: "Water Over Road", instruction: "There may be water flowing over the road surface." },
  { category: "Warning", signName: "Hidden Bus Stop", instruction: "Slow down and watch for children and school buses with flashing red lights." },
  { category: "Warning", signName: "Emergency Entrance", instruction: "Upcoming bus or fire truck entrance; be prepared to yield." },
  { category: "Warning", signName: "School Crossing", instruction: "Watch for children and follow directions of crossing guards." },
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
                ) : moduleId === "g1-signs-signals-markings" &&
                  currentLesson.id === "2" ? (
                  <>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Warning signs alert you to potential hazards or unusual
                      conditions ahead. HOV (High-Occupancy Vehicle) lanes have
                      specific rules for entry and exit. Always be prepared to
                      adjust your driving when you see these signs.
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
                              Instruction / Rule
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {WARNING_SIGN_TABLE_DATA.map((row, index) => {
                            const prevCategory =
                              index > 0
                                ? WARNING_SIGN_TABLE_DATA[index - 1].category
                                : null;
                            const showCategoryDivider =
                              index === 0 ||
                              (prevCategory !== null &&
                                prevCategory !== row.category);
                            const isLastRow =
                              index === WARNING_SIGN_TABLE_DATA.length - 1;

                            return (
                              <React.Fragment key={`row-${index}`}>
                                {showCategoryDivider && (
                                  <tr
                                    style={{
                                      backgroundColor: "var(--midnight-indigo)",
                                    }}
                                  >
                                    <td
                                      colSpan={3}
                                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                                      style={{
                                        color: "var(--ghost-white)",
                                        borderTop:
                                          index === 0
                                            ? undefined
                                            : "2px solid var(--electric-cyan)",
                                        borderBottom: "1px solid var(--midnight-indigo)",
                                      }}
                                    >
                                      {row.category} Signs
                                    </td>
                                  </tr>
                                )}
                                <tr
                                  className="transition-shadow duration-200"
                                  style={{
                                    backgroundColor: "var(--void-purple)",
                                    color: "var(--lavender-mist)",
                                    borderBottom: isLastRow
                                      ? undefined
                                      : "1px solid var(--midnight-indigo)",
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
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
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
