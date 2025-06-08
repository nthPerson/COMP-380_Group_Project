import os 
import google.generativeai as genai #gemini packages 
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("Missing gemini api key in the backedn .env")

genai.configure(api_key=api_key) #configure gemini
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def explain_jd_with_gemini(jd_text):
    prompt = f"Can you clearly explain this job description to a student in simple terms and tell them what they will be doing and what they need to know? keep your response short and consice.\n\n{jd_text}"
    response = model.generate_content(prompt)
    return response.text.strip()


def explain_jd_with_url(jd_text):
    prompt = f"This Job description is extracted from the URL, please explain the job description and extract the keywords needed to by pass ATS. Give a breif explanation of the job and extract just the keywords and no extra infromation. If the job description is gibberish and doesn't make sense please prompt the user to copy and paste the job description.\n\n{jd_text}"
    response = model.generate_content(prompt)
    return response.text.strip()

