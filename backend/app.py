from flask import Flask, jsonify, request, g
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
from functools import wraps
import os
import base64
import tempfile
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# ─── Load environment variables from .env ────────────────────────────────────────
load_dotenv()  # Expects FIREBASE_KEY_B64 to be set in backend/.env

# ─── Decode the base64 service-account key and initialize Firebase Admin ───────
b64_key = os.getenv("FIREBASE_KEY_B64")
if not b64_key:
    raise ValueError("FIREBASE_KEY_B64 is not set in the environment")

decoded_key = base64.b64decode(b64_key)

# Write the decoded JSON to a temporary file so Firebase Admin can read it
with tempfile.NamedTemporaryFile(delete=False) as tmp:
    tmp.write(decoded_key)
    tmp_path = tmp.name

# Initialize Firebase Admin using the temporary JSON file
cred = credentials.Certificate(tmp_path)
firebase_admin.initialize_app(cred)

# ─── Initialize Firestore client ────────────────────────────────────────────────
db = firestore.client()


# ─── Token Verification Decorator ───────────────────────────────────────────────
def verify_firebase_token(f):
    """
    Decorator to:
      1. Read 'Authorization: Bearer <ID_TOKEN>' header
      2. Verify the ID token via firebase_admin.auth.verify_id_token
      3. Attach the decoded token payload to g.firebase_user
      4. Return 401 if missing/invalid
    """

    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        id_token = auth_header.split(" ")[1]
        try:
            decoded_token = auth.verify_id_token(id_token)
            g.firebase_user = decoded_token
        except Exception as e:
            return jsonify({"error": f"Invalid ID token: {e}"}), 401

        return f(*args, **kwargs)

    return wrapper


# ─── POST /api/profile: Create or Update (Upsert) a User Profile ────────────────
@app.route("/api/profile", methods=["POST"])
@verify_firebase_token
def upsert_profile():
    """
    Expects:
      - A valid Firebase ID token in Authorization header
      - JSON body with the fields to store for this user (e.g. {"displayName": "...", "favoriteColor": "..."}).

    Writes (or merges) the given data into Firestore at users/{uid}.
    """
    uid = g.firebase_user.get("uid")
    if not uid:
        return jsonify({"error": "Missing Firebase UID"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    user_doc_ref = db.collection("users").document(uid)
    try:
        # merge=True will create the document if it does not exist, or update existing fields
        user_doc_ref.set(data, merge=True)
    except Exception as e:
        return jsonify({"error": f"Could not write to Firestore: {e}"}), 500

    return jsonify({"message": f"Profile saved for uid: {uid}"}), 200


# ─── GET /api/profile: Retrieve a User Profile ─────────────────────────────────
@app.route("/api/profile", methods=["GET"])
@verify_firebase_token
def get_profile():
    """
    Expects:
      - A valid Firebase ID token in Authorization header.

    Fetches the Firestore document at users/{uid} and returns its contents.
    If the document does not exist, returns an empty JSON object.
    """
    uid = g.firebase_user.get("uid")
    if not uid:
        return jsonify({"error": "Missing Firebase UID"}), 400

    user_doc_ref = db.collection("users").document(uid)
    try:
        doc_snapshot = user_doc_ref.get()
    except Exception as e:
        return jsonify({"error": f"Error reading Firestore: {e}"}), 500

    if not doc_snapshot.exists:
        return jsonify({}), 200

    return jsonify(doc_snapshot.to_dict()), 200


# ─── Example Protected Endpoint ─────────────────────────────────────────────────
@app.route("/protected", methods=["GET"])
@verify_firebase_token
def protected_endpoint():
    """
    A simple example endpoint to confirm token verification works.
    Returns the user email and UID.
    """
    user_info = g.firebase_user
    return (
        jsonify(
            {
                "message": f"Hello, {user_info.get('email')}! You have a valid token.",
                "uid": user_info.get("uid"),
            }
        ),
        200,
    )


# ─── Run server ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host="localhost", port=5001)
