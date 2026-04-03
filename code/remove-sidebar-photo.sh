#!/bin/bash
# Run this from your website root directory
# Usage: ./remove-sidebar-photo.sh

# Pages to modify (add any additional pages here)
PAGES=("../current-work.html" "../publications.html" "../art.html")

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        # Remove the sidebar-profile-img div line
        sed -i '' 's/<div class="sidebar-profile-img"><\/div>//' "$page"
        echo "✓ Removed profile image from $page"
    else
        echo "⚠ $page not found, skipping"
    fi
done

echo ""
echo "Done! You may also want to remove the .sidebar-profile-img CSS block"
echo "from each file's <style> section (optional - unused CSS won't hurt anything)"
