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

*Documented for QA coursework. Fixes are in the repository; verify on a current build with Firebase configured where applicable.*
