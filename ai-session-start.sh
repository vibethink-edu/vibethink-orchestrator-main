#!/bin/bash
echo "====================================="
echo "  UNIVERSAL AI SESSION START"
echo "====================================="
echo
echo "[1/4] Checking repository status..."
git status --short
echo
echo "[2/4] Recent commits context:"
git log --oneline -n 3
echo
echo "[3/4] Checking for session context..."
if [ -f "SESSION_SUMMARY.md" ]; then
    echo "✅ Found SESSION_SUMMARY.md - reading previous session context..."
    echo
    cat "SESSION_SUMMARY.md"
else
    echo "⚪ No SESSION_SUMMARY.md found - starting fresh session"
fi
echo
echo "[4/4] Quick validation if available..."
if [ -f "package.json" ]; then
    npm run validate:quick 2>/dev/null || echo "⚠️ validate:quick not available"
else
    echo "⚠️ No package.json found"
fi
echo
echo "====================================="
echo "  SESSION START COMPLETE"
echo "====================================="
echo "🎯 Ready to work! What should we focus on today?"