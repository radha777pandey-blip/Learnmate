from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from ml_models import InterestClassifier, RecommendationEngine, TextSimilarityModel
    ML_AVAILABLE = True
except ImportError as e:
    print(f'Warning: ML models not available: {e}')
    ML_AVAILABLE = False

# Import input validation
from manage import InputValidator, SearchManager
validator = InputValidator()
search_manager = SearchManager()

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
DEMO_MODE = os.environ.get('DEMO_MODE', 'false').lower() == 'true'

# Initialize ML models if available
interest_classifier = InterestClassifier() if ML_AVAILABLE else None
recommendation_engine = RecommendationEngine() if ML_AVAILABLE else None
similarity_model = TextSimilarityModel() if ML_AVAILABLE else None

if not OPENAI_API_KEY:
    # We allow the server to start but will return an error if requests arrive without a configured key
    print('Warning: OPENAI_API_KEY not set in environment. Set it before running the proxy.')

if DEMO_MODE:
    print('[DEMO MODE] Using mock responses instead of OpenAI API')

OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

# Mock responses for demo mode
def get_demo_response(interest, req_type, mode):
    """Return realistic demo responses without calling OpenAI API"""
    full_plan = f"""
🎯 AI-Generated Learning Plan for {interest}

📚 **Recommended Books**
1. "The Pragmatic Programmer" by David Thomas & Andrew Hunt - Essential guide to core programming principles and best practices.
2. "Clean Code" by Robert C. Martin - Teaches how to write readable, maintainable, and professional-quality code.
3. "Design Patterns" by Gang of Four - Comprehensive coverage of reusable design patterns for solving common problems.
4. "Cracking the Coding Interview" by Gayle McDowell - Practical strategies for acing technical interviews.

🎓 **Best Online Courses**
1. Coursera - {interest} Specialization (4-6 months) - Comprehensive structured learning with projects.
2. Udemy - {interest} Masterclass (40+ hours) - Self-paced with lifetime access.
3. edX - {interest} Professional Certificate (3-4 months) - University-backed, recognized credential.
4. Codecademy - Interactive {interest} Course (20-30 hours) - Hands-on practice in browser.

💻 **Coding Practice Platforms**
1. LeetCode - Algorithm & data structure problems with difficulty levels.
2. HackerRank - Coding challenges, competitions, and interview prep.
3. CodeSignal - AI-powered assessments and interview preparation.
4. GeeksforGeeks - Tutorials, problems, and comprehensive documentation.

🚀 **Learning Roadmap**

**Phase 1: Foundations (Weeks 1-4)**
- Learn core concepts and fundamentals
- Start with beginner-friendly tutorials
- Complete first 10-20 easy problems on LeetCode
- Time commitment: 10-15 hours/week

**Phase 2: Building Skills (Weeks 5-12)**
- Deepen knowledge with intermediate projects
- Practice 20-30 problems of medium difficulty
- Start building a portfolio project
- Time commitment: 15-20 hours/week

**Phase 3: Advanced Concepts (Weeks 13-20)**
- Master complex topics and patterns
- Tackle hard problems and system design
- Complete 2-3 portfolio projects
- Time commitment: 20-25 hours/week

**Phase 4: Interview Prep & Optimization (Weeks 21-24)**
- Mock interviews and timed challenges
- Focus on weaknesses identified in practice
- Polish portfolio and GitHub
- Time commitment: 15-20 hours/week

⏱️ **Timeline & Tips**
- Expected Timeline: 3-6 months for intermediate proficiency
- Recommended: Study 15-20 hours/week for consistent progress
- Best Practice: Code every day, even if just 30 minutes
- Join communities: GitHub, Stack Overflow, Reddit communities for support
- Build projects: Apply learning to real-world problems
- Track progress: Keep a learning journal and review milestones monthly
"""
    
    short_responses = {
        'books': f"""📚 Recommended Books for {interest}

1. "The Pragmatic Programmer" - Essential guide to professional programming practices  
   Link: https://pragprog.com/titles/tpp20/the-pragmatic-programmer/
2. "Clean Code" - Learn to write readable and maintainable code  
   Link: https://www.pearson.com/en-us/subject-catalog/p/clean-code/P200000006377/9780132350884
3. "Design Patterns" by Gang of Four - Comprehensive design patterns reference  
   Link: https://learning.oreilly.com/library/view/design-patterns-elements/0201633612/
4. "Cracking the Coding Interview" - Ace your technical interviews  
   Link: https://www.crackingthecodinginterview.com/

🎥 Helpful YouTube videos
- "How to Read Coding Books Effectively" – freeCodeCamp.org (YouTube)
- "{interest} Book Recommendations" – search on YouTube for curated lists""",
        
        'courses': f"""🎓 Top Online Courses for {interest}

1. Coursera – {interest} Specialization (4–6 months, beginner-friendly)  
   Link: https://www.coursera.org
2. Udemy – Complete {interest} Bootcamp (40+ hours, lifetime access)  
   Link: https://www.udemy.com
3. edX – Professional Certificate in {interest} (university-backed)  
   Link: https://www.edx.org
4. LinkedIn Learning – {interest} Essential Training  
   Link: https://www.linkedin.com/learning

🎥 Sample YouTube playlists
- "Complete {interest} Course" – freeCodeCamp.org (YouTube)
- "Crash Course in {interest}" – search on YouTube for updated playlists""",
        
        'coding': f"""💻 Best Platforms for {interest} Practice

1. LeetCode – 2000+ DSA problems with difficulty levels  
   Link: https://leetcode.com
2. HackerRank – Coding challenges and interview kits  
   Link: https://www.hackerrank.com
3. Codeforces – Competitive programming contests  
   Link: https://codeforces.com
4. CodeSignal – Timed assessments and practice  
   Link: https://codesignal.com

🎥 YouTube resources
- "DSA Playlist" – Abdul Bari / Kunal Kushwaha (YouTube)
- "LeetCode Patterns" – NeetCode (YouTube)""",
        
        'roadmap': f"""🚀 {interest} Learning Roadmap

Phase 1: Foundations (Weeks 1–4)  
- Learn core fundamentals and key terminology  
- Follow a beginner playlist on YouTube for {interest}

Phase 2: Core Skills (Weeks 5–12)  
- Complete 1–2 structured courses (Coursera/Udemy for {interest})  
- Start 1–2 guided mini-projects

Phase 3: Projects & Practice (Weeks 13–20)  
- Build 2–3 real projects and publish on GitHub  
- Practice related coding problems on LeetCode / HackerRank

Phase 4: Interview & Portfolio (Weeks 21–24)  
- Refine resume and GitHub profile  
- Mock interviews + timed challenges

🎥 Roadmap inspiration
- Search YouTube for "{interest} roadmap" from channels like Roadmap.sh, freeCodeCamp, Kunal Kushwaha"""
    }
    
    if mode == 'full' or req_type == 'full':
        return full_plan
    return short_responses.get(req_type, short_responses['books'])

