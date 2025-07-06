# PDF Utils Module Documentation

## Overview

This module provides comprehensive PDF management functionality for a resume optimization system. It handles the complete lifecycle of PDF documents including upload, storage, retrieval, deletion, and text extraction. The module integrates Firebase Cloud Storage for file storage and Firestore for metadata management, providing a robust document management system for user resumes.

The module is designed to support multi-user environments with user-specific document isolation, master resume designation capabilities, and secure file access through signed URLs. It serves as the core document management layer for the resume optimization platform.

## Architecture and Design

### Storage Architecture
- **Firebase Cloud Storage**: Primary file storage for PDF documents
- **Firestore Database**: Metadata storage and document references
- **User Isolation**: Documents segregated by Firebase user ID
- **Hierarchical Structure**: `user_docs/{user_id}/{filename}` for cloud storage

### Database Schema
```
users/{user_id}/
├── master_resume: docID (optional field)
└── documents/{docID}/
    ├── fileName: "original_filename.pdf"
    ├── storagePath: "user_docs/{user_id}/filename.pdf"
    └── uploadedAt: SERVER_TIMESTAMP
```

### Security Model
- **User Authentication**: Firebase authentication required for all operations
- **Document Isolation**: Users can only access their own documents
- **Signed URLs**: Time-limited access to PDF files
- **Storage Permissions**: Firebase security rules enforce access control

## Dependencies

### Firebase Services
- `firebase_admin.firestore`: Database operations for metadata
- `firebase_admin.storage`: Cloud storage operations for files
- `firebase_config.db`: Pre-configured Firestore client
- `firebase_config.bucket`: Pre-configured Cloud Storage bucket

### PDF Processing
- `fitz` (PyMuPDF): PDF text extraction and processing
- Installation: `pip install pymupdf`

### Standard Libraries
- `datetime.timedelta`: Time-based operations for URL expiration
- Installation: `pip install timedelta`

### Flask Integration
- `flask.jsonify`: JSON response formatting
- `flask.request`: HTTP request data and file access
- `flask.g`: User authentication context

### Google Cloud
- `google.cloud.exceptions.NotFound`: Exception handling for missing resources

## Functions

### upload_user_pdf() -> Tuple[Response, int]

**Purpose**: Upload PDF files to user-specific cloud storage with metadata tracking.

**HTTP Method**: POST (multipart/form-data)

**Request Format**: Multipart form with file upload

**File Validation**:
- Checks for presence of file in request
- Validates that a file is actually selected
- Uses original filename for storage

**Processing Pipeline**:
1. **File Validation**: Verify file presence and selection
2. **User Identification**: Extract user ID from Firebase authentication
3. **Storage Path Generation**: Create hierarchical path `user_docs/{user_id}/{filename}`
4. **Cloud Upload**: Upload file to Firebase Cloud Storage
5. **Metadata Storage**: Record file metadata in Firestore database
6. **Response**: Return success confirmation

**Storage Structure**:
```
Firebase Cloud Storage: user_docs/{user_id}/{filename}
Firestore: users/{user_id}/documents/{auto_generated_id}
```

**Metadata Fields**:
- `fileName`: Original filename from upload
- `storagePath`: Full cloud storage path
- `uploadedAt`: Server-generated timestamp

**Response Format**:
```json
{
  "message": "File uploaded"
}
```

**Error Responses**:
- 400: No file part in request
- 400: No file selected

