# App.js

## Overview

Root React component that sets up **global providers, page animations, and client-side routing** for the RezuMe web app.

* Initializes the **AOS** animation library once.
* Conditionally renders a global `<Header>` (avatar / nav widget) based on current route.
* Wraps the app with context providers: `PdfProvider` and `TargetedResumeProvider`.
* Defines all top-level routes via **React Router v6** (`<Routes>` / `<Route>`).
* Redirects any unknown path to `/signup`.

---

## How It Works

1. **AOS setup** – `useEffect` runs `AOS.init({ duration: 700 })` on mount.
2. **Header visibility** – `hideHeaderOn` array lists routes that suppress the `<Header>` component.
3. **Context layering** – Providers supply PDF state and targeted-resume state to all pages.
4. **Routing** – Each URL path renders a corresponding page component (see table below).
5. **Wildcard redirect** – `path="*"` ⟶ `<Navigate to="/signup" replace />`.

---

## Routes

| Path                  | Element (Page)          | Notes                               |
| --------------------- | ----------------------- | ----------------------------------- |
| `/`                   | `LandingPage`           | Marketing splash                    |
| `/signup`             | `LoginSignup`           | Sign-up form (plus switch to login) |
| `/login`              | `LoginOnly`             | Credentials only                    |
| `/home`               | `UploadResume`          | Initial dashboard after login       |
| `/landingPage`        | `LandingPage`           | Legacy alias                        |
| `/welcome`            | `WelcomeInstructions`   | Onboarding flow                     |
| `/userProfile`        | `UserProfile`           | Profile & settings                  |
| `/uploadResume`       | `UploadResume`          | Step 1 of Tailor workflow           |
| `/addJobDescription`  | `AddJd`                 | Step 2                              |
| `/selectKeywords`     | `SelectKeywords`        | Step 3                              |
| `/generateEditResume` | `GenerateAndEditResume` | Step 4 (editor)                     |
| `/resumeArchive`      | `ResumeArchive`         | Library of uploaded/generated PDFs  |
| `/createResume`       | `ResumeBuilderForm`     | Stand-alone résumé builder          |
| `*` (wildcard)        | Redirect ➜ `/signup`    | Catch-all                           |

---

## Usage Example (Embedding in `index.js`)

```jsx
import React        from "react";
import ReactDOM     from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App          from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

## External Dependencies

* **react-router-dom** – `Routes`, `Route`, `Navigate`, `useLocation`
* **aos** – Scroll/animation library (`AOS.init`)
* Custom context providers: `PdfProvider`, `TargetedResumeProvider`
* Page & helper components (imported from `./Components/**`)

---