# Helper to build prompt on the server-side
def build_prompt(interest, req_type, mode):
    if mode == 'full' or req_type == 'full':
        return (f"You are an AI learning advisor. A user is interested in \"{interest}\". "
                "Provide comprehensive personalized recommendations including:\n\n"
                "1. Recommended Books (3-4 titles with brief descriptions)\n"
                "2. Best Online Courses (3-4 platforms/courses)\n"
                "3. Coding Practice Platforms (3-4 resources if applicable)\n"
                "4. Learning Roadmap (4-5 phases with key skills)\n"
                "5. Timeline & Tips (Realistic timeline and actionable tips)\n\n"
                "Keep it structured, practical, and motivating.")
    # short type prompts – optimized for category pages with links and videos
    mapping = {
        'books': (
            f'Generate 4–6 highly recommended books for someone interested in "{interest}". '
            f'For each book, provide: Title, Author, 1-line description, and a direct URL link (http/https). '
            f'After the list, recommend 1–2 specific YouTube videos or playlists (with exact titles and channels) related to "{interest}". '
            f'Format as a clean, readable list.'
        ),
        'courses': (
            f'Suggest 4–6 of the best online courses for learning "{interest}". '
            f'Include platform name (Coursera, Udemy, edX, etc.), exact course name, difficulty (beginner/intermediate/advanced), '
            f'and a direct course or catalog URL. After the list, recommend 1–2 specific YouTube playlists or channels (with titles) '
            f'for "{interest}". Format clearly as bullet points.'
        ),
        'coding': (
            f'Recommend 4–6 of the best coding practice platforms and resources for "{interest}". '
            f'For each, include: platform name, focus (DSA, competitive programming, projects, etc.), and a direct URL. '
            f'Then suggest 1–2 YouTube series (with titles and channels) that walk through practice problems or patterns for "{interest}". '
            f'Format as a structured list.'
        ),
        'roadmap': (
            f'Create a structured learning roadmap for "{interest}". '
            f'Break it into 4–5 clearly labeled phases with timelines (e.g., Weeks 1–4), key skills, and 1–2 example resources per phase '
            f'(course names, documentation pages, or playlists with URLs when possible). '
            f'At the end, suggest 1–2 YouTube videos or playlists titled as "{interest} roadmap" style content. '
            f'Use headings for each phase and keep it very clear.'
        )
    }
    return mapping.get(req_type, mapping['books'])

