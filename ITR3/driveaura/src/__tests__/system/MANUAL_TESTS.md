# DriveAura — System & Acceptance Test Checklist
**ITR3 Manual System Tests**  
Tester: _______________  Date: _______________  Build: _______________

Mark each test **PASS ✅** or **FAIL ❌** after manually verifying in the browser.

---

## US-01 · Learning Modules (All Licence Levels)

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 1.1 | Navigate to `/modules` | Module hub page loads with G1/G2/G sections | |
| 1.2 | Click a G1 licence level | G1 module list appears | |
| 1.3 | Open a G1 module | Lesson sidebar and content area appear | |
| 1.4 | Click a lesson in the sidebar | Correct lesson content loads | |
| 1.5 | Click "Mark as complete" on a lesson | Button turns green; lesson is checked off | |
| 1.6 | Repeat for all G2 modules | All G2 modules load with content | |
| 1.7 | Repeat for all G modules | All G modules load with content | |

---

## US-02 · Quizzes inside Modules

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 2.1 | On last lesson of a module — click "Start quiz" without completing all lessons | "Finish your lessons first" modal appears | |
| 2.2 | Complete all lessons, then click "Start quiz" | "Before you start" confirmation modal appears | |
| 2.3 | Click "Back" on confirmation modal | Modal closes, stays on module page | |
| 2.4 | Click "Continue" on confirmation modal | Navigates to quiz page | |
| 2.5 | Navigate directly to `/quizzes/[id]` in the URL bar | Redirected to home page (entry gate) | |
| 2.6 | Answer all questions and submit | Results screen shows score and pass/fail | |
| 2.7 | Score < 70% | Shows "Not passed" + "Retake quiz" button | |
| 2.8 | Score ≥ 70% | Shows "Passed" + next module unlocks on level page | |
| 2.9 | Fail same quiz 3 times | Message: "your progress was reset" + must redo lessons | |

---

## US-03 · Data Visualization (Progress Insights)

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 3.1 | Navigate to `/data-visualization` | Page loads with Progress Insights header | |
| 3.2 | Check radial rings for G1/G2/G | Each ring shows correct % based on completed lessons | |
| 3.3 | Complete a lesson then refresh page | Lesson count and ring % update | |
| 3.4 | Check Quiz Performance table | All modules listed with correct pass/fail status | |
| 3.5 | Check Aura Points breakdown | Points split correctly into lessons/quizzes/mock grading | |
| 3.6 | Complete a readiness check then check history sparkline | New data point appears on graph | |

---

## US-04 · What To Do When an Accident Occurs

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 4.1 | Navigate to the accident module | Module loads with 6 lessons | |
| 4.2 | Open lesson "Stay Calm and Check for Injuries" | Content and bullet points display | |
| 4.3 | Open lesson "Report the Accident" | Note about $2000 threshold and Collision Reporting Centre appears | |
| 4.4 | Mark all lessons complete | "Start quiz" button appears | |

---

## US-05 · Strategies to Stay Calm (Drive Readiness Check)

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 5.1 | Navigate to `/readiness-check` | Intro screen loads | |
| 5.2 | Click "Start check-in" | First safety gate appears (alcohol/drugs) | |
| 5.3 | Answer "Yes" to any gate | Immediately goes to results with score = 0 and "Not safe to drive" | |
| 5.4 | Restart and answer "No" to all 4 gates | Moves to first readiness question | |
| 5.5 | Try to skip a question without answering | Cannot advance — must tap an option | |
| 5.6 | Answer all 5 questions with best options | Score = 100, "You look ready to drive" | |
| 5.7 | Answer all 5 questions with worst options | Score = 0, "Driving is not advised" | |
| 5.8 | Click "Save to account" (when signed in) | Success state shown; score appears in Progress Insights | |

---

