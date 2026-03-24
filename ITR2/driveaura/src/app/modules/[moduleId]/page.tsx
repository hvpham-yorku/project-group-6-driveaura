"use client";

/// <reference types="react" />
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  fetchUserModuleProgress,
  saveUserModuleProgress,
} from "@/lib/firebase/client";
import { MODULES, type Lesson } from "../data";
import {
  getCompletedLessonsForModule,
  isLessonComplete,
  setLessonComplete,
} from "../progress";
import {
  ROAD_MANEUVERS_CONTENT,
  type ManeuverContent,
} from "../road-maneuvers-content";

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

/** G2 Essential Road Maneuvers: structured lesson block (Golden Rule, Steps, Tips, Quiz). */
function ManeuverLessonContent({ content }: { content: ManeuverContent }) {
  return (
    <div className="space-y-8">
      {/* Golden Rule */}
      <div
        className="rounded-xl border-2 p-4"
        style={{
          borderColor: "var(--electric-cyan)",
          backgroundColor: "var(--midnight-indigo)",
          color: "var(--ghost-white)",
        }}
      >
        <h3
          className="mb-2 text-sm font-semibold uppercase tracking-wide"
          style={{ color: "var(--electric-cyan)" }}
        >
          The Golden Rule
        </h3>
        <p className="leading-relaxed">{content.goldenRule}</p>
      </div>

      {/* Step-by-Step Guide */}
      <div>
        <h3
          className="mb-3 text-base font-semibold"
          style={{ color: "var(--ghost-white)" }}
        >
          Step-by-Step Guide
        </h3>
        <ol
          className="list-inside list-decimal space-y-2 text-sm leading-relaxed"
          style={{ color: "var(--lavender-mist)" }}
        >
          {content.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Test Examiner Tips */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--void-purple)",
        }}
      >
        <h3
          className="mb-3 text-base font-semibold"
          style={{ color: "var(--ghost-white)" }}
        >
          Test Examiner Tips
        </h3>
        <p className="mb-2 text-sm" style={{ color: "var(--lavender-mist)" }}>
          Common mistakes that cost points on the G2 road test:
        </p>
        <ul
          className="list-inside list-disc space-y-1.5 text-sm"
          style={{ color: "var(--lavender-mist)" }}
        >
          {content.examinerTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Quick Quiz */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "var(--midnight-indigo)",
          backgroundColor: "var(--midnight-indigo)",
        }}
      >
        <h3
          className="mb-4 text-base font-semibold"
          style={{ color: "var(--ghost-white)" }}
        >
          Quick Quiz
        </h3>
        <div className="space-y-6">
          {content.quiz.map((q, qIdx) => (
            <div key={qIdx}>
              <p
                className="mb-2 text-sm font-medium"
                style={{ color: "var(--ghost-white)" }}
              >
                {q.question}
              </p>
              <ul className="space-y-1.5">
                {q.options.map((opt, oIdx) => (
                  <li
                    key={oIdx}
                    className="rounded px-3 py-1.5 text-sm"
                    style={{
                      backgroundColor: "var(--void-purple)",
                      color: "var(--lavender-mist)",
                      listStyle: "none",
                    }}
                  >
                    {String.fromCharCode(65 + oIdx)}. {opt}
                    {oIdx === q.correctIndex && (
                      <span
                        className="ml-2 text-xs"
                        style={{ color: "var(--neon-mint)" }}
                      >
                        ✓ Correct
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: "var(--lavender-mist)" }}
              >
                <strong style={{ color: "var(--electric-cyan)" }}>
                  Answer: {q.options[q.correctIndex]}
                </strong>
                {" — "}
                {q.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Regulatory signs reference table — G1 Module 1. */
const REGULATORY_SIGN_TABLE_DATA: Array<{
  signName: string;
  instruction: string;
  imageUrl: string;
}> = [
  { signName: "Stop Sign", instruction: "Come to a complete stop at the stop line, crosswalk, or edge of intersection. Wait until the way is clear before entering the intersection.", imageUrl: "https://files.ontario.ca/3-1-1.jpg" },
  { signName: "Yield Sign", instruction: "Let traffic in the intersection or close to it go first. Stop if necessary and go only when the way is clear.", imageUrl: "https://files.ontario.ca/3-1-3.jpg" },
  { signName: "Railway Crossing", instruction: "X-shaped sign. Slow down, look both ways for trains, and be prepared to stop.", imageUrl: "https://files.ontario.ca/3-1-4.jpg" },
  { signName: "Bicycle Route", instruction: "This road is an official bicycle route. Watch for cyclists and be prepared to share the road with them.", imageUrl: "https://files.ontario.ca/3-1-5.jpg" },
  { signName: "Parking Permitted", instruction: "You may park in the area between the signs during the times posted. (Used in pairs or groups.)", imageUrl: "https://files.ontario.ca/3-1-6.jpg" },
  { signName: "Snowmobiles Permitted", instruction: "Snowmobiles may use this road.", imageUrl: "https://files.ontario.ca/3-1-7.jpg" },
  { signName: "Do Not Enter", instruction: "Do not enter this road.", imageUrl: "https://files.ontario.ca/3-1-8.jpg" },
  { signName: "No Stopping", instruction: "Do not stop in the area between the signs — you may not stop your vehicle here, even for a moment. (Used in pairs or groups.)", imageUrl: "https://files.ontario.ca/3-1-9.jpg" },
  { signName: "No Standing", instruction: "Do not stand in the area between the signs — you may not stop your vehicle here except while loading or unloading passengers. (Used in pairs or groups.)", imageUrl: "https://files.ontario.ca/3-1-10.jpg" },
  { signName: "No Parking", instruction: "Do not park in the area between the signs — you may not stop your vehicle except to load or unload passengers or merchandise. (Used in pairs or groups.)", imageUrl: "https://files.ontario.ca/3-1-11.jpg" },
  { signName: "No Left Turn", instruction: "Do not turn left at the intersection.", imageUrl: "https://files.ontario.ca/3-1-12.jpg" },
  { signName: "Do Not Drive Through Intersection", instruction: "Do not drive through the intersection.", imageUrl: "https://files.ontario.ca/3-1-13.jpg" },
  { signName: "No U-Turn", instruction: "Do not turn to go in the opposite direction (U-turn).", imageUrl: "https://files.ontario.ca/3-1-14.jpg" },
  { signName: "No Right Turn on Red", instruction: "Do not turn right when facing a red light at the intersection.", imageUrl: "https://files.ontario.ca/3-1-15.jpg" },
  { signName: "No Left Turn (Restricted Hours)", instruction: "Do not turn left during the times shown on the sign.", imageUrl: "https://files.ontario.ca/3-1-16.jpg" },
  { signName: "Accessible Parking Permit Only", instruction: "This parking space is only for vehicles displaying a valid Accessible Parking Permit.", imageUrl: "https://files.ontario.ca/3-1-17.jpg" },
  { signName: "No Bicycles", instruction: "No bicycles are allowed on this road.", imageUrl: "https://files.ontario.ca/3-1-18.jpg" },
  { signName: "No Pedestrians", instruction: "No pedestrians are allowed on this road.", imageUrl: "https://files.ontario.ca/3-1-19.jpg" },
  { signName: "Keep Right (Traffic Island)", instruction: "Keep to the right of the traffic island.", imageUrl: "https://files.ontario.ca/3-1-20.jpg" },
  { signName: "Speed Limit Change Ahead", instruction: "The speed limit changes ahead.", imageUrl: "https://files.ontario.ca/3-1-21.jpg" },
  { signName: "Do Not Pass", instruction: "Do not pass on this road.", imageUrl: "https://files.ontario.ca/3-1-22.jpg" },
  { signName: "Slow Traffic Keep Right", instruction: "Slow traffic on multi-lane roads must keep right.", imageUrl: "https://files.ontario.ca/3-1-23.jpg" },
  { signName: "Community Safety Zone", instruction: "Areas where the community has identified a special risk to pedestrians. Traffic offences committed within the zone are subject to increased fines.", imageUrl: "https://files.ontario.ca/3-1-24.jpg" },
  { signName: "School Zone Speed", instruction: "The speed limit in this zone is lower during school hours. Observe the speed limit shown when the yellow lights are flashing.", imageUrl: "https://files.ontario.ca/3-1-25.jpg" },
  { signName: "Stop for School Bus", instruction: "Stop for the school bus when its signals are flashing.", imageUrl: "https://files.ontario.ca/3-1-25b.jpg" },
  { signName: "Stop for School Bus (Multi-lane)", instruction: "Installed on multi-lane highways with no centre median divider. Drivers approaching from both directions must stop for a school bus when its signal lights are flashing.", imageUrl: "https://files.ontario.ca/3-1-26.jpg" },
  { signName: "Lane Directional Arrows", instruction: "Above the road or on the pavement before an intersection — tells drivers the mandatory direction they must travel in that lane.", imageUrl: "https://files.ontario.ca/3-1-27.jpg" },
  { signName: "One Way", instruction: "Traffic may travel in one direction only.", imageUrl: "https://files.ontario.ca/3-1-28.jpg" },
  { signName: "Pedestrian Crossover", instruction: "Be prepared to stop and yield right-of-way to pedestrians.", imageUrl: "https://files.ontario.ca/3-1-29.jpg" },
  { signName: "Two-Way Left Turn Lane", instruction: "The lane is only for two-way left turns (above the road or on the ground).", imageUrl: "https://files.ontario.ca/3-1-30.jpg" },
  { signName: "Accessible Person Parking Drop-off", instruction: "Reserves curb area for vehicles displaying a valid Accessible Person Parking Permit picking up and dropping off passengers with disabilities.", imageUrl: "https://files.ontario.ca/3-1-31.jpg" },
  { signName: "Reserved Lanes (HOV/Bus/Bicycle)", instruction: "Lanes are only for specific types of vehicles (buses, taxis, vehicles with 3+ people, or bicycles), either all the time or during certain hours.", imageUrl: "https://files.ontario.ca/3-1-32.jpg" },
  { signName: "Keep Right (Climbing/Passing Lane)", instruction: "Keep to the right lane except when passing on two-lane sections where climbing or passing lanes are provided.", imageUrl: "https://files.ontario.ca/3-1-33.jpg" },
  { signName: "Yield to Bus", instruction: "On the back of transit buses — reminds motorists that vehicles approaching a bus stopped at a dedicated Bus Stop must yield to the bus once it has signalled its intent to return to the lane.", imageUrl: "https://files.ontario.ca/3-1-33a.jpg" },
  { signName: "Road Forks Right", instruction: "The road forks to the right ahead.", imageUrl: "https://files.ontario.ca/3-1-33b.jpg" },
  { signName: "School Bus Loading Zone", instruction: "Marks a zone within which school buses load or unload passengers without using the red alternating lights and stop arm.", imageUrl: "https://files.ontario.ca/3-1-33c.jpg" },
];

/** Warning signs and HOV lanes reference table — G1 Module 1. */
const WARNING_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
  imageUrl: string;
}> = [
  { category: "HOV", signName: "HOV Lane (Diamond)", instruction: "Only public vehicles (buses) or vehicles with a minimum number of passengers (2+ or 3+) may use this lane.", imageUrl: "https://files.ontario.ca/3-1-34.jpg" },
  { category: "HOV", signName: "HOV Do Not Cross", instruction: "Vehicles cannot change lanes into or out of an HOV lane in this area (marked by solid lines).", imageUrl: "https://files.ontario.ca/3-1-35.jpg" },
  { category: "Warning", signName: "Narrow Bridge", instruction: "The bridge ahead is narrower than the road; slow down and use caution.", imageUrl: "https://files.ontario.ca/3-1-36a.jpg" },
  { category: "Warning", signName: "Road Branching Off", instruction: "Indicates a road branches off ahead.", imageUrl: "https://files.ontario.ca/3-1-37a.jpg" },
  { category: "Warning", signName: "Intersection Ahead", instruction: "An intersection is ahead; the arrow shows which direction of traffic has the right-of-way.", imageUrl: "https://files.ontario.ca/3-1-38a.jpg" },
  { category: "Warning", signName: "Roundabout Ahead", instruction: "Reduce speed; counter-clockwise arrows show the direction of traffic within the roundabout.", imageUrl: "https://files.ontario.ca/3-1-39a.jpg" },
  { category: "Warning", signName: "Hidden Side Road", instruction: "Drivers on the side road at the intersection ahead do not have a clear view of traffic.", imageUrl: "https://files.ontario.ca/3-1-40a.jpg" },
  { category: "Warning", signName: "Pavement Narrows", instruction: "The road surface becomes narrower ahead.", imageUrl: "https://files.ontario.ca/3-1-41a.jpg" },
  { category: "Warning", signName: "Slight Curve", instruction: "There is a slight bend or curve in the road ahead.", imageUrl: "https://files.ontario.ca/3-1-42a.jpg" },
  { category: "Warning", signName: "Safe Curve Speed", instruction: "Posted under a curve warning; shows the maximum safe speed for that curve.", imageUrl: "https://files.ontario.ca/3-1-43a.jpg" },
  { category: "Warning", signName: "Sharp Bend/Turn", instruction: "A sharp bend or turn is in the road ahead.", imageUrl: "https://files.ontario.ca/3-1-44a.jpg" },
  { category: "Warning", signName: "Chevron (Arrowhead)", instruction: "Posted in groups to guide drivers around sharp curves.", imageUrl: "https://files.ontario.ca/3-1-45a.jpg" },
  { category: "Warning", signName: "Winding Road", instruction: "There is a winding road ahead.", imageUrl: "https://files.ontario.ca/3-1-46a.jpg" },
  { category: "Warning", signName: "Opening Bridge", instruction: "The bridge ahead lifts or swings to let boats pass.", imageUrl: "https://files.ontario.ca/3-1-47a.jpg" },
  { category: "Warning", signName: "Paved Surface Ends", instruction: "The paved portion of the road ends ahead.", imageUrl: "https://files.ontario.ca/3-1-48a.jpg" },
  { category: "Warning", signName: "Bicycle Crossing", instruction: "A bicycle crossing is ahead.", imageUrl: "https://files.ontario.ca/3-1-49a.jpg" },
  { category: "Warning", signName: "Stop Sign Ahead", instruction: "Slow down and prepare for a stop sign you cannot see yet.", imageUrl: "https://files.ontario.ca/3-1-50a.jpg" },
  { category: "Warning", signName: "Share the Road", instruction: "Warns motorists to provide safe space for cyclists and other vehicles.", imageUrl: "https://files.ontario.ca/3-1-51a.jpg" },
  { category: "Warning", signName: "Slippery When Wet", instruction: "Pavement is slick when wet; slow down and drive with caution.", imageUrl: "https://files.ontario.ca/3-1-52a.jpg" },
  { category: "Warning", signName: "Hazard Marker", instruction: "Downward lines show the side on which you may safely pass a hazard near the road edge.", imageUrl: "https://files.ontario.ca/3-1-53a.jpg" },
  { category: "Warning", signName: "Divided Highway Begins", instruction: "Traffic travels on separated roads ahead; keep to the right-hand road.", imageUrl: "https://files.ontario.ca/3-1-54a.jpg" },
  { category: "Warning", signName: "Right Lane Ends", instruction: "Merge safely with traffic in the lane to the left.", imageUrl: "https://files.ontario.ca/3-1-55a.jpg" },
  { category: "Warning", signName: "Traffic Lights Ahead", instruction: "Slow down for an upcoming signalized intersection.", imageUrl: "https://files.ontario.ca/3-1-56a.jpg" },
  { category: "Warning", signName: "Steep Hill", instruction: "A steep hill is ahead; you may need to use a lower gear.", imageUrl: "https://files.ontario.ca/3-1-57a.jpg" },
  { category: "Warning", signName: "Merging Traffic", instruction: "Two roads joining into one; both drivers are equally responsible for merging safely.", imageUrl: "https://files.ontario.ca/3-1-58a.jpg" },
  { category: "Warning", signName: "Snowmobile Crossing", instruction: "Snowmobiles cross this road.", imageUrl: "https://files.ontario.ca/3-1-59a.jpg" },
  { category: "Warning", signName: "Divided Highway Ends", instruction: "Traffic travels in both directions on the same road ahead; keep right.", imageUrl: "https://files.ontario.ca/3-1-60a.jpg" },
  { category: "Warning", signName: "Underpass Clearance", instruction: "Shows the height clearance for tall vehicles.", imageUrl: "https://files.ontario.ca/3-1-61a.jpg" },
  { category: "Warning", signName: "Bump / Uneven Road", instruction: "Slow down and keep control of your vehicle.", imageUrl: "https://files.ontario.ca/3-1-62a.jpg" },
  { category: "Warning", signName: "Railway Crossing Ahead", instruction: "Be alert for trains; sign shows the angle the tracks cross the road.", imageUrl: "https://files.ontario.ca/3-1-63a.jpg" },
  { category: "Warning", signName: "Sharp Turn (Checkerboard)", instruction: "Sharp turn in the arrow's direction; checkerboard border warns of danger.", imageUrl: "https://files.ontario.ca/3-1-64a.jpg" },
  { category: "Warning", signName: "Animal Crossing (Deer)", instruction: "Deer regularly cross here; be alert for animals.", imageUrl: "https://files.ontario.ca/3-1-65a.jpg" },
  { category: "Warning", signName: "Truck Entrance", instruction: "Watch for trucks entering the road from the side indicated on the sign.", imageUrl: "https://files.ontario.ca/3-1-66a.jpg" },
  { category: "Warning", signName: "Ramp Speed", instruction: "Shows the maximum safe speed on the ramp.", imageUrl: "https://files.ontario.ca/3-1-67a.jpg" },
  { category: "Warning", signName: "Watch for Pedestrians", instruction: "Watch for pedestrians and be prepared to share the road with them.", imageUrl: "https://files.ontario.ca/3-1-68a.jpg" },
  { category: "Warning", signName: "Fallen Rock", instruction: "Watch for rocks on the road and be prepared to avoid them.", imageUrl: "https://files.ontario.ca/3-1-69a.jpg" },
  { category: "Warning", signName: "Water Over Road", instruction: "There may be water flowing over the road surface.", imageUrl: "https://files.ontario.ca/3-1-70a.jpg" },
  { category: "Warning", signName: "Hidden Bus Stop", instruction: "Slow down and watch for children and school buses with flashing red lights.", imageUrl: "https://files.ontario.ca/3-1-71a2.jpg" },
  { category: "Warning", signName: "Bus Entrance Ahead", instruction: "Upcoming bus entrance on the right; be prepared to yield to buses entering the roadway.", imageUrl: "https://files.ontario.ca/3-1-71a.jpg" },
  { category: "Warning", signName: "Fire Truck Entrance Ahead", instruction: "Upcoming fire truck entrance on the right; be prepared to yield to fire trucks entering the roadway.", imageUrl: "https://files.ontario.ca/3-1-71b2.jpg" },
  { category: "Warning", signName: "School Crossing", instruction: "Watch for children and follow directions of crossing guards.", imageUrl: "https://files.ontario.ca/3-1-72.jpg" },
];

/** Temporary condition signs reference table — G1 Module 1. */
const TEMPORARY_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
  imageUrl: string;
}> = [
  { category: "Temporary", signName: "Construction Ahead (1 km)", instruction: "Construction work is one kilometre ahead.", imageUrl: "https://files.ontario.ca/3-1-73.jpg" },
  { category: "Temporary", signName: "Road Work Ahead", instruction: "Workers are currently on or near the road ahead.", imageUrl: "https://files.ontario.ca/3-1-74.jpg" },
  { category: "Temporary", signName: "Survey Crew", instruction: "A survey crew is working on the road ahead.", imageUrl: "https://files.ontario.ca/3-1-75.jpg" },
  { category: "Temporary", signName: "Traffic Control Person", instruction: "A person is ahead directing traffic. Drive slowly and watch for instructions.", imageUrl: "https://files.ontario.ca/3-1-76.jpg" },
  { category: "Temporary", signName: "Construction Zone Entry", instruction: "You are entering a construction zone; drive with extra caution and expect a lower speed limit.", imageUrl: "https://files.ontario.ca/3-1-77.jpg" },
  { category: "Temporary", signName: "Temporary Detour", instruction: "Normal route is diverted; follow the detour markers.", imageUrl: "https://files.ontario.ca/3-1-78.jpg" },
  { category: "Temporary", signName: "Flashing Arrow Direction", instruction: "Flashing lights on the arrows show the direction to follow through the work zone.", imageUrl: "https://files.ontario.ca/3-1-79.jpg" },
  { category: "Temporary", signName: "Grooved Pavement", instruction: "Pavement has been milled; stopping ability is affected. Motorcyclists may have reduced traction.", imageUrl: "https://files.ontario.ca/3-1-80.jpg" },
  { category: "Temporary", signName: "Lane Closed", instruction: "Lane ahead is closed for roadwork. Obey the speed limit and merge into the open lane.", imageUrl: "https://files.ontario.ca/3-1-81.jpg" },
  { category: "Temporary", signName: "Closed Lane (Arrow)", instruction: "Follow the direction of the arrow and adjust speed to merge safely.", imageUrl: "https://files.ontario.ca/3-1-82.jpg" },
  { category: "Temporary", signName: "Pilot / Pace Vehicle", instruction: "Do not pass the vehicle bearing this sign.", imageUrl: "https://files.ontario.ca/3-1-83.jpg" },
  { category: "Temporary", signName: "Reduce Speed / Prepare to Stop", instruction: "Reduce speed and be prepared to stop ahead.", imageUrl: "https://files.ontario.ca/3-1-84.jpg" },
  { category: "Temporary", signName: "Detour Marker", instruction: "Follow this marker until you return to your regular route.", imageUrl: "https://files.ontario.ca/3-1-85.jpg" },
  { category: "Temporary", signName: "Increased Fines Zone", instruction: "Doubles HTA fines for speeding in a designated construction zone when workers are present.", imageUrl: "https://files.ontario.ca/3-1-86.jpg" },
];

/** Information and direction signs reference table — G1 Module 1. */
const INFORMATION_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
  imageUrl: string;
}> = [
  { category: "Information", signName: "Town/City Directions", instruction: "Green signs showing directions to nearby towns and cities.", imageUrl: "https://files.ontario.ca/3-1-87.jpg" },
  { category: "Information", signName: "Distances", instruction: "Shows the distances in kilometres to towns and cities on the road.", imageUrl: "https://files.ontario.ca/3-1-88.jpg" },
  { category: "Information", signName: "Exit Guidance", instruction: "Helps drivers choose the correct lane to exit or stay on a freeway using arrows and destination names.", imageUrl: "https://files.ontario.ca/3-1-89.jpg" },
  { category: "Information", signName: "Freeway Advance Signs", instruction: "Arrows show which lanes lead off the freeway. Signs are also posted at the exit.", imageUrl: "https://files.ontario.ca/3-1-90.jpg" },
  { category: "Information", signName: "Interchange Numbers", instruction: "Numbers corresponding to the distance in km from the start of the freeway.", imageUrl: "https://files.ontario.ca/3-1-91.jpg" },
  { category: "Information", signName: "VIA (Road Route)", instruction: "Describes specific roads that must be followed to reach a particular destination.", imageUrl: "https://files.ontario.ca/3-1-92.jpg" },
  { category: "Information", signName: "Roundabout Exits", instruction: "Shows upcoming roundabout exits and where they will take you.", imageUrl: "https://files.ontario.ca/3-1-93.jpg" },
  { category: "Information", signName: "Dynamic Info Signs", instruction: "Electronic signs providing real-time information on traffic delays and lane closures.", imageUrl: "https://files.ontario.ca/3-1-94.jpg" },
  { category: "Information", signName: "Off-Road Facilities", instruction: "Blue signs indicating off-road services like hospitals, airports, universities, or carpool lots.", imageUrl: "https://files.ontario.ca/3-1-95.jpg" },
  { category: "Information", signName: "Railway Station", instruction: "Shows the route to a passenger railway station.", imageUrl: "https://files.ontario.ca/3-1-96.jpg" },
  { category: "Information", signName: "Airport", instruction: "Shows the route to the nearest airport.", imageUrl: "https://files.ontario.ca/3-1-97.jpg" },
  { category: "Information", signName: "Accessible Facilities", instruction: "Indicates facilities or rest areas that are wheelchair accessible.", imageUrl: "https://files.ontario.ca/3-1-99.jpg" },
  { category: "Information", signName: "D Sign – Oversize Load", instruction: "Identifies a vehicle carrying an oversize load.", imageUrl: "https://files.ontario.ca/3-1-98.jpg" },
];

/** Other signs reference table — G1 Module 1. */
const OTHER_SIGN_TABLE_DATA: Array<{
  category: string;
  signName: string;
  instruction: string;
  imageUrl: string;
}> = [
  { category: "Other", signName: "Slow-Moving Vehicle", instruction: "An orange triangle with a red border. Alerts that the vehicle (e.g., farm tractor) travels at 40 km/h or less. Drivers must reduce speed and use caution.", imageUrl: "https://files.ontario.ca/3-1-100.jpg" },
  { category: "Other", signName: "EDR (Emergency Detour)", instruction: "Used during unscheduled provincial highway closures. Follow these markers along alternative routes to be directed around the closure and back onto the highway.", imageUrl: "https://files.ontario.ca/3-1-101.jpg" },
  { category: "Other", signName: "LCV (Long Commercial Vehicle)", instruction: "A placard identifying a double trailer up to 40m in length. Drivers should anticipate extended length and limited speed when preparing to pass.", imageUrl: "https://files.ontario.ca/3-1-101-2a.jpg" },
  { category: "Other", signName: "Emergency Response Signs", instruction: "Information signs with a numbering system along the bottom to assist emergency vehicles and drivers in determining an appropriate route.", imageUrl: "https://files.ontario.ca/3-1-102.jpg" },
  { category: "Other", signName: "Bilingual Signs", instruction: "Signs in designated bilingual areas featuring messages in both English and French. Read the message in the language you understand best.", imageUrl: "https://files.ontario.ca/3-1-103a.jpg" },
];

function ModuleReaderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
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
  const [progressSyncError, setProgressSyncError] = useState<string | null>(null);
  const [g2PassengerTab, setG2PassengerTab] = useState<"first6" | "after6">("first6");
  const [g2PathsTab, setG2PathsTab] = useState<"demerits" | "escalating">("demerits");
  const currentLesson = moduleItem?.lessons[lessonIndex];

  useEffect(() => {
    let cancelled = false;

    async function syncProgress() {
      if (!moduleId || !currentLesson) return;
      setProgressSyncError(null);

      const locallyComplete = isLessonComplete(moduleId, currentLesson.id);
      setMarkedComplete(locallyComplete);

      if (!user) return;

      try {
        const localCompleted = getCompletedLessonsForModule(moduleId);
        const remoteCompleted = await fetchUserModuleProgress(user.uid, moduleId);
        if (cancelled) return;

        remoteCompleted.forEach((lessonId) => {
          setLessonComplete(moduleId, lessonId);
        });

        const merged = Array.from(new Set([...localCompleted, ...remoteCompleted]));
        if (merged.length > remoteCompleted.length) {
          await saveUserModuleProgress({
            userId: user.uid,
            moduleId,
            completedLessons: merged,
          });
        }

        if (remoteCompleted.includes(currentLesson.id)) {
          setMarkedComplete(true);
        }
      } catch (error) {
        if (!cancelled) {
          setProgressSyncError("Cloud sync failed. Check Firebase rules and try again.");
        }
        console.error("Failed to sync module progress", error);
      }
    }

    void syncProgress();

    return () => {
      cancelled = true;
    };
  }, [moduleId, currentLesson?.id, user?.uid]);

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
                      <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "var(--midnight-indigo)",
                              color: "var(--ghost-white)",
                            }}
                          >
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)", width: "240px" }}
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
                                style={{ color: "inherit", width: "240px" }}
                              >
                                <Image
                                  src={row.imageUrl}
                                  alt={row.signName}
                                  width={210}
                                  height={210}
                                  className="rounded object-contain"
                                  style={{ width: "210px", height: "auto" }}
                                />
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
                      <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "var(--midnight-indigo)",
                              color: "var(--ghost-white)",
                            }}
                          >
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)", width: "240px" }}
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
                                    style={{ color: "inherit", width: "240px" }}
                                  >
                                    <Image
                                      src={row.imageUrl}
                                      alt={row.signName}
                                      width={210}
                                      height={210}
                                      className="rounded object-contain"
                                      style={{ width: "210px", height: "auto" }}
                                    />
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
                      <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "var(--midnight-indigo)",
                              color: "var(--ghost-white)",
                            }}
                          >
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)", width: "240px" }}
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
                                    style={{ color: "inherit", width: "240px" }}
                                  >
                                    <Image
                                      src={row.imageUrl}
                                      alt={row.signName}
                                      width={210}
                                      height={210}
                                      className="rounded object-contain"
                                      style={{ width: "210px", height: "auto" }}
                                    />
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
                      <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "var(--midnight-indigo)",
                              color: "var(--ghost-white)",
                            }}
                          >
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)", width: "240px" }}
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
                                    style={{ color: "inherit", width: "240px" }}
                                  >
                                    <Image
                                      src={row.imageUrl}
                                      alt={row.signName}
                                      width={210}
                                      height={210}
                                      className="rounded object-contain"
                                      style={{ width: "210px", height: "auto" }}
                                    />
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
                      <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "var(--midnight-indigo)",
                              color: "var(--ghost-white)",
                            }}
                          >
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)", width: "240px" }}
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
                                    style={{ color: "inherit", width: "240px" }}
                                  >
                                    <Image
                                      src={row.imageUrl}
                                      alt={row.signName}
                                      width={210}
                                      height={210}
                                      className="rounded object-contain"
                                      style={{ width: "210px", height: "auto" }}
                                    />
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
                ) : moduleId === "g1-sharing-the-road" &&
                  currentLesson.id === "1" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      This lesson is based on the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook/sharing-road-other-road-users"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        MTO section on sharing the road with other road users
                      </a>{" "}
                      and the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook/stopping"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        MTO section on stopping
                      </a>
                      .
                    </p>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        School Buses: When You Must Stop
                      </h2>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        School buses are chrome yellow with the words
                        &quot;School Bus&quot; on them. Whenever a school bus is
                        stopped with its upper{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          red lights flashing
                        </strong>{" "}
                        or stop arm out, you must stop whether you are{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          approaching from the front or rear
                        </strong>
                        .
                      </p>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          If you are{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            behind
                          </strong>{" "}
                          the bus, stop at least{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            20 metres
                          </strong>{" "}
                          away.
                        </li>
                        <li>
                          If you are{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            approaching from the front
                          </strong>
                          , stop far enough back for children to safely cross in
                          front of you.
                        </li>
                        <li>
                          Stay stopped until the bus moves again, the red lights
                          stop flashing, and the stop arm folds away.
                        </li>
                        <li>
                          On a road with a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            median
                          </strong>
                          , only vehicles coming from{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            behind
                          </strong>{" "}
                          the bus must stop.
                        </li>
                      </ul>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Failing to stop for a school bus with red lights
                        flashing is illegal and can result in heavy fines and{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          six demerit points
                        </strong>{" "}
                        for a first offence.
                      </p>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        School Crossings &amp; Pedestrian Crossovers
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Where a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            school crossing guard
                          </strong>{" "}
                          displays the red-and-white stop sign, you must stop
                          before the crossing and remain stopped until{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            all people, including the guard, have cleared the
                            entire roadway
                          </strong>
                          .
                        </li>
                        <li>
                          At{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            pedestrian crossovers
                          </strong>
                          , drivers and cyclists must stop and yield the whole
                          roadway to pedestrians and crossing guards, and only
                          proceed once everyone has reached the sidewalk.
                        </li>
                        <li>
                          Never pass another vehicle within{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            30 metres
                          </strong>{" "}
                          of a pedestrian crossover.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Sharing the Road with Streetcars
                      </h2>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Some streetcar stops have special safety islands or
                        zones. Pass these at a reasonable speed and be ready for
                        pedestrians stepping out unexpectedly.
                      </p>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Where passengers board or exit directly from the road,
                        you must{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          stop behind the streetcar
                        </strong>{" "}
                        and only proceed once all passengers are safely off the
                        roadway and the streetcar doors are closed (per local
                        rules; always follow posted signs and markings).
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-sharing-the-road" &&
                  currentLesson.id === "2" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Key rules in this lesson come from the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook/sharing-road-other-road-users"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        MTO Sharing the Road section
                      </a>
                      .
                    </p>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Sharing with Cyclists
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Cyclists usually ride about{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            one metre
                          </strong>{" "}
                          from the curb or parked cars. They may use any part of
                          the lane to avoid hazards, cross tracks at a safe
                          angle, or when the lane is too narrow to share safely.
                        </li>
                        <li>
                          When{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            passing a cyclist
                          </strong>
                          , you must leave at least{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            one metre
                          </strong>{" "}
                          of space where practical. Whenever possible, change
                          lanes to pass. Failing to give one metre can lead to a
                          fine and{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            two demerit points
                          </strong>
                          .
                        </li>
                        <li>
                          Do not follow closely behind cyclists—they do not have
                          brake lights to warn you when slowing or stopping.
                        </li>
                        <li>
                          Check mirrors and right-side blind spots carefully
                          before turning or changing lanes, especially across a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            bike lane
                          </strong>
                          .
                        </li>
                        <li>
                          Watch for cyclists&apos;{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            hand signals
                          </strong>{" "}
                          and try to make eye contact when possible.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Large Vehicles, Buses, and Slow-Moving Traffic
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Large trucks and buses have{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            big blind spots
                          </strong>{" "}
                          on both sides and directly behind. If you can&apos;t
                          see the driver&apos;s face in their mirror, they
                          likely can&apos;t see you.
                        </li>
                        <li>
                          They need{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            longer distances to stop
                          </strong>
                          , so never cut in closely after passing.
                        </li>
                        <li>
                          When a municipal bus is leaving a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            bus bay
                          </strong>{" "}
                          with its left signal on, you must allow it to re-enter
                          traffic.
                        </li>
                        <li>
                          Farm machinery and horse-drawn vehicles often travel
                          at{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            40 km/h or less
                          </strong>{" "}
                          and display a slow-moving vehicle sign. Stay well back
                          and only pass when it is clearly safe.
                        </li>
                      </ul>
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
                        Safe Sharing Mindset
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario roads are shared by pedestrians, cyclists,
                        motorcycles, large trucks, buses, farm machinery, and
                        horse-drawn vehicles. Giving extra time, space, and
                        attention to more vulnerable road users prevents
                        collisions and keeps everyone safer.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-right-of-way" &&
                  currentLesson.id === "1" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      These rules are based on the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook/driving-through-intersections"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        MTO section on driving through intersections
                      </a>{" "}
                      in the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Official Driver&apos;s Handbook
                      </a>
                      .
                    </p>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Controlled vs. Uncontrolled Intersections
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Intersections with traffic lights, stop signs, or yield
                        signs are{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          controlled intersections
                        </strong>
                        . Intersections without any signs or lights are{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          uncontrolled intersections
                        </strong>
                        . At both types, you must be ready to yield the
                        right-of-way to avoid collisions.
                      </p>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Uncontrolled Intersections &amp; 4-Way Stops
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          At an{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            uncontrolled intersection
                          </strong>
                          , you must yield to a vehicle that reaches the
                          intersection before you. If you arrive at the same
                          time, the vehicle on the{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            right
                          </strong>{" "}
                          has the right-of-way.
                        </li>
                        <li>
                          At a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            4-way stop
                          </strong>
                          , the first vehicle to come to a complete stop has the
                          right-of-way.
                        </li>
                        <li>
                          If two vehicles stop at the same time at a 4-way stop,
                          the driver on the{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            left
                          </strong>{" "}
                          must yield to the driver on the right.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Turning at Intersections
                      </h2>
                      <p
                        className="mb-2 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Whenever you turn left or right at an intersection, you
                        may have to yield:
                      </p>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          For{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            left turns
                          </strong>
                          , wait for oncoming traffic to pass or turn, and yield
                          to pedestrians in or approaching your path.
                        </li>
                        <li>
                          For{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            right turns
                          </strong>
                          , yield to pedestrians crossing where you will turn
                          and check your blind spot for cyclists approaching
                          from behind, especially in bike lanes or on the
                          sidewalk.
                        </li>
                        <li>
                          For{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            right turns on red
                          </strong>
                          , you must come to a complete stop, then yield to
                          pedestrians and others using the road before turning.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Driveways, Crossovers, and School Crossings
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          When entering a road from a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            private road or driveway
                          </strong>
                          , you must yield to vehicles on the road and
                          pedestrians on the sidewalk.
                        </li>
                        <li>
                          At{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            pedestrian crossovers
                          </strong>{" "}
                          and{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            school crossings with crossing guards
                          </strong>
                          , you must yield and wait until pedestrians have
                          completely crossed the road.
                        </li>
                      </ul>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Remember:{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          signalling does not give you the right-of-way
                        </strong>
                        . You must always make sure the way is clear before
                        proceeding.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g1-right-of-way" &&
                  currentLesson.id === "2" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Emergency-vehicle rules here are summarized from the{" "}
                      <a
                        href="https://www.ontario.ca/document/official-mto-drivers-handbook/dealing-particular-situations"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        MTO section on dealing with particular situations
                      </a>
                      .
                    </p>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Recognizing Emergency Vehicles
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Emergency vehicles include police, fire, ambulance and
                        certain public-utility vehicles. They may use flashing
                        red or red-and-blue lights, a siren or bell, or
                        alternating high-beam headlights. Some firefighters and
                        volunteer medical responders may use a{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          flashing green light
                        </strong>{" "}
                        on their own vehicles—you should still yield to help
                        them reach an emergency safely.
                      </p>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        When an Emergency Vehicle Is Approaching
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          When an emergency vehicle approaches from any
                          direction with lights flashing and siren or bell
                          sounding, you must{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            bring your vehicle to an immediate stop
                          </strong>
                          .
                        </li>
                        <li>
                          Move your vehicle as near as practical to the{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            right-hand curb or edge of the roadway
                          </strong>{" "}
                          (or nearest edge on a one-way / multi-lane divided
                          road), parallel to the road and{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            clear of intersections and ramps
                          </strong>
                          .
                        </li>
                        <li>
                          Do not stop on the{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            shoulder
                          </strong>
                          ; emergency vehicles may be using it.
                        </li>
                        <li>
                          If you are in an intersection preparing to turn,
                          abandon the turn, clear the intersection by going
                          straight when safe, then pull to the right and stop.
                        </li>
                        <li>
                          After the emergency vehicle passes, check that the way
                          is clear, signal, and merge back into traffic. Watch
                          for additional emergency vehicles.
                        </li>
                        <li>
                          It is illegal to{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            follow within 150 metres
                          </strong>{" "}
                          of a fire vehicle responding to an alarm.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        When an Emergency Vehicle or Tow Truck Is Stopped
                      </h2>
                      <ul
                        className="mb-3 list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          When you approach a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            stopped emergency vehicle
                          </strong>{" "}
                          with red or red-and-blue lights flashing, or a{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            tow truck with amber lights flashing
                          </strong>
                          , you must{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            reduce your speed and proceed with caution
                          </strong>
                          .
                        </li>
                        <li>
                          If there are{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            two or more lanes
                          </strong>{" "}
                          in your direction, you must{" "}
                          <strong style={{ color: "var(--ghost-white)" }}>
                            move to a lane away from the stopped vehicle
                          </strong>{" "}
                          when safe to do so, in addition to slowing down.
                        </li>
                        <li>
                          Brake early and gradually so other drivers have time
                          to react, and always shoulder-check before changing
                          lanes.
                        </li>
                      </ul>
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
                        Penalties for Not Yielding
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Failing to respond properly to an emergency vehicle or
                        stopped tow truck can result in fines and{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          three demerit points
                        </strong>{" "}
                        for a first offence. For additional offences, fines
                        increase and you could face up to{" "}
                        <strong style={{ color: "var(--ghost-white)" }}>
                          six months in jail
                        </strong>
                        . Treat lights and sirens seriously—clear the way and
                        stop when required.
                      </p>
                    </div>
                  </div>
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
                ) : moduleId === "g1-what-to-do-when-accident-occurs" &&
                  currentLesson.id === "1" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        If an accident happens, the first thing is to stay calm
                        and check if anyone is injured.
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Check yourself and passengers</li>
                        <li>Check people in the other vehicle</li>
                        <li>Call 911 immediately if someone is injured</li>
                      </ul>
                    </div>
                  </>
                ) : moduleId === "g1-what-to-do-when-accident-occurs" &&
                  currentLesson.id === "2" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        If the accident is minor and the vehicles can move:
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Turn on hazard lights</li>
                        <li>Move the vehicle to the side of the road</li>
                        <li>Avoid blocking traffic</li>
                      </ul>
                    </div>
                  </>
                ) : moduleId === "g1-what-to-do-when-accident-occurs" &&
                  currentLesson.id === "3" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Call 911 if:
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Someone is injured</li>
                        <li>Vehicles are heavily damaged</li>
                        <li>The road is blocked</li>
                        <li>There is a fire or danger</li>
                      </ul>
                    </div>
                  </>
                ) : moduleId === "g1-what-to-do-when-accident-occurs" &&
                  currentLesson.id === "4" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Drivers must exchange important details. Collect:
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Full name</li>
                        <li>Phone number</li>
                        <li>Driver&apos;s license number</li>
                        <li>License plate number</li>
                        <li>Insurance company and policy number</li>
                      </ul>
                    </div>
                  </>
                ) : moduleId === "g1-what-to-do-when-accident-occurs" &&
                  currentLesson.id === "5" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Take photos and gather evidence. Important things to
                        photograph:
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Damage to vehicles</li>
                        <li>License plates</li>
                        <li>Road conditions</li>
                        <li>Traffic signs or signals</li>
                        <li>Position of vehicles</li>
                      </ul>
                    </div>
                  </>
                ) : moduleId === "g1-what-to-do-when-accident-occurs" &&
                  currentLesson.id === "6" ? (
                  <>
                    <div className="space-y-4">
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        In Ontario, accidents must be reported if:
                      </p>
                      <ul
                        className="list-disc space-y-2 pl-5 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Damage exceeds $2000</li>
                        <li>Someone is injured</li>
                      </ul>
                      <p
                        className="mt-4 text-sm font-semibold"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        You must report to a Collision Reporting Centre.
                      </p>
                    </div>
                  </>
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
                ) : moduleId === "g2-licensing-restrictions" &&
                  currentLesson.id === "1" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      This lesson covers the strict sobriety requirements for
                      novice drivers.
                    </p>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        The Zero BAC Limit
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        As a G2 driver, you must have a Blood Alcohol
                        Concentration of 0%. Even one drink can put you over
                        this limit.
                      </p>
                    </div>

                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Drug Restrictions
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        The same zero-tolerance policy applies to cannabis and
                        other drugs that impair driving.
                      </p>
                    </div>

                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Consequences
                      </h2>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Immediate 3-day roadside suspension</li>
                        <li>A fine</li>
                        <li>
                          A further 30-day suspension upon conviction
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : moduleId === "g2-licensing-restrictions" &&
                  currentLesson.id === "2" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      These rules apply to G2 drivers aged 19 and under between
                      midnight and 5:00 AM.
                    </p>

                    {/* Timeline Toggle */}
                    <div
                      className="flex rounded-xl border-2 p-1"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                      role="tablist"
                      aria-label="Passenger limit period"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={g2PassengerTab === "first6"}
                        onClick={() => setG2PassengerTab("first6")}
                        className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all"
                        style={
                          g2PassengerTab === "first6"
                            ? {
                                backgroundColor: "var(--electric-cyan)",
                                color: "var(--void-purple)",
                              }
                            : {
                                color: "var(--lavender-mist)",
                              }
                        }
                      >
                        First 6 Months
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={g2PassengerTab === "after6"}
                        onClick={() => setG2PassengerTab("after6")}
                        className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all"
                        style={
                          g2PassengerTab === "after6"
                            ? {
                                backgroundColor: "var(--electric-cyan)",
                                color: "var(--void-purple)",
                              }
                            : {
                                color: "var(--lavender-mist)",
                              }
                        }
                      >
                        After 6 Months (until age 20)
                      </button>
                    </div>

                    {/* Tab content */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      {g2PassengerTab === "first6" ? (
                        <>
                          <div
                            className="mb-3 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            1 Passenger Limit
                          </div>
                          <p
                            className="leading-relaxed"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            You may carry only ONE passenger aged 19 or under.
                          </p>
                        </>
                      ) : (
                        <>
                          <div
                            className="mb-3 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            3 Passenger Limit
                          </div>
                          <p
                            className="leading-relaxed"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            You may carry up to THREE passengers aged 19 or
                            under.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Immediate Family Exception */}
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h3
                        className="mb-2 text-sm font-semibold uppercase tracking-wide"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        The &quot;Immediate Family&quot; Exception
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        These limits do not apply to immediate family members
                        (e.g., siblings).
                      </p>
                    </div>

                    {/* Golden Rule / Exemption Card */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Exemption Card
                      </div>
                      <h3
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        The Golden Rule
                      </h3>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        If a fully licensed driver with 4+ years of experience is
                        in the front seat,                         these passenger restrictions are
                        waived.
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-licensing-restrictions" &&
                  currentLesson.id === "3" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      A G2 driver is legally responsible for ensuring every
                      passenger is buckled up, regardless of age, and must never
                      exceed the number of working seatbelts.
                    </p>

                    {/* The G2 Shift — side-by-side comparison */}
                    <div>
                      <h2
                        className="mb-4 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        The G2 Shift
                      </h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div
                          className="rounded-lg border-2 p-4"
                          style={{
                            borderColor: "var(--midnight-indigo)",
                            backgroundColor: "var(--midnight-indigo)",
                          }}
                        >
                          <div
                            className="mb-2 text-sm font-bold"
                            style={{ color: "var(--electric-cyan)" }}
                          >
                            Full G Driver
                          </div>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            Responsible for passengers under 16. Passengers 16+
                            get their own tickets.
                          </p>
                        </div>
                        <div
                          className="rounded-lg border-2 p-4"
                          style={{
                            borderColor: "var(--electric-cyan)",
                            backgroundColor: "var(--midnight-indigo)",
                          }}
                        >
                          <div
                            className="mb-2 text-sm font-bold"
                            style={{ color: "var(--electric-cyan)" }}
                          >
                            G2 Driver
                          </div>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            Responsible for <strong style={{ color: "var(--ghost-white)" }}>EVERYONE</strong>. If a 30-year-old passenger
                            isn&apos;t buckled, the G2 driver can face a license
                            suspension.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* One Belt, One Person — car graphic */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <h2
                        className="mb-4 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        One Belt, One Person
                      </h2>
                      <p
                        className="mb-4 text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Trying to fit a 6th person (even if they &quot;squeeze
                        in&quot;) is a violation of the Capacity law.
                      </p>
                      <div
                        className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border-2 p-5"
                        style={{
                          borderColor: "var(--midnight-indigo)",
                          backgroundColor: "var(--midnight-indigo)",
                        }}
                        aria-hidden
                      >
                        {/* 5 valid seats (belt icon) + 6th = violation */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                              style={{
                                backgroundColor: "var(--void-purple)",
                                border: "2px solid var(--electric-cyan)",
                              }}
                              title={`Seat ${n} — one belt, one person`}
                            >
                              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                                <rect x="5" y="4" width="18" height="20" rx="2" stroke="var(--electric-cyan)" strokeWidth="1.5" fill="none" />
                                <path d="M5 8l18 14" stroke="var(--electric-cyan)" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </div>
                          ))}
                          <span className="px-1 text-xl font-bold" style={{ color: "var(--lavender-mist)" }} aria-hidden>+</span>
                          <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: "rgba(238, 68, 68, 0.12)",
                              border: "2px dashed var(--crimson-spark)",
                            }}
                            title="6th person — capacity violation"
                          >
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                              <rect x="4" y="4" width="20" height="20" rx="2" stroke="var(--crimson-spark)" strokeWidth="2" fill="none" />
                              <path d="M8 8l12 12 M20 8L8 20" stroke="var(--crimson-spark)" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-center text-sm">
                          <span style={{ color: "var(--lavender-mist)" }}>
                            5 seatbelts = 5 people max
                          </span>
                          <span style={{ color: "var(--crimson-spark)", fontWeight: 600 }}>
                            6th person = capacity violation
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Escalating Sanctions — high-visibility alert */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--crimson-spark)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-3 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--crimson-spark)" }}
                      >
                        Escalating Sanctions
                      </div>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Penalty for a G2 seatbelt violation:
                      </p>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>
                            30-day license suspension
                          </strong>{" "}
                          for a first-time novice driver restriction violation.
                        </li>
                        <li>
                          <strong style={{ color: "var(--ghost-white)" }}>
                            2 demerit points
                          </strong>{" "}
                          + a fine (up to $1,000).
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : moduleId === "g2-licensing-restrictions" &&
                  currentLesson.id === "4" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      G2 drivers face two parallel penalty systems:{" "}
                      <strong style={{ color: "var(--ghost-white)" }}>
                        Demerit Point Accumulation
                      </strong>{" "}
                      (standard) and{" "}
                      <strong style={{ color: "var(--ghost-white)" }}>
                        Escalating Sanctions
                      </strong>{" "}
                      (the &quot;Novice Driver&quot; fast-track to suspension).
                    </p>

                    {/* Two Paths to Suspension — toggle */}
                    <div>
                      <h2
                        className="mb-4 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Two Paths to Suspension
                      </h2>
                      <div
                        className="mb-4 flex rounded-xl border-2 p-1"
                        style={{
                          borderColor: "var(--midnight-indigo)",
                          backgroundColor: "var(--midnight-indigo)",
                        }}
                        role="tablist"
                        aria-label="Path to suspension"
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={g2PathsTab === "demerits"}
                          onClick={() => setG2PathsTab("demerits")}
                          className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all"
                          style={
                            g2PathsTab === "demerits"
                              ? {
                                  backgroundColor: "var(--electric-cyan)",
                                  color: "var(--void-purple)",
                                }
                              : { color: "var(--lavender-mist)" }
                          }
                        >
                          Path A: Demerits
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={g2PathsTab === "escalating"}
                          onClick={() => setG2PathsTab("escalating")}
                          className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all"
                          style={
                            g2PathsTab === "escalating"
                              ? {
                                  backgroundColor: "var(--electric-cyan)",
                                  color: "var(--void-purple)",
                                }
                              : { color: "var(--lavender-mist)" }
                          }
                        >
                          Path B: Escalating Sanctions
                        </button>
                      </div>

                      {g2PathsTab === "demerits" ? (
                        <div
                          className="rounded-lg border-2 p-4"
                          style={{
                            borderColor: "var(--midnight-indigo)",
                            backgroundColor: "var(--void-purple)",
                          }}
                        >
                          <ul
                            className="space-y-3 text-sm leading-relaxed"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            <li>
                              <strong style={{ color: "var(--ghost-white)" }}>2–5 points:</strong> Warning Letter.
                            </li>
                            <li>
                              <strong style={{ color: "var(--ghost-white)" }}>6–8 points:</strong> Interview + $50 fee.
                            </li>
                            <li>
                              <strong style={{ color: "var(--ghost-white)" }}>9 points:</strong> Automatic 60-day suspension.
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div
                          className="rounded-lg border-2 p-4"
                          style={{
                            borderColor: "var(--midnight-indigo)",
                            backgroundColor: "var(--void-purple)",
                          }}
                        >
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--lavender-mist)" }}
                          >
                            Triggered by any G2 condition violation (e.g. the midnight passenger rule or zero-alcohol rule){" "}
                            <strong style={{ color: "var(--ghost-white)" }}>or</strong> any 4+ demerit point conviction (e.g. speeding 30 km/h over).
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Sanction Ladder */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h2
                        className="mb-4 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Sanction Ladder
                      </h2>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            1
                          </div>
                          <div>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              1st Occurrence:
                            </span>{" "}
                            <span style={{ color: "var(--lavender-mist)" }}>
                              30-day suspension.
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            2
                          </div>
                          <div>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              2nd Occurrence:
                            </span>{" "}
                            <span style={{ color: "var(--lavender-mist)" }}>
                              90-day suspension.
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "var(--crimson-spark)",
                              color: "white",
                            }}
                          >
                            3
                          </div>
                          <div>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              3rd Occurrence:
                            </span>{" "}
                            <span style={{ color: "var(--lavender-mist)" }}>
                              License <strong style={{ color: "var(--crimson-spark)" }}>CANCELLED</strong>. Must restart from G1 (all tests and fees).
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4-Point Trap */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--crimson-spark)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-3 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--crimson-spark)" }}
                      >
                        The 4-Point Trap
                      </div>
                      <p
                        className="mb-4 text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Common offences that carry 4+ points and trigger an immediate 30-day suspension for a G2 driver:
                      </p>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2 text-sm"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Speeding 30 km/h–49 km/h over the limit.</li>
                        <li>Following too closely (tailgating).</li>
                        <li>Failing to stop for a pedestrian crossover.</li>
                      </ul>
                    </div>
                  </div>
                ) : moduleId === "g2-licensing-restrictions" &&
                  currentLesson.id === "5" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      A clear summary of how you move from G2 to a Full G license.
                    </p>

                    {/* G2 Exit Timeline */}
                    <div>
                      <h2
                        className="mb-4 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        The G2 Exit Timeline
                      </h2>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            1
                          </div>
                          <div>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              Step 1:
                            </span>{" "}
                            <span style={{ color: "var(--lavender-mist)" }}>
                              Hold G2 for 12 months (minimum).
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            2
                          </div>
                          <div>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              Step 2:
                            </span>{" "}
                            <span style={{ color: "var(--lavender-mist)" }}>
                              Gain highway experience (400-series or 80 km/h+ roads).
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: "var(--electric-cyan)",
                              color: "var(--void-purple)",
                            }}
                          >
                            3
                          </div>
                          <div>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              Step 3:
                            </span>{" "}
                            <span style={{ color: "var(--lavender-mist)" }}>
                              Pass the &quot;G&quot; Road Test.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Highway Requirements — Pro-Tip */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Pro-Tip: Highway Requirements
                      </div>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        You must have driven on 400-series highways or high-speed
                        roads (80 km/h or faster) at least 5 times in the 3
                        months before your test.
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Examples: 401, 400, 404, 407, QEW, Gardiner, DVP, or
                        high-speed regional roads.
                      </p>
                    </div>

                    {/* 5-Year Deadline Warning */}
                    <div
                      className="rounded-lg border-2 p-5"
                      style={{
                        borderColor: "var(--crimson-spark)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-3 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--crimson-spark)" }}
                      >
                        The 5-Year Deadline
                      </div>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        You have <strong style={{ color: "var(--ghost-white)" }}>5 years</strong> from the day you get your G1 to finish the entire process.
                      </p>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        If the 5 years pass and you don&apos;t have your
                        &quot;G&quot;, you must start over from the beginning
                        (G1 test).
                      </p>
                    </div>

                    {/* G Road Test vs G2 Road Test — two-column table */}
                    <div
                      className="overflow-x-auto rounded-lg border-2"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <table className="w-full min-w-[320px] border-collapse text-left">
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
                              G2 Test
                            </th>
                            <th
                              className="px-4 py-3 text-sm font-semibold"
                              style={{ color: "var(--ghost-white)" }}
                            >
                              G Test
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            style={{
                              backgroundColor: "var(--void-purple)",
                              color: "var(--lavender-mist)",
                              borderBottom: "1px solid var(--midnight-indigo)",
                            }}
                          >
                            <td className="px-4 py-3 text-sm leading-relaxed">
                              Residential streets, basic turns, parallel parking,
                              3-point turns.
                            </td>
                            <td className="px-4 py-3 text-sm leading-relaxed">
                              Everything in G2 + highway merging, lane changes at
                              high speeds, and advanced hazard perception.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "1" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Before you drive, ensure you are comfortable with your
                      physical and mental state, your vehicle, and the
                      conditions in which you will be driving. If you have
                      doubts about any of them, do not drive. (MTO Driver&apos;s
                      Handbook — Getting ready to drive.)
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Why Pre-Drive Inspection Matters
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        A quick check of your vehicle before you move can prevent
                        breakdowns and collisions. The Ministry of Transportation
                        recommends that you know your vehicle and its controls
                        before you drive.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <h3
                        className="mb-3 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Try this order
                      </h3>
                      <ol
                        className="list-inside list-decimal space-y-2 pl-2 text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>
                          Outside once: tires, lights, glass, mirrors, licence plate.
                        </li>
                        <li>
                          Inside: a full clear view; nothing on the dash or windows
                          that blocks sight lines.
                        </li>
                        <li>
                          Before you move, know where wipers, headlights, hazards,
                          and defroster are.
                        </li>
                      </ol>
                    </div>
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <h3
                        className="mb-3 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        What to Check Before You Start
                      </h3>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Exterior: tires, lights, windows, mirrors, licence plate.</li>
                        <li>Interior: seat position, mirrors, seatbelts, dashboard.</li>
                        <li>Controls: wipers, washers, headlights, defroster — know where they are.</li>
                        <li>No obstructions in windows or on the dashboard that block your view.</li>
                      </ul>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      The next lesson in this module goes deeper on seat position,
                      mirrors, and seatbelts—part of the same pre-drive readiness
                      after your outside check.
                    </p>
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <h3
                        className="mb-2 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Common mistake
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Skipping a quick walk-around because it is the driving
                        school or examiner vehicle and you assume it is fine. Tires,
                        lights, or visibility issues can still be there—briefly say
                        what you looked at outside (for example tires, lights, and
                        windows) so you show you take the vehicle seriously before
                        you move.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <h3
                        className="mb-2 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Examiner tip
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        On your G2 road test, the examiner may ask you to locate
                        basic controls—such as headlights, wipers, hazards, or the
                        defroster—or to confirm the vehicle looks roadworthy before you
                        move. Be ready to say what you checked outside and inside, not
                        only to recognize items on a list.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--void-purple)",
                      }}
                    >
                      <h3
                        className="mb-2 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Test day
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Nerves can make you rush past the pre-drive check. It is
                        normal to briefly say what you are looking at (tires, lights,
                        obstructions, a clear view). If something looks wrong or you
                        cannot find a control, say so before you move—calm and clear
                        is better than guessing once you are rolling.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario Ministry of Transportation. &quot;Getting ready to
                        drive.&quot; Official MTO Driver&apos;s Handbook.{" "}
                        <a
                          href="https://www.ontario.ca/document/official-mto-drivers-handbook/getting-ready-drive"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "2" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Proper seat and mirror adjustment keeps you in control and
                      reduces blind spots. The MTO Driver&apos;s Handbook describes
                      how to get into position and keep a clear view.
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Seat Position
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Sit high enough to see over the steering wheel and hood.
                        You should be able to see the ground about four metres in
                        front of the vehicle. Sit straight upright with your
                        elbows slightly bent.
                      </p>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Adjust the seat so your feet reach the pedals easily. To
                        check: place your feet flat on the floor under the brake
                        pedal without stretching. If your vehicle has an
                        adjustable headrest, position it so the back of your head
                        is directly in front of the middle of the headrest to
                        protect you in a collision.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Mirror Adjustment and Blind Spots
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Blind spots are areas on each side of your vehicle where
                        you cannot see. You may not see people or cyclists there.
                        On some vehicles the blind spot is large enough that
                        another vehicle could be there unseen.
                      </p>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Interior mirror: centre of mirror shows the centre of the rear window; you should see directly behind the car.</li>
                        <li>Left outside mirror: lean toward the window and move the mirror so you can just see the rear of your car.</li>
                        <li>Right outside mirror: lean toward the centre of the vehicle and move the mirror so you can just see the rear of your car.</li>
                      </ul>
                      <p
                        className="mt-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Mirrors alone do not show everything. Always do a
                        shoulder check before changing lanes or turning.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario Ministry of Transportation. &quot;Getting ready to
                        drive&quot; — Get into position; Find your blind spots.{" "}
                        <a
                          href="https://www.ontario.ca/document/official-mto-drivers-handbook/getting-ready-drive"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "3" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Before you drive, know where all controls and instruments
                      are and what they do. Check that all warning lights and
                      gauges work. Watch for a warning light that stays on after
                      you drive away — it could mean a serious problem. (MTO
                      Driver&apos;s Handbook.)
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Know Your Vehicle
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Vehicles vary in fuel systems, anti-lock brakes,
                        four-wheel drive, traction and stability control. Newer
                        vehicles may have driver-assist technologies. Check the
                        owner&apos;s manual to learn how these systems work and
                        their limitations. You must always be ready to take over
                        control and you remain responsible for all driving tasks.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h3
                        className="mb-2 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Essential Controls to Know Without Looking
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Learn to use wipers, washers, headlights, high beams,
                        heater and defroster without taking your eyes off the
                        road.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--crimson-spark)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--crimson-spark)" }}
                      >
                        Warning Lights
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        A warning light that stays on after you drive away may
                        indicate a serious problem. Have your vehicle checked
                        before driving further.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario Ministry of Transportation. &quot;Getting ready to
                        drive&quot; — Know your vehicle.{" "}
                        <a
                          href="https://www.ontario.ca/document/official-mto-drivers-handbook/getting-ready-drive"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "4" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Your vehicle must be in safe working order. The MTO
                      Driver&apos;s Handbook and Ontario highway safety standards
                      expect drivers to maintain their vehicle for safe operation.
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Tires
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Check tire condition and pressure regularly. Worn or
                        under-inflated tires reduce grip and can cause loss of
                        control. Ensure tread depth is sufficient and there are
                        no visible cracks or bulges. In Ontario, winter tires
                        are recommended in cold and snowy conditions.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Brakes
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Brakes must respond properly. If the brake pedal feels
                        soft, sinks, or the vehicle pulls to one side when
                        braking, have the brakes inspected before driving.
                        Anti-lock brake systems (ABS) require proper
                        maintenance; consult your owner&apos;s manual.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario Ministry of Transportation. Vehicle safety and
                        readiness.{" "}
                        <a
                          href="https://www.ontario.ca/page/government-ontario"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "5" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Keep a clear view and use your lighting system correctly.
                      The MTO Driver&apos;s Handbook sets out legal requirements
                      for visibility and headlights.
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Keep a Clear View
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Do not put anything in your windows that blocks your
                        view. Windows must not be coated with any material that
                        keeps you from seeing out. The windshield and front door
                        windows must not be coated to prevent others from seeing
                        inside.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Headlights and Lighting
                      </h2>
                      <p
                        className="mb-3 leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Headlights must shine a white light visible at least 150
                        metres ahead and light up objects 110 metres away. You
                        must have red rear lights visible 150 metres away and a
                        white light on the rear licence plate when headlights
                        are on.
                      </p>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li>Turn on headlights between one-half hour before sunset and one-half hour after sunrise, and whenever you cannot clearly see people or vehicles less than 150 metres away (e.g. fog, snow, rain).</li>
                        <li>Switch to low beams within 150 metres of an oncoming vehicle; use low beams when less than 60 metres behind another vehicle unless passing.</li>
                        <li>Parking lights are only for parking; in low light use headlights.</li>
                        <li>Keep lights clean and replace burned-out bulbs promptly.</li>
                      </ul>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario Ministry of Transportation. &quot;Getting ready to
                        drive&quot; — Keep a clear view; Turn on headlights.{" "}
                        <a
                          href="https://www.ontario.ca/document/official-mto-drivers-handbook/getting-ready-drive"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "6" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Before driving on Ontario roads, you must have the required
                      documents. The Ministry of Transportation and provincial
                      law set out what you must carry.
                    </p>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--midnight-indigo)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <h3
                        className="mb-3 text-base font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Required Documents
                      </h3>
                      <ul
                        className="list-inside list-disc space-y-2 pl-2"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        <li><strong style={{ color: "var(--ghost-white)" }}>Valid driver&apos;s licence</strong> — You must carry your licence when driving.</li>
                        <li><strong style={{ color: "var(--ghost-white)" }}>Vehicle permit (ownership)</strong> — Proof you are the legal owner; contains VIN, make, model, owner&apos;s name and address, licence plate number. Update within 6 days of moving.</li>
                        <li><strong style={{ color: "var(--ghost-white)" }}>Valid auto insurance</strong> — All motorists in Ontario must have auto insurance. Carry the liability insurance card (&quot;pink slip&quot;) for the vehicle you are driving. Minimum $200,000 third-party liability is required.</li>
                        <li><strong style={{ color: "var(--ghost-white)" }}>Licence plates</strong> — With up-to-date validation stickers when applicable.</li>
                      </ul>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--crimson-spark)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--crimson-spark)" }}
                      >
                        Driving Without Insurance
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Fines of $5,000 to $50,000, licence suspension, and
                        vehicle impoundment can apply. Do not drive without valid
                        insurance.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario. Vehicle insurance and registration; Register
                        and insure a vehicle.{" "}
                        <a
                          href="https://www.ontario.ca/page/government-ontario"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-pre-drive-vehicle-safety" &&
                  currentLesson.id === "7" ? (
                  <div className="space-y-6">
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--lavender-mist)" }}
                    >
                      Before you drive, make sure you are comfortable with your
                      physical, mental and emotional state, your vehicle, and the
                      conditions in which you will be driving. If you have doubts
                      about any of them, do not drive. (MTO Driver&apos;s Handbook.)
                    </p>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Be Physically and Mentally Alert
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Do not drive when you are sick, injured, tired, or when
                        you have been drinking or taking any drug or medication
                        that may reduce your ability to drive. Do not drive when
                        you are upset or angry — strong emotions can reduce your
                        ability to think and react quickly.
                      </p>
                    </div>
                    <div>
                      <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--ghost-white)" }}
                      >
                        Hazard Awareness Before Moving
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Before you move the vehicle, check for people, cyclists,
                        and obstacles around and behind the vehicle. Use your
                        mirrors and shoulder check; know your blind spots. Ensure
                        the path is clear and you have a safe space to enter
                        traffic.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Summary — Safe Vehicle Readiness
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        By the end of this module you should know: how to use your
                        vehicle&apos;s lighting system; legal requirements for
                        seatbelts and child restraints; how to set your seating
                        position and mirrors; factors that affect your readiness
                        to drive; and the importance of safe, responsible and
                        defensive driving. (MTO Driver&apos;s Handbook — Getting ready
                        to drive.)
                      </p>
                    </div>
                    <div
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--electric-cyan)",
                        backgroundColor: "var(--midnight-indigo)",
                      }}
                    >
                      <div
                        className="mb-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--electric-cyan)" }}
                      >
                        Source
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--lavender-mist)" }}
                      >
                        Ontario Ministry of Transportation. &quot;Getting ready to
                        drive.&quot; Official MTO Driver&apos;s Handbook.{" "}
                        <a
                          href="https://www.ontario.ca/document/official-mto-drivers-handbook/getting-ready-drive"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                          style={{ color: "var(--electric-cyan)" }}
                        >
                          ontario.ca
                        </a>
                      </p>
                    </div>
                  </div>
                ) : moduleId === "g2-essential-road-maneuvers" &&
                  ROAD_MANEUVERS_CONTENT[currentLesson.id] ? (
                  <ManeuverLessonContent
                    content={ROAD_MANEUVERS_CONTENT[currentLesson.id]}
                  />
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
                  onClick={async () => {
                    setProgressSyncError(null);
                    setLessonComplete(moduleId, currentLesson.id);
                    setMarkedComplete(true);

                    if (user) {
                      const completedForModule = getCompletedLessonsForModule(moduleId);
                      try {
                        await saveUserModuleProgress({
                          userId: user.uid,
                          moduleId,
                          completedLessons: completedForModule,
                        });
                      } catch (error) {
                        setProgressSyncError("Cloud save failed. Check Firebase rules and try again.");
                        console.error("Failed to save module progress", error);
                      }
                    }
                  }}
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
                {progressSyncError ? (
                  <p className="text-sm" style={{ color: "var(--crimson-spark)" }}>
                    {progressSyncError}
                  </p>
                ) : null}
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
