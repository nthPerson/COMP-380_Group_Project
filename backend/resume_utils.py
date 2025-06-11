import io
import pdfplumber
from flask import jsonify, request, g

from firebase_config import db, bucket
from skill_utils import extract_skills


def extract_skills_from_pdf():
    # Get docID from POST request body
    data = request.get_json() or {}
    doc_id = data.get("docID")
    if not doc_id:
        return jsonify({"error": "Missing docID"}), 400
    
    # Lookup Firestore metadata for this docID
    user_id = g.firebase_user["uid"]
    doc_ref = db.collection("users").document(user_id).collection("documents").docuement(doc_id)
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



