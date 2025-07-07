// WelcomeInstructions.test.jsx

import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// ✅ Mock Firebase Auth to simulate an authenticated user
jest.mock("firebase/auth", () => ({
  getAuth: () => ({}),
  onAuthStateChanged: (auth, callback) => {
    callback({ uid: "mockUser" }); // simulate logged-in user
    return () => {}; // simulate unsubscribe function
  },
}));

// ✅ Mock react-router-dom
jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <div>{children}</div>,
}));

// ✅ Mock Sidebar to avoid dependency errors
jest.mock("../../../Sidebar/Sidebar", () => () => <div>Mock Sidebar</div>);

// ✅ Component under test (must come after mocks)
import WelcomeInstructions from "../WelcomeInstructions";

describe("WelcomeInstructions component", () => {
  test("renders all expected step headers", async () => {
    render(<WelcomeInstructions />);

    const expectedSteps = [
      "Upload Your Master Resume",
      "Provide a Job Description",
      "Pick Keywords to Emphasize",
      "Generate Your Tailored RezuMe",
      "Review & Tweak",
      "Export & Share",
    ];

    for (const stepText of expectedSteps) {
      expect(await screen.findByText(stepText)).toBeInTheDocument();
    }
  });
});
