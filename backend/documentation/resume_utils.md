# Resume Utils Module Documentation

## Overview

This module provides comprehensive resume processing, generation, and management functionality for a resume optimization system. It handles resume data extraction from PDFs using AI, generates structured PDF documents from form data, and manages both user-created and AI-generated resumes in Firebase. The module serves as the bridge between user input, AI processing, and document storage.

The module supports multiple resume workflows including manual resume building through forms, AI-powered text extraction and parsing, and automated PDF generation from both structured data and plain text. It integrates with Firebase for secure storage and provides a complete resume lifecycle management system.

## Architecture and Design

### Core Functionality Areas
1. **AI-Powered Extraction**: Parse existing PDFs into structured data
2. **PDF Generation**: Create professional PDFs from structured form data
3. **Plain Text Processing**: Convert AI-generated text into PDF format
4. **Storage Management**: Handle both original and generated resume documents
5. **Metadata Tracking**: Distinguish between user-created and AI-generated content

### Document Types
- **Original Resumes**: User-uploaded PDF documents
- **Form-Generated Resumes**: PDFs created from structured form input
- **AI-Generated Resumes**: PDFs created from LLM-generated text
- **Metadata Tracking**: All documents tracked with creation source

### Integration Points
- **Firebase Storage**: Cloud storage for PDF documents
- **Firestore Database**: Metadata and structured data storage
- **OpenAI API**: AI-powered text extraction and parsing
- **ReportLab**: Professional PDF generation library

## Dependencies

### PDF Processing
- `fitz` (PyMuPDF): PDF text extraction
- Installation: `pip install pymupdf`
- `reportlab`: Professional PDF generation
- `reportlab.platypus`: Document layout components
- `reportlab.lib`: Styling and formatting utilities

### AI Services
- `openai`: OpenAI API client for text processing
- API key from environment: `OPENAI_GROUP_PROJECT_KEY`

### Firebase Services
- `firebase_admin.storage`: Cloud storage operations
- `firebase_admin.firestore`: Database operations
- `firebase_config.db`: Pre-configured Firestore client
- `firebase_config.bucket`: Pre-configured storage bucket

### Flask Integration
- `flask.jsonify`: JSON response formatting
- `flask.request`: HTTP request data access
- `flask.g`: User authentication context

### Security and Utilities
- `werkzeug.utils.secure_filename`: Filename sanitization
- `os`: Environment variable access
- `json`: JSON data processing
- `io`: In-memory file operations

### Internal Modules
- `llm_utils.llm_parse_text`: AI-powered text parsing
- `pdf_utils._download_pdf_as_text`: PDF text extraction

## Functions

### extract_resume_profile_llm() -> Tuple[Response, int]

**Purpose**: Extract structured profile information from PDF resumes using AI parsing.

**HTTP Method**: POST

**Request Body**:
```json
{
  "docID": "firestore_document_id"
}
```

**Processing Pipeline**:
1. **Input Validation**: Verify document ID provided
2. **PDF Retrieval**: Download PDF text content using document ID
3. **AI Parsing**: Extract structured data using OpenAI API
4. **Response Formatting**: Return structured profile data

**Response Format**:
```json
{
  "skills": ["Python", "JavaScript", "React"],
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
      "company": "Tech Company",
      "dates": "2020-2023"
    }
  ]
}
```

**Error Responses**:
- 400: Missing docID
- 404: Could not retrieve PDF
- 500: AI parsing failure (handled by `llm_parse_text`)

**Use Cases**:
- Extract structured data from uploaded resumes
- Populate resume builder forms with existing data
- Analyze resume content for optimization

### _generate_resume_pdf(resume_data: dict) -> bytes

**Purpose**: Generate professional PDF document from structured resume data.

**Parameters**:
- `resume_data` (dict): Structured resume information from form inputs

**Returns**: PDF document as bytes

