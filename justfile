# Windows has no `sh`, which just reaches for by default; use Git Bash instead.
set windows-shell := ["C:/Program Files/Git/bin/bash.exe", "-cu"]

default:
    @just --list

install:
    uv sync

serve:
    uv run mkdocs serve --livereload --watch-theme

build:
    uv run mkdocs build --strict

# Re-emit docs/assets/moonlight-tokens.json from the palette page and check every contrast pair.
tokens:
    uv run python scripts/extract_tokens.py

deploy:
    uv run mkdocs gh-deploy --force
