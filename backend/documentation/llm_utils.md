# LLM Utils Module Documentation

## Overview

This module provides Large Language Model (LLM) utilities for resume optimization and matching using OpenAI's GPT and embedding models. It serves as the core AI engine for parsing resumes and job descriptions, generating targeted resumes, computing similarity scores, and highlighting matching elements between resumes and job requirements.

The module implements a comprehensive resume optimization pipeline that includes structured data extraction, targeted content generation, semantic similarity analysis, and intelligent matching recommendations. It leverages both generative AI for content creation and embedding models for semantic understanding.

## Architecture and Design

### AI Model Integration
- **GPT-4o-mini**: Primary model for text generation and structured parsing
- **text-embedding-3-small**: 1,536-dimensional embedding vectors for similarity analysis
- **Caching Strategy**: Embeddings cached in local database to reduce API costs and latency

### Core Functionality Areas
1. **Structured Parsing**: Extract structured data from unstructured text
2. **Content Generation**: Create targeted resumes optimized for specific jobs
3. **Similarity Analysis**: Quantify alignment between resumes and job descriptions
4. **Matching Highlights**: Identify specific matching and missing elements

### Performance Optimization
- **Embedding Caching**: Reuse previously computed embeddings
- **Batch Processing**: Efficient handling of multiple text items
- **Cost Management**: Minimize API calls through intelligent caching

## Dependencies

### External APIs
- **OpenAI API**: GPT models and embedding services
- **API Key**: Requires `OPENAI_GROUP_PROJECT_KEY` environment variable

### Internal Modules
- `pdf_utils._download_pdf_as_text`: PDF text extraction
- `embeddings_db`: Embedding caching and retrieval

### Standard Libraries
- `os`: Environment variable access
- `json`: JSON parsing and serialization
- `math`: Mathematical operations for similarity calculations

### Flask Integration
- `flask.request`: HTTP request data access
- `flask.g`: User authentication context
- `flask.jsonify`: JSON response formatting

## Configuration

### Model Configuration
```python
EMBED_MODEL = "text-embedding-3-small"  # 1,536 dimensional vector
# Alternative: "text-embedding-3-large"  # 3,072 dimensional vector
```

### API Configuration
```python
load_dotenv()
openai.api_key = os.getenv("OPENAI_GROUP_PROJECT_KEY")
```

## Core Functions

### llm_parse_text(text: str, mode: str) -> dict

**Purpose**: Extract structured information from unstructured text using GPT with JSON schema validation.

**Parameters**:
- `text` (str): The text content to parse (resume or job description)
- `mode` (str): Processing mode - either "resume" or "jd" (job description)

**Returns**: Dictionary with structured data according to specified schema

#### Resume Mode Schema
```json
{
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "degree": "Bachelor of Science",
      "institution": "University Name",
      "year": "2020"
    }
  ],
  "experience": [
    {
      "job_title": "Software Engineer",
      "company": "Company Name",
      "dates": "2020-2023"
    }
  ]
}
```

#### Job Description Mode Schema
```json
{
  "required_skills": ["Python", "React", "AWS"],
  "required_education": ["Bachelor's degree in CS"],
  "required_experience": ["3+ years software development"],
  "responsibilities": ["Develop web applications", "Collaborate with team"]
}
```

**Implementation Details**:
- Uses GPT-4o-mini with structured JSON schema response format
- Temperature set to 0 for consistent, deterministic parsing
- Maximum 800 tokens to control response length
- Strict schema validation prevents hallucinated fields

**Error Handling**: Raises `ValueError` for unknown modes

### generate_targeted_resume_html() -> Tuple[Response, int]

**Purpose**: Generate HTML-formatted resume content optimized for specific job descriptions.

**HTTP Method**: POST

**Request Body**:
```json
{
  "docID": "user_resume_document_id",
  "job_description": "target job description text",
  "keywords": ["optional", "keyword", "list"]
}
```

**Response Format**:
```json
{
  "generated_resume_html": "<h1>Resume Title</h1><h2>Experience</h2>..."
}
```

**Processing Pipeline**:
1. **Input Validation**: Verify required fields (docID, job_description)
2. **Resume Retrieval**: Download master resume as plain text
3. **Prompt Construction**: Build targeted generation prompt
4. **AI Generation**: Call GPT-4o-mini with specific HTML formatting instructions
5. **Response Formatting**: Return structured HTML for editor integration

**HTML Format Specifications**:
- `<h1>`, `<h2>`, `<h3>` for section titles
- `<p>` for paragraphs
- `<ul><li>` for bullet lists
- No markdown or backticks in output

**Generation Parameters**:
- **Model**: GPT-4o-mini
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Max Tokens**: 1,200
- **Constraints**: Use only facts from original resume

