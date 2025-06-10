from scrapling.fetchers import StealthyFetcher, Fetcher
from typing import Dict, Optional, List
import re 
from urllib.parse import urlparse



# Specific Selectors
SELECTORS = {
    'indeed.com': '#jobDescriptionText, [data-testid="jobsearch-JobComponent-description"]',
    'linkedin.com': '.jobs-box__html-content, .jobs-description-content__text',
    'glassdoor.com': '#JobDescriptionContainer, [data-test="jobDescription"]',
    'monster.com': '#JobDescription, .job-description',
    'ziprecruiter.com': '.jobDescriptionSection, [data-testid="job-description"]',
    'dice.com': '#jobdescSec, .job-description'
}

FALLBACK_SELECTORS = '[class*="job-description"], [class*="jobDescription"], [id*="description"]'

#grab the name of the site
def get_site_name(url:str) -> str:
    domain = urlparse(url).netloc.lower()
    return domain[4:] if domain.startswith('www.') else domain


#clean the jd 
def clean_text(text: str) -> str:
    if not text or len(text) < 50:
        return ""
    
    text = re.sub(r'\s+', ' ', text.strip())
    cutoff_pos = len(text) * 0.8
    for phrase in ['apply now', 'equal opportunity', 'submit application']:
        pos = text.lower().rfind(phrase)
        if pos > cutoff_pos:
            text = text[:pos].strip()
            break
    return text



def is_valid_job_description(text: str ) -> bool:
    if not text or len(text) < 100:
        return False 
    
    job_indicators = [
        'responsibilities', 'requirements', 'qualifications', 'experience',
        'skills', 'duties', 'role', 'position', 'job', 'work', 'career',
        'salary', 'benefits', 'company', 'team', 'candidate'
    ]
        
    text_lower = text.lower()
        
    keyword_count = sum(1 for keyword in job_indicators if keyword in text_lower)
        
    #return true if the count is more than 3
    return keyword_count >= 3

def scrape_jd(url:str) -> Optional[str]:
    try:
        platform = get_site_name(url)
        
        page = StealthyFetcher.fetch(
            url,
            headless=True,
            network_idle=True,
            humanize=True,
            os_randomize=True    
        )
        
        if page.status != 200:
            return None
    
        selector = SELECTORS.get(platform, FALLBACK_SELECTORS)
        element = page.css_first(selector)
        
        if element:
            text = element.get_all_text(ignore_tags=('script', 'style'))
            return clean_text(text)
        
        #try main content
        for sel in ['main', '[role="main"]', '.content']:
            element = page.css_first(sel)
            if element:
                text = element.get_all_text(ignore_tags=('script', 'style', 'nav', 'header', 'footer'))
                cleaned = clean_text(text)
                if cleaned:
                    if is_valid_job_description(cleaned):
                        return cleaned
        return None
    except Exception as e:
        print(f"Error scraping: {e}")
        return None


def scrape(url: str) -> Optional[str]:
    results = scrape_jd(url)
    return results if results else None