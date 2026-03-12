# Firebase — DriveAura

Everything Firebase-related lives in `src/lib/firebase/client.ts`. This file is the **single entry point** for the Firebase SDK across the whole app. Nothing else should call `initializeApp` or `getFirestore` directly.

---

## Table of Contents

1. [Project setup](#1-project-setup)
2. [Environment variables](#2-environment-variables)
3. [How the client initialises](#3-how-the-client-initialises)
4. [Authentication](#4-authentication)
5. [Firestore collections](#5-firestore-collections)
   - [userModuleProgress](#51-usermoduleprogress)
   - [userModules](#52-usermodules)
6. [Helper function reference](#6-helper-function-reference)
7. [Firestore security rules](#7-firestore-security-rules)
8. [Adding a new collection](#8-adding-a-new-collection)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Project setup

Firebase is already installed as a dependency (`firebase ^12`). No extra installation is needed.

To connect the app to a Firebase project you only need to fill in the environment variables below — the SDK initialises itself on the first call.

---

## 2. Environment variables

Create a file called `.env.local` in the project root (`ITR2/driveaura/.env.local`). **Never commit this file** — it contains secret API keys.

```env
# Required — the app will not initialise Firebase without these four
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional — safe to leave blank locally
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

You can find all values in the Firebase console under **Project settings → Your apps → SDK setup and configuration**.

> **Tip:** If `NEXT_PUBLIC_FIREBASE_API_KEY` is empty the client silently skips initialisation rather than crashing. This means Firebase-backed features are simply disabled — the app still runs with localStorage fallbacks.

---

## 3. How the client initialises

`client.ts` uses a **lazy singleton** pattern with three exported getters:

| Getter | Returns | Notes |
|---|---|---|
| `getFirebaseApp()` | `FirebaseApp \| null` | Returns `null` on the server (SSR) |
| `getFirebaseAuth()` | `Auth \| null` | Calls `getFirebaseApp()` internally |
| `getFirebaseDb()` | `Firestore \| null` | Calls `getFirebaseApp()` internally |

All three return `null` instead of throwing when Firebase is unconfigured or when called during SSR. Every helper function handles a `null` db gracefully (returns an empty value and exits early).

**Do not** call these getters at module top-level — only call them inside `async` functions or React effects, after the component has mounted.

---

## 4. Authentication

Firebase Authentication is fully wired up. The auth flow is handled by:

| File | Role |
|---|---|
| `src/components/auth/AuthProvider.tsx` | React context — wraps the whole app in `layout.tsx`; exposes `useAuth()` |
| `src/components/auth/RequireAuth.tsx` | Route guard — redirects unauthenticated users to `/login?next=<path>` |
| `src/app/login/LoginClient.tsx` | Sign-in UI — email/password + Google OAuth |

### Supported sign-in methods

- **Email/password** (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`)
- **Google OAuth** (`signInWithPopup` + `GoogleAuthProvider`)

### Using auth in a component

```tsx
import { useAuth } from "@/components/auth/AuthProvider";

export default function MyPage() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!user) return <p>Not signed in.</p>;

  return <p>Hello {user.email}</p>;
}
```

`user` is the Firebase `User` object from `firebase/auth`. The most useful fields are `user.uid` (the stable unique ID used as a Firestore key) and `user.email`.

### Protecting a page

Wrap the page content with `<RequireAuth>`:

```tsx
import RequireAuth from "@/components/auth/RequireAuth";

export default function AccountPage() {
  return (
    <RequireAuth>
      <p>Only visible when signed in.</p>
    </RequireAuth>
  );
}
```

---

## 5. Firestore collections

The app currently has two Firestore collections. Both use the **same document ID pattern**: `{userId}_{moduleId}` — this allows O(1) single-document reads without needing a query.

### 5.1 `userModuleProgress`

Tracks which individual **lessons** inside a module a user has completed. This is the fine-grained, lesson-level store.

#### Document ID
`{userId}_{moduleId}` e.g. `abc123_g1-signs-signals-markings`

#### Schema

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | Firebase Auth UID |
| `moduleId` | `string` | Module ID from `src/app/modules/data.ts` |
| `completedLessons` | `string[]` | Array of lesson IDs the user has completed |
| `updatedAt` | `Timestamp` | Server-side timestamp of the last write |

#### Example document

```json
{
  "userId": "abc123",
  "moduleId": "g1-signs-signals-markings",
  "completedLessons": ["1", "2", "3"],
  "updatedAt": "2026-03-11T12:00:00Z"
}
```

---

### 5.2 `userModules`

Tracks each user's **module-level status** — whether they have started, are in progress, or have fully completed a module. This is the coarse-grained, module-level store.

#### Document ID
`{userId}_{moduleId}` e.g. `abc123_g1-signs-signals-markings`

#### Schema

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | Firebase Auth UID |
| `moduleId` | `string` | Module ID from `src/app/modules/data.ts` |
| `status` | `"not_started" \| "in_progress" \| "completed"` | Overall module status |
| `progressPercent` | `number` | 0–100, computed from completed lessons / total lessons |
| `startedAt` | `Timestamp` | Set on first write; never overwritten after that |
| `completedAt` | `Timestamp \| null` | Set when `status` becomes `"completed"`; `null` otherwise |
| `updatedAt` | `Timestamp` | Server-side timestamp of the last write |

#### Example document

```json
{
  "userId": "abc123",
  "moduleId": "g1-signs-signals-markings",
  "status": "in_progress",
  "progressPercent": 60,
  "startedAt": "2026-03-10T09:00:00Z",
  "completedAt": null,
  "updatedAt": "2026-03-11T12:00:00Z"
}
```

#### Status transitions

```
not_started  →  in_progress  →  completed
```

- A document is created with `"not_started"` the first time a user opens a module (if they have zero completed lessons) or `"in_progress"` if they already have some.
- It transitions to `"completed"` and stamps `completedAt` when `completedLessons.length >= totalLessons` for that module.

#### Where status is written

Status is written from two places in `src/app/modules/[moduleId]/page.tsx`:

1. **On page load** — inside the `syncProgress` effect, after merging local + remote lesson progress.
2. **On "Mark as complete" button click** — alongside the lesson-level save.

---

## 6. Helper function reference

All helpers are exported from `src/lib/firebase/client.ts`.

### Auth helpers

| Export | Signature | Description |
|---|---|---|
| `getFirebaseAuth` | `() => Auth \| null` | Returns the singleton Auth instance |
| `googleProvider` | `GoogleAuthProvider` | Pre-configured Google provider for `signInWithPopup` |

### `userModuleProgress` helpers

| Export | Signature | Description |
|---|---|---|
| `fetchUserModuleProgress` | `(userId, moduleId) => Promise<string[]>` | Returns the array of completed lesson IDs; `[]` if no doc exists |
| `saveUserModuleProgress` | `({ userId, moduleId, completedLessons }) => Promise<void>` | Merges (upserts) completed lessons into the doc |

### `userModules` helpers

| Export | Signature | Description |
|---|---|---|
| `fetchUserModuleStatus` | `(userId, moduleId) => Promise<UserModuleSummary \| null>` | Returns `{ moduleId, status, progressPercent }` or `null` |
| `saveUserModuleStatus` | `({ userId, moduleId, status, progressPercent, markCompleted? }) => Promise<void>` | Creates or updates a module status doc |
| `fetchAllUserModules` | `(userId) => Promise<UserModuleSummary[]>` | Returns status summaries for every module the user has interacted with |

#### `UserModuleSummary` type

```ts
type UserModuleSummary = {
  moduleId: string;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
};
```

#### `UserModuleStatus` type

Defined in `src/lib/core/types.ts` and imported by `client.ts`:

```ts
export type UserModuleStatus = "not_started" | "in_progress" | "completed";
```

---

## 7. Firestore security rules

Paste these rules into the **Rules** tab of your Firestore database in the Firebase console. They ensure users can only read and write their own data.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Lesson-level progress — each user owns their own docs
    match /userModuleProgress/{docId} {
      allow read, write: if
        request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    // Module-level status — each user owns their own docs
    match /userModules/{docId} {
      allow read, write: if
        request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

> **Note:** `request.resource.data` refers to the incoming data on write. For reads, use `resource.data` instead if you need field-level checks. Adjust the rules to add admin roles or instructor access as the project grows.

---

## 8. Adding a new collection

Follow this checklist when adding a new Firestore collection:

1. **Define the TypeScript type** for the document shape at the top of `client.ts` (or in `src/lib/core/types.ts` if it is a domain concept shared across the app).

2. **Write helper functions** in `client.ts` — one to read, one to write. Follow the existing pattern:
   - Get `db` from `getFirebaseDb()`; return early if `null`.
   - Build the `doc()` ref using the collection name and a deterministic document ID.
   - Use `setDoc(..., { merge: true })` for upserts so partial updates are safe.
   - Use `serverTimestamp()` for any timestamp fields.

3. **Add security rules** for the new collection in the Firebase console.

4. **Update this README** — add a section under [Firestore collections](#5-firestore-collections).

**Minimal example:**

```ts
// client.ts

type MyRecord = { userId: string; value: string };

export async function saveMyRecord(userId: string, value: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const ref = doc(db, "myCollection", userId);
  await setDoc(ref, { userId, value, updatedAt: serverTimestamp() }, { merge: true });
}
```

---

## 9. Troubleshooting

### "Cloud sync failed. Check Firebase rules and try again."

This error appears in the module reader when a Firestore write is rejected. The most common causes:

- The security rules haven't been deployed yet — open the Firebase console → Firestore → Rules and publish the rules from [section 7](#7-firestore-security-rules).
- The user is not authenticated — the write is gated on `request.auth != null`.
- The `.env.local` values are wrong or missing — check the browser console for a Firebase initialisation error.

### Firebase is not initialising

- Make sure `.env.local` exists in `ITR2/driveaura/` (not the repo root).
- Make sure the file is named exactly `.env.local` (not `.env` or `.env.local.example`).
- Restart the dev server after creating or editing `.env.local` — Next.js does not hot-reload env files.

### Getting `null` from `getFirebaseDb()` in a server component

The client is intentionally disabled on the server (SSR). All Firestore reads and writes must happen inside:
- `useEffect` hooks
- `onClick` / event handlers
- Server Actions marked `"use client"`

Never call `getFirebaseDb()` at the top level of a file or inside a React Server Component.
