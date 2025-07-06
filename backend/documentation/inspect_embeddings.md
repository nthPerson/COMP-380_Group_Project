# Embeddings Database Inspector Documentation

## Overview

This is a standalone command-line utility script for inspecting the contents of the embeddings database. It provides a quick way to view all stored text-embedding pairs in a human-readable format, displaying the first element of each embedding vector for debugging and verification purposes.

The script serves as a debugging tool and database inspection utility, allowing developers to quickly verify the contents of the embeddings cache without needing to integrate with the larger application. It's designed to be run independently from the main application for maintenance and troubleshooting tasks.

## Architecture and Design

### Script Structure
- **Executable Script**: Uses shebang (`#!/usr/bin/env python3`) for direct execution
- **Standalone Operation**: Independent of the main application
- **Database Read-Only**: Only reads from the database, no modifications
- **Simple Output**: Formatted display of database contents

### Design Principles
- **Minimal Dependencies**: Uses only standard library and existing database path
- **Safe Operation**: Read-only access prevents accidental data modification
- **Clear Output**: Formatted display for easy human consumption
- **Resource Management**: Proper database connection handling

## Dependencies

### Standard Library
- `sqlite3`: SQLite database interface for reading embeddings data
- `json`: JSON parsing for deserializing embedding vectors

### Internal Dependencies
- `embeddings_db.DB_PATH`: Database path constant from the embeddings database module

### System Requirements
- Python 3.x (specified in shebang)
- Access to the embeddings database file
- Read permissions on the database directory

## Functions

### main() -> None

**Purpose**: Execute the database inspection and display all stored embeddings.

**Parameters**: None

**Returns**: None

**Side Effects**: Prints formatted output to stdout

**Implementation Details**:
- Creates new database connection using imported `DB_PATH`
- Executes SQL query to retrieve all text-embedding pairs
- Iterates through results and formats output
- Properly closes database connection after use

**Database Query**:
```sql
SELECT text, embedding FROM embeddings
```

**Output Format**:
```
"text_key_1": [0.123456789012 ...]
"text_key_2": [0.987654321098 ...]
"text_key_3": [-0.456789012345 ...]
```

**Resource Management**:
- Creates dedicated connection (separate from main application)
- Explicitly closes connection after use
- No transaction management needed for read-only operations

## Database Operations

### Connection Management
- **Independent Connection**: Creates new connection separate from main application
- **Read-Only Access**: No write operations or transactions
- **Manual Cleanup**: Explicit connection closing
- **Error Handling**: Relies on SQLite default error handling

### Query Pattern
- **Simple SELECT**: Retrieves all records from embeddings table
- **No Filtering**: Displays complete database contents
- **Streaming Results**: Processes results as iterator for memory efficiency
- **No Indexing**: Query performance depends on table size

### Data Processing
- **JSON Deserialization**: Converts stored JSON strings back to Python lists
- **Vector Sampling**: Displays only first element of each embedding
- **Precision Control**: Formats floating-point numbers to 12 decimal places
- **Memory Efficient**: Processes one record at a time

## Output Format and Display

### Display Characteristics
- **Quoted Keys**: Text keys displayed in double quotes for clarity
- **Vector Preview**: Shows first element followed by ellipsis
- **High Precision**: 12 decimal places for floating-point values
- **Consistent Format**: Uniform display across all entries

### Example Output
```bash
$ python3 inspect_embeddings.py
"hello world": [0.123456789012 ...]
"machine learning": [-0.987654321098 ...]
"data science": [0.456789012345 ...]
"artificial intelligence": [-0.234567890123 ...]
```

### Output Interpretation
- **Text Key**: The original text that was embedded
- **First Vector Element**: First dimension of the embedding vector
- **Ellipsis**: Indicates additional vector dimensions not shown
- **Sign and Magnitude**: Shows both positive and negative values

## Usage Patterns

### Command Line Execution
```bash
# Direct execution
$ python3 inspect_embeddings.py

# With Python interpreter
$ python inspect_embeddings.py

# Make executable and run
$ chmod +x inspect_embeddings.py
$ ./inspect_embeddings.py
```

### Development Workflow
1. **Database Changes**: After adding new embeddings to database
2. **Run Inspector**: Execute script to verify database contents
3. **Verify Data**: Check that expected embeddings are present
4. **Debug Issues**: Identify missing or corrupted embeddings

### Integration with Development Tools
```bash
# Count total embeddings
$ python3 inspect_embeddings.py | wc -l

# Search for specific text
$ python3 inspect_embeddings.py | grep "machine learning"

# Save output to file
$ python3 inspect_embeddings.py > embeddings_snapshot.txt
```

