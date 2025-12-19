# ============================================================================
# TEST: Bundui Reference vs Bundui Monorepo
# ============================================================================
# Este script inicia ambos servidores y prepara pruebas comparativas
# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "🧪 PREPARANDO PRUEBA COMPARATIVA" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

# Colores
$SUCCESS = "Green"
$WARNING = "Yellow"
$ERROR = "Red"
$INFO = "Cyan"

# ============================================================================
# PASO 1: Verificar que no hay servidores corriendo
# ============================================================================

Write-Host "📋 PASO 1: Verificando servidores existentes...`n" -ForegroundColor $INFO

$ports = @(3000, 3005)
$serversRunning = $false

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "   ⚠️  Puerto $port está en uso" -ForegroundColor $WARNING
        $serversRunning = $true
    } else {
        Write-Host "   ✅ Puerto $port disponible" -ForegroundColor $SUCCESS
    }
}

if ($serversRunning) {
    Write-Host "`n⚠️  Hay servidores corriendo. ¿Quieres detenerlos y continuar? (S/N): " -ForegroundColor $WARNING -NoNewline
    $response = Read-Host
    
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host "`n🛑 Deteniendo servidores existentes...`n" -ForegroundColor $WARNING
        
        # Detener bundui reference
        & "$PSScriptRoot\stop-bundui-reference.ps1"
        
        # Detener dashboard
        & "$PSScriptRoot\stop-dashboard.ps1"
        
        Write-Host "`n✅ Servidores detenidos`n" -ForegroundColor $SUCCESS
        Start-Sleep -Seconds 2
    } else {
        Write-Host "`n❌ Prueba cancelada por el usuario`n" -ForegroundColor $ERROR
        exit 1
    }
}

# ============================================================================
# PASO 2: Ejecutar comparación de código
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "📋 PASO 2: Comparando código (sidebars y directorios)...`n" -ForegroundColor $INFO

node "$PSScriptRoot\compare-bundui-reference-vs-monorepo.js"

$compareResult = $LASTEXITCODE

if ($compareResult -eq 0) {
    Write-Host "`n✅ Comparación de código: MATCH PERFECTO`n" -ForegroundColor $SUCCESS
} else {
    Write-Host "`n⚠️  Comparación de código: DIFERENCIAS ENCONTRADAS`n" -ForegroundColor $WARNING
    Write-Host "¿Quieres continuar con la prueba de servidores de todas formas? (S/N): " -NoNewline
    $response = Read-Host
    
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "`n❌ Prueba cancelada. Revisa las diferencias antes de continuar.`n" -ForegroundColor $ERROR
        exit 1
    }
}

# ============================================================================
# PASO 3: Iniciar Bundui Reference (puerto 3050 - global)
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "📋 PASO 3: Iniciando Bundui Reference (puerto 3050)...`n" -ForegroundColor $INFO

# Get global port (if PortManager available)
$BUNDUI_PORT = 3050  # Global standard
$DevKitPath = "C:\IA Marcelo Labs\_vibethink-dev-kit"
$PortManagerPath = Join-Path $DevKitPath "packages\tools\powershell-modules\PortManager\PortManager.psm1"
if (Test-Path $PortManagerPath) {
    Import-Module $PortManagerPath -Force -ErrorAction SilentlyContinue
    $PortFromManager = Get-ReferencePort -ReferenceName "bundui"
    if ($PortFromManager) {
        $BUNDUI_PORT = $PortFromManager
    }
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\IA Marcelo Labs\vibethink-orchestrator-main'; .\scripts\start-bundui-reference.ps1" -WindowStyle Normal

Write-Host "⏳ Esperando a que el servidor inicie..." -ForegroundColor $WARNING
Start-Sleep -Seconds 10

# Verificar que el servidor está corriendo
$referenceRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    $connection = Get-NetTCPConnection -LocalPort $BUNDUI_PORT -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "✅ Bundui Reference iniciado en http://localhost:$BUNDUI_PORT`n" -ForegroundColor $SUCCESS
        $referenceRunning = $true
        break
    }
    Start-Sleep -Seconds 2
}

if (-not $referenceRunning) {
    Write-Host "❌ Error: No se pudo iniciar Bundui Reference`n" -ForegroundColor $ERROR
    exit 1
}

# ============================================================================
# PASO 4: Iniciar Bundui Monorepo (puerto 3005)
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "📋 PASO 4: Iniciando Bundui Monorepo (puerto 3005)...`n" -ForegroundColor $INFO

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\IA Marcelo Labs\vibethink-orchestrator-main'; .\scripts\start-dashboard.ps1" -WindowStyle Normal

