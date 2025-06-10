""" pdf_utils.py: all kinds of cool pdf stuff
"""
from flask import jsonify, request, g
from firebase_admin import firestore # Using to record timestamp of PDF upload
from firebase_config import db, bucket
from google.cloud.exceptions import NotFound

from keyword_utils import extract_keywords_from_pdf_bytes

def upload_user_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400 # If the file component is missing from request, return fail code
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400 # If there isn't a file selected in the request, return fail code
    
    user_id = g.firebase_user["uid"] # Gets user ID (g.firebase_user) from verify_firebase_token wrapper
    blob = bucket.blob(f"user_docs/{user_id}/{file.filename}") # Builds filename as user_docs/{user_id}/PDF_filename
    blob.upload_from_file(file, content_type=file.content_type) # Uploads file received from frontend HTTP request to Firebase Cloud Storage bucket

    db.collection("users").document(user_id).collection("documents").add({ # Add new document to the Firestore database under path users/{user_id}/documents/
        "fileName": file.filename,  # Stores the original filename of the PDF
        "storagePath": blob.name,  # Stores the Firebase Cloud Storage path where the file was uploaded
        "uploadedAt": firestore.SERVER_TIMESTAMP  # Stores the upload time, set by Firestore's server
    })
    return jsonify({"message": "File uploaded"}), 200  # If everything worked, returns message and success code

""" Return a list of all uploaded PDFs (metadata only) for the logged-in user """
def list_user_pdfs():
    user_id = g.firebase_user["uid"]  # Get Firebase user ID
    docs_ref = db.collection("users").document(user_id).collection("documents") # Reference all user files
    docs = docs_ref.stream()  # Get all user files
    
    pdf_list = []
    for doc in docs:
        data = doc.to_dict()
        data["docID"] = doc.id  # Include Firestore document ID for later deletion/tagging
        pdf_list.append(data)

    return jsonify(pdf_list)  # Return list of all uploaded PDFs for current user

""" Delete a selected PDF (both metadata and actual file) for the logged-in user """
def delete_user_pdf():
    user_id = g.firebase_user["uid"]  # Get Firebase user ID
    data = request.get_json()  # Create JSON from request data
    doc_id = data.get("docID")  # Get document ID from request data
    if not doc_id:
        return jsonify({"error": "Missing docID"}), 400  # Error if request does not include a document ID
    
    doc_ref = db.collection("users").document(user_id).collection("documents").document(doc_id) # Reference file to delete
    doc = doc_ref.get()  # Get document using reference created above
    if not doc.exists:
        return jsonify({"error": "Document not found"}), 404  # Error if document cannot be found at referenced location
    
    doc_data = doc.to_dict()
    storage_path = doc_data.get("storagePath")  # Get the storage path from Firebase user data
    
    # Delete the PDF from Firebase Storage
    if storage_path:
        blob = bucket.blob(storage_path)
        try:
            blob.delete()
        except Exception as e:
            print(f"Failed to delete storage blob: {e}")


    # Delete the Firestore document
    doc_ref.delete()

    # Check if the deleted PDF was the user's master resume
    user_doc_ref = db.collection("users").document(user_id)
    user_doc = user_doc_ref.get()
    if user_doc.exists:
        master_doc_id = user_doc.to_dict().get("master_resume")
        if master_doc_id == doc_id:
            # Set master_resume to None to prevent deleted file from being used as master resume
            user_doc_ref.update({"master_resume": firestore.DELETE_FIELD})  # This removes the field, effectively nullifying the master_resume reference

    return jsonify({"message": "PDF deleted"}), 200 


def set_master_pdf():
    user_id = g.firebase_user["uid"]  # Get Firebase user ID
    data = request.get_json()  # Create JSON from request data
    doc_id = data.get("docID")  # Get document ID from request data
    if not doc_id:
        return jsonify({"error": "Missing docID"}), 400  # Error if request does not include a document ID
    
    # Verify the document exists for this user
    doc_ref = db.collection("users").document(user_id).collection("documents").document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({"error": "Document not found"}), 404
    
    # Set the user's master resume in their root user document
    db.collection("users").document(user_id).set(
        {"master_resume": doc_id},
        merge=True
    )
    return jsonify({"message": "Master resume set", "master_docID": doc_id}), 200


def get_master_pdf():
    user_id = g.firebase_user["uid"]
    user_doc = db.collection("users").document(user_id).get()
    if user_doc.exists:
        masterDocID = user_doc.to_dict().get("master_resume")
        return jsonify({"masterDocID": masterDocID}), 200
    else:
        return jsonify({"masterDocID": None}), 200


def get_master_pdf_bytes(user_id: str):
    user_doc = db.collection("users").document(user_id).get()  # Get master pdf file from Firestore
    if not user_doc.exists:
        return None
    
    master_doc_id = user_doc.to_dict().get("master_resume")  # Get master resume doc ID from Firebase
    if not master_doc_id:
        return None
    
    doc_ref = db.collection("users").document(user_id).collection("documents").document(master_doc_id) 
    doc = doc_ref.get()  # Get master resume file reference (line above shows path to document)
    if not doc.exists:
        return None
    
    storage_path = doc.to_dict().get("storagePath")
    if not storage_path:
        return None
    blob = bucket.blob(storage_path)  # Gets database location of master resume

    try:
        return blob.download_as_bytes()
    except NotFound:  # Error handling for requests for files that are not found
        return None


def get_master_pdf_keywords():
    user_id = g.firebase_user["uid"]
    pdf_bytes = get_master_pdf_bytes(user_id)
    if not pdf_bytes:
        return jsonify({"error": "Master resume not found"}), 404
    keywords = extract_keywords_from_pdf_bytes(pdf_bytes)
    return jsonify({"keywords": keywords}), 200
