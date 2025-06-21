import os, json
from dotenv import load_dotenv
import openai
from flask import request, g, jsonify

from pdf_utils import (
    _download_pdf_as_text
)

load_dotenv()
openai.api_key = os.getenv("OPENAI_GROUP_PROJECT_KEY")

# Generic LLM (OpenAI API) resume and job description parsing helper function
def llm_parse_text(text: str, mode: str) -> dict:
    """
    mode == 'resume' -> extract skills, education, experience
    mode == 'jd'     -> extract required_skills, required_education, required_experience, responsibilities
    """
    # OpenAI prompt details for parsing resumes
    if mode == "resume":
        system = "You are a resume analysis service."
        user = (
            "Extract from this resume:\n"
            "  • skills (as an array of strings)\n"
            "  • education (as an array of objects with fields 'degree', 'institution', and 'year')\n"
            "  • professional experience (as an array of objects with fields 'job_title', 'company', and 'dates')\n"
            "Return a JSON object with exactly these fields."
        )
        schema = {
            "type": "object",
            "properties": {
                "skills": {"type": "array", "items": {"type": "string"}},
                "education": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "degree": {"type": "string"},
                            "institution": {"type": "string"},
                            "year": {"type": "string"}
                        },
                        "required": ["degree", "institution", "year"],
                        "additionalProperties": False
                    }
                },
                "experience": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "job_title": {"type": "string"},
                            "company": {"type": "string"},
                            "dates": {"type": "string"}
                        },
                        "required": ["job_title", "company", "dates"],
                        "additionalProperties": False
                    }
                },
            },
            "required": ["skills", "education", "experience"],
            "additionalProperties": False
        }
        name = "ResumeProfile"

    # OpenAI prompt details for parsing job descriptions
    elif mode == "jd":
        system = "You are a job description parsing service."
        user = (
            "Extract from this job description:\n"
            "  • required_skills\n"
            "  • required_education\n"
            "  • required_experience\n"
            "  • responsibilities\n"
            "Return a JSON object with exactly these fields."
        )
        schema = {
            "type": "object",
            "properties": {
                "required_skills": {"type": "array", "items": {"type": "string"}},
                "required_education": {"type": "array", "items": {"type": "string"}},
                "required_experience": {"type": "array", "items": {"type": "string"}},
                "responsibilities": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["required_skills", "required_education", "required_experience", "responsibilities"],
            "additionalProperties": False
        }
        name = "JDProfile"
    
    else:
        raise ValueError(f"Unknown LLM parse mode: {mode}")
    
    # Assempble the OpenAI prompt
    prompt = (
        f"{user}\n\nText:\n```{text}```"
    )

    # Specify the response that we want from the API
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": prompt},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": name,
                "schema": schema
            }
        },
        max_tokens=800,
        temperature=0
    )

    return json.loads(response.choices[0].message.content)


""" Augmented resume generation using user's master resume, job description, and selected keywords
    Here's the plan:
        1. Pull master resume from Firebase Storage
        2. Build OpenAI API prompt with resume, JD, and selected keywords
        3. Call openai.chat.completions to rewrite the resume
        4. Return the raw generated text
"""
def generate_targeted_resume():
    data = request.get_json() or {}          # Request from frontend must contain:
    doc_id = data.get("docID")               # master resume (docID),
    jd_text = data.get("job_description", "")# job description (dob_description),
    keywords = data.get("keywords", [])      # but keywords (uh, keywords) are optional

    if not doc_id or not jd_text:
        return jsonify({"error":"docID and job_description are required"}), 400
    
    # Step 1 (as described above the function definition): download resume as plain text
    user_id = g.firebase_user["uid"]
    raw_resume = _download_pdf_as_text(user_id, doc_id)
    if raw_resume is None:
        return jsonify({"error":"Could not retrieve resume PDF"}), 404
    
    # 2: Build prompt (direct instruction prompt). Provide the model with the 
    # full resume and job descriptin in the prompt, and instruct it to rewrite 
    # the resume to align with the job.
    keyword_list = ", ".join(keywords) if keywords else "None"  # Allows the user to generate a resume without selecting any keywords
    system_msg = "You are a professional resume writer. Rewrite resumes to match job descriptions"
    user_msg = (
        f"Here is the candidate's original resume:\n```{raw_resume}```\n\n"
        f"Here is the target job description:\n```{jd_text}```\n\n"
        "Please rewrite the resume to optimize it for this job posting."
        "Include and emphasize these keywords if relevant: "
        f"{keyword_list}. "
        "Use only facts from the original resume -- do not invent new experiences."
    )

    # 3: Call OpenAI API
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role":"system", "content": system_msg},
                {"role":"user", "content": user_msg}
            ],
            temperature=0.7,  # Allow GPT to be creative without it just making shit up all the time
            max_tokens = 1200,
        )
        generated = response.choices[0].message.content
    except Exception as e:
        return jsonify({"error":f"OpenAI request failed: {str(e)}"}), 500
    
    # 4: Return the plain text of the augmented resume
    return jsonify({"generated_resume": generated}), 200





