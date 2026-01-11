# Start Client Dashboard (Candidate Version) Dev Server
# Port: 3010 - Functional Dashboard with Real Data
# Status: SEEDED (Real Data in DB)

Write-Host "🚀 Starting ViTo Dashboard CANDIDATE (Functional @ 3010)..." -ForegroundColor Green

$port = 3010
$projectRoot = Split-Path -Parent $PSScriptRoot
$dashboardPath = Join-Path $projectRoot "apps\dashboard"

# --- 1. HEALTH CHECKS ---

# Check directory
if (-not (Test-Path $dashboardPath)) {
    Write-Host "❌ Dashboard directory not found: $dashboardPath" -ForegroundColor Red
    exit 1
}

# Check node_modules
$nodeModulesPath = Join-Path $dashboardPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "⚠️  node_modules missing in dashboard. Installing..." -ForegroundColor Yellow
    try {
        Push-Location $projectRoot
        pnpm install --filter @vibethink/dashboard
        Pop-Location
    }
    catch {
        Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
        exit 1
    }
}

# --- 2. PORT CHECK & AUTO-HEAL ---

$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($connections) {
    Write-Host "⚠️  Port $port is in use. Attempting to clear..." -ForegroundColor Yellow
    $stopScript = Join-Path $PSScriptRoot "stop-candidate.ps1"
    if (Test-Path $stopScript) {
        & $stopScript
        Start-Sleep -Seconds 2
    }
}

# --- 3. START SERVER ---

Write-Host "🚀 Launching Candidate Dashboard..." -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:$port" -ForegroundColor Cyan

# Auto-open browser
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3010"
}

try {
    Push-Location $dashboardPath
    # Using npx directly to avoid port collision with package.json scripts
    npx next dev --port $port
}
catch {
    Write-Host "❌ Error starting Candidate Dashboard." -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
