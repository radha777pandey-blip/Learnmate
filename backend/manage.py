"""
LEARNMATE - Input Validation and Data Management
Handles validation of user inputs including search queries to prevent nonsensical/invalid queries
"""

import re
import os
from typing import Tuple, Dict

class InputValidator:
    """Validates user input queries and data"""
    
    # Define valid learning-related keywords
    VALID_KEYWORDS = {
        'programming': ['python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'kotlin', 'swift'],
        'frameworks': ['react', 'angular', 'vue', 'django', 'flask', 'express', 'fastapi', 'spring', 'rails'],
        'data': ['data', 'analysis', 'analytics', 'visualization', 'pandas', 'numpy', 'sql', 'database'],
        'web': ['web', 'html', 'css', 'frontend', 'backend', 'fullstack', 'api', 'rest', 'graphql'],
        'mobile': ['mobile', 'android', 'ios', 'swift', 'kotlin', 'flutter', 'react native'],
        'devops': ['devops', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'deployment', 'git'],
        'cloud': ['cloud', 'aws', 'azure', 'gcp', 'google cloud'],
        'ai_ml': ['ai', 'machine learning', 'ml', 'deep learning', 'neural', 'tensorflow', 'pytorch'],
        'security': ['security', 'cyber', 'encryption', 'authentication', 'ssl', 'penetration'],
        'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3', 'smart contract']
    }
    
    # Common foolish/nonsensical phrases to reject
    NONSENSICAL_PHRASES = [
        r'i love you', r'i hate you', r'hello world', r'blah', r'asdf', r'qwerty',
        r'xyzabc', r'123456', r'test', r'random', r'foo bar', r'baz qux',
        r'lorem ipsum', r'dummy', r'fake', r'nonsense', r'gibberish',
        r'[a-z]{20,}',  # Very long random strings
        r'^[a-z]\s*[a-z]\s*[a-z]$',  # Single letters separated by spaces
        r'[\!\@\#\$\%\^\&\*]{5,}',  # Many special characters
    ]
    
    # Minimum length and quality checks
    MIN_QUERY_LENGTH = 3
    MAX_QUERY_LENGTH = 100
    
    @staticmethod
    def is_valid_query(query: str) -> Tuple[bool, str]:
        """
        Validate if a search query is legitimate learning-related content.
        
        Returns:
            Tuple[bool, str]: (is_valid, error_message)
        """
        if not query:
            return False, "Error: Search query cannot be empty."
        
        query = query.strip()
        
        # Check length
        if len(query) < InputValidator.MIN_QUERY_LENGTH:
            return False, f"Error: Search query must be at least {InputValidator.MIN_QUERY_LENGTH} characters long."
        
        if len(query) > InputValidator.MAX_QUERY_LENGTH:
            return False, f"Error: Search query cannot exceed {InputValidator.MAX_QUERY_LENGTH} characters."
        
        # Check for nonsensical phrases
        query_lower = query.lower()
        for pattern in InputValidator.NONSENSICAL_PHRASES:
            if re.search(pattern, query_lower):
                return False, "Error: Invalid search query. Please search for legitimate learning topics (e.g., 'Python programming', 'Web Development')."
        
        # Check if query contains at least some valid keywords
        has_valid_keyword = False
        for category, keywords in InputValidator.VALID_KEYWORDS.items():
            for keyword in keywords:
                if keyword in query_lower:
                    has_valid_keyword = True
                    break
            if has_valid_keyword:
                break
        
        # If no valid keywords found, check if it's a general category term
        general_terms = ['learning', 'course', 'tutorial', 'guide', 'programming', 'development', 'code', 'software']
        has_general_term = any(term in query_lower for term in general_terms)
        
        if not has_valid_keyword and not has_general_term:
            # Allow some flexibility - common typos or different phrasings
            words = query_lower.split()
            if len(words) < 2 or all(len(word) <= 2 for word in words):
                return False, "Error: Please enter a more descriptive search query (e.g., 'Learn Python', 'Web Development Courses')."
        
        return True, "Valid"
    
    @staticmethod
    def sanitize_query(query: str) -> str:
        """
        Sanitize query by removing excessive whitespace and special characters.
        
        Args:
            query (str): Raw query string
            
        Returns:
            str: Sanitized query
        """
        # Remove leading/trailing whitespace
        query = query.strip()
        
        # Replace multiple spaces with single space
        query = re.sub(r'\s+', ' ', query)
        
        # Remove special characters except spaces and hyphens
        query = re.sub(r'[^\w\s-]', '', query)
        
        return query
    
    @staticmethod
    def validate_and_clean(query: str) -> Tuple[bool, str, str]:
        """
        Complete validation and cleaning pipeline.
        
        Returns:
            Tuple[bool, str, str]: (is_valid, error_message, cleaned_query)
        """
        is_valid, message = InputValidator.is_valid_query(query)
        cleaned = InputValidator.sanitize_query(query) if is_valid else ""
        return is_valid, message, cleaned


class SearchManager:
    """Manages search operations with validation"""
    
    def __init__(self):
        self.validator = InputValidator()
    
    def search(self, query: str) -> Dict:
        """
        Execute a search with full validation.
        
        Returns:
            Dict: Response containing status, message, and data
        """
        is_valid, message, cleaned_query = self.validator.validate_and_clean(query)
        
        if not is_valid:
            return {
                'success': False,
                'error': message,
                'query': query,
                'suggestions': self._get_suggestions()
            }
        
        # If validation passes, return success
        return {
            'success': True,
            'message': 'Valid search query',
            'query': cleaned_query,
            'original_query': query
        }
    
    @staticmethod
    def _get_suggestions() -> list:
        """Provide helpful suggestions for valid searches"""
        return [
            "Try searching for specific technologies: 'Python Programming', 'Web Development', 'Data Science'",
            "Search for learning formats: 'Machine Learning Courses', 'JavaScript Tutorials'",
            "Search by skill level: 'Beginner Python', 'Advanced Web Development'",
            "Search by platform: 'AWS Cloud Computing', 'Docker DevOps'"
        ]


# Example usage and testing
if __name__ == '__main__':
    print("="*60)
    print("LEARNMATE - Input Validation Manager")
    print("="*60)
    
    # Test cases
    test_queries = [
        "Python Programming",
        "Web Development with React",
        "i love you",
        "Machine Learning",
        "blah blah",
        "Data Science Courses",
        "asdf qwerty",
        "Cloud Computing AWS",
        "xyz",
        "Blockchain Smart Contracts",
        "hello world test",
        "Deep Learning TensorFlow",
        "!@#$%^&*",
        "UI/UX Design",
    ]
    
    search_manager = SearchManager()
    
    for query in test_queries:
        result = search_manager.search(query)
        status = "✓ VALID" if result['success'] else "✗ INVALID"
        print(f"\n[{status}] Query: '{query}'")
        
        if result['success']:
            print(f"  → Cleaned: '{result['query']}'")
        else:
            print(f"  → Error: {result['error']}")
            if result.get('suggestions'):
                print(f"  → Suggestions:")
                for i, suggestion in enumerate(result['suggestions'][:2], 1):
                    print(f"     {i}. {suggestion}")
    
    print("\n" + "="*60)
    print("Validation tests completed!")
    print("="*60)
