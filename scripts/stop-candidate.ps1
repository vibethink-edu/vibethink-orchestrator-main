# Stop Candidate Dashboard
# Port: 3010

Write-Host "🛑 Stopping ViTo Dashboard Candidate..." -ForegroundColor Yellow

$port = 3010

$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }
    
    foreach ($pidToKill in $pids) {
        try {
            $proc = Get-Process -Id $pidToKill -ErrorAction Stop
            Write-Host "Stopping $($proc.ProcessName) (PID: $pidToKill)..." -ForegroundColor Gray
            Stop-Process -Id $pidToKill -Force
            Write-Host "✅ Stopped $pidToKill" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Connection $pidToKill is in TIME_WAIT" -ForegroundColor Gray
        }
    }
    
    Write-Host "✅ Port $port is now free" -ForegroundColor Green
}
else {
    Write-Host "✅ No process found using port $port" -ForegroundColor Green
}
