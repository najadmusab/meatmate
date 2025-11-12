// Simple scroll fade animation
window.addEventListener('scroll', () => {
  const box = document.querySelector('.about-box');
  const pos = box.getBoundingClientRect().top;
  const screenPos = window.innerHeight / 1.2;
  if (pos < screenPos) box.style.opacity = '1';
});
