from flask import Flask, jsonify, request, g
from flask_cors import CORS 

from firebase_config import db 
from verify_token import verify_firebase_token 
from jd_utils import (
    handle_jd_text, 
    handle_jd_from_url,
    extract_skills_from_jd_text,
    extract_skills_from_jd_url,
    # extract_skills_from_jd_text_llm,
    # extract_skills_from_jd_url_llm,
    extract_jd_profile_url_llm,
    extract_jd_profile_text_llm,
    extract_jd_profile_llm
)
from pdf_utils import (
    upload_user_pdf, 
    list_user_pdfs, 
    delete_user_pdf, 
    set_master_pdf, 
    get_master_pdf
)
from resume_utils import (
    extract_skills_from_pdf, 
    # extract_skills_from_pdf_llm,
    extract_resume_profile_llm
)


app = Flask(__name__) 
CORS(app)

# Get Gemini explanation from text
@app.route("/api/jd", methods =["POST"])
@verify_firebase_token
def receive_jd():
    return handle_jd_text(request.get_json().get("jd", ""))

# Get Gemini explanation from URL
@app.route("/api/jd_from_url", methods=["POST"])
@verify_firebase_token
def receive_jd_url():
    return handle_jd_from_url(request.get_json().get("url", ""))
    
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

# # Extract skills from master PDf using local NLP
# @app.route("/api/extract_resume_skills", methods=["POST"])
# @verify_firebase_token
# def api_extract_resume_skills():
#     return extract_skills_from_pdf()

@app.route("/api/extract_resume_profile_llm", methods=["POST"])
@verify_firebase_token
def api_extract_resume_profile_llm():
    return extract_resume_profile_llm()

# JD skill/responsibility/etc. extraction via LLM
@app.route("/api/jd_profile_llm", methods=["POST"])
@verify_firebase_token
def api_jd_profile_llm():
    return extract_jd_profile_llm(request.json.get("jd", ""))

# # JD skill/responsibility/etc. extraction via LLM
# @app.route("/api/jd_profile_text_llm", methods=["POST"])
# @verify_firebase_token
# def api_jd_profile_text_llm():
#     return extract_jd_profile_text_llm(request.json.get("jd", ""))

# # DO NOT WANT TO USE THIS FUNCTION BECAUSE IT DUPLICATES THE URL SCRAPE OPERATION
# @app.route("/api/jd_profile_url_llm", methods=["POST"])
# @verify_firebase_token
# def api_jd_profile_url_llm():
#     return extract_jd_profile_url_llm(request.json.get("url", ""))

#  start the server
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
