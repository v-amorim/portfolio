# Stylesheets

## Production

The site uses **`bundle.css`** which is a concatenation of all CSS files.

## Development

To modify styles, edit the source files:

- **`theme.css`** - Theme color variables (light/dark mode)
- **`extra.css`** - Global styles, color variables, utilities
- **`home.css`** - Home page specific styles
- **`timeline.css`** - Career timeline/kanban board styles

## Rebuilding Bundle

After editing any source CSS file, regenerate the bundle:

```bash
# From project root
cat docs/stylesheets/theme.css docs/stylesheets/extra.css docs/stylesheets/home.css docs/stylesheets/timeline.css > docs/stylesheets/bundle.css
```

Or use the convenience script:

```bash
# Create scripts/build-css.sh
#!/bin/bash
cat docs/stylesheets/{theme,extra,home,timeline}.css > docs/stylesheets/bundle.css
echo "✅ CSS bundle rebuilt: $(wc -l < docs/stylesheets/bundle.css) lines"
```

## File Order (Important!)

The CSS files must be concatenated in this specific order:

1. `theme.css` - CSS variables must be defined first
2. `extra.css` - Global styles that depend on theme variables
3. `home.css` - Page-specific styles
4. `timeline.css` - Component-specific styles

Changing the order may break variable references.

## Performance Impact

- **Before**: 4 separate CSS files (4 HTTP requests)
- **After**: 1 bundled CSS file (1 HTTP request)
- **Savings**: 3 fewer HTTP requests, faster initial render

## CI/CD Integration (Future)

Consider automating bundle generation in GitHub Actions:

```yaml
# .github/workflows/ci.yml
- name: Build CSS bundle
  run: |
    cat docs/stylesheets/{theme,extra,home,timeline}.css > docs/stylesheets/bundle.css
```
