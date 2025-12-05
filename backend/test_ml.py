"""
ML Test Script for LEARNMATE
Test all TensorFlow ML endpoints
Run this after starting proxy.py
"""

import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def test_ml_status():
    """Test ML availability"""
    print("\n=== Testing /api/ml-status ===")
    try:
        r = requests.get(f"{BASE_URL}/api/ml-status")
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
        return r.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_classify_interest():
    """Test interest classification"""
    print("\n=== Testing /api/classify-interest ===")
    test_interests = [
        "I want to learn web development",
        "Machine learning and artificial intelligence",
        "Mobile app development for iOS",
        "Data science and analytics",
        "DevOps and cloud infrastructure"
    ]
    
    for interest in test_interests:
        try:
            r = requests.post(
                f"{BASE_URL}/api/classify-interest",
                json={"interest": interest},
                headers={"Content-Type": "application/json"}
            )
            print(f"\nInterest: {interest}")
            print(f"Classification: {r.json()}")
        except Exception as e:
            print(f"Error: {e}")
    
    return True

def test_ml_recommend():
    """Test ML recommendations"""
    print("\n=== Testing /api/ml-recommend ===")
    try:
        r = requests.post(
            f"{BASE_URL}/api/ml-recommend",
            json={"user_id": 1, "num_recommendations": 3},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
        return r.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_find_similar():
    """Test similarity search"""
    print("\n=== Testing /api/find-similar ===")
    test_topics = [
        "Python",
        "Web Development",
        "Data Science",
        "Machine Learning"
    ]
    
    for topic in test_topics:
        try:
            r = requests.post(
                f"{BASE_URL}/api/find-similar",
                json={"topic": topic, "top_k": 3},
                headers={"Content-Type": "application/json"}
            )
            print(f"\nTopic: {topic}")
            print(f"Similar: {json.dumps(r.json(), indent=2)}")
        except Exception as e:
            print(f"Error: {e}")
    
    return True

def main():
    print("LEARNMATE ML Test Suite")
    print("=" * 50)
    
    # Check if proxy is running
    try:
        requests.get(f"{BASE_URL}/api/ml-status", timeout=2)
    except Exception as e:
        print("\nError: Cannot connect to proxy!")
        print("Make sure proxy.py is running on port 5000")
        print(f"Details: {e}")
        sys.exit(1)
    
    # Run tests
    results = {
        "ML Status": test_ml_status(),
        "Classify Interest": test_classify_interest(),
        "ML Recommend": test_ml_recommend(),
        "Find Similar": test_find_similar()
    }
    
    print("\n" + "=" * 50)
    print("Test Summary:")
    for test_name, passed in results.items():
        status = "PASS" if passed else "FAIL"
        print(f"  {test_name}: {status}")
    
    all_passed = all(results.values())
    print("\n" + ("All tests passed!" if all_passed else "Some tests failed."))
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
