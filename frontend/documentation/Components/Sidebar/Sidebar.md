# Sidebar.jsx

## Overview
This React component renders the **Sidebar** navigation menu for the RezuMe application. It provides responsive sidebar functionality for both mobile and desktop views, handles sidebar collapsing, includes a dropdown for the resume tailoring workflow, and displays navigation links to the main sections of the app. It also handles sign out functionality and manages sidebar behavior depending on screen size.

---

## How This Component Works
- Uses `window.innerWidth` and `resize` events to detect mobile or desktop views, adjusting sidebar state accordingly.
- Tracks sidebar state:
  - `isCollapsed`: controls if the sidebar is collapsed (desktop).
  - `isMobile`: determines if the sidebar is in mobile mode.
  - `isMobileOpen`: controls if the sidebar is open on mobile.
  - `dropdownOpen`: tracks if the "Tailor Resume" sub-menu dropdown is open.
- Updates `<body>` classes (`sidebar-open`, `sidebar-collapsed`) to adjust main layout margins on desktop.
- Closes the mobile sidebar automatically on resize to desktop.
- Allows toggling the sidebar and the dropdown sub-menu.
- Closes dropdown when clicking outside the dropdown area.
- Navigation links call `closeMobileSidebar()` when clicked on mobile to hide the sidebar.
- The **Logout** button triggers `handleSignOut()` which signs the user out and redirects to the home page.

---

## State Variables
- **isCollapsed**: whether the sidebar is collapsed on desktop.
- **isMobile**: whether the current screen is considered mobile (≤768px).
- **isMobileOpen**: whether the mobile sidebar is open.
- **dropdownOpen**: whether the Tailor Resume sub-menu dropdown is open.

---

## useEffect Hooks
1. **Handle screen resize**
   - Detects mobile vs. desktop view based on window width.
   - Updates `isMobile` state.
   - Closes the mobile sidebar when resizing to desktop.
2. **Initial sidebar state**
   - On mount, determines if the sidebar should be collapsed based on the initial screen width.
3. **Update body classes**
   - Adds or removes sidebar-related classes on `<body>` depending on sidebar and screen state.
4. **Close dropdown on outside click**
   - Listens for clicks outside of `.nav-item-with-dropdown` to automatically close the dropdown.

---

## Functions

### handleSignOut
- **Purpose**: Signs out the user by calling `handleSignout()` and navigates to the home page.
- **Side Effects**: Redirects the user after sign out.

### toggleSidebar
- **Purpose**: Toggles sidebar visibility:
  - On mobile: opens/closes mobile sidebar.
  - On desktop: collapses/expands sidebar.
  - Closes the dropdown when collapsing.
- **Side Effects**: Updates `isMobileOpen` or `isCollapsed` state.

### closeMobileSidebar
- **Purpose**: Closes the sidebar in mobile view.

### toggleDropdown
- **Purpose**: Toggles the Tailor Resume sub-menu dropdown.
- **Side Effects**: Updates `dropdownOpen` state.

### getSidebarClasses
- **Purpose**: Computes sidebar CSS classes based on current state.
- **Output**: String with classes `sidebar`, `mobile`, `mobile-open`, `collapsed` as appropriate.

---

## Rendered Elements

- **Mobile Overlay**
  - Covers the main content when the mobile sidebar is open, closes sidebar on click.

- **Mobile Menu Button**
  - Opens the sidebar on mobile.

- **Desktop Sidebar Toggle Button**
  - Collapses or expands the sidebar on desktop.

- **Sidebar Layout**
  - Header with RezuMe logo linking to `/landingPage`.
  - Navigation links:
    - **Welcome** (`/welcome`)
    - **Create Resume** (`/createResume`)
    - **Tailor Resume** dropdown:
      - Upload Resume (`/uploadResume`)
      - Add Job Description (`/addJobDescription`)
      - Select Keywords (`/selectKeywords`)
      - Generate & Edit Resume (`/generateEditResume`)
    - **Resume Archive** (`/resumeArchive`)
    - **Logout** (signs the user out)

- Each navigation link uses React Router’s `<Link>` (except Logout, which uses a `<button>`).

---

## Child Components Used
- None (Sidebar is a self-contained navigation component).

---

## External Dependencies
- **React**: state and lifecycle hooks.
- **firebase/auth**: used indirectly through `handleSignout()` for signing out.
- **react-router-dom**: `Link` for routing, `useNavigate` for programmatic navigation.
- **authHandlers.js**: `handleSignout()` function for signing out.
- **CSS**: Sidebar’s layout and styles rely on custom CSS classes (not shown in this file).
- **Image Assets**: various icons for navigation items.
