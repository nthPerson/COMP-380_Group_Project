from flask import Flask, request
from flask_cors import CORS 

from verify_token import verify_firebase_token 
from jd_utils import (
    handle_jd_text, 
    handle_jd_from_url,
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
    extract_resume_profile_llm
)

from keyword_utils import (
    add_keywords,
    remove_keyword,
    get_keywords,
    clear_keywords
)

from llm_utils import (
    generate_targeted_resume
)

# Added new import for saving resume data
from resume_utils import save_resume_data  # Step 4: Added import for saving resume data

app = Flask(__name__) 
CORS(app)

#====================== Job Description Handling ========================================

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

#============================= PDF Management ===========================================
    
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

#====================== Profile (keyword) Extraction ====================================

# Resume profile (skill/experience/etc.) extraction via LLM
@app.route("/api/extract_resume_profile_llm", methods=["POST"])
@verify_firebase_token
def api_extract_resume_profile_llm():
    return extract_resume_profile_llm()

# JD profile (required_skill/responsibilities/etc.) extraction via LLM
@app.route("/api/extract_jd_profile_llm", methods=["POST"])
@verify_firebase_token
def api_jd_profile_llm():
    return extract_jd_profile_llm(request.json.get("jd", ""))

#====================== Selected Keyword Management =====================================

# Get user's list of selected keywords
@app.route("/api/selected_keywords/get", methods=["GET"])
@verify_firebase_token
def api_get_keywords():
    return get_keywords()

# Add a selected keyword to the user's list of keywords
@app.route("/api/selected_keywords/add", methods=["POST"])
@verify_firebase_token
def api_add_keywords():
    return add_keywords()

# Remove a selected keyword from the user's list of keywords
@app.route("/api/selected_keywords/remove", methods=["POST"])
@verify_firebase_token
def api_remove_keyword():
    return remove_keyword()

# Clear the current user's list of keywords
@app.route("/api/selected_keywords/clear", methods=["POST"])
@verify_firebase_token
def api_clear_keywords():
    return clear_keywords()

#====================== Resume Builder Functions ========================================

# Save resume data created using ResumeBuilderForm prompts (also creates 
# and saves a PDF version of the data)
@app.route("/api/save_resume", methods=["POST"])
@verify_firebase_token
def save_resume():
    """
    Save resume data to the database.
    This endpoint receives resume data from the frontend and saves it to the backend.
    """
    resume_data = request.json  # Get the resume data from the request body
    return save_resume_data(resume_data)  # Call the function to save the data

# ====================== Targeted Resume Generation =======================================
@app.route("/api/generate_targeted_resume", methods=["POST"])
@verify_firebase_token
def api_generate_targeted_resume():
    """
    Expects JSON: { docID: string, job_description: string, keywords: [string] }
    Returns: { generated_resume: string } (aka just the plain text of the generated resume)
    """
    return generate_targeted_resume()


#  start the server
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