Write-Host "⏳ Esperando a que el servidor inicie..." -ForegroundColor $WARNING
Start-Sleep -Seconds 15

# Verificar que el servidor está corriendo
$monorepoRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    $connection = Get-NetTCPConnection -LocalPort 3005 -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "✅ Bundui Monorepo iniciado en http://localhost:3005`n" -ForegroundColor $SUCCESS
        $monorepoRunning = $true
        break
    }
    Start-Sleep -Seconds 2
}

if (-not $monorepoRunning) {
    Write-Host "❌ Error: No se pudo iniciar Bundui Monorepo`n" -ForegroundColor $ERROR
    Write-Host "⚠️  Deteniendo Bundui Reference...`n" -ForegroundColor $WARNING
    & "$PSScriptRoot\stop-bundui-reference.ps1"
    exit 1
}

# ============================================================================
# PASO 5: Resumen y pruebas manuales
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "✅ SERVIDORES LISTOS PARA PRUEBA" -ForegroundColor $SUCCESS
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "📊 URLS DE PRUEBA:`n" -ForegroundColor $INFO

Write-Host "   🔵 Bundui Reference (Original - Puerto Global: $BUNDUI_PORT):" -ForegroundColor $INFO
Write-Host "      http://localhost:$BUNDUI_PORT/dashboard/default" -ForegroundColor White
Write-Host "      http://localhost:$BUNDUI_PORT/dashboard/crm" -ForegroundColor White
Write-Host "      http://localhost:$BUNDUI_PORT/dashboard/sales" -ForegroundColor White
Write-Host "      http://localhost:$BUNDUI_PORT/dashboard/ecommerce`n" -ForegroundColor White

Write-Host "   🟢 Bundui Monorepo (Nuestro):" -ForegroundColor $INFO
Write-Host "      http://localhost:3005/dashboard-bundui" -ForegroundColor White
Write-Host "      http://localhost:3005/dashboard-bundui/default" -ForegroundColor White
Write-Host "      http://localhost:3005/dashboard-bundui/crm" -ForegroundColor White
Write-Host "      http://localhost:3005/dashboard-bundui/sales" -ForegroundColor White
Write-Host "      http://localhost:3005/dashboard-bundui/ecommerce`n" -ForegroundColor White

Write-Host "   🟣 VibeThink (Mejoras):" -ForegroundColor $INFO
Write-Host "      http://localhost:3005/dashboard-vibethink" -ForegroundColor White
Write-Host "      http://localhost:3005/dashboard-vibethink/crm" -ForegroundColor White
Write-Host "      http://localhost:3005/dashboard-vibethink/sales`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "📝 CHECKLIST DE PRUEBAS MANUALES:`n" -ForegroundColor $WARNING

Write-Host "   [ ] 1. Comparar sidebars visualmente" -ForegroundColor White
Write-Host "       - Abrir ambos en navegador lado a lado" -ForegroundColor DarkGray
Write-Host "       - Verificar que los menús son idénticos`n" -ForegroundColor DarkGray

Write-Host "   [ ] 2. Probar navegación en Reference (localhost:3000)" -ForegroundColor White
Write-Host "       - Hacer clic en cada item del sidebar" -ForegroundColor DarkGray
Write-Host "       - Verificar que todas las rutas funcionan`n" -ForegroundColor DarkGray

Write-Host "   [ ] 3. Probar navegación en Monorepo (localhost:3005)" -ForegroundColor White
Write-Host "       - Hacer clic en cada item del sidebar bundui" -ForegroundColor DarkGray
Write-Host "       - Verificar que todas las rutas funcionan`n" -ForegroundColor DarkGray

Write-Host "   [ ] 4. Comparar dashboards específicos" -ForegroundColor White
Write-Host "       - Abrir mismo dashboard en ambos servidores" -ForegroundColor DarkGray
Write-Host "       - Verificar que se ven idénticos`n" -ForegroundColor DarkGray

Write-Host "   [ ] 5. Probar VibeThink" -ForegroundColor White
Write-Host "       - Navegar en http://localhost:3005/dashboard-vibethink" -ForegroundColor DarkGray
Write-Host "       - Verificar que tiene sus propios dashboards`n" -ForegroundColor DarkGray

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "💡 PARA DETENER LOS SERVIDORES:`n" -ForegroundColor $INFO
Write-Host "   .\scripts\stop-bundui-reference.ps1" -ForegroundColor White
Write-Host "   .\scripts\stop-dashboard.ps1`n" -ForegroundColor White

Write-Host "============================================================================`n" -ForegroundColor Cyan

# Mantener ventana abierta
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor $WARNING
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

