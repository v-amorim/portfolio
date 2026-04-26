// Mermaid configuration with theme support
function initializeMermaid() {
  if (typeof mermaid === 'undefined') return;

  // Check if dark mode is active
  const isDarkMode = document.documentElement.getAttribute('data-md-color-scheme') === 'slate';

  if (isDarkMode) {
    // Moonlight theme colors for dark mode
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        // Primary colors
        primaryColor: '#191726',
        primaryTextColor: '#f8eaf8',
        primaryBorderColor: '#7386d0',

        // Secondary colors
        secondaryColor: '#282e46',
        secondaryTextColor: '#f8eaf8',
        secondaryBorderColor: '#5dabf3',

        // Tertiary colors
        tertiaryColor: '#3c466f',
        tertiaryTextColor: '#f8eaf8',
        tertiaryBorderColor: '#79c0ff',

        // Background and lines
        background: 'transparent',
        mainBkg: '#191726',
        lineColor: '#7386d0',
        border1: '#30363d',
        border2: '#30363d',

        // Text colors
        textColor: '#f8eaf8',
        labelTextColor: '#f8eaf8',
        labelColor: '#f8eaf8',

        // Node colors
        nodeBorder: '#30363d',
        clusterBkg: '#282e46',
        clusterBorder: '#7386d0',

        // Edge colors
        edgeLabelBackground: '#191726',

        // Activity diagram
        actorBorder: '#7386d0',
        actorBkg: '#191726',
        actorTextColor: '#f8eaf8',
        actorLineColor: '#7386d0',
        signalColor: '#f8eaf8',
        signalTextColor: '#f8eaf8',
        labelBoxBkgColor: '#282e46',
        labelBoxBorderColor: '#7386d0',

        // Sequence diagram
        activationBorderColor: '#7386d0',
        activationBkgColor: '#282e46',
        sequenceNumberColor: '#f8eaf8',

        // State diagram
        labelColor: '#f8eaf8',

        // Class diagram
        classText: '#f8eaf8',

        // Git graph
        git0: '#7386d0',
        git1: '#5dabf3',
        git2: '#79c0ff',
        git3: '#58a6ff',
        git4: '#acb9e6',
        git5: '#ffcb6b',
        git6: '#49ef95',
        git7: '#ca5f71',

        // Error/success
        errorBkgColor: '#ca5f71',
        errorTextColor: '#f8eaf8',

        // Font
        fontFamily: 'Mulish, system-ui, sans-serif',
        fontSize: '14px'
      }
    });
  } else {
    // Light mode - use same dark background, so use light text colors
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        // Use same colors as dark mode since background is dark
        primaryColor: '#191726',
        primaryTextColor: '#f8eaf8',
        primaryBorderColor: '#7386d0',
        secondaryColor: '#282e46',
        secondaryTextColor: '#f8eaf8',
        secondaryBorderColor: '#5dabf3',
        tertiaryColor: '#3c466f',
        tertiaryTextColor: '#f8eaf8',
        tertiaryBorderColor: '#79c0ff',
        background: 'transparent',
        mainBkg: '#191726',
        lineColor: '#7386d0',
        border1: '#30363d',
        border2: '#30363d',
        textColor: '#f8eaf8',
        labelTextColor: '#f8eaf8',
        labelColor: '#f8eaf8',
        nodeBorder: '#30363d',
        clusterBkg: '#282e46',
        clusterBorder: '#7386d0',
        edgeLabelBackground: '#191726',
        actorBorder: '#7386d0',
        actorBkg: '#191726',
        actorTextColor: '#f8eaf8',
        actorLineColor: '#7386d0',
        signalColor: '#f8eaf8',
        signalTextColor: '#f8eaf8',
        labelBoxBkgColor: '#282e46',
        labelBoxBorderColor: '#7386d0',
        activationBorderColor: '#7386d0',
        activationBkgColor: '#282e46',
        sequenceNumberColor: '#f8eaf8',
        classText: '#f8eaf8',
        git0: '#7386d0',
        git1: '#5dabf3',
        git2: '#79c0ff',
        git3: '#58a6ff',
        git4: '#acb9e6',
        git5: '#ffcb6b',
        git6: '#49ef95',
        git7: '#ca5f71',
        errorBkgColor: '#ca5f71',
        errorTextColor: '#f8eaf8',
        fontFamily: 'Mulish, system-ui, sans-serif',
        fontSize: '14px'
      }
    });
  }

  // Re-render all mermaid diagrams
  const mermaidElements = document.querySelectorAll('.mermaid');
  mermaidElements.forEach((element) => {
    // Store original content if not already stored
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.textContent;
    }
    // Reset to original content
    element.textContent = element.dataset.originalContent;
    element.removeAttribute('data-processed');
  });

  // Render diagrams
  mermaid.run({
    querySelector: '.mermaid'
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeMermaid);

// Re-initialize on theme change (MkDocs Material)
document$.subscribe(() => {
  initializeMermaid();
});

// Listen for palette toggle
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-md-color-scheme') {
      setTimeout(initializeMermaid, 100);
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-md-color-scheme']
});
