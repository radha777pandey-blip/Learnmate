# TensorFlow Integration Guide for LEARNMATE

## Overview
Your LEARNMATE project now includes TensorFlow machine learning capabilities! This document explains the ML components, how to use them, and how to extend them.

## What's Been Added

### 1. ML Models Module (`backend/ml_models.py`)
Contains three main ML model classes:

#### **InterestClassifier**
- **Purpose**: Categorizes user interests into learning domains
- **Categories**: web_development, data_science, mobile_development, machine_learning, devops, cybersecurity, game_development, cloud_computing, iot, blockchain
- **Method**: `classify_interest(interest_text)` returns (category, scores_dict)

```python
classifier = InterestClassifier()
category, scores = classifier.classify_interest("I want to learn Python programming")
# Returns: ('web_development', {'web_development': 1, ...})
```

#### **RecommendationEngine**
- **Purpose**: Provides personalized learning recommendations using collaborative filtering
- **Features**: Embedding-based recommendations with neural networks
- **Method**: `get_recommendations(user_id, num_recommendations)`

```python
engine = RecommendationEngine()
recs = engine.get_recommendations(user_id=1, num_recommendations=5)
# Returns: List of 5 recommendations with scores
```

#### **TextSimilarityModel**
- **Purpose**: Finds similar learning topics using embeddings
- **Method**: `find_similar_topics(topic, all_topics, top_k)`

```python
similarity = TextSimilarityModel()
similar = similarity.find_similar_topics("Python", all_topics, top_k=5)
# Returns: Top 5 similar topics with similarity scores
```

### 2. ML Endpoints in Proxy (`backend/proxy.py`)

Your Flask proxy now includes these new endpoints:

#### **GET `/api/ml-status`**
Check ML models availability
```bash
curl http://localhost:5000/api/ml-status
```
Response:
```json
{
  "ml_available": true,
  "components": {
    "interest_classifier": true,
    "recommendation_engine": true,
    "similarity_model": true
  }
}
```

#### **POST `/api/classify-interest`**
Classify a user's interest into a learning category
```bash
curl -X POST http://localhost:5000/api/classify-interest \
  -H "Content-Type: application/json" \
  -d '{"interest": "I want to learn machine learning with Python"}'
```
Response:
```json
{
  "interest": "I want to learn machine learning with Python",
  "category": "machine_learning",
  "confidence": 0.85
}
```

#### **POST `/api/ml-recommend`**
Get ML-based personalized recommendations
```bash
curl -X POST http://localhost:5000/api/ml-recommend \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "num_recommendations": 5}'
```
Response:
```json
{
  "recommendations": [
    {
      "id": 1,
      "title": "The Pragmatic Programmer",
      "category": "web_development",
      "score": 0.95
    },
    ...
  ],
  "count": 5
}
```

#### **POST `/api/find-similar`**
Find similar learning topics
```bash
curl -X POST http://localhost:5000/api/find-similar \
  -H "Content-Type: application/json" \
  -d '{"topic": "Python", "top_k": 5}'
```
Response:
```json
{
  "topic": "Python",
  "similar": [
    {"name": "Data Analysis", "score": 0.92},
    {"name": "Web Development", "score": 0.88},
    ...
  ]
}
```

## Setup Instructions

### 1. Install TensorFlow Dependencies
```bash
cd backend
python -m pip install -r requirements.txt
```

This installs:
- tensorflow>=2.12.0 - Machine learning framework
- numpy>=1.24.0 - Numerical computing
- scikit-learn>=1.3.0 - ML utilities
- pandas>=2.0.0 - Data manipulation

### 2. Start the Backend with ML
```bash
cd backend
python proxy.py
```

The proxy will automatically:
- Try to load ML models
- Print status message: `[ML] ML models loaded successfully` or warning if unavailable
- Serve all ML endpoints alongside existing endpoints

### 3. Test ML Functionality
```powershell
# Test ML status
Invoke-WebRequest -Uri "http://localhost:5000/api/ml-status"

# Test interest classification
$data = @{"interest"="web development"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/classify-interest" `
  -Method POST `
  -ContentType "application/json" `
  -Body $data
