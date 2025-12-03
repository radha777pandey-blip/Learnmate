/**
 * Share Links Functionality for LearnMate
 * Creates shareable URLs that highlight specific recommendations
 */

/**
 * Generate shareable link for a recommendation
 */
function generateShareLink(interest, type, content) {
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    const params = new URLSearchParams({
        share: 'true',
        interest: encodeURIComponent(interest),
        type: type,
        timestamp: Date.now()
    });
    
    // Store content in sessionStorage (for security, not in URL)
    const shareId = `share_${Date.now()}`;
    sessionStorage.setItem(shareId, JSON.stringify({
        interest,
        type,
        content,
        timestamp: Date.now()
    }));
    
    params.append('id', shareId);
    
    return `${baseUrl}index.html?${params.toString()}`;
}

/**
 * Copy share link to clipboard
 */
async function shareRecommendation(interest, type, content) {
    const shareLink = generateShareLink(interest, type, content);
    
    try {
        await navigator.clipboard.writeText(shareLink);
        if (window.learnmateUtils) {
            window.learnmateUtils.showToast('Share link copied to clipboard!', 'success');
        }
        return shareLink;
    } catch (error) {
        console.error('Failed to copy share link:', error);
        if (window.learnmateUtils) {
            window.learnmateUtils.showToast('Failed to copy link. Please try again.', 'error');
        }
        return null;
    }
}

/**
 * Handle shared link on page load
 */
function handleSharedLink() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('share') === 'true') {
        const shareId = urlParams.get('id');
        const interest = decodeURIComponent(urlParams.get('interest') || '');
        const type = urlParams.get('type') || 'books';
        
        if (shareId) {
            const shareData = sessionStorage.getItem(shareId);
            if (shareData) {
                try {
                    const data = JSON.parse(shareData);
                    
                    // Show notification first
                    if (window.learnmateUtils) {
                        window.learnmateUtils.showToast(`Loading shared recommendation: ${data.interest}`, 'info');
                    }
                    
                    // Scroll to AI section
                    setTimeout(() => {
                        const aiSection = document.getElementById('aiSection');
                        if (aiSection) {
                            aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            
                            // Highlight the section
                            const style = document.createElement('style');
                            style.textContent = `
                                @keyframes highlightPulse {
                                    0%, 100% { box-shadow: 0 0 0 0 rgba(129, 140, 248, 0.7); }
                                    50% { box-shadow: 0 0 0 20px rgba(129, 140, 248, 0); }
                                }
                            `;
                            document.head.appendChild(style);
                            aiSection.style.animation = 'highlightPulse 2s ease-in-out';
                            
                            // Auto-fill and generate
                            const input = document.getElementById('userInterest');
                            const button = document.getElementById('generateBtn');
                            
                            if (input && button) {
                                input.value = data.interest;
                                input.focus();
                                
                                // Trigger generation after a short delay
                                setTimeout(() => {
                                    button.click();
                                    
                                    // Highlight result after it appears
                                    setTimeout(() => {
                                        const resultsContainer = document.getElementById('resultsContainer');
                                        if (resultsContainer) {
                                            resultsContainer.style.animation = 'highlightPulse 2s ease-in-out';
                                            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                        }
                                    }, 2000);
                                }, 800);
                            }
                        }
                    }, 500);
                } catch (error) {
                    console.error('Failed to parse share data:', error);
                }
            } else {
                // If share data not found, still try to use URL params
                if (interest) {
                    setTimeout(() => {
                        const input = document.getElementById('userInterest');
                        const button = document.getElementById('generateBtn');
                        if (input && button) {
                            input.value = interest;
                            setTimeout(() => button.click(), 500);
                        }
                    }, 500);
                }
            }
        }
    }
}

/**
 * Add share button to result boxes
 */
function addShareButton(resultBox, interest, type, content) {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.innerHTML = '🔗 Share';
    shareBtn.onclick = () => shareRecommendation(interest, type, content);
    resultBox.appendChild(shareBtn);
}

// Handle shared links on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleSharedLink);
} else {
    handleSharedLink();
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.generateShareLink = generateShareLink;
    window.shareRecommendation = shareRecommendation;
    window.addShareButton = addShareButton;
}

