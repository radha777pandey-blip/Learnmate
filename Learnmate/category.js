// Shared JS for category-specific 3D pages

const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const pageType = body.getAttribute('data-type') || 'books';

  const input = document.getElementById('interestInput');
  const button = document.getElementById('generateCategoryBtn');
  const resultsContainer = document.getElementById('resultsContainer');
  const loadingSpinner = document.getElementById('loadingSpinner');

  if (!input || !button || !resultsContainer) {
    console.warn('Category page elements not found.');
    return;
  }

  button.addEventListener('click', async () => {
    const interest = input.value.trim();
    if (!interest) {
      if (window.learnmateUtils) {
        window.learnmateUtils.showToast('Please enter your interest or goal', 'error');
      } else {
        alert('Please enter your interest or goal.');
      }
      return;
    }

    // UI loading state
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Generating...';
    
    // Show skeleton loading if available
    if (window.learnmateUtils) {
      window.learnmateUtils.showSkeletonLoading(resultsContainer);
    } else {
      if (loadingSpinner) loadingSpinner.style.display = 'block';
      resultsContainer.innerHTML = '';
    }

    try {
      const response = await fetch(`${API_BASE}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interest, type: pageType, mode: 'short' })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || errorData.details || `Server error (${response.status})`;
        throw new Error(errorMsg);
      }

      const startTime = Date.now();
      const data = await response.json();
      const content = data.content || '';
      const responseTime = Date.now() - startTime;

      // Track analytics
      if (window.trackEvent) {
        window.trackEvent('search', { interest, type: pageType });
        window.trackEvent('response_time', { time: responseTime });
      }

      // Add to history
      if (window.learnmateUtils) {
        window.learnmateUtils.addToHistory(interest, pageType);
      }

      const typeLabels = {
        books: 'Book Recommendations',
        courses: 'Online Courses',
        coding: 'Coding Practice Plan',
        roadmap: 'Skill Roadmap'
      };

      const heading = `${typeLabels[pageType] || 'Recommendations'} for "${interest}"`;

      // Use enhanced result box if available
      if (window.learnmateUtils) {
        resultsContainer.innerHTML = window.learnmateUtils.createEnhancedResultBox(heading, content, pageType);
      } else {
        resultsContainer.innerHTML = `
          <div class="result-box">
            <h3>${heading}</h3>
            <p>${content.replace(/\n/g, '<br>')}</p>
          </div>
        `;
      }
      
      // Smooth scroll to results
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
    } catch (err) {
      console.error('Category page error:', err);
      
      // Use enhanced error display with retry
      if (window.learnmateUtils) {
        const retryFn = () => button.click();
        resultsContainer.innerHTML = window.learnmateUtils.createErrorWithRetry(err.message, retryFn);
      } else {
        resultsContainer.innerHTML = `<div class="error-message">⚠️ ${err.message}</div>`;
      }
    } finally {
      button.disabled = false;
      button.textContent = originalText;
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
  });
});


