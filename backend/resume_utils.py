# Import necessary modules
import os, json, io, fitz  # fitz = PyMuPDF, to install: pip install pymupdf
from flask import jsonify, request, g
from firebase_admin import storage
import openai
from dotenv import load_dotenv

from firebase_config import db, bucket
from llm_utils import llm_parse_text

load_dotenv()
# openai.api_key = os.getenv("OPENAI_PERSONAL_KEY")
openai.api_key = os.getenv("OPENAI_GROUP_PROJECT_KEY")


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

# LLM (OpenAI API) resume parsing API endpoint
def extract_resume_profile_llm():
    doc_id = request.json.get("docID")
    if not doc_id:
        return jsonify({"error":"Missing docID"}), 400
    
    raw = _download_pdf_as_text(g.firebase_user["uid"], doc_id)
    if not raw:
        return jsonify({"error":"Could not retrieve PDF"}), 404
    
    profile = llm_parse_text(text=raw, mode="resume")
    return jsonify(profile), 200

def save_resume_data(resume_data):
    """
    Save resume data to Firebase Firestore.
    :param resume_data: Dictionary containing resume information.
    :return: JSON response indicating success or failure.
    """
    try:
        # Get the user ID from the Firebase authentication context
        user_id = g.firebase_user["uid"]

        # Reference the user's "resumes" collection in Firestore
        resumes_collection = db.collection("users").document(user_id).collection("resumes")

        # Add the resume data to Firestore
        new_resume_ref = resumes_collection.document()  # Create a new document
        new_resume_ref.set(resume_data)  # Save the resume data

        return jsonify({"message": "Resume saved successfully!", "resumeID": new_resume_ref.id}), 200
    except Exception as e:
        print(f"Error saving resume data: {e}")
        return jsonify({"error": "Failed to save resume data"}), 500
    

# Add this new Flask route for saving resumes
# This is the new API endpoint that connects the frontend to the backend
def create_save_resume_route(app):
    """
    Flask route to handle saving resumes.
    :param app: Flask app instance.
    """
    @app.route("/api/save-resume", methods=["POST"])
    def save_resume():
        """
        API endpoint to save resume data.
        Expects JSON data from the frontend.
        """
        resume_data = request.json  # Get the JSON data from the request
        if not resume_data:
            return jsonify({"error": "No resume data provided"}), 400  # Return error if no data is provided

        return save_resume_data(resume_data)  # Call the save_resume_data function to save the data