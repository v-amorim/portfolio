(function () {
  'use strict';

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initFilter() {
    const bar = document.querySelector('.projects-filter');
    if (!bar || bar.dataset.ready) return;
    bar.dataset.ready = '1';

    const buttons = [...bar.querySelectorAll('.projects-filter__btn')];
    const cards = document.querySelectorAll('.project-card[data-area]');
    const count = document.querySelector('.projects-count');
    const picked = document.querySelector('.projects-picked');
    const clear = picked.querySelector('.projects-clear');
    // Several areas can be picked; a card shows when it belongs to any of them, and with none picked every card shows
    const chosen = new Set();

    function apply() {
      // Walking the buttons in their first order keeps each row in that order as chips move between rows
      buttons.forEach(b => {
        const on = chosen.has(b.dataset.filter);
        b.setAttribute('aria-pressed', String(on));
        if (on) picked.insertBefore(b, clear);
        else bar.appendChild(b);
      });
      picked.hidden = chosen.size === 0;
      let shown = 0;
      cards.forEach(card => {
        card.hidden = chosen.size > 0 && !card.dataset.areas.split(' ').some(area => chosen.has(area));
        if (!card.hidden) shown++;
      });
      if (count) {
        const d = count.dataset;
        count.textContent = `${d.showing} ${shown} ${d.of} ${cards.length} ${d.projects}`;
      }
    }

    // Cards carry a view-transition-name each, so the browser animates the reflow
    function update(change) {
      const run = () => { change(); apply(); };
      if (document.startViewTransition && !reducedMotion()) {
        document.startViewTransition(run);
      } else {
        run();
      }
    }

    // "+ area" adds it; a picked area's × takes it off again
    buttons.forEach(btn => btn.addEventListener('click', () => update(() => {
      const area = btn.dataset.filter;
      if (chosen.has(area)) chosen.delete(area);
      else chosen.add(area);
    })));
    clear.addEventListener('click', () => update(() => chosen.clear()));

    // Deep link: /projects/#ml or /projects/#ml,visual opens with those areas picked
    const known = new Set(buttons.map(b => b.dataset.filter));
    location.hash.slice(1).split(',').filter(area => known.has(area)).forEach(area => chosen.add(area));
    apply();
  }

  initFilter();
  if (typeof document$ !== 'undefined') {
    document$.subscribe(initFilter);
  }
})();
