# Stop Dashboard-Admin (VibeThink Internal)
# Port: 3006

Write-Host "`n🛑 Stopping Dashboard-Admin (Port 3006)..." -ForegroundColor Yellow

$port = 3006

$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if (-not $connections) {
    Write-Host "✅ No process running on port $port" -ForegroundColor Green
    exit 0
}

$uniqueProcessIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }

$validProcessIds = @()
foreach ($pidToCheck in $uniqueProcessIds) {
    try {
        $proc = Get-Process -Id $pidToCheck -ErrorAction Stop
        $validProcessIds += $pidToCheck
        Write-Host "Found process: $($proc.ProcessName) (PID: $pidToCheck)" -ForegroundColor Cyan
    }
    catch { }
}

if ($validProcessIds.Count -eq 0) {
    Write-Host "✅ No active process found on port $port" -ForegroundColor Green
    exit 0
}

foreach ($processId in $validProcessIds) {
    try {
        Stop-Process -Id $processId -Force
        Write-Host "✅ Stopped process (PID: $processId)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to stop process (PID: $processId)" -ForegroundColor Red
    }
}

Start-Sleep -Seconds 1
Write-Host "✅ Dashboard-Admin stopped successfully`n" -ForegroundColor Green
