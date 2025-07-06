# Firebase Configuration Module Documentation

## Overview

This module handles the initialization and configuration of Firebase services for the application. It sets up Firebase Admin SDK with authentication credentials, Firestore database access, and Cloud Storage bucket integration. The module implements secure credential management by using base64-encoded service account keys stored in environment variables.

The configuration supports both Firestore for document-based data storage and Firebase Cloud Storage for file uploads, particularly PDF documents. The module is designed to be imported once during application startup to establish Firebase connectivity.

## Architecture and Design

### Security Model
The module implements a secure credential management system:
- Service account credentials stored as base64-encoded environment variables
- Temporary file creation for credential processing
- No hardcoded credentials in source code
- Environment variable validation with error handling

### Service Integration
- **Firebase Admin SDK**: Full administrative access to Firebase services
- **Firestore**: NoSQL document database for structured data
- **Cloud Storage**: File storage service for PDF and other document uploads

### Initialization Pattern
- Single initialization call during module import
- Global service client objects for application-wide access
- Error handling for missing or invalid configuration

## Dependencies

### Standard Library
- `os`: Operating system interface for environment variables and file operations
- `base64`: Base64 encoding/decoding for credential processing
- `tempfile`: Temporary file creation for credential handling

### Firebase Dependencies
- `firebase_admin`: Core Firebase Admin SDK
- `firebase_admin.credentials`: Service account credential management
- `firebase_admin.firestore`: Firestore database client
- `firebase_admin.storage`: Cloud Storage bucket client

### Third-Party Dependencies
- `python-dotenv`: Environment variable loading from .env files

## Environment Variables

### Required Variables

#### FIREBASE_KEY_B64
**Type**: String (Base64-encoded JSON)
**Purpose**: Contains the Firebase service account credentials
**Format**: Base64-encoded Firebase service account JSON key
**Security**: Must be kept secure and not committed to version control

**Example Structure** (before base64 encoding):
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

#### FIREBASE_STORAGE_BUCKET
**Type**: String
**Purpose**: Specifies the Firebase Cloud Storage bucket name
**Format**: Bucket name (e.g., "your-project-id.appspot.com")
**Usage**: Required for Cloud Storage file operations

## Global Objects

### db
**Type**: `firestore.Client`
**Purpose**: Firestore database client for document operations
**Scope**: Module-global, accessible after import
**Usage**: Provides access to Firestore collections and documents

**Example Operations**:
```python
# Reference a collection
users_ref = db.collection('users')

# Add a document
doc_ref = db.collection('users').add({
    'name': 'John Doe',
    'email': 'john@example.com'
})

# Get a document
doc = db.collection('users').document('user_id').get()
```

### bucket
**Type**: `storage.Bucket`
**Purpose**: Cloud Storage bucket client for file operations
**Scope**: Module-global, accessible after import
**Usage**: Provides access to file upload, download, and management

**Example Operations**:
```python
# Upload a file
blob = bucket.blob('path/to/file.pdf')
blob.upload_from_filename('local_file.pdf')

# Download a file
blob = bucket.blob('path/to/file.pdf')
blob.download_to_filename('downloaded_file.pdf')

# Generate signed URL
url = blob.generate_signed_url(expiration=datetime.timedelta(hours=1))
```

## Initialization Process

### Step 1: Environment Loading
```python
load_dotenv()
```
- Loads environment variables from .env file
- Makes environment variables available to the application
- Required for accessing Firebase configuration

### Step 2: Credential Retrieval
```python
b64_key = os.getenv("FIREBASE_KEY_B64")
if not b64_key:
    raise ValueError("Missing Firebase base 64 key")
```
- Retrieves base64-encoded Firebase key from environment
- Validates presence of required credential
- Raises exception if key is missing to prevent silent failures

### Step 3: Key Decoding
```python
decoded_key = base64.b64decode(b64_key)
```
- Decodes base64-encoded service account key
- Converts to raw JSON bytes for processing
- Handles Firebase service account key format

### Step 4: Temporary File Creation
```python
with tempfile.NamedTemporaryFile(delete=False) as tmp:
    tmp.write(decoded_key)
    tmp_path = tmp.name
```
- Creates temporary file for credential processing
- Writes decoded JSON key to temporary file
- Preserves file path for Firebase SDK initialization
- **Security Note**: File is marked as `delete=False` for SDK access

### Step 5: Credential Object Creation
```python
cred = credentials.Certificate(tmp_path)
```
- Creates Firebase credential object from temporary file
- Validates service account key format
- Prepares credentials for Firebase Admin SDK initialization

### Step 6: Firebase App Initialization
```python
firebase_admin.initialize_app(
    cred,
    {"storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")}
)
```
- Initializes Firebase Admin SDK with credentials
- Associates app with specified Cloud Storage bucket
- Enables both Firestore and Cloud Storage services

### Step 7: Service Client Creation
```python
db = firestore.client()
bucket = storage.bucket()
```
- Creates Firestore database client
- Creates Cloud Storage bucket client
- Makes services available for application use

