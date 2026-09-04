/**
 * GLightbox tweak: a fixed row of dots under the viewport that jumps straight to a slide.
 * Arrow placement and image sizing live in components.css.
 */
(function () {
  'use strict';

  const LANG = document.documentElement.lang.startsWith('en') ? 'en' : 'pt';
  const label = { pt: (i, n) => `Imagem ${i} de ${n}`, en: (i, n) => `Image ${i} of ${n}` }[LANG];

  function enhance(lb) {
    if (!lb || lb.__navEnhanced) return;
    lb.__navEnhanced = true;

    let dots = null;

    function markActive() {
      if (!dots) return;
      const active = lb.getActiveSlideIndex();
      dots.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', String(i === active)));
    }

    function buildDots() {
      const container = document.querySelector('.glightbox-container');
      const total = lb.elements.length;
      if (!container || total < 2 || container.querySelector('.glightbox-dots')) return;
      dots = document.createElement('div');
      dots.className = 'glightbox-dots';
      dots.setAttribute('role', 'group');
      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', label(i + 1, total));
        btn.addEventListener('click', e => {
          e.stopPropagation();
          lb.goToSlide(i);
        });
        dots.appendChild(btn);
      }
      container.appendChild(dots);
      markActive();
    }

    lb.on('open', buildDots);
    lb.on('slide_changed', markActive);
    lb.on('close', () => { dots = null; });
  }

  function init() {
    if (typeof lightbox !== 'undefined') enhance(lightbox);
  }

  init();
  document.addEventListener('DOMContentLoaded', init);
  if (typeof document$ !== 'undefined') {
    document$.subscribe(init);
  }
})();