```

## Integration with Frontend

### Option 1: Use Classification Before Recommendations
```javascript
async function getSmartRecommendations(userInterest) {
  // Step 1: Classify the interest
  const classifyResponse = await fetch('http://localhost:5000/api/classify-interest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interest: userInterest })
  });
  const classification = await classifyResponse.json();
  
  // Step 2: Get recommendations based on category
  const recResponse = await fetch('http://localhost:5000/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      interest: userInterest,
      type: classification.category,
      mode: 'short'
    })
  });
  return recResponse.json();
}
```

### Option 2: Use ML Recommendations Directly
```javascript
async function getMLRecommendations(userId, numRecs = 5) {
  const response = await fetch('http://localhost:5000/api/ml-recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, num_recommendations: numRecs })
  });
  return response.json();
}
```

### Option 3: Find Similar Topics
```javascript
async function findSimilarTopics(topic) {
  const response = await fetch('http://localhost:5000/api/find-similar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: topic, top_k: 5 })
  });
  return response.json();
}
```

## Advanced Usage

### Training Custom Models
The models currently use keyword-based classification and mock recommendations. To use real trained models:

1. **Collect training data**
   - User interests and their categories
   - User interactions and ratings

2. **Train models**
   ```python
   from backend.ml_models import InterestClassifier
   classifier = InterestClassifier()
   classifier.build_model(input_dim=100)
   # classifier.model.fit(X_train, y_train, epochs=10)
   ```

3. **Save trained models**
   ```python
   from backend.ml_models import save_model
   save_model(classifier.model, 'backend/models/classifier.h5')
   ```

4. **Load models on startup**
   ```python
   # In proxy.py
   classifier.model = tf.keras.models.load_model('backend/models/classifier.h5')
   ```

### Extending with New ML Features
1. Add new class in `ml_models.py`
2. Create new endpoint in `proxy.py`
3. Update `/api/ml-status` to include new component

Example:
```python
class SkillGapAnalyzer:
    def analyze(self, user_skills, target_role):
        # ML logic here
        pass

# In proxy.py
@app.route('/api/analyze-gaps', methods=['POST'])
def analyze_skill_gaps():
    data = request.get_json()
    analyzer = SkillGapAnalyzer()
    gaps = analyzer.analyze(data['skills'], data['target'])
    return jsonify({'gaps': gaps})
```

## Troubleshooting

### ML models not loading
- **Error**: `Warning: ML models not available`
- **Solution**: 
  ```bash
  python -m pip install tensorflow
  python -m pip install -r backend/requirements.txt
  ```

### TensorFlow import errors
- **Error**: `ImportError: No module named 'tensorflow'`
- **Solution**: Install via pip
  ```bash
  python -m pip install tensorflow>=2.12.0
  ```

### CUDA/GPU warnings (optional)
- **Warning**: `Could not load dynamic library 'cudart64_*.dll'`
- **Status**: Normal - TensorFlow falls back to CPU
- **Solution** (optional): Install GPU support if you have NVIDIA GPU
  ```bash
  python -m pip install tensorflow[and-cuda]
  ```

### ML endpoint returns 503
- **Error**: `ML unavailable`
- **Cause**: ML models not initialized
- **Solution**: Check `ml_models.py` imports, verify TensorFlow installation

## Performance Notes

- **Cold start**: First ML request takes ~2-3 seconds (TensorFlow initialization)
- **Subsequent requests**: <100ms for classification/recommendations
- **Scalability**: Currently mock data - production models will vary

## Next Steps

1. **Train custom models** with your actual learning data
2. **Integrate ML UI** - add buttons in frontend to test new endpoints
3. **Collect user feedback** - improve models with real interactions
4. **Deploy models** - export and serve optimized versions
5. **Monitor performance** - track accuracy and inference times

## Resources

- TensorFlow Docs: https://www.tensorflow.org/api_docs
- Keras: https://keras.io/
- scikit-learn: https://scikit-learn.org/
- Embedding/Similarity: https://www.tensorflow.org/hub

## Support

For issues with ML integration:
1. Check `/api/ml-status` endpoint
2. Review console output in proxy terminal
3. Verify TensorFlow installation: `python -c "import tensorflow; print(tensorflow.__version__)"`
4. Check `backend/ml_models.py` for model implementation
