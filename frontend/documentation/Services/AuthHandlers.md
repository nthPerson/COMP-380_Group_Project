# authHandlers.js

## Overview

Utility functions that wrap Firebase Authentication SDK calls for **sign-up, login, password reset, and sign-out**.
Each handler performs minimal validation, throws consistent errors, and returns the current `user` object (where applicable).

---

## How It Works

1. **Input validation** – Basic presence checks (and a simple email regex for password reset).
2. **Firebase call** – Invoke the relevant Firebase Auth method.
3. **Error handling** – Re-throw validation or Firebase errors so the UI layer can surface them.
4. **Return value** – On success, return the authenticated `user` (for sign-up / login) or nothing (for sign-out / reset).

---

## Functions

| Function              | Purpose                               | Returns           |
| --------------------- | ------------------------------------- | ----------------- |
| `handleSignup`        | Create a new user and set displayName | `FirebaseUser`    |
| `handleLogin`         | Sign in an existing user              | `FirebaseUser`    |
| `handlePasswordReset` | Send a password-reset email           | `void` (resolves) |
| `handleSignout`       | Sign out the current user             | `void` (resolves) |

---

## Error Codes

| Code                   | Trigger                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `empty-fields`         | Required field(s) left blank (sign-up or login)             |
| `empty-email`          | Password-reset called without an email                      |
| `invalid-email-format` | Email fails basic regex check during password reset         |
| *Firebase SDK codes*   | Any errors returned directly by Firebase Authentication SDK |

---

## Usage Examples

### Sign-Up

```js
try {
  const user = await handleSignup(fullName, email, password);
  // Redirect to dashboard…
} catch (err) {
  console.error(err.code, err.message);
}
```

### Login

```js
try {
  const user = await handleLogin(email, password);
// Proceed after successful login…
} catch (err) {
  // Display err.code or err.message
}
```

### Password Reset

```js
try {
  await handlePasswordReset(email);
  alert("Reset email sent!");
} catch (err) {
  // Handle invalid email, etc.
}
```

### Sign-Out

```js
await handleSignout();
// Redirect to login page
```

---

## External Dependencies

* **Firebase Auth SDK**

  * Methods: `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `sendPasswordResetEmail`, `updateProfile`, `signOut`
* **Local Firebase config** (`auth` import)

---
