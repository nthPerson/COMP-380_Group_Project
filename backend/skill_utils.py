import csv
import spacy
from spacy.matcher import PhraseMatcher

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Set up PhraseMatcher with LOWER attribute
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")

# Load skill phrases from CSV
skills = []
with open("backend/data/skills.csv", newline="", encoding="utf-8") as skills_file:
    for row in csv.reader(skills_file):
        phrase = row[0].strip()
        if phrase:
            skills.append(nlp(phrase))

# Register the skill patterns
matcher.add("SKILL", skills)

# Returns the unique skill phrases found in the given text
def extract_skills(text: str) -> list[str]:
    doc = nlp(text)
    spans = matcher(doc)

    # Use a set to deduplicate
    found = {doc[start:end].text for _, start, end in spans}

    return list(found)