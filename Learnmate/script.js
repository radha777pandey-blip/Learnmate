window.onload = () => {
            document.body.classList.add("fade-in");
};
// Backend proxy base URL - always point to localhost:5000 for local development
const API_BASE = 'http://localhost:5000';
console.log('API_BASE set to:', API_BASE);
console.log('Frontend running at:', window.location.href);
// Optional: Add smooth fade-in animations
document.addEventListener("DOMContentLoaded", () => {
            const cards = document.querySelectorAll(".card");

            cards.forEach((card, index) => {
                        card.style.opacity = "0";
                        setTimeout(() => {
                                    card.style.transition = "0.8s";
                                    card.style.opacity = "1";
                        }, index * 200);
            });
});

// Floating speed change on hover
document.addEventListener("mousemove", (e) => {
            document.querySelectorAll(".floating-ball").forEach(ball => {
                        const speed = ball.getAttribute("data-speed") || 2;
                        ball.style.transform = `translate(${e.clientX / 50}px, ${e.clientY / 50}px)`;
            });
});// ======================
// CARD FADE ANIMATION
// ======================
document.addEventListener("DOMContentLoaded", () => {
            const cards = document.querySelectorAll(".card");

            cards.forEach((card, index) => {
                        card.style.opacity = "0";
                        setTimeout(() => {
                                    card.style.transition = "0.8s";
                                    card.style.opacity = "1";
                        }, index * 200);
            });
});

// ======================
// FLOATING BALL MOVE
// ======================
document.addEventListener("mousemove", (e) => {
            document.querySelectorAll(".floating-ball").forEach(ball => {
                        const speed = ball.getAttribute("data-speed") || 2;
                        ball.style.transform = `translate(${e.clientX / 50}px, ${e.clientY / 50}px)`;
            });
});

// ======================
//  GET STARTED SMOOTH SCROLL
// ======================
document.querySelector(".btn-primary").addEventListener("click", (e) => {
            e.preventDefault();

            document.getElementById("featuresSection").scrollIntoView({
                        behavior: "smooth"
            });
});

// ======================
// EXPLORE PAGE FADE + REDIRECT
// ======================
document.querySelector(".btn-secondary").addEventListener("click", (e) => {
            e.preventDefault();

            // Add fade-out class
            document.body.classList.add("fade-out");

            setTimeout(() => {
                        window.location.href = "explore.html";
            }, 500); // same duration as CSS fade animation
});

// ======================
// CARD CLICK FUNCTIONALITY
// ======================

// Book Suggestions Handler
document.getElementById("bookSuggestions").addEventListener("click", () => {
            const interest = prompt("What subject do you want book suggestions for?");
            if (interest) {
                        generateAIRecommendations(interest, "books");
            }
});

// Online Courses Handler
document.getElementById("onlineCourses").addEventListener("click", () => {
            const interest = prompt("What topic do you want to learn?");
            if (interest) {
                        generateAIRecommendations(interest, "courses");
            }
});

// Coding Practice Handler
document.getElementById("codingPractice").addEventListener("click", () => {
            const interest = prompt("What type of coding practice do you want?");
            if (interest) {
                        generateAIRecommendations(interest, "coding");
            }
});

// Skill Roadmaps Handler
document.getElementById("skillRoadmaps").addEventListener("click", () => {
            const interest = prompt("What skill do you want a roadmap for?");
            if (interest) {
                        generateAIRecommendations(interest, "roadmap");
            }
});

// ======================
// AI RECOMMENDATIONS SECTION
// ======================

// The API key must be kept on the server. Frontend calls the backend proxy at /api/recommend

