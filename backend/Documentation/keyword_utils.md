# Keyword Management Utils Documentation

## Overview

This module provides in-memory keyword management functionality for a resume optimization system. It allows users to select, store, and manage keywords extracted from job descriptions or resumes for the purpose of tailoring resumes to specific job requirements. The module maintains user-specific keyword collections during active sessions to support resume optimization workflows.

The keyword management system is designed to be fast and simple, using in-memory storage for immediate access during the resume building process. Keywords are associated with user IDs from Firebase authentication and persist only during the application session.

## Architecture and Design

### Storage Strategy
- **In-Memory Storage**: Fast access with no database overhead
- **Session-Based Persistence**: Data exists only during application runtime
- **User Isolation**: Keywords are segregated by Firebase user ID
- **Set-Based Deduplication**: Automatic handling of duplicate keywords

### Data Structure
```python
_selected_keywords = {
    "user_id_1": {"keyword1", "keyword2", "keyword3"},
    "user_id_2": {"keywordA", "keywordB"},
    # ... additional users
}
```

### Design Principles
- **Simplicity**: Minimal overhead for temporary data storage
- **Performance**: O(1) access times for user keyword collections
- **Memory Efficiency**: Uses Python sets for automatic deduplication
- **Session Scope**: No persistent storage requirements

## Dependencies

### Flask Integration
- `flask.jsonify`: Standardized JSON response formatting
- `flask.request`: HTTP request data access for keyword operations
- `flask.g`: Flask application context for user authentication data

### Authentication
- Requires Firebase authentication context (`g.firebase_user["uid"]`)
- User ID extraction from authenticated session
- No direct authentication handling within module

## Global Storage

### _selected_keywords
**Type**: `Dict[str, Set[str]]`
**Purpose**: Maps user IDs to their selected keyword sets
**Scope**: Module-global, persists for application lifetime
**Thread Safety**: Not thread-safe (single-threaded Flask assumption)

**Structure**:
- **Key**: Firebase user ID (string)
- **Value**: Set of selected keywords (strings)
- **Initialization**: Empty dictionary, populated on first user access

**Memory Characteristics**:
- **Growth**: Increases with active users and keyword selections
- **Cleanup**: No automatic cleanup (relies on application restart)
- **Size**: Bounded by concurrent users and keywords per user

## Functions

### add_keywords() -> Tuple[Response, int]

**Purpose**: Add one or more keywords to the user's current selection from job descriptions or resume analysis.

**HTTP Method**: POST

**Request Body**:
```json
{
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

**Response Format**:
```json
{
  "keywords": ["keyword1", "keyword2", "keyword3", "existing_keyword"]
}
```

**HTTP Status**: 200 (Success)

**Implementation Details**:
1. Extract user ID from Firebase authentication context
2. Retrieve keywords array from request JSON
3. Initialize user's keyword set if first access
4. Add all provided keywords to user's set (automatic deduplication)
5. Return complete updated keyword list

**Set Operations**:
- Uses `set.add()` for individual keyword insertion
- Automatic deduplication through set data structure
- Preserves existing keywords while adding new ones

**Example Usage**:
```python
# Request
POST /api/add_keywords
{
  "keywords": ["Python", "React", "AWS"]
}

# Response
{
  "keywords": ["Python", "React", "AWS", "JavaScript"]
}
```

**Error Handling**: Gracefully handles missing or empty keywords array

### remove_keyword() -> Tuple[Response, int]

**Purpose**: Remove a specific keyword from the user's selected keyword collection.

**HTTP Method**: POST

**Request Body**:
```json
{
  "keyword": "keyword_to_remove"
}
```

**Response Format**:
```json
{
  "keywords": ["remaining_keyword1", "remaining_keyword2"]
}
```

**HTTP Status**: 200 (Success)

**Implementation Details**:
1. Extract user ID from Firebase authentication context
2. Retrieve single keyword from request JSON
3. Use `set.discard()` to safely remove keyword (no error if not present)
4. Return updated keyword list for user

**Safe Removal**:
- `discard()` method prevents KeyError if keyword doesn't exist
- Handles cases where user has no keywords selected
- Maintains consistency even with invalid removal requests

**Example Usage**:
```python
# Request
POST /api/remove_keyword
{
  "keyword": "Python"
}

