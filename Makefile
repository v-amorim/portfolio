.PHONY: install serve build deploy

install:
	uv sync

serve:
	uv run mkdocs serve --livereload --watch-theme

build:
	uv run mkdocs build --strict

deploy:
	uv run mkdocs gh-deploy --force
