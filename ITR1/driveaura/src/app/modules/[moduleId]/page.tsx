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

/** Temporary condition signs reference table — G1 Module 1. */
const TEMPORARY_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
}> = [
  { category: "Temporary", signName: "General Temporary Signs", instruction: "Usually diamond-shaped with an orange background and black symbols. Warn of unusual conditions like road work or detours." },
  { category: "Temporary", signName: "Construction Ahead", instruction: "Indicates that construction work is one kilometre ahead." },
  { category: "Temporary", signName: "Road Work Ahead", instruction: "Workers are currently on or near the road ahead." },
  { category: "Temporary", signName: "Survey Crew", instruction: "A survey crew is working on the road ahead." },
  { category: "Temporary", signName: "Traffic Control Person", instruction: "A person is ahead directing traffic. Drive slowly and watch for instructions." },
  { category: "Temporary", signName: "Construction Zone Entry", instruction: "You are entering a zone; drive with extra caution and expect a lower speed limit." },
  { category: "Temporary", signName: "Temporary Detour", instruction: "Normal route is diverted. Follow flashing lights on arrows for direction." },
  { category: "Temporary", signName: "Grooved Pavement", instruction: "Surface has been milled; stopping ability is affected. Motorcyclists may have reduced traction." },
  { category: "Temporary", signName: "Lane Closed", instruction: "Lane ahead is closed for roadwork. Obey the speed limit and merge into the open lane." },
  { category: "Temporary", signName: "Closed Lane (Arrow)", instruction: "Follow the direction of the arrow and adjust speed to merge safely." },
  { category: "Temporary", signName: "Pilot / Pace Vehicle", instruction: "Do not pass the vehicle bearing this sign. Reduce speed and be prepared to stop." },
  { category: "Temporary", signName: "Detour Marker", instruction: "Follow this marker until you return to your regular route." },
  { category: "Temporary", signName: "Bridge Staging", instruction: "Used to control traffic over a one-lane bridge (often using traffic lights or signs)." },
  { category: "Temporary", signName: "Increased Fines Sign", instruction: "Enforces doubling of HTA fines for speeding in a construction zone when workers are present." },
];

/** Information and direction signs reference table — G1 Module 1. */
const INFORMATION_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
}> = [
  { category: "Information", signName: "Town/City Directions", instruction: "Green signs providing directions to nearby towns and cities." },
  { category: "Information", signName: "Distances", instruction: "Shows the distance in kilometres to towns and cities on the road." },
  { category: "Information", signName: "Exit Guidance", instruction: "Helps drivers choose the correct lane to exit or stay on a freeway using arrows and destination names." },
  { category: "Information", signName: "Interchange Numbers", instruction: "Numbers corresponding to the distance in km from the start of the freeway." },
  { category: "Information", signName: "VIA (Road Route)", instruction: "Describes specific roads that must be followed to reach a particular destination." },
  { category: "Information", signName: "Roundabout Exits", instruction: "Shows upcoming roundabout exits and their respective destinations." },
  { category: "Information", signName: "Dynamic Info Signs", instruction: "Electronic signs providing real-time information on traffic delays and lane closures." },
  { category: "Information", signName: "Off-Road Facilities", instruction: "Blue signs indicating services like hospitals, airports, universities, or carpool lots." },
  { category: "Information", signName: "Railway Station", instruction: "Indicates the route to a passenger railway station." },
  { category: "Information", signName: "Accessible Facilities", instruction: "Indicates buildings or rest areas that are wheelchair accessible." },
  { category: "Information", signName: "D sign – Oversize load", instruction: "Indicates a vehicle is carrying an oversize load." },
  { category: "Information", signName: "Slow-Moving Vehicle", instruction: "Orange triangle with red border; alerts that the vehicle ahead travels at 40 km/h or less." },
  { category: "Information", signName: "EDR (Emergency Detour)", instruction: "Markers providing direction around an unscheduled highway closure back to the highway." },
  { category: "Information", signName: "LCV (Long Commercial)", instruction: "Identifies double trailers up to 40m long; anticipate extended length and limited speed." },
];

