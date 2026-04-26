/**
 * Global image placeholder fallback
 * Automatically handles broken/missing images by showing logo placeholder
 */
(function() {
  'use strict';

  const LOGO_PATH = '/img/logo.png';
  const PLACEHOLDER_CLASS = 'auto-placeholder-container';

  function isEmptyOrInvalidSrc(src) {
    return !src || src === '' || src === 'about:blank' || src.endsWith('()');
  }

  function wrapImageWithPlaceholder(img) {
    // Skip if already wrapped or explicitly excluded
    if (img.parentElement?.classList.contains(PLACEHOLDER_CLASS) ||
        img.parentElement?.classList.contains('image-container-with-placeholder') ||
        img.classList.contains('no-placeholder') ||
        img.classList.contains('placeholder-logo')) {
      return false;
    }

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = `${PLACEHOLDER_CLASS} image-container-with-placeholder`;

    // Preserve any inline styles from the original image (like width/alignment)
    if (img.style.cssText) {
      wrapper.style.cssText = img.style.cssText;
    }
    if (img.className) {
      wrapper.className += ' ' + img.className.split(' ')
        .filter(c => c.includes('align-') || c.includes('width'))
        .join(' ');
    }

    // Create placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    const logo = document.createElement('img');
    logo.src = LOGO_PATH;
    logo.alt = 'Logo';
    logo.className = 'placeholder-logo no-placeholder';
    placeholder.appendChild(logo);

    // Wrap image
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(placeholder);

    // Add fallback class
    img.classList.add('img-with-fallback');

    return true;
  }

  function handleImageError(event) {
    const img = event.target;

    // Wrap if not already wrapped
    wrapImageWithPlaceholder(img);

    // Mark as error to show placeholder
    img.classList.add('img-with-fallback', 'img-error');
  }

  function checkImageStatus(img) {
    const src = img.getAttribute('src');

    // Check if source is empty or invalid
    if (isEmptyOrInvalidSrc(src)) {
      wrapImageWithPlaceholder(img);
      img.classList.add('img-with-fallback', 'img-error');
      return;
    }

    // Check if image has finished attempting to load and failed
    if (img.complete) {
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        wrapImageWithPlaceholder(img);
        img.classList.add('img-with-fallback', 'img-error');
      }
    }
  }

  function initImagePlaceholders() {
    // Find all content images (exclude nav, header, etc.)
    const contentImages = document.querySelectorAll(
      '.md-content img:not(.placeholder-logo):not(.no-placeholder):not(.img-with-fallback), ' +
      'article img:not(.placeholder-logo):not(.no-placeholder):not(.img-with-fallback)'
    );

    contentImages.forEach(img => {
      // Check status immediately (handles empty src)
      checkImageStatus(img);

      // Add error handler for future failures
      if (!img.classList.contains('img-error')) {
        img.addEventListener('error', handleImageError, { once: true });
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImagePlaceholders);
  } else {
    initImagePlaceholders();
  }

  // Handle instant navigation (MkDocs Material)
  if (typeof document$ !== 'undefined') {
    document$.subscribe(function() {
      initImagePlaceholders();
    });
  }

  // Re-initialize on navigation (fallback for mutation detection)
  document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // Small delay to ensure DOM is fully rendered
          setTimeout(initImagePlaceholders, 50);
        }
      });
    });

    const content = document.querySelector('.md-content');
    if (content) {
      observer.observe(content, { childList: true, subtree: true });
    }
  });
})();
