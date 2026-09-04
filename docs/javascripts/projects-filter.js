(function () {
  'use strict';

  function initFilter() {
    const bar = document.querySelector('.projects-filter');
    if (!bar || bar.dataset.ready) return;
    bar.dataset.ready = '1';

    const buttons = bar.querySelectorAll('.projects-filter__btn');
    const cards = document.querySelectorAll('.project-card[data-area]');

    function apply(filter) {
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
      cards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.area !== filter;
      });
    }

    buttons.forEach(btn => btn.addEventListener('click', () => apply(btn.dataset.filter)));

    // Deep link: /projects/#ml opens with that filter active
    const fromHash = location.hash.slice(1);
    if ([...buttons].some(b => b.dataset.filter === fromHash)) apply(fromHash);
  }

  initFilter();
  if (typeof document$ !== 'undefined') {
    document$.subscribe(initFilter);
  }
})();