**Error Responses**:
- 400: Missing required fields
- 404: Resume not found
- 500: OpenAI API failure

### generate_targeted_resume() -> Tuple[Response, int]

**Purpose**: Generate plain text resume content optimized for specific job descriptions.

**Parameters**: Same as `generate_targeted_resume_html()`

**Response Format**:
```json
{
  "generated_resume": "plain text resume content..."
}
```

**Key Differences from HTML Version**:
- Returns unformatted plain text
- Simplified system prompt
- Suitable for further processing or plain text applications

**Use Cases**:
- Backend processing pipelines
- Integration with external systems
- Text-based similarity analysis

## Embedding and Similarity Functions

### _get_embedding(text: str) -> list[float]

**Purpose**: Retrieve or generate embedding vector for text with intelligent caching.

**Parameters**:
- `text` (str): Text to embed

**Returns**: 1,536-dimensional floating-point vector

**Caching Strategy**:
1. **Cache Check**: Query local embeddings database first
2. **API Call**: Generate embedding via OpenAI if not cached
3. **Cache Store**: Save new embeddings for future use
4. **Return Vector**: Provide embedding for similarity calculations

**Cost Optimization**: Significantly reduces API costs by reusing embeddings

**Model**: text-embedding-3-small (1,536 dimensions)

### get_embeddings(text_list: list[str]) -> list[list[float]]

**Purpose**: Generate embeddings for multiple texts efficiently.

**Parameters**:
- `text_list` (list[str]): List of texts to embed

**Returns**: List of embedding vectors corresponding to input texts

**Implementation**: Maps `_get_embedding()` over input list with caching benefits

### _cosine_sim(a: list, b: list) -> float

**Purpose**: Calculate cosine similarity between two embedding vectors.

**Parameters**:
- `a` (list): First embedding vector
- `b` (list): Second embedding vector

**Returns**: Similarity score between 0.0 and 1.0

**Mathematical Formula**:
```
cosine_similarity = (a · b) / (||a|| × ||b||)
```

**Implementation Details**:
- Dot product: `sum(x*y for x,y in zip(a, b))`
- Vector norms: `math.sqrt(sum(x*x for x in vector))`
- Zero-division protection: Returns 0.0 for zero vectors

### compute_similarity_scores() -> Tuple[Response, int]

**Purpose**: Calculate similarity scores between resumes and job descriptions.

**HTTP Method**: POST

**Request Body**:
```json
{
  "docID": "master_resume_id",
  "job_description": "target job description",
  "generated_resume": "optional targeted resume text"
}
```

**Response Format**:
```json
{
  "master_score": 75.3,
  "generated_score": 82.1
}
```

**Scoring Process**:
1. **Text Extraction**: Retrieve master resume text
2. **Embedding Generation**: Create vectors for job description and resume(s)
3. **Similarity Calculation**: Compute cosine similarity scores
4. **Percentage Conversion**: Scale to 0-100 range for user interpretation
5. **Comparison Analysis**: Show improvement from master to targeted resume

**Score Interpretation**:
- **0-30**: Poor alignment
- **30-60**: Moderate alignment
- **60-80**: Good alignment
- **80-100**: Excellent alignment

## Advanced Matching Functions

### highlight_profile_similarity(resume_items: list[str], jd_items: list[str], threshold: float = 0.4) -> Tuple[Response, int]

**Purpose**: Identify specific matching and non-matching elements between resume and job description.

**Parameters**:
- `resume_items` (list[str]): Resume skills, experiences, qualifications
- `jd_items` (list[str]): Job requirements, responsibilities, qualifications
- `threshold` (float): Similarity threshold for considering items as matches (default: 0.4)

**Response Format**:
```json
{
  "matched_resume": [true, false, true],
  "matched_jd": [true, true, false],
  "sim_scores": [[0.85, 0.23], [0.12, 0.76], [0.45, 0.89]]
}
```

**Processing Algorithm**:
1. **Embedding Generation**: Create vectors for all resume and JD items
2. **Similarity Matrix**: Calculate pairwise similarities between all items
3. **Threshold Application**: Mark items as matched if any similarity exceeds threshold
4. **Boolean Masks**: Generate parallel boolean arrays for UI highlighting

**Matrix Structure**:
- Rows: Resume items
- Columns: Job description items
- Values: Cosine similarity scores (0.0 to 1.0)

**Use Cases**:
- **Resume Gap Analysis**: Identify missing skills or experiences
- **Strength Highlighting**: Show existing qualifications that match job requirements
- **Optimization Guidance**: Direct users to specific areas for improvement

### highlight_similarity_raw(resume_items: list[str], jd_items: list[str], threshold: float = 0.7) -> Tuple[list[bool], list[bool]]

**Purpose**: Flask-independent version of similarity highlighting for testing and integration.