async function generateAIRecommendations(interest, type) {
            const resultsContainer = document.getElementById("resultsContainer");
            const loadingSpinner = document.getElementById("loadingSpinner");

            // Show loading state
            loadingSpinner.classList.add("loading-visible");
            resultsContainer.innerHTML = "";

            try {
                        const apiUrl = `${API_BASE}/api/recommend`;
                        console.log('Fetching from:', apiUrl);
                        console.log('API_BASE:', API_BASE);
                        console.log('Hostname:', window.location.hostname);
                        
                        // Ask the backend proxy to generate recommendations (backend will call OpenAI)
                        const response = await fetch(apiUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ interest, type, mode: 'short' })
                        });

                        console.log('Response status:', response.status);

                        if (!response.ok) {
                                    const errorData = await response.json().catch(() => ({}));
                                    const errorMsg = errorData.error || errorData.details || `Server error (${response.status})`;
                                    throw new Error(errorMsg);
                        }

                        const data = await response.json();
                        const result = data.content;

                        displayResults(result, interest, type);
            } catch (error) {
                        console.error('Fetch error:', error);
                        let errorMsg = error.message;
                        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                                    errorMsg = 'Cannot reach API server. Make sure the proxy is running on http://localhost:5000';
                        }
                        resultsContainer.innerHTML = `<div class="error-message">⚠️ Error: ${errorMsg}</div>`;
            } finally {
                        loadingSpinner.classList.remove("loading-visible");
            }
}

function generatePrompt(interest, type) {
            const prompts = {
                        books: `Generate 5 highly recommended books for someone interested in "${interest}". For each book, provide: Title, Author, and a brief 1-line description. Format as a clean list.`,
                        courses: `Suggest 5 best online courses for learning "${interest}". Include platform name (Coursera, Udemy, edX, etc.), course name, and duration. Format as a clean list.`,
                        coding: `Recommend 5 best platforms and resources for "${interest}" coding practice. Include platform name and what makes it special for this type of practice. Format as a clean list.`,
                        roadmap: `Create a structured learning roadmap for "${interest}". Break it into 4-5 progressive phases with specific skills to learn in each phase. Format clearly with phases as headings.`
            };
            return prompts[type] || prompts.books;
}

function displayResults(content, interest, type) {
            const resultsContainer = document.getElementById("resultsContainer");
            const typeEmojis = {
                        books: "📚",
                        courses: "🎓",
                        coding: "💻",
                        roadmap: "🚀"
            };

            const resultHTML = `
                        <div class="result-box">
                                    <h3>${typeEmojis[type]} ${interest.toUpperCase()}</h3>
                                    <p>${content.replace(/\n/g, "<br>")}</p>
                        </div>
            `;

            resultsContainer.innerHTML = resultHTML;
}

// Generate Button Handler
document.getElementById("generateBtn").addEventListener("click", async () => {
            const userInterest = document.getElementById("userInterest").value.trim();

            if (!userInterest) {
                        alert("Please enter your interest!");
                        return;
            }

            const resultsContainer = document.getElementById("resultsContainer");
            const loadingSpinner = document.getElementById("loadingSpinner");

            loadingSpinner.classList.add("loading-visible");
            resultsContainer.innerHTML = "";

            try {
                        const prompt = `You are an AI learning advisor. A user is interested in "${userInterest}". Provide comprehensive personalized recommendations including:
                        
1. **Recommended Books** (3-4 titles with brief descriptions)
2. **Best Online Courses** (3-4 platforms/courses)
3. **Coding Practice Platforms** (3-4 resources if applicable)
4. **Learning Roadmap** (4-5 phases with key skills)
5. **Timeline & Tips** (Realistic timeline and actionable tips)

Keep it structured, practical, and motivating.`;

                        // Send request to backend proxy which will call OpenAI using server-side key
                        const response = await fetch(`${API_BASE}/api/recommend`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ interest: userInterest, type: 'full', mode: 'full' })
                        });

                        if (!response.ok) {
                                    throw new Error('Failed to generate recommendations (server error).');
                        }

                        const data = await response.json();
                        const result = data.content;

                        resultsContainer.innerHTML = `
                                    <div class="result-box">
                                                <h3>✨ AI-Generated Learning Plan for "${userInterest}"</h3>
                                                <p>${result.replace(/\n/g, "<br>")}</p>
                                    </div>
                        `;
            } catch (error) {
                        resultsContainer.innerHTML = `<div class="error-message">⚠️ Error: ${error.message}</div>`;
            } finally {
                        loadingSpinner.classList.remove("loading-visible");
            }
});