/** Other signs reference table — G1 Module 1. */
const OTHER_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
}> = [
  { category: "Other", signName: "Slow-Moving Vehicle", instruction: "An orange triangle with a red border. Alerts that the vehicle (e.g., farm tractor) travels at 40 km/h or less. Drivers must reduce speed and use caution." },
  { category: "Other", signName: "EDR (Emergency Detour)", instruction: "Used during unscheduled provincial highway closures. Follow these markers along alternative routes to be directed around the closure and back onto the highway." },
  { category: "Other", signName: "LCV (Long Commercial Vehicle)", instruction: "A placard identifying a double trailer up to 40m in length. Drivers should anticipate extended length and limited speed when preparing to pass." },
  { category: "Other", signName: "Emergency Response Signs", instruction: "Information signs that include a numbering system along the bottom to assist emergency vehicles and drivers in determining an appropriate route." },
  { category: "Other", signName: "Bilingual Signs", instruction: "Signs in designated bilingual areas featuring messages in both English and French. Read the message in the language you understand best." },
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
                ) : moduleId === "g1-signs-signals-markings" &&
                  currentLesson.id === "3" ? (
                  <>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Temporary condition signs use an orange background to alert
                      you to road work, detours, and other short-term hazards.
                      Slow down, follow instructions, and watch for workers and
                      equipment.
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
                          {TEMPORARY_SIGN_TABLE_DATA.map((row, index) => {
                            const prevCategory =
                              index > 0
                                ? TEMPORARY_SIGN_TABLE_DATA[index - 1].category
                                : null;
                            const showCategoryDivider =
                              index === 0 ||
                              (prevCategory !== null &&
                                prevCategory !== row.category);
                            const isLastRow =
                              index === TEMPORARY_SIGN_TABLE_DATA.length - 1;

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
                ) : moduleId === "g1-signs-signals-markings" &&
                  currentLesson.id === "4" ? (
                  <>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Information and direction signs help you navigate, find
                      services, and understand road conditions. They include
                      green direction signs, blue facility signs, and special
                      markers such as the D sign for oversize loads.
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
                          {INFORMATION_SIGN_TABLE_DATA.map((row, index) => {
                            const prevCategory =
                              index > 0
                                ? INFORMATION_SIGN_TABLE_DATA[index - 1].category
                                : null;
                            const showCategoryDivider =
                              index === 0 ||
                              (prevCategory !== null &&
                                prevCategory !== row.category);
                            const isLastRow =
                              index === INFORMATION_SIGN_TABLE_DATA.length - 1;

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
                ) : moduleId === "g1-signs-signals-markings" &&
                  currentLesson.id === "5" ? (
                  <>
                    <p
                      className="mb-6 leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Other signs cover slow-moving vehicles, emergency detours,
                      long commercial vehicles, emergency response numbering,
                      and bilingual messaging. Recognize them to drive safely
                      and follow alternate routes when needed.
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
                          {OTHER_SIGN_TABLE_DATA.map((row, index) => {
                            const prevCategory =
                              index > 0
                                ? OTHER_SIGN_TABLE_DATA[index - 1].category
                                : null;
                            const showCategoryDivider =
                              index === 0 ||
                              (prevCategory !== null &&
                                prevCategory !== row.category);
                            const isLastRow =
                              index === OTHER_SIGN_TABLE_DATA.length - 1;

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
                ) : moduleId === "g1-impaired-driving" &&
                  currentLesson.id === "1" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Content in this module is based on the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Official MTO Driver&apos;s Handbook
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://www.ontario.ca/page/impaired-driving"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Ontario&apos;s impaired driving laws
                      </a>
                      .
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        What Is Impaired Driving?
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Impaired driving means operating a vehicle while your
                        ability to do so has been compromised by alcohol or
                        drugs—including illegal substances, prescription and
                        over-the-counter medication, and cannabis. Impaired
                        driving laws apply to cars, trucks, boats, snowmobiles,
                        and off-road vehicles.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Alcohol and Driving
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Alcohol-impaired driving is one of the leading causes of
                        death on Ontario roads. Your gender, weight, age, mood,
                        and what you ate can affect how your body responds to
                        alcohol. When you drink, you may experience slowed
                        reflexes, difficulty paying attention, and blurred or
                        double vision.
                      </p>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        You can face charges if your{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          blood alcohol concentration (BAC) is 0.08 or more
                        </strong>
                        , or if you are in the{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          warn range (0.05 to 0.079)
                        </strong>
                        .
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h3
                        className="mb-2 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Zero tolerance for young and novice drivers
                      </h3>
                      <p
                        className="mb-2 text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        You cannot have any alcohol in your system if you are:
                      </p>
                      <ul
                        className="list-inside list-disc space-y-1 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Age 21 or under</li>
                        <li>Holding a G1, G2, M1, or M2 licence</li>
                        <li>Driving a road-building machine or a vehicle requiring an A–F licence or CVOR</li>
                      </ul>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        How to Avoid Impaired Driving
                      </h2>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Plan ahead: stay overnight, use a taxi or ride share, call
                        a friend or family member, use public transit, or have
                        a designated driver.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-impaired-driving" &&
                  currentLesson.id === "2" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Cannabis and other drugs affect your ability to drive.
                      Ontario&apos;s zero-tolerance laws for young, novice, and
                      commercial drivers apply to cannabis the same as alcohol.
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Cannabis and Driving
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        It is dangerous to drive with cannabis in your system.
                        Penalties are the same as for alcohol-impaired driving.
                        If you are 21 or under or hold a G1, G2, M1, or M2
                        licence, you cannot have any cannabis (or other drugs or
                        alcohol) in your system while driving.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Penalties for Young and Novice Drivers
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        If you have any drugs or alcohol in your system as a
                        young or novice driver, you can face administrative
                        penalties plus the same impairment penalties as any other
                        driver if applicable.
                      </p>
                      <ul
                        className="list-inside list-disc space-y-1 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>First time:</strong> $250 penalty, 8-hour education course, $60–$1,000 fine if convicted, 7-day immediate roadside licence suspension.
                        </li>
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>Second time:</strong> $350 penalty, 16-hour treatment program, $60–$1,000 fine if convicted, 14-day immediate roadside licence suspension.
                        </li>
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>Third time:</strong> $450 penalty, ignition interlock condition for six months, 16-hour treatment program, $60–$1,000 fine if convicted, 30-day immediate roadside licence suspension.
                        </li>
                      </ul>
                      <p
                        className="mt-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        After conviction, your licence can be suspended for an
                        additional 30 or 90 days, or cancelled, depending on
                        your age and licence class. You must pay a licence
                        reinstatement fee every time your licence is suspended.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        General Impaired Driving Penalties
                      </h2>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Police use roadside drug screening and sobriety tests. If
                        they determine you are impaired, you can face: vehicle
                        impoundment, education or treatment programs, fines and
                        reinstatement fees, and immediate licence suspensions.
                        Criminal conviction can add ignition interlock
                        requirements, longer suspensions, and possible jail
                        time. Penalties vary by age, licence type, substance
                        levels, and prior convictions.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-demerit-points" &&
                  currentLesson.id === "1" ? (
                  <div className="space-y-6">
                    {/* Introduction */}
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        What Are Demerit Points?
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Demerit points are a system used by the Ministry of
                        Transportation (MTO) to track your driving record.
                      </p>
                    </div>

                    {/* Quick Fact Callout */}
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <p
                        className="text-sm font-medium leading-relaxed"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        <span
                          className="mr-2 font-semibold"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          Quick Fact:
                        </span>
                        You don't lose points; you gain them. The goal is to
                        keep your point total as low as possible.
                      </p>
                    </div>

                    {/* Key Mechanics */}
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        How Points Are Added
                      </h2>
                      <p
                        className="mb-4 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong
                          style={{ color: "var(--ghost-white)" }}
                        >
                          The Zero-Start Rule:
                        </strong>{" "}
                        Drivers start with zero points. Points are added to your
                        record only if you are convicted of breaking certain
                        traffic laws.
                      </p>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong
                          style={{ color: "var(--ghost-white)" }}
                        >
                          Jurisdiction:
                        </strong>{" "}
                        Points can be added to your Ontario record for
                        convictions occurring in other Canadian
                        provinces/territories, as well as New York State and
                        Michigan.
                      </p>
                    </div>

                    {/* Expiry Rule */}
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        The 2-Year Rule
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Points remain on your record for two years from the date
                        of the offence. Once two years have passed, the points
                        are removed, but the conviction remains on your permanent
                        driving record.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-demerit-points" &&
                  currentLesson.id === "2" ? (
                  <div className="space-y-6">
                    {/* 1. The Conviction Trigger */}
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        1. The Conviction Trigger
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong style={{ color: "var(--ghost-white)" }}>
                          Key Point:
                        </strong>{" "}
                        Demerit points are not added when you receive a ticket.
                        They are only added to your record after you are
                        convicted.
                      </p>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong style={{ color: "var(--ghost-white)" }}>
                          Definition of Conviction:
                        </strong>{" "}
                        A conviction occurs when:
                      </p>
                      <ul
                        className="list-inside list-disc space-y-1 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>You pay the fine (pleading guilty).</li>
                        <li>You are found guilty in court.</li>
                        <li>
                          You fail to respond to the ticket (conviction in
                          absence).
                        </li>
                      </ul>
                    </div>

                    {/* 2. The Back-Dated Rule */}
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        2. The "Back-Dated" Rule (Crucial for G1 Test)
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        While points only appear on your record after conviction,
                        they are <strong style={{ color: "var(--ghost-white)" }}>back-dated to the date of the offence</strong>.
                      </p>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong style={{ color: "var(--ghost-white)" }}>
                          Why it matters:
                        </strong>{" "}
                        Since points expire 2 years from the offence date,
                        fighting a ticket in court (which delays conviction)
                        actually reduces the amount of time the points
                        effectively stay on your active record.
                      </p>
                    </div>

                    {/* 3. Out-of-Province Reciprocity */}
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        3. Out-of-Province Reciprocity
                      </h2>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Points will be added to your Ontario record for
                        equivalent offences committed in:
                      </p>
                      <ul
                        className="list-inside list-disc space-y-1 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>All other Canadian provinces and territories.</li>
                        <li>Michigan (USA).</li>
                        <li>New York (USA).</li>
                      </ul>
                    </div>

                    {/* Pro-Tip Box */}
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <p
                        className="text-sm font-medium leading-relaxed"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        <span
                          className="mr-2 font-semibold"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          Pro-Tip:
                        </span>
                        If you are convicted of multiple offences arising from
                        the same incident, only the points for the most serious
                        offence (the one with the highest points) are added to
                        your record.
                      </p>
                    </div>

                    {/* Point Expiry Note */}
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong style={{ color: "var(--ghost-white)" }}>
                          Point Expiry Note:
                        </strong>{" "}
                        While points disappear after 2 years, the conviction
                        (the "line" on your abstract) stays for at least 3 years
                        and can still be seen by insurance companies.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-demerit-points" &&
                  currentLesson.id === "3" ? (
                  <div className="space-y-6">
                    {/* 7 Points Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-xl font-bold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        7 Points: The Most Serious Offences
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Failing to remain at the scene of a collision (Hit and
                          Run).
                        </li>
                        <li>
                          Failing to stop when signaled or asked by a police
                          officer.
                        </li>
                      </ul>
                    </div>

                    {/* 6 Points Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-xl font-bold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        6 Points: High-Risk Driving
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Careless driving.</li>
                        <li>Racing or Stunt Driving.</li>
                        <li>
                          Exceeding the speed limit by 50 km/h or more.
                        </li>
                        <li>
                          Failing to stop for a school bus with red lights
                          flashing.
                        </li>
                      </ul>
                    </div>

                    {/* 5 Points Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-xl font-bold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        5 Points: Specialized Vehicles
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Failing to stop at an unprotected railway crossing
                          (applies to bus drivers only).
                        </li>
                      </ul>
                    </div>

                    {/* 4 Points Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-xl font-bold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        4 Points: Severe Safety Breaches
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Exceeding the speed limit by 30 to 49 km/h.
                        </li>
                        <li>Following too closely (Tailgating).</li>
                        <li>
                          Failing to stop at a pedestrian crossover.
                        </li>
                      </ul>
                    </div>

                    {/* 3 Points Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-xl font-bold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        3 Points: Common Moving Violations
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Exceeding the speed limit by 16 to 29 km/h.
                        </li>
                        <li>
                          Distracted Driving (using a handheld device while
                          driving).
                        </li>
                        <li>Failing to yield the right-of-way.</li>
                        <li>
                          Failing to obey a stop sign, traffic light, or
                          railway crossing signal.
                        </li>
                        <li>
                          Driving the wrong way on a divided road or one-way
                          street.
                        </li>
                        <li>
                          Failing to report a collision to a police officer.
                        </li>
                        <li>
                          Improper passing or crowding the driver's seat.
                        </li>
                      </ul>
                    </div>

                    {/* 2 Points Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-xl font-bold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        2 Points: Minor Infractions
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Improper right or left turns.</li>
                        <li>Failing to signal.</li>
                        <li>Failing to share the road or obey signs.</li>
                        <li>Driver failing to wear a seatbelt.</li>
                        <li>
                          Failing to lower high-beam headlamps.
                        </li>
                        <li>
                          Unnecessary slow driving or backing on a highway.
                        </li>
                      </ul>
                    </div>

                    {/* Special Note */}
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong style={{ color: "var(--ghost-white)" }}>
                          Special Note:
                        </strong>{" "}
                        Speeding 1–15 km/h over carries 0 demerit points but
                        results in a fine and remains on your record.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-demerit-points" &&
                  currentLesson.id === "4" ? (
                  <div className="space-y-6">
                    {/* 1. Novice Drivers Section */}
                    <div>
                      <h2
                        className="mb-4 text-xl font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        1. Novice Drivers (G1, G2, M1, M2): Stricter Rules
                      </h2>
                      <div
                        className="overflow-x-auto rounded-lg border"
                        style={{
                          backgroundColor: "var(--void-purple)",
                          borderColor: "var(--midnight-indigo)",
                        }}
                      >
                        <table className="w-full min-w-[500px] border-collapse text-left">
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "var(--midnight-indigo)",
                                color: "var(--ghost-white)",
                              }}
                            >
                              <th
                                className="px-4 py-3 text-sm font-semibold"
                                style={{ color: "var(--ghost-white)" }}
                              >
                                Point Total
                              </th>
                              <th
                                className="px-4 py-3 text-sm font-semibold"
                                style={{ color: "var(--ghost-white)" }}
                              >
                                Penalty / Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
                                borderBottom: "1px solid var(--midnight-indigo)",
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
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                2 – 5 Points
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                Warning Letter: You will receive a letter
                                encouraging you to improve your driving habits.
                              </td>
                            </tr>
                            <tr
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
                                borderBottom: "1px solid var(--midnight-indigo)",
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
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                6 – 8 Points
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                Mandatory Interview: You may be required to
                                attend an interview ($50 fee) to discuss your
                                record. Failure to attend results in suspension.
                              </td>
                            </tr>
                            <tr
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
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
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                9 or more Points
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                60-Day Suspension: Your license is automatically
                                suspended for 60 days. You must surrender your
                                license to ServiceOntario.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 2. Fully Licensed Drivers Section */}
                    <div>
                      <h2
                        className="mb-4 text-xl font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        2. Fully Licensed Drivers (Class G): Standard Rules
                      </h2>
                      <div
                        className="overflow-x-auto rounded-lg border"
                        style={{
                          backgroundColor: "var(--void-purple)",
                          borderColor: "var(--midnight-indigo)",
                        }}
                      >
                        <table className="w-full min-w-[500px] border-collapse text-left">
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "var(--midnight-indigo)",
                                color: "var(--ghost-white)",
                              }}
                            >
                              <th
                                className="px-4 py-3 text-sm font-semibold"
                                style={{ color: "var(--ghost-white)" }}
                              >
                                Point Total
                              </th>
                              <th
                                className="px-4 py-3 text-sm font-semibold"
                                style={{ color: "var(--ghost-white)" }}
                              >
                                Penalty / Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
                                borderBottom: "1px solid var(--midnight-indigo)",
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
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                6 – 8 Points
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                Warning Letter: A notification is mailed to your
                                address on record.
                              </td>
                            </tr>
                            <tr
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
                                borderBottom: "1px solid var(--midnight-indigo)",
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
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                9 – 14 Points
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                Mandatory Interview: You must attend a meeting to
                                provide reasons why your license should not be
                                suspended ($50 fee).
                              </td>
                            </tr>
                            <tr
                              className="transition-shadow duration-200"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                color: "var(--lavender-mist)",
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
                                className="px-4 py-3 text-sm font-medium"
                                style={{ color: "inherit" }}
                              >
                                15 or more Points
                              </td>
                              <td
                                className="px-4 py-3 text-sm leading-relaxed"
                                style={{ color: "inherit" }}
                              >
                                30-Day Suspension: Your license is automatically
                                suspended for 30 days.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 3. Escalating Penalties Special Section */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Escalating Penalties for Novice Drivers
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Any single offence carrying 4 or more points (like
                        following too closely or 30km/h+ speeding) can trigger
                        these escalating penalties:
                      </p>
                      <ol
                        className="list-inside list-decimal space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>
                            1st Offence:
                          </strong>{" "}
                          30-day suspension.
                        </li>
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>
                            2nd Offence:
                          </strong>{" "}
                          90-day suspension.
                        </li>
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>
                            3rd Offence:
                          </strong>{" "}
                          Permanent loss of novice license (must restart the G1
                          process from scratch).
                        </li>
                      </ol>
                    </div>

                    {/* 4. Post-Suspension Logic */}
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <strong style={{ color: "var(--ghost-white)" }}>
                          Post-Suspension Logic:
                        </strong>{" "}
                        When a suspension ends and your license is reinstated,
                        your point total is reduced. Fully licensed drivers are
                        reduced to 7 points; Novice drivers are reduced to 4
                        points.
                      </p>
                    </div>
                  </div>
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
