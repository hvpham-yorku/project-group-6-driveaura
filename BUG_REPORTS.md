# Bug reports — Activity 2 QA (DriveAura)

---

## Bug 1: Manual Shift sessions save to database but do not appear in dashboard

**Summary**  
Manual Shift Trainer lets signed-in users save a session to Firebase (`users/{userId}/manualShiftSessions`), but the Account page only loaded readiness check history. Saved trainer sessions were never queried or shown.

**Steps to reproduce**  
1. Sign in.  
2. Open Manual Shift Trainer, finish a session, tap **Save to account** on the results screen.  
3. Open **Account** (`/account`).  

**Expected result**  
The saved Manual Shift session should show up somewhere on the account/dashboard (e.g. a history list).

**Actual result**  
Only “Drive readiness history” appeared. Manual Shift saves were not listed.

**Severity**  
Medium — data was stored, but users could not confirm or review trainer sessions in the app.

**Status:** Fixed  

*(Implementation: fetch from the same Firestore subcollection used on save, and render a “Manual Shift Trainer history” section on the Account page.)*

---

## Bug 2: Manual Shift speed decreases while throttle is held at top speed

**Summary**  
With **Space** (accelerate) held, speed slowly dropped after reaching the maximum (220 km/h), instead of staying steady at the limit.

**Steps to reproduce**  
1. Open Manual Shift Trainer (e.g. Free Drive or Highway).  
2. Shift to top gear and hold **Space** until the speedometer reaches **220 km/h**.  
3. Keep **Space** held for several seconds.  

**Expected result**  
Speed stays at the top limit while accelerate is held (steady cruise at the cap).

**Actual result**  
Speed crept downward even though throttle stayed pressed.

**Severity**  
Low–Medium — affects realism and testing of “flat out” behaviour; gameplay is still usable.

**Status:** Fixed  

*(Implementation: rolling-resistance was applied every frame; at max speed the throttle term could not offset drag. Rolling drag is skipped when throttle is held at the speed cap with clutch up and no brake.)*

---

## Bug 3: Vehicle Explorer module skips normal lesson flow and quiz path was missing

**Summary**  
The module `g2-vehicle-interior-essentials` used a dedicated full-page early return (Vehicle Explorer only). That skipped the normal lesson sidebar, mark-as-complete flow, and quiz flow. There was also no matching quiz in the app data, so `/quizzes/g2-vehicle-interior-essentials` showed “Quiz not found.”

**Steps to reproduce**  
1. Open **Learning Modules** and go to **G2 Vehicle Interior Essentials** (`/modules/g2-vehicle-interior-essentials`).  
2. Notice the layout compared to other modules (sidebar / completion / quiz).  
3. Visit `/quizzes/g2-vehicle-interior-essentials` directly.  

**Expected result**  
Same lesson experience as other modules (sidebar, completion, path to quiz), and the quiz page loads a quiz for that module.

**Actual result**  
The module jumped straight to a standalone Vehicle Explorer page without the usual module UI. The quiz URL returned “Quiz not found.”

**Severity**  
Medium — learners could not complete or quiz this module like the rest of Phase 1.

**Status:** Fixed  

*(Implementation: render `VehicleExplorer` inside the normal lesson body instead of an early return, and add a `QUIZZES` entry for `g2-vehicle-interior-essentials`.)*

---

## Bug 4: Invalid Learning Modules level URLs silently showed G1 modules

**Summary**  
URLs like `/modules/level/g2` or `/modules/level/G22` did not match a real level but the app fell back to **G1**, so users saw the wrong module list without knowing the URL was invalid.

**Steps to reproduce**  
1. In the browser, go to `/modules/level/g2` (lowercase) or `/modules/level/G22`.  
2. Compare what you see to `/modules/level/G2` or `/modules/level/G1`.  

**Expected result**  
An explicit message that the level is invalid, plus a way to get back to the modules pathway (e.g. `/modules`).

**Actual result**  
The page showed **G1** modules as if the URL were valid.

**Severity**  
Low–Medium — confusing and misleading when sharing or mistyping level links.

**Status:** Fixed  

*(Implementation: only treat `G1`, `G2`, and `G` as valid path segments; otherwise show a “Level not found” message with links back to `/modules`.)*

---

*Documented for QA coursework. Fixes are in the repository; verify on a current build with Firebase configured where applicable.*
