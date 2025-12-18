# ============================================================================
# STOP BUNDUI REFERENCE
# ============================================================================
# Stops the Bundui Premium reference server running on port 3006
# ============================================================================

$PORT = 3006

Write-Host "🛑 Stopping Bundui Reference..." -ForegroundColor Cyan

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

Write-Host "✅ Bundui Reference stopped" -ForegroundColor Green
