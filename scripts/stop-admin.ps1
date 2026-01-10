# Stop Admin Console Dev Server
# Kills all processes using port 3002

Write-Host "🛑 Stopping ViTo Admin Console..." -ForegroundColor Cyan

$port = 3002

# Get all connections on port 3002
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if (-not $connections) {
    Write-Host "✅ No process found using port $port" -ForegroundColor Green
    exit 0
}

# Get unique process IDs
$uniqueProcessIds = $connections | 
Select-Object -ExpandProperty OwningProcess -Unique | 
Where-Object { $_ -gt 0 }  # Filter out system processes

if ($uniqueProcessIds.Count -eq 0) {
    Write-Host "✅ No active processes found (only TIME_WAIT connections)" -ForegroundColor Green
    exit 0
}

# Kill each process
$killedCount = 0
foreach ($processId in $uniqueProcessIds) {
    try {
        $proc = Get-Process -Id $processId -ErrorAction Stop
        Write-Host "Stopping $($proc.ProcessName) (PID: $processId)..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction Stop
        $killedCount++
        Write-Host "✅ Stopped $($proc.ProcessName)" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not stop process $processId (may have already exited)" -ForegroundColor Yellow
    }
}

if ($killedCount -gt 0) {
    Write-Host "✅ Stopped $killedCount process(es)" -ForegroundColor Green
    
    # Wait for port to be released
    Write-Host "Waiting for port $port to be released..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    
    # Verify port is free
    $stillInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($stillInUse) {
        Write-Host "⚠️  Port $port may still have TIME_WAIT connections (will clear in ~60s)" -ForegroundColor Yellow
    }
    else {
        Write-Host "✅ Port $port is now free" -ForegroundColor Green
    }
}
else {
    Write-Host "⚠️  No processes were stopped" -ForegroundColor Yellow
}
