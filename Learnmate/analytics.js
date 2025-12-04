/**
 * Analytics Dashboard for LearnMate
 * Tracks usage statistics and displays them in a dashboard
 */

const ANALYTICS_KEY = 'learnmate_analytics';

/**
 * Track an event
 */
function trackEvent(eventType, data = {}) {
    const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
    
    if (!analytics.events) analytics.events = [];
    if (!analytics.stats) analytics.stats = {
        totalSearches: 0,
        categoryCounts: {},
        popularInterests: {},
        dailyActivity: {},
        averageResponseTime: []
    };
    
    const event = {
        type: eventType,
        data,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
    };
    
    analytics.events.push(event);
    
    // Update statistics
    if (eventType === 'search') {
        analytics.stats.totalSearches++;
        
        const category = data.type || 'unknown';
        analytics.stats.categoryCounts[category] = 
            (analytics.stats.categoryCounts[category] || 0) + 1;
        
        const interest = data.interest || '';
        if (interest) {
            analytics.stats.popularInterests[interest] = 
                (analytics.stats.popularInterests[interest] || 0) + 1;
        }
        
        const today = event.date;
        analytics.stats.dailyActivity[today] = 
            (analytics.stats.dailyActivity[today] || 0) + 1;
    }
    
    if (eventType === 'response_time') {
        analytics.stats.averageResponseTime.push(data.time);
        // Keep only last 100 response times
        if (analytics.stats.averageResponseTime.length > 100) {
            analytics.stats.averageResponseTime.shift();
        }
    }
    
    // Keep only last 1000 events
    if (analytics.events.length > 1000) {
        analytics.events = analytics.events.slice(-1000);
    }
    
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

/**
 * Get analytics data
 */
function getAnalytics() {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
}

/**
 * Get statistics summary
 */
function getStatsSummary() {
    const analytics = getAnalytics();
    const stats = analytics.stats || {
        totalSearches: 0,
        categoryCounts: {},
        popularInterests: {},
        dailyActivity: {},
        averageResponseTime: []
    };
    
    // Calculate average response time
    const avgResponseTime = stats.averageResponseTime.length > 0
        ? (stats.averageResponseTime.reduce((a, b) => a + b, 0) / stats.averageResponseTime.length).toFixed(0)
        : 0;
    
    // Get top interests
    const topInterests = Object.entries(stats.popularInterests || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([interest, count]) => ({ interest, count }));
    
    // Get daily activity (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push({
            date: dateStr,
            count: stats.dailyActivity[dateStr] || 0
        });
    }
    
    return {
        totalSearches: stats.totalSearches,
        categoryCounts: stats.categoryCounts,
        topInterests,
        dailyActivity: last7Days,
        averageResponseTime: avgResponseTime,
        totalEvents: analytics.events?.length || 0
    };
}

/**
 * Create analytics dashboard
 */
function createAnalyticsDashboard() {
    const stats = getStatsSummary();
    
    const dashboard = document.createElement('div');
    dashboard.className = 'analytics-dashboard';
    dashboard.innerHTML = `
        <div class="analytics-header">
            <h2>📊 Analytics Dashboard</h2>
            <button class="close-analytics" onclick="closeAnalyticsDashboard()">✕</button>
        </div>
        <div class="analytics-content">
            <div class="stat-card">
                <div class="stat-value">${stats.totalSearches}</div>
                <div class="stat-label">Total Searches</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.averageResponseTime}ms</div>
                <div class="stat-label">Avg Response Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalEvents}</div>
                <div class="stat-label">Total Events</div>
            </div>
            
            <div class="analytics-section">
                <h3>Category Distribution</h3>
                <div class="category-stats">
                    ${Object.entries(stats.categoryCounts).map(([category, count]) => `
                        <div class="category-item">
                            <span class="category-name">${category}</span>
                            <span class="category-count">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>Top Interests</h3>
                <div class="interests-list">
                    ${stats.topInterests.map((item, index) => `
                        <div class="interest-item">
                            <span class="interest-rank">#${index + 1}</span>
                            <span class="interest-name">${item.interest}</span>
                            <span class="interest-count">${item.count}x</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>Daily Activity (Last 7 Days)</h3>
                <div class="daily-activity">
                    ${stats.dailyActivity.map(day => `
                        <div class="day-bar">
                            <div class="day-label">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div class="day-value" style="height: ${Math.max(day.count * 10, 5)}px;"></div>
                            <div class="day-count">${day.count}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="analytics-actions">
                <button class="export-analytics-btn" onclick="exportAnalytics()">📥 Export Data</button>
                <button class="clear-analytics-btn" onclick="clearAnalytics()">🗑️ Clear Data</button>
            </div>
        </div>
    `;
    
    dashboard.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        background: rgba(15, 15, 22, 0.98);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 30px;
        z-index: 10000;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    document.body.appendChild(dashboard);
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'analytics-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
    `;
    overlay.onclick = closeAnalyticsDashboard;
    document.body.insertBefore(overlay, dashboard);
    
    return dashboard;
}

/**
 * Show analytics dashboard
 */
function showAnalyticsDashboard() {
    createAnalyticsDashboard();
}

/**
 * Close analytics dashboard
 */
function closeAnalyticsDashboard() {
    const dashboard = document.querySelector('.analytics-dashboard');
    const overlay = document.querySelector('.analytics-overlay');
    if (dashboard) dashboard.remove();
    if (overlay) overlay.remove();
}

/**
 * Export analytics data
 */
function exportAnalytics() {
    const analytics = getAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learnmate_analytics_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    if (window.learnmateUtils) {
        window.learnmateUtils.showToast('Analytics data exported!', 'success');
    }
}

/**
 * Clear analytics data
 */
function clearAnalytics() {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
        localStorage.removeItem(ANALYTICS_KEY);
        closeAnalyticsDashboard();
        if (window.learnmateUtils) {
            window.learnmateUtils.showToast('Analytics data cleared', 'info');
        }
    }
}

/**
 * Create analytics button
 */
function createAnalyticsButton() {
    const button = document.createElement('button');
    button.className = 'analytics-btn';
    button.innerHTML = '📊 Analytics';
    button.onclick = showAnalyticsDashboard;
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 12px 20px;
        background: rgba(129, 140, 248, 0.2);
        border: 1px solid rgba(129, 140, 248, 0.4);
        border-radius: 25px;
        color: #818cf8;
        cursor: pointer;
        z-index: 1000;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(129, 140, 248, 0.3)';
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(129, 140, 248, 0.2)';
        button.style.transform = 'translateY(0)';
    });
    
    document.body.appendChild(button);
}

// Initialize analytics tracking
function initAnalytics() {
    createAnalyticsButton();
    
    // Track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        timestamp: Date.now()
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.trackEvent = trackEvent;
    window.getAnalytics = getAnalytics;
    window.getStatsSummary = getStatsSummary;
    window.showAnalyticsDashboard = showAnalyticsDashboard;
    window.closeAnalyticsDashboard = closeAnalyticsDashboard;
    window.exportAnalytics = exportAnalytics;
    window.clearAnalytics = clearAnalytics;
}

