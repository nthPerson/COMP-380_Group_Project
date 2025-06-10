import requests
from bs4 import BeautifulSoup
import time 
import random 
from urllib.parse import urlparse
import re
from typing import Dict, Optional, List

from playwright.sync_api import sync_playwright
import asyncio


# this class handles jd parsing with fallback for generic websites or if we get blocked
class JobDescriptionScraper:
    """
    DEPRECATED: This scraper is slow and outdated.
    Use `ScraplingScraper` instead.
    """
    #python initializer 
    def __init__(self):
        # These are fake browser identities to pretend our app is a real user when accessing the job descriptions 
        # these make the request look like a real human :))
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
        ]
        
        # these are css selectors for specific sites, theese grab the css tag in the html to get a hold of the jd after parsing 
        # I  put multiple since we don't really know if they keep the tags the same all the time 
        self.site_selectors = {
            'indeed.com': [
                '[data-testid="jobsearch-JobComponent-description"]',
                '#jobDescriptionText',
                '.jobsearch-jobDescriptionText',
                '.jobsearch-JobComponent-description'
            ],
            'linkedin.com': [
                '.jobs-description-content__text',
                '.jobs-box__html-content',
                '.description__text',
                '.jobs-description__container',
                '.jobs-description-content',
                '[data-job-id] .jobs-description-content'
            ],
            'glassdoor.com': [
                '.jobDescriptionContent',
                '#JobDescContainer',
                '.desc',
                '[data-test="jobDescription"]',
                '.css-1uobp1k',
                '.jobDescription'
            ],
            'monster.com': [
                '.job-description',
                '#JobDescription',
                '.job-summary'
            ],
            'ziprecruiter.com': [
                '.job_description',
                '.jobDescriptionSection'
            ]
        }
        
    #this generates a random header used for accessing the website 
    def get_random_headers(self) -> Dict[str, str]:
        return {
            'User-Agent': random.choice(self.user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    #this grabs the name of the website so we can do website specific scraping
    def get_site_name(self, url: str) -> str:
        try:
            #this takes the full url and extracts the net location (netloc) and lowercases it, basically if this is the url: "https://www.Indeed.com/viewjob?jk=abc" it gives us "www.indeed.com"
            domain = urlparse(url).netloc.lower()
            domain = re.sub(r'www\.', "", domain) #this removes the www. part and leaves for example indeed.com
            return domain
        except:
            return ""
    
    def extract_with_selectors(self, soup: BeautifulSoup, site_name: str) -> Optional[str]:
        #in this method I want to try scarping the website with the specific selectors and if it fails use a generic scraper 
        selectors = self.site_selectors.get(site_name, [])
        
        # try the selectors for the sepecific website, if they exist try to find the selector in the soup (aka the html of the scraped website) and if the length is over 200 chars return it if not reutn null or None 
        for selector in selectors:
            try:
                element = soup.select_one(selector)
                if element:
                    text = element.get_text(strip=True)
                    if len(text) > 100:
                        return text
            except:
                continue 
        
        return None 

    # this is a fallback incase the user provides a url that is not in our sites we are targeting
    def extract_generic(self, soup: BeautifulSoup) -> str:
        #get rid of the junk in the soup html, like headers, js and css 
        unwanted_tags = [
            'script', 'style', 'nav', 'header', 'footer', 'aside', 
            'menu', 'button', 'form', 'input', 'select', 'textarea',
            '[class*="nav"]', '[class*="menu"]', '[class*="header"]', 
            '[class*="footer"]', '[class*="sidebar"]', '[class*="ad"]',
            '[class*="cookie"]', '[class*="banner"]', '[class*="popup"]'
        ]
        
        for tag in unwanted_tags:
            if tag.startswith('['):
                # css selector
                for element in soup.select(tag):
                    element.decompose()
            else:
                # tag name
                for element in soup.find_all(tag):
                    element.decompose()        
        
        #try to see if the soup has generic selectors for the jd 
        generic_selectors = [
            '[class*="job-description"]',
            '[class*="description"]',
            '[id*="job-description"]',
            '[id*="description"]',
            'article',
            'main',
            '.content'
        ]
        
        #try the generic selectors, just like the method above 
        for selector in generic_selectors:
            try:
                element = soup.select_one(selector)
                if element:
                    text = element.get_text(strip=True)
                    if len(text) > 200:
                        return text
            except:
                continue
        
        #this is the last resort to try to find text with keywords, that might indicate this is a jd, risky but might work
        full_text = soup.get_text()
        
        paragraphs = [p.strip() for p in full_text.split('\n') if p.strip()]
        filtered_paragraphs = []
        
        skip_keywords = [
            'skip to', 'navigation', 'menu', 'copyright', 'privacy', 
            'terms of use', 'cookie', 'sign in', 'register', 'follow us',
            'social media', 'download app', 'browse by', 'recent posts'
        ]

        for para in paragraphs:
            if len(para) > 30 and not any(skip in para.lower() for skip in skip_keywords):
                filtered_paragraphs.append(para)

        filtered_text = '\n'.join(filtered_paragraphs)
        if self.contains_job_keywords(filtered_text):
            return filtered_text[:5000]
        
        return full_text[:2000]
    
    def contains_job_keywords(self, text:str) -> bool:
        job_keywords = [
            'responsibilities', 'requirements', 'qualifications', 'duties', 
            'skills', 'experience', 'role', 'position', 'candidate',
            'bachelor', 'master', 'degree', 'years of experience'
        ]
        
        text_lower = text.lower()
        keyword_count = sum(1 for keyword in job_keywords if keyword in text_lower)
        return keyword_count >= 2     
    
    #here is where we check to see if it's a valid jd, by looking at the keywords 
    def is_valid_job_description(self, text: str ) -> bool:
        if not text or len(text) < 100:
            return False 
    
        job_indicators = [
            'responsibilities', 'requirements', 'qualifications', 'experience',
            'skills', 'duties', 'role', 'position', 'job', 'work', 'career',
            'salary', 'benefits', 'company', 'team', 'candidate'
        ]
        
        text_lower = text.lower()
        # here I want to count the words in the text, if at least three of these exist I want to reutrn ture
        keyword_count = sum(1 for keyword in job_indicators if keyword in text_lower)
        
        #return true if the count is more than 3
        return keyword_count >= 3
        
    #this is a simple request based scraping, the first thing we'll try 
    def scrape_simple(self, url: str) -> Optional[str]:
        try:
            headers = self.get_random_headers() #get a random header
            response = requests.get(url, headers=headers, timeout=15, allow_redirects=True) #request it and wait up to 15 seconds and if the websites whants to redirect us let it do whatever it wants
            response.raise_for_status() #raise an error if we fail to quit early
            
            soup = BeautifulSoup(response.content, 'html.parser') #parse the html using bs4
            site_name = self.get_site_name(url) # grab the name if it exists
            
            #try with site sepecific selectors first 
            content = self.extract_with_selectors(soup, site_name)
            if content and self.is_valid_job_description(content):
                return content
            
            #fall back to generic selectors 
            content = self.extract_generic(soup)
            if self.is_valid_job_description(content):
                return content
        
            return None
        
        except Exception as e:
            #print(f"Simple scraping failed: {e}")
            return None 
        
    # this is more advanced scraping it reueses cookie and header and auth and proxies, we try this second because it takes more time 
    def scrape_with_session(self, url:str) -> Optional[str]:
        try:
            session = requests.session() #create a new session
            headers = self.get_random_headers() #get the random headers 
            session.headers.update(headers) #assing the headers to the session we made 
            
            #wait a lil
            time.sleep(random.uniform(1,3))
            
            response = session.get(url, timeout=20, allow_redirects=True) #get the page
            response.raise_for_status() # if it fails just quit 
            
            soup = BeautifulSoup(response.content, 'html.parser')
            site_name = self.get_site_name(url)
            
            
            #with site sepecific selector
            content = self.extract_with_selectors(soup, site_name)
            if content and self.is_valid_job_description(content):
                return content
            
            #with generic selector 
            content = self.extract_generic(soup)
            if self.is_valid_job_description(content):
                return content
            
            return None 
        except Exception as e:
            print(f"Session parsing failed {e}")
            
            return None 
    
    #this is if shit hits the fan and we get blocke by both simple request and session
    #this quite literaly makes a headless browser and gets the html lol, and headless just means a browser with no UI 
    def scrape_with_playwright(self, url: str) -> Optional[str]:
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        '--no-sandbox',
                        '--disable-brotli',
                        '--disable-dev-shm-usage'
                    ]
                )

                context = browser.new_context(
                    user_agent=random.choice(self.user_agents),
                    viewport={'width': 1920, 'height': 1080}
                )

                page = context.new_page()

                page.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
                    Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
                """)

                page.goto(url, wait_until='domcontentloaded', timeout=30000)
                page.wait_for_timeout(random.randint(2000, 5000))

                site_name = self.get_site_name(url)
                selectors = self.site_selectors.get(site_name, [])

                for selector in selectors:
                    try:
                        element = page.wait_for_selector(selector, timeout=5000)
                        if element:
                            content = element.inner_text()
                            if self.is_valid_job_description(content):
                                browser.close()
                                return content
                    except:
                        continue

                content = page.evaluate('document.body.innerText')
                browser.close()

                if self.is_valid_job_description(content):
                    return content

                return None

        except Exception as e:
            print(f"Playwright scraping failed {e}")
            return None
        
    #this is the main method used for parsing and this is where we call
    def job_description_scraper(self, url) ->  Dict[str, any]:
        
        print(f"attempting to scrape {url}")
        
        if not url or not url.startswith(('http://', 'https://')):
            print("invalid URL")
            return {
                'success': False,
                'error': 'invalid URL',
                'manual_needed': True
            }
        
        #simple scraping
        #print("attempting simple scrape")
        content = self.scrape_simple(url)
        if content:
            return {'success': True, 'content': content, 'method' : 'simple'}
        
        #session scraping
        #print("attempting sesson scraping")
        content = self.scrape_with_session(url)
        if content:
            return {'success': True, 'content': content, 'method' : 'session'}
        
        # playwright scraping 
        #print("attempting playwright")
        content = self.scrape_with_playwright(url)
        if content:
            return {'success': True, 'content': content, 'method' : 'playwright'}
        
        #if all fails:
        return {
                'success': False,
                'error': 'All scraping methods failed',
                'manual_needed': True,
                'Suggestion': "Please copy and pasta Job Description"
        }
            