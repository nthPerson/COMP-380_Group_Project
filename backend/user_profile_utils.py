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
    Stores the image in Storage under user_profile_pictures/{uid}/{timestamp}.{ext},
    makes it public, and writes URL + metadata to Firestore under users/{uid}/profile.
    """
    user_id = g.firebase_user["uid"]
    # get form fields
    username = request.form.get("username")
    email    = request.form.get("email")
    file     = request.files.get("profile_picture")

    data = {}
    if username:
        data["username"] = username
    if email:
        data["email"] = email

    if file:
        # build a unique path
        ext = file.filename.rsplit(".", 1)[-1]
        timestamp = int(time.time())
        path = f"user_profile_pictures/{user_id}/{timestamp}.{ext}"
        blob = bucket.blob(path)
        blob.upload_from_file(file, content_type=file.content_type)
        # make public (or you can generate signed URLs instead)
        blob.make_public()
        data["photoURL"] = blob.public_url

    if data:
        # write/update the single document users/{uid}/profile
        profile_ref = db.collection("users").document(user_id).collection("meta").document("profile")
        profile_ref.set(data, merge=True)

    return jsonify({"message": "Profile updated", **data}), 200


def get_user_profile():
    """
    Returns the user’s profile metadata:
      { username, email, photoURL }
    """
    user_id = g.firebase_user["uid"]
    profile_ref = db.collection("users").document(user_id).collection("meta").document("profile")
    doc = profile_ref.get()
    if not doc.exists:
        return jsonify({"username": None, "email": None, "photoURL": None}), 200
    return jsonify(doc.to_dict()), 200
