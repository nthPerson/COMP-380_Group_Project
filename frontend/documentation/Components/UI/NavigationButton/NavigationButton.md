# NavigationButton.jsx

## Overview
This React component renders a **reusable navigation button** built on top of React Router’s `<Link>`. It provides consistent styling and built-in support for disabled states, enabling or disabling navigation links in a uniform way throughout the app.

---

## Props

### to
- **Type**: string (required)
- **Description**: Destination route path for the link. When `disabled` is `true`, the component renders `"#"` instead of navigating.

### children
- **Type**: React node (required)
- **Description**: Content to render inside the button, typically text like “Next” or “Continue”.

### disabled
- **Type**: boolean (optional, default: `false`)
- **Description**: If `true`, the button appears visually disabled, navigation is prevented, and it becomes inaccessible to keyboard navigation.

---

## Rendered Elements

- **Link**
  - `<Link>` from `react-router-dom`:
    - `to`: uses `"#"` if `disabled` is true, otherwise the provided `to` prop.
    - `className`: always includes `navigation-button`, and adds `disabled` if the button is disabled.
    - `aria-disabled`: indicates the disabled state for accessibility.
    - `tabIndex`: set to `-1` if disabled so it is skipped by keyboard navigation.

---

## Accessibility
- **aria-disabled** attribute informs screen readers that the button is disabled.
- **tabIndex** prevents focus on disabled buttons.

---

## External Dependencies
- **React**: for component rendering.
- **react-router-dom**: `Link` component for navigation.
- **CSS**: `NavigationButton.css` for consistent button styling.
