@echo off
echo =====================================
echo  UNIVERSAL AI SESSION START
echo =====================================
echo.
echo [1/4] Checking repository status...
git status --short
echo.
echo [2/4] Recent commits context:
git log --oneline -n 3
echo.
echo [3/4] Checking for session context...
if exist "SESSION_SUMMARY.md" (
    echo ✅ Found SESSION_SUMMARY.md - reading previous session context...
    echo.
    type "SESSION_SUMMARY.md" | more
) else (
    echo ⚪ No SESSION_SUMMARY.md found - starting fresh session
)
echo.
echo [4/4] Quick validation if available...
if exist "package.json" (
    npm run validate:quick 2>nul || echo ⚠️ validate:quick not available
) else (
    echo ⚠️ No package.json found
)
echo.
echo =====================================
echo  SESSION START COMPLETE
echo =====================================
echo 🎯 Ready to work! What should we focus on today?