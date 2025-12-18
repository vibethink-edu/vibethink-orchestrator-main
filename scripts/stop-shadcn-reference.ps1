# ============================================================================
# STOP SHADCN UI REFERENCE
# ============================================================================
# Stops the official Shadcn UI reference server running on port 3007
# ============================================================================

$PORT = 3007

Write-Host "🛑 Stopping Shadcn UI Reference..." -ForegroundColor Cyan

# Find and kill process on port
$connection = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($connection) {
    $processId = $connection.OwningProcess | Select-Object -First 1
    if ($processId) {
        Write-Host "Found process $processId on port $PORT" -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Stopped process $processId" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No process found on port $PORT" -ForegroundColor Gray
}

Write-Host "✅ Shadcn UI Reference stopped" -ForegroundColor Green