## Security Considerations

### File System Access
- **Read Permissions**: Requires read access to database file
- **Database Location**: Uses centralized database path from embeddings_db module
- **No Write Access**: Read-only operations prevent accidental modifications
- **Path Validation**: Relies on embeddings_db module for secure path handling

### Data Exposure
- **Text Content**: Displays text keys that were embedded
- **Vector Sampling**: Shows only first element, limiting vector exposure
- **No Authentication**: No built-in access control (relies on file system)
- **Stdout Output**: Data displayed in plain text to console

## Performance Considerations

### Database Access
- **Connection Overhead**: Creates new connection for each execution
- **Query Performance**: Full table scan of embeddings table
- **Memory Usage**: Processes records one at a time for memory efficiency
- **I/O Operations**: Sequential read of entire database table

### Scalability
- **Large Databases**: Performance degrades with database size
- **Output Volume**: Console output may be overwhelming for large datasets
- **Network Storage**: Slower if database is on network-mounted storage
- **Concurrent Access**: Safe for concurrent reads with other processes

### Optimization Opportunities
- **Pagination**: Could implement pagination for large datasets
- **Filtering**: Could add command-line options to filter results
- **Sampling**: Could show sample of records instead of all records
- **Binary Output**: Could offer binary format for programmatic use

## Error Handling

### Database Errors
- **Missing Database**: SQLite will raise exception if database file doesn't exist
- **Corruption**: SQLite will raise exception for corrupted database files
- **Permissions**: Operating system will raise permission errors
- **Lock Conflicts**: Potential conflicts if database is locked by other processes

### Data Format Errors
- **JSON Parsing**: Invalid JSON in embedding column will raise exception
- **Vector Format**: Non-list data in embedding column will cause errors
- **Empty Vectors**: Empty embedding arrays may cause index errors

### System Errors
- **Import Errors**: Missing embeddings_db module will prevent execution
- **Path Errors**: Invalid database path will cause connection failures
- **Resource Limits**: Very large databases may exceed memory limits

## Maintenance and Troubleshooting

### Common Issues

#### "No such file or directory" Error
- **Cause**: Database file doesn't exist at expected path
- **Solution**: Verify database has been created and path is correct
- **Check**: Confirm embeddings_db module is properly configured

#### "Database is locked" Error
- **Cause**: Another process has exclusive lock on database
- **Solution**: Wait for other operations to complete or restart application
- **Check**: Identify processes using the database file

#### Empty Output
- **Cause**: Database exists but contains no embeddings
- **Solution**: Verify embeddings have been added to database
- **Check**: Use database browser to inspect table contents

#### JSON Decode Errors
- **Cause**: Corrupted embedding data in database
- **Solution**: Identify and remove corrupted records
- **Check**: Manually inspect embedding column data

### Debugging Tips
- Verify database file exists and is readable
- Check that embeddings_db module is importable
- Test with known good database file
- Use SQLite command-line tools for database verification

### Maintenance Tasks
- **Regular Inspection**: Run periodically to verify database health
- **Performance Monitoring**: Track execution time for large databases
- **Data Validation**: Verify embedding format consistency
- **Backup Verification**: Test backups by inspecting restored databases

## Integration with Development Workflow

### CI/CD Integration
```bash
# Add to test pipeline
python3 inspect_embeddings.py > /dev/null && echo "Database accessible"
```

### Monitoring Scripts
```bash
#!/bin/bash
# Monitor database growth
EMBEDDING_COUNT=$(python3 inspect_embeddings.py | wc -l)
echo "Total embeddings: $EMBEDDING_COUNT"
```

### Development Testing
```python
# Test script integration
import subprocess
result = subprocess.run(['python3', 'inspect_embeddings.py'], 
                       capture_output=True, text=True)
assert result.returncode == 0
```

## Future Enhancements

### Potential Features
- **Command-line Arguments**: Add options for filtering and formatting
- **JSON Output**: Structured output format for programmatic use
- **Statistics**: Show embedding statistics (dimensions, value ranges)
- **Search Functionality**: Find embeddings by text pattern
- **Export Options**: Export to CSV or other formats

### Advanced Options
```bash
# Potential future usage
$ python3 inspect_embeddings.py --format json
$ python3 inspect_embeddings.py --filter "machine*"
$ python3 inspect_embeddings.py --stats
$ python3 inspect_embeddings.py --limit 10
```