**Document Structure**:
1. **Header Section**: Name, contact information, links
2. **Summary Section**: Professional summary (optional)
3. **Work Experience**: Job history with positions, dates, descriptions
4. **Education**: Degrees, institutions, GPA (optional)
5. **Skills**: Technical and soft skills categorized

**PDF Styling**:
- **Page Size**: Letter (8.5" x 11")
- **Fonts**: ReportLab standard fonts
- **Styling**: Professional business resume format
- **Spacing**: Appropriate section and element spacing

**Data Mapping**:
```python
# Personal Information
personal = resume_data.get("personalInfo", {})
- firstName, lastName → Full name title
- email, phone → Contact line
- address → Address line
- linkedin, portfolio → Professional links

# Professional Summary
summary = resume_data.get('summary') → Summary section

# Work Experience
work = resume_data.get('workExperience', [])
- position, company → Job title
- startDate, endDate, current → Date range
- description → Job description

# Education
education = resume_data.get('education', [])
- degree, field → Degree title
- institution → School name
- gpa → GPA display (optional)

# Skills
skills = resume_data.get('skills', {})
- technical → Technical skills list
- soft → Soft skills list
```

**Layout Components**:
- `SimpleDocTemplate`: Main document container
- `Paragraph`: Text content with styling
- `Spacer`: Vertical spacing between sections
- `getSampleStyleSheet()`: Professional styling presets

### save_resume_data(resume_data: dict) -> Tuple[Response, int]

**Purpose**: Save structured resume data and generate corresponding PDF document.

**Parameters**:
- `resume_data` (dict): Complete resume form data

**Processing Workflow**:
1. **User Identification**: Extract user ID from authentication
2. **Data Storage**: Save structured data to Firestore
3. **Filename Generation**: Create appropriate PDF filename
4. **PDF Generation**: Convert data to professional PDF
5. **Cloud Upload**: Store PDF in Firebase Storage
6. **Metadata Recording**: Track document in user's library

**Filename Logic**:
- **Custom Name**: Use user-provided filename if specified
- **Default Name**: Generate from `{firstName}_{lastName}_auto_resume{ID}.pdf`
- **PDF Extension**: Automatically append `.pdf` if missing
- **Sanitization**: Replace spaces with underscores

**Database Structure**:
```
Firestore Storage:
users/{user_id}/resumes/{auto_id} → Complete resume data

users/{user_id}/documents/{auto_id} → Document metadata
- fileName: "generated_filename.pdf"
- storagePath: "user_docs/{user_id}/filename.pdf"
- uploadedAt: SERVER_TIMESTAMP
- resumeID: reference to resume data
- created: true (distinguishes from uploaded files)
```

**Response Format**:
```json
{
  "message": "Resume saved successfully!",
  "resumeID": "firestore_resume_id",
  "pdfFile": "generated_filename.pdf"
}
```

**Error Handling**: Returns 500 with generic error message for any failures

### save_generated_resume() -> Tuple[Response, int]

**Purpose**: Convert AI-generated plain text resume into PDF and save to user's library.

**HTTP Method**: POST

**Request Body**:
```json
{
  "generated_resume": "plain text resume content...",
  "fileName": "optional_custom_filename.pdf"
}
```

**Processing Steps**:
1. **Input Validation**: Verify generated text content provided
2. **PDF Generation**: Convert plain text to PDF format
3. **Cloud Upload**: Store PDF in Firebase Storage
4. **Metadata Recording**: Track as generated document

**Text-to-PDF Conversion**:
- Splits text by newlines into paragraphs
- Applies normal styling to all content
- Creates single-page or multi-page document as needed
- Uses standard letter-size page format

**Generated Document Marking**:
```json
{
  "fileName": "Generated_Resume.pdf",
  "storagePath": "user_docs/{user_id}/filename.pdf",
  "uploadedAt": "SERVER_TIMESTAMP",
  "generated": true  // Distinguishes AI-generated content
}
```

