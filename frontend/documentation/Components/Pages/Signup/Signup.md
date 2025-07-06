# LoginSignup.jsx

## Overview
This React component renders the **Sign Up** page of the application. It provides an interactive UI for new users to register by entering their full name, email, and password, validating their input, displaying helpful error messages, and handling user registration via Firebase authentication. The page also includes a live checklist to guide users through password requirements, and navigation to the login page if the user already has an account.

---

## How This Component Works
- Uses React state hooks to manage form inputs, validation error flags, and password visibility toggling.
- Uses `react-router-dom`’s `useNavigate` to handle page redirection upon successful signup or when navigating to login.
- Validates the password against multiple criteria with regular expressions, updating a checklist in real time.
- Calls `handleSignup` (from `authHandlers`) to perform the actual registration.
- On success, navigates the user to the `/welcome` page.
- On failure, displays appropriate error messages depending on the Firebase error code.

---

## State Variables
- **fullName**: stores the user’s full name.
- **email**: stores the user’s email address.
- **password**: stores the user’s password.
- **fullNameError**: boolean, highlights Full Name input if empty or invalid.
- **emailError**: boolean, highlights Email input if empty or invalid.
- **passwordError**: boolean, highlights Password input if empty or invalid.
- **showPassword**: boolean, toggles visibility of the password input.

---

## Regular Expressions Used for Password Validation
- **passwordLengthRegex**: minimum 6 characters.
- **passwordNumberRegex**: at least one digit.
- **passwordLowercaseRegex**: at least one lowercase letter.
- **passwordUppercaseRegex**: at least one uppercase letter.
- **passwordSpecialRegex**: at least one special character.

---

## Functions

### handleSignUp
- **Purpose**: Triggered when the user clicks the "Sign Up" button. Validates form fields, performs password checks, clears previous error states, calls `handleSignup`, and navigates on success.
- **Input**: None directly, uses current component state.
- **Output**: Navigates to `/welcome` if successful. Displays error messages on failure.
- **Side Effects**: Updates error flags; performs navigation.

### handleGoToLogin
- **Purpose**: Triggered when the user clicks the "Login" button. Navigates to the login page.
- **Input**: None.
- **Output**: Redirects user to `/login`.

---

## Rendered Elements

- **Site Banner/Header**
  - Contains the app’s logo (`RezuMe`) linking back to the home page.
  
- **Main Form**
  - **Full Name Input**
    - Shows red error border and message if empty.
  - **Email Input**
    - Shows red error border and message if empty.
  - **Password Input**
    - Toggles between masked and plain text via eye icon.
    - Shows error if empty or fails any password requirement.
  - **Password Requirements Checklist**
    - Updates icons live as the user types.
    - Each requirement shows a checked or empty circle based on fulfillment.
  - **Sign Up Button**
    - Triggers registration via `handleSignUp`.
  - **Login Button**
    - Navigates to login page via `handleGoToLogin`.

---

## Error Handling
- Displays inline error messages below inputs if fields are empty or invalid.
- Alerts user with error details based on Firebase response codes:
  - `auth/email-already-exists`: email is already registered.
  - `auth/invalid-email`: invalid email format.
  - `auth/invalid-password`: password too short.
  - `empty-fields`: one or more required fields missing.
  - Fallback: generic signup failure alert.

---

## Password Checklist Indicators
- Uses `FaRegCircle` for unmet requirements.
- Uses `FaCheckCircle` for met requirements.
- Requirements checked:
  - Minimum 6 characters.
  - At least 1 number.
  - At least 1 lowercase letter.
  - At least 1 uppercase letter.
  - At least 1 special character.

---

## External Dependencies
- **React**: for component state and rendering.
- **react-router-dom**: navigation (`useNavigate`, `Link`).
- **authHandlers.js**: `handleSignup` for registration.
- **react-icons/fa**: FontAwesome icons for checklist and password visibility.
- **CSS Files**: `Signup.css` and `LandingPage.css` for styling.
- **Image Assets**: logo, profile, email, and password icons.
