# Embeddings Database Module Documentation

## Overview

This module provides a persistent storage layer for text embeddings using SQLite. It implements a simple key-value store where text strings serve as keys and their corresponding vector embeddings are stored as JSON-serialized floating-point arrays. The module is designed to cache embeddings to avoid redundant API calls to embedding generation services.

The implementation includes thread-safety mechanisms and provides basic CRUD operations for managing embeddings. This is typically used in machine learning applications where embeddings need to be cached for performance optimization.

## Architecture and Design

### Database Schema
The module uses a single SQLite table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS embeddings (
  text       TEXT PRIMARY KEY,
  embedding  TEXT NOT NULL
)
```

- `text`: Primary key storing the input text string
- `embedding`: JSON-serialized array of floating-point numbers representing the vector embedding

### Thread Safety
The module implements thread-safe operations using:
- `threading.Lock` for synchronizing database access
- Shared connection with `check_same_thread=False` parameter
- All database operations wrapped in lock context managers

### File Structure
- Database file: `data/embeddings.db` (relative to module location)
- Automatic directory creation if path doesn't exist
- Database and table creation on module import

## Dependencies

### Standard Library
- `os`: File path operations
- `sqlite3`: SQLite database interface
- `json`: Serialization/deserialization of embedding vectors
- `threading`: Thread synchronization primitives

### External Dependencies
None - uses only Python standard library

## Global Variables

### DB_PATH
**Type**: `str`
**Value**: `os.path.join(os.path.dirname(__file__), "data/embeddings.db")`
**Purpose**: Absolute path to the SQLite database file

### _db_lock
**Type**: `threading.Lock`
**Purpose**: Thread synchronization lock for database operations
**Scope**: Module-private, used internally for thread safety

### _conn
**Type**: `sqlite3.Connection`
**Purpose**: Shared database connection with thread-safe configuration
**Configuration**: `check_same_thread=False` for multi-threaded access
**Initialization**: Creates table on module import if not exists

## Functions

### get_embedding_from_db(text: str) -> list[float] | None

**Purpose**: Retrieve a stored embedding for the given text string.

**Parameters**:
- `text` (str): The text string to look up

**Returns**:
- `list[float]`: The embedding vector if found
- `None`: If no embedding exists for the given text

**Implementation Details**:
- Thread-safe using `_db_lock` context manager
- Executes parameterized SQL query to prevent injection
- Deserializes JSON string back to Python list
- Single database fetch operation

**Example Usage**:
```python
embedding = get_embedding_from_db("hello world")
if embedding:
    print(f"Found embedding with {len(embedding)} dimensions")
else:
    print("No embedding found")
