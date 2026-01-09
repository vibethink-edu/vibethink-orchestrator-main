# Start Dashboard Dev Server
# Port: 3005 (consistent)

Write-Host "🚀 Starting ViTo Dashboard (VibeThink Orchestrator)..." -ForegroundColor Cyan

$port = 3005

# Check if port 3005 is already in use
# Get-NetTCPConnection can return multiple connections or array
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    # Handle both single connection and array
    $uniqueProcessIds = $connections | 
    Select-Object -ExpandProperty OwningProcess -Unique | 
    Where-Object { $_ -gt 0 }  # Filter out system processes (Idle = 0)
    
    # Filter out processes that no longer exist (TIME_WAIT connections)
    $validProcessIds = @()
    foreach ($processId in $uniqueProcessIds) {
        try {
            $proc = Get-Process -Id $processId -ErrorAction Stop
            $validProcessIds += $processId
        }
        catch {
            # Process doesn't exist, connection is likely in TIME_WAIT
            Write-Host "⚠️  Port $port has connection from non-existent process $processId (TIME_WAIT state)" -ForegroundColor Yellow
        }
    }
    
    if ($validProcessIds.Count -gt 0) {
        # Get process info for better error message
        $processInfo = @()
        foreach ($processId in $validProcessIds) {
            try {
                $proc = Get-Process -Id $processId -ErrorAction Stop
                $processInfo += "$($proc.ProcessName) (PID: $processId)"
            }
            catch {
                $processInfo += "Unknown (PID: $processId)"
            }
        }
        
        Write-Host "⚠️  Port $port is already in use by:" -ForegroundColor Yellow
        $processInfo | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
        Write-Host "Run .\scripts\stop-dashboard.ps1 first to stop existing server" -ForegroundColor Yellow
        exit 1
    }
    else {
        # Only TIME_WAIT connections, wait a bit and retry
        Write-Host "⚠️  Port $port has TIME_WAIT connections, waiting 3 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        
        # Re-check after wait
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            $uniqueProcessIds = $connections | 
            Select-Object -ExpandProperty OwningProcess -Unique | 
            Where-Object { $_ -gt 0 }
            
            $stillValid = $false
            foreach ($processId in $uniqueProcessIds) {
                try {
                    $proc = Get-Process -Id $processId -ErrorAction Stop
                    $stillValid = $true
                    Write-Host "⚠️  Port $port still in use by $($proc.ProcessName) (PID: $processId)" -ForegroundColor Yellow
                    Write-Host "Run .\scripts\stop-dashboard.ps1 first to stop existing server" -ForegroundColor Yellow
                    exit 1
                }
                catch {
                    # Process doesn't exist, continue
                }
            }
            
            if (-not $stillValid) {
                Write-Host "✅ Port $port cleared, proceeding..." -ForegroundColor Green
            }
        }
    }
}

# Validate dashboard directory exists
$projectRoot = Split-Path -Parent $PSScriptRoot
$dashboardPath = Join-Path $projectRoot "apps\dashboard"
if (-not (Test-Path $dashboardPath)) {
    Write-Host "❌ Dashboard directory not found: $dashboardPath" -ForegroundColor Red
    Write-Host "Please ensure the project structure is correct." -ForegroundColor Red
    exit 1
}

# Start dev server
Write-Host "Starting Next.js dev server on port $port..." -ForegroundColor Green
try {
    Push-Location $dashboardPath
    pnpm run dev -- -p $port
}
catch {
    Write-Host "❌ Error starting dev server: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}
finally {
    Pop-Location
}
