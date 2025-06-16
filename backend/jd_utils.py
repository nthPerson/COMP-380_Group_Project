from typing import Optional, Dict, Any
from ScraplingScraper import scrape 
import json
from gemini_utils import explain_jd_with_gemini, explain_jd_with_url
from flask import jsonify, request, g
from typing import Tuple

from skill_utils import extract_skills
from llm_utils import llm_parse_text

def scrape_jd(url:str)-> Optional[str]:
    """Scrape the web for the JD using Link"""
    jd = scrape(url)
    return jd if jd else None

def handle_jd_text(jd_text: str) -> Tuple:
    # Generate explanation
    try:
        explanation = explain_jd_with_gemini(jd_text)
    except Exception as e:
        return jsonify({"error": f"Gemini failed: {str(e)}"}), 500

    # Return the explantion and the extracted skills
    return jsonify({
        "message": "JD processed from plain text",
        "job_description": jd_text,
        "explanation": explanation,
    }), 200


def handle_jd_from_url(url: str) -> Tuple:
    # Scrape job description
    jd_text = scrape(url)
    if not jd_text:
        return jsonify({"error": "Failed to fetch JD from URL"}), 400
    
    # Generate explanation
    try:
        explanation = explain_jd_with_url(jd_text)
    except Exception as e:
        return jsonify({"error": f"Gemini failed: {str(e)}"}), 500

    return jsonify({
        "message": "JD processed from URL",
        "job_description": jd_text,
        "explanation": explanation,
    }), 200

# LLM (OpenAI API) job description profile parsing API endpoint (only handles text requests)
def extract_jd_profile_llm(jd_text: str):
    if jd_text == "":
        return jsonify({"error": f"Text sent to JD profile extractor is empty"}), 400
    try:
        profile = llm_parse_text(jd_text, mode="jd")
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({"error":f"LLM failed: {e}"}), 500


# # Local NLP skill extraction on free text JD
# def extract_skills_from_jd_text(jd_text: str):
#     try:
#         skills = extract_skills(jd_text)
#         return jsonify({"skills": skills}), 200
#     except Exception as e:
#         return jsonify({"error": f"Failed to extract skills from JD text: {e}"}), 501
    

# # Local NLP skill extraction on URL JD
# def extract_skills_from_jd_url(url: str):
#     jd_text = scrape_jd(url)
#     if not jd_text:
#         return jsonify({"error": "Failed to fetch JD from URL"}), 400
#     try:
#         skills = extract_skills(jd_text)
#         return jsonify({"skills": skills}), 200
#     except Exception as e:
#         return jsonify({"error": f"Failed to extract skills from JD URL: {e}"}), 501
    

# # LLM (OpenAI API) job description text parsing API endpoint
# # DO NOT WANT TO USE THIS FUNCTION BECAUSE IT DUPLICATES THE URL SCRAPE OPERATION
# def extract_jd_profile_url_llm(url: str):
#     jd = scrape(url)
#     if not jd:
#         return jsonify({"error":"Failed to fetch JD from URL"}), 400
#     try:
#         profile = llm_parse_text(jd, mode="jd")
#         return jsonify(profile), 200
#     except Exception as e:
#         return jsonify({"error":f"LLM failed: {e}"}), 500


# # LLM (OpenAI API) job description URL parsing API endpoint
# def extract_jd_profile_text_llm(jd_text: str):
#     if jd_text == "":
#         return jsonify({"error": f"Text sent to JD profile extractor is empty"}), 400
#     try:
#         profile = llm_parse_text(jd_text, mode="jd")
#         return jsonify(profile), 200
#     except Exception as e:
#         return jsonify({"error":f"LLM failed: {e}"}), 500
    

#--------------------------------- Tests ----------------------------------------
# from JobDescriptionScraper import JobDescriptionScraper
# old_scraper = JobDescriptionScraper()
# import time 
# import logging
# import io
# from contextlib import redirect_stdout
# f = io.StringIO()
# urls = ["https://www.linkedin.com/jobs/view/4232548077/?alternateChannel=search&refId=HVrFn9OfqHQYgRv1nhxcqQ%3D%3D&trackingId=tlCfiGkWGuG5C5FtuqbfFQ%3D%3D",
#         "https://www.indeed.com/cmp/Arkham-Technology-Ltd./jobs?jk=626d22ef1573ea24&start=0&clearPrefilter=1#cmp-skip-header-desktop",
#         "https://www.google.com/about/careers/applications/jobs/results/107778149931983558-staff-software-engineer-pixel-software-human-interfaces?location=United%20States&q=sof",
#         "https://careers.qualcomm.com/careers?pid=446706161558&domain=qualcomm.com&sort_by=relevance",
#         "http://jobs.apple.com/en-us/details/114438148/us-business-expert?team=SLDEV"]
# def new_scrape(url:str) -> Optional[str]:
#     content = scrape(url)
#     if content != "":
#         return content

# def old_scrape(url:str) -> Optional[str]:
#     response = old_scraper.job_description_scraper(url)
#     status = response["success"]
#     if status == True:
#         return response["content"]
#     elif status == False:
#         return None 
# def silence_logging(fn, *args, **kwargs):
#     logging.disable(logging.INFO)
#     f = io.StringIO()
#     with redirect_stdout(f):  # also mutes print()
#         result = fn(*args, **kwargs)
#     logging.disable(logging.NOTSET)  # re-enable logging
#     return result
# print("=== Testing Old Scraper ===")
# with redirect_stdout(f):
#     start = time.time()
#     for url in urls:
#         old_scrape(url)
#     old_duration = time.time() - start
# print(f"Old Scraper time: {old_duration:.4f} seconds")

# print("=== Testing New Scraper ===")
# with redirect_stdout(f):
#     start = time.time()
#     for url in urls:
#         silence_logging(new_scrape, url)
#     new_duration = time.time() - start
# print(f"New Scraper time: {new_duration:.4f} seconds")



