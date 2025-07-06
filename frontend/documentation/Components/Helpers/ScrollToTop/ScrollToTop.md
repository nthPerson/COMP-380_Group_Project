# ScrollToTop Component Documentation

## Overview

A utility React component that manages scroll position during navigation in a React Router application. It ensures that users always start at the top of the page when navigating to new routes, providing a consistent and expected user experience.

## Purpose

This component solves the common issue where browsers remember scroll positions when users navigate between pages. Without this component, users might land in the middle of a page when navigating, which can be confusing and create a poor user experience.

## Core Functionality

### Automatic Scroll Reset
- Automatically scrolls to the top of the page on every route change
- Triggers on all navigation types (push, pop, replace)
- Uses React Router's location.key to detect navigation events

### Browser Scroll Restoration Override
- Disables the browser's built-in scroll restoration feature
- Takes manual control of scroll behavior across the application
- Prevents conflicts between browser and application scroll management

### Layout Effect Timing
- Uses useLayoutEffect for immediate execution before paint
- Ensures scroll happens before the user sees the new page content
- Provides smooth, imperceptible scroll resets

## Technical Implementation

### React Router Integration
- Monitors location changes using useLocation hook
- Responds to navigation events through location.key changes
- Works with all React Router navigation methods

### Browser API Interaction
- Modifies window.history.scrollRestoration to disable automatic behavior
- Uses window.scrollTo(0, 0) for precise top-of-page positioning
- Handles browser compatibility through feature detection

### Performance Considerations
- Renders nothing (returns null) to avoid DOM overhead
- Uses minimal React hooks for efficient operation
- Executes only when necessary (on navigation)

## Usage Pattern

This component is typically placed at the root level of a React Router application, allowing it to monitor all navigation events throughout the app. It operates silently in the background without any visible UI elements.

## User Experience Impact

Users experience consistent navigation behavior where every new page starts from the top, matching standard web expectations. This eliminates confusion that can occur when landing in the middle of long pages after navigation.