**Default Filename**: "Generated_Resume.pdf" if not specified

**Error Response**:
- 400: No generated_resume provided

### save_generated_resume_file() -> Tuple[Response, int]

**Purpose**: Save pre-generated PDF file (from external sources) to user's library.

**HTTP Method**: POST (multipart/form-data)

**Request Format**: Multipart form with file upload

**Processing Workflow**:
1. **File Validation**: Verify file present in request
2. **Filename Sanitization**: Use `secure_filename()` for safety
3. **File Reading**: Read complete file data into memory
4. **Cloud Upload**: Store file in Firebase Storage
5. **Metadata Recording**: Track as generated document

**Security Features**:
- **Filename Sanitization**: Prevents directory traversal and injection
- **User Isolation**: Files stored in user-specific paths
- **Content Type**: Explicitly set as `application/pdf`

**Generated Document Tracking**:
- Marked with `"generated": true` for UI distinction
- Same metadata structure as other generated documents
- Unique document ID for tracking

**Error Response**:
- 400: No file part in request

## Data Structures

### Resume Data Schema
```python
resume_data = {
    "personalInfo": {
        "firstName": "string",
        "lastName": "string", 
        "email": "string",
        "phone": "string",
        "address": "string",
        "linkedin": "string",
        "portfolio": "string"
    },
    "summary": "string",
    "workExperience": [
        {
            "position": "string",
            "company": "string", 
            "startDate": "string",
            "endDate": "string",
            "current": boolean,
            "description": "string"
        }
    ],
    "education": [
        {
            "degree": "string",
            "field": "string",
            "institution": "string",
            "gpa": "string"
        }
    ],
    "skills": {
        "technical": ["string"],
        "soft": ["string"]
    },
    "fileName": "string" // optional custom filename
}
```

### Document Metadata Schema
```python
document_metadata = {
    "fileName": "string",
    "storagePath": "string", 
    "uploadedAt": "SERVER_TIMESTAMP",
    "resumeID": "string",      // for form-generated resumes
    "created": boolean,        // for form-generated resumes
    "generated": boolean       // for AI-generated resumes
}
```

## PDF Generation Details

### ReportLab Styling
```python
styles = getSampleStyleSheet()
# Available styles:
- styles['Title']    # Large, bold text for names
- styles['Heading2'] # Section headers
- styles['Heading3'] # Subsection headers  
- styles['Normal']   # Body text
- styles['Italic']   # Emphasized text (dates)
```

### Document Layout
```python
# Document setup
doc = SimpleDocTemplate(buffer, pagesize=letter)
elems = []  # List of flowable elements

# Element types
Paragraph(text, style)           # Text with formatting
Spacer(width, height)           # Vertical spacing
ListFlowable([ListItem(text)])  # Bulleted lists (unused currently)
```

### Professional Formatting
- **Consistent Spacing**: 12pt between major sections, 6pt between items
- **Hierarchy**: Clear visual hierarchy with appropriate heading sizes
- **Contact Layout**: Logical grouping of contact information
- **Date Formatting**: Consistent date presentation with "Present" for current roles

## Error Handling Patterns

### Input Validation
```python
if not doc_id:
    return jsonify({"error":"Missing docID"}), 400

if not generated_text:
    return jsonify({"error":"No generated_resume provided"}), 400
```

### File Processing Safety
```python
try:
    # PDF generation and storage operations
    pdf_bytes = _generate_resume_pdf(resume_data)
    blob.upload_from_string(pdf_bytes, content_type="application/pdf")
except Exception as e:
    print(f"Error saving resume data: {e}")
    return jsonify({"error": "Failed to save resume data"}), 500
```

### Resource Management
```python
buffer = io.BytesIO()
# ... PDF generation ...
pdf_bytes = buffer.getvalue()
buffer.close()  # Explicit cleanup
```

## Integration Workflows

