from typing import Optional
from ScraplingScraper import scrape 


def scrape_jd(url:str)-> Optional[str]:
    jd = scrape(url)
    return jd if jd else None

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



