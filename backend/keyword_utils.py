"""
This file contains helper functions to extract keywords from text 
and PDF files (bytes, cuz PDFs are bytes, not text)
"""

import re
from collections import Counter
from io import BytesIO
import PyPDF2  # New dependency

# List of stop words
STOPWORDS = {
    'the','and','for','that','with','this','from','you','your','are',
    'was','were','will','have','has','had','not','but','they','their',
    'them','its','our','ours','about','into','job','role','position',
    'required','requirements','qualifications','skills','ability','work',
    'experience','years','using','per','such','as','to','in','of','a',
    'an','is','on','or','be','we','us','at','by','it','if','may','must',
    'should','also','other','any','all','can','etc'
}

def _tokenize(text: str):
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    print(f'DEBUG (_tokenize): Extracted words: {words}')
    return [w for w in words if w not in STOPWORDS]

def extract_keywords_from_text(text: str, top_n: int = 10):
    tokens = _tokenize(text)
    counts = Counter(tokens)
    return [word for word, _ in counts.most_common(top_n)]

def extract_keywords_from_pdf_bytes(pdf_bytes: bytes, top_n: int = 10):
    reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:  # Reads all pages and extracts text
        page_text = page.extract_text()
        if page_text:
            text += " " + page_text
    return extract_keywords_from_text(text, top_n)
