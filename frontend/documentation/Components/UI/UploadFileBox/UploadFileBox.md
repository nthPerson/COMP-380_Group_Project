# UploadFileButton.jsx

## Overview
This React component provides a **reusable file upload interface** with both drag-and-drop and traditional file selection capabilities. It enables uploading a single file of any type (default) or specific accepted types, displays the selected file’s name, and includes an “Upload” button that calls a callback prop with the chosen file.

---

## Props

### onUpload
- **Type**: function (required)
- **Description**: Callback executed when the user clicks the Upload button. Receives the selected file as its argument.

### accept
- **Type**: string (optional, default: `"*"`)
- **Description**: Specifies the accepted file types for the file input element. Example: `"application/pdf"`.

---

## State Variables

- **file**: stores the currently selected file object.
- **highlight**: boolean indicating whether the drop zone is currently being hovered by a dragged file.

---

## Refs

- **inputRef**: reference to the hidden file input element, allowing programmatic click triggering.

---

## Functions

### handleFiles
- **Purpose**: Accepts a `FileList` and updates the `file` state with the first file.

### handleDrop
- **Purpose**: Handles file drop events on the drop zone; prevents default behavior, clears highlight, and processes dropped files.

### handleDragOver
- **Purpose**: Handles drag-over events; prevents default behavior and activates highlight state.

### handleDragLeave
- **Purpose**: Clears highlight state when a dragged file leaves the drop zone.

### handleChange
- **Purpose**: Handles changes to the hidden file input; processes selected files.

### handleZoneClick
- **Purpose**: Triggers a click on the hidden file input when the drop zone is clicked.

### handleUploadClick
- **Purpose**: Invokes the `onUpload` callback with the selected file, clears file state, and resets the input.

---

## Rendered Elements

- **Hidden File Input**
  - Accepts specified file types.
  - Hidden with `display: none`.
  - Updates state on file selection.

- **Drop Zone**
  - Visually styled area allowing drag-and-drop of files.
  - Responds to clicks by opening the file picker.
  - Dynamically updates style with `highlight` class when hovered.
  - Displays the selected file name or prompt text.

- **Upload Button**
  - Calls `handleUploadClick` when clicked.
  - Disabled when no file is selected.
  - Centered with inline styles.

---

## External Dependencies
- **React**: for state, refs, and rendering.
- **CSS**: `UploadFileBox.css` and `UserProfile.css` provide layout and styling for the drop zone and button.
