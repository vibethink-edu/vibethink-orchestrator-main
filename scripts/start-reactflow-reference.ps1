# ============================================================================
# START REACT FLOW REFERENCE
# ============================================================================
# Starts React Flow examples using global port assignment
# Reference: https://github.com/xyflow/xyflow
# Port Assignment: See _vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md
# ============================================================================

$ErrorActionPreference = "Stop"

# Import Port Manager Module (Global Standard)
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"

if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force -ErrorAction SilentlyContinue
    $PORT = Get-ReferencePort -ReferenceName "reactflow"
    $REF_INFO = Get-ReferenceInfo -ReferenceName "reactflow"
    
    if ($PORT) {
        Write-Host "📋 Using global port assignment: $PORT" -ForegroundColor Green
    } else {
        Write-Warning "⚠️  Could not load port assignment. Using fallback port 3052"
        $PORT = 3052
        $REF_INFO = $null
    }
} else {
    Write-Warning "⚠️  PortManager module not found at: $PortManagerPath"
    Write-Warning "   Using fallback port 3052 (global standard)"
    $PORT = 3052
    $REF_INFO = $null
}

$XYFLOW_PATH = "C:\IA Marcelo Labs\xyflow\xyflow"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  REACT FLOW REFERENCE - Starting..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Verificar que el directorio existe
if (-not (Test-Path $XYFLOW_PATH)) {
    Write-Host "ERROR: Directorio no encontrado: $XYFLOW_PATH" -ForegroundColor Red
    Write-Host "Ejecuta: git clone https://github.com/xyflow/xyflow.git `"$XYFLOW_PATH`"" -ForegroundColor Yellow
    exit 1
}

# Verificar si el puerto está en uso
$portInUse = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Puerto $PORT ya está en uso. Deteniendo proceso..." -ForegroundColor Yellow
    $processId = $portInUse.OwningProcess | Select-Object -First 1
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Iniciando React Flow Examples en puerto $PORT..." -ForegroundColor Green
Write-Host "URL: http://localhost:$PORT" -ForegroundColor Cyan
Write-Host ""

# Navegar al directorio de ejemplos de React e iniciar
Set-Location "$XYFLOW_PATH\examples\react"

# Iniciar con pnpm dev pero en puerto personalizado
$env:PORT = $PORT
pnpm dev --port $PORT

Write-Host ""
Write-Host "React Flow Reference iniciado!" -ForegroundColor Green
Write-Host "Abre: http://localhost:$PORT" -ForegroundColor Cyan





