# Stylesheets

## Structure

The site uses separate CSS files loaded in order:

- **`theme.css`** - Theme color variables (light/dark mode, Moonlight colors)
- **`extra.css`** - Global styles, components, Material theme overrides
- **`home.css`** - Home page specific styles (hero, cards, bento boxes)
- **`timeline.css`** - Career timeline/kanban board component

## Load Order (Important!)

Files are loaded in `mkdocs.yml` in this specific order:

```yaml
extra_css:
  - stylesheets/theme.css    # CSS variables first
  - stylesheets/extra.css    # Global styles
  - stylesheets/home.css     # Page-specific
  - stylesheets/timeline.css # Components
```

**Why order matters**: CSS variables in `theme.css` must be defined before other files reference them with `var(--primary)`, etc.

## Adding New Styles

### Global components (buttons, cards, utilities)
→ Edit `extra.css`

### Home page layout
→ Edit `home.css`

### New page-specific styles
→ Create new file (e.g., `work.css`) and add to `mkdocs.yml`

### Theme colors
→ Edit `theme.css` variables
