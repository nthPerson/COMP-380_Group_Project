from flask import jsonify, request, g, Response
import json
import time


# In-memory storage (aka does not persist over user sessions) that maps userID's to selected keywords
_selected_keywords = {}

# Add one or more keywords to the user's current selection of keywords that 
# were extracted form the job description or their resume
def add_keywords():
    user_id = g.firebase_user["uid"]
    keywords = request.get_json().get("keywords", [])

    if user_id not in _selected_keywords:
        _selected_keywords[user_id] = set()

    for word in keywords:
        _selected_keywords[user_id].add(word)
    
    return jsonify({"keywords": list(_selected_keywords[user_id])}), 200


# Remove a keyword from the user's list of selected keywords
def remove_keyword():
    user_id = g.firebase_user["uid"]
    keyword = request.get_json().get("keyword")

    if keyword and user_id in _selected_keywords:
        _selected_keywords[user_id].discard(keyword)
    
    return jsonify({"keywords": list(_selected_keywords.get(user_id, set()))}), 200


# Return the user's currently selected keywords
def get_keywords():
    user_id = g.firebase_user["uid"]
    return jsonify({"keywords": list(_selected_keywords.get(user_id, set()))}), 200


# Clear all selected keywords for this user
def clear_keywords():
    user_id = g.firebase_user["uid"]
    _selected_keywords[user_id] = set()
    return jsonify({"keywords": []}), 200


# Server-Sent Event stream that provides an automatically-updated list of selected 
# keywords to frontend. Clients can open an EventSource to this URL and get pushed 
# updates whenever the set of keywords changes.
def stream_selected_keywords():
    user_id = g.firebase_user["uid"]

    def event_stream():
        prev_list = None
        while True:
            current_list = list(_selected_keywords.get(user_id, set()))
            # Only send when there is a change:
            if current_list != prev_list:
                # Note that SSE (server-sent event) requirea a 'data:' prefix and double newline
                yield f"data: {json.dumps({'keywords': current_list})}\n\n"
                prev_list = current_list
            time.sleep(1)
    
    return Response(event_stream(), mimetype="text/event-stream")