@app.route('/api/recommend', methods=['POST', 'OPTIONS'])
def recommend():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    data = request.get_json() or {}
    interest = data.get('interest')
    req_type = data.get('type') or data.get('req_type') or 'books'
    mode = data.get('mode') or 'short'

    if not interest:
        return jsonify({'error': 'Missing "interest" in request body.'}), 400

    # Validate the interest query
    is_valid, validation_message, cleaned_interest = validator.validate_and_clean(interest)
    if not is_valid:
        return jsonify({
            'error': validation_message,
            'original_query': interest,
            'suggestions': search_manager._get_suggestions()
        }), 400

    # Use cleaned interest for processing
    interest = cleaned_interest

    # Use demo mode if enabled
    if DEMO_MODE:
        demo_content = get_demo_response(interest, req_type, mode)
        return jsonify({'content': demo_content})

    if not OPENAI_API_KEY:
        return jsonify({'error': 'Server missing OPENAI_API_KEY environment variable. Set DEMO_MODE=true to test without API key.'}), 500

    prompt = build_prompt(interest, req_type, mode)

    payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.7,
        'max_tokens': 1200,
    }

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {OPENAI_API_KEY}'
    }

    try:
        resp = requests.post(OPENAI_URL, headers=headers, json=payload, timeout=30)
    except requests.exceptions.Timeout:
        return jsonify({'error': 'OpenAI API request timed out. Please try again.'}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Network error calling OpenAI: {str(e)}'}), 502

    if resp.status_code != 200:
        try:
            error_data = resp.json()
            error_msg = error_data.get('error', {}).get('message', resp.text)
        except:
            error_msg = resp.text
        
        # Provide user-friendly messages for common errors
        if resp.status_code == 429:
            return jsonify({'error': 'Rate limited by OpenAI. Wait a moment and try again, or check your account quota at https://platform.openai.com/account/billing/overview'}), 429
        elif resp.status_code == 401:
            return jsonify({'error': 'OpenAI API key is invalid or expired.'}), 401
        elif resp.status_code == 403:
            return jsonify({'error': 'Access denied. Check your OpenAI API key permissions.'}), 403
        else:
            return jsonify({'error': f'OpenAI API error (code {resp.status_code})', 'details': error_msg}), resp.status_code

    try:
        result = resp.json()
        content = result['choices'][0]['message']['content']
    except Exception as e:
        return jsonify({'error': 'Failed to parse OpenAI response', 'details': str(e)}), 500

    return jsonify({'content': content})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
@app.route('/api/ml-status', methods=['GET'])
def ml_status():
    """Check ML models availability"""
    return jsonify({
        'ml_available': ML_AVAILABLE,
        'components': {
            'interest_classifier': interest_classifier is not None,
            'recommendation_engine': recommendation_engine is not None,
            'similarity_model': similarity_model is not None
        }
    })

@app.route('/api/classify-interest', methods=['POST', 'OPTIONS'])
def classify_interest():
    """Classify user interest using TensorFlow"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json() or {}
    interest = data.get('interest')
    
    if not interest:
        return jsonify({'error': 'Missing interest'}), 400
    
    # Validate the interest query
    is_valid, validation_message, cleaned_interest = validator.validate_and_clean(interest)
    if not is_valid:
        return jsonify({
            'error': validation_message,
            'original_query': interest,
            'suggestions': search_manager._get_suggestions()
        }), 400
    
    if not ML_AVAILABLE or not interest_classifier:
        return jsonify({'error': 'ML unavailable'}), 503
    try:
        category, scores = interest_classifier.classify_interest(cleaned_interest)
        return jsonify({'interest': cleaned_interest, 'category': category, 'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


