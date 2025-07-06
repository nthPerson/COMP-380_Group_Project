# Flask API Documentation

## Overview

This Flask application serves as the backend API for a resume optimization and job description matching system. The application provides comprehensive functionality for managing resumes, analyzing job descriptions, generating targeted resumes, and calculating similarity scores between resumes and job requirements.

The API is designed to work with Firebase authentication and implements CORS for cross-origin requests. All endpoints require Firebase token verification, ensuring secure access to user-specific data and operations.

## Architecture and Dependencies

### Core Dependencies
- **Flask**: Web framework for creating the API endpoints
- **Flask-CORS**: Handles cross-origin resource sharing
- **Firebase**: Authentication system (via `verify_firebase_token` decorator)

### Module Dependencies
The application imports functionality from several utility modules:
- `verify_token`: Firebase authentication verification
- `jd_utils`: Job description processing and analysis
- `pdf_utils`: PDF file management and text extraction
- `resume_utils`: Resume data processing and generation
- `keyword_utils`: Keyword management for resume optimization
- `llm_utils`: Large Language Model integrations for content generation
- `user_profile_utils`: User profile and picture management

### Server Configuration
- **Host**: localhost
- **Port**: 5001
- **Debug Mode**: Enabled
- **CORS**: Enabled for all origins

## Authentication

All API endpoints are protected by the `@verify_firebase_token` decorator, which:
- Verifies Firebase authentication tokens from request headers
- Populates the Flask `g` object with user information
- Returns authentication errors for invalid or missing tokens
- Provides access to `g.firebase_user["uid"]` for user-specific operations

## API Endpoints

### Job Description Handling

#### POST /api/jd
**Purpose**: Process job description text and extract relevant information using LLM analysis.

**Authentication**: Required

**Request Body**:
```json
{
  "jd": "string - job description text"
}
```

**Response**: Returns processed job description data from `handle_jd_text()` function.

**Use Case**: When users paste job description text directly into the application.

#### POST /api/jd_from_url
**Purpose**: Extract and process job description from a URL.

**Authentication**: Required

**Request Body**:
```json
{
  "url": "string - URL containing job description"
}
```

**Response**: Returns processed job description data from `handle_jd_from_url()` function.

**Use Case**: When users provide a link to a job posting instead of copying text.

### PDF Management

#### POST /api/upload_pdf
**Purpose**: Upload resume PDF files to user's document library.

**Authentication**: Required

**Request**: Multipart form data with PDF file

**Response**: Returns upload confirmation and file metadata.

**Side Effects**: Stores PDF in user-specific storage location.

#### GET /api/list_pdfs
**Purpose**: Retrieve list of all PDFs associated with the authenticated user.

**Authentication**: Required

**Response**: Returns array of PDF metadata including filenames, upload dates, and document IDs.

#### POST /api/delete_pdf
**Purpose**: Remove a specific PDF from user's library.

**Authentication**: Required

**Request Body**: Contains document ID for deletion

**Response**: Returns deletion confirmation.

**Side Effects**: Permanently removes PDF file and associated metadata.

#### POST /api/set_master_pdf
**Purpose**: Designate a specific PDF as the user's master resume template.

**Authentication**: Required

**Request Body**: Contains document ID to set as master

**Response**: Returns confirmation of master PDF designation.

**Side Effects**: Updates user's master resume reference in database.

#### GET /api/get_master_pdf
**Purpose**: Retrieve the user's currently designated master resume.

**Authentication**: Required

**Response**: Returns master PDF metadata and access information.

#### GET /api/get_resume_url
**Purpose**: Generate a temporary URL for accessing user's resume PDF.

**Authentication**: Required

**Response**: Returns temporary URL for PDF access.

**Security Note**: URLs are typically time-limited for security purposes.

### Profile Extraction

#### POST /api/extract_resume_profile_llm
**Purpose**: Use LLM to extract structured profile information from resume text.

**Authentication**: Required

**Request**: Resume text or PDF reference

**Response**: Returns extracted profile data including skills, experience, education, etc.

**Processing**: Utilizes large language models to parse and structure resume content.

#### POST /api/extract_jd_profile_llm
**Purpose**: Extract structured requirements and responsibilities from job descriptions.

**Authentication**: Required

**Request Body**:
```json
{
  "jd": "string - job description text"
}
```

**Response**: Returns structured job requirements including required skills, responsibilities, qualifications.

### Keyword Management

#### GET /api/selected_keywords/get
**Purpose**: Retrieve user's current list of selected keywords for resume optimization.

**Authentication**: Required

**Response**: Returns array of selected keywords.

#### POST /api/selected_keywords/add
**Purpose**: Add keywords to user's selected keyword list.

**Authentication**: Required

**Request Body**: Contains keywords to add

**Response**: Returns updated keyword list.

#### POST /api/selected_keywords/remove
**Purpose**: Remove specific keywords from user's list.

**Authentication**: Required

**Request Body**: Contains keywords to remove

**Response**: Returns updated keyword list.

#### POST /api/selected_keywords/clear
**Purpose**: Clear all keywords from user's selected list.

**Authentication**: Required

**Response**: Returns confirmation of keyword list clearing.

