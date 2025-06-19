# Import necessary modules
import os, json, io, fitz  # fitz = PyMuPDF, to install: pip install pymupdf
from flask import jsonify, request, g
from firebase_admin import storage, firestore
import openai
from dotenv import load_dotenv
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet

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


# Generate a PDF document from resume data and return the PDF bytes
def _generate_resume_pdf(resume_data: dict) -> bytes:
    styles = getSampleStyleSheet()
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elems = []

    personal = resume_data.get("personalInfo", {})
    full_name = f"{personal.get('firstName', '')} {personal.get('lastName', '')}".strip()
    if full_name:
        elems.append(Paragraph(full_name, styles['Title']))
    contact_parts = []
    if personal.get('email'):
        contact_parts.append(personal['email'])
    if personal.get('phone'):
        contact_parts.append(personal['phone'])
    if contact_parts:
        elems.append(Paragraph(" | ".join(contact_parts), styles['Normal']))
    if personal.get('address'):
        elems.append(Paragraph(personal['address'], styles['Normal']))
    if personal.get('linkedin'):
        elems.append(Paragraph(personal['linkedin'], styles['Normal']))
    if personal.get('portfolio'):
        elems.append(Paragraph(personal['portfolio'], styles['Normal']))
    elems.append(Spacer(1, 12))

    if resume_data.get('summary'):
        elems.append(Paragraph('Summary', styles['Heading2']))
        elems.append(Paragraph(resume_data['summary'], styles['Normal']))
        elems.append(Spacer(1, 12))
    
    work = resume_data.get('workExperience', [])
    if work:
        elems.append(Paragraph('Work Experience', styles['Heading2']))
        for exp in work:
            position = f"{exp.get('position','')} at {exp.get('company','')}".strip()
            elems.append(Paragraph(position, styles['Heading3']))
            dates = f"{exp.get('startDate','')} - {'Present' if exp.get('current') else exp.get('endDate','')}"
            elems.append(Paragraph(dates, styles['Italic']))
            if exp.get('description'):
                elems.append(Paragraph(exp['description'], styles['Normal']))
            elems.append(Spacer(1, 6))
        elems.append(Spacer(1, 12))
    
    edu = resume_data.get('education', [])
    if edu:
        elems.append(Paragraph('Education', styles['Heading2']))
        for ed in edu:
            degree = f"{ed.get('degree','')} in {ed.get('field','')}".strip()
            elems.append(Paragraph(degree, styles['Heading3']))
            if ed.get('institution'):
                elems.append(Paragraph(ed['institution'], styles['Normal']))
            if ed.get('gpa'):
                elems.append(Paragraph(f"GPA: {ed['gpa']}", styles['Normal']))
            elems.append(Spacer(1, 6))
        elems.append(Spacer(1, 12))

    skills = resume_data.get('skills', {})
    if skills.get('technical') or skills.get('soft'):
        elems.append(Paragraph('Skills', styles['Heading2']))
        if skills.get('technical'):
            elems.append(Paragraph('Technical: ' + ', '.join(skills['technical']), styles['Normal']))
        if skills.get('soft'):
            elems.append(Paragraph('Soft: ' + ', '.join(skills['soft']), styles['Normal']))
        elems.append(Spacer(1, 12))

    doc.build(elems)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


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

        # TODO removed this code block during implementation of resume data -> PDF save stuff
        # # Add the resume data to Firestore
        # new_resume_ref = resumes_collection.document()  # Create a new document
        # new_resume_ref.set(resume_data)  # Save the resume data

        # Create a name for the PDF file using user data
        custom_name = resume_data.get("fileName")

        new_resume_ref = resumes_collection.document()
        new_resume_ref.set(resume_data)

        resume_id = new_resume_ref.id

        first = resume_data.get("personalInfo", {}).get("firstName", "")
        last = resume_data.get("personalInfo", {}).get("lastName", "")
        default_name = f"{first}_{last}_auto_resume{resume_id}.pdf".replace(" ", "_")
        file_name = (custom_name.strip() + (".pdf" if not custom_name.lower().endswith(".pdf") else "")) if custom_name else default_name

        pdf_bytes = _generate_resume_pdf(resume_data)

        blob = bucket.blob(f"user_docs/{user_id}/{file_name}")
        blob.upload_from_string(pdf_bytes, content_type="application/pdf")

        doc_ref = db.collection("users").document(user_id).collection("documents").document()
        doc_ref.set({
            "fileName": file_name,
            "storagePath": blob.name,
            "uploadedAt": firestore.SERVER_TIMESTAMP,
            "resumeID": resume_id,
        })

        # return jsonify({"message": "Resume saved successfully!", "resumeID": new_resume_ref.id}), 200
        return jsonify({"message": "Resume saved successfully!", "resumeID": resume_id, "pdfFile": file_name}), 200
    except Exception as e:
        print(f"Error saving resume data: {e}")
        return jsonify({"error": "Failed to save resume data"}), 500




