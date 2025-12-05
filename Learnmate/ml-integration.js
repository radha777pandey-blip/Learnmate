/**
 * LEARNMATE ML Integration Examples
 * JavaScript snippets to use TensorFlow ML endpoints from frontend
 */

// Configuration
const ML_API_BASE = 'http://localhost:5000';

// Helper function to make requests
async function mlRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${ML_API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`ML Request failed: ${error}`);
        throw error;
    }
}

// === ML Status ===
async function checkMLStatus() {
    /**
     * Check if ML models are available
     * Usage: checkMLStatus().then(status => console.log(status))
     */
    try {
        const status = await mlRequest('/api/ml-status', 'GET');
        console.log('ML Status:', status);
        return status;
    } catch (error) {
        console.error('Failed to check ML status:', error);
        return { ml_available: false };
    }
}

// === Interest Classification ===
async function classifyUserInterest(interest) {
    /**
     * Classify a user's interest into learning categories
     * Returns: { interest, category, confidence }
     * 
     * Categories: web_development, data_science, machine_learning, 
     *             mobile_development, devops, cybersecurity, etc.
     * 
     * Example: classifyUserInterest("I want to learn Python programming")
     */
    try {
        const result = await mlRequest('/api/classify-interest', 'POST', { interest });
        console.log('Classification:', result);
        return result;
    } catch (error) {
        console.error('Classification failed:', error);
        return null;
    }
}

// === ML Recommendations ===
async function getMLRecommendations(userId = 1, numRecs = 5) {
    /**
     * Get personalized recommendations using ML
     * Returns: { recommendations: [...], count: number }
     * 
     * Each recommendation has: id, title, category, score
     * 
     * Example: getMLRecommendations(userId, 5)
     */
    try {
        const result = await mlRequest('/api/ml-recommend', 'POST', {
            user_id: userId,
            num_recommendations: numRecs
        });
        console.log('ML Recommendations:', result);
        return result;
    } catch (error) {
        console.error('ML recommendations failed:', error);
        return null;
    }
}

// === Find Similar Topics ===
async function findSimilarTopics(topic, topK = 5) {
    /**
     * Find similar learning topics using embeddings
     * Returns: { topic, similar: [{name, score}, ...] }
     * 
     * Example: findSimilarTopics("Python", 5)
     */
    try {
        const result = await mlRequest('/api/find-similar', 'POST', {
            topic,
            top_k: topK
        });
        console.log('Similar Topics:', result);
        return result;
    } catch (error) {
        console.error('Similar topics search failed:', error);
        return null;
    }
}

// === Smart Recommendation Pipeline ===
async function getSmartRecommendations(userInterest) {
    /**
     * Advanced pipeline:
     * 1. Classify user interest
     * 2. Get recommendations for that category
     * 3. Return enriched results
     * 
     * Example: getSmartRecommendations("web development with React")
     */
    try {
        console.log('Starting smart recommendation pipeline...');
        
        // Step 1: Classify interest
        const classification = await classifyUserInterest(userInterest);
        if (!classification) {
            console.error('Classification failed');
            return null;
        }
        
        console.log(`Classified as: ${classification.category} (${(classification.confidence * 100).toFixed(1)}% confident)`);
        
        // Step 2: Get recommendations
        const recommendations = await mlRequest('/api/recommend', 'POST', {
            interest: userInterest,
            type: classification.category,
            mode: 'short'
        });
        
        console.log('Got recommendations');
        
        // Step 3: Find similar topics for the category
        const similar = await findSimilarTopics(classification.category, 3);
        
        return {
            interest: userInterest,
            classification: classification,
            recommendations: recommendations,
            similarTopics: similar,
            pipeline: 'smart'
        };
    } catch (error) {
        console.error('Smart recommendation pipeline failed:', error);
        return null;
    }
}

// === UI Integration Examples ===

// Example 1: Add ML Classification to existing interest input
function enhanceInterestInput() {
    /**
     * Enhance the interest input with ML classification
     */
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) return;
    
    const originalHandler = generateBtn.onclick;
    
    generateBtn.onclick = async function() {
        const interest = document.getElementById('userInterest').value;
        
        // Show loading
        generateBtn.disabled = true;
        generateBtn.textContent = 'Classifying...';
        
        try {
            // Classify first
            const classification = await classifyUserInterest(interest);
            
            if (classification) {
                console.log(`Interest classified as: ${classification.category}`);
                // Can update UI to show category
                console.log(`Confidence: ${(classification.confidence * 100).toFixed(1)}%`);
            }
            
            // Then get recommendations
            const data = {
                interest,
                type: classification?.category || 'books',
                mode: 'short'
            };
            
            const response = await fetch('http://localhost:5000/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            
            // Display results
            const resultsContainer = document.getElementById('resultsContainer');
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="result-box">
                        <strong>Category:</strong> ${classification?.category || 'N/A'}<br>
                        <strong>Recommendations:</strong><pre>${result.content}</pre>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error getting recommendations. Check console.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate for Me';
        }
    };
}

// Example 2: Show ML Status in UI
async function displayMLStatus() {
    /**
     * Display ML status in a UI element
     */
    try {
        const status = await checkMLStatus();
        const statusDiv = document.getElementById('ml-status');
        
        if (statusDiv) {
            const components = status.components || {};
            statusDiv.innerHTML = `
                <div style="padding: 10px; background: #f0f0f0; border-radius: 4px; margin: 10px 0;">
                    <strong>ML Status:</strong> ${status.ml_available ? 'Available' : 'Unavailable'}<br>
                    <small>
                        Classifier: ${components.interest_classifier ? '✓' : '✗'} |
                        Recommender: ${components.recommendation_engine ? '✓' : '✗'} |
                        Similarity: ${components.similarity_model ? '✓' : '✗'}
                    </small>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to display ML status:', error);
    }
}

// Example 3: Add "Find Related Topics" feature
async function showRelatedTopics(topic) {
    /**
     * Show related topics when user hovers over or clicks a topic
     */
    try {
        const result = await findSimilarTopics(topic, 3);
        
        if (result && result.similar) {
            const list = result.similar
                .map(item => `<li>${item.name} (${(item.score * 100).toFixed(0)}%)</li>`)
                .join('');
            
            console.log(`Related to "${topic}": ${list}`);
            return `<ul>${list}</ul>`;
        }
    } catch (error) {
        console.error('Error finding related topics:', error);
    }
    return null;
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', function() {
    // Check ML status on page load
    checkMLStatus().then(status => {
        if (status.ml_available) {
            console.log('ML models are available!');
            // Optionally enhance UI here
            // displayMLStatus();
        } else {
            console.warn('ML models not available');
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        classifyUserInterest,
        getMLRecommendations,
        findSimilarTopics,
        getSmartRecommendations,
        checkMLStatus,
        enhanceInterestInput,
        displayMLStatus,
        showRelatedTopics
    };
}
