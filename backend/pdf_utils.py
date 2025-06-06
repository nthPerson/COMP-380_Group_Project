""" pdf_utils.py: all kinds of cool pdf stuff
"""
from flask import jsonify, request, g
from firebase_admin import firestore # Using to record timestamp of PDF upload
from firebase_config import db, bucket

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