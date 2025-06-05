import os, base64, tempfile # OS is operating system inteface, base64 is for decoding the API Key, temp file let's u make a new temporary file :))
import firebase_admin  
from firebase_admin import credentials, firestore #firebase admin packages 
from dotenv import load_dotenv #this is what reads the .env file for the key 

#loads the .env to read the key from it 
load_dotenv()

b64_key = os.getenv("FIREBASE_KEY_B64")
if not b64_key:
    raise ValueError("Missing Firebase base 64 key") #raise and exception if the key is not there and crash the app

decoded_key = base64.b64decode(b64_key) #decode the key
with tempfile.NamedTemporaryFile(delete=False) as tmp: #write the key into a temp file so it acts like .json 
    tmp.write(decoded_key)
    tmp_path = tmp.name


cred = credentials.Certificate(tmp_path) #decoded .json key here, get the firebase credentials from that using firebase
firebase_admin.initialize_app(cred) #initalize a firebase admin account with the key 
db = firestore.client() #this gives us access to the firbase database 