### Resume Builder Workflow
```python
# 1. User completes resume form
form_data = get_resume_form_data()

# 2. Save structured data and generate PDF
response = save_resume_data(form_data)

# 3. PDF automatically available in user's library
```

### AI Resume Generation Workflow
```python
# 1. User uploads master resume
master_pdf = upload_user_pdf()

# 2. Extract structured data (optional)
profile = extract_resume_profile_llm()

# 3. Generate targeted resume text
targeted_text = generate_targeted_resume()

# 4. Convert to PDF and save
saved_resume = save_generated_resume()
```

### Resume Optimization Pipeline
```python
# Complete optimization workflow
def optimize_resume_pipeline():
    # Extract from existing resume
    profile = extract_resume_profile_llm(master_doc_id)
    
    # Generate targeted version
    targeted = generate_targeted_resume(job_description, keywords)
    
    # Save optimized version
    optimized_doc = save_generated_resume(targeted)
    
    # Calculate improvement metrics
    scores = compute_similarity_scores(master_doc_id, optimized_doc)
    
    return scores
```

## Performance Considerations

### PDF Generation Performance
- **In-Memory Processing**: All PDF generation happens in memory
- **ReportLab Efficiency**: Optimized for professional document generation
- **Single-Pass Generation**: Documents built in single operation

### Storage Efficiency
- **Direct Upload**: PDFs uploaded directly from memory to cloud storage
- **No Temporary Files**: Avoids filesystem overhead
- **Compressed Storage**: Firebase Storage provides automatic compression

### Memory Management
- **Buffer Cleanup**: Explicit cleanup of BytesIO buffers
- **Limited Document Size**: ReportLab handles reasonable resume sizes efficiently
- **Garbage Collection**: Python handles automatic memory cleanup

## Security Considerations

### File Handling Security
- **Filename Sanitization**: `secure_filename()` prevents injection attacks
- **User Isolation**: All files stored in user-specific paths
- **Content Type Validation**: Explicit PDF content type setting

### Data Privacy
- **User Authentication**: All operations require Firebase authentication
- **Data Isolation**: Resume data segregated by user ID
- **Temporary Processing**: PDF generation uses in-memory processing only

### API Security
- **OpenAI API Key**: Securely stored in environment variables
- **Firebase Security**: Leverages Firebase security rules for access control
- **Error Information**: Generic error messages prevent information leakage

## Monitoring and Maintenance

### Usage Metrics
- Track PDF generation success/failure rates
- Monitor storage usage and costs
- Analyze AI parsing accuracy and performance

### Error Monitoring
- Log PDF generation failures for debugging
- Track AI parsing errors and edge cases
- Monitor Firebase storage and database errors

### Quality Assurance
- Validate generated PDF formatting and content
- Test AI extraction accuracy with various resume formats
- Verify complete workflow integration

## Future Enhancements

### Advanced PDF Features
```python
# Potential improvements
class AdvancedPDFGenerator:
    def add_styling_options(self, theme: str) -> None:
        """Support multiple resume themes/styles"""
        
    def add_custom_sections(self, sections: list) -> None:
        """Support user-defined resume sections"""
        
    def optimize_layout(self, content_length: int) -> None:
        """Dynamic layout optimization based on content"""
        
    def add_export_formats(self, format: str) -> bytes:
        """Support multiple export formats (Word, HTML, etc.)"""
```

### Enhanced AI Integration
- **Smarter Parsing**: Improved AI models for complex resume formats
- **Content Suggestions**: AI-powered content improvement recommendations
- **Format Detection**: Automatic detection of resume format and style
- **Quality Scoring**: AI-based resume quality assessment

### Advanced Features
- **Template System**: Multiple professional resume templates
- **Real-time Preview**: Live preview during form editing
- **Collaborative Editing**: Share resumes for feedback
- **Version Control**: Track resume versions and changes
- **ATS Optimization**: Specific formatting for Applicant Tracking Systems