# Response
{
  "keywords": ["React", "AWS", "JavaScript"]
}
```

**Edge Cases**:
- Removing non-existent keyword: No error, returns current list
- User with no keywords: Returns empty list
- Missing keyword parameter: Safe operation, no change

### get_keywords() -> Tuple[Response, int]

**Purpose**: Retrieve the user's currently selected keywords for display or processing.

**HTTP Method**: GET

**Request Body**: None (GET request)

**Response Format**:
```json
{
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

**HTTP Status**: 200 (Success)

**Implementation Details**:
1. Extract user ID from Firebase authentication context
2. Retrieve user's keyword set from global storage
3. Convert set to list for JSON serialization
4. Return current keyword collection

**Default Behavior**:
- Returns empty list for users with no selected keywords
- Uses `dict.get()` with default empty set for missing users
- Consistent response format regardless of keyword count

**Example Usage**:
```python
# Request
GET /api/get_keywords

# Response
{
  "keywords": ["Python", "React", "AWS", "JavaScript"]
}
```

**Use Cases**:
- Displaying current keyword selection in UI
- Validating keyword state before resume generation
- Debugging keyword management functionality

### clear_keywords() -> Tuple[Response, int]

**Purpose**: Remove all selected keywords for the current user, resetting their selection.

**HTTP Method**: POST

**Request Body**: None required

**Response Format**:
```json
{
  "keywords": []
}
```

**HTTP Status**: 200 (Success)

**Implementation Details**:
1. Extract user ID from Firebase authentication context
2. Return empty keyword list (effectively clearing selection)
3. No actual storage modification (memory-efficient approach)

**Storage Behavior**:
- Does not remove user entry from global dictionary
- Relies on next operation to reinitialize if needed
- Immediate response without storage modification

**Example Usage**:
```python
# Request
POST /api/clear_keywords

# Response
{
  "keywords": []
}
```

**Use Cases**:
- Starting fresh keyword selection for new job application
- Resetting state after resume generation
- User-initiated keyword management reset

## Data Flow and Integration

### Keyword Collection Workflow
1. **Job Description Analysis**: AI services extract relevant keywords
2. **Keyword Addition**: Users select keywords via `add_keywords()`
3. **Keyword Management**: Users refine selection via `remove_keyword()`
4. **Resume Generation**: Keywords used to tailor resume content
5. **Session Reset**: Optional clearing via `clear_keywords()`

### Integration with Resume System
```python
# Typical integration pattern
def generate_targeted_resume():
    user_id = g.firebase_user["uid"]
    selected_keywords = _selected_keywords.get(user_id, set())
    
    # Use keywords in resume generation
    resume_content = create_resume_with_keywords(
        base_resume=get_user_resume(),
        target_keywords=list(selected_keywords),
        job_description=get_job_description()
    )
    
    return resume_content
```

### Frontend Integration
```javascript
// Add keywords from job analysis
await fetch('/api/add_keywords', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    keywords: ['Python', 'Machine Learning', 'AWS']
  })
});

// Get current keywords for display
const response = await fetch('/api/get_keywords');
const data = await response.json();
displayKeywords(data.keywords);

// Remove unwanted keyword
await fetch('/api/remove_keyword', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    keyword: 'outdated_skill'
  })
});
```

## Performance Characteristics

### Time Complexity
- **Add Keywords**: O(k) where k is number of keywords to add
- **Remove Keyword**: O(1) average case for set operations
- **Get Keywords**: O(n) where n is user's keyword count (for list conversion)
- **Clear Keywords**: O(1) constant time operation

### Space Complexity
- **Per User**: O(k) where k is number of selected keywords
- **Total System**: O(u × k) where u is active users, k is average keywords per user
- **Growth Pattern**: Linear with user count and keyword selections

### Memory Usage Estimates
- **Typical User**: 10-50 keywords × ~10 bytes = 100-500 bytes
- **100 Concurrent Users**: ~10-50 KB total memory usage
- **Keyword Overhead**: Minimal due to string interning in Python

## Security Considerations

### Authentication Requirements
- **Firebase Integration**: All functions require authenticated user context
- **User Isolation**: Keywords automatically segregated by user ID
- **Session Security**: No persistent storage reduces attack surface

### Data Privacy
- **Memory-Only Storage**: No disk persistence reduces data exposure
- **Session Scope**: Data automatically cleared on application restart
- **User Control**: Users can clear their own data via `clear_keywords()`

### Input Validation
- **Keyword Content**: No explicit validation of keyword content
- **JSON Structure**: Relies on Flask request parsing for validation
- **Length Limits**: No enforced limits on keyword count or length

## Limitations and Considerations

### Session Persistence
- **Application Restart**: All keyword selections lost on server restart
- **No Backup**: No recovery mechanism for lost selections
- **User Experience**: Users must reselect keywords after disruptions

### Concurrency
- **Thread Safety**: Not designed for multi-threaded access
- **Race Conditions**: Possible with concurrent user operations
- **Flask Assumption**: Relies on single-threaded Flask request handling

### Scalability
- **Memory Growth**: Linear growth with active users
- **No Cleanup**: Accumulates data for application lifetime
- **Resource Limits**: Bounded by available server memory

## Error Handling Patterns

### Graceful Degradation
```python
# Safe user access pattern
user_keywords = _selected_keywords.get(user_id, set())

# Safe keyword removal
if keyword and user_id in _selected_keywords:
    _selected_keywords[user_id].discard(keyword)
```

### Consistent Responses
- All functions return 200 status for successful operations
- Consistent JSON response format across all endpoints
- Empty list returned for missing or cleared keyword sets

### Exception Safety
- No explicit exception handling (relies on Flask error handling)
- Safe operations prevent most common error conditions
- Set operations provide built-in safety for missing elements

## Future Enhancements

### Potential Improvements
1. **Persistent Storage**: Database integration for session persistence
2. **Keyword Validation**: Content filtering and validation
3. **Usage Analytics**: Track keyword selection patterns
4. **Expiration**: Automatic cleanup of old keyword selections
5. **Bulk Operations**: Batch add/remove functionality

### Database Migration
```python
# Potential database schema
class UserKeywords:
    user_id: str
    keywords: List[str]
    created_at: datetime
    updated_at: datetime
```

### Advanced Features
- **Keyword Suggestions**: AI-powered keyword recommendations
- **Category Grouping**: Organize keywords by skill type or domain
- **Priority Weighting**: Allow users to weight keyword importance
- **History Tracking**: Maintain keyword selection history

## Testing and Development

### Unit Testing Patterns
```python
def test_add_keywords():
    # Mock Flask context
    with app.test_request_context():
        g.firebase_user = {"uid": "test_user"}
        
        # Test keyword addition
        response = add_keywords()
        assert response[1] == 200  # HTTP status
        
        # Verify keywords added
        keywords = get_keywords()
        assert "Python" in keywords[0].json["keywords"]
```

### Integration Testing
- Test with real Firebase authentication
- Verify keyword persistence during session
- Test concurrent user operations
- Validate JSON response formats

### Development Utilities
- Clear all user data for testing
- Monitor memory usage patterns
- Debug keyword selection workflows
- Validate integration with resume generation