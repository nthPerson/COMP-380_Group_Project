from typing import Optional, Dict, Any, Tuple
from ScraplingScraper import scrape
from flask import jsonify, request, g

from llm_utils import llm_parse_text


def scrape_jd(url: str) -> Optional[str]:
    """Scrape the web for the JD using Link"""
    jd = scrape(url)
    return jd if jd else None


def handle_jd_text(jd_text: str) -> Tuple:
    # Generate explanation with lazy import
    try:
        from gemini_utils import explain_jd_with_gemini

        explanation = explain_jd_with_gemini(jd_text)
    except Exception as e:
        return jsonify({"error": f"Gemini failed: {str(e)}"}), 500

    return (
        jsonify(
            {
                "message": "JD processed from plain text",
                "job_description": jd_text,
                "explanation": explanation,
            }
        ),
        200,
    )


def handle_jd_from_url(url: str) -> Tuple:
    # Scrape job description
    jd_text = scrape(url)
    if not jd_text:
        return jsonify({"error": "Failed to fetch JD from URL"}), 400

    # Generate explanation with lazy import
    try:
        from gemini_utils import explain_jd_with_url

        explanation = explain_jd_with_url(jd_text)
    except Exception as e:
        return jsonify({"error": f"Gemini failed: {str(e)}"}), 500

    return (
        jsonify(
            {
                "message": "JD processed from URL",
                "job_description": jd_text,
                "explanation": explanation,
            }
        ),
        200,
    )


# LLM (OpenAI API) job description profile parsing API endpoint (only handles text requests)
def extract_jd_profile_llm(jd_text: str):
    if jd_text == "":
        return jsonify({"error": f"Text sent to JD profile extractor is empty"}), 400
    try:
        profile = llm_parse_text(jd_text, mode="jd")
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({"error": f"LLM failed: {e}"}), 500
