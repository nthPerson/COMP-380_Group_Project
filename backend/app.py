from flask import Flask, jsonify, request, g
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
import os
import base64
import tempfile
from dotenv import load_dotenv

app = Flask(__name__)

# ─── Load environment variables from .env ────────────────────────────────────────
load_dotenv()  # Reads backend/.env and sets FIREBASE_KEY_B64

# ─── Decode the base64 service-account key and initialize Firebase Admin ───────
b64_key = os.environ.get("FIREBASE_KEY_B64")
if not b64_key:
    raise RuntimeError("FIREBASE_KEY_B64 not set in .env")

# Decode the base64 string into bytes
key_bytes = base64.b64decode(b64_key)

# Write the bytes to a temporary file (this file is not tracked by Git)
tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
tmp.write(key_bytes)
tmp.flush()

# Initialize Firebase Admin using the temporary JSON file
cred = credentials.Certificate(tmp.name)
firebase_admin.initialize_app(cred)

# Enable CORS for all routes
CORS(app)


# ─── Token‐verification decorator ────────────────────────────────────────────────
def verify_firebase_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        id_token = header.split("Bearer ")[1]
        try:
            decoded_token = auth.verify_id_token(id_token)
            # Attach the decoded token to flask.g
            g.firebase_user = decoded_token
        except Exception as e:
            return (
                jsonify({"error": "Invalid or expired token", "details": str(e)}),
                401,
            )

        return f(*args, **kwargs)

    return wrapper


# ─── Public endpoint (no-auth) ──────────────────────────────────────────────────
@app.route("/api/test", methods=["GET"])
def test_endpoint():
    print("GET /api/test called")
    return jsonify({"message": "Backend is Working!"})


# ─── Unprotected POST endpoint ──────────────────────────────────────────────────
@app.route("/api/send", methods=["POST"])
def receive_data():
    print(f"Request method: {request.method}")
    print(f"Request headers: {dict(request.headers)}")

    try:
        data = request.json
        print(f"Received JSON data: {data}")

        if data is None:
            print("No JSON data received")
            return jsonify({"error": "No JSON data provided"}), 400

        return jsonify({"status": "received", "data": data})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# ─── Protected endpoint requiring a valid Firebase token ────────────────────────
@app.route("/api/protected", methods=["GET"])
@verify_firebase_token
def protected_endpoint():
    user_info = g.firebase_user
    return jsonify(
        {
            "message": f"Hello, {user_info.get('email')}! You have a valid token.",
            "uid": user_info.get("uid"),
        }
    )


# ─── Run server ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