**Example Usage**:
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('/api/upload_pdf', {
  method: 'POST',
  body: formData
});
```

### list_user_pdfs() -> Tuple[Response, int]

**Purpose**: Retrieve metadata for all PDF documents belonging to the authenticated user.

**HTTP Method**: GET

**Authentication**: Requires Firebase user authentication

**Processing Steps**:
1. **User Identification**: Extract user ID from authentication context
2. **Database Query**: Retrieve all documents from user's collection
3. **Metadata Enhancement**: Add Firestore document ID to each record
4. **Response Formatting**: Return array of document metadata

**Response Format**:
```json
[
  {
    "fileName": "resume_v1.pdf",
    "storagePath": "user_docs/user123/resume_v1.pdf",
    "uploadedAt": "2023-12-01T10:30:00Z",
    "docID": "firestore_generated_id_1"
  },
  {
    "fileName": "cover_letter.pdf",
    "storagePath": "user_docs/user123/cover_letter.pdf",
    "uploadedAt": "2023-12-02T14:15:00Z",
    "docID": "firestore_generated_id_2"
  }
]
```

**Use Cases**:
- Display user's document library in UI
- Document selection for resume operations
- File management interface

**Performance**: Streams all documents for user (may need pagination for large collections)

### delete_user_pdf() -> Tuple[Response, int]

**Purpose**: Permanently delete PDF document and associated metadata with master resume cleanup.

**HTTP Method**: POST

**Request Body**:
```json
{
  "docID": "firestore_document_id"
}
```

**Deletion Process**:
1. **Input Validation**: Verify document ID provided
2. **Document Verification**: Confirm document exists and belongs to user
3. **Storage Cleanup**: Delete file from Firebase Cloud Storage
4. **Metadata Cleanup**: Remove document record from Firestore
5. **Master Resume Check**: Clear master resume reference if deleted document was designated as master
6. **Response**: Confirm successful deletion

**Master Resume Handling**:
- Checks if deleted document was user's designated master resume
- Automatically removes master resume designation to prevent broken references
- Uses `firestore.DELETE_FIELD` to completely remove the field

**Error Handling**:
- Graceful handling of storage deletion failures
- Continues with metadata cleanup even if file deletion fails
- Logs storage deletion errors for debugging

**Response Format**:
```json
{
  "message": "PDF deleted"
}
```

**Error Responses**:
- 400: Missing docID
- 404: Document not found

**Security**: Verifies document ownership before deletion

### set_master_pdf() -> Tuple[Response, int]

**Purpose**: Designate a specific PDF as the user's master resume template.

**HTTP Method**: POST

**Request Body**:
```json
{
  "docID": "firestore_document_id"
}
```

**Validation Process**:
1. **Input Validation**: Verify document ID provided
2. **Document Verification**: Confirm document exists in user's collection
3. **Master Designation**: Update user's root document with master resume reference
4. **Response**: Confirm master resume designation

**Database Operation**:
```javascript
// Updates or creates user document with master resume reference
db.collection("users").document(user_id).set(
  {"master_resume": doc_id},
  merge: true  // Preserves other user fields
)
```

**Response Format**:
```json
{
  "message": "Master resume set",
  "master_docID": "firestore_document_id"
}
```

**Error Responses**:
- 400: Missing docID
- 404: Document not found

**Use Case**: Allows users to designate their primary resume for targeted generation

### get_master_pdf() -> Tuple[Response, int]

**Purpose**: Retrieve the user's currently designated master resume document ID.

**HTTP Method**: GET

**Processing Steps**:
1. **User Lookup**: Query user's root document
2. **Master Reference**: Extract master resume document ID
3. **Response**: Return master document ID or null

**Response Format**:
```json
{
  "masterDocID": "firestore_document_id"
}
```

**Response for No Master**:
```json
{
  "masterDocID": null
}
```

**Status Codes**:
- 200: Master resume found or explicitly null
- 400: User document doesn't exist

**Use Case**: Determine which resume to use for targeted generation

### generate_pdf_link() -> Tuple[Response, int]

**Purpose**: Generate time-limited signed URLs for secure PDF access.

**HTTP Method**: GET

**Query Parameters**:
- `path`: Cloud storage path to the PDF file

**URL Generation**:
- **Version**: v4 signing
- **Expiration**: 15 minutes from generation
- **Method**: GET requests only
- **Security**: Temporary access without authentication

**Processing Steps**:
1. **Path Validation**: Verify storage path provided
2. **Blob Reference**: Create reference to cloud storage object
3. **URL Generation**: Generate signed URL with expiration
4. **Response**: Return temporary access URL

**Response Format**:
```json
{
  "url": "https://storage.googleapis.com/bucket/path?X-Goog-Algorithm=..."
}
```

**Error Responses**:
- 400: Missing path parameter
- 500: URL generation failure

**Security Considerations**:
- URLs expire after 15 minutes
- No additional authentication required during valid period
- Suitable for frontend PDF viewing/downloading

**Example Usage**:
```javascript
const response = await fetch(`/api/get_resume_url?path=${storagePath}`);
const {url} = await response.json();
window.open(url, '_blank');  // Open PDF in new tab
```

### _download_pdf_as_text(user_id: str, doc_id: str) -> str

**Purpose**: Extract plain text content from PDF documents for processing.

**Parameters**:
- `user_id` (str): Firebase user identifier
- `doc_id` (str): Firestore document identifier

**Returns**: Plain text content of PDF or empty string if not found

**Text Extraction Process**:
1. **Document Lookup**: Query Firestore for document metadata
2. **Storage Path Retrieval**: Extract cloud storage path
3. **PDF Download**: Download PDF bytes from cloud storage
4. **Text Extraction**: Use PyMuPDF to extract text from all pages
5. **Text Assembly**: Join page text with newlines

**Implementation Details**:
- Uses `fitz.open(stream=pdf_bytes, filetype="pdf")` for in-memory processing
- Extracts text from all pages sequentially
- Joins pages with newline separators
- Returns empty string for non-existent documents

**Error Handling**:
- Returns empty string rather than raising exceptions
- Graceful handling of missing documents
- Safe for use in LLM processing pipelines

**Use Cases**:
- Resume text extraction for AI processing
- Content analysis for similarity calculations
- Text-based resume generation

**Performance Considerations**:
- Downloads entire PDF into memory
- Synchronous text extraction
- Consider caching for frequently accessed documents

## Error Handling Patterns

### Input Validation
```python
if not doc_id:
    return jsonify({"error": "Missing docID"}), 400
