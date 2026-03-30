/**
 * vehicleHotspots.ts
 *
 * All hotspot position constants for the VehicleExplorer component.
 * centerX / centerY are percentages (0–100) of the image width/height.
 * size is a percentage of image width used as the circular hit-area diameter.
 *
 * Coordinates were measured against the source images:
 *   - car-instrument-cluster.png  (1200 × 800 px reference)
 *   - car-center-console.png      (1200 × 800 px reference)
 */

export interface InstrumentHotspot {
  id: string;
  label: string;
  centerX: number;
  centerY: number;
  size: number;
  title: string;
  bullets: string[];
}

export interface CenterConsoleHotspot {
  id: string;
  label: string;
  centerX: number;
  centerY: number;
  size: number;
  title: string;
  bullets: string[];
}

export const INSTRUMENT_HOTSPOTS: InstrumentHotspot[] = [
  {
    id: "left-gauge",
    label: "Left gauge (RPM, oil pressure, check engine)",
    centerX: 37,  // left cluster, horizontally ~37% from left edge
    centerY: 54,  // vertically centered on gauge face
    size: 8,
    title: "Left Gauge – RPM, Oil Pressure & Check Engine",
    bullets: [
      "Tachometer shows engine speed (RPM); avoid redlining to protect the engine.",
      "Red oil can light means low oil pressure—pull over safely and turn off the engine.",
      "Check Engine light indicates an emissions or engine fault; get the vehicle checked soon.",
    ],
  },
  {
    id: "center-gauge",
    label: "Speedometer",
    centerX: 50,  // center of the instrument cluster
    centerY: 52,
    size: 10,
    title: "Speedometer",
    bullets: [
      "Shows your current speed in km/h (and often mph); always stay within the posted limit.",
      "Use it to maintain a steady speed on highways and in school zones.",
    ],
  },
  {
    id: "right-gauge",
    label: "Right gauge (fuel, temp, battery, parking brake)",
    centerX: 63,  // right cluster, mirror of left-gauge
    centerY: 54,
    size: 8,
    title: "Right Gauge – Fuel, Temp, Battery & Parking Brake",
    bullets: [
      "Fuel gauge shows remaining fuel; temperature gauge should stay in the normal range.",
      "Red battery light means charging problem; red parking brake light means the brake is on.",
    ],
  },
  {
    id: "left-stalk",
    label: "Left stalk (turn signals, lights)",
    centerX: 22,  // steering column left stalk
    centerY: 74,  // below gauge cluster toward steering wheel
    size: 6,
    title: "Left Stalk – Turn Signals & Lights",
    bullets: [
      "Move the stalk up for right turn signal, down for left; cancel after the turn.",
      "Twist the end to turn on parking lights, headlights, and high beams as needed.",
    ],
  },
  {
    id: "right-stalk",
    label: "Right stalk (wipers)",
    centerX: 78,  // steering column right stalk
    centerY: 74,
    size: 6,
    title: "Right Stalk – Wipers",
    bullets: [
      "Use OFF, INT (intermittent), LO, and HI for front wipers in rain or snow.",
      "The end of the stalk often controls rear wiper and washer fluid.",
    ],
  },
];

export const CENTER_CONSOLE_HOTSPOTS: CenterConsoleHotspot[] = [
  {
    id: "hazard-lights",
    label: "Hazard Lights button",
    centerX: 51,  // center of the console, top section
    centerY: 28,
    size: 6,
    title: "Hazard Lights (Emergency Flashers)",
    bullets: [
      "Press the red triangle button to activate all four turn signals simultaneously.",
      "Use hazard lights when your vehicle is stopped on the roadside due to a breakdown or emergency.",
      "Hazard lights warn other drivers that your vehicle is a temporary obstacle—use them in heavy fog, rain, or when being towed.",
      "Do not use hazard lights while driving normally, as they disable your turn signals and can confuse other drivers.",
    ],
  },
  {
    id: "climate-control",
    label: "Climate Control Panel",
    centerX: 51,  // center of console, mid section
    centerY: 56,
    size: 20,
    title: "Climate Control Panel",
    bullets: [
      "The main dial controls temperature—turn clockwise for warmer air, counterclockwise for cooler air.",
      "Fan speed buttons adjust airflow intensity; higher speeds clear fog faster but create more noise.",
      "Mode buttons direct air to the windshield (defrost), dashboard vents, or footwells depending on your comfort needs.",
      "The A/C button activates air conditioning, which dehumidifies air and is essential for clearing foggy windows in humid conditions.",
      "Use recirculation mode in heavy traffic or polluted areas to prevent outside fumes from entering the cabin.",
    ],
  },
  {
    id: "defrost-controls",
    label: "Defrost Controls",
    centerX: 58,  // slightly right of center on HVAC panel
    centerY: 46,
    size: 8,
    title: "Defrost Controls",
    bullets: [
      "The front defrost button directs warm air to the windshield to melt ice and clear fog quickly.",
      "The rear defrost button activates heating elements embedded in the rear window to clear frost and condensation.",
      "Always clear all windows of ice and fog before driving—impaired visibility is a leading cause of winter accidents.",
      "Front defrost typically engages the A/C automatically to remove moisture more effectively.",
      "Rear defrost usually turns off automatically after 10–15 minutes to prevent overheating the elements.",
    ],
  },
  {
    id: "parking-brake",
    label: "Electronic Parking Brake",
    centerX: 54,  // lower section of center console
    centerY: 90,
    size: 8,
    title: "Electronic Parking Brake (EPB)",
    bullets: [
      "Pull up or press the switch to engage the parking brake; the red indicator light confirms it is active.",
      "The parking brake holds the vehicle stationary when parked, especially important on hills and slopes.",
      "Always engage the parking brake when parking, even on flat surfaces—it prevents rolling if the transmission slips.",
      "Some vehicles automatically engage the parking brake when you shift into Park and release it when you accelerate.",
      "If the red light flashes while driving, the parking brake system may have a fault—have it inspected immediately.",
    ],
  },
];
