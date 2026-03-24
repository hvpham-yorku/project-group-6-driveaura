/**
 * Essential Road Maneuvers — G2 module content.
 * Based on the official MTO Driver's Handbook (Ontario).
 */

export interface ManeuverQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ManeuverContent {
  goldenRule: string;
  steps: string[];
  examinerTips: string[];
  quiz: ManeuverQuizItem[];
}

export const ROAD_MANEUVERS_CONTENT: Record<string, ManeuverContent> = {
  "1": {
    goldenRule:
      "Always signal in advance, check mirrors and blind spots, and only turn when the way is clear. When waiting to turn left, keep your wheels straight until you actually turn—never turn the wheel left while waiting, in case you are hit from behind and pushed into oncoming traffic.",
    steps: [
      "Signal well before the turn and move into the correct lane (far right for a right turn, far left in your direction for a left turn).",
      "Look ahead, left, right, and left again. Check your blind spots for cyclists and pedestrians.",
      "Slow down before the turn; finish braking before you turn the steering wheel to keep full control.",
      "Right turn: Stay close to the right side. Yield to pedestrians and cyclists. Turn into the right-hand lane of the new road.",
      "Left turn: Stay in the far left lane. Do not turn your wheels left until you can complete the turn (so you are not pushed into oncoming traffic if hit from behind).",
      "One-way streets: From a one-way to a two-way, turn from the left curb lane to the lane just right of the centre line. From a two-way to a one-way, turn into the left curb lane.",
      "Right turn on red: After a complete stop, you may turn right on a red light unless a sign says no. Yield to pedestrians and traffic.",
      "Left turn on red: Only from a one-way road onto a one-way road, after a complete stop and when the way is clear.",
    ],
    examinerTips: [
      "Failing to signal early enough or at all, or not cancelling the signal after the turn.",
      "Turning the steering wheel left while waiting at an intersection (if hit from behind, the car could roll into oncoming traffic).",
      "Not checking the right blind spot on a right turn—cyclists and pedestrians often lose points for students.",
    ],
    quiz: [
      {
        question:
          "When waiting to turn left at an intersection with oncoming traffic, you should:",
        options: [
          "Turn the steering wheel left so you are ready to go quickly.",
          "Keep the wheels straight until you can complete the turn.",
          "Edge forward slowly into the intersection.",
        ],
        correctIndex: 1,
        explanation:
          "Keeping the wheels straight prevents your vehicle from being pushed into oncoming traffic if you are hit from behind. Turn the wheel only when you are actually making the turn.",
      },
      {
        question:
          "Unless signs say otherwise, a right turn should begin and end:",
        options: [
          "In the centre of the lane.",
          "Close to the right side of the road.",
          "In the left lane to allow room for the turn.",
        ],
        correctIndex: 1,
        explanation:
          "The MTO handbook states that you should always begin and end a right turn close to the right side of the road unless signs or pavement markings tell you not to.",
      },
    ],
  },
  "2": {
    goldenRule:
      "Never change lanes without signalling and checking that the move can be done safely. Use mirrors first, then your blind spot over your shoulder, and only then steer gradually into the new lane when the space is clear.",
    steps: [
      "Check your mirrors for a space in traffic where you can enter safely.",
      "Check your blind spot by looking over your shoulder in the direction of the lane change. Watch for bicycles and small vehicles.",
      "Signal that you want to move left or right.",
      "Check again that the way is clear (no one coming too fast from behind or from two lanes over on a multi-lane road).",
      "Steer gradually into the new lane. Keep the same speed or gently increase it; do not slow down suddenly.",
      "Avoid changing lanes in or near an intersection. Do not weave or make sudden lane changes.",
      "Never cut in front of another vehicle; other drivers expect you to yield when changing lanes.",
    ],
    examinerTips: [
      "Changing lanes without signalling or checking the blind spot—examiners watch for a clear shoulder check.",
      "Making sudden or hesitant lane changes; the move should be smooth and deliberate.",
      "Changing lanes in an intersection or over solid lines, which is illegal and dangerous.",
    ],
    quiz: [
      {
        question: "When changing lanes, you should:",
        options: [
          "Signal after you start moving into the lane.",
          "Signal, check mirrors and blind spot, then steer gradually into the new lane.",
          "Slow down so other drivers can make room.",
        ],
        correctIndex: 1,
        explanation:
          "You must signal first, then check mirrors and blind spot to ensure the way is clear, then steer gradually into the new lane. Maintain or gently increase speed; do not slow down.",
      },
      {
        question: "It is best to avoid changing lanes:",
        options: [
          "Only on highways.",
          "In or near an intersection.",
          "When traffic is moving slowly.",
        ],
        correctIndex: 1,
        explanation:
          "Do not change lanes in or near an intersection. Other drivers expect you to stay in your lane there, and lane changes in intersections are unsafe and can cost you points on the test.",
      },
    ],
  },
  "3": {
    goldenRule:
      "Before you move in reverse, make sure the path is clear behind you—watch especially for children and cyclists. Move slowly, and look over your shoulder in the direction you are backing.",
    steps: [
      "Before you begin, check that the way is clear behind you. Look for children and cyclists.",
      "Put the vehicle in reverse. Hold the steering wheel firmly.",
      "Turn your body and head to look over your shoulder in the direction you are moving—right shoulder if reversing straight back or to the right, left shoulder if reversing to the left.",
      "Always check the opposite shoulder as well. If turning while reversing, watch that the front of your vehicle does not hit anything.",
      "Move slowly. You may remove your seatbelt to turn and see properly when backing; buckle up again before moving forward.",
      "Never reverse on a divided road with a speed limit over 80 km/h (except to help someone in trouble).",
    ],
    examinerTips: [
      "Not looking over the correct shoulder or not turning the body enough to see clearly—examiners want to see a real look back.",
      "Reversing too quickly or without checking both shoulders and the front swing of the vehicle.",
      "Reversing on a high-speed divided highway, which is illegal in Ontario.",
    ],
    quiz: [
      {
        question: "When reversing straight back, you should look:",
        options: [
          "Only in the rear-view mirror.",
          "Over your shoulder in the direction you are moving.",
          "At the front of the vehicle.",
        ],
        correctIndex: 1,
        explanation:
          "You must turn your body and look over your shoulder in the direction you are moving (e.g. right shoulder when going straight back or right). Mirrors are not enough—you need to see your blind spots.",
      },
      {
        question: "Reversing on a divided highway with a speed limit over 80 km/h is:",
        options: [
          "Allowed if you signal.",
          "Illegal, except to help someone in trouble.",
          "Allowed only during the day.",
        ],
        correctIndex: 1,
        explanation:
          "It is illegal to drive in reverse on the travelled part or shoulder of a divided road with a speed limit over 80 km/h. The only exception is to help someone in trouble.",
      },
    ],
  },
  "4": {
    goldenRule:
      "For a U-turn or three-point turn, you must see at least 150 metres in both directions before you start. Never turn around on a curve, near a railway crossing, on a hilltop, or next to a bridge or tunnel that blocks your view.",
    steps: [
      "U-turn: Check that no sign prohibits it. You must be able to see at least 150 m in both directions. Never on a curve, near a railway, on a hilltop, or near a bridge or tunnel.",
      "U-turn: Signal right, check mirror and shoulder, pull over to the right and stop. Signal left, and when traffic is clear both ways, move forward and turn sharply into the opposite lane.",
      "Three-point turn: Use on narrow roads. Do not do it on a curve, near a railway, on a hilltop, or where view is blocked.",
      "Three-point turn: Start from the far right. Signal left. When clear both ways, move forward and turn the wheel sharply left toward the far curb. Stop at the left side of the road.",
      "Three-point turn: Shift to reverse, signal right. Check that the way is clear. Turn the wheel sharply right and back up slowly to the other side. Stop. Shift to drive, check traffic, and drive forward when clear.",
    ],
    examinerTips: [
      "Starting a three-point turn or U-turn where visibility is poor (curve, hill, railway)—examiners will fail you for unsafe location.",
      "Not signalling or not checking traffic in both directions before each movement during a three-point turn.",
      "Rushing the three-point turn; take time to check after each stop and signal correctly for the next move.",
    ],
    quiz: [
      {
        question: "Before making a U-turn, you must be able to see at least _____ in both directions.",
        options: [
          "50 metres.",
          "100 metres.",
          "150 metres.",
        ],
        correctIndex: 2,
        explanation:
          "The MTO handbook states you must never make a U-turn unless you can see at least 150 metres in both directions. This ensures you have time to complete the turn safely.",
      },
      {
        question: "When performing a three-point turn, after moving forward to the left side of the road you should:",
        options: [
          "Signal left and drive forward.",
          "Shift to reverse, signal right, check that the way is clear, then back up.",
          "Open the door to check for traffic.",
        ],
        correctIndex: 1,
        explanation:
          "After stopping at the left side, shift to reverse, signal right, check traffic in both directions, then turn the wheel right and back up slowly to the other side before driving forward.",
      },
    ],
  },
  "5": {
    goldenRule:
      "Park only where it is legal and safe—never on a curve or hill without 125 m visibility, and always set the parking brake and turn wheels toward or away from the curb on hills so the vehicle cannot roll into traffic.",
    steps: [
      "Parallel parking: Find a space about 1.5 times your vehicle length. Signal, check traffic, and pull alongside the vehicle in front of the space, about 1 m apart. Stop when your rear bumper lines up with theirs.",
      "Parallel: Reverse slowly, turning the wheel fully toward the curb. When you see the outside rear corner of the vehicle in front, straighten the wheels as you continue reversing. Turn the wheel fully toward the road to align with the curb. Move forward to straighten if needed.",
      "When parked: Set the parking brake, put the gear in Park (or first/reverse for manual). Turn off the engine and remove the key. Check for traffic before opening the door (Dutch reach: open with the hand away from the door to force a shoulder check).",
      "Hill—facing downhill: Turn the front wheels toward the curb so if the brakes fail, the vehicle rolls into the curb.",
      "Hill—facing uphill with a curb: Turn the wheels away from the curb (toward the road) so the tires catch the curb if the vehicle rolls back.",
      "Hill—facing uphill with no curb: Turn the wheels sharply to the right so if the vehicle rolls, it goes off the road, not into traffic.",
      "Never park within 9 m of an intersection (15 m if traffic lights), 3 m of a fire hydrant, or 15 m of a railway crossing. Never park on the travelled part of the road.",
      "Perpendicular or angle parking (e.g. in a lot): Signal, position your vehicle so you can enter the space in one smooth turn. Check mirrors and blind spots before reversing out.",
    ],
    examinerTips: [
      "Not setting the parking brake or not turning the wheels correctly on a hill—examiners often include hill parking on the G2 test.",
      "Opening the door without checking for cyclists (Dutch reach); or pulling out from a park without signalling and checking mirrors and blind spot.",
      "Parallel parking too far from the curb or hitting the curb repeatedly; take time to use reference points and small steering adjustments.",
    ],
    quiz: [
      {
        question: "When parking facing downhill, you should turn your front wheels:",
        options: [
          "Away from the curb.",
          "Toward the curb.",
          "Straight ahead.",
        ],
        correctIndex: 1,
        explanation:
          "When facing downhill, turn the wheels toward the curb so that if the brakes fail, the vehicle will roll into the curb and not into traffic.",
      },
      {
        question: "When parallel parking, you should set the parking brake and put the gear in Park:",
        options: [
          "Only on a hill.",
          "After you have fully parked and before turning off the engine.",
          "Only when leaving the vehicle for a long time.",
        ],
        correctIndex: 1,
        explanation:
          "Whenever you are properly parked, you should set the parking brake and put the gear selector in Park (or first/reverse for manual) before turning off the engine. This is required for safety.",
      },
    ],
  },
};
