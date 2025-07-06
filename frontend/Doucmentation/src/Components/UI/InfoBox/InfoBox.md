# InfoBox.jsx

## Overview
This React component renders a **styled informational box** that displays a title (optional) and a list of items. It is used throughout the app to present guidance, instructions, or tips in a visually consistent format. The component accepts `title` and `items` as props and outputs them in a CSS-styled container.

---

## Props

### title
- **Type**: string (optional)
- **Description**: If provided, will render as the heading at the top of the info box using an `<h2>` element.

### items
- **Type**: array of React nodes (required)
- **Description**: An array of items to display as bullet points inside the info box. Each item is rendered as a list element.

---

## Rendered Elements

- **Container**
  - `<div className="info-box">`: root container for styling.
- **Title (optional)**
  - Renders `<h2>` if `title` prop is provided.
- **Items List**
  - `<ul>` with one `<li>` per entry in the `items` array.
  - Each list item uses `className="info-box__item"` for consistent styling.

---

## External Dependencies
- **React**: for functional component and rendering.
- **CSS**: `InfoBox.css` for styling the component layout and appearance.
