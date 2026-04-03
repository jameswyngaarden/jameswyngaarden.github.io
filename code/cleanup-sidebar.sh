#!/bin/bash
# cleanup-sidebar.sh
# Removes sidebar name and title from all HTML pages (except index.html which has different structure)
# Run from the code/ directory: ./cleanup-sidebar.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_ROOT="$SCRIPT_DIR/.."

echo "Cleaning up sidebar across all pages..."
echo ""

# Function to remove sidebar name and title from a file
cleanup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        # Remove the profile image div
        sed -i '' 's/<div class="sidebar-profile-img"><\/div>//' "$file"
        
        # Remove the sidebar name div
        sed -i '' 's/<div class="sidebar-name">Jimmy Wyngaarden<\/div>//' "$file"
        
        # Remove the sidebar title div
        sed -i '' 's/<div class="sidebar-title">PhD Candidate<\/div>//' "$file"
        
        echo "✓ Cleaned: $(basename "$file")"
    else
        echo "⚠ Not found: $file"
    fi
}

# Main pages (in site root)
echo "=== Main Pages ==="
cleanup_file "$SITE_ROOT/current-work.html"
cleanup_file "$SITE_ROOT/publications.html"
cleanup_file "$SITE_ROOT/art.html"

# Publications subpages
echo ""
echo "=== Publication Pages ==="
for file in "$SITE_ROOT"/publications/*.html; do
    if [ -f "$file" ]; then
        cleanup_file "$file"
    fi
done

# Archive pages (if any have sidebars)
echo ""
echo "=== Archive Pages ==="
for file in "$SITE_ROOT"/publications/archive/*.html; do
    if [ -f "$file" ]; then
        cleanup_file "$file"
    fi
done

# Art subpages (if any)
echo ""
echo "=== Art Pages ==="
for file in "$SITE_ROOT"/art/*.html; do
    if [ -f "$file" ]; then
        cleanup_file "$file"
    fi
done

echo ""
echo "Done!"
echo ""
echo "Note: index.html was not modified (headshot moved to body there)."
echo "If you're on Linux, change 'sed -i ''' to 'sed -i' in this script."
