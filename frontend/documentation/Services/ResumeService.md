# resumeService.js

## Overview

Client-side wrapper around all **resume-related backend endpoints**:

* Upload / list / delete PDFs
* Manage the *master* resume and signed URLs
* Extract resume profiles via LLM
* Generate, save, and compare targeted resumes
* Compute similarity scores and download raw PDF text

All requests are authenticated with a Firebase ID token through a standard `Authorization: Bearer` header.

---

## How It Works

1. **Token retrieval** – `await auth.currentUser.getIdToken()`.
2. **HTTP request** – `fetch()` to `http://localhost:5001/api/...` with appropriate method, headers, and body.
3. **Error guard** – If `response.ok` is `false`, read text/JSON and throw an `Error`.
4. **Return value** – Parse and return JSON (exact shape noted per function).

---

## Functions

| Function                               | Purpose                                                     | Returns (resolved)                   |
| -------------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| `listUserPdfs`                         | List all stored PDFs for current user                       | `{ pdfs: [...] }`                    |
| `deleteUserPdf(docID)`                 | Delete résumé PDF by Firestore `docID`                      | `{ message }`                        |
| `setMasterPdf(docID)`                  | Mark selected résumé as the *master*                        | `{ message }`                        |
| `getMasterPdf`                         | Retrieve current master résumé ID                           | `{ master_docId }`                   |
| `extractResumeProfileLLM(docID)`       | LLM extracts skills / education / experience from résumé    | `{ skills, education, experience }`  |
| `saveResume(resumeData)`               | Save a new résumé entry (JSON metadata)                     | `{ message, docID }`                 |
| `getResumeSignedUrl(storagePath)`      | Generate signed URL for résumé stored in Firebase Storage   | `string` (URL)                       |
| `generateTargetedResumeHtml(...)`      | Generate **HTML** résumé tailored to JD + keywords          | `string` (HTML)                      |
| `generateTargetedResume(...)`          | Generate **plain-text** résumé tailored to JD + keywords    | `string` (plain text)                |
| `saveGeneratedResume(text, fileName?)` | Persist generated résumé (plain text → PDF server-side)     | `{ message, docID }`                 |
| `saveGeneratedResumePdf(formData)`     | Persist pre-built PDF version of generated résumé           | `{ message, docID }`                 |
| `getSimilarityScore(...)`              | Compare master and/or generated résumé to JD via embeddings | `{ master_score, generated_score? }` |
| `fetchMasterText(docID)`               | Download raw plaintext from master résumé PDF               | `string` (full text)                 |

---

## Error Handling

| Scenario                          | Thrown Error Message Example                            |
| --------------------------------- | ------------------------------------------------------- |
| List PDFs failure                 | `Failed to fetch PDF list`                              |
| Delete failure                    | `Failed to delete PDF`                                  |
| Set master failure                | `Failed to set master resume`                           |
| Master fetch failure              | `Failed to get master resume`                           |
| Signed-URL failure                | `Failed to generate signed resume URL`                  |
| Generation failure                | `Generation failed: 500 <server message>`               |
| Save generated failure (text/pdf) | `Failed to save generated resume` *(or server message)* |
| Similarity failure                | `Similarity check failed` *(or server message)*         |
| Network/CORS issues               | Browser-native `TypeError: Failed to fetch`             |

---

## Usage Examples

### 1. Generate & Save a Targeted Résumé

```js
try {
  const html = await generateTargetedResumeHtml(
    masterDocId,
    jdText,
    selectedKeywords
  );

  await saveGeneratedResume(html, "RezuMe_Targeted.pdf");
  toast.success("Resume generated & saved!");
} catch (err) {
  toast.error(err.message);
}
```

### 2. Compute Similarity Scores

```js
const { master_score, generated_score } =
  await getSimilarityScore(masterDocId, jdText, generatedPlain);
console.log(`Master: ${master_score} | Generated: ${generated_score}`);
```

### 3. Extract Profile via LLM

```js
const profile = await extractResumeProfileLLM(masterDocId);
/*
  {
    skills: ["Python", "React", …],
    education: ["B.S. CS – UCLA"],
    experience: ["Software Engineer at …"]
  }
*/
```

---

## External Dependencies

* **Firebase Auth SDK** – `auth.currentUser.getIdToken()`
* **Browser Fetch API** – `window.fetch`
* **Backend** – Local dev server (`localhost:5001`) with corresponding routes

---
