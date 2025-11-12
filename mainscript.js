// Simple entry animation effect
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn, i) => {
    btn.style.animation = `fadeInUp 0.8s ease ${i * 0.2}s forwards`;
    btn.style.opacity = "0";
  });
});
