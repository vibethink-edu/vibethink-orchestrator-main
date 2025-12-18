# Start Dashboard Dev Server
# Port: 3005 (consistent)

Write-Host "🚀 Starting Pana Dashboard..." -ForegroundColor Cyan

$port = 3005

# Check if port 3005 is already in use
# Get-NetTCPConnection can return multiple connections or array
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    # Handle both single connection and array
    $uniqueProcessIds = $connections | 
        Select-Object -ExpandProperty OwningProcess -Unique | 
        Where-Object { $_ -gt 0 }  # Filter out system processes (Idle = 0)
    
    if ($uniqueProcessIds) {
        # Get process info for better error message
        $processInfo = @()
        foreach ($processId in $uniqueProcessIds) {
            try {
                $proc = Get-Process -Id $processId -ErrorAction Stop
                $processInfo += "$($proc.ProcessName) (PID: $processId)"
            } catch {
                $processInfo += "Unknown (PID: $processId)"
            }
        }
        
        Write-Host "⚠️  Port $port is already in use by:" -ForegroundColor Yellow
        $processInfo | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
        Write-Host "Run .\scripts\stop-dashboard.ps1 first to stop existing server" -ForegroundColor Yellow
        exit 1
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
    npm run dev -- -p $port
} catch {
    Write-Host "❌ Error starting dev server: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}
