export function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up, .fade-in-down , .fade-in-left, .fade-in-right, .fade-in'); // só fade-in-up aqui, teste só um

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          const delay = el.getAttribute('data-delay');
          if (delay) {
            el.style.animationDelay = delay; // seta o delay via style inline
          }

          el.classList.add('show'); // dispara animação
          observer.unobserve(el); // só anima 1 vez
        }
      });
    },
    { threshold: 0.6 }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}