```

### Document Existence Checks
```python
if not doc.exists:
    return jsonify({"error": "Document not found"}), 404
```

### Storage Operation Safety
```python
try:
    blob.delete()
except Exception as e:
    print(f"Failed to delete storage blob: {e}")
    # Continue with metadata cleanup
```

### Graceful Degradation
```python
def _download_pdf_as_text(user_id: str, doc_id: str) -> str:
    if not doc.exists:
        return ""  # Return empty rather than error
```

## Security Considerations

### Authentication Requirements
- All operations require Firebase authentication
- User ID extracted from authentication context
- No cross-user document access possible

### File Access Control
- Documents stored in user-specific paths
- Signed URLs provide time-limited access
- Firebase security rules enforce user isolation

### Data Privacy
- PDF content processed in-memory only
- No persistent text storage
- User documents isolated by Firebase user ID

### Input Validation
- File upload validation prevents empty uploads
- Document ID validation prevents invalid operations
- Path validation for signed URL generation

## Performance Considerations

### File Upload Performance
- Direct upload to cloud storage
- Minimal server processing overhead
- Async upload processing possible

### Text Extraction Performance
- In-memory PDF processing
- Full document download required
- Consider caching for repeated extractions

### Database Operations
- Firestore provides fast metadata access
- Document listing may need pagination for large collections
- Efficient user-scoped queries

### Storage Costs
- Cloud storage costs scale with usage
- Signed URLs reduce server bandwidth
- Consider lifecycle policies for old documents

## Integration Patterns

### Resume Generation Workflow
```python
# 1. User uploads PDF
upload_response = upload_user_pdf()

# 2. User sets as master resume
set_master_response = set_master_pdf()

# 3. Extract text for processing
master_text = _download_pdf_as_text(user_id, doc_id)

# 4. Generate targeted resume using text
targeted_resume = generate_targeted_resume(master_text, job_description)
```

### Frontend Integration
```javascript
// Upload new resume
const uploadForm = new FormData();
uploadForm.append('file', pdfFile);
await fetch('/api/upload_pdf', {method: 'POST', body: uploadForm});

// List user documents
const docs = await fetch('/api/list_pdfs').then(r => r.json());

// Set master resume
await fetch('/api/set_master_pdf', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({docID: selectedDocId})
});

// Get PDF viewing URL
const path = doc.storagePath;
const {url} = await fetch(`/api/get_resume_url?path=${path}`).then(r => r.json());
```

## Monitoring and Maintenance

### Storage Monitoring
- Track cloud storage usage and costs
- Monitor upload/download patterns
- Set up alerts for unusual activity

### Performance Metrics
- Track upload success rates
- Monitor text extraction performance
- Measure signed URL generation times

### Maintenance Tasks
- Clean up orphaned storage files
- Monitor Firestore usage and costs
- Review and update security rules

### Error Analysis
- Log and analyze upload failures
- Monitor storage access errors
- Track authentication issues

## Future Enhancements

### Potential Improvements
1. **File Type Validation**: Ensure only PDF files are uploaded
2. **File Size Limits**: Implement upload size restrictions
3. **Batch Operations**: Support multiple file operations
4. **File Versioning**: Track document versions
5. **Text Caching**: Cache extracted text for performance
6. **Thumbnail Generation**: Generate PDF thumbnails for UI

### Advanced Features
```python
# Potential enhancements
class PDFProcessor:
    def validate_pdf(self, file_bytes: bytes) -> bool:
        """Validate file is actually a PDF"""
        
    def generate_thumbnail(self, pdf_bytes: bytes) -> bytes:
        """Create thumbnail image from first page"""
        
    def extract_metadata(self, pdf_bytes: bytes) -> dict:
        """Extract PDF metadata (author, creation date, etc.)"""
        
    def cache_text(self, doc_id: str, text: str) -> None:
        """Cache extracted text for faster access"""
```

### Scalability Considerations
- **Pagination**: Implement pagination for large document lists
- **Async Processing**: Use background tasks for large file operations
- **CDN Integration**: Consider CDN for faster file delivery
- **Database Optimization**: Implement proper indexing for queries