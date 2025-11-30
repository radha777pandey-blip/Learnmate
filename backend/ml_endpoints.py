"""
TensorFlow ML Endpoints for LEARNMATE
These endpoints provide machine learning capabilities integrated with the proxy
"""

from flask import jsonify, request

def register_ml_endpoints(app, interest_classifier, recommendation_engine, similarity_model, ML_AVAILABLE):
    """Register ML endpoints with the Flask app"""
    
    @app.route('/api/classify-interest', methods=['POST', 'OPTIONS'])
    def classify_interest():
        """Use TensorFlow to classify user interest into learning categories"""
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        
        data = request.get_json() or {}
        interest = data.get('interest')
        
        if not interest:
            return jsonify({'error': 'Missing "interest" in request body.'}), 400
        
        if not ML_AVAILABLE or not interest_classifier:
            return jsonify({'error': 'ML models not available. Check backend/ml_models.py'}), 503
        
        try:
            category, scores = interest_classifier.classify_interest(interest)
            return jsonify({
                'interest': interest,
                'category': category,
                'scores': scores,
                'confidence': scores.get(category, 0) / sum(scores.values()) if sum(scores.values()) > 0 else 0
            })
        except Exception as e:
            return jsonify({'error': f'Classification failed: {str(e)}'}), 500
    
    @app.route('/api/ml-recommend', methods=['POST', 'OPTIONS'])
    def ml_recommend():
        """Use TensorFlow recommendation engine for personalized suggestions"""
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        
        data = request.get_json() or {}
        user_id = data.get('user_id', 1)
        num_recs = data.get('num_recommendations', 5)
        
        if not ML_AVAILABLE or not recommendation_engine:
            return jsonify({'error': 'ML models not available'}), 503
        
        try:
            recs = recommendation_engine.get_recommendations(user_id, num_recs)
            return jsonify({
                'user_id': user_id,
                'recommendations': recs,
                'count': len(recs)
            })
        except Exception as e:
            return jsonify({'error': f'Recommendation failed: {str(e)}'}), 500
    
    @app.route('/api/find-similar', methods=['POST', 'OPTIONS'])
    def find_similar():
        """Use TensorFlow to find similar learning topics"""
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        
        data = request.get_json() or {}
        topic = data.get('topic')
        top_k = data.get('top_k', 5)
        
        if not topic:
            return jsonify({'error': 'Missing "topic" in request body.'}), 400
        
        if not ML_AVAILABLE or not similarity_model:
            return jsonify({'error': 'ML models not available'}), 503
        
        try:
            all_topics = [
                'Python', 'Data Analysis', 'Web Development', 
                'Machine Learning', 'Cloud Computing'
            ]
            similar = similarity_model.find_similar_topics(topic, all_topics, top_k)
            return jsonify({
                'query_topic': topic,
                'similar_topics': [{'topic': t[0], 'similarity': float(t[1])} for t in similar]
            })
        except Exception as e:
            return jsonify({'error': f'Similarity search failed: {str(e)}'}), 500
    
    @app.route('/api/ml-status', methods=['GET'])
    def ml_status():
        """Check ML models availability and status"""
        return jsonify({
            'ml_available': ML_AVAILABLE,
            'interest_classifier': interest_classifier is not None,
            'recommendation_engine': recommendation_engine is not None,
            'similarity_model': similarity_model is not None,
            'endpoints': [
                '/api/classify-interest',
                '/api/ml-recommend',
                '/api/find-similar',
                '/api/ml-status'
            ]
        })
