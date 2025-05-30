from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# Configure CORS with specific settings
CORS(app)

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    print("GET /api/test called")
    return jsonify({"message": "Backend is Working!"})

@app.route('/api/send', methods=['POST'])
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

#Runs on 5001 to avoid port conflicts with 5000 bc of airplay/airtunes 
if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, host='localhost', port=5001)