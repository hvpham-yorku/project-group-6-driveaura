export type StructuredCalloutKind = "tip" | "mistake" | "testDay" | "warning";

export type StructuredSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type StructuredCallout = {
  kind: StructuredCalloutKind;
  title: string;
  body: string;
  bullets?: string[];
};

export type StructuredComparison = {
  title: string;
  leftTitle: string;
  leftBody: string;
  rightTitle: string;
  rightBody: string;
};

export type StructuredLesson = {
  intro: string;
  sections: StructuredSection[];
  comparison?: StructuredComparison;
  callouts: StructuredCallout[];
};

export const G2_ROAD_PREP_STRUCTURED_CONTENT: Record<
  string,
  Record<string, StructuredLesson>
> = {
  "g2-hazard-awareness-defensive-driving": {
    "1": {
      intro:
        "Strong G2 driving starts with scanning, not reacting late. Keep your eyes moving: far ahead, near lane, mirrors, then back to the road.",
      sections: [
        {
          title: "Build a space cushion",
          body:
            "Leave yourself room in front, awareness behind, and side space whenever possible. If traffic gets tighter, reduce speed early instead of waiting for a hard brake.",
          bullets: [
            "Look 12+ seconds ahead for changing risks.",
            "Check mirrors every few seconds and before speed changes.",
            "Ease off early when you see congestion building.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Staring only at the vehicle ahead and missing side-street traffic, pedestrians, or a fast-closing vehicle behind.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Examiners look for visible planning: regular mirror checks and early speed adjustments.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "If nerves hit, slow your scan cycle down and keep your space cushion wide.",
        },
      ],
    },
    "2": {
      intro:
        "Mirrors reduce blind spots, but do not eliminate them. Safe lane changes require mirrors, signal, shoulder check, then smooth movement.",
      sections: [
        {
          title: "Reliable lane-change sequence",
          body:
            "Before moving laterally, confirm both lane space and speed difference. If the gap is not safe, wait.",
          bullets: [
            "Mirror check first to read traffic flow.",
            "Signal your intent early.",
            "Shoulder check in the direction of movement.",
            "Move gradually and cancel signal.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Skipping shoulder checks because the mirror looks clear, or checking too long and drifting.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "A complete sequence matters more than speed. Smooth and deliberate beats rushed movement.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "No safe gap? Keep your lane and try again—safe decisions score better than forced moves.",
        },
      ],
    },
    "3": {
      intro:
        "Intersections demand the most attention during a G2 test. Most serious conflicts involve left turns, crosswalks, and late light changes.",
      sections: [
        {
          title: "Approach with a decision plan",
          body:
            "Scan left-centre-right near crosswalks, then re-check as you enter. Prioritize vulnerable road users.",
          bullets: [
            "Check crosswalks before committing to a turn.",
            "Turn into the correct lane with controlled speed.",
            "If view is blocked, creep only when safe.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Rushing a turn on a changing light and only checking for cars—not pedestrians or cyclists.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Examiners want clear judgment: early slowing, repeat checks, and lane-accurate turns.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "Missing a turn is okay. Unsafe decisions at intersections are not.",
        },
      ],
    },
    "4": {
      intro:
        "Following distance and speed choice are linked. Your speed must match visibility, traction, and stopping distance—not just the posted maximum.",
      sections: [
        {
          title: "Use time-based spacing",
          body:
            "Maintain a multi-second gap in normal conditions and increase it in rain, snow, darkness, or heavy traffic.",
          bullets: [
            "Increase distance when visibility drops.",
            "Brake progressively; avoid hard surprise stops.",
            "If tailgated, create more front space instead of speeding up.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Driving at traffic pace even when conditions require slower, safer speed.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Smooth speed control and steady spacing show maturity and risk management.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "Calm, consistent speed usually looks more confident than fast corrections.",
        },
      ],
    },
    "5": {
      intro:
        "Defensive responses work best when chosen early. Most hazards can be managed by reducing speed and keeping escape space.",
      sections: [
        {
          title: "Control first, then reposition",
          body:
            "Ease off accelerator, cover brake, and brake smoothly. Steer only when the path is confirmed clear.",
          bullets: [
            "Avoid panic swerves.",
            "Keep an escape option in mind at all times.",
            "Re-stabilize before accelerating again.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Late hard braking or sudden steering without space checks.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Early risk control and clear decision-making score better than dramatic reactions.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "Unexpected event? Prioritize safe control over perfect route execution.",
        },
      ],
    },
  },
  "g2-parking-low-speed-control": {
    "1": {
      intro:
        "Low-speed control is the foundation for all parking tasks. Precision beats speed every time on a G2 test.",
      sections: [
        {
          title: "Move only as fast as you can observe",
          body:
            "At parking-lot speed, pause whenever visibility is uncertain. Keep your checks active while the vehicle is creeping.",
          bullets: [
            "Use brake/clutch smoothly to control roll.",
            "Stop fully before major direction changes.",
            "Do full observation checks before reversing.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Rolling while still searching for hazards.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Slow, controlled movement with obvious observation is exactly what examiners expect.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "Parking is not a speed test—pause as often as needed.",
        },
      ],
    },
    "2": {
      intro:
        "Parallel parking is mainly setup and alignment. A clean setup makes the rest of the maneuver easier.",
      sections: [
        {
          title: "Use reference points and corrections",
          body:
            "Position beside the lead car, reverse slowly into angle, then straighten and finish close to the curb.",
          bullets: [
            "Keep speed very low.",
            "Check surroundings throughout the maneuver.",
            "Small corrections are normal and expected.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Turning too late/early, then trying to recover at higher speed.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Control and safety checks matter more than finishing in one motion.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "If alignment is off, stop, reset calmly, and correct safely.",
        },
      ],
    },
    "3": {
      intro:
        "Reverse parking improves your exit visibility later. The key is full observation before and during movement.",
      sections: [
        {
          title: "Back in with mirror balance",
          body:
            "Set up with enough turning room, scan 360°, reverse slowly, and keep equal spacing between lines.",
          bullets: [
            "Use mirrors on both sides, not one side only.",
            "Pause if pedestrians or vehicles enter your path.",
            "Finish centered and straight in the space.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Relying entirely on a backup camera and skipping shoulder checks.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "A full stop + full scan before reversing is a strong test habit.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "If someone walks behind you, hold position and wait.",
        },
      ],
    },
    "4": {
      intro:
        "Perpendicular parking is about path planning in busy lots, not just steering into a box.",
      sections: [
        {
          title: "Approach wide enough for one smooth turn",
          body:
            "Signal, position correctly, and enter slowly while checking for pedestrians, carts, and crossing vehicles.",
          bullets: [
            "Stay on the proper side of lot lanes.",
            "Yield when conflict is unclear.",
            "Re-center with a safe correction if needed.",
          ],
        },
      ],
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Turning sharply from too close, ending up crooked or over the line.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Lot discipline counts: lane position, yielding, and speed control are observed.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "Treat parking lots like roads: scan, communicate, and yield.",
        },
      ],
    },
    "5": {
      intro:
        "Hill parking is a safety routine examiners often check directly. Secure the vehicle and set wheel direction correctly every time.",
      sections: [
        {
          title: "Secure + wheel direction",
          body:
            "Set parking brake, choose wheel direction for uphill/downhill/curb conditions, then let the vehicle settle safely.",
          bullets: [
            "Use curb as backup when available.",
            "Know uphill with curb vs downhill direction differences.",
            "If no curb, turn wheels to reduce traffic risk if rolling occurs.",
          ],
        },
      ],
      comparison: {
        title: "Quick direction check",
        leftTitle: "Downhill",
        leftBody: "Turn wheels toward the curb.",
        rightTitle: "Uphill with curb",
        rightBody: "Turn wheels away from the curb.",
      },
      callouts: [
        {
          kind: "mistake",
          title: "Common mistake",
          body:
            "Forgetting parking brake or choosing the wrong wheel direction.",
        },
        {
          kind: "tip",
          title: "Examiner tip",
          body:
            "Show your setup clearly and deliberately; this is a high-visibility scoring item.",
        },
        {
          kind: "warning",
          title: "Safety reminder",
          body:
            "Wrong wheel direction can let a rolling vehicle move into live traffic.",
        },
        {
          kind: "testDay",
          title: "Test day note",
          body:
            "Pause for one second to confirm wheel direction before you secure the vehicle.",
        },
      ],
    },
  },
};

