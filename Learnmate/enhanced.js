/**
 * Enhanced Professional Features for LearnMate
 * Includes: Copy to clipboard, favorites, keyboard shortcuts, toast notifications, etc.
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try again.', 'error');
        return false;
    }
}

/**
 * Save to favorites (localStorage)
 */
function saveToFavorites(title, content, type) {
    const favorites = JSON.parse(localStorage.getItem('learnmate_favorites') || '[]');
    const favorite = {
        id: Date.now(),
        title,
        content,
        type,
        date: new Date().toISOString()
    };
    favorites.push(favorite);
    localStorage.setItem('learnmate_favorites', JSON.stringify(favorites));
    showToast('Saved to favorites!', 'success');
}

/**
 * Check if item is favorited
 */
function isFavorited(title) {
    const favorites = JSON.parse(localStorage.getItem('learnmate_favorites') || '[]');
    return favorites.some(fav => fav.title === title);
}

/**
 * Remove from favorites
 */
function removeFromFavorites(title) {
    const favorites = JSON.parse(localStorage.getItem('learnmate_favorites') || '[]');
    const filtered = favorites.filter(fav => fav.title !== title);
    localStorage.setItem('learnmate_favorites', JSON.stringify(filtered));
    showToast('Removed from favorites', 'info');
}

/**
 * Get search history
 */
function addToHistory(query, type) {
    const history = JSON.parse(localStorage.getItem('learnmate_history') || '[]');
    history.unshift({ query, type, date: new Date().toISOString() });
    // Keep only last 20 searches
    const limited = history.slice(0, 20);
    localStorage.setItem('learnmate_history', JSON.stringify(limited));
}

/**
 * Show skeleton loading state
 */
function showSkeletonLoading(container) {
    container.innerHTML = `
        <div class="skeleton-box">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
        </div>
    `;
}

/**
 * Create enhanced result box with copy, favorite, share, and export buttons
 */
function createEnhancedResultBox(title, content, type) {
    const isFav = isFavorited(title);
    const interest = title.replace(/^[📚🎓💻🚀]\s*/, '').replace(/\s*for\s*"/i, '').replace(/"$/, '');
    
    // Escape content for use in onclick handlers
    const escapedContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const escapedTitle = title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const escapedInterest = interest.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    return `
        <div class="result-box page-transition">
            <button class="favorite-btn ${isFav ? 'saved' : ''}" onclick="toggleFavorite(this, '${escapedTitle}', \`${escapedContent}\`, '${type}')" style="position: absolute; top: 10px; right: 10px;">
                ${isFav ? '★' : '☆'}
            </button>
            <button class="copy-btn" onclick="copyToClipboard(\`${escapedContent}\`)" style="position: absolute; top: 10px; right: 60px;">
                <span>📋</span>
            </button>
            <h3>${title}</h3>
            <p>${content.replace(/\n/g, '<br>')}</p>
            <div class="result-actions">
                <button class="share-btn" onclick="shareRecommendation('${escapedInterest}', '${type}', \`${escapedContent}\`)">
                    <span>🔗</span> Share Link
                </button>
                <button class="export-btn" onclick="exportToPDF('${escapedTitle}', \`${escapedContent}\`, '${type}')">
                    <span>📄</span> Export PDF
                </button>
            </div>
        </div>
    `;
}

/**
 * Toggle favorite
 */
function toggleFavorite(button, title, content, type) {
    const isFav = isFavorited(title);
    
    if (isFav) {
        removeFromFavorites(title);
        button.classList.remove('saved');
        button.innerHTML = '☆';
    } else {
        saveToFavorites(title, content, type);
        button.classList.add('saved');
        button.innerHTML = '★';
    }
}

/**
 * Add retry button to error message
 */
function createErrorWithRetry(message, retryCallback) {
    return `
        <div class="error-message">
            <span>⚠️</span>
            <div style="flex: 1;">
                <strong>Error:</strong> ${message}
                <button class="retry-btn" onclick="(${retryCallback.toString()})()">Retry</button>
            </div>
        </div>
    `;
}

/**
 * Back to top button functionality
 */
function initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter to submit (when input is focused)
        if (e.key === 'Enter' && (e.target.id === 'userInterest' || e.target.id === 'interestInput')) {
            e.preventDefault();
            const button = document.getElementById('generateBtn') || document.getElementById('generateCategoryBtn');
            if (button && !button.disabled) {
                button.click();
            }
        }
        
        // Escape to clear input
        if (e.key === 'Escape' && (e.target.id === 'userInterest' || e.target.id === 'interestInput')) {
            e.target.value = '';
            e.target.blur();
        }
        
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const input = document.getElementById('userInterest') || document.getElementById('interestInput');
            if (input) {
                input.focus();
                input.select();
            }
        }
    });
}

/**
 * Initialize all enhancements
 */
function initEnhancements() {
    // Add enhanced CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'enhanced.css';
    document.head.appendChild(link);
    
    // Add features CSS
    const featuresLink = document.createElement('link');
    featuresLink.rel = 'stylesheet';
    featuresLink.href = 'features.css';
    document.head.appendChild(featuresLink);
    
    // Load feature scripts
    const scripts = [
        'pdf-export.js',
        'share-links.js',
        'theme-toggle.js',
        'autocomplete.js',
        'analytics.js'
    ];
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    });
    
    // Initialize features
    initBackToTop();
    initKeyboardShortcuts();
    
    // Add keyboard hint
    const inputs = document.querySelectorAll('#userInterest, #interestInput');
    inputs.forEach(input => {
        const hint = document.createElement('div');
        hint.className = 'keyboard-hint';
        hint.innerHTML = 'Press <kbd>Enter</kbd> to search, <kbd>Esc</kbd> to clear, <kbd>Ctrl+K</kbd> to focus';
        input.parentNode.insertBefore(hint, input.nextSibling);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
    initEnhancements();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.learnmateUtils = {
        showToast,
        copyToClipboard,
        saveToFavorites,
        isFavorited,
        removeFromFavorites,
        addToHistory,
        showSkeletonLoading,
        createEnhancedResultBox,
        toggleFavorite,
        createErrorWithRetry
    };
}

