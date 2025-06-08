from flask import Flask, jsonify, request, g
from flask_cors import CORS #this enables us to make cross origin requests 
from firebase_config import db, bucket  # this initializes Firebase & gives us the ... - @nthPerson testing cloud storage for PDF uploads
from firebase_admin import firestore # Using to record timestamp of PDF upload
from verify_token import verify_firebase_token #what we use to verify the token we made this file 
from gemini_utils import explain_jd_with_gemini, explain_jd_with_url #use geminiiiiiiiiiiii
from jd_utils import get_jd_from_url


app = Flask(__name__) #makes an instance of the flask app 
CORS(app)

@app.route("/api/jd", methods =["POST"])
@verify_firebase_token
def receive_jd():
    jd = request.get_json().get("jd", "")
    print("Received JD:\n", jd)
    try:
        explanation = explain_jd_with_gemini(jd)
        return jsonify({"message": "JD received", "explanation": explanation}), 200
    except Exception as e:
        return jsonify({"error": f"Gemini failed: {e}"}), 500 

@app.route("/api/jd_from_url", methods=["POST"])
@verify_firebase_token
def receive_jd_url():
    url = request.get_json().get("url", "")
    print(f"url recieved: {url}")
    jd = get_jd_from_url(url)
    if jd:
        try:
            explanation = explain_jd_with_url(jd) 
            return jsonify({"message": "JD received", "explanation": explanation}), 200
        except Exception as e:
            return jsonify({"error": f"Gemini failed: {e}"}), 500
    else:
        return jsonify({"error": "Failed to fetch JD from URL"}), 400
    
        
    

@app.route("/api/upload_pdf", methods=["POST"])
@verify_firebase_token
def upload_pdf():
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

#  start the server
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
