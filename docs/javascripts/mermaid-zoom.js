/**
 * Fullscreen pan/zoom for mermaid diagrams.
 * The diagram is re-rendered inside the overlay from the source kept by
 * mermaid-config.js, and zoom resizes the SVG itself (not a CSS scale) so
 * the vector stays sharp at any level.
 */
(function () {
  'use strict';

  const LANG = document.documentElement.lang.startsWith('en') ? 'en' : 'pt';
  const t = {
    pt: { expand: 'Expandir diagrama', zoomIn: 'Aproximar', zoomOut: 'Afastar', reset: 'Ajustar à tela', close: 'Fechar', diagram: 'Diagrama', code: 'Código', copy: 'Copiar código', copied: 'Copiado' },
    en: { expand: 'Expand diagram', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Fit to screen', close: 'Close', diagram: 'Diagram', code: 'Code', copy: 'Copy code', copied: 'Copied' }
  }[LANG];

  const ICONS = {
    copy: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    expand: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
  };

  const MIN_SCALE = 0.2;
  const MAX_SCALE = 8;

  let overlay, stage, canvas;
  const view = { x: 0, y: 0, scale: 1 };
  const base = { width: 0, height: 0 };
  const pointers = new Map();
  let pinchStart = null;
  let renderCount = 0;

  function button(kind, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mermaid-zoom__btn mermaid-zoom__btn--${kind}`;
    btn.title = t[kind];
    btn.setAttribute('aria-label', t[kind]);
    btn.innerHTML = ICONS[kind];
    btn.addEventListener('click', onClick);
    return btn;
  }

  function apply() {
    const svg = canvas.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', base.width * view.scale);
      svg.setAttribute('height', base.height * view.scale);
    }
    canvas.style.transform = `translate(${view.x}px, ${view.y}px)`;
  }

  function zoomAt(clientX, clientY, factor) {
    const rect = stage.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale * factor));
    const ratio = next / view.scale;
    view.x = px - (px - view.x) * ratio;
    view.y = py - (py - view.y) * ratio;
    view.scale = next;
    apply();
  }

  function zoomCenter(factor) {
    const rect = stage.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  }

  function fit() {
    if (!base.width) return;
    const rect = stage.getBoundingClientRect();
    const padding = 48;
    // Never scale a small diagram past 1.5x on fit; zooming in is one wheel notch away
    view.scale = Math.min((rect.width - padding) / base.width, (rect.height - padding) / base.height, 1.5);
    view.x = (rect.width - base.width * view.scale) / 2;
    view.y = (rect.height - base.height * view.scale) / 2;
    apply();
  }

  function close() {
    overlay.hidden = true;
    canvas.innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoomCenter(1.25);
    if (e.key === '-') zoomCenter(0.8);
    if (e.key === '0') fit();
  }

  function onWheel(e) {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015));
  }

  function onPointerDown(e) {
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
    }
    stage.classList.add('is-dragging');
  }

  function onPointerMove(e) {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const curr = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, curr);

    if (pointers.size === 2 && pinchStart) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const target = pinchStart.scale * (dist / pinchStart.dist);
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, target / view.scale);
      return;
    }

    view.x += curr.x - prev.x;
    view.y += curr.y - prev.y;
    apply();
  }

  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) stage.classList.remove('is-dragging');
  }

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'mermaid-zoom__overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t.expand);

    const toolbar = document.createElement('div');
    toolbar.className = 'mermaid-zoom__toolbar';
    toolbar.append(
      button('zoomOut', () => zoomCenter(0.8)),
      button('reset', fit),
      button('zoomIn', () => zoomCenter(1.25)),
      button('close', close)
    );

    stage = document.createElement('div');
    stage.className = 'mermaid-zoom__stage';
    canvas = document.createElement('div');
    canvas.className = 'mermaid-zoom__canvas';
    stage.appendChild(canvas);

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('dblclick', fit);

    overlay.append(toolbar, stage);
    document.body.appendChild(overlay);
  }

  async function open(code) {
    if (typeof mermaid === 'undefined') return;
    ensureOverlay();
    const { svg } = await mermaid.render(`mermaid-zoom-${renderCount++}`, code);
    canvas.innerHTML = svg;
    if (window.mermaidTheme) {
      window.mermaidTheme.fixInlineText(canvas);
      window.mermaidTheme.markSubroutines(canvas);
    }
    const el = canvas.querySelector('svg');
    if (el) {
      // Mermaid emits width="100%" and a max-width; the viewBox carries the intrinsic size
      const box = el.viewBox.baseVal;
      base.width = (box && box.width) || el.getBoundingClientRect().width;
      base.height = (box && box.height) || el.getBoundingClientRect().height;
      el.style.maxWidth = 'none';
    }
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    fit();
    overlay.querySelector('.mermaid-zoom__btn--close').focus();
  }

  const KEYWORDS = new Set(('graph flowchart subgraph end direction LR RL TD TB BT style classDef class click linkStyle ' +
    'sequenceDiagram participant actor autonumber activate deactivate loop alt else opt par and critical option break rect note over left right of ' +
    'classDiagram stateDiagram stateDiagram-v2 state erDiagram gantt title dateFormat axisFormat section excludes todayMarker ' +
    'pie showData gitGraph commit branch checkout merge cherry-pick id tag journey mindmap root timeline quadrantChart x-axis y-axis ' +
    'quadrant-1 quadrant-2 quadrant-3 quadrant-4 requirementDiagram requirement functionalRequirement performanceRequirement ' +
    'interfaceRequirement physicalRequirement designConstraint element text risk verifymethod type satisfies verifies derives refines traces contains copies ' +
    'C4Context C4Container C4Component C4Dynamic C4Deployment Person Person_Ext System System_Ext SystemDb System_Boundary Container Component Rel Rel_Back BiRel ' +
    'sankey-beta xychart-beta bar line block-beta columns space packet-beta kanban architecture-beta group service junction in ' +
    'radar-beta axis curve max min ticks graticule showLegend done active crit milestone after').split(' '));

  function highlightMermaid(source) {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const span = (cls, s) => `<span class="${cls}">${esc(s)}</span>`;
    const rules = [
      [/^%%.*$/, 'c1'],
      [/^"[^"]*"/, 's'],
      [/^\(\([^)]*\)\)/, 'label'],
      [/^\[\[[^\]]*\]\]/, 'label'],
      [/^\[[^\]]*\]/, 'label'],
      [/^\{[^}]*\}/, 'label'],
      [/^\([^)]*\)/, 'label'],
      [/^\|[^|]*\|/, 'label'],
      [/^(<\|--|--\|>|\*--|--\*|o--|--o|<-->|<--|--x|--\)|-->>|->>|-->|->|<-|-\.->|-\.-|==>|===|---|--|\.\.>|\.\.|\|\|--|\|o--|\}o--|\}\|--|--\|\||--o\||--o\{|--\|\{|<<--|-x|::|:|&|=|>)/, 'o'],
      [/^\d+(?:\.\d+)?%?/, 'm'],
      [/^[A-Za-z_][\w-]*/, w => (KEYWORDS.has(w) ? 'k' : 'nx')],
      [/^\s+/, null],
      [/^./, null]
    ];
    return source.split('\n').map(line => {
      let out = '';
      let rest = line;
      while (rest) {
        for (const [re, cls] of rules) {
          const m = rest.match(re);
          if (!m) continue;
          const tok = m[0];
          const kind = typeof cls === 'function' ? cls(tok) : cls;
          if (kind === 'label') {
            // Delimiters as punctuation, the text between them as a string
            const open = tok.match(/^[[({|]+/)[0];
            const close = tok.match(/[\])}|]+$/)[0];
            out += span('p', open) + span('s', tok.slice(open.length, tok.length - close.length)) + span('p', close);
          } else {
            out += kind ? span(kind, tok) : esc(tok);
          }
          rest = rest.slice(tok.length);
          break;
        }
      }
      return out;
    }).join('\n');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }

  function textButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mermaid-zoom__btn mermaid-zoom__btn--text';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function buildTools(wrapper, code) {
    const tools = document.createElement('div');
    tools.className = 'mermaid-zoom__tools';

    const codeBlock = document.createElement('pre');
    codeBlock.className = 'mermaid-zoom__code highlight';
    codeBlock.hidden = true;
    const codeEl = document.createElement('code');
    codeEl.innerHTML = highlightMermaid(code.trim());
    codeBlock.appendChild(codeEl);
    wrapper.appendChild(codeBlock);

    const showDiagram = textButton(t.diagram, () => setView(false));
    const showCode = textButton(t.code, () => setView(true));
    const toggle = document.createElement('div');
    toggle.className = 'mermaid-zoom__toggle';
    toggle.setAttribute('role', 'group');
    toggle.append(showDiagram, showCode);

    function setView(codeVisible) {
      // The diagram element is looked up late: the raw fence is swapped for the rendered host after load
      const diagram = wrapper.querySelector('.mermaid, .mermaid-src');
      if (diagram) diagram.hidden = codeVisible;
      codeBlock.hidden = !codeVisible;
      showDiagram.setAttribute('aria-pressed', String(!codeVisible));
      showCode.setAttribute('aria-pressed', String(codeVisible));
      copy.hidden = !codeVisible;
      expand.hidden = codeVisible;
    }

    const copy = button('copy', () => {
      // Feedback does not wait on the clipboard promise; some browsers hold it on a permission prompt
      copyText(code.trim());
      copy.innerHTML = ICONS.check;
      copy.title = t.copied;
      copy.setAttribute('aria-label', t.copied);
      copy.classList.add('is-done');
      setTimeout(() => {
        copy.innerHTML = ICONS.copy;
        copy.title = t.copy;
        copy.setAttribute('aria-label', t.copy);
        copy.classList.remove('is-done');
      }, 2000);
    });
    const expand = button('expand', () => open(code));

    tools.append(toggle, copy, expand);
    setView(false);
    return tools;
  }

  function wrapDiagrams() {
    // Either the raw fence (not rendered yet) or the host mermaid-config.js already produced
    document.querySelectorAll('pre.mermaid-src:not([data-mermaid-zoom]), div.mermaid[data-source]:not([data-mermaid-zoom])').forEach(el => {
      el.dataset.mermaidZoom = '1';
      const code = el.dataset.source || el.textContent;
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-zoom';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      wrapper.insertBefore(buildTools(wrapper, code), el);
    });
  }

  wrapDiagrams();
  document.addEventListener('mermaid:rendered', wrapDiagrams);
  if (typeof document$ !== 'undefined') {
    document$.subscribe(wrapDiagrams);
  }
})();