**Parameters**: Same as `highlight_profile_similarity` with higher default threshold

**Returns**: Tuple of boolean lists without Flask response formatting

**Key Differences**:
- **No Flask Dependency**: Pure Python function for testing
- **Higher Threshold**: 0.7 default for stricter matching
- **Simplified Output**: Returns raw boolean lists
- **Testing Integration**: Suitable for unit tests and batch processing

## Error Handling Patterns

### API Error Management
```python
try:
    response = openai.chat.completions.create(...)
    generated = response.choices[0].message.content
except Exception as e:
    return jsonify({"error": f"OpenAI request failed: {str(e)}"}), 500
```

### Input Validation
```python
if not doc_id or not jd_text:
    return jsonify({"error": "docID and job_description are required"}), 400
```

### Resource Availability
```python
if raw_resume is None:
    return jsonify({"error": "Could not retrieve resume PDF"}), 404
```

## Performance Considerations

### API Cost Optimization
- **Embedding Caching**: Reuse previously computed embeddings
- **Model Selection**: Use cost-effective models (GPT-4o-mini vs GPT-4)
- **Token Management**: Optimize prompt length and response limits

### Response Time Optimization
- **Local Database**: Fast embedding retrieval from SQLite cache
- **Batch Processing**: Efficient handling of multiple similarity calculations
- **Minimal API Calls**: Cache-first strategy reduces network latency

### Memory Management
- **Vector Storage**: Efficient handling of high-dimensional embeddings
- **Batch Limits**: Process reasonable numbers of items to prevent memory issues
- **Cache Size**: Monitor embedding database growth

## Integration Patterns

### Resume Generation Workflow
```python
# 1. User selects master resume and provides job description
# 2. Generate targeted resume
targeted_html = generate_targeted_resume_html()

# 3. Calculate improvement metrics
similarity_scores = compute_similarity_scores()

# 4. Highlight specific matches/gaps
profile_analysis = highlight_profile_similarity(resume_skills, jd_requirements)
```

### Frontend Integration
```javascript
// Generate targeted resume
const generateResponse = await fetch('/api/generate_targeted_resume', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    docID: userResumeId,
    job_description: jobText,
    keywords: selectedKeywords
  })
});

// Calculate similarity scores
const scoresResponse = await fetch('/api/similarity_score', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    docID: userResumeId,
    job_description: jobText,
    generated_resume: targetedResumeText
  })
});
```

## Security Considerations

### API Key Management
- **Environment Variables**: Secure storage of OpenAI API credentials
- **Access Control**: Restrict API key access to authorized processes
- **Rate Limiting**: Monitor and control API usage

### Input Sanitization
- **Content Validation**: Verify input text format and length
- **User Isolation**: Ensure user-specific data access through Firebase authentication
- **Prompt Injection**: Validate inputs to prevent malicious prompt manipulation

### Data Privacy
- **Temporary Processing**: Minimize retention of user content in API calls
- **Content Logging**: Avoid logging sensitive resume or job description content
- **API Provider Policies**: Understand OpenAI's data handling and retention policies

## Monitoring and Maintenance

### API Usage Tracking
- **Cost Monitoring**: Track token usage and API costs
- **Performance Metrics**: Monitor response times and success rates
- **Error Analysis**: Log and analyze API failures

### Quality Assurance
- **Output Validation**: Verify generated content quality and accuracy
- **Similarity Accuracy**: Validate similarity score meaningfulness
- **Schema Compliance**: Ensure structured parsing meets expectations

### Maintenance Tasks
- **Cache Cleanup**: Manage embedding database size
- **Model Updates**: Evaluate and migrate to newer OpenAI models
- **Prompt Optimization**: Refine prompts based on output quality

## Testing and Development

### Unit Testing Patterns
```python
def test_cosine_similarity():
    # Test similarity calculation
    vec_a = [1.0, 0.0, 0.0]
    vec_b = [0.0, 1.0, 0.0]
    assert _cosine_sim(vec_a, vec_b) == 0.0  # Orthogonal vectors

def test_highlight_similarity():
    # Test non-Flask version
    resume_items = ["Python programming", "Data analysis"]
    jd_items = ["Python development", "Statistical analysis"]
    matched_resume, matched_jd = highlight_similarity_raw(resume_items, jd_items)
    assert matched_resume[0] == True  # Python match
```

### Integration Testing
- **API Connectivity**: Verify OpenAI API access and authentication
- **End-to-End Workflows**: Test complete resume generation pipeline
- **Error Scenarios**: Validate error handling for various failure modes

### Development Tools
- **Embedding Inspector**: Use embeddings database inspection tools
- **Similarity Visualization**: Create tools to visualize similarity matrices
- **Prompt Testing**: Develop utilities for prompt optimization and testing