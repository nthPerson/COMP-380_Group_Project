from flask import Flask, jsonify, request, g
from flask_cors import CORS #this enables us to make cross origin requests 
from firebase_config import db  # this initializes Firebase & gives us the
from verify_token import verify_firebase_token #what we use to verify the token we made this file 
from gemini_utils import explain_jd_with_gemini, explain_jd_with_url #use geminiiiiiiiiiiii

from jd_utils import get_jd_from_url
from keyword_utils import extract_keywords_from_text
from pdf_utils import (
    upload_user_pdf, 
    list_user_pdfs, 
    delete_user_pdf,
    set_master_pdf, 
    get_master_pdf,
    get_master_pdf_keywords
)


app = Flask(__name__) #makes an instance of the flask app 
CORS(app)

@app.route("/api/jd", methods =["POST"])
@verify_firebase_token
def receive_jd():
    jd = request.get_json().get("jd", "")
    print("Received JD:\n", jd)
    try:
        explanation = explain_jd_with_gemini(jd)
        # return jsonify({"message": "JD received", "explanation": explanation}), 200
        keywords = extract_keywords_from_text(jd)
        return jsonify({"message": "JD received", "explanation": explanation, "keywords": keywords}), 200
    except Exception as e:
        # return jsonify({"error": f"Gemini failed: {e}"}), 500 
        return jsonify({"error": f"Gemini or keyword extraction failed: {e}"}), 500 

@app.route("/api/jd_from_url", methods=["POST"])
@verify_firebase_token
def receive_jd_url():
    url = request.get_json().get("url", "")
    print(f"url recieved: {url}")
    jd = get_jd_from_url(url)
    if jd:
        try:
            explanation = explain_jd_with_url(jd) 
            # return jsonify({"message": "JD received", "explanation": explanation}), 200
            keywords = extract_keywords_from_text(jd)
            return jsonify({"message": "JD received", "explanation": explanation, "keywords": keywords}), 200
        except Exception as e:
            # return jsonify({"error": f"Gemini failed: {e}"}), 500
            return jsonify({"error": f"Gemini or keyword extraction failed: {e}"}), 500
    else:
        return jsonify({"error": "Failed to fetch JD from URL"}), 400
    
        
    
# Upload user PDF
@app.route("/api/upload_pdf", methods=["POST"])
@verify_firebase_token
def upload_pdf():
    return upload_user_pdf()

# List all user PDFs
@app.route("/api/list_pdfs", methods=["GET"])
@verify_firebase_token
def api_list_pdfs():
    return list_user_pdfs()

# Delete a user PDF
@app.route("/api/delete_pdf", methods=["POST"])
@verify_firebase_token
def api_delete_pdf():
    return delete_user_pdf()

# Set master PDF
@app.route("/api/set_master_pdf", methods=["POST"])
@verify_firebase_token
def api_set_master_pdf():
    return set_master_pdf()

# Get master PDF
@app.route("/api/get_master_pdf", methods=["GET"])
@verify_firebase_token
def api_get_master_pdf():
    return get_master_pdf()

# Extract keywords from the user's master resume
@app.route("/api/master_resume_keywords", methods=["GET"])
@verify_firebase_token
def api_master_resume_keywords():
    return get_master_pdf_keywords()

#  start the server
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
