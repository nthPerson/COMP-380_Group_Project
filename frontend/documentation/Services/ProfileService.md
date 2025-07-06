# profileService.js

## Overview

Client-side utilities for **user-profile retrieval and updates** via multipart/form-data or JSON endpoints.
All requests are authenticated with a Firebase ID token supplied in an `Authorization: Bearer` header.

---

## How It Works

1. `authorizedFetch` helper

   * Retrieves `idToken` from `auth.currentUser.getIdToken()`.
   * Merges token into `options.headers` and calls `fetch()`.
2. **Update flow**

   * Build a `FormData` payload (`profile_picture`, `username`, `email`).
   * `POST` to `/api/update_profile`.
3. **Read flow**

   * `GET` `/api/get_profile`.
4. **Error guard** – If `response.ok` is `false`, throw an `Error` with a concise message.
5. **Return value** – Both helpers return parsed JSON.

---

## Functions

| Function        | Purpose                                    | Returns (resolved)                       |
| --------------- | ------------------------------------------ | ---------------------------------------- |
| `updateProfile` | Upload profile picture **and/or** metadata | `{ username, email, photoURL }` (server) |
| `getProfile`    | Retrieve current profile info              | `{ username, email, photoURL }`          |

---

## Error Handling

| Scenario               | Thrown Error Message       |
| ---------------------- | -------------------------- |
| Non-2xx on update      | `Failed to update profile` |
| Non-2xx on fetch       | `Failed to fetch profile`  |
| Network / CORS failure | Browser-native `TypeError` |

---

## Usage Examples

### 1. Update Profile (picture + username)

```js
try {
  const updated = await updateProfile({
    file: fileInput.files[0],
    username: "rez_dev",
  });
  console.log(updated.photoURL);
} catch (err) {
  alert(err.message);
}
```

### 2. Fetch Profile

```js
const profile = await getProfile();
/*
  {
    username: "rez_dev",
    email: "reza@example.com",
    photoURL: "https://..."
  }
*/
```

---

## External Dependencies

* **Firebase Auth SDK** – `auth.currentUser.getIdToken()`
* **Browser APIs** – `window.fetch`, `FormData`

---
