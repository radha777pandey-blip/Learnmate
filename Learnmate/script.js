window.onload = () => {
            document.body.classList.add("fade-in");
};
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

