import { useEffect } from "react";

export default function useScrollAnimation(threshold = 0.3) {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible-on-scroll");
          observer.unobserve(entry.target); // dispara uma vez
        }
      });
    }, { threshold });

    elements.forEach((el) => {
      el.classList.add("hidden-before-scroll");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold]);
}