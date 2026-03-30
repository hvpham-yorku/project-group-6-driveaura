# DriveAura Refactoring Document

## Overview

This document analyzes major design-level refactorings visible in the `ITR3` DriveAura codebase. DriveAura is a web-based learning platform for Canadian driving tests built with Next.js and Firebase, with features such as learning modules, quizzes, readiness checks, manual-shift training, aura-point gamification, user accounts, and test-centre exploration.

The purpose of this document is not to list cosmetic cleanups or small code edits. Instead, it focuses on structural improvements that meaningfully changed the architecture of the system, reduced coupling, improved maintainability, or introduced clearer separation of concerns. The codebase was reviewed across the main application folders, especially:

- `src/app`
- `src/components`
- `src/lib/firebase`
- `src/lib/readiness`
- `src/data`

The three refactorings below were selected because they are substantial, visible in the current codebase, and aligned with common software engineering design principles discussed in EECS 2311, such as separation of concerns, reduction of duplication, and replacement of weak ad hoc structures with stronger abstractions.

## 1. Decoupling UI Components from Firebase Access

**The Problem (Code Smell/Design Issue):**  
In a Firebase-based application, a common design mistake is to let pages and components talk directly to Firebase APIs. If every feature page performs its own `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, or authentication logic, then backend details leak into the UI layer. This creates tight coupling between presentation and persistence. It also causes duplication because every page has to remember how documents are structured, which collection path to use, how to handle null Firebase state, how to guard browser-only initialization, and how to perform defensive data conversion after reads.

That style of code becomes particularly problematic in a system like DriveAura because many features depend on user state and stored progress. Module completion, readiness history, manual-shift session history, aura points, analytics, and login state all require persistence. If each page owned its own Firebase access details, the application would quickly become fragile. A small backend change, such as renaming a collection or changing how a document is stored, would force edits across many UI files. Testing would also become harder because page components would be responsible for both rendering and infrastructure concerns.

This smell is especially important in this project because DriveAura is not a one-page toy application. It is a multi-feature product with several user-facing flows. Without a boundary between UI code and Firebase code, the system would be much harder to evolve after customer feedback or iteration changes.

Codebase evidence of the problem being addressed includes the fact that multiple features need persistence:

- module progress sync
- aura point sync
- readiness check history
- manual-shift session history
- authentication state
- analytics logging

These are all backend-facing responsibilities and should not be scattered inside unrelated UI components.

**The Refactoring Applied:**  
Extract Service Layer / Separate Presentation from Infrastructure.

This refactoring was applied by moving Firebase initialization, access, and persistence rules into dedicated helper modules under `src/lib/firebase`, while cross-cutting authentication state was moved into a shared provider component.

Instead of allowing each feature to build Firebase queries directly inside its own page, the system now exposes focused operations such as:

- `getFirebaseApp()`
- `getFirebaseAuth()`
- `getFirebaseDb()`
- `fetchUserModuleProgress()`
- `saveUserModuleProgress()`
- `fetchUserAuraPoints()`
- `saveUserAuraPoints()`
- `saveReadinessCheck()`
- `fetchReadinessHistory()`
- `saveManualShiftSession()`
- `fetchManualShiftHistory()`
- `logAnalyticsEvent()`

This is a classic architectural refactoring because it creates a boundary between infrastructure and presentation. The UI no longer needs to know how Firebase is configured internally, which collection path is used, or how defensive type narrowing is done after a Firestore read.

**The Solution:**  
The current DriveAura codebase centralizes Firebase logic in these files:

- `src/lib/firebase/client.ts`
- `src/lib/firebase/auraPoints.ts`
- `src/lib/firebase/readiness.ts`
- `src/lib/firebase/manualShift.ts`
- `src/lib/firebase/analytics.ts`
- `src/components/auth/AuthProvider.tsx`

This refactoring significantly improves the design in several ways.

First, it reduces coupling. The page `src/app/readiness-check/ReadinessCheckClient.tsx` no longer constructs Firestore subcollection paths itself; instead, it simply calls `saveReadinessCheck(...)`. Similarly, the account page does not build query logic by hand for user history; it calls `fetchReadinessHistory(...)` and `fetchManualShiftHistory(...)`. The module page uses `fetchUserModuleProgress(...)` and `saveUserModuleProgress(...)` rather than embedding all Firestore access details directly into lesson UI code.

Second, it localizes change. If the team later decides to change where module progress is stored, or if customer feedback requires more metadata to be stored with a readiness check, the update can be made in the Firebase service layer rather than in every feature component. That makes iteration changes much safer and faster.

Third, it improves readability. A UI page should primarily describe user interaction, rendering, and page flow. Backend storage details are conceptually different responsibilities. By extracting them, the remaining page code is easier to reason about.

Fourth, it makes testing and maintenance more realistic. Even if some UI files are still large, there is now a clear seam where persistence can be mocked, wrapped, or replaced later. This is much stronger than a design in which Firebase calls are hard-coded throughout the app.

Finally, the presence of `AuthProvider` is important because it turns authentication into a shared application concern rather than something every page must manage independently. That is a design improvement at the application level, not just a local cleanup.

Overall, this refactoring matters because it moves DriveAura away from a page-centric, tightly coupled implementation and toward a more layered architecture. In a project of this size, that is a major design improvement rather than a trivial cleanup.

## 2. Extracting Readiness Scoring Rules out of the UI

**The Problem (Code Smell/Design Issue):**  
The readiness-check feature is one of the more complex features in DriveAura. It is not a static page; it contains multiple steps, temporary user state, gate-stop logic, score calculation, recommendations, persistence, analytics, and several UI widgets. In a design like this, a major risk is the “God component” problem: one very large UI file becomes responsible for rendering, state management, domain rules, and scoring calculations all at once.

If the scoring rules had remained embedded inside the page component, the UI would have been responsible for at least four separate concerns:

- rendering screens and controls
- managing step-by-step interaction state
- representing assessment questions and answer weights
- computing the final readiness result and classification

That would be a poor design because the business rules of the readiness assessment are conceptually independent from the page layout. The scoring logic is domain logic. The visual stepper, buttons, and recommendation cards are presentation logic. When both are fused together, the code becomes harder to understand, harder to debug, and harder to change without unintended side effects.

This is especially risky in an iterative student project where customer feedback may change the meaning of the score, the weighting of questions, or the categories used to communicate the result. If those rules are buried inside a long UI file, every rules update becomes more expensive and more error-prone.

**The Refactoring Applied:**  
Extract Function / Move Business Logic to a Dedicated Domain Module.

The readiness assessment rules were extracted into a separate module, `src/lib/readiness/scoring.ts`. This module now contains:

- the `GateStopId` type
- the `ReadinessQuestion` type
- the `readinessQuestions` data structure
- the `computeReadinessScore()` function
- the `scoreLabel()` function

This is a meaningful refactoring because it separates decision-making logic from screen rendering. The page component still orchestrates the user flow, but the actual scoring model is now owned by a dedicated module with a clear purpose.

This is not just “moving lines into another file.” The extracted module forms a domain boundary. The questions, weights, score normalization, and readiness labels are now part of a reusable rules engine for this feature. In other words, the refactoring improves the design because it identifies the true domain concept inside the feature and gives it an explicit home.

**The Solution:**  
The current structure makes the feature substantially cleaner. `src/app/readiness-check/ReadinessCheckClient.tsx` imports `readinessQuestions`, `computeReadinessScore()`, and `scoreLabel()` from `src/lib/readiness/scoring.ts` and uses them as dependencies rather than re-implementing them inline.

This improves the design in several important ways.

First, it improves cohesion. The scoring file is now responsible for one concept only: how a user’s answers become a readiness score and how that score is interpreted. The UI file is still large, but its responsibility is now more focused on flow, interaction, and presentation.

Second, it improves changeability. If the team wants to update question weights, adjust the threshold for “Safe to drive,” or add new readiness prompts based on customer feedback, those changes can be made in a single domain file. The risk of accidentally breaking UI behavior while editing scoring rules is reduced.

Third, it improves consistency. Because the scoring logic is centralized, the application does not risk having multiple different score formulas in different parts of the code. A dedicated scoring module becomes the single source of truth for this feature.

Fourth, it creates an obvious candidate for targeted tests. Business rules are easier to test when they are written as plain functions instead of being buried inside React rendering logic. Even beyond the current state of testing, the design now supports much better future testability.

Fifth, it better reflects the real structure of the product. The readiness-check feature is not merely a page; it is a mini-domain within the system. Extracting a scoring module acknowledges that fact architecturally.

This refactoring is therefore a significant design improvement because it reduces mixed responsibilities, improves maintainability, and makes the core logic of the feature explicit.

## 3. Replacing Page-Local Primitive Data with a Shared Domain Model for Test Centres

**The Problem (Code Smell/Design Issue):**  
Another important structural improvement appears in the test-centres feature. An older version of the feature exists in `src/app/test-centres/page 2.tsx`, where centre information is defined as a page-local constant called `TEST_CENTRES`. In that older design, the page owns the data, the UI rendering, the route-type toggle state, and the interaction flow all in one place.

That older structure has several design problems.

First, it is a form of primitive obsession. The feature relies on loosely structured raw objects defined directly in the page. At that stage, the data model is minimal and informal. A location is essentially just a few fields placed into an array near the UI code. That might be acceptable in a temporary prototype, but it becomes weak once the feature needs to support richer information such as map URLs, checkpoint lists, route variations, and reusable detail views.

Second, it creates duplication risk. When data lives inside a page, the page becomes the only place that knows how the feature’s domain objects are shaped. If another component needs the same information, developers are tempted to duplicate the structure rather than share it properly.

Third, it creates a monolithic feature page. The older page is not just rendering data. It also acts as the storage location for domain information. That makes the file less reusable and less maintainable.

Fourth, it limits extensibility. DriveAura’s test-centre feature clearly grew from a simple list into a more detailed experience with maps and watch-out information. A page-local constant is not a scalable foundation for that growth.

**The Refactoring Applied:**  
Introduce Explicit Domain Type + Extract Shared Data Source + Split Monolithic Page into Reusable Components.

This refactoring is visible in the current implementation through three design changes applied together:

1. a dedicated `DrivingCentre` interface was introduced in `src/data/drivingCentres.ts`
2. the list of centres was extracted into a shared `drivingCentres` dataset
3. the feature page was broken into focused reusable UI components such as `CentreCard` and `TestCentreDetails`

This is a strong refactoring because it upgrades the feature from “page with inline data” to “feature backed by a reusable domain model.” The design now has an explicit vocabulary for the concept of a driving test centre and a reusable representation of that concept across the feature.

**The Solution:**  
The current implementation is much more modular and expressive.

The file `src/data/drivingCentres.ts` defines the `DrivingCentre` interface, which includes fields such as:

- `id`
- `name`
- `address`
- `testType`
- `mapEmbedUrl`
- `mapEmbedUrlG2`
- `mapEmbedUrlG`
- `checkpoints`

That change alone is significant because it replaces a weak, page-local, ad hoc data structure with an explicit domain model. The application now communicates intent more clearly. A `DrivingCentre` is no longer just “whatever object happened to be in a local array”; it is a recognized domain entity with a stable structure.

The page `src/app/test-centres/page.tsx` is now mainly responsible for feature orchestration: maintaining selection state, applying search filtering, and deciding which centre is currently active. The detailed rendering of an individual centre is delegated to `src/components/test-centres/CentreCard.tsx` and `src/components/test-centres/TestCentreDetails.tsx`.

This has several architectural benefits.

First, it improves reuse. The same `DrivingCentre` type can be used by multiple components without redefining structure or guessing what fields exist.

Second, it improves maintainability. Adding a new centre or enriching centre metadata now happens in one shared data source rather than inside a page implementation.

Third, it improves cohesion. Each component now has a narrower job:

- the page coordinates state and composition
- `CentreCard` renders one selectable list item
- `TestCentreDetails` renders the map and detail area
- `drivingCentres.ts` owns the domain data and shape

Fourth, it makes future feature growth more realistic. If the team later adds centre difficulty ratings, route warnings, nearby landmarks, or test-type-specific preparation notes, those changes have a natural architectural place to live.

Fifth, it reduces the likelihood of inconsistencies. A shared type and shared dataset make it harder for different parts of the feature to drift apart.

This is therefore a significant design improvement because it replaces primitive, page-bound data handling with a proper domain model and modular component-based structure.

## Why These Refactorings Matter

These refactorings are important not only because they improve code organization, but because they directly support the goals of iterative software development.

- They make the system easier to adapt after customer interviews and requirement changes.
- They reduce the risk that one feature change accidentally breaks another part of the product.
- They support cleaner package structure and better separation between UI, domain logic, and infrastructure.
- They make the project look more like a real multi-layered application and less like a collection of isolated pages.
- They address design smells that are explicitly relevant to the course rubric, especially tight coupling, mixed responsibilities, duplication, and overgrown UI files.

## Conclusion

The DriveAura ITR3 codebase shows clear evidence of meaningful design-level refactoring. The most important improvements are the extraction of Firebase access into service-like modules, the separation of readiness scoring rules from the readiness UI, and the evolution of the test-centres feature from page-local primitive data into a shared domain model with reusable components.

These are strong refactorings because they are architectural rather than cosmetic. They improve separation of concerns, reduce duplication, strengthen the domain model, and make the project easier to maintain and extend. For a software engineering project, these are exactly the kinds of improvements that demonstrate thoughtful design rather than just feature accumulation.
