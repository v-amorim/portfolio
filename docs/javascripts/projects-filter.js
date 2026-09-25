(function () {
  'use strict';

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initFilter() {
    const bar = document.querySelector('.projects-filter');
    if (!bar || bar.dataset.ready) return;
    bar.dataset.ready = '1';

    const buttons = bar.querySelectorAll('.projects-filter__btn');
    const cards = document.querySelectorAll('.project-card[data-area]');
    const count = document.querySelector('.projects-count');

    function apply(filter) {
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
      let shown = 0;
      cards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.area !== filter;
        if (!card.hidden) shown++;
      });
      if (count) {
        const d = count.dataset;
        count.textContent = `${d.showing} ${shown} ${d.of} ${cards.length} ${d.projects}`;
      }
    }

    // Cards carry a view-transition-name each, so the browser animates the reflow
    function select(filter) {
      if (document.startViewTransition && !reducedMotion()) {
        document.startViewTransition(() => apply(filter));
      } else {
        apply(filter);
      }
    }

    buttons.forEach(btn => btn.addEventListener('click', () => select(btn.dataset.filter)));

    // Deep link: /projects/#ml opens with that filter active
    const fromHash = location.hash.slice(1);
    apply([...buttons].some(b => b.dataset.filter === fromHash) ? fromHash : 'all');

    // Spotlight follows the pointer across each card
    cards.forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
      });
    });
  }

  initFilter();
  if (typeof document$ !== 'undefined') {
    document$.subscribe(initFilter);
  }
})();
