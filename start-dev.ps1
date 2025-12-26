# Start VibeThink Orchestrator Development Server
# Usage: .\start-dev.ps1

Write-Host "`n🚀 Starting VibeThink Orchestrator..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Check if already running
$existingProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*turbo*dev*" }
if ($existingProcess) {
    Write-Host "⚠️  Server already running (PID: $($existingProcess.Id))" -ForegroundColor Yellow
    Write-Host "   Use .\stop-dev.ps1 to stop it first" -ForegroundColor Yellow
    exit 1
}

# Verify npm install
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start server
Write-Host "`n▶️  Starting development server..." -ForegroundColor Green
Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Dashboard: http://localhost:3000/dashboard-bundui/projects-v2" -ForegroundColor Cyan
Write-Host "`n   Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

npm run dev
