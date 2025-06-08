from JobDescriptionScraper import JobDescriptionScraper
from typing import Optional


scraper = JobDescriptionScraper()

#For testing
# urls = ["https://www.glassdoor.com/job-listing/associate-product-strategist-blackrock-investments-JV_IC1147401_KO0,28_KE29,50.htm?jl=1009637498969&cs=1_d6dc23e4&s=21&t=ESR&pos=102&src=GD_JOB_AD&guid=000001974bb7bb7fa40daa38de986702&uido=7B32804F4273685C4376BA30F908E1E8&jobListingId=1009637498969&ao=1136043&vt=w&jrtk=5-yul1-0-1it5rfff2ia64800-d17fe6f099571d0d&cb=1749322022583&ctt=1749322026894&srs=EI_JOBS",
#         "https://www.indeed.com/cmp/Arkham-Technology-Ltd./jobs?jk=626d22ef1573ea24&start=0&clearPrefilter=1",
#         "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4233980732",
#         "https://www.google.com/about/careers/applications/jobs/results/110690555461018310-software-engineer-iii-infrastructure-core",
#         "https://jobs.apple.com/en-us/details/200588629/applications-software-engineeer-app-store-client?team=SFTWR"
#         ]

def get_jd_from_url(url:str) -> Optional[str]:
    response =  scraper.job_description_scraper(url)
    status = response["success"]
    if status == True:
        return response["content"]
    elif status == False:
        return None 
    
    