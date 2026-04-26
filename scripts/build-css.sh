#!/bin/bash
# CSS Bundle Builder
# Concatenates all CSS source files into bundle.css

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="$PROJECT_ROOT/docs/stylesheets"

echo "🔨 Building CSS bundle..."

# Concatenate in correct order
cat \
  "$CSS_DIR/theme.css" \
  "$CSS_DIR/extra.css" \
  "$CSS_DIR/home.css" \
  "$CSS_DIR/timeline.css" \
  > "$CSS_DIR/bundle.css"

# Count lines
LINES=$(wc -l < "$CSS_DIR/bundle.css")
SIZE=$(du -h "$CSS_DIR/bundle.css" | cut -f1)

echo "✅ CSS bundle rebuilt"
echo "   Lines: $LINES"
echo "   Size:  $SIZE"
echo "   File:  docs/stylesheets/bundle.css"
