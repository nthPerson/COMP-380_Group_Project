import io
from flask import request, jsonify, g
from firebase_config import db, bucket
from firebase_admin import firestore
import time


def upload_profile_picture():
    """
    Expects a multipart/form-data POST with:
      - profile_picture (file, optional)
      - username (string)
      - email (string)
    Or a JSON payload with:
      - name
      - education
      - experience
    """
    user_id = g.firebase_user["uid"]

    if request.content_type and request.content_type.startswith("multipart/form-data"):
        # Handle profile picture form upload
        username = request.form.get("username")
        email = request.form.get("email")
        file = request.files.get("profile_picture")

        data = {}
        if username:
            data["username"] = username
        if email:
            data["email"] = email

        if file:
            ext = file.filename.rsplit(".", 1)[-1]
            timestamp = int(time.time())
            path = f"user_profile_pictures/{user_id}/{timestamp}.{ext}"
            blob = bucket.blob(path)
            blob.upload_from_file(file, content_type=file.content_type)
            blob.make_public()
            data["photoURL"] = blob.public_url

        if data:
            profile_ref = (
                db.collection("users")
                .document(user_id)
                .collection("meta")
                .document("profile")
            )
            profile_ref.set(data, merge=True)

        return jsonify({"message": "Profile updated", **data}), 200

    # Handle raw JSON profile info (e.g., name, education, experience)
    data = request.get_json() or {}
    required_fields = ["name", "education", "experience"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    doc_ref = db.collection("users").document(user_id)
    doc_ref.set(data, merge=True)

    return jsonify({"message": "Profile updated"}), 200


def get_user_profile():
    """
    Returns the user’s profile metadata:
      { name, education, experience, username, email, photoURL }
    """
    user_id = g.firebase_user["uid"]
    profile_ref = (
        db.collection("users").document(user_id).collection("meta").document("profile")
    )

    doc = profile_ref.get()

    if not doc.exists:
        return (
            jsonify(
                {
                    "name": None,
                    "education": None,
                    "experience": None,
                    "username": None,
                    "email": None,
                    "photoURL": None,
                }
            ),
            200,
        )

    # Ensure JSON-safe output even if mocked in tests
    try:
        profile_data = doc.to_dict()
    except Exception:
        profile_data = {}

    if not isinstance(profile_data, dict):
        profile_data = {}

    return jsonify(profile_data), 200
