import csv
import spacy
from spacy.matcher import PhraseMatcher

# Lazy-load NLP objects so that importing this module doesn't slow down the
# Flask app startup time. The spaCy model is loaded only when `extract_skills`
# is first called.
nlp = None  # Initializing as none allows for global access so the rest of the app can use the model
matcher = None


def _ensure_nlp_loaded():
    """ Load spaCy model and keyword patterns on first use instead of on app launch """
    global nlp, matcher
    if nlp is not None and matcher is not None:
        return
    
    # Load spaCy model
    nlp = spacy.load("en_core_web_sm")
    # Register the skill patterns
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

    # Load skill phrases from CSV
    skills = []
    with open("backend/data/skills.csv", newline="", encoding="utf-8") as skills_file:
        for row in csv.reader(skills_file):
            phrase = row[0].strip()
            if phrase:
                skills.append(nlp(phrase))  # Adds each skill in skills.csv to the model's vocabulary
    
    matcher.add("SKILL", skills)

# Returns the unique skill phrases found in the given text
def extract_skills(text: str) -> list[str]:
    _ensure_nlp_loaded()  # Load the keyword extraction model on first use rather than when the app first starts
    doc = nlp(text)
    spans = matcher(doc)

    # Use a set to remove duplicates from extracted skills
    found = {doc[start:end].text for _, start, end in spans}

    return list(found)