### Resume Builder

#### POST /api/save_resume
**Purpose**: Save resume data created through the resume builder interface.

**Authentication**: Required

**Request Body**: Complete resume data object

**Response**: Returns save confirmation and generated PDF reference.

**Side Effects**: 
- Saves resume data to database
- Generates PDF version of resume
- Updates user's resume library

**Function Documentation**:
```python
def save_resume():
    """
    Save resume data to the database.
    This endpoint receives resume data from the frontend and saves it to the backend.
    """
```

### Targeted Resume Generation

#### POST /api/generate_targeted_resume
**Purpose**: Generate a customized resume optimized for a specific job description.

**Authentication**: Required

**Request Body**:
```json
{
  "docID": "string - reference to base resume",
  "job_description": "string - target job description",
  "keywords": ["array of optimization keywords"]
}
```

**Response**: Returns generated resume content in HTML format.

**Processing**: Currently uses OpenAI API to generate HTML-formatted resume content optimized for the target job.

**Function Documentation**:
```python
def api_generate_targeted_resume():
    """
    Expects JSON: { docID: string, job_description: string, keywords: [string] }
    Returns: { generated_resume: string } (aka just the plain text of the generated resume)
    """
```

**Implementation Note**: Currently returns HTML via `generate_targeted_resume_html()` for use in resume editor. Plain text option available via `generate_targeted_resume()`.

#### POST /api/save_generated_resume
**Purpose**: Save a generated targeted resume to user's library.

**Authentication**: Required

**Request**: Can accept either file upload or resume data

**Response**: Returns save confirmation.

**Logic**: Branches based on whether request contains file upload or data payload.

#### POST /api/download_pdf_text
**Purpose**: Extract text content from PDF for use in resume editor.

**Authentication**: Required

**Request Body**:
```json
{
  "docID": "string - PDF document ID"
}
```

**Response**:
```json
{
  "pdf_text": "string - extracted text content"
}
```

**Use Case**: Retrieves master resume text for comparison with targeted resume versions, enabling diff highlighting of changes.

### Similarity Analysis

#### POST /api/similarity_score
**Purpose**: Calculate similarity scores between resume content and job requirements.

**Authentication**: Required

**Request Body**: Resume and job description data

**Response**: Returns numerical similarity scores and analysis.

**Error Handling**: Implements comprehensive error handling with server-side logging and JSON error responses to maintain CORS compatibility.

```python
try:
    return compute_similarity_scores()
except Exception as e:
    # Log server-side error:
    print("similarity_score error:", e, file=sys.stderr)
    # Continue to return JSON so CORS can attach headers and frontend doesn't freak out
    return jsonify({"error": str(e)}), 500
```

#### POST /api/highlight_similarity
**Purpose**: Identify and highlight matching elements between resume and job description.

**Authentication**: Required

**Request Body**:
```json
{
  "resume_items": ["array of resume elements"],
  "jd_items": ["array of job description elements"]
}
```

**Response**: Returns highlighted similarity analysis showing matches and gaps.

### User Profile Management

#### POST /api/update_profile
**Purpose**: Update user profile information and upload profile pictures.

**Authentication**: Required

**Request**: Multipart form data with profile information and/or image file

**Response**: Returns updated profile confirmation.

**Side Effects**: Updates user profile data and stores profile picture.

#### GET /api/get_profile
**Purpose**: Retrieve current user's profile metadata.

**Authentication**: Required

**Response**: Returns user profile information including picture URLs and metadata.

## Security Considerations

### Authentication
- All endpoints require valid Firebase tokens
- User isolation enforced through Firebase UID
- Token verification performed on every request

### File Upload Security
- PDF uploads are scoped to authenticated users
- File type validation implemented in utility functions
- Temporary URLs for file access provide time-limited security

### Error Handling
- Comprehensive error handling prevents information leakage
- Server errors logged to stderr for debugging
- JSON error responses maintain API consistency

## Performance Considerations

### LLM Integration
- Multiple endpoints utilize large language models for content processing
- Consider implementing caching for frequently processed content
- Monitor API usage and costs for LLM services

### File Processing
- PDF text extraction may be CPU-intensive for large documents
- Consider implementing async processing for large file operations
- Temporary file cleanup important for storage management

### Database Operations
- User-specific data isolation requires efficient indexing
- Consider implementing connection pooling for high-traffic scenarios

## Development Notes

### Debug Mode
- Server runs in debug mode for development
- Automatic reloading enabled for code changes
- Detailed error traces available in development

### CORS Configuration
- CORS enabled for all origins during development
- Production deployment should restrict origins appropriately

### Module Organization
- Business logic separated into utility modules
- Clear separation of concerns between API routing and implementation
- Consistent error handling patterns across modules

## Deployment Considerations

### Environment Variables
- Firebase configuration requires environment setup
- Database connection strings should be externalized
- API keys for LLM services need secure storage

### Production Security
- Disable debug mode in production
- Implement appropriate CORS origin restrictions
- Set up proper logging and monitoring
- Consider rate limiting for API endpoints

### Scalability
- Consider implementing request queuing for LLM operations
- Database connection pooling for concurrent users
- File storage considerations for user uploads