```

**Performance**: O(1) average case due to PRIMARY KEY index on text column

### save_embedding_to_db(text: str, embedding: list[float]) -> None

**Purpose**: Store or update an embedding in the database.

**Parameters**:
- `text` (str): The text string to use as key
- `embedding` (list[float]): The embedding vector to store

**Returns**: None

**Side Effects**:
- Creates new record if text doesn't exist
- Updates existing record if text already exists (INSERT OR REPLACE)
- Commits transaction to ensure data persistence

**Implementation Details**:
- Thread-safe using `_db_lock` context manager
- Serializes embedding list to JSON string for storage
- Uses parameterized query for SQL injection prevention
- Automatic transaction commit after insert/update

**Example Usage**:
```python
text = "machine learning"
embedding = [0.1, 0.2, 0.3, 0.4]
save_embedding_to_db(text, embedding)
```

**Performance**: O(1) average case for insert/update operations

### print_all_rows() -> None

**Purpose**: Debug utility to display all stored embeddings in a readable format.

**Parameters**: None

**Returns**: None

**Side Effects**: Prints to stdout

**Implementation Details**:
- Creates new database connection (not using shared connection)
- Fetches all records from embeddings table
- Displays first element of each embedding with ellipsis
- Formats output for readability with 12 decimal places
- Closes connection after use

**Output Format**:
```
"hello world": [0.123456789012 ...]
"machine learning": [0.987654321098 ...]
```

**Use Case**: Development and debugging to inspect database contents

**Performance**: O(n) where n is the number of stored embeddings

## Database Operations

### Connection Management
- **Shared Connection**: Single connection used across all operations
- **Thread Safety**: `check_same_thread=False` with manual locking
- **Auto-commit**: Explicit commit calls after write operations
- **Connection Lifecycle**: Persists for application lifetime

### Query Patterns
- **Retrieval**: `SELECT embedding FROM embeddings WHERE text = ?`
- **Storage**: `INSERT OR REPLACE INTO embeddings (text, embedding) VALUES (?, ?)`
- **Debug**: `SELECT text, embedding FROM embeddings`

### Transaction Management
- Write operations immediately committed
- Read operations don't require transactions
- No explicit transaction boundaries (auto-commit mode)

## Error Handling

### Database Errors
- SQLite errors not explicitly caught (will propagate)
- Database connection failures will raise exceptions
- File system permissions issues will raise exceptions

### Data Integrity
- Primary key constraint prevents duplicate text entries
- NOT NULL constraint ensures embeddings are always present
- JSON serialization errors will propagate

### Thread Safety
- Lock acquisition guaranteed through context manager
- Deadlock prevention through consistent lock ordering
- Connection sharing safe with proper locking

## Performance Considerations

### Caching Strategy
- **Purpose**: Avoid redundant embedding generation API calls
- **Lookup Speed**: O(1) average case due to PRIMARY KEY index
- **Memory Usage**: Embeddings stored on disk, not in memory
- **Cache Invalidation**: Manual (INSERT OR REPLACE for updates)

### Scalability
- **Concurrent Access**: Thread-safe for multiple readers/writers
- **Database Size**: SQLite handles millions of records efficiently
- **Disk Usage**: JSON serialization adds overhead vs binary storage
- **Query Performance**: Single-table queries with primary key lookups

### Optimization Opportunities
- **Binary Storage**: Could use BLOB instead of JSON for space efficiency
- **Batch Operations**: Could implement bulk insert/update methods
- **Connection Pooling**: Could implement for high-concurrency scenarios
- **Compression**: Could compress embedding vectors for storage

## Security Considerations

### SQL Injection Prevention
- All queries use parameterized statements
- No string concatenation in SQL queries
- Input validation through type hints

### File System Security
- Database file created with default permissions
- No explicit file permission management
- Relies on filesystem security

### Data Privacy
- Embeddings stored in plaintext
- No encryption of stored vectors
- Text keys stored as-is

## Testing and Development

### Test Code Structure
The module includes comprehensive test code in the `if __name__ == "__main__"` block:

```python
# Sample test scenarios (currently commented out):
# - Basic save/retrieve operations
# - Multiple embedding storage
# - Overwrite behavior testing
# - Non-existent key handling
# - Database inspection utility
```

### Development Features
- **Debug Output**: `print_all_rows()` for database inspection
- **Test Data**: Sample embeddings for verification
- **Overwrite Testing**: Validates INSERT OR REPLACE behavior
- **Error Cases**: Tests for non-existent keys

## Usage Patterns

### Typical Workflow
1. **Check Cache**: Use `get_embedding_from_db()` to check if embedding exists
2. **Generate if Missing**: Call embedding API if not cached
3. **Store Result**: Use `save_embedding_to_db()` to cache new embedding
4. **Use Embedding**: Process the retrieved or generated embedding

### Integration Example
```python
def get_or_generate_embedding(text: str) -> list[float]:
    # Check cache first
    cached = get_embedding_from_db(text)
    if cached:
        return cached
    
    # Generate new embedding (pseudo-code)
    embedding = call_embedding_api(text)
    
    # Cache for future use
    save_embedding_to_db(text, embedding)
    
    return embedding
```

## Maintenance and Monitoring

### Database Maintenance
- No automatic cleanup implemented
- Manual database file management required
- Consider implementing TTL for old embeddings

### Monitoring
- No built-in metrics or logging
- Database size should be monitored
- Query performance tracking not implemented

### Backup Strategy
- Simple file-based backup of `embeddings.db`
- No automatic backup mechanism
- Consider regular database exports