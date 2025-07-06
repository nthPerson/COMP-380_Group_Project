# diffUtils.js

## Overview

Utility for **word-level difference highlighting** between a master résumé (HTML) and a tailored résumé.
`toDiffHtml` wraps *inserted* words in `<span class="diff-added">…</span>` while discarding deletions and preserving all other markup, then sanitises the result with **DOMPurify**.

---

## How It Works

1. **Diff** – `diffWords(masterHtml, tailoredHtml)` splits both strings into word tokens and labels them as `added`, `removed`, or unchanged.
2. **Markup generation**

   * If `part.added` ➜ wrap in `<span class="diff-added">…</span>`.
   * If `part.removed` ➜ omit completely.
   * Otherwise output `part.value` unchanged (keeps `<h3>`, `<ul>`, etc.).
3. **Sanitise** – Pass concatenated HTML through `DOMPurify.sanitize()`, allowing only headings, lists, paragraphs, spans, and basic inline tags (`strong`, `em`, etc.).
4. **Return** – Sanitised HTML string ready for direct injection into React via `dangerouslySetInnerHTML`.

---

## Functions

| Function     | Purpose                                                    | Returns                   |
| ------------ | ---------------------------------------------------------- | ------------------------- |
| `toDiffHtml` | Highlight added words between *master* and *tailored* HTML | `string` (sanitised HTML) |

---

## Error Handling

| Scenario                          | Behaviour / Thrown Error            |
| --------------------------------- | ----------------------------------- |
| Invalid HTML input                | Still processed; output sanitised   |
| `diffWords` / `DOMPurify` failure | Will propagate the thrown exception |

---

## Usage Example

```js
import { toDiffHtml } from "./services/diffUtils";

const diffHtml = toDiffHtml(masterResumeHtml, tailoredResumeHtml);

/* In React: */
<div
  className="resume-diff"
  dangerouslySetInnerHTML={{ __html: diffHtml }}
/>;
```

---

## External Dependencies

* **diff** (`diffWords`) – Word-level diffing
* **DOMPurify** – XSS sanitisation

---
