# resumeTextFormatter.js

## Overview

`resumeTextToHtml` converts raw résumé text (pasted into the TinyMCE editor) into **structured HTML** on-the-fly:

* Detects section headings, name/title lines, bullet lists, and plain paragraphs.
* Outputs semantic tags (`<h3>`, `<h2>`, `<ul><li>`, `<p>`).

This ensures consistent formatting before the content is injected into TinyMCE.

---

## How It Works

1. **Split blocks** – `raw.split(/\n{2,}/)` divides the text on blank-line boundaries.
2. **Classify each block**

   * **Section headings** – Lines beginning with keywords (`Education`, `Skills`, etc.) → `<h3>`.
   * **Name & title** – First line style (`John Doe • Software Engineer`) → `<h2>`.
   * **Bullets** – Lines starting with `-`, `*`, or `•` → `<ul><li>` list.
   * **Default** – Fallback to paragraph `<p>`.
3. **DOM assembly** – Create elements via `document.createElement`, append to a temporary `<div>`.
4. **Return** – `container.innerHTML` as the final HTML string.

---

## Functions

| Function           | Purpose                             | Returns                |
| ------------------ | ----------------------------------- | ---------------------- |
| `resumeTextToHtml` | Auto-formats raw résumé text → HTML | `string` (HTML markup) |

---

## Usage Example

```js
import { resumeTextToHtml } from "./services/resumeTextFormatter";

const formattedHtml = resumeTextToHtml(rawTextareaValue);

tinymce.get("editor").setContent(formattedHtml);
```

---

## External Dependencies

None – uses plain **browser DOM APIs** only.

---
