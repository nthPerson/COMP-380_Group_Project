from flask import Flask, jsonify, request, g
from flask_cors import CORS #this enables us to make cross origin requests 
from firebase_config import db  # this initializes Firebase & gives us the 
from verify_token import verify_firebase_token #what we use to verify the token we made this file 
from gemini_utils import explain_jd_with_gemini #use geminiiiiiiiiiiii


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


#  start the server
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
