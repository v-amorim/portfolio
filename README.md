# Portfolio - Vinicius C. Amorim

Personal portfolio site built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

## Local Development with uv

### Prerequisites

- [uv](https://docs.astral.sh/uv/) - Fast Python package installer and resolver

### Setup

```bash
# Install dependencies
uv sync

# Serve locally (http://127.0.0.1:8000)
uv run mkdocs serve

# Build static site
uv run mkdocs build
```

## GitHub Pages Deployment

The site automatically deploys to GitHub Pages when pushing to `main` or `master` branch.

### Setup GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment", set Source to "GitHub Actions"
4. Push changes to `main` branch to trigger deployment

## Project Structure

- `docs/` - All content pages (markdown files)
  - `assets/` - Static assets (fonts, images)
  - `blog/` - Blog posts
  - `javascripts/` - Custom JavaScript modules
  - `stylesheets/` - Custom CSS files
- `templates/` - Custom Jinja2 templates
- `snippets/` - Shared markdown snippets
- `mkdocs.yml` - Site configuration
- `pyproject.toml` - Python dependencies (managed by uv)

## Technology Stack

- **MkDocs Material** - Static site generator with Material theme
- **uv** - Fast Python package management
- **GitHub Actions** - CI/CD for automated deployment
- **GitHub Pages** - Hosting platform

## Credits

Template heavily inspired by [Anelia Stoyanova's Portfolio](https://github.com/anelllya/portfolio).

## License

© Vinicius C Amorim
