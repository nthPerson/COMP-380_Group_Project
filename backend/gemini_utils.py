import os 
import google.generativeai as genai #gemini packages 
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("Missing gemini api key in the backedn .env")

genai.configure(api_key=api_key) #configure gemini

def explain_jd_with_gemini(jd_text):
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    prompt = f"Can you clearly explain this job description to a student in simple terms and tell them what they will be doing and what they need to know? keep your response short and consice.\n\n{jd_text}"
    response = model.generate_content(prompt)
    return response.text.strip()

