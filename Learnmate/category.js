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
      alert('Please enter your interest or goal.');
      return;
    }

    // UI loading state
    button.disabled = true;
    button.textContent = 'Generating...';
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    resultsContainer.innerHTML = '';

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

      const data = await response.json();
      const content = data.content || '';

      const typeLabels = {
        books: 'Book Recommendations',
        courses: 'Online Courses',
        coding: 'Coding Practice Plan',
        roadmap: 'Skill Roadmap'
      };

      const heading = typeLabels[pageType] || 'Recommendations';

      resultsContainer.innerHTML = `
        <div class="result-box">
          <h3>${heading} for "${interest}"</h3>
          <p>${content.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    } catch (err) {
      console.error('Category page error:', err);
      resultsContainer.innerHTML = `<div class="error-message">⚠️ ${err.message}</div>`;
    } finally {
      button.disabled = false;
      if (pageType === 'books') {
        button.textContent = 'Generate Book List';
      } else if (pageType === 'courses') {
        button.textContent = 'Find Courses';
      } else if (pageType === 'coding') {
        button.textContent = 'Get Practice Plan';
      } else if (pageType === 'roadmap') {
        button.textContent = 'Build Roadmap';
      } else {
        button.textContent = 'Generate';
      }
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
  });
});


