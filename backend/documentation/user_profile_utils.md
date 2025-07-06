# User Profile Utils Module Documentation

## Overview

This module provides user profile management functionality for the resume optimization platform. It handles user profile picture uploads, metadata storage, and profile information retrieval. The module integrates with Firebase Cloud Storage for image hosting and Firestore for metadata persistence, providing a complete user profile management solution.

The module is designed to support user personalization features including profile pictures, usernames, and email management. It implements secure file upload with public URL generation and maintains user-specific profile data in a structured Firestore collection.

## Architecture and Design

### Profile Data Structure
- **Profile Pictures**: Stored in Firebase Cloud Storage with public access
- **Metadata Storage**: User profile data stored in Firestore
- **User Isolation**: All profile data segregated by Firebase user ID
- **Public Access**: Profile pictures made publicly accessible via URLs

### Storage Architecture
```
Firebase Cloud Storage:
user_profile_pictures/{user_id}/{timestamp}.{extension}

Firestore Database:
users/{user_id}/meta/profile
├── username: "string"
├── email: "string" 
└── photoURL: "public_url_to_image"
```

### Security Model
- **Authentication Required**: All operations require Firebase authentication
- **User-Specific Paths**: Files stored in user-specific directories
- **Public Images**: Profile pictures made publicly accessible
- **Metadata Protection**: Profile metadata only accessible to authenticated user

## Dependencies

### File Processing
- `io`: In-memory file operations (imported but not actively used)

### Flask Integration
- `flask.request`: HTTP request data and file access
- `flask.jsonify`: JSON response formatting
- `flask.g`: User authentication context

### Firebase Services
- `firebase_config.db`: Pre-configured Firestore client
- `firebase_config.bucket`: Pre-configured Cloud Storage bucket
- `firebase_admin.firestore`: Firestore operations

### System Libraries
- `time`: Timestamp generation for unique filenames

## Functions

### upload_profile_picture() -> Tuple[Response, int]

**Purpose**: Handle profile picture upload and profile metadata updates in a single operation.

**HTTP Method**: POST (multipart/form-data)

**Request Format**:
```
Content-Type: multipart/form-data

Fields:
- profile_picture: (file, optional) Image file to upload
- username: (string, optional) User's display name
- email: (string, optional) User's email address
```

**Processing Workflow**:
1. **User Identification**: Extract user ID from Firebase authentication context
2. **Form Data Extraction**: Parse form fields for username and email
3. **File Processing**: Handle profile picture upload if provided
4. **Storage Operations**: Upload image to Cloud Storage with public access
5. **Metadata Updates**: Update user profile document in Firestore
6. **Response Generation**: Return updated profile information

**File Upload Details**:
```python
# Unique filename generation
ext = file.filename.rsplit(".", 1)[-1]  # Extract file extension
timestamp = int(time.time())            # Unix timestamp for uniqueness
path = f"user_profile_pictures/{user_id}/{timestamp}.{ext}"
```

**Public URL Generation**:
- Files uploaded with `blob.make_public()` for direct access
- Public URL automatically generated and stored in profile metadata
- No authentication required for image access

**Incremental Updates**:
- Only processes provided fields (username, email, profile_picture)
- Uses `merge=True` to preserve existing profile data
- Selective updates allow partial profile modifications

**Response Format**:
```json
{
  "message": "Profile updated",
  "username": "john_doe",
  "email": "john@example.com", 
  "photoURL": "https://storage.googleapis.com/bucket/user_profile_pictures/uid/timestamp.jpg"
}
```

**Error Handling**: Returns 200 even if no updates provided (graceful no-op)

**Use Cases**:
- Initial profile setup after user registration
- Profile picture updates
- Username or email changes
- Bulk profile information updates

### get_user_profile() -> Tuple[Response, int]

**Purpose**: Retrieve current user's profile metadata including profile picture URL.

**HTTP Method**: GET

**Authentication**: Requires Firebase user authentication

