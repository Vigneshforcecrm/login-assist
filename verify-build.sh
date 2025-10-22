#!/bin/bash

echo "🔍 Verifying Chrome Extension Build..."
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}✅ PASS${NC}"
FAIL="${RED}❌ FAIL${NC}"
WARN="${YELLOW}⚠️  WARN${NC}"

checks_passed=0
checks_failed=0

# Check dist folder exists
if [ -d "/app/dist" ]; then
    echo -e "$PASS dist/ folder exists"
    checks_passed=$((checks_passed + 1))
else
    echo -e "$FAIL dist/ folder missing"
    checks_failed=$((checks_failed + 1))
fi

# Check manifest.json
if [ -f "/app/dist/manifest.json" ]; then
    echo -e "$PASS manifest.json exists"
    checks_passed=$((checks_passed + 1))
else
    echo -e "$FAIL manifest.json missing"
    checks_failed=$((checks_failed + 1))
fi

# Check background service worker
if [ -f "/app/dist/background.js" ]; then
    echo -e "$PASS background.js exists"
    checks_passed=$((checks_passed + 1))
else
    echo -e "$FAIL background.js missing"
    checks_failed=$((checks_failed + 1))
fi

# Check content script
if [ -f "/app/dist/content.js" ]; then
    echo -e "$PASS content.js exists"
    checks_passed=$((checks_passed + 1))
else
    echo -e "$FAIL content.js missing"
    checks_failed=$((checks_failed + 1))
fi

# Check popup HTML
if [ -f "/app/dist/src/popup/index.html" ]; then
    echo -e "$PASS popup/index.html exists"
    checks_passed=$((checks_passed + 1))
else
    echo -e "$FAIL popup/index.html missing"
    checks_failed=$((checks_failed + 1))
fi

# Check options HTML
if [ -f "/app/dist/src/options/index.html" ]; then
    echo -e "$PASS options/index.html exists"
    checks_passed=$((checks_passed + 1))
else
    echo -e "$FAIL options/index.html missing"
    checks_failed=$((checks_failed + 1))
fi

# Check icons
if [ -d "/app/dist/icons" ]; then
    echo -e "$PASS icons/ folder exists"
    checks_passed=$((checks_passed + 1))
    
    if [ -f "/app/dist/icons/icon16.png" ] && [ -f "/app/dist/icons/icon48.png" ] && [ -f "/app/dist/icons/icon128.png" ]; then
        echo -e "$PASS All icon files exist"
        checks_passed=$((checks_passed + 1))
    else
        echo -e "$WARN Some icon files missing"
        checks_failed=$((checks_failed + 1))
    fi
else
    echo -e "$FAIL icons/ folder missing"
    checks_failed=$((checks_failed + 1))
fi

# Check assets folder
if [ -d "/app/dist/assets" ]; then
    echo -e "$PASS assets/ folder exists"
    checks_passed=$((checks_passed + 1))
    
    asset_count=$(ls -1 /app/dist/assets/*.js 2>/dev/null | wc -l)
    if [ "$asset_count" -gt 0 ]; then
        echo -e "$PASS Found $asset_count JavaScript bundles"
        checks_passed=$((checks_passed + 1))
    else
        echo -e "$FAIL No JavaScript bundles found"
        checks_failed=$((checks_failed + 1))
    fi
    
    css_count=$(ls -1 /app/dist/assets/*.css 2>/dev/null | wc -l)
    if [ "$css_count" -gt 0 ]; then
        echo -e "$PASS Found $css_count CSS bundles"
        checks_passed=$((checks_passed + 1))
    else
        echo -e "$WARN No CSS bundles found"
    fi
else
    echo -e "$FAIL assets/ folder missing"
    checks_failed=$((checks_failed + 1))
fi

# Check file sizes
echo ""
echo "📊 Build Statistics:"
echo "-------------------"
echo "Total files in dist:"
find /app/dist -type f | wc -l
echo ""
echo "Largest files:"
du -h /app/dist/assets/*.js 2>/dev/null | sort -rh | head -5
echo ""

# Summary
echo "========================================"
echo "Summary:"
echo -e "${GREEN}Passed: $checks_passed${NC}"
echo -e "${RED}Failed: $checks_failed${NC}"
echo ""

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Extension is ready to load in Chrome.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode'"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the /app/dist folder"
    echo ""
    echo "📖 See INSTALLATION_GUIDE.md for detailed setup instructions"
    exit 0
else
    echo -e "${RED}⚠️  Build verification failed. Please fix the errors above.${NC}"
    exit 1
fi
