/**
 * Ontario DriveTest centres in the Greater Toronto Area (GTA).
 * Data aligned with drivetest.ca / DriveTest centre directory.
 * Used by the Routes page for browse + detail (master-detail) layout.
 */

export type TestType = "G2" | "G";

export interface DrivingCentre {
  id: string;
  name: string;
  address: string;
  testType: TestType;
  /** Google Maps embed URL for the map section (iframe src). */
  mapEmbedUrl: string;
  /**
   * Optional: Google Maps directions URL for the G2 test route (start-to-finish).
   * When set, the G2 test route map shows this route; otherwise uses mapEmbedUrl.
   */
  mapEmbedUrlG2?: string;
  /**
   * Optional: Google Maps embed URL for the G test route map (e.g. directions).
   * When set, the G test route map uses this; otherwise uses mapEmbedUrl.
   */
  mapEmbedUrlG?: string;
  /** Key watch-outs / examiner expectations for this route. */
  checkpoints: string[];
}

export const drivingCentres: DrivingCentre[] = [
  {
    id: "downsview",
    name: "Toronto Downsview",
    address: "37 Carl Hall Rd, North York, ON M3K 2E2",
    testType: "G2",
    mapEmbedUrl:
      "https://www.google.com/maps?q=37+Carl+Hall+Rd,+North+York,+ON+M3K+2E2&output=embed",
    // G2 route from Kruzee: exit lot → Carl Hall → John Drury → Sheppard → loop (no highway) → Sheppard → John Drury → Carl Hall → lot
    mapEmbedUrlG2:
      "https://www.google.com/maps/dir/37+Carl+Hall+Rd,+North+York,+ON+M3K+2E2/John+Drury+Dr,+North+York,+ON/Sheppard+Ave+W,+North+York,+ON/Allen+Rd+%26+Sheppard+Ave+W,+North+York,+ON/Sheppard+Ave+W,+North+York,+ON/John+Drury+Dr,+North+York,+ON/37+Carl+Hall+Rd,+North+York,+ON+M3K+2E2?output=embed",
    mapEmbedUrlG:
      "https://www.google.com/maps/dir/37+Carl+Hall+Rd,+North+York,+ON+M3K+2E2/John+Drury+Dr,+North+York,+ON/Sheppard+Ave+W,+North+York,+ON/Allen+Rd,+North+York,+ON/Highway+401+West,+Toronto,+ON/Keele+St,+Toronto,+ON/Sheppard+Ave+W,+Toronto,+ON/John+Drury+Dr,+North+York,+ON/37+Carl+Hall+Rd,+North+York,+ON+M3K+2E2?output=embed",
    checkpoints: [
      "Difficult left turn at Keele St — watch for oncoming traffic and pedestrians.",
      "School zone on Toro Rd — reduce speed and scan for children.",
      "Parallel park on residential street — signal, check mirrors, smooth steering.",
      "Examiner expects full stops at stop signs and clear shoulder checks.",
    ],
  },
  {
    id: "metro-east",
    name: "Toronto Metro East",
    address: "1448 Lawrence Ave E #15, North York, ON M4A 2V6",
    testType: "G2",
    mapEmbedUrl:
      "https://www.google.com/maps?q=1448+Lawrence+Ave+E,+North+York,+ON+M4A+2V6&output=embed",
    checkpoints: [
      "Lawrence Ave E traffic — lane changes and speed consistency.",
      "Residential areas off Lawrence — school zones and stop signs.",
      "Three-point turn and parallel park in designated areas.",
      "Examiner watches for mirror and shoulder checks.",
    ],
  },
  {
    id: "port-union",
    name: "Toronto Port Union",
    address: "91 Rylander Blvd, Scarborough, ON M1B 5M5",
    testType: "G2",
    mapEmbedUrl:
      "https://www.google.com/maps?q=91+Rylander+Blvd,+Scarborough,+ON+M1B+5M5&output=embed",
    checkpoints: [
      "Rylander Blvd and Kingston Rd — left turns and merging.",
      "Port Union area residential — school zones and pedestrians.",
      "Parking and reversing — smooth control and observations.",
      "Examiner expects clear signals and lane discipline.",
    ],
  },
  {
    id: "etobicoke",
    name: "Toronto Etobicoke",
    address: "5555 Eglinton Ave W Unit E 120-124, Etobicoke, ON M9C 5M1",
    testType: "G2",
    mapEmbedUrl:
      "https://www.google.com/maps?q=5555+Eglinton+Ave+W,+Etobicoke,+ON+M9C+5M1&output=embed",
    checkpoints: [
      "Merge onto Eglinton Ave W — signal early and match traffic speed.",
      "Residential right turns — stay in lane and check blind spots.",
      "Three-point turn in quiet area — use signals and observe traffic.",
      "Examiner watches for smooth braking and proper lane discipline.",
    ],
  },
  {
    id: "brampton",
    name: "Brampton",
    address: "59 First Gulf Blvd, Unit 9, Brampton, ON L6W 4P9",
    testType: "G2",
    mapEmbedUrl:
      "https://www.google.com/maps?q=59+First+Gulf+Blvd,+Brampton,+ON+L6W+4P9&output=embed",
    checkpoints: [
      "First Gulf Blvd and surrounding industrial/residential mix.",
      "Highway 410 access — merge and lane change practice.",
      "Residential streets — full stops and school zones.",
      "Examiner expects confident handling of roundabouts if on route.",
    ],
  },
  {
    id: "mississauga",
    name: "Mississauga",
    address: "255 Longside Dr, Mississauga, ON L5W 1L8",
    testType: "G2",
    mapEmbedUrl:
      "https://www.google.com/maps?q=255+Longside+Drive,+Mississauga,+ON+L5W+1L8&output=embed",
    checkpoints: [
      "Longside Dr and Dixie Rd area — left turns and traffic flow.",
      "Highway 401 / 403 vicinity — merge and lane changes if on G route.",
      "Residential and commercial mix — speed and observation.",
      "Examiner expects proper right-of-way and shoulder checks.",
    ],
  },
];
