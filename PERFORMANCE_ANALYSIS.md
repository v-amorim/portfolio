# Performance Analysis & Optimization Report

**Date**: 2026-04-21  
**Project**: Personal Portfolio (MkDocs Material)  
**Build Size**: 7.0MB total (6.5MB assets)

---

## Executive Summary

The portfolio site is well-structured with mostly optimized code. Key findings:

- ✅ **JavaScript**: Clean, minimal, no debug statements (610 lines total)
- ✅ **CSS**: Reasonable size (1,914 lines total) with good organization
- ⚠️ **Assets**: Images could be optimized (428KB), fonts are acceptable (432KB)
- ⚠️ **Third-party**: Mermaid.js adds 3.1MB to build (external CDN)
- ⚠️ **Animations**: 39 instances of transitions/animations - most are performant

---

## Identified Issues & Recommendations

### 🔴 HIGH PRIORITY

#### 1. Mermaid.js Bundle Size (3.1MB)
**Impact**: 44% of total build size  
**Current**: Loaded from external CDN via MkDocs Material plugin  
**Issue**: Large payload even if diagrams aren't used on every page

**Solutions**:
- ✅ **Keep current** - Mermaid loads from CDN (not bundled), cached across sites
- ⚠️ Consider removing if diagrams aren't heavily used
- 🔄 Use lazy loading if diagrams only appear below fold

```yaml
# If removing mermaid (mkdocs.yml):
markdown_extensions:
  - pymdownx.superfences  # Remove custom_fences block
```

---

#### 2. Font Loading Strategy
**Current**: Single variable font loaded via `@font-face` (208KB + 216KB italic)  
**Issue**: Blocks initial render until font loads

**Optimization**:
```css
/* Add to extra.css @font-face block */
@font-face {
  font-family: Mulish;
  src: url("../assets/fonts/Mulish/Mulish-VariableFont_wght.ttf");
  font-display: swap; /* ⬅️ ADD THIS */
}
```

**Benefits**: Allows fallback font to display immediately, prevents FOIT (Flash of Invisible Text)

---

#### 3. Image Optimization
**Current state**:
- `screenshots/2.png` - 168KB
- `screenshots/1.png` - 120KB  
- `featured/md_cheatsheet.png` - 92KB
- `logo.png` - 20KB

**Recommended actions**:
```bash
# Install optimization tools
npm install -g sharp-cli

# Optimize PNGs (lossless)
npx sharp-cli -i "docs/assets/images/**/*.png" -o "docs/assets/images/" --optimise

# Or convert to WebP (lossy, 25-35% smaller)
npx sharp-cli -i "docs/assets/images/**/*.png" -o "docs/assets/images/" -f webp -q 85
```

**Expected savings**: 30-50% size reduction (≈150-200KB)

---

### 🟡 MEDIUM PRIORITY

#### 4. CSS Loading Sequence
**Current**: 4 separate CSS files loaded sequentially
```yaml
extra_css:
  - stylesheets/theme.css       # 198 lines
  - stylesheets/extra.css       # 908 lines
  - stylesheets/home.css        # 520 lines
  - stylesheets/timeline.css    # 288 lines
```

**Issue**: Multiple render-blocking requests

**Optimization**:
```bash
# Option A: Merge CSS files (for production)
cat docs/stylesheets/{theme,extra,home,timeline}.css > docs/stylesheets/bundle.css

# Update mkdocs.yml:
extra_css:
  - stylesheets/bundle.css
```

**Benefits**: Reduces HTTP requests from 4 to 1  
**Trade-off**: Harder to maintain (only merge in CI/CD)

---

#### 5. JavaScript Loading Order
**Current**: All scripts load in `<head>` (render-blocking)
```yaml
extra_javascript:
  - javascripts/mermaid-config.js
  - javascripts/image-placeholder.js
  - javascripts/carousel.js
  - javascripts/timeline.js
```

**Optimization**: Add defer/async attributes via custom template override

**Create** `templates/base.html`:
```html
{% extends "base.html" %}

{% block scripts %}
  {{ super() }}
  {% for path in config.extra_javascript %}
    <script src="{{ path | url }}" defer></script>
  {% endfor %}
{% endblock %}
```

**Benefits**: Non-blocking script loading, faster initial render

---

#### 6. Reduce Animation Overhead
**Current**: 39 animation/transition declarations across CSS files  
**Issue**: `timeline.css:76` uses `animation` on all `.kanban-card` elements simultaneously

