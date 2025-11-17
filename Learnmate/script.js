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
});
// Floating balls animation