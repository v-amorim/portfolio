/**
 * Renders mermaid diagrams with the site palette, one variant per color scheme.
 * Fences emit <pre class="mermaid-src"> so Material's own renderer skips them
 * and this script owns the theme for every diagram type.
 */
(function () {
  'use strict';

  const PALETTES = {
    slate: {
      bg: '#0d0e17',
      card: '#191726',
      cardInner: '#12131f',
      accent: '#272d44',
      deep: '#3c466f',
      border: '#30363d',
      text: '#f8eaf8',
      muted: '#8b949e',
      primary: '#7386d0',
      blue: '#5dabf3',
      sky: '#79c0ff',
      azure: '#58a6ff',
      lavender: '#acb9e6',
      violet: '#a5a1e9',
      pink: '#b86cb3',
      magenta: '#ca5fa6',
      red: '#ca5f71',
      green: '#49ef95',
      mint: '#99e6b3',
      yellow: '#ffcb6b',
      // Series hues blended into the card color: fills for mindmap, timeline, pie and kanban sections
      tinted: ['#323656', '#2c405f', '#462f4d', '#4b2b3b', '#3d514d', '#594939', '#42445c', '#403e5d'],
      // Series for git branches, sankey bars and journey boxes: a step above tinted, still muted enough for light text
      mid: ['#4a5486', '#3f6a94', '#7d4a7a', '#8a4552', '#4f7a63', '#8a713f', '#5c6489', '#5f5c92'],
      onMid: '#f8eaf8',
      pie: ['#323656', '#2c405f', '#462f4d', '#4b2b3b', '#3d514d', '#594939', '#42445c', '#403e5d'],
      pieExtra: ['#2f4a63', '#4b2d45', '#2b5140', '#2b4460'],
      flow: '#3c466f',
      flowOpacity: 0.55
    },
    // Same hues as slate at lightness ~0.45 so they hold contrast on white, tints at 16% over white
    default: {
      bg: '#f8fafc',
      card: '#ffffff',
      cardInner: '#f3f4f6',
      accent: '#e2e7fc',
      deep: '#c3cbf6',
      border: '#d1d5db',
      text: '#1e293b',
      muted: '#6b7280',
      primary: '#5757e1',
      blue: '#025894',
      sky: '#2e76b4',
      azure: '#2063b0',
      lavender: '#546091',
      violet: '#6752a6',
      pink: '#7b3678',
      magenta: '#89296c',
      red: '#962339',
      green: '#095c34',
      mint: '#2a7449',
      yellow: '#93690d',
      tinted: ['#e4e4fa', '#d7e4ee', '#eadfe9', '#eedcdf', '#dde9e2', '#eee7d8', '#e4e6ed', '#e7e3f1'],
      mid: ['#ababf0', '#80acca', '#bd9abc', '#ca919c', '#94baa4', '#c9b486', '#aab0c8', '#b3a8d2'],
      onMid: '#1e293b',
      pie: ['#c3c3f4', '#a4c3d8', '#cfb7ce', '#d9b0b8', '#b2cdbd', '#d8c9a8', '#c1c6d7', '#c8c1df'],
      pieExtra: ['#b4cee4', '#d5b2ca', '#a6c4b6', '#afc7e3'],
      flow: '#5757e1',
      flowOpacity: 0.22
    }
  };

  // d3 schemeTableau10, hardcoded by the sankey renderer; remapped through attribute selectors below
  const tableau = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];

  function currentScheme() {
    return document.body.getAttribute('data-md-color-scheme') === 'default' ? 'default' : 'slate';
  }

  function buildConfig(scheme) {
  const c = PALETTES[scheme];
  const series = [c.primary, c.blue, c.pink, c.red, c.mint, c.yellow, c.lavender, c.violet];
  const tinted = c.tinted;
  const onJourneyFill = c.onMid;

  const themeVariables = {
    darkMode: scheme === 'slate',
    background: c.bg,
    mainBkg: c.card,
    primaryColor: c.card,
    primaryTextColor: c.text,
    primaryBorderColor: c.primary,
    secondaryColor: c.accent,
    secondaryTextColor: c.text,
    secondaryBorderColor: c.blue,
    tertiaryColor: c.deep,
    tertiaryTextColor: c.text,
    tertiaryBorderColor: c.sky,
    lineColor: c.primary,
    textColor: c.text,
    titleColor: c.text,
    fontFamily: 'Mulish, system-ui, sans-serif',
    fontSize: '14px',

    nodeBorder: c.primary,
    nodeTextColor: c.text,
    clusterBkg: c.cardInner,
    clusterBorder: c.border,
    edgeLabelBackground: c.card,
    defaultLinkColor: c.primary,

    actorBkg: c.card,
    actorBorder: c.primary,
    actorTextColor: c.text,
    actorLineColor: c.primary,
    signalColor: c.primary,
    signalTextColor: c.text,
    labelBoxBkgColor: c.accent,
    labelBoxBorderColor: c.primary,
    labelTextColor: c.text,
    loopTextColor: c.text,
    noteBkgColor: c.deep,
    noteTextColor: c.text,
    noteBorderColor: c.primary,
    activationBkgColor: c.accent,
    activationBorderColor: c.yellow,
    sequenceNumberColor: c.bg,

    classText: c.text,
    labelColor: c.text,

    stateBkg: c.card,
    stateBorder: c.primary,
    stateLabelColor: c.text,
    transitionColor: c.primary,
    transitionLabelColor: c.text,
    compositeBackground: c.cardInner,
    compositeTitleBackground: c.accent,
    compositeBorder: c.border,
    altBackground: c.cardInner,
    labelBackgroundColor: c.card,
    specialStateColor: c.primary,
    innerEndBackground: c.primary,

    attributeBackgroundColorOdd: c.card,
    attributeBackgroundColorEven: c.cardInner,

    sectionBkgColor: c.card,
    altSectionBkgColor: c.bg,
    sectionBkgColor2: c.accent,
    excludeBkgColor: c.cardInner,
    gridColor: c.border,
    todayLineColor: c.yellow,
    taskBkgColor: c.deep,
    taskBorderColor: c.primary,
    taskTextColor: c.text,
    taskTextLightColor: c.text,
    taskTextDarkColor: c.text,
    taskTextOutsideColor: c.text,
    taskTextClickableColor: c.sky,
    activeTaskBkgColor: c.primary,
    activeTaskBorderColor: c.blue,
    doneTaskBkgColor: c.accent,
    doneTaskBorderColor: c.border,
    critBkgColor: c.red,
    critBorderColor: c.red,

    pieTitleTextColor: c.text,
    pieSectionTextColor: c.text,
    pieLegendTextColor: c.text,
    pieStrokeColor: c.bg,
    pieOuterStrokeColor: c.border,
    pieStrokeWidth: '2px',
    pieOuterStrokeWidth: '2px',
    pieOpacity: '0.95',

    commitLabelColor: c.text,
    commitLabelBackground: c.card,
    tagLabelColor: c.bg,
    tagLabelBackground: c.yellow,
    tagLabelBorder: c.yellow,

    quadrant1Fill: c.cardInner,
    quadrant2Fill: c.card,
    quadrant3Fill: c.card,
    quadrant4Fill: c.cardInner,
    quadrant1TextFill: c.text,
    quadrant2TextFill: c.text,
    quadrant3TextFill: c.text,
    quadrant4TextFill: c.text,
    quadrantPointFill: c.yellow,
    quadrantPointTextFill: c.text,
    quadrantXAxisTextFill: c.text,
    quadrantYAxisTextFill: c.text,
    quadrantInternalBorderStrokeFill: c.primary,
    quadrantExternalBorderStrokeFill: c.primary,
    quadrantTitleFill: c.text,

    requirementBackground: c.card,
    requirementBorderColor: c.primary,
    requirementTextColor: c.text,
    relationColor: c.primary,
    relationLabelBackground: c.bg,
    relationLabelColor: c.text,

    personBkg: c.primary,
    personBorder: c.blue,
    external_personBkg: c.deep,
    external_personBorder: c.border,
    systemBkg: c.deep,
    systemBorder: c.primary,
    system_dbBkg: c.deep,
    system_dbBorder: c.primary,
    system_queueBkg: c.deep,
    system_queueBorder: c.primary,
    external_systemBkg: c.accent,
    external_systemBorder: c.border,
    external_system_dbBkg: c.accent,
    external_system_dbBorder: c.border,
    external_system_queueBkg: c.accent,
    external_system_queueBorder: c.border,
    containerBkg: c.deep,
    containerBorder: c.primary,
    container_dbBkg: c.deep,
    container_dbBorder: c.primary,
    container_queueBkg: c.deep,
    container_queueBorder: c.primary,
    external_containerBkg: c.accent,
    external_containerBorder: c.border,
    external_container_dbBkg: c.accent,
    external_container_dbBorder: c.border,
    external_container_queueBkg: c.accent,
    external_container_queueBorder: c.border,
    componentBkg: c.deep,
    componentBorder: c.primary,
    component_dbBkg: c.deep,
    component_dbBorder: c.primary,
    component_queueBkg: c.deep,
    component_queueBorder: c.primary,
    external_componentBkg: c.accent,
    external_componentBorder: c.border,
    external_component_dbBkg: c.accent,
    external_component_dbBorder: c.border,
    external_component_queueBkg: c.accent,
    external_component_queueBorder: c.border,

    archEdgeColor: c.primary,
    archEdgeArrowColor: c.primary,
    archEdgeWidth: '2',
    archGroupBorderColor: c.border,
    archGroupBorderWidth: '2',

    xyChart: {
      backgroundColor: 'transparent',
      titleColor: c.text,
      xAxisLabelColor: c.text,
      xAxisTitleColor: c.text,
      xAxisTickColor: c.border,
      xAxisLineColor: c.border,
      yAxisLabelColor: c.text,
      yAxisTitleColor: c.text,
      yAxisTickColor: c.border,
      yAxisLineColor: c.border,
      plotColorPalette: series.join(',')
    },

    radar: {
      axisColor: c.primary,
      axisStrokeWidth: 1,
      graticuleColor: c.border,
      graticuleOpacity: 0.4,
      curveOpacity: 0.35,
      curveStrokeWidth: 2,
      legendBoxSize: 12
    }
  };

  series.forEach((color, i) => {
    themeVariables[`pie${i + 1}`] = c.pie[i];
    themeVariables[`git${i}`] = c.mid[i];
    themeVariables[`gitBranchLabel${i}`] = c.onMid;
    themeVariables[`gitInv${i}`] = c.onMid;
    themeVariables[`fillType${i}`] = c.mid[i];
    themeVariables[`cScale${i}`] = tinted[i];
    themeVariables[`cScaleLabel${i}`] = c.text;
    themeVariables[`cScalePeer${i}`] = color;
  });
  c.pieExtra.forEach((color, i) => { themeVariables[`pie${i + 9}`] = color; });

  // Rules mermaid's variables do not reach: arrowheads, class relations, journey faces and labels
  const themeCSS = `
    .marker, marker path, #arrowhead path, .arrowheadPath, .arrowMarkerPath { fill: ${c.primary}; stroke: ${c.primary}; }
    marker circle { fill: ${c.bg}; stroke: ${c.primary}; }
    .task-line, line.line, line[stroke="black"] { stroke: ${c.primary}; }
    [class^="node-line"] { stroke: ${c.primary} !important; }
    .messageLine0, .messageLine1, .actor-line { stroke: ${c.primary}; }
    .relation, .edgePath .path, .flowchart-link, .transition, path.path { stroke: ${c.primary}; }
    .relation.dashed-line, .edgePath .path.dashed { stroke-dasharray: 4 4; }
    .classGroup text, .classLabel .label, .nodeLabel, .edgeLabel, .label text { fill: ${c.text}; color: ${c.text}; }
    .edgeLabel rect, .edgeLabel .label-container { fill: ${c.card}; background: ${c.card}; }
    .cluster rect { fill: ${c.cardInner}; stroke: ${c.border}; }
    .cluster text, .cluster span { fill: ${c.text}; color: ${c.text}; }
    .grid .tick text, .tick text { fill: ${c.muted}; }
    .grid .tick line, .grid path { stroke: ${c.border}; }
    .titleText, .sectionTitle, .legend text, .pieTitleText { fill: ${c.text}; }
    text.journey-section { fill: ${onJourneyFill}; }
    .journey-title { fill: ${c.text}; }
    .section { stroke: none; }
    .task text, .taskText { fill: ${onJourneyFill}; }
    .task rect { stroke: ${c.bg}; }
    .face { fill: ${c.yellow}; stroke: ${c.bg}; }
    .mouth, .eye { stroke: ${c.bg}; fill: ${c.bg}; }
    .actor-legend { fill: ${c.text}; }
    .branch-label text { fill: ${c.onMid}; }
    .tag-label text { fill: ${c.bg}; }
    .er.attributeBoxOdd { fill: ${c.card}; } .er.attributeBoxEven { fill: ${c.cardInner}; }
    .er.entityBox { fill: ${c.card}; stroke: ${c.primary}; } .er.entityLabel, .er.relationshipLabel { fill: ${c.text}; }
    .er.relationshipLabelBox { fill: ${c.card}; opacity: 1; } .er.relationshipLine { stroke: ${c.primary}; }
    .statediagram-state rect, .statediagram-cluster rect { stroke: ${c.primary}; }
    .statediagram-state .divider { stroke: ${c.border}; }
    text.stateLabel, .stateLabel text, .stateGroup text { fill: ${c.text}; }
    .note-edge { stroke: ${c.border}; }
    ${tableau.map((t, i) => `[fill="${t}"] { fill: ${c.mid[i % 3]}; } [stroke="${t}"] { stroke: ${c.mid[i % 3]}; }`).join('\n    ')}
    .link path { stroke: ${c.flow}; stroke-opacity: ${c.flowOpacity}; }
    .link { mix-blend-mode: normal !important; }
    ${series.map((color, i) => `.radarCurve-${i} { stroke: ${color}; fill: ${color}; } .radarLegendBox-${i}, .radarLegend-${i} rect { fill: ${color}; stroke: ${color}; }`).join('\n    ')}
    .section-root > rect, .section-root > circle, .section-root > path, .section-root > polygon { fill: ${tinted[0]}; stroke: ${c.primary}; stroke-width: 2px; }
    .section-root text, .section-root .label, .section-root span { fill: ${c.text}; color: ${c.text}; }
    .pieCircle { stroke: ${c.bg}; }
    .slice { fill: ${c.text}; paint-order: stroke; stroke: ${c.bg}; stroke-width: 3px; stroke-linejoin: round; }
    text[fill="#444444"] { fill: ${c.text}; }
    line[stroke="#444444"], path[stroke="#444444"] { stroke: ${c.primary}; }
    svg > g > rect:first-child { fill: ${c.primary} !important; }
    .packetBlock { fill: ${c.card}; stroke: ${c.primary}; }
    .packetLabel, .packetTitle { fill: ${c.text}; }
    .packetByte { fill: ${c.muted}; }
    .node polygon.subroutine { stroke: ${c.yellow}; stroke-width: 2px; }
    .em-swimlane rect { fill: ${c.cardInner}; stroke: ${c.border}; }
    .em-box rect[fill="white"] { fill: ${c.card}; stroke: ${c.border}; }
    .em-box rect[fill="#bcd6fe"] { fill: ${tinted[0]}; stroke: ${c.primary}; }
    .em-box rect[fill="#ffb778"] { fill: ${tinted[1]}; stroke: ${c.blue}; }
    .em-box rect[fill="#d3f1a2"] { fill: ${tinted[2]}; stroke: ${c.pink}; }
    .treeView-node-line { stroke: ${c.border}; }
    .treeView-node-label { fill: ${c.text}; }
    .treeView-node-dir { fill: ${c.primary}; }
    .treeView-node-description { fill: ${c.mint}; }
    .treeView-highlight-bg { fill: ${c.accent}; stroke: ${c.yellow}; }
    /* currentColor on the built-in file icons only; icon-pack logos carry their own fills */
    .treeView-node-icon { color: ${c.muted}; }
    ${series.slice(0, 3).map((color, i) => `.venn-set-${i} > path { fill: ${color} !important; stroke: ${color} !important; }`).join('\n    ')}
    .venn-circle > text.label { fill: ${c.text} !important; }
    .railroad-terminal rect { fill: ${c.accent}; }
    .node line[stroke="red"] { stroke: ${c.red}; }
    .node line[stroke="orange"] { stroke: ${c.yellow}; }
    .node line[stroke="blue"] { stroke: ${c.blue}; }
    [class^="bar-plot-"] text { fill: ${c.bg}; }
  `;

  const config = {
    startOnLoad: false,
    theme: 'base',
    themeVariables,
    themeCSS,
    fontFamily: 'Mulish, system-ui, sans-serif',
    sequence: { actorFontSize: 14, messageFontSize: 14, noteFontSize: 14 },
    gantt: { fontSize: 13, barHeight: 24, barGap: 8, topPadding: 56, leftPadding: 96, gridLineStartPadding: 32, numberSectionStyles: 2 },
    pie: { textPosition: 0.7 },
    sankey: { linkColor: 'source', showValues: true },
    c4: {
      c4ShapeInRow: 3,
      c4ShapeMargin: 40,
      c4ShapePadding: 16,
      person_bg_color: c.accent,
      person_border_color: c.primary,
      external_person_bg_color: c.cardInner,
      external_person_border_color: c.border,
      system_bg_color: c.card,
      system_border_color: c.primary,
      system_db_bg_color: c.card,
      system_db_border_color: c.primary,
      system_queue_bg_color: c.card,
      system_queue_border_color: c.primary,
      external_system_bg_color: c.cardInner,
      external_system_border_color: c.border,
      external_system_db_bg_color: c.cardInner,
      external_system_db_border_color: c.border,
      external_system_queue_bg_color: c.cardInner,
      external_system_queue_border_color: c.border,
      container_bg_color: c.card,
      container_border_color: c.primary,
      container_db_bg_color: c.card,
      container_db_border_color: c.primary,
      container_queue_bg_color: c.card,
      container_queue_border_color: c.primary,
      external_container_bg_color: c.cardInner,
      external_container_border_color: c.border,
      external_container_db_bg_color: c.cardInner,
      external_container_db_border_color: c.border,
      external_container_queue_bg_color: c.cardInner,
      external_container_queue_border_color: c.border,
      component_bg_color: c.card,
      component_border_color: c.primary,
      component_db_bg_color: c.card,
      component_db_border_color: c.primary,
      component_queue_bg_color: c.card,
      component_queue_border_color: c.primary,
      external_component_bg_color: c.cardInner,
      external_component_border_color: c.border,
      external_component_db_bg_color: c.cardInner,
      external_component_db_border_color: c.border,
      external_component_queue_bg_color: c.cardInner,
      external_component_queue_border_color: c.border,
      personFontColor: c.text,
      external_personFontColor: c.text,
      systemFontColor: c.text,
      system_dbFontColor: c.text,
      system_queueFontColor: c.text,
      external_systemFontColor: c.text,
      external_system_dbFontColor: c.text,
      external_system_queueFontColor: c.text,
      containerFontColor: c.text,
      container_dbFontColor: c.text,
      container_queueFontColor: c.text,
      external_containerFontColor: c.text,
      external_container_dbFontColor: c.text,
      external_container_queueFontColor: c.text,
      componentFontColor: c.text,
      component_dbFontColor: c.text,
      component_queueFontColor: c.text,
      external_componentFontColor: c.text,
      external_component_dbFontColor: c.text,
      external_component_queueFontColor: c.text,
      boundaryFontColor: c.text,
      messageFontColor: c.text
    }
  };

  return config;
  }

  let counter = 0;
  let activeScheme = null;

  // C4 writes fill:#FFFFFF !important inline on shape text; only a DOM pass can recolor it
  function fixInlineText(root) {
    const color = PALETTES[activeScheme || currentScheme()].text;
    root.querySelectorAll('text[style*="#FFFFFF"], text[style*="#ffffff"]').forEach(el => {
      el.style.setProperty('fill', color, 'important');
    });
  }

  // Subroutine nodes ([[X]]) share the plain polygon class with hexagons and trapezoids; only their ten-point outline tells them apart
  function markSubroutines(root) {
    root.querySelectorAll('.node polygon.label-container').forEach(el => {
      if (el.getAttribute('points').trim().split(/\s+/).length === 10) el.classList.add('subroutine');
    });
  }
  window.mermaidTheme = { fixInlineText, markSubroutines };

  async function renderInto(host, code) {
    try {
      const { svg, bindFunctions } = await mermaid.render(`mermaid-${counter++}`, code);
      host.classList.remove('mermaid--error');
      host.innerHTML = svg;
      fixInlineText(host);
      markSubroutines(host);
      if (bindFunctions) bindFunctions(host);
    } catch (error) {
      host.classList.add('mermaid--error');
      host.textContent = error.message || String(error);
    }
  }

  async function renderAll() {
    if (typeof mermaid === 'undefined') return;
    const scheme = currentScheme();
    if (scheme !== activeScheme) {
      mermaid.initialize(buildConfig(scheme));
      activeScheme = scheme;
    }
    for (const pre of document.querySelectorAll('pre.mermaid-src')) {
      const code = pre.textContent;
      const host = document.createElement('div');
      host.className = 'mermaid';
      host.dataset.source = code;
      await renderInto(host, code);
      pre.replaceWith(host);
      document.dispatchEvent(new CustomEvent('mermaid:rendered', { detail: host }));
    }
  }

  // Palette toggle: re-render every diagram from its stored source with the other scheme
  async function rerenderForScheme() {
    if (typeof mermaid === 'undefined') return;
    const scheme = currentScheme();
    if (scheme === activeScheme) return;
    mermaid.initialize(buildConfig(scheme));
    activeScheme = scheme;
    for (const host of document.querySelectorAll('div.mermaid[data-source]')) {
      await renderInto(host, host.dataset.source);
    }
  }

  new MutationObserver(rerenderForScheme).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-md-color-scheme']
  });

  renderAll();
  if (typeof document$ !== 'undefined') {
    document$.subscribe(renderAll);
  }
})();