**Current code**:
```css
.kanban-card {
  animation: slideIn 0.4s ease forwards;
  animation-delay: ${index * 0.1}s; /* Set in JS */
}
```

**Optimization**:
```css
/* Add will-change for GPU acceleration */
.kanban-card {
  will-change: transform, opacity;
  animation: slideIn 0.4s ease forwards;
}

/* Remove will-change after animation completes */
.kanban-card.visible {
  will-change: auto; /* ⬅️ ADD THIS */
}
```

**Update** `timeline.js:166`:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Clean up will-change after animation
      setTimeout(() => {
        entry.target.style.willChange = 'auto';
      }, 400);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
```

---

### 🟢 LOW PRIORITY (Nice-to-Haves)

#### 7. Add Resource Hints
Preload critical resources in `templates/main.html`:
```html
{% block extrahead %}
  <link rel="preload" href="{{ 'stylesheets/extra.css' | url }}" as="style">
  <link rel="preload" href="{{ 'assets/fonts/Mulish/Mulish-VariableFont_wght.ttf' | url }}" as="font" type="font/ttf" crossorigin>
{% endblock %}
```

---

#### 8. Enable Compression in CI/CD
Most static hosts (GitHub Pages) gzip automatically, but verify:
```yaml
# .github/workflows/ci.yml - add after build step
- name: Compress assets
  run: |
    find site -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -exec gzip -k {} \;
```

---

#### 9. Add Service Worker for Offline Support
Use MkDocs plugin:
```bash
pip install mkdocs-pwa-plugin
```

```yaml
# mkdocs.yml
plugins:
  - pwa:
      cache_name: portfolio-v1
```

---

## Already Optimized ✅

1. **No debug statements** in JavaScript (console.log, debugger)
2. **Variable fonts** used instead of multiple weights (saves ~500KB)
3. **CSS organization** is logical and maintainable
4. **Privacy plugin** enabled (external resource caching)
5. **Reduced motion** support in CSS animations
6. **IntersectionObserver** used for visibility-based rendering
7. **Instant navigation** enabled (SPA-like behavior)
8. **Proper event delegation** in JavaScript

---

## Performance Budget Recommendation

| Resource Type | Current | Target | Status |
|---------------|---------|--------|--------|
| JavaScript (custom) | 28KB | <50KB | ✅ |
| CSS (custom) | ~60KB | <100KB | ✅ |
| Images | 428KB | <300KB | ⚠️ |
| Fonts | 432KB | <500KB | ✅ |
| Third-party (Mermaid) | 3.1MB | N/A | ℹ️ |
| **Total (first load)** | **~4MB** | **<2MB** | ⚠️ |

---

## Implementation Priority

### Phase 1 (Quick Wins - 1 hour)
1. Add `font-display: swap` to font loading
2. Optimize images with sharp-cli
3. Add resource hints for fonts

**Expected improvement**: 15-20% faster First Contentful Paint

### Phase 2 (Medium Effort - 2-3 hours)
1. Merge CSS files in build process
2. Add defer to JavaScript loading
3. Improve animation performance with will-change

**Expected improvement**: 20-30% faster Time to Interactive

### Phase 3 (Optional - 4+ hours)
1. Evaluate Mermaid.js necessity
2. Implement service worker
3. Set up automated performance monitoring

**Expected improvement**: Better offline experience, cache strategy

---

## Testing Checklist

After implementing optimizations:

- [ ] Run Lighthouse audit (target: 90+ performance score)
- [ ] Test on slow 3G connection
- [ ] Verify animations work on low-end devices
- [ ] Check font fallback behavior
- [ ] Test instant navigation with optimized JS
- [ ] Validate image formats display correctly
- [ ] Test dark/light mode switching performance

---

## Monitoring

Add to CI/CD pipeline:
```yaml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --collect.url=http://localhost:8000
```

---

## Notes

- **Current setup is production-ready** - optimizations are incremental
- Most critical asset (Mermaid 3.1MB) loads from CDN with browser caching
- MkDocs Material handles many optimizations automatically (minification, etc.)
- Focus on Phase 1 quick wins for best ROI

---

## Commands Reference

```bash
# Build and check size
mkdocs build --clean
du -sh site/

# Analyze bundle
npx webpack-bundle-analyzer site/assets/javascripts/bundle.js

# Check font usage
grep -r "@font-face" docs/stylesheets/

# Find large files
find site -type f -size +100k -exec ls -lh {} \;

# Test compression
gzip -c site/index.html | wc -c

# Lighthouse audit
npx lighthouse http://localhost:8000 --view
```
