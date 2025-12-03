/**
 * Dark/Light Mode Toggle for LearnMate
 */

const THEME_KEY = 'learnmate_theme';
const THEMES = {
    dark: 'dark',
    light: 'light'
};

/**
 * Apply theme
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme === 'dark' ? '#0f0f16' : '#ffffff';
}

/**
 * Toggle theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    
    if (window.learnmateUtils) {
        window.learnmateUtils.showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'success');
    }
    
    return newTheme;
}

/**
 * Get current theme
 */
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
}

/**
 * Create theme toggle button
 */
function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.innerHTML = '🌙';
    
    // Update icon based on current theme
    const updateIcon = () => {
        const theme = getCurrentTheme();
        toggle.innerHTML = theme === 'dark' ? '🌙' : '☀️';
    };
    
    toggle.onclick = () => {
        toggleTheme();
        updateIcon();
    };
    
    updateIcon();
    
    // Add to page (top right corner)
    toggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
        toggle.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
        toggle.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    document.body.appendChild(toggle);
    
    return toggle;
}

/**
 * Initialize theme system
 */
function initTheme() {
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);
    
    // Create toggle button
    createThemeToggle();
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-apply if user hasn't manually set a preference
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.toggleTheme = toggleTheme;
    window.getCurrentTheme = getCurrentTheme;
    window.applyTheme = applyTheme;
}

