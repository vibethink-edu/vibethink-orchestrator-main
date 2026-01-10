# Start Dashboard Dev Server
# Port: 3005 (consistent)

Write-Host "Starting ViTo Dashboard (VibeThink Orchestrator)..." -ForegroundColor Cyan

$port = 3005
$projectRoot = Split-Path -Parent $PSScriptRoot
$dashboardPath = Join-Path $projectRoot "apps\dashboard"

# --- 1. HEALTH CHECKS ---

# Check dashboard directory structure
if (-not (Test-Path $dashboardPath)) {
    Write-Host "Dashboard directory not found: $dashboardPath" -ForegroundColor Red
    exit 1
}

# Check node_modules (Dependencies)
$nodeModulesPath = Join-Path $dashboardPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "Dependencies not found (node_modules missing)" -ForegroundColor Yellow
    Write-Host "Installing dependencies via pnpm..." -ForegroundColor Cyan
    try {
        Push-Location $projectRoot
        pnpm install --filter @vibethink/dashboard
        Pop-Location
        Write-Host "Dependencies installed!" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to install dependencies. Please run pnpm install manually." -ForegroundColor Red
        if ($PWD.Path -ne $projectRoot) { Pop-Location }
        exit 1
    }
}

# --- 2. PORT CHECK ---

$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    # Handle single/multiple connections
    $uniqueProcessIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }
    
    $validProcessIds = @()
    foreach ($pidToCheck in $uniqueProcessIds) {
        try {
            $proc = Get-Process -Id $pidToCheck -ErrorAction Stop
            $validProcessIds += $pidToCheck
        }
        catch { 
            # TIME_WAIT
        }
    }
    
    if ($validProcessIds.Count -gt 0) {
        Write-Host "Port $port is already in use. Attempting to stop existing process..." -ForegroundColor Yellow
        try {
            # Auto-heal: Try to stop the process using our own stop script
            $stopScript = Join-Path $PSScriptRoot "stop-dashboard.ps1"
            if (Test-Path $stopScript) {
                & $stopScript
                Start-Sleep -Seconds 2
            }
            else {
                Write-Host "Stop script not found. Please kill process manually." -ForegroundColor Red
                exit 1
            }
        }
        catch {
            Write-Host "Failed to stop existing process." -ForegroundColor Red
            exit 1
        }
    }
}

# --- 3. START SERVER ---

Write-Host "Starting Dashboard on port $port..." -ForegroundColor Green
Write-Host "URL: http://localhost:$port" -ForegroundColor Cyan

# Auto-open browser
$job = Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3005"
}

try {
    Push-Location $dashboardPath
    # Pass port explicitly to next via pnpm
    pnpm run dev -- -p $port
}
catch {
    Write-Host "Error starting dev server." -ForegroundColor Red
    Pop-Location
    exit 1
}
finally {
    Pop-Location
}
