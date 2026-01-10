# Start Admin Console Dev Server
# Port: 3002 (Admin Console standard port)

Write-Host "🔐 Starting ViTo Admin Console (Internal Staff Only)..." -ForegroundColor Cyan

$port = 3002

# Check if port is already in use
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
        Write-Host "Run .\scripts\stop-admin.ps1 first to stop existing server" -ForegroundColor Yellow
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
                    Write-Host "Run .\scripts\stop-admin.ps1 first to stop existing server" -ForegroundColor Yellow
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

# Validate admin directory exists
$projectRoot = Split-Path -Parent $PSScriptRoot
$adminPath = Join-Path $projectRoot "apps\admin"
if (-not (Test-Path $adminPath)) {
    Write-Host "❌ Admin directory not found: $adminPath" -ForegroundColor Red
    Write-Host "Please ensure the project structure is correct." -ForegroundColor Red
    exit 1
}

# Validate .env.local exists (critical for Admin Console)
$envPath = Join-Path $adminPath ".env.local"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env.local not found in apps/admin" -ForegroundColor Red
    Write-Host "Copy .env.local.example to .env.local and configure Supabase credentials" -ForegroundColor Red
    exit 1
}

# Start dev server
Write-Host "Starting Admin Console on port $port..." -ForegroundColor Green
Write-Host "⚠️  SECURITY: This is an internal tool. Never expose to public internet." -ForegroundColor Yellow
try {
    Push-Location $adminPath
    npx next dev --port $port
}
catch {
    Write-Host "❌ Error starting dev server: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}
finally {
    Pop-Location
}
