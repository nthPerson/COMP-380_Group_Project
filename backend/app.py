from flask import Flask, jsonify, request, g
from flask_cors import CORS 
from firebase_config import db 
from verify_token import verify_firebase_token 
from jd_utils import handle_jd_text, handle_jd_from_url
from pdf_utils import upload_user_pdf, list_user_pdfs, delete_user_pdf, set_master_pdf, get_master_pdf


app = Flask(__name__) 
CORS(app)

# Get Gimini Explanation from Text
@app.route("/api/jd", methods =["POST"])
@verify_firebase_token
def receive_jd():
    return handle_jd_text(request.get_json().get("jd", ""))

# Get Gimini Explanation from URL
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

#  start the server
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
