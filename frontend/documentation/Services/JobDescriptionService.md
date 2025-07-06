# jdService.js

## Overview

Client-side helpers that interact with the **backend “/api/jd\*” endpoints**:

* Send raw job-description text or a URL.
* Retrieve Gemini-generated explanations.
* Extract structured JD profiles via an LLM.

All functions perform the HTTP request, propagate any network / server errors, and (on success) return the parsed JSON payload.

---

## How It Works

1. **Compose request** – Build a `POST` request with `Content-Type: application/json` and an **`Authorization: Bearer <idToken>`** header.
2. **Send with `fetch()`** – Target local dev server (`http://localhost:5001`).
3. **Error guard** – If `response.ok` is `false`, read `response.text()` and throw an `Error`.
4. **Return value** – Parse and return JSON (shape depends on endpoint).

---

## Functions

| Function                | Purpose                                                 | Returns (resolved)                             |
| ----------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| `sendJobDescription`    | Send **plain JD text** to `/api/jd`                     | `{ job_description, explanation }`             |
| `sendJobDescriptionUrl` | Send **URL** (backend scrapes JD) to `/api/jd_from_url` | `{ job_description, explanation }`             |
| `explainJdText`         | *Alias* of first endpoint (text → explanation)          | Same as above                                  |
| `explainJdUrl`          | *Alias* of second endpoint (URL → explanation)          | Same as above                                  |
| `extractJdProfile`      | Extract structured profile fields from JD via LLM       | `{ required_skills, required_education, ... }` |

---

## Error Handling

> These helpers do **not** assign custom `err.code`s.
> Callers should inspect `err.message` or wrap with their own error map.

| Scenario                 | Thrown Error Message Example                     |
| ------------------------ | ------------------------------------------------ |
| Network / CORS failure   | `TypeError: Failed to fetch` *(browser default)* |
| Non-2xx backend response | `Failed to send JD: 500 Internal Server Error`   |
| Non-2xx for URL endpoint | `Failed to send url: 400 <details>`              |

---

## Usage Examples

### 1. Send JD Text & Get Explanation

```js
try {
  const { job_description, explanation } =
    await sendJobDescription(jdTextareaValue, idToken);
  console.log(explanation);
} catch (err) {
  alert(err.message);
}
```

### 2. Send JD URL

```js
const result = await sendJobDescriptionUrl(
  "https://jobs.example.com/123",
  idToken
);
setJdContent(result.job_description);
setJdExplanation(result.explanation);
```

### 3. Extract Structured Profile

```js
const profile = await extractJdProfile(jdContent, idToken);
/*
  {
    required_skills: [...],
    required_education: [...],
    responsibilities: [...],
    ...
  }
*/
```

---

## External Dependencies

* **Browser Fetch API** (`window.fetch`)
* **Authentication** – An ID token (e.g., Firebase Auth) passed as a Bearer token

---
