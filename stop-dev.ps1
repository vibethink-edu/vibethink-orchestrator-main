# Stop VibeThink Orchestrator Development Server
# Usage: .\stop-dev.ps1

Write-Host "`n🛑 Stopping VibeThink Orchestrator..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Find and kill turbo/dev processes
$processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*turbo*dev*" -or 
    $_.CommandLine -like "*next*dev*" 
}

if ($processes) {
    Write-Host "   Found $($processes.Count) process(es) to stop..." -ForegroundColor Yellow
    
    foreach ($proc in $processes) {
        Write-Host "   Stopping PID $($proc.Id)..." -ForegroundColor Gray
        Stop-Process -Id $proc.Id -Force
    }
    
    Write-Host "`n✅ Server stopped successfully" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No running server found" -ForegroundColor Yellow
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray
