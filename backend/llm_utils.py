import os, json
from dotenv import load_dotenv
import openai


load_dotenv()
openai.api_key = os.getenv("OPENAI_GROUP_PROJECT_KEY")

# Generic LLM (OpenAI API) resume and job description parsing helper function
def llm_parse_text(text: str, mode: str) -> dict:
    """
    mode == 'resume' -> extract skills, education, experience, projects
    mode == 'jd'     -> extract required_skills, required_education, required_experience, responsibilities
    """
    # OpenAI prompt details for parsing resumes
    if mode == "resume":
        system = "You are a resume analysis service."
        user = (
            "Extract from this resume:\n"
            "  • skills (as an array of strings)\n"
            """  • education (as an array of objects with fields 'degree', 'institution', 'major', 'year' 'relevant courswork')
            Return 'major' only if it is explicitly mentioned in the resume. 
            Return relevant courswork only if it is mentioned in the resume\n"""
            """  • professional experience (as an array of objects with fields 'job_title', 'company', 'dates' and "accomplishments")
            Return the work experience accomplishments for each professional experience completely\n"""
            """  • projects (as an array of objects with fields 'name', 'description', and 'technologies'), where:
                - 'description' is an array of bullet points (strings), each describing one key responsibility, task, or achievement.\n"""
            "Return a JSON object with exactly these fields."
        )
        schema = {
            "type": "object",
            "properties": {
                "skills": {"type": "array", "items": {"type": "string"}},
                "education": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "degree": {"type": "string"},
                            "institution": {"type": "string"},
                            "year": {"type": "string"},
                            "major": {"type": "string"},
                            "relevant_coursework" : {
                                "type": "array",
                                "items": { "type": "string" }
                            }
                        },
                        "required": ["degree", "institution", "year", "major", "relevant_coursework"],
                        "additionalProperties": False
                    }
                },
                "experience": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "job_title": {"type": "string"},
                            "company": {"type": "string"},
                            "dates": {"type": "string"},
                            "accomplishments" : {
                                "type" : "array",
                                "items" : {"type" : "string"}
                            }
                        },
                        "required": ["job_title", "company", "dates", "accomplishments"],
                        "additionalProperties": False
                    }
                },
                "projects": {
                    "type" : "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "description": {
                                "type" : "array",
                                "items": {"type": "string"}
                            },
                            "technologies": {
                                "type": "array",
                                "items": {"type": "string"}
                            } 
                        },
                        "required": ["name", "description", "technologies"],
                        "additionalProperties": False
                    }
                }
            },
            "required": ["skills", "education", "experience", "projects"],
            "additionalProperties": False
        }
        name = "ResumeProfile"

    # OpenAI prompt details for parsing job descriptions
    elif mode == "jd":
        system = "You are a job description parsing service."
        user = (
            "Extract from this job description:\n"
            "  • required_skills\n"
            "  • required_education\n"
            "  • required_experience\n"
            "  • responsibilities\n"
            "Return a JSON object with exactly these fields."
        )
        schema = {
            "type": "object",
            "properties": {
                "required_skills": {"type": "array", "items": {"type": "string"}},
                "required_education": {"type": "array", "items": {"type": "string"}},
                "required_experience": {"type": "array", "items": {"type": "string"}},
                "responsibilities": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["required_skills", "required_education", "required_experience", "responsibilities"],
            "additionalProperties": False
        }
        name = "JDProfile"
    
    else:
        raise ValueError(f"Unknown LLM parse mode: {mode}")
    
    # Assempble the OpenAI prompt
    prompt = (
        f"{user}\n\nText:\n```{text}```"
    )

    # Specify the response that we want from the API
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": prompt},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": name,
                "schema": schema
            }
        },
        max_tokens=800,
        temperature=0
    )

    return json.loads(response.choices[0].message.content)


# Future resume augmentation functions would go here
def augment_resume():
    pass