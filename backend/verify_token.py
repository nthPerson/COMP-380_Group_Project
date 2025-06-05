from flask import request, jsonify, g  #requests gives us https headers and g is the flask global object to store the key after verfication 
from firebase_admin import auth
from functools import wraps  #what we use to write decorators 

#this acts as a middleware file for token validation to keep the endpoints clean af in app.py
def verify_firebase_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")  # Grab the token from the header

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        id_token = auth_header.split(" ")[1]

        try:
            decoded_token = auth.verify_id_token(id_token)  # verify token via Firebase
            g.firebase_user = decoded_token  # attach user info to flasks global context
        except Exception as e:
            return jsonify({"error": f"Invalid ID token: {e}"}), 401

        return f(*args, **kwargs)

    return wrapper

'''
The code here is python decorator meaning we it's a function that warps another function to improve it's functionality or
enhance it's behavior without changing the original code, we use it by prefixing the function with an @ sign.
In the case here, this acts as a middle man between the routes by validating ID tokens, it checks with auth to make sure the Authorization 
header contains a Brearer token and verifies it with firebase sdk. it also attached the decoded user info to the golabal varibale in 
flask if the token is missing or invalid it reponds with 401 and does not grant acess.

think of this like a bouncer checking ID, if ur over 21 it let's u use the function if not it tells u 401 lol.

'''