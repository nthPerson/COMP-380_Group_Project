# TargetedResumeContext.jsx

## Overview

This file implements a **React Context** and Provider for managing state related to targeted resume generation. It stores the job description content, its explanation, and the generated HTML resume, making these values accessible to any component within the provider’s tree.

---

## How This File Works

* Defines a context object (`TargetedResumeContext`) to hold shared state.
* Implements `TargetedResumeProvider` to wrap parts of the app that need access to targeted resume state.
* Exposes a custom hook `useTargetedResume` to easily read and update context values in consumer components.

---

## Context Values Provided

| Name               | Type     | Description                                     |
| ------------------ | -------- | ----------------------------------------------- |
| `jdContent`        | string   | Job-description text provided by the user.      |
| `setJdContent`     | function | Updates `jdContent`.                            |
| `jdExplanation`    | string   | Explanation or analysis of the job description. |
| `setJdExplanation` | function | Updates `jdExplanation`.                        |
| `generatedHtml`    | string   | Generated HTML content for the targeted resume. |
| `setGeneratedHtml` | function | Updates `generatedHtml`. |
| `initialSim`       | number?  | Baseline similarity score between the master resume and job description. |
| `setInitialSim`    | function | Updates `initialSim`. |

---

## Components

### TargetedResumeProvider

Wraps child components and provides them access to the targeted resume context.

**Props**

* `children` – React children that will consume the context.

**Usage Example**

```jsx
import { TargetedResumeProvider } from "path/to/TargetedResumeContext";

<TargetedResumeProvider>
  <MyComponent />
</TargetedResumeProvider>
```

---

## Custom Hook

### useTargetedResume

Custom hook for consuming the targeted resume context.

**Usage Example**

```jsx
import { useTargetedResume } from "path/to/TargetedResumeContext";

const { jdContent, setJdContent } = useTargetedResume();
```

---

## External Dependencies

* **React** – uses `useState`, `createContext`, and `useContext` for state and context functionality.
