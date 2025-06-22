import os, json, math
from dotenv import load_dotenv
import openai
from flask import request, g, jsonify
# from functools import lru_cache

from pdf_utils import (
    _download_pdf_as_text
)
from embeddings_db import (
    get_embedding_from_db,
    save_embedding_to_db
)


load_dotenv()
openai.api_key = os.getenv("OPENAI_GROUP_PROJECT_KEY")

EMBED_MODEL = "text-embedding-3-small"  # 1,536 dimensional vector
# EMBED_MODEL = "text-embedding-3-large"  # 3072 dimensional vector

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

#============================ Embeddings Functionality ====================================================

# # Helper function that calls OpenAI API Embeddings to get a single embedding vector from text
# def _get_embedding(text: str):
#     response = openai.embeddings.create(
#         input=[text],
#         model=EMBED_MODEL
#     )
#     return response.data[0].embedding

# Get an embedding from the embedding db if it exists, call OpenAI API to create embedding if it does not exist
def _get_embedding(text: str) -> list[float]:
    # Try local embeddings db first
    cached = get_embedding_from_db(text)
    if cached is not None:  # If the embedding was found in the db, return so the OpenAI API is not called (saves the time and the money)
        return cached
    
    # If the embedding doesn't exist in the db, hit up OpenAI API once
    response = openai.embeddings.create(
        input=[text],
        model=EMBED_MODEL
    )
    embedding_vector = response.data[0].embedding

    # Save the embedding to the db for future use
    save_embedding_to_db(text, embedding_vector)  # save_embedding_to_db([word_that_we_want_to_embed], [actual_embedding_for_the_word])
    return embedding_vector

# Embed a list of texts, using the embeddings db for repeated items
def get_embeddings(text_list: list[str]) -> list[list[float]]:
    return [_get_embedding(text) for text in text_list]

# Calculate cosine similarity between two vectors
def _cosine_sim(a: list, b: list) -> float:
    dot = sum(x*y for x,y in zip(a, b))
    norm_a = math.sqrt(sum(x*x for x in a))
    norm_b = math.sqrt(sum(y*y for y in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0

""" JD <-> Resume similiarity calculation using OpenAI Embeddings and consine similarity
    Here's the plan:
        1. After user tags a master resume and inputs a JD, create embeddings from resume and JD
        2. Calculate cosine sim to get baseline measurement
        3. After targeted resume is generated, create embeddings for targeted resume
        4. Calculate cosine sim again to see if augmented resume performs better against JD
"""
def compute_similarity_scores():
    """
    Expects JSON in the following format:
        { 
          docID: string,
          job_description: string,
          generated_resume?: string 
        }
    Returns JSON in the following format:
        { 
          master_score: float,      # Range: 0.0 - 100
          generated_score?: float   # Only if generated_resume is provided
        }
    """
    data = request.get_json() or {}
    doc_id   = data.get("docID")
    jd_text  = data.get("job_description", "").strip()
    generated_text = data.get("generated_resume", "").strip()

    if not doc_id or not jd_text:
        return jsonify({"error":"docID and job_description required"}), 400
    
    # Load master resume text
    user_id = g.firebase_user["uid"]
    master_txt = _download_pdf_as_text(user_id, doc_id)
    if not master_txt:
        return jsonify({"error":"Could not fetch resume text"}), 404
    
    # Embed JD and master resume
    jd_embed = _get_embedding(jd_text)
    master_embed = _get_embedding(master_txt)
    master_sim = _cosine_sim(master_embed, jd_embed) * 100  # Mulitply by 100 to get the similarity as a percentage

    result = {"master_score": round(master_sim, 1)}

    # If the targeted resume has been generated, embed, calculate, and compare that too
    if generated_text:
        gen_embed = _get_embedding(generated_text)
        generated_sim = _cosine_sim(gen_embed, jd_embed) * 100  # Mulitply by 100 to get the similarity as a percentage
        result["generated_score"] = round(generated_sim, 1)

    return jsonify(result), 200

# Similarity highlighting mask
def highlight_profile_similarity(resume_items: list[str], jd_items: list[str], threshold: float = 0.7):
    """
    Return two parallel lists of booleans:
      - matched_resume[i] = does resume_items[i] match any jd_items?
      - matched_jd[j]     = does jd_items[j] match any resume_items?
    Uses cosine similarity >= threshold.
    """
    # Get all the embeddings in one shot (uses cached embeddings)
    resume_embeds = get_embeddings(resume_items)
    jd_embeds = get_embeddings(jd_items)

    """ Calculate cosine sim between list items """
    # For each resume keyword, does it match any JD keyword?
    matched_resume = []
    for res_emb in resume_embeds:
        if any(_cosine_sim(res_emb, jd_emb) >= threshold for jd_emb in jd_embeds):
            matched_resume.append(True)
        else:
            matched_resume.append(False)

    # Vice versa: for each jd keyword, does it match any resume keyword?
    matched_jd = []
    for jd_emb in jd_embeds:
        if any(_cosine_sim(jd_emb, res_emb) >= threshold for res_emb in resume_embeds):
            matched_jd.append(True)
        else:
            matched_jd.append(False)

    return jsonify({
        "matched_resume": matched_resume,
        "matched_jd": matched_jd
    }), 200

#Helper Function to make highlight_profile_similarity testable without flask!
#right now it returns a jsonify(..) which only work into a flask route so this helper function just returns python data

def highlight_similarity_raw(resume_items: list[str], jd_items: list[str], threshold: float = 0.7):
    resume_embeds=get_embeddings(resume_items)
    jd_embeds= get_embeddings(jd_items)

    matched_resume = []
    for res_emb in resume_embeds:
        matched = any(_cosine_sim(res_emb, jd_emb) >= threshold for jd_emb in jd_embeds)
        matched_resume.append(matched)

    matched_jd = []
    for jd_emb in jd_embeds:
        matched = any(_cosine_sim(jd_emb, res_emb) >= threshold for res_emb in resume_embeds)
        matched_jd.append(matched)

    return matched_resume, matched_jd