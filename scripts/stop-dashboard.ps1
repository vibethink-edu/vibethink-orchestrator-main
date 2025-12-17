# Stop Dashboard Dev Server
# Kills all Node processes on port 3005

Write-Host "🛑 Stopping Pana Dashboard..." -ForegroundColor Cyan

$port = 3005

# Find process using port 3005
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($process) {
    $processId = $process.OwningProcess
    Write-Host "Found process $processId on port $port" -ForegroundColor Yellow
    
    # Kill the process
    Stop-Process -Id $processId -Force
    Write-Host "✅ Stopped process $processId" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No process found on port $port" -ForegroundColor Gray
}

# Also kill any orphaned node processes for this project
$projectPath = Split-Path -Parent $PSScriptRoot
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*$projectPath*"
}

if ($nodeProcesses) {
    Write-Host "Cleaning up orphaned node processes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Cleaned up orphaned processes" -ForegroundColor Green
}

Write-Host "✅ Dashboard stopped" -ForegroundColor Green