## Error Handling

### Missing Environment Variables
```python
if not b64_key:
    raise ValueError("Missing Firebase base 64 key")
```
- **Exception Type**: `ValueError`
- **Trigger**: When `FIREBASE_KEY_B64` environment variable is not set
- **Behavior**: Application terminates with clear error message
- **Recovery**: Ensure environment variable is properly configured

### Invalid Credentials
- **Trigger**: When decoded key is not valid Firebase service account JSON
- **Behavior**: Firebase SDK will raise authentication exceptions
- **Recovery**: Verify service account key format and permissions

### Storage Bucket Configuration
- **Trigger**: When `FIREBASE_STORAGE_BUCKET` is missing or invalid
- **Behavior**: Cloud Storage operations will fail
- **Recovery**: Ensure bucket name is correct and accessible

## Security Considerations

### Credential Management
- **Environment Variables**: Credentials never hardcoded in source
- **Base64 Encoding**: Provides basic obfuscation in environment
- **Temporary Files**: Credentials written to temporary filesystem location
- **File Cleanup**: Temporary files not automatically deleted (security trade-off)

### Service Account Permissions
- **Firestore Access**: Full read/write access to Firestore database
- **Storage Access**: Full access to specified Cloud Storage bucket
- **Administrative Privileges**: Service account should have minimal required permissions

### Best Practices
- Store `FIREBASE_KEY_B64` in secure environment variable systems
- Use different service accounts for different environments
- Regularly rotate service account keys
- Monitor service account usage and permissions

## Performance Considerations

### Initialization Overhead
- **One-time Cost**: Initialization occurs once during module import
- **Network Requests**: Initial connection to Firebase services
- **Credential Validation**: Service account key verification

### Connection Management
- **Persistent Connections**: Firebase SDK maintains connection pools
- **Automatic Retry**: Built-in retry logic for transient failures
- **Connection Reuse**: Single client objects shared across application

### Resource Usage
- **Memory**: Client objects maintain connection state
- **File System**: Temporary credential files consume disk space
- **Network**: Background heartbeat and connection maintenance

## Usage Patterns

### Firestore Operations
```python
from firebase_config import db

# Collection reference
collection_ref = db.collection('documents')

# Document operations
doc_ref = collection_ref.document('doc_id')
doc_ref.set({'field': 'value'})
doc_data = doc_ref.get().to_dict()
```

### Cloud Storage Operations
```python
from firebase_config import bucket

# File upload
blob = bucket.blob('user_uploads/file.pdf')
blob.upload_from_string(file_data, content_type='application/pdf')

# File download
blob = bucket.blob('user_uploads/file.pdf')
file_data = blob.download_as_bytes()
```

### Combined Usage
```python
from firebase_config import db, bucket

# Store file metadata in Firestore
file_ref = db.collection('files').add({
    'filename': 'document.pdf',
    'storage_path': 'user_uploads/document.pdf',
    'upload_time': firestore.SERVER_TIMESTAMP
})

# Upload file to Cloud Storage
blob = bucket.blob('user_uploads/document.pdf')
blob.upload_from_filename('local_document.pdf')
```

## Development and Testing

### Environment Setup
1. Create `.env` file with required variables
2. Generate Firebase service account key
3. Base64 encode the service account JSON
4. Set environment variables in development environment

### Local Development
```bash
# Example .env file
FIREBASE_KEY_B64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAieW91ci1wcm9qZWN0IiwKICAuLi4KfQ==
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### Testing Considerations
- Use separate Firebase project for testing
- Mock Firebase services for unit tests
- Test error handling with invalid credentials
- Verify proper resource cleanup

## Deployment Considerations

### Production Environment
- Use secure environment variable management (e.g., AWS Secrets Manager)
- Implement proper logging for initialization failures
- Monitor service account usage and quotas
- Set up alerts for authentication failures

### Container Deployment
- Ensure environment variables are properly injected
- Consider using volume mounts for credential files
- Implement health checks for Firebase connectivity
- Plan for credential rotation without downtime

### Monitoring and Maintenance
- Monitor Firebase service quotas and usage
- Track temporary file creation and cleanup
- Monitor authentication success/failure rates
- Set up alerting for configuration issues

## Troubleshooting

### Common Issues

#### "Missing Firebase base 64 key" Error
- **Cause**: `FIREBASE_KEY_B64` environment variable not set
- **Solution**: Verify environment variable configuration
- **Check**: Confirm .env file is loaded and variable is accessible

#### Authentication Failures
- **Cause**: Invalid or expired service account key
- **Solution**: Regenerate service account key and update environment variable
- **Check**: Verify service account permissions and project access

#### Storage Bucket Access Errors
- **Cause**: Incorrect bucket name or insufficient permissions
- **Solution**: Verify bucket name and service account permissions
- **Check**: Ensure bucket exists and is accessible

#### Temporary File Issues
- **Cause**: Insufficient disk space or file system permissions
- **Solution**: Check available disk space and file system permissions
- **Check**: Monitor temporary file creation and cleanup