**Processing Steps**:
1. **User Identification**: Extract user ID from authentication context
2. **Profile Lookup**: Query user's profile document from Firestore
3. **Existence Check**: Handle cases where profile doesn't exist
4. **Response Formatting**: Return profile data or default values

**Database Query**:
```python
profile_ref = db.collection("users").document(user_id).collection("meta").document("profile")
```

**Response Format (Profile Exists)**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "photoURL": "https://storage.googleapis.com/bucket/user_profile_pictures/uid/timestamp.jpg"
}
```

**Response Format (No Profile)**:
```json
{
  "username": null,
  "email": null, 
  "photoURL": null
}
```

**Consistent Response Structure**: Always returns the same field structure regardless of profile existence

**Performance**: Single document read operation for fast profile retrieval

**Use Cases**:
- Loading user profile in application UI
- Displaying user information in navigation
- Profile editing form population
- Avatar display in user interfaces

## Data Schema

### Profile Document Structure
```python
profile_data = {
    "username": "string",        # User's display name
    "email": "string",          # User's email address  
    "photoURL": "string"        # Public URL to profile picture
}
```

### Storage Path Structure
```
Cloud Storage Path: user_profile_pictures/{user_id}/{timestamp}.{extension}
Firestore Path: users/{user_id}/meta/profile

Example:
Storage: user_profile_pictures/abc123/1703123456.jpg
Database: users/abc123/meta/profile
```

### Filename Convention
- **User Isolation**: `{user_id}` prevents cross-user access
- **Uniqueness**: `{timestamp}` prevents filename collisions
- **Extension Preservation**: Maintains original file type
- **Path Security**: No user-controlled path components

## File Upload Process

### File Processing Pipeline
```python
# 1. Extract file extension
ext = file.filename.rsplit(".", 1)[-1]

# 2. Generate unique path
timestamp = int(time.time())
path = f"user_profile_pictures/{user_id}/{timestamp}.{ext}"

# 3. Upload to storage
blob = bucket.blob(path)
blob.upload_from_file(file, content_type=file.content_type)

# 4. Make publicly accessible
blob.make_public()

# 5. Get public URL
public_url = blob.public_url
```

### Security Considerations
- **File Extension Handling**: Preserves original extension without validation
- **Content Type**: Uses browser-provided content type
- **Public Access**: Images accessible without authentication
- **Path Isolation**: User-specific directories prevent access conflicts

### Upload Optimizations
- **Direct Upload**: Streams file directly to cloud storage
- **No Local Storage**: Avoids temporary file creation
- **Immediate Availability**: Public URLs available immediately after upload
- **Automatic Scaling**: Firebase Storage handles traffic scaling

## Error Handling and Edge Cases

### Graceful Degradation
```python
# Handle missing profile gracefully
if not doc.exists:
    return jsonify({"username": None, "email": None, "photoURL": None}), 200
```

### Partial Updates
```python
# Only update provided fields
data = {}
if username:
    data["username"] = username
if email:
    data["email"] = email
```

### File Upload Safety
- **Optional Files**: Handles requests without profile picture
- **Extension Extraction**: Safe handling of filenames without extensions
- **Content Type**: Uses browser-provided MIME type
- **Storage Errors**: Firebase Storage handles upload failures

## Integration Patterns

### Frontend Integration
```javascript
// Profile picture upload with metadata
const formData = new FormData();
formData.append('profile_picture', imageFile);
formData.append('username', 'john_doe');
formData.append('email', 'john@example.com');

const response = await fetch('/api/update_profile', {
  method: 'POST',
  body: formData
});

// Get current profile
const profile = await fetch('/api/get_profile').then(r => r.json());
```

### Profile Display Component
```javascript
function ProfileDisplay() {
  const [profile, setProfile] = useState({});
  
  useEffect(() => {
    fetch('/api/get_profile')
      .then(r => r.json())
      .then(setProfile);
  }, []);
  
  return (
    <div>
      {profile.photoURL && <img src={profile.photoURL} alt="Profile" />}
      <h3>{profile.username || 'Anonymous User'}</h3>
      <p>{profile.email}</p>
    </div>
  );
}
```

### User Registration Flow
```python
# Complete user setup workflow
def complete_user_registration():
    # 1. User signs up with Firebase Auth
    # 2. Upload initial profile picture and info
    upload_profile_picture()
    # 3. Profile available immediately for use
    profile = get_user_profile()
    return profile
