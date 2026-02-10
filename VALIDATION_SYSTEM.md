# Input Validation System - LEARNMATE

## Overview
The LEARNMATE application now includes a comprehensive input validation system to prevent invalid, nonsensical, or inappropriate search queries. When users search with foolish messages like "i love you" or random keyboard mashes, the system will print clear error messages and suggestions.

## Files Modified

### 1. **backend/manage.py** (NEW FILE)
A new module containing input validation logic with the following components:

#### `InputValidator` Class
Validates user input queries with multiple checks:

- **Length Validation**: Ensures queries are between 3-100 characters
- **Nonsensical Pattern Detection**: Detects and rejects:
  - Foolish phrases: "i love you", "i hate you", "blah", "asdf", "qwerty"
  - Lorem ipsum text
  - Excessive special characters
  - Random character strings
  - Single letters separated by spaces

- **Keyword Validation**: Checks if the query contains relevant learning-related keywords across categories:
  - Programming languages (Python, JavaScript, Java, etc.)
  - Frameworks (React, Angular, Django, etc.)
  - Data science terms
  - Web development concepts
  - Mobile development
  - DevOps technologies
  - Cloud platforms
  - AI/ML terms
  - Cybersecurity concepts
  - Blockchain technologies

#### `SearchManager` Class
Manages search operations with full validation pipeline:
- `search(query)`: Executes validation and returns results with error messages or suggestions
- `_get_suggestions()`: Provides helpful examples of valid searches

#### Error Responses
Users will see clear error messages:
```
Error: Invalid search query. Please search for legitimate learning topics 
(e.g., 'Python programming', 'Web Development').
```

### 2. **backend/proxy.py** (MODIFIED)
Updated all API endpoints to use the validation system:

#### Modified Endpoints:
1. **`/api/recommend`** - Main learning recommendations endpoint
   - Validates interest query before processing
   - Returns 400 error with suggestions if invalid
   - Cleans valid queries before sending to OpenAI

2. **`/api/classify-interest`** - Interest classification endpoint
   - Validates interest input
   - Returns helpful error messages for invalid inputs
   - Returns success flag with valid classification

#### Integration:
```python
from manage import InputValidator, SearchManager

validator = InputValidator()
search_manager = SearchManager()

# In endpoints:
is_valid, validation_message, cleaned_interest = validator.validate_and_clean(interest)
if not is_valid:
    return jsonify({
        'error': validation_message,
        'original_query': interest,
        'suggestions': search_manager._get_suggestions()
    }), 400
```

## Validation Logic

### Valid Queries Examples:
✓ "Python Programming"
✓ "Web Development with React"
✓ "Machine Learning"
✓ "Data Science Courses"
✓ "Cloud Computing AWS"
✓ "Blockchain Smart Contracts"

### Invalid Queries Examples (Will be rejected):
✗ "i love you" - Nonsensical/love phrase
✗ "blah blah" - Nonsensical keyword
✗ "asdf qwerty" - Random keyboard input
✗ "hello world test" - Common foolish phrase
✗ "!@#$%^&*" - Excessive special characters
✗ "xyz" - Too vague, no valid keywords

## API Response Examples

### Successful Query:
```json
{
  "content": "Here are the best resources for Python Programming...",
  "success": true
}
```

### Invalid Query:
```json
{
  "error": "Error: Invalid search query. Please search for legitimate learning topics (e.g., 'Python programming', 'Web Development').",
  "original_query": "i love you",
  "suggestions": [
    "Try searching for specific technologies: 'Python Programming', 'Web Development', 'Data Science'",
    "Search for learning formats: 'Machine Learning Courses', 'JavaScript Tutorials'",
    "Search by skill level: 'Beginner Python', 'Advanced Web Development'",
    "Search by platform: 'AWS Cloud Computing', 'Docker DevOps'"
  ]
}
```

## Testing

Run the validation tests directly:
```bash
cd backend
python manage.py
```

This will test against 14+ different query patterns including:
- Valid technical queries
- Foolish/nonsensical phrases
- Random strings
- Special character combinations
- And more...

## Key Features

1. **Foolish Message Detection**: Automatically rejects "i love you" and similar phrases
2. **Keyword-Based Validation**: Ensures queries are learning-related
3. **User-Friendly Error Messages**: Clear feedback on why a query was rejected
4. **Helpful Suggestions**: Users receive 4 examples of valid searches
5. **Query Cleaning**: Valid queries are sanitized of excess whitespace
6. **Customizable Rules**: Easy to add/remove keywords or patterns in the `VALID_KEYWORDS` and `NONSENSICAL_PHRASES` dictionaries

## Future Enhancements

- Add language detection to reject non-English queries
- Implement machine learning-based content filtering
- Add user feedback mechanism to improve validation rules
- Create admin dashboard to monitor rejected queries
- Add rate limiting for repeated invalid queries

## Configuration

To modify validation rules, edit `backend/manage.py`:

```python
# Add more nonsensical phrases
NONSENSICAL_PHRASES = [
    r'i love you',  # Add your patterns here
    r'your_pattern_here'
]

# Adjust length constraints
MIN_QUERY_LENGTH = 3      # Minimum characters
MAX_QUERY_LENGTH = 100    # Maximum characters
```

---

**Last Updated**: February 10, 2026
**Version**: 1.0
**Status**: Deployed and tested
