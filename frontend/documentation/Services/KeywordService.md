# selectedKeywordsService.js

## Overview

Client-side helpers for the **“/api/selected\_keywords \*”** and **“/api/highlight\_similarity”** endpoints:

* Retrieve, add, remove, or clear a user’s *selected* keyword list.
* Request resume ↔ job-description highlight matches.

All requests are authenticated via a Firebase ID token and return parsed JSON on success.

---

## How It Works

1. **Get ID token** – `await auth.currentUser.getIdToken()`.
2. **Compose request** – `Authorization: Bearer <idToken>` header (plus `"Content-Type": "application/json"` for POST).
3. **Send with `fetch()`** – Target local dev server (`http://localhost:5001`).
4. **Error guard** – If `response.ok` is `false`, read `response.text()` and throw an `Error`.
5. **Return value** – Parse and return JSON (shape depends on endpoint).

---

## Functions

| Function                | Purpose                                                           | Returns (resolved)                                   |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `getSelectedKeywords`   | Fetch current keyword list (`/selected_keywords/get`)             | `string[]`                                           |
| `addSelectedKeywords`   | Append keywords (`/selected_keywords/add`)                        | Updated `string[]`                                   |
| `removeSelectedKeyword` | Remove a single keyword (`/selected_keywords/remove`)             | Updated `string[]`                                   |
| `clearKeywords`         | Clear all selected keywords (`/selected_keywords/clear`)          | Empty `string[]`                                     |
| `fetchHighlights`       | Compute resume/JD similarity highlights (`/highlight_similarity`) | `{ matched_resume: string[], matched_jd: string[] }` |

---

## Error Handling

These helpers do **not** attach custom codes; they re-throw raw messages.

| Scenario                 | Thrown Error Message Example                      |
| ------------------------ | ------------------------------------------------- |
| Network / CORS failure   | `TypeError: Failed to fetch` *(browser default)*  |
| Non-2xx backend response | Whatever `await res.text()` returns (status code) |

---

## Usage Examples

### 1. Add Keywords & Refresh List

```js
try {
  const updated = await addSelectedKeywords(["React", "TypeScript"]);
  setKeywords(updated);
} catch (err) {
  toast.error(err.message);
}
```

### 2. Remove a Keyword

```js
await removeSelectedKeyword("React");
```

### 3. Highlight Matches

```js
const { matched_resume, matched_jd } =
  await fetchHighlights(resumeBullets, jdBullets);
```

---

## External Dependencies

* **Firebase Auth SDK** (`auth` object for ID token)
* **Browser Fetch API**

---
