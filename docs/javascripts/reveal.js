/* ===================================================================
   Scroll Reveal - staggered reveal and number count-up for the home
   page, the projects grid and the blog index
   Classes are added by JS only, so without JS (or with reduced motion)
   everything stays visible.
   =================================================================== */

(function () {
  const STAGGER_MS = 60;
  const easeOutExpo = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));

  function countUp(el) {
    const to = Number(el.dataset.count);
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / 1400);
      el.textContent = Math.round(to * easeOutExpo(k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Spotlight: project and post cards glow under the pointer (CSS reads --spot-x/--spot-y)
  function initSpotlight() {
    document.querySelectorAll(".project-card, .post-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      });
    });
  }

  function initReveal() {
    initSpotlight();
    const home = document.querySelector(".home-container");
    const cardGrid = document.querySelector(".projects-grid, .post-list");
    if ((!home && !cardGrid) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const groups = home
      ? [
          home.querySelectorAll(".tx-hero__content > *"),
          ...[...home.querySelectorAll(".card-grid, .bento, .principles, .stat-strip, .post-grid, .stack-groups, #career-timeline")].map((g) => g.children),
          ...[...home.querySelectorAll(":scope > h2, :scope > p:not(.newLine), :scope > ul, :scope > blockquote, .timeline-toggle-wrap")].map((el) => [el]),
        ]
      : [];
    if (cardGrid) groups.push(cardGrid.children);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.classList.add("is-visible");
          el.querySelectorAll("[data-count]").forEach(countUp);
          // Drop the stagger once revealed so hover transitions respond immediately
          setTimeout(() => el.style.setProperty("--reveal-i", 0), 1200);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    groups.forEach((group) => {
      [...group].forEach((el, i) => {
        el.classList.add("reveal");
        el.style.setProperty("--reveal-i", i);
        observer.observe(el);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    initReveal();
  }
})();
