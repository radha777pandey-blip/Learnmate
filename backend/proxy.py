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
2. "Clean Code" - Learn to write readable and maintainable code
3. "Design Patterns" by Gang of Four - Comprehensive design patterns reference
4. "Cracking the Coding Interview" - Ace your technical interviews
5. "Code Complete" by Steve McConnell - Deep dive into software construction""",
        
        'courses': f"""🎓 Top Online Courses for {interest}

1. Coursera - Full {interest} Specialization (4-6 months, beginner-friendly)
2. Udemy - {interest} Bootcamp (40+ hours, lifetime access)
3. edX - Professional Certificate Program (university-backed credentials)
4. LinkedIn Learning - {interest} Essentials (interactive, skill-based)
5. Codecademy - Interactive {interest} Path (hands-on coding)""",
        
        'coding': f"""💻 Best Platforms for {interest} Practice

1. LeetCode - 2000+ DSA problems with difficulty levels
2. HackerRank - Coding challenges and real-time competitions
3. CodeSignal - AI-powered assessments and skill tracking
4. GeeksforGeeks - Tutorials with embedded practice problems
5. InterviewBit - Placement-focused DSA training""",
        
        'roadmap': f"""🚀 {interest} Learning Roadmap

Phase 1: Foundations
- Core concepts and basics (Weeks 1-4)
- Time: 10-15 hours/week

Phase 2: Intermediate Skills
- Build projects and practice (Weeks 5-12)
- Time: 15-20 hours/week

Phase 3: Advanced Topics
- Master complex concepts (Weeks 13-20)
- Time: 20-25 hours/week

Phase 4: Interview Prep
- Polish skills and practice interviews (Weeks 21-24)
- Time: 15-20 hours/week

Total Duration: 3-6 months | Recommended: Daily 30-60 min practice"""
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
    # short type prompts
    mapping = {
        'books': f'Generate 5 highly recommended books for someone interested in "{interest}". For each book, provide: Title, Author, and a brief 1-line description. Format as a clean list.',
        'courses': f'Suggest 5 best online courses for learning "{interest}". Include platform name (Coursera, Udemy, edX, etc.), course name, and duration. Format as a clean list.',
        'coding': f'Recommend 5 best platforms and resources for "{interest}" coding practice. Include platform name and what makes it special for this type of practice. Format as a clean list.',
        'roadmap': f'Create a structured learning roadmap for "{interest}". Break it into 4-5 progressive phases with specific skills to learn in each phase. Format clearly with phases as headings.'
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
    if not ML_AVAILABLE or not interest_classifier:
        return jsonify({'error': 'ML unavailable'}), 503
    try:
        category, scores = interest_classifier.classify_interest(interest)
        return jsonify({'interest': interest, 'category': category})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


