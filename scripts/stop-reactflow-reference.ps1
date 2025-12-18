# ============================================================================
# STOP REACT FLOW REFERENCE
# ============================================================================
# Detiene el servidor de React Flow Reference en puerto 3008
# ============================================================================

$ErrorActionPreference = "SilentlyContinue"

$PORT = 3008

Write-Host "============================================" -ForegroundColor Yellow
Write-Host "  REACT FLOW REFERENCE - Stopping..." -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow

# Buscar proceso en el puerto
$connection = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess | Select-Object -First 1
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Deteniendo proceso: $($process.Name) (PID: $processId)" -ForegroundColor Yellow
        Stop-Process -Id $processId -Force
        Write-Host "Proceso detenido exitosamente." -ForegroundColor Green
    }
} else {
    Write-Host "No hay proceso ejecutándose en el puerto $PORT" -ForegroundColor Gray
}

Write-Host ""
Write-Host "React Flow Reference detenido." -ForegroundColor Green






