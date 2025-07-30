export function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up, .fade-in-down , .fade-in-left, .fade-in-right, .fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          const delay = el.getAttribute('data-delay');
          if (delay) {
            el.style.animationDelay = delay;
          }

          el.classList.add('show'); 
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}