## US-06 · Know Your Car (Vehicle Interior)

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 6.1 | Open the G2 Vehicle Interior Essentials module | Module loads with cabin/dashboard content | |
| 6.2 | Click hotspots on the instrument cluster image | Tooltip/popup appears with description | |
| 6.3 | Click hotspots on the center console image | Tooltip/popup appears with description | |

---

## US-07 · Checklist (Passenger Test Checklist)

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 7.1 | Navigate to `/test-checklist` | Checklist page loads with multiple sections | |
| 7.2 | Check several items | Items show as checked | |
| 7.3 | Progress indicator updates | Completion % or count reflects checked items | |

---

## US-08 · Locations of Driving Centres

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 8.1 | Navigate to `/test-centres` | Driving centres list or map loads | |
| 8.2 | Click a test centre | Details/map for that centre appears | |

---

## US-09 · User as Examiner

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 9.1 | Navigate to `/user-as-examiner` | Examiner scenarios list loads | |
| 9.2 | Open a scenario | Case study text and verdict options appear | |
| 9.3 | Select correct verdict | Feedback shown and Aura Points awarded | |
| 9.4 | Select incorrect verdict | No points awarded; explanation shown | |
| 9.5 | Same scenario correct verdict again | Points not awarded twice (idempotent) | |

---

## US-10 · Weather & Seasonal Hazard Training

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 10.1 | Navigate to `/weather-training` | Weather training page loads | |
| 10.2 | Select a weather condition | Relevant tips/content appear | |

---

## US-11 · Hazard Perception Training

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 11.1 | Navigate to `/hazard-perception-training` | Training page loads | |
| 11.2 | Start a scenario | Video/image and response options appear | |
| 11.3 | Click the correct hazard | Positive feedback shown | |

---

## US-12 · Log-in + Account Information

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 12.1 | Navigate to `/login` — sign up with new email | Account created; redirected to home | |
| 12.2 | Sign up without a username | Validation error: "Please enter a username" | |
| 12.3 | Sign up with mismatched passwords | Validation error: "Passwords do not match" | |
| 12.4 | Log in with valid credentials | Successfully signed in | |
| 12.5 | Log in with wrong password | Error message shown | |
| 12.6 | Navigate to `/account` when signed in | Account page shows display name and settings | |
| 12.7 | Sign out from account page | Redirected to login; protected routes blocked | |

---

## US-13 · Leaderboard

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 13.1 | Navigate to `/leaderboard` | Top 10 drivers shown with Aura Points | |
| 13.2 | Sign in and check leaderboard | Signed-in user highlighted with "You" badge | |
| 13.3 | Click "Refresh" | Updated data loads | |
| 13.4 | User outside top 10 | Own row appended below a "your position" divider | |

---

## US-14 · Aura Points

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 14.1 | Complete a lesson | Toast notification appears (+5 pts) | |
| 14.2 | Pass a quiz | Toast notification appears (+15 pts) | |
| 14.3 | Complete same lesson again | No toast; points not duplicated | |
| 14.4 | Check Progress Insights | Aura Points total and breakdown are correct | |
| 14.5 | Check Leaderboard after earning points | Points reflected in ranking | |

---

## US-15 · Manual Car Simulator

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 15.1 | Navigate to `/manual-shift` | Simulator loads with gear and RPM display | |
| 15.2 | Press shift-up key at correct RPM | Gear increases; clean shift feedback | |
| 15.3 | Shift at wrong RPM | Engine stall/warning feedback shown | |
| 15.4 | Complete a session | Aura Points awarded for clean shifts | |

---

## US-16 · Responsive Design

| # | Test | Expected Result | Result |
|---|------|-----------------|--------|
| 16.1 | Open app on mobile viewport (375 px) | Navigation and content stack correctly | |
| 16.2 | Open module page on tablet (768 px) | Sidebar and content display side by side | |
| 16.3 | Open leaderboard on mobile | Rankings list is readable and not clipped | |
| 16.4 | Open Progress Insights on mobile | Radial rings and table scroll or reflow cleanly | |

---

*All automated unit and integration tests must also pass (`npm test`) before sign-off.*
