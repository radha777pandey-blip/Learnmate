/**
 * Search Autocomplete for LearnMate
 * Provides suggestions based on search history and common topics
 */

const COMMON_TOPICS = [
    'Web Development', 'React', 'JavaScript', 'Python', 'Machine Learning',
    'Data Science', 'Full Stack Development', 'Frontend Development',
    'Backend Development', 'Mobile App Development', 'iOS Development',
    'Android Development', 'Cloud Computing', 'AWS', 'DevOps',
    'Cybersecurity', 'Blockchain', 'Game Development', 'UI/UX Design',
    'Data Structures and Algorithms', 'System Design', 'Interview Preparation',
    'Node.js', 'Django', 'Flask', 'MongoDB', 'SQL', 'Docker', 'Kubernetes'
];

/**
 * Get search suggestions
 */
function getSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions = [];
    
    // Get from history
    const history = JSON.parse(localStorage.getItem('learnmate_history') || '[]');
    history.forEach(item => {
        if (item.query.toLowerCase().includes(lowerQuery) && 
            !suggestions.includes(item.query)) {
            suggestions.push(item.query);
        }
    });
    
    // Get from common topics
    COMMON_TOPICS.forEach(topic => {
        if (topic.toLowerCase().includes(lowerQuery) && 
            !suggestions.includes(topic)) {
            suggestions.push(topic);
        }
    });
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
}

/**
 * Create autocomplete dropdown
 */
function createAutocompleteDropdown(input, onSelect) {
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(15, 15, 22, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        margin-top: 8px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(dropdown);
    
    let selectedIndex = -1;
    
    function showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.innerHTML = suggestions.map((suggestion, index) => `
            <div class="autocomplete-item" data-index="${index}">
                <span class="autocomplete-icon">🔍</span>
                <span class="autocomplete-text">${highlightMatch(suggestion, input.value)}</span>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        // Add click handlers
        dropdown.querySelectorAll('.autocomplete-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                selectSuggestion(suggestions[index]);
            });
            
            item.addEventListener('mouseenter', () => {
                selectedIndex = index;
                updateSelection();
            });
        });
    }
    
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function selectSuggestion(suggestion) {
        input.value = suggestion;
        dropdown.style.display = 'none';
        selectedIndex = -1;
        if (onSelect) onSelect(suggestion);
    }
    
    function updateSelection() {
        dropdown.querySelectorAll('.autocomplete-item').forEach((item, index) => {
            if (index === selectedIndex) {
                item.style.background = 'rgba(129, 140, 248, 0.2)';
            } else {
                item.style.background = 'transparent';
            }
        });
    }
    
    // Handle input
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const suggestions = getSuggestions(query);
        showSuggestions(suggestions);
        selectedIndex = -1;
    });
    
    // Handle keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection();
            items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection();
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            const suggestion = getSuggestions(input.value)[selectedIndex];
            if (suggestion) selectSuggestion(suggestion);
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
            selectedIndex = -1;
        }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    return dropdown;
}

/**
 * Initialize autocomplete for an input
 */
function initAutocomplete(inputId, onSelect) {
    const input = document.getElementById(inputId);
    if (!input) return null;
    
    return createAutocompleteDropdown(input, onSelect);
}

// Initialize autocomplete for main search input
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAutocomplete('userInterest');
        initAutocomplete('interestInput');
    });
} else {
    initAutocomplete('userInterest');
    initAutocomplete('interestInput');
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.getSuggestions = getSuggestions;
    window.initAutocomplete = initAutocomplete;
}

