import os, json, io, fitz  # fitz = PyMuPDF, to install: pip install pymupdf
import pdfplumber
from flask import jsonify, request, g
from firebase_admin import storage
import openai
from dotenv import load_dotenv

from verify_token import verify_firebase_token
from firebase_config import db, bucket
from skill_utils import extract_skills

load_dotenv()
openai.api_key = os.getenv("OPENAI_PERSONAL_KEY")

# Extract skills using local NLP
def extract_skills_from_pdf():
    # Get docID from POST request body
    data = request.get_json() or {}
    doc_id = data.get("docID")
    if not doc_id:
        return jsonify({"error": "Missing docID"}), 400
    
    # Lookup Firestore metadata for this docID
    user_id = g.firebase_user["uid"]
    doc_ref = db.collection("users").document(user_id).collection("documents").document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({"error": "Document not found"}), 400
    
    storage_path = doc.to_dict().get("storagePath")
    if not storage_path:
        return jsonify({"error": "No storagePath found"}), 400
    
    # Download PDF to memory and extract text
    blob = bucket.blob(storage_path)
    pdf_bytes = blob.download_as_bytes()
    text = ""
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    # Extract skills using PhraseMatcher
    skills = extract_skills(text)
    return jsonify({"skills": skills})

# Download a PDF from Firebase Storage and return the text within TODO: move to pdf_utils.py
def _download_pdf_as_text(user_id: str, doc_id: str) -> str:
    # Fetch the PDF bytes from Firebase Storage and return as plain text
    bucket = storage.bucket()  # Identify Firebase storage bucket for our project
    doc = db.collection("users").document(user_id).collection("documents").document(doc_id).get()  # Get document
    if not doc.exists:
        return ""
    
    blob_path = doc.to_dict()["storagePath"]
    pdf_bytes = bucket.blob(blob_path).download_as_bytes()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = "\n".join(page.get_text() for page in doc)
    
    return text

# Extract skills using OpenAI api and output as JSON array
def llm_extract_skills(text: str) -> list[str]:
    # Call GPT-4o-mini with a constrained JSON-array schema (makes LLM output structured data)    
    prompt = (  # Just like any other promopt we would give to ChatGPT 
    "Extract all job-related skills, technologies, or domain-specific phrases that *literally appear* in the following text. "
    "Return a JSON object with a single field 'skills' containing an array of strings. "
    "Example: {\"skills\": [\"Python\", \"Data Analysis\", \"Machine Learning\"]}\n\n"
    f"Text:\n{text}"
    )

    schema = {  # What we want the shape of the data to be in the response
    "type": "object",
    "properties": {
        "skills": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["skills"],
    "additionalProperties": False
    }


    response = openai.chat.completions.create(  # How we set what kind of GPT model we want to use and how it should respond
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a resume-parsing service."},
            {"role": "user", "content": prompt}],
            response_format={
                "type": "json_schema", 
                "json_schema": {
                    "name": "skills",
                    "schema": schema
                }
            },
            max_tokens=512,
            temperature=0
    )
    
    api_response = json.loads(response.choices[0].message.content)  # Not actually sure why we have to specify the first element of the response (maybe it returns multiple options?)

    return api_response["skills"]


# Flask endopoint used in our app's API
def extract_skills_from_pdf_llm():
    doc_id = request.json.get("docID")
    if not doc_id:
        return jsonify({"error":"Missing docID"}), 400
    
    raw_text = _download_pdf_as_text(g.firebase_user["uid"], doc_id)
    if not raw_text:
        return jsonify({"error":"Could not retrieve PDF"}), 404
    
    skills = llm_extract_skills(raw_text)

    return jsonify({"skills": skills}), 200


