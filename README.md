# Rezume

Rezume is a full‑stack application that helps job seekers tailor their resume to specific job descriptions using AI assistance.  Users can maintain a library of PDF resumes, tag one as the **master** resume, provide a job description (via text or URL), select keywords to emphasize, and generate a new resume optimized for that job.  The generated resume can then be edited and exported as a PDF.

---

## Architecture Overview

The project is split into a React frontend (`frontend/`) and a Flask backend (`backend/`).  The backend exposes a REST API in `backend/app.py` that handles authentication, resume/JD processing and AI calls.  The frontend talks to these endpoints through service modules found in `frontend/src/services`.

```
frontend/src/services/            <-- API wrappers used by React components
backend/app.py                    <-- Flask routes
```

Key communication points:

1. **Authentication** – Firebase Authentication is used in the browser.  Each service function obtains the current user's ID token and attaches it as a `Bearer` token to requests.  `verify_firebase_token` in the backend validates this token for every protected route.
2. **Resume management** – Functions in `resumeService.js` call endpoints such as `/api/upload_pdf`, `/api/list_pdfs`, `/api/set_master_pdf`, etc.  These routes in `app.py` use helper modules (`pdf_utils.py`, `resume_utils.py`) to store PDFs in Firebase Storage and metadata in Firestore.
3. **Job descriptions** – `jobDescriptionService.js` sends text or a URL to `/api/jd` or `/api/jd_from_url`, which scrape/parse the description and return an explanation.  `extract_jd_profile_llm` utilizes OpenAI's API to pull out required skills, education and experience.
4. **Resume generation** – `generateTargetedResumeHtml` in `resumeService.js` posts to `/api/generate_targeted_resume`.  The backend downloads the master resume text, crafts a prompt along with selected keywords, and calls `openai.chat.completions.create()` in `llm_utils.py`.  The resulting HTML resume is sent back to the browser for editing and export.

---

## Technologies

- **React** with React Router and Axios for the SPA frontend
- **Flask** REST API for backend logic
- **Firebase** Authentication, Firestore and Cloud Storage
- **OpenAI API** (GPT‑4o) for resume analysis and generation
- **Python packages** such as `pdfminer.six` and `PyPDF2` for PDF handling
- **Node packages** including `@tinymce/tinymce-react` for the resume editor

---

## Running the Application

1. Install Node and Python dependencies:
   ```bash
   npm install              # install JS packages
   pip install -r backend/requirements.txt  # install Python packages
   ```
2. Set up a `.env` file with Firebase credentials (`FIREBASE_KEY_B64`, `FIREBASE_STORAGE_BUCKET`) and your OpenAI API key (`OPENAI_GROUP_PROJECT_KEY`).
3. Start both servers:
   ```bash
   npm run dev
   ```
   This uses `concurrently` to run `python backend/app.py` and `npm start --prefix frontend`.
4. Visit `http://localhost:3000` to use the app.

---

## Example Workflow

1. Open the landing page and sign up or log in.
2. Upload one or more resume PDFs in **Resume Library** and tag one as the master resume.
3. Enter a job description URL or paste the text.  The app scrapes/parses the description and highlights key skills.
4. Select the keywords you want to emphasize in the tailored resume.
5. Click **Generate Resume** – the backend uses your master resume, the job description and selected keywords to produce an HTML resume via the OpenAI API.
6. Edit the generated resume in the built‑in editor.
7. Export the tailored resume as a PDF and save it back to your library if desired.

---

## Repository Structure

- `backend/` – Flask application, service modules and tests
- `frontend/` – React code and static assets
- `node_modules/` / `.venv/` – installed dependencies (not committed)
- `package.json` – defines a single `dev` script to run both frontend and backend during development

---

## License

This project is maintained by the COMP‑380 group and is currently a work in progress.
