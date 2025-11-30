"""
LEARNMATE - TensorFlow ML Models
Contains machine learning models for personalized recommendations
"""

import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import pickle
import os

class InterestClassifier:
    """
    TensorFlow Neural Network to classify user interests into learning categories
    """
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.scaler = StandardScaler()
        
        # Define learning categories
        self.categories = [
            'web_development',
            'data_science',
            'mobile_development',
            'machine_learning',
            'devops',
            'cybersecurity',
            'game_development',
            'cloud_computing',
            'iot',
            'blockchain'
        ]
    
    def build_model(self, input_dim=100):
        """Build a neural network for interest classification"""
        self.model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu', input_dim=input_dim),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(len(self.categories), activation='softmax')
        ])
        
        self.model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        return self.model
    
    def classify_interest(self, interest_text):
        """Classify a user's interest into one of the categories"""
        # Simple example: use keyword matching (in production, use embeddings)
        interest_lower = interest_text.lower()
        
        keywords = {
            'web_development': ['web', 'html', 'css', 'javascript', 'react', 'angular', 'node'],
            'data_science': ['data', 'analysis', 'statistics', 'pandas', 'visualization'],
            'mobile_development': ['mobile', 'android', 'ios', 'swift', 'kotlin', 'flutter'],
            'machine_learning': ['machine learning', 'ml', 'neural', 'deep learning', 'ai', 'tensorflow'],
            'devops': ['devops', 'docker', 'kubernetes', 'ci/cd', 'deployment', 'jenkins'],
            'cybersecurity': ['security', 'cyber', 'hacking', 'penetration', 'encryption'],
            'game_development': ['game', 'gaming', 'unity', 'unreal', 'game engine'],
            'cloud_computing': ['cloud', 'aws', 'azure', 'gcp', 'cloud computing'],
            'iot': ['iot', 'embedded', 'arduino', 'raspberry', 'sensors'],
            'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3']
        }
        
        scores = {}
        for category, keywords_list in keywords.items():
            score = sum(1 for keyword in keywords_list if keyword in interest_lower)
            scores[category] = score
        
        # Return top category
        best_category = max(scores, key=scores.get) if max(scores.values()) > 0 else 'web_development'
        return best_category, scores

class RecommendationEngine:
    """
    TensorFlow-based collaborative filtering for recommendations
    """
    def __init__(self):
        self.model = None
        self.user_encoder = None
        self.item_encoder = None
    
    def build_embedding_model(self, num_users=100, num_items=500, embedding_dim=32):
        """Build a neural network for collaborative filtering"""
        
        # User input and embedding
        user_input = tf.keras.layers.Input(shape=(1,), name='user_input')
        user_embedding = tf.keras.layers.Embedding(
            num_users, embedding_dim, name='user_embedding'
        )(user_input)
        user_vec = tf.keras.layers.Flatten()(user_embedding)
        
        # Item input and embedding
        item_input = tf.keras.layers.Input(shape=(1,), name='item_input')
        item_embedding = tf.keras.layers.Embedding(
            num_items, embedding_dim, name='item_embedding'
        )(item_input)
        item_vec = tf.keras.layers.Flatten()(item_embedding)
        
        # Concatenate and predict
        concat = tf.keras.layers.Concatenate()([user_vec, item_vec])
        dense = tf.keras.layers.Dense(64, activation='relu')(concat)
        dense = tf.keras.layers.Dense(32, activation='relu')(dense)
        output = tf.keras.layers.Dense(1, activation='sigmoid')(dense)
        
        self.model = tf.keras.Model(inputs=[user_input, item_input], outputs=output)
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        return self.model
    
    def get_recommendations(self, user_id, num_recommendations=5):
        """Get top N recommendations for a user"""
        # Mock recommendations (in production, use trained model)
        recommendations = [
            {"id": 1, "title": "The Pragmatic Programmer", "category": "web_development", "score": 0.95},
            {"id": 2, "title": "Python for Data Science", "category": "data_science", "score": 0.92},
            {"id": 3, "title": "Deep Learning Specialization", "category": "machine_learning", "score": 0.88},
            {"id": 4, "title": "Kubernetes in Action", "category": "devops", "score": 0.85},
            {"id": 5, "title": "Full Stack Web Development", "category": "web_development", "score": 0.83},
        ]
        return recommendations[:num_recommendations]

class TextSimilarityModel:
    """
    TensorFlow model for finding similar learning topics using embeddings
    """
    def __init__(self, vocab_size=1000, embedding_dim=64):
        self.vocab_size = vocab_size
        self.embedding_dim = embedding_dim
        self.model = None
        self.tokenizer = None
    
    def build_embedding_model(self):
        """Build a model to generate embeddings"""
        self.model = tf.keras.Sequential([
            tf.keras.layers.Embedding(self.vocab_size, self.embedding_dim),
            tf.keras.layers.GlobalAveragePooling1D(),
            tf.keras.layers.Dense(32, activation='relu'),
        ])
        return self.model
    
    def find_similar_topics(self, topic, all_topics, top_k=5):
        """Find similar learning topics"""
        # Mock implementation
        similarity_scores = {
            'Python': 0.95 if 'Programming' in topic else 0.60,
            'Data Analysis': 0.92 if 'Data' in topic else 0.55,
            'Web Development': 0.88 if 'Web' in topic or 'Frontend' in topic else 0.50,
            'Machine Learning': 0.85 if 'AI' in topic or 'ML' in topic else 0.45,
            'Cloud Computing': 0.80 if 'DevOps' in topic else 0.40,
        }
        
        sorted_topics = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_topics[:top_k]

# Utility functions
def load_model(model_path):
    """Load a pre-trained TensorFlow model"""
    if os.path.exists(model_path):
        return tf.keras.models.load_model(model_path)
    return None

def save_model(model, model_path):
    """Save a TensorFlow model"""
    model.save(model_path)

def create_sample_data():
    """Create sample training data"""
    interests = [
        "web development with react",
        "machine learning and ai",
        "data science analytics",
        "mobile app development",
        "devops and docker",
        "cybersecurity and hacking",
        "game development with unity",
        "cloud computing aws",
        "iot and embedded systems",
        "blockchain and crypto"
    ]
    return interests

# Initialize models
interest_classifier = InterestClassifier()
recommendation_engine = RecommendationEngine()
similarity_model = TextSimilarityModel()