```

## Performance Considerations

### Upload Performance
- **Direct Streaming**: Files streamed directly to cloud storage
- **No Server Processing**: Minimal server-side image processing
- **Immediate Availability**: Public URLs available immediately
- **Scalable Storage**: Firebase Storage handles concurrent uploads

### Database Efficiency
- **Single Document**: Profile stored in single Firestore document
- **Selective Updates**: Only modified fields updated
- **Fast Reads**: Single document read for profile retrieval
- **Merge Operations**: Efficient partial updates

### Caching Strategies
- **Public URLs**: Can be cached by CDNs and browsers
- **Profile Data**: Consider client-side caching for frequent access
- **Image Optimization**: Consider image resizing for different use cases

## Security and Privacy

### File Access Control
- **Public Images**: Profile pictures accessible without authentication
- **User Isolation**: Files stored in user-specific directories
- **No Cross-User Access**: Path structure prevents unauthorized access
- **Firestore Security**: Profile metadata protected by Firebase Auth

### Data Privacy
- **User Control**: Users control their own profile information
- **Optional Fields**: All profile fields are optional
- **Data Minimization**: Only stores necessary profile information
- **Right to Delete**: Users can update or remove profile information

### Input Validation
```python
# Current implementation has minimal validation
# Consider adding:
def validate_profile_input(username, email, file):
    # Username length and character validation
    # Email format validation  
    # File type and size validation
    # Content scanning for inappropriate images
```

## Monitoring and Maintenance

### Usage Metrics
- **Upload Success Rates**: Track profile picture upload success
- **Storage Usage**: Monitor storage consumption per user
- **Profile Completion**: Track percentage of users with complete profiles
- **Image Access Patterns**: Analyze profile picture view frequency

### Maintenance Tasks
- **Storage Cleanup**: Remove orphaned profile pictures
- **Image Optimization**: Implement automatic image resizing
- **Cache Management**: Optimize CDN caching for profile images
- **Security Audits**: Regular review of public file access

### Error Monitoring
```python
# Enhanced error handling for production
def upload_profile_picture_with_monitoring():
    try:
        # Upload logic
        log_metric("profile.upload.success", 1)
    except Exception as e:
        log_error("profile.upload.failure", str(e))
        return jsonify({"error": "Upload failed"}), 500
```

## Future Enhancements

### Advanced Features
```python
# Potential improvements
class EnhancedProfileManager:
    def resize_image(self, image_data: bytes, size: tuple) -> bytes:
        """Generate multiple image sizes for optimization"""
        
    def validate_image(self, file) -> bool:
        """Validate file type, size, and content"""
        
    def generate_avatar(self, username: str) -> bytes:
        """Generate default avatar from username"""
        
    def manage_image_versions(self, user_id: str) -> None:
        """Clean up old profile picture versions"""
```

### Image Processing
- **Automatic Resizing**: Generate thumbnail and full-size versions
- **Format Optimization**: Convert to optimized formats (WebP, etc.)
- **Content Filtering**: Scan for inappropriate content
- **Compression**: Optimize file sizes for faster loading

### Profile Enhancement
- **Profile Completeness**: Track and encourage complete profiles
- **Social Integration**: Import profile data from social networks
- **Profile Verification**: Email verification and profile badges
- **Privacy Controls**: Granular privacy settings for profile visibility

### Advanced Storage
- **CDN Integration**: Optimize image delivery through CDNs
- **Version Control**: Track profile picture history
- **Bulk Operations**: Support for batch profile updates
- **Migration Tools**: Easy profile data export/import