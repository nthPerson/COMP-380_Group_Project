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
    prompt = f"This is a job description, please explain the job description, give a breif explanation of the job in a paragraph. If the job description is gibberish and doesn't make sense please prompt the user to try again.\n\n{jd_text}"
    response = model.generate_content(prompt)
    return response.text.strip()


def explain_jd_with_url(jd_text):
    prompt = f"This Job description is extracted from the URL, please explain the job description. Give a breif explanation of the job in a paragraph. If the job description is gibberish and doesn't make sense please prompt the user to copy and paste the job description.\n\n{jd_text}"
    response = model.generate_content(prompt)
    return response.text.strip()

